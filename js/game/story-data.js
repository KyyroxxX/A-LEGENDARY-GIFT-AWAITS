/**
 * Story beats, prologue, and mission definitions
 */
const StoryData = {
    prologue: [
        { speaker: 'Sistema', text: 'OPERATION CHIKITRISKIS — ARENA PHANTOM DESTINY.' },
        { speaker: 'Narrador', text: 'Combates estilo Persona: elige 3, debilidades, transforms, All-Out.' },
        { speaker: 'Narrador', text: 'Cada victoria te da invocaciones. Esas tiradas son tu camino al banner.' },
        { speaker: 'Sistema', text: 'Derrota a THE 50/50 → abre el Convenio → tira hasta el legendario. El regalo sale del gacha.' }
    ],

    dayIntros: {
        1: 'Primer día. Ramen, entrenamiento… y un equipo incompleto.',
        2: 'El pueblo te mira raro. Bien: significa que importas.',
        3: 'ALERTA: misión de historia. La niebla no perdona.',
        4: 'El bosque se abre. Nuevas rutas. Nuevos golpes.',
        5: 'Los lazos pesan más que el oro. (Nami discrepa.)',
        6: 'Nubes rojas en el horizonte. Algo se acerca a la arena.',
        7: 'Respiro. Entrena. Habla. No te duermas en los laureles.',
        8: 'La Torre parpadea. Limited banners no existen… o sí.',
        9: 'La serpiente silba. Rumbo a la sede. Sai y Yamato listos.',
        10: 'Mitad del camino. Tus stats cuentan. Tus lazos también.',
        11: 'El pueblo susurra tu apodo: Chikitriskis.',
        12: 'Alianza oscura. JoJo + Bleach + pesadillas.',
        13: 'Casi. El Destino aprieta. No mires más allá del puente.',
        14: 'Preparativos. Sin spoilers. Solo acero y confianza.',
        15: 'Víspera. Come ramen. Abraza lazos. Prepara el alma.',
        16: 'DÍA FINAL. THE 50/50. Sin piedad. Con ingenio.'
    },

    /**
     * Missions keyed by gate id or free mission ids
     */
    missions: {
        training: {
            id: 'training',
            title: 'TRAINING · Muñeco',
            blurb: 'Prueba ataques, técnicas y voces. Sin recompensa · el muñeco no contraataca.',
            encounter: 'training',
            optional: true,
            flagClear: 'training_cleared',
            rewardText: 'Sandbox — 0 invocaciones.'
        },
        gate_zabuza: {
            id: 'gate_zabuza',
            title: 'Niebla · Zabuza',
            sealedTitle: '✦ NIEBLA · ???',
            sealedBlurb: 'Una hoja corta la bruma… pero el nombre no llega.',
            blurb: 'El bosque escupe un espadachín. Debilidades o muerte.',
            encounter: 'story_zabuza',
            flagClear: 'gate_zabuza_cleared',
            rewardText: 'La niebla se abre. +INV.',
        },
        gate_akatsuki: {
            id: 'gate_akatsuki',
            title: 'Nubes Rojas · Sasori & Deidara',
            sealedTitle: '✦ NUBES ROJAS · ???',
            sealedBlurb: 'Nubes carmesí. Arte y explosión sin firma.',
            blurb: 'Arte. Marionetas. Explosiones. Stalemate vibes.',
            encounter: 'story_akatsuki',
            flagClear: 'gate_akatsuki_cleared',
            rewardText: 'Las nubes se retiran… por ahora.',
        },
        gate_orochimaru: {
            id: 'gate_orochimaru',
            title: 'Serpiente · Sede de Orochimaru',
            sealedTitle: '✦ SERPIENTE · ???',
            sealedBlurb: 'Un silbido bajo tierra. El archivo muerde.',
            blurb: 'La serpiente espera. Debilidades, cura y cero piedad.',
            encounter: 'story_orochimaru',
            flagClear: 'gate_orochimaru_cleared',
            rewardText: 'Salís vivos. El resto… otro día.',
        },
        gate_alliance: {
            id: 'gate_alliance',
            title: 'Alianza Maldita · DIO & Kira',
            sealedTitle: '✦ ALIANZA MALDITA · ???',
            sealedBlurb: 'Dos relojes rotos. El tiempo se niega a decir quién.',
            blurb: 'Za Warudo encuentra Killer Queen. Peor crossover posible.',
            encounter: 'story_alliance',
            flagClear: 'gate_alliance_cleared',
            rewardText: 'El tiempo vuelve a correr. A favor tuyo.',
        },
        gate_aizen: {
            id: 'gate_aizen',
            title: 'Ilusión · Aizen',
            sealedTitle: '✦ ILUSIÓN · ???',
            sealedBlurb: 'Todo lo que ves es falso… incluido el nombre.',
            blurb: 'Todo es mentira excepto tu daño. Analiza. No confíes.',
            encounter: 'story_aizen',
            flagClear: 'gate_aizen_cleared',
            rewardText: 'La ilusión se rompe. +14 tiradas Metaphor (rojas).',
        },
        gate_final: {
            id: 'gate_final',
            title: 'THE 50/50',
            sealedTitle: '✦ THE 50/50 · SELLADO',
            sealedBlurb: 'Necesitas a Gojo… o romper todos los sellos previos.',
            blurb: 'Se desbloquea al sacar a Gojo (#50). Victoria = +10 tiradas rojas (hard pity Metaphor).',
            encounter: 'boss',
            flagClear: 'gate_final_cleared',
            isFinal: true,
            rewardText: '+10 tiradas Metaphor. Completas el banco de 80. El juego sale del banner.',
        },
        gate_jjk_1: {
            id: 'gate_jjk_1', title: 'Jujutsu · Escuela', sealedTitle: '✦ JUJUTSU · ESCUELA ???', sealedBlurb: 'Una maldición sin rostro aún.',
            blurb: 'Mahito. +2 INV primer clear.',
            encounter: 'story_jjk_intro', optional: true, flagClear: 'gate_jjk1_cleared', rewardText: '+2 INV'
        },
        gate_jjk_2: {
            id: 'gate_jjk_2', title: 'Jujutsu · Geto', sealedTitle: '✦ JUJUTSU · NOCHE ???', sealedBlurb: 'Demonios sin nombre en la lista.',
            blurb: 'Noche de demonios. +2 INV.',
            encounter: 'story_jjk_geto', optional: true, flagClear: 'gate_jjk2_cleared', rewardText: '+2 INV'
        },
        gate_jjk_3: {
            id: 'gate_jjk_3', title: 'Jujutsu · Jogo', sealedTitle: '✦ JUJUTSU · BRASA ???', sealedBlurb: 'Calor sin origen. No mires el sello.',
            blurb: 'Fuego maldito. +2 INV.',
            encounter: 'story_jjk_jogo', optional: true, flagClear: 'gate_jjk3_cleared', rewardText: '+2 INV'
        },
        gate_jjk_4: {
            id: 'gate_jjk_4', title: 'Jujutsu · Sukuna', sealedTitle: '✦ JUJUTSU · REY ???', sealedBlurb: 'El trono está vacío… o fingiendo.',
            blurb: 'El Rey de las Maldiciones. Cierre JJK · +14 tiradas Metaphor.',
            encounter: 'story_jjk_sukuna', optional: true, flagClear: 'gate_jjk4_cleared', rewardText: '+14 tiradas Metaphor (rojas).'
        },
        free_patrol: {
            id: 'free_patrol',
            title: 'Patrulla del pueblo',
            blurb: 'Enemigos menores. Bueno para practicar debilidades.',
            encounter: 'free_1',
            optional: true,
            flagClear: 'free_1_cleared',
            rewardText: 'Patrulla limpia. +1 invocación (primer clear).'
        },
        free_forest: {
            id: 'free_forest',
            title: 'Incursión al bosque',
            blurb: 'Más difícil. Mejor botín de entrenamiento.',
            encounter: 'free_2',
            optional: true,
            flagClear: 'free_2_cleared',
            rewardText: 'El bosque te respeta un poco más.',
        },
        free_tower: {
            id: 'free_tower',
            title: 'Piso de prueba · Torre',
            blurb: 'Ensayo general antes del final.',
            encounter: 'free_3',
            optional: true,
            flagClear: 'free_3_cleared',
            rewardText: 'La Torre anota tu nombre en rojo.',
        },
        free_mist: {
            id: 'free_mist', title: 'Práctica · Niebla Solo', sealedTitle: '✦ PRÁCTICA · NIEBLA ???', sealedBlurb: 'Espada sin dueño en la lista.',
            blurb: 'Zabuza. Fuego / rayo.',
            encounter: 'free_4', optional: true, flagClear: 'free_4_cleared', rewardText: '+INV (primer clear).'
        },
        free_god: {
            id: 'free_god', title: 'Práctica · Dios del Trueno', sealedTitle: '✦ PRÁCTICA · TRUENO ???', sealedBlurb: 'Estática en el nombre.',
            blurb: 'Enel. Golpea con STRIKE.',
            encounter: 'free_5', optional: true, flagClear: 'free_5_cleared', rewardText: '+INV (primer clear).'
        },
        free_puppet: {
            id: 'free_puppet', title: 'Práctica · Arte Rojo', sealedTitle: '✦ PRÁCTICA · ARTE ???', sealedBlurb: 'Hilos. Nadie firma el arte.',
            blurb: 'Sasori. Fuego / golpe.',
            encounter: 'free_6', optional: true, flagClear: 'free_6_cleared', rewardText: '+INV (primer clear).'
        },
        free_clay: {
            id: 'free_clay', title: 'Práctica · Explosión', sealedTitle: '✦ PRÁCTICA · ARCILLA ???', sealedBlurb: 'Un boom sin autor.',
            blurb: 'Deidara. Rayo / corte.',
            encounter: 'free_7', optional: true, flagClear: 'free_7_cleared', rewardText: '+INV (primer clear).'
        },
        free_panther: {
            id: 'free_panther', title: 'Práctica · Pantera', sealedTitle: '✦ PRÁCTICA · PANTERA ???', sealedBlurb: 'Garras en la niebla.',
            blurb: 'Grimmjow. Rayo / bendición.',
            encounter: 'free_8', optional: true, flagClear: 'free_8_cleared', rewardText: '+INV (primer clear).'
        },
        free_espada: {
            id: 'free_espada', title: 'Práctica · Cuarta Espada', sealedTitle: '✦ PRÁCTICA · ESPADA ???', sealedBlurb: 'Alas negras. Sin número legible.',
            blurb: 'Ulquiorra. Fuego / golpe.',
            encounter: 'free_9', optional: true, flagClear: 'free_9_cleared', rewardText: '+INV (primer clear).'
        },
        free_kira: {
            id: 'free_kira', title: 'Práctica · Killer Queen', sealedTitle: '✦ PRÁCTICA · REINA ???', sealedBlurb: 'Un click. El nombre se borra.',
            blurb: 'Kira. Bendición / viento.',
            encounter: 'free_10', optional: true, flagClear: 'free_10_cleared', rewardText: '+INV (primer clear).'
        },
        free_crimson: {
            id: 'free_crimson', title: 'Práctica · King Crimson', sealedTitle: '✦ PRÁCTICA · CARMESÍ ???', sealedBlurb: 'El tiempo salta el apellido.',
            blurb: 'Diavolo. Bendición / rayo.',
            encounter: 'free_11', optional: true, flagClear: 'free_11_cleared', rewardText: '+INV (primer clear).'
        },
        free_world: {
            id: 'free_world', title: 'Práctica · The World', sealedTitle: '✦ PRÁCTICA · EL MUNDO ???', sealedBlurb: 'Za… ¿quién?',
            blurb: 'DIO solo. Bendición / viento.',
            encounter: 'free_12', optional: true, flagClear: 'free_12_cleared', rewardText: '+INV (primer clear).'
        },
        free_doflamingo: {
            id: 'free_doflamingo', title: 'Práctica · Heavenly Demon', sealedTitle: '✦ PRÁCTICA · DEMONIO ???', sealedBlurb: 'Hilos rosados. Firma ilegible.',
            blurb: 'Doflamingo. Cierre práctica · +14 tiradas Metaphor.',
            encounter: 'free_doflamingo', optional: true, flagClear: 'free_doflamingo_cleared', rewardText: '+14 tiradas Metaphor (rojas) · +INV primer clear.'
        },
        side_mist: {
            id: 'side_mist', title: 'Extra · Niebla Gemela', sealedTitle: '✦ EXTRA · NIEBLA ???', sealedBlurb: 'Dos sombras. Cero nombres.',
            blurb: 'Dos amenazas. AoE ayuda.',
            encounter: 'side_mist_duo', optional: true, flagClear: 'side_mist_cleared', rewardText: '+INV (primer clear).'
        },
        side_clay: {
            id: 'side_clay', title: 'Extra · Arcilla & Arena', sealedTitle: '✦ EXTRA · DESIERTO ???', sealedBlurb: 'Arena y polvo. Firma ilegible.',
            blurb: 'Deidara + Crocodile.',
            encounter: 'side_clay_sand', optional: true, flagClear: 'side_clay_cleared', rewardText: '+INV (primer clear).'
        },
        side_espada: {
            id: 'side_espada', title: 'Extra · Espada & Stand', sealedTitle: '✦ EXTRA · CRUCE ???', sealedBlurb: 'Dos mundos. Un sello.',
            blurb: 'Ulquiorra + Diavolo.',
            encounter: 'side_espada_stand', optional: true, flagClear: 'side_espada_cleared', rewardText: '+INV (primer clear).'
        },
        side_akatsuki: {
            id: 'side_akatsuki', title: 'Extra · Trio Akatsuki', sealedTitle: '✦ EXTRA · TRÍO ???', sealedBlurb: 'Tres nubes. Ningún rostro.',
            blurb: 'Tres frentes. Cierre extras · +14 tiradas Metaphor.',
            encounter: 'side_akatsuki_trio', optional: true, flagClear: 'side_akatsuki_cleared', rewardText: '+14 tiradas Metaphor (rojas).'
        }
    },

    currentGateMission() {
        const gid = Calendar.gateId();
        if (!gid || Calendar.gateCleared()) return null;
        return this.missions[gid] || null;
    },

    freeMissions() {
        const day = Calendar.getDay();
        return Object.values(this.missions).filter(m =>
            m.optional && (!m.minDay || day >= m.minDay)
        );
    },

    /**
     * Minimum bond requirement before final day clear can proceed to key.
     */
    bondRequirementMet() {
        // Need at least one bond at 3+ OR chiki at 3+
        const bonds = GameState.get('bonds') || {};
        return Object.values(bonds).some(v => v >= 3) || (bonds.chiki || 0) >= 3;
    }
};
