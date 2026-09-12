/**
 * Chainsaw Man roster.
 * Merged into BattleData at load (bootChainsaw).
 */
const ChainsawData = {
    SERIES: 'Chainsaw Man',

    party: [
        // ── 6★ ──
        {
            id: 'denji', name: 'Denji', series: 'Chainsaw Man', role: 'DPS', roleTag: 'Chainsaw Hybrid',
            img: 'assets/sprites/anim/denji_idle.png', color: '#e8c547', accent: '#c0392b',
            transform: true, transformName: 'Chainsaw Man', resist: ['slash', 'strike'], weak: ['ice', 'psy'],
            maxHp: 320, maxSp: 150, atk: 72, def: 26, agi: 44, luk: 28,
            skills: [
                { id: 'poverty_punch', name: 'Street Punch', cry: 'I\'ll kill you!', cost: 24, power: 105, type: 'strike', desc: 'Puñetazo callejero.' },
                { id: 'cord_pull', name: 'Pull the Cord', cry: 'Pull the cord!', cost: 30, power: 0, type: 'support', buff: { atk: 1.35, agi: 1.2 }, turns: 2, desc: 'Tira del cordón · ATK/AGI ↑.' },
                { id: 'blood_hunger', name: 'Blood Hunger', cry: 'Blood…!', cost: 28, power: 115, type: 'slash', heal: 35, desc: 'Sed de sangre · cura al golpear.' },
                { id: 'chainsaw_man', name: 'Chainsaw Man', cry: 'CHAAAAINSAW!', cost: 68, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.6, transformAgi: 1.35, desc: 'TRANSFORM · Chainsaw Man.' }
            ],
            transformedSkills: [
                { id: 'arm_ripper', name: 'Arm Ripper', cry: 'Rrraaah!', cost: 34, power: 150, type: 'slash', hits: 3, desc: 'Sierras de brazo ×3.' },
                { id: 'head_chainsaw', name: 'Head Chainsaw', cry: 'Eat this!', cost: 40, power: 165, type: 'slash', desc: 'Cabeza sierra · embiste.' },
                { id: 'blood_feast', name: 'Blood Feast', cry: 'More blood!', cost: 36, power: 140, type: 'slash', aoe: true, heal: 40, desc: 'Festín · AoE + cura.' },
                { id: 'endless_chainsaw', name: 'Endless Chainsaw', cry: 'I\'m Chainsaw Man!', cost: 62, power: 215, type: 'slash', once: true, hits: 5, desc: 'Ráfaga final · 1 uso.' }
            ],
            gachaLegendary: true
        },
        {
            id: 'makima', name: 'Makima', series: 'Chainsaw Man', role: 'Caster', roleTag: 'Control Devil',
            img: 'assets/sprites/anim/makima_idle.png', color: '#c0392b', accent: '#f4d03f',
            transform: true, transformName: 'Control Ritual', resist: ['curse', 'psy', 'dark'], weak: ['bless', 'fire'],
            maxHp: 300, maxSp: 175, atk: 68, def: 28, agi: 36, luk: 34,
            skills: [
                { id: 'finger_gun', name: 'Bang', cry: 'Bang.', cost: 28, power: 120, type: 'curse', desc: 'Bang · disparo de control.' },
                { id: 'contract_chain', name: 'Contract Chain', cry: 'Obey.', cost: 32, power: 100, type: 'curse', debuff: { atk: 0.7, agi: 0.75 }, debuffTurns: 2, desc: 'Cadena · ATK/AGI ↓.' },
                { id: 'citizens', name: 'Citizen Contract', cry: '…', cost: 30, power: 0, type: 'support', partyBuff: { def: 1.25, luk: 1.2 }, turns: 3, desc: 'Contrato · DEF/LUK equipo ↑.' },
                { id: 'control_ritual', name: 'Control Ritual', cry: 'I am the Control Devil.', cost: 70, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 14, transformAtk: 1.55, transformDef: 1.2, desc: 'TRANSFORM · ritual de control.' }
            ],
            transformedSkills: [
                { id: 'crush', name: 'Crush', cry: 'Crush.', cost: 42, power: 175, type: 'curse', desc: 'Aplastamiento · fuerza invisible.' },
                { id: 'giant_eyes', name: 'Concentric Eyes', cry: 'Look at me.', cost: 38, power: 0, type: 'support', debuff: { atk: 0.6, luk: 0.65 }, debuffTurns: 3, targetEnemy: true, stun: true, desc: 'Ojos · stun + debuff.' },
                { id: 'sacrifice_volley', name: 'Sacrifice Volley', cry: 'Die.', cost: 44, power: 160, type: 'curse', aoe: true, hits: 2, desc: 'Sacrificios · AoE ×2.' },
                { id: 'absolute_control', name: 'Absolute Control', cry: 'You belong to me.', cost: 65, power: 220, type: 'curse', once: true, desc: 'Control absoluto · 1 uso.' }
            ],
            fromEnemy: true,
            gachaLegendary: true
        },

        // ── 5★ ──
        {
            id: 'power', name: 'Power', series: 'Chainsaw Man', role: 'DPS', roleTag: 'Blood Fiend',
            img: 'assets/sprites/anim/power_idle.png', color: '#e74c3c', accent: '#5dade2',
            transform: true, transformName: 'Blood Hammer', resist: ['slash', 'curse'], weak: ['fire', 'bless'],
            maxHp: 280, maxSp: 145, atk: 70, def: 22, agi: 46, luk: 26,
            skills: [
                { id: 'blood_spear', name: 'Blood Spear', cry: 'Meow!', cost: 26, power: 110, type: 'pierce', hits: 2, desc: 'Lanzas de sangre ×2.' },
                { id: 'fiend_bite', name: 'Fiend Bite', cry: 'I am Power!', cost: 30, power: 125, type: 'slash', desc: 'Mordisco de demonio.' },
                { id: 'selfish_heal', name: 'Blood Drink', cry: 'Give me blood!', cost: 28, power: 95, type: 'curse', heal: 45, desc: 'Bebe sangre · cura.' },
                { id: 'blood_hammer', name: 'Blood Hammer Form', cry: 'BLOOD HAMMER!', cost: 62, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.55, transformAgi: 1.25, desc: 'TRANSFORM · martillo de sangre.' }
            ],
            transformedSkills: [
                { id: 'hammer_slam', name: 'Hammer Slam', cry: 'Crush!', cost: 36, power: 160, type: 'strike', desc: 'Martillazo brutal.' },
                { id: 'blood_stakes', name: 'Blood Stakes', cry: 'Pierce!', cost: 40, power: 145, type: 'pierce', aoe: true, hits: 3, desc: 'Estacas · AoE ×3.' },
                { id: 'greatest_fiend', name: 'Greatest Fiend', cry: 'I am the greatest!', cost: 30, power: 0, type: 'support', buff: { atk: 1.5, luk: 1.3 }, turns: 3, desc: 'Orgullo · ATK/LUK ↑.' },
                { id: 'blood_rain', name: 'Blood Rain', cry: 'DIE!', cost: 58, power: 195, type: 'curse', once: true, aoe: true, desc: 'Lluvia de sangre · 1 uso.' }
            ]
        },
        {
            id: 'reze', name: 'Reze', series: 'Chainsaw Man', role: 'Assassin', roleTag: 'Bomb Hybrid',
            img: 'assets/sprites/anim/reze_idle.png', color: '#6c3483', accent: '#58d68d',
            transform: true, transformName: 'Bomb Girl', resist: ['fire', 'strike'], weak: ['water', 'ice'],
            maxHp: 265, maxSp: 150, atk: 68, def: 24, agi: 50, luk: 30,
            skills: [
                { id: 'cafe_smile', name: 'Cafe Smile', cry: 'Want a drink?', cost: 24, power: 0, type: 'support', buff: { luk: 1.45, agi: 1.25 }, turns: 2, desc: 'Sonrisa · LUK/AGI ↑.' },
                { id: 'spark_kick', name: 'Spark Kick', cry: '…', cost: 28, power: 115, type: 'fire', desc: 'Patada con chispas.' },
                { id: 'pin_pull', name: 'Pull the Pin', cry: 'Click.', cost: 32, power: 120, type: 'fire', hits: 2, desc: 'Tira del pin · ×2.' },
                { id: 'bomb_girl', name: 'Bomb Girl', cry: 'BOOM.', cost: 64, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.5, transformAgi: 1.4, desc: 'TRANSFORM · Bomb Devil hybrid.' }
            ],
            transformedSkills: [
                { id: 'dynamite_apron', name: 'Dynamite Apron', cry: 'Catch!', cost: 36, power: 150, type: 'fire', hits: 3, desc: 'Delantal dinamita ×3.' },
                { id: 'chain_blast', name: 'Chain Blast', cry: 'Boom boom boom!', cost: 42, power: 155, type: 'fire', aoe: true, desc: 'Cadena de explosiones AoE.' },
                { id: 'explosive_dash', name: 'Explosive Dash', cry: 'Too slow.', cost: 34, power: 145, type: 'fire', debuff: { agi: 0.7 }, debuffTurns: 2, desc: 'Dash explosivo · AGI ↓.' },
                { id: 'city_bomb', name: 'City Bomb', cry: 'Goodbye.', cost: 60, power: 205, type: 'fire', once: true, aoe: true, desc: 'Bomba urbana · 1 uso.' }
            ]
        },
        {
            id: 'aki', name: 'Aki Hayakawa', series: 'Chainsaw Man', role: 'Slasher', roleTag: 'Devil Hunter',
            img: 'assets/sprites/anim/aki_idle.png', color: '#1a5276', accent: '#85929e',
            resist: ['slash', 'pierce'], weak: ['curse', 'dark'],
            maxHp: 290, maxSp: 140, atk: 66, def: 28, agi: 40, luk: 24,
            skills: [
                { id: 'katana_draw', name: 'Iai Draw', cry: '…', cost: 26, power: 110, type: 'slash', desc: 'Desenvaine limpio.' },
                { id: 'kon', name: 'Kon', cry: 'Kon!', cost: 34, power: 135, type: 'slash', aoe: true, desc: 'Zorro · mordisco AoE.' },
                { id: 'curse_nail', name: 'Curse Nail', cry: 'Curse Devil.', cost: 32, power: 120, type: 'curse', debuff: { def: 0.75 }, debuffTurns: 2, desc: 'Clavo maldito · DEF ↓.' },
                { id: 'future_sight', name: 'Future Devil', cry: 'I see it.', cost: 36, power: 0, type: 'support', buff: { luk: 1.6, agi: 1.35 }, turns: 3, desc: 'Futuro · LUK/AGI ↑.' }
            ]
        },
        {
            id: 'angel', name: 'Angel', series: 'Chainsaw Man', role: 'Support', roleTag: 'Angel Devil',
            img: 'assets/sprites/anim/angel_idle.png', color: '#e67e22', accent: '#f9e79f',
            resist: ['bless', 'slash'], weak: ['dark', 'curse'],
            maxHp: 270, maxSp: 160, atk: 58, def: 24, agi: 38, luk: 32,
            skills: [
                { id: 'lifespan_touch', name: 'Lifespan Touch', cry: 'Sorry…', cost: 28, power: 105, type: 'bless', heal: 30, desc: 'Toque · daño + cura propia.' },
                { id: 'year_blade', name: '5-Year Blade', cry: 'Five years.', cost: 34, power: 140, type: 'slash', desc: 'Espada de 5 años.' },
                { id: 'halo_guard', name: 'Halo Guard', cry: '…', cost: 30, power: 0, type: 'support', partyBuff: { def: 1.3 }, turns: 2, cover: true, desc: 'Halo · DEF equipo · cover.' },
                { id: 'century_sword', name: '100-Year Sword', cry: 'One hundred…', cost: 55, power: 185, type: 'slash', once: true, desc: 'Espada de 100 años · 1 uso.' }
            ]
        },

        // ── 4★ ──
        {
            id: 'beam', name: 'Beam', series: 'Chainsaw Man', role: 'Assassin', roleTag: 'Shark Fiend',
            img: 'assets/sprites/anim/beam_idle.png', color: '#1abc9c', accent: '#2c3e50',
            resist: ['water', 'strike'], weak: ['elec', 'fire'],
            maxHp: 255, maxSp: 125, atk: 62, def: 22, agi: 52, luk: 20,
            skills: [
                { id: 'shark_rush', name: 'Shark Rush', cry: 'DENJI!', cost: 24, power: 105, type: 'strike', hits: 2, desc: 'Embiste tiburón ×2.' },
                { id: 'submerge', name: 'Submerge', cry: 'Glub.', cost: 26, power: 0, type: 'support', buff: { luk: 1.55, agi: 1.4 }, turns: 2, desc: 'Se sumerge · evasión ↑.' },
                { id: 'gill_bite', name: 'Gill Bite', cry: 'Chomp!', cost: 30, power: 120, type: 'slash', desc: 'Mordisco de branquias.' },
                { id: 'great_white', name: 'Great White Carnage', cry: 'SHARK!', cost: 48, power: 165, type: 'slash', once: true, hits: 4, desc: 'Carnicería · 1 uso.' }
            ]
        }
    ],

    enemies: {
        makima: { id: 'makima', name: 'Makima', series: 'Chainsaw Man', role: 'Caster',
            img: 'assets/sprites/anim/makima_idle.png', maxHp: 540, atk: 68, def: 28, agi: 34,
            resist: ['curse', 'psy'], weak: ['bless', 'fire'], skills: null },
        denji: { id: 'denji', name: 'Denji', series: 'Chainsaw Man', role: 'DPS',
            img: 'assets/sprites/anim/denji_idle.png', maxHp: 420, atk: 66, def: 24, agi: 42,
            resist: ['slash'], weak: ['ice'], skills: null },
        power: { id: 'power', name: 'Power', series: 'Chainsaw Man', role: 'DPS',
            img: 'assets/sprites/anim/power_idle.png', maxHp: 380, atk: 64, def: 20, agi: 44,
            resist: ['slash'], weak: ['fire'], skills: null },
        reze: { id: 'reze', name: 'Reze', series: 'Chainsaw Man', role: 'Assassin',
            img: 'assets/sprites/anim/reze_idle.png', maxHp: 400, atk: 62, def: 22, agi: 48,
            resist: ['fire'], weak: ['water'], skills: null },
        beam: { id: 'beam', name: 'Beam', series: 'Chainsaw Man', role: 'Assassin',
            img: 'assets/sprites/anim/beam_idle.png', maxHp: 320, atk: 58, def: 20, agi: 50,
            resist: ['water'], weak: ['elec'], skills: null }
    },

    encounters: {
        story_csm_reze: {
            title: 'Chainsaw · Bomb Girl',
            hint: 'Reze. Agua / hielo ayudan.',
            bg: 'assets/bg/destiny.png',
            rewardInvocations: 45,
            enemies: [
                { id: 'reze', name: 'Reze', img: 'assets/sprites/anim/reze_idle.png', maxHp: 400, atk: 62, def: 22, agi: 48, skills: null }
            ]
        },
        story_csm_power: {
            title: 'Chainsaw · Blood Fiend',
            hint: 'Power. Fuego / bendición.',
            bg: 'assets/bg/destiny.png',
            rewardInvocations: 40,
            enemies: [
                { id: 'power', name: 'Power', img: 'assets/sprites/anim/power_idle.png', maxHp: 380, atk: 64, def: 20, agi: 44, skills: null }
            ]
        },
        story_csm_makima: {
            title: 'Chainsaw · Control',
            hint: 'Makima. Bendición / fuego.',
            bg: 'assets/bg/destiny.png',
            rewardInvocations: 95,
            enemies: [
                { id: 'makima', name: 'Makima', img: 'assets/sprites/anim/makima_idle.png', maxHp: 560, atk: 70, def: 28, agi: 36, skills: null }
            ]
        }
    }
};

(function bootChainsaw() {
    if (typeof BattleData === 'undefined') return;
    const fill = (encEnemy) => {
        const full = ChainsawData.enemies[encEnemy.id];
        if (!full) return encEnemy;
        return {
            ...full,
            ...encEnemy,
            skills: encEnemy.skills || full.skills,
            maxHp: encEnemy.maxHp || full.maxHp,
            atk: encEnemy.atk || full.atk,
            def: encEnemy.def || full.def,
            agi: encEnemy.agi || full.agi
        };
    };
    ChainsawData.party.forEach(p => {
        const idx = BattleData.party.findIndex(x => x.id === p.id);
        if (idx >= 0) BattleData.party[idx] = { ...BattleData.party[idx], ...p };
        else BattleData.party.push(p);
    });
    Object.entries(ChainsawData.encounters || {}).forEach(([key, enc]) => {
        BattleData.encounters[key] = { ...enc, enemies: (enc.enemies || []).map(fill) };
    });
})();
