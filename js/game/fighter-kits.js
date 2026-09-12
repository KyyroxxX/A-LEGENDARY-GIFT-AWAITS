/**
 * Canonical kits for recurring enemies / unlockables.
 * Used by encounters (enriched) and enemyAsAlly (no more "Técnica N").
 */
const FighterKits = {
    /** Clone deep enough for battle mutation safety. */
    clone(obj) {
        return obj == null ? obj : JSON.parse(JSON.stringify(obj));
    },

    /** Full playable kits for thin encounter-only villains. */
    ENEMY: {
        crocodile: {
            role: 'Caster', roleTag: 'Warlord',
            maxSp: 130, resist: ['slash'], weak: ['water', 'ice', 'elec'],
            skills: [
                { id: 'sables', name: 'Sables', cry: 'SABLES!', cost: 28, power: 110, type: 'wind', desc: 'Tormenta de arena.' },
                { id: 'desert_spada', name: 'Desert Spada', cry: 'DESERT SPADA!', cost: 34, power: 125, type: 'slash', desc: 'Hoja de desierto.' },
                { id: 'ground_death', name: 'Ground Death', cry: 'GROUND DEATH!', cost: 42, power: 140, type: 'curse', aoe: true, desc: 'Arena mortal AoE.' },
                { id: 'dehyd', name: 'Dehydration', cry: 'Dry up!', cost: 30, power: 0, type: 'support', debuff: { atk: 0.75, agi: 0.7 }, debuffTurns: 2, targetEnemy: true, desc: 'ATK/AGI ↓.' }
            ]
        },
        enel: {
            role: 'Caster', roleTag: 'God',
            maxSp: 150, resist: ['elec'], null: ['elec'], weak: ['strike'],
            skills: [
                { id: 'el_thor', name: 'El Thor', cry: 'EL THOR!', cost: 34, power: 135, type: 'elec', desc: 'Rayo divino.' },
                { id: 'vari', name: 'Vari', cry: 'VARI!', cost: 40, power: 115, type: 'elec', aoe: true, desc: 'Descargas AoE.' },
                { id: 'mani', name: 'Mani', cry: 'MANI!', cost: 28, power: 0, type: 'support', buff: { atk: 1.35, luk: 1.2 }, turns: 2, desc: 'ATK/LUK ↑.' },
                { id: 'raigo', name: 'Raigo', cry: 'I AM GOD!', cost: 58, power: 175, type: 'elec', aoe: true, desc: 'Nube del juicio.' }
            ]
        },
        zabuza: {
            role: 'Slasher', roleTag: 'Demon of Mist',
            maxSp: 120, resist: ['slash', 'ice'], weak: ['fire', 'elec'],
            skills: [
                { id: 'kubikiri', name: 'Kubikiri Hack', cry: 'Die!', cost: 30, power: 125, type: 'slash', desc: 'Corte del verdugo.' },
                { id: 'hidden_mist', name: 'Kirigakure', cry: 'Hidden Mist!', cost: 26, power: 0, type: 'support', debuff: { luk: 0.6, agi: 0.75 }, debuffTurns: 2, targetEnemy: true, desc: 'Niebla · LUK/AGI ↓.' },
                { id: 'water_dragon', name: 'Suiton: Water Dragon', cry: 'Suiton!', cost: 40, power: 140, type: 'water', desc: 'Dragón de agua.' },
                { id: 'silent_kill', name: 'Silent Killing', cry: '…', cost: 48, power: 165, type: 'slash', critBonus: 0.3, desc: 'Asesinato silencioso.' }
            ]
        },
        lucci: {
            role: 'Assassin', roleTag: 'CP9',
            maxSp: 125, resist: ['strike'], weak: ['elec', 'fire'],
            skills: [
                { id: 'shigan', name: 'Shigan', cry: 'SHIGAN!', cost: 26, power: 115, type: 'pierce', desc: 'Dedo bala.' },
                { id: 'rankyaku', name: 'Rankyaku', cry: 'RANKYAKU!', cost: 34, power: 120, type: 'slash', aoe: true, desc: 'Patada cortante AoE.' },
                { id: 'tekkai', name: 'Tekkai', cry: 'Tekkai.', cost: 28, power: 0, type: 'support', buff: { def: 1.6 }, turns: 2, desc: 'DEF ↑↑.' },
                { id: 'rokuogan', name: 'Rokuogan', cry: 'ROKUOGAN!', cost: 55, power: 180, type: 'strike', critBonus: 0.25, desc: 'Seis poderes · finisher.' }
            ]
        },
        orochimaru: {
            role: 'Caster', roleTag: 'Sannin',
            maxSp: 155, resist: ['curse', 'pierce'], weak: ['fire', 'bless'],
            skills: [
                { id: 'kusanagi', name: 'Kusanagi', cry: 'KUSANAGI!', cost: 32, power: 130, type: 'slash', desc: 'Espada serpiente.' },
                { id: 'senpuku', name: 'Hidden Shadow Snake', cry: 'Kukukuku...', cost: 36, power: 110, type: 'pierce', hits: 3, desc: 'Serpientes ×3.' },
                { id: 'regen_oro', name: 'Soft Physique Modification', cry: '...', cost: 34, power: 0, type: 'support', heal: 90, desc: 'Regeneración.' },
                { id: 'eight_branches', name: 'Yamata no Orochi', cry: 'Eight Branches!', cost: 60, power: 170, type: 'curse', aoe: true, desc: 'Ocho cabezas AoE.' }
            ]
        },
        geto: {
            role: 'Caster', roleTag: 'Curse Manipulator',
            maxSp: 150, resist: ['curse'], weak: ['elec', 'bless'],
            skills: [
                { id: 'spirit_swarm', name: 'Cursed Spirit Swarm', cry: 'Devorad.', cost: 32, power: 115, type: 'curse', hits: 4, desc: 'Enjambre ×4.' },
                { id: 'uzumaki', name: 'Maximum: Uzumaki', cry: 'Uzumaki!', cost: 52, power: 165, type: 'curse', aoe: true, desc: 'Uzumaki AoE.' },
                { id: 'spirit_wall', name: 'Spirit Wall', cry: '…', cost: 28, power: 0, type: 'support', buff: { def: 1.5 }, turns: 2, desc: 'DEF ↑.' },
                { id: 'playful', name: 'Playful Cloud', cry: 'Hah.', cost: 40, power: 145, type: 'strike', desc: 'Garrote maldito.' }
            ]
        },
        mahito: {
            role: 'Assassin', roleTag: 'Idle Transfiguration',
            maxSp: 140, resist: ['strike', 'slash'], weak: ['bless', 'fire'],
            skills: [
                { id: 'idle_transfig', name: 'Idle Transfiguration', cry: 'Interesting!', cost: 34, power: 130, type: 'curse', desc: 'Transfigura el alma.' },
                { id: 'body_repel', name: 'Body Repel', cry: 'Boom.', cost: 38, power: 115, type: 'strike', aoe: true, desc: 'Explosión corporal AoE.' },
                { id: 'self_embody', name: 'Self-Embodiment', cry: 'Domain Expansion!', cost: 44, power: 0, type: 'support', buff: { atk: 1.4, agi: 1.25 }, turns: 2, desc: 'Dominio · ATK/AGI ↑.' },
                { id: 'poly', name: 'Polymorphic Soul', cry: 'Change.', cost: 50, power: 160, type: 'curse', critBonus: 0.2, desc: 'Alma polimorfa.' }
            ]
        },
        jogo: {
            role: 'Caster', roleTag: 'Disaster Flame',
            maxSp: 145, resist: ['fire'], weak: ['water', 'ice'],
            skills: [
                { id: 'ember_insects', name: 'Ember Insects', cry: 'Burn!', cost: 30, power: 120, type: 'fire', hits: 3, desc: 'Insectos de fuego ×3.' },
                { id: 'maximum_meteor', name: 'Maximum: Meteor', cry: 'Meteor!', cost: 58, power: 175, type: 'fire', aoe: true, desc: 'Meteorito AoE.' },
                { id: 'coffin_iron', name: 'Coffin of the Iron Mountain', cry: 'Domain!', cost: 40, power: 0, type: 'support', buff: { atk: 1.35 }, turns: 2, desc: 'Dominio · ATK ↑.' },
                { id: 'lava', name: 'Lava Blast', cry: 'Feel the heat!', cost: 36, power: 140, type: 'fire', desc: 'Ráfaga de lava.' }
            ]
        }
    },

    /** Party-quality template for an id (after roster expansion / JJK inject). */
    partyTemplate(id) {
        if (typeof BattleData === 'undefined') return null;
        return (BattleData.party || []).find(p => p.id === id) || null;
    },

    /** Best kit source for unlockables / thin enemies. */
    kitFor(id) {
        const party = this.partyTemplate(id);
        if (party && Array.isArray(party.skills) && party.skills.length >= 4) {
            return {
                skills: this.clone(party.skills),
                transformedSkills: party.transformedSkills ? this.clone(party.transformedSkills) : null,
                transform: !!party.transform,
                transformName: party.transformName || null,
                maxSp: party.maxSp,
                resist: party.resist,
                weak: party.weak,
                null: party.null,
                role: party.role,
                roleTag: party.roleTag
            };
        }
        const e = this.ENEMY[id];
        if (!e) return null;
        return this.clone(e);
    },

    /** Ally-facing unit (gacha unlock). Never pads with Técnica N. */
    asAlly(id, base) {
        const kit = this.kitFor(id);
        const src = base || {};
        if (!kit) {
            const skills = this.clone(src.skills || []);
            if (!skills.some(s => s.power > 0)) {
                skills.unshift({
                    id: `${id}_strike`, name: 'Golpe Básico', cry: '!', cost: 18, power: 85, type: 'strike',
                    desc: 'Ataque básico.'
                });
            }
            return { ...src, skills };
        }
        const skills = (kit.skills || []).map(sk => {
            const copy = { ...sk };
            if (copy.cost == null) {
                copy.cost = copy.power
                    ? Math.max(18, Math.min(70, Math.round(copy.power * 0.32)))
                    : 28;
            }
            if (!copy.desc) copy.desc = copy.name;
            return copy;
        });
        while (skills.length < 4) {
            // Should not happen if kits are complete — safety with named fills only.
            const n = skills.length + 1;
            skills.push({
                id: `${id}_extra_${n}`,
                name: n % 2 ? 'Pressure Strike' : 'Battle Focus',
                cry: '!',
                cost: 26 + n * 4,
                power: n % 2 ? 105 : 0,
                type: n % 2 ? 'strike' : 'support',
                buff: n % 2 ? undefined : { atk: 1.25 },
                turns: n % 2 ? undefined : 2,
                desc: n % 2 ? 'Golpe de presión.' : 'Enfoque · ATK ↑.'
            });
        }
        return {
            id,
            name: src.name || id,
            series: src.series || 'Destino',
            role: kit.role || src.role || 'DPS',
            roleTag: kit.roleTag || src.roleTag || 'Desbloqueado',
            img: src.img || (typeof StagedSprites !== 'undefined' && StagedSprites.url(id, 'idle')) || `assets/sprites/anim/${id}_idle.png`,
            color: src.color || '#c41e3a',
            accent: src.accent || '#f4d03f',
            resist: kit.resist || src.resist || [],
            weak: kit.weak || src.weak || [],
            null: kit.null || src.null || [],
            maxHp: src.maxHp || 260,
            maxSp: kit.maxSp || src.maxSp || 130,
            atk: src.atk || 54,
            def: src.def || 22,
            agi: src.agi || 32,
            luk: src.luk || 18,
            skills,
            transform: !!kit.transform,
            transformName: kit.transformName || null,
            transformedSkills: kit.transformedSkills || null,
            fromEnemy: true
        };
    },

    /**
     * Merge canonical kit into an encounter enemy.
     * Keeps encounter HP/ATK/AI/weak overrides; upgrades skills + transform.
     */
    enrichEnemy(encEnemy, opts = {}) {
        if (!encEnemy?.id) return encEnemy;
        if (encEnemy.ai === 'dummy' || encEnemy.id === 'dummy') return encEnemy;
        const kit = this.kitFor(encEnemy.id);
        if (!kit?.skills?.length) {
            // Still ensure costs exist for any inline skills
            const skills = this.clone(encEnemy.skills || []);
            skills.forEach(sk => {
                if (sk.cost == null && sk.power) sk.cost = Math.max(12, Math.round(sk.power * 0.28));
                if (sk.cost == null) sk.cost = 20;
            });
            return { ...encEnemy, skills, maxSp: encEnemy.maxSp || 120 };
        }

        const powerMul = opts.powerMul ?? 0.58;
        const adapt = (sk) => {
            const copy = { ...sk };
            if (copy.power) copy.power = Math.max(28, Math.round(copy.power * powerMul));
            if (copy.heal) copy.heal = Math.max(25, Math.round(copy.heal * 0.75));
            if (copy.cost == null) {
                copy.cost = copy.power
                    ? Math.max(14, Math.min(55, Math.round(copy.power * 0.3)))
                    : 24;
            }
            // Enemies need enough SP to actually cast
            return copy;
        };

        const thin = !encEnemy.skills || encEnemy.skills.length < 4 || encEnemy.skills === null;
        const wantTransform = !!(kit.transform || encEnemy.transform);
        const skills = (thin || wantTransform ? kit.skills : encEnemy.skills).map(adapt);
        const finalSkills = wantTransform ? kit.skills.map(adapt) : skills;
        const encounterTransform = (encEnemy.skills || []).find((skill) => skill && skill.transform);
        if (wantTransform && encounterTransform && !finalSkills.some((skill) => skill && skill.transform)) {
            finalSkills.push(adapt(encounterTransform));
        }
        if (wantTransform && !finalSkills.some((skill) => skill && skill.transform)) {
            const kitTransform = (kit.skills || []).find((skill) => skill && skill.transform);
            if (kitTransform) finalSkills.push(adapt(kitTransform));
        }
        const transformedSkills = kit.transformedSkills
            ? kit.transformedSkills.map(adapt)
            : (encEnemy.transformedSkills || null);

        return {
            ...encEnemy,
            maxSp: Math.max(encEnemy.maxSp || 0, kit.maxSp || 140, 130),
            resist: encEnemy.resist || kit.resist || [],
            weak: encEnemy.weak || kit.weak || [],
            null: encEnemy.null || kit.null || [],
            transform: wantTransform,
            transformName: encEnemy.transformName || kit.transformName || null,
            skills: finalSkills,
            transformedSkills,
            ai: encEnemy.ai || (wantTransform ? 'bosslet' : 'tactical')
        };
    },

    enrichEncounter(enc) {
        if (!enc?.enemies) return enc;
        const diff = enc.difficulty || 1;
        // Slightly stronger kits on harder fights
        const powerMul = Math.min(0.78, 0.5 + diff * 0.035);
        return {
            ...enc,
            enemies: enc.enemies.map(e => this.enrichEnemy(e, { powerMul }))
        };
    },

    enrichAllEncounters() {
        if (typeof BattleData === 'undefined') return;
        Object.keys(BattleData.encounters || {}).forEach((key) => {
            BattleData.encounters[key] = this.enrichEncounter(BattleData.encounters[key]);
        });
    }
};

if (typeof window !== 'undefined') window.FighterKits = FighterKits;
