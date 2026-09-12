/**
 * Instanced maps — Konoha districts, interiors, story villages
 * Coords are normalized 0–1 (multiplied by map w/h at runtime).
 */
const WorldMaps = {
    SPRITES: {
        sakura: 'assets/world/sprites/sakura_trim.png?v=2',
        sasuke: 'assets/world/sprites/sasuke_trim.png?v=2',
        kakashi: 'assets/world/sprites/kakashi_trim.png?v=2',
        teuchi: 'assets/world/sprites/teuchi_trim.png?v=2',
        villager: 'assets/world/sprites/villager_trim.png?v=2',
        kunoichi: 'assets/world/sprites/kunoichi_trim.png?v=2',
        gaara: 'assets/world/sprites/gaara_trim.png?v=2',
        zabuza: 'assets/world/sprites/kakashi_trim.png?v=2',
        orochimaru: 'assets/world/sprites/sasuke_trim.png?v=2'
    },

    NARUTO: {
        down: [0, 1, 2, 3].map(i => `assets/world/sprites/n_down_${i}.png?v=2`),
        left: [0, 1, 2, 3].map(i => `assets/world/sprites/n_left_${i}.png?v=2`),
        right: [0, 1, 2, 3].map(i => `assets/world/sprites/n_right_${i}.png?v=2`),
        up: [0, 1, 2, 3].map(i => `assets/world/sprites/n_up_${i}.png?v=2`)
    },

    /** @returns {object} map definition */
    get(id) {
        return this.defs[id] || this.defs.plaza;
    },

    unlocked(mapId) {
        const day = Calendar.getDay();
        const locs = GameState.get('locationsUnlocked') || [];
        const m = this.defs[mapId];
        if (!m) return false;
        if (!m.unlock) return true;
        if (m.unlock.day && day >= m.unlock.day) return true;
        if (m.unlock.loc && locs.includes(m.unlock.loc)) return true;
        return false;
    },

    defs: {
        plaza: {
            id: 'plaza',
            name: 'Konoha · Plaza Central',
            bg: 'assets/world/maps/map-konoha-plaza-g.png',
            w: 1280, h: 720,
            spawn: { x: 0.50, y: 0.72 },
            // Collision aligned to map art (Ichiraku RIGHT, Hokage TOP, river LEFT, training SE)
            solids: [
                // River / canal (leave bridge gap around y 0.48–0.58)
                [0.02, 0.28, 0.16, 0.20],
                [0.02, 0.58, 0.16, 0.30],
                // Left house + trees
                [0.14, 0.22, 0.20, 0.26],
                [0.02, 0.08, 0.22, 0.18],
                // Hokage / academy building (roof + walls; stairs stay walkable)
                [0.34, 0.02, 0.32, 0.22],
                // Right residential / shop block above Ichiraku
                [0.70, 0.10, 0.26, 0.18],
                // Ichiraku building body (door opening kept clear ~0.70–0.78 x, 0.48–0.55 y)
                [0.66, 0.28, 0.08, 0.20],
                [0.78, 0.28, 0.18, 0.28],
                [0.66, 0.28, 0.30, 0.12],
                // Training fence (only posts area — leave approach path clear)
                [0.74, 0.66, 0.22, 0.26],
                // Decorative rocks
                [0.28, 0.82, 0.08, 0.08],
                // World borders (thin)
                [0, 0, 1, 0.02], [0, 0.98, 1, 0.02], [0, 0, 0.012, 1], [0.988, 0, 0.012, 1]
            ],
            exits: [
                // Door of Ichiraku is on the RIGHT of the plaza
                { nx: 0.70, ny: 0.50, nw: 0.07, nh: 0.06, to: 'ichiraku', spawn: { x: 0.5, y: 0.86 }, label: 'Entrar · Ichiraku', color: '#c0392b' },
                // Top of stone stairs → academy
                { nx: 0.46, ny: 0.26, nw: 0.10, nh: 0.05, to: 'academy', spawn: { x: 0.5, y: 0.88 }, label: 'Entrar · Academia', color: '#2980b9' },
                { nx: 0.93, ny: 0.48, nw: 0.055, nh: 0.14, to: 'east', spawn: { x: 0.10, y: 0.55 }, label: 'Distrito Este ▶', color: '#27ae60' },
                { nx: 0.42, ny: 0.01, nw: 0.16, nh: 0.05, to: 'wave', spawn: { x: 0.5, y: 0.88 }, label: '▲ Camino a la Niebla', color: '#5dade2', need: 'wave' },
                // Path into training yard (approach from west of fence)
                { nx: 0.62, ny: 0.70, nw: 0.07, nh: 0.07, to: 'training', spawn: { x: 0.5, y: 0.22 }, label: 'Campo de entreno', color: '#8B4513' }
            ],
            buildEntities(day) {
                const e = [];
                // Central stone path only — feet on pavement
                e.push(npc('sakura', 'Sakura', 0.45, 0.58, 'bond', {
                    bondId: 'sakura', sprite: 'sakura', facing: 'right',
                    portrait: 'assets/characters/sakura.webp'
                }));
                e.push(npc('kakashi', 'Kakashi', 0.55, 0.52, 'bond', {
                    bondId: 'kakashi', sprite: 'kakashi', facing: 'left',
                    portrait: 'assets/characters/kakashi.webp'
                }));
                if (day >= 2) {
                    e.push(npc('sasuke', 'Sasuke', 0.50, 0.40, 'bond', {
                        bondId: 'sasuke', sprite: 'sasuke', facing: 'down',
                        portrait: 'assets/characters/sasuke.webp'
                    }));
                }
                if (day >= 4) {
                    e.push(npc('sai', 'Sai', 0.62, 0.60, 'bond', {
                        bondId: 'sai', sprite: 'sai', facing: 'left',
                        portrait: 'assets/characters/sasuke.webp'
                    }));
                }
                if (day >= 5) {
                    e.push(npc('yamato', 'Yamato', 0.68, 0.48, 'bond', {
                        bondId: 'yamato', sprite: 'yamato', facing: 'down',
                        portrait: 'assets/characters/kakashi.webp'
                    }));
                }
                e.push(npc('villager1', 'Aldeano', 0.50, 0.68, 'talk', {
                    sprite: 'villager', facing: 'up',
                    lines: [
                        { speaker: 'Aldeano', text: '¡Naruto! Ichiraku está a la derecha — puerta con noren rojo (E).' },
                        { speaker: 'Aldeano', text: 'Al este hay más pueblo. La Academia es la gran entrada de arriba.' }
                    ]
                }));
                e.push(npc('chiki', 'Espejo Chiki', 0.38, 0.74, 'bond', {
                    bondId: 'chiki', prop: 'mirror',
                    portrait: 'assets/characters/sakura.webp',
                    nw: 0.045, nh: 0.09
                }));
                e.push(spot('clock', 'Reloj del Destino', 0.38, 0.34, 'advance', {
                    label: 'RELOJ DEL DESTINO', color: '#f1c40f', prop: 'clock', nw: 0.055, nh: 0.09
                }));
                const gate = (typeof StoryData !== 'undefined' && StoryData.currentGateMission)
                    ? StoryData.currentGateMission()
                    : null;
                if (gate) {
                    e.push(spot('story_gate', gate.title, 0.50, 0.46, 'mission', {
                        missionId: gate.id, story: true, label: 'MISIÓN HISTORIA', color: '#c41e3a'
                    }));
                }
                return e;
            }
        },

        east: {
            id: 'east',
            name: 'Konoha · Distrito Este',
            bg: 'assets/world/maps/map-konoha-east-g.png',
            w: 1280, h: 720,
            spawn: { x: 0.1, y: 0.55 },
            solids: [
                [0.18, 0.12, 0.22, 0.22], [0.52, 0.18, 0.28, 0.24], [0.68, 0.52, 0.22, 0.22],
                [0.05, 0.65, 0.18, 0.18], [0.35, 0.05, 0.15, 0.12],
                [0, 0, 1, 0.025], [0, 0.975, 1, 0.025], [0, 0, 0.015, 1], [0.985, 0, 0.015, 1]
            ],
            exits: [
                { nx: 0.02, ny: 0.5, nw: 0.06, nh: 0.12, to: 'plaza', spawn: { x: 0.88, y: 0.55 }, label: '◀ Plaza', color: '#27ae60' },
                { nx: 0.88, ny: 0.45, nw: 0.08, nh: 0.1, to: 'suna', spawn: { x: 0.12, y: 0.55 }, label: 'Desierto · Suna ▶', color: '#e67e22', need: 'suna' },
                { nx: 0.5, ny: 0.9, nw: 0.12, nh: 0.06, to: 'training', spawn: { x: 0.5, y: 0.15 }, label: '▼ Entreno', color: '#8B4513' },
                { nx: 0.4, ny: 0.05, nw: 0.2, nh: 0.06, to: 'forest', spawn: { x: 0.5, y: 0.88 }, label: '▲ Bosque Rojo', color: '#1e8449', need: 'forest' },
                { nx: 0.72, ny: 0.08, nw: 0.14, nh: 0.07, to: 'tower', spawn: { x: 0.5, y: 0.85 }, label: 'Torre 50/50', color: '#c41e3a', need: 'tower' }
            ],
            buildEntities(day) {
                const e = [];
                if (day >= 3) e.push(npc('nami', 'Nami', 0.35, 0.5, 'bond', { bondId: 'nami', sprite: 'nami', portrait: 'assets/characters/nami.webp' }));
                if (day >= 5) e.push(npc('orihime', 'Orihime', 0.55, 0.48, 'bond', { bondId: 'orihime', sprite: 'orihime', portrait: 'assets/characters/orihime.webp' }));
                e.push(npc('shopkeep', 'Mercader', 0.45, 0.4, 'talk', {
                    sprite: 'teuchi',
                    lines: [
                        { speaker: 'Mercader', text: 'Kunais, mapas, chismes… Lo de Suna abre cuando el Destino lo marca en el calendario.' },
                        { speaker: 'Mercader', text: 'Naruto, no rompas mis puestos otra vez.' }
                    ]
                }));
                if (day >= 4) {
                    e.push(spot('patrol', 'Patrulla hostil', 0.3, 0.22, 'mission', { missionId: 'free_patrol', label: '¡COMBATE!', color: '#922b21' }));
                }
                if (day >= 8) {
                    e.push(spot('tower_hint', 'Camino a la Torre', 0.75, 0.2, 'talk', {
                        label: 'Mirar',
                        lines: [{ speaker: 'Narrador', text: 'La Torre del 50/50 se alza al norte-este. Cruza el portal cuando estés listo.' }]
                    }));
                }
                return e;
            }
        },

        ichiraku: {
            id: 'ichiraku',
            name: 'Ichiraku Ramen',
            bg: 'assets/world/maps/map-ichiraku-g.png',
            w: 1280, h: 720,
            spawn: { x: 0.5, y: 0.85 },
            indoor: true,
            solids: [
                [0.12, 0.18, 0.76, 0.14], // counter top
                [0.12, 0.18, 0.08, 0.42], [0.80, 0.18, 0.08, 0.42], // side walls
                [0.20, 0.08, 0.60, 0.12], // back wall
                [0, 0, 1, 0.04], [0, 0.96, 1, 0.04], [0, 0, 0.03, 1], [0.97, 0, 0.03, 1]
            ],
            exits: [
                { nx: 0.42, ny: 0.9, nw: 0.16, nh: 0.07, to: 'plaza', spawn: { x: 0.68, y: 0.58 }, label: 'Salir a Konoha', color: '#fff' }
            ],
            buildEntities() {
                return [
                    npc('teuchi', 'Teuchi', 0.5, 0.38, 'talk', {
                        sprite: 'teuchi',
                        portrait: 'assets/characters/naruto.webp',
                        lines: [
                            { speaker: 'Teuchi', text: '¡Naruto! El de siempre: miso grande. Hoy el caldo tiene… destino.' },
                            { speaker: 'Teuchi', text: 'Siéntate en el mostrador (E) para “explorar” y gastar la franja con honor.' }
                        ]
                    }),
                    npc('ayame', 'Ayame', 0.62, 0.4, 'talk', {
                        sprite: 'ayame',
                        lines: [{ speaker: 'Ayame', text: 'Bienvenido. El asiento de la esquina es el de siempre, ¿verdad?' }]
                    }),
                    spot('ramen_counter', 'Mostrador', 0.45, 0.48, 'explore', {
                        locId: 'ramen', label: 'PEDIR RAMEN', color: '#e67e22'
                    }),
                    ...(Calendar.getDay() >= 7 ? [
                        npc('sakura_ramen', 'Sakura', 0.3, 0.55, 'bond', {
                            bondId: 'sakura', sprite: 'sakura', portrait: 'assets/characters/sakura.webp'
                        })
                    ] : [])
                ];
            }
        },

        academy: {
            id: 'academy',
            name: 'Academia Ninja',
            bg: 'assets/world/maps/map-academy-g.png',
            w: 1280, h: 720,
            spawn: { x: 0.5, y: 0.88 },
            indoor: true,
            solids: [
                [0.2, 0.15, 0.6, 0.1], [0.15, 0.35, 0.2, 0.12], [0.4, 0.35, 0.2, 0.12], [0.65, 0.35, 0.2, 0.12],
                [0, 0, 1, 0.04], [0, 0.96, 1, 0.04], [0, 0, 0.03, 1], [0.97, 0, 0.03, 1]
            ],
            exits: [
                { nx: 0.42, ny: 0.9, nw: 0.16, nh: 0.07, to: 'plaza', spawn: { x: 0.50, y: 0.34 }, label: 'Salir', color: '#fff' }
            ],
            buildEntities(day) {
                const e = [
                    npc('iruka', 'Iruka', 0.5, 0.28, 'talk', {
                        sprite: 'iruka',
                        lines: [
                            { speaker: 'Iruka', text: 'Naruto… presta atención. Debilidades. 1 MORE. No improvises tanto.' },
                            { speaker: 'Iruka', text: 'Puedes “estudiar” en el pupitre del centro (E) para explorar la Academia.' }
                        ]
                    }),
                    spot('desk', 'Pupitre', 0.48, 0.55, 'explore', { locId: 'academy', label: 'ESTUDIAR', color: '#2980b9' }),
                    npc('kakashi_class', 'Kakashi', 0.7, 0.5, 'bond', {
                        bondId: 'kakashi', sprite: 'kakashi', portrait: 'assets/characters/kakashi.webp'
                    })
                ];
                if (day >= 2) {
                    e.push(npc('sasuke_class', 'Sasuke', 0.28, 0.52, 'bond', {
                        bondId: 'sasuke', sprite: 'sasuke', portrait: 'assets/characters/sasuke.webp'
                    }));
                }
                return e;
            }
        },

        training: {
            id: 'training',
            name: 'Campo de Entrenamiento',
            bg: 'assets/world/maps/map-konoha-east-g.png',
            w: 1280, h: 720,
            spawn: { x: 0.5, y: 0.3 },
            solids: [
                [0.15, 0.15, 0.15, 0.15], [0.7, 0.2, 0.15, 0.15],
                [0, 0, 1, 0.03], [0, 0.97, 1, 0.03], [0, 0, 0.02, 1], [0.98, 0, 0.02, 1]
            ],
            exits: [
                { nx: 0.42, ny: 0.05, nw: 0.16, nh: 0.06, to: 'plaza', spawn: { x: 0.60, y: 0.72 }, label: '▲ Plaza', color: '#27ae60' },
                { nx: 0.42, ny: 0.9, nw: 0.16, nh: 0.06, to: 'east', spawn: { x: 0.5, y: 0.85 }, label: '▼ Distrito Este', color: '#27ae60' }
            ],
            buildEntities() {
                return [
                    spot('train_post', 'Poste de entrenamiento', 0.55, 0.55, 'train', { label: 'ENTRENAR', color: '#8B4513' }),
                    spot('train_explore', 'Zona de postes', 0.35, 0.5, 'explore', { locId: 'training', label: 'MIRAR CAMPO', color: '#a04000' }),
                    npc('guy', 'Gai', 0.4, 0.4, 'talk', {
                        sprite: 'guy',
                        lines: [{ speaker: 'Gai', text: '¡JUVENTUD! Entrena ATK, DEF, AGI o SP. ¡El sudor es el fuego del ninja!' }]
                    })
                ];
            }
        },

        wave: {
            id: 'wave',
            name: 'País de las Olas · Niebla',
            bg: 'assets/world/maps/map-wave-g.png',
            w: 1280, h: 720,
            unlock: { day: 3, loc: 'wave' },
            spawn: { x: 0.5, y: 0.85 },
            solids: [
                [0.1, 0.2, 0.2, 0.25], [0.65, 0.15, 0.25, 0.3],
                [0, 0, 1, 0.03], [0, 0.97, 1, 0.03], [0, 0, 0.02, 1], [0.98, 0, 0.02, 1]
            ],
            exits: [
                { nx: 0.42, ny: 0.9, nw: 0.16, nh: 0.07, to: 'plaza', spawn: { x: 0.50, y: 0.12 }, label: '▼ Volver a Konoha', color: '#5dade2' }
            ],
            buildEntities(day) {
                const e = [
                    npc('tsunami', 'Tsunami', 0.35, 0.55, 'talk', {
                        sprite: 'kunoichi',
                        lines: [{ speaker: 'Tsunami', text: 'La niebla esconde cuchillas. Si buscas a Zabuza… el puente espera.' }]
                    }),
                    npc('inari', 'Inari', 0.55, 0.6, 'talk', {
                        sprite: 'villager',
                        lines: [{ speaker: 'Inari', text: 'Naruto… ¿de verdad los ninjas no se rinden?' }]
                    })
                ];
                if (day >= 3) {
                    e.push(spot('zabuza_fight', 'Sombra de Zabuza', 0.5, 0.35, 'mission', {
                        missionId: day <= 3 && !GameState.flag('gate_zabuza_cleared') ? 'gate_zabuza' : 'free_patrol',
                        label: '¡COMBATE NIEBLA!', color: '#1a5276', story: true
                    }));
                }
                return e;
            }
        },

        suna: {
            id: 'suna',
            name: 'Sunagakure · Arena',
            bg: 'assets/world/maps/map-suna-g.png',
            w: 1280, h: 720,
            unlock: { day: 6, loc: 'suna' },
            spawn: { x: 0.18, y: 0.72 },
            solids: [
                [0.35, 0.2, 0.3, 0.28], // arena
                [0.1, 0.15, 0.15, 0.2], [0.75, 0.4, 0.15, 0.2],
                [0, 0, 1, 0.03], [0, 0.97, 1, 0.03], [0, 0, 0.02, 1], [0.98, 0, 0.02, 1]
            ],
            exits: [
                { nx: 0.02, ny: 0.5, nw: 0.06, nh: 0.12, to: 'east', spawn: { x: 0.88, y: 0.5 }, label: '◀ Konoha Este', color: '#e67e22' }
            ],
            buildEntities(day) {
                const e = [
                    npc('gaara', 'Gaara', 0.5, 0.55, 'talk', {
                        sprite: 'gaara',
                        portrait: 'assets/characters/sasuke.webp',
                        lines: [
                            { speaker: 'Gaara', text: '…La arena recuerda. Si eres débil, te traga.' },
                            { speaker: 'Gaara', text: 'Naruto. Tú… no estás solo. Eso duele. Y cura.' }
                        ]
                    }),
                    npc('temari', 'Temari', 0.62, 0.5, 'talk', {
                        sprite: 'kunoichi',
                        lines: [{ speaker: 'Temari', text: 'El estadio de la Arena no perdona. Entrena antes de entrar.' }]
                    }),
                    npc('kankuro', 'Kankurō', 0.38, 0.52, 'talk', {
                        sprite: 'guy',
                        lines: [{ speaker: 'Kankurō', text: 'Mis marionetas y tus clones… algún día, dúo.' }]
                    }),
                    spot('arena', 'Estadio de la Arena', 0.48, 0.42, 'explore', {
                        locId: 'suna', label: 'MIRAR ARENA', color: '#d4a017'
                    })
                ];
                if (day >= 6) {
                    e.push(spot('suna_fight', 'Duelo en la Arena', 0.55, 0.38, 'mission', {
                        missionId: 'free_forest', label: '¡COMBATE ARENA!', color: '#c0392b'
                    }));
                }
                return e;
            }
        },

        forest: {
            id: 'forest',
            name: 'Bosque de la Niebla Roja',
            bg: 'assets/world/maps/map-forest-g.png',
            w: 1280, h: 720,
            unlock: { day: 4, loc: 'forest' },
            spawn: { x: 0.5, y: 0.85 },
            solids: [
                [0.1, 0.1, 0.25, 0.25], [0.6, 0.15, 0.25, 0.3], [0.3, 0.55, 0.2, 0.2],
                [0, 0, 1, 0.03], [0, 0.97, 1, 0.03], [0, 0, 0.02, 1], [0.98, 0, 0.02, 1]
            ],
            exits: [
                { nx: 0.42, ny: 0.9, nw: 0.16, nh: 0.07, to: 'east', spawn: { x: 0.5, y: 0.12 }, label: '▼ Konoha Este', color: '#1e8449' }
            ],
            buildEntities(day) {
                const e = [
                    npc('anbu', 'ANBU', 0.4, 0.5, 'talk', {
                        sprite: 'kakashi',
                        lines: [{ speaker: 'ANBU', text: 'Zona restringida. Akatsuki dejó marcas. No vayas solo… aunque seas Naruto.' }]
                    }),
                    spot('forest_explore', 'Claro', 0.55, 0.55, 'explore', { locId: 'forest', label: 'EXPLORAR BOSQUE', color: '#196f3d' }),
                    spot('forest_fight', 'Incursión', 0.45, 0.35, 'mission', { missionId: 'free_forest', label: '¡COMBATE!', color: '#6c3483' })
                ];
                if (day >= 9) {
                    e.push(spot('oro_hint', 'Rastro de Orochimaru', 0.6, 0.3, 'talk', {
                        lines: [{ speaker: 'Narrador', text: 'Escamas en el barro. Una risa lejos. El Destino se retuerce.' }]
                    }));
                }
                return e;
            }
        },

        tower: {
            id: 'tower',
            name: 'Torre del 50/50',
            bg: 'assets/world/maps/map-tower-g.png',
            w: 1280, h: 720,
            unlock: { day: 8, loc: 'tower' },
            spawn: { x: 0.5, y: 0.85 },
            solids: [
                [0.35, 0.1, 0.3, 0.35],
                [0, 0, 1, 0.03], [0, 0.97, 1, 0.03], [0, 0, 0.02, 1], [0.98, 0, 0.02, 1]
            ],
            exits: [
                { nx: 0.42, ny: 0.9, nw: 0.16, nh: 0.07, to: 'east', spawn: { x: 0.78, y: 0.15 }, label: '▼ Huir a Konoha', color: '#c41e3a' }
            ],
            buildEntities(day) {
                const e = [
                    spot('tower_explore', 'Atrio', 0.48, 0.55, 'explore', { locId: 'tower', label: 'SUBIR UN PISO', color: '#922b21' }),
                    spot('tower_fight', 'Piso de prueba', 0.55, 0.48, 'mission', { missionId: 'free_tower', label: '¡COMBATE TORRE!', color: '#7d3c98' })
                ];
                if (day >= 16) {
                    e.push(spot('final_gate', 'THE 50/50', 0.5, 0.4, 'mission', {
                        missionId: 'gate_final', story: true, label: 'JEFE FINAL', color: '#c41e3a'
                    }));
                }
                return e;
            }
        }
    }
};

function npc(id, name, nx, ny, kind, extra = {}) {
    return { id, name, kind, nx, ny, nw: 0.022, nh: 0.028, ...extra };
}

function spot(id, name, nx, ny, kind, extra = {}) {
    return {
        id, name, kind, nx, ny, nw: 0.07, nh: 0.05,
        color: extra.color || '#c41e3a',
        label: extra.label || name,
        ...extra
    };
}
