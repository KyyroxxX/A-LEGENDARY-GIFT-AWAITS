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

        const skills = this.usableSkills(enemy, state);
        const basic = skills.find(s => s.power > 0) || { id: 'basic', name: 'Attack', power: 28, type: 'strike', cost: 0 };
        const hpRatio = enemy.hp / enemy.maxHp;
        const lowest = livingFoes.reduce((a, b) => (a.hp / a.maxHp <= b.hp / b.maxHp ? a : b));
        const healer = livingFoes.find(f => /heal|support|medic|buffer/i.test(f.role || '')) ||
            livingFoes.slice().sort((a, b) => (b.maxSp || 0) - (a.maxSp || 0))[0];
        const strongest = livingFoes.reduce((a, b) => ((a.atk * (a.buffs.atk || 1)) >= (b.atk * (b.buffs.atk || 1)) ? a : b));
        const pick = (skill, target) => ({ skill: skill || basic, target: target || lowest });

        const mercy = skills.find(s => s.id === 'guaranteed');
        if (enemy.id === 'boss5050' && mercy && (state.turnCount || 1) % 4 === 0) {
            return pick(mercy, enemy);
        }

        // Transform as soon as it's a real threat / phase break
        const transformPlay = this.pickTransform(enemy, skills, hpRatio, state);
        if (transformPlay) return pick(transformPlay, enemy);

        // Advance multi-stage transforms (Lee drunken fist, etc.)
        const advance = skills.find(s => s.advanceTransform);
        if (advance && enemy.transformed && Math.random() < 0.55) {
            return pick(advance, enemy);
        }

        const weakHit = this.bestWeaknessPlay(skills, livingFoes);
        if (weakHit && Math.random() < 0.98) return pick(weakHit.skill, weakHit.target);

        if (hpRatio < 0.4) {
            const heal = skills.find(s => s.heal && !s.power);
            if (heal && Math.random() < 0.88) return pick(heal, enemy);
            const defBuff = skills.find(s => s.buff?.def || s.partyBuff?.def);
            if (defBuff && Math.random() < 0.72) return pick(defBuff, enemy);
        }

        const debuff = skills.find(s => (s.debuff || s.targetEnemy) && (!s.power || s.power < 45));
        if (debuff && strongest.hp / strongest.maxHp > 0.45 && Math.random() < 0.65) {
            return pick(debuff, strongest);
        }

        switch (enemy.ai) {
            case 'aggressive':
                return pick(this.bestDamage(skills, livingFoes) || basic, lowest);

            case 'assassin':
                if (lowest.hp / lowest.maxHp < 0.42) return pick(this.highestPower(skills) || basic, lowest);
                return pick(skills.find(s => s.critBonus) || this.bestDamage(skills, livingFoes) || basic, healer || lowest);

            case 'tank':
                if (livingFoes.length >= 2) {
                    const aoe = skills.find(s => s.aoe && s.power > 0);
                    if (aoe && Math.random() < 0.55) return pick(aoe, livingFoes[0]);
                }
                if (hpRatio < 0.55) {
                    const guard = skills.find(s => s.buff?.def || s.cover);
                    if (guard && Math.random() < 0.4) return pick(guard, enemy);
                }
                return pick(this.bestDamage(skills, livingFoes) || basic, strongest);

            case 'support': {
                const needy = livingAllies.filter(a => a !== enemy).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
                if (needy && needy.hp / needy.maxHp < 0.55) {
                    const heal = skills.find(s => s.heal);
                    if (heal) return pick(heal, needy);
                }
                const buff = skills.find(s => s.allyBuff || s.buff || s.partyBuff);
                if (buff && Math.random() < 0.68) return pick(buff, needy || enemy);
                return pick(skills.find(s => s.power > 0) || basic, lowest);
            }

            case 'tactical': {
                if (healer && healer.hp / healer.maxHp > 0.25 && Math.random() < 0.7) {
                    return pick(this.bestDamage(skills, [healer]) || basic, healer);
                }
                if (hpRatio < 0.55) {
                    const guard = skills.find(s => s.buff?.def);
                    if (guard && Math.random() < 0.32) return pick(guard, enemy);
                }
                const aoe = skills.find(s => s.aoe && s.power > 0);
                if (aoe && livingFoes.length > 1 && Math.random() < 0.5) return pick(aoe, livingFoes[0]);
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
                    return pick(finisher, Math.random() < 0.55 ? strongest : healer || lowest);
                }
                const aoeChance = state.encounter?.aiAoEChance ?? 0.58;
                if (livingFoes.length > 1 && Math.random() < aoeChance) {
                    const aoe = skills.find(s => s.aoe && s.power > 0);
                    if (aoe) return pick(aoe, livingFoes[0]);
                }
                const skip = skills.find(s => s.skipEnemy);
                if (skip && phase >= 2 && Math.random() < 0.28) return pick(skip, enemy);
        const healerFocus = state.encounter?.aiHealerFocus
            ?? (state.partyHasSupport ? 0.78 : 0.64);
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
        if (enemy.transformed || enemy.transformUsed) return null;
        if (typeof BattleEngine !== 'undefined' && !BattleEngine.transformReady(state, enemy)) return null;
        const xf = skills.find(s => s.transform) || (enemy.skills || []).find(s => s && s.transform);
        if (!xf) return null;
        const diff = state?.encounter?.difficulty || 1;
        // Harder fights transform sooner after the shared unlock gate
        const threshold = diff >= 6 ? 0.92 : diff >= 4 ? 0.86 : 0.78;
        if (hpRatio <= threshold) return xf;
        // Low HP emergency awaken (still respects unlock round via usableSkills)
        if (hpRatio < 0.45) return xf;
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
                if (f.hp / f.maxHp < 0.35) sc *= 1.15;
                if (sc > score) { score = sc; best = s; }
            }
        }
        return best;
    }
};

if (typeof window !== 'undefined') window.BattleAI = BattleAI;
