/**
 * God sprites (Nextyle / JUS / DA) — matching tall Shippuden set.
 * dir4 legacy retired for cast.
 */
const SpriteActors = {
    BASE: 'assets/world/sprites/god/',
    VER: 'godv2',
    NATIVE_W: 96,
    NATIVE_H: 120,
    /** Bigger on map so the new art reads clearly */
    WORLD_H: 92,
    images: {},
    bboxes: {},
    loading: null,

    layout: {
        naruto: {
            down: {
                idle: ['naruto_down_idle.png', 'naruto_down_idle2.png'],
                walk: ['naruto_down_idle.png', 'naruto_down_walk1.png', 'naruto_down_idle.png', 'naruto_down_walk2.png'],
                run: ['naruto_down_run1.png', 'naruto_down_run2.png', 'naruto_down_run1.png', 'naruto_down_run2.png']
            },
            up: {
                idle: ['naruto_up_idle.png', 'naruto_up_idle2.png'],
                walk: ['naruto_up_idle.png', 'naruto_up_walk1.png', 'naruto_up_idle.png', 'naruto_up_walk2.png'],
                run: ['naruto_up_run1.png', 'naruto_up_run2.png', 'naruto_up_run1.png', 'naruto_up_run2.png']
            },
            left: {
                idle: ['naruto_left_idle.png', 'naruto_left_idle2.png'],
                // walk = natural arm swing (NOT arms-back — that was the bug)
                walk: ['naruto_left_walk2.png', 'naruto_left_walk1.png', 'naruto_left_walk2.png', 'naruto_left_walk1.png'],
                // run = classic Naruto arms-back
                run: ['naruto_left_run1.png', 'naruto_left_run2.png', 'naruto_left_run1.png', 'naruto_left_run2.png']
            },
            right: {
                idle: ['naruto_right_idle.png', 'naruto_right_idle2.png'],
                walk: ['naruto_right_walk2.png', 'naruto_right_walk1.png', 'naruto_right_walk2.png', 'naruto_right_walk1.png'],
                run: ['naruto_right_run1.png', 'naruto_right_run2.png', 'naruto_right_run1.png', 'naruto_right_run2.png']
            }
        },
        sakura: {
            down: { idle: ['sakura_down_idle.png', 'sakura_down_idle2.png', 'sakura_down_idle.png', 'sakura_down_idle3.png'], walk: ['sakura_down_idle.png'] },
            up: { idle: ['sakura_up_idle.png', 'sakura_up_idle2.png', 'sakura_up_idle.png', 'sakura_up_idle3.png'], walk: ['sakura_up_idle.png'] },
            left: { idle: ['sakura_left_idle.png', 'sakura_left_idle2.png', 'sakura_left_idle.png', 'sakura_left_idle3.png'], walk: ['sakura_left_idle.png'] },
            right: { idle: ['sakura_right_idle.png', 'sakura_right_idle2.png', 'sakura_right_idle.png', 'sakura_right_idle3.png'], walk: ['sakura_right_idle.png'] }
        },
        sasuke: {
            down: { idle: ['sasuke_down_idle.png', 'sasuke_down_idle2.png', 'sasuke_down_idle.png', 'sasuke_down_idle3.png'], walk: ['sasuke_down_idle.png'] },
            up: { idle: ['sasuke_up_idle.png', 'sasuke_up_idle2.png', 'sasuke_up_idle.png', 'sasuke_up_idle3.png'], walk: ['sasuke_up_idle.png'] },
            left: { idle: ['sasuke_left_idle.png', 'sasuke_left_idle2.png', 'sasuke_left_idle.png', 'sasuke_left_idle3.png'], walk: ['sasuke_left_idle.png'] },
            right: { idle: ['sasuke_right_idle.png', 'sasuke_right_idle2.png', 'sasuke_right_idle.png', 'sasuke_right_idle3.png'], walk: ['sasuke_right_idle.png'] }
        },
        kakashi: {
            down: { idle: ['kakashi_down_idle.png', 'kakashi_down_idle2.png', 'kakashi_down_idle.png', 'kakashi_down_idle3.png'], walk: ['kakashi_down_idle.png'] },
            up: { idle: ['kakashi_up_idle.png', 'kakashi_up_idle2.png', 'kakashi_up_idle.png', 'kakashi_up_idle3.png'], walk: ['kakashi_up_idle.png'] },
            left: { idle: ['kakashi_left_idle.png', 'kakashi_left_idle2.png', 'kakashi_left_idle.png', 'kakashi_left_idle3.png'], walk: ['kakashi_left_idle.png'] },
            right: { idle: ['kakashi_right_idle.png', 'kakashi_right_idle2.png', 'kakashi_right_idle.png', 'kakashi_right_idle3.png'], walk: ['kakashi_right_idle.png'] }
        },
        teuchi: {
            down: { idle: ['teuchi_down_idle.png', 'teuchi_down_idle2.png', 'teuchi_down_idle.png', 'teuchi_down_idle3.png'], walk: ['teuchi_down_idle.png'] },
            up: { idle: ['teuchi_up_idle.png', 'teuchi_up_idle2.png', 'teuchi_up_idle.png', 'teuchi_up_idle3.png'], walk: ['teuchi_up_idle.png'] },
            left: { idle: ['teuchi_left_idle.png', 'teuchi_left_idle2.png', 'teuchi_left_idle.png', 'teuchi_left_idle3.png'], walk: ['teuchi_left_idle.png'] },
            right: { idle: ['teuchi_right_idle.png', 'teuchi_right_idle2.png', 'teuchi_right_idle.png', 'teuchi_right_idle3.png'], walk: ['teuchi_right_idle.png'] }
        },
        villager: {
            down: { idle: ['villager_down_idle.png', 'villager_down_idle2.png', 'villager_down_idle.png', 'villager_down_idle3.png'], walk: ['villager_down_idle.png'] },
            up: { idle: ['villager_up_idle.png', 'villager_up_idle2.png', 'villager_up_idle.png', 'villager_up_idle3.png'], walk: ['villager_up_idle.png'] },
            left: { idle: ['villager_left_idle.png', 'villager_left_idle2.png', 'villager_left_idle.png', 'villager_left_idle3.png'], walk: ['villager_left_idle.png'] },
            right: { idle: ['villager_right_idle.png', 'villager_right_idle2.png', 'villager_right_idle.png', 'villager_right_idle3.png'], walk: ['villager_right_idle.png'] }
        },
        sai: {
            down: { idle: ['sai_down_idle.png', 'sai_down_idle2.png'], walk: ['sai_down_walk1.png', 'sai_down_idle.png'], run: ['sai_down_run1.png', 'sai_down_run2.png'] },
            up: { idle: ['sai_up_idle.png', 'sai_up_idle2.png'], walk: ['sai_up_walk1.png', 'sai_up_idle.png'], run: ['sai_up_run1.png', 'sai_up_run2.png'] },
            left: { idle: ['sai_left_idle.png', 'sai_left_idle2.png'], walk: ['sai_left_walk1.png', 'sai_left_idle.png'], run: ['sai_left_run1.png', 'sai_left_run2.png'] },
            right: { idle: ['sai_right_idle.png', 'sai_right_idle2.png'], walk: ['sai_right_walk1.png', 'sai_right_idle.png'], run: ['sai_right_run1.png', 'sai_right_run2.png'] }
        },
        yamato: {
            down: { idle: ['yamato_down_idle.png', 'yamato_down_idle2.png'], walk: ['yamato_down_walk1.png', 'yamato_down_idle.png'], run: ['yamato_down_run1.png', 'yamato_down_run2.png'] },
            up: { idle: ['yamato_up_idle.png', 'yamato_up_idle2.png'], walk: ['yamato_up_walk1.png', 'yamato_up_idle.png'], run: ['yamato_up_run1.png', 'yamato_up_run2.png'] },
            left: { idle: ['yamato_left_idle.png', 'yamato_left_idle2.png'], walk: ['yamato_left_walk1.png', 'yamato_left_idle.png'], run: ['yamato_left_run1.png', 'yamato_left_run2.png'] },
            right: { idle: ['yamato_right_idle.png', 'yamato_right_idle2.png'], walk: ['yamato_right_walk1.png', 'yamato_right_idle.png'], run: ['yamato_right_run1.png', 'yamato_right_run2.png'] }
        }
    },

    alias: {
        kunoichi: 'sakura',
        gaara: 'sasuke',
        chiki: 'villager',
        ayame: 'sakura',
        nami: 'sakura',
        orihime: 'sakura',
        guy: 'villager',
        iruka: 'kakashi'
    },

    src(file) {
        return `${this.BASE}${file}?${this.VER}`;
    },

    loadAll() {
        if (this.loading) return this.loading;
        const files = new Set();
        Object.values(this.layout).forEach(dirs => {
            if (!dirs) return;
            Object.values(dirs).forEach(set => {
                (set.idle || []).forEach(f => files.add(f));
                (set.walk || []).forEach(f => files.add(f));
                (set.run || []).forEach(f => files.add(f));
            });
        });
        this.loading = Promise.all([...files].map(f => new Promise(res => {
            const img = new Image();
            img.onload = () => {
                this.images[f] = img;
                this.bboxes[f] = this.computeBBox(img);
                res();
            };
            img.onerror = () => { this.images[f] = null; res(); };
            img.src = this.src(f);
        })));
        return this.loading;
    },

    computeBBox(img) {
        try {
            const c = document.createElement('canvas');
            c.width = img.naturalWidth || img.width;
            c.height = img.naturalHeight || img.height;
            const ctx = c.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0);
            const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
            let minX = width, minY = height, maxX = 0, maxY = 0, found = false;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (data[(y * width + x) * 4 + 3] > 12) {
                        found = true;
                        if (x < minX) minX = x;
                        if (y < minY) minY = y;
                        if (x > maxX) maxX = x;
                        if (y > maxY) maxY = y;
                    }
                }
            }
            if (!found) return { sx: 0, sy: 0, sw: width, sh: height };
            const pad = 2;
            const sx = Math.max(0, minX - pad);
            const sy = Math.max(0, minY - pad);
            const ex = Math.min(width - 1, maxX + pad);
            const ey = Math.min(height - 1, maxY + pad);
            return { sx, sy, sw: ex - sx + 1, sh: ey - sy + 1 };
        } catch (e) {
            return { sx: 0, sy: 0, sw: img.width, sh: img.height };
        }
    },

    resolveId(id) {
        if (this.layout[id]) return id;
        const a = this.alias[id];
        if (a && this.layout[a]) return a;
        return 'villager';
    },

    sizeFor(viewScale = 1, sizeMul = 1, aspect = 96 / 120) {
        const sh = this.WORLD_H * viewScale * sizeMul;
        const sw = sh * aspect;
        return { sw, sh };
    },

    pickFile(set, moving, frame, idlePhase, running = false) {
        if (moving && running && set.run && set.run.length) {
            return set.run[frame % set.run.length];
        }
        if (moving && set.walk && set.walk.length) {
            return set.walk[frame % set.walk.length];
        }
        const idle = set.idle || [];
        if (!idle.length) return null;
        return idle[Math.floor(idlePhase * 0.55) % idle.length];
    },

    draw(ctx, id, facing, frame, moving, x, y, viewScale = 1, sizeMul = 1, idlePhase = 0, running = false, tint = null) {
        const pid = this.resolveId(id);
        const dir = (facing === 'up' || facing === 'down' || facing === 'left' || facing === 'right')
            ? facing : 'down';

        const dirs = this.layout[pid];
        if (!dirs) return;
        const set = dirs[dir] || dirs.down;
        const file = this.pickFile(set, moving, frame, idlePhase, running);
        const img = file ? this.images[file] : null;
        const bb = (file && this.bboxes[file]) || null;

        const aspect = bb ? (bb.sw / bb.sh) : (this.NATIVE_W / this.NATIVE_H);
        const { sw, sh } = this.sizeFor(viewScale, sizeMul, aspect);
        const dx = Math.round(x);
        const dy = Math.round(y + (moving ? ((frame % 2 === 0) ? 0 : -1) : 0));
        const dw = Math.round(sw);
        const dh = Math.round(sh);

        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(x + sw / 2, y + sh - 1, sw * 0.28, Math.max(3, 4 * viewScale), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const paint = (target) => {
            target.imageSmoothingEnabled = false;
            if (img && bb) {
                target.drawImage(img, bb.sx, bb.sy, bb.sw, bb.sh, dx, dy, dw, dh);
            } else if (img) {
                target.drawImage(img, dx, dy, dw, dh);
            } else if (typeof PixelActors !== 'undefined') {
                const c = PixelActors.get(pid, dir, moving ? frame : 0, moving, { idlePhase, running: false });
                const pxScale = sh / c.height;
                PixelActors.blit(target, c, x + (sw - c.width * pxScale) / 2, y + 2, pxScale);
            }
        };

        if (tint && (img || typeof PixelActors !== 'undefined')) {
            if (!this._tintCanvas) {
                this._tintCanvas = document.createElement('canvas');
                this._tintCtx = this._tintCanvas.getContext('2d');
            }
            const tc = this._tintCanvas;
            const tctx = this._tintCtx;
            const pad = 4;
            tc.width = Math.max(1, dw + pad * 2);
            tc.height = Math.max(1, dh + pad * 2);
            tctx.clearRect(0, 0, tc.width, tc.height);
            tctx.save();
            tctx.translate(-dx + pad, -dy + pad);
            paint(tctx);
            tctx.globalCompositeOperation = 'source-atop';
            tctx.globalAlpha = 0.28;
            tctx.fillStyle = tint;
            tctx.fillRect(dx, dy, dw, dh);
            tctx.restore();
            ctx.drawImage(tc, dx - pad, dy - pad);
            return;
        }

        paint(ctx);
    },

    drawAtFeet(ctx, id, facing, frame, moving, footX, footY, viewScale = 1, sizeMul = 1, idlePhase = 0, running = false, tint = null) {
        const pid = this.resolveId(id);
        const dir = (facing === 'up' || facing === 'down' || facing === 'left' || facing === 'right')
            ? facing : 'down';
        const dirs = this.layout[pid];
        const set = dirs ? (dirs[dir] || dirs.down) : null;
        const file = set ? this.pickFile(set, moving, frame, idlePhase, running) : null;
        const bb = (file && this.bboxes[file]) || null;
        const aspect = bb ? (bb.sw / bb.sh) : (this.NATIVE_W / this.NATIVE_H);
        const { sw, sh } = this.sizeFor(viewScale, sizeMul, aspect);
        this.draw(ctx, id, facing, frame, moving, footX - sw / 2, footY - sh + 3, viewScale, sizeMul, idlePhase, running, tint);
    }
};
