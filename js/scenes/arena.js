/**
 * Arena — Phantom Destiny command hub (Metaphor / convene-tier UI)
 */
const ArenaScene = {
    ART: 'assets/gacha/banners/metaphor-stage.webp?v=arena98',
    THUMB: 'assets/gacha/banners/metaphor-thumb.webp?v=arena98',

    render() {
        const el = document.createElement('div');
        el.className = 'arena-scene p5-hub';
        el.innerHTML = `
            <div class="arena-bg" aria-hidden="true">
                <img class="arena-bg-art" src="${this.ART}" alt=""
                     onerror="this.style.display='none'">
                <div class="arena-bg-veil"></div>
                <div class="arena-bg-ink"></div>
                <div class="arena-bg-grain"></div>
            </div>

            <div class="arena-shell p5-shell">
                <header class="arena-topbar p5-topbar">
                    <div class="arena-brand">
                        <img class="arena-brand-logo" src="assets/branding/app-logo.png?v=2" alt="Phantom Destiny" width="42" height="42" decoding="async">
                        <div>
                            <p class="arena-brand-kicker">PHANTOM DESTINY<span class="build-tag">P5·v3</span></p>
                            <h1 class="arena-brand-title">OPERATION CHIKITRISKIS</h1>
                        </div>
                    </div>
                    <div class="p5-date" aria-label="Fecha">
                        <span class="p5-date-day" id="arena-date">DÍA 1</span>
                        <span class="p5-date-sub">CRÓNICA</span>
                    </div>
                    <div class="arena-currencies" aria-label="Recursos">
                        <div class="arena-chip arena-chip-inv">
                            <img class="arena-chip-ico" src="assets/gacha/invocation-persona5.png?v=1" alt="" width="28" height="28" decoding="async">
                            <div>
                                <em>INVOCACIONES</em>
                                <strong id="arena-inv">0</strong>
                            </div>
                        </div>
                        <div class="arena-chip arena-chip-meta">
                            <img class="arena-chip-ico" src="assets/gacha/metaphor-ticket.png?v=arena94" alt="" width="28" height="28" decoding="async">
                            <div>
                                <em>METAPHOR</em>
                                <strong id="arena-meta">0</strong>
                            </div>
                        </div>
                        <div class="arena-chip">
                            <img class="arena-chip-ico" src="assets/gacha/chikistrites-mask.png?v=1" alt="" width="28" height="28" decoding="async">
                            <div>
                                <em>CHIKISTRITES</em>
                                <strong id="arena-chiki">0</strong>
                            </div>
                        </div>
                        <div class="arena-chip arena-chip-seal">
                            <img class="arena-chip-ico" src="assets/gacha/dupe-seal.png?v=1" alt="" width="28" height="28" decoding="async">
                            <div>
                                <em>SELLOS 4★</em>
                                <strong id="arena-seals">0</strong>
                            </div>
                        </div>
                        <div class="arena-chip arena-chip-seal-5">
                            <img class="arena-chip-ico" src="assets/gacha/star-seal-5.png?v=1" alt="" width="28" height="28" decoding="async">
                            <div>
                                <em>SELLOS 5★</em>
                                <strong id="arena-seals-5">0</strong>
                            </div>
                        </div>
                        <div class="arena-chip arena-chip-seal-6">
                            <img class="arena-chip-ico" src="assets/gacha/star-seal-6.png?v=1" alt="" width="28" height="28" decoding="async">
                            <div>
                                <em>SELLOS 6★</em>
                                <strong id="arena-seals-6">0</strong>
                            </div>
                        </div>
                        <div class="arena-chip arena-chip-soft">
                            <div>
                                <em>VICTORIAS</em>
                                <strong id="arena-wins">0</strong>
                            </div>
                        </div>
                        <div class="arena-chip arena-chip-soft">
                            <div>
                                <em>CLEARS</em>
                                <strong id="arena-clears">0</strong>
                            </div>
                        </div>
                    </div>
                </header>

                <div class="p5-main">
                    <aside class="p5-rail" aria-label="Menú">
                        <button type="button" class="p5-rail-item is-featured" id="arena-gacha" aria-label="Abrir gacha">
                            <img class="p5-rail-art" src="${this.THUMB}" alt="" onerror="this.style.display='none'">
                            <span class="p5-rail-text">
                                <b>CONVENIO</b>
                                <i id="arena-gacha-cta">ENTRAR AL CONVENIO</i>
                                <small id="arena-gacha-blurb">Gana combates únicos → gasta tiradas aquí.</small>
                            </span>
                            <span class="p5-rail-arrow" aria-hidden="true">▶</span>
                        </button>
                        <button type="button" class="p5-rail-item" id="arena-training" aria-label="Abrir training">
                            <span class="p5-rail-text">
                                <b>TRAINING</b>
                                <small>Muñeco · SP infinito · prueba voces y FX.</small>
                            </span>
                            <span class="p5-rail-arrow" aria-hidden="true">▶</span>
                        </button>
                        <button type="button" class="p5-rail-item" id="arena-dupes">
                            <span class="p5-rail-text"><b>DUPES · TIENDA</b></span>
                            <span class="p5-rail-arrow" aria-hidden="true">▶</span>
                        </button>
                        <button type="button" class="p5-rail-item" id="arena-equipment">
                            <span class="p5-rail-text"><b>EQUIPAMIENTO 3★</b></span>
                            <span class="p5-rail-arrow" aria-hidden="true">▶</span>
                        </button>
                        <button type="button" class="p5-rail-item" id="arena-achievements">
                            <span class="p5-rail-text"><b>LOGROS</b><small id="arena-ach-count">0/0</small></span>
                            <span class="p5-rail-arrow" aria-hidden="true">▶</span>
                        </button>
                        <button type="button" class="p5-rail-item" id="arena-tutorial">
                            <span class="p5-rail-text"><b>TUTORIAL</b></span>
                            <span class="p5-rail-arrow" aria-hidden="true">▶</span>
                        </button>
                        <button type="button" class="p5-rail-item is-danger" id="arena-reset">
                            <span class="p5-rail-text"><b>RESET PARTIDA</b></span>
                            <span class="p5-rail-arrow" aria-hidden="true">▶</span>
                        </button>
                    </aside>

                    <div class="p5-content">
                        <div class="arena-hero">
                            <div class="arena-hero-copy">
                                <span class="arena-ribbon">CAMPAÑA LIMITADA</span>
                                <h2 class="arena-hero-title">
                                    <span>LA CRÓNICA</span>
                                    <span class="arena-hero-gold">DE LOS ELEGIDOS</span>
                                </h2>
                                <p class="arena-hero-sub">Combates por turnos · One Piece · Naruto · JoJo · Bleach · JJK</p>
                                <p class="arena-hero-hint">Combates → Chikistrites. En el Convenio: <strong>${(typeof CONFIG !== 'undefined' && CONFIG.chikiPerInvocation) || 160} Chiki = 1 INV</strong> (botón +). Repetir frentes da menos, pero permite farmear. Tiradas Metaphor (rojas): +200 al cerrar cada apartado · +20 por repetir · +200 al vencer THE 50/50 (80 = hard pity). No se compran. El regalo sale en tu primer 7★ tras vencer a THE 50/50. THE 50/50 exige TODA la colección al máximo.</p>
                                <div class="arena-train-line">
                                    <span>CONSTELACIÓN</span>
                                    <b id="arena-train-stats">C0 · 0/0</b>
                                    <span class="arena-train-sep">4★ C6 · 5★ C3</span>
                                </div>
                            </div>
                        </div>

                        <nav class="arena-tabs" aria-label="Secciones">
                            <a class="arena-tab is-active" href="#arena-sec-story">Historia</a>
                            <a class="arena-tab" href="#arena-sec-archives">Archivos</a>
                        </nav>

                        <div class="arena-frame">
                            <section class="arena-block" id="arena-sec-story">
                                <div class="arena-block-head">
                                    <h2><span class="arena-chap">I</span> CRÓNICA DEL DESTINO</h2>
                                    <p class="arena-block-note">22 sellos en cadena. Cada combate: un enemigo y un mapa únicos. Sin refritos.</p>
                                </div>
                                <div class="arena-missions" id="arena-story"></div>
                            </section>

                            <section class="arena-block" id="arena-sec-archives">
                                <div class="arena-block-head">
                                    <h2><span class="arena-chap">II</span> ARCHIVOS DEL MULTIVERSO</h2>
                                    <p class="arena-block-note">Opcionales · también únicos · abren uno a uno. Primer clear = INV; repetir = Chiki.</p>
                                </div>
                                <div class="arena-missions arena-missions-grid" id="arena-archives"></div>
                            </section>
                        </div>
                    </div>
                </div>

                <div class="p5-ticker" aria-hidden="true"><span>TAKE YOUR HEART ✦ EL DESTINO NO SE ENTREGA · SE CONQUISTA ✦ THE 50/50 EXIGE LA COLECCIÓN COMPLETA ✦ REPETIR FRENTES DA CHIKI ✦&nbsp;</span></div>
            </div>
        `;
        return el;
    },

    gachaUnlocked() {
        return !!(GameState.get('prologueDone') || GameState.get('storyComplete') || GameState.get('gojoObtained') || GameState.get('bossDefeated'));
    },

    enter(el) {
        this._rootEl = el;
        GameState.set('prologueDone', true);
        this.refresh(el);
        this.bindResize();
        this.layoutFit();
        setTimeout(() => this.layoutFit(), 350);
        try {
            if (typeof AudioManager !== 'undefined' && AudioManager.setTheme) {
                AudioManager.setTheme('hunt');
            }
        } catch (_) { /* ignore */ }

        // Prefetch gacha plates while player is still in Arena
        try { GachaScene.preloadBannerAssets?.(); } catch (_) { /* ignore */ }

        if (typeof MotionFx !== 'undefined') {
            // Stagger runs in SceneManager.afterIn once the wipe reveals
        }

        el.querySelectorAll('.arena-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                el.querySelectorAll('.arena-tab').forEach(t => t.classList.remove('is-active'));
                tab.classList.add('is-active');
                const target = el.querySelector(tab.getAttribute('href'));
                el.querySelectorAll('.arena-block').forEach(b => b.classList.remove('is-shown'));
                if (target) {
                    target.classList.add('is-shown');
                    if (typeof MotionFx !== 'undefined' && MotionFx.softListIn) {
                        MotionFx.softListIn([...target.querySelectorAll('.arena-mission')]);
                    }
                    this.layoutFit();
                }
            });
        });
        el.querySelector('#arena-sec-story')?.classList.add('is-shown');

        el.querySelector('#arena-gacha')?.addEventListener('click', () => {
            AudioManager.ui.click();
            if (!this.gachaUnlocked()) {
                DialogueScene.open({
                    lines: [
                        { speaker: 'Sistema', text: 'El Convenio aún está sellado.' },
                        { speaker: 'Narrador', text: 'Derrota a THE 50/50 en Historia. Mientras tanto, gana combates únicos para acumular invocaciones.' }
                    ],
                    onComplete: () => {}
                });
                return;
            }
            GameState.set('storyComplete', true);
            try { GachaScene.preloadBannerAssets?.(); } catch (_) { /* ignore */ }
            SceneManager.goTo('gacha');
        });
        el.querySelector('#arena-gacha')?.addEventListener('pointerenter', () => {
            try { GachaScene.preloadBannerAssets?.(); } catch (_) { /* ignore */ }
        }, { once: true });

        el.querySelector('#arena-training')?.addEventListener('click', () => {
            AudioManager.ui.click();
            GameManager.startMission('training', 'training');
        });

        el.querySelector('#arena-dupes')?.addEventListener('click', () => {
            try { AudioManager.ui.click(); } catch (_) { /* ignore */ }
            this.openDupes(el);
        });

        el.querySelector('#arena-equipment')?.addEventListener('click', () => {
            try { AudioManager.ui.click(); } catch (_) { /* ignore */ }
            if (typeof EquipmentSystem !== 'undefined') EquipmentSystem.openMenu();
        });

        el.querySelector('#arena-tutorial')?.addEventListener('click', () => {
            try { AudioManager.ui.click(); } catch (_) { /* ignore */ }
            if (typeof TutorialSpotlight !== 'undefined') TutorialSpotlight.restart();
        });

        el.querySelector('#arena-achievements')?.addEventListener('click', () => {
            try { AudioManager.ui.click(); } catch (_) { /* ignore */ }
            if (typeof Achievements !== 'undefined' && Achievements.open) Achievements.open();
        });

        el.querySelector('#arena-reset')?.addEventListener('click', async () => {
            try { AudioManager.ui.click(); } catch (_) { /* ignore */ }
            const ok = typeof BattleUI !== 'undefined' && BattleUI.confirmDialog
                ? await BattleUI.confirmDialog({
                    kicker: 'REINICIO',
                    title: '¿BORRAR PROGRESO?',
                    body: 'Se borrará el progreso de arena y la partida se reiniciará. No se puede deshacer.',
                    confirmLabel: 'BORRAR Y REINICIAR',
                    cancelLabel: 'CANCELAR',
                    danger: true
                })
                : window.confirm('¿Borrar progreso de arena y reiniciar?');
            if (!ok) return;
            GameState.reset();
            location.reload();
        });

        // Tutorial extenso (blur + spotlight)
        setTimeout(() => {
            try { TutorialSpotlight?.onScene('arena'); } catch (_) { /* ignore */ }
        }, 480);
    },

    /** Fill the viewport exactly: measure chrome, stretch rows + rail. No scroll, no void. */
    layoutFit() {
        try {
            const el = this._rootEl;
            if (!el) return;
            const vh = window.innerHeight || 800;
            const h = (sel) => {
                const n = el.querySelector(sel);
                return n ? n.getBoundingClientRect().height : 0;
            };
            const chrome =
                h('.arena-topbar') + h('.arena-hero') + h('.arena-tabs') +
                h('.arena-block-head') + h('.p5-pager') + h('.p5-ticker') + 78;
            const avail = Math.max(0, vh - chrome);
            const rows = el.querySelectorAll('.arena-block.is-shown .arena-mission');
            if (rows.length) {
                const rowH = Math.max(44, Math.min(84, Math.floor(avail / rows.length)));
                rows.forEach((r) => { r.style.minHeight = `${rowH}px`; });
            }
            const rail = el.querySelectorAll('.p5-rail-item');
            if (rail.length) {
                const railH = (el.querySelector('.p5-rail')?.getBoundingClientRect().height) || 0;
                if (railH > 100) {
                    const itemH = Math.max(56, Math.floor(railH / rail.length) - 8);
                    rail.forEach((b) => { b.style.minHeight = `${itemH}px`; });
                }
            }
        } catch (_) { /* ignore */ }
    },

    bindResize() {
        this.unbindResize();
        this._resizeH = () => this.layoutFit();
        window.addEventListener('resize', this._resizeH);
    },

    unbindResize() {
        if (this._resizeH) {
            window.removeEventListener('resize', this._resizeH);
            this._resizeH = null;
        }
    },

    toast(el, msg) {
        let t = document.querySelector('.arena-toast');
        if (!t) {
            t = document.createElement('div');
            t.className = 'arena-toast';
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(t._timer);
        t._timer = setTimeout(() => t.classList.remove('show'), 1800);
    },

    rewardLabel(m) {
        const enc = BattleData.encounters[m.encounter];
        if (enc?.training || (enc?.rewardInvocations === 0 && !m.isFinal)) return 'TEST';
        // Never put CLEAR here — the stamp handles that (avoids double CLEAR).
        const rate = (typeof CONFIG !== 'undefined' && CONFIG.chikiPerInvocation) || 160;
        const meta = (typeof GachaRoster !== 'undefined' && GachaRoster.metaphorRewardFor)
            ? GachaRoster.metaphorRewardFor(m.id, m.encounter)
            : 0;
        const bossMeta = (typeof GachaRoster !== 'undefined' && GachaRoster.METAPHOR_BOSS)
            ? GachaRoster.METAPHOR_BOSS
            : 10;
        const pullValue = enc?.rewardInvocations ?? 1;
        const chiki = pullValue * rate;
        const chikiTxt = `+${chiki.toLocaleString('es-ES')} Chiki`;
        if (m.isFinal || enc?.isBoss) {
            return chiki > 0 ? `+${bossMeta} META · ${chikiTxt}` : `+${bossMeta} META`;
        }
        if (meta > 0) {
            return chiki > 0 ? `+${meta} META · ${chikiTxt}` : `+${meta} META`;
        }
        return chikiTxt;
    },

    isCleared(m) {
        if (!m) return false;
        if (m.flagClear) return !!GameState.flag(m.flagClear);
        return !!GameState.flag(`enc_cleared_${m.encounter}`);
    },

    /** Mission N locked until mission N-1 is cleared.
     *  STORY uses the day system (ChronicleData.storyLockAt): previous front
     *  + 3 unique archives per day. THE 50/50 also needs full collection. */
    isChainLocked(list, index, opts = {}) {
        if (index <= 0) return false;
        if (opts.dayLock && typeof ChronicleData !== 'undefined' && ChronicleData.storyLockAt) {
            return ChronicleData.storyLockAt(index).locked;
        }
        return !this.isCleared(list[index - 1]);
    },

    storyDayNote(list, index) {
        if (typeof ChronicleData === 'undefined' || !ChronicleData.storyLockAt) return null;
        const st = ChronicleData.storyLockAt(index);
        if (!st.locked) return null;
        const day = index + 1;
        if (st.reason === 'prev') return `DÍA ${day} · Supera el frente anterior para abrir el día.`;
        if (st.reason === 'sides') {
            const left = Math.max(0, (st.need || 0) - (st.have || 0));
            return `DÍA ${day} · Faltan ${left} archivo${left === 1 ? '' : 's'} (${st.have || 0}/${st.need || 0}) para abrir el día.`;
        }
        if (st.reason === 'collection') {
            const txt = (typeof GachaRoster !== 'undefined' && GachaRoster.bossRequirementText)
                ? GachaRoster.bossRequirementText() : 'Colección completa al máximo.';
            return `DÍA ${day} · ${txt}`;
        }
        return `DÍA ${day} · Sellado.`;
    },

    sealedTitle(m, index) {
        if (m.sealedTitle) return m.sealedTitle;
        const chapter = String(index + 1).padStart(2, '0');
        const raw = (m.title || '').split('·')[0].trim();
        const theme = raw
            .replace(/\b(práctica|practica|extra|jujutsu)\b/ig, '')
            .replace(/\s+/g, ' ')
            .trim();
        if (theme && theme.length >= 3 && !/the\s*50/i.test(theme)) {
            return `✦ ${theme.toUpperCase()} · ???`;
        }
        return `✦ ARCHIVO ${chapter} · ???`;
    },

    sealedBlurb(m) {
        if (m.sealedBlurb) return m.sealedBlurb;
        const lines = [
            'Señal cifrada. El velo no revela el rostro del enemigo.',
            'Destino oculto. Clarifica el frente anterior.',
            'El archivo está lacrado con cera de carmesí.',
            'Solo oyes pasos… sin nombre.'
        ];
        const i = Math.abs((m.id || m.title || '').length) % lines.length;
        return lines[i];
    },

    missionBtn(m, locked, index = 0, opts = {}) {
        const cleared = this.isCleared(m);
        const reward = this.rewardLabel(m);
        const num = String(index + 1).padStart(2, '0');
        const state = locked ? 'locked' : (cleared ? 'cleared' : 'ready');
        const title = locked ? this.sealedTitle(m, index) : m.title;
        let blurb = locked ? this.sealedBlurb(m) : m.blurb;
        if (locked && opts.dayLock) {
            const note = this.storyDayNote(opts.dayList || [], index);
            if (note) blurb = note;
        }
        // Enemy portrait once revealed (never while sealed).
        let art = '';
        let foeCount = 1;
        if (!locked) {
            try {
                const enc = (typeof BattleData !== 'undefined' && BattleData.encounters) || {};
                const foes = enc[m.encounter]?.enemies || [];
                foeCount = Math.max(1, foes.length);
                const foe = foes[0];
                if (foe?.id && typeof StagedSprites !== 'undefined' && StagedSprites.normalUrl) {
                    const url = StagedSprites.normalUrl(foe.id);
                    if (url) art = `<span class="am-art" aria-hidden="true" style="background-image:url('${url}')"></span>`;
                }
            } catch (_) { /* ignore */ }
        }
        const foeBadge = foeCount > 1 ? `<span class="am-foes" aria-hidden="true">⚔×${foeCount}</span>` : '';
        const dayBadge = opts.dayLock ? `<span class="am-day" aria-hidden="true">DÍA ${index + 1}</span>` : '';
        return `
            <button type="button" class="arena-mission ${state}"
                data-encounter="${m.encounter}" data-mission="${m.id}" ${locked ? 'disabled' : ''}
                style="--i:${index}"
                title="${locked ? 'Supera el combate anterior para romper el sello' : (m.title || '')}">
                <span class="am-index" aria-hidden="true">${num}</span>
                ${art}
                <span class="am-body">
                    <span class="am-top">
                        <span class="am-title">${dayBadge}${title}</span>
                <span class="am-top-end">
                        ${cleared && !locked ? '<span class="am-cleared-stamp" aria-hidden="true">CLEAR</span>' : ''}
                        ${locked ? '' : foeBadge}
                        ${locked
                            ? ''
                            : `<span class="am-reward${cleared ? ' is-farm' : ''}">${reward}</span>`}
                    </span>
                    </span>
                    <span class="am-blurb">${blurb}</span>
                </span>
                ${locked ? '<span class="am-seal" aria-hidden="true"><i></i><b>SIGILLUM</b></span>' : ''}
                <span class="am-edge" aria-hidden="true"></span>
            </button>
        `;
    },

    renderMissionList(list, opts = {}) {
        return list.map((m, i) => this.missionBtn(m, this.isChainLocked(list, i, opts), i)).join('');
    },

    /** Paginated missions — no page scroll, everything by clicks. */
    PAGE_SIZE: 9,

    renderMissionPage(list, page, opts = {}) {
        const total = Math.max(1, Math.ceil(list.length / this.PAGE_SIZE));
        const safe = Math.min(Math.max(0, page || 0), total - 1);
        const start = safe * this.PAGE_SIZE;
        const slice = list.slice(start, start + this.PAGE_SIZE);
        const key = opts.key || 'story';
        const pass = { ...opts, dayList: opts.dayLock ? list : undefined };
        const html = slice.map((m, k) => this.missionBtn(m, this.isChainLocked(list, start + k, pass), start + k, pass)).join('');
        const pager = total > 1 ? `
            <div class="p5-pager" role="navigation" aria-label="Páginas">
                <button type="button" class="p5-pager-btn" data-pg="${key}" data-dir="-1" ${safe <= 0 ? 'disabled' : ''} aria-label="Anterior">◀</button>
                <span class="p5-pager-info">${safe + 1} / ${total}</span>
                <button type="button" class="p5-pager-btn" data-pg="${key}" data-dir="1" ${safe >= total - 1 ? 'disabled' : ''} aria-label="Siguiente">▶</button>
            </div>` : '';
        return { html: html + pager, page: safe, total };
    },

    bindMissions(el) {
        el.querySelectorAll('.arena-mission:not([disabled])').forEach(btn => {
            btn.onclick = () => {
                AudioManager.ui.click();
                GameManager.startMission(btn.dataset.encounter, btn.dataset.mission);
            };
        });
        el.querySelectorAll('[data-pg]').forEach(btn => {
            btn.onclick = () => {
                AudioManager.ui.click();
                const key = btn.dataset.pg;
                const dir = parseInt(btn.dataset.dir || '1', 10) || 0;
                if (key === 'archives') this._archivePage = (this._archivePage || 0) + dir;
                else this._storyPage = (this._storyPage || 0) + dir;
                this.refresh(this._rootEl || el);
            };
        });
    },

    countUniqueClears() {
        const flags = GameState.get('storyFlags') || {};
        return Object.keys(flags).filter(k =>
            flags[k] && (k.endsWith('_cleared') || k.startsWith('enc_cleared_'))
        ).length;
    },

    refresh(el) {
        const wins = GameState.get('huntRunsCompleted') || 0;
        const inv = GameState.get('invocations') || 0;
        const set = (id, v) => { const n = el.querySelector(id); if (n) n.textContent = v; };
        set('#arena-wins', wins);
        try {
            const total = (typeof ChronicleData !== 'undefined' && ChronicleData.STORY)
                ? ChronicleData.STORY.length : 16;
            const day = (typeof ChronicleData !== 'undefined' && ChronicleData.currentDay)
                ? ChronicleData.currentDay() : 1;
            const sides = (typeof ChronicleData !== 'undefined' && ChronicleData.sideClears)
                ? ChronicleData.sideClears() : 0;
            set('#arena-date', `DÍA ${day}/${total}`);
            const sub = el.querySelector('.p5-date-sub');
            if (sub) sub.textContent = `${sides} archivos`;
            const dateBox = el.querySelector('.p5-date');
            if (dateBox) {
                dateBox.title = `Cada misión de historia es un día. Para abrir el siguiente día: supera el frente anterior + 3 archivos únicos por día (llevas ${sides}). Repetir no cuenta.`;
            }
        } catch (_) { /* ignore */ }
        set('#arena-inv', inv);
        set('#arena-meta', GameState.get('metaphorTickets') || 0);
        set('#arena-chiki', GameState.get('chikistrites') || 0);
        set('#arena-seals', GameState.get('starSeals') || 0);
        set('#arena-seals-5', GameState.get('starSeals5') || 0);
        set('#arena-seals-6', GameState.get('starSeals6') || 0);
        set('#arena-clears', this.countUniqueClears());
        try {
            const all = (typeof CONFIG !== 'undefined' && CONFIG.achievements) || [];
            const owned = (typeof Achievements !== 'undefined' && Achievements.unlockedList)
                ? Achievements.unlockedList() : [];
            set('#arena-ach-count', `${owned.length}/${all.length}`);
        } catch (_) { /* ignore */ }
        if (typeof CharProgress !== 'undefined') {
            CharProgress.ensure();
            const prog = CharProgress.collectionDupesProgress();
            const owned = (typeof GachaRoster !== 'undefined') ? GachaRoster.owned() : [];
            let maxC = 0;
            owned.forEach((id) => {
                maxC = Math.max(maxC, CharProgress.constellation(id));
            });
            set('#arena-train-stats', `C${maxC} · ${prog.have}/${prog.total}`);
        } else {
            set('#arena-train-stats', '4★ C6 · 5★ C3');
        }

        const open = this.gachaUnlocked();
        const gachaBtn = el.querySelector('#arena-gacha');
        const cta = el.querySelector('#arena-gacha-cta');
        const blurb = el.querySelector('#arena-gacha-blurb');
        if (gachaBtn) {
            gachaBtn.classList.toggle('locked', !open);
            gachaBtn.disabled = false;
            if (cta) {
                cta.textContent = open
                    ? `ENTRAR · ${inv} INV`
                    : 'SELLADO · VENCE A THE 50/50';
            }
            if (blurb) {
                blurb.textContent = open
                    ? `Tienes ${inv} INV. 4★ C0–C6 · 5★/6★ C0–C3. THE 50/50 exige colección completa al máximo.`
                    : `Acumula tiradas en combates nuevos. Ahora: ${inv}.`;
            }
        }

        const story = (typeof ChronicleData !== 'undefined')
            ? ChronicleData.storyMissionList()
            : [
                StoryData.missions.gate_zabuza,
                StoryData.missions.gate_akatsuki,
                StoryData.missions.gate_orochimaru,
                StoryData.missions.gate_alliance,
                StoryData.missions.gate_aizen,
                StoryData.missions.gate_final
            ].filter(Boolean);
        const storyR = this.renderMissionPage(story, this._storyPage || 0, { key: 'story', dayLock: true });
        el.querySelector('#arena-story').innerHTML = storyR.html;
        this._storyPage = storyR.page;

        const archivesHost = el.querySelector('#arena-archives');
        if (archivesHost) {
            const archives = (typeof ChronicleData !== 'undefined')
                ? ChronicleData.archiveMissionList()
                : [];
            const r = this.renderMissionPage(archives, this._archivePage || 0, { key: 'archives' });
            archivesHost.innerHTML = r.html;
            this._archivePage = r.page;
        }

        this.bindMissions(el);
        this.layoutFit();
    },

    openDupes() {
        if (typeof DupesShop !== 'undefined') DupesShop.open();
        else this.toast(this._rootEl, 'Tienda no disponible.');
    },

    closeDupes() {
        if (typeof DupesShop !== 'undefined') DupesShop.close();
    },

    exit() {
        this.unbindResize();
        if (typeof DupesShop !== 'undefined') DupesShop.close();
        if (typeof MotionFx !== 'undefined') MotionFx.killTracked();
    }
};
