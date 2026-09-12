/**
 * Reusable skeletal Animator — keyframes + easing + animation events.
 * Drives bone pose deltas on a SkelFormRuntime model (not full-PNG swaps).
 */
const SkelAnimator = (() => {
    const EASING = {
        linear: (t) => t,
        easeIn: (t) => t * t,
        easeOut: (t) => 1 - (1 - t) * (1 - t),
        easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
        easeInCubic: (t) => t * t * t,
        easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
        easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
        easeOutBack: (t) => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        },
        easeInBack: (t) => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return c3 * t * t * t - c1 * t * t;
        },
        easeOutElastic: (t) => {
            if (t === 0 || t === 1) return t;
            return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
        }
    };

    function ease(name, t) {
        return (EASING[name] || EASING.linear)(Math.max(0, Math.min(1, t)));
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function sampleTrack(keys, tNorm, channels) {
        if (!keys || !keys.length) return null;
        const sorted = keys;
        if (tNorm <= sorted[0].t) return pick(sorted[0], channels);
        if (tNorm >= sorted[sorted.length - 1].t) return pick(sorted[sorted.length - 1], channels);
        let i = 0;
        while (i < sorted.length - 1 && sorted[i + 1].t < tNorm) i += 1;
        const a = sorted[i];
        const b = sorted[i + 1];
        const span = Math.max(1e-6, b.t - a.t);
        const local = (tNorm - a.t) / span;
        const e = ease(b.easing || a.easing || 'easeInOut', local);
        const out = {};
        channels.forEach((ch) => {
            const av = a[ch];
            const bv = b[ch];
            if (av == null && bv == null) return;
            out[ch] = lerp(av ?? defaultCh(ch), bv ?? defaultCh(ch), e);
        });
        return out;
    }

    function defaultCh(ch) {
        if (ch === 'sx' || ch === 'sy' || ch === 'alpha') return 1;
        return 0;
    }

    function pick(key, channels) {
        const out = {};
        channels.forEach((ch) => {
            if (key[ch] != null) out[ch] = key[ch];
        });
        return out;
    }

    const CHANNELS = ['x', 'y', 'rot', 'sx', 'sy', 'alpha'];

    class Animator {
        constructor(model, canvas, options = {}) {
            this.model = model;
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d', { alpha: true });
            this.pose = model.createPose();
            this.clips = Object.create(null);
            this.current = null;
            this.time = 0;
            this.timeScale = 1;
            this.playing = false;
            this.loop = false;
            this.facing = options.facing ?? 1;
            this.listeners = new Set();
            this._raf = 0;
            this._last = 0;
            this._fired = new Set();
            this._queue = [];
            this.fit = null;
            this.draw();
        }

        onEvent(fn) {
            this.listeners.add(fn);
            return () => this.listeners.delete(fn);
        }

        emit(name, extra = {}) {
            const evt = { name, time: this.time, clip: this.current?.name, ...extra };
            this.listeners.forEach((fn) => {
                try { fn(evt); } catch (_) { /* */ }
            });
        }

        registerClips(map) {
            Object.assign(this.clips, map || {});
        }

        has(name) {
            return !!this.clips[name];
        }

        play(name, opts = {}) {
            const clip = this.clips[name];
            if (!clip) return Promise.reject(new Error(`missing clip: ${name}`));
            if (opts.queue && this.playing && this.current && !this.current.loop) {
                return new Promise((resolve, reject) => {
                    this._queue.push({ name, opts, resolve, reject });
                });
            }
            if (this._resolve) {
                this._resolve({ clip: this.current?.name, interrupted: true });
                this._resolve = null;
                this._promise = null;
            }
            this.cancelInternal(false);
            this.current = clip;
            this.time = opts.from ?? 0;
            this.loop = opts.loop ?? !!clip.loop;
            this.playing = true;
            this._fired = new Set();
            this._last = performance.now();
            this.applyPoseAt(this.time / clip.duration);
            this.draw();
            this.emit('CLIP_START', { clip: name });
            this.tickEvents(0);
            this.ensureLoop();
            this._promise = new Promise((resolve) => { this._resolve = resolve; });
            return this._promise;
        }

        stop(reset = true) {
            this.cancelInternal(true);
            if (reset) {
                this.pose = this.model.createPose();
                this.draw();
            }
        }

        cancelInternal(resolvePromise) {
            this.playing = false;
            if (this._raf) cancelAnimationFrame(this._raf);
            this._raf = 0;
            if (resolvePromise && this._resolve) {
                this._resolve({ clip: this.current?.name, interrupted: true });
                this._resolve = null;
                this._promise = null;
            }
        }

        ensureLoop() {
            if (this._raf) return;
            const step = (now) => {
                this._raf = 0;
                if (!this.playing || !this.current) return;
                const dt = Math.min(0.05, (now - this._last) / 1000) * this.timeScale;
                this._last = now;
                this.time += dt * 1000;
                const dur = this.current.duration;
                let tNorm = this.time / dur;
                if (tNorm >= 1) {
                    if (this.loop) {
                        this.time = this.time % dur;
                        this._fired = new Set();
                        tNorm = this.time / dur;
                        this.emit('CLIP_LOOP');
                    } else {
                        tNorm = 1;
                        this.applyPoseAt(1);
                        this.tickEvents(1);
                        this.draw();
                        this.playing = false;
                        this.emit('CLIP_END');
                        const done = this._resolve;
                        this._resolve = null;
                        this._promise = null;
                        if (done) done({ clip: this.current.name, interrupted: false });
                        this.dequeue();
                        return;
                    }
                }
                this.applyPoseAt(tNorm);
                this.tickEvents(tNorm);
                this.draw();
                this._raf = requestAnimationFrame(step);
            };
            this._last = performance.now();
            this._raf = requestAnimationFrame(step);
        }

        dequeue() {
            const next = this._queue.shift();
            if (!next) return;
            this.play(next.name, next.opts).then(next.resolve, next.reject);
        }

        applyPoseAt(tNorm) {
            const clip = this.current;
            const pose = this.model.createPose();
            if (!clip) {
                this.pose = pose;
                return;
            }
            const tracks = clip.tracks || {};
            Object.keys(tracks).forEach((bone) => {
                const sample = sampleTrack(tracks[bone], tNorm, CHANNELS);
                if (!sample) return;
                if (bone === '__root' || bone === 'root') {
                    Object.assign(pose.__root, sample);
                } else if (pose[bone]) {
                    Object.assign(pose[bone], sample);
                }
            });
            this.pose = pose;
        }

        tickEvents(tNorm) {
            const events = this.current?.events || [];
            events.forEach((ev, idx) => {
                const key = `${idx}:${ev.name}`;
                if (this._fired.has(key)) return;
                if (tNorm + 1e-4 >= ev.t) {
                    this._fired.add(key);
                    this.emit(ev.name, { event: ev });
                }
            });
        }

        draw() {
            if (!this.ctx) return;
            this.fit = SkelFormRuntime.draw(this.ctx, this.model, this.pose, {
                facing: this.facing,
                fit: this.fit || undefined
            });
        }

        setFacing(facing) {
            this.facing = facing;
            this.draw();
        }

        setTimeScale(scale) {
            this.timeScale = scale;
        }

        async hitStop(ms = 80) {
            const prev = this.timeScale;
            this.timeScale = 0.05;
            await new Promise((r) => setTimeout(r, ms));
            this.timeScale = prev;
        }

        destroy() {
            this.stop(false);
            this.listeners.clear();
        }
    }

    return { Animator, EASING, sampleTrack };
})();

if (typeof window !== 'undefined') window.SkelAnimator = SkelAnimator;
