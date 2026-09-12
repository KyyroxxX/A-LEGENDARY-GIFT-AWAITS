/**
 * Multi-map exploration — polished movement, collision, warps
 */
const KonohaWorld = {
    canvas: null,
    ctx: null,
    miniCanvas: null,
    miniCtx: null,
    raf: null,
    keys: {},
    mapId: 'plaza',
    map: null,
    WORLD_W: 1280,
    WORLD_H: 720,
    viewScale: 1,
    /** Close cinematic camera — map+chars share scale (non-chibi readable) */
    ZOOM: 2.18,
    player: {
        // Feet hitbox — sprite ~door height (SpriteActors.WORLD_H)
        x: 640, y: 450, w: 18, h: 12,
        walkSpeed: 210,
        runSpeed: 360,
        speed: 210,
        vx: 0, vy: 0,
        facing: 'down', frame: 0, distAcc: 0, moving: false,
        running: false,
        idleT: 0
    },
    solids: [],
    entities: [],
    exits: [],
    camera: { x: 0, y: 0 },
    camSmooth: { x: 0, y: 0 },
    paused: false,
    onInteract: null,
    near: null,
    images: {},
    ready: false,
    wrap: null,
    fade: 0,
    fading: false,
    warpLockUntil: 0,
    lastTs: 0,
    _dirtyPos: false,

    loadImage(src) {
        if (!src) return Promise.resolve(null);
        if (this.images[src]) return Promise.resolve(this.images[src]);
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => { this.images[src] = img; resolve(img); };
            img.onerror = () => { this.images[src] = null; resolve(null); };
            img.src = src;
        });
    },

    async preloadMap(mapDef) {
        const jobs = [this.loadImage(mapDef.bg)];
        Object.values(WorldMaps.SPRITES).forEach(s => jobs.push(this.loadImage(s)));
        Object.values(WorldMaps.NARUTO).forEach(arr => arr.forEach(s => jobs.push(this.loadImage(s))));
        await Promise.all(jobs);
        this.ready = true;
    },

    applyMap(mapId, spawn) {
        const def = WorldMaps.get(mapId);
        if (!WorldMaps.unlocked(mapId) && mapId !== 'plaza') {
            return false;
        }
        this.mapId = def.id;
        this.map = def;
        this.WORLD_W = def.w;
        this.WORLD_H = def.h;
        this.buildCollision();
        this.rebuildEntities();
        const sp = spawn || def.spawn;
        this.player.x = sp.x * this.WORLD_W;
        this.player.y = sp.y * this.WORLD_H;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.moving = false;
        this.player.frame = 0;
        this.player.distAcc = 0;
        this.ejectFromSolids();
        // Snap camera instantly on map change
        this.camSmooth.x = null;
        this.camSmooth.y = null;
        GameState.update({ exploreMap: def.id, exploreX: this.player.x, exploreY: this.player.y });
        this.preloadMap(def);
        if (this.mapLabelEl) this.mapLabelEl.textContent = def.name;
        if (this.onMapChange) this.onMapChange(def);
        return true;
    },

    buildCollision() {
        const W = this.WORLD_W;
        const H = this.WORLD_H;
        this.solids = (this.map.solids || []).map(([nx, ny, nw, nh]) => ({
            x: nx * W, y: ny * H, w: nw * W, h: nh * H
        }));
        this.exits = (this.map.exits || []).map(ex => ({
            ...ex,
            x: ex.nx * W, y: ex.ny * H, w: ex.nw * W, h: ex.nh * H,
            locked: ex.need ? !WorldMaps.unlocked(ex.to) : false
        }));
    },

    rebuildEntities() {
        if (!this.map) return;
        const day = Calendar.getDay();
        const raw = this.map.buildEntities ? this.map.buildEntities(day) : [];
        const W = this.WORLD_W;
        const H = this.WORLD_H;
        this.entities = raw.map((e, i) => ({
            ...e,
            x: (e.nx ?? 0.5) * W,
            y: (e.ny ?? 0.5) * H,
            w: (e.nw ?? 0.028) * W,
            h: (e.nh ?? 0.04) * H,
            idleSeed: (e.id || i).toString().split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 97
        }));
        this.exits.forEach((ex, i) => {
            this.entities.push({
                id: 'exit_' + i,
                name: ex.locked ? (ex.label || 'Salida') + ' 🔒' : (ex.label || 'Salida'),
                kind: 'warp',
                to: ex.to,
                spawn: ex.spawn,
                locked: !!ex.locked,
                x: ex.x, y: ex.y, w: ex.w, h: ex.h,
                color: ex.locked ? '#555' : (ex.color || '#27ae60'),
                label: ex.locked ? 'CERRADO' : (ex.label || 'ENTRAR')
            });
        });
    },

    /** Push player out if spawn landed inside a wall */
    ejectFromSolids() {
        if (!this.collides(this.player.x, this.player.y)) return;
        const steps = [
            [0, 8], [0, -8], [8, 0], [-8, 0],
            [12, 12], [-12, 12], [12, -12], [-12, -12],
            [0, 24], [0, -24], [24, 0], [-24, 0],
            [0, 40], [40, 0], [-40, 0], [0, -40]
        ];
        for (let r = 1; r <= 8; r++) {
            for (const [dx, dy] of steps) {
                const nx = this.player.x + dx * r;
                const ny = this.player.y + dy * r;
                if (nx < 8 || ny < 8 || nx > this.WORLD_W - 30 || ny > this.WORLD_H - 30) continue;
                if (!this.collides(nx, ny)) {
                    this.player.x = nx;
                    this.player.y = ny;
                    return;
                }
            }
        }
        // Absolute fallback: map spawn
        const sp = this.map?.spawn || { x: 0.5, y: 0.7 };
        this.player.x = sp.x * this.WORLD_W;
        this.player.y = sp.y * this.WORLD_H;
    },

    mount(container, { onInteract, onMapChange } = {}) {
        this.unmount();
        this.onInteract = onInteract;
        this.onMapChange = onMapChange;

        const wrap = document.createElement('div');
        wrap.className = 'konoha-wrap';
        wrap.innerHTML = `
            <div class="konoha-map-label" id="konoha-map-label">Konoha</div>
            <canvas id="konoha-canvas"></canvas>
            <canvas id="konoha-minimap" class="konoha-minimap" width="140" height="140"></canvas>
            <div class="konoha-prompt" id="konoha-prompt" hidden>
                <span class="konoha-prompt-key">E</span>
                <span class="konoha-prompt-label" id="konoha-prompt-label"></span>
            </div>
            <div class="konoha-controls">
                <div class="konoha-pad">
                    <button type="button" data-dir="up">▲</button>
                    <div class="konoha-pad-mid">
                        <button type="button" data-dir="left">◀</button>
                        <button type="button" data-dir="down">▼</button>
                        <button type="button" data-dir="right">▶</button>
                    </div>
                </div>
                <button type="button" class="konoha-act" id="konoha-act">E · ACCIÓN</button>
            </div>
            <p class="konoha-help">WASD andar · Shift correr · E acción · puertas = zonas</p>
            <div class="konoha-fade" id="konoha-fade"></div>
        `;
        container.appendChild(wrap);
        this.wrap = wrap;
        this.canvas = wrap.querySelector('#konoha-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.miniCanvas = wrap.querySelector('#konoha-minimap');
        this.miniCtx = this.miniCanvas.getContext('2d');
        this.promptEl = wrap.querySelector('#konoha-prompt');
        this.promptLabelEl = wrap.querySelector('#konoha-prompt-label');
        this.mapLabelEl = wrap.querySelector('#konoha-map-label');
        this.fadeEl = wrap.querySelector('#konoha-fade');

        const savedMap = GameState.get('exploreMap') || 'plaza';
        const savedX = GameState.get('exploreX');
        const savedY = GameState.get('exploreY');
        const ok = this.applyMap(WorldMaps.unlocked(savedMap) ? savedMap : 'plaza');
        if (!ok) this.applyMap('plaza');
        if (typeof savedX === 'number' && typeof savedY === 'number' && savedMap === this.mapId) {
            this.player.x = Math.min(this.WORLD_W - 40, Math.max(20, savedX));
            this.player.y = Math.min(this.WORLD_H - 40, Math.max(20, savedY));
            this.ejectFromSolids();
        }

        this.resize();
        this._boundKey = (e) => this.onKey(e, true);
        this._boundUp = (e) => this.onKey(e, false);
        window.addEventListener('keydown', this._boundKey);
        window.addEventListener('keyup', this._boundUp);
        window.addEventListener('resize', this._onResize = () => this.resize());

        wrap.querySelectorAll('[data-dir]').forEach(btn => {
            const dir = btn.dataset.dir;
            const down = (ev) => { ev.preventDefault(); this.keys[dir] = true; };
            const up = (ev) => { ev.preventDefault(); this.keys[dir] = false; };
            btn.addEventListener('pointerdown', down);
            btn.addEventListener('pointerup', up);
            btn.addEventListener('pointerleave', up);
        });
        wrap.querySelector('#konoha-act').onclick = () => this.tryInteract();

        this.paused = false;
        this.lastTs = 0;
        const boot = (typeof SpriteActors !== 'undefined')
            ? SpriteActors.loadAll()
            : Promise.resolve();
        if (typeof PixelActors !== 'undefined') PixelActors.warm();
        boot.then(() => {
            this.preloadMap(this.map).then(() => this.loop());
            if (!this.raf) this.loop();
        });
    },

    unmount() {
        this.paused = true;
        if (this._dirtyPos) {
            GameState.update({ exploreX: this.player.x, exploreY: this.player.y, exploreMap: this.mapId });
            this._dirtyPos = false;
        }
        if (this.raf) cancelAnimationFrame(this.raf);
        this.raf = null;
        if (this._boundKey) window.removeEventListener('keydown', this._boundKey);
        if (this._boundUp) window.removeEventListener('keyup', this._boundUp);
        if (this._onResize) window.removeEventListener('resize', this._onResize);
        if (this.wrap) this.wrap.remove();
        this.wrap = null;
        this.canvas = null;
        this.keys = {};
    },

    pause() {
        this.paused = true;
        if (this._dirtyPos) {
            GameState.update({ exploreX: this.player.x, exploreY: this.player.y, exploreMap: this.mapId });
            this._dirtyPos = false;
        }
    },
    resume() {
        this.paused = false;
        this.rebuildEntities();
        this.lastTs = 0;
        if (!this.raf) this.loop();
    },

    resize() {
        if (!this.canvas || !this.wrap) return;
        const r = this.wrap.getBoundingClientRect();
        const hud = 110;
        this.canvas.width = Math.floor(r.width);
        this.canvas.height = Math.max(280, Math.floor(r.height - hud));
        this.ctx.imageSmoothingEnabled = false;
        this.viewScale = Math.max(
            this.canvas.width / this.WORLD_W,
            this.canvas.height / this.WORLD_H
        ) * (this.ZOOM || 1.72);
    },

    onKey(e, down) {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
        if (this.fading) return;
        const map = {
            ArrowUp: 'up', KeyW: 'up',
            ArrowDown: 'down', KeyS: 'down',
            ArrowLeft: 'left', KeyA: 'left',
            ArrowRight: 'right', KeyD: 'right'
        };
        if (map[e.code]) {
            e.preventDefault();
            this.keys[map[e.code]] = down;
            if (down) this._lastDir = map[e.code];
        }
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
            this.keys.shift = down;
        }
        if (down && (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter')) {
            e.preventDefault();
            this.tryInteract();
        }
    },

    /** AABB vs solids using feet hitbox */
    collides(nx, ny) {
        const p = { x: nx, y: ny, w: this.player.w, h: this.player.h };
        for (const s of this.solids) {
            if (p.x < s.x + s.w && p.x + p.w > s.x && p.y < s.y + s.h && p.y + p.h > s.y) {
                return true;
            }
        }
        // Keep inside world
        if (p.x < 4 || p.y < 4 || p.x + p.w > this.WORLD_W - 4 || p.y + p.h > this.WORLD_H - 4) {
            return true;
        }
        return false;
    },

    update(dt) {
        if (this.paused || this.fading) return;
        const t = Math.min(0.05, Math.max(0.001, dt));

        let ix = 0; let iy = 0;
        if (this.keys.up) iy -= 1;
        if (this.keys.down) iy += 1;
        if (this.keys.left) ix -= 1;
        if (this.keys.right) ix += 1;

        const wantMove = !!(ix || iy);
        this.player.moving = wantMove;
        this.player.running = wantMove && !!this.keys.shift;
        this.player.speed = this.player.running ? this.player.runSpeed : this.player.walkSpeed;

        if (wantMove) {
            const len = Math.hypot(ix, iy) || 1;
            ix /= len; iy /= len;
            // Face by dominant axis (stable — avoids flicker on diagonals)
            if (Math.abs(ix) > Math.abs(iy) + 0.05) {
                this.player.facing = ix > 0 ? 'right' : 'left';
            } else if (Math.abs(iy) > Math.abs(ix) + 0.05) {
                this.player.facing = iy > 0 ? 'down' : 'up';
            } else if (this._lastDir && this.keys[this._lastDir]) {
                this.player.facing = this._lastDir;
            }

            const target = this.player.speed;
            const accel = this.player.running ? 1400 : 1000;
            this.player.vx += (ix * target - this.player.vx) * Math.min(1, accel * t / target);
            this.player.vy += (iy * target - this.player.vy) * Math.min(1, accel * t / target);
        } else {
            this.player.running = false;
            // Friction stop
            const damp = Math.exp(-16 * t);
            this.player.vx *= damp;
            this.player.vy *= damp;
            if (Math.hypot(this.player.vx, this.player.vy) < 10) {
                this.player.vx = 0;
                this.player.vy = 0;
            }
            this.player.frame = 0;
            this.player.distAcc = 0;
        }

        const ox = this.player.x;
        const oy = this.player.y;
        const dx = this.player.vx * t;
        const dy = this.player.vy * t;

        // Axis-separated slide collision
        if (dx !== 0 || dy !== 0) {
            const nx = this.player.x + dx;
            if (!this.collides(nx, this.player.y)) this.player.x = nx;
            else this.player.vx = 0;

            const ny = this.player.y + dy;
            if (!this.collides(this.player.x, ny)) this.player.y = ny;
            else this.player.vy = 0;

            const moved = Math.hypot(this.player.x - ox, this.player.y - oy);
            if (wantMove && moved > 0.05) {
                this.player.distAcc += moved;
                const stride = this.player.running ? 10 : 14;
                while (this.player.distAcc >= stride) {
                    this.player.distAcc -= stride;
                    this.player.frame = (this.player.frame + 1) % 4;
                }
                this._dirtyPos = true;
            }
        }

        this.player.idleT += t;
        this.near = this.findNear();
        if (this.promptEl && this.promptLabelEl) {
            if (this.near) {
                this.promptEl.hidden = false;
                this.promptLabelEl.textContent = this.near.label || this.near.name;
            } else {
                this.promptEl.hidden = true;
            }
        }
    },

    findNear(kindFilter = null) {
        const p = this.player;
        const px = p.x + p.w / 2;
        const py = p.y + p.h / 2;
        let best = null; let bestD = 56;
        for (const e of this.entities) {
            if (kindFilter && e.kind !== kindFilter) continue;
            const ex = e.x + e.w / 2;
            const ey = e.y + e.h / 2;
            const d = Math.hypot(px - ex, py - ey);
            const reach = e.kind === 'warp' ? 62 : 56;
            if (d < reach && d < bestD) { bestD = d; best = e; }
        }
        return best;
    },

    tryInteract() {
        if (this.paused || this.fading) return;
        if (performance.now() < this.warpLockUntil) return;
        const e = this.findNear();
        if (!e || !this.onInteract) return;
        AudioManager.ui.click();
        if (e.kind === 'warp') {
            if (e.locked) {
                this.onInteract?.({
                    kind: 'talk',
                    name: 'Camino cerrado',
                    lines: [{ speaker: 'Sistema', text: 'Aún no puedes ir ahí. Avanza días en el calendario / la historia.' }]
                });
                return;
            }
            this.warpTo(e.to, e.spawn);
            return;
        }
        this.onInteract(e);
    },

    warpTo(mapId, spawn) {
        if (!WorldMaps.unlocked(mapId)) {
            this.onInteract?.({
                kind: 'talk',
                name: 'Camino cerrado',
                lines: [{ speaker: 'Sistema', text: 'Aún no puedes ir ahí. Avanza la historia / el calendario.' }]
            });
            return;
        }
        this.fading = true;
        this.warpLockUntil = performance.now() + 700;
        if (this.fadeEl) this.fadeEl.classList.add('show');
        setTimeout(() => {
            this.applyMap(mapId, spawn);
            this.resize();
            this.paused = false;
            this.warpLockUntil = performance.now() + 550;
            if (!this.raf) this.loop();
            setTimeout(() => {
                if (this.fadeEl) this.fadeEl.classList.remove('show');
                this.fading = false;
                this.resize();
            }, 200);
        }, 180);
    },

    loop() {
        if (this.raf) cancelAnimationFrame(this.raf);
        const tick = (ts) => {
            if (!this.lastTs) this.lastTs = ts;
            const dt = (ts - this.lastTs) / 1000;
            this.lastTs = ts;
            this.update(dt);
            this.draw();
            this.drawMinimap();
            this.raf = requestAnimationFrame(tick);
        };
        this.raf = requestAnimationFrame(tick);
    },

    draw() {
        if (!this.ctx || !this.canvas) return;
        const ctx = this.ctx;
        const cw = this.canvas.width;
        const ch = this.canvas.height;
        const night = Calendar.getSlot() === 'evening' && !this.map?.indoor;
        const s = Math.max(cw / this.WORLD_W, ch / this.WORLD_H) * (this.ZOOM || 1.72);
        this.viewScale = s;

        const pw = this.WORLD_W * s;
        const ph = this.WORLD_H * s;
        const targetCamX = this.player.x * s + (this.player.w * s) / 2 - cw / 2;
        const targetCamY = this.player.y * s + (this.player.h * s) / 2 - ch / 2;
        const maxX = Math.max(0, pw - cw);
        const maxY = Math.max(0, ph - ch);
        const tx = Math.max(0, Math.min(targetCamX, maxX));
        const ty = Math.max(0, Math.min(targetCamY, maxY));

        if (this.camSmooth.x == null) {
            this.camSmooth.x = tx;
            this.camSmooth.y = ty;
        } else {
            this.camSmooth.x += (tx - this.camSmooth.x) * 0.14;
            this.camSmooth.y += (ty - this.camSmooth.y) * 0.14;
        }
        this.camera.x = this.camSmooth.x;
        this.camera.y = this.camSmooth.y;
        const cam = this.camera;

        ctx.fillStyle = this.map?.indoor ? '#1a120e' : (night ? '#1a2430' : '#2d6b3a');
        ctx.fillRect(0, 0, cw, ch);

        const bg = this.images[this.map?.bg];
        if (bg) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(bg, -cam.x, -cam.y, pw, ph);
        }

        const sorted = [...this.entities].sort((a, b) => (a.y + a.h) - (b.y + b.h));
        const playerDepth = this.player.y + this.player.h;
        let playerDrawn = false;

        for (const e of sorted) {
            if (!playerDrawn && playerDepth < e.y + e.h) {
                this.drawNaruto(ctx, cam, s);
                playerDrawn = true;
            }
            const px = e.x * s - cam.x;
            const py = e.y * s - cam.y;
            const ew = Math.max(28, e.w * s);
            const eh = Math.max(20, e.h * s);

            if (e.kind === 'warp' || e.kind === 'explore' || e.kind === 'train' || e.kind === 'advance' || e.kind === 'mission' || e.prop) {
                this.drawLandmark(ctx, e, px, py, ew, eh, s);
            } else {
                this.drawNpc(ctx, e, px, py, s);
            }

            // Always show name for landmarks; NPCs only when near
            if (e.prop || (e.kind !== 'bond' && e.kind !== 'talk')) {
                const label = e.label || e.name;
                ctx.font = `bold ${Math.max(10, Math.round(11 * Math.min(1.2, s)))}px Cinzel, serif`;
                const tw = ctx.measureText(label).width;
                const lx = px + ew / 2 - tw / 2 - 5;
                const ly = py - 6;
                ctx.fillStyle = e === this.near ? 'rgba(196,30,58,0.92)' : 'rgba(10,8,6,0.72)';
                ctx.fillRect(lx, ly - 12, tw + 10, 16);
                ctx.strokeStyle = e.color || '#f7f1e6';
                ctx.lineWidth = 1;
                ctx.strokeRect(lx, ly - 12, tw + 10, 16);
                ctx.fillStyle = '#f7f1e6';
                ctx.fillText(label, lx + 5, ly);
            } else if (e === this.near) {
                const label = e.name;
                ctx.font = 'bold 10px Cinzel, serif';
                const tw = ctx.measureText(label).width;
                const lx = px + ew / 2 - tw / 2 - 6;
                const ly = py - 8;
                ctx.fillStyle = 'rgba(10,8,6,0.78)';
                ctx.fillRect(lx, ly - 12, tw + 12, 16);
                ctx.fillStyle = '#f7f1e6';
                ctx.fillText(label, lx + 6, ly);
            }
        }
        if (!playerDrawn) this.drawNaruto(ctx, cam, s);

        // Cinematic atmosphere (afternoon Konoha / evening)
        this.drawAtmosphere(ctx, cw, ch, night);
    },

    drawAtmosphere(ctx, cw, ch, night) {
        // Warm top light / cool bottom vignette
        const g = ctx.createRadialGradient(cw * 0.5, ch * 0.35, ch * 0.1, cw * 0.5, ch * 0.5, ch * 0.85);
        if (night) {
            g.addColorStop(0, 'rgba(40,60,110,0)');
            g.addColorStop(0.55, 'rgba(12,18,40,0.18)');
            g.addColorStop(1, 'rgba(4,6,16,0.55)');
        } else {
            g.addColorStop(0, 'rgba(255,220,140,0.06)');
            g.addColorStop(0.45, 'rgba(0,0,0,0)');
            g.addColorStop(1, 'rgba(20,35,25,0.42)');
        }
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, cw, ch);

        // Soft letterbox edges
        const edge = ctx.createLinearGradient(0, 0, 0, ch);
        edge.addColorStop(0, night ? 'rgba(8,12,28,0.35)' : 'rgba(255,236,180,0.12)');
        edge.addColorStop(0.12, 'rgba(0,0,0,0)');
        edge.addColorStop(0.88, 'rgba(0,0,0,0)');
        edge.addColorStop(1, 'rgba(0,0,0,0.28)');
        ctx.fillStyle = edge;
        ctx.fillRect(0, 0, cw, ch);

        if (night) {
            ctx.fillStyle = 'rgba(20,10,45,0.22)';
            ctx.fillRect(0, 0, cw, ch);
        }
    },

    /** Always-visible interact props — hourglass, mirror, doors, portals */
    drawLandmark(ctx, e, px, py, ew, eh, s) {
        const cx = px + ew / 2;
        const cy = py + eh * 0.55;
        const hot = e === this.near;
        const pulse = 0.55 + Math.sin(performance.now() / 420) * 0.2;

        // Soft ring so you always know it's interactable
        ctx.save();
        ctx.strokeStyle = e.color || '#c41e3a';
        ctx.globalAlpha = hot ? 0.95 : 0.55 * pulse;
        ctx.lineWidth = hot ? 3 : 2;
        ctx.beginPath();
        ctx.ellipse(cx, py + eh - 2, Math.max(16, ew * 0.55), Math.max(5, 6 * s * 0.4), 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = hot ? 0.28 : 0.12;
        ctx.fillStyle = e.color || '#c41e3a';
        ctx.fill();
        ctx.restore();

        const prop = e.prop || e.id || '';
        ctx.save();
        ctx.translate(cx, cy);
        const sc = Math.max(0.85, Math.min(1.35, s * 0.9));
        ctx.scale(sc, sc);

        if (prop.includes('clock') || e.kind === 'advance' || (e.name || '').toLowerCase().includes('reloj')) {
            // Hourglass of Destiny
            ctx.fillStyle = '#5d4037';
            ctx.fillRect(-14, -22, 28, 4);
            ctx.fillRect(-14, 18, 28, 4);
            ctx.strokeStyle = '#c9a227';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-10, -18); ctx.lineTo(0, 0); ctx.lineTo(-10, 18);
            ctx.moveTo(10, -18); ctx.lineTo(0, 0); ctx.lineTo(10, 18);
            ctx.stroke();
            ctx.fillStyle = 'rgba(244, 208, 63, 0.85)';
            ctx.beginPath();
            ctx.moveTo(-7, -16); ctx.lineTo(7, -16); ctx.lineTo(0, -2); ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-4, 16); ctx.lineTo(4, 16); ctx.lineTo(0, 4); ctx.closePath();
            ctx.fill();
        } else if (prop.includes('chiki') || prop.includes('mirror') || (e.name || '').toLowerCase().includes('espejo')) {
            // Standing mirror
            ctx.fillStyle = '#4a3728';
            ctx.fillRect(-3, 10, 6, 14);
            ctx.fillRect(-12, 22, 24, 4);
            ctx.strokeStyle = '#c9a227';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(0, -2, 12, 16, 0, 0, Math.PI * 2);
            ctx.stroke();
            const g = ctx.createLinearGradient(-10, -14, 10, 12);
            g.addColorStop(0, '#a8d5e5');
            g.addColorStop(0.5, '#e8f4f8');
            g.addColorStop(1, '#6bb3c7');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.ellipse(0, -2, 10, 14, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (e.kind === 'warp') {
            // Torii / door marker
            ctx.fillStyle = e.color || '#27ae60';
            ctx.fillRect(-16, -8, 6, 28);
            ctx.fillRect(10, -8, 6, 28);
            ctx.fillRect(-18, -14, 36, 8);
            ctx.fillRect(-14, -20, 28, 6);
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.fillRect(-8, 0, 16, 18);
        } else if (e.kind === 'mission') {
            // Glowing scroll / seal
            ctx.fillStyle = '#f7f1e6';
            ctx.fillRect(-12, -14, 24, 28);
            ctx.strokeStyle = e.color || '#c41e3a';
            ctx.lineWidth = 2;
            ctx.strokeRect(-12, -14, 24, 28);
            ctx.beginPath();
            ctx.arc(0, 0, 7, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = e.color || '#c41e3a';
            ctx.font = 'bold 10px sans-serif';
            ctx.fillText('忍', -5, 4);
        } else if (e.kind === 'train') {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-4, -18, 8, 36);
            ctx.fillStyle = '#a0522d';
            ctx.fillRect(-10, -18, 20, 6);
        } else {
            // Generic sparkle post
            ctx.fillStyle = e.color || '#c41e3a';
            ctx.beginPath();
            ctx.moveTo(0, -18); ctx.lineTo(5, -4); ctx.lineTo(16, -4);
            ctx.lineTo(7, 4); ctx.lineTo(10, 16); ctx.lineTo(0, 8);
            ctx.lineTo(-10, 16); ctx.lineTo(-7, 4); ctx.lineTo(-16, -4);
            ctx.lineTo(-5, -4); ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    },

    drawNpc(ctx, e, px, py, scale) {
        const id = e.sprite || 'villager';
        const footX = px + (e.w * scale) / 2;
        const footY = py + e.h * scale;
        const phase = performance.now() / 1000;
        if (typeof SpriteActors !== 'undefined') {
            SpriteActors.drawAtFeet(ctx, id, e.facing || 'down', 0, false, footX, footY, scale, 1, phase, false);
        } else if (typeof PixelActors !== 'undefined') {
            const canvas = PixelActors.get(id, e.facing || 'down', 0, false, { idlePhase: phase, seed: e.idleSeed || 0 });
            PixelActors.blit(ctx, canvas, px - 4, py - 36, Math.max(1, Math.round(scale * 1.15)));
        }
    },

    drawNaruto(ctx, cam, s) {
        const ppx = this.player.x * s - cam.x;
        const ppy = this.player.y * s - cam.y;
        const facing = this.player.facing;
        const frame = this.player.frame;
        const moving = this.player.moving && (Math.abs(this.player.vx) + Math.abs(this.player.vy) > 12);
        const running = !!(moving && this.player.running);
        const footX = ppx + (this.player.w * s) / 2;
        const footY = ppy + this.player.h * s;
        const idlePhase = performance.now() / 1000;
        if (typeof SpriteActors !== 'undefined') {
            const tint = (typeof OutfitData !== 'undefined') ? OutfitData.current().worldTint : null;
            SpriteActors.drawAtFeet(ctx, 'naruto', facing, frame, moving, footX, footY, s, 1, idlePhase, running, tint);
        } else if (typeof PixelActors !== 'undefined') {
            const canvas = PixelActors.get('naruto', facing, frame, moving, { idlePhase, running, seed: 0 });
            PixelActors.blit(ctx, canvas, ppx - 8, ppy - 40, Math.max(1, s * 1.2));
        }
    },

    drawMinimap() {
        if (!this.miniCtx || !this.miniCanvas) return;
        const ctx = this.miniCtx;
        const S = this.miniCanvas.width;
        ctx.clearRect(0, 0, S, S);
        ctx.save();
        ctx.beginPath();
        ctx.arc(S / 2, S / 2, S / 2 - 2, 0, Math.PI * 2);
        ctx.clip();

        const bg = this.images[this.map?.bg];
        if (bg) ctx.drawImage(bg, 0, 0, S, S);
        else {
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(0, 0, S, S);
        }

        for (const e of this.entities) {
            const mx = (e.x / this.WORLD_W) * S;
            const my = (e.y / this.WORLD_H) * S;
            ctx.fillStyle = e.kind === 'warp' ? '#2ecc71' : (e.color || '#c41e3a');
            ctx.beginPath();
            ctx.arc(mx, my, e.kind === 'bond' ? 3.5 : 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        const px = (this.player.x / this.WORLD_W) * S;
        const py = (this.player.y / this.WORLD_H) * S;
        ctx.fillStyle = '#c41e3a';
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        ctx.strokeStyle = '#c41e3a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(S / 2, S / 2, S / 2 - 2, 0, Math.PI * 2);
        ctx.stroke();
    }
};
