/**
 * Extra party unlocks (sprites on disk + generated placeholders).
 * Ensures gacha pool can fill a long 100-pull banner.
 */
(function expandRoster() {
    if (typeof BattleData === 'undefined') return;

    const extras = [
        { id: 'kisame', name: 'Kisame Hoshigaki', series: 'Naruto', role: 'Tank', roleTag: 'Shark', color: '#1a5276', accent: '#5dade2',
            transform: true, transformName: 'Samehada Liberada', resist: ['water'], weak: ['elec'],
            maxHp: 360, maxSp: 150, atk: 58, def: 42, agi: 24, luk: 14,
            skills: [
                { id: 'water_shark', name: 'Suiton: Shark Bomb', cry: 'Samehada!', cost: 30, power: 120, type: 'water', desc: 'Bomba de agua.' },
                { id: 'water_prison', name: 'Water Prison', cry: 'Suiton!', cost: 32, power: 0, type: 'support', debuff: { agi: 0.55 }, debuffTurns: 2, targetEnemy: true, desc: 'AGI ↓↓.' },
                { id: 'great_shark', name: 'Great Shark Bullet', cry: 'SAMEHADA!', cost: 52, power: 145, type: 'water', aoe: true, desc: 'Tiburón AoE.' },
                { id: 'samehada_unleash', name: 'Samehada Liberada', cry: '¡Devora su chakra!', cost: 62, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.4, transformDef: 1.15, desc: 'TRANSFORM · Samehada desenvuelta · drena energía.' }
            ],
            transformedSkills: [
                { id: 'samehada_drain', name: 'Samehada Drain', cry: '¡Chakra!', cost: 34, power: 130, type: 'slash', heal: 45, drainSp: 28, desc: 'Absorbe HP + CP del enemigo.' },
                { id: 'water_dome', name: 'Water Dome', cry: 'Suiton!', cost: 36, power: 0, type: 'support', buff: { def: 1.45 }, turns: 2, desc: 'Cúpula de agua · DEF ↑.' },
                { id: 'shark_bomb_max', name: 'Shark Bomb Max', cry: 'Samehada!', cost: 44, power: 165, type: 'water', hits: 2, desc: 'Doble bomba de tiburón.' },
                { id: 'great_shark_max', name: 'Daikōdan', cry: 'SAMEHADA!', cost: 56, power: 185, type: 'water', aoe: true, drainSp: 16, desc: 'Gran tiburón AoE · drena CP.' }
            ] },
        { id: 'konan', name: 'Konan', series: 'Naruto', role: 'Caster', roleTag: 'Paper', color: '#6c3483', weak: ['fire'], resist: ['wind'],
            skills: [
                { id: 'paper_lance', name: 'Paper Lance', cry: 'Dance of Shikigami!', cost: 26, power: 100, type: 'pierce', desc: 'Lanzas de papel.' },
                { id: 'paper_ocean', name: 'Sea of Paper', cry: '…', cost: 40, power: 120, type: 'wind', aoe: true, desc: 'Mar de papel AoE.' },
                { id: 'paper_shield', name: 'Paper Shield', cry: 'No.', cost: 28, power: 0, type: 'support', buff: { def: 1.5 }, turns: 2, desc: 'DEF ↑.' },
                { id: 'paper_bomb', name: 'Explosive Paper', cry: 'Boom.', cost: 55, power: 155, type: 'fire', desc: 'Papel explosivo.' }
            ] },
        { id: 'pain', name: 'Pain (Tendo)', series: 'Naruto', role: 'Caster', roleTag: 'Rinnegan', color: '#922b21', weak: ['bless'], resist: ['curse'],
            skills: [
                { id: 'shinra', name: 'Shinra Tensei', cry: 'Shinra Tensei!', cost: 36, power: 130, type: 'strike', aoe: true, desc: 'Repulsión.' },
                { id: 'bansho', name: 'Bansho Tenin', cry: 'Bansho Tenin!', cost: 30, power: 0, type: 'support', debuff: { agi: 0.5 }, debuffTurns: 2, targetEnemy: true, desc: 'Atrae · AGI ↓↓.' },
                { id: 'chibaku', name: 'Chibaku Tensei', cry: 'Chibaku Tensei!', cost: 70, power: 190, type: 'curse', aoe: true, desc: 'Planetoide de dolor.' },
                { id: 'almighty', name: 'Almighty Push', cry: 'Know pain!', cost: 50, power: 150, type: 'strike', desc: 'Empuje divino.' }
            ] },
        { id: 'sai', name: 'Sai', series: 'Naruto', role: 'Support', roleTag: 'Ink', color: '#2c3e50', weak: ['fire'], resist: ['slash'],
            skills: [
                { id: 'ink_beast', name: 'Ink Beast', cry: '…', cost: 28, power: 105, type: 'slash', desc: 'Bestia de tinta.' },
                { id: 'ink_birds', name: 'Ink Birds', cry: 'Fly.', cost: 24, power: 0, type: 'support', partyBuff: { agi: 1.3 }, turns: 3, desc: 'AGI equipo ↑.' },
                { id: 'super_beast', name: 'Super Beast Scroll', cry: 'Scroll!', cost: 40, power: 125, type: 'pierce', hits: 3, desc: 'Tres bestias.' },
                { id: 'ink_bind', name: 'Ink Bind', cry: 'Caught.', cost: 30, power: 0, type: 'support', debuff: { atk: 0.7 }, debuffTurns: 2, targetEnemy: true, desc: 'ATK ↓.' }
            ] },
        { id: 'yamato', name: 'Yamato', series: 'Naruto', role: 'Tank', roleTag: 'Wood', color: '#1e8449',
            maxHp: 370, maxSp: 130, atk: 52, def: 42, agi: 28, luk: 16,
            weak: ['fire'], resist: ['strike'],
            skills: [
                { id: 'wood_lock', name: 'Wood Locking Wall', cry: 'Mokuton!', cost: 30, power: 0, type: 'support', buff: { def: 1.7 }, turns: 3, cover: true, coverHits: 3, desc: 'Muro de madera · cover 3 hits.' },
                { id: 'wood_spear', name: 'Wood Spear', cry: '!', cost: 28, power: 110, type: 'pierce', desc: 'Lanza de madera.' },
                { id: 'four_pillars', name: 'Four Pillars Prison', cry: 'Mokuton!', cost: 36, power: 0, type: 'support', debuff: { agi: 0.6, atk: 0.8 }, debuffTurns: 2, targetEnemy: true, desc: 'Prisión · ATK/AGI ↓.' },
                { id: 'wood_dragon', name: 'Wood Dragon', cry: 'MOKUTON!', cost: 58, power: 155, type: 'strike', desc: 'Dragón de madera.' }
            ] },
        { id: 'neji', name: 'Neji Hyuga', series: 'Naruto', role: 'Debuffer', roleTag: 'Byakugan', color: '#5d6d7e',
            resist: ['strike', 'pierce'], weak: ['fire', 'curse'],
            skills: [
                { id: 'eight_trigrams', name: 'Eight Trigrams Palm', cry: 'Ready!', cost: 28, power: 100, type: 'strike', hits: 4, desc: 'Palmas suaves.' },
                { id: 'rotation', name: 'Rotation', cry: 'Kaiten!', cost: 32, power: 0, type: 'support', buff: { def: 1.7 }, turns: 2, desc: 'Rotación defensiva.' },
                { id: 'sixty_four', name: '64 Palms', cry: 'Eight Trigrams!', cost: 45, power: 140, type: 'strike', hits: 8, desc: '64 palmas.' },
                { id: 'air_palm', name: 'Air Palm', cry: '!', cost: 30, power: 115, type: 'wind', desc: 'Palma a distancia.' }
            ] },
        { id: 'lee', name: 'Rock Lee', series: 'Naruto', role: 'DPS', roleTag: 'Taijutsu', color: '#27ae60',
            transform: true, transformName: 'Eight Gates',
            resist: ['strike'], weak: ['ice', 'psy'],
            skills: [
                { id: 'front_lotus', name: 'Front Lotus', cry: 'Primary Lotus!', cost: 30, power: 125, type: 'strike', hpCost: 0.05, desc: 'Loto frontal.' },
                { id: 'dynamic_entry', name: 'Dynamic Entry', cry: 'Dynamic Entry!', cost: 22, power: 95, type: 'strike', desc: 'Patada voladora.' },
                { id: 'gate_open', name: 'Eight Gates', cry: 'OPEN!', cost: 55, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformStages: 2, transformStageNames: ['Eight Gates', 'Drunken Fist'], transformStageAtk: [1.65, 1.85], transformStageAgi: [1.55, 1.7], transformStageUpkeep: [14, 18], transformUpkeep: 14, transformAtk: 1.65, transformAgi: 1.55, desc: 'TRANSFORM · Puertas · luego puedes emborracharte (más poder, más CP).' },
                { id: 'hidden_lotus', name: 'Hidden Lotus', cry: 'LOTUS!', cost: 60, power: 175, type: 'strike', hits: 5, desc: 'Loto oculto.' }
            ],
            transformedSkills: [
                { id: 'gate_rush', name: 'Gate Rush', cry: 'Youth!', cost: 32, power: 145, type: 'strike', hits: 4, minTransformStage: 1, desc: 'Aluvión de puertas.' },
                { id: 'morning_peacock', name: 'Morning Peacock', cry: 'Asa Kujaku!', cost: 48, power: 170, type: 'fire', aoe: true, minTransformStage: 1, desc: 'Puños supersónicos AoE.' },
                { id: 'drunken_fist', name: 'Drunken Fist', cry: 'Hic…!', cost: 36, power: 0, type: 'support', once: true, advanceTransform: true, transformAtk: 1.85, transformAgi: 1.7, transformUpkeep: 18, transformStageName: 'Drunken Fist', minTransformStage: 1, maxTransformStage: 1, desc: 'Suiken · más poder · upkeep CP alto.' },
                { id: 'drunk_kick', name: 'Drunken Kick', cry: 'Oops—!', cost: 34, power: 160, type: 'strike', hits: 3, minTransformStage: 2, desc: 'Patadas impredecibles.' },
                { id: 'drunk_storm', name: 'Drunken Storm', cry: 'Youth…?', cost: 50, power: 195, type: 'strike', aoe: true, minTransformStage: 2, desc: 'Caos total AoE.' }
            ] },
        { id: 'gai', name: 'Might Guy', series: 'Naruto', role: 'DPS', roleTag: 'Eight Gates', color: '#1e8449', accent: '#f39c12',
            transform: true, transformName: 'Eight Gates',
            maxHp: 300, maxSp: 120, atk: 70, def: 26, agi: 40, luk: 18,
            resist: ['strike', 'fire'], weak: ['ice', 'curse'],
            skills: [
                { id: 'dynamic_gai', name: 'Dynamic Entry', cry: 'DYNAMIC ENTRY!', cost: 26, power: 110, type: 'strike', desc: 'Patada legendaria.' },
                { id: 'konoha_senpu', name: 'Konoha Senpu', cry: 'Leaf Hurricane!', cost: 30, power: 120, type: 'strike', hits: 2, desc: 'Remolino de hojas.' },
                { id: 'youth_buff', name: 'Power of Youth', cry: 'YOUTH!', cost: 28, power: 0, type: 'support', partyBuff: { atk: 1.25, agi: 1.2 }, turns: 3, desc: 'ATK/AGI equipo ↑' },
                { id: 'gai_gates', name: 'Eight Gates', cry: 'GATE OF DEATH!', cost: 68, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 16, transformAtk: 1.9, transformAgi: 1.6, transformDef: 0.9, desc: 'TRANSFORM · Puertas · poder extremo, CP caro.' }
            ],
            transformedSkills: [
                { id: 'gai_peacock', name: 'Morning Peacock', cry: 'ASA KUJAKU!', cost: 40, power: 175, type: 'fire', aoe: true, desc: 'Puños supersónicos.' },
                { id: 'gai_elephant', name: 'Daytime Tiger', cry: 'HIRUDORA!', cost: 52, power: 200, type: 'strike', desc: 'Tigre de aire comprimido.' },
                { id: 'gai_sec', name: 'Evening Elephant', cry: 'Sekizo!', cost: 58, power: 185, type: 'strike', hits: 5, desc: '5 impactos de aire.' },
                { id: 'gai_night', name: 'Night Guy', cry: 'YOUTH!', cost: 72, power: 240, type: 'strike', once: true, hpCost: 0.12, desc: 'Finisher · cuesta HP.' }
            ] },
        { id: 'minato', name: 'Minato Namikaze', series: 'Naruto', role: 'DPS', roleTag: 'Hokage', color: '#f4d03f',
            resist: ['elec', 'wind'], weak: ['earth', 'curse'],
            skills: [
                { id: 'rasengan_m', name: 'Rasengan', cry: 'Rasengan!', cost: 28, power: 120, type: 'wind', desc: 'Rasengan del Yellow Flash.' },
                { id: 'flying_rai', name: 'Flying Thunder God', cry: 'Now!', cost: 26, power: 0, type: 'support', buff: { agi: 1.8, luk: 1.4 }, turns: 2, desc: 'Teletransporte · AGI ↑↑.' },
                { id: 'kunai_mark', name: 'Marked Kunai', cry: '!', cost: 24, power: 90, type: 'pierce', hits: 3, desc: 'Kunai marcados.' },
                { id: 'ftg_raikiri', name: 'FTG Strike', cry: 'Too slow!', cost: 55, power: 170, type: 'elec', desc: 'Golpe instantáneo.' }
            ] },
        { id: 'tsunade', name: 'Tsunade', series: 'Naruto', role: 'Healer', roleTag: 'Hokage', color: '#1e8449', accent: '#f4d03f',
            transform: true, transformName: 'Sello · Byakugō', resist: ['strike'], weak: ['curse'],
            maxHp: 320, maxSp: 175, atk: 48, def: 28, agi: 30, luk: 22,
            skills: [
                { id: 'heal_tsu', name: 'Creation Rebirth', cry: 'I won\'t let you die!', cost: 40, power: 0, type: 'support', heal: 140, desc: 'Gran cura.' },
                { id: 'heaven_kick', name: 'Heavenly Kick', cry: 'CHA!', cost: 32, power: 135, type: 'strike', desc: 'Patada monstruosa.' },
                { id: 'heal_all_tsu', name: 'Medical Corps', cry: 'Stand up!', cost: 55, power: 0, type: 'support', heal: 60, aoeHeal: true, desc: 'Cura equipo.' },
                { id: 'byakugo', name: 'Byakugō no In', cry: 'Creation Rebirth — Strength of a Hundred!', cost: 66, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.45, transformDef: 1.2, transformHeal: 80, desc: 'TRANSFORM · Sello de los Cien · cura al activar.' }
            ],
            transformedSkills: [
                { id: 'yin_seal_heal', name: 'Mitotic Regeneration', cry: 'I can still fight!', cost: 34, power: 0, type: 'support', heal: 160, desc: 'Regeneración masiva.' },
                { id: 'heaven_punch', name: 'Monster Punch', cry: 'CHA!', cost: 40, power: 175, type: 'strike', desc: 'Puñetazo devastador.' },
                { id: 'katsuyu_max', name: 'Katsuyu Field', cry: 'Katsuyu!', cost: 42, power: 0, type: 'support', heal: 70, aoeHeal: true, partyBuff: { def: 1.35 }, turns: 2, desc: 'Cura equipo + DEF ↑.' },
                { id: 'sozo_saisei', name: 'Sōzō Saisei', cry: 'Creation Rebirth!', cost: 58, power: 0, type: 'support', once: true, heal: 220, cleanse: true, desc: 'Cura extrema + limpia · 1 uso.' }
            ] },
        { id: 'brook', name: 'Brook', series: 'One Piece', role: 'Support', roleTag: 'Soul', color: '#d5dbdb',
            resist: ['ice', 'slash'], weak: ['fire', 'bless'],
            skills: [
                { id: 'soul_solid', name: 'Soul Solid', cry: 'Yohohoho!', cost: 28, power: 105, type: 'slash', desc: 'Corte helado.' },
                { id: 'party_music', name: 'Party Music', cry: 'Listen!', cost: 30, power: 0, type: 'support', partyBuff: { atk: 1.25, agi: 1.25 }, turns: 3, desc: 'Buff musical.' },
                { id: 'three_song', name: 'Three-Verse Humming', cry: '♪', cost: 34, power: 90, type: 'ice', aoe: true, desc: 'Hielo AoE.' },
                { id: 'soul_king', name: 'Soul King', cry: 'SKULLJOKER!', cost: 50, power: 150, type: 'slash', desc: 'Concierto mortal.' }
            ] },
        { id: 'franky', name: 'Franky', series: 'One Piece', role: 'Tank', roleTag: 'Cyborg', color: '#2980b9',
            maxHp: 380, maxSp: 125, atk: 54, def: 44, agi: 24, luk: 14,
            resist: ['strike', 'fire'], weak: ['elec', 'water'],
            skills: [
                { id: 'fresh_fire', name: 'Fresh Fire', cry: 'SUPER!', cost: 28, power: 110, type: 'fire', desc: 'Lanzallamas.' },
                { id: 'strong_right', name: 'Strong Right', cry: 'STRONG RIGHT!', cost: 32, power: 125, type: 'strike', desc: 'Brazo cohete.' },
                { id: 'iron_bock', name: 'Iron Frontal', cry: '!', cost: 26, power: 0, type: 'support', buff: { def: 1.75 }, turns: 3, cover: true, coverHits: 3, desc: 'Blindaje · cover 3 hits.' },
                { id: 'coup_de_vent', name: 'Coup de Vent', cry: 'COUP DE VENT!', cost: 55, power: 160, type: 'wind', aoe: true, desc: 'Cañón de aire.' }
            ] },
        { id: 'chopper', name: 'Tony Tony Chopper', series: 'One Piece', role: 'Healer', roleTag: 'Doctor', color: '#e74c3c',
            transform: true, transformName: 'Monster Point',
            resist: ['strike', 'bless'], weak: ['fire', 'slash'],
            skills: [
                { id: 'heal_chop', name: 'Rumble Ball Heal', cry: 'I\'ll save you!', cost: 28, power: 0, type: 'support', heal: 140, desc: 'Cura.' },
                { id: 'scope', name: 'Scope', cry: 'Heavy Point!', cost: 26, power: 100, type: 'strike', desc: 'Heavy Point.' },
                { id: 'guard_point', name: 'Guard Point', cry: '!', cost: 24, power: 0, type: 'support', buff: { def: 1.8 }, turns: 2, desc: 'DEF ↑↑.' },
                { id: 'monster_point', name: 'Monster Point', cry: 'MONSTER POINT!', cost: 62, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 16, transformAtk: 1.85, transformAgi: 0.9, transformDef: 1.35, desc: 'TRANSFORM · Monster Point · poder brutal, CP caro.' }
            ],
            transformedSkills: [
                { id: 'monster_slam', name: 'Monster Slam', cry: 'GRAAAH!', cost: 36, power: 170, type: 'strike', desc: 'Golpe monstruoso.' },
                { id: 'monster_sweep', name: 'Arm Sweep', cry: '!', cost: 42, power: 145, type: 'strike', aoe: true, desc: 'Barrido AoE.' },
                { id: 'monster_roar', name: 'Feral Roar', cry: 'ROOOAR!', cost: 30, power: 0, type: 'support', debuff: { atk: 0.75, agi: 0.7 }, debuffTurns: 2, targetEnemy: true, desc: 'ATK/AGI enemigo ↓' },
                { id: 'monster_crush', name: 'Hoof Crush', cry: 'Crush!', cost: 55, power: 200, type: 'strike', desc: 'Finisher Monster Point.' }
            ] },
        { id: 'usopp', name: 'Usopp', series: 'One Piece', role: 'Debuffer', roleTag: 'Sniper', color: '#d35400',
            resist: ['pierce'], weak: ['slash', 'elec'],
            skills: [
                { id: 'usopp_star', name: 'Green Star', cry: 'Usopp Star!', cost: 24, power: 95, type: 'pierce', desc: 'Disparo preciso.' },
                { id: 'smoke_star', name: 'Smoke Star', cry: '!', cost: 22, power: 0, type: 'support', debuff: { luk: 0.6 }, debuffTurns: 2, targetEnemy: true, desc: 'Humo · LUK ↓.' },
                { id: 'fire_bird', name: 'Fire Bird Star', cry: 'FIRE!', cost: 34, power: 120, type: 'fire', desc: 'Pájaro de fuego.' },
                { id: 'god_usopp', name: 'God Usopp Shot', cry: 'I am a brave warrior!', cost: 50, power: 155, type: 'pierce', critBonus: 0.35, desc: 'Disparo divino.' }
            ] },
        { id: 'kenpachi', name: 'Kenpachi Zaraki', series: 'Bleach', role: 'DPS', roleTag: 'Captain', color: '#c0392b', accent: '#ecf0f1',
            transform: true, transformName: 'Bankai · Nozarashi', resist: ['slash', 'strike'], weak: ['curse', 'psy'],
            maxHp: 340, maxSp: 140, atk: 78, def: 28, agi: 28, luk: 16,
            skills: [
                { id: 'kendo', name: 'No-Name Slash', cry: 'More!', cost: 28, power: 125, type: 'slash', desc: 'Corte salvaje.' },
                { id: 'eye_patch', name: 'Eye Patch Off', cry: 'HAHAHA!', cost: 36, power: 0, type: 'support', buff: { atk: 1.6 }, turns: 3, desc: 'ATK ↑↑.' },
                { id: 'berserk', name: 'Berserker Rush', cry: 'COME ON!', cost: 40, power: 140, type: 'slash', hits: 5, desc: 'Aluvión.' },
                { id: 'nozarashi', name: 'Bankai: Nozarashi', cry: 'BANKAI!', cost: 70, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 15, transformAtk: 1.75, transformDef: 1.15, desc: 'TRANSFORM · Nozarashi liberada · demoledor.' }
            ],
            transformedSkills: [
                { id: 'noza_cleave', name: 'Nozarashi Cleave', cry: 'HAHAHA!', cost: 36, power: 170, type: 'slash', desc: 'Tajo de hacha gigante.' },
                { id: 'noza_quake', name: 'Earth Splitter', cry: 'BREAK!', cost: 48, power: 155, type: 'slash', aoe: true, desc: 'Golpe sísmico AoE.' },
                { id: 'blood_lust', name: 'Battle Lust', cry: 'More…!', cost: 32, power: 0, type: 'support', buff: { atk: 1.45, agi: 1.2 }, turns: 2, desc: 'ATK/AGI ↑.' },
                { id: 'noza_finisher', name: 'Unnamed Bankai', cry: 'DIE!', cost: 62, power: 220, type: 'slash', desc: 'Finisher demoledor.' }
            ] },
        { id: 'yoruichi', name: 'Yoruichi Shihoin', series: 'Bleach', role: 'DPS', roleTag: 'Flash Goddess', color: '#8e44ad', accent: '#f4d03f',
            transform: true, transformName: 'Shunkō · Raijū', resist: ['elec'], weak: ['ice', 'curse'],
            maxHp: 290, maxSp: 155, atk: 68, def: 22, agi: 52, luk: 24,
            skills: [
                { id: 'shunko', name: 'Shunkō', cry: 'Shunkō!', cost: 30, power: 120, type: 'elec', desc: 'Puño relámpago.' },
                { id: 'flash_step_y', name: 'Flash Step', cry: 'Too slow.', cost: 24, power: 0, type: 'support', buff: { agi: 1.7 }, turns: 3, desc: 'AGI ↑↑.' },
                { id: 'cat_claw', name: 'Cat Claw Barrage', cry: '!', cost: 34, power: 110, type: 'slash', hits: 4, desc: 'Zarpazos.' },
                { id: 'rai_jin', name: 'Shunkō: Raijū Senkei', cry: 'RAIJŪ!', cost: 66, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 14, transformAtk: 1.55, transformAgi: 1.65, desc: 'TRANSFORM · Raijū · diosa del flash.' }
            ],
            transformedSkills: [
                { id: 'shunryu_claw', name: 'Shunryū Claw', cry: 'Too slow!', cost: 34, power: 155, type: 'elec', hits: 3, desc: 'Zarpazos eléctricos ×3.' },
                { id: 'rai_flash', name: 'Thunder Flash', cry: '!', cost: 42, power: 145, type: 'elec', aoe: true, desc: 'Destello AoE.' },
                { id: 'cat_speed', name: 'Goddess Rush', cry: 'Keep up!', cost: 30, power: 0, type: 'support', buff: { agi: 1.8, luk: 1.3 }, turns: 2, desc: 'AGI/LUK ↑↑.' },
                { id: 'kokubyo', name: 'Shunryū Kokubyō', cry: 'SHUNRYŪ!', cost: 58, power: 205, type: 'elec', desc: 'Finisher · bestia del trueno.' }
            ] },
        { id: 'shanks', name: 'Shanks', series: 'One Piece', role: 'DPS', roleTag: 'Emperor', color: '#922b21',
            resist: ['slash', 'curse'], weak: ['bless', 'elec'],
            skills: [
                { id: 'divine_departure', name: 'Divine Departure', cry: '…', cost: 45, power: 160, type: 'slash', desc: 'Haki del conquistador cortante.' },
                { id: 'obs_haki', name: 'Observation Haki', cry: 'I see it.', cost: 28, power: 0, type: 'support', buff: { luk: 1.5, agi: 1.3 }, turns: 3, desc: 'LUK/AGI ↑.' },
                { id: 'haki_slash', name: 'Haki Slash', cry: '!', cost: 32, power: 125, type: 'slash', desc: 'Corte impregnado.' },
                { id: 'conqueror', name: 'Conqueror\'s Burst', cry: 'Stand down.', cost: 55, power: 140, type: 'curse', aoe: true, desc: 'Haki AoE.' }
            ] },
        { id: 'mihawk', name: 'Dracule Mihawk', series: 'One Piece', role: 'Slasher', roleTag: 'Warlord', color: '#1c2833',
            resist: ['slash'], weak: ['fire', 'curse'],
            skills: [
                { id: 'kokuto', name: 'Kokuto Slash', cry: '…', cost: 30, power: 130, type: 'slash', desc: 'Yoru.' },
                { id: 'black_blade', name: 'Black Blade Wave', cry: 'Hmph.', cost: 40, power: 145, type: 'slash', aoe: true, desc: 'Onda negra.' },
                { id: 'eagle_eye', name: 'Eagle Eye', cry: 'Predictable.', cost: 26, power: 0, type: 'support', buff: { luk: 1.6, atk: 1.25 }, turns: 3, desc: 'Precisión ↑.' },
                { id: 'world_slash', name: 'World\'s Strongest Slash', cry: 'Fall.', cost: 65, power: 185, type: 'slash', desc: 'Corte definitivo.' }
            ] },
        { id: 'aizen', name: 'Sosuke Aizen', series: 'Bleach', role: 'Caster', roleTag: 'Kyoka Suigetsu', color: '#7d3c98', accent: '#d7bde2',
            transform: true, transformName: 'Hogyoku', resist: ['psy', 'curse'], weak: ['fire'], null: ['bless'],
            maxHp: 310, maxSp: 165, atk: 68, def: 28, agi: 34, luk: 26,
            skills: [
                { id: 'kyoka', name: 'Kyoka Suigetsu', cry: 'KYOKA SUIGETSU...', cost: 34, power: 0, type: 'support', debuff: { luk: 0.55, atk: 0.8 }, debuffTurns: 3, targetEnemy: true, desc: 'Ilusión completa · LUK/ATK ↓↓' },
                { id: 'hadou90', name: 'Hadou 90 Kurohitsugi', cry: 'KUROHITSUGI!', cost: 42, power: 145, type: 'curse', desc: 'Ataúd negro.' },
                { id: 'fragor', name: 'Fragor', cry: '...', cost: 48, power: 130, type: 'almighty', aoe: true, desc: 'Reiatsu AoE.' },
                { id: 'hogyoku', name: 'Hogyoku Fusion', cry: 'Interesting.', cost: 68, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformStages: 2, transformStageNames: ['Hogyoku', 'Muken'], transformStageAtk: [1.55, 1.85], transformStageAgi: [1.2, 1.35], transformStageDef: [1.2, 1.35], transformStageUpkeep: [14, 18], transformUpkeep: 14, transformAtk: 1.55, transformAgi: 1.2, transformDef: 1.2, desc: 'TRANSFORM · Hogyoku · luego Muken.' }
            ],
            transformedSkills: [
                { id: 'hogyoku_fragor', name: 'Fragor', cry: 'Fragor.', cost: 40, power: 160, type: 'almighty', aoe: true, minTransformStage: 1, desc: 'Reiatsu Hogyoku AoE.' },
                { id: 'hogyoku_kuro', name: 'Kurohitsugi+', cry: 'KUROHITSUGI!', cost: 44, power: 175, type: 'curse', minTransformStage: 1, desc: 'Ataúd potenciado.' },
                { id: 'muken_unseal', name: 'Muken Unseal', cry: 'No more games.', cost: 42, power: 0, type: 'support', once: true, advanceTransform: true, transformAtk: 1.85, transformAgi: 1.35, transformDef: 1.35, transformUpkeep: 18, transformStageName: 'Muken', minTransformStage: 1, maxTransformStage: 1, desc: 'Muken · poder final · upkeep alto.' },
                { id: 'muken_fragor', name: 'Ultra Fragor', cry: 'Fragor.', cost: 44, power: 185, type: 'almighty', aoe: true, minTransformStage: 2, desc: 'Reiatsu desatado AoE.' },
                { id: 'muken_kuro', name: 'Kurohitsugi Max', cry: 'KUROHITSUGI!', cost: 48, power: 200, type: 'curse', minTransformStage: 2, desc: 'Ataúd absoluto.' },
                { id: 'muken_crush', name: 'Hogyoku Pulse', cry: '...', cost: 62, power: 220, type: 'almighty', minTransformStage: 2, desc: 'Pulso del Hogyoku.' }
            ],
            fromEnemy: true },
        { id: 'ulquiorra', name: 'Ulquiorra Cifer', series: 'Bleach', role: 'Caster', roleTag: 'Segunda Etapa', color: '#ecf0f1', accent: '#27ae60',
            transform: true, transformName: 'Segunda Etapa', resist: ['curse', 'slash'], weak: ['fire', 'strike'],
            maxHp: 300, maxSp: 155, atk: 64, def: 26, agi: 38, luk: 20,
            skills: [
                { id: 'cero', name: 'Cero', cry: 'Cero.', cost: 30, power: 120, type: 'curse', desc: 'Cero verde.' },
                { id: 'bala', name: 'Bala', cry: '…', cost: 24, power: 95, type: 'pierce', hits: 2, desc: 'Balas rápidas.' },
                { id: 'hierro', name: 'Hierro', cry: 'Hierro.', cost: 28, power: 0, type: 'support', buff: { def: 1.55 }, turns: 2, desc: 'DEF ↑' },
                { id: 'segunda', name: 'Segunda Etapa', cry: 'Segunda Etapa.', cost: 68, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 15, transformAtk: 1.7, transformAgi: 1.4, desc: 'TRANSFORM · Resurrección Segunda Etapa.' }
            ],
            transformedSkills: [
                { id: 'lanza', name: 'Lanza del Relámpago', cry: 'Lanza del Relámpago.', cost: 48, power: 185, type: 'elec', desc: 'Lanza verde.' },
                { id: 'cero_osc', name: 'Cero Oscuras', cry: 'Cero Oscuras.', cost: 44, power: 165, type: 'curse', aoe: true, desc: 'Cero oscuro AoE.' },
                { id: 'wing_slash', name: 'Wing Slash', cry: '…', cost: 36, power: 140, type: 'slash', hits: 3, desc: 'Cortes de ala.' },
                { id: 'solita', name: 'Solita Vista', cry: 'Solita Vista.', cost: 55, power: 0, type: 'support', once: true, debuff: { atk: 0.65, agi: 0.65 }, debuffTurns: 3, targetEnemy: true, desc: 'Visión · ATK/AGI ↓↓' }
            ],
            fromEnemy: true },
        { id: 'grimmjow', name: 'Grimmjow Jaegerjaquez', series: 'Bleach', role: 'DPS', roleTag: 'Pantera', color: '#5dade2', accent: '#ecf0f1',
            transform: true, transformName: 'Pantera', resist: ['slash', 'strike'], weak: ['fire', 'bless'],
            maxHp: 320, maxSp: 150, atk: 72, def: 26, agi: 42, luk: 18,
            skills: [
                { id: 'desgarron', name: 'Desgarrón', cry: 'DESGARRÓN!', cost: 34, power: 135, type: 'slash', desc: 'Garras de reiatsu.' },
                { id: 'pantera_claw', name: 'Pantera Claw', cry: '¡Muere!', cost: 28, power: 110, type: 'slash', hits: 2, desc: 'Doble zarpazo.' },
                { id: 'hierro_g', name: 'Hierro', cry: 'Hierro.', cost: 26, power: 0, type: 'support', buff: { def: 1.45, atk: 1.15 }, turns: 2, desc: 'Piel de hierro · DEF/ATK ↑' },
                { id: 'pantera', name: 'Resurrección · Pantera', cry: 'Grind, Pantera!', cost: 70, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 16, transformAtk: 1.75, transformAgi: 1.45, transformDef: 1.2, desc: 'TRANSFORM · Pantera · rey pantera.' }
            ],
            transformedSkills: [
                { id: 'garra_de_la_pantera', name: 'Garra de la Pantera', cry: 'GARRA!', cost: 40, power: 170, type: 'slash', hits: 3, desc: 'Zarpas de pantera · 3 hits.' },
                { id: 'desgarron_max', name: 'Desgarrón Max', cry: 'DESGARRÓN!', cost: 48, power: 195, type: 'slash', aoe: true, desc: 'Garras masivas AoE.' },
                { id: 'pantera_rush', name: 'Pantera Rush', cry: '¡Te destrozo!', cost: 36, power: 155, type: 'strike', hits: 4, desc: 'Embiste salvaje.' },
                { id: 'rey_pantera', name: 'Rey Pantera', cry: 'Soy el rey.', cost: 58, power: 0, type: 'support', once: true, buff: { atk: 1.5, agi: 1.4 }, turns: 3, desc: 'Furia del rey · ATK/AGI ↑↑' }
            ],
            fromEnemy: true },
        { id: 'sasori', name: 'Sasori · Hiruko', series: 'Naruto', role: 'Controller', roleTag: 'Puppet Master · 3 formas', color: '#922b21', accent: '#f5b041',
            transform: true, transformName: 'Cuerpo verdadero', resist: ['slash', 'pierce', 'strike'], weak: ['fire'],
            // Forma 1 Hiruko (idle) → al primer hit se cae → Forma 2 Kazekage (reveal) → skill → Forma 3 cuerpo verdadero
            armorShell: true, armorBreakName: 'Sasori · Kazekage',
            armorBreakDefMul: 0.4, armorBreakAtkMul: 1.55, armorScratchPct: 0.015,
            maxHp: 340, maxSp: 145, atk: 52, def: 70, agi: 22, luk: 14,
            skills: [
                { id: 'poison', name: 'Red Secret Technique', cry: 'Art is eternal...', cost: 32, power: 115, type: 'curse', dot: 18, dotTurns: 3, desc: 'Veneno · DoT.' },
                { id: 'puppet', name: 'Puppet Assault', cry: '...', cost: 28, power: 120, type: 'pierce', hits: 2, desc: 'Asalto de marioneta.' },
                { id: 'iron', name: 'Iron Sand', cry: 'Sand!', cost: 36, power: 105, type: 'slash', aoe: true, desc: 'Arena de hierro AoE.' },
                { id: 'sasori_true', name: 'Cuerpo verdadero', cry: 'This is my art!', cost: 66, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.5, transformAgi: 1.3, transformDef: 0.9, desc: 'TRANSFORM · 3ª forma · marioneta humana (requiere romper Hiruko).' }
            ],
            transformedSkills: [
                { id: 'blade_spin', name: 'Senbon Blades', cry: '...', cost: 38, power: 155, type: 'slash', hits: 4, desc: 'Aspas giratorias ×4.' },
                { id: 'iron_max', name: 'Iron Sand World', cry: 'Sand!', cost: 46, power: 150, type: 'slash', aoe: true, desc: 'Mundo de arena de hierro.' },
                { id: 'poison_max', name: '100 Puppets', cry: 'Art is eternal!', cost: 52, power: 175, type: 'curse', dot: 22, dotTurns: 3, desc: 'Cien marionetas · DoT.' },
                { id: 'core_guard', name: 'Heart Seal', cry: '...', cost: 30, power: 0, type: 'support', buff: { def: 1.4, luk: 1.2 }, turns: 2, desc: 'Sella el núcleo · DEF ↑.' }
            ],
            fromEnemy: true },
        { id: 'deidara', name: 'Deidara', series: 'Naruto', role: 'Caster', roleTag: 'Explosive Art', color: '#f5b041', accent: '#c0392b',
            transform: true, transformName: 'C2 · Clay Birds', resist: ['fire'], weak: ['elec', 'slash'],
            maxHp: 285, maxSp: 155, atk: 62, def: 18, agi: 36, luk: 20,
            skills: [
                { id: 'c1', name: 'C1 Bombs', cry: 'ART IS AN EXPLOSION!', cost: 30, power: 115, type: 'fire', aoe: true, desc: 'Bombas de arcilla AoE.' },
                { id: 'c2', name: 'C2 Dragon', cry: 'KATSU!', cost: 42, power: 145, type: 'fire', desc: 'Dragón explosivo.' },
                { id: 'clay', name: 'Clay Birds', cry: 'Hn!', cost: 26, power: 100, type: 'wind', hits: 2, desc: 'Pájaros de arcilla ×2.' },
                { id: 'deidara_art', name: 'Arte Suprema', cry: 'This is true art!', cost: 64, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.55, transformAgi: 1.25, desc: 'TRANSFORM · ambas bocas + pájaros C2.' }
            ],
            transformedSkills: [
                { id: 'c2_swarm', name: 'C2 Bird Swarm', cry: 'KATSU!', cost: 40, power: 160, type: 'fire', hits: 3, desc: 'Enjambre explosivo ×3.' },
                { id: 'c3', name: 'C3 Giant', cry: 'C3!', cost: 52, power: 185, type: 'fire', aoe: true, desc: 'Gigante de arcilla AoE.' },
                { id: 'landmine', name: 'Clay Landmines', cry: 'Hn!', cost: 34, power: 130, type: 'fire', debuff: { agi: 0.7 }, debuffTurns: 2, desc: 'Minas · AGI ↓' },
                { id: 'c4', name: 'C4 Karura', cry: 'C4…', cost: 60, power: 0, type: 'support', once: true, debuff: { atk: 0.65, def: 0.7 }, debuffTurns: 3, targetEnemy: true, desc: 'Karura · ATK/DEF ↓↓ · 1 uso.' }
            ],
            fromEnemy: true },

        // Hidan — 6★ immortal ritual tank (regen each round)
        { id: 'hidan', name: 'Hidan', series: 'Naruto', role: 'Tank', roleTag: 'Jashin · Immortal', color: '#922b21', accent: '#ecf0f1',
            transform: true, transformName: 'Rito de Jashin',
            resist: ['curse', 'slash', 'pierce'], weak: ['bless'],
            damageTakenMul: 0.58,
            hpRegenPct: 0.10,
            maxHp: 520, maxSp: 150, atk: 54, def: 58, agi: 24, luk: 14,
            skills: [
                { id: 'scythe_sweep', name: 'Triple-Bladed Scythe', cry: 'Die for Jashin!', cost: 28, power: 115, type: 'slash', hits: 2, desc: 'Guadaña ×2 · marca ritual.' },
                { id: 'jashin_bulwark', name: 'Ritual Guard', cry: 'Jashin blesses me!', cost: 30, power: 0, type: 'support', buff: { def: 2.15 }, turns: 3, cover: true, coverHits: 5, heal: 70, desc: 'DEF ↑↑↑ · cover 5 · autocura.' },
                { id: 'jashin_blood', name: 'Death Controlling Blood', cry: 'Feel my pain!', cost: 36, power: 0, type: 'support',
                    reflectDamage: true, reflectMul: 1, turns: 3, cooldown: 3,
                    desc: 'Rito de Jashin · 3 turnos: el daño que recibe Hidan se devuelve al atacante. CD 3.' },
                { id: 'immortal_rite', name: 'Jashin Immortality', cry: 'I can\'t die!', cost: 48, power: 0, type: 'support', once: true,
                    transform: true, transformPersistent: true, transformUpkeep: 10,
                    transformDef: 1.35, transformAtk: 1.2, heal: 160,
                    cover: true, coverHits: 6,
                    desc: 'TRANSFORM · rito de Jashin · muro + gran cura · 1 uso.' }
            ],
            transformedSkills: [
                { id: 'scythe_frenzy', name: 'Scythe Frenzy', cry: 'More blood!', cost: 32, power: 130, type: 'slash', hits: 3, desc: 'Guadaña frenética ×3.' },
                { id: 'jashin_bulwark_x', name: 'Jashin Bulwark', cry: 'Worship!', cost: 28, power: 0, type: 'support', buff: { def: 2.0 }, turns: 3, cover: true, coverHits: 4, heal: 50, desc: 'DEF ↑↑ · cover.' },
                { id: 'jashin_blood_x', name: 'Death Controlling Blood Max', cry: 'Share my pain!', cost: 32, power: 0, type: 'support',
                    reflectDamage: true, reflectMul: 1.25, turns: 3, cooldown: 3,
                    desc: 'Rito máximo · 3 turnos: refleja 125% del daño al atacante. CD 3.' },
                { id: 'jashin_judgment', name: 'Jashin\'s Judgment', cry: 'For Jashin!', cost: 55, power: 175, type: 'curse', once: true, desc: 'Juicio ritual · 1 uso.' }
            ] },

        // —— JoJo lote (Stands / Hamon) ——
        { id: 'polnareff', name: 'Jean Pierre Polnareff', series: 'JoJo', role: 'DPS', roleTag: 'Silver Chariot', color: '#bdc3c7', accent: '#e74c3c',
            transform: true, transformName: 'Silver Chariot', resist: ['pierce', 'slash'], weak: ['fire', 'curse'],
            maxHp: 275, maxSp: 140, atk: 62, def: 24, agi: 44, luk: 22,
            skills: [
                { id: 'chariot_thrust', name: 'Rapier Thrust', cry: 'Silver Chariot!', cost: 28, power: 110, type: 'pierce', hits: 3, desc: 'Estocadas rápidas ×3.' },
                { id: 'shooting_star', name: 'Shooting Star', cry: 'Take this!', cost: 34, power: 130, type: 'pierce', desc: 'Lanza la hoja.' },
                { id: 'chariot_guard', name: 'Armor Guard', cry: 'Hmph!', cost: 26, power: 0, type: 'support', buff: { def: 1.4, luk: 1.2 }, turns: 2, desc: 'Armadura · DEF ↑' },
                { id: 'sc_awaken', name: 'Silver Chariot', cry: 'Silver Chariot!', cost: 54, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.45, transformAgi: 1.5, desc: 'TRANSFORM · Silver Chariot.' }
            ],
            transformedSkills: [
                { id: 'million_stab', name: 'Horus Stab', cry: 'HORUS!', cost: 36, power: 145, type: 'pierce', hits: 6, desc: 'Aluvión de estocadas.' },
                { id: 'armor_off', name: 'Armor Off', cry: 'Faster!', cost: 30, power: 0, type: 'support', once: true, buff: { agi: 1.7, atk: 1.25 }, turns: 3, desc: 'Sin armadura · AGI ↑↑' },
                { id: 'blade_shot', name: 'Blade Shot Max', cry: 'Shooting Star!', cost: 42, power: 165, type: 'pierce', desc: 'Hoja disparada.' },
                { id: 'chariot_finale', name: 'Chariot Finale', cry: 'This is it!', cost: 58, power: 180, type: 'pierce', hits: 4, desc: 'Finisher ×4.' }
            ] },
        { id: 'caesar', name: 'Caesar Anthonio Zeppeli', series: 'JoJo', role: 'Caster', roleTag: 'Hamon', color: '#5dade2', accent: '#f5b7b1',
            transform: true, transformName: 'Bubble Mode', resist: ['bless', 'water'], weak: ['curse', 'fire'],
            maxHp: 280, maxSp: 150, atk: 58, def: 26, agi: 36, luk: 20,
            skills: [
                { id: 'bubble_launcher', name: 'Bubble Launcher', cry: 'Bubble Launcher!', cost: 28, power: 105, type: 'water', hits: 3, desc: 'Burbujas Hamon ×3.' },
                { id: 'bubble_cutter', name: 'Bubble Cutter', cry: 'Hamon!', cost: 34, power: 125, type: 'slash', desc: 'Discos de burbuja.' },
                { id: 'hamon_breath', name: 'Hamon Breath', cry: 'Ripple!', cost: 30, power: 0, type: 'support', partyBuff: { atk: 1.2, def: 1.15 }, turns: 3, desc: 'Hamon · buff equipo.' },
                { id: 'caesar_awaken', name: 'Bubble Mode', cry: 'This is my Hamon!', cost: 56, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.4, transformAgi: 1.25, desc: 'TRANSFORM · Hamon al máximo.' }
            ],
            transformedSkills: [
                { id: 'gliding_cutter', name: 'Gliding Bubble Cutter', cry: 'Cutter!', cost: 38, power: 150, type: 'slash', hits: 4, desc: 'Discos guiados.' },
                { id: 'bubble_lens', name: 'Bubble Lens', cry: 'Hamon!', cost: 36, power: 140, type: 'bless', aoe: true, desc: 'Lentes · AoE bendición.' },
                { id: 'satiporoja', name: 'Satiporoja Scarf', cry: 'Ripple!', cost: 32, power: 0, type: 'support', buff: { def: 1.5, luk: 1.3 }, turns: 2, desc: 'Bufanda · DEF/LUK ↑' },
                { id: 'final_ripple', name: 'Final Ripple', cry: 'CAESAR!', cost: 62, power: 185, type: 'bless', once: true, desc: 'Último Hamon · 1 uso.' }
            ] },
        { id: 'kakyoin', name: 'Noriaki Kakyoin', series: 'JoJo', role: 'Caster', roleTag: 'Hierophant Green', color: '#1e8449', accent: '#58d68d',
            transform: true, transformName: 'Hierophant Green', resist: ['pierce', 'psy'], weak: ['fire', 'slash'],
            maxHp: 270, maxSp: 155, atk: 60, def: 22, agi: 34, luk: 26,
            skills: [
                { id: 'emerald_splash', name: 'Emerald Splash', cry: 'Emerald Splash!', cost: 32, power: 115, type: 'pierce', hits: 4, desc: 'Esmeraldas ×4.' },
                { id: 'hierophant_bind', name: 'Hierophant Bind', cry: 'Got you!', cost: 30, power: 0, type: 'support', debuff: { agi: 0.55 }, debuffTurns: 2, targetEnemy: true, desc: 'Hilos · AGI ↓↓' },
                { id: 'remote_control', name: 'Remote Control', cry: 'Hierophant!', cost: 28, power: 100, type: 'psy', desc: 'Control a distancia.' },
                { id: 'hg_awaken', name: 'Hierophant Green', cry: 'Hierophant Green!', cost: 54, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.4, transformAgi: 1.2, desc: 'TRANSFORM · Hierophant Green.' }
            ],
            transformedSkills: [
                { id: 'emerald_max', name: '20m Emerald Splash', cry: 'EMERALD SPLASH!', cost: 44, power: 160, type: 'pierce', hits: 6, aoe: true, desc: 'Barrera de esmeraldas AoE.' },
                { id: 'marionette', name: 'Marionette', cry: 'Move!', cost: 34, power: 130, type: 'psy', debuff: { atk: 0.75 }, debuffTurns: 2, desc: 'Manipula · ATK ↓' },
                { id: 'web_trap', name: 'Web Trap', cry: 'Caught.', cost: 32, power: 0, type: 'support', skipEnemy: 1, once: true, desc: 'Trampa de hilos · salta turno.' },
                { id: 'emerald_finale', name: 'Emerald Overdrive', cry: 'This is my pride!', cost: 58, power: 175, type: 'pierce', desc: 'Finisher de esmeraldas.' }
            ] },
        { id: 'rohan', name: 'Rohan Kishibe', series: 'JoJo', role: 'Controller', roleTag: "Heaven's Door", color: '#1a5276', accent: '#9b59b6',
            transform: true, transformName: "Heaven's Door", resist: ['psy', 'bless'], weak: ['strike', 'fire'],
            maxHp: 255, maxSp: 160, atk: 56, def: 20, agi: 38, luk: 32,
            skills: [
                { id: 'heaven_page', name: "Heaven's Door", cry: "Heaven's Door!", cost: 30, power: 95, type: 'psy', desc: 'Abre al enemigo como libro.' },
                { id: 'safety_lock', name: 'Safety Lock', cry: 'You cannot attack me.', cost: 34, power: 0, type: 'support', once: true, skipEnemy: 1, desc: 'Prohíbe atacar · salta turno.' },
                { id: 'manga_draft', name: 'Manga Draft', cry: 'I am a genius!', cost: 28, power: 0, type: 'support', partyBuff: { luk: 1.4, agi: 1.2 }, turns: 3, desc: 'Inspiración · LUK/AGI ↑' },
                { id: 'hd_awaken', name: "Heaven's Door", cry: "Heaven's Door!", cost: 52, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 10, transformAtk: 1.35, transformAgi: 1.35, desc: "TRANSFORM · Heaven's Door." }
            ],
            transformedSkills: [
                { id: 'rewrite', name: 'Memory Rewrite', cry: 'Write!', cost: 36, power: 0, type: 'support', debuff: { atk: 0.6, luk: 0.55 }, debuffTurns: 3, targetEnemy: true, desc: 'Reescribe · ATK/LUK ↓↓' },
                { id: 'pen_rush', name: 'G-Pen Rush', cry: 'Ink!', cost: 34, power: 140, type: 'pierce', hits: 4, desc: 'Plumillas ×4.' },
                { id: 'forbid_stand', name: 'Forbid Stand', cry: 'No Stand!', cost: 40, power: 0, type: 'support', once: true, skipEnemy: 1, debuff: { atk: 0.7 }, debuffTurns: 2, targetEnemy: true, desc: 'Bloqueo total · 1 uso.' },
                { id: 'masterpiece', name: 'Masterpiece', cry: 'Pink Dark Boy!', cost: 55, power: 165, type: 'psy', aoe: true, desc: 'Obra maestra AoE.' }
            ] },
        { id: 'risotto', name: 'Risotto Nero', series: 'JoJo', role: 'Assassin', roleTag: 'Metallica', color: '#1c2833', accent: '#c0392b',
            transform: true, transformName: 'Metallica', resist: ['slash', 'pierce'], weak: ['fire', 'elec'],
            maxHp: 285, maxSp: 145, atk: 64, def: 24, agi: 36, luk: 28,
            skills: [
                { id: 'iron_needles', name: 'Iron Needles', cry: 'Metallica!', cost: 30, power: 115, type: 'pierce', hits: 4, desc: 'Agujas de hierro interno.' },
                { id: 'razor_storm', name: 'Razor Storm', cry: 'Cut.', cost: 36, power: 130, type: 'slash', hits: 3, desc: 'Cuchillas en sangre.' },
                { id: 'invisibility', name: 'Iron Cloak', cry: '…', cost: 28, power: 0, type: 'support', buff: { luk: 1.55, agi: 1.3 }, turns: 2, desc: 'Invisibilidad · LUK/AGI ↑' },
                { id: 'metallica_awaken', name: 'Metallica', cry: 'Metallica!', cost: 56, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.5, transformAgi: 1.25, desc: 'TRANSFORM · Metallica.' }
            ],
            transformedSkills: [
                { id: 'scissors', name: 'Blood Scissors', cry: 'Cut them!', cost: 40, power: 160, type: 'slash', desc: 'Tijeras de hierro.' },
                { id: 'oxygen_starve', name: 'Iron Drain', cry: 'Suffocate.', cost: 38, power: 120, type: 'curse', debuff: { atk: 0.7, agi: 0.7 }, debuffTurns: 2, desc: 'Anemia · ATK/AGI ↓' },
                { id: 'staple', name: 'Iron Staple', cry: '…', cost: 32, power: 0, type: 'support', heal: 90, buff: { def: 1.3 }, turns: 2, desc: 'Grapas · cura + DEF ↑' },
                { id: 'assassin_finisher', name: 'Assassin\'s Iron', cry: 'This is the end.', cost: 60, power: 185, type: 'pierce', critBonus: 0.3, desc: 'Finisher crítico.' }
            ] },
        { id: 'ff', name: 'Foo Fighters', series: 'JoJo', role: 'Healer', roleTag: 'Plankton', color: '#1abc9c', accent: '#2ecc71',
            transform: true, transformName: 'Plankton Swarm', resist: ['water', 'pierce'], weak: ['fire', 'ice'],
            maxHp: 290, maxSp: 155, atk: 52, def: 28, agi: 34, luk: 20,
            skills: [
                { id: 'plankton_shot', name: 'Plankton Shot', cry: 'FF!', cost: 26, power: 100, type: 'pierce', hits: 3, desc: 'Balas de plancton.' },
                { id: 'ff_heal', name: 'Wound Seal', cry: 'I got this!', cost: 32, power: 0, type: 'support', heal: 120, desc: 'Sella heridas.' },
                { id: 'water_need', name: 'Water Supply', cry: 'Need water…', cost: 28, power: 0, type: 'support', partyBuff: { def: 1.2 }, turns: 2, heal: 40, aoeHeal: true, desc: 'Hidrata equipo.' },
                { id: 'ff_awaken', name: 'Plankton Swarm', cry: 'Foo Fighters!', cost: 50, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 10, transformAtk: 1.3, transformDef: 1.2, desc: 'TRANSFORM · enjambre.' }
            ],
            transformedSkills: [
                { id: 'bullet_barrage', name: 'Plankton Barrage', cry: 'Fire!', cost: 34, power: 135, type: 'pierce', hits: 5, desc: 'Ráfaga ×5.' },
                { id: 'ff_heal_max', name: 'Colony Heal', cry: 'Stay with me!', cost: 36, power: 0, type: 'support', heal: 100, aoeHeal: true, cleanse: true, desc: 'Cura equipo + limpia.' },
                { id: 'invade', name: 'Invade Body', cry: 'Gotcha!', cost: 38, power: 145, type: 'water', debuff: { agi: 0.65 }, debuffTurns: 2, desc: 'Invade · AGI ↓' },
                { id: 'ff_finale', name: 'Full Colony', cry: 'We are FF!', cost: 55, power: 160, type: 'water', aoe: true, desc: 'Colonia completa AoE.' }
            ] },
        { id: 'mista', name: 'Guido Mista', series: 'JoJo', role: 'DPS', roleTag: 'Sex Pistols', color: '#2980b9', accent: '#e74c3c',
            transform: true, transformName: 'Sex Pistols', resist: ['pierce'], weak: ['slash', 'elec'],
            maxHp: 275, maxSp: 140, atk: 60, def: 24, agi: 38, luk: 30,
            skills: [
                { id: 'six_shots', name: 'Six Bullets', cry: 'Sex Pistols!', cost: 30, power: 100, type: 'pierce', hits: 6, desc: '6 balas (sin el 4).' },
                { id: 'ricochet', name: 'Ricochet', cry: 'Number 5!', cost: 34, power: 125, type: 'pierce', hits: 2, desc: 'Rebote guiado.' },
                { id: 'lucky_7', name: 'Lucky Number', cry: 'Not 4!', cost: 26, power: 0, type: 'support', buff: { luk: 1.5, agi: 1.2 }, turns: 3, desc: 'Suerte · LUK ↑' },
                { id: 'sp_awaken', name: 'Sex Pistols', cry: 'Sex Pistols!', cost: 52, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.4, transformAgi: 1.3, desc: 'TRANSFORM · Sex Pistols.' }
            ],
            transformedSkills: [
                { id: 'kick_bullet', name: 'Pistols Kick', cry: 'GO!', cost: 36, power: 145, type: 'pierce', hits: 4, desc: 'Pistols patean balas.' },
                { id: 'point_blank', name: 'Point Blank', cry: 'Eat this!', cost: 42, power: 170, type: 'pierce', critBonus: 0.25, desc: 'A quemarropa.' },
                { id: 'redirect_all', name: 'Full Redirect', cry: 'All of you!', cost: 40, power: 135, type: 'pierce', aoe: true, desc: 'Rebotes AoE.' },
                { id: 'number_finale', name: 'Number Finale', cry: 'Sex Pistols!', cost: 58, power: 180, type: 'pierce', hits: 6, desc: 'Los 6 juntos.' }
            ] },
        { id: 'narancia', name: 'Narancia Ghirga', series: 'JoJo', role: 'DPS', roleTag: 'Aerosmith', color: '#8e44ad', accent: '#f39c12',
            transform: true, transformName: 'Aerosmith', resist: ['pierce', 'wind'], weak: ['elec', 'ice'],
            maxHp: 250, maxSp: 135, atk: 58, def: 18, agi: 40, luk: 24,
            skills: [
                { id: 'machine_guns', name: 'Machine Guns', cry: 'Aerosmith!', cost: 28, power: 95, type: 'pierce', hits: 5, desc: 'Ametralladoras.' },
                { id: 'co2_radar', name: 'CO₂ Radar', cry: 'Found you!', cost: 26, power: 0, type: 'support', debuff: { luk: 0.6 }, debuffTurns: 2, targetEnemy: true, partyBuff: { luk: 1.3 }, turns: 2, desc: 'Radar · LUK enemigo ↓' },
                { id: 'little_bomb', name: 'Little Boy', cry: 'BOMB!', cost: 36, power: 135, type: 'fire', desc: 'Bomba pequeña.' },
                { id: 'aero_awaken', name: 'Aerosmith', cry: 'Aerosmith!', cost: 50, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 10, transformAtk: 1.4, transformAgi: 1.35, desc: 'TRANSFORM · Aerosmith.' }
            ],
            transformedSkills: [
                { id: 'strafe_run', name: 'Strafing Run', cry: 'Volare via!', cost: 34, power: 140, type: 'pierce', hits: 6, desc: 'Pasada de ametralladora.' },
                { id: 'bombing_run', name: 'Bombing Run', cry: 'Drop it!', cost: 44, power: 155, type: 'fire', aoe: true, desc: 'Bombardeo AoE.' },
                { id: 'prop_slice', name: 'Propeller Slice', cry: 'Cut!', cost: 32, power: 125, type: 'slash', hits: 2, desc: 'Hélice · melee.' },
                { id: 'vollare', name: 'Volare Via', cry: 'VOLARE VIA!', cost: 55, power: 170, type: 'pierce', desc: 'Finisher aéreo.' }
            ] },
        { id: 'anasui', name: 'Narciso Anasui', series: 'JoJo', role: 'DPS', roleTag: 'Diver Down', color: '#16a085', accent: '#9b59b6',
            transform: true, transformName: 'Diver Down', resist: ['strike', 'slash'], weak: ['elec', 'curse'],
            maxHp: 280, maxSp: 145, atk: 62, def: 26, agi: 36, luk: 18,
            skills: [
                { id: 'dive_punch', name: 'Dive Punch', cry: 'Diver Down!', cost: 30, power: 120, type: 'strike', desc: 'Golpe que se sumerge.' },
                { id: 'store_force', name: 'Stored Force', cry: 'Stay inside!', cost: 34, power: 130, type: 'strike', desc: 'Fuerza almacenada.' },
                { id: 'rearrange', name: 'Rearrange', cry: 'Switch!', cost: 28, power: 0, type: 'support', debuff: { def: 0.7, agi: 0.8 }, debuffTurns: 2, targetEnemy: true, desc: 'Reordena · DEF/AGI ↓' },
                { id: 'dd_awaken', name: 'Diver Down', cry: 'Diver Down!', cost: 54, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.45, transformDef: 1.15, desc: 'TRANSFORM · Diver Down.' }
            ],
            transformedSkills: [
                { id: 'bone_twist', name: 'Bone Twist', cry: 'Break!', cost: 40, power: 160, type: 'strike', desc: 'Tuerce huesos por dentro.' },
                { id: 'phase_guard', name: 'Phase Guard', cry: 'I protect her!', cost: 32, power: 0, type: 'support', buff: { def: 1.55 }, turns: 2, cover: true, desc: 'Bucea en aliado · cover.' },
                { id: 'spring_trap', name: 'Spring Trap', cry: 'Surprise!', cost: 38, power: 145, type: 'strike', hits: 2, desc: 'Fuerza liberada ×2.' },
                { id: 'full_dive', name: 'Full Dive', cry: 'DIVER DOWN!', cost: 58, power: 180, type: 'strike', desc: 'Inmersión total.' }
            ] },
        { id: 'weather', name: 'Weather Report', series: 'JoJo', role: 'Caster', roleTag: 'Weather Report', color: '#5dade2', accent: '#ecf0f1',
            transform: true, transformName: 'Weather Report', resist: ['wind', 'water', 'elec'], weak: ['curse', 'fire'],
            maxHp: 300, maxSp: 165, atk: 66, def: 26, agi: 34, luk: 22,
            skills: [
                { id: 'air_pressure', name: 'Air Pressure', cry: 'Weather Report.', cost: 30, power: 115, type: 'wind', desc: 'Presión atmosférica.' },
                { id: 'lightning', name: 'Cloud Lightning', cry: 'Thunder.', cost: 36, power: 135, type: 'elec', desc: 'Rayo localizado.' },
                { id: 'oxygen', name: 'Oxygen Drain', cry: '…', cost: 32, power: 0, type: 'support', debuff: { atk: 0.7, agi: 0.7 }, debuffTurns: 2, targetEnemy: true, desc: 'Oxígeno ↓ · ATK/AGI ↓' },
                { id: 'wr_awaken', name: 'Weather Report', cry: 'Weather Report!', cost: 62, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.5, transformAgi: 1.25, desc: 'TRANSFORM · control total.' }
            ],
            transformedSkills: [
                { id: 'rain_storm', name: 'Localized Rain', cry: 'Rain.', cost: 40, power: 150, type: 'water', aoe: true, desc: 'Lluvia intensa AoE.' },
                { id: 'heavy_weather', name: 'Heavy Weather', cry: 'Heavy Weather…', cost: 55, power: 0, type: 'support', once: true, skipEnemy: 1, debuff: { atk: 0.6, luk: 0.5 }, debuffTurns: 3, targetEnemy: true, desc: 'Caracoles · salta + debuff.' },
                { id: 'wind_blade', name: 'Wind Blade', cry: 'Cut.', cost: 36, power: 145, type: 'wind', hits: 3, desc: 'Cuchillas de viento.' },
                { id: 'atmosphere', name: 'Atmosphere Crush', cry: 'This is weather.', cost: 64, power: 195, type: 'almighty', desc: 'Aplastamiento atmosférico.' }
            ] },
        { id: 'abbacchio', name: 'Leone Abbacchio', series: 'JoJo', role: 'Support', roleTag: 'Moody Blues', color: '#5b2c6f', accent: '#a569bd',
            transform: true, transformName: 'Moody Blues', resist: ['psy'], weak: ['fire', 'bless'],
            maxHp: 265, maxSp: 145, atk: 50, def: 26, agi: 28, luk: 28,
            skills: [
                { id: 'replay_hit', name: 'Replay Strike', cry: 'Moody Blues.', cost: 28, power: 100, type: 'strike', desc: 'Golpe básico del Stand.' },
                { id: 'investigate', name: 'Replay', cry: 'Rewind.', cost: 30, power: 0, type: 'support', partyBuff: { luk: 1.45 }, turns: 3, debuff: { luk: 0.7 }, debuffTurns: 2, targetEnemy: true, desc: 'Investiga · LUK ↑ / enemigo ↓' },
                { id: 'ex_cop', name: 'Ex-Cop Combo', cry: 'Hmph.', cost: 26, power: 95, type: 'strike', hits: 2, desc: 'Puños de policía.' },
                { id: 'mb_awaken', name: 'Moody Blues', cry: 'Moody Blues!', cost: 50, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 10, transformAtk: 1.3, transformDef: 1.15, desc: 'TRANSFORM · Moody Blues.' }
            ],
            transformedSkills: [
                { id: 'fast_forward', name: 'Fast-Forward', cry: 'Skip.', cost: 34, power: 125, type: 'strike', hits: 3, desc: 'Acelera la grabación.' },
                { id: 'perfect_copy', name: 'Perfect Copy', cry: 'Copy.', cost: 38, power: 140, type: 'psy', desc: 'Copia un golpe pasado.' },
                { id: 'expose', name: 'Expose Weakness', cry: 'Got it.', cost: 32, power: 0, type: 'support', debuff: { def: 0.65, luk: 0.7 }, debuffTurns: 3, targetEnemy: true, desc: 'Revela · DEF/LUK ↓' },
                { id: 'last_replay', name: 'Last Replay', cry: 'This is the truth.', cost: 52, power: 155, type: 'almighty', once: true, desc: 'Última grabación · 1 uso.' }
            ] },
        { id: 'bucciarati', name: 'Bruno Bucciarati', series: 'JoJo', role: 'DPS', roleTag: 'Sticky Fingers', color: '#ecf0f1', accent: '#f4d03f',
            transform: true, transformName: 'Sticky Fingers', resist: ['slash', 'strike'], weak: ['elec', 'curse'],
            maxHp: 290, maxSp: 150, atk: 64, def: 28, agi: 38, luk: 22,
            skills: [
                { id: 'zipper_punch', name: 'Zipper Punch', cry: 'Sticky Fingers!', cost: 30, power: 115, type: 'strike', hits: 3, desc: 'Puños con cremallera.' },
                { id: 'unzip', name: 'Unzip', cry: 'Arrivederci!', cost: 34, power: 130, type: 'slash', desc: 'Desabrocha al enemigo.' },
                { id: 'zip_space', name: 'Zip Space', cry: 'Inside!', cost: 28, power: 0, type: 'support', buff: { agi: 1.4, def: 1.25 }, turns: 2, desc: 'Movilidad · AGI/DEF ↑' },
                { id: 'sf_awaken', name: 'Sticky Fingers', cry: 'Sticky Fingers!', cost: 56, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.45, transformAgi: 1.35, desc: 'TRANSFORM · Sticky Fingers.' }
            ],
            transformedSkills: [
                { id: 'aria', name: 'ARIA', cry: 'ARIA!', cost: 38, power: 150, type: 'strike', hits: 5, desc: 'Barrage de cremalleras.' },
                { id: 'arm_extend', name: 'Arm Zip', cry: 'Reach!', cost: 36, power: 145, type: 'pierce', desc: 'Brazo extendido.' },
                { id: 'zipper_trap', name: 'Zipper Trap', cry: 'Got you!', cost: 34, power: 0, type: 'support', skipEnemy: 1, once: true, desc: 'Trampa · salta turno.' },
                { id: 'arrivederci', name: 'Arrivederci', cry: 'Arrivederci.', cost: 60, power: 185, type: 'slash', desc: 'Finisher del capo.' }
            ] },
        { id: 'pucci', name: 'Enrico Pucci', series: 'JoJo', role: 'Boss', roleTag: 'Made in Heaven', color: '#2c3e50', accent: '#f4d03f',
            transform: true, transformName: 'Made in Heaven', resist: ['curse', 'almighty'], weak: ['bless', 'wind'],
            maxHp: 310, maxSp: 160, atk: 70, def: 26, agi: 42, luk: 24,
            skills: [
                { id: 'whitesnake_disc', name: 'Memory Disc', cry: 'Whitesnake.', cost: 32, power: 110, type: 'psy', debuff: { atk: 0.75 }, debuffTurns: 2, desc: 'Extrae disco · ATK ↓' },
                { id: 'cmoon_grav', name: 'C-Moon Gravity', cry: 'C-Moon!', cost: 36, power: 130, type: 'curse', desc: 'Invierte gravedad.' },
                { id: 'faith', name: 'Heaven Plan', cry: 'Heaven awaits.', cost: 30, power: 0, type: 'support', buff: { atk: 1.3, agi: 1.25 }, turns: 3, desc: 'Fe · ATK/AGI ↑' },
                { id: 'mih_awaken', name: 'Made in Heaven', cry: 'Made in Heaven!', cost: 70, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 15, transformAtk: 1.6, transformAgi: 1.7, desc: 'TRANSFORM · Made in Heaven.' }
            ],
            transformedSkills: [
                { id: 'time_accel', name: 'Time Acceleration', cry: 'Faster!', cost: 42, power: 0, type: 'support', once: true, skipEnemy: 1, buff: { agi: 1.6, atk: 1.35 }, turns: 3, desc: 'Acelera tiempo · salta turno.' },
                { id: 'mih_slash', name: 'Heaven Slash', cry: 'Useless!', cost: 40, power: 170, type: 'slash', hits: 4, desc: 'Cortes a velocidad divina.' },
                { id: 'universe_reset', name: 'Universe Reset', cry: 'This is heaven!', cost: 72, power: 210, type: 'almighty', aoe: true, once: true, desc: 'Reset · AoE almighty · 1 uso.' },
                { id: 'gravity_crush', name: 'Gravity Crush', cry: 'C-Moon!', cost: 48, power: 175, type: 'curse', desc: 'Gravedad extrema.' }
            ] },
        { id: 'okuyasu', name: 'Okuyasu Nijimura', series: 'JoJo', role: 'DPS', roleTag: 'The Hand', color: '#1a5276', accent: '#f4d03f',
            transform: true, transformName: 'The Hand', resist: ['strike'], weak: ['psy', 'bless'],
            maxHp: 300, maxSp: 125, atk: 60, def: 28, agi: 26, luk: 14,
            skills: [
                { id: 'erase_swipe', name: 'Space Erase', cry: 'The Hand!', cost: 32, power: 125, type: 'slash', desc: 'Borra espacio.' },
                { id: 'pull_in', name: 'Come Here!', cry: 'OI!', cost: 28, power: 0, type: 'support', debuff: { agi: 0.5 }, debuffTurns: 2, targetEnemy: true, desc: 'Tira del enemigo · AGI ↓↓' },
                { id: 'dumb_rush', name: 'Crazy Rush', cry: 'I\'ll kill you!', cost: 26, power: 105, type: 'strike', hits: 3, desc: 'Embestida bruta.' },
                { id: 'hand_awaken', name: 'The Hand', cry: 'The Hand!', cost: 52, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.45, transformDef: 1.15, desc: 'TRANSFORM · The Hand.' }
            ],
            transformedSkills: [
                { id: 'erase_max', name: 'Big Erase', cry: 'ERASE!', cost: 40, power: 165, type: 'slash', desc: 'Borrado masivo.' },
                { id: 'tele_slash', name: 'Space Pull Slash', cry: 'Gotcha!', cost: 36, power: 145, type: 'slash', hits: 2, desc: 'Tira y corta.' },
                { id: 'yare_yare_oku', name: 'I\'m not dumb!', cry: 'Josuke!', cost: 30, power: 0, type: 'support', buff: { atk: 1.4, def: 1.25 }, turns: 2, desc: 'Concentración · ATK/DEF ↑' },
                { id: 'erase_finale', name: 'Total Erase', cry: 'THE HAND!', cost: 58, power: 180, type: 'almighty', desc: 'Borra casi todo.' }
            ] },
        { id: 'trish', name: 'Trish Una', series: 'JoJo', role: 'Support', roleTag: 'Spice Girl', color: '#e91e63', accent: '#f4d03f',
            transform: true, transformName: 'Spice Girl', resist: ['strike', 'slash'], weak: ['fire', 'ice'],
            maxHp: 260, maxSp: 145, atk: 52, def: 30, agi: 34, luk: 24,
            skills: [
                { id: 'soften_punch', name: 'Soft Punch', cry: 'Spice Girl!', cost: 28, power: 100, type: 'strike', desc: 'Puño elástico.' },
                { id: 'soften', name: 'Softening', cry: 'WANNABEEE!', cost: 30, power: 0, type: 'support', partyBuff: { def: 1.4 }, turns: 3, debuff: { atk: 0.8 }, debuffTurns: 2, targetEnemy: true, desc: 'Ablanda · DEF ↑ / ATK enemigo ↓' },
                { id: 'bounce', name: 'Rubber Bounce', cry: 'Bounce!', cost: 32, power: 115, type: 'strike', desc: 'Rebote elástico.' },
                { id: 'sg_awaken', name: 'Spice Girl', cry: 'Spice Girl!', cost: 50, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 10, transformAtk: 1.35, transformDef: 1.3, desc: 'TRANSFORM · Spice Girl.' }
            ],
            transformedSkills: [
                { id: 'wanna_be', name: 'WANNABEEE Barrage', cry: 'WANNABEEE!', cost: 36, power: 140, type: 'strike', hits: 5, desc: 'Barrage elástico.' },
                { id: 'soft_wall', name: 'Soft Wall', cry: 'Stay soft!', cost: 34, power: 0, type: 'support', partyBuff: { def: 1.5 }, turns: 2, cover: true, desc: 'Muro blando · cover.' },
                { id: 'trap_rubber', name: 'Rubber Trap', cry: 'Gotcha!', cost: 38, power: 135, type: 'strike', debuff: { agi: 0.6 }, debuffTurns: 2, desc: 'Trampa · AGI ↓↓' },
                { id: 'spice_finale', name: 'Spice Finale', cry: 'This is my resolve!', cost: 55, power: 165, type: 'strike', desc: 'Finisher de Trish.' }
            ] },

        // —— Bleach extras (faltantes del lote) ——
        { id: 'shunsui', name: 'Shunsui Kyōraku', series: 'Bleach', role: 'DPS', roleTag: 'Captain-Commander', color: '#1a5276', accent: '#e74c3c',
            transform: true, transformName: 'Katen Kyōkotsu · Shikai', resist: ['slash', 'wind'], weak: ['fire', 'curse'],
            maxHp: 330, maxSp: 160, atk: 72, def: 30, agi: 40, luk: 28,
            skills: [
                { id: 'bushogoma', name: 'Bushōgoma', cry: 'Katen Kyōkotsu.', cost: 32, power: 125, type: 'wind', hits: 2, desc: 'Torbellino de cuchillas ×2.' },
                { id: 'kageoni', name: 'Kageoni', cry: 'Shadows…', cost: 36, power: 0, type: 'support', debuff: { luk: 0.55, agi: 0.7 }, debuffTurns: 3, targetEnemy: true, desc: 'Juego de sombras · LUK/AGI ↓↓' },
                { id: 'dual_arc', name: 'Dual Scimitar Arc', cry: 'Hmph.', cost: 40, power: 140, type: 'slash', hits: 3, desc: 'Doble katana en arco.' },
                { id: 'katen_shikai', name: 'Katen Kyōkotsu', cry: 'Katen Kyōkotsu!', cost: 68, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 15, transformAtk: 1.65, transformAgi: 1.35, transformDef: 1.15, desc: 'TRANSFORM · Shikai · juegos infantiles mortales.' }
            ],
            transformedSkills: [
                { id: 'takaoni', name: 'Takaoni', cry: 'High ground.', cost: 38, power: 160, type: 'slash', desc: 'Quien está arriba gana.' },
                { id: 'irooni', name: 'Irooni', cry: 'Pick a color…', cost: 44, power: 150, type: 'slash', aoe: true, desc: 'Juego de colores AoE.' },
                { id: 'sake_flow', name: 'Saké Flow', cry: 'Another cup?', cost: 32, power: 0, type: 'support', buff: { atk: 1.4, luk: 1.35 }, turns: 3, desc: 'ATK/LUK ↑ · ritmo de combate.' },
                { id: 'kageoni_fin', name: 'Kageoni Finale', cry: 'Game over.', cost: 60, power: 210, type: 'curse', desc: 'Jaque mate desde la sombra.' }
            ] },
        { id: 'urahara', name: 'Kisuke Urahara', series: 'Bleach', role: 'Caster', roleTag: 'Shopkeeper Genius', color: '#1e8449', accent: '#f4d03f',
            transform: true, transformName: 'Benihime Liberada', resist: ['curse', 'psy'], weak: ['slash'],
            maxHp: 295, maxSp: 170, atk: 64, def: 26, agi: 38, luk: 30,
            skills: [
                { id: 'nake_benihime', name: 'Nake, Benihime', cry: 'Nake, Benihime!', cost: 34, power: 130, type: 'fire', desc: 'Grito carmesí.' },
                { id: 'chikasumi', name: 'Chikasumi no Tate', cry: 'Chikasumi no Tate!', cost: 30, power: 0, type: 'support', buff: { def: 1.55 }, turns: 2, cover: true, coverHits: 3, desc: 'Escudo hexagonal · cover.' },
                { id: 'shibari', name: 'Shibari, Benihime', cry: 'Shibari!', cost: 36, power: 0, type: 'support', debuff: { agi: 0.55, atk: 0.8 }, debuffTurns: 2, targetEnemy: true, desc: 'Red carmesí · ATK/AGI ↓' },
                { id: 'benihime_wake', name: 'Awaken, Benihime', cry: 'Sing, Benihime!', cost: 64, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 14, transformAtk: 1.55, transformAgi: 1.3, desc: 'TRANSFORM · Benihime · reestructura el campo.' }
            ],
            transformedSkills: [
                { id: 'nake_max', name: 'Nake Max', cry: 'NAKE!', cost: 40, power: 170, type: 'fire', desc: 'Grito carmesí potenciado.' },
                { id: 'kamisori', name: 'Kamisori, Benihime', cry: 'Kamisori!', cost: 46, power: 155, type: 'slash', aoe: true, desc: 'Cuchilla carmesí AoE.' },
                { id: 'restructure', name: 'Kannonbiraki Pulse', cry: 'Interesting…', cost: 48, power: 0, type: 'support', once: true, partyBuff: { atk: 1.35, def: 1.25 }, turns: 3, heal: 80, aoeHeal: true, desc: 'Reestructura · buff + cura · 1 uso.' },
                { id: 'hado99', name: 'Hadō 99 · Goryūtenmetsu', cry: 'Hadō 99!', cost: 62, power: 205, type: 'fire', desc: 'Kidō devastador.' }
            ] },
        { id: 'ginjo', name: 'Kūgo Ginjō', series: 'Bleach', role: 'DPS', roleTag: 'Fullbring · Cross of Scaffold', color: '#27ae60', accent: '#ecf0f1',
            resist: ['strike', 'curse'], weak: ['bless', 'elec'],
            maxHp: 310, maxSp: 145, atk: 70, def: 28, agi: 34, luk: 18,
            skills: [
                { id: 'scaffold_slash', name: 'Cross of Scaffold', cry: 'Take this!', cost: 30, power: 125, type: 'slash', desc: 'Tajo de Fullbring.' },
                { id: 'power_siphon', name: 'Power Siphon', cry: 'Your power is mine.', cost: 34, power: 95, type: 'curse', heal: 40, debuff: { atk: 0.75 }, debuffTurns: 2, desc: 'Roba fuerza · cura + ATK ↓' },
                { id: 'cero_ginjo', name: 'Cero', cry: 'Cero!', cost: 42, power: 150, type: 'curse', desc: 'Cero verde Fullbring.' },
                { id: 'getsuga_stolen', name: 'Getsuga · Stolen', cry: 'GETSUGA!', cost: 58, power: 185, type: 'slash', desc: 'Getsuga con poder robado.' }
            ] },
        { id: 'gantenbainne', name: 'Gantenbainne Mosqueda', series: 'Bleach', role: 'Tank', roleTag: 'Privaron · Dragra', color: '#5dade2', accent: '#ecf0f1',
            resist: ['strike', 'slash'], weak: ['elec', 'ice'],
            maxHp: 380, maxSp: 120, atk: 58, def: 44, agi: 22, luk: 12,
            skills: [
                { id: 'dragra_bash', name: 'Dragra Bash', cry: 'Dragra!', cost: 28, power: 120, type: 'strike', desc: 'Golpe de hoja cristalina.' },
                { id: 'fur_guard', name: 'Fur Guard', cry: 'Come on!', cost: 30, power: 0, type: 'support', buff: { def: 1.6 }, turns: 3, cover: true, coverHits: 4, desc: 'DEF ↑ · cover 4.' },
                { id: 'sonido_crash', name: 'Sonído Crash', cry: 'Sonído!', cost: 36, power: 135, type: 'strike', hits: 2, desc: 'Embiste Sonído ×2.' },
                { id: 'cero_privaron', name: 'Cero Privaron', cry: 'Cero!', cost: 52, power: 160, type: 'curse', desc: 'Cero de Privaron Espada.' }
            ] }
    ];

    const mk = (e) => ({
        maxHp: 260, maxSp: 130, atk: 54, def: 22, agi: 32, luk: 18,
        img: `assets/sprites/anim/${e.id}_idle.png`,
        accent: '#f4d03f', role: 'DPS', roleTag: 'Destino',
        resist: [], weak: [],
        ...e
    });

    extras.forEach(raw => {
        const p = mk(raw);
        const idx = BattleData.party.findIndex(x => x.id === p.id);
        if (idx >= 0) BattleData.party[idx] = { ...BattleData.party[idx], ...p };
        else BattleData.party.push(p);
    });

    // 6★ mythic — stronger baselines than gold 5★
    const MYTHIC_IDS = new Set([
        'gojo', 'sukuna', 'hakari', 'yuta',
        'diavolo', 'dio', 'kira', 'pucci', 'weather',
        'doflamingo', 'zoro', 'sanji',
        'aizen', 'ulquiorra', 'grimmjow', 'shunsui',
        'sasuke', 'jiraiya', 'kakashi', 'itachi', 'hidan',
        'tanjiro', 'gyomei', 'kokushibo', 'rengoku',
        'denji', 'makima'
    ]);
    BattleData.party.forEach((p) => {
        if (!MYTHIC_IDS.has(p.id)) return;
        p.mythic = true;
        p.maxHp = Math.round((p.maxHp || 280) * 1.1);
        p.maxSp = Math.round((p.maxSp || 130) * 1.08);
        p.atk = Math.round((p.atk || 55) * 1.14);
        p.def = Math.round((p.def || 22) * 1.08);
        p.agi = Math.round((p.agi || 30) * 1.1);
        p.luk = Math.round((p.luk || 16) * 1.08);
    });
})();
