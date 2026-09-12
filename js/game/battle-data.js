/* __ENEMY_BUFF_V1__ */
/**
 * Battle roster — 3 per series (One Piece, Naruto, JoJo, Bleach)
 * Portraits from Fandom wikis (personal gift use). Animated in UI via CSS.
 */
const BattleData = {
    imageExt(id, folder) {
        // Prefer mapped file if present via convention
        return `assets/${folder}/${id}.webp`;
    },

    party: [
        {
            id: 'luffy', name: 'Monkey D. Luffy', series: 'One Piece', role: 'DPS', roleTag: 'Striker',
            img: 'assets/characters/luffy.webp', color: '#c0392b', accent: '#f1c40f',
            transform: true, transformName: 'Gear Second', resist: ['strike'], weak: ['ice'],
            maxHp: 300, maxSp: 101, atk: 60, def: 24, agi: 30, luk: 20,
            skills: [
                { id: 'gum_pistol', name: 'Gomu Gomu no Pistol', cry: 'GOMU GOMU NO PISTOL!', cost: 20, power: 68, type: 'strike', desc: 'Puñetazo elástico.' },
                { id: 'gum_gatling', name: 'Gomu Gomu no Gatling', cry: 'GATLING!', cost: 41, power: 105, type: 'strike', hits: 5, desc: '5 hits · lluvia de golpes.' },
                { id: 'gear_second', name: 'Gear Second', cry: 'GEAR SECOND!', cost: 52, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.55, transformAgi: 1.4, desc: 'TRANSFORM · permanece hasta quedarse sin CP · técnicas exclusivas.' },
                { id: 'king_kong', name: 'King Kong Gun', cry: 'KING KONG GUN!', cost: 78, power: 165, type: 'strike', hpCost: 0.1, desc: 'Nuke strike. -10% HP.' }
            ],
            transformedSkills: [
                { id: 'jet_pistol', name: 'Jet Pistol', cry: 'GOMU GOMU NO JET PISTOL!', cost: 24, power: 102, type: 'strike', desc: 'Gear Second · golpe supersónico.' },
                { id: 'jet_gatling', name: 'Jet Gatling', cry: 'JET GATLING!', cost: 46, power: 138, type: 'strike', hits: 7, desc: 'Gear Second · 7 impactos.' },
                { id: 'soru', name: 'Soru', cry: 'Soru!', cost: 28, power: 0, type: 'support', buff: { agi: 1.65, luk: 1.3 }, turns: 3, desc: 'Velocidad extrema · AGI/LUK ↑.' },
                { id: 'red_hawk', name: 'Red Hawk', cry: 'RED HAWK!', cost: 62, power: 175, type: 'fire', hpCost: 0.08, desc: 'Puño incendiario decisivo.' }
            ]
        },
        {
            id: 'zoro', name: 'Roronoa Zoro', series: 'One Piece', role: 'Tank', roleTag: 'Santoryu',
            img: 'assets/sprites/anim/zoro_idle.png', color: '#1e8449', accent: '#a9dfbf',
            transform: true, transformName: 'Santoryu · Kyutoryu',
            resist: ['slash', 'pierce'], weak: ['elec'],
            maxHp: 360, maxSp: 120, atk: 62, def: 42, agi: 26, luk: 12,
            skills: [
                { id: 'oni_giri', name: 'Oni Giri', cry: 'ONI GIRI!', cost: 25, power: 95, type: 'slash', desc: 'Corte triple frontal.' },
                { id: 'iron_body', name: 'Tekkai · Santoryu Guard', cry: '…', cost: 29, power: 0, type: 'support', buff: { def: 1.75 }, turns: 3, cover: true, coverHits: 3, desc: 'DEF ↑↑ · protege al equipo 3 golpes.' },
                { id: 'tatsumaki', name: 'Tatsu Maki', cry: 'TATSU MAKI!', cost: 37, power: 110, type: 'wind', aoe: true, desc: 'Torbellino AoE.' },
                { id: 'ashura', name: 'Kyutoryu: Ashura', cry: 'ASHURA!', cost: 62, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.55, transformDef: 1.25, transformAgi: 1.15, desc: 'TRANSFORM · nueve espadas · muro de acero.' }
            ],
            transformedSkills: [
                { id: 'ashura_ichibugin', name: 'Ashura: Ichibugin', cry: 'ICHIBUGIN!', cost: 40, power: 175, type: 'slash', critBonus: 0.28, desc: 'Corte demonio · Crit ↑.' },
                { id: 'ul_tora_gari', name: 'Ul-Tora Gari', cry: 'UL-TORA GARI!', cost: 44, power: 160, type: 'slash', hits: 3, desc: 'Tres tigres.' },
                { id: 'kiki_kyu_ten', name: 'Kiki Kyu Ten Ryo', cry: 'Santoryu!', cost: 36, power: 0, type: 'support', buff: { def: 1.9 }, turns: 2, cover: true, coverHits: 4, desc: 'Guardia absoluta · cover 4.' },
                { id: 'hyakuhachi', name: 'Hyakuhachi Pound Ho', cry: 'POUND HO!', cost: 55, power: 195, type: 'slash', aoe: true, desc: 'Onda cortante AoE.' }
            ]
        },
        {
            id: 'nami', name: 'Nami', series: 'One Piece', role: 'Buffer', roleTag: 'Weather Mage',
            img: 'assets/characters/nami.webp', color: '#e67e22', accent: '#5dade2',
            resist: ['elec', 'water'], weak: ['slash'],
            maxHp: 200, maxSp: 162, atk: 42, def: 16, agi: 34, luk: 28,
            skills: [
                { id: 'mirage', name: 'Mirage Tempo', cry: 'MIRAGE TEMPO!', cost: 25, power: 0, type: 'support', partyBuff: { luk: 1.45, agi: 1.25, critChance: 0.12 }, turns: 3, desc: 'Buff equipo · AGI/LUK ↑ · prob. crítica ↑' },
                { id: 'water_shot', name: 'Dark Cloud Tempo', cry: 'Dark clouds!', cost: 33, power: 100, type: 'water', desc: 'Agua · puede causar DOWN a Crocodile.' },
                { id: 'thunderbolt', name: 'Thunderbolt Tempo', cry: 'THUNDERBOLT TEMPO!', cost: 37, power: 118, type: 'elec', desc: 'Rayo del Clima-Tact.' },
                { id: 'cyclone', name: 'Thunder Lance · Tempo', cry: 'THUNDER LANCE!', cost: 57, power: 0, type: 'support', partyBuff: { atk: 1.35 }, turns: 3, desc: 'ATK del equipo ↑ 3t.' }
            ]
        },
        {
            id: 'naruto', name: 'Naruto Uzumaki', series: 'Naruto', role: 'DPS', roleTag: 'Ninja',
            img: 'assets/characters/naruto.webp', color: '#e67e22', accent: '#3498db',
            transform: true, transformName: 'Manto Kyubi', resist: ['wind', 'bless'], weak: ['curse'],
            maxHp: 265, maxSp: 134, atk: 54, def: 22, agi: 36, luk: 24,
            skills: [
                { id: 'rasengan', name: 'Rasengan', cry: 'RASENGAN!', cost: 29, power: 95, type: 'wind', desc: 'Esfera de chakra.' },
                { id: 'kage_bunshin', name: 'Kage Bunshin', cry: 'KAGE BUNSHIN NO JUTSU!', cost: 37, power: 0, type: 'support', buff: { luk: 1.35, atk: 1.15, critChance: 0.08 }, heal: 28, turns: 2, desc: 'Clones · ATK/LUK ↑ · prob. crítica ↑ + cura ligera.' },
                { id: 'odama', name: 'Odama Rasengan', cry: 'ODAMA RASENGAN!', cost: 53, power: 125, type: 'wind', desc: 'Rasengan gigante.' },
                { id: 'kyubi', name: 'Liberar al Kyubi', cry: '¡DATTEBAYO!', cost: 72, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformStages: 2, transformAutoAdvance: true, transformAdvanceDelayRounds: 1, transformStageNames: ['2 Colas', '4 Colas'], minimumBattleRounds: 2, transformStageUpkeep: [10, 16], transformStageAtk: [1.4, 1.75], transformStageAgi: [1.15, 1.35], transformStageDef: [1.1, 1.2], transformHeal: 45, transformUpkeep: 10, transformAtk: 1.4, desc: 'TRANSFORM · 2 colas → tras 1 ronda, 4 colas (V2).' }
            ],
            transformedSkills: [
                { id: 'kyubi_claw', name: 'Garra de Chakra', cry: 'GRAAAH!', cost: 28, power: 125, type: 'strike', hits: 3, minTransformStage: 1, desc: '2 colas · zarpazos de chakra.' },
                { id: 'kyubi_regen', name: 'Regeneración Kyubi', cry: '¡No caeré!', cost: 32, power: 0, type: 'support', heal: 105, buff: { def: 1.25 }, turns: 2, minTransformStage: 1, desc: '2 colas · regenera HP.' },
                { id: 'bijuu_roar', name: 'Rugido Bijuu', cry: 'GRAAAAAH!', cost: 38, power: 140, type: 'wind', aoe: true, debuff: { def: 0.75 }, debuffTurns: 2, minTransformStage: 2, desc: '4 colas · rugido AoE.' },
                { id: 'menacing_ball', name: 'Bomba de Chakra', cry: 'ROAAAAAR!', cost: 58, power: 195, type: 'curse', minTransformStage: 2, desc: '4 colas · proyectil concentrado.' }
            ]
        },
        {
            id: 'sasuke', name: 'Sasuke Uchiha', series: 'Naruto', role: 'Caster', roleTag: 'Genjutsu DPS',
            img: 'assets/characters/sasuke.webp', color: '#2c3e50', accent: '#9b59b6',
            transform: true, transformName: 'Sharingan', resist: ['elec', 'fire'], weak: ['bless'],
            maxHp: 230, maxSp: 157, atk: 56, def: 18, agi: 38, luk: 16,
            skills: [
                { id: 'chidori', name: 'Chidori', cry: 'CHIDORI!', cost: 33, power: 105, type: 'elec', desc: 'Rayo en la palma.' },
                { id: 'katon', name: 'Katon: Gran Bola de Fuego', cry: '¡KATON!', cost: 37, power: 102, type: 'fire', aoe: true, desc: 'Bola de fuego AoE.' },
                { id: 'chidori_nagashi', name: 'Chidori Nagashi', cry: 'CHIDORI NAGASHI!', cost: 41, power: 95, type: 'elec', aoe: true, debuff: { agi: 0.75 }, debuffTurns: 2, desc: 'Corriente eléctrica AoE.' },
                { id: 'sharingan_s', name: 'Sharingan', cry: '¡SHARINGAN!', cost: 52, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.4, transformAgi: 1.25, desc: 'TRANSFORM · permanece hasta quedarse sin CP · técnicas exclusivas.' }
            ],
            transformedSkills: [
                { id: 'chidori_spear', name: 'Chidori Eisō', cry: 'CHIDORI EISO!', cost: 34, power: 132, type: 'elec', desc: 'Lanza de rayo de gran alcance.' },
                { id: 'genjutsu_s', name: 'Genjutsu Sharingan', cry: '¡Genjutsu!', cost: 32, power: 0, type: 'support', debuff: { atk: 0.62, agi: 0.62 }, debuffTurns: 3, targetEnemy: true, desc: 'ATK/AGI enemigo ↓↓.' },
                { id: 'kirin', name: 'Kirin', cry: 'KIRIN!', cost: 65, power: 190, type: 'elec', aoe: true, desc: 'Relámpago celestial AoE.' },
                { id: 'sharingan_counter', name: 'Lectura Sharingan', cry: 'Puedo verlo.', cost: 28, power: 0, type: 'support', buff: { def: 1.35, luk: 1.5 }, turns: 3, desc: 'Anticipa ataques · DEF/LUK ↑.' }
            ]
        },
        {
            id: 'sakura', name: 'Sakura Haruno', series: 'Naruto', role: 'Healer', roleTag: 'Medic / Buffer',
            img: 'assets/sprites/anim/sakura_idle.png', color: '#e91e63', accent: '#f8bbd0',
            resist: ['strike'], weak: ['curse'],
            maxHp: 245, maxSp: 168, atk: 46, def: 22, agi: 28, luk: 22,
            skills: [
                { id: 'heal_sakura', name: 'Shosen Jutsu', cry: '¡Te curo!', cost: 29, power: 0, type: 'support', heal: 145, desc: 'Gran cura a 1 aliado.' },
                { id: 'cherry_punch', name: 'Cherry Blossom Impact', cry: 'CHA!', cost: 33, power: 125, type: 'strike', desc: 'Puño monstruo (byakugou).' },
                { id: 'heal_all', name: 'Mystical Palm Wave', cry: '¡Todos arriba!', cost: 57, power: 0, type: 'support', heal: 95, aoeHeal: true, desc: 'Cura al equipo.' },
                { id: 'strength_buff', name: 'Inner Sakura', cry: 'SHANNARO!', cost: 37, power: 0, type: 'support', allyBuff: { atk: 1.45, def: 1.25 }, turns: 3, targetAlly: true, desc: 'Buff a 1 aliado ATK/DEF ↑' }
            ]
        },
        {
            id: 'jotaro', name: 'Jotaro Kujo', series: 'JoJo', role: 'Control', roleTag: 'Stand User',
            img: 'assets/sprites/anim/jotaro_idle.png', color: '#1a5276', accent: '#f4d03f',
            transform: true, transformName: 'Star Platinum Awaken', resist: ['strike', 'psy'], weak: ['curse'],
            maxHp: 290, maxSp: 112, atk: 62, def: 30, agi: 28, luk: 14,
            skills: [
                { id: 'ora', name: 'ORA ORA ORA!', cry: 'ORA ORA ORA ORA!', cost: 29, power: 80, type: 'strike', hits: 6, desc: '6 hits · Star Platinum.' },
                { id: 'star_finger', name: 'Star Finger', cry: 'STAR FINGER!', cost: 25, power: 70, type: 'pierce', desc: 'Dedos perforantes.' },
                { id: 'star_platinum', name: 'Star Platinum: The World', cry: 'STAR PLATINUM! THE WORLD!', cost: 78, power: 0, type: 'support', once: true, skipEnemy: 1, buff: { atk: 1.2 }, turns: 2, desc: 'Para el tiempo · 1 uso/combate · salta 1 turno enemigo.' },
                { id: 'sp_transform', name: 'Star Platinum Awaken', cry: 'YARE YARE DAZE', cost: 52, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 10, transformAtk: 1.5, desc: 'TRANSFORM · Star Platinum permanece materializado · técnicas exclusivas.' }
            ],
            transformedSkills: [
                { id: 'ora_overdrive', name: 'ORA Overdrive', cry: 'ORA ORA ORA ORA ORA!', cost: 36, power: 142, type: 'strike', hits: 8, desc: 'Aluvión de 8 golpes de Star Platinum.' },
                { id: 'time_stop', name: 'Star Platinum: The World', cry: 'STAR PLATINUM! THE WORLD!', cost: 64, power: 0, type: 'support', once: true, skipEnemy: 1, buff: { atk: 1.25 }, turns: 2, desc: 'Detiene el tiempo · salta un turno enemigo.' },
                { id: 'star_breaker', name: 'Star Breaker', cry: 'ORA!', cost: 54, power: 180, type: 'strike', critBonus: 0.35, desc: 'Golpe concentrado · crítico ↑↑.' },
                { id: 'precision_guard', name: 'Precisión absoluta', cry: 'Yare yare daze.', cost: 28, power: 0, type: 'support', buff: { def: 1.45, luk: 1.45, critChance: 0.15, critDamage: 0.2 }, turns: 3, desc: 'DEF/LUK ↑ · prob. y daño crítico ↑.' }
            ]
        },
        {
            id: 'josuke', name: 'Josuke Higashikata', series: 'JoJo', role: 'Healer', roleTag: 'Crazy Diamond',
            img: 'assets/sprites/anim/josuke_idle.png', color: '#3498db', accent: '#f5b041',
            transform: true, transformName: 'Crazy Diamond', resist: ['strike'], weak: ['fire'],
            maxHp: 270, maxSp: 146, atk: 48, def: 26, agi: 28, luk: 18,
            skills: [
                { id: 'heal_josuke', name: 'Crazy Diamond Fix', cry: 'CRAZY DIAMOND!', cost: 33, power: 0, type: 'support', heal: 160, desc: 'Repara heridas · gran cura.' },
                { id: 'dona', name: 'DORA RUSH', cry: 'DORARARARA!', cost: 29, power: 92, type: 'strike', hits: 4, desc: '4 hits · Crazy Diamond.' },
                { id: 'restore_all', name: 'What a Beautiful Duwang', cry: '¡Arreglado!', cost: 61, power: 0, type: 'support', heal: 55, aoeHeal: true, restoreSp: 24, desc: 'Cura equipo + 24 CP.' },
                { id: 'cd_awaken', name: 'Crazy Diamond!', cry: 'CRAZY DIAMOND!', cost: 48, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 10, transformAtk: 1.35, transformDef: 1.2, desc: 'TRANSFORM · Crazy Diamond permanece · técnicas exclusivas.' }
            ],
            transformedSkills: [
                { id: 'dora_barrage', name: 'DORA Barrage', cry: 'DORARARARA!', cost: 34, power: 128, type: 'strike', hits: 6, desc: 'Aluvión de Crazy Diamond.' },
                { id: 'fix_pulse', name: 'Restore Pulse', cry: '¡Arreglado!', cost: 36, power: 0, type: 'support', heal: 135, cleanse: true, desc: 'Cura fuerte + limpia debuffs.' },
                { id: 'reflect_fix', name: 'Angy Fix', cry: 'Don\'t mess with the hair!', cost: 42, power: 140, type: 'strike', debuff: { atk: 0.75 }, debuffTurns: 2, desc: 'Golpe + ATK enemigo ↓' },
                { id: 'team_restore', name: 'Group Restoration', cry: 'Crazy Diamond!', cost: 58, power: 0, type: 'support', heal: 100, aoeHeal: true, partyBuff: { def: 1.35 }, turns: 3, desc: 'Cura equipo + DEF ↑' }
            ]
        },
        {
            id: 'jolyne', name: 'Jolyne Cujoh', series: 'JoJo', role: 'Debuffer', roleTag: 'Stone Free',
            img: 'assets/sprites/anim/jolyne_idle.png', color: '#16a085', accent: '#f39c12',
            transform: true, transformName: 'Stone Free', resist: ['pierce'], weak: ['slash'],
            maxHp: 250, maxSp: 123, atk: 54, def: 22, agi: 36, luk: 22,
            skills: [
                { id: 'string', name: 'String Bind', cry: 'STONE FREE!', cost: 25, power: 70, type: 'slash', debuff: { agi: 0.65 }, debuffTurns: 3, desc: 'Corte + AGI enemigo ↓' },
                { id: 'ora_jolyne', name: 'ORA ORA!', cry: 'ORA ORA ORA!', cost: 33, power: 105, type: 'strike', hits: 5, desc: '5 hits · Stone Free.' },
                { id: 'web', name: 'String Web', cry: 'Got you!', cost: 41, power: 85, type: 'pierce', aoe: true, debuff: { def: 0.7 }, debuffTurns: 2, desc: 'AoE · DEF enemigos ↓' },
                { id: 'sf_awaken', name: 'Stone Free', cry: 'STONE FREE!', cost: 50, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 10, transformAtk: 1.4, transformAgi: 1.3, desc: 'TRANSFORM · Stone Free permanece · técnicas exclusivas.' }
            ],
            transformedSkills: [
                { id: 'string_storm', name: 'String Storm', cry: 'ORA ORA!', cost: 36, power: 120, type: 'slash', hits: 4, debuff: { agi: 0.7 }, debuffTurns: 2, desc: 'Hilos · AGI ↓' },
                { id: 'mobius', name: 'Möbius Strip', cry: 'Stone Free!', cost: 40, power: 0, type: 'support', debuff: { atk: 0.65, def: 0.75 }, debuffTurns: 3, targetEnemy: true, desc: 'Control total · ATK/DEF ↓↓' },
                { id: 'string_guard', name: 'String Shield', cry: 'Not happening.', cost: 28, power: 0, type: 'support', partyBuff: { def: 1.35 }, turns: 2, cover: true, desc: 'DEF equipo ↑ · cubre.' },
                { id: 'sf_beatdown', name: 'Stone Free Beatdown', cry: 'STONE FREE!', cost: 62, power: 175, type: 'strike', hits: 6, desc: 'Beatdown decisivo.' }
            ]
        },
        {
            id: 'ichigo', name: 'Ichigo Kurosaki', series: 'Bleach', role: 'DPS', roleTag: 'Shinigami',
            img: 'assets/sprites/anim/ichigo_idle.png', color: '#e74c3c', accent: '#f5b7b1',
            transform: true, transformName: 'Bankai · Tensa Zangetsu', resist: ['slash', 'curse'], weak: ['ice'],
            maxHp: 295, maxSp: 106, atk: 66, def: 24, agi: 32, luk: 16,
            skills: [
                { id: 'getsuga', name: 'Getsuga Tensho', cry: 'GETSUGA TENSHOOO!', cost: 33, power: 118, type: 'slash', desc: 'Onda de reiatsu.' },
                { id: 'shunpo_slash', name: 'Shunpo Strike', cry: '¡Ahí!', cost: 25, power: 78, type: 'slash', desc: 'Corte a velocidad shunpo.' },
                { id: 'bankai', name: 'BANKAI', cry: 'BANKAI!', cost: 66, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformStages: 2, transformStageNames: ['Bankai · Tensa Zangetsu', 'Dangai'], transformStageAtk: [1.65, 2.1], transformStageAgi: [1.45, 1.75], transformStageUpkeep: [12, 22], transformUpkeep: 12, transformAtk: 1.65, transformAgi: 1.45, desc: 'TRANSFORM · Bankai · luego Dangai (más poder, más CP).' },
                { id: 'getsuga_black', name: 'Kuroi Getsuga', cry: 'KUROI GETSUGA!', cost: 61, power: 145, type: 'curse', desc: 'Getsuga oscuro.' }
            ],
            transformedSkills: [
                { id: 'bankai_shunpo', name: 'Bankai Shunpo', cry: '¡Demasiado lento!', cost: 28, power: 118, type: 'slash', hits: 3, minTransformStage: 1, desc: 'Tres cortes instantáneos.' },
                { id: 'kuroi_getsuga', name: 'Kuroi Getsuga', cry: 'GETSUGA TENSHO!', cost: 42, power: 158, type: 'curse', minTransformStage: 1, desc: 'Getsuga negro de Tensa Zangetsu.' },
                { id: 'getsuga_barrage', name: 'Getsuga Barrage', cry: 'GETSUGA!', cost: 58, power: 176, type: 'slash', aoe: true, minTransformStage: 1, desc: 'Oleada de cortes AoE.' },
                { id: 'dangai_rise', name: 'Dangai', cry: 'Final Getsuga…', cost: 40, power: 0, type: 'support', once: true, advanceTransform: true, transformAtk: 2.1, transformAgi: 1.75, transformUpkeep: 22, transformStageName: 'Dangai', transformHeal: 35, minTransformStage: 1, maxTransformStage: 1, desc: 'Dangai · ATK↑↑ · upkeep CP alto (−22/turno).' },
                { id: 'mugetsu', name: 'Mugetsu', cry: 'MUGETSU!', cost: 52, power: 230, type: 'curse', once: true, minTransformStage: 2, desc: 'Getsuga final · 1 uso.' },
                { id: 'dangai_slash', name: 'Dangai Slash', cry: 'CEEEERO!', cost: 48, power: 200, type: 'slash', hits: 2, minTransformStage: 2, desc: 'Dos cortes Dangai.' }
            ]
        },
        {
            id: 'rukia', name: 'Rukia Kuchiki', series: 'Bleach', role: 'Caster', roleTag: 'Ice Mage',
            img: 'assets/sprites/anim/rukia_idle.png', color: '#5dade2', accent: '#d6eaf8',
            transform: true, transformName: 'Bankai · Hakka no Togame', resist: ['ice'], weak: ['fire'],
            maxHp: 215, maxSp: 162, atk: 52, def: 18, agi: 34, luk: 18,
            skills: [
                { id: 'tsugi', name: 'Some no mai, Tsukishiro', cry: 'SOME NO MAI, TSUKISHIRO!', cost: 29, power: 112, type: 'ice', desc: 'Pilar de hielo.' },
                { id: 'tsugi2', name: 'Tsugi no mai, Hakuren', cry: 'TSUGI NO MAI, HAKUREN!', cost: 41, power: 115, type: 'ice', aoe: true, debuff: { agi: 0.75 }, debuffTurns: 2, desc: 'Ventisca AoE · AGI ↓' },
                { id: 'sode', name: 'Sode no Shirayuki', cry: 'SODE NO SHIRAYUKI!', cost: 29, power: 0, type: 'support', partyBuff: { atk: 1.2 }, turns: 2, charge: true, desc: 'Potencia magia · siguiente skill ×1.5.' },
                { id: 'bankai_rukia', name: 'Bankai: Hakka no Togame', cry: 'BANKAI! HAKKA NO TOGAME!', cost: 72, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 14, transformAtk: 1.55, transformAgi: 1.25, desc: 'TRANSFORM · Bankai de hielo absoluto.' }
            ],
            transformedSkills: [
                { id: 'white_path', name: 'White Path', cry: '…', cost: 30, power: 140, type: 'ice', desc: 'Bankai · frío que corta.' },
                { id: 'frost_aoe', name: 'Absolute Zero Veil', cry: 'Congela.', cost: 44, power: 125, type: 'ice', aoe: true, debuff: { agi: 0.6, atk: 0.85 }, debuffTurns: 2, desc: 'Bankai · AoE · AGI/ATK ↓' },
                { id: 'ice_guard', name: 'Shirayuki Guard', cry: '¡No!', cost: 28, power: 0, type: 'support', buff: { def: 1.45 }, turns: 2, cover: true, desc: 'DEF ↑ · cubre al equipo.' },
                { id: 'togame_finisher', name: 'Hakka no Togame', cry: 'HAKKA NO TOGAME!', cost: 68, power: 195, type: 'ice', desc: 'Bankai · cero absoluto.' }
            ]
        },
        {
            id: 'orihime', name: 'Orihime Inoue', series: 'Bleach', role: 'Support', roleTag: 'Shield / Heal / Bless',
            img: 'assets/characters/orihime.webp', color: '#f5b041', accent: '#f9e79f',
            resist: ['bless', 'psy'], weak: ['slash'],
            maxHp: 210, maxSp: 174, atk: 28, def: 20, agi: 26, luk: 30,
            skills: [
                { id: 'soten', name: 'Soten Kisshun', cry: 'SOTEN KISSHUN! I REJECT!', cost: 33, power: 0, type: 'support', heal: 170, desc: 'I reject · gran cura.' },
                { id: 'santen', name: 'Santen Kesshun', cry: 'SANTEN KESSHUN! I REJECT!', cost: 29, power: 0, type: 'support', allyBuff: { def: 1.65 }, turns: 3, targetAlly: true, desc: 'Escudo · DEF ↑↑ a 1 aliado.' },
                { id: 'koten', name: 'Koten Zanshun', cry: 'KOTEN ZANSHUN! I REJECT!', cost: 41, power: 120, type: 'bless', desc: 'Bendición · puede causar DOWN a THE 50/50.' },
                { id: 'heal_wave', name: 'Shun Shun Rikka', cry: '¡Shun Shun Rikka!', cost: 61, power: 0, type: 'support', heal: 105, aoeHeal: true, cleanse: true, desc: 'Cura equipo + limpia debuffs.' }
            ]
        },
        // —— EXTRA ROSTER ——
        {
            id: 'sanji', name: 'Sanji', series: 'One Piece', role: 'DPS', roleTag: 'Cook Striker',
            img: 'assets/sprites/anim/sanji_idle.png', color: '#f4d03f', accent: '#fff',
            transform: true, transformName: 'Diable Jambe', resist: ['fire'], weak: ['ice'],
            maxHp: 300, maxSp: 130, atk: 70, def: 24, agi: 44, luk: 20,
            skills: [
                { id: 'diable', name: 'Diable Jambe', cry: 'DIABLE JAMBE!', cost: 34, power: 125, type: 'fire', desc: 'Patada flameante.' },
                { id: 'concasse', name: 'Concasse', cry: 'CONCASSE!', cost: 40, power: 140, type: 'strike', desc: 'Patada demoledora.' },
                { id: 'sky_walk', name: 'Sky Walk', cry: 'Sky Walk!', cost: 28, power: 0, type: 'support', buff: { agi: 1.55, luk: 1.3 }, turns: 3, desc: 'AGI/LUK ↑' },
                { id: 'diable_max', name: 'Ifrit Jambe', cry: 'IFRIT JAMBE!', cost: 68, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 14, transformAtk: 1.7, transformAgi: 1.4, desc: 'TRANSFORM · piernas infernales.' }
            ],
            transformedSkills: [
                { id: 'ifrit_kick', name: 'Ifrit Kick', cry: 'BURN!', cost: 42, power: 175, type: 'fire', desc: 'Patada infernal.' },
                { id: 'spectre', name: 'Spectre', cry: 'Spectre!', cost: 46, power: 160, type: 'fire', hits: 3, desc: 'Combo flameante ×3.' },
                { id: 'sky_walk_max', name: 'Blue Walk+', cry: 'Más rápido.', cost: 30, power: 0, type: 'support', buff: { agi: 1.7, atk: 1.25 }, turns: 3, desc: 'Velocidad máxima.' },
                { id: 'party_food', name: 'Cuisine Extra', cry: 'Bon appétit!', cost: 48, power: 0, type: 'support', heal: 90, aoeHeal: true, desc: 'Cura al equipo (cocina).' }
            ]
        },
        {
            id: 'robin', name: 'Nico Robin', series: 'One Piece', role: 'Debuffer', roleTag: 'Hana Hana',
            img: 'assets/characters/nami.webp', color: '#5d6d7e', accent: '#f5b7b1',
            resist: ['pierce'], weak: ['fire'],
            maxHp: 230, maxSp: 151, atk: 44, def: 20, agi: 30, luk: 22,
            skills: [
                { id: 'cinquanta', name: 'Cien Fleur', cry: 'Cien Fleur!', cost: 29, power: 88, type: 'pierce', desc: 'Manos que golpean.' },
                { id: 'clutch', name: 'Clutch', cry: 'Clutch!', cost: 37, power: 95, type: 'strike', debuff: { def: 0.7 }, debuffTurns: 3, desc: 'Daño + DEF ↓' },
                { id: 'bind_arms', name: 'Dos Fleur · Bind', cry: 'Dos Fleur!', cost: 33, power: 0, type: 'support', debuff: { agi: 0.55 }, debuffTurns: 3, targetEnemy: true, desc: 'Inmoviliza · AGI enemigo ↓↓' },
                { id: 'oeil', name: 'Oeil', cry: 'Oeil!', cost: 25, power: 0, type: 'support', partyBuff: { luk: 1.35 }, turns: 3, desc: 'Equipo LUK ↑ (visión).' }
            ]
        },
        {
            id: 'law', name: 'Trafalgar Law', series: 'One Piece', role: 'Caster', roleTag: 'Surgeon',
            img: 'assets/sprites/anim/law_idle.png', color: '#f4d03f', accent: '#1a5276',
            resist: ['slash'], weak: ['elec'],
            maxHp: 255, maxSp: 157, atk: 58, def: 20, agi: 34, luk: 16,
            skills: [
                { id: 'shambles', name: 'Shambles', cry: 'SHAMBLES!', cost: 33, power: 100, type: 'slash', desc: 'Corte Room.' },
                { id: 'injection', name: 'Injection Shot', cry: 'Injection Shot!', cost: 41, power: 125, type: 'pierce', desc: 'Disparo quirúrgico.' },
                { id: 'room', name: 'ROOM', cry: 'ROOM!', cost: 37, power: 0, type: 'support', partyBuff: { atk: 1.25, agi: 1.2 }, turns: 3, desc: 'Room · ATK/AGI equipo ↑' },
                { id: 'scan', name: 'Scan', cry: 'Scan.', cost: 25, power: 0, type: 'support', debuff: { def: 0.65 }, debuffTurns: 3, targetEnemy: true, desc: 'Analiza · DEF enemigo ↓' }
            ]
        },
        {
            id: 'kakashi', name: 'Kakashi Hatake', series: 'Naruto', role: 'Support', roleTag: 'Copy Ninja',
            img: 'assets/characters/kakashi.webp', color: '#7f8c8d', accent: '#c0392b',
            transform: true, transformName: 'Sharingan', resist: ['elec', 'fire'], weak: ['curse'],
            maxHp: 275, maxSp: 146, atk: 55, def: 26, agi: 36, luk: 20,
            skills: [
                { id: 'raiton', name: 'Raikiri', cry: '¡Raikiri!', cost: 37, power: 120, type: 'elec', desc: 'Rayo cortante.' },
                { id: 'doton', name: 'Doton: Doryuuheki', cry: 'Doton!', cost: 33, power: 90, type: 'strike', aoe: true, desc: 'Muro de tierra AoE.' },
                { id: 'share_info', name: 'Análisis táctico', cry: '¡Analizado!', cost: 29, power: 0, type: 'support', partyBuff: { atk: 1.2, luk: 1.3 }, turns: 3, desc: 'Buff equipo ATK/LUK.' },
                { id: 'sharingan_k', name: 'Sharingan', cry: '¡SHARINGAN!', cost: 53, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.4, transformAgi: 1.3, desc: 'TRANSFORM · Sharingan permanece · técnicas exclusivas.' }
            ],
            transformedSkills: [
                { id: 'kamui', name: 'Kamui', cry: 'KAMUI!', cost: 58, power: 180, type: 'curse', once: true, desc: 'Distorsión espacio-temporal · 1 uso.' },
                { id: 'raikiri_twin', name: 'Raikiri Doble', cry: 'RAIKIRI!', cost: 44, power: 150, type: 'elec', hits: 2, desc: 'Dos estocadas eléctricas.' },
                { id: 'lightning_hound', name: 'Raiton: Raijū', cry: 'Raiton!', cost: 38, power: 132, type: 'elec', aoe: true, desc: 'Sabueso eléctrico AoE.' },
                { id: 'copy_jutsu', name: 'Ninja de Copia', cry: 'Ya lo he copiado.', cost: 30, power: 0, type: 'support', partyBuff: { atk: 1.3, luk: 1.35 }, turns: 3, desc: 'ATK/LUK del equipo ↑.' }
            ]
        },
        {
            id: 'gaara', name: 'Gaara', series: 'Naruto', role: 'Tank', roleTag: 'Sand Shield',
            img: 'assets/sprites/anim/gaara_idle.png', color: '#c0392b', accent: '#f5b041',
            transform: true, transformName: 'Shukaku', resist: ['slash', 'pierce'], weak: ['water'],
            maxHp: 360, maxSp: 123, atk: 50, def: 40, agi: 18, luk: 12,
            skills: [
                { id: 'sabaku', name: 'Sabaku Kyuu', cry: 'Sabaku Kyuu!', cost: 33, power: 105, type: 'strike', desc: 'Ataúd de arena.' },
                { id: 'ryuusa', name: 'Ryuusa Bakuryu', cry: 'Ryuusa!', cost: 45, power: 95, type: 'wind', aoe: true, desc: 'Tsunami de arena AoE.' },
                { id: 'sunashield', name: 'Suna no Tate', cry: '…', cost: 29, power: 0, type: 'support', buff: { def: 1.8 }, turns: 3, cover: true, coverHits: 3, desc: 'Escudo de arena · DEF ↑↑ + cover 3 hits.' },
                { id: 'shukaku', name: 'Shukaku', cry: 'Shukaku!', cost: 70, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 15, transformAtk: 1.55, transformDef: 1.4, desc: 'TRANSFORM · Shukaku · arena colosal.' }
            ],
            transformedSkills: [
                { id: 'sand_tails', name: 'Sand Tails', cry: '…', cost: 36, power: 145, type: 'strike', hits: 3, desc: 'Cinco colas de arena.' },
                { id: 'desert_wave', name: 'Desert Layered Imperial Funeral', cry: 'Sabaku Taiso!', cost: 50, power: 160, type: 'strike', aoe: true, desc: 'Funeral imperial AoE.' },
                { id: 'sand_armor_max', name: 'Absolute Defense', cry: '…', cost: 32, power: 0, type: 'support', partyBuff: { def: 1.5 }, turns: 2, cover: true, desc: 'DEF equipo ↑ · cubre.' },
                { id: 'shukaku_roar', name: 'Shukaku Roar', cry: 'ROAR!', cost: 60, power: 195, type: 'wind', aoe: true, desc: 'Rugido del tanuki.' }
            ]
        },
        {
            id: 'itachi', name: 'Itachi Uchiha', series: 'Naruto', role: 'Debuffer', roleTag: 'Genjutsu',
            img: 'assets/sprites/anim/itachi_idle.png', color: '#1c2833', accent: '#c0392b',
            transform: true, transformName: 'Sharingan',
            resist: ['fire', 'curse'], weak: ['bless'],
            maxHp: 240, maxSp: 168, atk: 52, def: 20, agi: 40, luk: 24,
            skills: [
                { id: 'amaterasu', name: 'Amaterasu', cry: '¡Amaterasu!', cost: 45, power: 115, type: 'curse', desc: 'Presión genjutsu (sin spoilers).' },
                { id: 'katon_i', name: 'Katon: Gran Bola de Fuego', cry: '¡Katon!', cost: 33, power: 100, type: 'fire', aoe: true, desc: 'Bola de fuego AoE.' },
                { id: 'tsukuyomi', name: 'Genjutsu Sharingan', cry: '¡Genjutsu!', cost: 48, power: 0, type: 'support', once: true, debuff: { atk: 0.55, agi: 0.55 }, debuffTurns: 3, targetEnemy: true, desc: 'Genjutsu · ATK/AGI ↓↓ · 1 uso/combate' },
                { id: 'sharingan_i', name: 'Sharingan', cry: '¡SHARINGAN!', cost: 55, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.45, transformAgi: 1.3, desc: 'TRANSFORM · Sharingan · permanece hasta quedarse sin CP.' }
            ],
            transformedSkills: [
                { id: 'amaterasu_x', name: 'Amaterasu · Focus', cry: '¡Amaterasu!', cost: 40, power: 145, type: 'curse', desc: 'Llamas negras concentradas.' },
                { id: 'katon_x', name: 'Katon · Barrage', cry: '¡Katon!', cost: 36, power: 125, type: 'fire', aoe: true, desc: 'Fuego AoE potenciado.' },
                { id: 'genjutsu_x', name: 'Genjutsu · Deep', cry: '…', cost: 42, power: 0, type: 'support', debuff: { atk: 0.5, agi: 0.5 }, debuffTurns: 3, targetEnemy: true, desc: 'Genjutsu profundo · ATK/AGI ↓↓.' },
                { id: 'feint_x', name: 'Crow Feint', cry: '…', cost: 30, power: 0, type: 'support', partyBuff: { luk: 1.45, agi: 1.2 }, turns: 2, desc: 'Cuervos · LUK/AGI equipo ↑.' }
            ]
        },
        {
            id: 'joseph', name: 'Joseph Joestar', series: 'JoJo', role: 'Buffer', roleTag: 'Hermit Purple',
            img: 'assets/sprites/anim/joseph_idle.png', color: '#27ae60', accent: '#f4d03f',
            transform: true, transformName: 'Hermit Purple', resist: ['elec'], weak: ['curse'],
            maxHp: 300, maxSp: 129, atk: 50, def: 28, agi: 32, luk: 28,
            skills: [
                { id: 'hamon_punch', name: 'Hamon Overdrive', cry: 'OH MY GOD!', cost: 29, power: 100, type: 'bless', desc: 'Puño Hamon.' },
                { id: 'clacker', name: 'Clacker Volley', cry: 'Clacker!', cost: 37, power: 110, type: 'strike', hits: 3, desc: '3 hits · clackers.' },
                { id: 'your_next', name: 'Your next line is…', cry: 'Nice!', cost: 33, power: 0, type: 'support', partyBuff: { atk: 1.35, luk: 1.25 }, turns: 3, desc: 'Buff equipo ATK/LUK.' },
                { id: 'hp_awaken', name: 'Hermit Purple', cry: 'Hermit Purple!', cost: 46, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 9, transformAtk: 1.25, transformAgi: 1.2, desc: 'TRANSFORM · Hermit Purple · visión y control.' }
            ],
            transformedSkills: [
                { id: 'vine_lash', name: 'Vine Lash', cry: 'Hermit Purple!', cost: 30, power: 115, type: 'pierce', hits: 3, desc: 'Látigos de vid · 3 hits.' },
                { id: 'psychic_photo', name: 'Psychic Photo', cry: 'I knew it!', cost: 34, power: 0, type: 'support', debuff: { luk: 0.6, atk: 0.8 }, debuffTurns: 3, targetEnemy: true, desc: 'Revela intención · LUK/ATK ↓' },
                { id: 'hamon_conduct', name: 'Hamon Conduct', cry: 'Overdrive!', cost: 38, power: 130, type: 'bless', aoe: true, desc: 'Hamon por las vides · AoE.' },
                { id: 'trick_master', name: 'Next Line Trap', cry: 'Your next line is…', cost: 32, power: 0, type: 'support', partyBuff: { atk: 1.3, luk: 1.4 }, turns: 3, skipEnemy: 1, once: true, desc: 'Buff + salta 1 turno enemigo · 1 uso.' }
            ]
        },
        {
            id: 'giorno', name: 'Giorno Giovanna', series: 'JoJo', role: 'Healer', roleTag: 'GE Requiem · Tank',
            img: 'assets/sprites/anim/giorno_idle.png', color: '#f1c40f', accent: '#8e44ad',
            transform: true, transformName: 'Gold Experience Requiem',
            resist: ['bless', 'strike', 'pierce'], weak: ['curse'],
            tankHealer: true,
            healBonus: 0.2,
            damageTakenMul: 0.68,
            maxHp: 445, maxSp: 195, atk: 52, def: 54, agi: 28, luk: 24,
            skills: [
                { id: 'mudas', name: 'MUDAMUDAMUDA!', cry: 'MUDAMUDAMUDA!', cost: 28, power: 100, type: 'strike', hits: 5, heal: 35, desc: '5 hits · cura al golpear.' },
                { id: 'ge_heal', name: 'Life Give', cry: 'I have a dream.', cost: 30, power: 0, type: 'support', heal: 220, desc: 'La mejor cura single del juego.' },
                { id: 'ge_bulwark', name: 'Golden Bulwark', cry: 'Gold Experience!', cost: 32, power: 0, type: 'support', buff: { def: 2.05 }, turns: 3, cover: true, coverHits: 4, partyBuff: { def: 1.25 }, desc: 'DEF ↑↑↑ · cover 4 hits · DEF equipo ↑.' },
                { id: 'ge_awaken', name: 'Gold Experience Requiem', cry: 'This is… Requiem.', cost: 48, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 8, transformAtk: 1.25, transformDef: 1.65, transformHeal: 90, desc: 'TRANSFORM · Requiem · muro viviente + gran cura.' }
            ],
            transformedSkills: [
                { id: 'life_giver', name: 'Life Giver', cry: 'Gold Experience!', cost: 28, power: 0, type: 'support', heal: 250, cleanse: true, desc: 'Cura absurda + limpia debuffs.' },
                { id: 'requiem_field', name: 'Requiem Field', cry: 'I have a dream.', cost: 48, power: 0, type: 'support', heal: 145, aoeHeal: true, partyBuff: { def: 1.55, atk: 1.2 }, turns: 3, cleanse: true, desc: 'Cura equipo masiva + DEF/ATK ↑ + limpia.' },
                { id: 'return_to_zero', name: 'Return to Zero', cry: 'You will never reach the truth.', cost: 40, power: 0, type: 'support', buff: { def: 2.2 }, turns: 3, cover: true, coverHits: 5, heal: 80, desc: 'Nulifica el destino · cover 5 + autocura.' },
                { id: 'muda_storm', name: 'MUDA Requiem', cry: 'MUDAMUDAMUDA!', cost: 34, power: 130, type: 'strike', hits: 7, heal: 50, desc: 'Barrage · cura al pegar.' }
            ]
        },
        {
            id: 'dio', name: 'DIO', series: 'JoJo', role: 'Boss', roleTag: 'The World',
            img: 'assets/sprites/anim/dio_idle.png', color: '#f4d03f', accent: '#c0392b',
            transform: true, transformName: 'The World', resist: ['strike'], weak: ['bless', 'wind'],
            maxHp: 320, maxSp: 140, atk: 70, def: 28, agi: 34, luk: 22,
            skills: [
                { id: 'muda', name: 'MUDA MUDA!', cry: 'MUDA MUDA MUDA!', cost: 28, power: 100, type: 'strike', hits: 4, desc: 'Barrage de The World.' },
                { id: 'space_ripper', name: 'Space Ripper Stingy Eyes', cry: 'WRYYYY!', cost: 34, power: 125, type: 'pierce', desc: 'Rayos oculares.' },
                { id: 'charisma', name: 'Vampire Charisma', cry: 'Useless, useless!', cost: 30, power: 0, type: 'support', buff: { atk: 1.35 }, turns: 3, desc: 'ATK ↑' },
                { id: 'tw_awaken', name: 'The World', cry: 'ZA WARUDO!', cost: 60, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.55, transformAgi: 1.25, desc: 'TRANSFORM · The World permanece.' }
            ],
            transformedSkills: [
                { id: 'time_stop_dio', name: 'ZA WARUDO', cry: 'ZA WARUDO!', cost: 58, power: 0, type: 'support', once: true, skipEnemy: 1, buff: { atk: 1.3 }, turns: 2, desc: 'Para el tiempo · salta 1 turno.' },
                { id: 'muda_max', name: 'MUDA Overdrive', cry: 'MUDA MUDA MUDA!', cost: 38, power: 155, type: 'strike', hits: 8, desc: '8 hits brutales.' },
                { id: 'road_roller', name: 'ROAD ROLLER DA!', cry: 'ROAD ROLLER DA!', cost: 66, power: 200, type: 'almighty', desc: 'Finisher almighty.' },
                { id: 'bloodsuck', name: 'Blood Drain', cry: 'WRY!', cost: 32, power: 110, type: 'curse', heal: 40, desc: 'Drena vida.' }
            ],
            fromEnemy: true
        },
        {
            id: 'kira', name: 'Yoshikage Kira', series: 'JoJo', role: 'Assassin', roleTag: 'Killer Queen',
            img: 'assets/sprites/anim/kira_idle.png', color: '#f4d03f', accent: '#8e44ad',
            transform: true, transformName: 'Killer Queen', resist: ['strike'], weak: ['bless', 'wind'],
            maxHp: 270, maxSp: 135, atk: 64, def: 22, agi: 36, luk: 30,
            skills: [
                { id: 'bomb', name: 'Killer Queen', cry: 'KILLER QUEEN!', cost: 30, power: 120, type: 'curse', critBonus: 0.25, desc: 'Bomba de contacto.' },
                { id: 'sheer', name: 'Sheer Heart Attack', cry: 'SHEER HEART ATTACK!', cost: 36, power: 100, type: 'fire', desc: 'Persigue el calor.' },
                { id: 'quiet_life', name: 'Quiet Life', cry: 'I just want a quiet life.', cost: 28, power: 0, type: 'support', buff: { luk: 1.5, agi: 1.25 }, turns: 3, desc: 'LUK/AGI ↑' },
                { id: 'kq_awaken', name: 'Killer Queen', cry: 'Killer Queen!', cost: 52, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.45, transformAgi: 1.3, desc: 'TRANSFORM · Killer Queen permanece.' }
            ],
            transformedSkills: [
                { id: 'first_bomb', name: 'First Bomb', cry: 'KILLER QUEEN!', cost: 34, power: 150, type: 'curse', critBonus: 0.35, desc: 'Bomba crítica.' },
                { id: 'sha_chase', name: 'SHA Chase', cry: 'Sheer Heart Attack!', cost: 40, power: 130, type: 'fire', hits: 2, desc: 'Persigue · 2 hits.' },
                { id: 'bites_dust', name: 'Bites the Dust', cry: 'Bites the Dust.', cost: 55, power: 0, type: 'support', once: true, skipEnemy: 1, debuff: { atk: 0.7 }, debuffTurns: 2, targetEnemy: true, desc: 'Loop · salta turno + ATK ↓' },
                { id: 'detonate', name: 'Detonate All', cry: 'Bomb.', cost: 58, power: 165, type: 'fire', aoe: true, desc: 'Explosión AoE.' }
            ],
            fromEnemy: true
        },
        {
            id: 'diavolo', name: 'Diavolo', series: 'JoJo', role: 'Control', roleTag: 'King Crimson',
            img: 'assets/sprites/anim/diavolo_idle.png', color: '#8e44ad', accent: '#e74c3c',
            transform: true, transformName: 'King Crimson', resist: ['psy'], weak: ['bless', 'elec'],
            maxHp: 290, maxSp: 145, atk: 66, def: 24, agi: 40, luk: 24,
            skills: [
                { id: 'erase', name: 'Time Erase Strike', cry: 'This is the end!', cost: 34, power: 125, type: 'almighty', desc: 'Golpe tras borrar tiempo.' },
                { id: 'doppio', name: 'Doppio Barrage', cry: 'UEEEEE!', cost: 28, power: 95, type: 'strike', hits: 4, desc: '4 hits frenéticos.' },
                { id: 'epitaph', name: 'Epitaph', cry: 'I already saw it.', cost: 32, power: 0, type: 'support', buff: { luk: 1.5, agi: 1.35 }, turns: 2, desc: 'Predicción · LUK/AGI ↑' },
                { id: 'kc_awaken', name: 'King Crimson', cry: 'KING CRIMSON!', cost: 58, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.5, transformAgi: 1.35, desc: 'TRANSFORM · King Crimson permanece.' }
            ],
            transformedSkills: [
                { id: 'time_erase', name: 'Time Erase', cry: 'KING CRIMSON!', cost: 50, power: 0, type: 'support', once: true, skipEnemy: 1, buff: { atk: 1.35, agi: 1.3 }, turns: 2, desc: 'Borra el tiempo · salta turno.' },
                { id: 'sever', name: 'Sever', cry: 'Useless!', cost: 36, power: 155, type: 'slash', desc: 'Corte letal.' },
                { id: 'doppio_max', name: 'Doppio Frenzy', cry: 'UEEEEE!', cost: 40, power: 140, type: 'strike', hits: 6, desc: '6 hits.' },
                { id: 'fate_crush', name: 'Fate Crush', cry: 'No one can oppose me!', cost: 62, power: 190, type: 'almighty', desc: 'Finisher almighty.' }
            ],
            fromEnemy: true
        },
        {
            id: 'byakuya', name: 'Byakuya Kuchiki', series: 'Bleach', role: 'Slasher', roleTag: 'Senbonzakura',
            img: 'assets/sprites/anim/byakuya_idle.png', color: '#f7b6d2', accent: '#e91e63',
            transform: true, transformName: 'Senkei · Senbonzakura Kageyoshi', resist: ['slash'], weak: ['fire'],
            maxHp: 285, maxSp: 134, atk: 60, def: 26, agi: 34, luk: 14,
            skills: [
                { id: 'senbon', name: 'Senbonzakura', cry: 'Scatter!', cost: 33, power: 110, type: 'slash', aoe: true, desc: 'Pétalos cortantes AoE.' },
                { id: 'byakurai', name: 'Byakurai', cry: 'Hadou 4!', cost: 25, power: 85, type: 'elec', desc: 'Rayo blanco.' },
                { id: 'senkei', name: 'Senkei', cry: 'Bankai!', cost: 57, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 10, transformAtk: 1.55, desc: 'TRANSFORM · Senkei permanece · técnicas exclusivas.' },
                { id: 'pride', name: 'Noble Guard', cry: '…', cost: 29, power: 0, type: 'support', partyBuff: { def: 1.3 }, turns: 3, desc: 'DEF equipo ↑' }
            ],
            transformedSkills: [
                { id: 'senkei_blade', name: 'Senkei · Espada', cry: 'Senkei.', cost: 34, power: 145, type: 'slash', hits: 3, desc: 'Tres cortes dentro del Senkei.' },
                { id: 'gokei', name: 'Gōkei', cry: 'Gokei.', cost: 52, power: 168, type: 'slash', aoe: true, desc: 'Millones de hojas cercan al enemigo.' },
                { id: 'hakuteiken', name: 'Shūkei: Hakuteiken', cry: 'Hakuteiken.', cost: 68, power: 205, type: 'bless', desc: 'Ataque final del Senkei.' },
                { id: 'senbon_guard', name: 'Muro de pétalos', cry: 'Scatter.', cost: 30, power: 0, type: 'support', partyBuff: { def: 1.4 }, turns: 3, desc: 'DEF del equipo ↑.' }
            ]
        },
        {
            id: 'toshiro', name: 'Toshiro Hitsugaya', series: 'Bleach', role: 'Caster', roleTag: 'Ice Captain',
            img: 'assets/sprites/anim/toshiro_idle.png', color: '#5dade2', accent: '#ecf0f1',
            transform: true, transformName: 'Daiguren Hyōrinmaru', resist: ['ice', 'water'], weak: ['fire'],
            maxHp: 275, maxSp: 165, atk: 60, def: 24, agi: 38, luk: 18,
            skills: [
                { id: 'hyorin', name: 'Hyōrinmaru', cry: 'Hyōrinmaru!', cost: 28, power: 115, type: 'ice', desc: 'Dragón de hielo · Shikai.' },
                { id: 'sennen', name: 'Sennen Hyōrō', cry: 'Sennen Hyōrō!', cost: 40, power: 105, type: 'ice', aoe: true, debuff: { agi: 0.7 }, debuffTurns: 2, desc: 'Prisión de hielo AoE.' },
                { id: 'frost_debuff', name: 'Frostbite', cry: 'Congélate.', cost: 28, power: 0, type: 'support', debuff: { def: 0.65, agi: 0.8 }, debuffTurns: 3, targetEnemy: true, desc: 'DEF/AGI enemigo ↓' },
                { id: 'bankai_t', name: 'Daiguren Hyōrinmaru', cry: 'BANKAI! Daiguren Hyōrinmaru!', cost: 68, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 14, transformAtk: 1.65, transformAgi: 1.25, transformDef: 1.15, desc: 'TRANSFORM · Bankai · alas de hielo.' }
            ],
            transformedSkills: [
                { id: 'ryusenka', name: 'Ryūsenka', cry: 'Ryūsenka!', cost: 42, power: 170, type: 'ice', desc: 'Flor de dragón · congela.' },
                { id: 'hyoten', name: 'Hyōten Hyakkasō', cry: 'Hyōten Hyakkasō!', cost: 52, power: 155, type: 'ice', aoe: true, debuff: { agi: 0.6, atk: 0.8 }, debuffTurns: 2, desc: 'Cien flores de hielo AoE.' },
                { id: 'guncho', name: 'Gunchō Tsurara', cry: 'Gunchō Tsurara!', cost: 36, power: 140, type: 'ice', hits: 3, desc: 'Lluvia de carámbanos ×3.' },
                { id: 'zansatsu', name: 'Zansatsu Hyōrin', cry: '¡Corta!', cost: 58, power: 195, type: 'ice', desc: 'Corte final del dragón de hielo.' }
            ]
        },
        {
            id: 'renji', name: 'Renji Abarai', series: 'Bleach', role: 'DPS', roleTag: 'Zabimaru',
            img: 'assets/sprites/anim/renji_idle.png', color: '#c0392b', accent: '#f5b7b1',
            transform: true, transformName: 'Bankai · Hihio Zabimaru', resist: ['strike'], weak: ['ice'],
            maxHp: 300, maxSp: 106, atk: 63, def: 24, agi: 28, luk: 14,
            skills: [
                { id: 'higa', name: 'Higa Zekko', cry: 'Higa Zekko!', cost: 29, power: 100, type: 'slash', desc: 'Latigazo de Zabimaru.' },
                { id: 'hikotsu', name: 'Hikotsu Taiho', cry: 'Hikotsu Taiho!', cost: 49, power: 145, type: 'slash', desc: 'Cañonazo de reiatsu.' },
                { id: 'bankai_r', name: 'Hihio Zabimaru', cry: 'BANKAI!', cost: 57, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformStages: 2, transformStageNames: ['Hihio Zabimaru', 'Sōō Zabimaru'], transformStageAtk: [1.5, 1.85], transformStageAgi: [1.15, 1.35], transformStageUpkeep: [10, 16], transformUpkeep: 10, transformAtk: 1.5, desc: 'TRANSFORM · Hihio · luego True Bankai Sōō.' },
                { id: 'rally', name: 'Shout', cry: '¡Vamos!', cost: 25, power: 0, type: 'support', partyBuff: { atk: 1.25, damage: 1.15 }, turns: 2, desc: 'ATK/DAÑO del equipo ↑.' }
            ],
            transformedSkills: [
                { id: 'hihio_rush', name: 'Hihio Rush', cry: 'ZABIMARU!', cost: 34, power: 138, type: 'strike', hits: 4, minTransformStage: 1, desc: 'Cuatro embestidas del Bankai.' },
                { id: 'hikotsu_bankai', name: 'Hikotsu Taihō', cry: 'HIKOTSU TAIHO!', cost: 52, power: 180, type: 'fire', minTransformStage: 1, desc: 'Cañonazo del Bankai.' },
                { id: 'zabimaru_roar', name: 'Rugido Zabimaru', cry: '¡Ruge, Zabimaru!', cost: 42, power: 142, type: 'wind', aoe: true, minTransformStage: 1, desc: 'Onda expansiva AoE.' },
                { id: 'soo_awaken', name: 'Sōō Zabimaru', cry: 'TRUE BANKAI!', cost: 40, power: 0, type: 'support', once: true, advanceTransform: true, transformAtk: 1.85, transformAgi: 1.35, transformUpkeep: 16, transformStageName: 'Sōō Zabimaru', minTransformStage: 1, maxTransformStage: 1, desc: 'True Bankai · ATK↑↑ · upkeep alto.' },
                { id: 'zaga_teppo', name: 'Zaga Teppō', cry: 'ZAGA TEPPŌ!', cost: 56, power: 215, type: 'slash', minTransformStage: 2, desc: 'Cañón de fangos · finisher.' },
                { id: 'orochio', name: 'Orochiō', cry: 'OROCHIŌ!', cost: 44, power: 175, type: 'slash', hits: 3, minTransformStage: 2, desc: 'Rey serpiente ×3.' }
            ]
        },
        {
            id: 'shikamaru', name: 'Shikamaru Nara', series: 'Naruto', role: 'Control', roleTag: 'Shadow Strategist',
            img: 'assets/sprites/anim/shikamaru_idle.png', color: '#2c3e50', accent: '#f4d03f',
            resist: ['psy'], weak: ['fire'],
            maxHp: 235, maxSp: 157, atk: 42, def: 22, agi: 28, luk: 26,
            skills: [
                { id: 'kage_shibari', name: 'Kage Shibari', cry: 'Kage Shibari no Jutsu!', cost: 40, power: 62, type: 'curse', debuff: { agi: 0.72 }, debuffTurns: 2, desc: 'Sombra · daño + AGI ↓ (2t)' },
                { id: 'kage_kubishibari', name: 'Kage Kubishibari', cry: '…', cost: 52, power: 110, type: 'curse', desc: 'Estrangulación de sombra.' },
                { id: 'strategy', name: 'Planazo', cry: 'Qué rollo…', cost: 33, power: 0, type: 'support', partyBuff: { luk: 1.25, def: 1.12 }, turns: 2, desc: 'Buff equipo LUK/DEF breve.' },
                { id: 'shadow_hold', name: 'Kage Shibari Hold', cry: 'Got you.', cost: 68, power: 0, type: 'support', once: true, targetEnemy: true, stun: 1, desc: 'Inmoviliza 1 enemigo 1 turno. · 1 uso/combate' }
            ]
        },
        {
            id: 'hinata', name: 'Hinata Hyuga', series: 'Naruto', role: 'Support', roleTag: 'Byakugan',
            img: 'assets/sprites/anim/hinata_idle.png', color: '#5b2c6f', accent: '#d7bde2',
            resist: ['pierce'], weak: ['curse'],
            maxHp: 240, maxSp: 146, atk: 48, def: 24, agi: 34, luk: 22,
            skills: [
                { id: 'hakke', name: 'Hakke Rokujuyon Sho', cry: 'Hakke!', cost: 37, power: 105, type: 'pierce', hits: 4, desc: '64 palmas.' },
                { id: 'air_palm', name: 'Kucho', cry: 'Kucho!', cost: 29, power: 90, type: 'wind', desc: 'Palma de aire.' },
                { id: 'byakugan', name: 'Byakugan', cry: 'Byakugan!', cost: 29, power: 0, type: 'support', partyBuff: { luk: 1.35, agi: 1.2 }, turns: 3, desc: 'Equipo LUK/AGI ↑' },
                { id: 'protect_n', name: 'Protect', cry: '¡Naruto-kun…!', cost: 33, power: 0, type: 'support', allyBuff: { def: 1.55 }, turns: 3, targetAlly: true, desc: 'Escudo a 1 aliado.' }
            ]
        },
        {
            id: 'doflamingo', name: 'Donquixote Doflamingo', series: 'One Piece', role: 'DPS', roleTag: 'Ito Ito',
            img: 'assets/sprites/anim/doflamingo_idle.png', color: '#e74c3c', accent: '#f4d03f',
            transform: true, transformName: 'Awakening · Ito Ito', resist: ['slash', 'pierce'], weak: ['fire'],
            maxHp: 290, maxSp: 140, atk: 66, def: 24, agi: 40, luk: 22,
            skills: [
                { id: 'string_bullet', name: 'Tamaito', cry: 'TAMAITO!', cost: 26, power: 100, type: 'pierce', desc: 'Bala de hilos.' },
                { id: 'overheat', name: 'Overheat', cry: 'OVERHEAT!', cost: 40, power: 130, type: 'slash', desc: 'Látigo de hilos.' },
                { id: 'parasite', name: 'Parasite', cry: 'Parasite!', cost: 34, power: 0, type: 'support', debuff: { atk: 0.7, agi: 0.7 }, debuffTurns: 2, targetEnemy: true, desc: 'Controla hilos · ATK/AGI ↓' },
                { id: 'ito_awaken', name: 'Awakening', cry: 'ITO ITO NO MI!', cost: 70, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.5, transformAgi: 1.3, desc: 'TRANSFORM · despertar de hilos.' }
            ],
            transformedSkills: [
                { id: 'birdcage', name: 'Birdcage', cry: 'BIRDCAGE!', cost: 48, power: 120, type: 'slash', aoe: true, desc: 'Jaula · daño a todos.' },
                { id: 'off_white', name: 'Off White', cry: 'Off White!', cost: 32, power: 145, type: 'pierce', hits: 3, desc: 'Hilos perforantes.' },
                { id: 'string_throne', name: 'Trono de hilos', cry: 'Fufufu…', cost: 30, power: 0, type: 'support', buff: { atk: 1.35, def: 1.25 }, turns: 3, desc: 'ATK/DEF ↑' },
                { id: 'god_thread', name: 'God Thread', cry: 'GOD THREAD!', cost: 72, power: 190, type: 'slash', desc: 'Corte divino de hilos.' }
            ]
        },
        {
            id: 'jiraiya', name: 'Jiraiya', series: 'Naruto', role: 'Caster', roleTag: 'Sannin',
            img: 'assets/sprites/anim/jiraiya_idle.png', color: '#ecf0f1', accent: '#e74c3c',
            transform: true, transformName: 'Sage Mode', resist: ['fire', 'earth'], weak: ['elec'],
            maxHp: 300, maxSp: 155, atk: 60, def: 26, agi: 32, luk: 24,
            skills: [
                { id: 'rasengan_j', name: 'Rasengan', cry: 'RASENGAN!', cost: 30, power: 110, type: 'wind', desc: 'Esfera del Sannin.' },
                { id: 'katon_j', name: 'Katon: Karyu Endan', cry: 'KATON!', cost: 38, power: 118, type: 'fire', aoe: true, desc: 'Dragón de fuego AoE.' },
                { id: 'oil_trap', name: 'Aceite de sapo', cry: '¡Wahaha!', cost: 28, power: 0, type: 'support', debuff: { agi: 0.65 }, debuffTurns: 2, targetEnemy: true, desc: 'Ralentiza · AGI ↓' },
                { id: 'sage_j', name: 'Sage Mode', cry: 'SENNIN MODE!', cost: 68, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.45, transformAgi: 1.25, transformDef: 1.15, desc: 'TRANSFORM · Modo Sabio.' }
            ],
            transformedSkills: [
                { id: 'senpo_rasengan', name: 'Senpo: Rasengan', cry: 'SENPO RASENGAN!', cost: 36, power: 150, type: 'wind', desc: 'Rasengan sabio.' },
                { id: 'frog_kata', name: 'Frog Kata', cry: '¡Ora!', cost: 34, power: 135, type: 'strike', hits: 3, desc: 'Kata de sapo · 3 hits.' },
                { id: 'genjutsu_toad', name: 'Genjutsu sapo', cry: '…', cost: 32, power: 0, type: 'support', debuff: { atk: 0.65 }, debuffTurns: 3, targetEnemy: true, desc: 'ATK enemigo ↓↓' },
                { id: 'cho_odama_j', name: 'Cho Odama Rasengan', cry: 'CHO ODAMA!', cost: 70, power: 200, type: 'wind', desc: 'Nuke sabio.' }
            ]
        }
    ],

    encounters: {
        training: {
            title: 'TRAINING · Muñeco',
            difficulty: 1,
            hint: 'Sandbox. Elige 1–3 chars · SP se recarga · el muñeco no pega. Ideal para probar voces y animaciones.',
            training: true,
            minParty: 1,
            maxParty: 3,
            enemies: [
                {
                    id: 'dummy', name: 'Muñeco de Entrenamiento', img: 'assets/sprites/anim/dummy_idle.png',
                    maxHp: 9999, atk: 0, def: 8, agi: 1, luk: 0, color: '#b03a2e',
                    // Weak to everything so WEAK/floats se ven al testear tipos
                    weak: ['strike', 'slash', 'pierce', 'fire', 'ice', 'elec', 'wind', 'water', 'curse', 'bless', 'psy', 'almighty'],
                    resist: [],
                    ai: 'dummy',
                    skills: [
                        { id: 'dummy_wait', name: '…', cry: '…', power: 0, type: 'support', cost: 0 }
                    ]
                }
            ],
            rewardInvocations: 0
        },
        1: {
            title: 'Tutorial · Arlong Park Echo',
            difficulty: 1,
            hint: 'Agua/Hielo/Rayo pueden derribar a Crocodile. DOWN no es seguro ni puede repetirse seguido. 1 More → All-Out.',
            enemies: [
                {
                    id: 'crocodile', name: 'Crocodile', img: 'assets/enemies/crocodile.webp',
                    maxHp: 283, atk: 39, def: 14, agi: 14, luk: 8, color: '#8d6e63',
                    weak: ['water', 'ice', 'elec'], resist: ['slash'],
                    ai: 'tactical',
                    skills: [
                        { id: 'sables', name: 'Sables', cry: 'SABLES!', power: 45, type: 'wind' },
                        { id: 'ground', name: 'Ground Death', cry: 'GROUND DEATH!', power: 60, type: 'curse' },
                        { id: 'desert', name: 'Desert Spada', cry: 'DESERT SPADA!', power: 53, type: 'slash' }
                    ]
                }
            ],
            rewardInvocations: 65
        },
        2: {
            title: 'Wave 2 · Thunder God & Demon Brothers',
            difficulty: 2,
            hint: 'Varios enemigos. Prioriza debilidades y cura.',
            enemies: [
                {
                    id: 'enel', name: 'Enel', img: 'assets/enemies/enel.webp',
                    maxHp: 307, atk: 49, def: 12, agi: 22, luk: 12, color: '#f4d03f',
                    weak: ['strike'], resist: ['elec'], null: ['elec'],
                    ai: 'assassin',
                    skills: [
                        { id: 'el_thor', name: 'El Thor', cry: 'EL THOR!', power: 69, type: 'elec' },
                        { id: 'vari', name: 'Vari', cry: 'VARI!', power: 50, type: 'elec', aoe: true },
                        { id: 'god', name: 'Goro Goro no Mi', cry: 'I AM GOD!', power: 0, type: 'support', buff: { atk: 1.3 }, turns: 2 }
                    ]
                },
                {
                    id: 'zabuza', name: 'Zabuza Momochi', img: 'assets/enemies/zabuza.webp',
                    maxHp: 236, atk: 46, def: 16, agi: 20, luk: 10, color: '#34495e',
                    weak: ['fire', 'elec'], resist: ['slash'],
                    ai: 'aggressive',
                    skills: [
                        { id: 'kubikiri', name: 'Kubikiri Hack', cry: 'Die!', power: 56, type: 'slash' },
                        { id: 'hidden_mist', name: 'Kirigakure', cry: 'Hidden Mist!', power: 30, type: 'ice' }
                    ]
                }
            ],
            rewardInvocations: 65
        },
        3: {
            title: 'Wave 3 · Snake & CP9',
            difficulty: 3,
            hint: 'Tank + asesino. All-Out Attack cuando todos estén DOWN.',
            enemies: [
                {
                    id: 'orochimaru', name: 'Orochimaru', img: 'assets/enemies/orochimaru.webp',
                    maxHp: 401, atk: 52, def: 18, agi: 18, luk: 14, color: '#6c3483',
                    weak: ['fire', 'bless'], resist: ['curse', 'pierce'],
                    ai: 'tank',
                    skills: [
                        { id: 'snake', name: 'Senpuku', cry: 'Kukukuku...', power: 55, type: 'pierce' },
                        { id: 'kusanagi', name: 'Kusanagi', cry: 'KUSANAGI!', power: 75, type: 'slash' },
                        { id: 'heal_oro', name: 'Regeneration', cry: '...', power: 0, type: 'support', heal: 60 }
                    ]
                },
                {
                    id: 'lucci', name: 'Rob Lucci', img: 'assets/enemies/lucci.webp',
                    maxHp: 260, atk: 55, def: 20, agi: 26, luk: 10, color: '#1c2833',
                    weak: ['elec', 'fire'], resist: ['strike'],
                    ai: 'assassin',
                    skills: [
                        { id: 'rokushiki', name: 'Rokuogan', cry: 'ROKUOGAN!', power: 88, type: 'strike', critBonus: 0.2 },
                        { id: 'shigan', name: 'Shigan', cry: 'SHIGAN!', power: 60, type: 'pierce' }
                    ]
                }
            ],
            rewardInvocations: 65
        },
        4: {
            title: 'Wave 4 · Akatsuki Art Duo',
            difficulty: 4,
            hint: 'Sasori & Deidara. La IA cambia de plan. Cura o mueres.',
            enemies: [
                {
                    id: 'sasori', name: 'Sasori · Hiruko', img: 'assets/sprites/anim/sasori_idle.png',
                    maxHp: 380, atk: 46, def: 72, agi: 16, luk: 12, color: '#922b21',
                    weak: ['fire'], resist: ['slash', 'pierce', 'strike'],
                    armorShell: true, armorBreakName: 'Sasori · Kazekage',
                    armorBreakDefMul: 0.38, armorBreakAtkMul: 1.6, armorScratchPct: 0.015,
                    transform: true, transformName: 'Cuerpo verdadero',
                    ai: 'tactical',
                    skills: [
                        { id: 'poison', name: 'Red Secret Technique', cry: 'Art is eternal...', power: 50, type: 'curse', dot: 16, dotTurns: 3 },
                        { id: 'puppet', name: 'Puppet Assault', cry: '...', power: 63, type: 'pierce' },
                        { id: 'iron', name: 'Iron Sand', cry: 'Sand!', power: 45, type: 'slash', aoe: true },
                        { id: 'sasori_true', name: 'Cuerpo verdadero', cry: 'This is my art!', power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.45, transformAgi: 1.25, transformDef: 0.9, desc: 'TRANSFORM · marioneta humana.' }
                    ],
                    transformedSkills: [
                        { id: 'blade_spin', name: 'Senbon Blades', cry: '...', power: 95, type: 'slash', hits: 4 },
                        { id: 'iron_max', name: 'Iron Sand World', cry: 'Sand!', power: 88, type: 'slash', aoe: true },
                        { id: 'poison_max', name: '100 Puppets', cry: 'Art is eternal!', power: 110, type: 'curse', dot: 20, dotTurns: 3 },
                        { id: 'core_guard', name: 'Heart Seal', cry: '...', power: 0, type: 'support', buff: { def: 1.35 }, turns: 2 }
                    ]
                },
                { id: 'deidara', name: 'Deidara', img: 'assets/sprites/anim/deidara_idle.png',
                    maxHp: 300, atk: 58, def: 16, agi: 28, luk: 18, color: '#f5b041',
                    weak: ['elec', 'slash'], resist: ['fire'],
                    transform: true, transformName: 'C2 · Clay Birds',
                    ai: 'adaptive',
                    skills: [
                        { id: 'c1', name: 'C1 Bombs', cry: 'ART IS AN EXPLOSION!', power: 53, type: 'fire', aoe: true },
                        { id: 'c2', name: 'C2 Dragon', cry: 'KATSU!', power: 81, type: 'fire' },
                        { id: 'clay', name: 'Clay Birds', cry: 'Hn!', power: 48, type: 'wind' },
                        { id: 'deidara_art', name: 'Arte Suprema', cry: 'This is true art!', power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.55, transformAgi: 1.25 }
                    ],
                    transformedSkills: [
                        { id: 'c2_swarm', name: 'C2 Bird Swarm', cry: 'KATSU!', power: 95, type: 'fire', hits: 3 },
                        { id: 'c3', name: 'C3 Giant', cry: 'C3!', power: 110, type: 'fire', aoe: true },
                        { id: 'landmine', name: 'Clay Landmines', cry: 'Hn!', power: 70, type: 'fire' },
                        { id: 'c4', name: 'C4 Karura', cry: 'C4…', power: 0, type: 'support', once: true, debuff: { atk: 0.65, def: 0.7 }, debuffTurns: 3 }
                    ]
                },
                {
                    id: 'kira', name: 'Yoshikage Kira', img: 'assets/enemies/kira.webp',
                    maxHp: 236, atk: 52, def: 16, agi: 22, luk: 20, color: '#f4d03f',
                    weak: ['bless', 'wind'], resist: ['strike'],
                    ai: 'assassin',
                    skills: [
                        { id: 'bomb', name: 'Killer Queen', cry: 'KILLER QUEEN!', power: 73, type: 'curse', critBonus: 0.25 },
                        { id: 'sheer', name: 'Sheer Heart Attack', cry: 'SHEER HEART ATTACK!', power: 56, type: 'fire' }
                    ]
                }
            ],
            rewardInvocations: 65
        },
        5: {
            title: 'Omen · Espada & Stand',
            difficulty: 5,
            hint: 'Antes del boss. No falles.',
            enemies: [
                {
                    id: 'grimmjow', name: 'Grimmjow Jaegerjaquez', img: 'assets/enemies/grimmjow.webp',
                    maxHp: 378, atk: 62, def: 20, agi: 28, luk: 14, color: '#5dade2',
                    weak: ['elec', 'bless'], resist: ['slash'],
                    ai: 'aggressive',
                    skills: [
                        { id: 'desgarron', name: 'Desgarrón', cry: 'DESGARRON!', power: 88, type: 'slash' },
                        { id: 'pantera', name: 'Pantera Blast', cry: 'GRIMMJOW!', power: 63, type: 'strike', aoe: true }
                    ]
                },
                {
                    id: 'ulquiorra', name: 'Ulquiorra Cifer', img: 'assets/enemies/ulquiorra.webp',
                    maxHp: 354, atk: 58, def: 24, agi: 26, luk: 12, color: '#1abc9c',
                    weak: ['fire', 'strike'], resist: ['curse', 'ice'],
                    ai: 'tactical',
                    skills: [
                        { id: 'lanza', name: 'Lanza del Relámpago', cry: 'LANZA DEL RELAMPAGO!', power: 94, type: 'elec' },
                        { id: 'cero', name: 'Cero Oscuras', cry: 'CERO!', power: 69, type: 'curse' },
                        { id: 'solita', name: 'Solita Vista', cry: '...', power: 0, type: 'support', buff: { def: 1.4 }, turns: 2 }
                    ]
                },
                {
                    id: 'diavolo', name: 'Diavolo', img: 'assets/enemies/diavolo.webp',
                    maxHp: 307, atk: 55, def: 18, agi: 30, luk: 18, color: '#8e44ad',
                    weak: ['bless', 'elec'], resist: ['psy'],
                    ai: 'adaptive',
                    skills: [
                        { id: 'king_crimson', name: 'King Crimson', cry: 'KING CRIMSON!', power: 0, type: 'support', skipEnemy: 0, buff: { atk: 1.4, agi: 1.3 }, turns: 2 },
                        { id: 'erase', name: 'Time Erase Strike', cry: 'This is the end!', power: 85, type: 'almighty' },
                        { id: 'doppio', name: 'Doppio Barrage', cry: 'UEEEEE!', power: 60, type: 'strike', hits: 4 }
                    ]
                }
            ],
            rewardInvocations: 65
        },
        // --- Story / free encounters for Persona RPG loop ---
        story_zabuza: {
            title: 'Historia · Niebla Carmesí',
            difficulty: 2,
            hint: 'Zabuza. Analiza. Debilidades. No spamees ataque básico.',
            enemies: [
                {
                    id: 'zabuza', name: 'Zabuza Momochi', img: 'assets/enemies/zabuza.webp',
                    maxHp: 378, atk: 52, def: 18, agi: 22, luk: 12, color: '#34495e',
                    weak: ['fire', 'elec'], resist: ['slash'],
                    ai: 'aggressive',
                    skills: [
                        { id: 'kubikiri', name: 'Kubikiri Hack', cry: 'Die!', power: 62, type: 'slash' },
                        { id: 'hidden_mist', name: 'Kirigakure', cry: 'Hidden Mist!', power: 36, type: 'ice' },
                        { id: 'water', name: 'Suiton', cry: 'Suiton!', power: 55, type: 'water' }
                    ]
                }
            ],
            rewardInvocations: 100
        },
        story_akatsuki: {
            title: 'Historia · Arte Akatsuki',
            difficulty: 4,
            hint: 'Sasori & Deidara. Cura y prioridad de targets.',
            enemies: [
                { id: 'sasori', name: 'Sasori · Hiruko', img: 'assets/sprites/anim/sasori_idle.png',
                    maxHp: 360, atk: 48, def: 68, agi: 16, luk: 12, color: '#922b21',
                    weak: ['fire'], resist: ['slash', 'pierce', 'strike'],
                    armorShell: true, armorBreakName: 'Sasori · Kazekage',
                    armorBreakDefMul: 0.4, armorBreakAtkMul: 1.55, armorScratchPct: 0.015,
                    transform: true, transformName: 'Cuerpo verdadero',
                    ai: 'tactical',
                    skills: [
                        { id: 'poison', name: 'Red Secret Technique', cry: 'Art is eternal...', power: 50, type: 'curse', dot: 16, dotTurns: 3 },
                        { id: 'puppet', name: 'Puppet Assault', cry: '...', power: 63, type: 'pierce' },
                        { id: 'iron', name: 'Iron Sand', cry: 'Sand!', power: 45, type: 'slash', aoe: true },
                        { id: 'sasori_true', name: 'Cuerpo verdadero', cry: 'This is my art!', power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.45, transformAgi: 1.25, transformDef: 0.9 }
                    ],
                    transformedSkills: [
                        { id: 'blade_spin', name: 'Senbon Blades', cry: '...', power: 95, type: 'slash', hits: 4 },
                        { id: 'iron_max', name: 'Iron Sand World', cry: 'Sand!', power: 88, type: 'slash', aoe: true },
                        { id: 'poison_max', name: '100 Puppets', cry: 'Art is eternal!', power: 110, type: 'curse', dot: 20, dotTurns: 3 },
                        { id: 'core_guard', name: 'Heart Seal', cry: '...', power: 0, type: 'support', buff: { def: 1.35 }, turns: 2 }
                    ]
                },
                { id: 'deidara', name: 'Deidara', img: 'assets/sprites/anim/deidara_idle.png',
                    maxHp: 300, atk: 58, def: 16, agi: 28, luk: 18, color: '#f5b041',
                    weak: ['elec', 'slash'], resist: ['fire'],
                    transform: true, transformName: 'C2 · Clay Birds',
                    ai: 'adaptive',
                    skills: [
                        { id: 'c1', name: 'C1 Bombs', cry: 'ART IS AN EXPLOSION!', power: 53, type: 'fire', aoe: true },
                        { id: 'c2', name: 'C2 Dragon', cry: 'KATSU!', power: 81, type: 'fire' },
                        { id: 'clay', name: 'Clay Birds', cry: 'Hn!', power: 48, type: 'wind' },
                        { id: 'deidara_art', name: 'Arte Suprema', cry: 'This is true art!', power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.55, transformAgi: 1.25 }
                    ],
                    transformedSkills: [
                        { id: 'c2_swarm', name: 'C2 Bird Swarm', cry: 'KATSU!', power: 95, type: 'fire', hits: 3 },
                        { id: 'c3', name: 'C3 Giant', cry: 'C3!', power: 110, type: 'fire', aoe: true },
                        { id: 'landmine', name: 'Clay Landmines', cry: 'Hn!', power: 70, type: 'fire' },
                        { id: 'c4', name: 'C4 Karura', cry: 'C4…', power: 0, type: 'support', once: true, debuff: { atk: 0.65, def: 0.7 }, debuffTurns: 3 }
                    ]
                }
            ],
            rewardInvocations: 115
        },
        story_orochimaru: {
            title: 'Historia · Laboratorio Serpiente',
            difficulty: 6,
            hint: 'Orochimaru tank. Fuego / bendición.',
            enemies: [
                {
                    id: 'orochimaru', name: 'Orochimaru', img: 'assets/enemies/orochimaru.webp',
                    maxHp: 566, atk: 58, def: 22, agi: 20, luk: 16, color: '#6c3483',
                    weak: ['fire', 'bless'], resist: ['curse', 'pierce'],
                    ai: 'tank',
                    skills: [
                        { id: 'snake', name: 'Senpuku', cry: 'Kukukuku...', power: 60, type: 'pierce' },
                        { id: 'kusanagi', name: 'Kusanagi', cry: 'KUSANAGI!', power: 82, type: 'slash' },
                        { id: 'heal_oro', name: 'Regeneration', cry: '...', power: 0, type: 'support', heal: 70 }
                    ]
                }
            ],
            rewardInvocations: 130
        },
        story_alliance: {
            title: 'Historia · Alianza Maldita',
            difficulty: 7,
            aiAoEChance: 0.62,
            aiHealerFocus: 0.65,
            hint: 'DIO + Kira. Ambos pueden despertar Stands. Prioriza y cura.',
            enemies: [
                {
                    id: 'dio', name: 'DIO', img: 'assets/enemies/dio.webp',
                    maxHp: 448, atk: 63, def: 22, agi: 26, luk: 20, color: '#f4d03f',
                    weak: ['bless', 'wind'], resist: ['strike'],
                    ai: 'bosslet',
                    skills: [
                        { id: 'muda', name: 'MUDA MUDA!', cry: 'MUDA MUDA MUDA!', power: 70, type: 'strike', hits: 4 },
                        { id: 'the_world', name: 'ZA WARUDO', cry: 'ZA WARUDO!', power: 0, type: 'support', buff: { atk: 1.35 }, turns: 2 },
                        { id: 'road', name: 'ROAD ROLLER DA!', cry: 'ROAD ROLLER DA!', power: 100, type: 'almighty' }
                    ]
                },
                {
                    id: 'kira', name: 'Yoshikage Kira', img: 'assets/enemies/kira.webp',
                    maxHp: 307, atk: 56, def: 16, agi: 24, luk: 22, color: '#f4d03f',
                    weak: ['bless', 'wind'], resist: ['strike'],
                    ai: 'assassin',
                    skills: [
                        { id: 'bomb', name: 'Killer Queen', cry: 'KILLER QUEEN!', power: 78, type: 'curse', critBonus: 0.25 },
                        { id: 'sheer', name: 'Sheer Heart Attack', cry: 'SHEER HEART ATTACK!', power: 60, type: 'fire' }
                    ]
                }
            ],
            rewardInvocations: 155
        },
        story_aizen: {
            title: 'Historia · Kyoka Suigetsu',
            difficulty: 8,
            enemySkillScale: 1.1,
            aiHealerFocus: 0.72,
            hint: 'Aizen. Bajo presión libera Muken. Empuja fuego / control.',
            enemies: [
                {
                    id: 'aizen', name: 'Sosuke Aizen', img: 'assets/enemies/aizen.webp',
                    maxHp: 614, atk: 65, def: 28, agi: 24, luk: 22, color: '#7d3c98',
                    weak: ['fire'], resist: ['psy', 'curse'], null: ['bless'],
                    ai: 'final_boss',
                    skills: [
                        { id: 'kyoka', name: 'Kyoka Suigetsu', cry: 'KYOKA SUIGETSU...', power: 0, type: 'support', buff: { luk: 1.5, def: 1.3 }, turns: 2 },
                        { id: 'hadou', name: 'Hadou 90 Kurohitsugi', cry: 'KUROHITSUGI!', power: 110, type: 'curse' },
                        { id: 'fragor', name: 'Fragor', cry: '...', power: 92, type: 'almighty', aoe: true }
                    ]
                }
            ],
            rewardInvocations: 190
        },
        free_1: {
            title: 'Patrulla · Eco de Arena',
            difficulty: 2,
            hint: 'Práctica. Crocodile otra vez, más suave… o no.',
            enemies: [
                {
                    id: 'crocodile', name: 'Crocodile', img: 'assets/enemies/crocodile.webp',
                    maxHp: 330, atk: 45, def: 16, agi: 14, luk: 8, color: '#8d6e63',
                    weak: ['water', 'ice', 'elec'], resist: ['slash'],
                    ai: 'tactical',
                    skills: [
                        { id: 'sables', name: 'Sables', cry: 'SABLES!', power: 48, type: 'wind' },
                        { id: 'desert', name: 'Desert Spada', cry: 'DESERT SPADA!', power: 58, type: 'slash' }
                    ]
                }
            ],
            rewardInvocations: 55
        },
        free_2: {
            title: 'Bosque · Trueno y Niebla',
            difficulty: 3,
            hint: 'Enel + Zabuza. Prioriza.',
            enemies: [
                {
                    id: 'enel', name: 'Enel', img: 'assets/enemies/enel.webp',
                    maxHp: 354, atk: 54, def: 12, agi: 24, luk: 12, color: '#f4d03f',
                    weak: ['strike'], resist: ['elec'], null: ['elec'],
                    ai: 'assassin',
                    skills: [
                        { id: 'el_thor', name: 'El Thor', cry: 'EL THOR!', power: 72, type: 'elec' },
                        { id: 'vari', name: 'Vari', cry: 'VARI!', power: 52, type: 'elec', aoe: true }
                    ]
                },
                {
                    id: 'zabuza', name: 'Zabuza Momochi', img: 'assets/enemies/zabuza.webp',
                    maxHp: 283, atk: 49, def: 16, agi: 20, luk: 10, color: '#34495e',
                    weak: ['fire', 'elec'], resist: ['slash'],
                    ai: 'aggressive',
                    skills: [
                        { id: 'kubikiri', name: 'Kubikiri Hack', cry: 'Die!', power: 58, type: 'slash' }
                    ]
                }
            ],
            rewardInvocations: 55
        },
        free_3: {
            title: 'Torre · Piso de Ensayo',
            difficulty: 4,
            hint: 'Grimmjow & Ulquiorra. Ensayo del final.',
            enemies: [
                {
                    id: 'grimmjow', name: 'Grimmjow Jaegerjaquez', img: 'assets/enemies/grimmjow.webp',
                    maxHp: 401, atk: 63, def: 20, agi: 28, luk: 14, color: '#5dade2',
                    weak: ['elec', 'bless'], resist: ['slash'],
                    ai: 'aggressive',
                    skills: [
                        { id: 'desgarron', name: 'Desgarrón', cry: 'DESGARRON!', power: 90, type: 'slash' },
                        { id: 'pantera', name: 'Pantera Blast', cry: 'GRIMMJOW!', power: 66, type: 'strike', aoe: true }
                    ]
                },
                {
                    id: 'ulquiorra', name: 'Ulquiorra Cifer', img: 'assets/enemies/ulquiorra.webp',
                    maxHp: 378, atk: 60, def: 24, agi: 26, luk: 12, color: '#1abc9c',
                    weak: ['fire', 'strike'], resist: ['curse', 'ice'],
                    ai: 'tactical',
                    skills: [
                        { id: 'lanza', name: 'Lanza del Relámpago', cry: 'LANZA DEL RELAMPAGO!', power: 96, type: 'elec' },
                        { id: 'cero', name: 'Cero Oscuras', cry: 'CERO!', power: 72, type: 'curse' }
                    ]
                }
            ],
            rewardInvocations: 55
        },
        // --- Extra waves / practice: enough unique clears for pity without repeats ---
        6: {
            title: 'Wave 6 · CP9 Shadow',
            difficulty: 4,
            hint: 'Lucci a solas. Crits y velocidad.',
            enemies: [
                {
                    id: 'lucci', name: 'Rob Lucci', img: 'assets/enemies/lucci.webp',
                    maxHp: 420, atk: 62, def: 22, agi: 30, luk: 12, color: '#1c2833',
                    weak: ['elec', 'fire'], resist: ['strike'],
                    ai: 'assassin',
                    skills: [
                        { id: 'rokushiki', name: 'Rokuogan', cry: 'ROKUOGAN!', power: 95, type: 'strike', critBonus: 0.25 },
                        { id: 'shigan', name: 'Shigan', cry: 'SHIGAN!', power: 68, type: 'pierce' },
                        { id: 'tekka', name: 'Tekkai', cry: 'Tekkai!', power: 0, type: 'support', buff: { def: 1.5 }, turns: 2 }
                    ]
                }
            ],
            rewardInvocations: 65
        },
        7: {
            title: 'Wave 7 · Arena & God',
            difficulty: 4,
            hint: 'Crocodile + Enel. Agua/hielo/golpe.',
            enemies: [
                {
                    id: 'crocodile', name: 'Crocodile', img: 'assets/enemies/crocodile.webp',
                    maxHp: 360, atk: 52, def: 18, agi: 16, luk: 10, color: '#8d6e63',
                    weak: ['water', 'ice', 'elec'], resist: ['slash'],
                    ai: 'tactical',
                    skills: [
                        { id: 'sables', name: 'Sables', cry: 'SABLES!', power: 55, type: 'wind' },
                        { id: 'desert', name: 'Desert Spada', cry: 'DESERT SPADA!', power: 70, type: 'slash' }
                    ]
                },
                {
                    id: 'enel', name: 'Enel', img: 'assets/enemies/enel.webp',
                    maxHp: 340, atk: 58, def: 12, agi: 26, luk: 14, color: '#f4d03f',
                    weak: ['strike'], resist: ['elec'], null: ['elec'],
                    ai: 'assassin',
                    skills: [
                        { id: 'el_thor', name: 'El Thor', cry: 'EL THOR!', power: 78, type: 'elec' },
                        { id: 'vari', name: 'Vari', cry: 'VARI!', power: 55, type: 'elec', aoe: true }
                    ]
                }
            ],
            rewardInvocations: 65
        },
        8: {
            title: 'Wave 8 · Time Erase',
            difficulty: 5,
            hint: 'Diavolo. No dejes que acumule buffs.',
            enemies: [
                {
                    id: 'diavolo', name: 'Diavolo', img: 'assets/enemies/diavolo.webp',
                    maxHp: 450, atk: 60, def: 20, agi: 32, luk: 20, color: '#8e44ad',
                    weak: ['bless', 'elec'], resist: ['psy'],
                    ai: 'adaptive',
                    skills: [
                        { id: 'king_crimson', name: 'King Crimson', cry: 'KING CRIMSON!', power: 0, type: 'support', buff: { atk: 1.4, agi: 1.3 }, turns: 2 },
                        { id: 'erase', name: 'Time Erase Strike', cry: 'This is the end!', power: 92, type: 'almighty' },
                        { id: 'doppio', name: 'Doppio Barrage', cry: 'UEEEEE!', power: 65, type: 'strike', hits: 4 }
                    ]
                }
            ],
            rewardInvocations: 65
        },
        9: {
            title: 'Wave 9 · Hueco Mundo Raid',
            difficulty: 5,
            hint: 'Grimmjow + Ulquiorra + Lucci. Prioriza.',
            enemies: [
                {
                    id: 'grimmjow', name: 'Grimmjow', img: 'assets/enemies/grimmjow.webp',
                    maxHp: 320, atk: 60, def: 18, agi: 28, luk: 12, color: '#5dade2',
                    weak: ['elec', 'bless'], resist: ['slash'],
                    ai: 'aggressive',
                    skills: [
                        { id: 'desgarron', name: 'Desgarrón', cry: 'DESGARRON!', power: 86, type: 'slash' },
                        { id: 'pantera', name: 'Pantera Blast', cry: 'GRIMMJOW!', power: 62, type: 'strike', aoe: true }
                    ]
                },
                {
                    id: 'ulquiorra', name: 'Ulquiorra', img: 'assets/enemies/ulquiorra.webp',
                    maxHp: 300, atk: 56, def: 22, agi: 24, luk: 12, color: '#1abc9c',
                    weak: ['fire', 'strike'], resist: ['curse', 'ice'],
                    ai: 'tactical',
                    skills: [
                        { id: 'cero', name: 'Cero Oscuras', cry: 'CERO!', power: 74, type: 'curse' },
                        { id: 'lanza', name: 'Lanza', cry: 'LANZA!', power: 90, type: 'elec' }
                    ]
                },
                {
                    id: 'lucci', name: 'Rob Lucci', img: 'assets/enemies/lucci.webp',
                    maxHp: 260, atk: 58, def: 18, agi: 28, luk: 10, color: '#1c2833',
                    weak: ['elec', 'fire'], resist: ['strike'],
                    ai: 'assassin',
                    skills: [
                        { id: 'rokushiki', name: 'Rokuogan', cry: 'ROKUOGAN!', power: 84, type: 'strike', critBonus: 0.2 }
                    ]
                }
            ],
            rewardInvocations: 65
        },
        10: {
            title: 'Wave 10 · Serpent Puppet',
            difficulty: 6,
            hint: 'Orochimaru + Sasori. Fuego / bendición.',
            enemies: [
                {
                    id: 'orochimaru', name: 'Orochimaru', img: 'assets/enemies/orochimaru.webp',
                    maxHp: 480, atk: 58, def: 22, agi: 20, luk: 16, color: '#6c3483',
                    weak: ['fire', 'bless'], resist: ['curse', 'pierce'],
                    ai: 'tank',
                    skills: [
                        { id: 'kusanagi', name: 'Kusanagi', cry: 'KUSANAGI!', power: 85, type: 'slash' },
                        { id: 'heal_oro', name: 'Regeneration', cry: '...', power: 0, type: 'support', heal: 75 }
                    ]
                },
                { id: 'sasori', name: 'Sasori · Hiruko', img: 'assets/sprites/anim/sasori_idle.png',
                    maxHp: 360, atk: 48, def: 68, agi: 16, luk: 12, color: '#922b21',
                    weak: ['fire'], resist: ['slash', 'pierce', 'strike'],
                    armorShell: true, armorBreakName: 'Sasori · Kazekage',
                    armorBreakDefMul: 0.4, armorBreakAtkMul: 1.55, armorScratchPct: 0.015,
                    transform: true, transformName: 'Cuerpo verdadero',
                    ai: 'tactical',
                    skills: [
                        { id: 'poison', name: 'Red Secret Technique', cry: 'Art is eternal...', power: 50, type: 'curse', dot: 16, dotTurns: 3 },
                        { id: 'puppet', name: 'Puppet Assault', cry: '...', power: 63, type: 'pierce' },
                        { id: 'iron', name: 'Iron Sand', cry: 'Sand!', power: 45, type: 'slash', aoe: true },
                        { id: 'sasori_true', name: 'Cuerpo verdadero', cry: 'This is my art!', power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.45, transformAgi: 1.25, transformDef: 0.9 }
                    ],
                    transformedSkills: [
                        { id: 'blade_spin', name: 'Senbon Blades', cry: '...', power: 95, type: 'slash', hits: 4 },
                        { id: 'iron_max', name: 'Iron Sand World', cry: 'Sand!', power: 88, type: 'slash', aoe: true },
                        { id: 'poison_max', name: '100 Puppets', cry: 'Art is eternal!', power: 110, type: 'curse', dot: 20, dotTurns: 3 },
                        { id: 'core_guard', name: 'Heart Seal', cry: '...', power: 0, type: 'support', buff: { def: 1.35 }, turns: 2 }
                    ]
                }
            ],
            rewardInvocations: 65
        },
        11: {
            title: 'Wave 11 · Quiet Life Bomb',
            difficulty: 6,
            hint: 'Kira + Deidara. Bendición / viento / rayo.',
            enemies: [
                {
                    id: 'kira', name: 'Yoshikage Kira', img: 'assets/enemies/kira.webp',
                    maxHp: 360, atk: 60, def: 18, agi: 26, luk: 22, color: '#f4d03f',
                    weak: ['bless', 'wind'], resist: ['strike'],
                    ai: 'assassin',
                    skills: [
                        { id: 'bomb', name: 'Killer Queen', cry: 'KILLER QUEEN!', power: 82, type: 'curse', critBonus: 0.25 },
                        { id: 'sheer', name: 'Sheer Heart Attack', cry: 'SHEER HEART ATTACK!', power: 64, type: 'fire' }
                    ]
                },
                { id: 'deidara', name: 'Deidara', img: 'assets/sprites/anim/deidara_idle.png',
                    maxHp: 300, atk: 58, def: 16, agi: 28, luk: 18, color: '#f5b041',
                    weak: ['elec', 'slash'], resist: ['fire'],
                    transform: true, transformName: 'C2 · Clay Birds',
                    ai: 'adaptive',
                    skills: [
                        { id: 'c1', name: 'C1 Bombs', cry: 'ART IS AN EXPLOSION!', power: 53, type: 'fire', aoe: true },
                        { id: 'c2', name: 'C2 Dragon', cry: 'KATSU!', power: 81, type: 'fire' },
                        { id: 'clay', name: 'Clay Birds', cry: 'Hn!', power: 48, type: 'wind' },
                        { id: 'deidara_art', name: 'Arte Suprema', cry: 'This is true art!', power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.55, transformAgi: 1.25 }
                    ],
                    transformedSkills: [
                        { id: 'c2_swarm', name: 'C2 Bird Swarm', cry: 'KATSU!', power: 95, type: 'fire', hits: 3 },
                        { id: 'c3', name: 'C3 Giant', cry: 'C3!', power: 110, type: 'fire', aoe: true },
                        { id: 'landmine', name: 'Clay Landmines', cry: 'Hn!', power: 70, type: 'fire' },
                        { id: 'c4', name: 'C4 Karura', cry: 'C4…', power: 0, type: 'support', once: true, debuff: { atk: 0.65, def: 0.7 }, debuffTurns: 3 }
                    ]
                }
            ],
            rewardInvocations: 65
        },
        12: {
            title: 'Wave 12 · World & Illusion',
            difficulty: 7,
            hint: 'DIO + Aizen (versión menor). Ensayo del boss.',
            enemies: [
                {
                    id: 'dio', name: 'DIO', img: 'assets/enemies/dio.webp',
                    maxHp: 420, atk: 64, def: 22, agi: 26, luk: 20, color: '#f4d03f',
                    weak: ['bless', 'wind'], resist: ['strike'],
                    ai: 'bosslet',
                    skills: [
                        { id: 'muda', name: 'MUDA MUDA!', cry: 'MUDA MUDA MUDA!', power: 72, type: 'strike', hits: 4 },
                        { id: 'the_world', name: 'ZA WARUDO', cry: 'ZA WARUDO!', power: 0, type: 'support', buff: { atk: 1.35 }, turns: 2 },
                        { id: 'road', name: 'ROAD ROLLER DA!', cry: 'ROAD ROLLER DA!', power: 105, type: 'almighty' }
                    ]
                },
                {
                    id: 'aizen', name: 'Sosuke Aizen', img: 'assets/enemies/aizen.webp',
                    maxHp: 400, atk: 60, def: 24, agi: 22, luk: 18, color: '#7d3c98',
                    weak: ['fire'], resist: ['psy', 'curse'], null: ['bless'],
                    ai: 'final_boss',
                    skills: [
                        { id: 'kyoka', name: 'Kyoka Suigetsu', cry: 'KYOKA SUIGETSU...', power: 0, type: 'support', buff: { luk: 1.4, def: 1.25 }, turns: 2 },
                        { id: 'hadou', name: 'Hadou 90', cry: 'KUROHITSUGI!', power: 100, type: 'curse' }
                    ]
                }
            ],
            rewardInvocations: 65
        },
        free_4: {
            title: 'Práctica · Niebla Solo',
            difficulty: 2,
            hint: 'Zabuza. Fuego / rayo.',
            enemies: [
                {
                    id: 'zabuza', name: 'Zabuza Momochi', img: 'assets/enemies/zabuza.webp',
                    maxHp: 320, atk: 50, def: 16, agi: 20, luk: 10, color: '#34495e',
                    weak: ['fire', 'elec'], resist: ['slash'],
                    ai: 'aggressive',
                    skills: [
                        { id: 'kubikiri', name: 'Kubikiri Hack', cry: 'Die!', power: 60, type: 'slash' },
                        { id: 'water', name: 'Suiton', cry: 'Suiton!', power: 52, type: 'water' }
                    ]
                }
            ],
            rewardInvocations: 55
        },
        free_5: {
            title: 'Práctica · Dios del Trueno',
            difficulty: 3,
            hint: 'Enel. Golpea con STRIKE.',
            enemies: [
                {
                    id: 'enel', name: 'Enel', img: 'assets/enemies/enel.webp',
                    maxHp: 380, atk: 56, def: 12, agi: 26, luk: 14, color: '#f4d03f',
                    weak: ['strike'], resist: ['elec'], null: ['elec'],
                    ai: 'assassin',
                    skills: [
                        { id: 'el_thor', name: 'El Thor', cry: 'EL THOR!', power: 80, type: 'elec' },
                        { id: 'vari', name: 'Vari', cry: 'VARI!', power: 55, type: 'elec', aoe: true },
                        { id: 'god', name: 'Goro Goro', cry: 'I AM GOD!', power: 0, type: 'support', buff: { atk: 1.25 }, turns: 2 }
                    ]
                }
            ],
            rewardInvocations: 55
        },
        free_6: {
            title: 'Práctica · Arte Rojo',
            difficulty: 3,
            hint: 'Sasori solo. Fuego / golpe.',
            enemies: [
                { id: 'sasori', name: 'Sasori · Hiruko', img: 'assets/sprites/anim/sasori_idle.png',
                    maxHp: 360, atk: 48, def: 68, agi: 16, luk: 12, color: '#922b21',
                    weak: ['fire'], resist: ['slash', 'pierce', 'strike'],
                    armorShell: true, armorBreakName: 'Sasori · Kazekage',
                    armorBreakDefMul: 0.4, armorBreakAtkMul: 1.55, armorScratchPct: 0.015,
                    transform: true, transformName: 'Cuerpo verdadero',
                    ai: 'tactical',
                    skills: [
                        { id: 'poison', name: 'Red Secret Technique', cry: 'Art is eternal...', power: 50, type: 'curse', dot: 16, dotTurns: 3 },
                        { id: 'puppet', name: 'Puppet Assault', cry: '...', power: 63, type: 'pierce' },
                        { id: 'iron', name: 'Iron Sand', cry: 'Sand!', power: 45, type: 'slash', aoe: true },
                        { id: 'sasori_true', name: 'Cuerpo verdadero', cry: 'This is my art!', power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.45, transformAgi: 1.25, transformDef: 0.9 }
                    ],
                    transformedSkills: [
                        { id: 'blade_spin', name: 'Senbon Blades', cry: '...', power: 95, type: 'slash', hits: 4 },
                        { id: 'iron_max', name: 'Iron Sand World', cry: 'Sand!', power: 88, type: 'slash', aoe: true },
                        { id: 'poison_max', name: '100 Puppets', cry: 'Art is eternal!', power: 110, type: 'curse', dot: 20, dotTurns: 3 },
                        { id: 'core_guard', name: 'Heart Seal', cry: '...', power: 0, type: 'support', buff: { def: 1.35 }, turns: 2 }
                    ]
                }
            ],
            rewardInvocations: 55
        },
        free_7: {
            title: 'Práctica · Explosión',
            difficulty: 3,
            hint: 'Deidara. Rayo / corte.',
            enemies: [
                { id: 'deidara', name: 'Deidara', img: 'assets/sprites/anim/deidara_idle.png',
                    maxHp: 300, atk: 58, def: 16, agi: 28, luk: 18, color: '#f5b041',
                    weak: ['elec', 'slash'], resist: ['fire'],
                    transform: true, transformName: 'C2 · Clay Birds',
                    ai: 'adaptive',
                    skills: [
                        { id: 'c1', name: 'C1 Bombs', cry: 'ART IS AN EXPLOSION!', power: 53, type: 'fire', aoe: true },
                        { id: 'c2', name: 'C2 Dragon', cry: 'KATSU!', power: 81, type: 'fire' },
                        { id: 'clay', name: 'Clay Birds', cry: 'Hn!', power: 48, type: 'wind' },
                        { id: 'deidara_art', name: 'Arte Suprema', cry: 'This is true art!', power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.55, transformAgi: 1.25 }
                    ],
                    transformedSkills: [
                        { id: 'c2_swarm', name: 'C2 Bird Swarm', cry: 'KATSU!', power: 95, type: 'fire', hits: 3 },
                        { id: 'c3', name: 'C3 Giant', cry: 'C3!', power: 110, type: 'fire', aoe: true },
                        { id: 'landmine', name: 'Clay Landmines', cry: 'Hn!', power: 70, type: 'fire' },
                        { id: 'c4', name: 'C4 Karura', cry: 'C4…', power: 0, type: 'support', once: true, debuff: { atk: 0.65, def: 0.7 }, debuffTurns: 3 }
                    ]
                }
            ],
            rewardInvocations: 55
        },
        free_8: {
            title: 'Práctica · Pantera',
            difficulty: 4,
            hint: 'Grimmjow. Rayo / bendición.',
            enemies: [
                {
                    id: 'grimmjow', name: 'Grimmjow Jaegerjaquez', img: 'assets/enemies/grimmjow.webp',
                    maxHp: 440, atk: 66, def: 20, agi: 30, luk: 14, color: '#5dade2',
                    weak: ['elec', 'bless'], resist: ['slash'],
                    ai: 'aggressive',
                    skills: [
                        { id: 'desgarron', name: 'Desgarrón', cry: 'DESGARRON!', power: 95, type: 'slash' },
                        { id: 'pantera', name: 'Pantera Blast', cry: 'GRIMMJOW!', power: 70, type: 'strike', aoe: true }
                    ]
                }
            ],
            rewardInvocations: 55
        },
        free_9: {
            title: 'Práctica · Cuarta Espada',
            difficulty: 4,
            hint: 'Ulquiorra. Fuego / golpe.',
            enemies: [
                {
                    id: 'ulquiorra', name: 'Ulquiorra Cifer', img: 'assets/enemies/ulquiorra.webp',
                    maxHp: 430, atk: 62, def: 26, agi: 26, luk: 12, color: '#1abc9c',
                    weak: ['fire', 'strike'], resist: ['curse', 'ice'],
                    ai: 'tactical',
                    skills: [
                        { id: 'lanza', name: 'Lanza del Relámpago', cry: 'LANZA!', power: 100, type: 'elec' },
                        { id: 'cero', name: 'Cero Oscuras', cry: 'CERO!', power: 76, type: 'curse' },
                        { id: 'solita', name: 'Solita Vista', cry: '...', power: 0, type: 'support', buff: { def: 1.4 }, turns: 2 }
                    ]
                }
            ],
            rewardInvocations: 55
        },
        free_10: {
            title: 'Práctica · Killer Queen',
            difficulty: 5,
            hint: 'Kira. Bendición / viento.',
            enemies: [
                {
                    id: 'kira', name: 'Yoshikage Kira', img: 'assets/enemies/kira.webp',
                    maxHp: 400, atk: 62, def: 18, agi: 26, luk: 24, color: '#f4d03f',
                    weak: ['bless', 'wind'], resist: ['strike'],
                    ai: 'assassin',
                    skills: [
                        { id: 'bomb', name: 'Killer Queen', cry: 'KILLER QUEEN!', power: 88, type: 'curse', critBonus: 0.3 },
                        { id: 'sheer', name: 'Sheer Heart Attack', cry: 'SHEER HEART ATTACK!', power: 68, type: 'fire' }
                    ]
                }
            ],
            rewardInvocations: 55
        },
        free_11: {
            title: 'Práctica · King Crimson',
            difficulty: 5,
            hint: 'Diavolo. Bendición / rayo.',
            enemies: [
                {
                    id: 'diavolo', name: 'Diavolo', img: 'assets/enemies/diavolo.webp',
                    maxHp: 420, atk: 60, def: 20, agi: 32, luk: 20, color: '#8e44ad',
                    weak: ['bless', 'elec'], resist: ['psy'],
                    ai: 'adaptive',
                    skills: [
                        { id: 'king_crimson', name: 'King Crimson', cry: 'KING CRIMSON!', power: 0, type: 'support', buff: { atk: 1.35, agi: 1.25 }, turns: 2 },
                        { id: 'erase', name: 'Time Erase Strike', cry: 'This is the end!', power: 95, type: 'almighty' }
                    ]
                }
            ],
            rewardInvocations: 55
        },
        free_12: {
            title: 'Práctica · The World',
            difficulty: 6,
            hint: 'DIO solo. Bendición / viento.',
            enemies: [
                {
                    id: 'dio', name: 'DIO', img: 'assets/enemies/dio.webp',
                    maxHp: 480, atk: 66, def: 24, agi: 28, luk: 22, color: '#f4d03f',
                    weak: ['bless', 'wind'], resist: ['strike'],
                    ai: 'bosslet',
                    skills: [
                        { id: 'muda', name: 'MUDA MUDA!', cry: 'MUDA MUDA MUDA!', power: 75, type: 'strike', hits: 5 },
                        { id: 'the_world', name: 'ZA WARUDO', cry: 'ZA WARUDO!', power: 0, type: 'support', buff: { atk: 1.4 }, turns: 2 },
                        { id: 'road', name: 'ROAD ROLLER DA!', cry: 'ROAD ROLLER DA!', power: 110, type: 'almighty' }
                    ]
                }
            ],
            rewardInvocations: 55
        },
        side_mist_duo: {
            title: 'Extra · Niebla Gemela',
            difficulty: 3,
            hint: 'Dos Zabuza-eco. Fuego / rayo en AoE.',
            enemies: [
                {
                    id: 'zabuza', name: 'Zabuza', img: 'assets/enemies/zabuza.webp',
                    maxHp: 260, atk: 48, def: 16, agi: 20, luk: 10, color: '#34495e',
                    weak: ['fire', 'elec'], resist: ['slash'],
                    ai: 'aggressive',
                    skills: [
                        { id: 'kubikiri', name: 'Kubikiri', cry: 'Die!', power: 58, type: 'slash' }
                    ]
                },
                {
                    id: 'lucci', name: 'Lucci · Eco', img: 'assets/enemies/lucci.webp',
                    maxHp: 240, atk: 52, def: 18, agi: 26, luk: 10, color: '#1c2833',
                    weak: ['elec', 'fire'], resist: ['strike'],
                    ai: 'assassin',
                    skills: [
                        { id: 'shigan', name: 'Shigan', cry: 'SHIGAN!', power: 62, type: 'pierce' }
                    ]
                }
            ],
            rewardInvocations: 70
        },
        side_clay_sand: {
            title: 'Extra · Arcilla & Arena',
            difficulty: 4,
            hint: 'Deidara + Crocodile.',
            enemies: [
                { id: 'deidara', name: 'Deidara', img: 'assets/sprites/anim/deidara_idle.png',
                    maxHp: 300, atk: 58, def: 16, agi: 28, luk: 18, color: '#f5b041',
                    weak: ['elec', 'slash'], resist: ['fire'],
                    transform: true, transformName: 'C2 · Clay Birds',
                    ai: 'adaptive',
                    skills: [
                        { id: 'c1', name: 'C1 Bombs', cry: 'ART IS AN EXPLOSION!', power: 53, type: 'fire', aoe: true },
                        { id: 'c2', name: 'C2 Dragon', cry: 'KATSU!', power: 81, type: 'fire' },
                        { id: 'clay', name: 'Clay Birds', cry: 'Hn!', power: 48, type: 'wind' },
                        { id: 'deidara_art', name: 'Arte Suprema', cry: 'This is true art!', power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.55, transformAgi: 1.25 }
                    ],
                    transformedSkills: [
                        { id: 'c2_swarm', name: 'C2 Bird Swarm', cry: 'KATSU!', power: 95, type: 'fire', hits: 3 },
                        { id: 'c3', name: 'C3 Giant', cry: 'C3!', power: 110, type: 'fire', aoe: true },
                        { id: 'landmine', name: 'Clay Landmines', cry: 'Hn!', power: 70, type: 'fire' },
                        { id: 'c4', name: 'C4 Karura', cry: 'C4…', power: 0, type: 'support', once: true, debuff: { atk: 0.65, def: 0.7 }, debuffTurns: 3 }
                    ]
                },
                {
                    id: 'crocodile', name: 'Crocodile', img: 'assets/enemies/crocodile.webp',
                    maxHp: 320, atk: 50, def: 18, agi: 14, luk: 8, color: '#8d6e63',
                    weak: ['water', 'ice', 'elec'], resist: ['slash'],
                    ai: 'tactical',
                    skills: [
                        { id: 'desert', name: 'Desert Spada', cry: 'DESERT SPADA!', power: 65, type: 'slash' }
                    ]
                }
            ],
            rewardInvocations: 70
        },
        side_espada_stand: {
            title: 'Extra · Espada & Stand',
            difficulty: 5,
            hint: 'Ulquiorra + Diavolo.',
            enemies: [
                {
                    id: 'ulquiorra', name: 'Ulquiorra', img: 'assets/enemies/ulquiorra.webp',
                    maxHp: 340, atk: 58, def: 24, agi: 24, luk: 12, color: '#1abc9c',
                    weak: ['fire', 'strike'], resist: ['curse'],
                    ai: 'tactical',
                    skills: [
                        { id: 'cero', name: 'Cero', cry: 'CERO!', power: 78, type: 'curse' }
                    ]
                },
                {
                    id: 'diavolo', name: 'Diavolo', img: 'assets/enemies/diavolo.webp',
                    maxHp: 320, atk: 56, def: 18, agi: 30, luk: 18, color: '#8e44ad',
                    weak: ['bless', 'elec'], resist: ['psy'],
                    ai: 'adaptive',
                    skills: [
                        { id: 'erase', name: 'Erase Strike', cry: 'END!', power: 88, type: 'almighty' }
                    ]
                }
            ],
            rewardInvocations: 70
        },
        side_akatsuki_trio: {
            title: 'Extra · Trio Akatsuki',
            difficulty: 6,
            hint: 'Sasori, Deidara y Kisame.',
            enemies: [
                { id: 'sasori', name: 'Sasori · Hiruko', img: 'assets/sprites/anim/sasori_idle.png',
                    maxHp: 360, atk: 48, def: 68, agi: 16, luk: 12, color: '#922b21',
                    weak: ['fire'], resist: ['slash', 'pierce', 'strike'],
                    armorShell: true, armorBreakName: 'Sasori · Kazekage',
                    armorBreakDefMul: 0.4, armorBreakAtkMul: 1.55, armorScratchPct: 0.015,
                    transform: true, transformName: 'Cuerpo verdadero',
                    ai: 'tactical',
                    skills: [
                        { id: 'poison', name: 'Red Secret Technique', cry: 'Art is eternal...', power: 50, type: 'curse', dot: 16, dotTurns: 3 },
                        { id: 'puppet', name: 'Puppet Assault', cry: '...', power: 63, type: 'pierce' },
                        { id: 'iron', name: 'Iron Sand', cry: 'Sand!', power: 45, type: 'slash', aoe: true },
                        { id: 'sasori_true', name: 'Cuerpo verdadero', cry: 'This is my art!', power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.45, transformAgi: 1.25, transformDef: 0.9 }
                    ],
                    transformedSkills: [
                        { id: 'blade_spin', name: 'Senbon Blades', cry: '...', power: 95, type: 'slash', hits: 4 },
                        { id: 'iron_max', name: 'Iron Sand World', cry: 'Sand!', power: 88, type: 'slash', aoe: true },
                        { id: 'poison_max', name: '100 Puppets', cry: 'Art is eternal!', power: 110, type: 'curse', dot: 20, dotTurns: 3 },
                        { id: 'core_guard', name: 'Heart Seal', cry: '...', power: 0, type: 'support', buff: { def: 1.35 }, turns: 2 }
                    ]
                },
                { id: 'deidara', name: 'Deidara', img: 'assets/sprites/anim/deidara_idle.png',
                    maxHp: 300, atk: 58, def: 16, agi: 28, luk: 18, color: '#f5b041',
                    weak: ['elec', 'slash'], resist: ['fire'],
                    transform: true, transformName: 'C2 · Clay Birds',
                    ai: 'adaptive',
                    skills: [
                        { id: 'c1', name: 'C1 Bombs', cry: 'ART IS AN EXPLOSION!', power: 53, type: 'fire', aoe: true },
                        { id: 'c2', name: 'C2 Dragon', cry: 'KATSU!', power: 81, type: 'fire' },
                        { id: 'clay', name: 'Clay Birds', cry: 'Hn!', power: 48, type: 'wind' },
                        { id: 'deidara_art', name: 'Arte Suprema', cry: 'This is true art!', power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.55, transformAgi: 1.25 }
                    ],
                    transformedSkills: [
                        { id: 'c2_swarm', name: 'C2 Bird Swarm', cry: 'KATSU!', power: 95, type: 'fire', hits: 3 },
                        { id: 'c3', name: 'C3 Giant', cry: 'C3!', power: 110, type: 'fire', aoe: true },
                        { id: 'landmine', name: 'Clay Landmines', cry: 'Hn!', power: 70, type: 'fire' },
                        { id: 'c4', name: 'C4 Karura', cry: 'C4…', power: 0, type: 'support', once: true, debuff: { atk: 0.65, def: 0.7 }, debuffTurns: 3 }
                    ]
                },
                { id: 'kisame', name: 'Kisame Hoshigaki', img: 'assets/sprites/anim/kisame_idle.png',
                    maxHp: 340, atk: 56, def: 38, agi: 20, luk: 12, color: '#1a5276',
                    weak: ['elec'], resist: ['water'],
                    transform: true, transformName: 'Samehada Liberada',
                    ai: 'tactical',
                    skills: [
                        { id: 'water_shark', name: 'Suiton: Shark Bomb', cry: 'Samehada!', power: 62, type: 'water' },
                        { id: 'water_prison', name: 'Water Prison', cry: 'Suiton!', power: 0, type: 'support', debuff: { agi: 0.55 }, debuffTurns: 2 },
                        { id: 'great_shark', name: 'Great Shark Bullet', cry: 'SAMEHADA!', power: 78, type: 'water', aoe: true },
                        { id: 'samehada_unleash', name: 'Samehada Liberada', cry: '¡Devora su chakra!', power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.4, transformDef: 1.15 }
                    ],
                    transformedSkills: [
                        { id: 'samehada_drain', name: 'Samehada Drain', cry: '¡Chakra!', power: 88, type: 'slash', heal: 40, drainSp: 24 },
                        { id: 'water_dome', name: 'Water Dome', cry: 'Suiton!', power: 0, type: 'support', buff: { def: 1.4 }, turns: 2 },
                        { id: 'shark_bomb_max', name: 'Shark Bomb Max', cry: 'Samehada!', power: 95, type: 'water', hits: 2 },
                        { id: 'great_shark_max', name: 'Daikōdan', cry: 'SAMEHADA!', power: 105, type: 'water', aoe: true, drainSp: 14 }
                    ]
                }
            ],
            rewardInvocations: 70
        },
        free_doflamingo: {
            title: 'Práctica · Heavenly Demon',
            difficulty: 6,
            hint: 'Doflamingo. Quema sus hilos · fuego y determinación.',
            enemies: [
                {
                    id: 'doflamingo', name: 'Donquixote Doflamingo', img: 'assets/sprites/anim/doflamingo_idle.png',
                    maxHp: 520, atk: 68, def: 26, agi: 38, luk: 24, color: '#e74c3c',
                    weak: ['fire'], resist: ['slash', 'pierce'],
                    ai: 'tactical',
                    skills: [
                        { id: 'tamaito', name: 'Tamaito', cry: 'TAMAITO!', power: 70, type: 'pierce' },
                        { id: 'overheat_e', name: 'Overheat', cry: 'OVERHEAT!', power: 95, type: 'slash' },
                        { id: 'parasite_e', name: 'Parasite', cry: 'Parasite!', power: 0, type: 'support', selfBuff: { atk: 1.3 }, turns: 2 },
                        { id: 'birdcage_e', name: 'Birdcage', cry: 'BIRDCAGE!', power: 85, type: 'slash', aoe: true }
                    ]
                }
            ],
            rewardInvocations: 80
        },
        boss: {
            title: 'BOSS · THE 50/50 & Dark Alliance',
            difficulty: 9,
            hint: 'Jefe final · recomendado: 2 personajes 6★ en C2+ y un soporte. DIO exige bendición/viento, Aizen fuego y Joker bendición/viento/fuego. Guarda CP para las ventanas GUARANTEED.',
            isBoss: true,
            minimumRounds: 8,
            allowTacticalHold: true,
            partyHpScale: 0.96,
            partySpScale: 1.04,
            partySpRegen: 12,
            partyHpRegenPct: 0.015,
            enemyGlobalScale: 1.24,
            enemyGlobalAtkScale: 1.18,
            enemyGlobalDefScale: 1.16,
            enemyGlobalSkillScale: 1.2,
            enemyGlobalHealScale: 1.16,
            enemyHpScale: 1.24,
            enemyAtkScale: 1.18,
            enemyDefScale: 1.15,
            enemySkillScale: 1.18,
            enemyHealScale: 1.12,
            aiAoEChance: 0.58,
            aiHealerFocus: 0.82,
            enemies: [
                {
                    id: 'dio', name: 'DIO', img: 'assets/enemies/dio.webp',
                    maxHp: 560, atk: 72, def: 28, agi: 30, luk: 24, color: '#f4d03f',
                    weak: ['bless', 'wind'], resist: ['strike'],
                    ai: 'tactical',
                    skills: [
                        { id: 'muda', name: 'MUDA MUDA!', cry: 'MUDA MUDA MUDA!', power: 69, type: 'strike', hits: 5 },
                        { id: 'the_world', name: 'ZA WARUDO', cry: 'ZA WARUDO!', power: 0, type: 'support', buff: { atk: 1.4 }, turns: 2 },
                        { id: 'road', name: 'ROAD ROLLER DA!', cry: 'ROAD ROLLER DA!', power: 113, type: 'almighty' },
                        { id: 'space', name: 'Space Ripper', cry: 'WRYYYY!', power: 75, type: 'pierce' }
                    ]
                },
                {
                    id: 'aizen', name: 'Sosuke Aizen', img: 'assets/enemies/aizen.webp',
                    maxHp: 540, atk: 70, def: 30, agi: 26, luk: 22, color: '#7d3c98',
                    weak: ['fire'], resist: ['psy', 'curse'], null: ['bless'],
                    ai: 'adaptive',
                    skills: [
                        { id: 'kyoka', name: 'Kyoka Suigetsu', cry: 'KYOKA SUIGETSU...', power: 0, type: 'support', buff: { luk: 1.5, def: 1.3 }, turns: 2 },
                        { id: 'hadou', name: 'Hadou 90 Kurohitsugi', cry: 'KUROHITSUGI!', power: 106, type: 'curse' },
                        { id: 'fragor', name: 'Fragor', cry: '...', power: 88, type: 'almighty', aoe: true },
                        { id: 'calc', name: 'Perfect Hypnosis', cry: 'All according to plan.', power: 63, type: 'psy' }
                    ]
                },
                {
                    id: 'boss5050', name: 'THE 50/50 · Joker', img: 'assets/sprites/anim/boss5050_idle.png',
                    maxHp: 680, atk: 76, def: 34, agi: 23, luk: 28, color: '#c41e3a',
                    weak: ['bless', 'wind'], resist: ['strike', 'slash'], null: ['curse'],
                    ai: 'final_boss',
                    roleTag: 'Phantom Thief',
                    skills: [
                        { id: 'lost', name: 'LOST THE 50/50', cry: 'You\'re next!', power: 75, type: 'curse', aoe: true },
                        { id: 'hard', name: 'HARD PITY', cry: 'Take this!', power: 94, type: 'strike' },
                        { id: 'rate', name: 'RATE UP (Fake)', cry: 'Persona!', power: 50, type: 'psy', aoe: true },
                        { id: 'guaranteed', name: 'GUARANTEED', cry: 'Guaranteed?', power: 0, type: 'support', selfDebuff: { def: 0.55 }, turns: 2 },
                        { id: 'coin_true', name: 'True Coin Flip', cry: 'ALL-OUT ATTACK!', power: 119, type: 'almighty' },
                        { id: 'heal_phase', name: 'Recalculate Destiny', cry: 'Not yet...', power: 0, type: 'support', heal: 90 }
                    ]
                }
            ],
            rewardInvocations: 45
        }
    },

    applyEnemyAffinityProfiles() {
        const profiles = {
            crocodile: { weak: ['water', 'ice', 'elec'], resist: ['slash', 'fire'], null: ['earth'] },
            enel: { weak: ['strike', 'curse'], resist: ['elec', 'wind'], null: ['elec'] },
            zabuza: { weak: ['fire', 'elec', 'bless'], resist: ['slash', 'ice', 'water'], null: ['wind'] },
            orochimaru: { weak: ['fire', 'bless', 'ice'], resist: ['curse', 'pierce', 'water'], null: ['psy'] },
            lucci: { weak: ['elec', 'fire', 'curse'], resist: ['strike', 'pierce'], null: ['slash'] },
            sasori: { weak: ['fire', 'elec', 'bless'], resist: ['slash', 'pierce', 'strike'], null: ['curse'] },
            deidara: { weak: ['elec', 'slash', 'water'], resist: ['fire', 'wind'], null: ['earth'] },
            kira: { weak: ['bless', 'wind', 'water'], resist: ['strike', 'curse'], null: ['psy'] },
            grimmjow: { weak: ['elec', 'bless', 'fire'], resist: ['slash', 'strike', 'ice'], null: ['curse'] },
            ulquiorra: { weak: ['fire', 'strike', 'bless'], resist: ['curse', 'ice', 'wind'], null: ['psy'] },
            diavolo: { weak: ['bless', 'elec', 'wind'], resist: ['psy', 'curse', 'strike'], null: ['slash'] },
            dio: { weak: ['bless', 'wind', 'fire'], resist: ['strike', 'curse', 'slash'], null: ['psy'] },
            aizen: { weak: ['fire', 'strike', 'elec'], resist: ['psy', 'curse', 'ice'], null: ['bless'] },
            boss5050: { weak: ['bless', 'wind', 'fire'], resist: ['strike', 'slash', 'curse'], null: ['psy'] },
            doflamingo: { weak: ['fire', 'elec', 'ice'], resist: ['slash', 'pierce', 'wind'], null: ['strike'] },
            akaza: { weak: ['water', 'ice', 'bless'], resist: ['strike', 'slash', 'fire'], null: ['curse'] },
            doma: { weak: ['fire', 'bless', 'elec'], resist: ['ice', 'water', 'curse'], null: ['psy'] },
            kokushibo: { weak: ['fire', 'bless', 'elec'], resist: ['slash', 'curse', 'wind'], null: ['psy'] },
            hantengu: { weak: ['bless', 'fire', 'ice'], resist: ['wind', 'curse'], null: ['psy'] },
            gyokko: { weak: ['elec', 'fire', 'strike'], resist: ['water', 'ice', 'curse'], null: ['wind'] },
            tanjiro: { weak: ['curse', 'elec'], resist: ['water', 'slash', 'strike'], null: ['fire'] },
            rengoku: { weak: ['water', 'ice', 'curse'], resist: ['fire', 'strike', 'bless'], null: ['slash'] },
            itachi: { weak: ['bless', 'water', 'strike'], resist: ['fire', 'curse', 'psy'], null: ['wind'] },
            kisame: { weak: ['elec', 'fire', 'bless'], resist: ['water', 'ice', 'slash'], null: ['curse'] }
        };
        const add = (target, key, values) => {
            const current = Array.isArray(target[key]) ? target[key] : [];
            target[key] = [...new Set(current.concat(values || []))];
        };
        const clean = (target) => {
            const nulls = new Set(target.null || []);
            target.weak = (target.weak || []).filter(type => !nulls.has(type));
            target.resist = (target.resist || []).filter(type => !nulls.has(type));
        };
        for (const encounter of Object.values(this.encounters || {})) {
            for (const enemy of encounter.enemies || []) {
                const profile = profiles[enemy.id];
                if (!profile) continue;
                add(enemy, 'weak', profile.weak);
                add(enemy, 'resist', profile.resist);
                add(enemy, 'null', profile.null);
                clean(enemy);
            }
        }
    },

    typeLabel(t) {
        const map = {
            strike: 'Golpe', slash: 'Corte', gun: 'Disparo', pierce: 'Perfora',
            fire: 'Fuego', ice: 'Hielo', elec: 'Rayo', wind: 'Viento', water: 'Agua',
            earth: 'Tierra', dark: 'Oscuridad', psy: 'Psi',
            bless: 'Bendición', curse: 'Maldición', almighty: 'Absoluto',
            support: 'Apoyo'
        };
        return map[t] || t;
    },

    typeShort(t) {
        const map = {
            strike: 'GOL', slash: 'CRT', gun: 'DSP', pierce: 'PRF',
            fire: 'FUE', ice: 'HIE', elec: 'RAY', wind: 'VIE', water: 'AGU',
            earth: 'TIE', dark: 'OSC', psy: 'PSI',
            bless: 'BEN', curse: 'MAL', almighty: 'ABS', support: 'APO'
        };
        return map[t] || String(t || '?').slice(0, 3).toUpperCase();
    },

    /** Filter pills for party select / affinity browser. */
    TYPE_FILTERS: [
        'fire', 'ice', 'elec', 'wind', 'water', 'earth',
        'slash', 'strike', 'pierce', 'curse', 'bless', 'psy'
    ],

    /**
     * Primary attack types from skills (weighted by power).
     * Ignores support / zero-power utility.
     */
    specialtyTypes(unit, limit = 2) {
        if (!unit) return [];
        const skills = []
            .concat(unit.skills || [])
            .concat(unit.transformedSkills || []);
        const score = Object.create(null);
        for (const sk of skills) {
            const t = sk && sk.type;
            if (!t || t === 'support') continue;
            const power = Number(sk.power) || 0;
            if (power <= 0 && !sk.hits) continue;
            const w = Math.max(24, power) * (sk.hits || 1) + (sk.aoe ? 36 : 0);
            score[t] = (score[t] || 0) + w;
        }
        return Object.keys(score)
            .sort((a, b) => score[b] - score[a] || a.localeCompare(b))
            .slice(0, Math.max(1, limit));
    },

    /** True if unit deals damage of this type (base or transform kit). */
    dealsType(unit, type) {
        if (!unit || !type) return false;
        const skills = []
            .concat(unit.skills || [])
            .concat(unit.transformedSkills || []);
        return skills.some(sk => sk && sk.type === type && (Number(sk.power) || 0) > 0);
    },

    /** Battle backdrop theme keyed by encounter id */
    stageFor(runKey) {
        if (runKey === 'boss') return 'destiny';
        const enc = this.encounters[runKey];
        const ids = (enc?.enemies || []).map(e => e.id);
        const map = {
            1: 'desert', 2: 'storm', 3: 'snake', 4: 'akatsuki', 5: 'hueco',
            6: 'tower', 7: 'desert', 8: 'mansion', 9: 'hueco', 10: 'snake',
            11: 'akatsuki', 12: 'mansion',
            story_zabuza: 'mist', story_akatsuki: 'akatsuki', story_orochimaru: 'snake',
            story_alliance: 'mansion', story_aizen: 'soul',
            free_1: 'desert', free_2: 'forest', free_3: 'tower',
            free_4: 'mist', free_5: 'storm', free_6: 'akatsuki', free_7: 'akatsuki',
            free_8: 'hueco', free_9: 'soul', free_10: 'mansion', free_11: 'mansion', free_12: 'mansion',
            free_doflamingo: 'tower',
            side_mist_duo: 'mist', side_clay_sand: 'desert', side_espada_stand: 'soul',
            side_akatsuki_trio: 'akatsuki',
            story_jjk_intro: 'jjk-city', story_jjk_geto: 'jjk-school', story_jjk_jogo: 'jjk-volcano', story_jjk_sukuna: 'jjk-shrine',
            story_kn_rengoku: 'kimetsu-flame', story_kn_um6: 'kimetsu-entertainment', story_kn_kokushibo: 'kimetsu-moon',
            story_csm_reze: 'chainsaw', story_csm_power: 'chainsaw', story_csm_makima: 'chainsaw',
            training: 'tower',
            boss: 'destiny'
        };
        if (map[runKey]) return map[runKey];
        const enemyStage = {
            crocodile: 'desert', enel: 'storm', doflamingo: 'tower',
            luffy: 'sea', zoro: 'sea', nami: 'sea', usopp: 'sea', sanji: 'sea', robin: 'sea', law: 'sea',
            shanks: 'sea', mihawk: 'sea', brook: 'sea', franky: 'sea', chopper: 'sea', lucci: 'tower',
            zabuza: 'mist', orochimaru: 'snake', sasori: 'akatsuki', deidara: 'akatsuki',
            itachi: 'akatsuki', kisame: 'akatsuki', pain: 'akatsuki', konan: 'akatsuki',
            naruto: 'konoha', sasuke: 'konoha', sakura: 'konoha', kakashi: 'konoha', gaara: 'desert',
            jiraiya: 'forest', tsunade: 'konoha', gai: 'forest', lee: 'forest', neji: 'konoha',
            minato: 'konoha', shikamaru: 'konoha', hinata: 'konoha',
            dio: 'mansion', kira: 'mansion', diavolo: 'mansion', giorno: 'mansion', jotaro: 'mansion',
            josuke: 'mansion', jolyne: 'mansion', polnareff: 'mansion', kakyoin: 'mansion',
            bucciarati: 'mansion', pucci: 'mansion', anasui: 'mansion',
            aizen: 'soul', ichigo: 'soul', rukia: 'soul', toshiro: 'soul', byakuya: 'soul',
            renji: 'soul', kenpachi: 'soul', yoruichi: 'soul', ulquiorra: 'hueco', grimmjow: 'hueco',
            sukuna: 'jjk-shrine', jogo: 'jjk-volcano', gojo: 'jjk-city', toji: 'jjk-city',
            yuji: 'jjk-city', megumi: 'jjk-city', nobara: 'jjk-city', todo: 'jjk-city', hakari: 'jjk-city',
            yuki: 'jjk-city', choso: 'jjk-city', uro: 'jjk-city', ryu: 'jjk-city',
            geto: 'jjk-school', mahito: 'jjk-school', nanami: 'jjk-school', yuta: 'jjk-school', higuruma: 'jjk-school',
            rengoku: 'kimetsu-flame', giyu: 'giyu-waterfall', tanjiro: 'kimetsu-flame',
            sanemi: 'kimetsu-night', muichiro: 'kimetsu-night', obanai: 'kimetsu-night', shinobu: 'kimetsu-night',
            doma: 'kimetsu-night', kokushibo: 'kimetsu-moon', daki: 'kimetsu-entertainment',
            akaza: 'kimetsu-night', hantengu: 'kimetsu-entertainment', gyokko: 'kimetsu-night',
            nezuko: 'kimetsu-entertainment', zenitsu: 'kimetsu-entertainment', inosuke: 'forest',
            tengen: 'kimetsu-entertainment', mitsuri: 'kimetsu-entertainment', gyomei: 'kimetsu-night',
            sabito: 'giyu-waterfall', urokodaki: 'giyu-waterfall',
            makima: 'chainsaw', denji: 'chainsaw', power: 'chainsaw', reze: 'chainsaw', beam: 'chainsaw', aki: 'chainsaw', angel: 'chainsaw'
        };
        for (const id of ids) {
            if (enemyStage[id]) return enemyStage[id];
        }
        if (!enc) return 'arena';
        return 'arena';
    },

    /** Audio theme key for this encounter — lead enemy decides the BGM. */
    musicFor(runKey) {
        const enc = this.encounters[runKey];
        if (!enc) return 'battle';
        if (runKey === 'boss') return 'battle_destiny';
        if (String(runKey).startsWith('story_jjk') || String(runKey).includes('jjk')) {
            const idsEarly = (enc.enemies || []).map(e => e.id);
            if (idsEarly.includes('sukuna')) return 'battle_jjk_sukuna';
            if (idsEarly.includes('gojo')) return 'battle_jjk_gojo';
            return 'battle_jjk';
        }
        if (String(runKey).startsWith('story_kn') || String(runKey).includes('kimetsu')) {
            const idsEarly = (enc.enemies || []).map(e => e.id);
            if (idsEarly.includes('kokushibo')) return 'battle_kimetsu_kokushibo';
            if (idsEarly.includes('akaza')) return 'battle_kimetsu_akaza';
            return 'battle_kimetsu';
        }
        if (String(runKey).startsWith('story_csm') || String(runKey).includes('chainsaw')) {
            const idsEarly = (enc.enemies || []).map(e => e.id);
            if (idsEarly.includes('makima')) return 'battle_chainsaw_makima';
            return 'battle_chainsaw';
        }
        const ids = (enc.enemies || []).map(e => e.id);
        const byEnemy = {
            dio: 'battle_jojo_dio',
            kira: 'battle_jojo_kira',
            diavolo: 'battle_jojo',
            aizen: 'battle_aizen',
            ulquiorra: 'battle_bleach',
            grimmjow: 'battle_bleach',
            kenpachi: 'battle_kenpachi',
            yoruichi: 'battle_bleach',
            ichigo: 'battle_bleach',
            rukia: 'battle_bleach',
            toshiro: 'battle_bleach',
            byakuya: 'battle_bleach',
            sasori: 'battle_akatsuki',
            deidara: 'battle_akatsuki',
            kisame: 'battle_akatsuki',
            itachi: 'battle_akatsuki',
            orochimaru: 'battle_snake',
            zabuza: 'battle_mist',
            enel: 'battle_enel',
            crocodile: 'battle_op',
            lucci: 'battle_op',
            doflamingo: 'battle_doflamingo',
            sukuna: 'battle_jjk_sukuna',
            gojo: 'battle_jjk_gojo',
            geto: 'battle_jjk',
            mahito: 'battle_jjk',
            jogo: 'battle_jjk',
            toji: 'battle_jjk',
            yuji: 'battle_jjk',
            megumi: 'battle_jjk',
            kokushibo: 'battle_kimetsu_kokushibo',
            akaza: 'battle_kimetsu_akaza',
            doma: 'battle_kimetsu',
            daki: 'battle_kimetsu',
            hantengu: 'battle_kimetsu',
            gyokko: 'battle_kimetsu',
            tanjiro: 'battle_kimetsu',
            rengoku: 'battle_kimetsu',
            makima: 'battle_chainsaw_makima',
            denji: 'battle_chainsaw',
            power: 'battle_chainsaw',
            reze: 'battle_chainsaw',
            beam: 'battle_chainsaw',
            aki: 'battle_chainsaw',
            angel: 'battle_chainsaw'
        };
        for (const id of ids) {
            if (byEnemy[id]) return byEnemy[id];
        }
        const stage = this.stageFor(runKey);
        const byStage = {
            mansion: 'battle_jojo', soul: 'battle_aizen', hueco: 'battle_bleach',
            akatsuki: 'battle_akatsuki', snake: 'battle_snake', mist: 'battle_mist',
            storm: 'battle_enel', sea: 'battle_op', desert: 'battle_op',
            forest: 'battle', tower: 'battle_op', destiny: 'battle_destiny',
            jjk: 'battle_jjk', 'jjk-city': 'battle_jjk', 'jjk-school': 'battle_jjk', 'jjk-volcano': 'battle_jjk', 'jjk-shrine': 'battle_jjk',
            kimetsu: 'battle_kimetsu', 'kimetsu-flame': 'battle_kimetsu', 'kimetsu-entertainment': 'battle_kimetsu', 'kimetsu-moon': 'battle_kimetsu',
            chainsaw: 'battle_chainsaw'
        };
        return byStage[stage] || 'battle';
    },

    skillGlyph(sk) {
        if (!sk) return 'support';
        if (sk.transform) return 'transform';
        if (sk.heal || sk.aoeHeal || sk.revive != null) return 'heal';
        if (sk.buff || sk.partyBuff || sk.allyBuff || sk.cover || sk.charge) return 'buff';
        if (sk.debuff || sk.targetEnemy) return 'debuff';
        if (sk.stun) return 'bind';
        if (sk.skipEnemy) return 'time';
        return sk.type || 'support';
    },

    fmtMult(v) {
        if (v == null) return '';
        const pct = Math.round((v - 1) * 100);
        return pct > 0 ? `+${pct}%` : `${pct}%`;
    },

    /** Rich lines describing what a skill does */
    skillFacts(sk) {
        if (!sk) return [];
        const facts = [];
        if (sk.power) {
            let d = `Poder ${sk.power}`;
            if (sk.hits > 1) d += ` · ${sk.hits} golpes`;
            if (sk.aoe) d += ' · todos los enemigos';
            if (sk.critBonus) d += ` · crit +${Math.round(sk.critBonus * 100)}%`;
            if (sk.hpCost) d += ` · cuesta ${Math.round(sk.hpCost * 100)}% HP`;
            facts.push(d);
        }
        if (sk.heal) facts.push(sk.aoeHeal ? `Cura ${sk.heal} HP al equipo` : `Cura ${sk.heal} HP (1 aliado)`);
        if (sk.restoreSp) facts.push(`+${sk.restoreSp} SP al equipo`);
        if (sk.revive != null) facts.push(`Revive con ${Math.round(sk.revive * 100)}% HP`);
        if (sk.transform) {
            const bits = ['TRANSFORMACIÓN'];
            if (sk.transformAtk) bits.push(`ATK ${this.fmtMult(sk.transformAtk)}`);
            if (sk.transformAgi) bits.push(`AGI ${this.fmtMult(sk.transformAgi)}`);
            if (sk.transformHeal) bits.push(`+${sk.transformHeal} HP`);
            if (sk.turns) bits.push(`${sk.turns} turnos`);
            facts.push(bits.join(' · '));
            if (sk.transformUpkeep) facts.push(`Mantiene −${sk.transformUpkeep} SP cada turno`);
            facts.push('Solo 1 uso por combate');
        } else if (sk.once) {
            facts.push('Solo 1 uso por combate');
        }
        const pushBuff = (obj, who, turns) => {
            if (!obj) return;
            const parts = Object.entries(obj).map(([k, v]) => `${k.toUpperCase()} ${this.fmtMult(v)}`);
            facts.push(`${who}: ${parts.join(', ')}${turns ? ` (${turns}t)` : ''}`);
        };
        pushBuff(sk.buff, 'Buff propio', sk.turns);
        pushBuff(sk.partyBuff, 'Buff equipo', sk.turns);
        pushBuff(sk.allyBuff, 'Buff aliado', sk.turns);
        pushBuff(sk.debuff, 'Debuff enemigo', sk.debuffTurns || sk.turns);
        pushBuff(sk.selfDebuff, 'Debuff propio', sk.turns);
        if (sk.cover) facts.push('Cubre al equipo 1 golpe');
        if (sk.charge) facts.push('Carga · siguiente skill ×1.5');
        if (sk.stun) facts.push(`Inmoviliza ${sk.stun} turno(s) · 1 objetivo`);
        if (sk.skipEnemy) facts.push(`Salta ${sk.skipEnemy} turno enemigo · único`);
        if (sk.cleanse) facts.push('Limpia debuffs del equipo');
        if (sk.dot) facts.push(`Veneno ${sk.dot}/turno (${sk.dotTurns || 2}t)`);
        if (sk.reflectDamage) {
            const pct = Math.round((sk.reflectMul != null ? sk.reflectMul : 1) * 100);
            facts.push(`Refleja ${pct}% del daño al atacante (${sk.turns || 3}t)`);
        }
        if (sk.cooldown) facts.push(`Enfriamiento ${sk.cooldown} turnos`);
        if (!facts.length && sk.desc) facts.push(sk.desc);
        return facts;
    },

    skillDetailHtml(sk) {
        if (!sk) return '';
        const facts = this.skillFacts(sk).map(f => `<li>${f}</li>`).join('');
        const glyph = this.skillGlyph(sk);
        const cry = sk.cry ? `<blockquote class="p5ui-skill-cry">“${sk.cry}”</blockquote>` : '';
        return `
            <div class="p5ui-desc-art sk-art glyph-${glyph} type-${sk.type || 'support'}"></div>
            <h4>${sk.name}</h4>
            ${cry}
            <p>${sk.desc || 'Sin descripción.'}</p>
            ${facts ? `<ul class="p5ui-facts">${facts}</ul>` : ''}
            <div class="p5ui-desc-meta">
                <em>${this.typeLabel(sk.type)}${sk.aoe ? ' · AoE' : ''}</em>
                <span>${sk.cost != null ? sk.cost + ' SP' : '—'}</span>
            </div>
        `;
    },

    /** ATACAR menu: damaging skills */
    isAttackSkill(sk) {
        return !!sk && (sk.power || 0) > 0;
    },

    /** TÉCNICA menu: heals, buffs, transforms, pure debuffs, control */
    isTechSkill(sk) {
        if (!sk) return false;
        if (this.isAttackSkill(sk)) return false;
        return !!(sk.heal || sk.buff || sk.partyBuff || sk.allyBuff || sk.transform || sk.advanceTransform ||
            sk.skipEnemy || sk.stun || sk.cover || sk.charge || sk.revive != null || sk.debuff ||
            sk.selfDebuff || sk.type === 'support');
    },

    attackSkills(unit) {
        return this.activeSkills(unit).filter(s => this.isAttackSkill(s));
    },

    techSkills(unit) {
        return this.activeSkills(unit).filter(s => this.isTechSkill(s));
    },

    activeSkills(unit) {
        if (!unit) return [];
        if (unit.transformed && unit.transformedSkills?.length) {
            const stage = unit.transformStage || 1;
            return unit.transformedSkills.filter(skill => {
                if ((skill.minTransformStage || 1) > stage) return false;
                if (skill.maxTransformStage != null && stage > skill.maxTransformStage) return false;
                return true;
            });
        }
        return unit.skills || [];
    }
};

BattleData.applyEnemyAffinityProfiles();
