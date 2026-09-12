/**
 * Jujutsu Kaisen roster — party allies, enemies (gacha-playable), encounters.
 * Merged into BattleData by jjk-bootstrap at load.
 */
const JJKData = {
    SERIES: 'Jujutsu Kaisen',

    party: [
        {
            id: 'gojo', name: 'Satoru Gojo', series: 'Jujutsu Kaisen', role: 'DPS', roleTag: 'Limitless',
            img: 'assets/sprites/anim/gojo_idle.png', color: '#5dade2', accent: '#f4d03f',
            transform: true, transformName: 'Unlimited Void', resist: ['curse', 'strike'], weak: ['bless'],
            maxHp: 310, maxSp: 170, atk: 72, def: 28, agi: 48, luk: 35,
            skills: [
                { id: 'blue', name: 'Cursed Technique Lapse: Blue', cry: 'BLUE!', cost: 28, power: 110, type: 'curse', desc: 'Atrae y aplasta con Blue.' },
                { id: 'red', name: 'Cursed Technique Reversal: Red', cry: 'RED!', cost: 36, power: 135, type: 'fire', desc: 'Repulsión explosiva.' },
                { id: 'infinity_guard', name: 'Infinity', cry: 'Nah, I\'d win.', cost: 40, power: 0, type: 'support', buff: { def: 2.0 }, turns: 2, cover: true, desc: 'Infinity · DEF ↑↑ · cubre al equipo.' },
                { id: 'domain_gojo', name: 'Unlimited Void', cry: 'Domain Expansion.', cost: 72, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 14, transformAtk: 1.55, transformAgi: 1.25, desc: 'TRANSFORM · Dominio · técnicas exclusivas.' }
            ],
            transformedSkills: [
                { id: 'hollow_purple', name: 'Hollow Purple', cry: 'Hollow Purple.', cost: 70, power: 220, type: 'curse', aoe: true, desc: 'Borra el área. Nuke AoE.' },
                { id: 'blue_crush', name: 'Maximum Blue', cry: 'BLUE!', cost: 36, power: 150, type: 'curse', debuff: { agi: 0.6 }, debuffTurns: 2, desc: 'Atrae · AGI ↓↓' },
                { id: 'red_blast', name: 'Maximum Red', cry: 'RED!', cost: 40, power: 160, type: 'fire', desc: 'Repulsión máxima.' },
                { id: 'infinity_wall', name: 'Infinity Wall', cry: 'Infinity.', cost: 32, power: 0, type: 'support', partyBuff: { def: 1.5 }, turns: 2, cover: true, desc: 'Cubre · DEF equipo ↑' }
            ],
            gachaLegendary: true
        },
        {
            id: 'yuji', name: 'Yuji Itadori', series: 'Jujutsu Kaisen', role: 'DPS', roleTag: 'Vessel',
            img: 'assets/sprites/anim/yuji_idle.png', color: '#e74c3c', accent: '#f5b7b1',
            transform: true, transformName: 'Cursed Energy Surge', resist: ['strike'], weak: ['curse'],
            maxHp: 295, maxSp: 120, atk: 64, def: 26, agi: 40, luk: 22,
            skills: [
                { id: 'divergent_fist', name: 'Divergent Fist', cry: 'Divergent Fist!', cost: 24, power: 95, type: 'strike', hits: 2, desc: 'Doble impacto retardado.' },
                { id: 'manji_kick', name: 'Manji Kick', cry: '¡Toma!', cost: 22, power: 88, type: 'strike', desc: 'Patada demoledora.' },
                { id: 'blood_burst', name: 'Kaichi', cry: '¡Ahora!', cost: 34, power: 120, type: 'pierce', desc: 'Proyectil de sangre (pacto).' },
                { id: 'ce_surge', name: 'Cursed Energy Surge', cry: 'Let\'s go!', cost: 58, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 11, transformAtk: 1.5, transformAgi: 1.35, desc: 'TRANSFORM · energía maldita a tope.' }
            ],
            transformedSkills: [
                { id: 'divergent_max', name: 'Divergent Fist Max', cry: 'Divergent!', cost: 30, power: 140, type: 'strike', hits: 2, desc: 'Doble impacto potenciado.' },
                { id: 'black_flash_y', name: 'Black Flash', cry: 'BLACK FLASH!', cost: 48, power: 195, type: 'strike', critBonus: 0.5, desc: 'Distorsión espacial · crit ↑↑.' },
                { id: 'manji_storm', name: 'Manji Storm', cry: '¡Toma!', cost: 40, power: 155, type: 'strike', hits: 3, desc: 'Patadas en ráfaga.' },
                { id: 'vessel_rush', name: 'Vessel Rush', cry: 'I\'m the vessel!', cost: 56, power: 175, type: 'strike', aoe: true, desc: 'Embiste AoE.' }
            ]
        },
        {
            id: 'megumi', name: 'Megumi Fushiguro', series: 'Jujutsu Kaisen', role: 'Summoner', roleTag: 'Ten Shadows',
            img: 'assets/sprites/anim/megumi_idle.png', color: '#2c3e50', accent: '#85929e',
            transform: true, transformName: 'Chimera Shadow Garden', resist: ['curse'], weak: ['fire'],
            maxHp: 250, maxSp: 155, atk: 52, def: 24, agi: 36, luk: 28,
            skills: [
                { id: 'divine_dogs', name: 'Divine Dogs', cry: 'Divine Dogs!', cost: 26, power: 90, type: 'slash', hits: 2, desc: 'Lobos de las Diez Sombras.' },
                { id: 'nue', name: 'Nue', cry: 'Nue!', cost: 32, power: 105, type: 'elec', desc: 'Ave eléctrica.' },
                { id: 'toad', name: 'Toad', cry: '¡Atrápalo!', cost: 28, power: 0, type: 'support', debuff: { agi: 0.6 }, debuffTurns: 2, targetEnemy: true, desc: 'Inmoviliza · AGI ↓↓.' },
                { id: 'shadow_garden', name: 'Chimera Shadow Garden', cry: 'Domain Expansion.', cost: 68, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformStages: 2, transformStageNames: ['Chimera Shadow Garden', 'Mahoraga'], transformStageAtk: [1.45, 1.85], transformStageAgi: [1.2, 1.35], transformStageUpkeep: [12, 18], transformUpkeep: 12, transformAtk: 1.45, transformAgi: 1.2, desc: 'TRANSFORM · Sombras · luego Mahoraga.' }
            ],
            transformedSkills: [
                { id: 'dogs_totality', name: 'Divine Dog: Totality', cry: 'Totality!', cost: 34, power: 135, type: 'slash', hits: 3, minTransformStage: 1, desc: 'Lobo fusionado · 3 hits.' },
                { id: 'nue_max', name: 'Nue Max', cry: 'Nue!', cost: 38, power: 145, type: 'elec', aoe: true, minTransformStage: 1, desc: 'Relámpago AoE.' },
                { id: 'shadow_bind', name: 'Shadow Bind', cry: '…', cost: 30, power: 0, type: 'support', debuff: { atk: 0.7, agi: 0.55 }, debuffTurns: 3, targetEnemy: true, minTransformStage: 1, desc: 'Sombras · ATK/AGI ↓↓' },
                { id: 'mahoraga_call', name: 'With this treasure I summon…', cry: 'Mahoraga!', cost: 42, power: 0, type: 'support', once: true, advanceTransform: true, transformAtk: 1.85, transformAgi: 1.35, transformUpkeep: 18, transformStageName: 'Mahoraga', minTransformStage: 1, maxTransformStage: 1, desc: 'Mahoraga · adaptación · upkeep alto.' },
                { id: 'extermination', name: 'Sword of Extermination', cry: 'Adapt.', cost: 50, power: 200, type: 'slash', minTransformStage: 2, desc: 'Espada de exterminio.' },
                { id: 'wheel_adapt', name: 'Adaptation Wheel', cry: '…', cost: 36, power: 0, type: 'support', buff: { def: 1.6, luk: 1.3 }, turns: 2, minTransformStage: 2, desc: 'Rueda · DEF/LUK ↑.' }
            ]
        },
        {
            id: 'nobara', name: 'Nobara Kugisaki', series: 'Jujutsu Kaisen', role: 'Caster', roleTag: 'Straw Doll',
            img: 'assets/sprites/anim/nobara_idle.png', color: '#c0392b', accent: '#f9e79f',
            resist: ['pierce'], weak: ['slash'],
            maxHp: 220, maxSp: 148, atk: 54, def: 18, agi: 34, luk: 30,
            skills: [
                { id: 'resonance', name: 'Resonance', cry: 'Resonance!', cost: 30, power: 115, type: 'curse', desc: 'Clavo · Resonancia.' },
                { id: 'hairpin', name: 'Hairpin', cry: 'Hairpin!', cost: 34, power: 125, type: 'fire', desc: 'Explosión de clavos.' },
                { id: 'straw_debuff', name: 'Straw Doll Technique', cry: '¡Te tengo!', cost: 26, power: 0, type: 'support', debuff: { def: 0.7, atk: 0.8 }, debuffTurns: 3, targetEnemy: true, desc: 'DEF/ATK enemigo ↓.' },
                { id: 'black_flash_n', name: 'Black Flash', cry: 'BLACK FLASH!', cost: 58, power: 168, type: 'strike', critBonus: 0.4, desc: 'Black Flash con martillo.' }
            ]
        },
        {
            id: 'maki', name: 'Maki Zenin', series: 'Jujutsu Kaisen', role: 'Slasher', roleTag: 'Awakened · HR',
            img: 'assets/sprites/anim/maki_idle.png', color: '#1e8449', accent: '#a9dfbf',
            resist: ['curse', 'strike'], weak: ['elec'],
            maxHp: 290, maxSp: 105, atk: 74, def: 32, agi: 46, luk: 20,
            skills: [
                { id: 'split_soul', name: 'Split Soul Katana', cry: 'Split Soul!', cost: 34, power: 140, type: 'slash', desc: 'Corta el alma.' },
                { id: 'zenin_rush', name: 'Zenin Rush', cry: 'Demasiado lento.', cost: 32, power: 115, type: 'slash', hits: 3, desc: 'Tres cortes veloces.' },
                { id: 'hr_focus', name: 'Heavenly Restriction', cry: '…', cost: 30, power: 0, type: 'support', buff: { atk: 1.55, agi: 1.45 }, turns: 3, desc: 'Cuerpo al límite · ATK/AGI ↑↑.' },
                { id: 'clan_purge', name: 'Clan Purge', cry: 'Fall.', cost: 58, power: 185, type: 'slash', aoe: true, desc: 'Barrido letal AoE.' }
            ]
        },
        {
            id: 'todo', name: 'Aoi Todo', series: 'Jujutsu Kaisen', role: 'Tank', roleTag: 'Boogie Woogie',
            img: 'assets/sprites/anim/todo_idle.png', color: '#7d3c98', accent: '#f5b041',
            resist: ['strike', 'slash'], weak: ['ice'],
            maxHp: 340, maxSp: 110, atk: 60, def: 36, agi: 28, luk: 20,
            skills: [
                { id: 'boogie', name: 'Boogie Woogie', cry: 'Boogie Woogie!', cost: 22, power: 0, type: 'support', buff: { luk: 1.5, agi: 1.35 }, turns: 2, desc: 'Cambia posiciones · AGI/LUK ↑.' },
                { id: 'todo_clap', name: 'Simple Domain Smash', cry: '¡Brother!', cost: 30, power: 118, type: 'strike', desc: 'Golpe de hermano.' },
                { id: 'todo_swap', name: 'Swap Strike', cry: 'CLAP!', cost: 34, power: 130, type: 'strike', hits: 2, desc: 'Golpea tras intercambiar.' },
                { id: 'todo_cheer', name: 'Brotherhood', cry: '¡Qué buen gusto!', cost: 36, power: 0, type: 'support', partyBuff: { atk: 1.3 }, turns: 3, desc: 'ATK del equipo ↑.' }
            ]
        },
        {
            id: 'nanami', name: 'Kento Nanami', series: 'Jujutsu Kaisen', role: 'DPS', roleTag: 'Ratio Technique',
            img: 'assets/sprites/anim/nanami_idle.png', color: '#f4d03f', accent: '#1c2833',
            resist: ['slash'], weak: ['curse'],
            maxHp: 280, maxSp: 130, atk: 62, def: 32, agi: 30, luk: 24,
            skills: [
                { id: 'ratio', name: 'Collapse', cry: 'Ratio Technique.', cost: 28, power: 120, type: 'strike', desc: 'Punto débil 7:3.' },
                { id: 'overtime', name: 'Overtime', cry: 'Overtime.', cost: 40, power: 0, type: 'support', once: true, buff: { atk: 1.55, agi: 1.25 }, turns: 4, desc: 'Horas extra · potencia ↑.' },
                { id: 'blunt_cascade', name: 'Blunt Cascade', cry: 'Hmph.', cost: 34, power: 108, type: 'strike', hits: 3, desc: 'Tres impactos precisos.' },
                { id: 'critical_ratio', name: 'Critical Ratio', cry: 'There.', cost: 60, power: 170, type: 'slash', critBonus: 0.5, desc: 'Corte en el ratio perfecto.' }
            ]
        },
        {
            id: 'yuta', name: 'Yuta Okkotsu', series: 'Jujutsu Kaisen', role: 'DPS', roleTag: 'Rika',
            img: 'assets/sprites/anim/yuta_idle.png', color: '#ecf0f1', accent: '#9b59b6',
            transform: true, transformName: 'Rika Manifest', resist: ['curse', 'slash'], weak: ['fire'],
            maxHp: 300, maxSp: 160, atk: 68, def: 26, agi: 38, luk: 22,
            skills: [
                { id: 'yuta_slash', name: 'Cursed Slash', cry: 'Rika!', cost: 26, power: 105, type: 'slash', desc: 'Corte con katana maldita.' },
                { id: 'yuta_copy', name: 'Copied Technique', cry: 'I can use that.', cost: 34, power: 120, type: 'curse', hits: 2, desc: 'Copia un golpe · 2 hits.' },
                { id: 'yuta_guard', name: 'Rika Guard', cry: 'Stay back!', cost: 32, power: 0, type: 'support', partyBuff: { def: 1.35 }, turns: 2, cover: true, desc: 'Rika cubre · DEF ↑' },
                { id: 'rika_manifest', name: 'Don\'t touch him!', cry: 'RIKA!', cost: 64, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.6, transformAgi: 1.2, desc: 'TRANSFORM · Rika se manifiesta · técnicas exclusivas.' }
            ],
            transformedSkills: [
                { id: 'rika_smash', name: 'Rika Smash', cry: 'RIKA!', cost: 36, power: 155, type: 'strike', hits: 3, desc: 'Golpes de Rika.' },
                { id: 'pure_love', name: 'Pure Love Beam', cry: 'I\'ll protect you!', cost: 48, power: 185, type: 'curse', desc: 'Rayo de energía maldita.' },
                { id: 'rika_aoe', name: 'Cursed Swarm', cry: 'Tear them apart!', cost: 52, power: 140, type: 'curse', aoe: true, desc: 'Enjambre AoE.' },
                { id: 'yuta_domain', name: 'Authentic Mutual Love', cry: 'Domain Expansion.', cost: 70, power: 0, type: 'support', once: true, partyBuff: { atk: 1.4, luk: 1.3 }, turns: 3, skipEnemy: 1, desc: 'Dominio · buff + salta 1 turno.' }
            ],
            gachaLegendary: true
        },
        {
            id: 'hakari', name: 'Kinji Hakari', series: 'Jujutsu Kaisen', role: 'Tank', roleTag: 'Idle Death Gamble',
            img: 'assets/sprites/anim/hakari_idle.png', color: '#27ae60', accent: '#f4d03f',
            transform: true, transformName: 'Jackpot', resist: ['strike', 'curse'], weak: ['ice'],
            maxHp: 360, maxSp: 130, atk: 58, def: 34, agi: 36, luk: 40,
            skills: [
                { id: 'hakari_punch', name: 'Trainyard Hook', cry: 'Heh.', cost: 24, power: 100, type: 'strike', desc: 'Gancho demoledor.' },
                { id: 'hakari_rush', name: 'Pachinko Rush', cry: 'Keep rolling.', cost: 30, power: 95, type: 'strike', hits: 3, desc: 'Combo de 3 hits.' },
                { id: 'hakari_luck', name: 'Loaded Dice', cry: 'Odds in my favor.', cost: 28, power: 0, type: 'support', buff: { luk: 1.6, atk: 1.2 }, turns: 3, desc: 'LUK/ATK ↑' },
                { id: 'jackpot', name: 'Idle Death Gamble', cry: 'JACKPOT!', cost: 66, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 8, transformAtk: 1.5, transformAgi: 1.35, transformDef: 1.25, transformHeal: 40, desc: 'TRANSFORM · Jackpot · regen y presión.' }
            ],
            transformedSkills: [
                { id: 'jackpot_fists', name: 'Jackpot Fists', cry: 'Come on!', cost: 32, power: 145, type: 'strike', hits: 4, desc: 'Puños en racha.' },
                { id: 'infinite_mode', name: 'Infinite Mode', cry: 'Can\'t kill me.', cost: 36, power: 0, type: 'support', heal: 90, buff: { def: 1.4 }, turns: 2, desc: 'Regen Jackpot · cura + DEF ↑' },
                { id: 'train_crash', name: 'Metro Crash', cry: 'All aboard!', cost: 48, power: 170, type: 'strike', aoe: true, desc: 'Impacto AoE del dominio.' },
                { id: 'bonus_round', name: 'Bonus Round', cry: 'Another roll!', cost: 40, power: 0, type: 'support', partyBuff: { atk: 1.3, luk: 1.4 }, turns: 3, restoreSp: 20, desc: 'Buff equipo + CP.' }
            ],
            gachaLegendary: true
        }
    ],

    enemies: {
        sukuna: {
            id: 'sukuna', name: 'Ryomen Sukuna', series: 'Jujutsu Kaisen',
            role: 'DPS', roleTag: 'King of Curses',
            img: 'assets/sprites/anim/sukuna_idle.png', color: '#922b21', accent: '#f5b7b1',
            transform: true, transformName: 'Heian Form',
            resist: ['curse', 'fire'], weak: ['bless'],
            maxHp: 520, atk: 70, def: 30, agi: 40,
            skills: [
                { id: 'dismantle', name: 'Dismantle', cry: 'Dismantle.', power: 95, type: 'slash' },
                { id: 'cleave', name: 'Cleave', cry: 'Cleave.', power: 120, type: 'slash' },
                { id: 'furnace', name: 'Open · Furnace', cry: 'Open.', power: 160, type: 'fire', aoe: true },
                { id: 'heian', name: 'Heian Incarnation', cry: 'Know your place.', power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 16, transformAtk: 1.8, transformAgi: 1.3, transformDef: 1.2, cost: 40 }
            ],
            transformedSkills: [
                { id: 'dismantle_max', name: 'Dismantle Max', cry: 'Dismantle.', power: 170, type: 'slash', hits: 3 },
                { id: 'cleave_max', name: 'World Cleave', cry: 'Cleave.', power: 195, type: 'slash' },
                { id: 'fuga', name: 'Fuga · Furnace', cry: 'Open.', power: 180, type: 'fire', aoe: true },
                { id: 'malevolent', name: 'Malevolent Shrine', cry: 'Domain Expansion!', power: 0, type: 'support', once: true, buff: { atk: 1.5 }, turns: 3, skipEnemy: 1 }
            ]
        },
        geto: {
            id: 'geto', name: 'Suguru Geto', series: 'Jujutsu Kaisen',
            img: 'assets/sprites/anim/geto_idle.png', color: '#1a5276', accent: '#d5dbdb',
            resist: ['curse'], weak: ['elec'],
            maxHp: 400, atk: 58, def: 26, agi: 32,
            skills: [
                { id: 'uzumaki', name: 'Maximum: Uzumaki', cry: 'Uzumaki!', power: 150, type: 'curse', aoe: true, cost: 48 },
                { id: 'spirit_swarm', name: 'Cursed Spirit Swarm', cry: 'Devorad.', power: 90, type: 'curse', hits: 4, cost: 32 },
                { id: 'geto_guard', name: 'Spirit Wall', cry: '…', power: 0, type: 'support', buff: { def: 1.5 }, turns: 2, cost: 28 },
                { id: 'playful', name: 'Playful Cloud', cry: 'Hah.', power: 125, type: 'strike', cost: 36 }
            ]
        },
        mahito: {
            id: 'mahito', name: 'Mahito', series: 'Jujutsu Kaisen',
            img: 'assets/sprites/anim/mahito_idle.png', color: '#af7ac5', accent: '#f5eef8',
            resist: ['strike', 'slash'], weak: ['bless', 'fire'],
            maxHp: 380, atk: 55, def: 22, agi: 38,
            skills: [
                { id: 'idle_transfig', name: 'Idle Transfiguration', cry: 'Interesting!', power: 110, type: 'curse', cost: 34 },
                { id: 'body_repel', name: 'Body Repel', cry: 'Boom.', power: 95, type: 'strike', aoe: true, cost: 36 },
                { id: 'self_embody', name: 'Self-Embodiment of Perfection', cry: 'Domain Expansion!', power: 0, type: 'support', buff: { atk: 1.35, agi: 1.25 }, turns: 2, cost: 40 },
                { id: 'poly', name: 'Polymorphic Soul', cry: 'Change.', power: 140, type: 'curse', critBonus: 0.2, cost: 48 }
            ]
        },
        jogo: {
            id: 'jogo', name: 'Jogo', series: 'Jujutsu Kaisen',
            img: 'assets/sprites/anim/jogo_idle.png', color: '#e67e22', accent: '#f9e79f',
            resist: ['fire'], weak: ['water', 'ice'],
            maxHp: 360, atk: 62, def: 20, agi: 34,
            skills: [
                { id: 'ember_insects', name: 'Ember Insects', cry: 'Burn!', power: 100, type: 'fire', hits: 3, cost: 30 },
                { id: 'maximum_meteor', name: 'Maximum: Meteor', cry: 'Meteor!', power: 170, type: 'fire', aoe: true, cost: 55 },
                { id: 'coffin_iron', name: 'Coffin of the Iron Mountain', cry: 'Domain!', power: 0, type: 'support', buff: { atk: 1.3 }, turns: 2, cost: 38 },
                { id: 'lava', name: 'Lava Blast', cry: 'Feel the heat!', power: 130, type: 'fire', cost: 36 }
            ]
        },
        toji: {
            id: 'toji', name: 'Toji Fushiguro', series: 'Jujutsu Kaisen',
            img: 'assets/sprites/anim/toji_idle.png', color: '#2c3e50', accent: '#aab7b8',
            resist: ['curse', 'strike'], weak: ['bless'],
            maxHp: 410, atk: 72, def: 28, agi: 46,
            skills: [
                { id: 'inverted_spear', name: 'Inverted Spear of Heaven', cry: '…', power: 130, type: 'pierce' },
                { id: 'chain_heaven', name: 'Chain of a Thousand Miles', cry: 'Got you.', power: 100, type: 'slash', hits: 3 },
                { id: 'toji_kill', name: 'Heavenly Restriction', cry: 'Playtime\'s over.', power: 160, type: 'strike' },
                { id: 'toji_focus', name: 'Assassin Focus', cry: '…', power: 0, type: 'support', selfBuff: { atk: 1.35, agi: 1.4 }, turns: 2 }
            ]
        }
    },

    partyExtra: [
        {
            id: 'toji', name: 'Toji Fushiguro', series: 'Jujutsu Kaisen', role: 'Assassin', roleTag: 'Heavenly Restriction',
            img: 'assets/sprites/anim/toji_idle.png', color: '#2c3e50', accent: '#aab7b8',
            resist: ['curse', 'strike'], weak: ['bless'],
            maxHp: 285, maxSp: 110, atk: 70, def: 26, agi: 48, luk: 20,
            skills: [
                { id: 'inv_spear', name: 'Inverted Spear of Heaven', cry: '…', cost: 32, power: 125, type: 'pierce', desc: 'Niega técnicas · perfora.' },
                { id: 'chain_miles', name: 'Chain of a Thousand Miles', cry: 'Got you.', cost: 36, power: 110, type: 'slash', hits: 3, desc: 'Cadena infinita · 3 hits.' },
                { id: 'split_soul', name: 'Split Soul Katana', cry: 'Hah.', cost: 44, power: 145, type: 'slash', desc: 'Corta el alma.' },
                { id: 'heavenly', name: 'Heavenly Restriction', cry: 'No cursed energy.', cost: 40, power: 0, type: 'support', buff: { atk: 1.4, agi: 1.45, def: 1.2 }, turns: 3, desc: 'Cuerpo perfecto · ATK/AGI/DEF ↑' }
            ]
        },
        {
            id: 'sukuna', name: 'Ryomen Sukuna', series: 'Jujutsu Kaisen', role: 'DPS', roleTag: 'King of Curses',
            img: 'assets/sprites/anim/sukuna_idle.png', color: '#922b21', accent: '#f5b7b1',
            transform: true, transformName: 'Heian Form', resist: ['slash', 'curse', 'fire'], weak: ['bless'],
            maxHp: 340, maxSp: 165, atk: 78, def: 30, agi: 42, luk: 24,
            skills: [
                { id: 'dismantle', name: 'Dismantle', cry: 'Dismantle.', cost: 28, power: 120, type: 'slash', desc: 'Corte invisible.' },
                { id: 'cleave', name: 'Cleave', cry: 'Cleave.', cost: 36, power: 145, type: 'slash', desc: 'Ajusta al objetivo.' },
                { id: 'furnace', name: 'Open · Furnace', cry: 'Open.', cost: 48, power: 160, type: 'fire', aoe: true, desc: 'Flecha de fuego AoE.' },
                { id: 'heian', name: 'Heian Incarnation', cry: 'Know your place.', cost: 72, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 16, transformAtk: 1.8, transformAgi: 1.3, transformDef: 1.2, desc: 'TRANSFORM · forma Heian · rey de las maldiciones.' }
            ],
            transformedSkills: [
                { id: 'dismantle_max', name: 'Dismantle Max', cry: 'Dismantle.', cost: 34, power: 170, type: 'slash', hits: 3, desc: 'Lluvia de cortes.' },
                { id: 'cleave_max', name: 'World Cleave', cry: 'Cleave.', cost: 46, power: 195, type: 'slash', desc: 'Corte que parte el mundo.' },
                { id: 'fuga', name: 'Fuga · Furnace', cry: 'Open.', cost: 52, power: 180, type: 'fire', aoe: true, desc: 'Horno abierto AoE.' },
                { id: 'malevolent', name: 'Malevolent Shrine', cry: 'Domain Expansion!', cost: 68, power: 0, type: 'support', once: true, buff: { atk: 1.5 }, turns: 3, skipEnemy: 1, desc: 'Santuario · ATK ↑ · salta 1 turno.' }
            ],
            fromEnemy: true
        },
        {
            id: 'geto', name: 'Suguru Geto', series: 'Jujutsu Kaisen', role: 'Caster', roleTag: 'Curse Manipulation',
            img: 'assets/sprites/anim/geto_idle.png', color: '#1a5276', accent: '#58d68d',
            resist: ['curse', 'psy'], weak: ['bless', 'fire'],
            maxHp: 300, maxSp: 160, atk: 64, def: 28, agi: 34, luk: 26,
            skills: [
                { id: 'spirit_swarm', name: 'Cursed Spirit Swarm', cry: 'Devorad.', cost: 30, power: 100, type: 'curse', hits: 4, desc: 'Enjambre de espíritus ×4.' },
                { id: 'playful', name: 'Playful Cloud', cry: 'Hah.', cost: 34, power: 125, type: 'strike', desc: 'Bastón de tres secciones.' },
                { id: 'geto_guard', name: 'Spirit Wall', cry: '…', cost: 28, power: 0, type: 'support', buff: { def: 1.5 }, turns: 2, cover: true, desc: 'Muro de espíritus · cover.' },
                { id: 'uzumaki', name: 'Maximum: Uzumaki', cry: 'Uzumaki!', cost: 62, power: 195, type: 'curse', aoe: true, desc: 'Uzumaki · nuke AoE.' }
            ],
            fromEnemy: true
        },
        {
            id: 'mahito', name: 'Mahito', series: 'Jujutsu Kaisen', role: 'Caster', roleTag: 'Idle Transfiguration',
            img: 'assets/sprites/anim/mahito_idle.png', color: '#5dade2', accent: '#ecf0f1',
            transform: true, transformName: 'Instant Spirit Body', resist: ['curse', 'strike'], weak: ['bless', 'slash'],
            maxHp: 285, maxSp: 155, atk: 62, def: 22, agi: 40, luk: 28,
            skills: [
                { id: 'idle_transfig', name: 'Idle Transfiguration', cry: 'Interesting!', cost: 32, power: 120, type: 'curse', desc: 'Toca el alma.' },
                { id: 'body_repel', name: 'Body Repel', cry: 'Boom.', cost: 34, power: 105, type: 'strike', aoe: true, desc: 'Cuerpo proyectil AoE.' },
                { id: 'poly', name: 'Polymorphic Soul', cry: 'Change.', cost: 40, power: 140, type: 'curse', critBonus: 0.2, desc: 'Alma polimórfica.' },
                { id: 'isbdk', name: 'Instant Spirit Body', cry: 'Perfection!', cost: 66, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 14, transformAtk: 1.65, transformAgi: 1.4, desc: 'TRANSFORM · cuerpo distorsionado.' }
            ],
            transformedSkills: [
                { id: 'soul_spike', name: 'Soul Spike', cry: 'Feel it!', cost: 36, power: 165, type: 'curse', desc: 'Púas de alma.' },
                { id: 'distort_wave', name: 'Distort Wave', cry: 'Change!', cost: 44, power: 150, type: 'curse', aoe: true, desc: 'Onda de distorsión AoE.' },
                { id: 'self_embody', name: 'Self-Embodiment', cry: 'Domain Expansion!', cost: 50, power: 0, type: 'support', once: true, buff: { atk: 1.45, agi: 1.3 }, turns: 3, desc: 'Dominio · ATK/AGI ↑ · 1 uso.' },
                { id: 'kill_form', name: 'Distorted Killing', cry: 'Die.', cost: 58, power: 210, type: 'curse', desc: 'Asesinato distorsionado.' }
            ],
            fromEnemy: true
        },
        {
            id: 'jogo', name: 'Jogo', series: 'Jujutsu Kaisen', role: 'Caster', roleTag: 'Disaster Flames',
            img: 'assets/sprites/anim/jogo_idle.png', color: '#e67e22', accent: '#1c2833',
            transform: true, transformName: 'Maximum Meteor', resist: ['fire'], weak: ['water', 'ice'],
            maxHp: 270, maxSp: 160, atk: 68, def: 20, agi: 36, luk: 18,
            skills: [
                { id: 'ember_insects', name: 'Ember Insects', cry: 'Burn!', cost: 28, power: 105, type: 'fire', hits: 3, desc: 'Insectos de ember ×3.' },
                { id: 'lava', name: 'Lava Blast', cry: 'Feel the heat!', cost: 34, power: 130, type: 'fire', desc: 'Ráfaga de lava.' },
                { id: 'coffin_iron', name: 'Coffin of the Iron Mountain', cry: 'Domain!', cost: 40, power: 0, type: 'support', buff: { atk: 1.35 }, turns: 2, desc: 'Dominio · ATK ↑.' },
                { id: 'max_meteor', name: 'Maximum: Meteor', cry: 'Meteor!', cost: 64, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.7, transformAgi: 1.2, desc: 'TRANSFORM · meteorito / lava al máximo.' }
            ],
            transformedSkills: [
                { id: 'meteor_crash', name: 'Meteor Crash', cry: 'METEOR!', cost: 48, power: 200, type: 'fire', aoe: true, desc: 'Meteorito demoledor AoE.' },
                { id: 'ember_max', name: 'Ember Swarm', cry: 'Burn!', cost: 36, power: 155, type: 'fire', hits: 4, desc: 'Enjambre de fuego ×4.' },
                { id: 'volcano', name: 'Volcanic Peak', cry: 'Ash!', cost: 42, power: 165, type: 'fire', debuff: { agi: 0.7 }, debuffTurns: 2, desc: 'Erupción · AGI ↓' },
                { id: 'iron_coffin', name: 'Iron Mountain', cry: 'Domain!', cost: 50, power: 0, type: 'support', once: true, buff: { atk: 1.5, def: 1.25 }, turns: 3, desc: 'Dominio pleno · 1 uso.' }
            ],
            fromEnemy: true
        },
        {
            id: 'yuki', name: 'Yuki Tsukumo', series: 'Jujutsu Kaisen', role: 'DPS', roleTag: 'Star Rage',
            img: 'assets/sprites/anim/yuki_idle.png', color: '#f4d03f', accent: '#e74c3c',
            resist: ['strike', 'slash'], weak: ['curse'],
            maxHp: 320, maxSp: 145, atk: 72, def: 28, agi: 38, luk: 22,
            skills: [
                { id: 'star_rage', name: 'Star Rage', cry: 'Bom-ba-ye!', cost: 34, power: 140, type: 'strike', desc: 'Masa virtual · golpe demoledor.' },
                { id: 'garuda_lash', name: 'Garuda Lash', cry: 'Garuda!', cost: 30, power: 115, type: 'slash', hits: 2, desc: 'Látigo de Garuda ×2.' },
                { id: 'mass_guard', name: 'Virtual Mass', cry: 'Heavy.', cost: 28, power: 0, type: 'support', buff: { def: 1.45, atk: 1.25 }, turns: 2, desc: 'Masa ↑ · DEF/ATK ↑' },
                { id: 'black_hole', name: 'Star Rage · Collapse', cry: 'BOM-BA-YE!', cost: 62, power: 200, type: 'curse', aoe: true, desc: 'Colapso de masa AoE.' }
            ]
        },
        {
            id: 'higuruma', name: 'Hiromi Higuruma', series: 'Jujutsu Kaisen', role: 'Controller', roleTag: 'Deadly Sentencing',
            img: 'assets/sprites/anim/higuruma_idle.png', color: '#1c2833', accent: '#f4d03f',
            transform: true, transformName: 'Executioner\'s Sword', resist: ['slash', 'psy'], weak: ['fire'],
            maxHp: 280, maxSp: 155, atk: 60, def: 26, agi: 36, luk: 32,
            skills: [
                { id: 'gavel', name: 'Gavel Strike', cry: 'Objection.', cost: 28, power: 110, type: 'strike', desc: 'Martillo de juez.' },
                { id: 'confiscation', name: 'Confiscation', cry: 'Confiscated.', cost: 34, power: 0, type: 'support', debuff: { atk: 0.65, luk: 0.7 }, debuffTurns: 3, targetEnemy: true, desc: 'Confisca técnica · ATK/LUK ↓↓' },
                { id: 'judgeman', name: 'Judgeman', cry: 'Your honor.', cost: 30, power: 0, type: 'support', partyBuff: { luk: 1.35, def: 1.2 }, turns: 3, desc: 'Judgeman · LUK/DEF ↑' },
                { id: 'deadly', name: 'Deadly Sentencing', cry: 'Domain Expansion.', cost: 66, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.6, transformAgi: 1.25, desc: 'TRANSFORM · espada del verdugo.' }
            ],
            transformedSkills: [
                { id: 'exec_slash', name: 'Executioner\'s Slash', cry: 'Guilty.', cost: 40, power: 180, type: 'slash', desc: 'Espada del verdugo.' },
                { id: 'verdict', name: 'Guilty Verdict', cry: 'Death penalty.', cost: 46, power: 160, type: 'curse', debuff: { def: 0.6 }, debuffTurns: 3, desc: 'Veredicto · DEF ↓↓' },
                { id: 'gavel_max', name: 'Gavel Max', cry: 'Order!', cost: 34, power: 145, type: 'strike', hits: 2, desc: 'Martillazos ×2.' },
                { id: 'court_close', name: 'Court Adjourned', cry: 'Case closed.', cost: 58, power: 205, type: 'slash', desc: 'Sentencia final.' }
            ]
        },
        {
            id: 'choso', name: 'Choso', series: 'Jujutsu Kaisen', role: 'DPS', roleTag: 'Blood Manipulation',
            img: 'assets/sprites/anim/choso_idle.png', color: '#6c3483', accent: '#c0392b',
            transform: true, transformName: 'Flowing Red Scale', resist: ['pierce', 'curse'], weak: ['fire', 'slash'],
            maxHp: 300, maxSp: 145, atk: 66, def: 28, agi: 34, luk: 18,
            skills: [
                { id: 'piercing_blood', name: 'Piercing Blood', cry: 'Piercing Blood!', cost: 34, power: 135, type: 'pierce', desc: 'Rayo de sangre comprimida.' },
                { id: 'slicing_exo', name: 'Slicing Exorcism', cry: '…', cost: 30, power: 110, type: 'slash', hits: 2, desc: 'Discos de sangre ×2.' },
                { id: 'supernova', name: 'Supernova', cry: 'Supernova!', cost: 42, power: 130, type: 'fire', aoe: true, desc: 'Orbes de sangre AoE.' },
                { id: 'red_scale', name: 'Flowing Red Scale', cry: 'Blood…', cost: 58, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.55, transformAgi: 1.4, desc: 'TRANSFORM · escala roja · sangre al límite.' }
            ],
            transformedSkills: [
                { id: 'pierce_max', name: 'Piercing Blood Max', cry: 'PIERCING BLOOD!', cost: 40, power: 175, type: 'pierce', desc: 'Rayo de sangre máximo.' },
                { id: 'blood_claws', name: 'Blood Claws', cry: 'Hah!', cost: 36, power: 150, type: 'slash', hits: 3, desc: 'Garras de sangre ×3.' },
                { id: 'supernova_max', name: 'Supernova Max', cry: 'Supernova!', cost: 48, power: 160, type: 'fire', aoe: true, desc: 'Supernova plena AoE.' },
                { id: 'brother_bond', name: 'Blood Brothers', cry: 'For my brothers.', cost: 34, power: 0, type: 'support', buff: { atk: 1.4, def: 1.25 }, turns: 3, heal: 50, desc: 'Vínculo · ATK/DEF ↑ + cura.' }
            ]
        },
        {
            id: 'uro', name: 'Takako Uro', series: 'Jujutsu Kaisen', role: 'Caster', roleTag: 'Sky Manipulation',
            img: 'assets/sprites/anim/uro_idle.png', color: '#bb8fce', accent: '#5dade2',
            resist: ['wind', 'pierce'], weak: ['strike', 'elec'],
            maxHp: 265, maxSp: 155, atk: 60, def: 22, agi: 44, luk: 26,
            skills: [
                { id: 'thin_ice', name: 'Thin Ice Breaker', cry: 'Shatter.', cost: 34, power: 140, type: 'slash', desc: 'Rompe el cielo · penetra.' },
                { id: 'sky_fold', name: 'Sky Fold', cry: '…', cost: 30, power: 0, type: 'support', buff: { luk: 1.5, agi: 1.35 }, turns: 3, desc: 'Pliega el espacio · LUK/AGI ↑' },
                { id: 'sky_cut', name: 'Sky Cutter', cry: 'Cut.', cost: 36, power: 120, type: 'wind', hits: 2, desc: 'Cortes de cielo ×2.' },
                { id: 'sky_domain', name: 'Sky Manipulation Max', cry: 'Fall.', cost: 58, power: 175, type: 'wind', aoe: true, debuff: { agi: 0.65 }, debuffTurns: 2, desc: 'Cielo colapsa AoE · AGI ↓' }
            ]
        },
        {
            id: 'ryu', name: 'Ryu Ishigori', series: 'Jujutsu Kaisen', role: 'DPS', roleTag: 'Granite Blast',
            img: 'assets/sprites/anim/ryu_idle.png', color: '#2c3e50', accent: '#f4d03f',
            resist: ['curse', 'strike'], weak: ['ice'],
            maxHp: 310, maxSp: 140, atk: 74, def: 28, agi: 32, luk: 16,
            skills: [
                { id: 'granite', name: 'Granite Blast', cry: 'Granite Blast!', cost: 36, power: 155, type: 'curse', desc: 'Rayo de energía máxima.' },
                { id: 'output_punch', name: 'CE Output Punch', cry: 'Hah!', cost: 28, power: 120, type: 'strike', desc: 'Puño de output bruto.' },
                { id: 'discharge', name: 'Cursed Discharge', cry: 'More!', cost: 40, power: 130, type: 'curse', aoe: true, desc: 'Descarga AoE.' },
                { id: 'full_output', name: 'Full Output', cry: 'THIS is output!', cost: 60, power: 205, type: 'curse', desc: 'Output histórico · nuke.' }
            ]
        }
    ],

    encounters: {
        story_jjk_intro: {
            title: 'Jujutsu · Escuela Técnica',
            hint: 'Yuji y Megumi abren el frente. Cuidado con las maldiciones.',
            bg: 'assets/bg/jjk_school.png',
            rewardInvocations: 85,
            enemies: [
                { id: 'mahito', name: 'Mahito', img: 'assets/sprites/anim/mahito_idle.png', maxHp: 320, atk: 48, def: 18, agi: 34, skills: null }
            ]
        },
        story_jjk_geto: {
            title: 'Jujutsu · Noche de los Cien Demonios',
            hint: 'Geto y su enjambre. Bendición ayuda.',
            bg: 'assets/bg/jjk_night.png',
            rewardInvocations: 85,
            enemies: [
                { id: 'geto', name: 'Suguru Geto', img: 'assets/sprites/anim/geto_idle.png', maxHp: 400, atk: 55, def: 24, agi: 30, skills: null }
            ]
        },
        story_jjk_jogo: {
            title: 'Jujutsu · Desastre Volcánico',
            hint: 'Jogo. Agua/hielo lo apagan.',
            bg: 'assets/bg/jjk_volcano.png',
            rewardInvocations: 85,
            enemies: [
                { id: 'jogo', name: 'Jogo', img: 'assets/sprites/anim/jogo_idle.png', maxHp: 360, atk: 60, def: 18, agi: 32, skills: null }
            ]
        },
        story_jjk_sukuna: {
            title: 'Jujutsu · El Rey de las Maldiciones',
            hint: 'Sukuna. No aflojes. Bendición / control.',
            bg: 'assets/bg/jjk_domain.png',
            rewardInvocations: 85,
            enemies: [
                { id: 'sukuna', name: 'Ryomen Sukuna', img: 'assets/sprites/anim/sukuna_idle.png', maxHp: 560, atk: 72, def: 28, agi: 40, skills: null }
            ]
        }
    }
};

/** Inject JJK into BattleData + fill enemy skill refs. */
(function bootJJK() {
    if (typeof BattleData === 'undefined') return;
    const fill = (encEnemy) => {
        const full = JJKData.enemies[encEnemy.id];
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
    JJKData.party.forEach(p => {
        const idx = BattleData.party.findIndex(x => x.id === p.id);
        if (idx >= 0) BattleData.party[idx] = { ...BattleData.party[idx], ...p };
        else BattleData.party.push(p);
    });
    (JJKData.partyExtra || []).forEach(p => {
        const idx = BattleData.party.findIndex(x => x.id === p.id);
        if (idx >= 0) BattleData.party[idx] = { ...BattleData.party[idx], ...p };
        else BattleData.party.push(p);
    });
    Object.entries(JJKData.encounters).forEach(([key, enc]) => {
        const copy = { ...enc, enemies: (enc.enemies || []).map(fill) };
        BattleData.encounters[key] = copy;
    });
})();
