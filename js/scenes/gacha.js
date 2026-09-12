const GachaScene = {
    pulling: false,
    _timers: [],
    _rafs: [],
    _skipPull: false,
    _skipCascade: false,
    _skipSolo: false,
    _pullGoldSurprise: false,
    _freshHistoryCount: 0,
    _activeModal: null,
    _soloEl: null,
    _rootEl: null,
    _gsapTweens: [],

    /** Banner media — animated webp primary, convene key art static, gif/png fallbacks. */
    CACHE: 'arena258',
    activeBanner: 'onepiece', // onepiece|naruto|jojo|bleach|jjk|metaphor|wuwa|tof|genshin
    _bannerPreloadStarted: false,
    get META_TICKET() { return `assets/gacha/metaphor-ticket.svg?v=${this.CACHE}`; },
    get INV_GEM() { return `assets/gacha/invocacion-gem.svg?v=${this.CACHE}`; },
    get BANNER_WEBP() { return `assets/gacha/banner-legendary.webp?v=${this.CACHE}`; },
    get BANNER_GIF() { return `assets/gacha/banner-legendary.gif?v=${this.CACHE}`; },
    get BANNER_STATIC() { return `assets/gacha/convene-bg.webp?v=${this.CACHE}`; },
    get BANNER_STATIC_ALT() { return `assets/gacha/banner-legendary-static.webp?v=${this.CACHE}`; },
    get BANNER_STATIC_PNG() { return `assets/gacha/banner-legendary-static.png?v=${this.CACHE}`; },
    get BANNER_THUMB() { return `assets/gacha/banner-thumb.webp?v=${this.CACHE}`; },
    get INK_FRAME() { return `assets/gacha/ink-frame.png?v=${this.CACHE}`; },

    isEggBanner(id) {
        return id === 'wuwa' || id === 'tof' || id === 'genshin';
    },

    isSeriesBanner(id) {
        return !!(typeof GachaRoster !== 'undefined' && GachaRoster.BANNERS && GachaRoster.BANNERS[id]);
    },

    /** Warm only STAGE plates (thumbs are often 4K — never preload those). */
    preloadBannerAssets() {
        if (this._bannerPreloadStarted || typeof GachaRoster === 'undefined') return;
        this._bannerPreloadStarted = true;
        const urls = new Set();
        const push = (u) => {
            if (!u) return;
            // Skip known heavy portrait thumbs
            if (/thumb/i.test(u)) return;
            urls.add(`${u}${u.includes('?') ? '&' : '?'}v=${this.CACHE}`);
        };
        (GachaRoster.SERIES_ORDER || []).forEach((id) => {
            const b = GachaRoster.BANNERS[id];
            if (!b) return;
            push(b.art || b.banner);
        });
        // Prefer One Piece first (default banner)
        const ordered = [...urls];
        ordered.sort((a, b) => (a.includes('onepiece') ? -1 : b.includes('onepiece') ? 1 : 0));
        ordered.forEach((src, i) => {
            try {
                const img = new Image();
                img.decoding = 'async';
                if (i === 0) img.fetchPriority = 'high';
                img.src = src;
            } catch (_) { /* ignore */ }
        });
    },

    _thumbBlobCache: Object.create(null),

    /**
     * Downscale huge banner thumbs (e.g. 4K OP) to a rail-friendly bitmap.
     * Does NOT touch files under assets/gacha/banners/ — runtime only.
     */
    async bindLiteThumb(img, src, maxEdge = 420) {
        if (!img || !src) return;
        const key = `${src}|${maxEdge}`;
        if (this._thumbBlobCache[key]) {
            img.src = this._thumbBlobCache[key];
            return;
        }
        img.src = src; // show something immediately
        try {
            const full = new Image();
            full.decoding = 'async';
            full.src = src;
            await full.decode();
            const w = full.naturalWidth || 0;
            const h = full.naturalHeight || 0;
            if (!w || !h) return;
            if (Math.max(w, h) <= maxEdge * 1.25) {
                this._thumbBlobCache[key] = src;
                return;
            }
            const scale = maxEdge / Math.max(w, h);
            const cw = Math.max(1, Math.round(w * scale));
            const ch = Math.max(1, Math.round(h * scale));
            const canvas = document.createElement('canvas');
            canvas.width = cw;
            canvas.height = ch;
            const ctx = canvas.getContext('2d', { alpha: true });
            if (!ctx) return;
            ctx.drawImage(full, 0, 0, cw, ch);
            const blob = await new Promise((res) => canvas.toBlob(res, 'image/webp', 0.82));
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            this._thumbBlobCache[key] = url;
            if (img.isConnected) img.src = url;
        } catch (_) { /* keep full src */ }
    },

    hydrateThumbs(el) {
        const rail = el?.querySelector('.gw-thumbs') || el;
        if (!rail) return;
        rail.querySelectorAll('img[data-thumb-src]').forEach((img) => {
            const src = img.getAttribute('data-thumb-src');
            if (!src) return;
            // Active / near-top: hydrate now; others when idle
            const urgent = img.closest('.gw-thumb.is-active');
            const run = () => this.bindLiteThumb(img, src, 400);
            if (urgent) run();
            else if (typeof requestIdleCallback === 'function') {
                requestIdleCallback(() => run(), { timeout: 1200 });
            } else {
                setTimeout(run, 80 + Math.random() * 400);
            }
        });
    },

    /** Resolve when stage plate has pixels (or timeout) — used under wipe. */
    waitStageReady(el, timeoutMs = 420) {
        const still = el?.querySelector('#gw-banner-static');
        if (!still) return Promise.resolve();
        if (still.complete && still.naturalWidth > 0) {
            return still.decode?.().catch(() => {}) || Promise.resolve();
        }
        return new Promise((resolve) => {
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                resolve();
            };
            const t = setTimeout(finish, timeoutMs);
            still.addEventListener('load', () => {
                clearTimeout(t);
                if (still.decode) {
                    still.decode().then(finish).catch(finish);
                } else finish();
            }, { once: true });
            still.addEventListener('error', () => {
                clearTimeout(t);
                finish();
            }, { once: true });
        });
    },

    render() {
        if (typeof GachaRoster !== 'undefined') {
            GachaRoster.ensureOwnedState();
            GachaRoster.migrateIfNeeded?.();
        }
        const invocations = GameState.get('invocations') || 0;
        const metaTickets = GameState.get('metaphorTickets') || 0;
        const starSeals = GameState.get('starSeals') || 0;
        const chiki = GameState.get('chikistrites') || 0;
        const progress = GachaRoster.collectionProgress();
        const currency = CONFIG.currencyName || 'Chikistrites';
        const rate = (typeof CONFIG !== 'undefined' && CONFIG.chikiPerInvocation) || 160;
        const op = GachaRoster.BANNERS.onepiece;
        const featuredStars = this.featuredStarsFor(op);
        const featuredLabel = op.featuredNote;
        const leftCopy = `${invocations} INV · ${chiki.toLocaleString('es-ES')} ${currency} · ${metaTickets} Metaphor`;
        const startArt = `${op.banner || op.art}?v=${this.CACHE}`;

        const seriesThumbs = GachaRoster.SERIES_ORDER.map((id) => {
            const b = GachaRoster.BANNERS[id];
            const locked = !GachaRoster.isBannerUnlocked(id);
            const active = id === 'onepiece' ? ' is-active' : '';
            const lockCls = locked ? ' is-locked' : '';
            return `
                    <button type="button" class="gw-thumb${active}${lockCls}" data-banner="${id}" title="${b.featured}${locked ? ' · SELLADO · Gojo → THE 50/50' : ''}" ${locked ? 'aria-disabled="true"' : ''}>
                        <span class="gw-thumb-tag">${b.tag}</span>
                        <img data-thumb-src="${b.thumb}?v=${this.CACHE}" alt="${b.featured}"
                             width="120" height="160"
                             decoding="async"
                             loading="lazy"
                             onerror="this.onerror=null;this.src='${this.BANNER_STATIC}'">
                        ${locked ? '<span class="gw-thumb-lock" aria-hidden="true"><i></i><b>SELLADO</b></span>' : ''}
                        <span class="gw-thumb-name">${b.short === 'Metaphor' ? 'Metaphor' : (b.featured.length > 14 ? b.featured.split(' ').slice(-1)[0] : b.featured)}</span>
                        <span class="gw-thumb-game">${locked ? 'Gojo → 50/50' : b.series}</span>
                    </button>`;
        }).join('');

        const el = document.createElement('div');
        el.className = 'scene gacha-scene active mx-booting';
        el.innerHTML = `
            <div class="gacha-wuwa gacha-meta gw-boot" id="gacha-wuwa" data-series="onepiece">
                <div class="gw-art" aria-hidden="true">
                    <div class="gw-banner-fallback" id="gw-fallback"></div>
                    <div class="gw-silhouette" id="gw-silhouette"></div>
                    <picture style="display:none">
                        <!-- Metaphor media is lazy — do not fetch GIF/WEBP until that banner opens -->
                        <source data-kind="gif-webp" type="image/webp">
                        <img class="gw-banner-media is-hidden"
                             data-kind="gif"
                             id="gw-banner-gif"
                             alt=""
                             decoding="async">
                    </picture>
                    <picture class="gw-static-pic">
                        <source srcset="${startArt}" type="image/webp">
                        <img class="gw-banner-media is-loaded"
                             data-kind="static"
                             id="gw-banner-static"
                             src="${startArt}"
                             alt=""
                             decoding="async"
                             fetchpriority="high"
                             style="opacity:1;object-fit:cover">
                    </picture>
                    <div class="gw-overlay gw-fog"></div>
                    <div class="gw-overlay gw-stars"></div>
                    <div class="gw-overlay gw-glow"></div>
                    <div class="gw-overlay gw-drift" aria-hidden="true"></div>
                    <div class="gw-overlay gw-rays" aria-hidden="true"></div>
                    <div class="gw-motes" id="gw-motes" aria-hidden="true"></div>
                    <div class="gw-sweep" aria-hidden="true"></div>
                    <img class="gw-ink" src="${this.INK_FRAME}" alt="" decoding="async">
                    <div class="gw-ink-css" aria-hidden="true"></div>
                </div>

                <header class="gw-topbar gw-layer gw-boot-layer">
                    <div class="gw-brand">
                        <span class="gw-brand-star" aria-hidden="true">✦</span>
                        Convocatoria
                    </div>
                    <div class="gw-dedication" aria-label="Dedicatoria">
                        <span class="gw-dedication-mark" aria-hidden="true">✦</span>
                        <div class="gw-dedication-copy">
                            <span class="gw-dedication-kicker">El mundo te espera</span>
                            <strong class="gw-dedication-name">Chikiwitina · Chikitriskis</strong>
                        </div>
                        <span class="gw-dedication-mark" aria-hidden="true">✦</span>
                    </div>
                    <div class="gw-currencies">
                        <div class="gw-currency" title="Invocaciones · banners anime (1 tirada)">
                            <div class="gw-currency-gem" aria-hidden="true"></div>
                            <span class="gw-currency-value" id="gacha-invocations">${invocations}</span>
                            <button type="button" class="gw-currency-plus" data-currency-plus="inv" title="Convertir Chikistrites → INV" aria-label="Comprar invocaciones">+</button>
                        </div>
                        <div class="gw-currency gw-currency-chiki" title="${currency} · ${rate} = 1 INV">
                            <div class="gw-currency-orb" aria-hidden="true"></div>
                            <span class="gw-currency-value" id="gacha-chikistrites">${chiki.toLocaleString('es-ES')}</span>
                        </div>
                        <div class="gw-currency gw-currency-meta" title="Tiradas Metaphor (rojas) · no se compran">
                            <div class="gw-currency-ticket" aria-hidden="true"></div>
                            <span class="gw-currency-value" id="gacha-meta-tickets">${metaTickets}</span>
                            <button type="button" class="gw-currency-plus" data-currency-plus="meta" title="Cómo conseguir Metaphor" aria-label="Cómo conseguir tiradas Metaphor">+</button>
                        </div>
                        <div class="gw-currency gw-currency-seal" id="gacha-open-dupes" title="Sellos Estelares · abrir tienda de dupes" role="button" tabindex="0">
                            <div class="gw-currency-seal-ico" aria-hidden="true">✦</div>
                            <span class="gw-currency-value" id="gacha-star-seals">${starSeals}</span>
                            <button type="button" class="gw-currency-plus" data-currency-plus="seal" title="Tienda Estelar" aria-label="Abrir tienda de sellos">+</button>
                        </div>
                    </div>
                </header>

                <aside class="gw-rail gw-layer gw-boot-layer">
                    ${seriesThumbs}
                    <button type="button" class="gw-thumb" data-banner="wuwa" title="Luuk Herssen · Wuthering Waves">
                        <span class="gw-thumb-tag">WuWa</span>
                        <img data-thumb-src="assets/gacha/egg/wuwa-thumb.webp?v=${this.CACHE}" alt="Luuk Herssen" width="120" height="160" decoding="async" loading="lazy">
                        <span class="gw-thumb-name">Luuk Herssen</span>
                        <span class="gw-thumb-game">Wuthering Waves</span>
                    </button>
                    <button type="button" class="gw-thumb" data-banner="tof" title="Frigg · Tower of Fantasy">
                        <span class="gw-thumb-tag">ToF</span>
                        <img data-thumb-src="assets/gacha/egg/tof-thumb.webp?v=${this.CACHE}" alt="Frigg" width="120" height="160" decoding="async" loading="lazy">
                        <span class="gw-thumb-name">Frigg</span>
                        <span class="gw-thumb-game">Tower of Fantasy</span>
                    </button>
                    <button type="button" class="gw-thumb" data-banner="genshin" title="Arataki Itto · Genshin">
                        <span class="gw-thumb-tag">Genshin</span>
                        <img data-thumb-src="assets/gacha/egg/genshin-thumb.webp?v=${this.CACHE}" alt="Arataki Itto" width="120" height="160" decoding="async" loading="lazy">
                        <span class="gw-thumb-name">Arataki Itto</span>
                        <span class="gw-thumb-game">Genshin Impact</span>
                    </button>
                    <div class="gw-rail-tools">
                        <button type="button" class="gw-rail-tool" id="btn-gacha-dupes" title="Tienda Estelar">
                            <span class="gw-tool-ico" aria-hidden="true">✦</span>
                            <span>DUPES</span>
                        </button>
                        <button type="button" class="gw-rail-tool" id="btn-gacha-details" title="Detalles">
                            <span class="gw-tool-ico" aria-hidden="true">?</span>
                            <span>DETALLES</span>
                        </button>
                        <button type="button" class="gw-rail-tool" id="btn-gacha-history" title="Historial">
                            <span class="gw-tool-ico" aria-hidden="true">●</span>
                            <span>HISTORIAL</span>
                        </button>
                    </div>
                    <div class="gw-rail-foot">
                        <span class="gw-rail-foot-ico" aria-hidden="true">✦</span>
                        <div>
                            <strong>Tiempo restante</strong>
                            <p>Hasta que dejes de ser una chikitriskis.</p>
                        </div>
                    </div>
                </aside>

                <div class="gw-copy gw-layer gw-boot-layer">
                    <span class="gw-event-ribbon">${op.tag}</span>
                    <h2 class="gw-title">
                        <span class="gw-title-line">${op.titleLines[0]}</span>
                        <span class="gw-title-gold">${op.titleLines[1]}<span class="gw-title-glint" aria-hidden="true">✦</span></span>
                    </h2>
                    <p class="gw-sub">${op.subtitle}</p>
                    <div class="gw-rate">
                        <span class="gw-rate-star" aria-hidden="true">✦</span>
                        <div>
                            <div class="gw-rate-row">
                                <span>Destacado</span>
                                <span class="gw-stars-row">${'★'.repeat(featuredStars)}</span>
                            </div>
                            <p class="gw-rate-note" id="gw-featured-label">${featuredLabel}</p>
                            <p class="gw-left-note" id="gacha-left">${leftCopy}</p>
                        </div>
                    </div>
                </div>

                <div class="gw-reward gw-layer gw-boot-layer" aria-label="Recompensa destacada">
                    <div class="gw-reward-glow" aria-hidden="true"></div>
                    <div class="gw-reward-sil has-egg-art" aria-hidden="true" style="background-image:url('${op.art || op.banner}?v=${this.CACHE}');background-size:cover;background-position:50% 18%">
                        <span class="gw-reward-body"></span>
                        <span class="gw-reward-q">?</span>
                    </div>
                    <div class="gw-reward-banner">
                        <span class="gw-reward-k"><span aria-hidden="true">✦</span> Destacado ${featuredStars}★</span>
                        <strong class="gw-reward-v" id="hl-pulls">${op.featured}</strong>
                        <span class="gw-stars-row gw-reward-stars">${'★'.repeat(featuredStars)}</span>
                    </div>
                    <div class="gw-cost-pill gw-reward-chip" id="gw-cost-chip" title="${currency}">
                        <div class="gw-currency-gem sm" aria-hidden="true"></div>
                        <span id="gw-cost-chip-label">${currency}</span>
                        <strong id="gacha-invocations-dock">${invocations}</strong>
                    </div>
                </div>

                <footer class="gw-dock gw-layer gw-boot-layer">
                    <div class="gw-pity-wrap">
                        <div class="gw-pity-head">
                            <span class="gw-progress-label" id="gacha-pity">Garantía 5★</span>
                            <span class="gw-progress-sub" id="gacha-pity-count">0 / ${op.hard5}</span>
                        </div>
                        <div class="gw-pity-bar">
                            <div class="gw-pity-fill" id="pity-fill" style="width:0%"></div>
                        </div>
                        <p class="gw-pity-hint" id="gacha-pity-hint">5★ garantizado en ${op.hard5} · sube desde ${op.soft5}</p>
                    </div>
                    <div class="gw-dock-tools" aria-label="Herramientas">
                        <button type="button" class="gw-tool" id="btn-dock-dupes" title="Tienda Estelar">
                            <span class="gw-tool-ico" aria-hidden="true">✦</span>
                            <span>DUPES</span>
                        </button>
                        <button type="button" class="gw-tool" id="btn-dock-details" title="Detalles">
                            <span class="gw-tool-ico" aria-hidden="true">?</span>
                            <span>INFO</span>
                        </button>
                        <button type="button" class="gw-tool" id="btn-dock-history" title="Historial">
                            <span class="gw-tool-ico" aria-hidden="true">●</span>
                            <span>LOG</span>
                        </button>
                    </div>
                    <div class="gw-controls">
                        <button class="btn-convene single" id="btn-pull-1" ${invocations < 1 ? 'disabled' : ''}>
                            <span class="convene-label">Invocar</span>
                            <span class="convene-cost" data-cost="1">
                                <span class="convene-gem" aria-hidden="true"></span>
                                <strong>×1</strong>
                            </span>
                        </button>
                        <button class="btn-convene multi" id="btn-pull-10" ${invocations < 10 ? 'disabled' : ''}>
                            <span class="convene-label">Invocar</span>
                            <span class="convene-cost" data-cost="10">
                                <span class="convene-gem" aria-hidden="true"></span>
                                <strong>×10</strong>
                            </span>
                        </button>
                        <button class="btn-secondary gw-back" id="btn-back-hunt">${GameState.get('bossDefeated') ? 'VOLVER' : 'COMBATE'}</button>
                    </div>
                </footer>

                <div class="gw-backdrop" id="gw-backdrop"></div>

                <aside class="gw-panel" id="panel-details" aria-hidden="true">
                    <div class="gw-panel-head">
                        <h3 class="gw-panel-title">DETALLES</h3>
                        <button type="button" class="gw-panel-close" data-close-panel>CERRAR</button>
                    </div>
                    <div class="gw-panel-body">
                        <p><strong>Banners por anime.</strong> 5★ ~2% · sube desde ${op.soft5} · garantizado en ${op.hard5} · destacado 70%.</p>
                        <p>Desde la invocación <strong>${op.soft5}</strong> la probabilidad de 5★ sube progresivamente. En la <strong>${op.hard5}</strong> está garantizado.</p>
                        <ul>
                            <li>Combates dan <strong>Chikistrites</strong>. En el Convenio: <strong>${(typeof CONFIG !== 'undefined' && CONFIG.chikiPerInvocation) || 160} Chiki = 1 INV</strong> (botón +).</li>
                            <li>Dupes → <strong>4★ C0–C6</strong> · <strong>5★/6★ C0–C3</strong> (sube poder; 6★ domina el techo).</li>
                            <li>4★ max → +1 sello · 5★ C3 → +1 sello · 6★ C3 → +2 sellos. Canjea en <strong>DUPES</strong>.</li>
                            <li>Metaphor (rojas): +14 por apartado · +10 THE 50/50 · no se compran.</li>
                            <li>Presupuesto ~2.8k INV (vía Chikistrites) para completar el roster.</li>
                            <li><strong>Gojo</strong> abre THE 50/50. Metaphor es late-game.</li>
                            <li>~${GachaRoster.totalPullsRequired()} invocaciones de presupuesto.</li>
                        </ul>
                        <p>Garantía 5★: <strong id="details-pity">0</strong> / ${op.hard5}</p>
                    </div>
                </aside>

                <aside class="gw-panel" id="panel-history" aria-hidden="true">
                    <div class="gw-panel-head">
                        <h3 class="gw-panel-title">HISTORIAL</h3>
                        <button type="button" class="gw-panel-close" data-close-panel>CERRAR</button>
                    </div>
                    <div class="gw-panel-body">
                        <div class="pull-history" id="pull-history">
                            <p style="opacity:0.65">Aún no hay tiradas en este banner.</p>
                        </div>
                    </div>
                </aside>
            </div>
            <button class="hidden-star" style="top:5%;left:5%;" data-egg="rng" type="button">✦</button>
            <button class="hidden-star" style="bottom:5%;right:5%;" data-egg="wallet" type="button">✦</button>
        `;
        return el;
    },

    starsFor(rarity) {
        return {
            common: '★★★',
            rare: '★★★★',
            epic: '★★★★★',
            mythic: '★★★★★★',
            legendary: '★★★★★★★',
            celestial: '★★★★★★★'
        }[rarity] || '★★★';
    },

    featuredStarsFor(b) {
        if (!b) return 5;
        if (b.isMetaphor) return 7;
        if (b.featuredStars) return b.featuredStars;
        if (b.featuredId && typeof GachaRoster !== 'undefined' && GachaRoster.bannerStars) {
            const stars = GachaRoster.bannerStars(b.featuredId);
            if (stars.length) return Math.max(...stars);
        }
        return 5;
    },

    pityHintText(b, st) {
        if (!b || !st) return '';
        if (b.isMetaphor) {
            const p7 = st.pity7 || 0;
            const soft = b.soft7 || 50;
            const hard = b.hard7 || 80;
            if (GameState.get('legendaryObtained')) return 'Metaphor obtenido · garantía congelada';
            if (p7 + 1 >= hard) return '7★ CELESTIAL GARANTIZADO en la próxima tirada';
            if (p7 >= soft) return `Garantía suave 7★ · bloqueado en ${hard - p7} tirada${hard - p7 === 1 ? '' : 's'}`;
            return `7★ celestial en ${hard} · sube desde ${soft}`;
        }
        const p6 = st.pity6 || 0;
        const soft6 = b.soft6 || 55;
        const hard6 = b.hard6 || 80;
        const p5 = st.pity5 || 0;
        const soft = b.soft5 || 35;
        const hard = b.hard5 || 50;
        if (p6 + 1 >= hard6) return '6★ MÍTICO GARANTIZADO en la próxima invocación';
        if (p6 >= soft6) return `Garantía suave 6★ (+prob.) · bloqueado en ${hard6 - p6}`;
        if (p5 + 1 >= hard) return '5★ GARANTIZADO en la próxima invocación';
        if (p5 >= soft) {
            const left = hard - p5;
            return `Garantía suave 5★ · bloqueado en ${left} · 6★ hard ${hard6}`;
        }
        return `6★ ${hard6} (soft ${soft6}) · 5★ ${hard} (soft ${soft})`;
    },

    resultMetaLabel(r) {
        if (!r) return '';
        if (r.egg) return `${(r.game || 'EASTER EGG').toUpperCase()} · NO JUGABLE`;
        if (r.kind === 'converted' || r.converted) {
            return `CONVERTIDO · ${(r.convertLabel || 'RECURSO').toUpperCase()}`;
        }
        if (r.kind === 'gojo') return '6★ MÍTICO · 50/50';
        if (r.kind === 'legendary' || r.metaphor) return '7★ CELESTIAL · STEAM';
        if (r.rarity === 'mythic' || (r.stars || 0) >= 6) return '6★ MÍTICO';
        if (r.rarity === 'celestial') return '7★ CELESTIAL';
        if (r.kind === 'star_seal') return 'SELLO ESTELAR';
        if (r.kind === 'inv_refund') return '+INV';
        if (r.kind === 'equipment') return 'OBJETO EQUIPABLE · 3★';
        if (r.kind === 'dupe' || r.dupe) return `DUPLICADO · C${r.constellation ?? r.constellationAfter ?? '?'}`;
        if (r.kind === 'shard') return 'ECO';
        if (r.charId && typeof GachaRoster !== 'undefined' && GachaRoster.isDualRarity?.(r.charId)) {
            return r.fromEnemy ? `${GachaRoster.starsLabel(r.charId)} · EX` : GachaRoster.starsLabel(r.charId);
        }
        if (r.fromEnemy) return 'ENEMIGO JUGABLE';
        return (r.series || r.rarity || '').toString().toUpperCase();
    },

    resultOutcome(r) {
        if (!r) return { kind: 'neutral', label: '' };
        if (r.kind === 'converted' || r.converted) {
            return { kind: 'converted', label: (r.convertLabel || 'CONVERTIDO').toUpperCase() };
        }
        if (r.kind === 'dupe' || r.dupe) {
            const constellation = r.constellation ?? r.constellationAfter ?? '?';
            return { kind: 'dupe', label: `DUPLICADO · CONSTELACIÓN C${constellation}` };
        }
        if (r.kind === 'star_seal' || r.starSeals) {
            const amount = r.starSeals || 1;
            return { kind: 'currency', label: `+${amount} SELLO ${r.stars || 4}★ · TIENDA DE DUPES` };
        }
        if (r.kind === 'inv_refund' || r.refundInv) {
            const amount = r.refundInv || 1;
            return { kind: 'currency', label: `+${amount} INVOCACIÓN` };
        }
        if (r.kind === 'shard') return { kind: 'currency', label: (r.reward || 'ECO').toUpperCase() };
        if (r.kind === 'equipment') return { kind: 'equipment', label: 'OBJETO EQUIPABLE · EQUÍPALO EN LA ARENA' };
        if (r.charId) return { kind: 'new', label: 'NUEVO PERSONAJE' };
        return { kind: 'neutral', label: '' };
    },

    cutinVideoCandidates(r) {
        if (!r?.charId || !this.isFiveStarResult(r)) return [];
        const tier = this.isMythicResult(r) ? '6star' : '5star';
        const base = `assets/gacha/cutin-videos/${tier}/${encodeURIComponent(r.charId)}`;
        return [`${base}.mp4?v=${this.CACHE}`, `${base}.webm?v=${this.CACHE}`];
    },

    cutinBridgeVideo(r) {
        if (!r?.charId || !this.isFiveStarResult(r)) return '';
        return this.isMythicResult(r)
            ? `assets/gacha/pull-videos/wuwa-bridge-red.mp4?v=${this.CACHE}`
            : `assets/gacha/pull-videos/wuwa-bridge-gold.mp4?v=${this.CACHE}`;
    },

    cutinSeenState() {
        const seen = GameState.get('gachaCutinsSeen');
        return seen && typeof seen === 'object' ? seen : {};
    },

    hasSeenCutin(charId) {
        return !!(charId && this.cutinSeenState()[charId]);
    },

    markCutinSeen(charId) {
        if (!charId) return;
        const seen = this.cutinSeenState();
        if (seen[charId]) return;
        GameState.set('gachaCutinsSeen', { ...seen, [charId]: true });
    },

    async playCharacterCutin(r, host) {
        const candidates = this.cutinVideoCandidates(r);
        if (!candidates.length) return false;
        host?.classList.add('is-cutin-host-hidden');
        await this.playCutinBridge(r);
        const firstObtain = !this.hasSeenCutin(r.charId);
        const outcome = this.resultOutcome(r);

        const cutin = document.createElement('div');
        const auraTier = this.isMythicResult(r) ? 'mythic' : 'legendary';
        cutin.className = `pull-character-cutin rarity-${r.rarity || 'epic'} aura-${auraTier}${firstObtain ? ' is-first-obtain' : ''} is-loading`;
        cutin.innerHTML = `
            <div class="pull-character-cutin-backdrop" aria-hidden="true"></div>
            <div class="pull-character-cutin-frame">
                <div class="pull-character-cutin-kicker">${firstObtain ? 'PRIMERA OBTENCIÓN' : (outcome.label || 'REPETICIÓN')} · ${this.isMythicResult(r) ? '6★' : '5★'}</div>
                <video class="pull-character-cutin-video" playsinline preload="auto"></video>
                <div class="pull-character-cutin-stars">${this.starsFor(this.isMythicResult(r) ? 'mythic' : 'epic')}</div>
                <div class="pull-character-cutin-caption">${r.reward || this.displayName(r.charId)}</div>
                <div class="pull-character-cutin-result">${outcome.label || this.resultMetaLabel(r)}</div>
                ${firstObtain
                    ? '<div class="pull-character-cutin-required">VÍDEO DE OBTENCIÓN · NO SE PUEDE SALTAR</div>'
                    : '<button type="button" class="pull-character-cutin-skip">SALTAR VÍDEO</button>'}
            </div>`;
        document.body.appendChild(cutin);
        cutin.classList.add('is-on');
        const video = cutin.querySelector('video');
        const skip = cutin.querySelector('button');
        let candidateIndex = 0;
        let settled = false;
        let timer = null;

        return new Promise((resolve) => {
        const finish = (played) => {
                if (settled) return;
                settled = true;
                if (timer) clearTimeout(timer);
                video?.pause();
                try {
                    const normal = Number.isFinite(AudioManager?._conveneMusicNorm)
                        ? AudioManager._conveneMusicNorm
                        : 1;
                    AudioManager?._fadeMusicTo?.(Math.max(0.28, normal * 0.42), 260);
                } catch (_) { /* */ }
                if (played) this.markCutinSeen(r.charId);
                cutin.classList.remove('is-on');
                host?.classList.remove('is-cutin-host-hidden');
                const removeTimer = setTimeout(() => cutin.remove(), 180);
                this._timers.push(removeTimer);
                resolve(played);
            };
            const loadCandidate = () => {
                if (!video || candidateIndex >= candidates.length) {
                    finish(false);
                    return;
                }
                video.src = candidates[candidateIndex++];
                video.load();
            };
            const start = () => {
                if (settled) return;
                cutin.classList.remove('is-loading');
                cutin.classList.add('is-ready');
                try {
                    const normal = Number.isFinite(AudioManager?._conveneMusicNorm)
                        ? AudioManager._conveneMusicNorm
                        : 1;
                    AudioManager?._fadeMusicTo?.(Math.max(0.025, normal * 0.08), 180);
                } catch (_) { /* */ }
                video.volume = 0.92;
                video.muted = false;
                video.play().catch(() => {
                    video.muted = true;
                    video.play().catch(() => {});
                });
                const duration = Number.isFinite(video.duration) && video.duration > 0
                    ? Math.ceil(video.duration * 1000) + 650
                    : 120000;
                timer = setTimeout(() => finish(true), duration);
            };
            video?.addEventListener('loadeddata', start, { once: true });
            video?.addEventListener('error', () => {
                if (candidateIndex < candidates.length) loadCandidate();
                else finish(false);
            });
            video?.addEventListener('ended', () => {
                finish(true);
            });
            skip?.addEventListener('click', (event) => {
                event.stopPropagation();
                finish(true);
            });
            loadCandidate();
        });
    },

    async playCutinBridge(r) {
        const source = this.cutinBridgeVideo(r);
        if (!source) return false;
        const bridge = document.createElement('div');
        bridge.className = 'pull-cutin-bridge is-on is-loading';
        bridge.innerHTML = `<video playsinline preload="auto"></video>`;
        document.body.appendChild(bridge);
        const video = bridge.querySelector('video');
        let settled = false;
        let timer = null;
        let endHold = null;
        const normalMusic = Number.isFinite(AudioManager?._conveneMusicNorm)
            ? AudioManager._conveneMusicNorm
            : 1;
        try { AudioManager._fadeMusicTo?.(0.03, 180); } catch (_) { /* */ }

        return new Promise((resolve) => {
            const finish = () => {
                if (settled) return;
                settled = true;
                if (timer) clearTimeout(timer);
                if (endHold) clearTimeout(endHold);
                video?.pause();
                bridge.classList.remove('is-on');
                const removeTimer = setTimeout(() => {
                    video?.removeAttribute('src');
                    video?.load();
                    bridge.remove();
                }, 180);
                this._timers.push(removeTimer);
                try { AudioManager._fadeMusicTo?.(Math.max(0.12, normalMusic * 0.18), 180); } catch (_) { /* */ }
                resolve(true);
            };
            video.onended = () => {
                if (settled || endHold) return;
                endHold = setTimeout(finish, 220);
            };
            video.onerror = finish;
            video.oncanplay = () => {
                bridge.classList.remove('is-loading');
                bridge.classList.add('is-ready');
                const playback = video.play();
                if (playback?.catch) playback.catch(() => {
                    video.muted = true;
                    video.play().catch(finish);
                });
            };
            video.src = source;
            video.load();
            timer = setTimeout(finish, 5000);
        });
    },


    enter(el) {
        this._rootEl = el;
        const unlocked = !!(GameState.get('prologueDone')
            || GameState.get('storyComplete')
            || GameState.get('legendaryObtained')
            || GameState.get('gojoObtained'));
        if (!unlocked) {
            DialogueScene.open({
                lines: [
                    { speaker: 'Sistema', text: 'El Convenio aún no está abierto.' },
                    { speaker: 'Narrador', text: 'Hay un banner por anime. Gojo en JJK abre THE 50/50. Metaphor es late-game tras el boss.' }
                ],
                onComplete: () => SceneManager.goTo('arena')
            });
            return;
        }
        GachaRoster.ensureOwnedState();
        this.wireBannerMedia(el);
        this.refreshStats(el);

        this.activeBanner = 'onepiece';
        this.setGachaMusic('onepiece');
        el.querySelectorAll('[data-banner]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.pulling) return;
                const id = btn.dataset.banner;
                if (this.isSeriesBanner(id) && !GachaRoster.isBannerUnlocked(id)) {
                    AudioManager.ui.click();
                    this.showEgg('Metaphor sellado. Consigue a Gojo y derrota THE 50/50 para abrir el banner rojo.');
                    return;
                }
                AudioManager.ui.click();
                this.switchBanner(el, id);
            });
        });
        this.switchBanner(el, 'onepiece', { instant: true });
        // Defer ambient FX + thumb downscales until after first paint (avoids entry hitch)
        const deferFx = () => {
            this.seedBannerMotes(el);
            this.hydrateThumbs(el);
        };
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(() => setTimeout(deferFx, 40));
        } else {
            setTimeout(deferFx, 60);
        }

        // Reveal polish runs from SceneManager.afterIn (MotionFx.revealGacha)
        // so we never flash Metaphor → series while visible.

        el.querySelector('#btn-pull-1')?.addEventListener('click', () => this.doPulls(el, 1));
        el.querySelector('#btn-pull-10')?.addEventListener('click', () => this.doPulls(el, 10));
        el.querySelector('#btn-back-hunt')?.addEventListener('click', () => {
            if (this.pulling) return;
            AudioManager.ui.click();
            SceneManager.goTo('arena');
        });

        setTimeout(() => {
            try { TutorialSpotlight?.onScene('gacha'); } catch (_) { /* ignore */ }
        }, 600);
        el.querySelector('#btn-gacha-details')?.addEventListener('click', () => this.openPanel(el, 'details'));
        el.querySelector('#btn-gacha-history')?.addEventListener('click', () => this.openPanel(el, 'history'));
        el.querySelector('#btn-gacha-dupes')?.addEventListener('click', () => {
            if (this.pulling) return;
            try { AudioManager.ui.click(); } catch (_) { /* ignore */ }
            if (typeof DupesShop !== 'undefined') DupesShop.open();
            else this.showEgg('Tienda Estelar no disponible.');
        });
        const openDupes = () => {
            if (this.pulling) return;
            if (typeof DupesShop !== 'undefined') DupesShop.open();
        };
        el.querySelector('#gacha-open-dupes')?.addEventListener('click', (e) => {
            if (e.target.closest('[data-currency-plus]')) return;
            try { AudioManager.ui.click(); } catch (_) { /* ignore */ }
            openDupes();
        });
        el.querySelector('#gacha-open-dupes')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openDupes();
            }
        });
        el.querySelector('#btn-dock-details')?.addEventListener('click', () => this.openPanel(el, 'details'));
        el.querySelector('#btn-dock-history')?.addEventListener('click', () => this.openPanel(el, 'history'));
        el.querySelector('#btn-dock-dupes')?.addEventListener('click', () => {
            if (this.pulling) return;
            try { AudioManager.ui.click(); } catch (_) { /* ignore */ }
            if (typeof DupesShop !== 'undefined') DupesShop.open();
        });
        el.querySelector('#gw-backdrop')?.addEventListener('click', () => this.closePanels(el));
        el.querySelectorAll('[data-close-panel]').forEach(btn => {
            btn.addEventListener('click', () => this.closePanels(el));
        });
        el.querySelector('[data-egg="rng"]')?.addEventListener('click', () => this.showEgg('No es RNG si el novio controla el servidor. Sin dupes, tiradas justas.'));
        el.querySelector('[data-egg="wallet"]')?.addEventListener('click', () => this.showEgg('Tu wallet ha sufrido exactamente 0 daños.'));
        el.querySelectorAll('[data-currency-plus]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.pulling) return;
                AudioManager.ui.click();
                this.openCurrencyPlus(el, btn.dataset.currencyPlus);
            });
        });
    },


    /** Floating motes over banner stage (WuWa atmosphere). */
    seedBannerMotes(el) {
        const host = el?.querySelector('#gw-motes');
        if (!host) return;
        host.innerHTML = '';
        // Keep ambient light — too many motes + will-change tanks GPU with full-bleed art
        const n = 10;
        for (let i = 0; i < n; i++) {
            const m = document.createElement('span');
            m.className = 'gw-mote';
            const lane = Math.random();
            const x = lane < 0.55
                ? (3 + Math.random() * 24)
                : (74 + Math.random() * 22);
            m.style.setProperty('--x', `${x}%`);
            m.style.setProperty('--dx', `${(Math.random() * 70 - 20).toFixed(1)}px`);
            m.style.setProperty('--s', `${2 + Math.random() * 3.5}px`);
            m.style.setProperty('--d', `${7 + Math.random() * 6}s`);
            m.style.setProperty('--delay', `${(-Math.random() * 8).toFixed(2)}s`);
            host.appendChild(m);
        }
    },

    /** BGM del convenio según banner activo (rota OSTs del anime). */
    setGachaMusic(bannerId) {
        if (typeof AudioManager === 'undefined' || !AudioManager.setTheme) return;
        const map = {
            onepiece: 'menu_op',
            naruto: 'menu_naruto',
            jojo: 'menu_jojo',
            bleach: 'menu_bleach',
            jjk: 'menu_jjk',
            kimetsu: 'menu_kimetsu',
            chainsaw: 'menu_chainsaw',
            metaphor: 'menu_metaphor'
        };
        const theme = map[bannerId] || (this.isEggBanner?.(bannerId) ? 'stardew' : 'menu_op');
        try {
            // Snappy handoff so the OST matches the banner you just clicked
            AudioManager.setTheme(theme, { fadeMs: 220, fadeInMs: 380 });
        } catch (_) { /* ignore */ }
    },

    switchBanner(el, id, opts = {}) {
        const apply = () => {
            this.resetLayerTransforms(el);
            this.activeBanner = id || 'onepiece';
            el.querySelectorAll('[data-banner]').forEach(b => {
                b.classList.toggle('is-active', b.dataset.banner === this.activeBanner);
            });
            const shell = el.querySelector('.gacha-wuwa');
            const isEgg = this.isEggBanner(this.activeBanner);
            shell?.classList.toggle('is-egg', isEgg);
            shell?.setAttribute('data-egg', isEgg ? this.activeBanner : '');
            shell?.setAttribute('data-series', this.isSeriesBanner(this.activeBanner) ? this.activeBanner : '');

            if (this.isEggBanner(this.activeBanner)) {
                this.applyEggBannerUI(el, this.activeBanner);
            } else if (this.isSeriesBanner(this.activeBanner)) {
                this.applySeriesBannerUI(el, this.activeBanner);
            }
            this.setGachaMusic(this.activeBanner);
            this.refreshStats(el);
            this.resetLayerTransforms(el);
        };

        if (opts.instant || typeof MotionFx === 'undefined') {
            apply();
            return;
        }
        MotionFx.bannerSwitch(el, apply);
    },

    /** Reset spend chip / buttons / meta class for current banner mode. */
    syncSpendUI(el, mode) {
        const shell = el.querySelector('.gacha-wuwa');
        const isMeta = mode === 'meta';
        const isEgg = mode === 'egg';
        shell?.classList.toggle('is-meta-spend', isMeta);
        shell?.classList.toggle('is-egg-banner', isEgg);

        const chip = el.querySelector('#gw-cost-chip');
        const chipLabel = el.querySelector('#gw-cost-chip-label');
        const chipVal = el.querySelector('#gacha-invocations-dock');
        let chipIcon = chip?.querySelector('.gw-currency-gem, .gw-currency-ticket, .gw-currency-free');
        if (chip && !chipIcon) {
            chipIcon = document.createElement('div');
            chipIcon.setAttribute('aria-hidden', 'true');
            chip.insertBefore(chipIcon, chip.firstChild);
        }

        if (isEgg) {
            if (chip) {
                chip.title = 'Tiradas gratis';
                chip.hidden = false;
            }
            if (chipLabel) chipLabel.textContent = 'Gratis';
            if (chipVal) chipVal.textContent = '∞';
            if (chipIcon) chipIcon.className = 'gw-currency-free sm';
            el.querySelectorAll('.convene-label').forEach((lab) => { lab.textContent = 'Invocar'; });
            el.querySelectorAll('.convene-cost').forEach((c) => {
                c.innerHTML = '<span class="gw-egg-free">✦ GRATIS</span>';
            });
            return;
        }

        if (chip) chip.hidden = false;
        const inv = GameState.get('invocations') || 0;
        const meta = GameState.get('metaphorTickets') || 0;
        if (chipLabel) chipLabel.textContent = isMeta ? 'Metaphor' : 'Invocaciones';
        if (chip) chip.title = isMeta ? 'Tiradas Metaphor (rojas)' : 'Invocaciones · 1 tirada';
        if (chipVal) chipVal.textContent = String(isMeta ? meta : inv);
        if (chipIcon) chipIcon.className = isMeta ? 'gw-currency-ticket sm' : 'gw-currency-gem sm';
        el.querySelectorAll('.convene-label').forEach((lab) => {
            lab.textContent = isMeta ? 'Sello' : 'Invocar';
        });
        el.querySelectorAll('.convene-cost').forEach((c, i) => {
            const n = i === 0 ? 1 : 10;
            c.dataset.cost = String(n);
            c.innerHTML = `<span class="${isMeta ? 'convene-ticket' : 'convene-gem'}" aria-hidden="true"></span><strong>×${n}</strong>`;
        });
    },

    openCurrencyPlus(el, kind) {
        if (kind === 'inv') {
            this.openConvertPanel(el);
            return;
        }
        if (kind === 'meta') {
            this.openCurrencyInfo({
                title: 'Tiradas Metaphor',
                body: `
                    <p>Tickets <strong>especiales rojos</strong> solo para el banner Metaphor. <strong>No se compran</strong> con Chikistrites.</p>
                    <ul>
                        <li><strong>+14</strong> al cerrar la última misión de cada apartado.</li>
                        <li><strong>+10</strong> al vencer <strong>THE 50/50</strong>.</li>
                        <li>Total <strong>80</strong> = garantía dura del banner Metaphor.</li>
                    </ul>
                    <p class="gw-currency-info-foot">Se usan solo en el banner rojo.</p>`
            });
            return;
        }
        if (kind === 'seal') {
            if (typeof DupesShop !== 'undefined') {
                DupesShop.open();
                return;
            }
            this.openCurrencyInfo({
                title: 'Sellos Estelares',
                body: `
                    <p>Se obtienen al <strong>maxear un 4★ en C6, un 5★ en C3 o un 6★ en C3</strong>.</p>
                    <ul>
                        <li>1 sello compra un dupe de 5★; 2 sellos compran un dupe de 6★ que ya tengas.</li>
                        <li>Abre la tienda con <strong>DUPES</strong> (rail, dock o chip ✦).</li>
                        <li>Los 5★ y 6★ maxean en <strong>C3</strong>.</li>
                    </ul>`
            });
        }
    },

    openCurrencyInfo({ title, body }) {
        this.closeCurrencyModals();
        const modal = document.createElement('div');
        modal.className = 'gw-currency-modal';
        modal.innerHTML = `
            <div class="gw-currency-modal-panel" role="dialog" aria-label="${title}">
                <div class="gw-currency-modal-head">
                    <h3>${title}</h3>
                    <button type="button" class="gw-panel-close" data-close-currency>CERRAR</button>
                </div>
                <div class="gw-currency-modal-body">${body}</div>
            </div>`;
        document.body.appendChild(modal);
        this._currencyModal = modal;
        const close = () => this.closeCurrencyModals();
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
        modal.querySelector('[data-close-currency]')?.addEventListener('click', close);
    },

    openConvertPanel(el) {
        this.closeCurrencyModals();
        const rate = (typeof GameState.chikiPerInv === 'function') ? GameState.chikiPerInv() : 160;
        const chiki = GameState.get('chikistrites') || 0;
        const inv = GameState.get('invocations') || 0;
        const max = typeof GameState.maxConvertibleInv === 'function' ? GameState.maxConvertibleInv() : Math.floor(chiki / rate);
        const modal = document.createElement('div');
        modal.className = 'gw-currency-modal';
        modal.innerHTML = `
            <div class="gw-currency-modal-panel" role="dialog" aria-label="Convertir invocaciones">
                <div class="gw-currency-modal-head">
                    <h3>CHIKI → INV</h3>
                    <button type="button" class="gw-panel-close" data-close-currency>CERRAR</button>
                </div>
                <div class="gw-currency-modal-body">
                    <div class="gw-convert-strip">
                        <div class="gw-convert-chip">
                            <span class="gw-convert-chip-lab">Chikistrites</span>
                            <strong id="convert-chiki">${chiki.toLocaleString('es-ES')}</strong>
                        </div>
                        <span class="gw-convert-arrow" aria-hidden="true">→</span>
                        <div class="gw-convert-chip is-inv">
                            <span class="convene-gem" aria-hidden="true"></span>
                            <span class="gw-convert-chip-lab">Invocaciones</span>
                            <strong id="convert-inv">${inv}</strong>
                        </div>
                    </div>
                    <p class="gw-convert-rate"><strong>${rate}</strong> Chiki = <strong>1</strong> INV</p>
                    <p class="gw-convert-hint">Los combates dan Chiki. Aquí los cambias por tiradas de banners anime.</p>
                    <div class="gw-convert-actions">
                        <button type="button" class="btn-destiny gw-convert-btn" data-convert="1" ${max < 1 ? 'disabled' : ''}>
                            <span>×1</span>
                            <em>${rate.toLocaleString('es-ES')} Chiki</em>
                        </button>
                        <button type="button" class="btn-destiny gw-convert-btn" data-convert="10" ${max < 10 ? 'disabled' : ''}>
                            <span>×10</span>
                            <em>${(rate * 10).toLocaleString('es-ES')} Chiki</em>
                        </button>
                        <button type="button" class="btn-destiny gw-convert-btn" data-convert="max" ${max < 1 ? 'disabled' : ''}>
                            <span>MAX</span>
                            <em id="convert-max-lab">${max} INV</em>
                        </button>
                    </div>
                    <p class="gw-currency-info-foot" id="convert-msg"></p>
                </div>
            </div>`;
        document.body.appendChild(modal);
        this._currencyModal = modal;
        const close = () => this.closeCurrencyModals();
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
        modal.querySelector('[data-close-currency]')?.addEventListener('click', close);
        modal.querySelectorAll('[data-convert]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.convert;
                const avail = GameState.maxConvertibleInv();
                const n = mode === 'max' ? avail : Number(mode);
                const res = GameState.convertChikiToInv(n);
                const msg = modal.querySelector('#convert-msg');
                if (!res.ok) {
                    if (msg) msg.textContent = res.reason || 'No se pudo convertir.';
                    AudioManager.ui.click();
                    return;
                }
                if (msg) {
                    msg.textContent = `✦ Tiradas listas · +${res.gained} INV · −${res.cost.toLocaleString('es-ES')} Chiki`;
                    msg.classList.remove('is-flash');
                    void msg.offsetWidth;
                    msg.classList.add('is-flash');
                }
                modal.querySelector('.gw-currency-modal-panel')?.classList.add('is-converted');
                setTimeout(() => modal.querySelector('.gw-currency-modal-panel')?.classList.remove('is-converted'), 500);
                try { AudioManager.ui.collect(); } catch (_) { /* ignore */ }
                if (typeof ParticleSystem !== 'undefined') {
                    ParticleSystem.burst(window.innerWidth / 2, window.innerHeight * 0.42, 18 + res.gained * 2, '#ffe9a0');
                }
                this.refreshStats(el || this._rootEl);
                const chikiEl = modal.querySelector('#convert-chiki');
                const invEl = modal.querySelector('#convert-inv');
                if (chikiEl) chikiEl.textContent = (res.chikistrites || 0).toLocaleString('es-ES');
                if (invEl) invEl.textContent = String(res.invocations || 0);
                const left = GameState.maxConvertibleInv();
                modal.querySelectorAll('[data-convert]').forEach((b) => {
                    const m = b.dataset.convert;
                    const need = m === 'max' ? 1 : Number(m);
                    b.disabled = left < need;
                    if (m === 'max') {
                        const lab = b.querySelector('#convert-max-lab') || b.querySelector('em');
                        if (lab) lab.textContent = `${left} INV`;
                    }
                });
            });
        });
    },

    closeCurrencyModals() {
        if (this._currencyModal) {
            this._currencyModal.remove();
            this._currencyModal = null;
        }
    },

    /** Ken-burns / drift for static stages; Metaphor keeps its GIF. */
    setArtMotion(el, { live = true, metaphor = false } = {}) {
        const art = el.querySelector('.gw-art');
        const sil = el.querySelector('#gw-silhouette');
        const on = !!live && !metaphor;
        art?.classList.toggle('is-metaphor-stage', !!metaphor);
        // Enable live motion after paint — avoids hitch while decoding the stage
        const applyLive = () => {
            art?.classList.toggle('is-live', on);
        };
        if (on) {
            requestAnimationFrame(() => setTimeout(applyLive, 30));
        } else {
            art?.classList.remove('is-live');
        }
        if (sil) sil.style.opacity = '0';
    },

    /** Clear leftover GSAP offsets on UI layers (never touch banner media transform). */
    resetLayerTransforms(el) {
        if (typeof gsap === 'undefined') return;
        const ui = el.querySelectorAll('.gw-copy, .gw-reward, .gw-dock');
        gsap.set(ui, { clearProps: 'opacity,transform,filter,y,x,scale' });
        const art = el.querySelector('.gw-art');
        if (art) gsap.set(art, { clearProps: 'opacity,filter,scale' });
    },

    /** Full-bleed stage art. <picture><source> overrides img.src — must update sources too. */
    setStageBackground(el, url, opts = {}) {
        const still = el.querySelector('#gw-banner-static');
        const gif = el.querySelector('#gw-banner-gif');
        const stillPic = still?.closest('picture');
        const gifPic = gif?.closest('picture');
        const bust = url
            ? `${url}${url.includes('?') ? '&' : '?'}v=${this.CACHE}`
            : '';

        if (opts.metaphor) {
            if (gif) {
                gif.classList.remove('is-hidden');
                if (!gif.getAttribute('src')) gif.src = this.BANNER_GIF;
            }
            if (gifPic) {
                gifPic.style.display = '';
                const webpSrc = gifPic.querySelector('source[data-kind="gif-webp"], source[type="image/webp"]');
                if (webpSrc && !webpSrc.getAttribute('srcset')) {
                    webpSrc.setAttribute('srcset', this.BANNER_WEBP);
                }
                gifPic.querySelectorAll('source').forEach((s) => {
                    if (s.dataset.origSrcset) s.setAttribute('srcset', s.dataset.origSrcset);
                });
            }
            if (stillPic) {
                stillPic.querySelectorAll('source').forEach((s) => {
                    if (s.dataset.origSrcset) s.setAttribute('srcset', s.dataset.origSrcset);
                });
            }
            if (still) {
                still.classList.remove('is-hidden');
                still.src = this.BANNER_STATIC_PNG;
                still.style.objectFit = 'cover';
                still.style.objectPosition = opts.objectPosition || '28% 42%';
                still.style.background = '';
                still.style.opacity = gif?.classList.contains('is-loaded') && !gif.classList.contains('is-hidden') ? '0' : '1';
                still.classList.add('is-loaded');
            }
            this.setArtMotion(el, { live: false, metaphor: true });
            return;
        }

        // All series + Metaphor key art: static stage with light WuWa drift
        if (gif) {
            gif.classList.add('is-hidden');
            gif.style.opacity = '0';
        }
        if (gifPic) {
            gifPic.style.display = 'none';
            gifPic.querySelectorAll('source').forEach((s) => {
                if (!s.dataset.origSrcset) s.dataset.origSrcset = s.getAttribute('srcset') || '';
                s.removeAttribute('srcset');
            });
        }
        if (stillPic) {
            stillPic.querySelectorAll('source').forEach((s) => {
                if (!s.dataset.origSrcset) s.dataset.origSrcset = s.getAttribute('srcset') || '';
                if (bust) s.setAttribute('srcset', bust);
                else s.removeAttribute('srcset');
            });
        }
        if (still && bust) {
            still.classList.remove('is-hidden');
            still.src = bust;
            still.style.opacity = '1';
            still.style.objectFit = opts.objectFit || 'cover';
            still.style.objectPosition = opts.objectPosition || '42% 22%';
            still.style.background = opts.objectFit === 'contain' ? '#050308' : '#050308';
            still.classList.toggle('is-contain', opts.objectFit === 'contain');
            still.classList.add('is-loaded');
            const keepVisible = () => {
                still.style.opacity = '1';
                still.classList.add('is-loaded');
            };
            if (still.complete && still.naturalWidth) keepVisible();
            else still.addEventListener('load', keepVisible, { once: true });
        }
        this.setArtMotion(el, {
            live: opts.live !== false && opts.objectFit !== 'contain',
            metaphor: false
        });
    },

    applySeriesBannerUI(el, id) {
        const b = GachaRoster.BANNERS[id];
        if (!b) return;
        const set = (sel, html, text) => {
            const n = el.querySelector(sel);
            if (!n) return;
            if (html != null) n.innerHTML = html;
            else if (text != null) n.textContent = text;
        };
        set('.gw-event-ribbon', null, b.tag);
        set('.gw-title', `<span class="gw-title-line">${b.titleLines[0]}</span><span class="gw-title-gold">${b.titleLines[1]}<span class="gw-title-glint" aria-hidden="true">✦</span></span>`);
        set('.gw-sub', null, b.subtitle);
        set('#gw-featured-label', null, b.featuredNote);
        set('#hl-pulls', null, b.featured);
        const featuredStars = this.featuredStarsFor(b);
        set('.gw-rate-row .gw-stars-row', null, '★'.repeat(featuredStars));
        set('.gw-reward-k', '<span aria-hidden="true">✦</span> Destacado ' + featuredStars + '★');
        set('.gw-reward-stars', null, '★'.repeat(featuredStars));
        const rewardSil = el.querySelector('.gw-reward-sil');
        if (rewardSil) {
            const thumbUrl = `${b.thumb}?v=${this.CACHE}`;
            // Don't paint a 4K thumb into a tiny card — downscale first when possible
            rewardSil.style.backgroundSize = 'cover';
            rewardSil.style.backgroundPosition = id === 'onepiece' ? '50% 18%'
                : id === 'naruto' ? '48% 22%'
                : 'center top';
            rewardSil.classList.add('has-egg-art');
            rewardSil.style.backgroundImage = `url('${thumbUrl}')`;
            this.bindLiteThumb({
                isConnected: true,
                set src(v) { rewardSil.style.backgroundImage = `url('${v}')`; },
                get src() { return thumbUrl; }
            }, thumbUrl, 480).catch(() => {});
        }
        if (b.isMetaphor) {
            this.setStageBackground(el, b.art || b.banner, {
                objectPosition: b.objectPosition || '48% 58%',
                live: true
            });
        } else {
            this.setStageBackground(el, b.art || b.banner, {
                objectFit: 'cover',
                objectPosition: b.objectPosition || '50% 40%'
            });
        }
        el.querySelector('.gw-art')?.classList.remove('is-egg-stage');
        const still = el.querySelector('#gw-banner-static');
        still?.classList.remove('is-contain');
        const details = el.querySelector('#panel-details .gw-panel-body');
        if (details) details.innerHTML = this.buildSeriesDetailsHTML(b, id);
        this.syncSpendUI(el, b.isMetaphor ? 'meta' : 'inv');
    },

    charPortraitSrc(charId) {
        if (!charId) return this.INV_GEM;
        const stagedNormal = typeof StagedSprites !== 'undefined' && StagedSprites.normalUrl
            ? StagedSprites.normalUrl(charId)
            : null;
        if (stagedNormal) return stagedNormal;
        return `assets/sprites/anim/${charId}_idle.png`;
    },

    /** Art for pull result cards — never fall back to the training dummy. */
    resultArtSrc(r) {
        if (!r) return this.INV_GEM;
        if (r.egg && r.bannerId) {
            const art = (typeof EggGacha !== 'undefined')
                ? EggGacha.artFor(r)
                : `assets/gacha/egg/${r.bannerId}-art.webp`;
            return `${art}?v=${this.CACHE}`;
        }
        // WuWa: full-dupe converts still show the character
        const charArtId = r.charId || r.dupeOf || r.artCharId;
        if ((r.kind === 'converted' || r.converted) && charArtId) {
            return this.charPortraitSrc(charArtId);
        }
        if ((r.kind === 'inv_refund' || r.refundInv) && !charArtId) {
            return this.INV_GEM;
        }
        if ((r.kind === 'star_seal' || r.starSeals) && !charArtId) {
            const sealAsset = (r.stars || 0) >= 6 || r.rarity === 'mythic' ? 'star-seal-6.png' : 'star-seal-5.png';
            return `assets/gacha/${sealAsset}?v=${this.CACHE}`;
        }
        if (r.kind === 'equipment' && r.equipmentId && typeof EquipmentSystem !== 'undefined') {
            return `${EquipmentSystem.artFor(r.equipmentId)}?v=${this.CACHE}`;
        }
        if (r.metaphor || r.kind === 'legendary') {
            return this.BANNER_STATIC;
        }
        if (charArtId) return this.charPortraitSrc(charArtId);
        if (r.kind === 'inv_refund' || r.refundInv) return this.INV_GEM;
        if (r.kind === 'star_seal' || r.starSeals) {
            const sealAsset = (r.stars || 0) >= 6 || r.rarity === 'mythic' ? 'star-seal-6.png' : 'star-seal-5.png';
            return `assets/gacha/${sealAsset}?v=${this.CACHE}`;
        }
        return this.INV_GEM;
    },

    resultArtClass(r) {
        if (!r) return 'is-currency';
        if (r.kind === 'converted' || r.converted) return 'is-converted';
        if ((r.kind === 'inv_refund' || r.refundInv) && !(r.charId || r.dupeOf)) return 'is-currency is-inv';
        if ((r.kind === 'star_seal' || r.starSeals) && !(r.charId || r.dupeOf)) return 'is-currency is-seal';
        if (r.kind === 'equipment') return 'is-equipment';
        if (r.metaphor || r.kind === 'legendary') return 'is-keyart';
        return '';
    },

    displayName(charId) {
        if (!charId) return '???';
        const tpl = (typeof GachaRoster !== 'undefined') ? GachaRoster.getTemplate(charId) : null;
        return tpl?.name || charId;
    },

    rateTableHTML(b) {
        const rows = (typeof GachaRates !== 'undefined' && GachaRates.rateRows)
            ? GachaRates.rateRows(b)
            : [];
        const featuredStars = this.featuredStarsFor(b);
        return `
            <div class="gw-rate-table" role="table" aria-label="Probabilidades">
                ${rows.map(r => `
                    <div class="gw-rate-row stars-${r.stars}" role="row">
                        <span class="gw-rate-stars">${'★'.repeat(r.stars)}</span>
                        <span class="gw-rate-label">${r.label}</span>
                        <strong class="gw-rate-pct">${r.pct}%</strong>
                        <span class="gw-rate-note">${r.note}</span>
                    </div>
                `).join('')}
            </div>
            <p class="gw-rate-5050">${b.featured5050
                ? `Destacado ${(Math.round((b.featuredRate ?? 0.7) * 100))}% en ${featuredStars}★ (si pierdes, el siguiente es garantía).`
                : `Destacado garantizado en ${featuredStars}★.`}</p>`;
    },

    poolGridHTML(items, stars, emptyNote) {
        if (!items?.length) {
            return emptyNote ? `<p class="gw-pool-empty">${emptyNote}</p>` : '';
        }
        return `
            <div class="gw-pool-grid stars-${stars}">
                ${items.map((it) => `
                    <div class="gw-pool-card stars-${stars}${it.featured ? ' is-featured' : ''}" title="${it.name}">
                        <div class="gw-pool-art" style="background-image:url('${it.art}?v=${this.CACHE}')"></div>
                        <span class="gw-pool-stars">${'★'.repeat(stars)}</span>
                        <strong class="gw-pool-name">${it.name}</strong>
                        ${it.featured ? '<em class="gw-pool-tag">DESTACADO</em>' : ''}
                    </div>
                `).join('')}
            </div>`;
    },

    buildSeriesDetailsHTML(b, id) {
        const prize = CONFIG.gachaRewards?.legendary?.name || CONFIG.legendaryReward;
        if (b.isMetaphor) {
            return `
                <p class="gw-details-lead"><strong>Banner Metaphor</strong> — ${prize} (Steam) · <em>7★ celestial</em>.</p>
                ${this.rateTableHTML(b)}
                <h4 class="gw-pool-h">Premio 7★</h4>
                ${this.poolGridHTML([{
                    name: b.featured,
                    art: b.thumb || this.BANNER_STATIC,
                    featured: true
                }], 7)}
                <h4 class="gw-pool-h">4★ / 3★</h4>
                <p class="gw-pool-empty">${(b.pool4Names || []).join(' · ') || 'Fragmentos'} · ${(b.pool3Names || []).join(' · ') || 'Chikistrites'}</p>
                <p class="gw-details-foot">Gasta tiradas <strong>rojas</strong>. Garantía 7★ en ${b.hard7 || 80}. Contador: <strong id="details-pity">0</strong>.</p>`;
        }

        const six = [];
        const featStars = b.featuredStars || 5;
        if (b.featuredId && featStars >= 6) {
            six.push({
                name: this.displayName(b.featuredId),
                art: this.charPortraitSrc(b.featuredId),
                featured: true
            });
        }
        (b.pool6 || []).forEach((cid) => {
            if (six.some((x) => x.name === this.displayName(cid))) return;
            six.push({ name: this.displayName(cid), art: this.charPortraitSrc(cid) });
        });
        const five = [];
        if (b.featuredId && featStars <= 5) {
            five.push({
                name: this.displayName(b.featuredId),
                art: this.charPortraitSrc(b.featuredId),
                featured: true
            });
        }
        (b.pool5Std || []).forEach((cid) => {
            five.push({ name: this.displayName(cid), art: this.charPortraitSrc(cid) });
        });
        const four = (b.pool4 || []).map((cid) => ({
            name: this.displayName(cid),
            art: this.charPortraitSrc(cid)
        }));
        const three = (b.pool3 || []).map((cid) => ({
            name: this.displayName(cid),
            art: this.charPortraitSrc(cid)
        }));
        const threeNames = (b.pool3Names || []).map((n) => ({
            name: n,
            art: typeof EquipmentSystem !== 'undefined' ? EquipmentSystem.artForName(n) : 'assets/gacha/invocacion-gem.svg'
        }));

        return `
            <p class="gw-details-lead"><strong>${b.series}</strong> — pool jugable. Destacado: <em>${b.featured}</em>.</p>
            ${this.rateTableHTML(b)}
            <h4 class="gw-pool-h">Personajes 6★ <span>${((b.rate6 || 0.003) * 100).toFixed(2)}%</span></h4>
            ${this.poolGridHTML(six, 6, 'Sin 6★ en este banner')}
            <h4 class="gw-pool-h">Personajes 5★ <span>${((b.rate5 || 0.02) * 100).toFixed(1)}%</span></h4>
            ${this.poolGridHTML(five, 5)}
            <h4 class="gw-pool-h">Personajes 4★ <span>${((b.rate4 || 0.12) * 100).toFixed(1)}%</span></h4>
            ${this.poolGridHTML(four, 4)}
            <h4 class="gw-pool-h">3★ <span>${((Math.max(0, 1 - (b.rate6 || 0.003) - (b.rate5 || 0.02) - (b.rate4 || 0.12))) * 100).toFixed(1)}%</span></h4>
            ${this.poolGridHTML(three.concat(threeNames), 3, 'Objetos equipables')}
            ${id === 'jjk' ? '<p class="gw-details-foot"><strong>Gojo 6★</strong> desbloquea THE 50/50 en Historia.</p>' : ''}
            <p class="gw-details-foot">Duplicados: 4★ C0–C6 · 5★/6★ C0–C3 · sellos → <strong>DUPES</strong>. Garantía 6★: <strong id="details-pity">0</strong> / ${b.hard6 || 80}</p>`;
    },

    buildEggDetailsHTML(b, id) {
        const five = [{
            name: b.featured,
            art: EggGacha.portraitFor(id, b.featured) || b.art5 || b.art,
            featured: true
        }].concat((b.pool5Std || []).map((n) => ({
            name: n,
            art: EggGacha.portraitFor(id, n) || b.art5Std || b.art
        })));
        const four = (b.pool4 || []).map((n) => ({
            name: n,
            art: EggGacha.portraitFor(id, n) || b.art4 || b.art
        }));
        const three = (b.pool3 || []).map((n) => ({
            name: n,
            art: b.art3 || b.art
        }));
        return `
            <p class="gw-details-lead"><strong>${b.game}</strong> — easter egg. Tiradas gratis · no jugable.</p>
            ${this.rateTableHTML(b)}
            <h4 class="gw-pool-h">5★ Resonadores <span>${(b.rate5 * 100).toFixed(1)}%</span></h4>
            ${this.poolGridHTML(five, 5)}
            <h4 class="gw-pool-h">4★ <span>${(b.rate4 * 100).toFixed(1)}%</span></h4>
            ${this.poolGridHTML(four, 4)}
            <h4 class="gw-pool-h">3★ <span>${((1 - b.rate5 - b.rate4) * 100).toFixed(1)}%</span></h4>
            ${this.poolGridHTML(three, 3)}
            <p class="gw-details-foot">Garantía 5★: <strong id="details-pity">0</strong> / ${b.hard5}</p>`;
    },

    applyMainBannerUI(el) {
        this.applySeriesBannerUI(el, 'metaphor');
    },

    applyEggBannerUI(el, id) {
        const b = EggGacha.BANNERS[id];
        if (!b) return;
        const set = (sel, html, text) => {
            const n = el.querySelector(sel);
            if (!n) return;
            if (html != null) n.innerHTML = html;
            else if (text != null) n.textContent = text;
        };
        set('.gw-event-ribbon', null, `${b.short} · Easter egg`);
        set('.gw-title', `<span class="gw-title-line">${b.titleLines[0]}</span><span class="gw-title-gold">${b.titleLines[1]}<span class="gw-title-glint" aria-hidden="true">✦</span></span>`);
        set('.gw-sub', null, b.subtitle);
        set('#gw-featured-label', null, b.featuredNote);
        set('#hl-pulls', null, b.featured);
        const rewardSil = el.querySelector('.gw-reward-sil');
        if (rewardSil) {
            // Destacado: sourced official/character splash only (thumb), never AI banner gens.
            const featuredArt = b.thumb || EggGacha.portraitFor(id, b.featured) || b.art5;
            rewardSil.style.backgroundImage = `url('${featuredArt}?v=${this.CACHE}')`;
            rewardSil.style.backgroundSize = 'cover';
            rewardSil.style.backgroundPosition = id === 'tof' ? '50% 28%'
                : id === 'wuwa' ? '50% 16%'
                : '52% 22%';
            rewardSil.classList.add('has-egg-art');
        }
        // Stage plate from sourced banner crops — not egg-*-banner AI plates.
        this.setStageBackground(el, EggGacha.stageArt(id), {
            objectFit: 'cover',
            objectPosition: id === 'wuwa' ? '48% 40%' : id === 'tof' ? '55% 40%' : '55% 38%',
            live: false
        });
        const art = el.querySelector('.gw-art');
        art?.classList.add('is-egg-stage');
        const details = el.querySelector('#panel-details .gw-panel-body');
        if (details) details.innerHTML = this.buildEggDetailsHTML(b, id);
        this.syncSpendUI(el, 'egg');
    },

    refreshEggStats(el, id) {
        const b = EggGacha.BANNERS[id];
        if (!b) return;
        const st = EggGacha.getState(id);
        const setText = (sel, text) => {
            const node = el.querySelector(sel);
            if (node) node.textContent = text;
        };
        setText('#gacha-pity', `Garantía · ${b.featured}`);
        setText('#gacha-pity-count', `5★ ${st.pity5}/${b.hard5} · 4★ ${st.pity4}/${b.hard4}`);
        setText('#gacha-left', `Tiradas infinitas · ${st.pulls} hechas · no jugable`);
        setText('#gw-featured-label', st.guaranteedFeatured
            ? `Garantía destacado · próximo 5★ = ${b.featured}`
            : b.featuredNote);
        setText('#hl-collection', '∞');
        setText('#gacha-invocations', GameState.get('invocations') || 0);
        setText('#gacha-meta-tickets', GameState.get('metaphorTickets') || 0);
        setText('#gacha-star-seals', GameState.get('starSeals') || 0);
        setText('#details-pity', String(st.pity5));
        setText('#gacha-pity-hint', this.pityHintText(b, st));
        const fill = el.querySelector('#pity-fill');
        if (fill) fill.style.width = `${Math.min(100, (st.pity5 / b.hard5) * 100)}%`;
        fill?.classList.toggle('soft-active', st.pity5 >= b.soft5 && st.pity5 < b.hard5);
        const btn1 = el.querySelector('#btn-pull-1');
        const btn10 = el.querySelector('#btn-pull-10');
        if (btn1) btn1.disabled = false;
        if (btn10) btn10.disabled = false;
        this.syncSpendUI(el, 'egg');
        const history = el.querySelector('#pull-history');
        if (history) {
            const all = st.history || [];
            history.innerHTML = this.renderHistoryList(all, b.game, `Aún no hay tiradas en ${b.game}.`);
        }
        if (typeof DupesShop !== 'undefined') DupesShop.refreshIfOpen();
    },

    async doEggPulls(el, id, count) {
        if (this.pulling) return;
        if (typeof EggGacha === 'undefined') {
            this.showEgg('EggGacha no cargado.');
            return;
        }
        this.pulling = true;
        this._skipPull = false;
        this.closePanels(el);
        const b1 = el.querySelector('#btn-pull-1');
        const b10 = el.querySelector('#btn-pull-10');
        if (b1) b1.disabled = true;
        if (b10) b10.disabled = true;

        const results = EggGacha.planPulls(id, count);
        const best = this.bestRarity(results.map(r => r.rarity));
        const fiveCount = results.filter(r => (r.stars || 0) >= 5 || r.rarity === 'epic' || r.rarity === 'legendary').length;
        // Fakeout "para bien" (~28%): a veces miente morado; la mayoría enseña oro normal.
        const goldSurprise = fiveCount >= 1 && Math.random() < 0.28;
        this._pullGoldSurprise = goldSurprise;
        const gotFeatured = results.some(r => r.featured);
        await this.playPullAnimation(goldSurprise ? 'rare' : best, count, {
            fiveCount: goldSurprise ? 0 : fiveCount,
            goldSurprise
        });
        await this.showPullResults(el, results.map(r => ({
            ...r,
            reward: r.featured ? `${r.name} ★` : r.name
        })));
        this._pullGoldSurprise = false;
        this._freshHistoryCount = results.length;
        const action = this._lastResultsAction;
        this._lastResultsAction = null;
        if (fiveCount >= 2) this.showEgg(`✦ DOBLE 5★ en el egg banner`);
        if (gotFeatured) {
            const b = EggGacha.BANNERS[id];
            this.showEgg(`¡Destacado! ${b.featured} (${b.game}) — easter egg, no jugable.`);
        }
        this.refreshStats(el);
        this.pulling = false;
        this.handleResultsAction(el, action);
    },

    exit() {
        this._skipPull = true;
        this._skipCascade = true;
        this._skipSolo = true;
        this.clearTimers();
        this.killTweens();
        if (typeof DupesShop !== 'undefined') DupesShop.close();
        if (typeof MotionFx !== 'undefined') MotionFx.killTracked();
        this.resetPullOverlay();
        if (this._resolveResults) {
            const resolve = this._resolveResults;
            this._resolveResults = null;
            resolve();
        }
        if (this._soloEl) {
            this._soloEl.remove();
            this._soloEl = null;
        }
        if (this._activeModal) {
            this._activeModal.remove();
            this._activeModal = null;
        }
        this.pulling = false;
        this._rootEl = null;
    },

    wireBannerMedia(el) {
        const gif = el.querySelector('#gw-banner-gif');
        const still = el.querySelector('#gw-banner-static');
        const fallback = el.querySelector('#gw-fallback');
        const sil = el.querySelector('#gw-silhouette');
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const staticFallbacks = [this.BANNER_STATIC, this.BANNER_STATIC_ALT, this.BANNER_STATIC_PNG];
        let staticTry = 0;

        const markLoaded = (img) => {
            img.classList.add('is-loaded');
            if (fallback) fallback.style.opacity = '0';
            if (sil) sil.style.opacity = '0';
        };

        const onFail = (img) => {
            img.classList.add('is-hidden');
            img.removeAttribute('src');
        };

        const whenReady = (img, onReady) => {
            if (!img) return;
            if (img.complete && img.naturalWidth) {
                onReady();
                return;
            }
            img.addEventListener('load', onReady, { once: true });
        };

        if (still) {
            whenReady(still, () => {
                if (reduced || !gif || gif.classList.contains('is-hidden') || !gif.classList.contains('is-loaded')) {
                    markLoaded(still);
                    still.style.opacity = '1';
                }
            });
            still.addEventListener('error', () => {
                // Don't resurrect Metaphor art while another banner is active
                if (this.activeBanner && this.activeBanner !== 'metaphor') {
                    console.warn('[gacha] banner art failed for', this.activeBanner);
                    return;
                }
                staticTry += 1;
                if (staticTry < staticFallbacks.length) {
                    still.src = staticFallbacks[staticTry];
                    return;
                }
                onFail(still);
            });
        }
        if (gif && !reduced) {
            whenReady(gif, () => {
                // Only show Metaphor animation on the Metaphor banner
                if (this.activeBanner !== 'metaphor' || gif.classList.contains('is-hidden')) {
                    if (still) {
                        markLoaded(still);
                        still.style.opacity = '1';
                    }
                    return;
                }
                markLoaded(gif);
                if (still) still.style.opacity = '0';
            });
            gif.addEventListener('error', () => {
                onFail(gif);
                if (still && still.complete && still.naturalWidth) {
                    markLoaded(still);
                    still.style.opacity = '1';
                }
            });
        } else if (gif) {
            gif.classList.add('is-hidden');
        }
    },

    openPanel(el, which) {
        this.closePanels(el);
        const map = { history: '#panel-history', details: '#panel-details' };
        const panel = el.querySelector(map[which] || '#panel-details');
        const backdrop = el.querySelector('#gw-backdrop');
        panel?.classList.add('open');
        panel?.setAttribute('aria-hidden', 'false');
        backdrop?.classList.add('open');
        if (which === 'history') {
            panel?.classList.add('has-fresh');
            // Re-render so NUEVO tags are visible if stats were stale.
            this.refreshStats(el);
            const id = setTimeout(() => panel?.classList.remove('has-fresh'), 2200);
            this._timers.push(id);
        }
        AudioManager.ui.click();
    },

    closePanels(el) {
        el.querySelectorAll('.gw-panel').forEach(p => {
            p.classList.remove('open');
            p.setAttribute('aria-hidden', 'true');
        });
        el.querySelector('#gw-backdrop')?.classList.remove('open');
    },

    showEgg(msg) {
        const t = document.createElement('div');
        t.className = 'achievement-toast gacha-toast';
        t.style.transform = 'translateX(0)';
        document.getElementById('achievement-container')?.appendChild(t);
        t.innerHTML = `
            <button type="button" class="gacha-toast-close" aria-label="Cerrar aviso">×</button>
            <div class="achievement-desc">${msg}</div>
        `;
        const timer = setTimeout(() => t.remove(), 3500);
        this._timers.push(timer);
        t.querySelector('.gacha-toast-close')?.addEventListener('click', () => {
            clearTimeout(timer);
            t.remove();
        });
    },

    planPulls(count) {
        const id = this.isSeriesBanner(this.activeBanner) ? this.activeBanner : 'onepiece';
        return (typeof GachaRoster !== 'undefined' && GachaRoster.planPulls)
            ? GachaRoster.planPulls(id, count)
            : [];
    },

    async doPulls(el, count) {
        if (this.pulling) return;
        if (this.isEggBanner(this.activeBanner)) {
            return this.doEggPulls(el, this.activeBanner, count);
        }
        if (!this.isSeriesBanner(this.activeBanner)) {
            this.activeBanner = 'onepiece';
        }
        if (!GachaRoster.isBannerUnlocked(this.activeBanner)) {
            this.showEgg('Este banner aún está sellado.');
            return;
        }
        if (this.activeBanner === 'metaphor' && GameState.get('legendaryObtained')) {
            this.showEgg('Ya tienes Metaphor. Banner completado.');
            return;
        }

        const isMeta = this.activeBanner === 'metaphor';
        const bal = isMeta
            ? (GameState.get('metaphorTickets') || 0)
            : (GameState.get('invocations') || 0);
        if (bal < count) {
            this.showEgg(isMeta
                ? 'Sin tiradas Metaphor. Cierra la última quest de cada apartado o vence a THE 50/50.'
                : 'No te quedan invocaciones. Gana combates nuevos.');
            return;
        }

        const results = this.planPulls(count);
        if (!results.length) {
            this.showEgg('No se pudo invocar.');
            return;
        }
        const spend = results.length;
        if (bal < spend) return;

        this.pulling = true;
        this._skipPull = false;
        this.closePanels(el);
        const b1 = el.querySelector('#btn-pull-1');
        const b10 = el.querySelector('#btn-pull-10');
        if (b1) b1.disabled = true;
        if (b10) b10.disabled = true;

        for (let i = 0; i < spend; i++) {
            if (isMeta) GameState.useMetaphorTicket();
            else GameState.useInvocation();
        }

        const pullsBefore = GameState.get('pullsDone') || 0;

        const best = this.bestRarity(results.map(r => r.rarity));
        const fiveCount = results.filter(r => this.isFiveStarResult(r)).length;
        const mythicCount = results.filter(r => this.isMythicResult(r)).length;
        const revealedAchievements = [
            ...(pullsBefore === 0 ? ['first_pull'] : []),
            ...(spend === 10 ? ['multi_pull'] : []),
            ...(results.some(r => r.kind === 'dupe' || r.dupe) ? ['dupe_hunter'] : []),
            ...(fiveCount > 0 ? ['five_star'] : []),
            ...(mythicCount > 0 ? ['six_star'] : [])
        ];
        const hasMetaphor = results.some(r => this.isCelestialResult(r));
        const hasGojo = results.some(r => r.kind === 'gojo' || r.charId === 'gojo');
        // 6★ siempre fakeout oro→rojo. 5★ ~28% fakeout morado→oro.
        const goldSurprise = mythicCount < 1 && fiveCount >= 1 && Math.random() < 0.28;
        this._pullMythicBreak = mythicCount >= 1;
        this._pullGoldSurprise = goldSurprise || this._pullMythicBreak;
        let presented = best;
        if (this._pullMythicBreak) presented = 'epic';
        else if (goldSurprise) presented = 'rare';

        if (hasMetaphor) {
            this._pullGoldSurprise = false;
            this._pullMythicBreak = false;
            for (const r of results) GachaRoster.applyPull(r);
            await this.playPullAnimation('celestial', spend, { fiveCount: Math.max(1, fiveCount), celestialForce: true });
            this.pulling = false;
            SceneManager.goTo('legendary', {
                reward: CONFIG.gachaRewards.legendary.name,
                batch: results,
                kind: 'metaphor',
                achievementIds: [
                    ...revealedAchievements,
                    ...((GameState.get('pullsDone') || 0) >= 2 ? ['rng_survivor'] : []),
                    'legendary'
                ]
            });
            return;
        }

        if (hasGojo) {
            for (const r of results) GachaRoster.applyPull(r);
            await this.playPullAnimation(this._pullMythicBreak ? 'epic' : (goldSurprise ? 'rare' : 'mythic'), spend, {
                fiveCount: goldSurprise && !this._pullMythicBreak ? 0 : Math.max(1, fiveCount),
                goldSurprise: this._pullGoldSurprise,
                mythicForce: this._pullMythicBreak
            });
            await this.showPullResults(el, results);
            revealedAchievements.forEach(id => Achievements.show(id));
            if ((GameState.get('pullsDone') || 0) >= 2) Achievements.show('rng_survivor');
            this.showEgg('¡Satoru Gojo 6★! THE 50/50 se ha desbloqueado en Historia.');
            this._freshHistoryCount = results.length;
            const action = this._lastResultsAction;
            this._lastResultsAction = null;
            this.refreshStats(el);
            this._pullGoldSurprise = false;
            this._pullMythicBreak = false;
            this.pulling = false;
            this.handleResultsAction(el, action);
            return;
        }

        await this.playPullAnimation(presented, spend, {
            fiveCount: (goldSurprise && !this._pullMythicBreak) ? 0 : fiveCount,
            goldSurprise: this._pullGoldSurprise,
            mythicForce: this._pullMythicBreak
        });
        for (const r of results) GachaRoster.applyPull(r);
        await this.showPullResults(el, results);
        revealedAchievements.forEach(id => Achievements.show(id));
        if ((GameState.get('pullsDone') || 0) >= 2) Achievements.show('rng_survivor');
        this._freshHistoryCount = results.length;
        const action = this._lastResultsAction;
        this._lastResultsAction = null;
        if (mythicCount >= 1) {
            this.showEgg(`✦ ${mythicCount > 1 ? 'MÚLTIPLE 6★ MÍTICO' : '6★ MÍTICO'} · aura carmesí`);
        } else if (fiveCount >= 2) {
            this.showEgg(`✦ DOBLE 5★ · ${fiveCount} señales legendarias en esta convene`);
        }
        this.refreshStats(el);
        this._pullGoldSurprise = false;
        this._pullMythicBreak = false;
        this.pulling = false;
        this.handleResultsAction(el, action);
    },

    handleResultsAction(el, action) {
        if (!el || !action) return;
        if (action === 'history') {
            this.openPanel(el, 'history');
            return;
        }
        if (action.again === 1 || action.again === 10) {
            const n = action.again;
            const id = setTimeout(() => this.doPulls(el, n), 80);
            this._timers.push(id);
        }
    },

    spendBalance() {
        if (this.isEggBanner(this.activeBanner)) {
            return GameState.get('invocations') || 0;
        }
        if (this.activeBanner === 'metaphor') {
            return GameState.get('metaphorTickets') || 0;
        }
        return GameState.get('invocations') || 0;
    },

    spendUnitLabel() {
        if (this.activeBanner === 'metaphor') return 'META';
        return 'INV';
    },

    renderHistoryList(all, shortLabel, emptyMsg) {
        if (!all.length) return `<p style="opacity:0.65">${emptyMsg}</p>`;
        const fresh = Math.max(0, this._freshHistoryCount || 0);
        return all.slice().reverse().slice(0, 40).map((h, i) => {
            const isFresh = i < fresh;
            const isFive = (h.stars || 0) >= 5 || h.rarity === 'epic' || h.rarity === 'legendary';
            const cls = [
                'pull-item',
                isFresh ? 'is-fresh' : '',
                isFive ? 'is-five' : ''
            ].filter(Boolean).join(' ');
            return `
                <div class="${cls}">
                    <span class="pull-stars ${h.rarity}">${'★'.repeat(h.stars || 3)}</span>
                    <span>${h.reward}${h.featured ? ' · DESTACADO' : ''} · ${shortLabel}${isFresh ? ' <em class="pull-fresh-tag">NUEVO</em>' : ''}</span>
                </div>`;
        }).join('');
    },

    bestRarity(rarities) {
        const order = ['common', 'rare', 'epic', 'mythic', 'legendary', 'celestial'];
        return rarities.reduce((b, r) => order.indexOf(r) > order.indexOf(b) ? r : b, 'common');
    },

    refreshStats(el) {
        if (this.isEggBanner(this.activeBanner)) {
            this.refreshEggStats(el, this.activeBanner);
            return;
        }
        const bannerId = this.isSeriesBanner(this.activeBanner) ? this.activeBanner : 'onepiece';
        const b = GachaRoster.BANNERS[bannerId];
        const st = GachaRoster.getState(bannerId);
        const invocations = GameState.get('invocations') || 0;
        const metaTickets = GameState.get('metaphorTickets') || 0;
        const chiki = GameState.get('chikistrites') || 0;
        const progress = GachaRoster.collectionProgress();
        const isMeta = !!b.isMetaphor;
        const spendBal = isMeta ? metaTickets : invocations;

        const setText = (sel, text) => {
            const node = el.querySelector(sel);
            if (node) node.textContent = text;
        };
        setText('#gacha-invocations', invocations);
        setText('#gacha-chikistrites', chiki.toLocaleString('es-ES'));
        setText('#gacha-meta-tickets', metaTickets);
        setText('#gacha-star-seals', GameState.get('starSeals') || 0);
        setText('#gacha-invocations-dock', isMeta ? metaTickets : invocations);
        setText('#gacha-pity', isMeta
            ? (GameState.get('legendaryObtained') ? 'METAPHOR OBTENIDO' : 'Garantía Metaphor 7★')
            : `Garantía · ${b.short}`);
        setText('#gacha-pity-count', isMeta
            ? `7★ ${st.pity7 || 0}/${b.hard7 || 80} · 4★ ${st.pity4}/${b.hard4}`
            : `6★ ${st.pity6 || 0}/${b.hard6 || 80} · 5★ ${st.pity5}/${b.hard5}`);
        setText('#details-pity', String(isMeta ? (st.pity7 || 0) : (st.pity6 || 0)));
        setText('#gacha-pity-hint', this.pityHintText(b, st));
        setText('#gw-featured-label', st.guaranteedFeatured
            ? `Garantía destacado · próximo ${b.featuredStars || (isMeta ? 7 : 5)}★ = ${b.featured}`
            : b.featuredNote);
        setText('#gacha-left', isMeta
            ? `${metaTickets} tiradas rojas · finales de apartado + THE 50/50 · garantía ${b.hard7 || 80}`
            : `${invocations} INV · ${chiki.toLocaleString('es-ES')} Chiki · ${st.pulls} tiradas en ${b.short} · colección ${progress.have}/${progress.total}`);

        const fill = el.querySelector('#pity-fill');
        const pityNow = isMeta ? (st.pity7 || 0) : (st.pity6 || 0);
        const pityHard = isMeta ? (b.hard7 || 80) : (b.hard6 || 80);
        const pitySoft = isMeta ? (b.soft7 || 50) : (b.soft6 || 55);
        if (fill) fill.style.width = `${Math.min(100, (pityNow / pityHard) * 100)}%`;
        fill?.classList.toggle('soft-active', pityNow >= pitySoft && pityNow < pityHard);

        const metaDone = bannerId === 'metaphor' && GameState.get('legendaryObtained');
        const locked = !GachaRoster.isBannerUnlocked(bannerId);
        const btn1 = el.querySelector('#btn-pull-1');
        const btn10 = el.querySelector('#btn-pull-10');
        if (btn1) btn1.disabled = locked || metaDone || spendBal < 1;
        if (btn10) btn10.disabled = locked || metaDone || spendBal < 10;
        this.syncSpendUI(el, isMeta ? 'meta' : 'inv');

        // Unlock thumb visuals
        el.querySelectorAll('[data-banner]').forEach((thumb) => {
            const id = thumb.dataset.banner;
            if (!this.isSeriesBanner(id)) return;
            thumb.classList.toggle('is-locked', !GachaRoster.isBannerUnlocked(id));
        });

        const history = el.querySelector('#pull-history');
        if (history) {
            const all = st.history || [];
            history.innerHTML = this.renderHistoryList(all, b.short, `Aún no hay tiradas en ${b.series}.`);
        }
        if (typeof DupesShop !== 'undefined') DupesShop.refreshIfOpen();
    },

    ensurePullOverlay() {
        let overlay = document.getElementById('pull-overlay');
        if (!overlay) return null;
        overlay.innerHTML = `
            <div class="pull-stage">
                <div class="pull-void" aria-hidden="true"></div>
                <div class="pull-chamber" id="pull-chamber" aria-hidden="true"></div>
                <div class="pull-shard-field" id="pull-shard-field" aria-hidden="true"></div>
                <div class="pull-constellation" id="pull-constellation" aria-hidden="true"></div>
                <div class="pull-rail" id="pull-rail" aria-hidden="true"></div>
                <div class="pull-nebula" id="pull-nebula" aria-hidden="true"></div>
                <div class="pull-beams" id="pull-beams" aria-hidden="true"></div>
                <div class="pull-streaks" id="pull-streaks" aria-hidden="true"></div>
                <div class="pull-stars-field" id="pull-stars-field" aria-hidden="true"></div>
                <div class="pull-chroma" id="pull-chroma"></div>
                <div class="pull-horizon" id="pull-horizon" aria-hidden="true"></div>
                <div class="pull-pillar" id="pull-pillar" aria-hidden="true"></div>
                <div class="pull-arcs" id="pull-arcs" aria-hidden="true">
                    <span class="pull-arc" style="--inset:6%;--spin:14s;--dir:normal"></span>
                    <span class="pull-arc is-dashed" style="--inset:16%;--spin:19s;--dir:reverse"></span>
                    <span class="pull-arc" style="--inset:28%;--spin:11s;--dir:normal"></span>
                    <span class="pull-arc is-dashed" style="--inset:40%;--spin:23s;--dir:reverse"></span>
                </div>
                <div class="pull-wave" id="pull-wave" aria-hidden="true"></div>
                <div class="pull-lines" id="pull-lines"></div>
                <div class="pull-portal" id="pull-portal">
                    <span class="pull-vortex pull-vortex-a"></span>
                    <span class="pull-vortex pull-vortex-b"></span>
                    <span class="pull-vortex pull-vortex-c"></span>
                    <span class="pull-ring pull-ring-a"></span>
                    <span class="pull-ring pull-ring-b"></span>
                    <span class="pull-ring pull-ring-c"></span>
                    <span class="pull-core" id="pull-core"><i class="pull-glint" aria-hidden="true"></i></span>
                </div>
                <div class="pull-comets" id="pull-comets" aria-hidden="true"></div>
                <div class="pull-sigils" id="pull-sigils" aria-hidden="true"></div>
                <div class="pull-jackpot-burst" aria-hidden="true">
                    <span class="pull-jackpot-orbit orbit-a"></span>
                    <span class="pull-jackpot-orbit orbit-b"></span>
                    <span class="pull-jackpot-starline">✦　✦　✦</span>
                </div>
                <div class="pull-vignette" aria-hidden="true"></div>
                <div class="pull-flash" id="pull-flash"></div>
                <div class="pull-text" id="pull-text"></div>
                <div class="pull-tier-stack" id="pull-tier-stack" aria-hidden="true"></div>
                <video class="pull-wuwa-video" id="pull-wuwa-video" playsinline preload="auto"></video>
                <button type="button" class="pull-skip hidden" id="pull-skip">SALTAR</button>
            </div>
        `;
        return overlay;
    },

    resetPullOverlay() {
        const overlay = document.getElementById('pull-overlay');
        if (!overlay) return;
        overlay.classList.remove('active', 'is-shaking', 'jackpot-gold', 'jackpot-red', 'tier-charge', 'tier-common', 'tier-rare', 'tier-epic', 'tier-mythic', 'tier-legendary', 'tier-celestial');
        overlay.classList.add('hidden');
        const kill = overlay.querySelectorAll('.pull-portal, .pull-flash, .pull-text, .pull-chroma, .pull-lines, .pull-core, .pull-wave, .pull-sigils, .pull-ring, .pull-beams, .pull-horizon, .pull-stage, .pull-nebula, .pull-streaks, .pull-pillar, .pull-arcs, .pull-comets, .pull-vortex, .pull-chamber, .pull-shard-field, .pull-constellation, .pull-rail');
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf(kill);
        }
        const skip = overlay.querySelector('#pull-skip');
        if (skip) {
            skip.classList.add('hidden');
            skip.onclick = null;
        }
        const textEl = overlay.querySelector('#pull-text');
        if (textEl) textEl.innerHTML = '';
        const lines = overlay.querySelector('#pull-lines');
        if (lines) lines.innerHTML = '';
        const sigils = overlay.querySelector('#pull-sigils');
        if (sigils) sigils.innerHTML = '';
        const field = overlay.querySelector('#pull-stars-field');
        if (field) field.innerHTML = '';
        const streaks = overlay.querySelector('#pull-streaks');
        if (streaks) streaks.innerHTML = '';
        const comets = overlay.querySelector('#pull-comets');
        if (comets) comets.innerHTML = '';
        const stack = overlay.querySelector('#pull-tier-stack');
        if (stack) stack.innerHTML = '';
        const chroma = overlay.querySelector('#pull-chroma');
        if (chroma) chroma.className = 'pull-chroma';
        const beams = overlay.querySelector('#pull-beams');
        if (beams) beams.style.opacity = '0';
        const horizon = overlay.querySelector('#pull-horizon');
        if (horizon) horizon.style.opacity = '0';
        const nebula = overlay.querySelector('#pull-nebula');
        if (nebula) nebula.style.opacity = '0';
        const pillar = overlay.querySelector('#pull-pillar');
        if (pillar) pillar.style.opacity = '0';
        const arcs = overlay.querySelector('#pull-arcs');
        if (arcs) arcs.style.opacity = '0';
        overlay.classList.remove('cinematic', 'phase-open', 'phase-lock', 'phase-launch', 'phase-break');
        try { AudioManager.gacha.exitConvene?.(); } catch (_) { /* */ }
    },

    pullAnimationVideo(rarity, opts = {}) {
        if (opts.mythicForce || rarity === 'mythic') return 'assets/gacha/pull-videos/wuwa-red.mp4';
        if (rarity === 'rare') return 'assets/gacha/pull-videos/wuwa-purple.mp4';
        if (rarity === 'epic' || rarity === 'legendary') return 'assets/gacha/pull-videos/wuwa-gold.mp4';
        return '';
    },

    async playWuwaPullVideo(overlay, source) {
        const video = overlay.querySelector('#pull-wuwa-video');
        const skipBtn = overlay.querySelector('#pull-skip');
        if (!video || !source) return false;

        const normalMusic = Number.isFinite(AudioManager?._conveneMusicNorm)
            ? AudioManager._conveneMusicNorm
            : 1;
        let settled = false;
        let timeout = null;
        let endHold = null;

        video.classList.remove('is-ready');
        video.muted = false;
        video.volume = 1;
        video.src = `${source}?v=${this.CACHE}`;
        video.load();
        if (skipBtn) skipBtn.classList.remove('hidden');
        try { AudioManager._fadeMusicTo?.(0.03, 220); } catch (_) { /* */ }

        return new Promise((resolve) => {
            const finish = () => {
                if (settled) return;
                settled = true;
                if (timeout) clearTimeout(timeout);
                if (endHold) clearTimeout(endHold);
                video.pause();
                video.onended = null;
                video.onerror = null;
                video.oncanplay = null;
                video.classList.remove('is-ready');
                video.removeAttribute('src');
                video.load();
                if (skipBtn) {
                    skipBtn.classList.add('hidden');
                    skipBtn.onclick = null;
                }
                overlay.classList.remove('is-wuwa-video');
                try { AudioManager._fadeMusicTo?.(Math.max(0.28, normalMusic), 260); } catch (_) { /* */ }
                this.resetPullOverlay();
                resolve(true);
            };

            if (skipBtn) {
                skipBtn.onclick = () => {
                    this._skipPull = true;
                    try { AudioManager.ui.click(); } catch (_) { /* */ }
                    finish();
                };
            }
            video.onended = () => {
                if (settled || endHold) return;
                endHold = setTimeout(finish, 220);
            };
            video.onerror = finish;
            video.oncanplay = () => {
                overlay.classList.add('active', 'cinematic', 'is-wuwa-video');
                video.classList.add('is-ready');
                const playback = video.play();
                if (playback?.catch) playback.catch(() => {
                    video.muted = true;
                    video.play().catch(finish);
                });
            };
            timeout = setTimeout(finish, 10000);
        });
    },

    /**
     * WuWa / Genshin-style convene:
     * opens on lowest tier, climbs with fakeout tension to peak rarity.
     * opts.fiveCount ≥ 2 → doble legendario finale.
     */
    async playPullAnimation(rarity, count, opts = {}) {
        const overlay = this.ensurePullOverlay();
        if (!overlay) return;
        try { window.MotionFx?.ensureGsap?.(); } catch (_) { /* */ }

        this._skipPull = false;
        overlay.classList.remove('hidden', 'is-fakeout', 'is-double', 'phase-open', 'phase-lock', 'phase-launch', 'phase-break');
        overlay.classList.remove('active', 'cinematic', 'phase-open');

        const portal = overlay.querySelector('#pull-portal');
        const core = overlay.querySelector('#pull-core');
        const flash = overlay.querySelector('#pull-flash');
        const textEl = overlay.querySelector('#pull-text');
        const chroma = overlay.querySelector('#pull-chroma');
        const linesHost = overlay.querySelector('#pull-lines');
        const sigils = overlay.querySelector('#pull-sigils');
        const wave = overlay.querySelector('#pull-wave');
        const field = overlay.querySelector('#pull-stars-field');
        const stack = overlay.querySelector('#pull-tier-stack');
        const beams = overlay.querySelector('#pull-beams');
        const horizon = overlay.querySelector('#pull-horizon');
        const nebula = overlay.querySelector('#pull-nebula');
        const streaks = overlay.querySelector('#pull-streaks');
        const pillar = overlay.querySelector('#pull-pillar');
        const arcs = overlay.querySelector('#pull-arcs');
        const comets = overlay.querySelector('#pull-comets');
        const skipBtn = overlay.querySelector('#pull-skip');
        const rings = overlay.querySelectorAll('.pull-ring');
        const chamber = overlay.querySelector('#pull-chamber');
        const shardField = overlay.querySelector('#pull-shard-field');
        const constellation = overlay.querySelector('#pull-constellation');
        const rail = overlay.querySelector('#pull-rail');

        const ladder = ['common', 'rare', 'epic', 'mythic', 'legendary', 'celestial'];
        const peak = ladder.includes(rarity) ? rarity : 'common';
        const peakIdx = ladder.indexOf(peak);
        const fiveCount = Math.max(0, opts.fiveCount || 0);
        const isDouble = fiveCount >= 2;
        const goldSurprise = !!opts.goldSurprise;
        const mythicForce = !!opts.mythicForce;
        const celestialForce = !!opts.celestialForce;

        const pullVideo = this.pullAnimationVideo(peak, opts);
        if (pullVideo) {
            return this.playWuwaPullVideo(overlay, pullVideo);
        }

        overlay.classList.add('active', 'cinematic', 'phase-open');

        const setPhase = (phase) => {
            overlay.classList.remove('phase-open', 'phase-lock', 'phase-launch', 'phase-break');
            overlay.classList.add(`phase-${phase}`);
        };

        if (shardField) {
            shardField.innerHTML = '';
            for (let i = 0; i < 30; i++) {
                const shard = document.createElement('span');
                shard.style.setProperty('--sx', `${(Math.random() * 100).toFixed(1)}%`);
                shard.style.setProperty('--sy', `${(Math.random() * 100).toFixed(1)}%`);
                shard.style.setProperty('--sr', `${Math.round(Math.random() * 360)}deg`);
                shard.style.setProperty('--sd', `${(Math.random() * 0.8).toFixed(2)}s`);
                shardField.appendChild(shard);
            }
        }
        if (constellation) {
            constellation.innerHTML = Array.from({ length: 8 }, (_, i) => `<i style="--ci:${i}"></i>`).join('');
        }

        const meta = {
            common: {
                color: '#9ec9ff',
                glow: 'rgba(126, 200, 255, 0.55)',
                label: 'SEÑAL ESTÁNDAR',
                stars: '★★★',
                sfx: 'pullCommon'
            },
            rare: {
                color: '#c9a0ff',
                glow: 'rgba(180, 120, 255, 0.6)',
                label: 'RESONANCIA RARA',
                stars: '★★★★',
                sfx: 'pullRare'
            },
            epic: {
                color: '#ffd76a',
                glow: 'rgba(244, 208, 63, 0.7)',
                label: 'RESONANCIA ÉPICA',
                stars: '★★★★★',
                sfx: 'pullEpic'
            },
            mythic: {
                color: '#ff2a4a',
                glow: 'rgba(255, 40, 70, 0.9)',
                label: 'RESONANCIA MÍTICA',
                stars: '★★★★★★',
                sfx: 'pullLegendary'
            },
            legendary: {
                color: '#ffe9a0',
                glow: 'rgba(255, 200, 80, 0.85)',
                label: 'SEÑAL LEGENDARIA',
                stars: '★★★★★',
                sfx: 'pullLegendary'
            },
            celestial: {
                color: '#c084fc',
                glow: 'rgba(168, 85, 247, 0.95)',
                label: 'SEÑAL CELESTIAL',
                stars: '★★★★★★★',
                sfx: 'pullLegendary'
            }
        };

        if (skipBtn) {
            skipBtn.classList.remove('hidden');
            skipBtn.onclick = () => {
                this._skipPull = true;
                AudioManager.ui.click();
            };
        }

        if (field) {
            field.innerHTML = '';
            for (let i = 0; i < 48; i++) {
                const s = document.createElement('span');
                s.className = 'pull-dust';
                s.style.left = `${Math.random() * 100}%`;
                s.style.top = `${Math.random() * 100}%`;
                s.style.animationDelay = `${Math.random() * 2.4}s`;
                s.style.setProperty('--d', `${5 + Math.random() * 10}s`);
                s.style.setProperty('--dx', `${(Math.random() * 80 - 40).toFixed(1)}px`);
                field.appendChild(s);
            }
        }

        if (streaks) {
            streaks.innerHTML = '';
            for (let i = 0; i < 36; i++) {
                const s = document.createElement('span');
                s.className = 'pull-streak';
                s.style.setProperty('--x', `${Math.random() * 100}%`);
                s.style.setProperty('--len', `${50 + Math.random() * 140}px`);
                s.style.setProperty('--rot', `${-36 + Math.random() * 16}deg`);
                s.style.setProperty('--spd', `${1.8 + Math.random() * 1.6}s`);
                s.style.setProperty('--delay', `${(-Math.random() * 2.8).toFixed(2)}s`);
                s.style.setProperty('--dx', `${(Math.random() * 56 - 12).toFixed(1)}px`);
                streaks.appendChild(s);
            }
        }

        if (stack) {
            // Empty until each tier is revealed — pre-drawing peak pips spoils rarity
            stack.innerHTML = '';
            stack.classList.add('is-charging');
        }

        const revealPip = (tier) => {
            if (!stack) return;
            stack.classList.remove('is-charging');
            let pip = stack.querySelector(`[data-tier="${tier}"]`);
            if (!pip) {
                pip = document.createElement('span');
                pip.className = 'pull-tier-pip';
                pip.dataset.tier = tier;
                pip.dataset.i = String(stack.children.length);
                stack.appendChild(pip);
                if (typeof gsap !== 'undefined') {
                    this._gsapTweens.push(gsap.fromTo(pip, {
                        opacity: 0, scale: 0.4
                    }, {
                        opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)'
                    }));
                }
            }
            stack.querySelectorAll('.pull-tier-pip').forEach((p) => {
                const t = p.dataset.tier;
                p.classList.toggle('is-lit', ladder.indexOf(t) <= ladder.indexOf(tier));
                p.classList.toggle('is-current', t === tier);
            });
        };

        const applyCharge = () => {
            overlay.classList.remove('tier-common', 'tier-rare', 'tier-epic', 'tier-mythic', 'tier-legendary', 'tier-celestial');
            overlay.classList.add('tier-charge');
            if (chroma) {
                chroma.className = 'pull-chroma charge';
                chroma.style.opacity = '0.45';
            }
            if (beams) beams.style.opacity = '0.22';
            if (horizon) horizon.style.opacity = '0.28';
            if (nebula) nebula.style.opacity = '0.4';
            if (portal) {
                portal.style.borderColor = 'transparent';
                portal.style.boxShadow = 'none';
            }
            if (core) {
                core.style.background = 'transparent';
                core.style.boxShadow = 'none';
                const glint = core.querySelector('.pull-glint');
                if (glint) {
                    glint.style.filter = 'drop-shadow(0 0 10px #fff) drop-shadow(0 0 22px rgba(255,255,255,0.55))';
                }
            }
            rings.forEach((r, i) => {
                r.style.borderColor = 'rgba(255,255,255,0.45)';
                r.style.opacity = String(0.25 + i * 0.1);
            });
        };

        const applyTier = (tier) => {
            overlay.classList.remove('tier-charge', 'tier-common', 'tier-rare', 'tier-epic', 'tier-mythic', 'tier-legendary', 'tier-celestial');
            overlay.classList.add(`tier-${tier}`);
            const m = meta[tier];
            if (chroma) {
                chroma.className = `pull-chroma ${tier}`;
                chroma.style.opacity = '0.85';
            }
            if (beams) {
                beams.style.opacity = tier === 'common' ? '0.28' : tier === 'rare' ? '0.4' : tier === 'epic' ? '0.55' : tier === 'mythic' || tier === 'celestial' ? '0.75' : '0.65';
            }
            if (horizon) {
                horizon.style.opacity = tier === 'common' ? '0.3' : tier === 'rare' ? '0.45' : '0.65';
            }
            if (nebula) {
                nebula.style.opacity = tier === 'common' ? '0.55' : tier === 'rare' ? '0.7' : '0.9';
            }
            if (portal) {
                portal.style.borderColor = 'transparent';
                portal.style.boxShadow = 'none';
            }
            if (core) {
                core.style.background = 'transparent';
                core.style.boxShadow = 'none';
                const glint = core.querySelector('.pull-glint');
                if (glint) {
                    glint.style.filter = `drop-shadow(0 0 10px #fff) drop-shadow(0 0 28px ${m.glow})`;
                }
            }
            rings.forEach((r, i) => {
                r.style.borderColor = m.color;
                r.style.opacity = String(0.28 + i * 0.12);
            });
            revealPip(tier);
        };

        const setLabel = (tier, climbing, extra = '') => {
            if (!textEl) return;
            if (tier === 'charge') {
                textEl.innerHTML = `
                    ${count > 1 ? `<div class="pull-count-label">CONVENING ×${count}</div>` : ''}
                    ${extra ? `<div class="pull-extra-label">${extra}</div>` : ''}
                    <div class="pull-stars-label pull-stars-hidden" aria-hidden="true">&nbsp;</div>
                `;
                textEl.style.opacity = '1';
                return;
            }
            const m = meta[tier];
            textEl.innerHTML = `
                ${count > 1 ? `<div class="pull-count-label">CONVENING ×${count}</div>` : ''}
                ${extra ? `<div class="pull-extra-label">${extra}</div>` : ''}
                <div class="pull-stars-label" style="color:${m.color}">${m.stars}</div>
            `;
            textEl.style.opacity = '1';
        };

        const spawnLines = (tier, n) => {
            if (!linesHost) return;
            linesHost.innerHTML = '';
            const color = tier === 'charge' ? 'rgba(255,255,255,0.75)' : meta[tier].color;
            for (let i = 0; i < n; i++) {
                const line = document.createElement('div');
                line.className = 'pull-line';
                const angle = (360 / n) * i + (Math.random() * 8 - 4);
                line.style.transform = `rotate(${angle}deg) translateY(-6%)`;
                line.style.background = `linear-gradient(180deg, ${color}, transparent)`;
                linesHost.appendChild(line);
                if (typeof gsap !== 'undefined') {
                    this._gsapTweens.push(gsap.fromTo(line, {
                        opacity: 0, scaleY: 0.12
                    }, {
                        opacity: 0.95, scaleY: 1, duration: 0.6, delay: i * 0.02, ease: 'power2.out'
                    }));
                }
            }
        };

        const spawnSigils = () => {
            /* Sigils retired — WuWa uses orbital arcs instead */
            if (sigils) sigils.innerHTML = '';
        };

        const spawnComets = (tier, n = 10) => {
            if (!comets) return;
            comets.innerHTML = '';
            const peakHigh = tier === 'legendary' || tier === 'epic' || tier === 'mythic' || tier === 'celestial';
            for (let i = 0; i < n; i++) {
                const c = document.createElement('span');
                const isHero = peakHigh && i === 0;
                const cls = tier === 'mythic' ? 'is-red'
                    : tier === 'celestial' ? 'is-purple'
                    : (isHero || tier === 'legendary' || tier === 'epic') ? 'is-gold'
                    : tier === 'rare' ? 'is-purple'
                    : 'is-blue';
                c.className = `pull-comet ${cls}`;
                const ang = (Math.PI * 2 * i) / n + (Math.random() * 0.35);
                const dist = 18 + Math.random() * 38;
                const tx = Math.cos(ang) * dist;
                const ty = Math.sin(ang) * dist * 0.72;
                comets.appendChild(c);
                if (typeof gsap !== 'undefined') {
                    this._gsapTweens.push(gsap.fromTo(c, {
                        opacity: 0,
                        scale: 0.15,
                        x: tx * 14,
                        y: ty * 14
                    }, {
                        opacity: 1,
                        scale: isHero ? 1.6 : 1,
                        x: tx * 0.2,
                        y: ty * 0.2,
                        duration: 0.85 + Math.random() * 0.35,
                        delay: i * 0.04,
                        ease: 'power3.in',
                        onComplete: () => {
                            gsap.to(c, { opacity: 0, scale: 2.4, duration: 0.35, ease: 'power2.out' });
                        }
                    }));
                }
            }
        };

        const pulseWave = (tier) => {
            if (!wave) return;
            const m = meta[tier];
            wave.style.borderColor = m.color;
            wave.style.boxShadow = `0 0 48px ${m.glow}`;
            if (typeof gsap !== 'undefined') {
                // Keep left/top 50% centering — scale alone would pin waves to top-left.
                this._gsapTweens.push(gsap.fromTo(wave, {
                    opacity: 0.75,
                    scale: 0.2,
                    xPercent: -50,
                    yPercent: -50,
                    transformOrigin: '50% 50%'
                }, {
                    opacity: 0,
                    scale: 2.8,
                    xPercent: -50,
                    yPercent: -50,
                    duration: 1.05,
                    ease: 'power2.out'
                }));
            }
        };

        const softFlash = async (tier, peakOp = 0.45) => {
            if (!flash) return;
            flash.style.background = meta[tier].color;
            if (typeof gsap !== 'undefined') {
                gsap.to(flash, { opacity: peakOp, duration: 0.08 });
                await this.waitOrSkip(80);
                gsap.to(flash, { opacity: 0, duration: 0.5 });
            } else {
                flash.style.opacity = String(peakOp);
                await this.waitOrSkip(80);
                flash.style.opacity = '0';
            }
        };

        const shake = () => {
            if (typeof gsap === 'undefined') return;
            // Pixel offsets only — keep GSAP xPercent/yPercent centering intact
            if (portal) {
                const tl = gsap.timeline({ defaults: { force3D: true, ease: 'none' } });
                tl.to(portal, { x: -5, y: 3, duration: 0.08 })
                    .to(portal, { x: 6, y: -3, duration: 0.09 })
                    .to(portal, { x: -4, y: -2, duration: 0.08 })
                    .to(portal, { x: 3, y: 2, duration: 0.09 })
                    .to(portal, { x: 0, y: 0, duration: 0.1 });
                this._gsapTweens.push(tl);
            }
            const stage = overlay.querySelector('.pull-stage');
            if (stage) {
                const tl2 = gsap.timeline({ defaults: { force3D: true, ease: 'none' } });
                tl2.to(stage, { x: -4, y: 2, duration: 0.08 })
                    .to(stage, { x: 5, y: -3, duration: 0.09 })
                    .to(stage, { x: -3, y: -1, duration: 0.08 })
                    .to(stage, { x: 2, y: 2, duration: 0.09 })
                    .to(stage, { x: 0, y: 0, duration: 0.1 });
                this._gsapTweens.push(tl2);
            }
        };

        const playTierSfx = (tier, isUpgrade) => {
            if (isUpgrade) AudioManager.gacha.upgrade();
            AudioManager.gacha.reveal(tier);
        };

        AudioManager.gacha.start();
        try { AudioManager.gacha.enterConvene?.(); } catch (_) { /* */ }
        try { AudioManager.gacha.lock?.(); } catch (_) { /* */ }
        // Neutral charge — no rarity color / pip count until the climb reveals it
        applyCharge();
        setLabel('charge', true);
        spawnSigils();
        spawnLines('charge', 8);

        if (typeof gsap !== 'undefined' && portal) {
            // Keep CSS centering (left/top 50%) — animate via xPercent/yPercent so scale
            // does not wipe translate(-50%,-50%) and shove FX to the corner.
            gsap.set(portal, { xPercent: -50, yPercent: -50, transformOrigin: '50% 50%' });
            if (wave) gsap.set(wave, { xPercent: -50, yPercent: -50, transformOrigin: '50% 50%' });
            this._gsapTweens.push(gsap.fromTo(portal, {
                opacity: 0, scale: 0.35, xPercent: -50, yPercent: -50
            }, {
                opacity: 1, scale: 1, xPercent: -50, yPercent: -50,
                duration: 1.45, ease: 'power3.out', force3D: true
            }));
            if (nebula) {
                this._gsapTweens.push(gsap.to(nebula, { opacity: 0.4, duration: 1.2 }));
            }
            if (streaks) {
                this._gsapTweens.push(gsap.to(streaks, { opacity: 0.85, duration: 0.9 }));
            }
            if (pillar) {
                this._gsapTweens.push(gsap.fromTo(pillar, {
                    opacity: 0, scaleY: 0.2
                }, {
                    opacity: 0.7, scaleY: 1, duration: 1.4, ease: 'power2.out'
                }));
            }
            if (arcs) {
                this._gsapTweens.push(gsap.to(arcs, { opacity: 0.75, duration: 1.1, delay: 0.15 }));
            }
            if (horizon) {
                this._gsapTweens.push(gsap.fromTo(horizon, { scaleX: 0.2, opacity: 0 }, {
                    scaleX: 1, opacity: 0.28, duration: 1.15, ease: 'power2.out'
                }));
            }
            if (beams) {
                this._gsapTweens.push(gsap.to(beams, { opacity: 0.22, duration: 1.1 }));
            }
            rings.forEach((r, i) => {
                this._gsapTweens.push(gsap.to(r, {
                    rotation: i % 2 === 0 ? 360 : -360,
                    duration: 8 + i * 2.2, repeat: -1, ease: 'none'
                }));
            });
            if (core) {
                const glint = core.querySelector('.pull-glint') || core;
                this._gsapTweens.push(gsap.to(glint, {
                    scale: 1.18, duration: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut'
                }));
            }
        }

        if (typeof gsap !== 'undefined') {
            if (chamber) this._gsapTweens.push(gsap.fromTo(chamber, { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }));
            if (shardField) this._gsapTweens.push(gsap.to(shardField, { opacity: 0.9, duration: 0.75 }));
            if (constellation) this._gsapTweens.push(gsap.to(constellation, { opacity: 0.75, duration: 1.15, delay: 0.2 }));
            if (rail) this._gsapTweens.push(gsap.fromTo(rail, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 0.9, duration: 0.65, delay: 0.35, ease: 'power2.out' }));
        }
        await this.waitOrSkip(720);
        if (this._skipPull) {
            setPhase('break');
        } else {
            setPhase('lock');
            try { AudioManager.gacha.converge?.(); } catch (_) { /* */ }
            await this.waitOrSkip(620);
        }
        if (this._skipPull) {
            applyTier(peak);
            setLabel(peak, false);
            playTierSfx(peak, false);
            await softFlash(peak, peak === 'legendary' ? 0.75 : 0.55);
            await this.waitOrSkip(160);
            this.resetPullOverlay();
            return;
        }
        setPhase('launch');
        try { AudioManager.gacha.launch?.(); } catch (_) { /* */ }
        if (rail && typeof gsap !== 'undefined') this._gsapTweens.push(gsap.to(rail, { scaleX: 1.8, opacity: 0, duration: 0.7, ease: 'power3.in' }));
        await this.waitOrSkip(420);

        for (let step = 0; step <= peakIdx; step++) {
            if (this._skipPull) break;
            const tier = ladder[step];
            const isPeak = step === peakIdx;
            const isUpgrade = step > 0;

            if (isUpgrade) {
                setPhase('lock');
                if (typeof gsap !== 'undefined' && portal) {
                    this._gsapTweens.push(gsap.to(portal, {
                        scale: 0.88, xPercent: -50, yPercent: -50,
                        duration: 0.38, yoyo: true, repeat: isPeak ? 3 : 2,
                        ease: 'sine.inOut', force3D: true
                    }));
                }
                await this.waitOrSkip(isPeak ? 980 : 680);
                if (this._skipPull) break;

                applyTier(tier);
                setPhase(isPeak ? 'break' : 'launch');
                spawnSigils();
                spawnLines(tier, 8 + step * 3);
                pulseWave(tier);
                shake();
                setLabel(tier, !isPeak);
                playTierSfx(tier, true);
                await softFlash(tier, 0.35 + step * 0.08);

                if (typeof ParticleSystem !== 'undefined') {
                    ParticleSystem.burst(
                        window.innerWidth / 2,
                        window.innerHeight / 2,
                        18 + step * 12,
                        meta[tier].color
                    );
                }

                if (typeof gsap !== 'undefined' && portal) {
                    this._gsapTweens.push(gsap.to(portal, {
                        scale: 1 + step * 0.22,
                        rotation: `+=${140 + step * 50}`,
                        xPercent: -50,
                        yPercent: -50,
                        duration: 0.95,
                        ease: 'power2.out'
                    }));
                }
            } else {
                // First commit: common (or whatever step 0 is) — color appears here, not at open
                applyTier(tier);
                spawnLines(tier, 8);
                pulseWave(tier);
                setLabel(tier, !isPeak);
                playTierSfx(tier, false);
                await softFlash(tier, 0.28);
                if (typeof gsap !== 'undefined' && portal) {
                    this._gsapTweens.push(gsap.to(portal, {
                        scale: 1.1, xPercent: -50, yPercent: -50,
                        duration: 0.75, yoyo: true, repeat: 1, ease: 'sine.inOut'
                    }));
                }
            }

            const dwell = isPeak
                ? (tier === 'celestial' ? 2200 : tier === 'mythic' ? 1900 : tier === 'legendary' ? 1800 : tier === 'epic' ? 1450 : tier === 'rare' ? 1000 : 780)
                : (step === 0 ? 1000 : 720);
            await this.waitOrSkip(dwell);
        }

        // Si es fakeout "para bien", el portal se queda en morado con un pelín más de tensión.
        // El oro real salta en el reveal individual.
        if (!this._skipPull && goldSurprise && peak === 'rare') {
            overlay.classList.add('is-fakeout');
            setLabel('rare', true, 'RESONANCIA');
            shake();
            await softFlash('rare', 0.42);
            await this.waitOrSkip(520);
            setLabel('rare', false);
            overlay.classList.remove('is-fakeout');
        }

        // 6★: portal se queda en oro… el rojo destroza en el solo reveal.
        if (!this._skipPull && mythicForce && peak === 'epic') {
            overlay.classList.add('is-fakeout', 'is-mythic-fakeout');
            setLabel('epic', true, 'LECTURA INESTABLE');
            shake();
            try { AudioManager.gacha.anomaly(); } catch (_) { /* */ }
            await softFlash('epic', 0.55);
            await this.waitOrSkip(640);
            setLabel('epic', false, 'LECTURA INESTABLE');
            overlay.classList.remove('is-fakeout', 'is-mythic-fakeout');
        }

        if (!this._skipPull) {
            setPhase('break');
            applyTier(peak);
            if (peak === 'mythic' || peak === 'celestial') overlay.classList.add('jackpot-red');
            else if (peak === 'epic' || peak === 'legendary') overlay.classList.add('jackpot-gold');
            const finaleExtra = isDouble
                ? 'DOBLE ★★★★★'
                : (peak === 'mythic' ? 'AURA CARMESÍ' : peak === 'celestial' ? 'DESTINO CELESTIAL' : '');
            if (isDouble) overlay.classList.add('is-double');
            setLabel(peak, false, finaleExtra);
            spawnLines(peak, peak === 'celestial' ? 22 : peak === 'mythic' ? 18 : peak === 'legendary' ? 16 : peak === 'epic' ? 12 : 8);
            spawnComets(peak, count > 1 ? Math.min(12, Math.max(6, count)) : 5);
            pulseWave(peak);
            shake();
            if (streaks && typeof gsap !== 'undefined') {
                this._gsapTweens.push(gsap.to(streaks, { opacity: 1, duration: 0.35 }));
            }
            if (pillar && typeof gsap !== 'undefined') {
                this._gsapTweens.push(gsap.to(pillar, { opacity: 0.95, duration: 0.4 }));
            }
            /* Peak SFX already played in the climb loop — only reinforce high tiers with a short lead-in */
            const needsFinaleSting = peak === 'legendary' || peak === 'mythic' || peak === 'celestial' || isDouble;
            if (needsFinaleSting) {
                await this.waitOrSkip(peak === 'celestial' || peak === 'mythic' ? 420 : 280);
                if (peak === 'mythic' || peak === 'celestial') {
                    try { AudioManager.gacha.anomaly(); } catch (_) { /* */ }
                    playTierSfx(peak, false);
                } else {
                    playTierSfx(peak, false);
                }
            }
            if (typeof gsap !== 'undefined' && portal) {
                this._gsapTweens.push(gsap.to(portal, {
                    scale: peak === 'legendary' || peak === 'mythic' || peak === 'celestial' ? 1.55
                        : peak === 'epic' ? 1.4
                        : peak === 'rare' ? 1.28
                        : 1.18,
                    xPercent: -50,
                    yPercent: -50,
                    duration: 1.05,
                    ease: 'power2.out'
                }));
            }
            if (typeof ParticleSystem !== 'undefined') {
                ParticleSystem.burst(
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    (peak === 'legendary' ? 56 : peak === 'epic' ? 40 : peak === 'rare' ? 26 : 14) + (isDouble ? 24 : 0),
                    meta[peak].color
                );
                if (isDouble) {
                    setTimeout(() => {
                        ParticleSystem.burst(
                            window.innerWidth / 2,
                            window.innerHeight / 2,
                            40,
                            '#ffe9a0'
                        );
                    }, 220);
                }
            }
            await softFlash(peak, peak === 'legendary' || isDouble ? 0.78 : 0.52);
            await this.waitOrSkip(peak === 'legendary' || isDouble ? 1100 : peak === 'epic' ? 780 : peak === 'rare' ? 720 : 480);
        } else {
            applyTier(peak);
            setLabel(peak, false, isDouble ? 'DOBLE ★★★★★' : '');
            playTierSfx(peak, false);
            await softFlash(peak, 0.55);
            await this.waitOrSkip(150);
        }

        overlay.classList.remove('is-double', 'is-fakeout');
        this.resetPullOverlay();
    },

    /** Put 5★/6★ later in the flip order so the bait portal lie lands harder. */
    stageResultsForReveal(results) {
        const list = (results || []).slice();
        if (!this._pullGoldSurprise && !this._pullMythicBreak) return list;
        const highs = [];
        const rest = [];
        list.forEach((r) => {
            if (this.isFiveStarResult(r)) highs.push(r);
            else rest.push(r);
        });
        if (!highs.length || !rest.length) return list;
        const insertAt = Math.min(rest.length, Math.max(1, Math.ceil(rest.length * 0.55)));
        const out = rest.slice();
        highs.forEach((f, i) => {
            out.splice(Math.min(out.length, insertAt + i), 0, {
                ...f,
                _goldBreak: !this.isMythicResult(f),
                _mythicBreak: this.isMythicResult(f)
            });
        });
        return out;
    },

    isFiveStarResult(r) {
        return !!r && ((r.stars || 0) >= 5 || r.rarity === 'epic' || r.rarity === 'mythic'
            || r.rarity === 'legendary' || r.rarity === 'celestial');
    },

    isMythicResult(r) {
        return !!r && ((r.stars || 0) >= 6 || r.rarity === 'mythic');
    },

    isCelestialResult(r) {
        return !!r && ((r.stars || 0) >= 7 || r.rarity === 'celestial' || r.metaphor || r.kind === 'legendary');
    },

    /** Full-screen one-by-one reveals. Returns true if user skipped to summary. */
    async playSoloReveals(results) {
        this._skipSolo = false;
        const staged = this.stageResultsForReveal(results);
        if (!staged?.length) return true;
        // Portal skip + gold surprise → still play 5★ bait→break, skip filler.
        const onlyGoldBreaks = this._skipPull && (this._pullGoldSurprise || this._pullMythicBreak);
        const playList = onlyGoldBreaks
            ? staged.filter((r) => this.isFiveStarResult(r))
            : staged;
        if (!playList.length) return true;
        for (let i = 0; i < playList.length; i++) {
            if (this._skipSolo) return true;
            await this.showOneSoloReveal(playList[i], i, playList.length);
        }
        return this._skipSolo;
    },

    showOneSoloReveal(r, index, total) {
        return new Promise((resolve) => {
            if (this._soloEl) {
                this._soloEl.remove();
                this._soloEl = null;
            }
            const rarity = r.rarity || 'common';
            const isFive = this.isFiveStarResult(r);
            // 6★ always bait as gold then shatter to red. 5★ optional purple→gold.
            const forceMythic = this.isMythicResult(r);
            const doGoldBreak = forceMythic
                || (isFive && (this._pullGoldSurprise || r._goldBreak));
            const baitTier = forceMythic ? 'epic' : 'rare';
            const artClass = this.resultArtClass(r);
            const needsVideoGate = this.cutinVideoCandidates(r).length > 0;
            const converted = !!(r.converted || r.kind === 'converted');
            const realName = r.reward || '???';
            const realSub = converted
                ? `CONVERTIDO · ${(r.convertLabel || '').toUpperCase()}`
                : this.resultMetaLabel(r);
            const outcome = this.resultOutcome(r);
            const el = document.createElement('div');
            el.className = doGoldBreak
                ? `pull-solo rarity-${baitTier} is-bait${forceMythic ? ' is-mythic-bait' : ''}`
                : `pull-solo rarity-${rarity}${converted ? ' is-converted' : ''} is-revealing`;
            el.innerHTML = `
                <div class="pull-solo-flash" id="solo-flash" aria-hidden="true"></div>
                <div class="pull-solo-glow" aria-hidden="true"></div>
                <div class="pull-solo-seal" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
                <div class="pull-solo-scan" aria-hidden="true"></div>
                <div class="pull-solo-impact" aria-hidden="true"></div>
                <div class="pull-solo-burst" id="solo-burst" aria-hidden="true"></div>
                <div class="pull-solo-rays" id="solo-rays" aria-hidden="true"></div>
                <div class="pull-solo-shatter" id="solo-shatter" aria-hidden="true"></div>
                <div class="pull-solo-art ${artClass}" id="solo-art" style="background-image:url('${this.resultArtSrc(r)}')"></div>
                <div class="pull-solo-meta">
                    <div class="pull-solo-stars ${doGoldBreak ? baitTier : rarity}" id="solo-stars">${this.starsFor(doGoldBreak ? baitTier : rarity)}</div>
                    <div class="pull-solo-name" id="solo-name">${doGoldBreak ? '…' : realName}</div>
                    <div class="pull-solo-sub" id="solo-sub">${doGoldBreak ? (forceMythic ? 'Señal dorada…?' : 'Señal morada') : realSub}</div>
                    ${outcome.label && !doGoldBreak ? `<div class="pull-solo-outcome is-${outcome.kind}" id="solo-outcome">${outcome.label}</div>` : ''}
                    ${converted && !doGoldBreak ? `<div class="pull-solo-convert" id="solo-convert"><span>Convertido</span><strong>${r.convertLabel || ''}</strong></div>` : ''}
                    ${total > 1 ? `<div class="pull-solo-idx">${index + 1} / ${total}</div>` : ''}
                </div>
                <div class="pull-solo-hint" id="solo-hint" ${doGoldBreak ? 'hidden' : ''}>TOCA PARA CONTINUAR</div>
                <button type="button" class="pull-solo-skip" id="solo-skip" ${doGoldBreak ? 'hidden' : ''}>SALTAR RESTO</button>
            `;
            document.body.appendChild(el);
            this._soloEl = el;
            requestAnimationFrame(() => {
                if (!needsVideoGate) el.classList.add('is-on');
            });

            let inputUnlocked = !doGoldBreak;
            let done = false;

            const playNormalRevealFx = (tier) => {
                AudioManager.gacha.characterReveal?.();
                if (typeof ParticleSystem !== 'undefined') {
                    const colors = {
                        common: '#9ec9ff',
                        rare: '#c9a0ff',
                        epic: '#ffd76a',
                        mythic: '#ff2a4a',
                        legendary: '#ffe9a0',
                        celestial: '#c084fc'
                    };
                    ParticleSystem.burst(
                        window.innerWidth / 2,
                        window.innerHeight * 0.42,
                        tier === 'celestial' ? 72 : tier === 'mythic' ? 58 : tier === 'legendary' ? 42 : tier === 'epic' ? 34 : tier === 'rare' ? 18 : 10,
                        colors[tier] || '#9ec9ff'
                    );
                }
                const burst = el.querySelector('#solo-burst');
                if (burst && typeof gsap !== 'undefined') {
                    const col = tier === 'mythic' ? '#ff2a4a'
                        : tier === 'celestial' ? '#c084fc'
                        : tier === 'epic' || tier === 'legendary'
                            ? '#ffd76a'
                            : (tier === 'rare' ? '#c9a0ff' : '#9ec9ff');
                    burst.style.borderColor = col;
                    this._gsapTweens.push(gsap.fromTo(burst, {
                        opacity: 0.7, scale: 0.2
                    }, {
                        opacity: 0, scale: 1.6, duration: 0.85, ease: 'power2.out'
                    }));
                }
            };

            const runNormalReveal = async () => {
                await new Promise((ok) => {
                    const id = setTimeout(ok, rarity === 'mythic' || rarity === 'celestial' ? 620 : 420);
                    this._timers.push(id);
                });
                if (done || this._skipSolo) return;
                await this.playCharacterCutin(r, el);
                if (done || this._skipSolo) return;
                if (needsVideoGate) {
                    done = true;
                    el.remove();
                    if (this._soloEl === el) this._soloEl = null;
                    resolve();
                    return;
                }
                el.classList.add('is-on');
                el.classList.remove('is-revealing');
                el.classList.add('is-revealed');
                playNormalRevealFx(rarity);
                const impact = el.querySelector('#solo-impact');
                if (impact) impact.classList.add('show');
                await new Promise((ok) => {
                    const id = setTimeout(ok, rarity === 'mythic' || rarity === 'celestial' ? 900 : 620);
                    this._timers.push(id);
                });
                if (!done && !this._skipSolo) unlockInput();
            };

            const unlockInput = () => {
                inputUnlocked = true;
                const hint = el.querySelector('#solo-hint');
                if (hint) hint.hidden = false;
                const skip = el.querySelector('#solo-skip');
                if (skip) skip.hidden = false;
            };

            const runGoldBreak = async () => {
                AudioManager.gacha.reveal(baitTier);
                if (typeof ParticleSystem !== 'undefined') {
                    ParticleSystem.burst(
                        window.innerWidth / 2,
                        window.innerHeight * 0.42,
                        forceMythic ? 22 : 14,
                        forceMythic ? '#ffd76a' : '#c9a0ff'
                    );
                }
                await new Promise((ok) => {
                    const id = setTimeout(ok, forceMythic ? 920 : 780);
                    this._timers.push(id);
                });
                if (done || this._skipSolo) return;

                el.classList.add('is-breaking');
                AudioManager.gacha.upgrade();
                const flash = el.querySelector('#solo-flash');
                const shatter = el.querySelector('#solo-shatter');
                if (flash) {
                    flash.classList.add('show');
                    if (forceMythic) flash.classList.add('is-red');
                    setTimeout(() => flash.classList.remove('show', 'is-red'), 720);
                }
                if (shatter && forceMythic) shatter.classList.add('show');
                await new Promise((ok) => {
                    const id = setTimeout(ok, forceMythic ? 420 : 280);
                    this._timers.push(id);
                });
                if (done || this._skipSolo) return;

                el.classList.remove(`rarity-${baitTier}`, 'is-bait', 'is-breaking', 'is-mythic-bait');
                el.classList.add(`rarity-${rarity}`, forceMythic ? 'is-mythic-reveal' : 'is-gold-reveal');
                const stars = el.querySelector('#solo-stars');
                const name = el.querySelector('#solo-name');
                const sub = el.querySelector('#solo-sub');
                if (stars) {
                    stars.className = `pull-solo-stars ${rarity}`;
                    stars.textContent = this.starsFor(rarity);
                }
                if (name) name.textContent = realName;
                if (sub) sub.textContent = realSub;
                if (converted) {
                    el.classList.add('is-converted');
                    let conv = el.querySelector('#solo-convert');
                    if (!conv) {
                        conv = document.createElement('div');
                        conv.className = 'pull-solo-convert';
                        conv.id = 'solo-convert';
                        conv.innerHTML = `<span>Convertido</span><strong>${r.convertLabel || ''}</strong>`;
                        el.querySelector('.pull-solo-meta')?.appendChild(conv);
                    }
                }

                AudioManager.gacha.reveal(forceMythic ? 'mythic' : (rarity === 'legendary' || rarity === 'celestial' ? 'legendary' : 'epic'));
                if (typeof ParticleSystem !== 'undefined') {
                    const col = forceMythic ? '#ff2a4a' : '#ffe9a0';
                    ParticleSystem.burst(window.innerWidth / 2, window.innerHeight * 0.4, forceMythic ? 88 : 64, col);
                    setTimeout(() => {
                        ParticleSystem.burst(window.innerWidth / 2, window.innerHeight * 0.45, forceMythic ? 52 : 36, forceMythic ? '#ff6b81' : '#ffd76a');
                    }, 160);
                }
                const burst = el.querySelector('#solo-burst');
                const rays = el.querySelector('#solo-rays');
                if (burst) burst.classList.add(forceMythic ? 'mythic-boom' : 'gold-boom');
                if (rays) rays.classList.add('show');
                if (typeof gsap !== 'undefined') {
                    const art = el.querySelector('#solo-art');
                    if (art) {
                        this._gsapTweens.push(gsap.fromTo(art, {
                            scale: 0.72
                        }, {
                            scale: 1, duration: forceMythic ? 1.05 : 0.85, ease: 'power3.out'
                        }));
                    }
                    if (burst) {
                        burst.style.borderColor = forceMythic ? '#ff2a4a' : '#ffe9a0';
                        this._gsapTweens.push(gsap.fromTo(burst, {
                            opacity: 0.95, scale: 0.15
                        }, {
                            opacity: 0, scale: forceMythic ? 2.9 : 2.4, duration: forceMythic ? 1.25 : 1.05, ease: 'power2.out'
                        }));
                    }
                }
                await new Promise((ok) => {
                    const id = setTimeout(ok, forceMythic ? 980 : 720);
                    this._timers.push(id);
                });
                await this.playCharacterCutin(r, el);
                if (needsVideoGate) {
                    done = true;
                    el.remove();
                    if (this._soloEl === el) this._soloEl = null;
                    resolve();
                    return;
                }
                el.classList.add('is-on');
                unlockInput();
            };

            if (needsVideoGate) {
                this.playCharacterCutin(r, el).then(() => {
                    if (done) return;
                    done = true;
                    el.remove();
                    if (this._soloEl === el) this._soloEl = null;
                    resolve();
                });
            } else if (doGoldBreak) runGoldBreak();
            else runNormalReveal();

            const cleanup = (skipped) => {
                if (done) return;
                // Never dump mid bait→gold; skip only after the break lands.
                if (!inputUnlocked) return;
                done = true;
                if (skipped) this._skipSolo = true;
                window.removeEventListener('keydown', onKey);
                el.classList.remove('is-on');
                const id = setTimeout(() => {
                    el.remove();
                    if (this._soloEl === el) this._soloEl = null;
                    resolve();
                }, skipped ? 100 : 180);
                this._timers.push(id);
            };

            const onKey = (e) => {
                // During purple bait / gold break, lock Esc so the surprise can't be dumped.
                if (e.key === 'Escape') {
                    if (!inputUnlocked) return;
                    AudioManager.ui.click();
                    cleanup(true);
                    return;
                }
                if (!inputUnlocked) return;
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    AudioManager.ui.click();
                    cleanup(false);
                }
            };
            window.addEventListener('keydown', onKey);

            el.addEventListener('click', (e) => {
                if (e.target && e.target.closest && e.target.closest('#solo-skip')) return;
                if (!inputUnlocked) return;
                AudioManager.ui.click();
                cleanup(false);
            });

            const skipBtn = el.querySelector('#solo-skip');
            if (skipBtn) {
                skipBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!inputUnlocked) return;
                    AudioManager.ui.click();
                    cleanup(true);
                });
            }
        });
    },

    async showPullResults(el, results) {
        const goldSurprise = !!this._pullGoldSurprise;
        const hasFive = results.some((r) => this.isFiveStarResult(r));
        // Portal skip: skip solos unless a purple→gold fakeout is waiting.
        if (this._skipPull && !goldSurprise) {
            const jackpots = results.filter((r) => this.isFiveStarResult(r));
            if (jackpots.length) {
                const skippedJackpots = await this.playSoloReveals(jackpots);
                this._lastResultsAction = await this.showResultsGrid(results, {
                    instant: skippedJackpots,
                    celebrate: true
                });
                return;
            }
            this._lastResultsAction = await this.showResultsGrid(results, { instant: true, celebrate: false });
            return;
        }
        const skippedSolo = await this.playSoloReveals(results);
        // Siempre resumen: CONTINUAR / Otra vez / historial.
        this._lastResultsAction = await this.showResultsGrid(results, {
            instant: skippedSolo && !goldSurprise,
            celebrate: goldSurprise || hasFive
        });
    },

    async showResultsGrid(results, opts = {}) {
        this._skipCascade = false;
        const modal = document.createElement('div');
        modal.className = 'convene-results';
        const multi = results.length > 1;
        const instant = !!opts.instant;
        const celebrate = !!opts.celebrate;
        const fiveCount = results.filter((r) => this.isFiveStarResult(r)).length;
        const isEgg = results.some((r) => r.egg);
        const bal = this.spendBalance();
        const unit = this.spendUnitLabel();
        const can1 = bal >= 1;
        const can10 = bal >= 10;
        let kicker;
        if (fiveCount >= 2) kicker = `✦ DOBLE 5★ · ×${results.length}`;
        else if (fiveCount === 1 && celebrate) kicker = multi ? `✦ SEÑAL DORADA · ×${results.length}` : '✦ SEÑAL DORADA';
        else if (isEgg) kicker = multi ? `EASTER EGG ×${results.length}` : 'EASTER EGG';
        else kicker = multi ? `CONVENIO ×${results.length}` : 'CONVENIO';

        if (celebrate) modal.classList.add('is-celebrate');

        modal.innerHTML = `
            <div class="convene-results-panel${celebrate ? ' is-celebrate' : ''}">
                <p class="battle-kicker${fiveCount ? ' is-gold' : ''}">${kicker}</p>
                <div class="convene-grid ${multi ? 'x10' : 'x1'}" id="convene-grid">
                    ${results.map((r) => {
                        const jackpot = this.isFiveStarResult(r);
                        const dual = !!(r.charId && typeof GachaRoster !== 'undefined' && GachaRoster.isDualRarity?.(r.charId));
                        const showNow = instant && !celebrate;
                        const starRow = dual ? '★★★★★' : this.starsFor(r.rarity);
                        const converted = !!(r.converted || r.kind === 'converted');
                        const outcome = this.resultOutcome(r);
                        return `
                        <div class="convene-card ${r.rarity}${jackpot ? ' is-jackpot' : ''}${dual ? ' is-dual' : ''}${converted ? ' is-converted' : ''}${outcome.kind !== 'neutral' ? ` is-${outcome.kind}` : ''}${showNow ? ' shown' : ''}" data-cascade-card${jackpot ? ' data-jackpot' : ''}>
                            <div class="convene-card-art ${this.resultArtClass(r)}" style="background-image:url('${this.resultArtSrc(r)}')"></div>
                            <div class="pull-stars ${dual ? 'epic' : r.rarity}">${starRow}</div>
                            <div class="convene-card-name">${r.reward}</div>
                            ${outcome.label ? `<div class="convene-card-outcome is-${outcome.kind}">${outcome.label}</div>` : ''}
                            ${converted ? `<div class="convene-card-convert"><span>Convertido</span><strong>${r.convertLabel || ''}</strong></div>` : ''}
                            <div class="convene-card-rarity">${this.resultMetaLabel(r)}</div>
                        </div>`;
                    }).join('')}
                </div>
                <div class="convene-results-actions">
                    <button type="button" class="btn-destiny" id="close-pull">CONTINUAR</button>
                    <div class="convene-results-again">
                        <button type="button" class="btn-convene single convene-again" id="again-pull-1" ${can1 ? '' : 'disabled'}>
                            <span class="convene-label">Otra vez</span>
                            <span class="convene-cost" aria-label="${unit} ×1"><span class="${this.activeBanner === 'metaphor' ? 'convene-ticket' : 'convene-gem'}" aria-hidden="true"></span><strong>×1</strong></span>
                        </button>
                        <button type="button" class="btn-convene multi convene-again" id="again-pull-10" ${can10 ? '' : 'disabled'}>
                            <span class="convene-label">Otra vez</span>
                            <span class="convene-cost" aria-label="${unit} ×10"><span class="${this.activeBanner === 'metaphor' ? 'convene-ticket' : 'convene-gem'}" aria-hidden="true"></span><strong>×10</strong></span>
                        </button>
                    </div>
                    <button type="button" class="convene-history-link" id="open-history-from-results">VER HISTORIAL</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this._activeModal = modal;

        if (typeof gsap !== 'undefined') {
            this._gsapTweens.push(gsap.from(modal.querySelector('.convene-results-panel'), {
                scale: 0.94, opacity: 0, duration: 0.38, ease: 'power2.out'
            }));
        }

        if (!instant || celebrate) {
            const cards = [...modal.querySelectorAll('[data-cascade-card]')];
            // Celebrate: filler first, jackpots last with a beat.
            if (celebrate && multi) {
                cards.sort((a, b) => {
                    const aj = a.hasAttribute('data-jackpot') ? 1 : 0;
                    const bj = b.hasAttribute('data-jackpot') ? 1 : 0;
                    return aj - bj;
                });
            }
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                const isJack = card.hasAttribute('data-jackpot');
                if (i > 0 && isJack && celebrate) await this.waitCascade(220);
                card.classList.add('shown');
                if (isJack && celebrate && typeof ParticleSystem !== 'undefined') {
                    const rect = card.getBoundingClientRect();
                    ParticleSystem.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18, '#ffe9a0');
                    AudioManager.gacha.reveal(card.classList.contains('legendary') ? 'legendary' : 'epic');
                }
                await this.waitCascade(multi ? (isJack ? 140 : 55) : 40);
            }
        }

        return new Promise(resolve => {
            this._resolveResults = resolve;
            const finish = (action) => {
                AudioManager.ui.click();
                modal.remove();
                if (this._activeModal === modal) this._activeModal = null;
                this._resolveResults = null;
                resolve(action || null);
            };
            const closeBtn = modal.querySelector('#close-pull');
            if (!closeBtn) {
                this._resolveResults = null;
                resolve(null);
                return;
            }
            closeBtn.onclick = () => finish(null);
            modal.querySelector('#again-pull-1')?.addEventListener('click', () => {
                if (this.spendBalance() < 1) return;
                finish({ again: 1 });
            });
            modal.querySelector('#again-pull-10')?.addEventListener('click', () => {
                if (this.spendBalance() < 10) return;
                finish({ again: 10 });
            });
            modal.querySelector('#open-history-from-results')?.addEventListener('click', () => {
                finish('history');
            });
        });
    },

    wait(ms) {
        return new Promise(r => {
            const id = setTimeout(r, ms);
            this._timers.push(id);
        });
    },

    waitOrSkip(ms) {
        return new Promise(resolve => {
            if (this._skipPull) {
                resolve();
                return;
            }
            const start = performance.now();
            const tick = () => {
                if (this._skipPull || performance.now() - start >= ms) {
                    resolve();
                    return;
                }
                const id = requestAnimationFrame(tick);
                this._rafs.push(id);
            };
            const id = requestAnimationFrame(tick);
            this._rafs.push(id);
        });
    },

    waitCascade(ms) {
        return new Promise(resolve => {
            if (this._skipCascade) {
                resolve();
                return;
            }
            const id = setTimeout(resolve, ms);
            this._timers.push(id);
        });
    },

    clearTimers() {
        this._timers.forEach(clearTimeout);
        this._timers = [];
        this._rafs.forEach(cancelAnimationFrame);
        this._rafs = [];
    },

    killTweens() {
        if (typeof gsap === 'undefined') return;
        this._gsapTweens.forEach(t => {
            try { t?.kill?.(); } catch (_) { /* noop */ }
        });
        this._gsapTweens = [];
        const overlay = document.getElementById('pull-overlay');
        if (overlay) gsap.killTweensOf(overlay.querySelectorAll('*'));
    }
};
