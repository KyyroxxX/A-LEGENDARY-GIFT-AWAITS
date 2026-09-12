/* Per-technique authored direction. This is intentionally data-driven so a
   technique can have its own choreography without cloning another move. */
const BattleTechniqueDesigns = {
    _hash(value) {
        let hash = 2166136261;
        for (const char of String(value || '')) {
            hash ^= char.charCodeAt(0);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    },

    _auto(characterId, skillId) {
        const id = String(skillId || '').toLowerCase();
        const seed = this._hash(`${characterId}:${skillId}`);
        const pick = (items) => items[seed % items.length];
        if (/transform|awaken|bankai|gear|kyubi|sharingan|sage|manto|mode|release|true_form|awakening/i.test(id)) {
            return { style: pick(['steam-activation', 'kyubi-awakening', 'sharingan-awakening', 'star-platinum-awakening', 'stone-free-awakening', 'ashura-awakening']), motion: 'awakening', impact: 'form-break', camera: 'reveal-rise' };
        }
        if (/heal|regen|restore|revive|recover|cura|regen/i.test(id)) {
            return { style: pick(['sakura-heal', 'sakura-heal-all', 'crazy-diamond-heal', 'restore-all', 'team-restore', 'kyubi-regen']), motion: 'recovery', impact: 'rebuild-bloom', camera: 'soft-pull' };
        }
        if (/guard|block|stance|counter|protect|def|iron|shield/i.test(id)) {
            return { style: pick(['iron-body', 'precision-guard', 'string-guard', 'sharingan-counter', 'fix-pulse']), motion: 'stance', impact: 'guard-lock', camera: 'locked-frame' };
        }
        if (/slash|sword|blade|oni|giri|cut|saber|senbon|katana|kusanagi|getsuga|shunpo/i.test(id)) {
            return { style: pick(['oni-giri', 'tora-gari', 'tatsumaki', 'string-storm', 'stone-free-string']), motion: 'blade', impact: 'cross-cut', camera: 'side-slice' };
        }
        if (/ora|muda|dora|rush|barrage|gatling|flurry|combo|fist|punch|rush/i.test(id)) {
            return { style: pick(['ora-barrage', 'ora-overdrive', 'dora-barrage', 'elastic-gatling', 'jolyne-ora', 'kyubi-claw']), motion: 'barrage', impact: 'chain-crash', camera: 'rush-track' };
        }
        if (/fire|flame|katon|flame|burn|bomb|explosion|inferno|hawk/i.test(id)) {
            return { style: pick(['katon', 'red-hawk', 'king-kong']), motion: 'projectile-fire', impact: 'ember-bloom', camera: 'heat-wave' };
        }
        if (/thunder|lightning|elec|chidori|raikiri|bolt|rai|storm/i.test(id)) {
            return { style: pick(['thunderbolt', 'chidori', 'chidori-nagashi', 'chidori-spear', 'kirin']), motion: 'projectile', impact: 'sky-split', camera: 'vertical-strike' };
        }
        if (/water|ice|wind|sand|wave|frost|hyorin|splash|shot/i.test(id)) {
            return { style: pick(['water-shot', 'cyclone', 'tatsumaki', 'mirage-veil']), motion: 'projectile-element', impact: 'element-burst', camera: 'fluid-track' };
        }
        if (/shadow|genjutsu|curse|illusion|time|void|control|bind|web|string|psy/i.test(id)) {
            return { style: pick(['genjutsu', 'shadow-clones', 'mirage-veil', 'mobius-strip', 'stone-free-web', 'time-stop']), motion: 'control', impact: 'illusion-fracture', camera: 'dutch-drift' };
        }
        if (/finisher|ultimate|max|god|death|meteor|world|cero|hadou|secret|art/i.test(id)) {
            return { style: pick(['star-breaker', 'king-kong', 'odama-rasengan', 'bijuu-roar', 'menacing-ball']), motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly' };
        }
        return { style: pick(['cherry-punch', 'star-finger', 'dora-punch', 'stone-free-string', 'fix-pulse', 'kiki-kyu-ten']), motion: 'step-in', impact: 'signature-hit', camera: 'micro-lunge' };
    },

    _energyVariant(skillId) {
        const id = String(skillId || '').toLowerCase();
        if (/kirin|el_thor|raigeki|thunder|lightning|chidori|raikiri|bolt/.test(id)) return 'lightning';
        if (/cero|laser|byakurai|beam/.test(id)) return 'laser';
        if (/hadou|kurohitsugi|hollow|fragor/.test(id)) return 'beam';
        if (/rasengan|odama|menacing|plasma|orb/.test(id)) return 'energy-orb';
        if (/frost|ice|hyorin|crystal|glacial/.test(id)) return 'frost-lance';
        if (/meteor|lanza|maximum/.test(id)) return 'meteor';
        return null;
    },

    ENERGY_VARIANTS: {
        nami: { thunderbolt: 'lightning' },
        sasuke: { chidori: 'lightning', chidori_nagashi: 'chain-lightning', chidori_spear: 'laser', kirin: 'lightning' },
        kakashi: { raiton: 'lightning', raikiri_twin: 'chain-lightning' },
        enel: { el_thor: 'lightning' },
        naruto: { rasengan: 'energy-orb', odama: 'energy-orb', menacing_ball: 'plasma' },
        beam: { beam: 'laser' },
        ulquiorra: { cero: 'laser' },
        aizen: { byakurai: 'laser', hadou: 'beam' },
        jogo: { maximum_meteor: 'meteor' },
        toshiro: { hyorin: 'frost-lance' }
    },

    KATANA_VARIANTS: {
        zoro: { oni_giri: 'draw', ashura_ichibugin: 'storm', ul_tora_gari: 'cross', hyakuhachi: 'crescent' },
        ichigo: { getsuga: 'crescent', shunpo_slash: 'iaido', bankai_shunpo: 'storm', getsuga_barrage: 'spiral', dangai_slash: 'cross' },
        byakuya: { senbon: 'storm', senkei_blade: 'spiral', gokei: 'crescent' },
        renji: { higa: 'serpent', hikotsu: 'iaido', zaga_teppo: 'moon', orochio: 'storm' },
        kenpachi: { kendo: 'draw', berserk: 'storm', noza_cleave: 'cross', noza_quake: 'moon', noza_finisher: 'flame-arc' },
        shanks: { divine_departure: 'iaido', haki_slash: 'crescent' },
        mihawk: { kokuto: 'draw', black_blade: 'moon', world_slash: 'waterfall' },
        shunsui: { dual_arc: 'cross', takaoni: 'draw', irooni: 'storm' },
        urahara: { kamisori: 'iaido' },
        ginjo: { scaffold_slash: 'cross', getsuga_stolen: 'moon' },
        tanjiro: { water_surface: 'waterfall', water_wheel: 'spiral', dance_fire: 'flame-arc', burning_bones: 'flame-arc', solar_heat: 'iaido', clear_blue: 'crescent', setting_sun: 'cross' },
        rengoku: { unknowing_fire: 'iaido', rising_scorching: 'flame-arc', blooming_flame: 'crescent', rengoku_form: 'storm', flame_tiger: 'flame-arc', scorching_rush: 'cross' },
        giyu: { water_slash: 'waterfall', flowing_dance: 'serpent', striking_tide: 'spiral', water_dragon: 'crescent', calm_drop: 'iaido' },
        tengen: { roar: 'storm', constant_resounding: 'cross', string_performance: 'spiral', bomb_rush: 'flame-arc', finale: 'moon' },
        sanemi: { dust_whirlwind: 'storm', claws_purifying: 'cross', gale_slash: 'crescent', idaten: 'iaido', cold_mountain: 'waterfall', wind_rage: 'spiral' },
        mitsuri: { first_love: 'serpent', love_pangs: 'crescent', catlove: 'spiral', swinging: 'storm', cathexis: 'cross', love_finale: 'flame-arc' },
        muichiro: { low_clouds: 'waterfall', eight_layered: 'cross', sea_mist: 'serpent', moon_mist: 'crescent', mist_end: 'iaido' },
        obanai: { winding: 'serpent', narrow: 'iaido', slithering: 'serpent', twin_headed: 'cross', serpent_end: 'moon' },
        zenitsu: { thunderclap: 'iaido', sixfold: 'storm', eightfold: 'cross', godspeed_slash: 'crescent', seventh: 'flame-arc' },
        inosuke: { pierce_fang: 'iaido', devour: 'cross', crazy_cutting: 'storm', palisade: 'serpent', king_beast: 'moon' },
        kokushibo: { moonlit: 'crescent', crescent: 'storm', flesh_katana: 'serpent', sixteen_moons: 'spiral', moon_dragon: 'waterfall', umbra: 'moon' },
        maki: { split_soul: 'iaido', zenin_rush: 'cross', clan_purge: 'crescent' },
        toji: { chain_miles: 'serpent', split_soul: 'draw' },
        yuta: { yuta_slash: 'crescent' },
        sukuna: { dismantle: 'iaido', cleave: 'cross', dismantle_max: 'storm', cleave_max: 'moon' },
        law: { shambles: 'waterfall' },
        nanami: { critical_ratio: 'draw' }
    },

    luffy: {
        gum_pistol: { style: 'elastic-pistol', family: 'melee', motion: 'step-in', impact: 'compressed-pop', camera: 'micro-lunge' },
        gum_gatling: { style: 'elastic-gatling', family: 'barrage', motion: 'barrage', impact: 'crossfire-burst', camera: 'handheld-rattle' },
        gear_second: { style: 'steam-activation', family: 'transform', motion: 'awakening', impact: 'steam-release', camera: 'pressure-rise' },
        king_kong: { style: 'king-kong', family: 'finisher', motion: 'finisher', impact: 'crater-break', camera: 'heavy-dolly' },
        jet_pistol: { style: 'jet-pistol', family: 'melee', motion: 'step-in', impact: 'speed-crack', camera: 'snap-zoom' },
        jet_gatling: { style: 'jet-gatling', family: 'barrage', motion: 'barrage', impact: 'compressed-crossfire', camera: 'tracking-rush' },
        soru: { style: 'soru', family: 'control', motion: 'control', impact: 'air-fold', camera: 'whip-pan' },
        red_hawk: { style: 'red-hawk', family: 'inferno', motion: 'projectile-fire', impact: 'ember-bloom', camera: 'warm-impact' }
    },
    zoro: {
        oni_giri: { style: 'oni-giri', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'cross-snap' },
        iron_body: { style: 'iron-body', family: 'stance', motion: 'stance', impact: 'steel-lock', camera: 'locked-frame' },
        tatsumaki: { style: 'tatsumaki', family: 'blade', motion: 'blade', impact: 'cyclone-shear', camera: 'spiral-orbit' },
        ashura: { style: 'ashura-awakening', family: 'transform', motion: 'awakening', impact: 'demon-rise', camera: 'triple-exposure' },
        ashura_ichibugin: { style: 'ashura-ichibugin', family: 'finisher', motion: 'finisher', impact: 'nine-blade-break', camera: 'low-charge' },
        ul_tora_gari: { style: 'tora-gari', family: 'blade', motion: 'blade', impact: 'crossing-pounce', camera: 'side-slice' },
        kiki_kyu_ten: { style: 'kiki-kyu-ten', family: 'projectile', motion: 'projectile', impact: 'air-crescent', camera: 'long-line' },
        hyakuhachi: { style: 'hyakuhachi', family: 'projectile', motion: 'projectile', impact: 'pound-wave', camera: 'recoil-shot' }
    },
    nami: {
        mirage: { style: 'mirage-veil', family: 'hex', motion: 'control', impact: 'image-shatter', camera: 'soft-parallax' },
        water_shot: { style: 'water-shot', family: 'element', motion: 'projectile-element', impact: 'water-splash', camera: 'fluid-track' },
        thunderbolt: { style: 'thunderbolt', family: 'lightning', motion: 'projectile', impact: 'sky-split', camera: 'vertical-strike' },
        cyclone: { style: 'cyclone', family: 'element', motion: 'projectile-element', impact: 'weather-burst', camera: 'orbit-pull' }
    },
    naruto: {
        rasengan: { style: 'rasengan', family: 'spiral', motion: 'projectile', impact: 'orb-crush', camera: 'hand-spin' },
        kage_bunshin: { style: 'shadow-clones', family: 'control', motion: 'control', impact: 'clone-cross', camera: 'split-frame' },
        odama: { style: 'odama-rasengan', family: 'finisher', motion: 'finisher', impact: 'gravity-crush', camera: 'scale-push' },
        kyubi: { style: 'kyubi-awakening', family: 'transform', motion: 'awakening', impact: 'chakra-bloom', camera: 'aura-rise' },
        kyubi_claw: { style: 'kyubi-claw', family: 'barrage', motion: 'barrage', impact: 'claw-rake', camera: 'feral-track' },
        kyubi_regen: { style: 'kyubi-regen', family: 'heal', motion: 'recovery', impact: 'chakra-pulse', camera: 'breath-close' },
        bijuu_roar: { style: 'bijuu-roar', family: 'finisher', motion: 'finisher', impact: 'roar-wave', camera: 'wide-shock' },
        menacing_ball: { style: 'menacing-ball', family: 'spiral', motion: 'projectile', impact: 'black-orb-collapse', camera: 'void-dolly' }
    },
    sasuke: {
        chidori: { style: 'chidori', family: 'lightning', motion: 'projectile', impact: 'piercing-burst', camera: 'forward-lunge' },
        katon: { style: 'katon', family: 'inferno', motion: 'projectile-fire', impact: 'flame-fan', camera: 'heat-wave' },
        chidori_nagashi: { style: 'chidori-nagashi', family: 'lightning', motion: 'barrage', impact: 'ground-current', camera: 'electric-ring' },
        sharingan_s: { style: 'sharingan-awakening', family: 'transform', motion: 'awakening', impact: 'eye-flare', camera: 'iris-push' },
        chidori_spear: { style: 'chidori-spear', family: 'lightning', motion: 'projectile', impact: 'spear-pierce', camera: 'linear-zoom' },
        genjutsu_s: { style: 'genjutsu', family: 'hex', motion: 'control', impact: 'illusion-fracture', camera: 'dutch-drift' },
        kirin: { style: 'kirin', family: 'lightning', motion: 'finisher', impact: 'skyfall', camera: 'sky-drop' },
        sharingan_counter: { style: 'sharingan-counter', family: 'hex', motion: 'stance', impact: 'counter-freeze', camera: 'time-lock' }
    },
    sakura: {
        heal_sakura: { style: 'sakura-heal', family: 'heal', motion: 'recovery', impact: 'petal-seal', camera: 'close-heal' },
        cherry_punch: { style: 'cherry-punch', family: 'melee', motion: 'step-in', impact: 'ground-crack', camera: 'impact-drop' },
        heal_all: { style: 'sakura-heal-all', family: 'heal', motion: 'recovery', impact: 'team-bloom', camera: 'wide-bloom' },
        strength_buff: { style: 'sakura-strength', family: 'support', motion: 'stance', impact: 'power-lock', camera: 'hero-push' }
    },
    jotaro: {
        ora: { style: 'ora-barrage', family: 'barrage', motion: 'barrage', impact: 'ora-impact', camera: 'punch-dolly' },
        star_finger: { style: 'star-finger', family: 'pierce', motion: 'projectile', impact: 'finger-pierce', camera: 'precision-punch' },
        star_platinum: { style: 'star-platinum-awakening', family: 'transform', motion: 'awakening', impact: 'stand-reveal', camera: 'stand-rise' },
        sp_transform: { style: 'star-platinum-transform', family: 'transform', motion: 'awakening', impact: 'stand-flare', camera: 'orbit-reveal' },
        ora_overdrive: { style: 'ora-overdrive', family: 'barrage', motion: 'barrage', impact: 'overdrive-chain', camera: 'rush-shake' },
        time_stop: { style: 'time-stop', family: 'hex', motion: 'control', impact: 'clock-freeze', camera: 'freeze-frame' },
        star_breaker: { style: 'star-breaker', family: 'finisher', motion: 'finisher', impact: 'meteor-fist', camera: 'impact-crash' },
        precision_guard: { style: 'precision-guard', family: 'stance', motion: 'stance', impact: 'perfect-parry', camera: 'locked-parry' }
    },
    josuke: {
        heal_josuke: { style: 'crazy-diamond-heal', family: 'heal', motion: 'recovery', impact: 'repair-burst', camera: 'gentle-pull' },
        dona: { style: 'dora-punch', family: 'melee', motion: 'step-in', impact: 'dora-crack', camera: 'punch-snap' },
        restore_all: { style: 'restore-all', family: 'heal', motion: 'recovery', impact: 'reassembly-wave', camera: 'wide-repair' },
        cd_awaken: { style: 'crazy-diamond-awakening', family: 'transform', motion: 'awakening', impact: 'stand-shine', camera: 'diamond-rise' },
        dora_barrage: { style: 'dora-barrage', family: 'barrage', motion: 'barrage', impact: 'dora-chain', camera: 'rush-track' },
        fix_pulse: { style: 'fix-pulse', family: 'support', motion: 'projectile-element', impact: 'fix-ring', camera: 'object-pan' },
        reflect_fix: { style: 'reflect-fix', family: 'control', motion: 'control', impact: 'return-shatter', camera: 'reverse-pull' },
        team_restore: { style: 'team-restore', family: 'heal', motion: 'recovery', impact: 'team-rebuild', camera: 'full-stage-bloom' }
    },
    jolyne: {
        string: { style: 'stone-free-string', family: 'pierce', motion: 'projectile', impact: 'thread-pierce', camera: 'line-pull' },
        ora_jolyne: { style: 'jolyne-ora', family: 'barrage', motion: 'barrage', impact: 'thread-barrage', camera: 'close-rush' },
        web: { style: 'stone-free-web', family: 'control', motion: 'control', impact: 'web-bind', camera: 'net-expand' },
        sf_awaken: { style: 'stone-free-awakening', family: 'transform', motion: 'awakening', impact: 'string-reveal', camera: 'filament-rise' },
        string_storm: { style: 'string-storm', family: 'blade', motion: 'blade', impact: 'filament-storm', camera: 'spiral-track' },
        mobius: { style: 'mobius-strip', family: 'control', motion: 'control', impact: 'fold-return', camera: 'paper-fold' },
        string_guard: { style: 'string-guard', family: 'stance', motion: 'stance', impact: 'tension-parry', camera: 'taut-lock' },
        sf_beatdown: { style: 'stone-free-beatdown', family: 'finisher', motion: 'finisher', impact: 'thread-breaker', camera: 'cinematic-rush' }
    },

    get(characterId, skillId) {
        const base = this[characterId]?.[skillId] || this._auto(characterId, skillId);
        const variant = this.KATANA_VARIANTS[characterId]?.[skillId];
        const energyVariant = this.ENERGY_VARIANTS[characterId]?.[skillId] || this._energyVariant(skillId);
        return { ...base, bladeVariant: variant || null, energyVariant: energyVariant || null };
    }
};

if (typeof window !== 'undefined') window.BattleTechniqueDesigns = BattleTechniqueDesigns;
