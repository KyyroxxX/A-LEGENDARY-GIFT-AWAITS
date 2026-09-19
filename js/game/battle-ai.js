/**
 * Enemy AI — uses active skills, transforms, weaknesses, and roles.
 */
const BattleAI = {
    choose(enemy, allies, foes, state) {
        const livingFoes = foes.filter(u => u.hp > 0);
        const livingAllies = allies.filter(u => u.hp > 0);
        if (!livingFoes.length) return null;

        if (enemy.ai === 'dummy' || enemy.id === 'dummy' || state?.encounter?.training) {
            return null;
        }

        let skills = this.usableSkills(enemy, state);
        // Sin maná no hay spam: con la reserva bajo el 25% la IA economiza
        // (daño barato o utilidad) hasta que la regen la recupera.
        const spRatio = (enemy.sp || 0) / Math.max(1, enemy.maxSp || 1);
        if (spRatio < 0.25) {
            const cheap = skills.filter(s => (s.cost || 0) <= 26 || !s.power);
            if (cheap.some(s => s.power > 0)) skills = cheap;
        }
        const basic = skills.find(s => s.power > 0) || { id: 'basic', name: 'Attack', power: 28, type: 'strike', cost: 0 };
        const hpRatio = enemy.hp / enemy.maxHp;
        const lowest = livingFoes.reduce((a, b) => (a.hp / a.maxHp <= b.hp / b.maxHp ? a : b));
        const healer = livingFoes.find(f => /heal|support|medic|buffer/i.test(f.role || '')) ||
            livingFoes.slice().sort((a, b) => (b.maxSp || 0) - (a.maxSp || 0))[0];
        const strongest = livingFoes.reduce((a, b) => ((a.atk * (a.buffs.atk || 1)) >= (b.atk * (b.buffs.atk || 1)) ? a : b));
        const pick = (skill, target) => ({ skill: skill || basic, target: target || lowest });

        // Sin CP no hay técnicas: atrincherarse y recuperar la mitad del CP
        // en vez de pegar básicos para siempre (con enfriamiento anti-bucle).
        // (spRatio ya viene calculado arriba.)
        if (spRatio < 0.35 && (enemy.skillCooldowns?.['second_wind'] || 0) <= 0 && Math.random() < 0.6) {
            return pick({
                id: 'second_wind', name: 'Second Wind', cry: 'Not yet!',
                cost: 0, power: 0, type: 'support',
                buff: { def: 1.25 }, turns: 2, cooldown: 2, restoreSpPct: 0.5,
                desc: 'Se atrinchera · recupera la mitad del CP.'
            }, enemy);
        }

        const mercy = skills.find(s => s.id === 'guaranteed');
        if (enemy.id === 'boss5050' && mercy && (state.turnCount || 1) % 4 === 0) {
            return pick(mercy, enemy);
        }

        // Sin transforms manuales: los enemigos solo transforman al fasear al morir.
        // (pickTransform queda anulado abajo; la rama advanceTransform sí sigue
        // valiendo una vez faseado.)

        // Advance multi-stage transforms (Lee drunken fist, etc.)
        const advance = skills.find(s => s.advanceTransform);
        if (advance && enemy.transformed && Math.random() < 0.55) {
            return pick(advance, enemy);
        }

        const weakHit = this.bestWeaknessPlay(skills, livingFoes);
        if (weakHit && Math.random() < 0.98) return pick(weakHit.skill, weakHit.target);

        if (hpRatio < 0.5) {
            const heal = skills.find(s => s.heal && !s.power);
            if (heal && Math.random() < 0.92) return pick(heal, enemy);
            const defBuff = skills.find(s => s.buff?.def || s.partyBuff?.def);
            if (defBuff && Math.random() < 0.8) return pick(defBuff, enemy);
        }

        // Cripple the carry early and often — debuffs open every serious fight.
        const debuff = skills.find(s => (s.debuff || s.targetEnemy) && (!s.power || s.power < 45));
        if (debuff && strongest.hp / strongest.maxHp > 0.35 && Math.random() < 0.85) {
            return pick(debuff, strongest);
        }

        switch (enemy.ai) {
            case 'aggressive':
                return pick(this.bestDamage(skills, livingFoes) || basic, lowest);

            case 'assassin':
                // Executes at half HP — keep everyone topped or lose someone.
                if (lowest.hp / lowest.maxHp < 0.5) return pick(this.highestPower(skills) || basic, lowest);
                return pick(skills.find(s => s.critBonus) || this.bestDamage(skills, livingFoes) || basic, healer || lowest);

            case 'tank':
                if (livingFoes.length >= 2) {
                    const aoe = skills.find(s => s.aoe && s.power > 0);
                    if (aoe && Math.random() < 0.68) return pick(aoe, livingFoes[0]);
                }
                if (hpRatio < 0.65) {
                    const guard = skills.find(s => s.buff?.def || s.cover);
                    if (guard && Math.random() < 0.62) return pick(guard, enemy);
                }
                return pick(this.bestDamage(skills, livingFoes) || basic, strongest);

            case 'support': {
                const needy = livingAllies.filter(a => a !== enemy).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
                if (needy && needy.hp / needy.maxHp < 0.65) {
                    const heal = skills.find(s => s.heal);
                    if (heal) return pick(heal, needy);
                }
                const buff = skills.find(s => s.allyBuff || s.buff || s.partyBuff);
                if (buff && Math.random() < 0.88) return pick(buff, needy || enemy);
                return pick(skills.find(s => s.power > 0) || basic, lowest);
            }

            case 'tactical': {
                // Your healer dies first. Protect them or do without healing.
                if (healer && healer.hp / healer.maxHp > 0.2 && Math.random() < 0.85) {
                    return pick(this.bestDamage(skills, [healer]) || basic, healer);
                }
                if (hpRatio < 0.6) {
                    const guard = skills.find(s => s.buff?.def);
                    if (guard && Math.random() < 0.55) return pick(guard, enemy);
                }
                const aoe = skills.find(s => s.aoe && s.power > 0);
                if (aoe && livingFoes.length > 1 && Math.random() < 0.62) return pick(aoe, livingFoes[0]);
                return pick(this.bestDamage(skills, livingFoes) || basic, lowest);
            }

            case 'adaptive': {
                const turn = state.turnCount || 0;
                if (turn % 3 === 0) {
                    const aoe = skills.find(s => s.aoe && s.power > 0);
                    if (aoe) return pick(aoe, livingFoes[0]);
                }
                if (Math.random() < 0.28) return pick(this.highestPower(skills) || basic, strongest);
                return pick(this.bestDamage(skills, livingFoes) || basic, lowest);
            }

            case 'bosslet':
            case 'final_boss': {
                const phase = hpRatio <= 0.33 ? 3 : hpRatio <= 0.66 ? 2 : 1;
                if (phase >= 2 && !enemy._usedHeal && hpRatio < 0.55) {
                    const heal = skills.find(s => s.id === 'heal_phase' || (s.heal && !s.power));
                    if (heal) { enemy._usedHeal = true; return pick(heal, enemy); }
                }
                if (phase === 3) {
                    const finisher = this.highestPower(skills) || basic;
                    return pick(finisher, Math.random() < 0.68 ? strongest : healer || lowest);
                }
                const aoeChance = state.encounter?.aiAoEChance ?? 0.65;
                if (livingFoes.length > 1 && Math.random() < aoeChance) {
                    const aoe = skills.find(s => s.aoe && s.power > 0);
                    if (aoe) return pick(aoe, livingFoes[0]);
                }
                const skip = skills.find(s => s.skipEnemy);
                if (skip && phase >= 2 && Math.random() < 0.4) return pick(skip, enemy);
        const healerFocus = state.encounter?.aiHealerFocus
            ?? (state.partyHasSupport ? 0.85 : 0.72);
                if (healer && Math.random() < healerFocus) return pick(this.bestDamage(skills, [healer]) || basic, healer);
                return pick(this.bestDamage(skills, livingFoes) || basic, lowest);
            }

            default:
                return pick(this.bestDamage(skills, livingFoes) || basic, livingFoes[Math.floor(Math.random() * livingFoes.length)]);
        }
    },

    usableSkills(enemy, state) {
        const list = (typeof BattleData !== 'undefined' && BattleData.activeSkills)
            ? BattleData.activeSkills(enemy)
            : (enemy.skills || []);
        return list.filter(s => {
            try {
                return BattleEngine.canUseSkill(enemy, s, state);
            } catch (_) {
                return !!(s && (s.power > 0 || s.heal || s.buff || s.transform || s.debuff));
            }
        });
    },

    pickTransform(enemy, skills, hpRatio, state) {
        // Anulado: los enemigos solo transforman al fasear al morir (triggerSecondPhase).
        return null;
    },

    bestWeaknessPlay(skills, foes) {
        let best = null;
        let score = 0;
        for (const s of skills) {
            if (!s.power) continue;
            for (const f of foes) {
                if (!(f.weak || []).includes(s.type)) continue;
                if ((f.null || []).includes(s.type)) continue;
                const sc = s.power * (s.aoe ? 2.1 : 2.5) * (s.hits || 1);
                if (sc > score) { score = sc; best = { skill: s, target: f }; }
            }
        }
        return best;
    },

    highestPower(skills) {
        return [...skills].filter(s => s.power > 0).sort((a, b) => (b.power * (b.hits || 1)) - (a.power * (a.hits || 1)))[0];
    },

    bestDamage(skills, foes) {
        let best = null;
        let score = -1;
        for (const s of skills) {
            if (!s.power) continue;
            for (const f of foes) {
                let sc = s.power * (s.hits || 1) * (s.aoe ? 1.35 : 1);
                if ((f.weak || []).includes(s.type)) sc *= 2.3;
                if ((f.resist || []).includes(s.type)) sc *= 0.45;
                if ((f.null || []).includes(s.type)) sc *= 0.02;
                // Focus fire: execute the weakened instead of spreading damage.
                if (f.hp / f.maxHp < 0.4) sc *= 1.45;
                if (sc > score) { score = sc; best = s; }
            }
        }
        return best;
    }
};

if (typeof window !== 'undefined') window.BattleAI = BattleAI;
