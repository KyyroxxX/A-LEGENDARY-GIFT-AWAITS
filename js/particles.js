/**
 * Ambient Particle System — delta-time + HiDPI for smooth 60–144Hz.
 */
const ParticleSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    intensity: 1,
    dpr: 1,
    _lastTs: 0,
    _w: 0,
    _h: 0,

    init() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.resize();
        window.addEventListener('resize', () => this.resize());

        for (let i = 0; i < 72; i++) {
            this.particles.push(this.createParticle());
        }

        this._lastTs = performance.now();
        this.animate(this._lastTs);
    },

    resize() {
        if (!this.canvas || !this.ctx) return;
        this.dpr = Math.min(2, window.devicePixelRatio || 1);
        this._w = window.innerWidth;
        this._h = window.innerHeight;
        this.canvas.width = Math.max(1, Math.floor(this._w * this.dpr));
        this.canvas.height = Math.max(1, Math.floor(this._h * this.dpr));
        this.canvas.style.width = `${this._w}px`;
        this.canvas.style.height = `${this._h}px`;
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    },

    createParticle() {
        const roll = Math.random();
        return {
            x: Math.random() * (this._w || window.innerWidth),
            y: Math.random() * (this._h || window.innerHeight),
            size: Math.random() * 2.8 + 0.4,
            speedX: (Math.random() - 0.5) * 0.45,
            speedY: (Math.random() - 0.5) * 0.25 - 0.15,
            opacity: Math.random() * 0.45 + 0.08,
            color: roll > 0.72 ? '#d4af37' : roll > 0.45 ? '#8eb4e8' : roll > 0.2 ? '#f7f1e6' : '#c41e3a',
            twinkle: Math.random() * Math.PI * 2,
            shape: Math.random() > 0.85 ? 'shard' : 'dot'
        };
    },

    setIntensity(value) {
        this.intensity = value;
    },

    burst(x, y, count = 30, color = '#f4d03f') {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const speed = Math.random() * 4 + 2;
            this.particles.push({
                x, y,
                size: Math.random() * 4 + 1,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                opacity: 1,
                color,
                life: 1,
                twinkle: 0,
                shape: 'dot'
            });
        }
    },

    animate(ts) {
        this.animationId = requestAnimationFrame((t) => this.animate(t));
        if (!this.ctx || !this.canvas) return;

        const now = ts || performance.now();
        let dt = (now - this._lastTs) / 1000;
        this._lastTs = now;
        if (!Number.isFinite(dt) || dt <= 0) dt = 1 / 60;
        // Clamp so tab-focus spikes don't explode motion; keep 120/144Hz smooth
        dt = Math.min(0.05, Math.max(0.004, dt));
        const frame = dt * 60; // normalize vs 60fps design units

        this.ctx.clearRect(0, 0, this._w, this._h);

        const targetCount = Math.floor(72 * this.intensity);
        while (this.particles.length < targetCount) {
            this.particles.push(this.createParticle());
        }

        this.particles = this.particles.filter((p) => {
            if (p.life !== undefined) {
                p.life -= 0.02 * frame;
                p.x += p.speedX * frame;
                p.y += p.speedY * frame;
                p.opacity = Math.max(0, p.life);
                p.speedX *= Math.pow(0.98, frame);
                p.speedY *= Math.pow(0.98, frame);
                if (p.life <= 0) return false;
            } else {
                p.x += p.speedX * this.intensity * frame;
                p.y += p.speedY * this.intensity * frame;
                p.twinkle += 0.02 * frame;
                p.opacity = (Math.sin(p.twinkle) * 0.3 + 0.4) * this.intensity;

                if (p.x < 0) p.x = this._w;
                if (p.x > this._w) p.x = 0;
                if (p.y < 0) p.y = this._h;
                if (p.y > this._h) p.y = 0;
            }

            this.ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            if (p.shape === 'shard') {
                this.ctx.moveTo(p.x, p.y - p.size);
                this.ctx.lineTo(p.x + p.size * 0.6, p.y);
                this.ctx.lineTo(p.x, p.y + p.size);
                this.ctx.lineTo(p.x - p.size * 0.6, p.y);
                this.ctx.closePath();
            } else {
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }
            this.ctx.fill();
            return true;
        });

        this.ctx.globalAlpha = 1;
    }
};

function screenShake(element, intensity = 1) {
    const el = element || document.getElementById('app');
    if (!el) return;
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    const ms = Math.max(280, Math.min(700, 420 * intensity));
    clearTimeout(el._shakeTimer);
    el._shakeTimer = setTimeout(() => el.classList.remove('shake'), ms);
}

window.ParticleSystem = ParticleSystem;
window.screenShake = screenShake;
