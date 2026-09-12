/**
 * Idle Director — real character fidgets, NOT floating bob
 * Actions: adjust headband, scratch head, stretch, look around, etc.
 */
const IdleDirector = {
    /** Per-character preferred fidgets (Persona/RPG style) */
    kits: {
        naruto: ['rest', 'headband', 'scratch', 'stretch', 'look', 'rest', 'scratch'],
        sakura: ['rest', 'hair', 'look', 'rest', 'stretch', 'hips'],
        sasuke: ['rest', 'arms', 'look', 'rest', 'scratch'],
        kakashi: ['rest', 'book', 'look', 'rest', 'headband', 'book'],
        teuchi: ['rest', 'wipe', 'look', 'rest'],
        villager: ['rest', 'scratch', 'look', 'wave', 'rest'],
        kunoichi: ['rest', 'hair', 'look', 'hips'],
        gaara: ['rest', 'arms', 'look', 'rest'],
        chiki: ['rest', 'wave', 'look', 'scratch'],
        ayame: ['rest', 'wipe', 'look', 'hair'],
        nami: ['rest', 'hips', 'look', 'stretch'],
        orihime: ['rest', 'hair', 'look', 'wave'],
        guy: ['rest', 'stretch', 'hips', 'stretch'],
        iruka: ['rest', 'headband', 'look', 'scratch']
    },

    /**
     * @returns {{ action: string, frame: number, phase: number }}
     * Rest holds still; actions play a short multi-frame clip then return to rest.
     */
    sample(id, timeSec, seed = 0) {
        const kit = this.kits[id] || this.kits.villager;
        // Slow timeline: ~3.2s rest / ~1.4s action alternating through kit
        const REST = 2.8;
        const ACT = 1.35;
        const beat = REST + ACT;
        const t = timeSec + seed * 1.7;
        const cycle = Math.floor(t / beat);
        const local = t - cycle * beat;
        const actionId = kit[cycle % kit.length];

        if (actionId === 'rest' || local < REST) {
            // Tiny blink only during long rest (no float)
            const blink = (local > REST * 0.55 && local < REST * 0.55 + 0.12) ? 1 : 0;
            return { action: 'rest', frame: blink, phase: local / REST };
        }
        const af = (local - REST) / ACT;
        // 0..5 action frames
        const frame = Math.min(5, Math.floor(af * 6));
        return { action: actionId, frame, phase: af };
    }
};
