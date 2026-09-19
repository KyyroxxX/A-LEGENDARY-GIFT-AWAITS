/**
 * Trío final — Eren Yeager, Griffith y Mob.
 * SOLO existen en el boss THE 50/50: fuera de pools, colección y previews.
 * Al vencer al boss se desbloquean los 3 en C3 (6★ max). Ver:
 * - GachaRoster.BOSS_EXCLUSIVE_6 (rareza 6★ sin banners)
 * - GameManager.onBattleVictory (desbloqueo)
 * - ChronicleData boss (encuentro) + BattleUI (diálogos y música)
 */
(function registerFinalTrio() {
    if (typeof BattleData === 'undefined' || !Array.isArray(BattleData.party)) return;

    const trio = [
        {
            id: 'eren', name: 'Eren Yeager', series: 'Attack on Titan', role: 'DPS', roleTag: 'Titán de Ataque',
            img: 'assets/sprites/anim/eren_idle.png', color: '#7a6a53', accent: '#c41e3a',
            transform: true, transformName: 'Titán Fundador',
            resist: ['strike', 'curse'], weak: ['fire', 'slash'],
            maxHp: 380, maxSp: 165, atk: 76, def: 30, agi: 34, luk: 22,
            skills: [
                { id: 'eren_strike', name: 'Cuchillas Duales', cry: '¡Tatakae!', cost: 36, power: 140, type: 'pierce', hits: 2, desc: 'Acero en la nuca ×2.' },
                { id: 'eren_burst', name: 'Mordisco Titánico', cry: '¡Te comeré!', cost: 40, power: 155, type: 'strike', desc: 'Mandíbula del Titán de Ataque.' },
                { id: 'eren_rage', name: 'Grito del Fundador', cry: '¡AVANZAD!', cost: 34, power: 0, type: 'support', debuff: { atk: 0.7, def: 0.75 }, debuffTurns: 3, targetEnemy: true, desc: 'Orden real · ATK/DEF enemigo ↓↓.' },
                { id: 'eren_transform', name: 'Titán de Ataque', cry: '¡TITÁN!', cost: 64, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 14, transformAtk: 1.7, transformDef: 1.2, desc: 'TRANSFORM · 15 metros de libertad · poder brutal.' }
            ],
            transformedSkills: [
                { id: 'eren_x_strike', name: 'Puño Endurecido', cry: '¡Rompe!', cost: 46, power: 175, type: 'strike', desc: 'Cristalización demoledora.' },
                { id: 'eren_x_burst', name: 'Mandíbula y Martillo', cry: '¡Aplastad!', cost: 50, power: 160, type: 'strike', hits: 3, desc: 'Dos titanes · 3 impactos.' },
                { id: 'eren_x_howl', name: 'El Retumbar', cry: '¡EL RETUMBAR!', cost: 52, power: 180, type: 'strike', aoe: true, desc: 'Miles de pies colosales AoE.' },
                { id: 'eren_x_finisher', name: 'Coordenada Final', cry: '¡Libertad!', cost: 68, power: 215, type: 'almighty', once: true, desc: 'El Fundador decide · 1 uso.' }
            ]
        },
        {
            id: 'griffith', name: 'Griffith', series: 'Berserk', role: 'Caster', roleTag: 'Femto · Mano de Dios',
            img: 'assets/sprites/anim/griffith_idle.png', color: '#d9d9f0', accent: '#5b2c6f',
            transform: true, transformName: 'Femto',
            resist: ['curse', 'psy'], weak: ['bless', 'fire'],
            maxHp: 320, maxSp: 185, atk: 72, def: 26, agi: 40, luk: 28,
            skills: [
                { id: 'griffith_strike', name: 'Corte Causal', cry: 'Arrodíllate.', cost: 40, power: 150, type: 'psy', desc: 'La causalidad corta por él.' },
                { id: 'griffith_burst', name: 'Mano de Dios', cry: 'Sacrificio.', cost: 42, power: 135, type: 'curse', hits: 3, desc: 'El Eclipse cobra ×3.' },
                { id: 'griffith_gaze', name: 'Mirada del Beherit', cry: 'Mírame.', cost: 34, power: 0, type: 'support', debuff: { luk: 0.5, atk: 0.7 }, debuffTurns: 3, targetEnemy: true, desc: 'El destino te abandona · LUK/ATK ↓↓.' },
                { id: 'griffith_transform', name: 'Femto', cry: '¡FEMTO!', cost: 66, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.6, transformAgi: 1.3, desc: 'TRANSFORM · el quinto ángel · alas de oscuridad.' }
            ],
            transformedSkills: [
                { id: 'griffith_x_strike', name: 'Eclipse Total', cry: '¡Oscuridad!', cost: 48, power: 175, type: 'curse', aoe: true, desc: 'El sol muere AoE.' },
                { id: 'griffith_x_burst', name: 'Azote del Cráneo', cry: 'Inútil.', cost: 52, power: 190, type: 'psy', critBonus: 0.2, desc: 'Ni el Skull Knight lo para.' },
                { id: 'griffith_x_will', name: 'Voluntad de la Idea', cry: 'Mi sueño.', cost: 36, power: 0, type: 'support', buff: { atk: 1.45, agi: 1.3 }, turns: 3, desc: 'El dios nacido del deseo · ATK/AGI ↑↑.' },
                { id: 'griffith_x_finisher', name: 'Reescritura del Mundo', cry: '¡Fantasía!', cost: 66, power: 210, type: 'almighty', once: true, desc: 'Fusiona los mundos · 1 uso.' }
            ]
        },
        {
            id: 'mob', name: 'Mob', series: 'Mob Psycho 100', role: 'Caster', roleTag: 'Esper 100%',
            img: 'assets/sprites/anim/mob_idle.png', color: '#2c3e50', accent: '#82e0aa',
            transform: true, transformName: '???%',
            resist: ['psy', 'strike'], weak: ['curse'],
            maxHp: 300, maxSp: 190, atk: 70, def: 24, agi: 36, luk: 24,
            skills: [
                { id: 'mob_strike', name: 'Telequinesis', cry: '…', cost: 32, power: 125, type: 'psy', desc: 'Mob se contiene… por ahora.' },
                { id: 'mob_guard', name: 'Barrera Esper', cry: 'No quiero…', cost: 30, power: 0, type: 'support', buff: { def: 1.6 }, turns: 2, cover: true, coverHits: 3, desc: 'Se protege sin querer hacer daño · cover.' },
                { id: 'mob_burst', name: 'Explosión Empática', cry: '¡Basta!', cost: 38, power: 115, type: 'psy', aoe: true, desc: 'Oleada contenida AoE.' },
                { id: 'mob_transform', name: '???%', cry: '¡100%!', cost: 62, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 15, transformAtk: 1.75, transformAgi: 1.3, desc: 'TRANSFORM · Mob explota · nadie lo controla.' }
            ],
            transformedSkills: [
                { id: 'mob_x_strike', name: 'Tormenta Psíquica', cry: '¡¿POR QUÉ?!', cost: 50, power: 185, type: 'psy', aoe: true, desc: 'La ciudad tiembla AoE.' },
                { id: 'mob_x_burst', name: 'Colapso Desconocido', cry: '…', cost: 58, power: 200, type: 'almighty', desc: 'Energía ??? · imparable.' },
                { id: 'mob_x_aura', name: 'Aura al 100%', cry: '¡Ya basta!', cost: 38, power: 0, type: 'support', buff: { atk: 1.5, agi: 1.3 }, turns: 3, desc: 'El contador no baja · ATK/AGI ↑↑.' },
                { id: 'mob_x_finisher', name: 'Mob Enojado', cry: '¡NO MÁS!', cost: 64, power: 215, type: 'psy', once: true, desc: 'Su furia contenida · 1 uso.' }
            ]
        }
    ];

    trio.forEach((raw) => {
        const idx = BattleData.party.findIndex(x => x.id === raw.id);
        if (idx >= 0) BattleData.party[idx] = { ...BattleData.party[idx], ...raw };
        else BattleData.party.push({ ...raw });
    });
})();

if (typeof window !== 'undefined') window.FinalTrioData = true;
