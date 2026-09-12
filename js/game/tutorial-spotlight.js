/**
 * TutorialSpotlight — guía extensa con blur + foco en UI.
 * Flujos multi-escena: arena → party → battle → gacha.
 */
const TutorialSpotlight = {
    PAD: 10,
    _root: null,
    _dim: null,
    _ring: null,
    _card: null,
    _active: false,
    _idx: 0,
    _steps: [],
    _targetEl: null,
    _onTargetClick: null,
    _ro: null,
    _resizeBound: null,

    /** Capítulos / escenas lógicas */
    SCENE: {
        arena: 'arena',
        party: 'party',
        battle: 'battle',
        gacha: 'gacha'
    },

    STEPS: [
        /* ── ARENA ── */
        {
            id: 'arena_welcome',
            scene: 'arena',
            selector: '.arena-brand',
            title: 'Bienvenido a la Arena',
            body: 'Este es tu <strong>cuartel general</strong>. Desde aquí lanzas combates, entrenas y abres el Convenio (gacha). Todo el progreso se guarda solo.',
            bullets: ['Historia = campaña principal', 'Libre / Oleadas / JJK = contenido extra', 'Entreno = práctica sin riesgo']
        },
        {
            id: 'arena_currencies',
            scene: 'arena',
            selector: '.arena-currencies',
            title: 'Tus recursos',
            body: 'Aquí ves lo que importa para progresar:',
            bullets: [
                '<strong>Invocaciones</strong> — tiradas de banners anime',
                '<strong>Chikistrites</strong> — monedas de combate (se cambian por invocaciones)',
                '<strong>Metaphor / Sellos</strong> — late-game y tienda de dupes'
            ],
            hint: 'Gana combates únicos → Chiki → convierte → tira en el Convenio.'
        },
        {
            id: 'arena_tabs',
            scene: 'arena',
            selector: '.arena-tabs, .arena-nav, #arena-sec-story',
            fallbackSelectors: ['.arena-hero', '#arena-story'],
            title: 'Secciones de misiones',
            body: 'Cambia entre <strong>Historia</strong>, Libre, Oleadas, JJK y Side. Cada pestaña muestra combates de esa rama.',
            hint: 'Empieza siempre por Historia hasta desbloquear el resto.'
        },
        {
            id: 'arena_story',
            scene: 'arena',
            selector: '#arena-story .arena-mission.ready, #arena-story .arena-mission:not(.locked)',
            fallbackSelectors: ['#arena-story', '#arena-sec-story'],
            title: 'Combates de Historia',
            body: 'Cada misión lista se puede pulsar. Al ganar obtienes <strong>Chikistrites</strong> (primera clear) y avances de historia.',
            bullets: ['Bloqueadas = falta un clear anterior', 'Cleared = ya la venciste (puedes repetir con menos premio)'],
            hint: 'Pulsa Siguiente y luego elige una misión… o ve al Entreno primero.'
        },
        {
            id: 'arena_training',
            scene: 'arena',
            selector: '#arena-training',
            title: 'Modo Entreno',
            body: 'Combate de práctica contra un muñeco. Ideal para probar <strong>técnicas, Stands y transformaciones</strong> sin gastar progresión.',
            hint: 'Recomendado la primera vez que entres a pelear.'
        },
        {
            id: 'arena_gacha',
            scene: 'arena',
            selector: '#arena-gacha',
            title: 'El Convenio (Gacha)',
            body: 'Aquí invocas personajes. Hay un banner por anime (One Piece, Naruto, JoJo, Bleach, JJK) más eggs y Metaphor late-game.',
            bullets: [
                'Rate-up del featured del banner',
                'Pity blando / duro en 5★ y 6★',
                'Dupes → constelaciones o Sellos'
            ],
            hint: 'Primero gana Chiki en combates; luego convierte e invoca.'
        },
        {
            id: 'arena_dupes',
            scene: 'arena',
            selector: '.arena-footer',
            fallbackSelectors: ['#arena-dupes'],
            title: 'Tienda de Dupes',
            body: 'Abajo del todo: <strong>Dupes · Tienda</strong> (Sellos 4★) y el botón Tutorial. Úsalo cuando tengas repeticiones de personajes.',
            hint: 'No es urgente al inicio. El tutorial también se puede repetir desde aquí.'
        },
        {
            id: 'arena_bridge_party',
            scene: 'arena',
            selector: '#arena-training',
            title: 'Siguiente: formar equipo',
            body: 'Al pulsar una misión o <strong>Entreno</strong> abrirás el selector de escuadrón. El tutorial seguirá allí automáticamente.',
            hint: 'Pulsa Entreno (o una misión) cuando quieras continuar.',
            requireClick: true,
            waitText: 'Pulsa Entreno o una misión para seguir…'
        },

        /* ── PARTY ── */
        {
            id: 'party_roster',
            scene: 'party',
            selector: '.psel-roster',
            title: 'Tu roster',
            body: 'Aquí aparecen los personajes que posees. Las pestañas filtran por <strong>serie</strong> (One Piece, Naruto, JoJo…).',
            bullets: ['Toca un chip para meterlo / sacarlo del equipo', 'La rareza ★ se ve en la esquina']
        },
        {
            id: 'party_squad',
            scene: 'party',
            selector: '.psel-squad',
            title: 'Escuadrón de combate',
            body: 'Máximo de aliados según la misión. El orden importa: el turno depende de <strong>AGI</strong> y efectos.',
            hint: 'Empieza con Luffy + Naruto + Jotaro si no sabes a quién llevar.'
        },
        {
            id: 'party_start',
            scene: 'party',
            selector: '#btn-start-battle',
            title: 'Entrar en combate',
            body: 'Cuando el equipo esté listo, pulsa aquí. En la pelea te explico Atacar, Técnicas y debilidades.',
            requireClick: true,
            waitText: 'Pulsa ENTRAR EN COMBATE…'
        },

        /* ── BATTLE ── */
        {
            id: 'battle_field',
            scene: 'battle',
            selector: '#battle-enemies, .p5-stage',
            fallbackSelectors: ['#battle-root', '.p5-stage'],
            title: 'Campo de batalla',
            body: 'Arriba/frente: enemigos. Abajo/lado: tu equipo. Cada unidad tiene HP, CP (energía de técnicas) y afinidades.',
            hint: 'Observa iconos de debilidad/resistencia en el HUD.'
        },
        {
            id: 'battle_commands',
            scene: 'battle',
            selector: '#battle-command',
            title: 'Comandos del turno',
            body: 'En tu turno elige una acción:',
            bullets: [
                '<strong>Atacar</strong> — golpe básico (barato / seguro)',
                '<strong>Técnica</strong> — skills y transformaciones (cuesta CP)',
                '<strong>Defender</strong> — menos daño recibido',
                '<strong>Objeto / Asalto</strong> — según disponibilidad'
            ]
        },
        {
            id: 'battle_skills',
            scene: 'battle',
            selector: '#p5-skill-rail, #battle-command',
            title: 'Técnicas y Stands',
            body: 'En Técnica verás 4 habilidades. Muchos personajes tienen una skill de <strong>TRANSFORM</strong> (Stand / Bankai / Mode) que cambia el kit.',
            bullets: [
                'La transformación suele costar CP de mantenimiento cada turno',
                'Skills con AoE golpean a todos',
                'Algunas curan, buffean o saltan el turno enemigo'
            ],
            hint: 'Pasa el ratón / mira la descripción abajo antes de gastar CP.'
        },
        {
            id: 'battle_target',
            scene: 'battle',
            selector: '#battle-enemies .p5-fighter, #battle-enemies',
            title: 'Seleccionar objetivo',
            body: 'Tras Atacar o una skill ofensiva, <strong>toca al enemigo</strong> que quieras golpear. Las AoE no piden objetivo.',
            hint: 'Si fallas el clic, vuelve a abrir Técnica / Atacar.'
        },
        {
            id: 'battle_party_strip',
            scene: 'battle',
            selector: '#p5-party-strip, #p5-actor-hud',
            fallbackSelectors: ['#p5-actor-hud', '#battle-command'],
            title: 'Estado del equipo',
            body: 'La franja de aliados y el HUD del actor muestran HP/CP y quién actúa. Si un aliado cae, puedes revivir solo si tienes skills de revive.',
            hint: 'Prioriza curar o defender si vas mal de HP.'
        },
        {
            id: 'battle_flee',
            scene: 'battle',
            selector: '#btn-flee-battle',
            fallbackSelectors: ['#battle-command'],
            title: 'Huir (si hace falta)',
            body: 'Puedes abandonar un combate. En Entreno no pasa nada; en Historia perderás la clear de esa run.',
            hint: 'Tras ganar o salir, el tutorial sigue en el Convenio cuando entres.'
        },
        {
            id: 'battle_bridge_gacha',
            scene: 'battle',
            selector: '#battle-command',
            title: 'Después del combate',
            body: 'Vuelve a la Arena y abre el <strong>Convenio</strong>. Allí te enseño banners, conversión de Chiki y tiradas.',
            hint: 'Termina o huye cuando quieras; al entrar al gacha continúo yo.'
        },

        /* ── GACHA ── */
        {
            id: 'gacha_welcome',
            scene: 'gacha',
            selector: '#gacha-wuwa, .gacha-wuwa',
            title: 'El Convenio',
            body: 'Pantalla de invocación estilo banner. El arte grande es el featured del anime activo.',
            hint: 'Cada thumb de la rail cambia de serie.'
        },
        {
            id: 'gacha_banners',
            scene: 'gacha',
            selector: '.gw-thumb[data-banner="onepiece"], .gw-thumbs, [data-banner]',
            fallbackSelectors: ['.gw-thumb'],
            title: 'Banners por anime',
            body: 'Cambia entre One Piece, Naruto, JoJo, Bleach, JJK… Cada uno tiene su pool 4★ / 5★ / 6★ y un featured en rate-up.',
            bullets: [
                'Eggs (WuWa / ToF / Genshin) = tiradas gratis especiales',
                'Metaphor (rojo) = sellado hasta late-game'
            ]
        },
        {
            id: 'gacha_currency',
            scene: 'gacha',
            selector: '.gw-currency, #gacha-invocations, #gw-cost-chip',
            fallbackSelectors: ['#gw-cost-chip', '.gw-top'],
            title: 'Invocaciones y Chiki',
            body: 'Las tiradas anime cuestan <strong>Invocaciones</strong>. Si te faltan, pulsa el <strong>+</strong> junto a Chikistrites para convertir.',
            hint: '1 tirada = 1 invocación (aprox. según tu economía).'
        },
        {
            id: 'gacha_pull',
            scene: 'gacha',
            selector: '#btn-pull-1',
            title: 'Tirar ×1 y ×10',
            body: '<strong>×1</strong> para probar suerte; <strong>×10</strong> para farmear pity más rápido. Verás cinemática y luego las cartas.',
            bullets: ['5★ y 6★ son raros', 'El pity garantiza que no se eternice la sequía']
        },
        {
            id: 'gacha_pity',
            scene: 'gacha',
            selector: '#pity-fill, .gw-pity, #gacha-pity',
            fallbackSelectors: ['#btn-pull-10', '#btn-pull-1'],
            title: 'Pity (garantía)',
            body: 'La barra de pity sube con tiradas sin el premio alto. Soft pity mejora tasas cerca del final; hard pity garantiza.',
            hint: 'No hace falta leer números exactos: si la barra está alta, estás cerca.'
        },
        {
            id: 'gacha_tools',
            scene: 'gacha',
            selector: '#btn-gacha-details, #btn-dock-details',
            fallbackSelectors: ['#btn-gacha-history', '#btn-back-hunt'],
            title: 'Detalles e historial',
            body: 'Detalles = tasas y pools del banner. Historial = qué te ha salido. Dupes abre la tienda estelar.',
        },
        {
            id: 'gacha_back',
            scene: 'gacha',
            selector: '#btn-back-hunt',
            title: 'Volver a la Arena',
            body: 'Cuando termines de invocar, vuelve al cuartel y sigue la Historia. ¡Ya sabes el loop completo!',
            bullets: [
                'Combatir → Chiki',
                'Convertir → Invocaciones',
                'Tirar → más roster → combates más fuertes'
            ],
            hint: 'Puedes repetir este tutorial desde Dupes/footer o consola: TutorialSpotlight.restart()'
        }
    ],

    isDone() {
        return !!(typeof GameState !== 'undefined' && GameState.get('tutorialDone'));
    },

    markDone() {
        if (typeof GameState !== 'undefined') GameState.set('tutorialDone', true);
    },

    saveIdx(i) {
        if (typeof GameState !== 'undefined') GameState.set('tutorialStep', i);
    },

    loadIdx() {
        if (typeof GameState === 'undefined') return 0;
        const n = GameState.get('tutorialStep');
        return Number.isFinite(n) ? Math.max(0, n | 0) : 0;
    },

    /** Llamar al entrar en una escena lógica */
    onScene(scene) {
        if (this.isDone()) return;
        if (!this._active) {
            // Auto-arranque solo en arena la primera vez
            if (scene === 'arena' && !GameState.get('tutorialStarted')) {
                const wins = GameState.get('huntRunsCompleted') || 0;
                const pulls = GameState.get('pullsDone') || 0;
                // Partidas ya avanzadas: no forzar tutorial (se puede repetir con el botón)
                if (wins > 0 || pulls > 0 || GameState.get('storyComplete') || GameState.get('finalSeen')) {
                    GameState.set('tutorialStarted', true);
                    GameState.set('tutorialDone', true);
                    return;
                }
                GameState.set('tutorialStarted', true);
                this.start({ from: 0, scene });
                return;
            }
            // Reanudar si hay progreso pendiente para esta escena
            const idx = this.loadIdx();
            if (idx > 0 && idx < this.STEPS.length && this.STEPS[idx].scene === scene) {
                this.start({ from: idx, scene });
            }
            return;
        }
        this._resumeForScene(scene);
    },

    start({ from = 0, scene = null } = {}) {
        this._steps = this.STEPS.slice();
        this._idx = Math.min(Math.max(0, from), this._steps.length - 1);
        this._ensureDom();
        this._active = true;
        document.body.classList.add('tut-lock-scroll');
        this._root.classList.add('is-active');
        this._root.hidden = false;
        if (scene) this._resumeForScene(scene);
        else this._showCurrent();
        this._bindViewport();
    },

    restart() {
        if (typeof GameState !== 'undefined') {
            GameState.set('tutorialDone', false);
            GameState.set('tutorialStep', 0);
            GameState.set('tutorialStarted', true);
        }
        this.stop({ silent: true });
        // Intentar arrancar en la escena visible
        const scene = this._detectScene();
        this.start({ from: 0, scene });
    },

    stop({ silent = false, done = false } = {}) {
        this._unbindTarget();
        this._unbindViewport();
        this._active = false;
        document.body.classList.remove('tut-lock-scroll');
        if (this._root) {
            this._root.classList.remove('is-active');
            this._root.hidden = true;
        }
        if (done) {
            this.markDone();
            this.saveIdx(this.STEPS.length);
            if (!silent) this._toast('Tutorial completado. ¡A por la Historia!');
        }
    },

    skipAll() {
        this.stop({ done: true });
    },

    next() {
        this._idx += 1;
        this.saveIdx(this._idx);
        if (this._idx >= this._steps.length) {
            this.stop({ done: true });
            return;
        }
        const step = this._steps[this._idx];
        const scene = this._detectScene();
        if (step.scene !== scene) {
            // Esperar a que el jugador llegue a esa escena
            this._parkWaiting(step);
            return;
        }
        this._showCurrent();
    },

    _parkWaiting(step) {
        this._unbindTarget();
        this._fullShade();
        this._ring.style.opacity = '0';
        this._placeCard(null, {
            title: 'Sigue cuando puedas',
            body: `El siguiente paso es en <strong>${this._sceneLabel(step.scene)}</strong>. ${step.hint || 'Entra ahí y el tutorial continúa solo.'}`,
            kicker: 'TUTORIAL EN PAUSA',
            actions: 'park'
        });
        this._root.classList.add('is-active');
        this._root.hidden = false;
    },

    _resumeForScene(scene) {
        if (!this._active) return;
        // Avanzar índice hasta el primer paso de esta escena (o actual si coincide)
        while (this._idx < this._steps.length && this._steps[this._idx].scene !== scene) {
            // Si el paso actual es de una escena anterior ya vista, sáltalo
            if (this._sceneOrder(this._steps[this._idx].scene) < this._sceneOrder(scene)) {
                this._idx += 1;
                this.saveIdx(this._idx);
                continue;
            }
            break;
        }
        if (this._idx >= this._steps.length) {
            this.stop({ done: true });
            return;
        }
        if (this._steps[this._idx].scene !== scene) {
            this._parkWaiting(this._steps[this._idx]);
            return;
        }
        this._showCurrent();
    },

    _sceneOrder(s) {
        return ({ arena: 0, party: 1, battle: 2, gacha: 3 }[s] ?? 99);
    },

    _sceneLabel(s) {
        return ({ arena: 'la Arena', party: 'el selector de equipo', battle: 'el combate', gacha: 'el Convenio' }[s] || s);
    },

    _detectScene() {
        if (document.querySelector('.psel-roster') || document.querySelector('.psel-squad')) return 'party';
        if (document.querySelector('#battle-root .p5-stage') || document.querySelector('#battle-command')) return 'battle';
        if (document.querySelector('#gacha-wuwa') || document.querySelector('.gacha-wuwa')) return 'gacha';
        if (document.querySelector('.arena-scene')) return 'arena';
        if (typeof GameState !== 'undefined') {
            const cur = GameState.get('currentScene');
            if (cur === 'gacha') return 'gacha';
            if (cur === 'arena' || cur === 'hub') return 'arena';
        }
        return 'arena';
    },

    _ensureDom() {
        if (this._root) return;
        const root = document.createElement('div');
        root.id = 'tutorial-spotlight';
        root.className = 'tut-root';
        root.hidden = true;
        root.innerHTML = `
            <div class="tut-dim" aria-hidden="true">
                <div class="tut-shade tut-shade-t"></div>
                <div class="tut-shade tut-shade-l"></div>
                <div class="tut-shade tut-shade-r"></div>
                <div class="tut-shade tut-shade-b"></div>
            </div>
            <div class="tut-ring" aria-hidden="true"></div>
            <div class="tut-card" role="dialog" aria-modal="true" aria-labelledby="tut-title"></div>
        `;
        document.body.appendChild(root);
        this._root = root;
        this._dim = root.querySelector('.tut-dim');
        this._shadeT = root.querySelector('.tut-shade-t');
        this._shadeL = root.querySelector('.tut-shade-l');
        this._shadeR = root.querySelector('.tut-shade-r');
        this._shadeB = root.querySelector('.tut-shade-b');
        this._ring = root.querySelector('.tut-ring');
        this._card = root.querySelector('.tut-card');
    },

    _showCurrent() {
        const step = this._steps[this._idx];
        if (!step) {
            this.stop({ done: true });
            return;
        }
        this.saveIdx(this._idx);
        const el = this._find(step);
        this._unbindTarget();

        const afterScroll = () => {
            this._layout(el);
            this._placeCard(el, step);
            if (step.requireClick && el) this._bindTarget(el);
            this._root.classList.add('is-active');
            this._root.hidden = false;
        };

        if (el) {
            this._scrollTargetIntoSafeView(el).then(afterScroll);
        } else {
            afterScroll();
        }
    },

    /** Sube/baja el target a una zona cómoda (no pegado al borde inferior/superior). */
    _scrollTargetIntoSafeView(el) {
        return new Promise((resolve) => {
            try {
                const vh = window.innerHeight;
                const margin = Math.round(vh * 0.22); // deja sitio para la tarjeta
                const r = el.getBoundingClientRect();
                const tooLow = r.bottom > vh - margin;
                const tooHigh = r.top < margin * 0.55;
                if (tooLow || tooHigh) {
                    el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
                    // Esperar al scroll suave + layout
                    setTimeout(resolve, 320);
                    return;
                }
            } catch (_) { /* */ }
            resolve();
        });
    },

    _find(step) {
        const trySel = (sel) => {
            if (!sel) return null;
            try { return document.querySelector(sel); } catch (_) { return null; }
        };
        let el = trySel(step.selector);
        if (el) return el;
        for (const s of (step.fallbackSelectors || [])) {
            el = trySel(s);
            if (el) return el;
        }
        return null;
    },

    _fullShade() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        this._setShade(this._shadeT, 0, 0, vw, vh);
        this._setShade(this._shadeL, 0, 0, 0, 0);
        this._setShade(this._shadeR, 0, 0, 0, 0);
        this._setShade(this._shadeB, 0, 0, 0, 0);
    },

    _setShade(node, left, top, width, height) {
        if (!node) return;
        const on = width > 0 && height > 0;
        node.style.display = on ? 'block' : 'none';
        node.style.left = `${left}px`;
        node.style.top = `${top}px`;
        node.style.width = `${Math.max(0, width)}px`;
        node.style.height = `${Math.max(0, height)}px`;
    },

    _layout(el) {
        const pad = this.PAD;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const edge = 14;
        let hole;
        if (el) {
            const r = el.getBoundingClientRect();
            let x = r.left - pad;
            let y = r.top - pad;
            let w = r.width + pad * 2;
            let h = r.height + pad * 2;
            x = Math.max(edge, Math.min(x, vw - edge - 40));
            y = Math.max(edge, Math.min(y, vh - edge - 40));
            w = Math.min(w, vw - x - edge);
            h = Math.min(h, vh - y - edge);
            w = Math.max(40, w);
            h = Math.max(36, h);
            hole = { x, y, w, h };
        } else {
            hole = { x: vw / 2 - 40, y: vh / 2 - 40, w: 80, h: 80 };
        }
        this._lastHole = hole;

        // 4 paneles = hueco real sin overlay (clics pasan al botón)
        this._setShade(this._shadeT, 0, 0, vw, hole.y);
        this._setShade(this._shadeL, 0, hole.y, hole.x, hole.h);
        this._setShade(this._shadeR, hole.x + hole.w, hole.y, vw - (hole.x + hole.w), hole.h);
        this._setShade(this._shadeB, 0, hole.y + hole.h, vw, vh - (hole.y + hole.h));

        this._ring.style.opacity = el ? '1' : '0';
        this._ring.style.left = `${hole.x}px`;
        this._ring.style.top = `${hole.y}px`;
        this._ring.style.width = `${hole.w}px`;
        this._ring.style.height = `${hole.h}px`;

        if (this._targetEl && this._targetEl !== el) {
            this._targetEl.classList.remove('tut-target-live');
        }
        if (el) {
            el.classList.add('tut-target-live');
            this._targetEl = el;
        }
    },

    _placeCard(el, step) {
        const total = this._steps.length;
        const n = this._idx + 1;
        const bullets = (step.bullets || [])
            .map((b) => `<li>${b}</li>`)
            .join('');
        const wait = step.requireClick
            ? `<span class="tut-wait">${step.waitText || 'Interactúa con el elemento resaltado…'}</span>`
            : '';
        const primary = step.requireClick
            ? ''
            : `<button type="button" class="tut-btn tut-btn-primary" data-tut="next">Siguiente</button>`;
        const park = step.actions === 'park';

        this._card.innerHTML = `
            <div class="tut-card-kicker">
                <span>${step.kicker || 'GUÍA · PHANTOM DESTINY'}</span>
                <span class="tut-card-step">${park ? '—' : `${n} / ${total}`}</span>
            </div>
            <h3 id="tut-title">${step.title || ''}</h3>
            <p>${step.body || ''}</p>
            ${bullets ? `<ul>${bullets}</ul>` : ''}
            ${step.hint ? `<p class="tut-hint">${step.hint}</p>` : ''}
            <div class="tut-actions">
                ${wait}
                ${primary}
                ${park ? `<button type="button" class="tut-btn tut-btn-primary" data-tut="hide">Entendido</button>` : ''}
                <button type="button" class="tut-btn tut-btn-ghost" data-tut="skip">Saltar tutorial</button>
            </div>
        `;

        this._card.querySelector('[data-tut="next"]')?.addEventListener('click', () => {
            try { AudioManager.ui.click(); } catch (_) { /* */ }
            this.next();
        });
        this._card.querySelector('[data-tut="skip"]')?.addEventListener('click', () => {
            try { AudioManager.ui.click(); } catch (_) { /* */ }
            this.skipAll();
        });
        this._card.querySelector('[data-tut="hide"]')?.addEventListener('click', () => {
            try { AudioManager.ui.click(); } catch (_) { /* */ }
            this._root.classList.remove('is-active');
            this._root.hidden = true;
            this._unbindTarget();
        });

        // Medir card tras pintar
        requestAnimationFrame(() => this._positionCard(el));
    },

    _positionCard(el) {
        if (!this._card) return;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const cardW = Math.min(420, vw - 28);
        const cardH = this._card.offsetHeight || 220;
        const gap = 16;
        const hole = this._lastHole;

        let top;
        let left = Math.max(14, (vw - cardW) / 2);

        if (el && hole) {
            const spaceAbove = hole.y - gap;
            const spaceBelow = vh - (hole.y + hole.h) - gap;
            const preferAbove = hole.y + hole.h > vh * 0.55 || spaceBelow < cardH + 24;

            if (preferAbove && spaceAbove >= Math.min(160, cardH * 0.55)) {
                top = Math.max(14, hole.y - cardH - gap);
            } else if (spaceBelow >= cardH + 20) {
                top = hole.y + hole.h + gap;
            } else if (spaceAbove >= spaceBelow) {
                top = Math.max(14, hole.y - cardH - gap);
            } else {
                // Muy poco sitio: tarjeta a media altura, no encima del botón
                top = Math.max(14, Math.min(vh - cardH - 14, vh * 0.2));
            }

            // Alinear horizontalmente con el target si cabe
            left = Math.min(vw - cardW - 14, Math.max(14, hole.x + hole.w / 2 - cardW / 2));
            if (hole.w > vw * 0.55) left = Math.max(14, (vw - cardW) / 2);
        } else {
            top = Math.max(24, vh * 0.28);
        }

        // Clamp final
        top = Math.max(14, Math.min(top, vh - cardH - 14));

        this._card.style.width = `${cardW}px`;
        this._card.style.left = `${left}px`;
        this._card.style.top = `${top}px`;
        this._card.style.bottom = 'auto';
        this._card.style.right = 'auto';
        this._card.style.maxHeight = `${Math.min(vh * 0.55, 480)}px`;
    },

    _bindTarget(el) {
        // Escucha global: el overlay no debe impedir el click real sobre el target
        this._onTargetClick = (ev) => {
            const t = ev.target;
            if (!el || !t) return;
            if (el === t || el.contains(t)) {
                document.removeEventListener('click', this._onTargetClick, true);
                this._onTargetClick = null;
                setTimeout(() => {
                    if (!this._active) return;
                    this.next();
                }, 80);
            }
        };
        document.addEventListener('click', this._onTargetClick, true);
    },

    _unbindTarget() {
        if (this._onTargetClick) {
            document.removeEventListener('click', this._onTargetClick, true);
            this._onTargetClick = null;
        }
        if (this._targetEl) {
            this._targetEl.classList.remove('tut-target-live');
        }
        this._targetEl = null;
    },

    _bindViewport() {
        this._resizeBound = () => {
            if (!this._active || this._root.hidden) return;
            const step = this._steps[this._idx];
            if (!step) return;
            const el = this._find(step);
            this._layout(el);
            this._positionCard(el);
        };
        window.addEventListener('resize', this._resizeBound);
        window.addEventListener('scroll', this._resizeBound, true);
        if (typeof ResizeObserver !== 'undefined') {
            this._ro = new ResizeObserver(() => this._resizeBound?.());
            this._ro.observe(document.body);
        }
    },

    _unbindViewport() {
        if (this._resizeBound) {
            window.removeEventListener('resize', this._resizeBound);
            window.removeEventListener('scroll', this._resizeBound, true);
        }
        this._resizeBound = null;
        try { this._ro?.disconnect(); } catch (_) { /* */ }
        this._ro = null;
    },

    _toast(msg) {
        let t = document.querySelector('.arena-toast');
        if (!t) {
            t = document.createElement('div');
            t.className = 'arena-toast';
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.classList.add('is-on');
        setTimeout(() => t.classList.remove('is-on'), 2800);
    }
};

// Consola QA
if (typeof window !== 'undefined') {
    window.TutorialSpotlight = TutorialSpotlight;
    window.__qa = window.__qa || {};
    window.__qa.tutorial = () => TutorialSpotlight.restart();
}
