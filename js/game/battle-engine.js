/**
 * Turn-based battle engine (Persona-inspired).
 */
const BattleEngine = {
    /** First round where transform skills become usable (rounds 1–2 locked). */
    TRANSFORM_UNLOCK_ROUND: 3,

    transformReady(state, unit = null) {
        if (unit?.id === 'sasori' && unit.armorBroken) return true;
        return (state?.turnCount || 0) >= this.TRANSFORM_UNLOCK_ROUND;
    },

    createState(runKey, partyIds) {
        const encounter = BattleData.encounters[runKey];
        const party = partyIds.map(id => {
            const base = (typeof GachaRoster !== 'undefined' && GachaRoster.getTemplate(id))
                || BattleData.party.find(p => p.id === id);
            if (!base) throw new Error('Unknown fighter: ' + id);
            return this.unitFromTemplate(base, 'ally');
        });
        const enemies = encounter.enemies.map(e => {
            const enriched = (typeof FighterKits !== 'undefined')
                ? FighterKits.enrichEnemy(e, {
                    // Softer kits early — handwritten encounter power + kits was double-buffing AoE.
                    powerMul: Math.min(0.7, 0.4 + ((encounter.difficulty || 1) * 0.03))
                })
                : e;
            return this.unitFromTemplate(enriched, 'enemy');
        });
        const diff = encounter.difficulty || 1;

        const partyHasSupport = party.some((unit) => {
            const skills = [...(unit.skills || []), ...(unit.transformedSkills || [])];
            return ['Support', 'Healer'].includes(unit.role)
                || !!unit.tankHealer
                || skills.some((skill) => skill.heal || skill.aoeHeal || skill.cover || skill.partyBuff || skill.allyBuff);
        });
        // Support composition is deliberately part of the difficulty curve.
        const partyHpMul = (partyHasSupport ? 2.45 : 2.18) * (encounter.partyHpScale ?? 1);
        const healScale = (partyHasSupport ? 1.7 : 1.25) * (encounter.partyHealScale ?? 1);
        party.forEach(u => {
            u.maxHp = Math.round(u.maxHp * partyHpMul);
            u.hp = u.maxHp;
            // CP pool must support several skills + transform upkeep in longer fights.
            u.maxSp = Math.round((u.maxSp || 80) * 1.4 * (encounter.partySpScale ?? 1));
            u.sp = u.maxSp;
            u.healBonus = (u.healBonus || 0) + 0.2;
            // Role baselines — tanks actually tank; healers stay alive to heal.
            if (u.tankHealer) {
                // Best tank-healer hybrid (Giorno): both DR and heal amp, clear of any other unit.
                u.maxHp = Math.round(u.maxHp * 1.18);
                u.hp = u.maxHp;
                u.def = Math.round(u.def * 1.2);
                u.damageTakenMul = Math.min(u.damageTakenMul || 1, 0.68);
                u.healBonus = (u.healBonus || 0) + 0.38;
            } else if (u.role === 'Tank') {
                u.maxHp = Math.round(u.maxHp * 1.12);
                u.hp = u.maxHp;
                u.def = Math.round(u.def * 1.18);
                u.damageTakenMul = Math.min(u.damageTakenMul || 1, 0.82);
            } else if (u.role === 'Healer' || u.role === 'Support') {
                u.maxHp = Math.round(u.maxHp * 1.08);
                u.hp = u.maxHp;
                u.healBonus = (u.healBonus || 0) + 0.12;
            }
        });
        enemies.forEach(u => {
            if (encounter.training || u.ai === 'dummy') {
                // Keep sandbox HP huge; never scale ATK
                u.maxHp = Math.max(u.maxHp, 9999);
                u.hp = u.maxHp;
                u.atk = 0;
                u.ai = 'dummy';
                return;
            }
            const standardTuning = encounter.isBoss
                ? { hp: 3.05, hpStep: 0.4, scale: 1.14, atk: 1.1, def: 1.08, skill: 1.1, heal: 1.1 }
                : { hp: 3.15, hpStep: 0.42, scale: 1.18, atk: 1.13, def: 1.1, skill: 1.12, heal: 1.12 };
            const globalHard = encounter.enemyGlobalScale ?? standardTuning.scale;
            const hpM = (standardTuning.hp + (diff - 1) * standardTuning.hpStep) * globalHard * (encounter.enemyHpScale ?? 1);
            const atkM = (1.12 + (diff - 1) * 0.11)
                * (partyHasSupport ? 1 : 1.12)
                * (encounter.enemyGlobalAtkScale ?? standardTuning.atk)
                * (encounter.enemyAtkScale ?? 1);
            const defM = (1.18 + (diff - 1) * 0.1)
                * (encounter.enemyGlobalDefScale ?? standardTuning.def)
                * (encounter.enemyDefScale ?? 1);
            u.maxHp = Math.round(u.maxHp * hpM);
            u.hp = u.maxHp;
            u.atk = Math.round(u.atk * atkM);
            u.def = Math.round(u.def * defM);
            u.maxSp = Math.max(u.maxSp || 0, 140);
            u.sp = u.maxSp;
            u.ai = u.ai || (u.transform ? 'bosslet' : 'tactical');
            const scaleSkill = (sk) => {
                if (sk.heal) sk.heal = Math.round(
                    sk.heal * (1.5 + diff * 0.12) * (encounter.enemyGlobalHealScale ?? standardTuning.heal) * (encounter.enemyHealScale ?? 1)
                );
                if (sk.power) sk.power = Math.round(
                    sk.power * (1.02 + (diff - 1) * 0.06) * (encounter.enemyGlobalSkillScale ?? standardTuning.skill) * (encounter.enemySkillScale ?? 1)
                );
            };
            (u.skills || []).forEach(scaleSkill);
            (u.transformedSkills || []).forEach(scaleSkill);
        });

        this.applyMetaBonuses(party, partyIds);
        party.forEach(u => {
            u.baseAtk = u.atk;
            u.baseDef = u.def;
            u.baseAgi = u.agi;
        });
        enemies.forEach(u => {
            u.baseAtk = u.atk;
            u.baseDef = u.def;
            u.baseAgi = u.agi;
        });

        return {
            runKey,
            encounter,
            difficulty: diff,
            party,
            enemies,
            healScale,
            turnQueue: [],
            turnIndex: 0,
            turnCount: 0,
            minimumRound: encounter.minimumRounds || 1,
            oneMore: false,
            downedEnemies: new Set(),
            skipEnemyTurns: 0,
            log: [
                `Dificultad ${diff} · Combate táctico`,
                partyHasSupport
                    ? '★ Formación preparada: el soporte amplifica la supervivencia y las ventanas de debilidad.'
                    : '⚠ Formación sin soporte: el enemigo presiona más y no tendrás margen para jugar a desgaste.'
            ],
            finished: false,
            victory: false,
            partyHasSupport,
            weaknessChain: 0,
            active: true
        };
    },

    applyMetaBonuses(party, partyIds) {
        const passives = (typeof BondData !== 'undefined')
            ? BondData.passivesForParty(partyIds)
            : [];
        const chikiAll = passives.find(p => p.id === 'chiki' && p.allBonus);

        party.forEach(u => {
            // Dupes (constellation) + equipment replace train stats
            if (typeof CharProgress !== 'undefined') {
                CharProgress.applyToUnit(u);
            }

            const p = passives.find(x => x.id === u.id);
            if (p) {
                if (p.atkBonus) u.atk = Math.round(u.atk * (1 + p.atkBonus));
                if (p.defBonus) u.def = Math.round(u.def * (1 + p.defBonus));
                if (p.lukBonus) u.luk = Math.round((u.luk || 10) * (1 + p.lukBonus));
                if (p.critBonus) u.critBonus = (u.critBonus || 0) + p.critBonus;
                if (p.healBonus) u.healBonus = p.healBonus;
                u.bondPassive = p.label;
            }
            if (chikiAll) {
                const m = 1 + chikiAll.allBonus;
                u.atk = Math.round(u.atk * m);
                u.def = Math.round(u.def * m);
                u.agi = Math.round(u.agi * m);
            }
            if (typeof EquipmentSystem !== 'undefined') {
                const gear = EquipmentSystem.equippedFor(u.id);
                if (gear) {
                    u.equipmentId = gear.id;
                    u.equipmentName = gear.name;
                    u.equipmentDesc = gear.desc;
                }
            }
        });
    },

    unitFromTemplate(t, side) {
        return {
            ...JSON.parse(JSON.stringify(t)),
            transformed: false,
            transformTurns: 0,
            transformUsed: false,
            transformUpkeep: 0,
            transformPersistent: false,
            transformStage: 0,
            transformStages: 0,
            transformProfile: null,
            armorShell: t?.id === 'sasori' ? true : !!t?.armorShell,
            armorBreakName: t?.id === 'sasori' ? (t.armorBreakName || 'Sasori · Kazekage') : t?.armorBreakName,
            armorBroken: false,
            revealed: false,
            usedOnce: {},
            skillCooldowns: {},
            stunTurns: 0,
            _skip: false,
            side,
            hp: t.maxHp,
            sp: t.maxSp || 0,
            maxSp: t.maxSp || 0,
            isDead: false,
            isTargetable: true,
            canAct: true,
            down: false,
            downImmunity: false,
            guard: false,
            cover: false,
            coverHits: 0,
            charged: false,
            reflectDamageTurns: 0,
            reflectDamageMul: 0,
            itemRevive: 0,
            _usedItem: false,
            damageTakenMul: t.damageTakenMul || 1,
            damageBonus: t.damageBonus || 0,
            critDamageBonus: t.critDamageBonus || 0,
            accuracyBonus: t.accuracyBonus || 0,
            healBonus: t.healBonus || 0,
            tankHealer: !!t.tankHealer,
            hpRegenPct: t.hpRegenPct || 0,
            baseAtk: t.atk,
            baseDef: t.def,
            baseAgi: t.agi,
            buffs: {},
            dots: [],
            statuses: []
        };
    },

    markDead(state, unit, reason = null) {
        if (!unit || unit.isDead) return;
        if (unit.side === 'ally' && unit.itemRevive > 0 && !unit._itemRevived) {
            unit._itemRevived = true;
            unit.hp = Math.max(1, Math.floor(unit.maxHp * unit.itemRevive));
            unit.itemRevive = 0;
            unit.isDead = false;
            unit.isTargetable = true;
            unit.canAct = true;
            unit._skip = false;
            state?.log?.push(`★ ${unit.name} se aferra a la vida gracias a su Gikon.`);
            return;
        }
        unit.hp = 0;
        unit.isDead = true;
        unit.isTargetable = false;
        unit.canAct = false;
        unit.down = false;
        unit.guard = false;
        unit.cover = false;
        unit.coverHits = 0;
        unit._skip = true;
        if (unit.side === 'enemy') state?.downedEnemies?.delete(unit.id);
        if (reason) state?.log?.push(reason);
    },

    markAlive(unit) {
        if (!unit) return;
        unit.isDead = false;
        unit.isTargetable = true;
        unit.canAct = true;
        unit._skip = false;
    },

    buildTurnOrder(state) {
        const units = [...state.party, ...state.enemies].filter(u => u.hp > 0);
        units.sort((a, b) => {
            const agiA = a.agi * (a.buffs.agi || 1);
            const agiB = b.agi * (b.buffs.agi || 1);
            return agiB - agiA || Math.random() - 0.5;
        });
        state.turnQueue = units.map(u => ({ id: u.id, side: u.side }));
        state.turnIndex = 0;
        state.turnCount++;
    },

    autoTransformEnemies(state) {
        if ((state.turnCount || 0) < 4 || state.finished || state._enemyTransformRound === state.turnCount) return;
        state._enemyTransformRound = state.turnCount;
        state.enemies.filter(enemy => enemy.hp > 0 && !enemy.transformed).forEach(enemy => {
            const skills = (typeof BattleData !== 'undefined' && BattleData.activeSkills)
                ? BattleData.activeSkills(enemy)
                : (enemy.skills || []);
            let transform = skills.find(skill => skill && skill.transform)
                || (enemy.skills || []).find(skill => skill && skill.transform);
            if (!transform && enemy.transform) {
                transform = {
                    id: `${enemy.id}_round4_transform`,
                    name: enemy.transformName || 'Transformación',
                    cry: enemy.transformName || 'TRANSFORM!',
                    cost: 0,
                    power: 0,
                    type: 'support',
                    transform: true,
                    transformPersistent: true,
                    transformUpkeep: 0,
                    transformAtk: 1.45,
                    transformAgi: 1.2
                };
                enemy.skills = [...(enemy.skills || []), transform];
            }
            if (!transform) return;

            if (enemy.id === 'sasori' && enemy.armorShell && !enemy.armorBroken) {
                this.breakArmorShell(state, enemy, { logs: [] });
            }
            if (enemy.transformUsed) {
                enemy.transformUsed = false;
                enemy.usedOnce = {};
            }
            enemy.sp = Math.max(enemy.sp || 0, transform.cost || 0);
            const result = this.execute(state, enemy, { type: 'skill', skillId: transform.id, targetId: enemy.id });
            if (result.ok && enemy.transformed) {
                state.log.push(`★ RONDA 4 · ${enemy.name} entra en ${enemy.transformName || 'su forma transformada'}.`);
            }
        });
    },

    currentActor(state) {
        while (state.turnIndex < state.turnQueue.length) {
            const slot = state.turnQueue[state.turnIndex];
            const unit = this.findUnit(state, slot.id, slot.side);
            if (unit && unit.hp > 0 && !unit._skip) return unit;
            state.turnIndex++;
        }
        return null;
    },

    findUnit(state, id, side) {
        const list = side === 'ally' ? state.party : state.enemies;
        return list.find(u => u.id === id);
    },

    living(list) {
        return list.filter(u => u.hp > 0 && !u.isDead);
    },

    tacticalGateActive(state) {
        // Death must be deterministic. Tactical hold is opt-in only.
        if (!state?.encounter?.allowTacticalHold) return false;
        const gate = state.minimumRound || 1;
        return gate > 1 && state.turnCount < gate;
    },

    holdLastEnemy(state, target, incomingDamage) {
        if (!this.tacticalGateActive(state) || incomingDamage < target.hp) return false;
        const livingEnemies = this.living(state.enemies);
        return livingEnemies.length === 1 && livingEnemies[0] === target;
    },

    checkEnd(state) {
        if (!this.living(state.enemies).length) {
            state.finished = true;
            state.victory = true;
            state.active = false;
            return true;
        }
        if (!this.living(state.party).length) {
            state.finished = true;
            state.victory = false;
            state.active = false;
            return true;
        }
        return false;
    },

    startRound(state) {
        [...state.party, ...state.enemies].forEach(u => {
            u.guard = false;
            // Stun persists across the round until stunTurns expire (not free skip every turn).
            if ((u.stunTurns || 0) > 0) {
                u._skip = true;
                u.stunTurns -= 1;
            } else {
                u._skip = false;
            }
            // Skill cooldowns (e.g. Hidan Jashin reflect every 3 rounds)
            if (u.skillCooldowns) {
                Object.keys(u.skillCooldowns).forEach(k => {
                    u.skillCooldowns[k] -= 1;
                    if (u.skillCooldowns[k] <= 0) delete u.skillCooldowns[k];
                });
            }
            if ((u.reflectDamageTurns || 0) > 0) {
                u.reflectDamageTurns -= 1;
                if (u.reflectDamageTurns <= 0) {
                    u.reflectDamageMul = 0;
                    if (u.hp > 0) state.log.push(`${u.name}: el rito de sangre se disipa.`);
                }
            }
        });
        // Training sandbox: full SP every round so you can spam techniques
        if (state.encounter?.training) {
            state.party.forEach(u => {
                if (u.hp > 0) u.sp = u.maxSp;
            });
        }
        // Baseline CP regen every round; encounters may raise it (boss/destiny).
        // Per-unit hpRegenPct (e.g. Hidan) stacks with encounter partyHpRegenPct.
        const spRegen = state.encounter?.training
            ? 0
            : (state.encounter?.partySpRegen ?? 16);
        const partyHpRegenPct = state.encounter?.partyHpRegenPct || 0;
        let restored = 0;
        let unitRegenLog = [];
        state.party.forEach(u => {
            if (u.hp <= 0) return;
            const beforeSp = u.sp || 0;
            const beforeHp = u.hp;
            if (spRegen > 0) {
                u.sp = Math.min(u.maxSp, (u.sp || 0) + spRegen);
            }
            const unitPct = (u.hpRegenPct || 0) + partyHpRegenPct;
            if (unitPct > 0) {
                const healed = Math.round(u.maxHp * unitPct);
                u.hp = Math.min(u.maxHp, u.hp + healed);
                if (u.hp > beforeHp && (u.hpRegenPct || 0) > 0) {
                    unitRegenLog.push(`${u.name} regenera +${u.hp - beforeHp} HP`);
                }
            }
            restored += (u.sp - beforeSp) + (u.hp - beforeHp);
        });
        if (restored > 0) {
            const destiny = state.encounter?.partySpRegen != null;
            if (unitRegenLog.length) {
                state.log.push(unitRegenLog.join(' · '));
            }
            if (spRegen > 0) {
                state.log.push(
                    destiny
                        ? `El destino cede: +${spRegen} CP y recuperación para el equipo.`
                        : `El equipo recupera +${spRegen} CP.`
                );
            }
        }
        this.tickBuffs(state);
        this.advanceTransformStages(state);
        this.buildTurnOrder(state);
        this.autoTransformEnemies(state);
    },

    setTransformationStage(unit, stage) {
        const profile = unit.transformProfile || {};
        const index = Math.max(0, stage - 1);
        unit.transformStage = stage;
        unit.atk = Math.floor((unit.baseAtk || unit.atk) * ((profile.atk || [])[index] || profile.defaultAtk || 1));
        unit.def = Math.floor((unit.baseDef || unit.def) * ((profile.def || [])[index] || profile.defaultDef || 1));
        unit.agi = Math.floor((unit.baseAgi || unit.agi) * ((profile.agi || [])[index] || profile.defaultAgi || 1));
        unit.transformUpkeep = (profile.upkeep || [])[index] ?? profile.defaultUpkeep ?? unit.transformUpkeep;
    },

    advanceTransformStages(state) {
        [...state.party, ...state.enemies].forEach(unit => {
            if (!unit.transformed || (unit.transformStages || 1) <= 1) return;
            if (!unit.transformAutoAdvance) return;
            const next = Math.min(unit.transformStages, (unit.transformStage || 1) + 1);
            if (next === unit.transformStage) return;
            // Wait N full rounds in the current stage before auto-advancing (e.g. Kyubi V1 → V2).
            const wait = unit.transformAdvanceCooldown ?? 0;
            if (wait > 0) {
                unit.transformAdvanceCooldown = wait - 1;
                return;
            }
            this.setTransformationStage(unit, next);
            unit.transformAdvanceCooldown = unit.transformAdvanceDelayRounds ?? 0;
            const label = (unit.transformStageNames || [])[next - 1] || `${next}`;
            state.log.push(`★ ${unit.name} avanza a ${label}: suben atributos y técnicas.`);
        });
    },

    advanceTransformation(state, user, skill, logs) {
        const stages = user.transformStages || 1;
        const cur = user.transformStage || 1;
        if (!user.transformed || cur >= stages) {
            logs.push(`${user.name} no puede avanzar más la transformación.`);
            return;
        }
        const next = cur + 1;
        if (skill.transformStageAtk || skill.transformStageUpkeep) {
            const profile = user.transformProfile || {};
            const idx = next - 1;
            if (skill.transformStageAtk) {
                profile.atk = profile.atk || [];
                profile.atk[idx] = skill.transformStageAtk[0] ?? skill.transformAtk ?? 1.8;
            }
            if (skill.transformStageAgi) {
                profile.agi = profile.agi || [];
                profile.agi[idx] = skill.transformStageAgi[0] ?? skill.transformAgi ?? 1.4;
            }
            if (skill.transformStageDef) {
                profile.def = profile.def || [];
                profile.def[idx] = skill.transformStageDef[0] ?? skill.transformDef ?? 1;
            }
            if (skill.transformStageUpkeep) {
                profile.upkeep = profile.upkeep || [];
                profile.upkeep[idx] = skill.transformStageUpkeep[0] ?? skill.transformUpkeep ?? 20;
            }
            if (skill.transformAtk) profile.atk = profile.atk || [];
            if (skill.transformAtk && profile.atk) profile.atk[idx] = skill.transformAtk;
            if (skill.transformAgi) {
                profile.agi = profile.agi || [];
                profile.agi[idx] = skill.transformAgi;
            }
            if (skill.transformUpkeep != null) {
                profile.upkeep = profile.upkeep || [];
                profile.upkeep[idx] = skill.transformUpkeep;
            }
            user.transformProfile = profile;
        }
        if (skill.transformStageName) {
            user.transformStageNames = user.transformStageNames || [];
            user.transformStageNames[next - 1] = skill.transformStageName;
            user.transformName = skill.transformStageName;
        }
        this.setTransformationStage(user, next);
        if (skill.transformHeal) user.hp = Math.min(user.maxHp, user.hp + skill.transformHeal);
        logs.push(`★ ${user.name} libera ${user.transformName || 'forma superior'}! (−${user.transformUpkeep} CP/turno · más poder)`);
    },

    endTransformation(state, unit, reason) {
        if (unit?.side === 'enemy' && unit.transformUsed) {
            unit.transformed = true;
            unit.transformPersistent = true;
            unit.transformTurns = 0;
            unit.transformUpkeep = 0;
            return;
        }
        if (unit?.id === 'sasori' && unit.armorBroken && unit.transformUsed) {
            unit.transformed = true;
            unit.transformPersistent = true;
            unit.transformTurns = 0;
            unit.transformUpkeep = 0;
            return;
        }
        unit.transformed = false;
        unit.transformTurns = 0;
        unit.transformUpkeep = 0;
        unit.transformPersistent = false;
        unit.transformStage = 0;
        unit.transformStages = 0;
        unit.transformProfile = null;
        unit.atk = unit.baseAtk || unit.atk;
        unit.def = unit.baseDef || unit.def;
        unit.agi = unit.baseAgi || unit.agi;
        if (reason) state.log.push(`${unit.name} ${reason}`);
    },

    tickBuffs(state) {
        [...state.party, ...state.enemies].forEach(u => {
            Object.keys(u.buffs || {}).forEach(k => {
                if (u.buffs[k + '_turns'] !== undefined) {
                    u.buffs[k + '_turns']--;
                    if (u.buffs[k + '_turns'] <= 0) {
                        delete u.buffs[k];
                        delete u.buffs[k + '_turns'];
                    }
                }
            });
            if (u.transformed) {
                if (u.id === 'sasori' && u.armorBroken) u.transformPersistent = true;
                const upkeep = u.transformUpkeep || 0;
                if (upkeep > 0) {
                    if ((u.sp || 0) < upkeep) {
                        this.endTransformation(state, u, 'se queda sin CP — la transformación se desvanece.');
                    } else {
                        u.sp -= upkeep;
                        state.log.push(`${u.name} mantiene la transformación (−${upkeep} CP).`);
                    }
                }
                if (u.transformed && !u.transformPersistent) {
                    u.transformTurns = (u.transformTurns || 1) - 1;
                    if (u.transformTurns <= 0) {
                        this.endTransformation(state, u, 'vuelve a la normalidad.');
                    }
                }
            }
            (u.dots || []).forEach(d => {
                d.turns--;
                if (d.turns >= 0 && u.hp > 0) {
                    const before = u.hp;
                    const hold = u.side === 'enemy' && this.holdLastEnemy(state, u, d.amount);
                    u.hp = hold ? 1 : Math.max(0, u.hp - d.amount);
                    state.log.push(`${u.name} sufre ${Math.max(0, before - u.hp)} por ${d.name}.`);
                    if (u.hp <= 0) {
                        this.markDead(state, u, `${u.name} cae por ${d.name}.`);
                    } else if (hold) {
                        state.log.push(`★ Aguanta con 1 HP (ventana táctica).`);
                    }
                }
            });
            u.dots = (u.dots || []).filter(d => d.turns > 0);
        });
        this.checkEnd(state);
    },

    affinityMult(target, type) {
        if ((target.null || []).includes(type)) return { mult: 0, tag: 'NULL' };
        if ((target.weak || []).includes(type)) return { mult: 1.75, tag: 'WEAK' };
        if ((target.resist || []).includes(type)) return { mult: 0.4, tag: 'RESIST' };
        return { mult: 1, tag: 'HIT' };
    },

    calcDamage(attacker, target, skill, state = null) {
        if (!skill.power) return { damage: 0, tag: 'SUPPORT', crit: false, down: false, downChance: 0 };

        const atkBuff = attacker.buffs.atk || 1;
        const defBuff = target.buffs.def || 1;
        // DEF buffs are amplified so shields feel tactical (1.5 DEF ≈ ~40% less taken).
        const defBuffEff = defBuff <= 1 ? defBuff : Math.pow(defBuff, 1.35);
        const atk = attacker.atk * (atkBuff <= 1 ? atkBuff : Math.pow(atkBuff, 1.12));
        const def = target.def * defBuffEff * (target.guard ? 1.9 : 1);
        const aff = this.affinityMult(target, skill.type);
        if (aff.mult === 0) return { damage: 0, tag: 'NULL', crit: false, down: false };

        let base = (skill.power * 0.32 + atk * 0.95) * (atk / Math.max(12, def + 28));
        if (attacker.skillPowerMul) base *= attacker.skillPowerMul;
        base *= attacker.buffs.damage || 1;
        base *= 1 + (attacker.damageBonus || 0) + (attacker.buffs.damageBonus || 0) + (skill.damageBonus || 0);
        if (skill.pierce) base *= 1.12;
        if (attacker.charged) {
            base *= 1.45;
            attacker.charged = false;
        }
        base *= aff.mult;
        if (aff.tag === 'HIT' && state?.difficulty >= 2) {
            base *= state.difficulty >= 4 ? 0.84 : 0.92;
        }
        if (state?.difficulty >= 4 && aff.tag === 'WEAK' && state.weaknessChain > 0) {
            base *= 1 + Math.min(0.18, state.weaknessChain * 0.06);
        }

        // Role / cover mitigation
        const taken = (target.damageTakenMul || 1) * (target.buffs.damageTaken || 1);
        if (taken !== 1) base *= taken;
        if (target.cover && target.side === 'ally') base *= 0.88;

        const hits = skill.hits || 1;
        let total = 0;
        let crit = false;
        const critChance = Math.max(0.02, Math.min(0.72,
            0.08 + (attacker.luk || 0) * 0.002
            + (skill.critBonus || 0) + (skill.critChance || 0)
            + (attacker.critBonus || 0) + (attacker.buffs.critBonus || 0) + (attacker.buffs.critChance || 0)
        ));
        const critMultiplier = Math.min(2.75,
            1.55 + (attacker.critDamageBonus || 0) + (attacker.buffs.critDamage || 0) + (skill.critDamageBonus || 0)
        );
        for (let i = 0; i < hits; i++) {
            let hit = base / Math.sqrt(hits);
            if (Math.random() < critChance) {
                hit *= critMultiplier;
                crit = true;
            }
            hit *= 0.9 + Math.random() * 0.2;
            total += hit;
        }

        const damage = Math.max(1, Math.floor(total));
        const canAttemptDown = aff.tag === 'WEAK' && target.side === 'enemy';
        const downBlocked = canAttemptDown
            ? (target.down ? 'ALREADY_DOWN' : (target.downImmunity ? 'IMMUNE' : null))
            : null;
        const luckDelta = (attacker.luk || 0) - (target.luk || 0);
        const bossPenalty = /boss|final/i.test(target.ai || '') ? 0.14 : 0;
        const downChance = canAttemptDown
            ? Math.max(0.32, Math.min(0.72, 0.55 + luckDelta * 0.004 + (skill.downBonus || 0) - bossPenalty))
            : 0;
        const down = canAttemptDown && !downBlocked && Math.random() < downChance;
        return { damage, tag: crit ? 'CRIT' : aff.tag, affinity: aff.tag, crit, critChance, critMultiplier, down, downChance, downBlocked };
    },

    /** Hiruko / shell: first real hit barely scratches, then armor breaks → ATK↑ DEF↓ + reveal sprite. */
    breakArmorShell(state, unit, result) {
        const isSasori = unit?.id === 'sasori' || /sasori/i.test(unit?.name || '');
        if (isSasori) unit.armorShell = true;
        if (!unit?.armorShell || unit.armorBroken) return false;
        unit.armorBroken = true;
        unit.revealed = true;
        const defMul = unit.armorBreakDefMul != null ? unit.armorBreakDefMul : 0.42;
        const atkMul = unit.armorBreakAtkMul != null ? unit.armorBreakAtkMul : 1.55;
        unit.def = Math.max(8, Math.round((unit.baseDef || unit.def) * defMul));
        unit.atk = Math.round((unit.baseAtk || unit.atk) * atkMul);
        unit.baseDef = unit.def;
        unit.baseAtk = unit.atk;
        const label = unit.armorBreakName || 'forma revelada';
        const line = `★ ${unit.name}: ¡Hiruko se rompe! Queda ${label} · DEF ↓ · ATK ↑`;
        state.log.push(line);
        if (result?.logs) result.logs.push(line);
        if (result) result.armorBreak = unit.id;
        return true;
    },

    applyArmorShellHit(state, user, target, appliedDamage, dmg, result, hits) {
        if (target?.id === 'sasori' || /sasori/i.test(target?.name || '')) target.armorShell = true;
        if (!(target.armorShell && !target.armorBroken)) return null;
        const scratch = Math.max(1, Math.min(
            appliedDamage,
            Math.floor(target.maxHp * (target.armorScratchPct != null ? target.armorScratchPct : 0.018))
        ));
        const beforeHp = target.hp;
        target.hp = Math.max(0, target.hp - scratch);
        const dealt = Math.max(0, beforeHp - target.hp);
        result.logs.push(`${target.name} apenas siente el golpe (${dealt}) — ¡Hiruko se cae!`);
        this.breakArmorShell(state, target, result);
        hits.push({ id: target.id, side: target.side, damage: dealt, tag: 'SHELL', crit: false, armorBreak: true });
        return dealt;
    },

    cappedDamage(state, attacker, target, damage, crit = false) {
        if (state.encounter?.training) return damage;
        if (attacker.side === 'enemy' && target.side === 'ally') {
            // Leave a real response window — chunk, don't delete.
            const supportGap = state.partyHasSupport ? 0 : 0.08;
            const ratio = (crit ? 0.38 : 0.32) + supportGap;
            return Math.min(damage, Math.max(1, Math.floor(target.maxHp * ratio)));
        }
        if (attacker.side === 'ally' && target.side === 'enemy') {
            const boss = /boss|final/i.test(target.ai || '');
            return Math.min(damage, Math.max(1, Math.floor(target.maxHp * (boss ? 0.34 : 0.52))));
        }
        return damage;
    },

    resolveTarget(state, intended, attacker) {
        if (!intended || intended.side !== 'ally') return intended;
        const consumeCover = (tank, protectedName) => {
            tank.coverHits = Math.max(0, (tank.coverHits || 1) - 1);
            if (tank.coverHits <= 0) {
                tank.cover = false;
                tank.coverHits = 0;
                state.log.push(`${tank.name} protege a ${protectedName}! (cobertura agotada)`);
            } else {
                state.log.push(`${tank.name} protege a ${protectedName}! (${tank.coverHits} hits)`);
            }
        };
        // Self-cover: tank is the intended target — still spend a cover charge.
        if (intended.cover && attacker?.side === 'enemy') {
            consumeCover(intended, intended.name);
            return intended;
        }
        const tank = state.party.find(u => u.hp > 0 && u.cover && u !== intended);
        if (tank && attacker?.side === 'enemy') {
            consumeCover(tank, intended.name);
            return tank;
        }
        return intended;
    },

    /** Amplify offensive/defensive buffs so support turns feel decisive. */
    scaleBuffValue(stat, value) {
        if (typeof value !== 'number') return value;
        if (value >= 1) {
            if (stat === 'def') return Math.min(2.55, 1 + (value - 1) * 1.45);
            if (stat === 'atk') return Math.min(2.15, 1 + (value - 1) * 1.2);
            if (stat === 'agi') return Math.min(2.0, 1 + (value - 1) * 1.15);
            if (stat === 'damage') return Math.min(1.7, value);
            if (stat === 'damageTaken') return Math.max(0.35, value);
            return value;
        }
        // Debuffs: slightly stronger
        if (stat === 'atk' || stat === 'def' || stat === 'agi') {
            return Math.max(0.4, value - (1 - value) * 0.15);
        }
        return value;
    },

    applyBuffMap(unit, map, turns) {
        Object.entries(map || {}).forEach(([k, v]) => {
            unit.buffs[k] = this.scaleBuffValue(k, v);
            unit.buffs[k + '_turns'] = turns;
        });
    },

    applySupport(state, user, skill, target) {
        const logs = [];
        if (skill.heal) {
            const scale = user.side === 'ally' ? (state.healScale || 1.55) : 1;
            const amount = Math.round(skill.heal * (1 + (user.healBonus || 0)) * scale);
            if (skill.aoeHeal) {
                const team = user.side === 'ally' ? state.party : state.enemies;
                team.filter(u => u.hp > 0).forEach(t => {
                    const before = t.hp;
                    t.hp = Math.min(t.maxHp, t.hp + amount);
                    if (skill.restoreSp) t.sp = Math.min(t.maxSp, (t.sp || 0) + skill.restoreSp);
                    if (skill.cleanse) {
                        Object.keys(t.buffs || {}).forEach(k => {
                            if (typeof t.buffs[k] === 'number' && t.buffs[k] < 1) {
                                delete t.buffs[k];
                                delete t.buffs[k + '_turns'];
                            }
                        });
                    }
                    logs.push(`${t.name} recupera ${t.hp - before} HP.`);
                });
            } else {
                const t = target || user;
                const before = t.hp;
                t.hp = Math.min(t.maxHp, t.hp + amount);
                logs.push(`${t.name} recupera ${t.hp - before} HP.`);
            }
        }
        if (skill.revive != null) {
            const t = target || state.party.find(u => u.hp <= 0);
            if (t && t.hp <= 0) {
                t.hp = Math.max(1, Math.floor(t.maxHp * skill.revive));
                t.down = false;
                this.markAlive(t);
                logs.push(`★ ${t.name} revive con ${t.hp} HP!`);
            } else {
                logs.push('Nadie que revivir.');
            }
        }
        if (skill.transform && !user.transformed) {
            if (user.armorShell && !user.armorBroken) {
                logs.push(`${user.name} aún está dentro de Hiruko — primero hay que romper la coraza.`);
                return logs;
            }
            if (!this.transformReady(state, user)) {
                logs.push(`La transformación se desbloquea en la ronda ${this.TRANSFORM_UNLOCK_ROUND}.`);
                return logs;
            }
            // execute() validates previous once-use before entering here and marks
            // the current action. Checking usedOnce again would make every
            // transformation cancel itself on its first activation.
            if (user.transformUsed) {
                logs.push(`${user.name} ya no puede transformar otra vez.`);
                return logs;
            }
            user.transformed = true;
            user.transformUsed = true;
            user.transformTurns = skill.turns || 3;
            user.transformUpkeep = skill.transformUpkeep || 12;
            user.transformPersistent = !!(skill.transformPersistent || user.transformedSkills?.length);
            if (user.side === 'enemy') {
                user.transformPersistent = true;
                user.transformTurns = 0;
                user.transformUpkeep = 0;
            }
            user.transformStages = skill.transformStages || 1;
            user.transformAutoAdvance = !!skill.transformAutoAdvance;
            user.transformStageNames = skill.transformStageNames ? [...skill.transformStageNames] : null;
            if (user.transformStageNames?.[0]) user.transformName = user.transformStageNames[0];
            // Rounds to hold current stage before auto-advance (1 = full round as V1, then V2).
            user.transformAdvanceDelayRounds = Math.max(0, skill.transformAdvanceDelayRounds | 0);
            user.transformAdvanceCooldown = user.transformAutoAdvance
                ? user.transformAdvanceDelayRounds
                : 0;
            user.transformProfile = {
                atk: skill.transformStageAtk,
                def: skill.transformStageDef,
                agi: skill.transformStageAgi,
                upkeep: skill.transformStageUpkeep,
                defaultAtk: skill.transformAtk || 1.45,
                defaultDef: skill.transformDef || 1,
                defaultAgi: skill.transformAgi || 1.2,
                defaultUpkeep: skill.transformUpkeep || 12
            };
            user.usedOnce = user.usedOnce || {};
            user.usedOnce[skill.id] = true;
            user.baseAtk = user.baseAtk || user.atk;
            user.baseDef = user.baseDef || user.def;
            user.baseAgi = user.baseAgi || user.agi;
            this.setTransformationStage(user, 1);
            if (skill.transformHeal) user.hp = Math.min(user.maxHp, user.hp + skill.transformHeal);
            if (skill.minimumBattleRounds) {
                state.minimumRound = Math.max(
                    state.minimumRound || 1,
                    state.turnCount + skill.minimumBattleRounds - 1
                );
            }
            const label = user.transformStageNames?.[0] || user.transformName || 'TRANSFORM';
            const stageText = user.transformStages > 1 ? ` · ${label}` : '';
            logs.push(`★ ${user.name} SE TRANSFORMA!${stageText} (−${user.transformUpkeep} CP/turno · técnicas nuevas)`);
            // Voice is played by battle UI announce — no TTS here
        } else if (skill.advanceTransform && user.transformed) {
            this.advanceTransformation(state, user, skill, logs);
            user.usedOnce = user.usedOnce || {};
            user.usedOnce[skill.id] = true;
        } else if (skill.transform && user.transformed) {
            logs.push(`${user.name} ya está transformado.`);
        }
        if (skill.buff) {
            const t = target || user;
            this.applyBuffMap(t, skill.buff, skill.turns || 3);
            logs.push(`${t.name} recibe refuerzo.`);
        }
        if (skill.partyBuff) {
            const team = user.side === 'ally' ? state.party : state.enemies;
            team.filter(u => u.hp > 0).forEach(t => {
                this.applyBuffMap(t, skill.partyBuff, skill.turns || 3);
            });
            logs.push(`El equipo de ${user.name} se potencia.`);
        }
        if (skill.allyBuff) {
            const t = target || user;
            this.applyBuffMap(t, skill.allyBuff, skill.turns || 3);
            logs.push(`${t.name} es potenciado por ${user.name}.`);
        }
        if (skill.selfDebuff) {
            this.applyBuffMap(user, skill.selfDebuff, skill.turns || 3);
            logs.push(`${user.name} queda vulnerable.`);
        }
        if (skill.debuff && !skill.power) {
            const t = target || user;
            this.applyBuffMap(t, skill.debuff, skill.debuffTurns || skill.turns || 3);
            logs.push(`${t.name} queda debilitado.`);
        }
        if (skill.cover) {
            user.cover = true;
            const hits = skill.coverHits || (user.role === 'Tank' || user.tankHealer ? 3 : 2);
            user.coverHits = hits;
            logs.push(`${user.name} protege al equipo (${hits} impactos).`);
        }
        if (skill.charge) {
            user.charged = true;
            logs.push(`${user.name} concentra poder (siguiente hit ×1.5).`);
        }
        if (skill.reflectDamage) {
            user.reflectDamageTurns = skill.turns || 3;
            user.reflectDamageMul = skill.reflectMul != null ? skill.reflectMul : 1;
            const pct = Math.round(user.reflectDamageMul * 100);
            logs.push(
                `★ ${user.name} completa el rito de Jashin — ${user.reflectDamageTurns} turnos · refleja ${pct}% del daño al atacante.`
            );
        }
        if (skill.stun) {
            const t = target || this.living(state.enemies)[0];
            if (t && t.hp > 0) {
                t.stunTurns = Math.max(t.stunTurns || 0, skill.stun);
                const pending = (state.turnQueue || []).slice(state.turnIndex || 0)
                    .some(s => s.id === t.id && s.side === t.side);
                if (pending) {
                    t._skip = true;
                    t.stunTurns = Math.max(0, t.stunTurns - 1);
                }
                logs.push(`${t.name} queda atrapado (${skill.stun} turno).`);
            }
        }
        if (skill.skipEnemy) {
            // Cap: never stack more than 1 pending skip (anti-spam).
            state.skipEnemyTurns = Math.min(1, (state.skipEnemyTurns || 0) + skill.skipEnemy);
            logs.push(`¡El tiempo se detiene! (salta el próximo turno enemigo · 1 uso clave)`);
        }
        return logs;
    },

    canUseSkill(user, skill, state) {
        if (!user || !skill) return false;
        if ((user.sp || 0) < (skill.cost || 0)) return false;
        if (skill.once && user.usedOnce?.[skill.id]) return false;
        if (skill.cooldown && (user.skillCooldowns?.[skill.id] || 0) > 0) return false;
        if (skill.transform && (user.transformed || user.transformUsed)) return false;
        if (skill.transform && user.armorShell && !user.armorBroken) return false;
        if (skill.transform && state && !this.transformReady(state, user)) return false;
        return true;
    },

    /**
     * Execute player or enemy action.
     * action: { type: 'attack'|'skill'|'guard'|'item', skillId?, targetId? }
     */
    execute(state, user, action) {
        if (state.finished || !user || user.hp <= 0) return { ok: false };

        const result = { ok: true, logs: [], down: false, oneMore: false, allOutReady: false, finisher: [] };

        if (action.type === 'item') {
            if (typeof EquipmentSystem === 'undefined') return { ok: false, logs: ['Sistema de objetos no disponible.'] };
            const itemResult = EquipmentSystem.use(state, user, action);
            if (!itemResult.ok) return itemResult;
            result.logs.push(...itemResult.logs);
            result.equipment = itemResult.equipment;
            state.log.push(...result.logs);
            this.checkEnd(state);
            return result;
        }

        if (action.type === 'guard') {
            user.guard = true;
            const guardCp = user.side === 'ally' ? 14 : 0;
            if (guardCp) {
                user.sp = Math.min(user.maxSp, (user.sp || 0) + guardCp);
                result.logs.push(`${user.name} se pone en guardia (+${guardCp} CP).`);
            } else {
                result.logs.push(`${user.name} se pone en guardia.`);
            }
            state.log.push(...result.logs);
            return result;
        }

        let skill = { id: 'attack', name: 'Ataque', power: 22, type: 'strike', cost: 0 };
        if (action.type === 'skill') {
            skill = BattleData.activeSkills(user).find(s => s.id === action.skillId);
            if (!skill) return { ok: false, logs: ['Habilidad no válida.'] };
            if ((user.sp || 0) < (skill.cost || 0)) return { ok: false, logs: ['SP insuficiente.'] };
            if (skill.once && user.usedOnce?.[skill.id]) return { ok: false, logs: ['Técnica de un solo uso.'] };
            if (skill.cooldown && (user.skillCooldowns?.[skill.id] || 0) > 0) {
                return { ok: false, logs: [`En enfriamiento (${user.skillCooldowns[skill.id]}).`] };
            }
            if (skill.transform && (user.transformed || user.transformUsed)) {
                return { ok: false, logs: ['La transformación solo se puede activar una vez.'] };
            }
            if (skill.transform && user.armorShell && !user.armorBroken) {
                return { ok: false, logs: ['Primero hay que romper Hiruko.'] };
            }
            if (skill.transform && !this.transformReady(state, user)) {
                return {
                    ok: false,
                    logs: [`La transformación se desbloquea en la ronda ${this.TRANSFORM_UNLOCK_ROUND}.`]
                };
            }
            user.sp -= skill.cost || 0;
            if (skill.once) {
                user.usedOnce = user.usedOnce || {};
                user.usedOnce[skill.id] = true;
            }
            if (skill.cooldown) {
                user.skillCooldowns = user.skillCooldowns || {};
                user.skillCooldowns[skill.id] = skill.cooldown;
            }
        }

            if (skill.type === 'support' || (!skill.power && (skill.heal || skill.buff || skill.partyBuff || skill.skipEnemy || skill.stun || skill.selfDebuff || skill.allyBuff || skill.transform || skill.revive != null || skill.cover || skill.charge || skill.debuff || skill.reflectDamage))) {
            let target = user;
            if (action.targetId) {
                if (skill.targetEnemy || skill.stun || (skill.debuff && !skill.heal && !skill.buff && !skill.allyBuff)) {
                    target = this.findUnit(state, action.targetId, 'enemy') || this.findUnit(state, action.targetId, 'ally') || user;
                } else {
                    target = this.findUnit(state, action.targetId, 'ally') || this.findUnit(state, action.targetId, 'enemy') || user;
                }
            }
            result.logs.push(`${user.name} usa ${skill.name}.`);
            result.logs.push(...this.applySupport(state, user, skill, target));
            if (skill.transform && user.transformed) result.transformed = user.id;
            result.cry = skill.cry || `${skill.name}!`;
            if (!skill.cry && !state._sfxFromUi) AudioManager.combat.skill("support");
            state.log.push(...result.logs);
            this.checkEnd(state);
            return result;
        }

        const enemies = this.living(state.enemies);
        const allies = this.living(state.party);
        let targets = [];

        if (skill.aoe) {
            targets = user.side === 'ally' ? enemies : allies;
        } else {
            const tid = action.targetId;
            let t = user.side === 'ally'
                ? (this.findUnit(state, tid, 'enemy') || enemies[0])
                : (this.findUnit(state, tid, 'ally') || allies[0]);
            if (!t || t.hp <= 0) t = user.side === 'ally' ? enemies[0] : allies[0];
            if (user.side === 'enemy' && t) t = this.resolveTarget(state, t, user);
            targets = t ? [t] : [];
        }

        result.logs.push(`${user.name} usa ${skill.name}!`);
        result.cry = skill.cry || `${skill.name}!`;
        if (!skill.cry && !state._sfxFromUi) AudioManager.combat.attack();

        if (skill.hpCost) {
            user.hp = Math.max(1, user.hp - Math.floor(user.maxHp * skill.hpCost));
            result.logs.push(`${user.name} sacrifica HP.`);
        }

        const hits = [];
        targets.forEach(t => {
            const dmg = this.calcDamage(user, t, skill, state);
            if (dmg.tag === 'NULL') {
                result.logs.push(`${t.name} anula el ataque!`);
                if (!state._sfxFromUi) AudioManager.combat.impact("null");
                hits.push({ id: t.id, side: t.side, damage: 0, tag: 'NULL' });
                return;
            }
            const beforeHp = t.hp;
            const appliedDamage = this.cappedDamage(state, user, t, dmg.damage, dmg.crit);
            if (this.applyArmorShellHit(state, user, t, appliedDamage, dmg, result, hits) != null) {
                return;
            }
            const tacticalHold = user.side === 'ally' && this.holdLastEnemy(state, t, appliedDamage);
            t.hp = tacticalHold ? 1 : Math.max(0, t.hp - appliedDamage);
            const dealt = Math.max(0, beforeHp - t.hp);
            if (user.side === 'ally' && t.side === 'enemy') {
                if (dmg.affinity === 'WEAK') {
                    state.weaknessChain = Math.min(3, (state.weaknessChain || 0) + 1);
                    if (state.weaknessChain > 1) {
                        result.logs.push(`★ Cadena de debilidad x${state.weaknessChain}: el siguiente golpe elemental gana potencia.`);
                    }
                } else if (dmg.affinity !== 'NULL') {
                    state.weaknessChain = 0;
                }
            }
            let line = `${t.name} recibe ${dealt} (${BattleData.typeLabel(skill.type)} · ${dmg.tag})`;
            if (dmg.crit) line += ' CRITICAL!';
            result.logs.push(line);
            hits.push({ id: t.id, side: t.side, damage: dealt, tag: dmg.tag, crit: dmg.crit });
            if (tacticalHold) {
                result.logs.push(`★ Aguanta con 1 HP: la ventana de cuatro rondas sigue activa.`);
            }

            // Hidan / Jashin: while ritual is active, bounce damage to the attacker.
            if (dealt > 0 && (t.reflectDamageTurns || 0) > 0 && user !== t && user.hp > 0) {
                const bounce = Math.max(1, Math.floor(dealt * (t.reflectDamageMul || 1)));
                const beforeAtk = user.hp;
                const holdAtk = user.side === 'enemy' && this.holdLastEnemy(state, user, bounce);
                user.hp = holdAtk ? 1 : Math.max(0, user.hp - bounce);
                const bounced = Math.max(0, beforeAtk - user.hp);
                result.logs.push(`☠ Rito de Jashin: ${user.name} recibe ${bounced} de vuelta!`);
                hits.push({ id: user.id, side: user.side, damage: bounced, tag: 'REFLECT', crit: false, reflect: true });
                if (user.hp <= 0) {
                    this.markDead(state, user, `${user.name} cae por el rito de Jashin.`);
                    result.logs.push(`${user.name} derrotado por el rito.`);
                } else if (holdAtk) {
                    result.logs.push(`★ Aguanta con 1 HP (ventana táctica).`);
                }
            }

            if (skill.debuff && t.hp > 0) {
                this.applyBuffMap(t, skill.debuff, skill.debuffTurns || 3);
                result.logs.push(`${t.name} queda debilitado.`);
            }

            if (skill.dot && t.hp > 0) {
                t.dots = t.dots || [];
                t.dots.push({ name: skill.name, amount: skill.dot, turns: skill.dotTurns || 2 });
                result.logs.push(`${t.name} queda marcado.`);
            }

            // Samehada-style: siphon HP / CP after a damaging hit.
            if (dealt > 0 && skill.heal) {
                const scale = user.side === 'ally' ? (state.healScale || 1.55) : 1;
                const amount = Math.round(skill.heal * (1 + (user.healBonus || 0)) * scale * 0.55);
                const before = user.hp;
                user.hp = Math.min(user.maxHp, user.hp + amount);
                const gained = user.hp - before;
                if (gained > 0) result.logs.push(`${user.name} absorbe ${gained} HP.`);
            }
            if (dealt > 0 && skill.drainSp) {
                const steal = Math.min(skill.drainSp, t.sp || 0);
                if (steal > 0) t.sp = Math.max(0, (t.sp || 0) - steal);
                const gain = skill.drainSp;
                user.sp = Math.min(user.maxSp, (user.sp || 0) + gain);
                result.logs.push(`${user.name} drena ${gain} CP${steal ? ` (−${steal} a ${t.name})` : ''}.`);
            }

            if (dmg.down && t.hp > 0) {
                t.down = true;
                t.downImmunity = true;
                state.downedEnemies.add(t.id);
                result.down = true;
                result.oneMore = true;
                result.logs.push(`¡${t.name} DOWN! 1 MORE! (${Math.round(dmg.downChance * 100)}%)`);
                if (!state._sfxFromUi) AudioManager.combat.impact("down");
            } else if (dmg.downBlocked === 'IMMUNE' && t.hp > 0) {
                // The first effective hit after recovering consumes protection
                // but can never knock the same enemy down twice in succession.
                t.downImmunity = false;
                result.logs.push(`${t.name} mantiene el equilibrio y no puede caer dos veces seguidas.`);
                if (!state._sfxFromUi) AudioManager.combat.attack();
            } else if (t.hp <= 0) {
                this.markDead(state, t);
                result.logs.push(`${t.name} derrotado.`);
                if (user.side === 'ally' && t.side === 'enemy' && t.hp <= 0) {
                    result.finisher.push({ id: t.id, side: t.side });
                }
                if (!state._sfxFromUi) AudioManager.combat.death({ heavy: true });
            } else {
                if (!state._sfxFromUi) AudioManager.combat.attack();
            }
        });
        result.hits = hits;

        // Basic attacks refund a little CP so long fights stay playable.
        if (action.type === 'attack' && user.side === 'ally') {
            const gain = 10;
            user.sp = Math.min(user.maxSp, (user.sp || 0) + gain);
            result.logs.push(`${user.name} recupera +${gain} CP.`);
        }

        // All-Out ready if all living enemies are down
        const livingE = this.living(state.enemies);
        if (livingE.length && livingE.every(e => e.down)) {
            result.allOutReady = true;
            result.logs.push('★ ALL-OUT ATTACK disponible!');
        }

        state.log.push(...result.logs);
        this.checkEnd(state);
        return result;
    },

    allOutAttack(state) {
        const livingE = this.living(state.enemies).filter(e => e.down);
        if (!livingE.length) return { ok: false, logs: ['Nadie está DOWN.'] };
        const logs = ['★ ALL-OUT ATTACK!'];
        const hits = [];
        const finisher = [];
        const attackers = this.living(state.party);
        livingE.forEach(e => {
            let total = 0;
            attackers.forEach(a => {
                total += Math.floor((a.atk * (a.buffs.atk || 1)) * (1.2 + Math.random() * 0.5));
            });
            const boss = /boss|final/i.test(e.ai || '');
            total = Math.min(total, Math.max(1, Math.floor(e.maxHp * (boss ? 0.35 : 0.5))));
            const tacticalHold = this.holdLastEnemy(state, e, total);
            const beforeHp = e.hp;
            e.hp = tacticalHold ? 1 : Math.max(0, e.hp - total);
            e.down = false;
            e.downImmunity = true;
            state.downedEnemies.delete(e.id);
            hits.push({ id: e.id, side: e.side, damage: beforeHp - e.hp, tag: 'ASSAULT', crit: false });
            logs.push(`${e.name} sufre ${beforeHp - e.hp} de daño combinado!`);
            if (e.hp <= 0) {
                this.markDead(state, e, `${e.name} cae ante el Asalto.`);
                finisher.push({ id: e.id, side: e.side });
            }
            if (tacticalHold) logs.push('★ La ventana táctica lo mantiene con 1 HP hasta la cuarta ronda.');
        });
        state.log.push(...logs);
        if (!state._sfxFromUi) {
            AudioManager.combat.ultimate({ allOut: true });
            screenShake(document.getElementById('app'), 1.5);
        }
        this.checkEnd(state);
        return { ok: true, logs, hits, finisher };
    },

    advanceTurn(state, consumedOneMore = false) {
        if (state.finished) return;

        // Clear downs on enemies when turn passes without one-more chain end? Keep downs until they act or all-out
        if (!consumedOneMore) {
            state.turnIndex++;
        }

        // Skip queued dead
        while (state.turnIndex < state.turnQueue.length) {
            const slot = state.turnQueue[state.turnIndex];
            const unit = this.findUnit(state, slot.id, slot.side);
            if (unit && unit.hp > 0) break;
            state.turnIndex++;
        }

        if (state.turnIndex >= state.turnQueue.length) {
            // New round — clear downs
            state.enemies.forEach(e => {
                if (e.down) e.downImmunity = true;
                e.down = false;
            });
            state.downedEnemies.clear();
            this.startRound(state);
        }

        // Skip enemy turns from ZA WARUDO etc.
        const actor = this.currentActor(state);
        if (actor && actor.side === 'enemy' && state.skipEnemyTurns > 0) {
            state.skipEnemyTurns--;
            state.log.push(`${actor.name} no puede moverse... el tiempo está detenido.`);
            state.turnIndex++;
            this.advanceTurn(state);
        }
    },

    runEnemyTurn(state) {
        const actor = this.currentActor(state);
        if (!actor || actor.side !== 'enemy' || state.finished) return null;

        if (actor.down) {
            actor.down = false;
            actor.downImmunity = true;
            state.downedEnemies.delete(actor.id);
            state.log.push(`${actor.name} se levanta.`);
            this.advanceTurn(state);
            return { logs: [`${actor.name} se levanta.`] };
        }

        const decision = BattleAI.choose(actor, state.enemies, state.party, state);
        if (!decision || !decision.skill) {
            this.advanceTurn(state);
            return { logs: [] };
        }

        // Ensure skill exists on actor (AI may reference template skill)
        if (!(actor.skills || []).find(s => s.id === decision.skill.id)) {
            actor.skills = actor.skills || [];
            actor.skills.push(decision.skill);
        }

        const result = this.execute(state, actor, {
            type: 'skill',
            skillId: decision.skill.id,
            targetId: decision.target?.id
        });

        if (!result.ok) {
            const forced = this.execute(state, actor, {
                type: 'attack',
                targetId: decision.target?.id
            });
            this.advanceTurn(state);
            return forced;
        }

        this.advanceTurn(state);
        return result;
    }
};
