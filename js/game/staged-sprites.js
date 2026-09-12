/**
 * Live character art from user_refs/_staged.
 * Prefer these over baked anim/ so editing a ref_* file shows up after refresh.
 *
 * IMPORTANT: never CSS-stack staged + anim/portrait — alpha would composite
 * multiple characters into a "collage". Use one URL only.
 */
const StagedSprites = {
    BASE: 'assets/sprites/_src/user_refs/_staged',
    _ver: null,
    _files: null,
    _facesLeft: null,
    _loading: null,

    /**
     * Seed from facing.json (staged cutout bake). Sync so first paint is correct.
     * Allies with left-facing art get .face-flip; enemies get .face-native.
     * Itachi / most new cutouts face RIGHT — not listed here.
     */
    FACES_LEFT_SEED: [
        'abbacchio', 'akaza', 'aki', 'brook', 'denji', 'diavolo', 'dio', 'enel',
        'gai', 'gantenbainne', 'geto', 'ginjo', 'gojo', 'gyomei', 'hakari', 'hidan',
        'ichigo', 'jogo', 'joseph', 'kira', 'kisame', 'lee', 'mahito', 'megumi',
        'mihawk', 'minato', 'mista', 'mitsuri', 'nami', 'neji', 'obanai',
        'okuyasu', 'orihime', 'pain', 'polnareff', 'power', 'rengoku', 'risotto',
        'robin', 'sabito', 'sanji', 'sasori', 'shanks', 'shunsui', 'tanjiro',
        'sukuna', 'tengen', 'toshiro', 'tsunade', 'ulquiorra', 'urahara', 'urokodaki',
        'usopp', 'zenitsu', 'zoro'
    ],

    FACING_FORM_OVERRIDES: {
        akaza: { normal: false, transform: true },
        kisame: { normal: true, transform: false }
    },

    /** Flavor names when auto-injecting a missing transform skill. */
    TRANSFORM_NAMES: {
        itachi: 'Sharingan',
        ginjo: 'Fullbring Liberado',
        ryu: 'Granite Max Output',
        uro: 'Sky Manipulation · Max'
    },

    JOJO_COMPOSITE_TRANSFORMS: new Set([
        'abbacchio', 'anasui', 'bucciarati', 'diavolo', 'dio', 'giorno',
        'jolyne', 'joseph', 'josuke', 'jotaro', 'kira', 'mista', 'narancia',
        'okuyasu', 'polnareff', 'pucci', 'risotto', 'rohan', 'trish', 'weather'
    ]),

    JOJO_STAND_LAYERED: new Set([
        'abbacchio', 'diavolo', 'dio', 'giorno', 'josuke',
        'kira', 'okuyasu', 'polnareff', 'pucci', 'rohan'
    ]),

    get ver() {
        if (!this._ver) this._ver = String(Date.now());
        return this._ver;
    },

    init() {
        if (this._loading) return this._loading;
        if (!this._facesLeft) this._facesLeft = new Set(this.FACES_LEFT_SEED);
        const bust = Date.now();
        this._loading = Promise.all([
            fetch(`${this.BASE}/manifest.json?t=${bust}`, { cache: 'no-store' })
                .then((r) => (r.ok ? r.json() : { files: [] }))
                .catch(() => ({ files: [] })),
            fetch(`${this.BASE}/facing.json?t=${bust}`, { cache: 'no-store' })
                .then((r) => (r.ok ? r.json() : null))
                .catch(() => null)
        ]).then(([manifest, facing]) => {
            this._files = new Set((manifest && manifest.files) || []);
            if (facing && Array.isArray(facing.facesLeft)) {
                this._facesLeft = new Set(facing.facesLeft);
            }
            this.ensureTransforms();
            return this._files;
        });
        return this._loading;
    },

    has(file) {
        if (!this._files) return false;
        return this._files.has(file);
    },

    hasXform(id) {
        if (!id) return false;
        return this.has(`ref_${id}_xform.png`)
            || this.has(`ref_${id}_xform1.png`)
            || this.has(`ref_${id}_xform_2.png`);
    },

    /** Art that natively faces screen-left. */
    facesLeftNative(id, kind = 'idle') {
        if (!id) return false;
        const override = this.FACING_FORM_OVERRIDES[id];
        if (override) {
            const isTransform = kind === 'transform' || /^transform_/.test(kind);
            if (isTransform && override.transform != null) return override.transform;
            if (!isTransform && override.normal != null) return override.normal;
        }
        if (!this._facesLeft) this._facesLeft = new Set(this.FACES_LEFT_SEED);
        return this._facesLeft.has(id);
    },

    /** Card art is always the character's base form, never a stand composite. */
    normalUrl(id) {
        if (!id) return null;
        const file = `ref_${id}.png`;
        if (id === 'luffy') return `${this.BASE}/${file}?v=${this.ver}`;
        if (this._files?.size && !this.has(file)) return null;
        return `${this.BASE}/${file}?v=${this.ver}`;
    },

    /**
     * @param {string} id
     * @param {string} kind
     * @returns {string|null}
     */
    url(id, kind = 'idle') {
        if (!id) return null;
        const k = kind || 'idle';
        let file = null;
        // Sasori has a deliberate two-step reveal: Hiruko (base) -> Kazekage
        // puppet (reveal after the shell breaks) -> true human puppet body
        // (manual transformation). Do not reuse the Kazekage art for both.
        if (id === 'sasori' && k === 'transform') {
            file = 'ref_sasori_xform1.png';
            if (this._files?.size && !this.has(file)) return null;
            return `${this.BASE}/${file}?v=${this.ver}`;
        }
        if (this.JOJO_STAND_LAYERED.has(id)) {
            if (k !== 'transform' && !/^transform_/.test(k)) {
                return this.normalUrl(id);
            }
            file = `ref_${id}_stand_composite.png`;
            if (this._files?.size && this.has(file)) {
                return `${this.BASE}/${file}?v=${this.ver}`;
            }
        }
        if (this.JOJO_COMPOSITE_TRANSFORMS.has(id)
            && (k === 'transform' || /^transform_/.test(k))) {
            file = `ref_${id}_xform.png`;
            if (this._files && this.has(file)) {
                return `${this.BASE}/${file}?v=${this.ver}`;
            }
        }
        if ((k === 'transform' || /^transform_/.test(k)) && this.JOJO_COMPOSITE_TRANSFORMS.has(id)) {
            return null;
        }
        if (k === 'transform' || k === 'transform_1') {
            file = `ref_${id}_xform.png`;
            // No silent idle fallback — that would hide anim/*_transform.png
            if (this._files && !this.has(file)) return null;
            if (!this._files) return null;
        } else {
            const stageMatch = /^transform_([2-9]\d*)$/.exec(k);
            if (stageMatch) {
                // Stage 2+: Naruto uses ref_naruto_xform1.png for 4 colas
                const stage = stageMatch[1];
                const candidates = [
                    `ref_${id}_xform${Number(stage) - 1}.png`, // transform_2 → xform1
                    `ref_${id}_xform_${stage}.png`,
                    `ref_${id}_xform${stage}.png`,
                    `ref_${id}_xform.png`
                ];
                file = candidates.find((f) => this.has(f)) || null;
                if (!file) return null;
            } else if (k === 'reveal' || String(k).startsWith('skill_')) {
                return null;
            } else {
                file = `ref_${id}.png`;
            }
        }
        if (this._files?.size && !this.has(file)) return null;
        return `${this.BASE}/${file}?v=${this.ver}`;
    },

    _hasTransformSkill(unit) {
        return (unit?.skills || []).some((s) => s && s.transform);
    },

    _defaultTransformedSkills(unit) {
        const atkType = ((unit.skills || []).find((s) => s && s.power > 0 && s.type && s.type !== 'support') || {}).type || 'strike';
        const tag = unit.roleTag || unit.name || 'Awaken';
        return [
            { id: `${unit.id}_x_strike`, name: `${tag} · Golpe`, cry: '!', cost: 32, power: 145, type: atkType, desc: 'Forma despertada · golpe potenciado.' },
            { id: `${unit.id}_x_barrage`, name: `${tag} · Ráfaga`, cry: '!', cost: 40, power: 130, type: atkType, hits: 3, desc: 'Forma despertada · 3 hits.' },
            { id: `${unit.id}_x_focus`, name: `${tag} · Enfoque`, cry: '…', cost: 28, power: 0, type: 'support', buff: { atk: 1.35, agi: 1.2 }, turns: 2, desc: 'Forma despertada · ATK/AGI ↑.' },
            { id: `${unit.id}_x_finisher`, name: `${tag} · Finisher`, cry: '!', cost: 58, power: 190, type: atkType, desc: 'Forma despertada · remate.' }
        ];
    },

    _makeTransformSkill(unit) {
        const name = this.TRANSFORM_NAMES[unit.id] || `${unit.roleTag || unit.name || 'Despertar'}`;
        return {
            id: `${unit.id}_awaken`,
            name,
            cry: `${String(name).split('·')[0].trim()}!`,
            cost: 58,
            power: 0,
            type: 'support',
            transform: true,
            once: true,
            transformPersistent: true,
            transformUpkeep: 12,
            transformAtk: 1.45,
            transformAgi: 1.25,
            desc: `TRANSFORM · ${name} · permanece hasta quedarse sin CP.`
        };
    },

    /** Inject transform skill when staged xform exists but kit has none. */
    ensureTransforms() {
        if (typeof BattleData === 'undefined' || !Array.isArray(BattleData.party)) return;
        BattleData.party.forEach((unit) => {
            if (!unit?.id || !this.hasXform(unit.id)) return;
            if (this._hasTransformSkill(unit)) {
                unit.transform = true;
                if (!unit.transformName) {
                    unit.transformName = this.TRANSFORM_NAMES[unit.id] || unit.roleTag || 'Despertar';
                }
                if (!unit.transformedSkills?.length) {
                    unit.transformedSkills = this._defaultTransformedSkills(unit);
                }
                return;
            }
            const sk = this._makeTransformSkill(unit);
            unit.transform = true;
            unit.transformName = sk.name;
            unit.skills = Array.isArray(unit.skills) ? unit.skills.slice() : [];
            const idx = unit.skills.findIndex((s) =>
                s && !s.power && !s.transform && s.type === 'support' && !s.heal && !s.partyBuff && !s.debuff
            );
            if (idx >= 0) unit.skills[idx] = sk;
            else if (unit.skills.length >= 4) unit.skills[unit.skills.length - 1] = sk;
            else unit.skills.push(sk);
            if (!unit.transformedSkills?.length) {
                unit.transformedSkills = this._defaultTransformedSkills(unit);
            }
        });
    }
};

if (typeof window !== 'undefined') {
    window.StagedSprites = StagedSprites;
    StagedSprites.init();
}
