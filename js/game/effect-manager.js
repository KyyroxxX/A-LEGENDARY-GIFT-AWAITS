/**
 * Layered battle VFX compositor.
 *
 * Effects are built as authored compositions instead of one recoloured node:
 * charge, emission, readable silhouette, motion trail, impact and debris are
 * separate layers. The CSS file owns the shapes; this module owns sequencing.
 */
const EffectManager = {
    characterPalette: {
        luffy: ['#fff0a8', '#e33b42'], zoro: ['#eaffc2', '#2d9b68'], nami: ['#fff0b8', '#f08a32'],
        usopp: ['#fff1b3', '#9d6b35'], sanji: ['#fff1c7', '#4b82d8'], robin: ['#f7d2ff', '#8e4ac7'],
        law: ['#d9f7ff', '#3f8fc4'], doflamingo: ['#ffe0ec', '#e34186'], crocodile: ['#ffe7a4', '#b28a35'],
        naruto: ['#fff1a3', '#ef7d22'], sasuke: ['#e8d9ff', '#6351d8'], sakura: ['#fff0f5', '#ed77ad'],
        kakashi: ['#e5f6ff', '#6fa9d9'], gaara: ['#fff0bb', '#c98a35'], itachi: ['#ffd9df', '#a83256'],
        madara: ['#f5d9e8', '#8d2c55'], jiraiya: ['#fff0bd', '#d64a3b'], might_guy: ['#ffe9aa', '#4b9b4b'],
        jotaro: ['#e0f5ff', '#587bdc'], dio: ['#fff1a8', '#d8a52b'], josuke: ['#f1e0ff', '#8555d1'],
        kira: ['#ffe1ef', '#cf4d91'], diavolo: ['#ffd1e6', '#d7438b'], jolyne: ['#e6d2ff', '#8c54cf'],
        polnareff: ['#e8f6ff', '#7eb8e8'], kakyoin: ['#dcffd9', '#2dbe72'], bucciarati: ['#e5f4ff', '#5c93d6'],
        anasui: ['#e7efff', '#6e78d5'], pucci: ['#f2e4ff', '#9b63d1'], okuyasu: ['#dbeeff', '#3677d0'],
        abbacchio: ['#f1e3ff', '#8f6bc4'], ichigo: ['#ffd6d6', '#e64b4b'], rukia: ['#ddf5ff', '#72c7e8'],
        byakuya: ['#fff4fb', '#e56f9f'], aizen: ['#e8e2ff', '#6957c4'], kenpachi: ['#ffe1c2', '#b55539'],
        tanjiro: ['#d9fbff', '#3d9fb1'], nezuko: ['#ffe1ef', '#e16a9e'], rengoku: ['#fff0a6', '#df5a2b'],
        akaza: ['#ffd9e7', '#d24e83'], doma: ['#dffffa', '#3db8ad'], gyutaro: ['#e9d7ff', '#7953b9'],
        denji: ['#fff0b2', '#df4242'], makima: ['#ffe0cd', '#bd5a44'], aki: ['#dcefff', '#4778b4'],
        power: ['#fff0b6', '#dc4b49'], gojo: ['#e5f5ff', '#72a9e8'], sukuna: ['#ffd7df', '#c84362'],
        yuji: ['#ffe0c7', '#d66547'], yuta: ['#edf0ff', '#6d78c9'], toji: ['#f0e4ff', '#8b5bd6'],
        joseph: ['#d9f4ff', '#4f9ac7'], giorno: ['#fff2ad', '#d7ae36'], orihime: ['#ffe0ee', '#e98bad'],
        toshiro: ['#e3f8ff', '#79c9ed'], renji: ['#ffe0e7', '#b94d62'], shikamaru: ['#d8dcff', '#6671c9'],
        hinata: ['#f3ddff', '#9b70cf'], enel: ['#fff3a8', '#d9af35'], zabuza: ['#d9f4ff', '#4c7da6'],
        orochimaru: ['#e9ddff', '#8d6dbf'], lucci: ['#f0f2e8', '#7c8e65'], sasori: ['#ffdadd', '#bd4e68'],
        grimmjow: ['#dcf4ff', '#4a9dcc'], ulquiorra: ['#ecf7ff', '#80b8d4'], reze: ['#fff0c2', '#e15b55'],
        angel: ['#fff5ce', '#e4b85d'], beam: ['#d9f6ff', '#3d99c5'], gyomei: ['#e9e0cf', '#8f8068'],
        kokushibo: ['#f1d9e8', '#9c4774'], giyu: ['#d8f5ff', '#4389c7'], tengen: ['#fff0c1', '#c69a33'],
        sanemi: ['#e5ffd5', '#35a864'], mitsuri: ['#ffe2ee', '#e36a9f'], muichiro: ['#d7fbf4', '#54bfae'],
        obanai: ['#e8e1f7', '#7562a6'], zenitsu: ['#fff4aa', '#e2b72d'], inosuke: ['#dcefff', '#4e91c4'],
        daki: ['#ffe0f2', '#cf62a7'], hantengu: ['#e6e0ff', '#8779c9'], gyokko: ['#d9fbff', '#3aabb0'],
        sabito: ['#d8f4ff', '#4f9ad0'], urokodaki: ['#dcecff', '#5376ad'], megumi: ['#dbe5ff', '#4b5fa8'],
        nobara: ['#ffe4e3', '#c86f78'], maki: ['#e1f7dc', '#5c9b60'], todo: ['#fff0c4', '#bd7d35'],
        nanami: ['#fff1c9', '#b99853'], hakari: ['#e0f6ff', '#4a9cc3'], geto: ['#eadcff', '#7653ad'],
        mahito: ['#e6ddff', '#9062c6'], jogo: ['#ffe1c5', '#d45c3c'], yuki: ['#f5e2ff', '#b274c7'],
        higuruma: ['#e4ebf7', '#5e769a'], choso: ['#ffdce0', '#b84e5c'], uro: ['#dceaff', '#668bd1'],
        ryu: ['#ffe3bf', '#bb7137'], kisame: ['#d5f0ff', '#3d7fa5'], konan: ['#eadcff', '#8b5bb3'],
        pain: ['#ffd9d9', '#b13f48'], sai: ['#e1ecf5', '#4e6070'], yamato: ['#dff5df', '#4d9b61'],
        neji: ['#e8efff', '#7b8fb2'], lee: ['#e8ffd9', '#45a85e'], gai: ['#eaffd0', '#339653'],
        minato: ['#fff3a6', '#4e8fd0'], tsunade: ['#efffd8', '#c99c37'], brook: ['#edf7ff', '#9cc7e3'],
        franky: ['#d8edff', '#3785c5'], chopper: ['#ffe0df', '#d65353'], shanks: ['#ffd7d7', '#9d3a43'],
        mihawk: ['#e5f0d8', '#425e4d'], deidara: ['#fff0b5', '#d27a35'], hidan: ['#ffd6db', '#a73748'],
        caesar: ['#d9f3ff', '#5796ca'], rohan: ['#dceaff', '#5b4a96'], risotto: ['#e5e8ee', '#4e5969'],
        ff: ['#d5fff3', '#35aa88'], mista: ['#d9ebff', '#4e79bd'], narancia: ['#eedcff', '#9a58a4'],
        weather: ['#d8f4ff', '#659fc8'], trish: ['#ffe0ef', '#d95291'], shunsui: ['#dbe7fa', '#9d4e62'],
        urahara: ['#e1ffd9', '#4d9a62'], ginjo: ['#ddf8e7', '#3c9c68'], gantenbainne: ['#dceeff', '#5f91bd']
    },

    palette: {
        melee: ['#fff4dc', '#e75b3d'], barrage: ['#fff7dc', '#ff9d3d'],
        blade: ['#e8f7ff', '#83c9ff'], pierce: ['#f5fbff', '#d4ecff'],
        spiral: ['#d9f4ff', '#4ba8ff'], lightning: ['#fffbd3', '#b7d9ff'],
        inferno: ['#fff1b0', '#f0643e'], element: ['#e3fbff', '#72d7cf'],
        hex: ['#f0d7ff', '#a96dff'], finisher: ['#fff7c6', '#d99c42'],
        heal: ['#f2ffef', '#68e09b'], support: ['#dff4ff', '#7ba8e9'],
        transform: ['#fff2c2', '#e1a84c']
    },

    elementPalette: {
        fire: ['#fff0b0', '#ff6a24'],
        water: ['#f0fbff', '#258cff'],
        ice: ['#f4ffff', '#8ad9ff'],
        wind: ['#f0ffd9', '#55c979'],
        elec: ['#fffbd0', '#6da8ff'],
        earth: ['#fff0c4', '#b9793e'],
        sand: ['#fff0c4', '#c89545'],
        mist: ['#efffff', '#8eb9c8'],
        poison: ['#efffdc', '#9d52c4'],
        shadow: ['#e7ddff', '#55408f'],
        curse: ['#f1d7ff', '#9b57e8'],
        psy: ['#ffe0fb', '#d05dcc'],
        bless: ['#fffbe0', '#ffd45b'],
        almighty: ['#fff8d0', '#d7a244']
    },

    transformationElement: {
        tanjiro: 'fire', rengoku: 'fire', luffy: 'fire', naruto: 'fire',
        giyu: 'water', kisame: 'water', byakuya: 'wind', sanemi: 'wind',
        muichiro: 'mist', toshiro: 'ice', rukia: 'ice', zenitsu: 'elec',
        enel: 'elec', gaara: 'sand', sasori: 'sand', sasuke: 'elec',
        gojo: 'psy', sukuna: 'curse', ichigo: 'curse', kokushibo: 'curse'
    },

    info(profile = {}) {
        const family = this.palette[profile.family] ? profile.family : 'melee';
        const fallback = this.palette[family];
        const character = String(profile.characterId || '').toLowerCase().replace(/[^a-z0-9_]/g, '_');
        const element = String(profile.element || (profile.transformed ? profile.transformElement : '') || '').toLowerCase();
        const colors = this.elementPalette[element]
            || this.characterPalette[character]
            || this.generatedCharacterPalette(character, fallback);
        return { family, primary: colors[0], secondary: colors[1], character, element };
    },

    generatedCharacterPalette(characterId, fallback) {
        if (!characterId) return fallback;
        const seed = this.hash(characterId);
        const hue = seed % 360;
        const sat = 64 + ((seed >>> 8) % 16);
        const light = 58 + ((seed >>> 16) % 10);
        const hsl = (h, s, l) => `hsl(${h} ${s}% ${l}%)`;
        return [hsl(hue, sat, Math.min(82, light + 25)), hsl((hue + 28) % 360, sat + 4, light - 8)];
    },

    hash(value) {
        let result = 2166136261;
        for (const char of String(value || '')) {
            result ^= char.charCodeAt(0);
            result = Math.imul(result, 16777619);
        }
        return result >>> 0;
    },

    removeLater(node, ttl) {
        if (!node) return null;
        setTimeout(() => node.remove(), ttl);
        return node;
    },

    make(parent, phase, profile = {}, options = {}) {
        if (!parent) return null;
        const meta = this.info(profile);
        const node = document.createElement('div');
        const styleClass = String(profile.style || '').replace(/[^a-z0-9-]/gi, '');
        const impactClass = String(profile.impactStyle || '').replace(/[^a-z0-9-]/gi, '');
        const bladeClass = profile.bladeVariant ? `vfx-blade-${String(profile.bladeVariant).replace(/[^a-z0-9-]/gi, '')}` : '';
        const energyClass = profile.energyVariant ? `vfx-energy-${String(profile.energyVariant).replace(/[^a-z0-9-]/gi, '')}` : '';
        node.className = ['vfx-pro', `vfx-pro--${meta.family}`, `vfx-pro--${phase}`, profile.slug || '', styleClass ? `vfx-style-${styleClass}` : '', bladeClass, energyClass, impactClass ? `vfx-impact-${impactClass}` : '', options.trail ? 'vfx-pro--trail' : '', options.multi ? 'vfx-pro--multi' : ''].filter(Boolean).join(' ');
        node.style.setProperty('--vfx-primary', meta.primary);
        node.style.setProperty('--vfx-secondary', meta.secondary);
        const variant = this.hash(`${profile.slug}:${phase}`);
        node.style.setProperty('--vfx-seed', `${(variant % 100) / 100}`);
        node.style.setProperty('--vfx-tilt', `${(variant % 71) - 35}deg`);
        node.style.setProperty('--vfx-shear', `${(variant >>> 7) % 31 - 15}deg`);
        node.style.setProperty('--vfx-span', `${.75 + ((variant >>> 13) % 55) / 100}`);
        node.style.setProperty('--vfx-orbit', `${120 + ((variant >>> 19) % 240)}deg`);
        if (options.dx != null) node.style.setProperty('--vfx-dx', `${Math.round(options.dx)}px`);
        if (options.dy != null) node.style.setProperty('--vfx-dy', `${Math.round(options.dy)}px`);
        if (options.delay != null) node.style.animationDelay = `${options.delay}ms`;

        ['halo', 'trail', 'core', 'accent'].forEach((part) => {
            const child = document.createElement('i');
            child.className = `vfx-pro__${part}`;
            node.appendChild(child);
        });
        if (profile.style === 'elastic-pistol' && ['charge', 'emit', 'trail', 'impact'].includes(phase)) {
            const flipbook = document.createElement('i');
            const variant = phase === 'charge' ? 'charge' : phase === 'impact' ? 'impact' : 'travel';
            flipbook.className = `vfx-pro__flipbook vfx-pro__flipbook--gum-pistol-${variant}`;
            node.appendChild(flipbook);
        }
        const shardCount = phase === 'impact' ? (meta.family === 'finisher' ? 12 + (variant % 5) : 6 + (variant % 5)) : (meta.family === 'barrage' ? 4 + (variant % 4) : 3 + (variant % 3));
        for (let index = 0; index < shardCount; index += 1) {
            const shard = document.createElement('b');
            shard.className = 'vfx-pro__shard';
            shard.style.setProperty('--vfx-i', index);
            shard.style.setProperty('--vfx-angle', `${(360 / shardCount) * index + (this.hash(`${profile.slug}:${index}`) % 18) - 9}deg`);
            node.appendChild(shard);
        }
        parent.appendChild(node);
        return this.removeLater(node, options.ttl ?? (phase === 'impact' ? 720 : 640));
    },

    classes(kind, profile, extra = '') {
        return ['skfx', kind ? `skfx-${kind}` : '', profile?.fxType || '', profile?.slug || '', profile?.family ? `fam-${profile.family}` : '', extra].filter(Boolean).join(' ').trim();
    },

    spawn(parent, className, ttl = 600) {
        if (!parent) return null;
        const node = document.createElement('div');
        node.className = className;
        parent.appendChild(node);
        return this.removeLater(node, ttl);
    },

    charge(parent, profile, ttl = 560) { return this.make(parent, 'charge', profile, { ttl }); },
    cast(parent, profile, isSupport = false, ttl = 620) { return this.make(parent, isSupport ? 'support' : 'emit', profile, { ttl }); },
    arc(parent, profile, ttl = 600) { return this.make(parent, profile?.family === 'blade' ? 'slash' : 'trail', profile, { ttl, trail: true }); },
    impact(parent, profile, multi = false, ttl = 720) { return this.make(parent, 'impact', profile, { ttl, multi }); },
    ring(parent, profile, ttl = 620) { return this.make(parent, 'ring', profile, { ttl }); },
    spark(parent, profile, sx = 0, sy = 0, ttl = 420) { return this.make(parent, 'spark', profile, { ttl, dx: sx, dy: sy }); },
    cut(parent, profile, ttl = 480) { return this.make(parent, 'cut', { ...profile, family: 'blade' }, { ttl, trail: true }); },
    bolt(parent, profile, dx, dy, options = {}) { return this.make(parent, 'projectile', profile, { ttl: options.ttl ?? 680, dx, dy, delay: options.delay, trail: !!options.trail }); },
    spriteBurst(parent, profile, ttl = 520) { return this.make(parent, 'burst', profile, { ttl }); },

    aoePulse(root, profile, ttl = 760) {
        const layer = root?.querySelector('#battle-fx');
        return this.make(layer || root, 'arena', { ...profile, family: profile?.family || 'finisher' }, { ttl });
    },

    typeFlash(root, fxType, ttl = 420) {
        const layer = root?.querySelector('#battle-fx');
        if (!layer) return null;
        return this.make(layer, 'flash', { fxType, family: this.familyForType(fxType) }, { ttl });
    },

    familyForType(type) {
        if (type === 'fire') return 'inferno';
        if (['ice', 'water', 'wind'].includes(type)) return 'element';
        if (type === 'elec') return 'lightning';
        if (['curse', 'psy'].includes(type)) return 'hex';
        if (type === 'almighty') return 'finisher';
        return 'melee';
    }
};

if (typeof window !== 'undefined') window.EffectManager = EffectManager;
