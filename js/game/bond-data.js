/**
 * Social Links (Lazos) — Persona-style bond scenes
 */
const BondData = {
    characters: [
        {
            id: 'sakura',
            name: 'Sakura Haruno',
            role: 'Curandera / Fuerza',
            color: '#e91e63',
            img: 'assets/characters/sakura.webp',
            unlockDay: 1,
            passiveAt: 3,
            passive: { healBonus: 0.15, label: 'Palm Mystique · curas +15%' },
            ranks: [
                {
                    rank: 1,
                    title: 'Primer vendaje',
                    lines: [
                        { speaker: 'Sakura', text: 'Oye, Naruto. No te vayas a morir en el primer combate, ¿vale?' },
                        { speaker: 'Naruto', text: '¡Intentaré no darle el gusto al Destino!' },
                        { speaker: 'Sakura', text: 'Bien. Si sangras, grita. Si no sangras… grita igual, por si acaso.' }
                    ],
                    choices: [
                        { text: 'Confío en ti para curarme.', bond: 1 },
                        { text: 'Prefiero no sangrar.', bond: 1 },
                        { text: 'SHANNARO y a pelear.', bond: 1 }
                    ]
                },
                {
                    rank: 2,
                    title: 'Fuerza escondida',
                    lines: [
                        { speaker: 'Sakura', text: 'La gente me ve “solo sanadora”. Les voy a romper esa idea… con cariño.' },
                        { speaker: 'Sakura', text: 'Tú… ¿me ves como aliada o como recarga de HP?' }
                    ],
                    choices: [
                        { text: 'Aliada. Y un poco aterradora.', bond: 1 },
                        { text: 'Las dos cosas. Honestidad.', bond: 1 },
                        { text: 'Eres el corazón del equipo.', bond: 1 }
                    ]
                },
                {
                    rank: 3,
                    title: 'Promesa médica',
                    lines: [
                        { speaker: 'Sakura', text: 'Si caes, te levanto. Si te rindes… te pego antes que el enemigo.' },
                        { speaker: 'Sakura', text: 'Eso es un lazo, ¿no? Al estilo Persona. Rojo y dramático.' }
                    ],
                    choices: [
                        { text: 'Trato hecho.', bond: 1 },
                        { text: 'Mejor no te rindas tú.', bond: 1 }
                    ]
                },
                {
                    rank: 4,
                    title: 'Flor de acero',
                    lines: [
                        { speaker: 'Sakura', text: 'He entrenado para esto. Para proteger a los míos… y a una Chikitriskis muy concreta.' }
                    ],
                    choices: [
                        { text: 'Gracias por estar.', bond: 1 },
                        { text: 'Vamos a ganar esto juntas.', bond: 1 }
                    ]
                },
                {
                    rank: 5,
                    title: 'MAX LAZO',
                    lines: [
                        { speaker: 'Sakura', text: 'Lazo al máximo. Si el Destino quiere pelea… que traiga más HP.' },
                        { speaker: 'Sistema', text: 'SAKURA — LAZO MAX. Curas potenciadas.' }
                    ],
                    choices: [{ text: 'Contigo hasta el final.', bond: 1 }]
                }
            ]
        },
        {
            id: 'kakashi',
            name: 'Kakashi Hatake',
            role: 'Sensei / Lectura',
            color: '#7f8c8d',
            img: 'assets/characters/kakashi.webp',
            unlockDay: 1,
            passiveAt: 3,
            passive: { atkBonus: 0.1, label: 'Sharingan Copy · ATK +10%' },
            ranks: [
                {
                    rank: 1,
                    title: 'Libro naranja',
                    lines: [
                        { speaker: 'Kakashi', text: 'Naruto. Llegas tarde… otra vez. El Destino no espera a nadie.' },
                        { speaker: 'Kakashi', text: 'Hoy entrenamos lazos. Sí, como en esos juegos raros de Personas.' }
                    ],
                    choices: [
                        { text: '¡Entendido, sensei!', bond: 1 },
                        { text: '¿Después hay ramen?', bond: 1 }
                    ]
                },
                {
                    rank: 2,
                    title: 'Copia del corazón',
                    lines: [
                        { speaker: 'Kakashi', text: 'Un ninja mira bajo la máscara… metafóricamente. Confía en el equipo.' }
                    ],
                    choices: [
                        { text: 'Confío en Sakura y Sasuke.', bond: 1 },
                        { text: '¿Y tú confías en mí?', bond: 1 }
                    ]
                },
                {
                    rank: 3,
                    title: 'Lección de Hokage',
                    lines: [
                        { speaker: 'Kakashi', text: 'No hace falta ser Hokage para proteger a alguien. Solo hace falta… quedarte.' }
                    ],
                    choices: [
                        { text: 'Me quedo.', bond: 1 },
                        { text: 'Entonces pelemos juntos.', bond: 1 }
                    ]
                },
                {
                    rank: 4,
                    title: 'Raikiri del vínculo',
                    lines: [
                        { speaker: 'Kakashi', text: 'Cuando digas “dattebayo”, que sea con intención. Yo cubro la retaguardia.' }
                    ],
                    choices: [{ text: 'Gritemos más fuerte.', bond: 1 }]
                },
                {
                    rank: 5,
                    title: 'MAX LAZO',
                    lines: [
                        { speaker: 'Kakashi', text: 'Lazo al máximo, Naruto. Rompamos el 50/50… con plan. Y un poco de voluntad.' },
                        { speaker: 'Sistema', text: 'KAKASHI — LAZO MAX. ATK +10%.' }
                    ],
                    choices: [{ text: '¡Dattebayo, sensei!', bond: 1 }]
                }
            ]
        },
        {
            id: 'sasuke',
            name: 'Sasuke Uchiha',
            role: 'DPS / Drama',
            color: '#2c3e50',
            img: 'assets/characters/sasuke.webp',
            unlockDay: 2,
            passiveAt: 3,
            passive: { critBonus: 0.08, label: 'Sharingan Focus · crit +8%' },
            ranks: [
                {
                    rank: 1,
                    title: 'Silencio útil',
                    lines: [
                        { speaker: 'Sasuke', text: '…No hables de más. Ataca donde duele.' },
                        { speaker: 'Sasuke', text: 'Si te despistas, te dejo atrás. …No lo haré. Pero suena cool.' }
                    ],
                    choices: [
                        { text: 'Entendido, senpai edgy.', bond: 1 },
                        { text: 'Muéstrame la debilidad.', bond: 1 }
                    ]
                },
                {
                    rank: 2,
                    title: 'Chidori compartido',
                    lines: [
                        { speaker: 'Sasuke', text: 'El rayo no perdona. Tampoco el Destino. Elige bien.' }
                    ],
                    choices: [
                        { text: 'Elijo pelear contigo.', bond: 1 },
                        { text: 'Entonces no fallaré.', bond: 1 }
                    ]
                },
                {
                    rank: 3,
                    title: 'Mirada',
                    lines: [
                        { speaker: 'Sasuke', text: 'Tú… no eres ruido. Eres foco. Eso vale más que mil clones.' }
                    ],
                    choices: [{ text: 'Gracias (sin llorar).', bond: 1 }]
                },
                {
                    rank: 4,
                    title: 'Sombra',
                    lines: [
                        { speaker: 'Sasuke', text: 'Si te pierdes en la Torre, silba. Apareceré. Quizá.' }
                    ],
                    choices: [{ text: 'Contaré contigo.', bond: 1 }]
                },
                {
                    rank: 5,
                    title: 'MAX LAZO',
                    lines: [
                        { speaker: 'Sasuke', text: 'Lazo máximo. No digas “te quiero”. Di “Chidori”.' },
                        { speaker: 'Sistema', text: 'SASUKE — LAZO MAX. Crit +8%.' }
                    ],
                    choices: [{ text: 'CHIDORI.', bond: 1 }]
                }
            ]
        },
        {
            id: 'nami',
            name: 'Nami',
            role: 'Soporte / Mapa',
            color: '#e67e22',
            img: 'assets/characters/nami.webp',
            unlockDay: 3,
            passiveAt: 3,
            passive: { lukBonus: 0.12, label: 'Lucky Weather · LUK +12%' },
            ranks: [
                {
                    rank: 1,
                    title: 'Tesoro emocional',
                    lines: [
                        { speaker: 'Nami', text: 'El Destino cobra caro. Yo cobro más… pero a ti te hago descuento de amiga.' }
                    ],
                    choices: [
                        { text: 'Acepto el descuento.', bond: 1 },
                        { text: 'Prefiero tu brújula.', bond: 1 }
                    ]
                },
                {
                    rank: 2,
                    title: 'Clima del corazón',
                    lines: [
                        { speaker: 'Nami', text: 'Si el cielo se pone feo, yo lo cambio. Si tú te pones triste… también.' }
                    ],
                    choices: [{ text: 'Quédate cerca.', bond: 1 }]
                },
                {
                    rank: 3,
                    title: 'Mapa del regalo',
                    lines: [
                        { speaker: 'Nami', text: 'Hay un “X” marcado al final de todo esto. No es oro. Es peor: es un juego legendario.' }
                    ],
                    choices: [{ text: 'Entonces navegamos juntas.', bond: 1 }]
                },
                {
                    rank: 4,
                    title: 'Tormenta naranja',
                    lines: [
                        { speaker: 'Nami', text: 'No dejes que el 50/50 te robe. Roba tú primero… con estilo.' }
                    ],
                    choices: [{ text: 'Estilo Chikitriskis.', bond: 1 }]
                },
                {
                    rank: 5,
                    title: 'MAX LAZO',
                    lines: [
                        { speaker: 'Nami', text: 'Lazo MAX. Si ganan ellos, les cobro intereses.' },
                        { speaker: 'Sistema', text: 'NAMI — LAZO MAX. LUK +12%.' }
                    ],
                    choices: [{ text: 'Negocio cerrado.', bond: 1 }]
                }
            ]
        },
        {
            id: 'orihime',
            name: 'Orihime Inoue',
            role: 'Reject / Fe',
            color: '#f5b041',
            img: 'assets/characters/orihime.webp',
            unlockDay: 5,
            passiveAt: 3,
            passive: { defBonus: 0.12, label: 'I Reject · DEF +12%' },
            ranks: [
                {
                    rank: 1,
                    title: 'Rechazo amable',
                    lines: [
                        { speaker: 'Orihime', text: 'Si el Destino te hace daño… yo lo rechazo. ¡Soten Kisshun!' }
                    ],
                    choices: [
                        { text: 'Gracias, Orihime.', bond: 1 },
                        { text: 'Rechaza también mis dudas.', bond: 1 }
                    ]
                },
                {
                    rank: 2,
                    title: 'Almuerzo del alma',
                    lines: [
                        { speaker: 'Orihime', text: 'Te preparé… algo. No preguntes los ingredientes. Pregunta si te hace feliz.' }
                    ],
                    choices: [{ text: 'Me hace feliz.', bond: 1 }]
                },
                {
                    rank: 3,
                    title: 'Escudo de luz',
                    lines: [
                        { speaker: 'Orihime', text: 'No soy la más fuerte. Pero nadie toca a mis personas.' }
                    ],
                    choices: [{ text: 'Soy una de ellas.', bond: 1 }]
                },
                {
                    rank: 4,
                    title: 'Fe',
                    lines: [
                        { speaker: 'Orihime', text: 'Creo en ti. Aunque el banner diga lo contrario.' }
                    ],
                    choices: [{ text: 'Creo en nosotras.', bond: 1 }]
                },
                {
                    rank: 5,
                    title: 'MAX LAZO',
                    lines: [
                        { speaker: 'Orihime', text: 'Lazo máximo. I REJECT… la derrota.' },
                        { speaker: 'Sistema', text: 'ORIHIME — LAZO MAX. DEF +12%.' }
                    ],
                    choices: [{ text: 'I REJECT.', bond: 1 }]
                }
            ]
        },
        {
            id: 'sai',
            name: 'Sai',
            role: 'ANBU · Tinta',
            color: '#2c3e50',
            img: 'assets/characters/sasuke.webp',
            unlockDay: 4,
            passiveAt: 3,
            passive: { lukBonus: 0.12, label: 'Sonrisa falsa · LUK +12%' },
            ranks: [
                {
                    rank: 1,
                    title: 'Nuevo compañero',
                    lines: [
                        { speaker: 'Sai', text: 'Hola. Soy Sai. Me han asignado a este equipo.' },
                        { speaker: 'Naruto', text: '…¿Y Sasuke?' },
                        { speaker: 'Sai', text: 'Eso no es asunto mío. ¿Quieres que dibuje un pájaro?' }
                    ],
                    choices: [
                        { text: 'Bienvenido al equipo.', bond: 1 },
                        { text: 'Habla menos raro.', bond: 1 }
                    ]
                },
                {
                    rank: 2,
                    title: 'Libro de imágenes',
                    lines: [
                        { speaker: 'Sai', text: 'Este libro… es para hacer amigos. ¿Somos amigos ya?' }
                    ],
                    choices: [
                        { text: 'Todavía no. Pero casi.', bond: 1 },
                        { text: 'Dibuja menos insultos.', bond: 1 }
                    ]
                },
                {
                    rank: 3,
                    title: 'Tinta y equipo',
                    lines: [
                        { speaker: 'Sai', text: 'Entiendo. El equipo no es solo una orden. Es… algo más.' }
                    ],
                    choices: [{ text: 'Eso es un lazo.', bond: 1 }]
                },
                {
                    rank: 4,
                    title: 'Antes del puente',
                    lines: [
                        { speaker: 'Sai', text: 'Cuando lleguemos a la sede… no me falléis. Yo tampoco fallaré.' }
                    ],
                    choices: [{ text: 'Contamos contigo.', bond: 1 }]
                },
                {
                    rank: 5,
                    title: 'MAX LAZO',
                    lines: [
                        { speaker: 'Sai', text: 'Lazo máximo. Puedo dibujar una sonrisa… de verdad.' },
                        { speaker: 'Sistema', text: 'SAI — LAZO MAX. LUK +12%.' }
                    ],
                    choices: [{ text: 'Bienvenido de verdad.', bond: 1 }]
                }
            ]
        },
        {
            id: 'yamato',
            name: 'Yamato',
            role: 'Capitán · Mokuton',
            color: '#27ae60',
            img: 'assets/characters/kakashi.webp',
            unlockDay: 5,
            passiveAt: 3,
            passive: { defBonus: 0.12, label: 'Mokuton · DEF +12%' },
            ranks: [
                {
                    rank: 1,
                    title: 'Sustituto',
                    lines: [
                        { speaker: 'Yamato', text: 'Kakashi no puede. Yo os acompaño. Disciplina… y madera.' },
                        { speaker: 'Naruto', text: '¿También lees Icha Icha?' },
                        { speaker: 'Yamato', text: '…Prefiero no responder.' }
                    ],
                    choices: [
                        { text: 'A sus órdenes, capitán.', bond: 1 },
                        { text: '¿Puedes controlarme el chakra?', bond: 1 }
                    ]
                },
                {
                    rank: 2,
                    title: 'Pilar',
                    lines: [
                        { speaker: 'Yamato', text: 'Si tu chakra se descontrola, yo estoy aquí. Eso es lo que soy.' }
                    ],
                    choices: [{ text: 'Gracias por sujetarme.', bond: 1 }]
                },
                {
                    rank: 3,
                    title: 'Misión sede',
                    lines: [
                        { speaker: 'Yamato', text: 'La sede de la serpiente no perdona. Mantened la formación.' }
                    ],
                    choices: [{ text: 'Entendido.', bond: 1 }]
                },
                {
                    rank: 4,
                    title: 'Confianza',
                    lines: [
                        { speaker: 'Yamato', text: 'Confío en vosotros. Incluso en Sai. Sobre todo en no hacer tonterías… Naruto.' }
                    ],
                    choices: [{ text: '¡Dattebayo!', bond: 1 }]
                },
                {
                    rank: 5,
                    title: 'MAX LAZO',
                    lines: [
                        { speaker: 'Yamato', text: 'Lazo máximo. Mi madera os cubre.' },
                        { speaker: 'Sistema', text: 'YAMATO — LAZO MAX. DEF +12%.' }
                    ],
                    choices: [{ text: 'Capitán.', bond: 1 }]
                }
            ]
        },
        {
            id: 'chiki',
            name: 'Chikiwitina (tú)',
            role: 'El motivo',
            color: '#c41e3a',
            img: '',
            unlockDay: 1,
            meta: true,
            passiveAt: 3,
            passive: { allBonus: 0.05, label: 'Operation Chikitriskis · todo +5%' },
            ranks: [
                {
                    rank: 1,
                    title: 'Espejo',
                    lines: [
                        { speaker: 'Narrador', text: 'Te miras al “lazo” más importante: tú. La razón de esta operación.' },
                        { speaker: 'Narrador', text: 'Alguien diseñó esto para que sudaras… y sonrieras.' }
                    ],
                    choices: [
                        { text: 'Voy a conquistarlo.', bond: 1 },
                        { text: 'Esto es ridículo… y perfecto.', bond: 1 }
                    ]
                },
                {
                    rank: 2,
                    title: 'Diario',
                    lines: [
                        { speaker: 'Narrador', text: 'Anotas en un diario invisible: “Día del Destino. Sigo aquí.”' }
                    ],
                    choices: [{ text: 'Sigo aquí.', bond: 1 }]
                },
                {
                    rank: 3,
                    title: 'Promesa',
                    lines: [
                        { speaker: 'Narrador', text: 'Prometes no saltarte la historia. El regalo se gana. Como en Persona. Como en la vida.' }
                    ],
                    choices: [{ text: 'Sin atajos.', bond: 1 }]
                },
                {
                    rank: 4,
                    title: 'Coraje',
                    lines: [
                        { speaker: 'Narrador', text: 'Tienes miedo de perder. También tienes un equipo. Y un novio tramposo con el RNG a tu favor… al final.' }
                    ],
                    choices: [{ text: 'Que venga el final.', bond: 1 }]
                },
                {
                    rank: 5,
                    title: 'MAX LAZO',
                    lines: [
                        { speaker: 'Narrador', text: 'Lazo MAX contigo misma. Eres la legendaria.' },
                        { speaker: 'Sistema', text: 'CHIKITRISKIS — LAZO MAX. Stats globales +5%.' }
                    ],
                    choices: [{ text: 'Soy leyenda.', bond: 1 }]
                }
            ]
        }
    ],

    get(id) {
        return this.characters.find(c => c.id === id);
    },

    available() {
        const day = Calendar.getDay();
        return this.characters.filter(c => day >= c.unlockDay);
    },

    nextRankScene(id) {
        const c = this.get(id);
        if (!c) return null;
        const level = GameState.getBond(id);
        if (level >= 5) return null;
        const next = level + 1;
        return c.ranks.find(r => r.rank === next) || null;
    },

    passivesForParty(partyIds) {
        const out = [];
        for (const id of partyIds) {
            const c = this.get(id);
            if (!c) continue;
            if (GameState.getBond(id) >= (c.passiveAt || 3)) out.push({ id, ...c.passive });
        }
        // Kakashi mentorship buffs Naruto (you are Naruto)
        const kakashi = this.get('kakashi');
        if (kakashi && GameState.getBond('kakashi') >= (kakashi.passiveAt || 3) && partyIds.includes('naruto')) {
            out.push({ id: 'naruto', ...kakashi.passive });
        }
        const chiki = this.get('chiki');
        if (chiki && GameState.getBond('chiki') >= chiki.passiveAt) {
            out.push({ id: 'chiki', ...chiki.passive });
        }
        return out;
    }
};
