/**
 * Crónica del Destino — campaña única.
 * Reglas: cada misión = 1 enemigo único + 1 mapa único. Sin refritos.
 * First clears are intentionally scarce. Repeating difficult missions is the farm loop.
 */
const ChronicleData = {
    /** Soft collection budget after the campaign slowdown. */
    TARGET_FIRST_CLEAR_INV: 900,

    pullRewardFor(base) {
        if (!base) return 0;
        return Math.max(3, Math.round(base * 0.28));
    },

    mk(id, name, stats) {
        return {
            id,
            name,
            img: `assets/sprites/anim/${id}_idle.png`,
            skills: null,
            ...stats
        };
    },

    /**
     * Historia principal (cadena 22). Actos I–VI + final.
     * INV suma ≈ 1980.
     */
    STORY: [
        { mid: 'gate_01', enc: 'ch_crocodile', enemy: 'crocodile', name: 'Crocodile', stage: 'desert', inv: 60,
            title: 'I · Arena del Rey del Desierto',
            blurb: 'La primera grieta huele a arena. Un Warlord sonríe: “¿Regalo? Yo cobro peajes.”',
            sealed: '✦ ACTO I · DESIERTO ???' },
        { mid: 'gate_02', enc: 'ch_enel', enemy: 'enel', name: 'Enel', stage: 'storm', inv: 62,
            title: 'I · Trueno sin cielo',
            blurb: 'El peaje se paga en voltios. Un dios autoprocclamado baja del cielo roto.',
            sealed: '✦ ACTO I · TRUENO ???' },
        { mid: 'gate_03', enc: 'ch_zabuza', enemy: 'zabuza', name: 'Zabuza', stage: 'mist', inv: 65,
            title: 'I · Niebla del verdugo',
            blurb: 'Konoha no envió ayuda. Solo niebla… y una espada más ancha que tu miedo.',
            sealed: '✦ ACTO I · NIEBLA ???' },
        { mid: 'gate_04', enc: 'ch_lucci', enemy: 'lucci', name: 'Rob Lucci', stage: 'forest', inv: 68,
            title: 'I · CP9 en el bosque',
            blurb: 'Alguien clasificó tu operación como “amenaza”. Lucci viene a archivar el expediente.',
            sealed: '✦ ACTO I · BOSQUE ???' },

        { mid: 'gate_05', enc: 'ch_sasori', enemy: 'sasori', name: 'Sasori', stage: 'akatsuki', inv: 70,
            title: 'II · Arte bajo nubes rojas',
            blurb: 'Hilos. Veneno. Un artista que odia envejecer. Las nubes Akatsuki firman el lienzo.',
            sealed: '✦ ACTO II · ARTE ???' },
        { mid: 'gate_06', enc: 'ch_orochimaru', enemy: 'orochimaru', name: 'Orochimaru', stage: 'snake', inv: 72,
            title: 'II · Sede de la serpiente',
            blurb: 'Bajo tierra, el conocimiento muerde. Orochimaru quiere tu “destino” en un frasco.',
            sealed: '✦ ACTO II · SERPIENTE ???' },
        { mid: 'gate_07', enc: 'ch_kisame', enemy: 'kisame', name: 'Kisame', stage: 'sea', inv: 75,
            title: 'II · Samehada despierta',
            blurb: 'El mar no debería estar aquí. Kisame ríe: “¿Cuánta chakra… digo, cuánta esperanza te queda?”',
            sealed: '✦ ACTO II · MAR ???' },

        { mid: 'gate_08', enc: 'ch_kira', enemy: 'kira', name: 'Yoshikage Kira', stage: 'mansion', inv: 78,
            title: 'III · Vida tranquila',
            blurb: 'Una mansión. Un click. Killer Queen no quiere drama… solo borrarte del banner.',
            sealed: '✦ ACTO III · MANSIÓN ???' },
        { mid: 'gate_09', enc: 'ch_grimmjow', enemy: 'grimmjow', name: 'Grimmjow', stage: 'hueco', inv: 80,
            title: 'III · Pantera en Hueco Mundo',
            blurb: 'El vacío tiene garras. Grimmjow no negocia: pelea o deja de existir.',
            sealed: '✦ ACTO III · HUECO ???' },
        { mid: 'gate_10', enc: 'ch_ulquiorra', enemy: 'ulquiorra', name: 'Ulquiorra', stage: 'soul', inv: 82,
            title: 'III · Cuarta Espada',
            blurb: '“Corazón” es una palabra que Ulquiorra no comprende. Demuéstrale el significado a golpes.',
            sealed: '✦ ACTO III · ESPADA ???',
            metaphor: true },

        { mid: 'gate_11', enc: 'ch_mahito', enemy: 'mahito', name: 'Mahito', stage: 'jjk-school', inv: 85,
            title: 'IV · Forma del alma',
            blurb: 'Una maldición se aburre de los humanos. Quiere “jugar” con tu forma.',
            sealed: '✦ ACTO IV · MALDICIÓN ???' },
        { mid: 'gate_12', enc: 'ch_jogo', enemy: 'jogo', name: 'Jogo', stage: 'jjk-volcano', inv: 88,
            title: 'IV · Desastre ígneo',
            blurb: 'El suelo se abre. Jogo no discute filosofía: discute meteoritos.',
            sealed: '✦ ACTO IV · VOLCÁN ???' },
        { mid: 'gate_13', enc: 'ch_geto', enemy: 'geto', name: 'Suguru Geto', stage: 'jjk-shrine', inv: 90,
            title: 'IV · Noche de monjes',
            blurb: 'Geto predica un mundo limpio. Tú eres el “sucio” que hay que barrer.',
            sealed: '✦ ACTO IV · SANTUARIO ???',
            metaphor: true },

        { mid: 'gate_14', enc: 'ch_daki', enemy: 'daki', name: 'Daki', stage: 'kimetsu', inv: 92,
            title: 'V · Distrito del placer',
            blurb: 'Cintas, sonrisas y una luna superior que odia perder. Si se enfada… el distrito tiembla.',
            sealed: '✦ ACTO V · DISTRITO ???' },
        { mid: 'gate_15', enc: 'ch_akaza', enemy: 'akaza', name: 'Akaza', stage: 'entertainment', inv: 95,
            title: 'V · Compás de la destrucción',
            blurb: 'Akaza busca guerreros fuertes. Tú acabas de firmar el duelo.',
            sealed: '✦ ACTO V · COMPÁS ???' },
        { mid: 'gate_16', enc: 'ch_reze', enemy: 'reze', name: 'Reze', stage: 'chainsaw', inv: 98,
            title: 'V · Café y pin',
            blurb: 'Una sonrisa de cafeteria. Un click en el cuello. La Bomb Girl no sirve café: sirve fuego.',
            sealed: '✦ ACTO V · BOMBA ???' },
        { mid: 'gate_17', enc: 'ch_power', enemy: 'power', name: 'Power', stage: 'blood', inv: 100,
            title: 'V · La demonio más grande',
            blurb: 'Power exige sangre, gato y victoria. Negociar es inútil. Golpear, también… pero es lo que hay.',
            sealed: '✦ ACTO V · SANGRE ???' },

        { mid: 'gate_18', enc: 'ch_diavolo', enemy: 'diavolo', name: 'Diavolo', stage: 'crimson', inv: 105,
            title: 'VI · Tiempo borrado',
            blurb: 'King Crimson salta el segundo en el que ibas a ganar. Encuentra el hueco… o no existes.',
            sealed: '✦ ACTO VI · CARMESÍ ???' },
        { mid: 'gate_19', enc: 'ch_aizen', enemy: 'aizen', name: 'Aizen', stage: 'night', inv: 120,
            title: 'VI · Kyoka Suigetsu',
            blurb: 'Todo lo que ves es falso. Incluido el “casi lo tengo”. Analiza. No confíes. Rompe la ilusión.',
            sealed: '✦ ACTO VI · ILUSIÓN ???',
            metaphor: true },
        { mid: 'gate_20', enc: 'ch_makima', enemy: 'makima', name: 'Makima', stage: 'control', inv: 130,
            title: 'VI · Contrato de control',
            blurb: 'Makima no pelea: ordena. Si dices “sí” una vez, el banner ya no es tuyo.',
            sealed: '✦ ACTO VI · CONTROL ???' },
        { mid: 'gate_21', enc: 'ch_sukuna', enemy: 'sukuna', name: 'Sukuna', stage: 'ash', inv: 145,
            title: 'VI · Rey de las Maldiciones',
            blurb: 'Sukuna bostezó ante tu crónica. Ahora quiere un plato: tú.',
            sealed: '✦ ACTO VI · REY ???',
            metaphor: true },

        { mid: 'gate_final', enc: 'boss', enemy: 'boss5050', name: 'THE 50/50', stage: 'destiny', inv: 60,
            title: 'FINAL · THE 50/50',
            blurb: 'El Joker del destino. Sin DIO reciclado. Sin Aizen de propina. Solo la moneda… y tú.',
            sealed: '✦ THE 50/50 · SELLADO',
            isFinal: true }
    ],

    /**
     * Archivos opcionales — enemigos/mapas que no caben en la cadena principal.
     * Archives expand the campaign and provide the long-term farm route.
     */
    ARCHIVES: [
        { mid: 'arc_deidara', enc: 'ch_deidara', enemy: 'deidara', name: 'Deidara', stage: 'tower', inv: 70,
            title: 'Archivo · Arte es explosión', blurb: 'Una torre robada. Deidara firma el cielo con KATSU.' },
        { mid: 'arc_doflamingo', enc: 'ch_doflamingo', enemy: 'doflamingo', name: 'Doflamingo', stage: 'arena', inv: 72,
            title: 'Archivo · Heavenly Demon', blurb: 'Hilos sobre la arena. El pájaro enjaula al público.' },
        { mid: 'arc_toji', enc: 'ch_toji', enemy: 'toji', name: 'Toji Fushiguro', stage: 'city', inv: 70,
            title: 'Archivo · Asesino del cielo', blurb: 'Sin energía maldita. Con catálogo de armas. Toji caza hechiceros… y elegidos.' },
        { mid: 'arc_dio', enc: 'ch_dio', enemy: 'dio', name: 'DIO', stage: 'world', inv: 75,
            title: 'Archivo · Za Warudo', blurb: 'El tiempo se detiene fuera de la historia principal. DIO quiere el escenario entero.' },
        { mid: 'arc_kokushibo', enc: 'ch_kokushibo', enemy: 'kokushibo', name: 'Kokushibo', stage: 'moon', inv: 75,
            title: 'Archivo · Luna superior', blurb: 'Seis ojos. Una luna. Kokushibo mide tu respiración.' },
        { mid: 'arc_doma', enc: 'ch_doma', enemy: 'doma', name: 'Doma', stage: 'ice', inv: 72,
            title: 'Archivo · Loto de hielo', blurb: 'Sonrisa eterna. Escarcha que no perdona. Doma invita a “compartir”.' },
        { mid: 'arc_hantengu', enc: 'ch_hantengu', enemy: 'hantengu', name: 'Hantengu', stage: 'fear', inv: 68,
            title: 'Archivo · Emociones rotas', blurb: 'Miedo, odio, placer, pena… Hantengu se parte para no enfrentarte.' },
        { mid: 'arc_gyokko', enc: 'ch_gyokko', enemy: 'gyokko', name: 'Gyokko', stage: 'pot', inv: 68,
            title: 'Archivo · Vasija viva', blurb: 'Arte grotesco en cerámica. Gyokko colecciona “bellas” muertes.' },
        { mid: 'arc_denji', enc: 'ch_denji', enemy: 'denji', name: 'Denji', stage: 'street', inv: 75,
            title: 'Archivo · Chainsaw suelto', blurb: 'Denji no entiende tu operación. Solo oye: pelea, pan, sangre.' },
        { mid: 'arc_beam', enc: 'ch_beam', enemy: 'beam', name: 'Beam', stage: 'deep', inv: 75,
            title: 'Archivo · Tiburón del subsuelo', blurb: 'Beam grita DENJI y se lanza. Cierre de archivos · sellos Metaphor.',
            metaphor: true },
        { mid: 'arc_sasuke', enc: 'ch_sasuke_rival', enemy: 'sasuke', name: 'Sasuke Uchiha', stage: 'lightning', inv: 58,
            title: 'Archivo · El rayo que persigue', blurb: 'Un corredor de tormenta. Sasuke ha leído tu formación y espera el primer error.' },
        { mid: 'arc_kakashi', enc: 'ch_kakashi_rival', enemy: 'kakashi', name: 'Kakashi Hatake', stage: 'forest', inv: 60,
            title: 'Archivo · El examen del ninja copia', blurb: 'No es una prueba de fuerza: es una prueba de lectura. Kakashi ya conoce tres de tus trucos.' },
        { mid: 'arc_jolyne', enc: 'ch_jolyne_rival', enemy: 'jolyne', name: 'Jolyne Cujoh', stage: 'prison', inv: 62,
            title: 'Archivo · Hilos de acero', blurb: 'El patio se convierte en una red. Cada paso activa otro hilo de Stone Free.' },
        { mid: 'arc_ichigo', enc: 'ch_ichigo_rival', enemy: 'ichigo', name: 'Ichigo Kurosaki', stage: 'soul', inv: 64,
            title: 'Archivo · La hoja que cruza mundos', blurb: 'Una garganta se abre sobre la arena. Ichigo no viene a negociar con tu destino.' },
        { mid: 'arc_tanjiro', enc: 'ch_tanjiro_rival', enemy: 'tanjiro', name: 'Tanjiro Kamado', stage: 'kimetsu', inv: 66,
            title: 'Archivo · Respiración bajo la luna', blurb: 'La noche huele a glicinia. Tanjiro lee tu ritmo antes de que puedas romperlo.' },
        { mid: 'arc_giyu', enc: 'ch_giyu_rival', enemy: 'giyu', name: 'Giyu Tomioka', stage: 'waterfall', inv: 68,
            title: 'Archivo · Calma absoluta', blurb: 'El agua cae sin ruido. Giyu convierte cada apertura en una corriente imposible de detener.' },
        { mid: 'arc_nanami', enc: 'ch_nanami_rival', enemy: 'nanami', name: 'Kento Nanami', stage: 'office', inv: 70,
            title: 'Archivo · La séptima hora', blurb: 'Las luces de la oficina parpadean. Nanami solo necesita encontrar un punto débil.' },
        { mid: 'arc_yuta', enc: 'ch_yuta_rival', enemy: 'yuta', name: 'Yuta Okkotsu', stage: 'school', inv: 72,
            title: 'Archivo · Promesa maldita', blurb: 'Una presencia enorme ocupa el patio. Yuta pelea como si cada golpe protegiera a alguien.' },
        { mid: 'arc_zoro', enc: 'ch_zoro_rival', enemy: 'zoro', name: 'Roronoa Zoro', stage: 'dojo', inv: 58,
            title: 'Archivo · Tres hojas, cero salidas', blurb: 'El dojo no tiene puertas visibles. Zoro sonríe: perderse aquí también cuenta como entrenamiento.' },
        { mid: 'arc_sanji', enc: 'ch_sanji_rival', enemy: 'sanji', name: 'Sanji', stage: 'galley', inv: 58,
            title: 'Archivo · Cocina en llamas', blurb: 'El suelo arde y el cocinero no deja de moverse. Ni un segundo de descanso.' },
        { mid: 'arc_law', enc: 'ch_law_rival', enemy: 'law', name: 'Trafalgar Law', stage: 'room', inv: 70,
            title: 'Archivo · ROOM cerrada', blurb: 'El espacio deja de obedecer. Law ha convertido el mapa entero en su quirófano.' },
        { mid: 'arc_jotaro', enc: 'ch_jotaro_rival', enemy: 'jotaro', name: 'Jotaro Kujo', stage: 'street', inv: 74,
            title: 'Archivo · Cinco segundos', blurb: 'El reloj se detiene durante un instante. Jotaro ya ha decidido dónde terminará el combate.' }
    ],

    /** Stats por fase (escalado suave). */
    statsFor(index, total, isBoss) {
        if (isBoss) {
            return { maxHp: 720, atk: 72, def: 30, agi: 22, luk: 26, color: '#c41e3a' };
        }
        const t = index / Math.max(1, total - 1);
        return {
            maxHp: Math.round(320 + t * 280),
            atk: Math.round(52 + t * 22),
            def: Math.round(18 + t * 12),
            agi: Math.round(26 + t * 16),
            luk: Math.round(14 + t * 10),
            color: '#c41e3c'
        };
    },

    buildEncounters() {
        const out = {};
        const paint = (list, asStory) => {
            list.forEach((row, i) => {
                const isBoss = row.enemy === 'boss5050';
                const st = this.statsFor(i, list.length, isBoss);
                const enemy = isBoss
                    ? {
                        id: 'boss5050',
                        name: 'THE 50/50 · Joker',
                        img: 'assets/sprites/anim/boss5050_idle.png',
                        maxHp: st.maxHp,
                        atk: st.atk,
                        def: st.def,
                        agi: st.agi,
                        luk: st.luk,
                        color: st.color,
                        weak: ['bless', 'wind'],
                        resist: ['strike', 'slash'],
                        null: ['curse'],
                        ai: 'final_boss',
                        roleTag: 'Phantom Thief',
                        skills: [
                            { id: 'lost', name: 'LOST THE 50/50', cry: 'You\'re next!', power: 78, type: 'curse', aoe: true },
                            { id: 'hard', name: 'HARD PITY', cry: 'Take this!', power: 98, type: 'strike' },
                            { id: 'rate', name: 'RATE UP (Fake)', cry: 'Persona!', power: 55, type: 'psy', aoe: true },
                            { id: 'guaranteed', name: 'GUARANTEED', cry: 'Guaranteed?', power: 0, type: 'support', selfDebuff: { def: 0.55 }, turns: 2 },
                            { id: 'coin_true', name: 'True Coin Flip', cry: 'ALL-OUT ATTACK!', power: 125, type: 'almighty' },
                            { id: 'heal_phase', name: 'Recalculate Destiny', cry: 'Not yet...', power: 0, type: 'support', heal: 100 }
                        ]
                    }
                    : this.mk(row.enemy, row.name, st);

                out[row.enc] = {
                    title: row.title,
                    difficulty: Math.min(9, 2 + Math.floor(i / 3)),
                    hint: row.blurb,
                    stage: row.stage,
                    isBoss: !!isBoss,
                    enemies: [enemy],
                    rewardInvocations: this.pullRewardFor(row.inv),
                    ...(isBoss ? {
                        partyHpScale: 1.08,
                        partySpScale: 1.18,
                        partySpRegen: 18,
                        partyHpRegenPct: 0.04,
                        enemyHpScale: 1.0,
                        enemyAtkScale: 1.05
                    } : {})
                };
            });
        };
        paint(this.STORY, true);
        paint(this.ARCHIVES, false);
        // Alias legacy boss key
        out.boss = out.ch_boss5050 || out[this.STORY[this.STORY.length - 1].enc];
        // Keep training sandbox
        return out;
    },

    buildMissions() {
        const missions = {
            training: {
                id: 'training',
                title: 'TRAINING · Muñeco',
                blurb: 'Sandbox. Sin recompensa · el muñeco no contraataca.',
                encounter: 'training',
                optional: true,
                flagClear: 'training_cleared',
                rewardText: 'Sandbox — 0 invocaciones.'
            }
        };
        this.STORY.forEach((row) => {
            missions[row.mid] = {
                id: row.mid,
                title: row.title,
                sealedTitle: row.sealed,
                sealedBlurb: 'El sello aún no revela este frente.',
                blurb: row.blurb,
                encounter: row.enc,
                flagClear: `${row.mid}_cleared`,
                isFinal: !!row.isFinal,
                    rewardText: row.metaphor
                    ? `+${this.pullRewardFor(row.inv)} equivalentes de tirada · +14 Metaphor`
                    : (row.isFinal ? `+${this.pullRewardFor(row.inv)} equivalentes de tirada · +10 Metaphor (cierre)` : `+${this.pullRewardFor(row.inv)} equivalentes de tirada (primer clear)`)
            };
        });
        this.ARCHIVES.forEach((row) => {
            missions[row.mid] = {
                id: row.mid,
                title: row.title,
                sealedTitle: `✦ ARCHIVO · ???`,
                sealedBlurb: 'Un archivo sellado del multiverso.',
                blurb: row.blurb,
                encounter: row.enc,
                optional: true,
                flagClear: `${row.mid}_cleared`,
                rewardText: row.metaphor
                    ? `+${this.pullRewardFor(row.inv)} equivalentes de tirada · +14 Metaphor`
                    : `+${this.pullRewardFor(row.inv)} equivalentes de tirada (primer clear)`
            };
        });
        return missions;
    },

    stageMap() {
        const map = { training: 'tower', boss: 'destiny' };
        [...this.STORY, ...this.ARCHIVES].forEach((row) => {
            map[row.enc] = row.stage;
            if (row.mid === 'gate_final') map.boss = row.stage;
        });
        return map;
    },

    metaphorMissionIds() {
        return [...this.STORY, ...this.ARCHIVES]
            .filter((r) => r.metaphor)
            .map((r) => r.mid);
    },

    totalFirstClearInv() {
        return [...this.STORY, ...this.ARCHIVES].reduce((s, r) => s + this.pullRewardFor(r.inv), 0);
    },

    storyMissionList() {
        return this.STORY.map((r) => StoryData.missions[r.mid]).filter(Boolean);
    },

    archiveMissionList() {
        return this.ARCHIVES.map((r) => StoryData.missions[r.mid]).filter(Boolean);
    }
};

(function bootChronicle() {
    if (typeof BattleData === 'undefined') return;

    const encs = ChronicleData.buildEncounters();
    Object.assign(BattleData.encounters, encs);
    // Preserve training if present
    if (!BattleData.encounters.training) {
        BattleData.encounters.training = {
            title: 'TRAINING', difficulty: 0, training: true, enemies: [], rewardInvocations: 0
        };
    }

    if (typeof StoryData !== 'undefined') {
        StoryData.missions = ChronicleData.buildMissions();
        StoryData.prologue = [
            { speaker: 'Sistema', text: 'OPERATION CHIKITRISKIS — CRÓNICA DEL DESTINO.' },
            { speaker: 'Narrador', text: 'Grietas entre mundos. Cada frente es único: un enemigo, un mapa, sin refritos.' },
            { speaker: 'Narrador', text: '22 sellos de historia + archivos opcionales. Las primeras recompensas son escasas: repetir frentes difíciles y farmear Chiki es parte del viaje.' },
            { speaker: 'Sistema', text: 'Cierra THE 50/50 → Metaphor → el regalo. Gojo abre el sello final antes de tiempo.' }
        ];
    }

    const stages = ChronicleData.stageMap();
    const stageAliases = {
        ash: 'jjk-shrine',
        city: 'jjk-city',
        school: 'jjk-school',
        volcano: 'jjk-volcano',
        shrine: 'jjk-shrine',
        entertainment: 'kimetsu-entertainment',
        blood: 'chainsaw',
        crimson: 'mansion',
        night: 'soul',
        control: 'chainsaw',
        world: 'mansion',
        moon: 'kimetsu-moon',
        ice: 'kimetsu-moon',
        fear: 'kimetsu-entertainment',
        pot: 'kimetsu-entertainment',
        street: 'chainsaw',
        deep: 'chainsaw',
        lightning: 'storm',
        prison: 'mansion',
        waterfall: 'kimetsu-moon',
        office: 'jjk-school',
        dojo: 'tower',
        galley: 'sea',
        room: 'sea'
    };
    const normalizeStage = stage => stageAliases[stage] || stage;
    const _stageFor = BattleData.stageFor.bind(BattleData);
    BattleData.stageFor = function (runKey) {
        if (stages[runKey]) return normalizeStage(stages[runKey]);
        const enc = this.encounters[runKey];
        if (enc?.stage) return normalizeStage(enc.stage);
        return normalizeStage(_stageFor(runKey));
    };

    const _musicFor = BattleData.musicFor.bind(BattleData);
    BattleData.musicFor = function (runKey) {
        const stage = this.stageFor(runKey);
        if (String(stage).startsWith('kimetsu')) return 'battle_kimetsu';
        if (stage === 'chainsaw' || stage === 'blood' || stage === 'control' || stage === 'street' || stage === 'deep') {
            const enc = this.encounters[runKey];
            const id = enc?.enemies?.[0]?.id;
            if (id === 'makima') return 'battle_chainsaw_makima';
            return 'battle_chainsaw';
        }
        if (String(stage).startsWith('jjk') || stage === 'volcano' || stage === 'shrine' || stage === 'ash' || stage === 'city') {
            const enc = this.encounters[runKey];
            const id = enc?.enemies?.[0]?.id;
            if (id === 'sukuna') return 'battle_jjk_sukuna';
            if (id === 'gojo') return 'battle_jjk_gojo';
            return 'battle_jjk';
        }
        return _musicFor(runKey);
    };

    if (typeof console !== 'undefined') {
        const total = ChronicleData.totalFirstClearInv();
        console.info(`[Chronicle] first-clear INV=${total} (target ${ChronicleData.TARGET_FIRST_CLEAR_INV})`);
    }
})();
