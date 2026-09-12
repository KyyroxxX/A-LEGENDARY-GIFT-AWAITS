const LegendaryPullScene = {
    _timers: [],
    _rafs: [],
    _gsapTweens: [],
    _skip: false,
    _claimed: false,

    BANNER_WEBP: 'assets/gacha/banner-legendary.webp?v=arena72',
    BANNER_GIF: 'assets/gacha/banner-legendary.gif?v=arena72',
    BANNER_STATIC: 'assets/gacha/convene-bg.webp?v=arena72',

    render(data = {}) {
        const el = document.createElement('div');
        el.className = 'scene gacha-scene gacha-legendary-scene active';
        const reduced = typeof window !== 'undefined'
            && window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const prize = data.reward || CONFIG.gachaRewards?.legendary?.name || CONFIG.legendaryReward;

        el.innerHTML = `
            <div class="legendary-cinematic" id="legendary-sequence">
                <div class="leg-banner-bg"></div>
                <picture>
                    <source srcset="${this.BANNER_WEBP}" type="image/webp">
                    <img class="leg-banner-media${reduced ? ' is-hidden' : ''}"
                         id="leg-banner-gif"
                         src="${this.BANNER_GIF}"
                         alt=""
                         decoding="async">
                </picture>
                <img class="leg-banner-media"
                     id="leg-banner-static"
                     src="${this.BANNER_STATIC}"
                     alt=""
                     decoding="async"
                     style="opacity:${reduced ? '0.4' : '0'}">
                <div class="leg-fog"></div>
                <div class="leg-stars"></div>
                <div class="leg-glow"></div>
                <div class="leg-portal" id="leg-portal"></div>
                <button type="button" class="pull-skip" id="leg-skip">SALTAR</button>
                <p class="sr-only" style="position:absolute;left:-9999px">${prize}</p>
            </div>
        `;
        return el;
    },

    async enter(el, data = {}) {
        this._skip = false;
        this._claimed = false;
        AudioManager.setTheme('legendary');

        const skip = el.querySelector('#leg-skip');
        if (skip) {
            skip.addEventListener('click', () => {
                this._skip = true;
                AudioManager.ui.click();
            });
        }

        this.wireBanner(el);
        await this.playLegendarySequence(el, data);
    },

    exit() {
        this._skip = true;
        this.clearTimers();
        this.killTweens();
    },

    wireBanner(el) {
        const gif = el.querySelector('#leg-banner-gif');
        const still = el.querySelector('#leg-banner-static');
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const fail = (img) => {
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
            still.addEventListener('error', () => fail(still));
            whenReady(still, () => {
                if (reduced || !gif || gif.classList.contains('is-hidden')) {
                    still.style.opacity = '0.4';
                }
            });
        }
        if (gif && !reduced) {
            whenReady(gif, () => { gif.style.opacity = '0.4'; });
            gif.addEventListener('error', () => {
                fail(gif);
                if (still) still.style.opacity = '0.4';
            });
        } else if (gif) {
            gif.classList.add('is-hidden');
        }
    },

    async playLegendarySequence(el, data = {}) {
        const seq = el.querySelector('#legendary-sequence');
        const portal = el.querySelector('#leg-portal');
        if (!seq) return;

        AudioManager.gacha.start();

        // Phase 1 — portal aligns with banner language
        if (typeof gsap !== 'undefined' && portal) {
            this._gsapTweens.push(gsap.fromTo(portal, {
                scale: 0.3, opacity: 0, rotation: 0
            }, {
                scale: 1.2, opacity: 1, rotation: 360, duration: 1.2, ease: 'power2.inOut'
            }));
            this._gsapTweens.push(gsap.to(portal, {
                scale: 2.6, opacity: 0.35, duration: 0.8, delay: 1.1, ease: 'power2.in'
            }));
        }
        if (typeof ParticleSystem !== 'undefined') {
            ParticleSystem.burst(window.innerWidth / 2, window.innerHeight / 2, 24, '#4da6ff');
        }
        await this.waitOrSkip(1800);
        if (this._skip) return this.finishToCard(seq, data, true);

        // Phase 2 — anomaly (same cinematic thread)
        const freeze = document.createElement('div');
        freeze.className = 'leg-anomaly';
        freeze.innerHTML = `
            <p class="text-body" id="anomaly-dots" style="font-size:2rem;opacity:0;">...</p>
            <h2 class="title-main glitch" id="anomaly-text" style="opacity:0;font-size:clamp(1.4rem,4vw,2rem);margin-top:1rem;">ANOMALÍA DETECTADA</h2>
        `;
        seq.appendChild(freeze);
        AudioManager.gacha.anomaly();
        await this.waitOrSkip(500);
        if (typeof gsap !== 'undefined') {
            gsap.to(freeze.querySelector('#anomaly-dots'), { opacity: 1, duration: 0.25 });
        } else {
            freeze.querySelector('#anomaly-dots').style.opacity = '1';
        }
        await this.waitOrSkip(700);
        if (typeof gsap !== 'undefined') {
            gsap.to(freeze.querySelector('#anomaly-text'), { opacity: 1, duration: 0.4 });
        } else {
            freeze.querySelector('#anomaly-text').style.opacity = '1';
        }
        if (typeof screenShake === 'function') screenShake(document.getElementById('app'));
        await this.waitOrSkip(1200);
        if (this._skip) {
            freeze.remove();
            return this.finishToCard(seq, data, true);
        }

        // Phase 3 — destiny rewrite
        freeze.innerHTML = `
            <p class="text-body" style="margin-bottom:1rem;">Probabilidad legendaria: 0.0001%</p>
            <p class="text-body" style="margin-bottom:1.5rem;opacity:0.7;">Recalculando destino...</p>
            <h2 class="title-main" id="prob-100" style="opacity:0;font-size:clamp(1.2rem,3.5vw,1.8rem);">PROBABILIDAD LEGENDARIA: 100%</h2>
            <p class="text-body" id="prob-quote" style="opacity:0;margin-top:1rem;">"Porque el destino ya había decidido."</p>
        `;
        await this.waitOrSkip(900);
        if (typeof gsap !== 'undefined') {
            gsap.to(freeze.querySelector('#prob-100'), { opacity: 1, scale: 1.08, duration: 0.65, ease: 'back.out(1.8)' });
        } else {
            freeze.querySelector('#prob-100').style.opacity = '1';
        }
        await this.waitOrSkip(500);
        if (typeof gsap !== 'undefined') {
            gsap.to(freeze.querySelector('#prob-quote'), { opacity: 1, duration: 0.4 });
        } else {
            freeze.querySelector('#prob-quote').style.opacity = '1';
        }
        await this.waitOrSkip(1100);
        if (this._skip) {
            freeze.remove();
            return this.finishToCard(seq, data, true);
        }

        // Phase 4 — legendary burst tied to banner glow
        freeze.remove();
        if (portal) portal.style.opacity = '0';
        if (typeof ParticleSystem !== 'undefined') {
            ParticleSystem.burst(window.innerWidth / 2, window.innerHeight / 2, 80, '#f4d03f');
            ParticleSystem.burst(window.innerWidth / 2, window.innerHeight / 2, 50, '#dc143c');
            ParticleSystem.burst(window.innerWidth / 2, window.innerHeight / 2, 40, '#4da6ff');
        }
        if (typeof screenShake === 'function') screenShake(document.getElementById('app'), 2);
        AudioManager.gacha.reveal('legendary');

        const legendaryText = document.createElement('h1');
        legendaryText.className = 'leg-title-burst';
        legendaryText.textContent = 'CELESTIAL';
        seq.appendChild(legendaryText);
        if (typeof gsap !== 'undefined') {
            gsap.to(legendaryText, { opacity: 1, scale: 1.15, duration: 0.28, ease: 'power4.out' });
            gsap.to(legendaryText, { scale: 1, duration: 0.45, delay: 0.28 });
        } else {
            legendaryText.style.opacity = '1';
        }
        await this.waitOrSkip(1400);

        this.finishToCard(seq, data, false);
    },

    finishToCard(seq, data, skipped) {
        const skipBtn = seq.querySelector('#leg-skip');
        if (skipBtn) skipBtn.remove();

        // Keep soft banner presence under the reward card
        [...seq.querySelectorAll('.leg-portal, .leg-anomaly, .leg-title-burst')].forEach(n => n.remove());

        const existing = seq.querySelector('.legendary-card');
        if (existing) return;

        const card = document.createElement('div');
        card.className = 'legendary-card';
        card.style.opacity = skipped ? '1' : '0';
        card.innerHTML = `
            <div class="legendary-stars">★★★★★★★</div>
            <div class="legendary-badge">7★ CELESTIAL · LIMITED</div>
            <h2 class="legendary-name">${CONFIG.legendaryReward}</h2>
            <p class="title-sub" style="font-size:0.8rem;margin:0.5rem 0;">${CONFIG.legendaryRewardSubtitle}</p>
            <p class="legendary-desc">${CONFIG.gachaRewards.legendary.desc}</p>
            <div class="probability-text" style="margin-top:1.5rem;">
                <p>Probabilidad de obtener esta recompensa: 0.0001%</p>
                <p style="margin-top:0.5rem;">Probabilidad tras considerar cuánto te quiero:</p>
                <p class="probability-highlight">100%</p>
            </div>
            <button class="btn-destiny" id="btn-claim" style="margin-top:1.5rem;">RECLAMAR DESTINO</button>
        `;
        seq.appendChild(card);

        (data.achievementIds || []).forEach(id => Achievements.show(id));

        if (!skipped && typeof gsap !== 'undefined') {
            gsap.to(card, { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' });
        }

        if (typeof AudioManager !== 'undefined' && skipped) {
            AudioManager.gacha.reveal('legendary');
        }

        card.querySelector('#btn-claim')?.addEventListener('click', () => {
            if (this._claimed) return;
            this._claimed = true;
            AudioManager.gacha.revealDone();
            GameState.update({
                legendaryObtained: true,
                storyComplete: true,
                pullsDone: Math.max(GameState.get('pullsDone') || 0, 6)
            });
            SceneManager.goTo('reveal');
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
            if (this._skip) {
                resolve();
                return;
            }
            const start = performance.now();
            const tick = () => {
                if (this._skip || performance.now() - start >= ms) {
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
    }
};
