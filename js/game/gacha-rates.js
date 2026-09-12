/**
 * Shared gacha rate / pity helpers (series banners + easter eggs).
 * Tiers: 3 common · 4 rare · 5 epic(gold) · 6 mythic(red) · 7 celestial(purple Metaphor)
 */
const GachaRates = {
    /** Soft pity climb from soft → ~100% at hard */
    effectiveRate(rate, soft, hard, pity) {
        if (pity + 1 >= hard) return 1;
        if (pity + 1 < soft) return rate;
        const t = (pity + 1 - soft) / Math.max(1, hard - soft);
        return Math.min(1, rate + (1 - rate) * Math.pow(t, 1.35));
    },

    /** @deprecated use effectiveRate */
    effectiveRate5(rate5, soft5, hard5, pity5) {
        return this.effectiveRate(rate5, soft5, hard5, pity5);
    },

    rarityLabel(stars) {
        if (stars >= 7) return 'celestial';
        if (stars >= 6) return 'mythic';
        if (stars >= 5) return 'epic';
        if (stars === 4) return 'rare';
        return 'common';
    },

    pick(list) {
        if (!list || !list.length) return null;
        return list[Math.floor(Math.random() * list.length)];
    },

    ratesBlurb(b) {
        if (b.isMetaphor) {
            const pct7 = ((b.rate7 || 0.008) * 100).toFixed(2);
            return `7★ base ${pct7}% (soft ${b.soft7} · hard ${b.hard7}) · rate-up ${Math.round((b.featuredRate ?? 0.7) * 100)}%`;
        }
        const pct6 = ((b.rate6 || 0.003) * 100).toFixed(2);
        const pct5 = ((b.rate5 || 0.02) * 100).toFixed(1);
        const pct4 = ((b.rate4 || 0.12) * 100).toFixed(1);
        return `6★ ${pct6}% (soft ${b.soft6} · hard ${b.hard6}) · 5★ ${pct5}% · 4★ ${pct4}%`;
    },

    /** WuWa-style rate rows for details panel. */
    rateRows(b) {
        if (b.isMetaphor) {
            const r7 = b.rate7 || 0.008;
            const r4 = b.rate4 || 0.10;
            const r3 = Math.max(0, 1 - r7 - r4);
            return [
                { stars: 7, label: '7★', pct: (r7 * 100).toFixed(2), note: `soft ${b.soft7} · hard ${b.hard7}` },
                { stars: 4, label: '4★', pct: (r4 * 100).toFixed(1), note: `hard pity ${b.hard4}` },
                { stars: 3, label: '3★', pct: (r3 * 100).toFixed(1), note: 'resto del pool' }
            ];
        }
        const r6 = b.rate6 || 0.003;
        const r5 = b.rate5 || 0.02;
        const r4 = b.rate4 || 0.12;
        const r3 = Math.max(0, 1 - r6 - r5 - r4);
        return [
            { stars: 6, label: '6★', pct: (r6 * 100).toFixed(2), note: `soft ${b.soft6} · hard ${b.hard6}` },
            { stars: 5, label: '5★', pct: (r5 * 100).toFixed(1), note: `soft ${b.soft5} · hard ${b.hard5}` },
            { stars: 4, label: '4★', pct: (r4 * 100).toFixed(1), note: `hard pity ${b.hard4}` },
            { stars: 3, label: '3★', pct: (r3 * 100).toFixed(1), note: 'resto del pool' }
        ];
    }
};

if (typeof window !== 'undefined') window.GachaRates = GachaRates;
