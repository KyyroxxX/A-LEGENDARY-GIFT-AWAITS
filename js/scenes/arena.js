/**
 * Arena — Phantom Destiny command hub (Metaphor / convene-tier UI)
 */
const ArenaScene = {
    ART: 'assets/gacha/banners/metaphor-stage.webp?v=arena98',
    THUMB: 'assets/gacha/banners/metaphor-thumb.webp?v=arena98',

    render() {
        const el = document.createElement('div');
        el.className = 'arena-scene';
        el.innerHTML = `
            <div class="arena-bg" aria-hidden="true">
                <img class="arena-bg-art" src="${this.ART}" alt=""
                     onerror="this.style.display='none'">
                <div class="arena-bg-veil"></div>
                <div class="arena-bg-ink"></div>
                <div class="arena-bg-grain"></div>
            </div>

            <div class="arena-shell">
                <header class="arena-topbar">
                    <div class="arena-brand">
                        <img class="arena-brand-logo" src="assets/branding/app-logo.png?v=2" alt="Phantom Destiny" width="42" height="42" decoding="async">
                        <div>
                            <p class="arena-brand-kicker">PHANTOM DESTINY</p>
                            <h1 class="arena-brand-title">OPERATION CHIKITRISKIS</h1>
                        </div>
                    </div>
                    <div class="arena-currencies" aria-label="Recursos">
                        <div class="arena-chip arena-chip-inv">
                            <span class="arena-chip-ico arena-chip-inv-ico" aria-hidden="true"></span>
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
                            <span class="arena-chip-ico arena-chip-chiki" aria-hidden="true"></span>
                            <div>
                                <em>CHIKISTRITES</em>
                                <strong id="arena-chiki">0</strong>
                            </div>
                        </div>
                        <div class="arena-chip arena-chip-seal">
                            <span class="arena-chip-ico arena-chip-seal-ico" aria-hidden="true">✦</span>
                            <div>
                                <em>SELLOS 4★</em>
                                <strong id="arena-seals">0</strong>
                            </div>
                        </div>
                        <div class="arena-chip arena-chip-seal-5">
                            <span class="arena-chip-ico arena-chip-seal-5-ico" aria-hidden="true"></span>
                            <div>
                                <em>SELLOS 5★</em>
                                <strong id="arena-seals-5">0</strong>
                            </div>
                        </div>
                        <div class="arena-chip arena-chip-seal-6">
                            <span class="arena-chip-ico arena-chip-seal-6-ico" aria-hidden="true"></span>
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

                <div class="arena-hero">
                    <div class="arena-hero-copy">
                        <span class="arena-ribbon">CAMPAÑA LIMITADA</span>
                        <h2 class="arena-hero-title">
                            <span>LA CRÓNICA</span>
                            <span class="arena-hero-gold">DE LOS ELEGIDOS</span>
                        </h2>
                        <p class="arena-hero-sub">Combates por turnos · One Piece · Naruto · JoJo · Bleach · JJK</p>
                        <p class="arena-hero-hint">Combates → Chikistrites. En el Convenio: <strong>${(typeof CONFIG !== 'undefined' && CONFIG.chikiPerInvocation) || 160} Chiki = 1 INV</strong> (botón +). Repetir frentes da menos, pero permite farmear. Tiradas Metaphor (rojas): +14 al cerrar cada apartado · +10 al vencer THE 50/50 (80 = hard pity). No se compran.</p>
                        <div class="arena-train-line">
                            <span>CONSTELACIÓN</span>
                            <b id="arena-train-stats">C0 · 0/0</b>
                            <span class="arena-train-sep">4★ C6 · 5★ C3</span>
                        </div>
                    </div>

                    <div class="arena-hero-actions">
                        <button type="button" class="arena-portal" id="arena-gacha" aria-label="Abrir gacha">
                            <div class="arena-portal-art">
                                <img src="${this.THUMB}" alt=""
                                     onerror="this.src='${this.ART}'">
                                <div class="arena-portal-shine" aria-hidden="true"></div>
                            </div>
                            <div class="arena-portal-body">
                                <div class="agc-kicker">BANNER · EVENTO LIMITADO</div>
                                <h3 class="agc-title">${(typeof CONFIG !== 'undefined' && CONFIG.bannerName) || 'LA CRÓNICA DE LOS ELEGIDOS'}</h3>
                                <p class="agc-blurb" id="arena-gacha-blurb">Gana combates únicos → gasta tiradas aquí.</p>
                                <span class="agc-cta" id="arena-gacha-cta">ENTRAR AL CONVENIO</span>
                            </div>
                            <div class="arena-portal-stars" aria-hidden="true">★★★★★</div>
                        </button>

                        <button type="button" class="arena-sandbox" id="arena-training" aria-label="Abrir training">
                            <div class="atc-kicker">SANDBOX</div>
                            <h3 class="atc-title">TRAINING DUMMY</h3>
                            <p class="atc-blurb">Muñeco inerte · 1–3 chars · SP infinito · prueba voces y FX.</p>
                            <span class="atc-cta">ENTRAR</span>
                        </button>
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

                    <div class="arena-footer">
                        <button type="button" class="btn-destiny" id="arena-dupes">DUPES · TIENDA</button>
                        <button type="button" class="btn-secondary" id="arena-equipment">EQUIPAMIENTO 3★</button>
                        <button type="button" class="btn-secondary" id="arena-tutorial">TUTORIAL</button>
                        <button type="button" class="btn-secondary" id="arena-reset">RESET PARTIDA</button>
                    </div>
                </div>
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
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

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

    /** Mission N locked until mission N-1 is cleared. */
    isChainLocked(list, index, opts = {}) {
        if (index <= 0) return false;
        if (opts.allowGojoFinal && list[index]?.id === 'gate_final') {
            if (GameState.get('bossUnlockedByGojo') || GameState.get('gojoObtained')) return false;
        }
        return !this.isCleared(list[index - 1]);
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

    missionBtn(m, locked, index = 0) {
        const cleared = this.isCleared(m);
        const reward = this.rewardLabel(m);
        const num = String(index + 1).padStart(2, '0');
        const state = locked ? 'locked' : (cleared ? 'cleared' : 'ready');
        const title = locked ? this.sealedTitle(m, index) : m.title;
        const blurb = locked ? this.sealedBlurb(m) : m.blurb;
        return `
            <button type="button" class="arena-mission ${state}"
                data-encounter="${m.encounter}" data-mission="${m.id}" ${locked ? 'disabled' : ''}
                style="--i:${index}"
                title="${locked ? 'Supera el combate anterior para romper el sello' : (m.title || '')}">
                <span class="am-index" aria-hidden="true">${num}</span>
                <span class="am-body">
                    <span class="am-top">
                        <span class="am-title">${title}</span>
                        <span class="am-top-end">
                            ${cleared && !locked ? '<span class="am-cleared-stamp" aria-hidden="true">CLEAR</span>' : ''}
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

    bindMissions(el) {
        el.querySelectorAll('.arena-mission:not([disabled])').forEach(btn => {
            btn.onclick = () => {
                AudioManager.ui.click();
                GameManager.startMission(btn.dataset.encounter, btn.dataset.mission);
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
        set('#arena-inv', inv);
        set('#arena-meta', GameState.get('metaphorTickets') || 0);
        set('#arena-chiki', GameState.get('chikistrites') || 0);
        set('#arena-seals', GameState.get('starSeals') || 0);
        set('#arena-seals-5', GameState.get('starSeals5') || 0);
        set('#arena-seals-6', GameState.get('starSeals6') || 0);
        set('#arena-clears', this.countUniqueClears());
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
                    ? `Tienes ${inv} INV. 4★ C0–C6 · 5★ C0–C3. Gojo abre THE 50/50.`
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
        el.querySelector('#arena-story').innerHTML = this.renderMissionList(story, { allowGojoFinal: true });

        const archivesHost = el.querySelector('#arena-archives');
        if (archivesHost) {
            const archives = (typeof ChronicleData !== 'undefined')
                ? ChronicleData.archiveMissionList()
                : [];
            archivesHost.innerHTML = this.renderMissionList(archives);
        }

        this.bindMissions(el);
    },

    openDupes() {
        if (typeof DupesShop !== 'undefined') DupesShop.open();
        else this.toast(this._rootEl, 'Tienda no disponible.');
    },

    closeDupes() {
        if (typeof DupesShop !== 'undefined') DupesShop.close();
    },

    exit() {
        if (typeof DupesShop !== 'undefined') DupesShop.close();
        if (typeof MotionFx !== 'undefined') MotionFx.killTracked();
    }
};
