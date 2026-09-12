/**
 * Character progression — constellation (dupes) only.
 * 4★ → C0–C6 · 5★ → C0–C3. Copies owned = constellation + 1.
 * 5★ C3 stays stronger than 4★ C6 (steeper 5★ curve + higher base stats).
 */
const CharProgress = {
    get MAX_CONST_4() {
        if (typeof CONFIG !== 'undefined' && CONFIG.maxConstellation4 != null) {
            return CONFIG.maxConstellation4;
        }
        return 6;
    },

    get MAX_CONST_5() {
        if (typeof CONFIG !== 'undefined' && CONFIG.maxConstellation5 != null) {
            return CONFIG.maxConstellation5;
        }
        return 3;
    },

    /** Legacy alias = highest cap (UI fallbacks). Prefer maxConstFor(id). */
    get MAX_CONST() {
        return Math.max(this.MAX_CONST_4, this.MAX_CONST_5);
    },

    isFiveStar(id) {
        if (!id) return false;
        if (typeof GachaRoster !== 'undefined') {
            if (typeof GachaRoster.isFiveStarChar === 'function') {
                return GachaRoster.isFiveStarChar(id);
            }
            if (id === GachaRoster.GOJO_ID) return true;
            return GachaRoster.rarityFor(id) === 'epic';
        }
        return false;
    },

    maxConstFor(id) {
        return this.isFiveStar(id) ? this.MAX_CONST_5 : this.MAX_CONST_4;
    },

    ensure() {
        let copies = GameState.get('charCopies');
        if (!copies || typeof copies !== 'object') {
            copies = {};
            GameState.set('charCopies', copies);
        }
        if (typeof GachaRoster !== 'undefined') {
            GachaRoster.STARTERS.forEach((id) => {
                if (!copies[id] || copies[id] < 1) copies[id] = 1;
            });
            GachaRoster.owned().forEach((id) => {
                if (!copies[id] || copies[id] < 1) copies[id] = 1;
            });
        }
        GameState.set('charCopies', copies);
        return { copies };
    },

    copiesOf(id) {
        this.ensure();
        return Math.max(0, (GameState.get('charCopies') || {})[id] || 0);
    },

    constellation(id) {
        const max = this.maxConstFor(id);
        return Math.max(0, Math.min(max, this.copiesOf(id) - 1));
    },

    isMaxed(id) {
        return this.copiesOf(id) >= this.maxConstFor(id) + 1;
    },

    /** Add a copy (first unlock or dupe). */
    addCopy(id) {
        this.ensure();
        const copies = GameState.get('charCopies') || {};
        const before = copies[id] || 0;
        const max = this.maxConstFor(id);
        const unlocked = before < 1;
        if (before >= max + 1) {
            return { unlocked: false, constellation: max, maxed: true, refundInv: true, copies: before };
        }
        copies[id] = before + 1;
        GameState.set('charCopies', copies);
        if (unlocked && typeof GachaRoster !== 'undefined') GachaRoster.unlock(id);
        const now = copies[id];
        return {
            unlocked,
            constellation: Math.max(0, now - 1),
            maxed: now >= max + 1,
            refundInv: false,
            copies: now
        };
    },

    bonusesFor(id) {
        const c = this.constellation(id);
        const five = this.isFiveStar(id);
        // 5★ C3 ≈ +48% ATK · 4★ C6 ≈ +33% ATK — 5★ always wins at equal investment ceiling
        const step = five
            ? { atk: 0.16, hp: 0.14, def: 0.12, agi: 0.06, skill: 0.07, sp: 0.035 }
            : { atk: 0.055, hp: 0.048, def: 0.04, agi: 0.022, skill: 0.022, sp: 0.015 };
        return {
            atk: 1 + c * step.atk,
            hp: 1 + c * step.hp,
            def: 1 + c * step.def,
            agi: 1 + c * step.agi,
            skill: 1 + c * step.skill,
            sp: step.sp,
            constellation: c
        };
    },

    applyToUnit(unit) {
        if (!unit?.id) return unit;
        const b = this.bonusesFor(unit.id);
        unit.atk = Math.round((unit.atk || 0) * b.atk);
        unit.def = Math.round((unit.def || 0) * b.def);
        unit.agi = Math.round((unit.agi || 0) * b.agi);
        unit.maxHp = Math.round((unit.maxHp || 0) * b.hp);
        unit.hp = unit.maxHp;
        unit.maxSp = Math.round((unit.maxSp || 0) * (1 + b.constellation * b.sp));
        unit.sp = unit.maxSp;
        unit.skillPowerMul = (unit.skillPowerMul || 1) * b.skill;
        unit.constellation = b.constellation;
        return unit;
    },

    playableBannerIds() {
        if (typeof GachaRoster === 'undefined') return [];
        if (typeof GachaRoster.playableIds === 'function') return GachaRoster.playableIds();
        return GachaRoster.allCharIdsFromBanners().filter((id) => GachaRoster.isPlayableId
            ? GachaRoster.isPlayableId(id)
            : !!GachaRoster.getTemplate(id));
    },

    allMaxed() {
        const ids = this.playableBannerIds();
        if (!ids.length) return false;
        return ids.every((id) => this.isMaxed(id));
    },

    collectionDupesProgress() {
        const ids = this.playableBannerIds();
        let have = 0;
        let total = 0;
        ids.forEach((id) => {
            const cap = this.maxConstFor(id) + 1;
            total += cap;
            have += Math.min(cap, this.copiesOf(id));
        });
        return { have, total, chars: ids.length };
    },

    worstCasePullsNeeded() {
        if (typeof GachaRoster === 'undefined') return 2700;
        // Gift budget: first copy of each high-pool id at soft pity.
        // Full C3/C6 worst-case is intentional grind via mission repeats (Chiki).
        let need = 0;
        Object.values(GachaRoster.BANNERS).forEach((b) => {
            if (b.isMetaphor) return;
            const high = [];
            if (b.featuredId) high.push(b.featuredId);
            (b.pool6 || []).forEach((id) => high.push(id));
            (b.pool5Std || []).forEach((id) => high.push(id));
            const unique = [...new Set(high)].filter((id) => GachaRoster.isPlayableId
                ? GachaRoster.isPlayableId(id)
                : !!GachaRoster.getTemplate(id));
            const soft = Math.min(b.pity5 || 35, b.hard5 || 50, 40);
            unique.forEach((id) => {
                const have = this.copiesOf(id) || (GachaRoster.STARTERS.includes(id) ? 1 : 0);
                if (have < 1) need += soft;
            });
        });
        // Floor near chronicle first-clear; never explode to full-C3 math.
        const floor = (typeof ChronicleData !== 'undefined')
            ? ChronicleData.TARGET_FIRST_CLEAR_INV
            : ((typeof CONFIG !== 'undefined' && CONFIG.invocationCap) || 2700);
        return Math.min(Math.max(need, floor), floor + 250);
    },

    blurb(id) {
        return `C${this.constellation(id)}/${this.maxConstFor(id)}`;
    }
};

window.CharProgress = CharProgress;
