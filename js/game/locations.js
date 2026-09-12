/**
 * Hub locations — Konoha-flavored Destiny village
 */
const Locations = {
    list: [
        {
            id: 'ramen',
            name: 'Ichiraku del Destino',
            tag: 'RAMEN',
            blurb: 'El aroma a caldo y secretos. Aquí la gente habla de más.',
            unlockDay: 1,
            explore: [
                { minDay: 1, text: 'Te sientas en el mostrador. El dueño te sirve un bol humeante y murmura: “Los grandes destinos siempre empiezan con hambre.”' },
                { minDay: 3, text: 'Un cliente misterioso deja caer un papel: “Entrenad. El bosque no perdona.”' },
                { minDay: 7, text: 'Sakura pasa por aquí. Os miráis. Ella finge que no, tú también. El ramen está demasiado bueno para mentir.' },
                { minDay: 11, text: 'Hablan de una Torre que no debería existir. Alguien dice tu nombre… “Chikitriskis”… y se callan.' },
                { minDay: 15, text: 'Última noche casi. El caldo sabe a despedida y a promesa. Guardas el calor en el pecho.' }
            ]
        },
        {
            id: 'academy',
            name: 'Academia Phantom',
            tag: 'ACADEMIA',
            blurb: 'Pizarras torcidas, reglas rotas, y un mapa del Destino marcado en rojo.',
            unlockDay: 1,
            explore: [
                { minDay: 1, text: 'En la pizarra: “Explotad debilidades. 1 MORE. No seáis cobardes.” Firmado: ???' },
                { minDay: 4, text: 'Encuentras apuntes de Sasuke. Solo dice: “No falles.” Subrayado tres veces.' },
                { minDay: 8, text: 'Una clase improvisada de All-Out Attack. Alguien grita “¡VAMOS!” y el cristal tiembla.' },
                { minDay: 12, text: 'El mapa de la Torre se completa solo. Como si el Destino tuviera prisa.' }
            ]
        },
        {
            id: 'training',
            name: 'Campo de Entrenamiento',
            tag: 'ENTRENO',
            blurb: 'Sudor, polvo y números que suben. Aquí se gana el derecho a pelear.',
            unlockDay: 1,
            explore: [
                { minDay: 1, text: 'Posts de madera. Naruto ya ha roto dos. Te invita a “solo un ratito” (mentira).' },
                { minDay: 5, text: 'Jotaro observa en silencio. “Yare yare… otra vez.” Aun así, te corrige la guardia.' },
                { minDay: 10, text: 'Ichigo corta el aire. Getsuga de práctica. El campo queda marcado. Tú también.' }
            ]
        },
        {
            id: 'wave',
            name: 'País de las Olas',
            tag: 'NIEBLA',
            blurb: 'Puente, niebla y cuchillas. Aquí empieza la leyenda de verdad.',
            unlockDay: 3,
            explore: [
                { minDay: 3, text: 'La niebla muerde la piel. En el puente alguien susurra: “Zabuza…”' },
                { minDay: 6, text: 'El puente está más quieto. Aún huele a acero mojado.' }
            ]
        },
        {
            id: 'suna',
            name: 'Sunagakure · Arena',
            tag: 'ARENA',
            blurb: 'Arena, estadio y miradas que pesan como sacos de arena.',
            unlockDay: 6,
            explore: [
                { minDay: 6, text: 'El estadio ruge aunque esté vacío. Gaara te observa desde la sombra.' },
                { minDay: 10, text: 'Temari abanica el aire. “Si caes aquí, el desierto no te devuelve.”' },
                { minDay: 14, text: 'La Arena recuerda tu nombre. Eso… casi es un cumplido.' }
            ]
        },
        {
            id: 'forest',
            name: 'Bosque de la Niebla Roja',
            tag: 'BOSQUE',
            blurb: 'Niebla, hojas y enemigos que huelen a historia.',
            unlockDay: 4,
            explore: [
                { minDay: 4, text: 'La niebla baja. Oyes una hoja cortando aire. No estás sola.' },
                { minDay: 9, text: 'Marcas de Akatsuki en un tronco. Nubes rojas. El pecho se te aprieta.' },
                { minDay: 13, text: 'Una estatua rota susurra: “El RNG no es justo. Aprende a pegar.”' }
            ]
        },
        {
            id: 'tower',
            name: 'Torre del 50/50',
            tag: 'TORRE',
            blurb: 'El final se asoma. Aquí el Destino juega a cara o cruz… y hace trampas.',
            unlockDay: 8,
            explore: [
                { minDay: 8, text: 'La torre parpadea como un banner de gacha maldito. Subes un piso. Solo uno.' },
                { minDay: 14, text: 'En la cima hay un trono vacío con una etiqueta: “LIMITED.” Alguien se ríe fuera de cámara.' },
                { minDay: 16, text: 'Hoy. Ahora. El aire sabe a metáfora y a regalo.' }
            ]
        }
    ],

    get(id) {
        return this.list.find(l => l.id === id);
    },

    available() {
        const day = Calendar.getDay();
        const unlocked = GameState.get('locationsUnlocked') || [];
        return this.list.filter(l => unlocked.includes(l.id) || day >= l.unlockDay);
    },

    exploreText(id) {
        const loc = this.get(id);
        if (!loc) return '…';
        const day = Calendar.getDay();
        const options = loc.explore.filter(e => day >= e.minDay);
        const pick = options[options.length - 1] || loc.explore[0];
        return pick.text;
    }
};
