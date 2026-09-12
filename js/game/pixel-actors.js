/**
 * Crisp procedural pixel actors
 * Idle = real fidgets (headband, scratch, stretch…) via IdleDirector — never float-bob
 */
const PixelActors = {
    SIZE: 48,
    cache: {},

    blit(ctx, canvas, x, y, scale = 2) {
        if (!canvas) return;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, Math.round(x), Math.round(y), canvas.width * scale, canvas.height * scale);
    },

    key(id, facing, frame, moving, running, action, aFrame) {
        return `${id}|${facing}|${moving ? 'm' + frame : 'i' + action + aFrame}|${running ? 'R' : ''}|v6`;
    },

    get(id, facing = 'down', frame = 0, moving = false, opts = {}) {
        const running = !!opts.running;
        let action = 'rest';
        let aFrame = 0;
        if (!moving && !running && typeof IdleDirector !== 'undefined') {
            const s = IdleDirector.sample(id, opts.idlePhase || 0, opts.seed || 0);
            action = opts.idleAction || s.action;
            aFrame = opts.idleFrame != null ? opts.idleFrame : s.frame;
        } else if (!moving && !running) {
            aFrame = Math.floor((opts.idlePhase || 0) * 2) % 2;
        }
        const f = (moving || running) ? (frame % 4) : 0;
        const k = this.key(id, facing, f, moving || running, running, action, aFrame);
        if (this.cache[k]) return this.cache[k];
        const c = document.createElement('canvas');
        c.width = this.SIZE;
        c.height = this.SIZE + 8;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        this.paint(ctx, id, facing, f, moving || running, running, action, aFrame);
        this.cache[k] = c;
        return c;
    },

    px(ctx, x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
    },

    outlineRect(ctx, x, y, w, h, fill, line = '#1a1208') {
        this.px(ctx, x, y, w, h, line);
        this.px(ctx, x + 1, y + 1, w - 2, h - 2, fill);
    },

    paint(ctx, id, facing, frame, moving, running, action, aFrame) {
        const recipes = {
            naruto: {
                hair: '#f4c430', hairDark: '#d4a017', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#e67e22', outfitDark: '#1a1a2e', accent: '#1a1a2e', accentDark: '#0d0d15',
                eyes: '#2e86c1', whiskers: true, headband: true
            },
            sakura: {
                hair: '#ff69b4', hairDark: '#c71585', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#1e8449', outfitDark: '#145a32', accent: '#f5b7b1', accentDark: '#e5989b',
                eyes: '#27ae60', headband: true, bangs: 'sakura'
            },
            sasuke: {
                hair: '#1c2833', hairDark: '#0b1520', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#2c3e50', outfitDark: '#1a252f', accent: '#5dade2', accentDark: '#2874a6',
                eyes: '#1a1a1a', headband: true, bangs: 'sasuke'
            },
            kakashi: {
                hair: '#bdc3c7', hairDark: '#7f8c8d', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#566573', outfitDark: '#2c3e50', accent: '#27ae60', accentDark: '#1e8449',
                eyes: '#2e86c1', headband: true, mask: true, bangs: 'kakashi'
            },
            teuchi: {
                hair: '#5d4037', hairDark: '#3e2723', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#ecf0f1', outfitDark: '#bdc3c7', accent: '#e74c3c', accentDark: '#c0392b',
                eyes: '#1a1a1a', apron: true
            },
            villager: {
                hair: '#6d4c41', hairDark: '#4e342e', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#7f8c8d', outfitDark: '#566573', accent: '#3498db', accentDark: '#2471a3',
                eyes: '#1a1a1a'
            },
            kunoichi: {
                hair: '#2c3e50', hairDark: '#1a252f', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#5dade2', outfitDark: '#2874a6', accent: '#f4d03f', accentDark: '#d4ac0d',
                eyes: '#1a1a1a', headband: true
            },
            gaara: {
                hair: '#c0392b', hairDark: '#922b21', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#1a1a1a', outfitDark: '#0d0d0d', accent: '#d5d8dc', accentDark: '#aab7b8',
                eyes: '#1a1a1a', gourd: true, kanji: true
            },
            chiki: {
                hair: '#8e44ad', hairDark: '#6c3483', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#c41e3a', outfitDark: '#922b21', accent: '#f7f1e6', accentDark: '#d5d0c5',
                eyes: '#c41e3a'
            },
            ayame: {
                hair: '#5d4037', hairDark: '#3e2723', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#fff8e7', outfitDark: '#e8dcc8', accent: '#c0392b', accentDark: '#922b21',
                eyes: '#1a1a1a', apron: true
            },
            nami: {
                hair: '#e67e22', hairDark: '#ca6f1e', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#f39c12', outfitDark: '#d68910', accent: '#ffffff', accentDark: '#d5d8dc',
                eyes: '#2e86c1'
            },
            orihime: {
                hair: '#f5b041', hairDark: '#d68910', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#f5b7b1', outfitDark: '#e5989b', accent: '#fce4ec', accentDark: '#f8bbd0',
                eyes: '#27ae60'
            },
            guy: {
                hair: '#1a1a1a', hairDark: '#0d0d0d', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#1a5276', outfitDark: '#154360', accent: '#27ae60', accentDark: '#1e8449',
                eyes: '#1a1a1a', headband: true
            },
            iruka: {
                hair: '#5d4037', hairDark: '#3e2723', skin: '#f5c79a', skinShade: '#e0a878',
                outfit: '#1e8449', outfitDark: '#145a32', accent: '#f4d03f', accentDark: '#d4ac0d',
                eyes: '#1a1a1a', headband: true, scar: true
            }
        };
        const pal = recipes[id] || recipes.villager;
        this.drawChibi(ctx, pal, facing, frame, moving, running, action, aFrame);
    },

    drawChibi(ctx, pal, facing, frame, moving, running, action, aFrame) {
        const cycle = [0, 2, 0, -2];
        const leg = moving ? cycle[frame % 4] : 0;
        // NO idle float bob — feet planted
        const bob = moving ? (frame % 2 === 0 ? 0 : -2) : 0;
        let arm = moving ? cycle[(frame + 2) % 4] : 0;

        const cx = 24;
        const lean = running ? (facing === 'left' ? -1 : facing === 'right' ? 1 : 0) : 0;
        const lookLean = (!moving && !running && action === 'look')
            ? (aFrame < 3 ? -1 : 1) : 0;
        const baseY = 6 + bob;
        const L = lean + lookLean;

        this.px(ctx, cx - 9 + L, 50, 18, 4, 'rgba(0,0,0,0.28)');

        const back = facing === 'up';
        const flip = facing === 'left';
        const legY = baseY + 34;
        const legColor = pal.outfitDark;
        const legAmp = running ? 3 : 1;

        if (!back) {
            this.outlineRect(ctx, cx - 8 + L + (flip ? -leg : leg) * legAmp, legY, 6, 10 - Math.abs(leg), legColor);
            this.outlineRect(ctx, cx + 2 + L + (flip ? leg : -leg) * legAmp, legY, 6, 10 - Math.abs(leg), legColor);
            this.px(ctx, cx - 8 + L + (flip ? -leg : leg) * legAmp, legY + 8, 6, 3, '#1a1a1a');
            this.px(ctx, cx + 2 + L + (flip ? leg : -leg) * legAmp, legY + 8, 6, 3, '#1a1a1a');
        } else {
            this.outlineRect(ctx, cx - 8, legY, 6, 10, legColor);
            this.outlineRect(ctx, cx + 2, legY, 6, 10, legColor);
            this.px(ctx, cx - 8, legY + 8, 6, 3, '#1a1a1a');
            this.px(ctx, cx + 2, legY + 8, 6, 3, '#1a1a1a');
        }

        const bodyY = baseY + 20;
        this.outlineRect(ctx, cx - 10 + L, bodyY, 20, 15, pal.outfit);
        this.px(ctx, cx - 8 + L, bodyY + 2, 16, 3, pal.outfitDark);
        this.px(ctx, cx - 6 + L, bodyY, 12, 4, pal.accent);
        this.px(ctx, cx - 5 + L, bodyY + 1, 10, 2, pal.accentDark);

        if (pal.apron) {
            this.px(ctx, cx - 8 + L, bodyY + 4, 16, 10, '#f7f1e6');
            this.px(ctx, cx - 1 + L, bodyY + 4, 2, 10, pal.accent);
        }
        if (pal.gourd) {
            this.outlineRect(ctx, cx + 8 + L, bodyY - 2, 10, 14, '#c4a35a');
            this.px(ctx, cx + 10 + L, bodyY, 6, 8, '#a67930');
        }

        const armY = bodyY + 2;
        const front = facing === 'down' || facing === 'up';

        if (running) {
            if (front) {
                this.outlineRect(ctx, cx - 16, armY - 2, 5, 12, pal.skin);
                this.outlineRect(ctx, cx + 11, armY - 2, 5, 12, pal.skin);
                this.px(ctx, cx - 16, armY - 2, 5, 3, pal.outfit);
                this.px(ctx, cx + 11, armY - 2, 5, 3, pal.outfit);
            } else if (facing === 'right') {
                this.outlineRect(ctx, cx - 16 + L, armY, 10, 5, pal.skin);
                this.outlineRect(ctx, cx - 18 + L, armY + 4, 8, 4, pal.skin);
            } else {
                this.outlineRect(ctx, cx + 6 + L, armY, 10, 5, pal.skin);
                this.outlineRect(ctx, cx + 10 + L, armY + 4, 8, 4, pal.skin);
            }
        } else if (!moving && action && action !== 'rest') {
            this.drawIdleArms(ctx, pal, facing, action, aFrame, cx + L, armY, bodyY, headYBase(baseY));
        } else if (front) {
            this.outlineRect(ctx, cx - 14 + L, armY + arm, 5, 10, pal.skin);
            this.outlineRect(ctx, cx + 9 + L, armY - arm, 5, 10, pal.skin);
            this.px(ctx, cx - 14 + L, armY + arm, 5, 3, pal.outfit);
            this.px(ctx, cx + 9 + L, armY - arm, 5, 3, pal.outfit);
        } else if (facing === 'right') {
            this.outlineRect(ctx, cx + 9 + L, armY + arm, 6, 9, pal.skin);
            this.outlineRect(ctx, cx - 13 + L, armY - arm, 5, 9, pal.skin);
        } else {
            this.outlineRect(ctx, cx - 15 + L, armY + arm, 6, 9, pal.skin);
            this.outlineRect(ctx, cx + 8 + L, armY - arm, 5, 9, pal.skin);
        }

        const headY = baseY + 2;
        this.px(ctx, cx - 3 + L, bodyY - 2, 6, 4, pal.skinShade);
        this.drawHead(ctx, cx + L, headY + 11, pal, facing);
        this.drawHair(ctx, cx + L, headY + 11, pal, facing);

        // Headband — may be tugged during headband action
        const hbY = (action === 'headband' && aFrame >= 2 && aFrame <= 4) ? headY + 5 : headY + 6;
        if (pal.headband && facing !== 'up') {
            this.px(ctx, cx - 10 + L, hbY, 20, 4, pal.accent);
            this.px(ctx, cx - 9 + L, hbY + 1, 18, 2, '#d5d8dc');
            this.px(ctx, cx - 2 + L, hbY + 1, 4, 2, '#7f8c8d');
        } else if (pal.headband && facing === 'up') {
            this.px(ctx, cx - 10 + L, hbY, 20, 4, pal.accent);
        }

        // Props drawn after head (book, wipe cloth)
        if (!moving && !running) {
            this.drawIdleProps(ctx, pal, facing, action, aFrame, cx + L, headY, armY);
        }

        if (facing !== 'up') {
            const blink = !moving && !running && action === 'rest' && aFrame === 1;
            if (facing === 'down') {
                if (blink) {
                    this.px(ctx, cx - 5 + L, headY + 13, 3, 1, '#1a1a1a');
                    this.px(ctx, cx + 2 + L, headY + 13, 3, 1, '#1a1a1a');
                } else {
                    this.px(ctx, cx - 5 + L, headY + 12, 3, 3, '#1a1a1a');
                    this.px(ctx, cx + 2 + L, headY + 12, 3, 3, '#1a1a1a');
                    this.px(ctx, cx - 4 + L, headY + 12, 1, 1, '#fff');
                    this.px(ctx, cx + 3 + L, headY + 12, 1, 1, '#fff');
                    this.px(ctx, cx - 5 + L, headY + 13, 3, 1, pal.eyes);
                    this.px(ctx, cx + 2 + L, headY + 13, 3, 1, pal.eyes);
                }
            } else if (facing === 'right') {
                if (!blink) {
                    this.px(ctx, cx + 2 + L, headY + 12, 3, 3, '#1a1a1a');
                    this.px(ctx, cx + 3 + L, headY + 12, 1, 1, '#fff');
                } else this.px(ctx, cx + 2 + L, headY + 13, 3, 1, '#1a1a1a');
            } else if (facing === 'left') {
                if (!blink) {
                    this.px(ctx, cx - 5 + L, headY + 12, 3, 3, '#1a1a1a');
                    this.px(ctx, cx - 4 + L, headY + 12, 1, 1, '#fff');
                } else this.px(ctx, cx - 5 + L, headY + 13, 3, 1, '#1a1a1a');
            }
            if (pal.whiskers && facing === 'down') {
                this.px(ctx, cx - 8 + L, headY + 14, 3, 1, '#c0392b');
                this.px(ctx, cx - 8 + L, headY + 16, 3, 1, '#c0392b');
                this.px(ctx, cx + 5 + L, headY + 14, 3, 1, '#c0392b');
                this.px(ctx, cx + 5 + L, headY + 16, 3, 1, '#c0392b');
            }
            if (pal.mask) {
                this.px(ctx, cx - 8 + L, headY + 15, 16, 6, '#ecf0f1');
                this.px(ctx, cx - 7 + L, headY + 16, 14, 4, '#d5d8dc');
            }
            if (pal.kanji) {
                this.px(ctx, cx - 2 + L, headY + 8, 4, 4, '#1a1a1a');
                this.px(ctx, cx - 1 + L, headY + 9, 2, 2, '#c0392b');
            }
            if (pal.scar && facing === 'down') {
                this.px(ctx, cx - 6 + L, headY + 11, 5, 1, '#c0392b');
            }
            if (!pal.mask && facing === 'down' && !blink) {
                this.px(ctx, cx - 2 + L, headY + 18, 4, 1, '#c0392b');
            }
        }
    },

    /** Fidget arm poses — the meat of a real idle */
    drawIdleArms(ctx, pal, facing, action, f, cx, armY, bodyY, headY) {
        const front = facing === 'down' || facing === 'up';
        // Default left/right arm at sides first for actions that only move one arm
        const drawSideArms = () => {
            if (front) {
                this.outlineRect(ctx, cx - 14, armY, 5, 10, pal.skin);
                this.outlineRect(ctx, cx + 9, armY, 5, 10, pal.skin);
                this.px(ctx, cx - 14, armY, 5, 3, pal.outfit);
                this.px(ctx, cx + 9, armY, 5, 3, pal.outfit);
            } else if (facing === 'right') {
                this.outlineRect(ctx, cx + 9, armY, 6, 9, pal.skin);
                this.outlineRect(ctx, cx - 13, armY, 5, 9, pal.skin);
            } else {
                this.outlineRect(ctx, cx - 15, armY, 6, 9, pal.skin);
                this.outlineRect(ctx, cx + 8, armY, 5, 9, pal.skin);
            }
        };

        if (action === 'headband') {
            // Raise right hand to forehead protector and tug
            if (front) {
                this.outlineRect(ctx, cx - 14, armY, 5, 10, pal.skin);
                this.px(ctx, cx - 14, armY, 5, 3, pal.outfit);
                const hy = headY + 4 - Math.min(f, 3);
                this.outlineRect(ctx, cx + 4, hy, 6, 8, pal.skin);
                this.px(ctx, cx + 5, hy + 6, 4, 3, pal.skinShade);
            } else {
                drawSideArms();
                this.outlineRect(ctx, cx + (facing === 'right' ? 2 : -8), headY + 2, 6, 7, pal.skin);
            }
            return;
        }

        if (action === 'scratch') {
            // Hand behind / on top of head
            if (front) {
                this.outlineRect(ctx, cx - 14, armY, 5, 10, pal.skin);
                this.px(ctx, cx - 14, armY, 5, 3, pal.outfit);
                const sy = headY - 2 - (f % 2);
                this.outlineRect(ctx, cx + 2, sy, 6, 8, pal.skin);
                this.px(ctx, cx + 3, sy + 1, 4, 2, pal.skinShade);
            } else {
                drawSideArms();
                this.outlineRect(ctx, cx - 2, headY - 1, 6, 7, pal.skin);
            }
            return;
        }

        if (action === 'stretch') {
            // Both arms up
            const up = 4 + Math.min(f, 2);
            this.outlineRect(ctx, cx - 14, armY - up, 5, 12, pal.skin);
            this.outlineRect(ctx, cx + 9, armY - up, 5, 12, pal.skin);
            this.px(ctx, cx - 14, armY - up + 8, 5, 3, pal.outfit);
            this.px(ctx, cx + 9, armY - up + 8, 5, 3, pal.outfit);
            return;
        }

        if (action === 'hair') {
            if (front) {
                this.outlineRect(ctx, cx + 9, armY, 5, 10, pal.skin);
                this.px(ctx, cx + 9, armY, 5, 3, pal.outfit);
                this.outlineRect(ctx, cx - 8, headY + 2 - (f % 2), 6, 7, pal.skin);
            } else drawSideArms();
            return;
        }

        if (action === 'hips' || action === 'arms') {
            // Hands on hips / arms crossed
            if (front) {
                this.outlineRect(ctx, cx - 16, bodyY + 4, 6, 6, pal.skin);
                this.outlineRect(ctx, cx + 10, bodyY + 4, 6, 6, pal.skin);
                if (action === 'arms') {
                    this.outlineRect(ctx, cx - 8, bodyY + 4, 16, 5, pal.skin);
                }
            } else drawSideArms();
            return;
        }

        if (action === 'wave') {
            if (front) {
                this.outlineRect(ctx, cx - 14, armY, 5, 10, pal.skin);
                this.px(ctx, cx - 14, armY, 5, 3, pal.outfit);
                const wy = armY - 6 - (f % 2);
                this.outlineRect(ctx, cx + 10, wy, 5, 10, pal.skin);
            } else drawSideArms();
            return;
        }

        if (action === 'book' || action === 'wipe') {
            drawSideArms();
            return;
        }

        drawSideArms();
    },

    drawIdleProps(ctx, pal, facing, action, f, cx, headY, armY) {
        if (action === 'book' && facing !== 'up') {
            // Icha Icha orange book
            const bx = cx + (facing === 'left' ? -14 : 6);
            const by = armY + 2;
            this.outlineRect(ctx, bx, by, 8, 10, '#e67e22');
            this.px(ctx, bx + 1, by + 1, 6, 2, '#f5b041');
            this.px(ctx, bx + 2, by + 4, 4, 1, '#922b21');
        }
        if (action === 'wipe' && facing !== 'up') {
            const bx = cx + 8;
            this.px(ctx, bx, armY + 2, 6, 4, '#ecf0f1');
            this.px(ctx, bx + 1, armY + 3, 4, 2, '#bdc3c7');
        }
    },

    drawHead(ctx, cx, cy, pal, facing) {
        const top = cy - 11;
        this.px(ctx, cx - 9, top + 3, 18, 16, '#1a1208');
        this.px(ctx, cx - 8, top + 4, 16, 14, pal.skin);
        this.px(ctx, cx - 7, top + 5, 14, 2, pal.skinShade);
        this.px(ctx, cx - 6, top + 14, 12, 3, pal.skinShade);
    },

    drawHair(ctx, cx, cy, pal, facing) {
        const top = cy - 14;
        this.px(ctx, cx - 10, top + 4, 20, 8, pal.hair);
        this.px(ctx, cx - 9, top + 2, 18, 4, pal.hair);
        const spikes = [
            [-8, 0, 5, 6], [-3, -2, 5, 7], [2, -1, 5, 6], [7, 1, 4, 5],
            [-11, 5, 4, 6], [9, 5, 4, 6]
        ];
        for (const [ox, oy, w, h] of spikes) {
            this.px(ctx, cx + ox, top + oy + 2, w, h, pal.hair);
            this.px(ctx, cx + ox + 1, top + oy + 3, Math.max(1, w - 2), 2, pal.hairDark);
        }
        if (pal.bangs === 'sakura') {
            this.px(ctx, cx - 7, top + 8, 5, 6, pal.hair);
            this.px(ctx, cx - 1, top + 8, 4, 5, pal.hair);
            this.px(ctx, cx + 4, top + 8, 5, 6, pal.hair);
        }
        if (pal.bangs === 'sasuke') {
            this.px(ctx, cx - 2, top + 6, 3, 10, pal.hair);
            this.px(ctx, cx + 2, top + 7, 3, 8, pal.hair);
            this.px(ctx, cx - 8, top + 10, 4, 8, pal.hair);
        }
        if (pal.bangs === 'kakashi') {
            this.px(ctx, cx - 4, top + 6, 3, 12, pal.hair);
            this.px(ctx, cx - 1, top + 5, 3, 10, pal.hair);
            this.px(ctx, cx + 3, top + 7, 3, 9, pal.hair);
        }
        if (facing === 'up') {
            this.px(ctx, cx - 11, top + 6, 22, 12, pal.hair);
            this.px(ctx, cx - 10, top + 4, 20, 4, pal.hairDark);
        }
    },

    warm(ids = ['naruto', 'sakura', 'sasuke', 'kakashi', 'teuchi', 'villager', 'kunoichi', 'gaara', 'chiki', 'ayame', 'nami', 'orihime', 'guy', 'iruka']) {
        const dirs = ['down', 'left', 'right', 'up'];
        const acts = ['rest', 'headband', 'scratch', 'stretch', 'look', 'book'];
        for (const id of ids) {
            for (const d of dirs) {
                for (const a of acts) {
                    this.get(id, d, 0, false, { idleAction: a, idleFrame: 2, idlePhase: 0 });
                }
                for (let f = 0; f < 4; f++) {
                    this.get(id, d, f, true, {});
                    if (id === 'naruto') this.get(id, d, f, true, { running: true });
                }
            }
        }
    }
};

function headYBase(baseY) {
    return baseY + 2;
}
