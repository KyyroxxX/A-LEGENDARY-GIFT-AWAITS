/**
 * Data-driven attack / skill full-body sprites.
 * Prefer one AI (or hand-drawn) sheet per skill — scalable to every character.
 *
 * Files live at: assets/sprites/anim/{id}_skill_{skillId}.png
 * Fallback chain: skill art → attack2 → attack → idle
 */
const AttackSprites = {
    /** Optional explicit overrides (characterId → skillId → relative path). */
    map: {
        naruto: {
            rasengan: 'assets/sprites/anim/naruto_skill_rasengan.png',
            odama: 'assets/sprites/anim/naruto_skill_odama.png',
            kage_bunshin: 'assets/sprites/anim/naruto_skill_bunshin.png',
            kyubi_claw: 'assets/sprites/anim/naruto_skill_kyubi_claw.png',
            bijuu_roar: 'assets/sprites/anim/naruto_skill_bijuu_roar.png',
            menacing_ball: 'assets/sprites/anim/naruto_skill_menacing.png'
        }
    },

    /** skills that should hold a single pose (no attack0/1/2 cycle) */
    holdPose: true,
    /** flip true when per-skill full-body PNGs exist under assets/sprites/anim/ */
    useSkillPose: false,

    pathFor(characterId, skillId) {
        if (!characterId || !skillId) return null;
        const explicit = this.map[characterId]?.[skillId];
        if (explicit) return explicit;
        return `assets/sprites/anim/${characterId}_skill_${skillId}.png`;
    },

    kindFor(skillId) {
        return skillId ? `skill_${skillId}` : null;
    },

    /**
     * Frame kinds to flash during an attack.
     * If skill art exists (or is registered), hold that pose; else classic attack cycle.
     */
    framesFor(characterId, skillId, { isSupport = false, transformed = false, formKind = 'idle' } = {}) {
        if (isSupport && !skillId) return [formKind];
        if (transformed) return [formKind];
        // Armor shell reveal (Sasori Kazekage) — stay on reveal art, don't flash Hiruko attacks
        if (formKind && formKind !== 'idle' && !String(formKind).startsWith('attack')) {
            return [formKind];
        }
        // Until per-skill PNGs ship, keep the classic attack cycle (cut-in carries the glam).
        // When a skill sprite is registered AND present, UI can still request skill_* via spriteUrl.
        if (skillId && this.map[characterId]?.[skillId] && this.useSkillPose) {
            const kind = this.kindFor(skillId);
            if (this.holdPose) return [kind, kind, kind, kind];
            return [kind, 'attack1', 'attack2', 'attack'];
        }
        return ['attack0', 'attack1', 'attack2', 'attack'];
    }
};

if (typeof window !== 'undefined') window.AttackSprites = AttackSprites;
