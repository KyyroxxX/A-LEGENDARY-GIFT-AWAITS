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
            blurb: 'El Joker del destino. Se desbloquea con TODA la colección al máximo (4★ C6 · 5★/6★ C3), da igual la historia. Victoria = +200 tiradas rojas. El regalo solo sale con Ren al máximo.',
            sealed: '✦ THE 50/50 · SELLADO — COLECCIÓN INCOMPLETA',
            sealedBlurb: 'Sellado: consigue TODOS los personajes con TODOS sus dupes (4★ C6 · 5★/6★ C3). La historia no importa. Gojo no abre nada.',
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
            title: 'Archivo · Cinco segundos', blurb: 'El reloj se detiene durante un instante. Jotaro ya ha decidido dónde terminará el combate.' },
        { mid: 'arc_tobi', enc: 'ch_tobi_rival', enemy: 'tobi', name: 'Tobi', stage: 'akatsuki', inv: 76,
            title: 'Archivo · El enmascarado', blurb: 'Kamui te traga el primer turno si parpadeas. Rompe su intangibilidad con presión constante.' },
        { mid: 'arc_marshall', enc: 'ch_marshall_rival', enemy: 'marshall', name: 'Marshall D. Teach', stage: 'deep', inv: 78,
            title: 'Archivo · Terremoto oscuro', blurb: 'La oscuridad atrae y el terremoto remata. Barbanegra juega con dos frutas y cero piedad.' },
        { mid: 'arc_kashimo', enc: 'ch_kashimo_rival', enemy: 'kashimo', name: 'Hajime Kashimo', stage: 'lightning', inv: 76,
            title: 'Archivo · Bestia ámbar', blurb: 'Electricidad de un solo uso: Kashimo apuesta todo a un estallido. Sobrevívelo y es tuyo.' },
        { mid: 'arc_muzan', enc: 'ch_muzan_rival', enemy: 'muzan', name: 'Muzan Kibutsuji', stage: 'fear', inv: 85,
            title: 'Archivo · Progenitor demoníaco', blurb: 'Tres formas, cero piedad. Muzan muta dos veces: guarda CP para cada escalón.' },
        { mid: 'arc_yourichi', enc: 'ch_yourichi_rival', enemy: 'yourichi', name: 'Yoriichi Tsugikuni', stage: 'moon', inv: 82,
            title: 'Archivo · Respiración del origen', blurb: 'El espadachín más fuerte de la historia no necesita transformarse… pero puede. Reza.' },
        { mid: 'arc_quanxi', enc: 'ch_quanxi_rival', enemy: 'quanxi', name: 'Quanxi', stage: 'control', inv: 76,
            title: 'Archivo · Primera cazadora', blurb: 'Cuatro brazos, cuatro ballestas, cero fallos. La híbrida no negocia: ejecuta.' },
        { mid: 'arc_kimimaro', enc: 'ch_kimimaro_rival', enemy: 'kimimaro', name: 'Kimimaro', stage: 'pot', inv: 70,
            title: 'Archivo · Huesos malditos', blurb: 'El clan Kaguya baila por última vez. Huesos más duros que tu defensa: rompe el ritmo.' },
        { mid: 'arc_ren', enc: 'ch_ren_rival', enemy: 'ren', name: 'Ren Amamiya', stage: 'crimson', inv: 74,
            title: 'Archivo · Comodín rebelde', blurb: 'Un aviso de los Phantom Thieves en tu puerta. Joker roba turnos y corazones por igual.' },
        { mid: 'arc_hualkenberg', enc: 'ch_hualkenberg_rival', enemy: 'hualkenberg', name: 'Hulkenberg', stage: 'room', inv: 70,
            title: 'Archivo · Juramento del caballero', blurb: 'La guardia real no retrocede. Hulkenberg cubre cada hueco: desgasta su guardia.' },
        { mid: 'arc2_luffy', enc: 'ch2_luffy', enemy: 'luffy', name: 'Monkey D. Luffy', stage: 'marineford', inv: 42,
            title: 'Archivo · El rey sin corona', blurb: 'Un Monkey D. Luffy distinto al de los carteles. Aquí los puños hablan antes que el bounty.' },
        { mid: 'arc2_naruto', enc: 'ch2_naruto', enemy: 'naruto', name: 'Naruto Uzumaki', stage: 'valley_end', inv: 49,
            title: 'Archivo · Sombra de Konoha', blurb: 'Ni el sharingan alcanza a Naruto Uzumaki cuando va en serio. Cúbrete.' },
        { mid: 'arc2_katakuri', enc: 'ch2_katakuri', enemy: 'katakuri', name: 'Charlotte Katakuri', stage: 'wano', inv: 42,
            title: 'Archivo · Nuevo mundo', blurb: 'Dicen que Charlotte Katakuri ya vio el final del Grand Line. Compruébalo.' },
        { mid: 'arc2_shanks', enc: 'ch2_shanks', enemy: 'shanks', name: 'Shanks', stage: 'dressrosa', inv: 49,
            title: 'Archivo · El rey sin corona', blurb: 'Un Shanks distinto al de los carteles. Aquí los puños hablan antes que el bounty.' },
        { mid: 'arc2_mihawk', enc: 'ch2_mihawk', enemy: 'mihawk', name: 'Dracule Mihawk', stage: 'enies_lobby', inv: 42,
            title: 'Archivo · Marea alta', blurb: 'Dracule Mihawk corta la retirada. El mar no perdona a quien duda.' },
        { mid: 'arc2_marco', enc: 'ch2_marco', enemy: 'marco', name: 'Marco', stage: 'alabasta', inv: 49,
            title: 'Archivo · Nuevo mundo', blurb: 'Dicen que Marco ya vio el final del Grand Line. Compruébalo.' },
        { mid: 'arc2_jinbe', enc: 'ch2_jinbe', enemy: 'jinbe', name: 'Jinbe', stage: 'op-onepiece_port-v1', inv: 42,
            title: 'Archivo · El rey sin corona', blurb: 'Un Jinbe distinto al de los carteles. Aquí los puños hablan antes que el bounty.' },
        { mid: 'arc2_nami', enc: 'ch2_nami', enemy: 'nami', name: 'Nami', stage: 'op-sea-v1', inv: 49,
            title: 'Archivo · Marea alta', blurb: 'Nami corta la retirada. El mar no perdona a quien duda.' },
        { mid: 'arc2_brook', enc: 'ch2_brook', enemy: 'brook', name: 'Brook', stage: 'op-sanji_galley-v1', inv: 42,
            title: 'Archivo · Nuevo mundo', blurb: 'Dicen que Brook ya vio el final del Grand Line. Compruébalo.' },
        { mid: 'arc2_franky', enc: 'ch2_franky', enemy: 'franky', name: 'Franky', stage: 'op-law_room-v1', inv: 49,
            title: 'Archivo · El rey sin corona', blurb: 'Un Franky distinto al de los carteles. Aquí los puños hablan antes que el bounty.' },
        { mid: 'arc2_chopper', enc: 'ch2_chopper', enemy: 'chopper', name: 'Tony Tony Chopper', stage: 'op-onepiece_marineford-v1', inv: 42,
            title: 'Archivo · Marea alta', blurb: 'Tony Tony Chopper corta la retirada. El mar no perdona a quien duda.' },
        { mid: 'arc2_usopp', enc: 'ch2_usopp', enemy: 'usopp', name: 'Usopp', stage: 'op-onepiece_wano-v1', inv: 49,
            title: 'Archivo · Nuevo mundo', blurb: 'Dicen que Usopp ya vio el final del Grand Line. Compruébalo.' },
        { mid: 'arc2_jiraiya', enc: 'ch2_jiraiya', enemy: 'jiraiya', name: 'Jiraiya', stage: 'training_ground', inv: 42,
            title: 'Archivo · Voluntad probada', blurb: 'Jiraiya te mide con la mirada. Un error y el jutsu no perdona.' },
        { mid: 'arc2_itachi', enc: 'ch2_itachi', enemy: 'itachi', name: 'Itachi Uchiha', stage: 'rain_village', inv: 49,
            title: 'Archivo · Sombra de Konoha', blurb: 'Ni el sharingan alcanza a Itachi Uchiha cuando va en serio. Cúbrete.' },
        { mid: 'arc2_hidan', enc: 'ch2_hidan', enemy: 'hidan', name: 'Hidan', stage: 'sand_village', inv: 42,
            title: 'Archivo · Examen final', blurb: 'Hidan no hace prisioneros. Lee su ritmo o muere en el intento.' },
        { mid: 'arc2_pain', enc: 'ch2_pain', enemy: 'pain', name: 'Pain (Tendo)', stage: 'nar-snake-v1', inv: 49,
            title: 'Archivo · Voluntad probada', blurb: 'Pain (Tendo) te mide con la mirada. Un error y el jutsu no perdona.' },
        { mid: 'arc2_gai', enc: 'ch2_gai', enemy: 'gai', name: 'Might Guy', stage: 'nar-tower-v1', inv: 42,
            title: 'Archivo · Sombra de Konoha', blurb: 'Ni el sharingan alcanza a Might Guy cuando va en serio. Cúbrete.' },
        { mid: 'arc2_minato', enc: 'ch2_minato', enemy: 'minato', name: 'Minato Namikaze', stage: 'nar-giyu_waterfall-v1', inv: 49,
            title: 'Archivo · Examen final', blurb: 'Minato Namikaze no hace prisioneros. Lee su ritmo o muere en el intento.' },
        { mid: 'arc2_tsunade', enc: 'ch2_tsunade', enemy: 'tsunade', name: 'Tsunade', stage: 'nar-konoha-v1', inv: 42,
            title: 'Archivo · Voluntad probada', blurb: 'Tsunade te mide con la mirada. Un error y el jutsu no perdona.' },
        { mid: 'arc2_tobirama', enc: 'ch2_tobirama', enemy: 'tobirama', name: 'Tobirama Senju', stage: 'nar-mist-v1', inv: 49,
            title: 'Archivo · Sombra de Konoha', blurb: 'Ni el sharingan alcanza a Tobirama Senju cuando va en serio. Cúbrete.' },
        { mid: 'arc2_konan', enc: 'ch2_konan', enemy: 'konan', name: 'Konan', stage: 'nar-ninja_forest-v1', inv: 42,
            title: 'Archivo · Examen final', blurb: 'Konan no hace prisioneros. Lee su ritmo o muere en el intento.' },
        { mid: 'arc2_kakuzu', enc: 'ch2_kakuzu', enemy: 'kakuzu', name: 'Kakuzu', stage: 'nar-snake-v2', inv: 49,
            title: 'Archivo · Voluntad probada', blurb: 'Kakuzu te mide con la mirada. Un error y el jutsu no perdona.' },
        { mid: 'arc2_gaara', enc: 'ch2_gaara', enemy: 'gaara', name: 'Gaara', stage: 'nar-tower-v2', inv: 42,
            title: 'Archivo · Sombra de Konoha', blurb: 'Ni el sharingan alcanza a Gaara cuando va en serio. Cúbrete.' },
        { mid: 'arc2_sakura', enc: 'ch2_sakura', enemy: 'sakura', name: 'Sakura Haruno', stage: 'nar-giyu_waterfall-v2', inv: 49,
            title: 'Archivo · Examen final', blurb: 'Sakura Haruno no hace prisioneros. Lee su ritmo o muere en el intento.' },
        { mid: 'arc2_jugo', enc: 'ch2_jugo', enemy: 'jugo', name: 'Jūgo', stage: 'nar-konoha-v2', inv: 42,
            title: 'Archivo · Voluntad probada', blurb: 'Jūgo te mide con la mirada. Un error y el jutsu no perdona.' },
        { mid: 'arc2_karin', enc: 'ch2_karin', enemy: 'karin', name: 'Karin Uzumaki', stage: 'nar-mist-v2', inv: 49,
            title: 'Archivo · Sombra de Konoha', blurb: 'Ni el sharingan alcanza a Karin Uzumaki cuando va en serio. Cúbrete.' },
        { mid: 'arc2_suigetsu', enc: 'ch2_suigetsu', enemy: 'suigetsu', name: 'Suigetsu Hozuki', stage: 'nar-ninja_forest-v2', inv: 42,
            title: 'Archivo · Examen final', blurb: 'Suigetsu Hozuki no hace prisioneros. Lee su ritmo o muere en el intento.' },
        { mid: 'arc2_shikamaru', enc: 'ch2_shikamaru', enemy: 'shikamaru', name: 'Shikamaru Nara', stage: 'nar-snake-v3', inv: 49,
            title: 'Archivo · Voluntad probada', blurb: 'Shikamaru Nara te mide con la mirada. Un error y el jutsu no perdona.' },
        { mid: 'arc2_hinata', enc: 'ch2_hinata', enemy: 'hinata', name: 'Hinata Hyuga', stage: 'nar-tower-v3', inv: 42,
            title: 'Archivo · Sombra de Konoha', blurb: 'Ni el sharingan alcanza a Hinata Hyuga cuando va en serio. Cúbrete.' },
        { mid: 'arc2_sai', enc: 'ch2_sai', enemy: 'sai', name: 'Sai', stage: 'nar-giyu_waterfall-v3', inv: 49,
            title: 'Archivo · Examen final', blurb: 'Sai no hace prisioneros. Lee su ritmo o muere en el intento.' },
        { mid: 'arc2_neji', enc: 'ch2_neji', enemy: 'neji', name: 'Neji Hyuga', stage: 'nar-konoha-v3', inv: 42,
            title: 'Archivo · Voluntad probada', blurb: 'Neji Hyuga te mide con la mirada. Un error y el jutsu no perdona.' },
        { mid: 'arc2_lee', enc: 'ch2_lee', enemy: 'lee', name: 'Rock Lee', stage: 'nar-mist-v3', inv: 49,
            title: 'Archivo · Sombra de Konoha', blurb: 'Ni el sharingan alcanza a Rock Lee cuando va en serio. Cúbrete.' },
        { mid: 'arc2_pucci', enc: 'ch2_pucci', enemy: 'pucci', name: 'Enrico Pucci', stage: 'egypt', inv: 42,
            title: 'Archivo · Flecha rota', blurb: 'Un fragmento de Enrico Pucci basta para doblar la realidad. No pestañees.' },
        { mid: 'arc2_weather', enc: 'ch2_weather', enemy: 'weather', name: 'Weather Report', stage: 'morioh', inv: 49,
            title: 'Archivo · Stand en pie', blurb: 'El aire vibra: Weather Report ya activó su stand. Encuentra el hueco.' },
        { mid: 'arc2_giorno', enc: 'ch2_giorno', enemy: 'giorno', name: 'Giorno Giovanna', stage: 'rome', inv: 42,
            title: 'Archivo · Destino absurdo', blurb: 'Giorno Giovanna sonríe. Eso nunca es buena señal. Golpea primero.' },
        { mid: 'arc2_polnareff', enc: 'ch2_polnareff', enemy: 'polnareff', name: 'Jean Pierre Polnareff', stage: 'jojo-mansion-v1', inv: 49,
            title: 'Archivo · Flecha rota', blurb: 'Un fragmento de Jean Pierre Polnareff basta para doblar la realidad. No pestañees.' },
        { mid: 'arc2_kakyoin', enc: 'ch2_kakyoin', enemy: 'kakyoin', name: 'Noriaki Kakyoin', stage: 'jojo-jojo_time-v1', inv: 42,
            title: 'Archivo · Stand en pie', blurb: 'El aire vibra: Noriaki Kakyoin ya activó su stand. Encuentra el hueco.' },
        { mid: 'arc2_mista', enc: 'ch2_mista', enemy: 'mista', name: 'Guido Mista', stage: 'jojo-jojo_prison-v1', inv: 49,
            title: 'Archivo · Destino absurdo', blurb: 'Guido Mista sonríe. Eso nunca es buena señal. Golpea primero.' },
        { mid: 'arc2_bucciarati', enc: 'ch2_bucciarati', enemy: 'bucciarati', name: 'Bruno Bucciarati', stage: 'jojo-jojo_egypt-v1', inv: 42,
            title: 'Archivo · Flecha rota', blurb: 'Un fragmento de Bruno Bucciarati basta para doblar la realidad. No pestañees.' },
        { mid: 'arc2_anasui', enc: 'ch2_anasui', enemy: 'anasui', name: 'Narciso Anasui', stage: 'jojo-jojo_morioh-v1', inv: 49,
            title: 'Archivo · Stand en pie', blurb: 'El aire vibra: Narciso Anasui ya activó su stand. Encuentra el hueco.' },
        { mid: 'arc2_risotto', enc: 'ch2_risotto', enemy: 'risotto', name: 'Risotto Nero', stage: 'jojo-mansion-v2', inv: 42,
            title: 'Archivo · Destino absurdo', blurb: 'Risotto Nero sonríe. Eso nunca es buena señal. Golpea primero.' },
        { mid: 'arc2_caesar', enc: 'ch2_caesar', enemy: 'caesar', name: 'Caesar Anthonio Zeppeli', stage: 'jojo-jojo_time-v2', inv: 49,
            title: 'Archivo · Flecha rota', blurb: 'Un fragmento de Caesar Anthonio Zeppeli basta para doblar la realidad. No pestañees.' },
        { mid: 'arc2_rohan', enc: 'ch2_rohan', enemy: 'rohan', name: 'Rohan Kishibe', stage: 'jojo-jojo_prison-v2', inv: 42,
            title: 'Archivo · Stand en pie', blurb: 'El aire vibra: Rohan Kishibe ya activó su stand. Encuentra el hueco.' },
        { mid: 'arc2_josuke', enc: 'ch2_josuke', enemy: 'josuke', name: 'Josuke Higashikata', stage: 'jojo-jojo_egypt-v2', inv: 49,
            title: 'Archivo · Destino absurdo', blurb: 'Josuke Higashikata sonríe. Eso nunca es buena señal. Golpea primero.' },
        { mid: 'arc2_joseph', enc: 'ch2_joseph', enemy: 'joseph', name: 'Joseph Joestar', stage: 'jojo-jojo_morioh-v2', inv: 42,
            title: 'Archivo · Flecha rota', blurb: 'Un fragmento de Joseph Joestar basta para doblar la realidad. No pestañees.' },
        { mid: 'arc2_narancia', enc: 'ch2_narancia', enemy: 'narancia', name: 'Narancia Ghirga', stage: 'jojo-mansion-v3', inv: 49,
            title: 'Archivo · Stand en pie', blurb: 'El aire vibra: Narancia Ghirga ya activó su stand. Encuentra el hueco.' },
        { mid: 'arc2_abbacchio', enc: 'ch2_abbacchio', enemy: 'abbacchio', name: 'Leone Abbacchio', stage: 'jojo-jojo_time-v3', inv: 42,
            title: 'Archivo · Destino absurdo', blurb: 'Leone Abbacchio sonríe. Eso nunca es buena señal. Golpea primero.' },
        { mid: 'arc2_okuyasu', enc: 'ch2_okuyasu', enemy: 'okuyasu', name: 'Okuyasu Nijimura', stage: 'jojo-jojo_prison-v3', inv: 49,
            title: 'Archivo · Flecha rota', blurb: 'Un fragmento de Okuyasu Nijimura basta para doblar la realidad. No pestañees.' },
        { mid: 'arc2_trish', enc: 'ch2_trish', enemy: 'trish', name: 'Trish Una', stage: 'jojo-jojo_egypt-v3', inv: 42,
            title: 'Archivo · Stand en pie', blurb: 'El aire vibra: Trish Una ya activó su stand. Encuentra el hueco.' },
        { mid: 'arc2_ff', enc: 'ch2_ff', enemy: 'ff', name: 'Foo Fighters', stage: 'jojo-jojo_morioh-v3', inv: 49,
            title: 'Archivo · Destino absurdo', blurb: 'Foo Fighters sonríe. Eso nunca es buena señal. Golpea primero.' },
        { mid: 'arc2_shunsui', enc: 'ch2_shunsui', enemy: 'shunsui', name: 'Shunsui Kyōraku', stage: 'karakura', inv: 42,
            title: 'Archivo · Hueco hambriento', blurb: 'Shunsui Kyōraku huele tu miedo. Demuéstrale que se equivoca.' },
        { mid: 'arc2_byakuya', enc: 'ch2_byakuya', enemy: 'byakuya', name: 'Byakuya Kuchiki', stage: 'las_noches', inv: 49,
            title: 'Archivo · Bankai en el aire', blurb: 'Byakuya Kuchiki libera presión espiritual. El suelo tiembla.' },
        { mid: 'arc2_rukia', enc: 'ch2_rukia', enemy: 'rukia', name: 'Rukia Kuchiki', stage: 'sokyoku', inv: 42,
            title: 'Archivo · Deuda del Seireitei', blurb: 'Rukia Kuchiki cobra en reiatsu. Paga con acero.' },
        { mid: 'arc2_toshiro', enc: 'ch2_toshiro', enemy: 'toshiro', name: 'Toshiro Hitsugaya', stage: 'soul', inv: 49,
            title: 'Archivo · Hueco hambriento', blurb: 'Toshiro Hitsugaya huele tu miedo. Demuéstrale que se equivoca.' },
        { mid: 'arc2_yoruichi', enc: 'ch2_yoruichi', enemy: 'yoruichi', name: 'Yoruichi Shihoin', stage: 'ble-bleach_senbon-v1', inv: 42,
            title: 'Archivo · Bankai en el aire', blurb: 'Yoruichi Shihoin libera presión espiritual. El suelo tiembla.' },
        { mid: 'arc2_urahara', enc: 'ch2_urahara', enemy: 'urahara', name: 'Kisuke Urahara', stage: 'ble-hueco-v1', inv: 49,
            title: 'Archivo · Deuda del Seireitei', blurb: 'Kisuke Urahara cobra en reiatsu. Paga con acero.' },
        { mid: 'arc2_kenpachi', enc: 'ch2_kenpachi', enemy: 'kenpachi', name: 'Kenpachi Zaraki', stage: 'ble-bleach_karakura-v1', inv: 42,
            title: 'Archivo · Hueco hambriento', blurb: 'Kenpachi Zaraki huele tu miedo. Demuéstrale que se equivoca.' },
        { mid: 'arc2_renji', enc: 'ch2_renji', enemy: 'renji', name: 'Renji Abarai', stage: 'ble-bleach_senbon-v2', inv: 49,
            title: 'Archivo · Bankai en el aire', blurb: 'Renji Abarai libera presión espiritual. El suelo tiembla.' },
        { mid: 'arc2_orihime', enc: 'ch2_orihime', enemy: 'orihime', name: 'Orihime Inoue', stage: 'ble-hueco-v2', inv: 42,
            title: 'Archivo · Deuda del Seireitei', blurb: 'Orihime Inoue cobra en reiatsu. Paga con acero.' },
        { mid: 'arc2_ginjo', enc: 'ch2_ginjo', enemy: 'ginjo', name: 'Kūgo Ginjō', stage: 'ble-bleach_karakura-v2', inv: 49,
            title: 'Archivo · Hueco hambriento', blurb: 'Kūgo Ginjō huele tu miedo. Demuéstrale que se equivoca.' },
        { mid: 'arc2_gantenbainne', enc: 'ch2_gantenbainne', enemy: 'gantenbainne', name: 'Gantenbainne Mosqueda', stage: 'ble-bleach_senbon-v3', inv: 42,
            title: 'Archivo · Bankai en el aire', blurb: 'Gantenbainne Mosqueda libera presión espiritual. El suelo tiembla.' },
        { mid: 'arc2_gojo', enc: 'ch2_gojo', enemy: 'gojo', name: 'Satoru Gojo', stage: 'shibuya', inv: 49,
            title: 'Archivo · Maldición de grado alto', blurb: 'Satoru Gojo no sigue reglas. Improvisa o muere.' },
        { mid: 'arc2_hakari', enc: 'ch2_hakari', enemy: 'hakari', name: 'Kinji Hakari', stage: 'culling_game', inv: 42,
            title: 'Archivo · Energía torcida', blurb: 'Cada golpe de Kinji Hakari deja residuo. No le des tres seguidos.' },
        { mid: 'arc2_yuki', enc: 'ch2_yuki', enemy: 'yuki', name: 'Yuki Tsukumo', stage: 'domain', inv: 49,
            title: 'Archivo · Expansión cercana', blurb: 'Yuki Tsukumo calienta su dominio. Sal del radio o cae.' },
        { mid: 'arc2_higuruma', enc: 'ch2_higuruma', enemy: 'higuruma', name: 'Hiromi Higuruma', stage: 'hidden_inventory', inv: 42,
            title: 'Archivo · Maldición de grado alto', blurb: 'Hiromi Higuruma no sigue reglas. Improvisa o muere.' },
        { mid: 'arc2_choso', enc: 'ch2_choso', enemy: 'choso', name: 'Choso', stage: 'jjk-jjk_school-v1', inv: 49,
            title: 'Archivo · Energía torcida', blurb: 'Cada golpe de Choso deja residuo. No le des tres seguidos.' },
        { mid: 'arc2_meimei', enc: 'ch2_meimei', enemy: 'meimei', name: 'Mei Mei', stage: 'jjk-jjk_volcano-v1', inv: 42,
            title: 'Archivo · Expansión cercana', blurb: 'Mei Mei calienta su dominio. Sal del radio o cae.' },
        { mid: 'arc2_yuji', enc: 'ch2_yuji', enemy: 'yuji', name: 'Yuji Itadori', stage: 'jjk-jjk_shibuya-v1', inv: 49,
            title: 'Archivo · Maldición de grado alto', blurb: 'Yuji Itadori no sigue reglas. Improvisa o muere.' },
        { mid: 'arc2_megumi', enc: 'ch2_megumi', enemy: 'megumi', name: 'Megumi Fushiguro', stage: 'jjk-jjk_city-v1', inv: 42,
            title: 'Archivo · Energía torcida', blurb: 'Cada golpe de Megumi Fushiguro deja residuo. No le des tres seguidos.' },
        { mid: 'arc2_maki', enc: 'ch2_maki', enemy: 'maki', name: 'Maki Zenin', stage: 'jjk-jjk_school-v2', inv: 49,
            title: 'Archivo · Expansión cercana', blurb: 'Maki Zenin calienta su dominio. Sal del radio o cae.' },
        { mid: 'arc2_nobara', enc: 'ch2_nobara', enemy: 'nobara', name: 'Nobara Kugisaki', stage: 'jjk-jjk_volcano-v2', inv: 42,
            title: 'Archivo · Maldición de grado alto', blurb: 'Nobara Kugisaki no sigue reglas. Improvisa o muere.' },
        { mid: 'arc2_uro', enc: 'ch2_uro', enemy: 'uro', name: 'Takako Uro', stage: 'jjk-jjk_shibuya-v2', inv: 49,
            title: 'Archivo · Energía torcida', blurb: 'Cada golpe de Takako Uro deja residuo. No le des tres seguidos.' },
        { mid: 'arc2_ryu', enc: 'ch2_ryu', enemy: 'ryu', name: 'Ryu Ishigori', stage: 'jjk-jjk_city-v2', inv: 42,
            title: 'Archivo · Expansión cercana', blurb: 'Ryu Ishigori calienta su dominio. Sal del radio o cae.' },
        { mid: 'arc2_todo', enc: 'ch2_todo', enemy: 'todo', name: 'Aoi Todo', stage: 'jjk-jjk_school-v3', inv: 49,
            title: 'Archivo · Maldición de grado alto', blurb: 'Aoi Todo no sigue reglas. Improvisa o muere.' },
        { mid: 'arc2_basilio', enc: 'ch2_basilio', enemy: 'basilio', name: 'Basilio', stage: 'met-bleach_sokyoku-v1', inv: 42,
            title: 'Archivo · Juramento roto', blurb: 'Basilio no se rinde. Ríndele tú.' },
        { mid: 'arc2_eupha', enc: 'ch2_eupha', enemy: 'eupha', name: 'Eupha', stage: 'met-tower-v1', inv: 49,
            title: 'Archivo · Archetype despierto', blurb: 'Eupha invoca su ideal. Supera al ideal.' },
        { mid: 'arc2_strohl', enc: 'ch2_strohl', enemy: 'strohl', name: 'Strohl', stage: 'met-destiny-v1', inv: 42,
            title: 'Archivo · Crónica real', blurb: 'Strohl escribe tu final. Arranca la página.' },
        { mid: 'arc2_heismay', enc: 'ch2_heismay', enemy: 'heismay', name: 'Heismay', stage: 'met-bleach_sokyoku-v2', inv: 49,
            title: 'Archivo · Juramento roto', blurb: 'Heismay no se rinde. Ríndele tú.' },
        { mid: 'arc2_junah', enc: 'ch2_junah', enemy: 'junah', name: 'Junah', stage: 'met-tower-v2', inv: 42,
            title: 'Archivo · Archetype despierto', blurb: 'Junah invoca su ideal. Supera al ideal.' },
        { mid: 'arc2_goro', enc: 'ch2_goro', enemy: 'goro', name: 'Goro Akechi', stage: 'p5r-jojo_prison-v1', inv: 49,
            title: 'Archivo · Cambio de corazón', blurb: 'Goro Akechi apunta a tu sombra. Que no te robe el turno.' },
        { mid: 'arc2_sumire', enc: 'ch2_sumire', enemy: 'sumire', name: 'Kasumi Yoshizawa', stage: 'p5r-jojo_time-v1', inv: 42,
            title: 'Archivo · Showtime', blurb: 'Kasumi Yoshizawa entra con estilo. Responde con más estilo.' },
        { mid: 'arc2_ann', enc: 'ch2_ann', enemy: 'ann', name: 'Ann Takamaki', stage: 'p5r-mansion-v1', inv: 49,
            title: 'Archivo · Aviso cumplido', blurb: 'Ann Takamaki ya envió la carta. El palacio arde.' },
        { mid: 'arc2_makoto', enc: 'ch2_makoto', enemy: 'makoto', name: 'Makoto Niijima', stage: 'p5r-jojo_prison-v2', inv: 42,
            title: 'Archivo · Cambio de corazón', blurb: 'Makoto Niijima apunta a tu sombra. Que no te robe el turno.' },
        { mid: 'arc2_tae', enc: 'ch2_tae', enemy: 'tae', name: 'Tae Takemi', stage: 'p5r-jojo_time-v2', inv: 49,
            title: 'Archivo · Showtime', blurb: 'Tae Takemi entra con estilo. Responde con más estilo.' },
        { mid: 'arc2_futaba', enc: 'ch2_futaba', enemy: 'futaba', name: 'Futaba Sakura', stage: 'p5r-mansion-v2', inv: 42,
            title: 'Archivo · Aviso cumplido', blurb: 'Futaba Sakura ya envió la carta. El palacio arde.' },
        { mid: 'arc2_gyomei', enc: 'ch2_gyomei', enemy: 'gyomei', name: 'Gyomei Himejima', stage: 'infinity_castle', inv: 49,
            title: 'Archivo · Noche de luna', blurb: 'Gyomei Himejima caza bajo la luna. Sé tú el cazador.' },
        { mid: 'arc2_rengoku', enc: 'ch2_rengoku', enemy: 'rengoku', name: 'Kyojuro Rengoku', stage: 'district', inv: 42,
            title: 'Archivo · Nichirin al rojo', blurb: 'La hoja de Kyojuro Rengoku ya arde. Apágala a golpes.' },
        { mid: 'arc2_tengen', enc: 'ch2_tengen', enemy: 'tengen', name: 'Tengen Uzui', stage: 'mugen_train', inv: 49,
            title: 'Archivo · Respiración ajena', blurb: 'Tengen Uzui inhala. El aire pesa. Rompe su cadencia.' },
        { mid: 'arc2_sanemi', enc: 'ch2_sanemi', enemy: 'sanemi', name: 'Sanemi Shinazugawa', stage: 'swordsmith', inv: 42,
            title: 'Archivo · Noche de luna', blurb: 'Sanemi Shinazugawa caza bajo la luna. Sé tú el cazador.' },
        { mid: 'arc2_mitsuri', enc: 'ch2_mitsuri', enemy: 'mitsuri', name: 'Mitsuri Kanroji', stage: 'wisteria', inv: 49,
            title: 'Archivo · Nichirin al rojo', blurb: 'La hoja de Mitsuri Kanroji ya arde. Apágala a golpes.' },
        { mid: 'arc2_muichiro', enc: 'ch2_muichiro', enemy: 'muichiro', name: 'Muichiro Tokito', stage: 'kim-kimetsu_district-v1', inv: 42,
            title: 'Archivo · Respiración ajena', blurb: 'Muichiro Tokito inhala. El aire pesa. Rompe su cadencia.' },
        { mid: 'arc2_obanai', enc: 'ch2_obanai', enemy: 'obanai', name: 'Obanai Iguro', stage: 'kim-kimetsu_infinity_castle-v1', inv: 49,
            title: 'Archivo · Noche de luna', blurb: 'Obanai Iguro caza bajo la luna. Sé tú el cazador.' },
        { mid: 'arc2_nezuko', enc: 'ch2_nezuko', enemy: 'nezuko', name: 'Nezuko Kamado', stage: 'kim-kimetsu_mugen_train-v1', inv: 42,
            title: 'Archivo · Nichirin al rojo', blurb: 'La hoja de Nezuko Kamado ya arde. Apágala a golpes.' },
        { mid: 'arc2_shinobu', enc: 'ch2_shinobu', enemy: 'shinobu', name: 'Shinobu Kocho', stage: 'kim-kimetsu_swordsmith-v1', inv: 49,
            title: 'Archivo · Respiración ajena', blurb: 'Shinobu Kocho inhala. El aire pesa. Rompe su cadencia.' },
        { mid: 'arc2_genya', enc: 'ch2_genya', enemy: 'genya', name: 'Genya Shinazugawa', stage: 'kim-kimetsu_wisteria-v1', inv: 42,
            title: 'Archivo · Noche de luna', blurb: 'Genya Shinazugawa caza bajo la luna. Sé tú el cazador.' },
        { mid: 'arc2_zenitsu', enc: 'ch2_zenitsu', enemy: 'zenitsu', name: 'Zenitsu Agatsuma', stage: 'kim-kimetsu_district-v2', inv: 49,
            title: 'Archivo · Nichirin al rojo', blurb: 'La hoja de Zenitsu Agatsuma ya arde. Apágala a golpes.' },
        { mid: 'arc2_inosuke', enc: 'ch2_inosuke', enemy: 'inosuke', name: 'Inosuke Hashibira', stage: 'kim-kimetsu_infinity_castle-v2', inv: 42,
            title: 'Archivo · Respiración ajena', blurb: 'Inosuke Hashibira inhala. El aire pesa. Rompe su cadencia.' },
        { mid: 'arc2_sabito', enc: 'ch2_sabito', enemy: 'sabito', name: 'Sabito', stage: 'kim-kimetsu_mugen_train-v2', inv: 49,
            title: 'Archivo · Noche de luna', blurb: 'Sabito caza bajo la luna. Sé tú el cazador.' },
        { mid: 'arc2_urokodaki', enc: 'ch2_urokodaki', enemy: 'urokodaki', name: 'Sakonji Urokodaki', stage: 'kim-kimetsu_swordsmith-v2', inv: 42,
            title: 'Archivo · Nichirin al rojo', blurb: 'La hoja de Sakonji Urokodaki ya arde. Apágala a golpes.' },
        { mid: 'arc2_asa', enc: 'ch2_asa', enemy: 'asa', name: 'Asa Mitaka', stage: 'apartment', inv: 49,
            title: 'Archivo · Contrato sucio', blurb: 'Asa Mitaka firmó con algo que no entiende. Tú tampoco lo entenderás.' },
        { mid: 'arc2_aki', enc: 'ch2_aki', enemy: 'aki', name: 'Aki Hayakawa', stage: 'city', inv: 42,
            title: 'Archivo · Gasolina y sangre', blurb: 'Aki Hayakawa huele a motor caliente. Mantén la distancia.' },
        { mid: 'arc2_angel', enc: 'ch2_angel', enemy: 'angel', name: 'Angel', stage: 'hell', inv: 49,
            title: 'Archivo · Cláusula final', blurb: 'Angel ejecuta el contrato. Rompe las letras pequeñas.' },
        { mid: 'arc2_katana', enc: 'ch2_katana', enemy: 'katana', name: 'Katana Man', stage: 'csm-chainsaw_apartment-v1', inv: 42,
            title: 'Archivo · Contrato sucio', blurb: 'Katana Man firmó con algo que no entiende. Tú tampoco lo entenderás.' },
        { mid: 'arc2_kishibe', enc: 'ch2_kishibe', enemy: 'kishibe', name: 'Kishibe', stage: 'csm-chainsaw_city-v1', inv: 49,
            title: 'Archivo · Gasolina y sangre', blurb: 'Kishibe huele a motor caliente. Mantén la distancia.' },
        { mid: 'arc2_kobeni', enc: 'ch2_kobeni', enemy: 'kobeni', name: 'Kobeni Higashiyama', stage: 'csm-chainsaw_hell-v1', inv: 42,
            title: 'Archivo · Cláusula final', blurb: 'Kobeni Higashiyama ejecuta el contrato. Rompe las letras pequeñas.' },
        { mid: 'arc2_kaido', enc: 'ch2_kaido', enemy: 'kaido', name: 'Kaido', stage: 'storm', inv: 58,
            title: 'Archivo · El más fuerte del mundo', blurb: 'Kaido baja del cielo en forma de dragón. Sobrevive al Boro Breath.' },
        { mid: 'arc2_madara', enc: 'ch2_madara', enemy: 'madara', name: 'Madara Uchiha', stage: 'akatsuki', inv: 56,
            title: 'Archivo · Fantasma Uchiha', blurb: 'Madara baila sobre el campo. Reza que no mire la luna.' },
        { mid: 'arc2_yamamoto', enc: 'ch2_yamamoto', enemy: 'yamamoto', name: 'Genryusai Yamamoto', stage: 'soul', inv: 56,
            title: 'Archivo · Llamas del comandante', blurb: 'El Bankai más viejo arde a quince millones de grados. Corre.' },
        { mid: 'arc2_ace', enc: 'ch2_ace', enemy: 'ace', name: 'Portgas D. Ace', stage: 'ash', inv: 52,
            title: 'Archivo · Puño de fuego', blurb: 'Ace sonríe antes del Hiken. No seas su sombrero de paja.' },
        { mid: 'arc2_kizaru', enc: 'ch2_kizaru', enemy: 'kizaru', name: 'Borsalino Kizaru', stage: 'forest', inv: 54,
            title: 'Archivo · Velocidad de la luz', blurb: 'Kizaru ya te ha pateado. Solo que aún no lo sabes.' },
        { mid: 'arc2_unohana', enc: 'ch2_unohana', enemy: 'unohana', name: 'Retsu Unohana', stage: 'night', inv: 52,
            title: 'Archivo · La primera Kenpachi', blurb: 'Su sonrisa cura. Su espada no. Elige bien tu turno.' },
        { mid: 'arc2_louis', enc: 'ch2_louis', enemy: 'louis', name: 'Louis Guiabern', stage: 'arena', inv: 54,
            title: 'Archivo · Utopía del tirano', blurb: 'Louis ofrece un mundo perfecto. El precio eres tú.' },
        { mid: 'arc2_yusuke', enc: 'ch2_yusuke', enemy: 'yusuke', name: 'Yusuke Kitagawa', stage: 'city', inv: 50,
            title: 'Archivo · Belleza robada', blurb: 'Yusuke pinta tu derrota antes de que empiece el combate.' },
    ],

    /** Stats por fase (escalado suave). */
    statsAt(t, isBoss) {
        if (isBoss) {
            return { maxHp: 720, atk: 72, def: 30, agi: 22, luk: 26, color: '#c41e3a' };
        }
        const c = Math.min(1, Math.max(0, t));
        return {
            maxHp: Math.round(320 + c * 280),
            atk: Math.round(52 + c * 22),
            def: Math.round(18 + c * 12),
            agi: Math.round(26 + c * 16),
            luk: Math.round(14 + c * 10),
            color: '#c41e3c'
        };
    },

    statsFor(index, total, isBoss) {
        return this.statsAt(index / Math.max(1, total - 1), isBoss);
    },

    /**
     * Dúos y tríos — combates contra varios enemigos a la vez.
     * Frente al 1 contra 3 de la crónica normal, aquí cada rival baja
     * stats por tamaño de grupo (ver packHp/packAtk en buildEncounters)
     * para que el daño total entrante no se triplique.
     */
    TEAMUPS: [
        { mid: 'arc3_art_duo', enc: 'ch3_art_duo', diff: 5, inv: 60, stage: 'akatsuki',
            title: 'Archivo · Arte en pareja', blurb: 'Sasori hila, Deidara firma. Dos egos, cero piedad: baja primero al que cargue el AoE.',
            foes: [{ enemy: 'sasori', name: 'Sasori' }, { enemy: 'deidara', name: 'Deidara' }] },
        { mid: 'arc3_espada_duo', enc: 'ch3_espada_duo', diff: 6, inv: 62, stage: 'hueco',
            title: 'Archivo · Doble Espada', blurb: 'La Sexta y la Cuarta cazan en manada. Separa sus turnos o te separan a ti.',
            foes: [{ enemy: 'grimmjow', name: 'Grimmjow' }, { enemy: 'ulquiorra', name: 'Ulquiorra' }] },
        { mid: 'arc3_disaster_duo', enc: 'ch3_disaster_duo', diff: 6, inv: 62, stage: 'jjk-volcano',
            title: 'Archivo · Doble desastre', blurb: 'Fuego y alma podrida. Mahito juega; Jogo quema. Mata al que se ría más fuerte.',
            foes: [{ enemy: 'jogo', name: 'Jogo' }, { enemy: 'mahito', name: 'Mahito' }] },
        { mid: 'arc3_blood_duo', enc: 'ch3_blood_duo', diff: 6, inv: 60, stage: 'city',
            title: 'Archivo · Doble filo', blurb: 'Bomba y katana en la misma calle. No te pongas en medio: ponte detrás del que caiga primero.',
            foes: [{ enemy: 'katana', name: 'Katana Man' }, { enemy: 'reze', name: 'Reze' }] },
        { mid: 'arc3_timekill_duo', enc: 'ch3_timekill_duo', diff: 7, inv: 66, stage: 'mansion',
            title: 'Archivo · Tiempo muerto', blurb: 'Za Warudo y Killer Queen desayunan juntos. El tiempo no existe; tu HP tampoco, si dudas.',
            foes: [{ enemy: 'dio', name: 'DIO' }, { enemy: 'kira', name: 'Yoshikage Kira' }] },
        { mid: 'arc3_moon_duo', enc: 'ch3_moon_duo', diff: 7, inv: 66, stage: 'ice',
            title: 'Archivo · Lunas gemelas', blurb: 'Compás y loto sobre hielo. Uno te mide, el otro te congela.',
            foes: [{ enemy: 'akaza', name: 'Akaza' }, { enemy: 'doma', name: 'Doma' }] },
        { mid: 'arc3_sharingan_trio', enc: 'ch3_sharingan_trio', diff: 7, inv: 74, stage: 'akatsuki',
            title: 'Archivo · Trío carmesí', blurb: 'Genjutsu, tiburón y papel. Tres nubes rojas, un solo cielo para quemar.',
            foes: [{ enemy: 'itachi', name: 'Itachi Uchiha' }, { enemy: 'kisame', name: 'Kisame' }, { enemy: 'konan', name: 'Konan' }] },
        { mid: 'arc3_espada_trio', enc: 'ch3_espada_trio', diff: 8, inv: 78, stage: 'hueco',
            title: 'Archivo · Tres Espadas', blurb: 'Sexta, Cuarta y ex-Tres. Hueco Mundo vota: tú pierdes por mayoría.',
            foes: [{ enemy: 'grimmjow', name: 'Grimmjow' }, { enemy: 'ulquiorra', name: 'Ulquiorra' }, { enemy: 'nelliel', name: 'Nelliel' }] },
        { mid: 'arc3_crimson_trio', enc: 'ch3_crimson_trio', diff: 8, inv: 80, stage: 'crimson',
            title: 'Archivo · Trinidad carmesí', blurb: 'Tiempo detenido, tiempo borrado, tiempo acelerado. Elige tu veneno temporal.',
            foes: [{ enemy: 'dio', name: 'DIO' }, { enemy: 'diavolo', name: 'Diavolo' }, { enemy: 'pucci', name: 'Enrico Pucci' }] },
        { mid: 'arc3_founder_trio', enc: 'ch3_founder_trio', diff: 9, inv: 85, stage: 'akatsuki',
            title: 'Archivo · Fundadores del fin', blurb: 'Los tres fantasmas de la guerra ninja. Esto no es un archivo: es un examen final.',
            foes: [{ enemy: 'madara', name: 'Madara Uchiha' }, { enemy: 'tobi', name: 'Tobi' }, { enemy: 'pain', name: 'Pain (Tendo)' }] },
    ],

    buildEncounters() {
        const out = {};
        // First-clear generosity: story ×3, archives ×2 (pull-equivalents).
        const paint = (list, asStory, mult = 1) => {
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
                    rewardInvocations: this.pullRewardFor(row.inv) * mult,
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
        paint(this.STORY, true, 3);
        paint(this.ARCHIVES, false, 2);
        // Team-ups: 2-3 foes share the stat budget so incoming damage
        // doesn't just double/triple (lone-wolf bonus doesn't apply here).
        // Mobs are also less coordinated than bosses (lower focus/AoE).
        // Tuned by sim: duos ~ solo+half, trios hard but winnable.
        const packHp = n => (n <= 1 ? 1 : n === 2 ? 0.40 : 0.22);
        const packAtk = n => (n <= 1 ? 1 : n === 2 ? 0.68 : 0.44);
        this.TEAMUPS.forEach((row) => {
            const foes = row.foes || [];
            const n = Math.max(1, foes.length);
            const diff = row.diff ?? 6;
            const st = this.statsAt(Math.min(1, Math.max(0, (diff - 2) / 7)), false);
            const enemies = foes.map(f => this.mk(f.enemy, f.name, {
                ...st,
                maxHp: Math.round(st.maxHp * packHp(n)),
                atk: Math.round(st.atk * packAtk(n)),
            }));
            const foeCount = enemies.length;
            out[row.enc] = {
                title: row.title,
                difficulty: diff,
                hint: row.blurb,
                stage: row.stage,
                isBoss: false,
                enemies,
                aiHealerFocus: foeCount > 2 ? 0.3 : 0.45,
                aiAoEChance: 0.35,
                rewardInvocations: this.pullRewardFor(row.inv) * 2,
            };
        });
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
                sealedBlurb: row.sealedBlurb || 'El sello aún no revela este frente.',
                blurb: row.blurb,
                encounter: row.enc,
                flagClear: `${row.mid}_cleared`,
                isFinal: !!row.isFinal,
                    rewardText: row.metaphor
                    ? `+${this.pullRewardFor(row.inv) * 3} equivalentes de tirada · +200 Metaphor`
                    : (row.isFinal ? `+${this.pullRewardFor(row.inv) * 3} equivalentes de tirada · +200 Metaphor (cierre)` : `+${this.pullRewardFor(row.inv) * 3} equivalentes de tirada (primer clear)`)
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
                    ? `+${this.pullRewardFor(row.inv) * 2} equivalentes de tirada · +200 Metaphor`
                    : `+${this.pullRewardFor(row.inv) * 2} equivalentes de tirada (primer clear)`
            };
        });
        this.TEAMUPS.forEach((row) => {
            const n = (row.foes || []).length;
            missions[row.mid] = {
                id: row.mid,
                title: row.title,
                sealedTitle: `✦ ARCHIVO · ??? ×${n}`,
                sealedBlurb: 'Varias firmas en el mismo sello. No vengas solo... bueno, sí, trae equipo.',
                blurb: `${row.blurb} (${n} enemigos)`,
                encounter: row.enc,
                optional: true,
                flagClear: `${row.mid}_cleared`,
                rewardText: `+${this.pullRewardFor(row.inv) * 2} equivalentes de tirada (primer clear)`
            };
        });
        return missions;
    },

    stageMap() {
        const map = { training: 'tower', boss: 'destiny' };
        [...this.STORY, ...this.ARCHIVES, ...this.TEAMUPS].forEach((row) => {
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
        return this.STORY.reduce((s, r) => s + this.pullRewardFor(r.inv) * 3, 0)
            + this.ARCHIVES.reduce((s, r) => s + this.pullRewardFor(r.inv) * 2, 0)
            + this.TEAMUPS.reduce((s, r) => s + this.pullRewardFor(r.inv) * 2, 0);
    },

    /** Day system: story mission N = day N. Moving to the next day needs
     *  the previous story front cleared + 3 unique archive clears per day
     *  passed (day 2 → 3 archives, day 3 → 6, …). Repeats don't count. */
    SIDES_PER_DAY: 3,

    storyClears() {
        if (typeof GameState === 'undefined') return 0;
        return this.STORY.filter((r) => !r.isFinal && GameState.flag(`${r.mid}_cleared`)).length;
    },

    sideClears() {
        if (typeof GameState === 'undefined') return 0;
        let n = 0;
        [...this.ARCHIVES, ...this.TEAMUPS].forEach((r) => {
            if (GameState.flag(`${r.mid}_cleared`)) n += 1;
        });
        return n;
    },

    /** Current day = next unopened story front (1-based). */
    currentDay() {
        return Math.min(this.STORY.length, this.storyClears() + 1);
    },

    /** Archives required to open story index i (0-based). */
    sidesRequiredFor(i) {
        return Math.max(0, i * this.SIDES_PER_DAY);
    },

    /** Lock state for a story mission: chain + 3-archives-per-day (+collection for final). */
    storyLockAt(index) {
        const row = this.STORY[index];
        if (!row) return { locked: true, reason: 'day' };
        if (index <= 0 && !row.isFinal) return { locked: false };
        const prev = this.STORY[index - 1];
        const prevCleared = prev
            ? !!((typeof GameState !== 'undefined') && GameState.flag(`${prev.mid}_cleared`))
            : true;
        const need = this.sidesRequiredFor(index);
        const have = this.sideClears();
        if (!prevCleared) return { locked: true, reason: 'prev', need, have };
        if (have < need) return { locked: true, reason: 'sides', need, have };
        if (row.isFinal) {
            const collectionOk = (typeof GachaRoster !== 'undefined' && GachaRoster.bossUnlockedByCollection)
                ? GachaRoster.bossUnlockedByCollection() : true;
            if (!collectionOk) return { locked: true, reason: 'collection', need, have };
        }
        return { locked: false, need, have };
    },

    storyMissionList() {
        return this.STORY.map((r) => StoryData.missions[r.mid]).filter(Boolean);
    },

    archiveMissionList() {
        return [...this.ARCHIVES, ...this.TEAMUPS].map((r) => StoryData.missions[r.mid]).filter(Boolean);
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
                { speaker: 'Narrador', text: '22 sellos de historia + archivos opcionales. La historia paga triple y los archivos doble: repetir frentes también paga triple.' },
            { speaker: 'Sistema', text: 'THE 50/50 exige TODA la colección al máximo (dupes). Solo entonces sale el regalo del banner.' }
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
