/**
 * Easter-egg side banners — infinite pulls, game-accurate-ish rates.
 * Rewards are cosmetic only (NOT playable roster unlocks).
 */
const EggGacha = {
    activeId: null,

    BANNERS: {
        wuwa: {
            id: 'wuwa',
            game: 'Wuthering Waves',
            short: 'WuWa',
            title: 'CONVENIO RESONADOR',
            titleLines: ['CONVENIO', 'RESONADOR'],
            subtitle: 'Easter egg · tiradas infinitas · no jugable.',
            tag: 'Evento limitado',
            featured: 'Luuk Herssen',
            featuredNote: 'Spectro · Guanteletes · Rate-up 5★',
            thumb: 'assets/gacha/egg/wuwa-thumb.webp',
            art: 'assets/gacha/egg/wuwa-art.webp',
            banner: 'assets/gacha/egg/wuwa-banner.webp',
            art5: 'assets/gacha/egg/wuwa-5.webp',
            art5Std: 'assets/gacha/egg/wuwa-5std.webp',
            art4: 'assets/gacha/egg/wuwa-4.webp',
            art3: 'assets/gacha/egg/wuwa-3.webp',
            accent: '#7ec8ff',
            // Official-ish convene rates
            rate5: 0.008,
            rate4: 0.06,
            soft5: 65,
            hard5: 80,
            hard4: 10,
            featured5050: true,
            pool5Std: ['Calcharo', 'Verina', 'Lingyang', 'Encore', 'Jianxin'],
            pool4: ['Sanhua', 'Mortefi', 'Baizhi', 'Chixia', 'Danjin', 'Taoqi', 'Yuanwu', 'Aalto', 'Youhu'],
            pool3: ['Espada básica', 'Pistola básica', 'Rectificador básico', 'Mandoble básico', 'Guanteletes básicos']
        },
        tof: {
            id: 'tof',
            game: 'Tower of Fantasy',
            short: 'ToF',
            title: 'NÚCLEO ESPECIAL',
            titleLines: ['NÚCLEO', 'ESPECIAL'],
            subtitle: 'Easter egg · tiradas infinitas · no jugable.',
            tag: 'Evento limitado',
            featured: 'Frigg',
            featuredNote: 'SSR Hielo · Rate-up especial',
            thumb: 'assets/gacha/egg/tof-thumb.webp',
            art: 'assets/gacha/egg/tof-art.webp',
            banner: 'assets/gacha/egg/tof-banner.webp',
            art5: 'assets/gacha/egg/tof-5.webp',
            art5Std: 'assets/gacha/egg/tof-5std.webp',
            art4: 'assets/gacha/egg/tof-4.webp',
            art3: 'assets/gacha/egg/tof-3.webp',
            accent: '#9ad4ff',
            rate5: 0.008,
            rate4: 0.08,
            soft5: 70,
            hard5: 80,
            hard4: 10,
            featured5050: true,
            pool5Std: ['Crow', 'Samir', 'Tsubasa', 'King', 'Shiro', 'Zero'],
            pool4: ['Bai Ling', 'Hilda', 'Echo', 'Ene', 'Pepper'],
            pool3: ['Espada de acero', 'Rifle estándar', 'Lanza de entrenamiento', 'Núcleo R']
        },
        genshin: {
            id: 'genshin',
            game: 'Genshin Impact',
            short: 'Genshin',
            title: 'ORACIÓN DEL EVENTO',
            titleLines: ['ORACIÓN', 'DEL EVENTO'],
            subtitle: 'Easter egg · tiradas infinitas · no jugable.',
            tag: 'Evento limitado',
            featured: 'Arataki Itto',
            featuredNote: '5★ Geo · Claymore · Rate-up',
            thumb: 'assets/gacha/egg/genshin-thumb.webp',
            art: 'assets/gacha/egg/genshin-art.webp',
            banner: 'assets/gacha/egg/genshin-banner.webp',
            art5: 'assets/gacha/egg/genshin-5.webp',
            art5Std: 'assets/gacha/egg/genshin-5std.webp',
            art4: 'assets/gacha/egg/genshin-4.webp',
            art3: 'assets/gacha/egg/genshin-3.webp',
            accent: '#f0d060',
            rate5: 0.006,
            rate4: 0.051,
            soft5: 74,
            hard5: 90,
            hard4: 10,
            featured5050: true,
            pool5Std: ['Diluc', 'Jean', 'Qiqi', 'Mona', 'Keqing', 'Tighnari', 'Dehya'],
            pool4: ['Gorou', 'Kuki Shinobu', 'Yun Jin', 'Ningguang', 'Beidou', 'Xiangling', 'Xingqiu', 'Fischl'],
            pool3: ['Espada del Viajero', 'Mensajero', 'Guía mágica', 'Gran espada de hierro']
        }
    },

    stateKey(id) {
        return `eggGacha_${id}`;
    },

    getState(id) {
        const all = GameState.get('eggGacha') || {};
        if (!all[id]) {
            all[id] = {
                pity5: 0,
                pity4: 0,
                guaranteedFeatured: false,
                pulls: 0,
                history: []
            };
            GameState.set('eggGacha', all);
        }
        return all[id];
    },

    saveState(id, st) {
        const all = GameState.get('eggGacha') || {};
        all[id] = st;
        GameState.set('eggGacha', all);
    },

    pick(list) {
        return list[Math.floor(Math.random() * list.length)];
    },

    rarityLabel(stars) {
        if (stars >= 5) return 'epic';
        if (stars === 4) return 'rare';
        return 'common';
    },

    /** Card / result art by stars (3★ blue weapons · 4★ · 5★ featured/std). */
    artFor(result) {
        const b = this.BANNERS[result?.bannerId];
        if (!b) return 'assets/gacha/egg/wuwa-art.webp';
        const portrait = this.portraitFor(result.bannerId, result.name || result.reward);
        if (portrait) return portrait;
        const stars = result.stars || 3;
        if (stars >= 5) {
            if (result.featured) return b.art5 || b.art;
            return b.art5Std || b.art5 || b.art;
        }
        if (stars === 4) return b.art4 || b.art;
        return b.art3 || b.art;
    },

    /** Official portrait path for egg pool characters (details + results). */
    portraitFor(bannerId, name) {
        if (!name) return null;
        const key = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '');
        const map = {
            wuwa: {
                luukherssen: 'wuwa-luuk', sanhua: 'wuwa-sanhua', mortefi: 'wuwa-mortefi',
                baizhi: 'wuwa-baizhi', chixia: 'wuwa-chixia', danjin: 'wuwa-danjin',
                taoqi: 'wuwa-taoqi', yuanwu: 'wuwa-yuanwu', aalto: 'wuwa-aalto', youhu: 'wuwa-youhu',
                calcharo: 'wuwa-calcharo', verina: 'wuwa-verina', lingyang: 'wuwa-lingyang',
                encore: 'wuwa-encore', jianxin: 'wuwa-jianxin', yangyang: 'wuwa-yangyang'
            },
            genshin: {
                aratakiitto: 'genshin-itto', itto: 'genshin-itto', gorou: 'genshin-gorou',
                ningguang: 'genshin-ningguang', kukishinobu: 'genshin-kukishinobu',
                yunjin: 'genshin-yunjin', beidou: 'genshin-beidou', xiangling: 'genshin-xiangling',
                xingqiu: 'genshin-xingqiu', fischl: 'genshin-fischl'
            },
            tof: {
                frigg: 'tof-frigg', bailing: 'tof-bailing', crow: 'tof-crow',
                samir: 'tof-samir', hilda: 'tof-hilda'
            }
        };
        const file = map[bannerId]?.[key];
        return file ? `assets/gacha/egg/portraits/${file}.webp` : null;
    },

    stageArt(bannerId) {
        const b = this.BANNERS[bannerId];
        return (b && (b.banner || b.art)) || '';
    },

    /** Soft pity: after soft5, rate climbs to ~100% at hard5 */
    effectiveRate5(b, pity5) {
        if (pity5 + 1 >= b.hard5) return 1;
        if (pity5 + 1 < b.soft5) return b.rate5;
        const t = (pity5 + 1 - b.soft5) / Math.max(1, b.hard5 - b.soft5);
        return Math.min(1, b.rate5 + (1 - b.rate5) * Math.pow(t, 1.35));
    },

    rollOne(bannerId) {
        const b = this.BANNERS[bannerId];
        if (!b) return null;
        const st = this.getState(bannerId);
        st.pity5 += 1;
        st.pity4 += 1;
        st.pulls += 1;

        let stars = 3;
        const r5 = this.effectiveRate5(b, st.pity5 - 1);
        const roll = Math.random();

        if (roll < r5 || st.pity5 >= b.hard5) {
            stars = 5;
        } else if (st.pity4 >= b.hard4 || Math.random() < b.rate4 / Math.max(0.001, 1 - r5)) {
            stars = 4;
        }

        let name;
        let featured = false;
        if (stars === 5) {
            st.pity5 = 0;
            st.pity4 = 0;
            const forceFeatured = st.guaranteedFeatured || !b.featured5050;
            if (forceFeatured || Math.random() < 0.5) {
                name = b.featured;
                featured = true;
                st.guaranteedFeatured = false;
            } else {
                name = this.pick(b.pool5Std);
                st.guaranteedFeatured = true;
            }
        } else if (stars === 4) {
            st.pity4 = 0;
            name = this.pick(b.pool4);
        } else {
            name = this.pick(b.pool3);
        }

        const result = {
            egg: true,
            bannerId,
            game: b.game,
            name,
            reward: name,
            featured,
            stars,
            rarity: this.rarityLabel(stars),
            kind: 'egg',
            playable: false
        };
        st.history.push({
            reward: name,
            rarity: result.rarity,
            stars,
            featured,
            t: Date.now()
        });
        if (st.history.length > 80) st.history = st.history.slice(-80);
        this.saveState(bannerId, st);
        return result;
    },

    planPulls(bannerId, count) {
        const out = [];
        for (let i = 0; i < count; i++) out.push(this.rollOne(bannerId));
        const planned = out.filter(Boolean);
        if (count >= 10 && planned.length >= 10) {
            const fives = planned
                .map((r, i) => ((r.stars || 0) >= 5 ? i : -1))
                .filter((i) => i >= 0);
            if (fives.length === 1 && Math.random() < 0.40) {
                const slot = planned.findIndex((r, i) => !fives.includes(i) && (r.stars || 0) < 5);
                const b = this.BANNERS[bannerId];
                if (slot >= 0 && b) {
                    const featured = Math.random() < 0.5;
                    planned[slot] = {
                        egg: true,
                        bannerId,
                        game: b.game,
                        name: featured ? b.featured : this.pick(b.pool5Std),
                        reward: featured ? b.featured : this.pick(b.pool5Std),
                        featured,
                        stars: 5,
                        rarity: this.rarityLabel(5),
                        kind: 'egg',
                        playable: false,
                        doubleBoost: true
                    };
                    planned[slot].reward = planned[slot].name;
                    const st = this.getState(bannerId);
                    st.pity5 = 0;
                    st.pity4 = 0;
                    this.saveState(bannerId, st);
                }
            }
        }
        return planned;
    },

    ratesBlurb(b) {
        const pct5 = (b.rate5 * 100).toFixed(1);
        const pct4 = (b.rate4 * 100).toFixed(1);
        return `5★ base ${pct5}% (soft ${b.soft5} · hard ${b.hard5}) · 4★ base ${pct4}% (hard ${b.hard4}) · 50/50 rate-up`;
    }
};

if (typeof window !== 'undefined') window.EggGacha = EggGacha;
