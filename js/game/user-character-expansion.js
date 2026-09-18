const UserCharacterExpansion = {
    make(config) {
        const base = {
            maxHp: 290, maxSp: 145, atk: 62, def: 28, agi: 34, luk: 20,
            role: 'DPS', roleTag: config.name, color: config.color || '#c41e3a',
            accent: config.accent || '#f4d03f', resist: [], weak: [],
            img: `assets/sprites/anim/${config.id}_idle.png`,
            ...config
        };
        base.skills = config.skills || [
            { id: `${config.id}_strike`, name: config.moves[0], cry: `${config.moves[0]}!`, cost: 26, power: 112, type: config.type || 'strike', desc: `${config.name} · técnica característica.` },
            { id: `${config.id}_burst`, name: config.moves[1], cry: `${config.moves[1]}!`, cost: 36, power: 138, type: config.type || 'strike', hits: config.hits || 2, desc: `${config.name} · ráfaga distintiva.` },
            { id: `${config.id}_guard`, name: config.moves[2], cry: '¡Ahora!', cost: 28, power: 0, type: 'support', buff: { atk: 1.25, agi: 1.18 }, turns: 2, desc: `${config.name} · preparación táctica.` },
            ...(config.transform ? [{ id: `${config.id}_transform`, name: config.transformName, cry: `${config.transformName}!`, cost: 60, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.5, transformAgi: 1.25, desc: `TRANSFORM · ${config.transformName} · forma alternativa.` }] : [])
        ];
        if (config.transform) {
            base.transformedSkills = config.transformedSkills || [
                { id: `${config.id}_x_strike`, name: config.xMoves[0], cry: `${config.xMoves[0]}!`, cost: 34, power: 158, type: config.type || 'strike', desc: `${config.name} · forma transformada.` },
                { id: `${config.id}_x_burst`, name: config.xMoves[1], cry: `${config.xMoves[1]}!`, cost: 44, power: 178, type: config.type || 'strike', hits: 3, desc: `${config.name} · combo transformado.` },
                { id: `${config.id}_x_guard`, name: config.xMoves[2], cry: '¡Despierta!', cost: 32, power: 0, type: 'support', buff: { atk: 1.4, def: 1.2 }, turns: 3, desc: `${config.name} · dominio de la forma.` },
                { id: `${config.id}_x_finisher`, name: config.xMoves[3], cry: `${config.xMoves[3]}!`, cost: 62, power: 215, type: config.type || 'strike', once: true, desc: `${config.name} · remate de transformación.` }
            ];
        }
        return base;
    },

    party: [
        { id: 'tobirama', name: 'Tobirama Senju', series: 'Naruto', role: 'Caster', roleTag: 'Hiraishin', type: 'water', color: '#2e86c1', transform: true, transformName: 'Edo Tensei · Suiton', moves: ['Suiton: Suiryūdan', 'Hiraishin Mark', 'Kage Bunshin Táctico'], xMoves: ['Flying Raijin Slash', 'Tandem Paper Bombs', 'Edo Regeneration', 'Mutually Multiplying Explosive Tags'] },
        { id: 'jugo', name: 'Jūgo', series: 'Naruto', role: 'Tank', roleTag: 'Senninka', type: 'strike', color: '#922b21', transform: true, transformName: 'Senninka Desatado', moves: ['Shikotsumyaku Burst', 'Natural Energy Drain', 'Instinto Calmado'], xMoves: ['Cursed Seal Hammer', 'Berserk Body Slam', 'Regenerative Cells', 'Wild Nature Cannon'] },
        { id: 'kakuzu', name: 'Kakuzu', series: 'Naruto', role: 'DPS', roleTag: 'Cinco Corazones', type: 'curse', color: '#273746', transform: true, transformName: 'Máscaras Elementales', moves: ['Earth Grudge Fist', 'Jiongu Threads', 'Corazón Robado'], xMoves: ['Wind Mask Barrage', 'Fire-Wind Combo', 'Lightning Mask Cage', 'Five Hearts Cataclysm'] },
        { id: 'tobi', name: 'Tobi', series: 'Naruto', role: 'Controller', roleTag: 'Kamui', type: 'curse', color: '#512e5f', skills: [
            { id: 'tobi_strike', name: 'Kamui', cry: 'Kamui!', cost: 30, power: 122, type: 'curse', desc: 'Tobi · vórtice que arranca el objetivo.' },
            { id: 'tobi_fan', name: 'Gunbai Crush', cry: '¡Fuera!', cost: 28, power: 108, type: 'strike', desc: 'Abanico de guerra · golpe brutal.' },
            { id: 'tobi_eye', name: 'Sharingan: Genjutsu', cry: 'Mírame.', cost: 32, power: 0, type: 'support', debuff: { atk: 0.7, luk: 0.6 }, debuffTurns: 2, targetEnemy: true, desc: 'Ilusión ocular · ATK/LUK ↓.' },
            { id: 'tobi_phase', name: 'Kamui Phase', cry: 'Intangible.', cost: 34, power: 0, type: 'support', buff: { agi: 1.6, luk: 1.4 }, turns: 3, desc: 'Atraviesa todo · AGI/LUK ↑↑.' }
        ] },
        { id: 'karin', name: 'Karin Uzumaki', series: 'Naruto', role: 'Healer', roleTag: 'Sensor', type: 'support', color: '#c2185b', skills: [
            { id: 'karin_bite', name: 'Healing Bite', cry: '¡Cúrate!', cost: 26, power: 0, type: 'support', heal: 150, desc: 'Cura a un aliado.' },
            { id: 'karin_sensor', name: 'Sensor Kagura', cry: 'Te veo.', cost: 28, power: 0, type: 'support', partyBuff: { agi: 1.3, luk: 1.35 }, turns: 3, desc: 'Precisión y velocidad del equipo.' },
            { id: 'chain_bind', name: 'Adamantine Chains', cry: '¡Quieto!', cost: 34, power: 120, type: 'pierce', desc: 'Cadenas de chakra.' },
            { id: 'chakra_scan', name: 'Chakra Diagnosis', cry: 'No te mueras.', cost: 42, power: 0, type: 'support', heal: 70, aoeHeal: true, cleanse: true, restoreSp: 25, desc: 'Cura y limpia estados + 25 CP.' }
        ] },
        { id: 'marshall', name: 'Marshall D. Teach', series: 'One Piece', role: 'DPS', roleTag: 'Yami Yami no Mi', type: 'curse', color: '#17202a', transform: true, transformName: 'Gura Gura no Mi', moves: ['Black Hole', 'Liberation', 'Darkness Pull'], xMoves: ['Gura Smash', 'Tremor Burst', 'Quake Shield', 'World Shock'] },
        { id: 'marco', name: 'Marco', series: 'One Piece', role: 'Healer', roleTag: 'Fénix', type: 'fire', color: '#2471a3', transform: true, transformName: 'Forma Fénix', moves: ['Blue Flames', 'Phoenix Talon', 'Regeneration'], xMoves: ['Phoenix Dive', 'Flame Wingstorm', 'Immortal Guard', 'Blue Bird Revival'] },
        { id: 'jinbe', name: 'Jinbe', series: 'One Piece', role: 'Tank', roleTag: 'Karate Gyojin', type: 'water', color: '#1b4f72', moves: ['Fish-Man Karate', 'Vagabond Drill', 'Ocean Current'], hits: 3 },
        { id: 'katakuri', name: 'Charlotte Katakuri', series: 'One Piece', role: 'DPS', roleTag: 'Mochi Future Sight', type: 'strike', color: '#6c3483', transform: true, transformName: 'Mochi Awakening', moves: ['Mochi Thrust', 'Future Sight', 'Zan Giri Mochi'], xMoves: ['Buzzcut Mochi', 'Mochi Anemone', 'Block Mochi', 'Zangiri Mochi: Awakening'] },
        { id: 'kashimo', name: 'Hajime Kashimo', series: 'Jujutsu Kaisen', role: 'DPS', roleTag: 'Mythical Beast Amber', type: 'elec', color: '#148f77', transform: true, transformName: 'Mythical Beast Amber', moves: ['Lightning Discharge', 'Staff Strike', 'Electrified Body'], xMoves: ['Sure-Hit Lightning', 'Amber Beam', 'Mythical Beast Rush', 'Genju Kohaku'] },
        { id: 'meimei', name: 'Mei Mei', series: 'Jujutsu Kaisen', role: 'DPS', roleTag: 'Black Bird Manipulation', type: 'slash', color: '#5b2c6f', moves: ['Bird Strike', 'Axe Feint', 'Crow Surveillance'], hits: 2 },
        { id: 'muzan', name: 'Muzan Kibutsuji', series: 'Kimetsu no Yaiba', role: 'DPS', roleTag: 'Demon Progenitor', type: 'curse', color: '#922b21', transform: true, transformStages: 2, transformStageNames: ['Muzan Desatado', 'Forma Final'], transformStageAtk: [1.55, 1.8], transformStageAgi: [1.25, 1.45], transformName: 'Muzan Desatado', moves: ['Blood Whip', 'Biokinesis', 'Demon Pulse'], xMoves: ['Tentacle Guillotine', 'Shockwave Flesh', 'Regeneration', 'Muzan Final Form'] },
        { id: 'shinobu', name: 'Shinobu Kocho', series: 'Kimetsu no Yaiba', role: 'Debuffer', roleTag: 'Insect Breathing', type: 'pierce', color: '#8e44ad', transform: true, transformName: 'Dance of the Dragonfly', moves: ['Butterfly Dance', 'Dance of the Bee', 'Wisteria Poison'], xMoves: ['Dragonfly Gaze', 'Compound Poison', 'Dance of the Centipede', 'Final Flutter'], hits: 3 },
        { id: 'kishibe', name: 'Kishibe', series: 'Chainsaw Man', role: 'DPS', roleTag: 'Cazador Veterano', type: 'strike', color: '#34495e', moves: ['Knife Rush', 'Contract Feint', 'Veteran Read'], hits: 3 },
        { id: 'kobeni', name: 'Kobeni Higashiyama', series: 'Chainsaw Man', role: 'DPS', roleTag: 'Superviviente', type: 'slash', color: '#273746', moves: ['Panic Dash', 'Knife Counter', 'Uncanny Reflex'], hits: 4 },
        { id: 'quanxi', name: 'Quanxi', series: 'Chainsaw Man', role: 'DPS', roleTag: 'First Devil Hunter', type: 'slash', color: '#566573', transform: true, transformName: 'Hybrid Bow', moves: ['Quadruple Draw', 'Sword Sweep', 'Silent Step'], xMoves: ['Arrow Volley', 'Hybrid Rush', 'Crossbow Guard', 'Rain of Arrows'] },
        { id: 'katana', name: 'Katana Man', series: 'Chainsaw Man', role: 'DPS', roleTag: 'Katana Hybrid', type: 'slash', color: '#212f3d', transform: true, transformName: 'Katana Hybrid', moves: ['Quick Draw', 'Shoulder Blade', 'Ambush Line'], xMoves: ['Katana Dash', 'Cross Slash', 'Hybrid Armor', 'Three-Point Execution'] },
        { id: 'asa', name: 'Asa Mitaka', series: 'Chainsaw Man', role: 'Controller', roleTag: 'War Devil', type: 'curse', color: '#7b241c', transform: true, transformName: 'Yoru · War Devil', moves: ['Guilt Weapon', 'School Uniform Sword', 'Yoru Whisper'], xMoves: ['Weapon Creation', 'Nuclear Sword', 'War Manifest', 'Tank Asa'] },
        { id: 'strohl', name: 'Strohl', series: 'Metaphor: ReFantazio', role: 'DPS', roleTag: 'Warrior Archetype', type: 'slash', color: '#b9770e', transform: true, transformName: 'Royal Warrior', moves: ['Diablo Slash', 'Heroic Charge', 'Royal Guard'], xMoves: ['Peerless War Cry', 'Royal Sword', 'Heroic Line', 'Royal Warrior Finale'] },
        { id: 'heismay', name: 'Heismay', series: 'Metaphor: ReFantazio', role: 'Controller', roleTag: 'Thief Archetype', type: 'pierce', color: '#5d6d7e', transform: true, transformName: 'Royal Thief', moves: ['Winged Cut', 'Cloak of Evasion', 'Shadow Feint'], xMoves: ['Noble Thief', 'Phantom Dive', 'Evasion Mirage', 'Royal Shadow'] },
        { id: 'junah', name: 'Junah', series: 'Metaphor: ReFantazio', role: 'Caster', roleTag: 'Masked Dancer', type: 'fire', color: '#c0392b', transform: true, transformName: 'Royal Masked Dancer', moves: ['Masked Flame', 'Song of Synthesis', "Dancer's Step"], xMoves: ['Royal Masquerade', 'Elemental Encore', 'Dance of Weakness', 'Finale of the Hero'] },
        { id: 'eupha', name: 'Eupha', series: 'Metaphor: ReFantazio', role: 'Healer', roleTag: 'Summoner Archetype', type: 'wind', color: '#27ae60', transform: true, transformName: 'Royal Summoner', moves: ['Summon Wind', 'Island Prayer', 'Trance Chant'], xMoves: ['Royal Invocation', 'Storm Eidolon', 'Blessing Chorus', 'Great Summon'] },
        { id: 'basilio', name: 'Basilio', series: 'Metaphor: ReFantazio', role: 'Tank', roleTag: 'Berserker Archetype', type: 'strike', color: '#566573', transform: true, transformName: 'Royal Berserker', moves: ['Beast Claw', 'Brutal Roar', 'Brotherhood Guard'], xMoves: ['Royal Beast', 'Raging Impact', 'Berserker Wall', 'Grand Beast Ruin'] },
        { id: 'ren', name: 'Ren Amamiya', series: 'Persona 5 Royal', role: 'DPS', roleTag: 'Joker · Wild Card', type: 'curse', color: '#c41e3a', transform: true, transformName: 'Arsène Awakened', moves: ['Eiha', 'Gunslinger', 'Rebellion'], xMoves: ['Riot Gun', 'Maeigaon', 'Rebellion Encore', 'Cocytus of Arsène'] },
        { id: 'goro', name: 'Goro Akechi', series: 'Persona 5 Royal', role: 'DPS', roleTag: 'Crow', type: 'bless', color: '#ecf0f1', transform: true, transformName: 'Black Mask', moves: ['Kouha', 'Rapier Feint', 'Detective Insight'], xMoves: ['Megidola', 'Laevateinn', 'Black Mask Counter', 'Robin Hood Collapse'] },
        { id: 'ann', name: 'Ann Takamaki', series: 'Persona 5 Royal', role: 'Caster', roleTag: 'Panther', type: 'fire', color: '#c0392b', transform: true, transformName: 'Carmen Awakened', moves: ['Agi', 'Whip Rush', 'Tarunda'], xMoves: ['Maragion', 'High Energy', "Carmen's Fire", 'Blazing Panther'] },
        { id: 'sumire', name: 'Kasumi Yoshizawa', series: 'Persona 5 Royal', role: 'DPS', roleTag: 'Violet', type: 'bless', color: '#922b21', transform: true, transformName: 'Sumire · Violet', moves: ['Assault Dive', 'Brave Step', 'Sword Ballet'], xMoves: ['Masquerade', 'Sword Dance', 'Violet Focus', 'Sword of Liberation'] },
        { id: 'tae', name: 'Tae Takemi', series: 'Persona 5 Royal', role: 'Healer', roleTag: 'Back-Alley Doctor', type: 'support', color: '#34495e', skills: [
            { id: 'takemi_medicine', name: 'Experimental Medicine', cry: 'Esto puede doler.', cost: 30, power: 0, type: 'support', heal: 180, desc: 'Cura intensa.' },
            { id: 'takemi_poison', name: 'Toxicology Dose', cry: 'Traga.', cost: 28, power: 105, type: 'curse', dot: 22, dotTurns: 3, desc: 'Veneno médico.' },
            { id: 'takemi_stim', name: 'Stimulant', cry: 'No te duermas.', cost: 34, power: 0, type: 'support', partyBuff: { atk: 1.3, agi: 1.2 }, turns: 3, desc: 'Estimulante de combate.' },
            { id: 'takemi_house_call', name: 'House Call', cry: 'Consulta terminada.', cost: 54, power: 0, type: 'support', heal: 80, aoeHeal: true, cleanse: true, restoreSp: 25, desc: 'Cura al equipo y limpia estados + 25 CP.' }
        ] },
        { id: 'futaba', name: 'Futaba Sakura', series: 'Persona 5 Royal', role: 'Support', roleTag: 'Oracle', type: 'psy', color: '#e67e22', transform: true, transformName: 'Necronomicon Awakened', skills: [
            { id: 'oracle_boost', name: 'Oracle Boost', cry: '¡Buff de datos!', cost: 28, power: 0, type: 'support', partyBuff: { atk: 1.35, def: 1.25, agi: 1.2 }, turns: 3, desc: 'Buff total del equipo.' },
            { id: 'position_hack', name: 'Position Hack', cry: '¡Te tengo!', cost: 30, power: 0, type: 'support', debuff: { agi: 0.55, def: 0.75 }, debuffTurns: 2, targetEnemy: true, desc: 'Hack táctico al enemigo.' },
            { id: 'moral_support', name: 'Moral Support', cry: '¡No pierdas!', cost: 34, power: 0, type: 'support', heal: 90, aoeHeal: true, restoreSp: 30, desc: 'Soporte remoto + 30 CP.' },
            { id: 'futaba_awaken', name: 'Necronomicon Awakened', cry: '¡Necronomicon!', cost: 58, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.35, transformAgi: 1.35, desc: 'TRANSFORM · Necronomicon despierta · permanece hasta quedarse sin CP.' }
        ], transformedSkills: [
            { id: 'oracle_barrage', name: 'Oracle Barrage', cry: '¡Datos!', cost: 34, power: 140, type: 'psy', hits: 3, desc: 'Bombardeo de datos ×3.' },
            { id: 'active_support_max', name: 'Active Support Max', cry: '¡A por ellos!', cost: 32, power: 0, type: 'support', partyBuff: { atk: 1.45, def: 1.3 }, turns: 3, desc: 'Soporte máximo del equipo.' },
            { id: 'treasure_hack', name: 'Treasure Hack', cry: '¡Mío!', cost: 36, power: 0, type: 'support', debuff: { atk: 0.65, def: 0.7 }, debuffTurns: 3, targetEnemy: true, desc: 'Hackeo total · ATK/DEF ↓↓.' },
            { id: 'final_guard', name: 'Final Guard', cry: '¡Bloqueado!', cost: 44, power: 0, type: 'support', partyBuff: { def: 1.7 }, turns: 2, cover: true, coverHits: 4, desc: 'Protección de emergencia.' }
        ] },
        { id: 'makoto', name: 'Makoto Niijima', series: 'Persona 5 Royal', role: 'Tank', roleTag: 'Queen', type: 'nuclear', color: '#2471a3', transform: true, transformName: 'Johanna Awakened', moves: ['Frei', 'Milady Charge', 'Marakukaja'], xMoves: ['Mafreila', 'Charge Punch', 'Johanna Guard', 'Vajra Blast'], hits: 2 },
        { id: 'hualkenberg', name: 'Hulkenberg', series: 'Metaphor: ReFantazio', role: 'Tank', roleTag: 'Knight Archetype', type: 'pierce', color: '#2e86c1', transform: true, transformName: 'Royal Knight', moves: ['Knight Tackle', 'Iron Guard', 'Oath of Protection'], xMoves: ['Royal Charge', 'Impenetrable Wall', 'Knightly Vow', 'Grand Knight Finale'] },
        { id: 'yusuke', name: 'Yusuke Kitagawa', series: 'Persona 5 Royal', role: 'DPS', roleTag: 'Fox', type: 'slash', color: '#d5dbdb', accent: '#c0392b', transform: true, transformName: 'Goemon Awakened', resist: ['ice', 'slash'], weak: ['fire'], maxHp: 320, maxSp: 150, atk: 70, def: 30, agi: 36, luk: 22, skills: [
            { id: 'counter_stance', name: 'Counter Stance', cry: 'Come.', cost: 30, power: 0, type: 'support', buff: { def: 1.5 }, turns: 3, reflectDamage: true, reflectMul: 1.2, desc: 'Postura · DEF ↑ + devuelve daño.' },
            { id: 'eiha_cut', name: 'Eiha Cut', cry: 'Eiha!', cost: 28, power: 150, type: 'curse', desc: 'Corte maldito.' },
            { id: 'frost_bite', name: 'Frost Bite', cry: 'Freeze!', cost: 32, power: 140, type: 'ice', desc: 'Mordisco de hielo.' },
            { id: 'goemon_awaken', name: 'Goemon Awakened', cry: 'Goemon!', cost: 60, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.55, transformAgi: 1.3, desc: 'TRANSFORM · Goemon despierta.' }
        ], transformedSkills: [
            { id: 'god_hand', name: 'Gods Hand', cry: 'Beautiful...!', cost: 44, power: 190, type: 'bless', desc: 'Puño divino.' },
            { id: 'counter_x', name: 'Counter Arts', cry: 'Too slow.', cost: 34, power: 0, type: 'support', buff: { def: 1.7 }, turns: 3, reflectDamage: true, reflectMul: 1.4, desc: 'Contra-arte · devuelve más.' },
            { id: 'heat_wave_fox', name: 'Heat Wave', cry: 'Burn!', cost: 38, power: 165, type: 'fire', desc: 'Ola de calor.' },
            { id: 'goemon_finale', name: 'Goemon Impact', cry: 'Masterpiece!', cost: 62, power: 210, type: 'bless', once: true, desc: 'Obra maestra · 1 uso.' }
        ] },
        { id: 'haru', name: 'Haru Okumura', series: 'Persona 5 Royal', role: 'Caster', roleTag: 'Noir', type: 'psy', color: '#f5b7b1', accent: '#7d3c98', transform: true, transformName: 'Milady Awakened', resist: ['psy', 'fire'], weak: ['ice'], maxHp: 300, maxSp: 160, atk: 64, def: 28, agi: 34, luk: 26, skills: [
            { id: 'psi_blast', name: 'Psi Blast', cry: 'Psio!', cost: 32, power: 150, type: 'psy', aoe: true, desc: 'Explosión psíquica AoE.' },
            { id: 'grenade_launcher', name: 'Grenade Launcher', cry: 'Fire!', cost: 36, power: 140, type: 'fire', aoe: true, desc: 'Granadas AoE.' },
            { id: 'sweet_talk', name: 'Sweet Talk', cry: 'Please~', cost: 28, power: 0, type: 'support', partyBuff: { atk: 1.3 }, turns: 3, desc: 'Dulzura · ATK equipo ↑.' },
            { id: 'milady_awaken', name: 'Milady Awakened', cry: 'Milady!', cost: 60, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 12, transformAtk: 1.5, transformAgi: 1.25, desc: 'TRANSFORM · Milady despierta.' }
        ], transformedSkills: [
            { id: 'milady_might', name: 'Milady Might', cry: 'Take this!', cost: 42, power: 180, type: 'psy', aoe: true, desc: 'Poder de Milady AoE.' },
            { id: 'triple_down', name: 'Triple Down', cry: 'Down!', cost: 40, power: 165, type: 'fire', aoe: true, desc: 'Triple descarga AoE.' },
            { id: 'noir_guard', name: 'Noir Guard', cry: 'Behind me!', cost: 32, power: 0, type: 'support', buff: { def: 1.6 }, turns: 3, cover: true, desc: 'Guardia · DEF ↑ + cover.' },
            { id: 'beauty_finale', name: 'Beauty Thief Finale', cry: 'For father!', cost: 62, power: 200, type: 'psy', once: true, desc: 'Final de ladrona · 1 uso.' }
        ] },
        { id: 'ryuji', name: 'Ryuji Sakamoto', series: 'Persona 5 Royal', role: 'DPS', roleTag: 'Skull', type: 'elec', color: '#f39c12', accent: '#212f3d', transform: true, transformName: 'Captain Kidd Awakened', resist: ['elec'], weak: ['wind'], maxHp: 340, maxSp: 140, atk: 72, def: 30, agi: 32, luk: 20, skills: [
            { id: 'skull_cracker', name: 'Skull Cracker', cry: 'Skull crack!', cost: 28, power: 155, type: 'strike', desc: 'Bate demoledor.' },
            { id: 'mapsi', name: 'Mapsio', cry: 'Zio!', cost: 32, power: 145, type: 'elec', aoe: true, desc: 'Rayo pirata AoE.' },
            { id: 'punk_talk', name: 'Punk Talk', cry: 'Shut up!', cost: 26, power: 0, type: 'support', debuff: { atk: 0.75 }, debuffTurns: 3, targetEnemy: true, desc: 'Vacile · ATK ↓.' },
            { id: 'kidd_awaken', name: 'Captain Kidd Awakened', cry: 'Kidd!', cost: 60, power: 0, type: 'support', transform: true, once: true, transformPersistent: true, transformUpkeep: 13, transformAtk: 1.55, transformAgi: 1.25, desc: 'TRANSFORM · Captain Kidd.' }
        ], transformedSkills: [
            { id: 'god_hand_r', name: "God's Hand", cry: 'FOR REAL!', cost: 42, power: 185, type: 'strike', desc: 'Mano de dios.' },
            { id: 'thunder_reign', name: 'Thunder Reign', cry: 'Maziodyne!', cost: 46, power: 175, type: 'elec', aoe: true, desc: 'Reinado del trueno AoE.' },
            { id: 'skull_buff', name: 'Skull Charge', cry: 'Run it up!', cost: 32, power: 0, type: 'support', buff: { atk: 1.45 }, turns: 3, desc: 'Carga · ATK ↑↑.' },
            { id: 'kidd_finale', name: 'Kidd Finale', cry: 'All out!', cost: 62, power: 205, type: 'elec', once: true, desc: 'Cañonazo final · 1 uso.' }
        ] },
        { id: 'louis', name: 'Louis Guiabern', series: 'Metaphor: ReFantazio', role: 'Caster', roleTag: 'Utopist King', type: 'almighty', color: '#2c3e50', accent: '#f1c40f', resist: ['almighty', 'curse'], weak: ['bless'], maxHp: 420, maxSp: 175, atk: 72, def: 30, agi: 34, luk: 26, skills: [
            { id: 'kings_magic', name: "King's Magic", cry: 'Kneel.', cost: 38, power: 170, type: 'almighty', desc: 'Magia del rey utópico.' },
            { id: 'mana_burn', name: 'Mana Burn', cry: 'Empty.', cost: 34, power: 130, type: 'curse', drainSp: 35, desc: 'Quema CP enemigo + daño.' },
            { id: 'utopia_decree', name: 'Utopia Decree', cry: 'My world.', cost: 32, power: 0, type: 'support', partyBuff: { atk: 1.3, def: 1.2 }, turns: 3, desc: 'Decreto · equipo ↑.' },
            { id: 'tyrant_requiem', name: 'Tyrant Requiem', cry: 'DIE for utopia!', cost: 66, power: 210, type: 'almighty', desc: 'Réquiem del tirano · finisher.' }
        ] },
        { id: 'gallica', name: 'Gallica', series: 'Metaphor: ReFantazio', role: 'Support', roleTag: 'Fairy Guide', type: 'support', color: '#aed6f1', accent: '#f9e79f', resist: ['wind'], weak: ['curse'], maxHp: 240, maxSp: 170, atk: 42, def: 26, agi: 46, luk: 34, skills: [
            { id: 'scout', name: 'Fairy Scout', cry: 'I see it!', cost: 26, power: 0, type: 'support', partyBuff: { agi: 1.35, luk: 1.35 }, turns: 3, desc: 'Exploración · AGI/LUK equipo ↑.' },
            { id: 'fairy_dust', name: 'Fairy Dust', cry: 'Sprinkles!', cost: 30, power: 0, type: 'support', heal: 120, cleanse: true, restoreSp: 25, desc: 'Polvo · cura + limpia + 25 CP.' },
            { id: 'hide_wings', name: 'Hide Wings', cry: 'Shh!', cost: 26, power: 0, type: 'support', buff: { def: 1.5, agi: 1.3 }, turns: 3, desc: 'Escondite · DEF/AGI ↑.' },
            { id: 'guide_wind', name: 'Guiding Wind', cry: 'This way!', cost: 24, power: 90, type: 'wind', desc: 'Viento guía.' }
        ] },
        { id: 'genya', name: 'Genya Shinazugawa', series: 'Kimetsu no Yaiba', role: 'DPS', roleTag: 'Demon Eater', type: 'pierce', color: '#6e2c00', transform: true, transformName: 'Demonized Genya', moves: ['Double-Barrel Blast', 'Demon Flesh Bite', 'Repeating Shots'], xMoves: ['Demon Howl', 'Flesh Regeneration', 'Blood Burst', 'Devourer Finale'] },
        { id: 'kimimaro', name: 'Kimimaro', series: 'Naruto', role: 'DPS', roleTag: 'Shikotsumyaku', type: 'pierce', color: '#d5dbdb', transform: true, transformName: 'Curse Mark · Second State', moves: ['Bone Bullets', 'Dance of the Camellia', 'Dance of the Larch'], xMoves: ['Dance of the Clematis', 'Bone Spear Barrage', 'Cursed Seal Armor', 'Dance of the Seedling Fern'] },
        { id: 'suigetsu', name: 'Suigetsu Hozuki', series: 'Naruto', role: 'Tank', roleTag: 'Hydrification', type: 'water', color: '#5dade2', moves: ['Water Pistol', 'Hydrification Wall', 'Kubikiribocho Slash'], hits: 2 },
        { id: 'yourichi', name: 'Yoriichi Tsugikuni', series: 'Kimetsu no Yaiba', role: 'DPS', roleTag: 'Sun Breathing Origin', type: 'fire', color: '#e67e22', transform: true, transformName: 'Transparent World', moves: ['Sun Breathing · Waltz', 'Raging Sun', 'Solar Halo'], xMoves: ['Thirteenth Form', 'Transparent Sight', 'Sunflower Thrust', 'Setting Sun Transformation'] },
        { id: 'konan', name: 'Konan', series: 'Naruto', role: 'Caster', roleTag: 'Paper Angel', type: 'wind', color: '#6c3483', transform: true, transformName: 'Six Hundred Billion Explosive Tags', moves: ['Paper Lance', 'Sea of Paper', 'Paper Shield'], xMoves: ['Paper Ocean Deluge', 'Explosive Tag Abyss', 'Angel Wings Guard', 'Billion Paper Cataclysm'] },
        { id: 'pain', name: 'Pain (Tendo)', series: 'Naruto', role: 'Caster', roleTag: 'Rinnegan · Deva', type: 'curse', color: '#922b21', transform: true, transformName: 'Chibaku Tensei Core', moves: ['Shinra Tensei', 'Bansho Tenin', 'Almighty Push'], xMoves: ['Planetary Devastation', 'Six Paths Barrage', 'Rinnegan Seal', 'Catastrophic Judgment'] },
    ],

    /** Old ids → user filenames (saves keep copies/unlocks). */
    migrateIds() {
        const map = {
            obito: 'tobi', blackbeard: 'marshall', hulkenberg: 'hualkenberg',
            katana_man: 'katana', akechi: 'goro', joker: 'ren', kasumi: 'sumire',
            takemi: 'tae', makoto_p5: 'makoto', mei_mei: 'meimei', yoriichi: 'yourichi'
        };
        try {
            if (typeof GameState === 'undefined') return;
            const owned = GameState.get('ownedCharacters');
            if (Array.isArray(owned)) {
                let changed = false;
                const next = owned.map((id) => {
                    if (map[id] && !owned.includes(map[id])) { changed = true; return map[id]; }
                    return id;
                });
                if (changed) GameState.set('ownedCharacters', [...new Set(next)]);
            }
            const copies = GameState.get('charCopies');
            if (copies && typeof copies === 'object') {
                let changed = false;
                Object.keys(map).forEach((old) => {
                    if (copies[old] != null && copies[map[old]] == null) {
                        copies[map[old]] = copies[old];
                        delete copies[old];
                        changed = true;
                    }
                });
                if (changed) GameState.set('charCopies', copies);
            }
        } catch (_) { /* ignore */ }
    },

    boot() {
        if (typeof BattleData === 'undefined') return;
        this.migrateIds();
        this.party.forEach((raw) => {
            const unit = this.make(raw);
            if (!unit.id) return;
            const index = BattleData.party.findIndex((entry) => entry.id === unit.id);
            if (index >= 0) BattleData.party[index] = { ...BattleData.party[index], ...unit };
            else BattleData.party.push(unit);
        });
    }
};

UserCharacterExpansion.boot();
