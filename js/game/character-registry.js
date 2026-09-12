/**
 * Character registry — single source of truth for playable roster metadata.
 * Builds from current battle/gacha data, then filters placeholders so they
 * never appear as finished production characters.
 */
const CharacterRegistry = {
    _entries: null,
    _builtForVersion: 0,

    explicitImplemented: {
        sanji: true,
        robin: false,
        law: false
    },

    rebuild() {
        const entries = new Map();
        const party = (typeof BattleData !== 'undefined' && BattleData.party) || [];

        party.forEach((tpl) => {
            if (!tpl?.id) return;
            entries.set(tpl.id, this.makeEntry(tpl, 'party'));
        });

        if (typeof GachaRoster !== 'undefined') {
            (GachaRoster.enemyIds?.() || []).forEach((id) => {
                if (entries.has(id)) return;
                const tpl = GachaRoster.enemyAsAlly?.(id);
                if (!tpl?.id) return;
                entries.set(id, this.makeEntry(tpl, 'enemy'));
            });
        }

        const rarityMap = this.collectBannerRarities();
        const duplicateLegacy = this.findDuplicateLegacyPortraits([...entries.values()]);

        entries.forEach((entry, id) => {
            entry.rarity = rarityMap.get(id) || entry.rarity || 3;
            entry.rarityLabel = this.rarityLabel(entry.rarity);
            const explicit = this.explicitImplemented[id];
            if (typeof explicit === 'boolean') {
                entry.implemented = explicit;
                entry.implementationReason = explicit ? 'explicit' : 'explicit-disabled';
                return;
            }
            if (duplicateLegacy.has(id)) {
                entry.implemented = false;
                entry.implementationReason = 'duplicate-legacy-portrait';
                return;
            }
            entry.implemented = true;
            entry.implementationReason = 'asset-covered';
        });

        this._entries = entries;
        this._builtForVersion += 1;
        this.validateToConsole();
        return entries;
    },

    ensure() {
        if (!this._entries) this.rebuild();
        return this._entries;
    },

    makeEntry(tpl, source) {
        return {
            id: tpl.id,
            name: tpl.name || tpl.id,
            series: tpl.series || '',
            role: tpl.role || '',
            roleTag: tpl.roleTag || '',
            image: tpl.img || '',
            template: tpl,
            source,
            implemented: true,
            implementationReason: 'unknown',
            rarity: null,
            rarityLabel: null
        };
    },

    collectBannerRarities() {
        const map = new Map();
        const bump = (id, stars) => {
            if (!id) return;
            const cur = map.get(id) || 0;
            // Keep highest: dual 4★/5★ characters must stay 5★ for shop/C-cap.
            if (stars > cur) map.set(id, stars);
        };
        const banners = (typeof GachaRoster !== 'undefined' && GachaRoster.BANNERS) || {};
        Object.values(banners).forEach((b) => {
            if (!b || b.isMetaphor) return;
            const featStars = b.featuredStars || 5;
            if (b.featuredId) bump(b.featuredId, featStars);
            (b.pool6 || []).forEach((id) => bump(id, 6));
            (b.pool5Std || []).forEach((id) => bump(id, 5));
            (b.pool4 || []).forEach((id) => bump(id, 4));
            (b.pool3 || []).forEach((id) => bump(id, 3));
        });
        if (typeof GachaRoster !== 'undefined') {
            (GachaRoster.enemyIds?.() || []).forEach((id) => {
                // Enemy EX alone → 4★; if also on a higher banner, keep highest.
                bump(id, 4);
            });
        }
        return map;
    },

    findDuplicateLegacyPortraits(entries) {
        const byImage = new Map();
        entries.forEach((entry) => {
            const img = entry.image || '';
            if (!img.startsWith('assets/characters/')) return;
            const list = byImage.get(img) || [];
            list.push(entry);
            byImage.set(img, list);
        });

        const flagged = new Set();
        byImage.forEach((list, img) => {
            if (list.length < 2) return;
            const base = img.split('/').pop().replace(/\.(webp|png|jpg|jpeg)$/i, '');
            list.forEach((entry) => {
                if (entry.id !== base) flagged.add(entry.id);
            });
        });
        return flagged;
    },

    getEntry(id) {
        return this.ensure().get(id) || null;
    },

    get(id) {
        const entry = this.getEntry(id);
        return entry?.implemented ? entry.template : null;
    },

    rarityOf(id) {
        return this.getEntry(id)?.rarity || 3;
    },

    rarityLabel(rarity) {
        if (typeof GachaRates !== 'undefined') return GachaRates.rarityLabel(rarity);
        if (rarity >= 7) return 'celestial';
        if (rarity >= 6) return 'mythic';
        if (rarity >= 5) return 'epic';
        if (rarity === 4) return 'rare';
        return 'common';
    },

    isImplemented(id) {
        return !!this.getEntry(id)?.implemented;
    },

    playableIds() {
        return [...this.ensure().values()].filter((e) => e.implemented).map((e) => e.id);
    },

    ownedTemplates() {
        const owned = (typeof GachaRoster !== 'undefined' && GachaRoster.owned)
            ? GachaRoster.owned()
            : [];
        return owned.map((id) => this.get(id)).filter(Boolean);
    },

    validate() {
        const out = [];
        this.ensure().forEach((entry) => {
            if (!entry.name) out.push(`missing-name:${entry.id}`);
            if (![3, 4, 5, 6, 7].includes(entry.rarity)) out.push(`invalid-rarity:${entry.id}:${entry.rarity}`);
            if (!entry.image) out.push(`missing-image:${entry.id}`);
            if (!Array.isArray(entry.template?.skills) || !entry.template.skills.length) out.push(`missing-skills:${entry.id}`);
            if (!entry.implemented) out.push(`not-implemented:${entry.id}:${entry.implementationReason}`);
        });
        return out;
    },

    validateToConsole() {
        const issues = this.validate();
        if (issues.length) console.warn('[CharacterRegistry]', issues);
    }
};

if (typeof BattleData !== 'undefined') {
    BattleData.getPlayable = (id) => CharacterRegistry.get(id);
    BattleData.ownedParty = () => CharacterRegistry.ownedTemplates();
}

if (typeof window !== 'undefined') window.CharacterRegistry = CharacterRegistry;
