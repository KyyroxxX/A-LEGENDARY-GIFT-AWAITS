/**
 * Shared Dupes · Tienda Estelar — arena + gacha.
 * Live refresh (no close/reopen) + open/close motion.
 */
const DupesShop = {
    overlay: null,
    _closing: false,
    _lastBuyId: null,
    activeTier: 5,

    ensure() {
        let overlay = document.getElementById('dupes-shop-overlay');
        if (overlay) {
            this.overlay = overlay;
            return overlay;
        }
        overlay = document.createElement('div');
        overlay.id = 'dupes-shop-overlay';
        overlay.className = 'arena-dupes-overlay dupes-shop-overlay';
        overlay.hidden = true;
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = `
            <div class="arena-dupes-panel dupes-shop-panel" role="dialog" aria-label="Tienda Estelar" aria-modal="true">
                <div class="arena-dupes-head">
                    <h3>DUPES · TIENDA ESTELAR</h3>
                    <button type="button" class="btn-secondary" id="dupes-shop-close">CERRAR</button>
                </div>
                <div class="arena-dupes-funds">
                    <div class="arena-dupes-seal-chip dupes-tier-fund is-five" id="dupes-shop-seal-chip-5">
                        <span class="arena-dupes-seal-ico" aria-hidden="true"></span>
                        <div>
                            <em>Sellos 5★</em>
                            <strong id="dupes-shop-seals-5">0</strong>
                        </div>
                    </div>
                    <div class="arena-dupes-seal-chip dupes-tier-fund is-six" id="dupes-shop-seal-chip-6">
                        <span class="arena-dupes-seal-ico" aria-hidden="true"></span>
                        <div>
                            <em>Sellos 6★</em>
                            <strong id="dupes-shop-seals-6">0</strong>
                        </div>
                    </div>
                </div>
                <div class="dupes-shop-tabs" role="tablist" aria-label="Rareza de dupes">
                    <button type="button" class="dupes-shop-tab is-active" data-dupes-tier="5" role="tab" aria-selected="true">TIENDA 5★</button>
                    <button type="button" class="dupes-shop-tab" data-dupes-tier="6" role="tab" aria-selected="false">TIENDA 6★</button>
                </div>
                <p class="arena-dupes-note">
                    Un <strong>4★</strong> al C-max convierte en <strong>Sello Estelar</strong>
                    (los 3★ maxean en eco, no en sello).
                    Canjea sellos por dupes de <strong>5★/6★</strong> que ya tengas
                    (5★ cuesta 1 sello y 6★ cuesta 2 · ambos usan C0–C3).
                </p>
                <div class="arena-dupes-body">
                    <h4 class="arena-dupes-sub" id="dupes-shop-tier-title">Tienda 5★</h4>
                    <div class="arena-shop-list" id="dupes-shop-list"></div>
                    <h4 class="arena-dupes-sub">Tu roster</h4>
                    <div class="arena-dupes-list" id="dupes-roster-list"></div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close();
        });
        overlay.querySelector('#dupes-shop-close')?.addEventListener('click', () => this.close());
        overlay.querySelectorAll('[data-dupes-tier]').forEach((tab) => {
            tab.addEventListener('click', () => {
                this.activeTier = Number(tab.dataset.dupesTier) === 6 ? 6 : 5;
                this.refresh({ animateIn: true });
            });
        });
        if (!this._escBound) {
            this._escBound = (e) => {
                if (e.key === 'Escape' && this.isOpen()) {
                    e.preventDefault();
                    this.close();
                }
            };
            window.addEventListener('keydown', this._escBound);
        }
        this.overlay = overlay;
        return overlay;
    },

    isOpen() {
        const o = this.overlay || document.getElementById('dupes-shop-overlay');
        return !!(o && !o.hidden);
    },

    toast(msg) {
        const t = document.createElement('div');
        t.className = 'achievement-toast dupes-shop-toast';
        t.textContent = msg;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => {
            t.classList.remove('show');
            setTimeout(() => t.remove(), 320);
        }, 2200);
    },

    syncHud() {
        const seals = GameState.get('starSeals') || 0;
        const set = (sel) => {
            document.querySelectorAll(sel).forEach((n) => { n.textContent = String(seals); });
        };
        set('#dupes-shop-seals');
        document.querySelectorAll('#dupes-shop-seals-5').forEach((n) => { n.textContent = String(GameState.get('starSeals5') || 0); });
        document.querySelectorAll('#dupes-shop-seals-6').forEach((n) => { n.textContent = String(GameState.get('starSeals6') || 0); });
        set('#arena-seals');
        set('#arena-seals-shop');
        set('#gacha-star-seals');
    },

    open(opts = {}) {
        const overlay = this.ensure();
        this._closing = false;
        this.refresh({ animateIn: true, ...opts });
        overlay.hidden = false;
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('arena-dupes-open', 'dupes-shop-open');
        // Retrigger enter animation
        overlay.classList.remove('is-open', 'is-closing');
        void overlay.offsetWidth;
        overlay.classList.add('is-open');
        try { AudioManager.ui?.click?.(); } catch (_) { /* ignore */ }
    },

    close() {
        const overlay = this.overlay || document.getElementById('dupes-shop-overlay');
        if (!overlay || overlay.hidden || this._closing) return;
        this._closing = true;
        overlay.classList.add('is-closing');
        overlay.classList.remove('is-open');
        const done = () => {
            overlay.hidden = true;
            overlay.setAttribute('aria-hidden', 'true');
            overlay.classList.remove('is-closing');
            document.body.classList.remove('arena-dupes-open', 'dupes-shop-open');
            this._closing = false;
        };
        window.setTimeout(done, 280);
    },

    /** Call after pulls / seal gains while shop may be open. */
    refreshIfOpen(opts = {}) {
        if (!this.isOpen()) {
            this.syncHud();
            return;
        }
        this.refresh({ animateIn: false, ...opts });
    },

    refresh(opts = {}) {
        const overlay = this.ensure();
        const shop = overlay.querySelector('#dupes-shop-list');
        const list = overlay.querySelector('#dupes-roster-list');
        const tier = this.activeTier === 6 ? 6 : 5;
        const sealsNode = overlay.querySelector(`#dupes-shop-seals-${tier}`);
        const chip = overlay.querySelector(`#dupes-shop-seal-chip-${tier}`);
        const seals = GameState.get(tier === 6 ? 'starSeals6' : 'starSeals5') || 0;
        const animateIn = !!opts.animateIn;
        const flashId = opts.flashId || this._lastBuyId;
        const sealsDelta = opts.sealsDelta;

        if (typeof CharProgress !== 'undefined') {
            try { CharProgress.ensure(); } catch (_) { /* ignore */ }
        }

        if (sealsNode) {
            const prev = Number(sealsNode.textContent) || 0;
            sealsNode.textContent = String(seals);
            const spent = sealsDelta != null ? sealsDelta < 0 : seals < prev;
            const gained = sealsDelta != null ? sealsDelta > 0 : seals > prev;
            if (spent || gained) {
                chip?.classList.remove('is-pulse-up', 'is-pulse-down');
                void chip?.offsetWidth;
                chip?.classList.add(spent ? 'is-pulse-down' : 'is-pulse-up');
            }
        }
        overlay.querySelectorAll('[data-dupes-tier]').forEach((tab) => {
            const active = Number(tab.dataset.dupesTier) === tier;
            tab.classList.toggle('is-active', active);
            tab.setAttribute('aria-selected', String(active));
        });
        const tierTitle = overlay.querySelector('#dupes-shop-tier-title');
        if (tierTitle) tierTitle.textContent = `Tienda ${tier}★`;
        this.syncHud();

        if (shop) {
            if (typeof GachaRoster === 'undefined') {
                shop.innerHTML = '<p class="arena-dupes-empty">Tienda no disponible.</p>';
            } else {
                const items = GachaRoster.dupeShopList().filter((it) => tier === 6
                    ? GachaRoster.isSixStarChar?.(it.id)
                    : !GachaRoster.isSixStarChar?.(it.id));
                shop.innerHTML = items.length
                    ? items.map((it, i) => {
                        const starTag = GachaRoster.starsLabel?.(it.id) || '5★';
                        const flash = flashId === it.id ? ' is-flash' : '';
                        const delay = animateIn ? `style="--i:${i}"` : `style="--i:0"`;
                        return `
                        <div class="arena-shop-row${flash}${animateIn ? ' is-enter' : ''}" data-id="${it.id}" ${delay}>
                            <div class="arena-shop-art" style="background-image:url('${it.art}?v=arena138')"></div>
                            <div class="arena-shop-copy">
                                <strong>${it.name}</strong>
                                <span class="arena-shop-c">C${it.constellation}/${it.max} · ${starTag}</span>
                            </div>
                            <button type="button" class="btn-destiny arena-shop-buy" data-buy-id="${it.id}"
                                ${seals < it.cost ? 'disabled' : ''}>
                                <span>CANJEAR</span>
                                <em>${it.cost}✦</em>
                            </button>
                        </div>`;
                    }).join('')
                    : `<p class="arena-dupes-empty">${seals > 0
                        ? `No hay personajes ${tier}★ pendientes de dupe.`
                        : `Consigue Sellos ${tier}★ y ten un personaje ${tier}★ para canjear.`}</p>`;

                shop.querySelectorAll('[data-buy-id]').forEach((btn) => {
                    btn.addEventListener('click', () => this.buy(btn.getAttribute('data-buy-id') || btn.dataset.buyId));
                });
            }
        }

        if (list) {
            const owned = (typeof GachaRoster !== 'undefined') ? GachaRoster.ownedTemplates() : [];
            list.innerHTML = owned.map((tpl, i) => {
                const c = (typeof CharProgress !== 'undefined') ? CharProgress.constellation(tpl.id) : 0;
                const maxC = (typeof CharProgress !== 'undefined') ? CharProgress.maxConstFor(tpl.id) : 6;
                const maxed = c >= maxC ? ' is-max' : '';
                const dual = false;
                const is5 = typeof GachaRoster !== 'undefined'
                    && (GachaRoster.isFiveStarChar?.(tpl.id) || GachaRoster.rarityFor(tpl.id) === 'epic');
                const star = (typeof GachaRoster !== 'undefined' && GachaRoster.starsLabel?.(tpl.id))
                    || (is5 ? '5★' : '4★');
                const flash = flashId === tpl.id ? ' is-flash' : '';
                const art = `assets/sprites/anim/${tpl.id}_idle.png?v=arena138`;
                const delay = animateIn ? `style="--i:${i}"` : 'style="--i:0"';
                return `<div class="arena-dupe-row${maxed}${is5 ? ' is-five' : ''}${flash}${animateIn ? ' is-enter' : ''}" data-id="${tpl.id}" ${delay}>
                    <div class="arena-dupe-art" style="background-image:url('${art}')" aria-hidden="true"></div>
                    <div class="arena-dupe-copy">
                        <strong>${tpl.name}</strong>
                        <em>${star}</em>
                    </div>
                    <span class="arena-dupe-c">C${c}/${maxC}${maxed ? ' MAX' : ''}</span>
                </div>`;
            }).join('') || '<p class="arena-dupes-empty">Aún no tienes personajes.</p>';
        }

        this._lastBuyId = null;
        if (flashId) {
            window.setTimeout(() => {
                overlay.querySelectorAll('.is-flash').forEach((n) => n.classList.remove('is-flash'));
            }, 900);
        }
    },

    buy(charId) {
        if (typeof GachaRoster === 'undefined') return;
        const id = String(charId || '').trim();
        const res = GachaRoster.buyFiveStarDupe(id);
        if (!res.ok) {
            this.toast(res.reason || 'No se pudo comprar.');
            return;
        }
        try { AudioManager.ui?.click?.(); } catch (_) { /* ignore */ }
        this._lastBuyId = id;
        this.toast(`${res.name} → C${res.constellation}${res.maxed ? ' MAX' : ''}`);
        this.refresh({
            animateIn: false,
            flashId: id,
            sealsDelta: -(res.cost || 1)
        });
    }
};
