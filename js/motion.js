/**
 * MotionFx — premium high-Hz scene flow (GPU transform/opacity only)
 */
const MotionFx = {
    _wipe: null,
    _busy: false,
    _tweens: [],
    _gsapReady: false,

    reduced() {
        try {
            return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        } catch (_) {
            return false;
        }
    },

    /** Unlock GSAP for high-Hz panels — interpolate every paint. */
    ensureGsap() {
        if (this._gsapReady || typeof gsap === 'undefined') return;
        try {
            gsap.ticker.fps(120);
            // Less aggressive lag catch-up → fewer “jumps” when the tab hitches
            gsap.ticker.lagSmoothing(1000, 16);
            gsap.config({ force3D: true, nullTargetWarn: false });
        } catch (_) { /* */ }
        this._gsapReady = true;
    },

    ease: 'expo.out',
    easeSoft: 'power3.out',
    easeIn: 'power2.in',
    easeFlow: 'power2.inOut',
    easeSilk: 'sine.inOut',

    ensureWipe() {
        if (this._wipe && document.body.contains(this._wipe)) return this._wipe;
        const el = document.createElement('div');
        el.className = 'mx-wipe';
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML = `
            <div class="mx-wipe-veil"></div>
            <div class="mx-wipe-edge"></div>
            <div class="mx-wipe-sigil">CONVOCAR</div>
        `;
        document.body.appendChild(el);
        this._wipe = el;
        return el;
    },

    killTracked() {
        this._tweens.forEach((t) => {
            try { t.kill?.(); } catch (_) { /* ignore */ }
        });
        this._tweens = [];
        if (typeof gsap !== 'undefined' && this._wipe) {
            gsap.killTweensOf(this._wipe.querySelectorAll('*'));
        }
    },

    track(tw) {
        if (tw) this._tweens.push(tw);
        return tw;
    },

    /**
     * Cover → prepare new scene while hidden → reveal.
     * prepareIn(next) runs under the wipe so UI never flashes the wrong state.
     */
    /**
     * Fast opacity handoff (no CONVOCAR wipe) — used for gacha entry where wipe feels lagged.
     */
    async quickSwap({ outEl, midSwap, prepareIn, afterIn } = {}) {
        this.ensureGsap();
        this.killTracked();
        this._busy = true;

        const finish = async (next) => {
            if (prepareIn && next) {
                try { await Promise.resolve(prepareIn(next)); } catch (err) {
                    console.error('prepareIn failed', err);
                }
            }
            if (next) {
                next.style.visibility = 'visible';
                if (typeof gsap !== 'undefined' && !this.reduced()) {
                    gsap.set(next, { opacity: 0, force3D: true });
                    await gsap.to(next, { opacity: 1, duration: 0.16, ease: this.easeSoft, force3D: true });
                    gsap.set(next, { opacity: 1 });
                } else {
                    next.style.opacity = '1';
                }
            }
            this._busy = false;
            if (afterIn && next) {
                try { afterIn(next); } catch (err) { console.error('afterIn failed', err); }
            }
            return next;
        };

        if (this.reduced() || typeof gsap === 'undefined') {
            if (outEl) outEl.remove();
            const next = midSwap ? midSwap() : null;
            return finish(next);
        }

        if (outEl) {
            await gsap.to(outEl, { opacity: 0, duration: 0.12, ease: this.easeIn, force3D: true });
            outEl.remove();
        }
        const next = midSwap ? midSwap() : null;
        if (next) gsap.set(next, { opacity: 0, visibility: 'hidden', force3D: true });
        return finish(next);
    },

    async swapScene({ outEl, midSwap, prepareIn, afterIn, mode } = {}) {
        if (mode === 'quick') {
            return this.quickSwap({ outEl, midSwap, prepareIn, afterIn });
        }
        this.ensureGsap();
        if (this.reduced() || typeof gsap === 'undefined') {
            if (outEl) outEl.remove();
            const next = midSwap ? midSwap() : null;
            if (next) {
                next.style.opacity = '1';
                next.style.visibility = '';
            }
            if (prepareIn && next) await Promise.resolve(prepareIn(next));
            if (afterIn && next) afterIn(next);
            return next;
        }

        this.killTracked();

        if (!outEl) {
            const next = midSwap ? midSwap() : null;
            if (prepareIn && next) await Promise.resolve(prepareIn(next));
            if (next) {
                next.style.visibility = '';
                await gsap.fromTo(next, { opacity: 0 }, {
                    opacity: 1,
                    duration: 0.28,
                    ease: this.easeSoft,
                    force3D: true
                });
                gsap.set(next, { opacity: 1 });
            }
            if (afterIn && next) afterIn(next);
            return next;
        }

        this._busy = true;
        const wipe = this.ensureWipe();
        const veil = wipe.querySelector('.mx-wipe-veil');
        const edge = wipe.querySelector('.mx-wipe-edge');
        const sigil = wipe.querySelector('.mx-wipe-sigil');

        wipe.classList.add('is-on');
        gsap.set(veil, { xPercent: -104, force3D: true });
        gsap.set(edge, { xPercent: -45, opacity: 0, force3D: true });
        gsap.set(sigil, { opacity: 0, y: 10, scale: 0.92, force3D: true });

        const cover = gsap.timeline({ defaults: { ease: this.easeFlow, force3D: true } });
        cover.to(outEl, { opacity: 0, duration: 0.16 }, 0);
        cover.to(veil, { xPercent: 0, duration: 0.24, ease: this.easeFlow }, 0);
        cover.to(edge, { xPercent: 55, opacity: 1, duration: 0.24, ease: this.easeFlow }, 0);
        cover.to(sigil, { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: this.easeSoft }, 0.05);

        await cover.then();

        outEl.remove();
        const next = midSwap ? midSwap() : null;
        if (next) {
            gsap.set(next, { opacity: 0, visibility: 'hidden', force3D: true });
            if (prepareIn) {
                try {
                    await Promise.resolve(prepareIn(next));
                } catch (err) {
                    console.error('prepareIn failed', err);
                }
            }
            void next.offsetHeight;
            gsap.set(next, { visibility: 'visible', opacity: 0 });
        }

        const reveal = gsap.timeline({ defaults: { ease: this.easeSoft, force3D: true } });
        reveal.to(sigil, { opacity: 0, y: -6, scale: 1.03, duration: 0.1 }, 0);
        reveal.to(veil, { xPercent: 104, duration: 0.26, ease: this.easeFlow }, 0);
        reveal.to(edge, { xPercent: 120, opacity: 0, duration: 0.26, ease: this.easeFlow }, 0);
        if (next) {
            reveal.to(next, {
                opacity: 1,
                duration: 0.18,
                ease: this.easeSoft
            }, 0);
        }

        reveal.add(() => {
            wipe.classList.remove('is-on');
            gsap.set(veil, { xPercent: -104 });
            gsap.set(edge, { xPercent: -45, opacity: 0 });
            if (next) gsap.set(next, { opacity: 1 });
            this._busy = false;
            if (afterIn && next) {
                try { afterIn(next); } catch (err) { console.error('afterIn failed', err); }
            }
        });

        await reveal.then();
        return next;
    },

    revealArena(root) {
        this.ensureGsap();
        if (!root || this.reduced() || typeof gsap === 'undefined') {
            root?.classList.remove('is-entering', 'mx-booting');
            return;
        }
        root.classList.add('is-entering');
        root.classList.remove('mx-booting');

        const top = root.querySelector('.arena-topbar');
        const hero = root.querySelector('.arena-hero');
        const tabs = root.querySelector('.arena-tabs');
        const frame = root.querySelector('.arena-frame');
        const missions = root.querySelectorAll('.arena-mission');

        const layers = [top, hero, tabs, frame].filter(Boolean);
        gsap.set(layers, { opacity: 0, y: 16, force3D: true });
        if (missions.length) gsap.set(missions, { opacity: 0, y: 10, force3D: true });

        const tl = gsap.timeline({
            defaults: { ease: this.ease, overwrite: 'auto', force3D: true },
            onComplete: () => root.classList.remove('is-entering')
        });
        this.track(tl);

        if (top) tl.to(top, { opacity: 1, y: 0, duration: 0.36 }, 0);
        if (hero) tl.to(hero, { opacity: 1, y: 0, duration: 0.4 }, 0.05);
        if (tabs) tl.to(tabs, { opacity: 1, y: 0, duration: 0.32 }, 0.1);
        if (frame) tl.to(frame, { opacity: 1, y: 0, duration: 0.36 }, 0.12);
        if (missions.length) {
            tl.to(missions, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.014
            }, 0.14);
        }
    },

    revealGacha(root) {
        this.ensureGsap();
        if (!root) return;
        const shell = root.querySelector('.gacha-wuwa');
        if (!shell) {
            root.classList.remove('mx-booting');
            return;
        }

        // Wipe already transitioned — show chrome immediately (no second stagger lag)
        root.classList.remove('mx-booting');
        shell.classList.remove('gw-boot');

        const layers = shell.querySelectorAll('.gw-boot-layer');
        const art = shell.querySelector('.gw-art');

        if (this.reduced() || typeof gsap === 'undefined') {
            layers.forEach((n) => {
                n.style.opacity = '';
                n.style.transform = '';
            });
            if (art) art.style.opacity = '';
            return;
        }

        gsap.killTweensOf([art, ...layers].filter(Boolean));
        if (art) gsap.set(art, { opacity: 1, force3D: true });
        if (layers.length) {
            gsap.set(layers, { opacity: 1, y: 0, force3D: true });
            gsap.set(layers, { clearProps: 'transform' });
        }
    },

    bannerSwitch(root, applyFn) {
        this.ensureGsap();
        if (!root || typeof applyFn !== 'function') return;
        if (this.reduced() || typeof gsap === 'undefined') {
            applyFn();
            return;
        }
        const shell = root.querySelector('.gacha-wuwa') || root;
        const copy = shell.querySelector('.gw-copy');
        const reward = shell.querySelector('.gw-reward');
        const art = shell.querySelector('.gw-art');
        const still = shell.querySelector('#gw-banner-static');
        const ui = [copy, reward].filter(Boolean);

        this.killTracked();
        gsap.killTweensOf([art, still, ...ui].filter(Boolean));
        shell.classList.add('is-banner-switching');

        const tl = gsap.timeline({
            defaults: { ease: this.easeSoft, overwrite: 'auto', force3D: true },
            onComplete: () => {
                shell.classList.remove('is-banner-switching');
                gsap.set(ui, { clearProps: 'opacity,transform,filter,y,x,scale' });
                if (art) gsap.set(art, { clearProps: 'opacity' });
            }
        });
        this.track(tl);

        if (ui.length) {
            tl.to(ui, { opacity: 0, duration: 0.1 }, 0);
        }
        if (art) {
            tl.to(art, { opacity: 0.7, duration: 0.1 }, 0);
        }
        if (still) {
            tl.to(still, { opacity: 0.55, duration: 0.1 }, 0);
        }
        tl.add(() => { applyFn(); });
        if (still) {
            tl.fromTo(still, { opacity: 0.55 }, { opacity: 1, duration: 0.22, ease: this.easeSoft }, '>');
        }
        if (art) tl.to(art, { opacity: 1, duration: 0.2 }, '<');
        if (copy) {
            tl.fromTo(copy,
                { opacity: 0 },
                { opacity: 1, duration: 0.18 },
                '-=0.14');
        }
        if (reward) {
            tl.fromTo(reward,
                { opacity: 0 },
                { opacity: 1, duration: 0.16 },
                '-=0.14');
        }
    },

    softListIn(nodes) {
        this.ensureGsap();
        if (!nodes?.length || this.reduced() || typeof gsap === 'undefined') return;
        gsap.fromTo(nodes,
            { opacity: 0.35, y: 6 },
            {
                opacity: 1,
                y: 0,
                duration: 0.26,
                stagger: 0.012,
                ease: this.ease,
                overwrite: 'auto',
                force3D: true
            }
        );
    }
};

window.MotionFx = MotionFx;
if (typeof gsap !== 'undefined') MotionFx.ensureGsap();
