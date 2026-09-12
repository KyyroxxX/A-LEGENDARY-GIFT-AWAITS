/**
 * Kimetsu no Yaiba / Demon Slayer roster.
 * Merged into BattleData at load (bootKimetsu).
 * Daki → transform = Gyutaro (dúo Upper Moon 6).
 */
const KimetsuData = {
    SERIES: 'Kimetsu no Yaiba',

    party: [
        // ── 6★ ──
        {
            id: 'tanjiro', name: 'Tanjiro Kamado', series: 'Kimetsu no Yaiba', role: 'DPS', roleTag: 'Hinokami Kagura',
            img: 'assets/sprites/anim/tanjiro_idle.png', color: '#c0392b', accent: '#27ae60',
            transform: true, transformName: 'Hinokami Kagura', resist: ['fire', 'slash'], weak: ['ice', 'curse'],
            maxHp: 300, maxSp: 155, atk: 70, def: 28, agi: 42, luk: 26,
            skills: [
                { id: 'water_surface', name: 'Water Surface Slash', cry: 'First Form!', cost: 26, power: 100, type: 'water', desc: 'Respiración del Agua · corte limpio.' },
                { id: 'water_wheel', name: 'Water Wheel', cry: 'Second Form!', cost: 32, power: 120, type: 'water', hits: 2, desc: 'Rueda de agua ×2.' },
                { id: 'dance_fire', name: 'Dance of the Fire God', cry: 'Hinokami!', cost: 40, power: 145, type: 'fire', desc: 'Kagura · danza ígnea.' },
                { id: 'hinokami', name: 'Hinokami Kagura', cry: 'Hinokami Kagura!', cost: 68, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.55, transformAgi: 1.3, desc: 'TRANSFORM · Respiración del Sol.' }
            ],
            transformedSkills: [
                { id: 'burning_bones', name: 'Burning Bones, Summer Sun', cry: 'Summer Sun!', cost: 36, power: 155, type: 'fire', hits: 3, desc: 'Llamas en ráfaga ×3.' },
                { id: 'solar_heat', name: 'Solar Heat Haze', cry: 'Heat Haze!', cost: 40, power: 165, type: 'fire', desc: 'Corte solar · calor.' },
                { id: 'clear_blue', name: 'Clear Blue Sky', cry: 'Clear Blue Sky!', cost: 44, power: 175, type: 'fire', aoe: true, desc: 'Cielo azul · AoE fuego.' },
                { id: 'setting_sun', name: 'Setting Sun Transformation', cry: 'Setting Sun!', cost: 60, power: 210, type: 'fire', once: true, desc: 'Sol poniente · 1 uso.' }
            ],
            gachaLegendary: true
        },
        {
            id: 'gyomei', name: 'Gyomei Himejima', series: 'Kimetsu no Yaiba', role: 'Tank', roleTag: 'Stone Hashira',
            img: 'assets/sprites/anim/gyomei_idle.png', color: '#5d6d7e', accent: '#f5b041',
            transform: true, transformName: 'Stone Breathing', resist: ['strike', 'earth', 'slash'], weak: ['curse', 'psy'],
            maxHp: 420, maxSp: 130, atk: 66, def: 48, agi: 22, luk: 18,
            skills: [
                { id: 'serpentine', name: 'Serpentinite Bipolar', cry: 'Namu Amida Butsu.', cost: 32, power: 125, type: 'earth', hits: 2, desc: 'Hacha + mayal ×2.' },
                { id: 'upper_smash', name: 'Upper Smash', cry: '…', cost: 36, power: 140, type: 'strike', desc: 'Mayal overhead.' },
                { id: 'stone_guard', name: 'Stone Vigil', cry: 'Forgive me.', cost: 30, power: 0, type: 'support', buff: { def: 2.1 }, turns: 3, cover: true, coverHits: 4, heal: 50, desc: 'DEF ↑↑ · cover · cura.' },
                { id: 'stone_mark', name: 'Stone Breathing · Mark', cry: 'Stone Breathing!', cost: 62, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.4, transformDef: 1.35, desc: 'TRANSFORM · Marca · Stone Breathing.' }
            ],
            transformedSkills: [
                { id: 'arches', name: 'Arches of Justice', cry: 'Justice!', cost: 40, power: 160, type: 'earth', hits: 4, desc: 'Cadena en arco ×4.' },
                { id: 'tilted_balance', name: 'Tilted Balance', cry: '…', cost: 38, power: 150, type: 'strike', aoe: true, desc: 'Equilibrio · AoE.' },
                { id: 'stone_wall', name: 'Stone Wall', cry: 'Namu…', cost: 28, power: 0, type: 'support', partyBuff: { def: 1.45 }, turns: 2, cover: true, desc: 'Muro · DEF equipo.' },
                { id: 'pebble', name: 'Pebble · Final', cry: 'Amen.', cost: 58, power: 200, type: 'earth', once: true, desc: 'Juicio de piedra · 1 uso.' }
            ],
            gachaLegendary: true
        },
        {
            id: 'kokushibo', name: 'Kokushibo', series: 'Kimetsu no Yaiba', role: 'Slasher', roleTag: 'Upper Moon 1',
            img: 'assets/sprites/anim/kokushibo_idle.png', color: '#6c3483', accent: '#d7bde2',
            transform: true, transformName: 'Moon Breathing', resist: ['slash', 'curse', 'dark'], weak: ['fire', 'bless'],
            maxHp: 380, maxSp: 160, atk: 74, def: 34, agi: 40, luk: 24,
            skills: [
                { id: 'moonlit', name: 'Moonlit Blade', cry: 'Moon Breathing.', cost: 30, power: 125, type: 'slash', hits: 2, desc: 'Luna · cortes fantasma.' },
                { id: 'crescent', name: 'Crescent Moon Slash', cry: 'First Form.', cost: 36, power: 140, type: 'slash', desc: 'Creciente lunar.' },
                { id: 'flesh_katana', name: 'Flesh Katana', cry: '…', cost: 34, power: 130, type: 'curse', debuff: { def: 0.75 }, debuffTurns: 2, desc: 'Espada de carne · DEF ↓.' },
                { id: 'moon_breath', name: 'Moon Breathing', cry: 'Upper Rank One.', cost: 70, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 14, transformAtk: 1.6, transformAgi: 1.25, desc: 'TRANSFORM · Respiración de la Luna.' }
            ],
            transformedSkills: [
                { id: 'sixteen_moons', name: 'Sixteen Moon Continual Slashes', cry: 'Sixteen!', cost: 42, power: 170, type: 'slash', hits: 5, desc: 'Dieciséis lunas ×5.' },
                { id: 'moon_dragon', name: 'Moon Dragon Head Dance', cry: 'Dragon!', cost: 48, power: 185, type: 'slash', aoe: true, desc: 'Dragón lunar AoE.' },
                { id: 'mirror_dim', name: 'Mirror of Misfortune', cry: '…', cost: 36, power: 0, type: 'support', buff: { luk: 1.5, atk: 1.25 }, turns: 3, desc: 'Espejo · LUK/ATK ↑.' },
                { id: 'umbra', name: 'Umbra · Final Moon', cry: 'Perish.', cost: 65, power: 220, type: 'curse', once: true, desc: 'Luna final · 1 uso.' }
            ],
            fromEnemy: true,
            gachaLegendary: true
        },
        {
            id: 'rengoku', name: 'Kyojuro Rengoku', series: 'Kimetsu no Yaiba', role: 'DPS', roleTag: 'Flame Hashira',
            img: 'assets/sprites/anim/rengoku_idle.png', color: '#e74c3c', accent: '#f9e79f',
            transform: true, transformName: 'Flame Breathing', resist: ['fire', 'slash'], weak: ['water', 'ice'],
            maxHp: 310, maxSp: 145, atk: 72, def: 30, agi: 38, luk: 28,
            skills: [
                { id: 'unknowing_fire', name: 'Unknowing Fire', cry: 'Set your heart ablaze!', cost: 28, power: 115, type: 'fire', desc: 'Primera Forma · llamarada.' },
                { id: 'rising_scorching', name: 'Rising Scorching Sun', cry: 'Second Form!', cost: 34, power: 130, type: 'fire', desc: 'Sol abrasador ascendente.' },
                { id: 'blooming_flame', name: 'Blooming Flame Undulation', cry: 'Third Form!', cost: 36, power: 125, type: 'fire', aoe: true, desc: 'Ondulación · AoE.' },
                { id: 'flame_hashira', name: 'Flame Hashira', cry: 'Umai!', cost: 66, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.55, transformAgi: 1.2, desc: 'TRANSFORM · Respiración de la Llama.' }
            ],
            transformedSkills: [
                { id: 'rengoku_form', name: 'Rengoku', cry: 'Ninth Form · RENGOKU!', cost: 55, power: 200, type: 'fire', once: true, desc: 'Novena Forma · 1 uso.' },
                { id: 'flame_tiger', name: 'Flame Tiger', cry: 'Fifth Form!', cost: 40, power: 160, type: 'fire', hits: 2, desc: 'Tigre de fuego.' },
                { id: 'heart_ablaze', name: 'Heart Ablaze', cry: 'Set your heart ablaze!', cost: 30, power: 0, type: 'support', partyBuff: { atk: 1.35 }, turns: 3, desc: 'Ánimo · ATK equipo ↑.' },
                { id: 'scorching_rush', name: 'Scorching Rush', cry: 'Umai!', cost: 38, power: 150, type: 'fire', hits: 3, desc: 'Embiste · tres llamas.' }
            ],
            gachaLegendary: true
        },

        // ── 5★ ──
        {
            id: 'giyu', name: 'Giyu Tomioka', series: 'Kimetsu no Yaiba', role: 'DPS', roleTag: 'Water Hashira',
            img: 'assets/sprites/anim/giyu_idle.png', color: '#1a5276', accent: '#5dade2',
            transform: true, transformName: 'Water Breathing', resist: ['water', 'slash'], weak: ['elec', 'fire'],
            maxHp: 285, maxSp: 140, atk: 64, def: 30, agi: 40, luk: 22,
            skills: [
                { id: 'water_slash', name: 'Water Surface Slash', cry: '…', cost: 26, power: 105, type: 'water', desc: 'Corte de superficie.' },
                { id: 'flowing_dance', name: 'Flowing Dance', cry: 'Third Form.', cost: 32, power: 118, type: 'water', hits: 3, desc: 'Danza fluida ×3.' },
                { id: 'dead_calm', name: 'Dead Calm', cry: 'Eleventh Form.', cost: 34, power: 0, type: 'support', buff: { def: 1.8, luk: 1.3 }, turns: 2, desc: 'Calma total · DEF/LUK ↑.' },
                { id: 'water_breath', name: 'Water Breathing', cry: 'Water Breathing.', cost: 60, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.45, transformAgi: 1.3, desc: 'TRANSFORM · dragón de agua.' }
            ],
            transformedSkills: [
                { id: 'striking_tide', name: 'Striking Tide', cry: 'Fourth Form!', cost: 36, power: 145, type: 'water', hits: 4, desc: 'Marea · ×4.' },
                { id: 'water_dragon', name: 'Water Dragon', cry: 'Tenth Form!', cost: 48, power: 175, type: 'water', aoe: true, desc: 'Dragón acuático AoE.' },
                { id: 'calm_drop', name: 'Drop Ripple Thrust', cry: '…', cost: 34, power: 140, type: 'pierce', desc: 'Estocada de gota.' },
                { id: 'dead_calm_x', name: 'Dead Calm Max', cry: 'Eleventh Form.', cost: 32, power: 0, type: 'support', buff: { def: 2.0 }, turns: 2, cover: true, desc: 'Calma · cover.' }
            ]
        },
        {
            id: 'tengen', name: 'Tengen Uzui', series: 'Kimetsu no Yaiba', role: 'DPS', roleTag: 'Sound Hashira',
            img: 'assets/sprites/anim/tengen_idle.png', color: '#f4d03f', accent: '#e74c3c',
            transform: true, transformName: 'Sound Breathing', resist: ['slash', 'strike'], weak: ['curse', 'psy'],
            maxHp: 300, maxSp: 135, atk: 66, def: 28, agi: 44, luk: 30,
            skills: [
                { id: 'roar', name: 'Roar', cry: 'Flashy!', cost: 28, power: 110, type: 'slash', hits: 2, desc: 'Cleaver dual · roar.' },
                { id: 'constant_resounding', name: 'Constant Resounding Slashes', cry: 'Second Form!', cost: 34, power: 125, type: 'slash', hits: 3, desc: 'Ecos · ×3.' },
                { id: 'score', name: 'Musical Score', cry: 'I see the score!', cost: 30, power: 0, type: 'support', buff: { luk: 1.6, agi: 1.35 }, turns: 3, desc: 'Partitura · LUK/AGI ↑.' },
                { id: 'sound_breath', name: 'Sound Breathing', cry: 'God of Festivals!', cost: 62, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.45, transformAgi: 1.4, desc: 'TRANSFORM · Sound Breathing.' }
            ],
            transformedSkills: [
                { id: 'string_performance', name: 'String Performance', cry: 'Fifth Form!', cost: 42, power: 165, type: 'slash', hits: 4, desc: 'Cuerdas · ×4.' },
                { id: 'bomb_rush', name: 'Bomb Rush', cry: 'Kaboom!', cost: 40, power: 150, type: 'fire', aoe: true, desc: 'Explosivos AoE.' },
                { id: 'flashy_buff', name: 'Flashy Entrance', cry: 'Flamboyant!', cost: 28, power: 0, type: 'support', partyBuff: { atk: 1.25, luk: 1.2 }, turns: 2, desc: 'Flashy · buff equipo.' },
                { id: 'finale', name: 'Festival Finale', cry: 'Umai… wait.', cost: 58, power: 190, type: 'slash', once: true, desc: 'Finale · 1 uso.' }
            ]
        },
        {
            id: 'sanemi', name: 'Sanemi Shinazugawa', series: 'Kimetsu no Yaiba', role: 'Slasher', roleTag: 'Wind Hashira',
            img: 'assets/sprites/anim/sanemi_idle.png', color: '#27ae60', accent: '#ecf0f1',
            transform: true, transformName: 'Wind Breathing', resist: ['wind', 'slash'], weak: ['earth', 'ice'],
            maxHp: 290, maxSp: 130, atk: 70, def: 24, agi: 48, luk: 20,
            skills: [
                { id: 'dust_whirlwind', name: 'Dust Whirlwind Cutter', cry: 'First Form!', cost: 28, power: 115, type: 'wind', hits: 2, desc: 'Torbellino · ×2.' },
                { id: 'claws_purifying', name: 'Claws · Purifying Wind', cry: 'Second Form!', cost: 34, power: 130, type: 'wind', hits: 3, desc: 'Garras de viento.' },
                { id: 'marechi', name: 'Marechi Blood', cry: 'Taste this!', cost: 26, power: 0, type: 'support', debuff: { atk: 0.7, agi: 0.75 }, debuffTurns: 2, targetEnemy: true, desc: 'Sangre marechi · ATK/AGI ↓.' },
                { id: 'wind_breath', name: 'Wind Breathing', cry: 'Wind Hashira!', cost: 60, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.5, transformAgi: 1.4, desc: 'TRANSFORM · Wind Breathing.' }
            ],
            transformedSkills: [
                { id: 'gale_slash', name: 'Gale Slash', cry: 'Fourth Form!', cost: 36, power: 150, type: 'wind', hits: 4, desc: 'Vendaval ×4.' },
                { id: 'idaten', name: 'Idaten Typhoon', cry: 'Typhoon!', cost: 48, power: 180, type: 'wind', aoe: true, desc: 'Tifón AoE.' },
                { id: 'cold_mountain', name: 'Cold Mountain Wind', cry: '…', cost: 34, power: 140, type: 'wind', desc: 'Viento de montaña.' },
                { id: 'wind_rage', name: 'Wind Rage', cry: 'Die!', cost: 55, power: 195, type: 'wind', once: true, desc: 'Furia · 1 uso.' }
            ]
        },
        {
            id: 'mitsuri', name: 'Mitsuri Kanroji', series: 'Kimetsu no Yaiba', role: 'DPS', roleTag: 'Love Hashira',
            img: 'assets/sprites/anim/mitsuri_idle.png', color: '#e91e8c', accent: '#82e0aa',
            transform: true, transformName: 'Love Breathing', resist: ['slash', 'strike'], weak: ['curse', 'ice'],
            maxHp: 270, maxSp: 145, atk: 62, def: 22, agi: 50, luk: 32,
            skills: [
                { id: 'first_love', name: 'First Love', cry: 'Love Breathing!', cost: 26, power: 100, type: 'slash', hits: 2, desc: 'Látigo · primer amor.' },
                { id: 'love_pangs', name: 'Love Pangs', cry: 'Second Form!', cost: 32, power: 118, type: 'slash', hits: 3, desc: 'Punzadas · ×3.' },
                { id: 'catlove', name: 'Catlove Shower', cry: 'Shower!', cost: 34, power: 125, type: 'slash', aoe: true, desc: 'Lluvia de amor AoE.' },
                { id: 'love_breath', name: 'Love Breathing', cry: 'I love everyone!', cost: 58, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.4, transformAgi: 1.5, desc: 'TRANSFORM · Love Breathing.' }
            ],
            transformedSkills: [
                { id: 'swinging', name: 'Swinging Slash', cry: 'Fifth Form!', cost: 38, power: 150, type: 'slash', hits: 4, desc: 'Látigo · ×4.' },
                { id: 'cathexis', name: 'Cathexis', cry: 'Sixth Form!', cost: 48, power: 175, type: 'slash', aoe: true, desc: 'Cathexis · AoE.' },
                { id: 'love_buff', name: 'Heart Strength', cry: 'Ganbatte!', cost: 28, power: 0, type: 'support', partyBuff: { atk: 1.3, luk: 1.25 }, turns: 3, desc: 'Corazón · buff equipo.' },
                { id: 'love_finale', name: 'Infinite Love', cry: 'Love!', cost: 56, power: 190, type: 'slash', once: true, desc: 'Amor infinito · 1 uso.' }
            ]
        },
        {
            id: 'muichiro', name: 'Muichiro Tokito', series: 'Kimetsu no Yaiba', role: 'Slasher', roleTag: 'Mist Hashira',
            img: 'assets/sprites/anim/muichiro_idle.png', color: '#1abc9c', accent: '#d5f5e3',
            transform: true, transformName: 'Mist Breathing', resist: ['wind', 'slash'], weak: ['fire', 'elec'],
            maxHp: 260, maxSp: 150, atk: 64, def: 20, agi: 52, luk: 26,
            skills: [
                { id: 'low_clouds', name: 'Low Clouds · Distant Haze', cry: 'First Form.', cost: 26, power: 105, type: 'wind', desc: 'Niebla baja.' },
                { id: 'eight_layered', name: 'Eight-Layered Mist', cry: 'Second Form!', cost: 34, power: 120, type: 'slash', hits: 4, desc: 'Ocho capas ×4.' },
                { id: 'scattering', name: 'Scattering Mist Splash', cry: '…', cost: 30, power: 0, type: 'support', buff: { luk: 1.55, agi: 1.4 }, turns: 3, desc: 'Niebla · evasión ↑.' },
                { id: 'mist_breath', name: 'Mist Breathing', cry: 'Mist Hashira.', cost: 60, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.45, transformAgi: 1.5, desc: 'TRANSFORM · Mist Breathing.' }
            ],
            transformedSkills: [
                { id: 'obscuring', name: 'Obscuring Clouds', cry: 'Seventh Form!', cost: 40, power: 0, type: 'support', buff: { luk: 1.8, agi: 1.55 }, turns: 3, desc: 'Nubes · LUK/AGI ↑↑.' },
                { id: 'sea_mist', name: 'Sea of Clouds and Haze', cry: 'Fifth Form!', cost: 38, power: 155, type: 'wind', hits: 3, desc: 'Mar de nubes.' },
                { id: 'moon_mist', name: 'Lunar Dispersing Mist', cry: 'Sixth Form!', cost: 44, power: 165, type: 'slash', aoe: true, desc: 'Niebla lunar AoE.' },
                { id: 'mist_end', name: 'Shifting Flow Slash', cry: '…', cost: 55, power: 185, type: 'slash', once: true, desc: 'Flujo · 1 uso.' }
            ]
        },
        {
            id: 'obanai', name: 'Obanai Iguro', series: 'Kimetsu no Yaiba', role: 'Assassin', roleTag: 'Serpent Hashira',
            img: 'assets/sprites/anim/obanai_idle.png', color: '#2c3e50', accent: '#a569bd',
            transform: true, transformName: 'Serpent Breathing', resist: ['pierce', 'slash'], weak: ['fire', 'strike'],
            maxHp: 255, maxSp: 145, atk: 66, def: 22, agi: 50, luk: 28,
            skills: [
                { id: 'winding', name: 'Winding Serpent Slash', cry: 'First Form.', cost: 28, power: 110, type: 'slash', hits: 2, desc: 'Serpiente · corte ondulado.' },
                { id: 'narrow', name: 'Narrow Fang', cry: 'Third Form!', cost: 32, power: 125, type: 'pierce', desc: 'Colmillo estrecho.' },
                { id: 'kaburamaru', name: 'Kaburamaru\'s Eye', cry: 'Kaburamaru.', cost: 26, power: 0, type: 'support', buff: { luk: 1.5 }, turns: 3, desc: 'Visión · LUK ↑.' },
                { id: 'serpent_breath', name: 'Serpent Breathing', cry: 'Serpent!', cost: 58, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.45, transformAgi: 1.45, desc: 'TRANSFORM · Serpent Breathing.' }
            ],
            transformedSkills: [
                { id: 'slithering', name: 'Slithering Serpent', cry: 'Fifth Form!', cost: 38, power: 150, type: 'slash', hits: 4, desc: 'Serpiente · ×4.' },
                { id: 'coiled', name: 'Coiled Slash', cry: '…', cost: 36, power: 145, type: 'pierce', debuff: { agi: 0.65 }, debuffTurns: 2, desc: 'Enrollado · AGI ↓↓.' },
                { id: 'twin_headed', name: 'Twin-Headed Reptile', cry: 'Fourth Form!', cost: 42, power: 160, type: 'slash', aoe: true, desc: 'Doble cabeza AoE.' },
                { id: 'serpent_end', name: 'Serpent\'s Judgment', cry: 'Fall.', cost: 55, power: 185, type: 'slash', once: true, desc: 'Juicio · 1 uso.' }
            ]
        },
        {
            id: 'akaza', name: 'Akaza', series: 'Kimetsu no Yaiba', role: 'DPS', roleTag: 'Upper Moon 3',
            img: 'assets/sprites/anim/akaza_idle.png', color: '#e74c3c', accent: '#5dade2',
            transform: true, transformName: 'Destructive Death', resist: ['strike', 'fire'], weak: ['water', 'bless'],
            maxHp: 320, maxSp: 140, atk: 72, def: 26, agi: 46, luk: 22,
            skills: [
                { id: 'air_type', name: 'Air Type', cry: 'Destructive Death!', cost: 28, power: 115, type: 'strike', hits: 2, desc: 'Puños de aire.' },
                { id: 'disorder', name: 'Disorder', cry: 'Disorder!', cost: 34, power: 130, type: 'strike', hits: 3, desc: 'Desorden · ×3.' },
                { id: 'compass', name: 'Compass Needle', cry: 'I sense you.', cost: 30, power: 0, type: 'support', buff: { luk: 1.45, atk: 1.25 }, turns: 3, desc: 'Brújula · LUK/ATK ↑.' },
                { id: 'destructive', name: 'Destructive Death', cry: 'Upper Rank Three!', cost: 64, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.55, transformAgi: 1.35, desc: 'TRANSFORM · Destructive Death.' }
            ],
            transformedSkills: [
                { id: 'annihilation', name: 'Annihilation Type', cry: 'Annihilation!', cost: 50, power: 190, type: 'strike', aoe: true, desc: 'Aniquilación AoE.' },
                { id: 'leg_type', name: 'Leg Type · Crown Splitter', cry: 'Crown!', cost: 40, power: 160, type: 'strike', desc: 'Patada · corona.' },
                { id: 'eight_layered_a', name: 'Eight-Layered Demon Core', cry: 'Eight!', cost: 42, power: 155, type: 'strike', hits: 4, desc: 'Núcleo · ×4.' },
                { id: 'final_form_a', name: 'Technique Development', cry: 'Strong ones!', cost: 60, power: 210, type: 'strike', once: true, desc: 'Técnica final · 1 uso.' }
            ],
            fromEnemy: true
        },
        {
            id: 'doma', name: 'Doma', series: 'Kimetsu no Yaiba', role: 'Caster', roleTag: 'Upper Moon 2',
            img: 'assets/sprites/anim/doma_idle.png', color: '#5dade2', accent: '#f5b7b1',
            transform: true, transformName: 'Frozen Lotus', resist: ['ice', 'water'], weak: ['fire', 'bless'],
            maxHp: 300, maxSp: 165, atk: 60, def: 24, agi: 36, luk: 30,
            skills: [
                { id: 'frost_fans', name: 'Frost Fans', cry: 'Fufufu~', cost: 28, power: 105, type: 'ice', hits: 2, desc: 'Abanicos helados.' },
                { id: 'lotus', name: 'Cold White Princesses', cry: 'Princesses!', cost: 36, power: 130, type: 'ice', aoe: true, desc: 'Princesas de hielo AoE.' },
                { id: 'wintry', name: 'Wintry Icicles', cry: 'Cold~', cost: 32, power: 120, type: 'ice', debuff: { agi: 0.7 }, debuffTurns: 2, desc: 'Carámbanos · AGI ↓.' },
                { id: 'frozen_lotus', name: 'Frozen Lotus', cry: 'Paradise!', cost: 62, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.4, transformAgi: 1.2, desc: 'TRANSFORM · loto congelado.' }
            ],
            transformedSkills: [
                { id: 'crystalline', name: 'Crystalline Divine Child', cry: 'Divine!', cost: 40, power: 155, type: 'ice', hits: 3, desc: 'Niño divino · ×3.' },
                { id: 'glacial', name: 'Glacial Blossom', cry: 'Bloom~', cost: 48, power: 170, type: 'ice', aoe: true, desc: 'Flor glacial AoE.' },
                { id: 'absorb', name: 'Absorb', cry: 'Delicious~', cost: 34, power: 100, type: 'curse', heal: 60, desc: 'Absorbe · cura.' },
                { id: 'paradise', name: 'Eternal Paradise', cry: 'Join me!', cost: 58, power: 195, type: 'ice', once: true, desc: 'Paraíso · 1 uso.' }
            ],
            fromEnemy: true
        },
        {
            id: 'nezuko', name: 'Nezuko Kamado', series: 'Kimetsu no Yaiba', role: 'Caster', roleTag: 'Blood Demon Art',
            img: 'assets/sprites/anim/nezuko_idle.png', color: '#e91e63', accent: '#f5b7b1',
            transform: true, transformName: 'Awakened Demon', resist: ['fire', 'curse'], weak: ['bless', 'slash'],
            maxHp: 280, maxSp: 140, atk: 58, def: 26, agi: 42, luk: 24,
            skills: [
                { id: 'kick', name: 'Demonic Kick', cry: 'Mmmph!', cost: 24, power: 95, type: 'strike', desc: 'Patada demoníaca.' },
                { id: 'claw', name: 'Blood Claw', cry: '…', cost: 30, power: 115, type: 'slash', desc: 'Garras de sangre.' },
                { id: 'protect', name: 'Protect Brother', cry: 'Mmm!', cost: 28, power: 0, type: 'support', cover: true, coverHits: 3, buff: { def: 1.5 }, turns: 2, desc: 'Protege · cover.' },
                { id: 'exploding_blood', name: 'Exploding Blood', cry: 'Bakuketsu!', cost: 58, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.5, transformAgi: 1.35, desc: 'TRANSFORM · Blood Demon Art.' }
            ],
            transformedSkills: [
                { id: 'bakuketsu', name: 'Exploding Blood Max', cry: 'Bakuketsu!', cost: 40, power: 165, type: 'fire', aoe: true, desc: 'Sangre explosiva AoE.' },
                { id: 'ember', name: 'Ember Claw', cry: '…', cost: 34, power: 140, type: 'fire', hits: 2, desc: 'Garras ígneas.' },
                { id: 'regen_n', name: 'Demon Regen', cry: 'Mmmph!', cost: 30, power: 0, type: 'support', heal: 90, buff: { def: 1.3 }, turns: 2, desc: 'Regeneración.' },
                { id: 'awakened_strike', name: 'Awakened Strike', cry: '!!!', cost: 55, power: 185, type: 'fire', once: true, desc: 'Despertar · 1 uso.' }
            ]
        },

        // ── 4★ ──
        {
            id: 'zenitsu', name: 'Zenitsu Agatsuma', series: 'Kimetsu no Yaiba', role: 'Assassin', roleTag: 'Thunder Breathing',
            img: 'assets/sprites/anim/zenitsu_idle.png', color: '#f4d03f', accent: '#5dade2',
            transform: true, transformName: 'Godspeed', resist: ['elec'], weak: ['earth', 'curse'],
            maxHp: 230, maxSp: 125, atk: 68, def: 18, agi: 55, luk: 18,
            skills: [
                { id: 'thunderclap', name: 'Thunderclap and Flash', cry: 'First Form!', cost: 30, power: 125, type: 'elec', desc: 'Hekireki Issen.' },
                { id: 'sixfold', name: 'Sixfold', cry: 'Sixfold!', cost: 38, power: 140, type: 'elec', hits: 3, desc: 'Seis destellos.' },
                { id: 'fear', name: 'Total Panic', cry: 'I\'m gonna die!', cost: 22, power: 0, type: 'support', buff: { agi: 1.4 }, turns: 2, desc: 'Pánico · AGI ↑ (¿?).' },
                { id: 'godspeed', name: 'Godspeed', cry: 'Zzzzz…', cost: 55, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 10, transformAtk: 1.5, transformAgi: 1.6, desc: 'TRANSFORM · dormido · Godspeed.' }
            ],
            transformedSkills: [
                { id: 'eightfold', name: 'Eightfold', cry: 'Eightfold!', cost: 40, power: 160, type: 'elec', hits: 4, desc: 'Ocho destellos.' },
                { id: 'godspeed_slash', name: 'Godspeed Slash', cry: '…', cost: 44, power: 175, type: 'elec', desc: 'Godspeed puro.' },
                { id: 'flock', name: 'Thunder Swarm', cry: 'Thunder!', cost: 42, power: 155, type: 'elec', aoe: true, desc: 'Enjambre · AoE.' },
                { id: 'seventh', name: 'Seventh Form · Flaming Thunder God', cry: 'Kaigaku!', cost: 58, power: 200, type: 'elec', once: true, desc: 'Séptima Forma · 1 uso.' }
            ]
        },
        {
            id: 'inosuke', name: 'Inosuke Hashibira', series: 'Kimetsu no Yaiba', role: 'Bruiser', roleTag: 'Beast Breathing',
            img: 'assets/sprites/anim/inosuke_idle.png', color: '#5d6d7e', accent: '#58d68d',
            transform: true, transformName: 'Beast Breathing', resist: ['strike', 'slash'], weak: ['psy', 'fire'],
            maxHp: 275, maxSp: 115, atk: 66, def: 28, agi: 40, luk: 16,
            skills: [
                { id: 'pierce_fang', name: 'First Fang · Pierce', cry: 'Inosuke!', cost: 26, power: 105, type: 'pierce', hits: 2, desc: 'Colmillo · perfora.' },
                { id: 'devour', name: 'Third Fang · Devour', cry: 'Devour!', cost: 32, power: 120, type: 'slash', hits: 2, desc: 'Devorar · doble corte.' },
                { id: 'spatial', name: 'Spatial Awareness', cry: 'I feel it!', cost: 28, power: 0, type: 'support', buff: { luk: 1.5, agi: 1.3 }, turns: 3, desc: 'Percepción · LUK/AGI ↑.' },
                { id: 'beast_breath', name: 'Beast Breathing', cry: 'King of the Mountains!', cost: 56, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 10, transformAtk: 1.5, transformAgi: 1.35, desc: 'TRANSFORM · Beast Breathing.' }
            ],
            transformedSkills: [
                { id: 'crazy_cutting', name: 'Crazy Cutting', cry: 'Eighth Fang!', cost: 38, power: 150, type: 'slash', hits: 4, desc: 'Corte loco ×4.' },
                { id: 'explosive_rush', name: 'Explosive Rush', cry: 'Fourth Fang!', cost: 40, power: 155, type: 'strike', aoe: true, desc: 'Embiste AoE.' },
                { id: 'palisade', name: 'Palisade Bite', cry: 'Bite!', cost: 34, power: 140, type: 'pierce', desc: 'Mordisco empalizada.' },
                { id: 'king_beast', name: 'King of Beasts', cry: 'INOSUKE!', cost: 55, power: 185, type: 'slash', once: true, desc: 'Rey · 1 uso.' }
            ]
        },
        {
            id: 'daki', name: 'Daki', series: 'Kimetsu no Yaiba', role: 'Caster', roleTag: 'Upper Moon 6',
            img: 'assets/sprites/anim/daki_idle.png', color: '#e91e8c', accent: '#82e0aa',
            transform: true, transformName: 'Gyutaro',
            resist: ['slash', 'curse'], weak: ['fire', 'bless'],
            maxHp: 270, maxSp: 140, atk: 58, def: 22, agi: 38, luk: 26,
            skills: [
                { id: 'obi_slash', name: 'Obi Slash', cry: 'How rude!', cost: 28, power: 110, type: 'slash', hits: 2, desc: 'Fajas · corte ×2.' },
                { id: 'obi_cage', name: 'Obi Cage', cry: 'Stay still!', cost: 32, power: 0, type: 'support', debuff: { agi: 0.55, atk: 0.8 }, debuffTurns: 2, targetEnemy: true, desc: 'Jaula de obi · AGI/ATK ↓.' },
                { id: 'eight_layer_obi', name: 'Eight-Layered Obi', cry: 'Eight layers!', cost: 36, power: 130, type: 'slash', aoe: true, desc: 'Ocho capas AoE.' },
                { id: 'call_gyutaro', name: 'Call Gyutaro', cry: 'Nii-chan!', cost: 60, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.55, transformAgi: 1.25, transformDef: 1.15, heal: 80, desc: 'TRANSFORM · Gyutaro (duo Upper Moon 6).' }
            ],
            transformedSkills: [
                { id: 'flesh_kama', name: 'Flesh Kama', cry: 'Die!', cost: 34, power: 145, type: 'slash', hits: 3, desc: 'Hoces de carne · Gyutaro x3.' },
                { id: 'blood_sickle', name: 'Flying Blood Sickles', cry: 'Blood!', cost: 40, power: 155, type: 'curse', aoe: true, desc: 'Hoces de sangre AoE.' },
                { id: 'duo_rush', name: 'Sibling Rush', cry: 'Together!', cost: 38, power: 150, type: 'slash', hits: 2, desc: 'Daki + Gyutaro · asalto.' },
                { id: 'rotten_town', name: 'Rotten Town Massacre', cry: 'Upper Six!', cost: 58, power: 195, type: 'curse', once: true, desc: 'Masacre · 1 uso.' }
            ],
            fromEnemy: true
        },
        {
            id: 'hantengu', name: 'Hantengu', series: 'Kimetsu no Yaiba', role: 'Caster', roleTag: 'Upper Moon 4',
            img: 'assets/sprites/anim/hantengu_idle.png', color: '#922b21', accent: '#f5b041',
            transform: true, transformName: 'Zohakuten',
            resist: ['earth', 'curse'], weak: ['fire', 'slash'],
            maxHp: 260, maxSp: 155, atk: 52, def: 20, agi: 34, luk: 28,
            skills: [
                { id: 'coward', name: 'Coward\'s Cry', cry: 'It wasn\'t me!', cost: 24, power: 0, type: 'support', buff: { luk: 1.4, def: 1.3 }, turns: 2, desc: 'Llanto · LUK/DEF ↑.' },
                { id: 'clone_anger', name: 'Emotion Clone', cry: 'Hate!', cost: 32, power: 115, type: 'curse', desc: 'Clon emocional.' },
                { id: 'wood_bind', name: 'Wood Bind', cry: 'Help!', cost: 30, power: 0, type: 'support', debuff: { agi: 0.6 }, debuffTurns: 2, targetEnemy: true, desc: 'Madera · AGI ↓↓.' },
                { id: 'zohakuten', name: 'Zohakuten', cry: 'Hatred!', cost: 62, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.5, transformAgi: 1.2, desc: 'TRANSFORM · Zohakuten · odio.' }
            ],
            transformedSkills: [
                { id: 'drum_dragon', name: 'Wood Dragon', cry: 'Dragon!', cost: 40, power: 160, type: 'earth', aoe: true, desc: 'Dragón de madera AoE.' },
                { id: 'hatred_beat', name: 'Hatred Beat', cry: 'Zō!', cost: 36, power: 145, type: 'strike', hits: 3, desc: 'Tambores · ×3.' },
                { id: 'uomi', name: 'Uomi Barrage', cry: 'Uomi!', cost: 38, power: 150, type: 'pierce', hits: 4, desc: 'Uomi · ×4.' },
                { id: 'hatred_final', name: 'Crescendo of Hatred', cry: 'PERISH!', cost: 58, power: 190, type: 'curse', once: true, desc: 'Crescendo · 1 uso.' }
            ],
            fromEnemy: true
        },
        {
            id: 'gyokko', name: 'Gyokko', series: 'Kimetsu no Yaiba', role: 'Caster', roleTag: 'Upper Moon 5',
            img: 'assets/sprites/anim/gyokko_idle.png', color: '#1abc9c', accent: '#f5b041',
            transform: true, transformName: 'True Form',
            resist: ['water', 'curse'], weak: ['fire', 'slash'],
            maxHp: 250, maxSp: 150, atk: 56, def: 22, agi: 32, luk: 30,
            skills: [
                { id: 'pot_shot', name: 'Pot Shot', cry: 'Art!', cost: 26, power: 100, type: 'water', desc: 'Disparo desde la vasija.' },
                { id: 'fish_scale', name: 'Fish Scale Guard', cry: 'Beautiful~', cost: 28, power: 0, type: 'support', buff: { def: 1.6 }, turns: 2, desc: 'Escamas · DEF ↑.' },
                { id: 'thousand_needles', name: 'Thousand Needle Fish Kill', cry: 'Needles!', cost: 36, power: 130, type: 'pierce', hits: 4, desc: 'Mil agujas ×4.' },
                { id: 'true_form_g', name: 'True Form', cry: 'My masterpiece!', cost: 58, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.5, transformAgi: 1.25, desc: 'TRANSFORM · forma verdadera.' }
            ],
            transformedSkills: [
                { id: 'water_prison', name: 'Water Prison Pot', cry: 'Drown!', cost: 38, power: 145, type: 'water', debuff: { agi: 0.55 }, debuffTurns: 2, desc: 'Prisión · AGI ↓↓.' },
                { id: 'octopus', name: 'Octopus Barrage', cry: 'Art!', cost: 40, power: 155, type: 'pierce', hits: 3, desc: 'Pulpo · ×3.' },
                { id: 'poison_lab', name: 'Poison Lab', cry: 'Toxic~', cost: 34, power: 120, type: 'curse', dot: 30, dotTurns: 3, desc: 'Veneno DoT.' },
                { id: 'gallery', name: 'Death Gallery', cry: 'Exhibit!', cost: 55, power: 180, type: 'curse', once: true, desc: 'Galería · 1 uso.' }
            ],
            fromEnemy: true
        },
        {
            id: 'sabito', name: 'Sabito', series: 'Kimetsu no Yaiba', role: 'DPS', roleTag: 'Water · Fox Mask',
            img: 'assets/sprites/anim/sabito_idle.png', color: '#e67e22', accent: '#5dade2',
            resist: ['water', 'slash'], weak: ['elec'],
            maxHp: 250, maxSp: 130, atk: 60, def: 24, agi: 40, luk: 22,
            skills: [
                { id: 'fox_slash', name: 'Fox Water Slash', cry: 'Concentrate!', cost: 26, power: 105, type: 'water', desc: 'Corte de aprendiz.' },
                { id: 'water_wheel_s', name: 'Water Wheel', cry: 'Second Form!', cost: 32, power: 120, type: 'water', hits: 2, desc: 'Rueda de agua.' },
                { id: 'mentor_push', name: 'Training Push', cry: 'Again!', cost: 28, power: 0, type: 'support', partyBuff: { atk: 1.25 }, turns: 2, desc: 'Empuje · ATK equipo ↑.' },
                { id: 'final_trial', name: 'Final Selection Spirit', cry: 'Don\'t die!', cost: 50, power: 160, type: 'water', once: true, desc: 'Espíritu de la prueba · 1 uso.' }
            ]
        },

        // ── 3★ ──
        {
            id: 'urokodaki', name: 'Sakonji Urokodaki', series: 'Kimetsu no Yaiba', role: 'Support', roleTag: 'Former Water Hashira',
            img: 'assets/sprites/anim/urokodaki_idle.png', color: '#2980b9', accent: '#ecf0f1',
            resist: ['water'], weak: ['fire'],
            maxHp: 240, maxSp: 140, atk: 48, def: 28, agi: 28, luk: 24,
            skills: [
                { id: 'water_teach', name: 'Water Surface Slash', cry: 'Focus.', cost: 24, power: 90, type: 'water', desc: 'Lección · corte de agua.' },
                { id: 'tengu_guard', name: 'Tengu Guard', cry: '…', cost: 26, power: 0, type: 'support', buff: { def: 1.5 }, turns: 2, cover: true, desc: 'Máscara · cover.' },
                { id: 'mentor_aura', name: 'Master\'s Aura', cry: 'Breathe.', cost: 30, power: 0, type: 'support', partyBuff: { atk: 1.2, def: 1.15 }, turns: 3, desc: 'Aura · buff equipo.' },
                { id: 'flowing_lesson', name: 'Flowing Dance Lesson', cry: 'Again.', cost: 36, power: 115, type: 'water', hits: 2, desc: 'Danza fluida · lección.' }
            ]
        }
    ],

    enemies: {
        kokushibo: { id: 'kokushibo', name: 'Kokushibo', series: 'Kimetsu no Yaiba', role: 'Slasher',
            img: 'assets/sprites/anim/kokushibo_idle.png', maxHp: 520, atk: 70, def: 32, agi: 38,
            resist: ['slash', 'curse'], weak: ['fire', 'bless'], skills: null },
        akaza: { id: 'akaza', name: 'Akaza', series: 'Kimetsu no Yaiba', role: 'DPS',
            img: 'assets/sprites/anim/akaza_idle.png', maxHp: 440, atk: 68, def: 24, agi: 44,
            resist: ['strike'], weak: ['water'], skills: null },
        doma: { id: 'doma', name: 'Doma', series: 'Kimetsu no Yaiba', role: 'Caster',
            img: 'assets/sprites/anim/doma_idle.png', maxHp: 420, atk: 58, def: 22, agi: 34,
            resist: ['ice'], weak: ['fire'], skills: null },
        daki: { id: 'daki', name: 'Daki', series: 'Kimetsu no Yaiba', role: 'Caster',
            img: 'assets/sprites/anim/daki_idle.png', maxHp: 360, atk: 55, def: 20, agi: 36,
            resist: ['slash'], weak: ['fire'], skills: null },
        hantengu: { id: 'hantengu', name: 'Hantengu', series: 'Kimetsu no Yaiba', role: 'Caster',
            img: 'assets/sprites/anim/hantengu_idle.png', maxHp: 340, atk: 50, def: 18, agi: 32,
            resist: ['earth'], weak: ['fire'], skills: null },
        gyokko: { id: 'gyokko', name: 'Gyokko', series: 'Kimetsu no Yaiba', role: 'Caster',
            img: 'assets/sprites/anim/gyokko_idle.png', maxHp: 330, atk: 52, def: 20, agi: 30,
            resist: ['water'], weak: ['fire'], skills: null }
    },

    encounters: {
        story_kn_rengoku: {
            title: 'Kimetsu · Corazón en llamas',
            hint: 'Rengoku. Fuego vs hielo / agua.',
            bg: 'assets/bg/destiny.png',
            rewardInvocations: 40,
            enemies: [
                { id: 'akaza', name: 'Akaza', img: 'assets/sprites/anim/akaza_idle.png', maxHp: 420, atk: 64, def: 22, agi: 42, skills: null }
            ]
        },
        story_kn_um6: {
            title: 'Kimetsu · Distrito del Placer',
            hint: 'Daki. Si se transforma… Gyutaro.',
            bg: 'assets/bg/destiny.png',
            rewardInvocations: 55,
            enemies: [
                { id: 'daki', name: 'Daki', img: 'assets/sprites/anim/daki_idle.png', maxHp: 380, atk: 56, def: 20, agi: 36, skills: null }
            ]
        },
        story_kn_kokushibo: {
            title: 'Kimetsu · Luna superior',
            hint: 'Kokushibo. Bendición / fuego.',
            bg: 'assets/bg/destiny.png',
            rewardInvocations: 90,
            enemies: [
                { id: 'kokushibo', name: 'Kokushibo', img: 'assets/sprites/anim/kokushibo_idle.png', maxHp: 580, atk: 72, def: 34, agi: 40, skills: null }
            ]
        }
    }
};

(function bootKimetsu() {
    if (typeof BattleData === 'undefined') return;
    const fill = (encEnemy) => {
        const full = KimetsuData.enemies[encEnemy.id];
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
    KimetsuData.party.forEach(p => {
        const idx = BattleData.party.findIndex(x => x.id === p.id);
        if (idx >= 0) BattleData.party[idx] = { ...BattleData.party[idx], ...p };
        else BattleData.party.push(p);
    });
    Object.entries(KimetsuData.encounters || {}).forEach(([key, enc]) => {
        BattleData.encounters[key] = { ...enc, enemies: (enc.enemies || []).map(fill) };
    });
})();
