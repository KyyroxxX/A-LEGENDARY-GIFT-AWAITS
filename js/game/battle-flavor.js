/**
 * BattleFlavor — personalidad de combate.
 * Taglines, gritos con voz, cut-ins y parches de kits blandos.
 * Se aplica al cargar (después de todos los rosters).
 */
const BattleFlavor = {
    WEAK_CRIES: new Set(['…', '...', '!', 'Now!', 'Ready!', 'Boom.', 'No.', 'Fly.', 'Caught.', 'Hmph.', 'Hn!']),

    /** Una línea que define al personaje en el HUD. */
    taglines: {
        // One Piece
        luffy: '¡Seré el Rey de los Piratas!',
        zoro: 'Nada personal. Solo cortar.',
        sanji: 'Cocinero. Patadas. Caballero.',
        nami: 'El clima obedece… o paga.',
        robin: 'La historia se escribe con dolor.',
        law: 'Room. Operación. Fin.',
        chopper: '¡No soy un peluche!',
        franky: 'SUPER… y punto.',
        brook: 'Yohoho… ¿puedo ver tus… técnicas?',
        usopp: 'Mentiroso profesional · valiente a ratos.',
        crocodile: 'El desierto no negocia.',
        enel: 'Yo soy un dios. Tú, ruido.',
        lucci: 'CP9 no pregunta. Archiva.',
        doflamingo: 'Los hilos siempre ganan.',
        shanks: 'Una mirada basta.',
        mihawk: 'El más fuerte no grita.',

        // Naruto
        naruto: '¡Nunca me rindo, dattebayo!',
        sasuke: 'Solo necesito poder.',
        sakura: 'Si tocas a mis amigos…',
        kakashi: 'Copiaré tu estilo… y lo mejoraré.',
        itachi: 'Perdóname. Esto es necesario.',
        jiraiya: 'El sapo ermitaño entra en escena.',
        tsunade: 'La Hokage no tiembla.',
        gai: '¡LA JUVENTUD ARDE!',
        lee: '¡Taijutsu puro! ¡Juventud!',
        neji: 'El destino… se puede romper.',
        hinata: 'P-por favor… deja que pelee.',
        shikamaru: 'Qué rollo… pero gano.',
        gaara: 'La arena te abraza. Para siempre.',
        minato: 'Un instante. Un sello. Adiós.',
        orochimaru: 'La eternidad tiene precio.',
        zabuza: 'En la niebla, nadie llora.',
        kisame: 'Samehada tiene hambre.',
        sasori: 'El arte no envejece. Tú sí.',
        deidara: '¡EL ARTE ES UNA EXPLOSIÓN!',
        hidan: '¡Por Jashin, sangra conmigo!',
        konan: 'Papel. Lluvia. Adiós.',
        pain: '¿Conoces el dolor?',
        sai: 'La tinta dice lo que yo no.',
        yamato: 'Mokuton. Contención. Orden.',

        // JoJo
        jotaro: 'Yare yare daze.',
        joseph: '¡Tu próximo movimiento es…!',
        josuke: '¿Tocaste el pelo?',
        giorno: 'I, Giorno Giovanna…',
        jolyne: 'Stone Free. Sin cadenas.',
        dio: '¡ZA WARUDO!',
        kira: 'Solo quiero una vida tranquila.',
        diavolo: 'Nadie puede alcanzarme.',
        polnareff: 'Silver Chariot al ataque.',
        kakyoin: 'Hierophant Green.',
        mista: 'Número 4… ni de broma.',
        bucciarati: 'Arrivederci.',
        abbacchio: 'Moody Blues: rebobina.',
        narancia: 'Aerosmith, ¡fuego!',
        fugo: 'Purple Haze… cuidadito.',
        trish: 'Spice Girl no se rinde.',
        anasui: 'Te reconstruiré… a mi manera.',
        risotto: 'Metallica. Hierro puro.',
        pucci: 'Hacia el cielo.',
        weather: 'Weather Report.',
        caesar: '¡Hamon, mi orgullo!',
        rohan: 'Heaven\'s Door. Léeme esto.',
        okuyasu: '¡Ora… The Hand!',
        ff: 'Foo Fighters: colonia viva.',

        // Bleach
        ichigo: '¡Voy a protegerlos!',
        rukia: 'Dance, Sode no Shirayuki.',
        byakuya: 'La ley no se discute.',
        toshiro: '¡No me llames enano!',
        kenpachi: '¡Más! ¡MÁS!',
        yoruichi: 'Demasiado lento.',
        urahara: 'Hoho… qué interesante.',
        renji: 'Howl, Zabimaru!',
        orihime: 'Soten Kisshun… por favor.',
        aizen: 'Todo según el plan.',
        ulquiorra: 'No hay corazón. Solo vacío.',
        grimmjow: '¡Soy el rey, carajo!',
        shunsui: '¿Bailamos? Será letal.',

        // JJK
        gojo: 'Nah, I\'d win.',
        sukuna: 'Aburrido… pero comestible.',
        yuji: '¡Voy a comerse al rey!',
        megumi: 'Conmigo. Ahora.',
        nobara: '¡Clavos y estilo!',
        maki: 'Sin energía. Con filo.',
        todo: '¿Qué tipo de mujer te gusta?',
        yuta: 'Rika… ayúdame.',
        hakari: 'Jackpot, baby.',
        geto: 'Los monos sobran.',
        toji: 'El cielo me restringió. Yo no.',
        nanami: 'Hora extra. Mal pagada.',
        yuki: '¿Un golpe? ¿O dos?',
        higuruma: 'Objetivo: sentencia.',
        choso: 'Hermanos de sangre.',
        mahito: '¡El alma es maleable!',
        jogo: '¡Meteorito, idiotas!',
        uro: 'Mi territorio. Fuera.',
        ryu: 'Granate. Directo.',

        // Kimetsu
        tanjiro: '¡Protegeré a Nezuko!',
        nezuko: 'Mmm… (hermano).',
        zenitsu: '¡No quiero pelear—! ¡Agatsuma!',
        inosuke: '¡SOY EL REY DE LA MONTAÑA!',
        giyu: '…Concentración total.',
        rengoku: '¡Poned el corazón en llamas!',
        tengen: '¡Flamboyant!',
        mitsuri: '¡Os quiero a todos!',
        muichiro: '¿…quién eras?',
        obanai: 'Kaburamaru ve por mí.',
        sanemi: '¡Ven si te atreves!',
        gyomei: 'Namu Amida Butsu.',
        shinobu: 'Sonrisa. Veneno. Adiós.',
        akaza: '¡Muéstrame tu fuerza!',
        doma: '¿Compartimos? Hihi.',
        kokushibo: 'La luna no perdona.',
        daki: '¡Nii-chan! …o muere.',
        hantengu: '¡N-no me mates!',
        gyokko: 'Qué arte tan… delicioso.',
        sabito: 'No mueras. Entrena.',
        urokodaki: 'Respira. Otra vez.',

        // Chainsaw Man
        denji: 'Pan. Tetas. Chainsaw.',
        makima: 'Buen chico. Obedece.',
        power: '¡YO SOY LA MEJOR!',
        reze: '¿Un café… o un boom?',
        aki: 'Kon. Maldición. Futuro.',
        angel: 'Perdón… te quito años.',
        beam: '¡DENJI! ¡DENJI!',

        boss5050: 'Cara o cruz. Tú eliges mal.'
    },

    /** Parches explícitos: id → skillId → { cry, desc?, name? } */
    skillVoice: {
        konan: {
            paper_ocean: { cry: 'Mar de shikigami!', desc: 'El papel se vuelve marea. Tú, náufrago.' },
            paper_bomb: { cry: 'Adiós en confeti.', desc: 'Cada hoja es una despedida explosiva.' },
            paper_shield: { cry: 'No pasarás.', desc: 'Capas de papel = muro de voluntad.' }
        },
        sai: {
            ink_beast: { cry: '¡Super Bestia!', desc: 'La tinta muerde antes que las palabras.' },
            ink_birds: { cry: 'Vuelen… por el equipo.', desc: 'Pájaros de tinta · el escuadrón gana aire.' },
            super_beast: { cry: 'Pergamino: caza.', desc: 'Tres firmas. Tres dentelladas.' },
            ink_bind: { cry: 'Firmado y sellado.', desc: 'Tinta en las articulaciones · ATK ↓.' }
        },
        yamato: {
            wood_spear: { cry: 'Mokuton: lanza!', desc: 'La madera crece donde tú fallas.' }
        },
        neji: {
            air_palm: { cry: 'Hakke: aire!', desc: 'El Byakugan apunta · el aire golpea.' },
            eight_trigrams: { cry: 'Hakke Kusho!', desc: 'Palmas que cierran tenketsu.' }
        },
        minato: {
            kunai_mark: { cry: 'Marca… y salto.', desc: 'Kunai sellados · el Destello ya está detrás.' }
        },
        shanks: {
            divine_departure: { cry: 'Parte.', desc: 'Haki del conquistador en un solo corte.' },
            haki_slash: { cry: 'Sin esfuerzo.', desc: 'La espada apenas se mueve. Tú caes.' }
        },
        mihawk: {
            kokuto: { cry: 'Yoru.', desc: 'La hoja negra no necesita discurso.' },
            black_blade: { cry: 'Demasiado fácil.', desc: 'Una onda. Un horizonte partido.' }
        },
        aizen: {
            fragor: { cry: 'Fragor.', desc: 'Reiatsu que no pide permiso.' },
            muken_crush: { cry: 'Todo según el plan.', desc: 'El Hogyoku late. El mundo obedece.' }
        },
        ulquiorra: {
            bala: { cry: 'Bala.', desc: 'Rápidas. Vacías. Mortales.' },
            wing_slash: { cry: 'Alas negras.', desc: 'Cortes que no buscan gloria.' }
        },
        sasori: {
            puppet: { cry: 'Baila, muñeco.', desc: 'Hilos invisibles · carne ajena.' },
            blade_spin: { cry: 'Senbon… arte.', desc: 'Aspas. Veneno. Belleza cruel.' },
            core_guard: { cry: 'El núcleo es mío.', desc: 'Sella el corazón · el arte continúa.' }
        },
        yoruichi: {
            rai_flash: { cry: 'Flash Step!', desc: 'Antes de parpadear, ya sangras rayo.' },
            cat_claw: { cry: 'Nyaa— ¡MUERE!', desc: 'Zarpas de diosa. Sin piedad.' }
        },
        chopper: {
            guard_point: { cry: 'Guard Point!', desc: 'Bolita → muro. Ciencia de Santa.' },
            monster_sweep: { cry: 'Monster Point…!', desc: 'Cuando el doctor se enfada, el bosque tiembla.' },
            iron_bock: { cry: '¡Aguanten!', desc: 'Blindaje de equipo · Chopper no deja caer a nadie.' }
        },
        nami: {
            smoke_star: { cry: 'Mirage Tempo!', desc: 'Humo, engaño y un mapa hacia tu demencia.' }
        },
        denji: {
            poverty_punch: { cry: '¡Toma, pobre!', desc: 'Puñetazo de quien ha pasado hambre de verdad.' },
            cord_pull: { cry: '¡Tira del cordón!', desc: 'El click que lo cambia todo.' }
        },
        makima: {
            finger_gun: { cry: 'Bang.', desc: 'Un dedo. Un contrato. Un cadáver educado.' },
            citizens: { cry: 'Por el bien de todos.', desc: 'El “todos” siempre es ella.' }
        },
        power: {
            blood_spear: { cry: '¡Lanzas de la demonio!', desc: 'Sangre propia. Orgullo ajeno roto.' },
            fiend_bite: { cry: '¡Meow… de la muerte!', desc: 'Colmillos. Drama. Daño real.' }
        },
        reze: {
            cafe_smile: { cry: '¿Azúcar… o dinamita?', desc: 'Sonrisa de cafeteria. Temporizador armado.' },
            spark_kick: { cry: 'Chispazo.', desc: 'Patada corta · mecha larga.' }
        },
        aki: {
            katana_draw: { cry: '…Ahora.', desc: 'Desenvaine limpio. Sin discursos.' },
            kon: { cry: '¡Kon!', desc: 'El zorro muerde por contrato.' }
        },
        angel: {
            lifespan_touch: { cry: 'Lo siento…', desc: 'Un roce. Años menos. Disculpas de más.' },
            year_blade: { cry: 'Cinco años.', desc: 'Cada corte cuesta vida prestada.' }
        },
        beam: {
            shark_rush: { cry: '¡DENJI!', desc: 'Embiste como tiburón enamorado de un híbrido.' },
            great_white: { cry: '¡Tiburón! ¡Tiburón!', desc: 'Carnicería acuática · fan service letal.' }
        },
        tanjiro: {
            water_surface: { cry: '¡Primera Forma!', desc: 'Agua limpia · corte limpio · corazón limpio.' },
            dance_fire: { cry: '¡Hinokami!', desc: 'La danza del sol arde en la sangre.' }
        },
        rengoku: {
            unknowing_fire: { cry: '¡Poned el corazón en llamas!', desc: 'La Primera Forma sonríe mientras quema.' }
        },
        zenitsu: {
            thunder_clap: { cry: '¡No quiero—! ¡Ichi no Kata!', desc: 'Duerme. Corre. Truena. Despierta héroe.' }
        },
        inosuke: {
            fang: { cry: '¡CERDO MONTAÑÉS!', desc: 'Dos espadas. Cero educación. Mucho caos.' }
        }
    },

    /** Cut-ins icónicos extra (kanji + quote). */
    cutins: {
        denji: {
            chainsaw_man: { kanji: '電鋸', quote: '¡CHAAAAINSAW!', accent: '#e8c547' },
            endless_chainsaw: { kanji: '無限', quote: '¡SOY CHAINSAW MAN!', accent: '#c0392b' },
            arm_ripper: { kanji: '腕鋸', quote: '¡RRRAAAH!', accent: '#e74c3c' }
        },
        makima: {
            finger_gun: { kanji: '銃', quote: 'Bang.', accent: '#c0392b' },
            control_ritual: { kanji: '支配', quote: 'I am the Control Devil.', accent: '#f4d03f' },
            crush: { kanji: '圧', quote: 'Crush.', accent: '#c0392b' },
            absolute_control: { kanji: '絶対', quote: 'You belong to me.', accent: '#922b21' }
        },
        power: {
            blood_hammer: { kanji: '血槌', quote: 'BLOOD HAMMER!', accent: '#e74c3c' },
            blood_rain: { kanji: '血雨', quote: '¡DIE!', accent: '#c0392b' },
            greatest_fiend: { kanji: '最強', quote: '¡YO SOY LA MEJOR!', accent: '#5dade2' }
        },
        reze: {
            bomb_girl: { kanji: '爆弾', quote: 'BOOM.', accent: '#6c3483' },
            city_bomb: { kanji: '爆都', quote: 'Goodbye.', accent: '#58d68d' }
        },
        tanjiro: {
            hinokami: { kanji: 'ヒノカミ', quote: '¡HINOKAMI KAGURA!', accent: '#c0392b' },
            dance_fire: { kanji: '円舞', quote: '¡Hinokami!', accent: '#e74c3c' },
            setting_sun: { kanji: '斜陽', quote: '¡Setting Sun!', accent: '#f39c12' }
        },
        rengoku: {
            flame_hashira: { kanji: '炎柱', quote: '¡Umai!', accent: '#e74c3c' },
            rengoku_form: { kanji: '煉獄', quote: 'Ninth Form · RENGOKU!', accent: '#f9e79f' }
        },
        gojo: {
            hollow_purple: { kanji: '虚式', quote: 'Hollow Purple.', accent: '#9b59b6' },
            unlimited: { kanji: '無限', quote: 'Infinity.', accent: '#5dade2' }
        },
        sukuna: {
            malevolent: { kanji: '伏魔', quote: 'Malevolent Shrine.', accent: '#c0392b' },
            cleave: { kanji: '解', quote: 'Cleave.', accent: '#e74c3c' }
        },
        gai: {
            dynamic_gai: { kanji: '青春', quote: 'DYNAMIC ENTRY!', accent: '#f39c12' },
            evening_elephant: { kanji: '夜象', quote: 'Evening Elephant!', accent: '#27ae60' }
        },
        dio: {
            the_world: { kanji: '世界', quote: 'ZA WARUDO!', accent: '#f4d03f' },
            muda: { kanji: '無駄', quote: 'MUDA MUDA MUDA!', accent: '#e74c3c' }
        },
        giorno: {
            ger: { kanji: '黄金', quote: 'Golden Experience Requiem!', accent: '#f1c40f' }
        },
        deidara: {
            c1: { kanji: '芸術', quote: 'ART IS AN EXPLOSION!', accent: '#f5b041' },
            c3: { kanji: 'C3', quote: 'KATSU!', accent: '#c0392b' }
        },
        hidan: {
            jashin_rite: { kanji: '邪神', quote: 'Die for Jashin!', accent: '#922b21' },
            jashin_blood: { kanji: '呪殺', quote: 'Feel my pain!', accent: '#922b21' },
            jashin_blood_x: { kanji: '呪殺', quote: 'Share my pain!', accent: '#c0392b' }
        },
        kokushibo: {
            moon_breath: { kanji: '月の呼吸', quote: 'Upper Rank One.', accent: '#6c3483' },
            sixteen_moons: { kanji: '十六夜', quote: 'Sixteen!', accent: '#d7bde2' }
        },
        akaza: {
            compass: { kanji: '羅針', quote: 'Compass Needle!', accent: '#e74c3c' }
        }
    },

    taglineOf(id, unit) {
        if (this.taglines[id]) return this.taglines[id];
        if (unit?.roleTag) return unit.roleTag;
        if (unit?.role) return unit.role;
        return 'El destino pide sangre.';
    },

    /** Votos icónicos al despertar (cut-in de transform). Uno por personaje. */
    transformVows: {
        // One Piece
        luffy: '¡El Rey de los Piratas no conoce techo!',
        zoro: '¡Nueve espadas. Un solo rey!',
        sanji: '¡Diable… AL MÁXIMO!',
        nami: '¡El clima me obedece!',
        robin: '¡Florece, oscuridad!',
        law: '¡ROOM… quirófano abierto!',
        chopper: '¡Monster Point… no llores por mí!',
        franky: '¡SUUUUPER!',
        brook: '¡Soul King en escena!',
        usopp: '¡El valiente del mar… ATACA!',
        crocodile: '¡El desierto me corona!',
        enel: '¡El juicio divino desciende!',
        lucci: '¡Rokuogan… del leopardo!',
        doflamingo: '¡Los hilos del rey!',
        shanks: 'Acabemos la fiesta… ya.',
        mihawk: 'El filo definitivo.',
        ace: '¡Hiken… puño de fuego!',
        kidd: '¡Punk Gibson… al máximo!',
        hancock: '¡La belleza es poder absoluto!',
        killer: '¡Castigo giratorio!',
        kaido: '¡WORORO… el dragón despierta!',
        marco: '¡El fénix no muere!',
        jinbe: '¡El mar pelea conmigo!',
        katakuri: '¡El futuro… ya lo vi!',
        kizaru: '¿Velocidad? Ya te pateé.',
        marshall: '¡La oscuridad lo traga TODO!',
        // Naruto
        naruto: '¡El Kyubi ruge CONMIGO, no contra mí!',
        sasuke: 'El odio también es poder.',
        sakura: '¡Shannaro… DE VERDAD!',
        kakashi: 'Copiado. Mejorado. Desatado.',
        itachi: 'Perdóname una vez más.',
        jiraiya: '¡El sabio no se esconde más!',
        tsunade: '¡La Hokage apuesta… y gana!',
        gai: '¡LA NOCHE DE GUY!',
        lee: '¡Las puertas… ABIERTAS!',
        neji: '¡Mi destino lo escribo yo!',
        hinata: '¡Por Naruto… y por mí!',
        shikamaru: 'Qué rollo… plan maestro.',
        gaara: '¡Shukaku… DESPIERTA!',
        minato: '¡Un segundo… eterno!',
        orochimaru: '¡La eternidad me reclama!',
        zabuza: '¡La niebla ejecuta!',
        kisame: '¡Samehada… DEVORA!',
        sasori: '¡El arte eterno se revela!',
        deidara: '¡Mi obra MAESTRA!',
        hidan: '¡Jashin… TÓMAME!',
        konan: '¡Seis mil millones de rezos!',
        pain: '¡Siente… el dolor de un dios!',
        sai: 'La tinta… se vuelve real.',
        yamato: '¡Mokuton… bosque infinito!',
        tobirama: '¡El relámpago marca!',
        jugo: '¡La naturaleza me posee!',
        kakuzu: '¡Cinco corazones… un dios!',
        tobi: '¡Kamui… al completo!',
        karin: '¡Mis cadenas… protegedle!',
        madara: 'Baila conmigo bajo la luna.',
        bee: '¡El ocho colas rapea!',
        suigetsu: '¡Agua… que corta!',
        kimimaro: '¡El último baile Kaguya!',
        // JoJo
        jotaro: 'Yare yare… ahora va en serio.',
        joseph: '¡Tu próxima forma es… esta!',
        josuke: '¡Crazy Diamond… ARREGLA esto!',
        giorno: '¡Esto… es Réquiem!',
        jolyne: '¡Stone Free… LIBRE!',
        dio: '¡El mundo se detiene ante MÍ!',
        kira: '¡Killer Queen… tercera bomba!',
        diavolo: '¡El tiempo… SE BORRA!',
        polnareff: '¡Silver Chariot… sin armadura!',
        kakyoin: '¡Emerald Splash… 20 metros!',
        mista: '¡Sex Pistols… fuego a discreción!',
        bucciarati: '¡Sticky Fingers… ARI ARI!',
        abbacchio: '¡Moody Blues… rebobina el destino!',
        narancia: '¡Aerosmith… bombardeo!',
        trish: '¡Spice Girl… ablanda el mundo!',
        anasui: '¡Diver Down… por dentro!',
        risotto: '¡Metallica… en tu sangre!',
        pucci: '¡Made in Heaven… ACELERA!',
        weather: '¡Heavy Weather… CAE!',
        caesar: '¡Mi Hamon… última burbuja!',
        rohan: '¡Heaven’s Door… te reescribo!',
        okuyasu: '¡The Hand… BORRA!',
        ff: '¡Somos… FOO FIGHTERS!',
        // Bleach
        ichigo: '¡Si para protegerlos debo ser un monstruo… LO SERÉ!',
        rukia: '¡Baila… Hakka no Togame!',
        byakuya: '¡Senbonzakura… Kageyoshi!',
        toshiro: '¡Daiguren… HYORINMARU!',
        kenpachi: '¡Nozarashi… CORTA!',
        yoruichi: '¡Shunkō… diosa del trueno!',
        urahara: '¡Canta… Benihime!',
        renji: '¡Aúlla… Zabimaru rey!',
        orihime: '¡Shun Shun Rikka… protege!',
        aizen: 'Todo… según el plan.',
        ulquiorra: 'Segunda Etapa… desespera.',
        grimmjow: '¡PANTERA… el rey caza!',
        shunsui: '¡Katen Kyokotsu… juego final!',
        ginjo: '¡Tu poder… es MÍO!',
        gantenbainne: '¡Dragra… Privaron!',
        unohana: '¡La primera Kenpachi… despierta!',
        yamamoto: '¡Ryujin Jakka… 15 millones de grados!',
        senjumaru: '¡El telar… teje tu fin!',
        oetsu: '¡El filo… definitivo!',
        nelliel: '¡Lanzador Verde… declara!',
        starrk: '¡Los Lobos… aúllan!',
        // JJK
        gojo: 'Nah… es hora de ganar.',
        sukuna: 'Abre el santuario, insecto.',
        yuji: '¡Puño divergente… BLACK FLASH!',
        megumi: '¡Mahoraga… con este tesoro!',
        nobara: '¡Resonancia… MORTAL!',
        maki: '¡Sin energía… filo celestial!',
        todo: '¡Boogie Woogie… hermano!',
        yuta: '¡Rika… MANIFIÉSTATE!',
        hakari: '¡JACKPOT… una vez más!',
        geto: '¡Uzumaki… MÁXIMO!',
        toji: '¡El asesino… sin maldición!',
        nanami: '¡Hora extra… OVERTIME!',
        yuki: '¡Agujero negro… o no!',
        higuruma: '¡Sentencia… CULPABLE!',
        choso: '¡Sangre… de hermanos!',
        mahito: '¡Expansión… de MI alma!',
        jogo: '¡Meteoro… MÁXIMO!',
        uro: '¡Mi cielo… nadie entra!',
        ryu: '¡Granate… a bocajarro!',
        meimei: '¡Cuervos… a por él!',
        kashimo: '¡Bestia ámbar… MÍTICA!',
        // Kimetsu
        tanjiro: '¡Hinokami… Kagura eterna!',
        nezuko: '¡Hermano… arde conmigo!',
        zenitsu: '¡Dormido… aun así trueno!',
        inosuke: '¡El rey de la montaña… EMBISTE!',
        giyu: '¡Calma… NAGI!',
        rengoku: '¡El corazón… EN LLAMAS!',
        tengen: '¡Dios del festival… BRILLA!',
        sanemi: '¡Viento… que corta demonios!',
        mitsuri: '¡Amor… que destroza!',
        muichiro: '¡Niebla… sin forma!',
        obanai: '¡Serpiente… MUERDE!',
        shinobu: '¡Mariposa… veneno final!',
        genya: '¡Demonio… DEVORADO!',
        sabito: '¡El zorro… muerde!',
        urokodaki: '¡Agua… lección final!',
        gyomei: '¡Piedra… reza conmigo!',
        akaza: '¡Brújula… DESTRUCCIÓN!',
        doma: '¡Loto… congelado!',
        kokushibo: '¡Luna superior uno… menguante!',
        muzan: '¡El progenitor… MUTA!',
        hantengu: '¡Emociones… DESATADAS!',
        gyokko: '¡Vasija… obra maestra!',
        kanao: '¡Flor… danza final!',
        kaigaku: '¡Trueno… oscuro!',
        yourichi: '¡Respiración solar… origen!',
        daki: '¡Cintas… que devoran!',
        // Chainsaw
        denji: '¡CHAAAAINSAW!',
        makima: '¡Obedece… Control!',
        aki: '¡Zorro… DEVORA!',
        angel: '¡Alas… que roban años!',
        katana: '¡Híbrido… desenfunda!',
        kishibe: '¡Veterano… caza!',
        kobeni: '¡PÁNICO… superviviente!',
        power: '¡YO… LA MEJOR DEMONIO!',
        asa: '¡Yoru… arma de guerra!',
        beam: '¡Tiburón… DENJI!',
        reze: '¡Bomba… TE QUIERO!',
        quanxi: '¡Ballesta… primera cazadora!',
        himeno: '¡Fantasma… dame todo!',
        // Persona 5 Royal
        ren: '¡Arsène… préstame tu rebelión!',
        goro: '¡Crow… justiciero oscuro!',
        sumire: '¡Violet… SALTA!',
        ann: '¡Panther… QUEMA!',
        makoto: '¡Johanna… a toda máquina!',
        tae: '¡Doctora… dosis letal!',
        futaba: '¡Oracle… hackeo total!',
        yusuke: '¡Goemon… IMPACTO!',
        haru: '¡Milady… belleza letal!',
        ryuji: '¡Skull… A TOPE!',
        // Metaphor
        louis: '¡Arrodíllate… ante la utopía!',
        gallica: '¡Guía… viento a favor!',
        eupha: '¡Invocación… REAL!',
        strohl: '¡Guerrero… REAL!',
        heismay: '¡Ladrón… REAL!',
        junah: '¡Mascarada… REAL!',
        basilio: '¡Berserker… BESTIA!',
        hualkenberg: '¡Juramento… inquebrantable!',
        // Boss final
        eren: '¡Si no peleas, no ganas. TATAKAE!',
        griffith: 'Mi sueño exige alas.',
        mob: '…100%. Lo siento.',
        // Varios
        inumaki: '¡Salmón… maldito!',
        mayuri: '¡Banco… de pruebas!',
        raikage: '¡Relámpago… del Raikage!'
    },

    /** Votos genéricos de aliado al despertar. */
    transformVowPool: [
        '¡Contempla mi verdadera forma!',
        '¡El destino se reescribe… AHORA!',
        '¡Esto es lo que soy de verdad!',
        '¡Más allá del límite!',
        '¡Despierta… poder dormido!',
        '¡Que tiemble el campo!'
    ],

    /** Burlas genéricas de enemigo al fasear. */
    transformTauntPool: [
        '¡Mírame ahora, insecto!',
        '¿Creías que había terminado?',
        'Mi verdadero poder… ¡liberado!',
        'Interesante… pero inútil.',
        '¡Arrodíllate ante mi forma final!',
        'Jajaja… GRACIAS por calentarme.'
    ],

    /** Gritos épicos por técnica (cut-ins de ataque). {skill} = nombre de la técnica. */
    skillShouts: {
        finisher: ['¡ESTO SE ACABA… {skill}!', '¡Mi obra maestra… {skill}!', '¡Adiós… {skill}!'],
        nuke: ['¡Desaparece… {skill}!', '¡Todo o nada… {skill}!', '¡Esta es mi respuesta… {skill}!'],
        aoe: ['¡Que tiemble el campo… {skill}!', '¡A TODOS… {skill}!', '¡Sin escondites… {skill}!'],
        barrage: ['¡Una… tras otra… {skill}!', '¡No pares… {skill}!', '¡Lluvia… {skill}!'],
        blade: ['¡Corta… {skill}!', '¡Un solo filo… {skill}!', '¡Ni el acero aguanta… {skill}!'],
        buff: ['¡Ahora… {skill}!', '¡Sube el ritmo… {skill}!', '¡Por los míos… {skill}!'],
        debuff: ['¡Rómpete… {skill}!', '¡Al suelo… {skill}!', '¡Tu fin empieza… {skill}!'],
        heal: ['¡Aguanta… {skill}!', '¡Aún no… {skill}!', '¡Levanta… {skill}!'],
        hex: ['¡Tu mente es mía… {skill}!', '¡Pesadilla… {skill}!', '¡Ríndete… {skill}!'],
        strike: ['¡Toma esto!', '¡Directo!', '¡Sin piedad!']
    },

    /** Diálogo Persona de la técnica: { setup, shout }. Determinista por skill. */
    skillDialogue(unit, sk) {
        if (!sk) return null;
        if (sk.transform || sk.advanceTransform) {
            const d = this.transformDialogue(unit, sk);
            return { setup: d.vow, shout: d.cry };
        }
        const power = sk.power || 0;
        let kind = 'strike';
        if (sk.once && power >= 150) kind = 'finisher';
        else if (power >= 185) kind = 'nuke';
        else if (sk.heal) kind = 'heal';
        else if (sk.buff || sk.partyBuff || sk.allyBuff || sk.charge || sk.cover) kind = 'buff';
        else if (sk.debuff || sk.stun || sk.dot) kind = 'debuff';
        else if (sk.type === 'curse' || sk.type === 'psy') kind = 'hex';
        else if (sk.aoe) kind = 'aoe';
        else if ((sk.hits || 1) >= 4) kind = 'barrage';
        else if (['slash', 'pierce', 'gun'].includes(sk.type)) kind = 'blade';
        const pool = this.skillShouts[kind] || this.skillShouts.strike;
        let h = 0;
        for (const c of String(sk.id || sk.name || '?')) h = (h * 31 + c.charCodeAt(0)) >>> 0;
        const setup = pool[h % pool.length].replace('{skill}', sk.name || 'técnica');
        let shout = (sk.cry && !this.WEAK_CRIES.has(sk.cry)) ? sk.cry : null;
        if (!shout) shout = `${sk.name || 'Técnica'}!`;
        return { setup, shout };
    },

    /** Gritos épicos por técnica (cut-ins de ataque). {skill} = nombre de la técnica. */
    skillShouts: {
        finisher: ['¡ESTO SE ACABA… {skill}!', '¡Mi obra maestra… {skill}!', '¡Adiós… {skill}!'],
        nuke: ['¡Desaparece… {skill}!', '¡Todo o nada… {skill}!', '¡Esta es mi respuesta… {skill}!'],
        aoe: ['¡Que tiemble el campo… {skill}!', '¡A TODOS… {skill}!', '¡Sin escondites… {skill}!'],
        barrage: ['¡Una… tras otra… {skill}!', '¡No pares… {skill}!', '¡Lluvia… {skill}!'],
        blade: ['¡Corta… {skill}!', '¡Un solo filo… {skill}!', '¡Ni el acero aguanta… {skill}!'],
        buff: ['¡Ahora… {skill}!', '¡Sube el ritmo… {skill}!', '¡Por los míos… {skill}!'],
        debuff: ['¡Rómpete… {skill}!', '¡Al suelo… {skill}!', '¡Tu fin empieza… {skill}!'],
        heal: ['¡Aguanta… {skill}!', '¡Aún no… {skill}!', '¡Levanta… {skill}!'],
        hex: ['¡Tu mente es mía… {skill}!', '¡Pesadilla… {skill}!', '¡Ríndete… {skill}!'],
        strike: ['¡Toma esto!', '¡Directo!', '¡Sin piedad!']
    },

    /** Diálogo Persona de la técnica: { setup, shout }. Determinista por skill. */
    skillDialogue(unit, sk) {
        if (!sk) return null;
        if (sk.transform || sk.advanceTransform) {
            const d = this.transformDialogue(unit, sk);
            return { setup: d.vow, shout: d.cry };
        }
        const power = sk.power || 0;
        let kind = 'strike';
        if (sk.once && power >= 150) kind = 'finisher';
        else if (power >= 185) kind = 'nuke';
        else if (sk.heal) kind = 'heal';
        else if (sk.buff || sk.partyBuff || sk.allyBuff || sk.charge || sk.cover) kind = 'buff';
        else if (sk.debuff || sk.stun || sk.dot) kind = 'debuff';
        else if (sk.type === 'curse' || sk.type === 'psy') kind = 'hex';
        else if (sk.aoe) kind = 'aoe';
        else if ((sk.hits || 1) >= 4) kind = 'barrage';
        else if (['slash', 'pierce', 'gun'].includes(sk.type)) kind = 'blade';
        const pool = this.skillShouts[kind] || this.skillShouts.strike;
        let h = 0;
        for (const c of String(sk.id || sk.name || '?')) h = (h * 31 + c.charCodeAt(0)) >>> 0;
        const setup = pool[h % pool.length].replace('{skill}', sk.name || 'técnica');
        let shout = (sk.cry && !this.WEAK_CRIES.has(sk.cry)) ? sk.cry : null;
        if (!shout) shout = `${sk.name || 'Técnica'}!`;
        return { setup, shout };
    },

    /** Diálogo Persona del despertar: { vow, cry }. Determinista por personaje. */
    transformDialogue(unit, sk) {
        const id = unit?.id || '';
        const foe = unit?.side === 'enemy';
        let vow = this.transformVows[id];
        if (!vow) {
            const pool = foe ? this.transformTauntPool : this.transformVowPool;
            let h = 0;
            for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
            vow = pool[h % pool.length];
        }
        let cry = (sk?.cry && !this.WEAK_CRIES.has(sk.cry)) ? sk.cry : null;
        if (!cry) cry = `${unit?.transformName || sk?.transformName || sk?.name || 'DESPIERTA'}!`;
        return { vow, cry };
    },

    /** Mejora gritos genéricos con voz del kit. */
    spiceCry(unit, sk) {
        if (!sk) return '';
        const patch = this.skillVoice[unit?.id]?.[sk.id];
        if (patch?.cry) return patch.cry;
        if (sk.cry && !this.WEAK_CRIES.has(sk.cry)) return sk.cry;
        const tag = unit?.roleTag || unit?.name || 'Destino';
        if (sk.transform) return `${sk.transformName || sk.name || 'TRANSFORM'}!`;
        if (sk.heal && !sk.power) return `${tag}: aguanta.`;
        if (sk.buff || sk.partyBuff) return `${tag}: ahora.`;
        if (sk.debuff || sk.stun) return `${tag}: rómpete.`;
        if (sk.aoe) return `${(sk.name || 'Técnica').toUpperCase()}!`;
        if ((sk.power || 0) >= 160) return `${(sk.name || 'FINISHER').toUpperCase()}!`;
        if (sk.name) return `${sk.name}!`;
        return `${tag}!`;
    },

    spiceDesc(unit, sk) {
        const patch = this.skillVoice[unit?.id]?.[sk.id];
        if (patch?.desc) return patch.desc;
        const d = sk.desc || '';
        if (d.length >= 16 && !/^(Ataque|Golpe|Técnica|Buff|Debuff|Cura)/i.test(d)) return d;
        const bits = [];
        if (sk.transform) bits.push('Despierta su forma definitiva');
        else if (sk.aoe) bits.push('Barre el campo con estilo propio');
        else if (sk.hits > 1) bits.push(`${sk.hits} golpes · sello personal`);
        else if (sk.heal) bits.push('Se niega a caer');
        else if (sk.buff || sk.partyBuff) bits.push('Cambia el ritmo del combate');
        else if (sk.debuff) bits.push('Rompe la postura enemiga');
        else if (sk.name) bits.push(sk.name);
        else bits.push('Técnica con carácter');
        if (unit?.roleTag) bits.push(`· ${unit.roleTag}`);
        return bits.join(' ');
    },

    patchUnit(unit) {
        if (!unit?.id) return unit;
        unit.tagline = this.taglineOf(unit.id, unit);
        const patchSkills = (list) => {
            if (!Array.isArray(list)) return;
            list.forEach((sk) => {
                if (!sk || typeof sk !== 'object') return;
                const p = this.skillVoice[unit.id]?.[sk.id];
                if (p?.name) sk.name = p.name;
                if (p?.cry || this.WEAK_CRIES.has(sk.cry) || !sk.cry) {
                    sk.cry = this.spiceCry(unit, sk);
                }
                if (p?.desc || !sk.desc || sk.desc.length < 12) {
                    sk.desc = this.spiceDesc(unit, { ...sk, desc: sk.desc });
                }
            });
        };
        patchSkills(unit.skills);
        patchSkills(unit.transformedSkills);
        return unit;
    },

    apply() {
        if (typeof BattleData === 'undefined') return;
        (BattleData.party || []).forEach((p) => this.patchUnit(p));
        // Enemies in encounters (thin templates)
        Object.values(BattleData.encounters || {}).forEach((enc) => {
            (enc.enemies || []).forEach((e) => {
                if (!e.tagline) e.tagline = this.taglineOf(e.id, e);
            });
        });
    },

    /** Líneas de apertura al entrar en combate. */
    battleOpenLines(state) {
        const lines = [];
        const lead = (state?.party || []).find((p) => p.hp > 0) || state?.party?.[0];
        if (lead) {
            lines.push(`${lead.name}: “${this.taglineOf(lead.id, lead)}”`);
        }
        const foe = (state?.enemies || []).find((e) => e.hp > 0);
        if (foe) {
            const t = this.taglineOf(foe.id, foe);
            lines.push(`${foe.name}: “${t}”`);
        }
        return lines;
    }
};

(function bootBattleFlavor() {
    BattleFlavor.apply();
    if (typeof CharacterRegistry !== 'undefined' && CharacterRegistry.rebuild) {
        try { CharacterRegistry.rebuild(); } catch (_) { /* ignore */ }
    }
    if (typeof window !== 'undefined') {
        window.BattleFlavor = BattleFlavor;
        setTimeout(() => {
            BattleFlavor.apply();
            try { CharacterRegistry?.rebuild?.(); } catch (_) { /* ignore */ }
        }, 0);
    }
})();
