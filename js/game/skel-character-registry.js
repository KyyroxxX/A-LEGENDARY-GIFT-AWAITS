/**
 * Data-driven skeletal character registry.
 * Add characters by registering a config — never branch on character id in the engine.
 */
const SkelCharacterRegistry = {
    _byId: Object.create(null),
    _models: new Map(),

    register(config) {
        if (!config?.characterId) throw new Error('SkelCharacterRegistry.register: characterId required');
        this._byId[config.characterId] = config;
        return config;
    },

    get(characterId) {
        return this._byId[characterId] || null;
    },

    has(characterId) {
        return !!this._byId[characterId];
    },

    list() {
        return Object.keys(this._byId);
    },

    clipFor(characterId, skillId) {
        const cfg = this.get(characterId);
        if (!cfg) return null;
        const map = cfg.skillMap || {};
        const name = map[skillId] || map.attack || 'attack';
        return cfg.clips?.[name] || null;
    },

    resolveClipName(characterId, skillId, profile = {}) {
        const cfg = this.get(characterId);
        if (!cfg) return null;
        if (profile.family === 'finisher' && cfg.ultimateClip) return cfg.ultimateClip;
        // Heavy spiral finishers (Odama, Bijuu, etc.) use ultimate presentation
        if (cfg.ultimateClip && /odama|bijuu|menacing|ultimate|finisher/i.test(String(skillId || ''))) {
            return cfg.ultimateClip;
        }
        const map = cfg.skillMap || {};
        return map[skillId] || map.attack || 'attack';
    },

    async loadModel(characterId) {
        const cfg = this.get(characterId);
        if (!cfg) return null;
        if (this._models.has(characterId)) return this._models.get(characterId);
        const promise = SkelFormRuntime.loadPack(cfg.skfUrl).then((model) => {
            this._models.set(characterId, model);
            return model;
        });
        this._models.set(characterId, promise);
        return promise;
    }
};

/** Mount / play helpers used by BattleUI — still character-agnostic. */
const SkelBattleBridge = {
    actors: new WeakMap(),

    markup(characterId) {
        return `
            <div class="p5-sprite p5-skel" data-sprite="${characterId}" data-skel="1">
                <canvas class="p5-skel-canvas" width="480" height="580" aria-hidden="true"></canvas>
            </div>
        `;
    },

    async mount(element, characterId, { facing = 1 } = {}) {
        if (!element || !SkelCharacterRegistry.has(characterId)) return null;
        const canvas = element.querySelector('.p5-skel-canvas');
        if (!canvas) return null;
        const model = await SkelCharacterRegistry.loadModel(characterId);
        const cfg = SkelCharacterRegistry.get(characterId);
        const animator = new SkelAnimator.Animator(model, canvas, { facing });
        animator.registerClips(cfg.clips);
        this.actors.set(element, { characterId, animator, cfg });
        element.classList.add('skel-ready');
        animator.play('idle').catch(() => {});
        return animator;
    },

    get(element) {
        return this.actors.get(element) || null;
    },

    getByFighter(fighterEl) {
        const spr = fighterEl?.querySelector?.('.p5-skel');
        return spr ? this.get(spr) : null;
    },

    startIdle(element) {
        const actor = this.get(element);
        if (!actor) return;
        if (actor.animator.current?.name === 'idle' && actor.animator.playing) return;
        actor.animator.play('idle').catch(() => {});
    },

    stop(element) {
        const actor = this.get(element);
        if (!actor) return;
        actor.animator.stop(false);
    },

    async playClip(element, clipName, onEvent) {
        const actor = this.get(element);
        if (!actor || !clipName) return null;
        const unsub = onEvent ? actor.animator.onEvent(onEvent) : null;
        try {
            return await actor.animator.play(clipName);
        } finally {
            if (unsub) unsub();
        }
    },

    async playHit(element) {
        const actor = this.get(element);
        if (!actor) return;
        await actor.animator.play('hit');
        actor.animator.play('idle').catch(() => {});
    },

    async playDeath(element) {
        const actor = this.get(element);
        if (!actor) return;
        await actor.animator.play('death');
    },

    async playVictory(element) {
        const actor = this.get(element);
        if (!actor) return;
        await actor.animator.play('victory');
    }
};

if (typeof window !== 'undefined') {
    window.SkelCharacterRegistry = SkelCharacterRegistry;
    window.SkelBattleBridge = SkelBattleBridge;
}

// Auto-register known character packs if present
if (typeof NarutoSkelAnims !== 'undefined') {
    SkelCharacterRegistry.register(NarutoSkelAnims);
}
