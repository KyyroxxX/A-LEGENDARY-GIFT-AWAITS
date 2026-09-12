/** Hierarchical 2D battle rig with atomic full-sprite fallback. */
const BattleRig = {
    cache: new Map(),
    failures: new Set(),
    running: new WeakMap(),
    idleLoops: new WeakMap(),

    entry(id) {
        return (typeof BattleRigData !== 'undefined' && BattleRigData.characters?.[id]) || null;
    },

    hasRig(id, form = 'base') {
        const entry = this.entry(id);
        return !!entry?.forms?.[form];
    },

    normalizeForm(form) {
        return !form || form === 'idle' ? 'base' : form;
    },

    partStyle(url) {
        if (!url) return '';
        if (String(url).includes('url(')) return `background-image:${url}`;
        return `background-image:url('${new URL(url, document.baseURI).href}')`;
    },

    markup(id, url, requestedForm = 'base') {
        const entry = this.entry(id);
        const formName = this.normalizeForm(requestedForm);
        const form = entry?.forms?.[formName] || entry?.forms?.base;
        const isCss = String(url || '').includes('url(');
        const styleBg = isCss ? url : `url('${url}')`;
        const isStagedArt = String(url || '').includes('user_refs/_staged');
        if (isStagedArt) {
            return `<div class="p5-sprite p5-staged-sprite" data-sprite="${id}" data-staged-form="${formName}" style="background-image:${styleBg}"></div>`;
        }
        if (!entry || !form) {
            return `<div class="p5-sprite" data-sprite="${id}" style="background-image:${styleBg}"></div>`;
        }
        const absoluteUrl = isCss
            ? null
            : new URL(url, document.baseURI).href;
        const fighterImage = isCss ? styleBg.split(',')[0].trim() : `url('${absoluteUrl}')`;
        const joint = name => {
            const point = form.joints[name] || [90, 140];
            return `${point[0]}px ${point[1]}px`;
        };
        const part = name => `<i class="p5-rig-part part-${name}" data-part="${name}" style="${this.partStyle(form.parts[name])}"></i>`;
        return `
            <div class="p5-sprite p5-rig rig-${entry.profile}" data-sprite="${id}" data-rig-form="${formName}"
                 style="--fighter-image:${fighterImage};--rig-idle:${entry.idleMs}ms;background-image:${styleBg}">
                <i class="p5-rig-fallback" aria-hidden="true" style="background-image:${styleBg}"></i>
                <span class="p5-rig-bones" aria-hidden="true">
                    <i class="p5-rig-bone bone-root" data-bone="root" style="transform-origin:${joint('root')}">
                        ${part('rear')}
                        <i class="p5-rig-bone bone-pelvis" data-bone="pelvis" style="transform-origin:${joint('pelvis')}">
                            <i class="p5-rig-bone bone-legL" data-bone="legL" style="transform-origin:${joint('pelvis')}">${part('legL')}</i>
                            <i class="p5-rig-bone bone-legR" data-bone="legR" style="transform-origin:${joint('pelvis')}">${part('legR')}</i>
                            <i class="p5-rig-bone bone-torso" data-bone="torso" style="transform-origin:${joint('pelvis')}">
                                ${part('torso')}
                                <i class="p5-rig-bone bone-armL" data-bone="armL" style="transform-origin:${joint('shoulderL')}">${part('armL')}</i>
                                <i class="p5-rig-bone bone-armR" data-bone="armR" style="transform-origin:${joint('shoulderR')}">${part('armR')}</i>
                                <i class="p5-rig-bone bone-head" data-bone="head" style="transform-origin:${joint('torso')}">${part('head')}</i>
                            </i>
                        </i>
                    </i>
                </span>
                <i class="p5-rig-swap" aria-hidden="true"></i>
            </div>
        `;
    },

    load(url) {
        if (!url) return Promise.reject(new Error('empty sprite URL'));
        if (this.cache.has(url)) return this.cache.get(url);
        const promise = new Promise((resolve, reject) => {
            const image = new Image();
            image.decoding = 'async';
            image.onload = async () => {
                try {
                    if (image.decode) await image.decode();
                } catch (_) { /* decoded enough for onload */ }
                resolve(url);
            };
            image.onerror = () => reject(new Error(`sprite failed: ${url}`));
            image.src = url;
        }).catch(error => {
            this.failures.add(url);
            this.cache.delete(url);
            throw error;
        });
        this.cache.set(url, promise);
        return promise;
    },

    async setImage(element, url) {
        if (!element || !url) return false;
        const token = String((Number(element.dataset.swapToken || 0) + 1));
        element.dataset.swapToken = token;
        const raw = String(url);
        // Full CSS background list from BattleUI.spriteBg (staged + anim fallback)
        if (raw.includes('url(')) {
            const urls = [...raw.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1]);
            await Promise.allSettled(urls.map((u) => this.load(u).catch(() => null)));
            if (!element.isConnected || element.dataset.swapToken !== token) return false;
            element.style.backgroundImage = raw;
            element.style.setProperty('--fighter-image', raw.split(',')[0].trim());
            element.dataset.lastGoodSprite = urls[0] || raw;
            element.classList.add('rig-ready');
            element.classList.remove('sprite-load-failed');
            return true;
        }
        try {
            await this.load(url);
            if (!element.isConnected || element.dataset.swapToken !== token) return false;
            const absoluteUrl = new URL(url, document.baseURI).href;
            element.style.setProperty('--fighter-image', `url('${absoluteUrl}')`);
            element.style.backgroundImage = `url('${absoluteUrl}')`;
            element.dataset.lastGoodSprite = url;
            element.classList.add('rig-ready');
            element.classList.remove('sprite-load-failed');
            return true;
        } catch (_) {
            // Deliberately keep the last decoded frame visible.
            element.classList.add('sprite-load-failed');
            return false;
        }
    },

    preload(urls) {
        const flat = [];
        (urls || []).filter(Boolean).forEach((u) => {
            const s = String(u);
            if (s.includes('url(')) {
                [...s.matchAll(/url\('([^']+)'\)/g)].forEach((m) => flat.push(m[1]));
            } else {
                flat.push(s);
            }
        });
        return Promise.allSettled([...new Set(flat)].map(url => this.load(url)));
    },

    preloadFighter(id, resolver) {
        const kinds = ['idle', 'attack0', 'attack1', 'attack2', 'attack', 'transform'];
        if (id === 'naruto') kinds.push('transform_1', 'transform_2', 'transform_3', 'transform_4');
        // Prefer CSS bg lists when resolver returns spriteBg via BattleUI
        const urls = kinds.flatMap((kind) => {
            const u = resolver(id, kind);
            return u ? [u] : [];
        });
        return this.preload(urls);
    },

    async hydrate(element) {
        if (!element?.classList.contains('p5-rig')) return false;
        const entry = this.entry(element.dataset.sprite);
        const form = entry?.forms?.[element.dataset.rigForm] || entry?.forms?.base;
        if (!form) return false;
        const results = await this.preload(Object.values(form.parts));
        const valid = results.every(result => result.status === 'fulfilled');
        if (valid && element.isConnected) element.classList.add('parts-ready');
        return valid;
    },

    mountAll(scope) {
        if (!scope) return;
        scope.querySelectorAll('.p5-rig').forEach(element => this.hydrate(element));
    },

    cancel(element) {
        this.stopIdle(element);
        const animations = this.running.get(element) || [];
        animations.forEach(animation => {
            try { animation.cancel(); } catch (_) { /* */ }
        });
        this.running.delete(element);
        element?.classList.remove('rig-busy');
        element?.querySelectorAll('.p5-rig-bone').forEach(bone => {
            bone.style.transform = '';
        });
    },

    stopIdle(element) {
        const loops = this.idleLoops.get(element);
        if (!loops) return;
        loops.forEach((animation) => {
            try { animation.cancel(); } catch (_) { /* */ }
        });
        this.idleLoops.delete(element);
        element?.querySelectorAll('.p5-rig-bone').forEach(bone => {
            bone.style.transform = '';
        });
    },

    startIdle(element) {
        // Bones are hidden (opacity 0); CSS softRigBob on .p5-rig-fallback is enough.
        // Extra Web Animations on invisible bones fought the fallback bob and flickered.
        if (!element?.classList.contains('p5-rig')) return;
        this.stopIdle(element);
    },

    animateBone(element, name, frames, options) {
        const bone = element?.querySelector(`[data-bone="${name}"]`);
        if (!bone || typeof bone.animate !== 'function') return null;
        return bone.animate(frames, {
            fill: 'both',
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            ...options
        });
    },

    playPose(element, tracks, duration = 520, easing = 'cubic-bezier(0.22, 1, 0.36, 1)') {
        if (!element) return Promise.resolve();
        this.cancel(element);
        element.classList.add('rig-busy');
        const animations = Object.entries(tracks || {}).map(([bone, frames]) => (
            this.animateBone(element, bone, frames, { duration, easing })
        )).filter(Boolean);
        const fallback = element.querySelector('.p5-rig-fallback');
        if (fallback && tracks?.root && typeof fallback.animate === 'function') {
            const soft = fallback.animate(tracks.root, { duration, easing, fill: 'both' });
            if (soft) animations.push(soft);
        }
        this.running.set(element, animations);
        return Promise.allSettled(animations.map(animation => animation.finished))
            .finally(() => {
                if (this.running.get(element) !== animations) return;
                animations.forEach(animation => animation.cancel());
                this.running.delete(element);
                element.classList.remove('rig-busy');
                if (fallback) fallback.style.transform = '';
            });
    },

    pose(element, pose, duration = 520) {
        if (!element) return;
        const poses = {
            anticipate: {
                root: [
                    { transform: 'translate3d(0,0,0)' },
                    { transform: 'translate3d(-3px,1px,0) rotate(-1deg)', offset: 0.45 },
                    { transform: 'translate3d(-5px,2px,0) rotate(-2deg)' }
                ],
                torso: [
                    { transform: 'rotate(0deg)' },
                    { transform: 'rotate(-2deg)', offset: 0.5 },
                    { transform: 'rotate(-4deg)' }
                ],
                armR: [
                    { transform: 'rotate(0deg)' },
                    { transform: 'rotate(-5deg)', offset: 0.4 },
                    { transform: 'rotate(-10deg)' }
                ]
            },
            strike: {
                root: [
                    { transform: 'translate3d(-4px,2px,0)' },
                    { transform: 'translate3d(12px,-2px,0)', offset: 0.22 },
                    { transform: 'translate3d(42px,-8px,0)', offset: 0.48 },
                    { transform: 'translate3d(18px,-3px,0)', offset: 0.72 },
                    { transform: 'translate3d(0,0,0)' }
                ],
                torso: [
                    { transform: 'rotate(-3deg)' },
                    { transform: 'rotate(2deg)', offset: 0.35 },
                    { transform: 'rotate(6deg)', offset: 0.55 },
                    { transform: 'rotate(0deg)' }
                ],
                armR: [
                    { transform: 'rotate(-12deg)' },
                    { transform: 'rotate(8deg)', offset: 0.35 },
                    { transform: 'rotate(24deg)', offset: 0.55 },
                    { transform: 'rotate(0deg)' }
                ]
            },
            recoil: {
                root: [
                    { transform: 'translate3d(0,0,0)' },
                    { transform: 'translate3d(5px,-1px,0)', offset: 0.3 },
                    { transform: 'translate3d(8px,-2px,0)', offset: 0.55 },
                    { transform: 'translate3d(0,0,0)' }
                ],
                torso: [
                    { transform: 'rotate(0deg)' },
                    { transform: 'rotate(5deg)', offset: 0.45 },
                    { transform: 'rotate(0deg)' }
                ]
            }
        };
        if (poses[pose]) this.playPose(element, poses[pose], duration);
    },

    async setForm(element, requestedForm, preserveAnimation = false) {
        if (!element?.classList.contains('p5-rig')) return false;
        const entry = this.entry(element.dataset.sprite);
        const formName = this.normalizeForm(requestedForm);
        const form = entry?.forms?.[formName];
        if (!form) return false;
        const results = await this.preload(Object.values(form.parts));
        if (!element.isConnected || results.some(result => result.status !== 'fulfilled')) return false;
        if (!preserveAnimation) this.cancel(element);
        Object.entries(form.parts).forEach(([name, url]) => {
            const part = element.querySelector(`[data-part="${name}"]`);
            if (part) part.style.backgroundImage = `url('${new URL(url, document.baseURI).href}')`;
        });
        const origins = {
            root: 'root', pelvis: 'pelvis', legL: 'pelvis', legR: 'pelvis',
            torso: 'pelvis', armL: 'shoulderL', armR: 'shoulderR', head: 'torso'
        };
        Object.entries(origins).forEach(([boneName, jointName]) => {
            const bone = element.querySelector(`[data-bone="${boneName}"]`);
            const point = form.joints[jointName];
            if (bone && point) bone.style.transformOrigin = `${point[0]}px ${point[1]}px`;
        });
        element.dataset.rigForm = formName;
        element.classList.add('parts-ready');
        return true;
    },

    clipFor(characterId, skillId = 'attack') {
        if (typeof BattleRigSkills === 'undefined') return null;
        return BattleRigSkills[characterId]?.[skillId]
            || BattleRigSkills[characterId]?.attack
            || null;
    },

    async playSkill(element, characterId, skillId = 'attack') {
        const clip = this.clipFor(characterId, skillId);
        if (!element || !clip) {
            this.pose(element, 'strike', 560);
            return;
        }
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            if (clip.form) await this.setForm(element, clip.form);
            return;
        }
        if (clip.form) {
            const form = this.entry(characterId)?.forms?.[this.normalizeForm(clip.form)];
            if (form) await this.preload(Object.values(form.parts));
        }
        if (clip.form) {
            element.classList.add('rig-transforming');
            const swapDelay = Math.round(clip.duration * (clip.swapAt ?? clip.impact ?? .55));
            setTimeout(() => this.setForm(element, clip.form, true), swapDelay);
        }
        await this.playPose(element, clip.tracks, clip.duration, 'linear');
        element.classList.remove('rig-transforming');
    },

    async playStageUp(element, form) {
        if (!element || !form || element.dataset.rigForm === form) return;
        const tracks = {
            root: [
                { transform: 'translate(0,0) scale(1)' },
                { transform: 'translate(0,-6px) scale(1.08)', offset: .48 },
                { transform: 'translate(0,0) scale(1)' }
            ],
            torso: [
                { transform: 'rotate(0)' },
                { transform: 'rotate(-4deg)', offset: .3 },
                { transform: 'rotate(4deg)', offset: .62 },
                { transform: 'rotate(0)' }
            ],
            armL: [{ transform: 'rotate(0)' }, { transform: 'rotate(-20deg)', offset: .5 }, { transform: 'rotate(0)' }],
            armR: [{ transform: 'rotate(0)' }, { transform: 'rotate(20deg)', offset: .5 }, { transform: 'rotate(0)' }]
        };
        element.classList.add('rig-transforming');
        const animation = this.playPose(element, tracks, 720, 'linear');
        setTimeout(() => this.setForm(element, form, true), 330);
        await animation;
        element.classList.remove('rig-transforming');
    },

    report() {
        return {
            cached: this.cache.size,
            failures: [...this.failures]
        };
    }
};
