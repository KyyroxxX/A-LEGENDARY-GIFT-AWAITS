/**
 * Audio Manager — SFX + real OST playback via YouTube (fallback: local mp3, then synth).
 *
 * Themes:
 *  - stardew → default site vibe
 *  - bleach  → character select (Number One / sword energy)
 *  - battle_* → encounter BGM keyed by enemies (no Stalemate bias)
 */
const AudioManager = {
    ctx: null,
    enabled: true,
    masterGain: null,
    masterVolume: 0.55,
    muted: false,
    _volumeBeforeMute: 0.55,
    musicGain: null,
    /** Logical mix buses — master × category. */
    BUS_KEYS: ['music', 'ui', 'attack', 'impact', 'skill', 'ultimate', 'death', 'gacha', 'voice'],
    DEFAULT_BUS_VOLUMES: {
        music: 1,
        ui: 1,
        attack: 1,
        impact: 1,
        skill: 1,
        ultimate: 1,
        death: 1,
        gacha: 1,
        voice: 1.35
    },
    busVolumes: null,
    busGains: null,
    _toneCategory: 'ui',
    musicNodes: [],
    currentTheme: null,
    musicInterval: null,
    htmlAudio: null,
    battleRotateTimer: null,
    themeRotatePoll: null,
    ytPlayer: null,
    ytReady: false,
    ytLoading: null,
    musicGen: 0,
    _themeRequest: 0,
    nowPlaying: null,
    _unlocked: false,
    _lastShout: null,
    MAX_VOICE_SECONDS: 12,
    // Only technique-specific clips with a reliable title/source are allowed.
    // Missing, wrong or overlong clips become technique-themed SFX, never a
    // copied voice from another character.
    VERIFIED_VOICE_KEYS: new Set([
        'aizen-kyoka', 'byakuya-byakurai', 'diavolo-doppio', 'dio-road',
        'itachi-sharingan', 'itachi-tsukuyomi', 'jotaro-star-platinum',
        'kakashi-doton', 'naruto-bijuu-roar', 'naruto-kage-bunshin',
        'sasuke-katon',
        // Strict <=5s Zedge acquisition targets. Runtime duration validation
        // still rejects a stale/failed download before any audio is played.
        'naruto-rasengan', 'sasuke-chidori', 'sasuke-sharingan',
        'ichigo-getsuga', 'ichigo-bankai', 'jotaro-ora', 'dio-the-world',
        'giorno-mudas', 'itachi-amaterasu', 'kakashi-raiton',
        'luffy-gum-pistol', 'zoro-oni-giri', 'gaara-sabaku',
        'byakuya-senbon', 'renji-bankai-r', 'toshiro-hyorin', 'rukia-sode',
        'sanji-diable', 'law-room', 'kira-bomb', 'diavolo-king-crimson',
        // Jujutsu Kaisen — drop ≤5s clips from Zedge into assets/voices/ with these names
        'gojo-blue', 'gojo-red', 'gojo-hollow-purple', 'gojo-infinity-guard',
        'yuji-divergent-fist', 'yuji-black-flash-y', 'megumi-divine-dogs', 'megumi-nue',
        'nobara-resonance', 'nobara-hairpin', 'sukuna-dismantle', 'sukuna-cleave',
        'mahito-idle-transfig', 'jogo-maximum-meteor', 'todo-boogie', 'nanami-ratio'
    ]),

    // Skill ids in the battle data are not always the same as the filename
    // used by the sourced clip. These aliases stay inside the same character.
    VOICE_ALIASES: {
        crocodile: { desert_spada: 'desert', ground_death: 'ground' },
        dio: { the_world: 'the-world', road: 'road' },
        diavolo: { king_crimson: 'king-crimson' },
        enel: { el_thor: 'el-thor' },
        gaara: { sand_bind: 'sand-bind' },
        giorno: { muda: 'mudas', ge_heal: 'ge-heal', ge_team: 'ge-team' },
        grimmjow: { desgarron: 'desgarron', pantera: 'pantera' },
        itachi: { amaterasu: 'amaterasu', sharingan: 'sharingan' },
        jolyne: { ora: 'ora-jolyne', stone_free: 'stone-free' },
        joseph: { your_next: 'your-next' },
        jotaro: { ora: 'ora', ora_overdrive: 'ora-overdrive', time_stop: 'time-stop' },
        kakashi: { sharingan_k: 'sharingan', share_info: 'share-info' },
        luffy: { gear_second: 'gear-second', king_kong: 'king-kong' },
        naruto: { kage_bunshin: 'kage-bunshin', bijuu_roar: 'bijuu-roar' },
        orihime: { heal_wave: 'heal-wave' },
        orochimaru: { regen_oro: 'heal-oro' },
        renji: { bankai_r: 'bankai-r' },
        rukia: { san_no_mai: 'san-no-mai' },
        sakura: { cherry_punch: 'cherry-punch', heal_sakura: 'heal-sakura' },
        sanji: { party_food: 'party-food', sky_walk: 'sky-walk' },
        sasuke: { sharingan_s: 'sharingan', sharingan_counter: 'sharingan-counter' },
        shikamaru: { kage_shibari: 'kage-shibari', kage_kubishibari: 'kage-kubishibari' },
        toshiro: { frost_debuff: 'frost-debuff', ice_focus: 'ice-focus' },
        zabuza: { hidden_mist: 'hidden-mist' },
        zoro: { iron_body: 'iron-body', kiki_kyu_ten: 'kiki-kyu-ten' }
    },

    /** Local files first; youtubeId used when files are missing. */
    PLAYLIST: {
        stardew: [
            { src: 'assets/music/stardew.mp3', youtube: 'wJWksPWDKOc', weight: 1, label: 'Stardew' },
            { src: 'assets/music/stardew-cloud-country.mp3', youtube: 'wJWksPWDKOc', weight: 1, label: 'Cloud Country' }
        ],

        /** Hub / village (Naruto peaceful) */
        konoha: [
            { youtube: 'qAGvQDoL5s4', weight: 3, label: 'Afternoon of Konoha' },
            { youtube: 'YlYqQZcB1c0', weight: 2.5, label: 'Daylight of Konoha' },
            { youtube: 'S4dBbG3WU2k', weight: 2, label: 'Konoha Peace' },
            { youtube: '0qZGzqW7V8Y', weight: 1.5, label: 'Naruto Daily Life' },
            { youtube: '5kQybVJa9AM', weight: 2, label: 'Samidare · lluvia' }
        ],

        /** Arena menu — mezcla de series, rota */
        arena_mix: [
            { youtube: 'daFi4MScfl8', weight: 3, label: 'OP · Overtaken' },
            { youtube: 'bfW6dzCFy2A', weight: 3, label: 'OP · Overtaken Epic' },
            { youtube: 'EJi4ElFl2EA', weight: 3, label: 'Naruto · Reverse Situation' },
            { youtube: '4NDfNmfdhTM', weight: 2.5, label: 'Naruto · Akatsuki' },
            { youtube: '7JEjQG4-tpU', weight: 3, label: 'Bleach · Number One' },
            { youtube: 'jBhM-b93bsY', weight: 2, label: 'Bleach · Precipice of Defeat' },
            { youtube: 'RfKgol6t58Q', weight: 2.5, label: 'JoJo · Final Battle' },
            { youtube: 'U0TXIXTzJEY', weight: 2.5, label: "JoJo · il vento d'oro" },
            { youtube: 'h_9RC8DCEPM', weight: 2.5, label: 'JJK · Malevolent Shrine' },
            { youtube: 'O6Y9y2kOy0w', weight: 3, label: 'Metaphor · Battle Theme' },
            { youtube: 'lvuHvXsZPrk', weight: 2.5, label: 'Persona 5 · Rivers in the Desert' },
            { youtube: 'ZNGqBDRJgvo', weight: 2.5, label: 'Persona 5 · Last Surprise' },
            { youtube: 'glo0lQfTpIs', weight: 2, label: 'Persona 4 · Reach Out to the Truth' }
        ],

        /** Character select */
        bleach: [
            { src: 'assets/music/bleach-sword.mp3', youtube: '7JEjQG4-tpU', weight: 3.5, label: 'Number One - Bankai' },
            { src: 'assets/music/bleach-number-one.mp3', youtube: '7nQAGywy3Rw', weight: 2.5, label: 'Number One (VIZ)' },
            { youtube: 'jBhM-b93bsY', weight: 2.5, label: 'On the Precipice of Defeat' },
            { youtube: 'GwIEDIxuXQU', weight: 1.5, label: 'Precipice · Full' },
            { src: 'assets/music/bleach.mp3', youtube: '7JEjQG4-tpU', weight: 1, label: 'Number One' }
        ],

        /* ── Gacha menus por banner ── */
        menu_op: [
            { youtube: 'daFi4MScfl8', startSeconds: 8, weight: 1, label: 'One Piece · Overtaken' }
        ],
        menu_naruto: [
            { youtube: 'qAGvQDoL5s4', weight: 3, label: 'Afternoon of Konoha' },
            { youtube: '5kQybVJa9AM', weight: 3, label: 'Samidare' },
            { youtube: 'EJi4ElFl2EA', weight: 2.5, label: 'Reverse Situation' },
            { youtube: 'P6naO7tVcHg', weight: 2, label: 'Loneliness' },
            { youtube: 'YlYqQZcB1c0', weight: 2, label: 'Daylight of Konoha' }
        ],
        menu_jojo: [
            { youtube: 'U0TXIXTzJEY', weight: 4, label: "il vento d'oro" },
            { youtube: '-W8MBjTk2E8', weight: 3, label: 'Awaken' },
            { youtube: 'RfKgol6t58Q', weight: 2.5, label: 'Final Battle' },
            { youtube: 'ayTe5S42guI', weight: 2, label: 'Killer' },
            { youtube: 'lRrOLTHu-ew', weight: 1.5, label: 'Pillar Men' }
        ],
        menu_bleach: [
            { youtube: '7JEjQG4-tpU', weight: 4, label: 'Number One - Bankai' },
            { youtube: 'jBhM-b93bsY', weight: 3, label: 'Precipice of Defeat' },
            { youtube: '7nQAGywy3Rw', weight: 2.5, label: 'Number One' },
            { youtube: 'GwIEDIxuXQU', weight: 2, label: 'Precipice · Full' }
        ],
        menu_jjk: [
            /* Official OP MVs — Kaikai Kitan is the default banner bed */
            { youtube: '1tk1pqwrOys', weight: 8, label: 'Kaikai Kitan · Eve (OP1)' },
            { youtube: 'fhzKLBZJC3w', weight: 5, label: 'SPECIALZ · King Gnu (OP S2)' },
            { youtube: '8nNujr378EA', weight: 3, label: 'VIVID VICE · Who-ya (OP2)' },
            { youtube: 'GwaRztMaoY0', weight: 2, label: 'Kaikai Kitan · Crunchyroll OP' }
        ],

        menu_kimetsu: [
            { youtube: 'CwkzK-F0Y00', weight: 1, label: 'Gurenge · LiSA (OP1)', endSeconds: 110 }
        ],

        menu_chainsaw: [
            { youtube: 'M2cckDmNLMI', weight: 10, label: 'KICK BACK · Kenshi Yonezu' }
        ],

        /* Metaphor: ReFantazio — banner / convene */
        menu_metaphor: [
            { youtube: 'O6Y9y2kOy0w', weight: 5, label: 'Battle Theme (iconic)' },
            { youtube: 'aQJluJSvCMI', weight: 4, label: 'Rival Candidates' },
            { youtube: 'ezr_MVvEhqs', weight: 3.5, label: 'The Power of Hope' },
            { youtube: 'HV_AGsXaijc', weight: 2.5, label: "Akademeia" }
        ],

        battle_persona: [
            { youtube: 'ZNGqBDRJgvo', weight: 4, label: 'Persona 5 · Last Surprise' },
            { youtube: 'lvuHvXsZPrk', weight: 3.5, label: 'Persona 5 · Rivers in the Desert' },
            { youtube: 'glo0lQfTpIs', weight: 3, label: 'Persona 4 · Reach Out to the Truth' },
            { youtube: 'O6Y9y2kOy0w', weight: 2.5, label: 'Metaphor · Battle Theme' },
            { youtube: 'aQJluJSvCMI', weight: 2, label: 'Metaphor · Rival Candidates' }
        ],
        battle_metaphor: [
            { youtube: 'O6Y9y2kOy0w', weight: 5, label: 'Metaphor · Battle Theme' },
            { youtube: 'aQJluJSvCMI', weight: 4, label: 'Metaphor · Rival Candidates' },
            { youtube: 'ezr_MVvEhqs', weight: 3.5, label: 'Metaphor · The Power of Hope' },
            { youtube: 'HV_AGsXaijc', weight: 3, label: 'Metaphor · Akademeia' },
            { youtube: 'ZNGqBDRJgvo', weight: 2, label: 'Persona 5 · Last Surprise' },
            { youtube: 'lvuHvXsZPrk', weight: 1.5, label: 'Persona 5 · Rivers in the Desert' }
        ],

        /** Convene / wish cinematic bed (local, loops during pull FX) */
        gacha_convene: [
            { src: 'assets/music/gacha-convene.mp3', weight: 5, label: 'Convene', loop: true }
        ],

        /* ── Naruto battles ── */
        battle: [
            { id: 'reverse', youtube: 'EJi4ElFl2EA', weight: 3.5, label: 'Reverse Situation' },
            { id: 'akatsuki', youtube: '4NDfNmfdhTM', weight: 2.5, label: 'Akatsuki' },
            { id: 'samidare', youtube: '5kQybVJa9AM', weight: 2.5, label: 'Samidare' },
            { id: 'lonely', youtube: 'P6naO7tVcHg', weight: 2, label: 'Loneliness' },
            { id: 'stalemate', youtube: '5Yo5SoZcAUg', weight: 1.5, label: 'Stalemate' },
            { youtube: 'O6Y9y2kOy0w', weight: 2.5, label: 'Metaphor · Battle Theme' },
            { youtube: 'ZNGqBDRJgvo', weight: 2.5, label: 'Persona 5 · Last Surprise' },
            { youtube: 'lvuHvXsZPrk', weight: 2, label: 'Persona 5 · Rivers in the Desert' },
            { youtube: 'glo0lQfTpIs', weight: 2, label: 'Persona 4 · Reach Out to the Truth' }
        ],
        battle_akatsuki: [
            { youtube: '4NDfNmfdhTM', weight: 5, label: 'Akatsuki' },
            { youtube: 'P6naO7tVcHg', weight: 3, label: 'Loneliness' },
            { youtube: 'EJi4ElFl2EA', weight: 2.5, label: 'Reverse Situation' },
            { youtube: '5Yo5SoZcAUg', weight: 1.5, label: 'Stalemate' }
        ],
        battle_snake: [
            { youtube: 'EJi4ElFl2EA', weight: 5, label: 'Reverse Situation' },
            { youtube: 'P6naO7tVcHg', weight: 3, label: 'Loneliness' },
            { youtube: '4NDfNmfdhTM', weight: 2, label: 'Dark Tension' },
            { youtube: '5kQybVJa9AM', weight: 2, label: 'Samidare' }
        ],
        battle_mist: [
            { youtube: 'EJi4ElFl2EA', weight: 4, label: 'Reverse Situation' },
            { youtube: '5kQybVJa9AM', weight: 3, label: 'Samidare' },
            { youtube: 'P6naO7tVcHg', weight: 2.5, label: 'Loneliness' },
            { youtube: '4NDfNmfdhTM', weight: 2, label: 'Tension' }
        ],

        /* ── One Piece battles ── */
        battle_op: [
            { youtube: 'daFi4MScfl8', weight: 5, label: 'Overtaken' },
            { youtube: 'bfW6dzCFy2A', weight: 4.5, label: 'Overtaken Epic' },
            { youtube: 'LSGNI--qh_E', weight: 4, label: 'Epic Soundtrack Collection' },
            { youtube: 'V3r-YGGsKpk', weight: 3, label: 'Epic Battle Mix' },
            { youtube: 'QGbeqYJAUAc', weight: 2, label: 'Grand Line' }
        ],
        battle_enel: [
            { youtube: 'bfW6dzCFy2A', weight: 5, label: 'Overtaken Epic' },
            { youtube: 'daFi4MScfl8', weight: 4, label: 'Overtaken' },
            { youtube: 'V3r-YGGsKpk', weight: 3.5, label: 'Epic Battle Mix' },
            { youtube: 'LSGNI--qh_E', weight: 3, label: 'Epic Soundtrack Collection' }
        ],
        battle_doflamingo: [
            { youtube: 'LSGNI--qh_E', weight: 5, label: 'Epic Soundtrack Collection' },
            { youtube: 'bfW6dzCFy2A', weight: 4, label: 'Overtaken Epic' },
            { youtube: 'daFi4MScfl8', weight: 3.5, label: 'Overtaken' },
            { youtube: 'V3r-YGGsKpk', weight: 2.5, label: 'Epic Battle Mix' }
        ],

        /* ── JoJo battles ── */
        battle_jojo: [
            { youtube: 'U0TXIXTzJEY', weight: 4, label: "il vento d'oro" },
            { youtube: 'RfKgol6t58Q', weight: 4, label: 'Final Battle (DIO)' },
            { youtube: 'ayTe5S42guI', weight: 3.5, label: 'Killer (Kira)' },
            { youtube: '-W8MBjTk2E8', weight: 3.5, label: 'Awaken' },
            { youtube: 'lRrOLTHu-ew', weight: 2, label: 'Pillar Men' }
        ],
        battle_jojo_kira: [
            { youtube: 'ayTe5S42guI', weight: 6, label: 'Killer (Kira)' },
            { youtube: 'RfKgol6t58Q', weight: 2.5, label: 'Final Battle' },
            { youtube: '-W8MBjTk2E8', weight: 2, label: 'Awaken' },
            { youtube: 'U0TXIXTzJEY', weight: 1.5, label: "il vento d'oro" }
        ],
        battle_jojo_dio: [
            { youtube: 'RfKgol6t58Q', weight: 6, label: 'Final Battle (DIO)' },
            { youtube: '-W8MBjTk2E8', weight: 3.5, label: 'Awaken' },
            { youtube: 'ayTe5S42guI', weight: 2, label: 'Killer' },
            { youtube: 'lRrOLTHu-ew', weight: 2, label: 'Pillar Men' }
        ],

        /* ── Bleach battles ── */
        battle_bleach: [
            { youtube: '7JEjQG4-tpU', weight: 5, label: 'Number One - Bankai' },
            { youtube: 'jBhM-b93bsY', weight: 4, label: 'Precipice of Defeat' },
            { youtube: '7nQAGywy3Rw', weight: 3, label: 'Number One' },
            { youtube: 'GwIEDIxuXQU', weight: 2.5, label: 'Precipice · Full' }
        ],
        battle_aizen: [
            { youtube: '7JEjQG4-tpU', weight: 5, label: 'Number One - Bankai' },
            { youtube: 'jBhM-b93bsY', weight: 4.5, label: 'Precipice of Defeat' },
            { youtube: 'GwIEDIxuXQU', weight: 3, label: 'Precipice · Full' },
            { youtube: '7nQAGywy3Rw', weight: 2.5, label: 'Number One' }
        ],
        battle_kenpachi: [
            { youtube: '7JEjQG4-tpU', weight: 5.5, label: 'Number One - Bankai' },
            { youtube: 'jBhM-b93bsY', weight: 3.5, label: 'Precipice of Defeat' },
            { youtube: '7nQAGywy3Rw', weight: 2.5, label: 'Number One' }
        ],

        /* ── Jujutsu Kaisen ── */
        battle_jjk: [
            { youtube: 'h_9RC8DCEPM', weight: 5, label: 'Malevolent Shrine' },
            { youtube: 'EJi4ElFl2EA', weight: 2, label: 'Tension' },
            { youtube: '4NDfNmfdhTM', weight: 1.5, label: 'Dark bed' },
            { youtube: '1tk1pqwrOys', weight: 2, label: 'JJK · Kaikai Kitan' },
            { youtube: 'fhzKLBZJC3w', weight: 2, label: 'JJK · SPECIALZ' },
            { youtube: '8nNujr378EA', weight: 1.5, label: 'JJK · VIVID VICE' }
        ],
        battle_jjk_sukuna: [
            { youtube: 'h_9RC8DCEPM', weight: 6, label: 'Malevolent Shrine' },
            { youtube: 'jBhM-b93bsY', weight: 2, label: 'Precipice energy' },
            { youtube: 'RfKgol6t58Q', weight: 1.5, label: 'Final pressure' }
        ],
        battle_jjk_gojo: [
            { youtube: 'h_9RC8DCEPM', weight: 4, label: 'Malevolent Shrine' },
            { youtube: '7JEjQG4-tpU', weight: 3, label: 'Number One energy' },
            { youtube: 'U0TXIXTzJEY', weight: 2, label: 'Golden wind bed' }
        ],

        /* ── Kimetsu no Yaiba ── */
        battle_kimetsu: [
            { youtube: 'CwkzK-F0Y00', weight: 4, label: 'Gurenge · Kimetsu', endSeconds: 110 },
            { youtube: 'I-MOWW4Io6I', weight: 3, label: 'Kimetsu · Battle Themes' },
            { youtube: 'nioQfmYE1Bk', weight: 3, label: 'Akaza · Infinity Castle' },
            { youtube: 'O6Y9y2kOy0w', weight: 1.5, label: 'Metaphor · Battle Theme' }
        ],
        battle_kimetsu_kokushibo: [
            { youtube: 'I-MOWW4Io6I', weight: 4, label: 'Kokushibo · Battle Themes' },
            { youtube: 'CwkzK-F0Y00', weight: 3, label: 'Gurenge · Kimetsu', endSeconds: 110 },
            { youtube: 'nioQfmYE1Bk', weight: 2.5, label: 'Infinity Castle · Battle' }
        ],
        battle_kimetsu_akaza: [
            { youtube: 'nioQfmYE1Bk', weight: 5, label: 'Akaza · Infinity Castle' },
            { youtube: 'I-MOWW4Io6I', weight: 3, label: 'Akaza · Battle Themes' },
            { youtube: 'CwkzK-F0Y00', weight: 2.5, label: 'Gurenge · Kimetsu', endSeconds: 110 }
        ],

        /* ── Chainsaw Man ── */
        battle_chainsaw: [
            { youtube: 'M2cckDmNLMI', weight: 8, label: 'KICK BACK' },
            { youtube: 'bfW6dzCFy2A', weight: 2, label: 'Pressure bed' }
        ],
        battle_chainsaw_makima: [
            { youtube: 'M2cckDmNLMI', weight: 5, label: 'KICK BACK' },
            { youtube: 'h_9RC8DCEPM', weight: 4, label: 'Control pressure' },
            { youtube: 'jBhM-b93bsY', weight: 2, label: 'Dark ritual' }
        ],

        battle_destiny: [
            { youtube: 'RfKgol6t58Q', weight: 3.5, label: 'Final Battle' },
            { youtube: '7JEjQG4-tpU', weight: 3.5, label: 'Number One' },
            { youtube: 'bfW6dzCFy2A', weight: 3, label: 'Overtaken Epic' },
            { youtube: 'h_9RC8DCEPM', weight: 3, label: 'Malevolent Shrine' },
            { youtube: '4NDfNmfdhTM', weight: 2, label: 'Akatsuki' },
            { youtube: 'daFi4MScfl8', weight: 2, label: 'Overtaken' }
        ]
    },

    _lastTrackKey: null,
    /** Soft safety net only — prefer natural track end, never mid-song cuts. */
    ROTATE_MS_MIN: 480000,
    ROTATE_MS_MAX: 720000,
    _musicFadeTimer: null,
    _conveneSavedTheme: null,
    _targetMusicVol: 1,

    init() {
        if (this.ctx) return;
        try {
            const savedVol = (typeof GameState !== 'undefined' && GameState.get)
                ? Number(GameState.get('masterVolume'))
                : this.masterVolume;
            if (Number.isFinite(savedVol)) this.masterVolume = Math.max(0, Math.min(1, savedVol));

            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.ctx.destination);

            this._ensureBuses();

            this.htmlAudio = new Audio();
            this.htmlAudio.loop = true;
            this.htmlAudio.preload = 'auto';
            this.htmlAudio.volume = Math.min(1, this.masterVolume * this._busLevel('music') * 0.9);
            this.htmlAudio.addEventListener('ended', () => {
                if (this._themeRotates(this.currentTheme)) {
                    this._softRotateNext();
                }
            });
        } catch (e) {
            console.warn('Web Audio not available');
        }
        this._ensureYtApi();
    },

    _ensureBuses() {
        if (!this.busVolumes) {
            const saved = (typeof GameState !== 'undefined' && GameState.get)
                ? GameState.get('audioVolumes')
                : null;
            this.busVolumes = { ...this.DEFAULT_BUS_VOLUMES, ...(saved || {}) };
        }
        if (!this.ctx) return;
        if (!this.busGains) this.busGains = {};
        this.BUS_KEYS.forEach((key) => {
            const level = key === 'music' ? this._busLevel(key) * 0.4 : this._busLevel(key);
            if (!this.busGains[key]) {
                const g = this.ctx.createGain();
                g.gain.value = level;
                g.connect(this.masterGain);
                this.busGains[key] = g;
            } else {
                this.busGains[key].gain.value = level;
            }
        });
        this.musicGain = this.busGains.music;
    },

    _busLevel(category) {
        if (!this.busVolumes) this.busVolumes = { ...this.DEFAULT_BUS_VOLUMES };
        const v = Number(this.busVolumes[category]);
        return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 1;
    },

    /** Resolve WebAudio bus for a logical category. Falls back to master. */
    bus(category = 'ui') {
        this.init();
        this._ensureBuses();
        if (this.busGains && this.busGains[category]) return this.busGains[category];
        return this.masterGain;
    },

    setBusVolume(category, value) {
        if (!this.BUS_KEYS.includes(category)) return;
        if (!this.busVolumes) this.busVolumes = { ...this.DEFAULT_BUS_VOLUMES };
        const vol = Math.max(0, Math.min(1, Number(value)));
        this.busVolumes[category] = vol;
        if (typeof GameState !== 'undefined' && GameState.set) {
            GameState.set('audioVolumes', { ...this.busVolumes });
        }
        this._ensureBuses();
        if (category === 'music') {
            if (this.musicGain) this.musicGain.gain.value = vol * 0.4;
            if (this.htmlAudio) this.htmlAudio.volume = Math.min(1, this.masterVolume * vol * 0.9);
            if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
                try {
                    this.ytPlayer.setVolume(Math.round(this.masterVolume * vol * 100));
                } catch (_) { /* */ }
            }
        }
        if (category === 'voice' && this._voiceAudio) {
            this._voiceAudio.volume = Math.min(1, this.masterVolume * vol * 0.95);
        }
        return vol;
    },

    getBusVolume(category) {
        return this._busLevel(category);
    },

    /** Run a block of synthesized tones through a category bus. */
    withCategory(category, fn) {
        const prev = this._toneCategory;
        this._toneCategory = category || 'ui';
        try {
            return fn();
        } finally {
            this._toneCategory = prev;
        }
    },

    /** 0..1 — always available; 0 = silent. */
    setVolume(v, opts = {}) {
        const vol = Math.max(0, Math.min(1, Number(v)));
        this.masterVolume = vol;
        if (!opts.fromMute) {
            this.muted = vol <= 0.001;
            if (vol > 0.001) this._volumeBeforeMute = vol;
        }
        if (typeof GameState !== 'undefined' && GameState.set) {
            GameState.set('masterVolume', vol);
            GameState.set('soundEnabled', !this.muted);
            GameState.set('soundMuted', !!this.muted);
        }
        this.enabled = true;
        if (this.masterGain) this.masterGain.gain.value = vol;
        const musicBus = this._busLevel('music');
        if (this.htmlAudio) this.htmlAudio.volume = Math.min(1, vol * musicBus * 0.9);
        if (this._voiceAudio) this._voiceAudio.volume = Math.min(1, vol * this._busLevel('voice') * 0.95);
        if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
            try {
                this.ytPlayer.setVolume(Math.round(vol * musicBus * 100));
                if (vol <= 0.001) this.ytPlayer.mute();
                else this.ytPlayer.unMute();
            } catch (_) { /* */ }
        }
        return vol;
    },

    getVolume() {
        return this.masterVolume;
    },

    isMuted() {
        return !!this.muted || this.masterVolume <= 0.001;
    },

    /** Toggle mute; remembers last non-zero volume. Returns new muted state. */
    toggleMute() {
        this.init();
        if (this.isMuted()) {
            const restore = Math.max(0.12, this._volumeBeforeMute || 0.55);
            this.muted = false;
            this.setVolume(restore, { fromMute: true });
            this.playUiClick(true);
            return false;
        }
        if (this.masterVolume > 0.001) this._volumeBeforeMute = this.masterVolume;
        this.playUiClick(false);
        this.muted = true;
        this.setVolume(0, { fromMute: true });
        return true;
    },

    /** Short UI tick for mute/unmute (bypasses master gain so mute still clicks). */
    playUiClick(unmute = false) {
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
            const t0 = this.ctx.currentTime;
            const dest = this.ctx.destination;
            const make = (freq, type, dur, vol, delay, peakAt = 0.02) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, t0 + delay);
                if (unmute) osc.frequency.exponentialRampToValueAtTime(freq * 1.35, t0 + delay + dur);
                else osc.frequency.exponentialRampToValueAtTime(freq * 0.55, t0 + delay + dur);
                gain.gain.setValueAtTime(0.0001, t0 + delay);
                gain.gain.exponentialRampToValueAtTime(vol, t0 + delay + peakAt);
                gain.gain.exponentialRampToValueAtTime(0.0001, t0 + delay + dur);
                osc.connect(gain);
                gain.connect(dest);
                osc.start(t0 + delay);
                osc.stop(t0 + delay + dur + 0.02);
            };
            if (unmute) {
                make(520, 'triangle', 0.09, 0.11, 0);
                make(780, 'sine', 0.12, 0.08, 0.04);
            } else {
                make(340, 'square', 0.07, 0.07, 0);
                make(180, 'triangle', 0.11, 0.06, 0.03);
            }
        } catch (_) { /* ignore */ }
    },

    unlock() {
        this.enabled = true;
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        this._ensureYtApi();
        this.setVolume(this.masterVolume);
        const firstGesture = !this._unlocked;
        this._unlocked = true;
        // Need a gesture before audio works. Restart theme if nothing is audible.
        const theme = this.currentTheme || 'stardew';
        if (firstGesture || !this._isMusicAlive()) {
            this.currentTheme = null;
            this.setTheme(theme);
        }
    },

    _ensureYtApi() {
        if (window.YT && window.YT.Player) {
            this.ytReady = true;
            return Promise.resolve();
        }
        if (this.ytLoading) return this.ytLoading;

        this.ytLoading = new Promise((resolve) => {
            const prev = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (typeof prev === 'function') prev();
                this.ytReady = true;
                resolve();
            };
            if (!document.getElementById('yt-iframe-api')) {
                const tag = document.createElement('script');
                tag.id = 'yt-iframe-api';
                tag.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(tag);
            }
            // If API already mid-load
            const wait = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    clearInterval(wait);
                    this.ytReady = true;
                    resolve();
                }
            }, 200);
            setTimeout(() => clearInterval(wait), 15000);
        });
        return this.ytLoading;
    },

    enable() {
        this.unlock();
        if (typeof GameState !== 'undefined' && GameState.set) GameState.set('soundEnabled', true);
    },

    disable() {
        // Soft mute via volume only.
        this.setVolume(0);
    },

    playTone(freq, duration, type = 'sine', volume = 0.3, delay = 0, category) {
        if (!this.enabled || !this.ctx) return;
        const cat = category || this._toneCategory || 'ui';
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume, this.ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(this.bus(cat));
        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + duration);
    },

    playChord(freqs, duration, type = 'sine', volume = 0.2, category) {
        freqs.forEach((f, i) => this.playTone(f, duration, type, volume * 0.5, i * 0.05, category));
    },

    playNoise(duration = 0.2, volume = 0.18, filterFrequency = 1200, delay = 0, category) {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        const cat = category || this._toneCategory || 'ui';
        const frameCount = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
        const buffer = this.ctx.createBuffer(1, frameCount, this.ctx.sampleRate);
        const channel = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i++) {
            const fade = 1 - (i / frameCount);
            channel[i] = (Math.random() * 2 - 1) * fade;
        }
        const source = this.ctx.createBufferSource();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + delay;
        source.buffer = buffer;
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(filterFrequency, start);
        gain.gain.setValueAtTime(volume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.bus(cat));
        source.start(start);
    },

    stopMusic() {
        this.musicGen++;
        if (this._musicFadeTimer) {
            clearInterval(this._musicFadeTimer);
            this._musicFadeTimer = null;
        }
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
        if (this.battleRotateTimer) {
            clearTimeout(this.battleRotateTimer);
            this.battleRotateTimer = null;
        }
        if (this.themeRotatePoll) {
            clearInterval(this.themeRotatePoll);
            this.themeRotatePoll = null;
        }
        this.musicNodes.forEach(n => {
            try { n.stop(); } catch (_) { /* */ }
        });
        this.musicNodes = [];
        if (this.htmlAudio) {
            this.htmlAudio.pause();
            this.htmlAudio.removeAttribute('src');
            try { this.htmlAudio.load(); } catch (_) { /* */ }
        }
        if (this.ytPlayer) {
            try { this.ytPlayer.stopVideo(); } catch (_) { /* */ }
            try { this.ytPlayer.destroy(); } catch (_) { /* */ }
            this.ytPlayer = null;
        }
        const host = document.getElementById('yt-bgm-host');
        if (host) host.innerHTML = '';
        this.nowPlaying = null;
    },

    _musicOutLevel() {
        return Math.min(1, this.masterVolume * this._busLevel('music'));
    },

    _applyMusicOutVolume(norm01) {
        const n = Math.max(0, Math.min(1, Number(norm01) || 0));
        this._targetMusicVol = n;
        const out = this._musicOutLevel() * n;
        if (this.htmlAudio) {
            this.htmlAudio.volume = Math.min(1, out * 0.9);
        }
        if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
            try {
                const v = Math.round(out * 100);
                this.ytPlayer.setVolume(v);
                if (v <= 0) this.ytPlayer.mute();
                else this.ytPlayer.unMute();
            } catch (_) { /* */ }
        }
    },

    _fadeMusicTo(targetNorm, ms = 1600) {
        return new Promise((resolve) => {
            if (this._musicFadeTimer) {
                clearInterval(this._musicFadeTimer);
                this._musicFadeTimer = null;
            }
            const from = Number.isFinite(this._targetMusicVol) ? this._targetMusicVol : 1;
            const to = Math.max(0, Math.min(1, targetNorm));
            const dur = Math.max(120, ms | 0);
            const t0 = performance.now();
            this._musicFadeTimer = setInterval(() => {
                const t = Math.min(1, (performance.now() - t0) / dur);
                const eased = t * t * (3 - 2 * t);
                this._applyMusicOutVolume(from + (to - from) * eased);
                if (t >= 1) {
                    clearInterval(this._musicFadeTimer);
                    this._musicFadeTimer = null;
                    resolve();
                }
            }, 40);
        });
    },

    async _softStopMusic(fadeMs = 1600) {
        try { await this._fadeMusicTo(0, fadeMs); } catch (_) { /* */ }
        this.stopMusic();
    },

    async _softRotateNext() {
        const theme = this.currentTheme;
        const generation = this.musicGen;
        if (!this.enabled || !this._themeRotates(theme)) return;
        try { await this._fadeMusicTo(0, 2600); } catch (_) { /* */ }
        if (!this.enabled || this.currentTheme !== theme || this.musicGen !== generation) return;
        await this._playWeightedBattleTrack(true, { soft: true });
    },

    _pickWeighted(list) {
        const total = list.reduce((s, t) => s + (t.weight || 1), 0);
        let r = Math.random() * total;
        for (const t of list) {
            r -= (t.weight || 1);
            if (r <= 0) return t;
        }
        return list[0];
    },

    _trackKey(t) {
        if (!t) return null;
        return t.id || t.youtube || t.src || t.label || null;
    },

    _pickWeightedExcluding(list, excludeKey) {
        const filtered = (list || []).filter((t) => this._trackKey(t) !== excludeKey);
        return this._pickWeighted(filtered.length ? filtered : list);
    },

    _themeRotates(theme) {
        const th = theme || '';
        return th === 'battle' || th.startsWith('battle_')
            || th.startsWith('menu_') || th === 'arena_mix'
            || th === 'konoha' || th === 'bleach'
            || th === 'hunt' || th === 'boss';
    },

    _scheduleThemeRotate() {
        if (this.battleRotateTimer) {
            clearTimeout(this.battleRotateTimer);
            this.battleRotateTimer = null;
        }
        if (this.themeRotatePoll) {
            clearInterval(this.themeRotatePoll);
            this.themeRotatePoll = null;
        }
        if (!this._themeRotates(this.currentTheme)) return;
        const scheduledTheme = this.currentTheme;
        const scheduledGeneration = this.musicGen;

        const armFromYt = () => {
            try {
                if (this.currentTheme !== scheduledTheme || this.musicGen !== scheduledGeneration) return false;
                if (!this.ytPlayer || typeof this.ytPlayer.getDuration !== 'function') return false;
                const dur = Number(this.ytPlayer.getDuration()) || 0;
                const cur = Number(this.ytPlayer.getCurrentTime()) || 0;
                if (dur < 25) return false;
                const isKimetsu = String(this.currentTheme || '').includes('kimetsu');
                const cleanEnd = isKimetsu ? Number(this.activeTrack?.endSeconds) : 0;
                const tailTrim = String(this.currentTheme || '').startsWith('menu_') ? 9 : 5;
                const remaining = cleanEnd > cur && cleanEnd <= dur + 2
                    ? cleanEnd - cur
                    : dur - cur - tailTrim;
                const remainMs = Math.max(4000, remaining * 1000);
                this.battleRotateTimer = setTimeout(() => {
                    if (this.currentTheme === scheduledTheme && this.musicGen === scheduledGeneration) {
                        this._softRotateNext();
                    }
                }, remainMs);
                return true;
            } catch (_) {
                return false;
            }
        };

        if (armFromYt()) return;

        // Wait until YT reports duration, then arm. Absolute fallback is very long.
        let tries = 0;
        this.themeRotatePoll = setInterval(() => {
            tries += 1;
            if (armFromYt() || tries > 30) {
                clearInterval(this.themeRotatePoll);
                this.themeRotatePoll = null;
            }
        }, 600);
        const span = this.ROTATE_MS_MAX - this.ROTATE_MS_MIN;
        const ms = this.ROTATE_MS_MIN + Math.floor(Math.random() * Math.max(1, span));
        this.battleRotateTimer = setTimeout(() => {
            if (!this.enabled || this.currentTheme !== scheduledTheme || this.musicGen !== scheduledGeneration) return;
            this._softRotateNext();
        }, ms);
    },

    async _tryPlayFile(src, { loop = true } = {}) {
        if (!this.htmlAudio || !src) return false;
        return new Promise((resolve) => {
            const a = this.htmlAudio;
            let settled = false;
            const done = (ok) => {
                if (settled) return;
                settled = true;
                cleanup();
                resolve(ok);
            };
            const onOk = () => {
                a.loop = loop;
                a.play().then(() => done(true)).catch(() => done(false));
            };
            const onErr = () => done(false);
            const cleanup = () => {
                a.removeEventListener('canplaythrough', onOk);
                a.removeEventListener('canplay', onOk);
                a.removeEventListener('error', onErr);
            };
            a.addEventListener('canplaythrough', onOk, { once: true });
            a.addEventListener('canplay', onOk, { once: true });
            a.addEventListener('error', onErr, { once: true });
            a.src = src;
            a.load();
            // Missing files fail via error; slow disks need more than 180ms.
            setTimeout(() => {
                if (!settled && a.readyState >= 2) onOk();
                else if (!settled) onErr();
            }, 2500);
        });
    },

    _isMusicAlive() {
        if (this.musicInterval) return true;
        if (this.htmlAudio && !this.htmlAudio.paused && this.htmlAudio.currentSrc) return true;
        if (this.ytPlayer && typeof this.ytPlayer.getPlayerState === 'function') {
            try {
                const s = this.ytPlayer.getPlayerState();
                // 1 playing, 3 buffering
                return s === 1 || s === 3;
            } catch (_) { /* */ }
        }
        return false;
    },

    _ensureYtHost() {
        let host = document.getElementById('yt-bgm-host');
        if (!host) {
            host = document.createElement('div');
            host.id = 'yt-bgm-host';
            host.setAttribute('aria-hidden', 'true');
            host.style.cssText = 'position:fixed;width:1px;height:1px;left:-9999px;top:0;opacity:0;pointer-events:none;overflow:hidden;';
            document.body.appendChild(host);
        }
        host.innerHTML = '<div id="yt-bgm-player"></div>';
        return 'yt-bgm-player';
    },

    async _playYoutube(videoId, { loop = true, gen = this.musicGen, startSeconds = 0 } = {}) {
        if (!videoId || !this.enabled) return false;
        await this._ensureYtApi();
        if (!this.ytReady || !window.YT || !window.YT.Player) return false;
        if (gen !== this.musicGen) return false;

        // Never layer YT over a local htmlAudio bed
        if (this.htmlAudio) {
            this.htmlAudio.pause();
            this.htmlAudio.removeAttribute('src');
            try { this.htmlAudio.load(); } catch (_) { /* */ }
        }

        // Stop previous YT without bumping musicGen
        if (this.ytPlayer) {
            try { this.ytPlayer.destroy(); } catch (_) { /* */ }
            this.ytPlayer = null;
        }

        const elId = this._ensureYtHost();

        return new Promise((resolve) => {
            let resolved = false;
            const finish = (ok) => {
                if (resolved) return;
                resolved = true;
                resolve(ok);
            };

            try {
                this.ytPlayer = new YT.Player(elId, {
                    width: 1,
                    height: 1,
                    videoId,
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        modestbranding: 1,
                        playsinline: 1,
                        rel: 0,
                        origin: window.location.origin
                    },
                    events: {
                        onReady: (e) => {
                            if (gen !== this.musicGen) {
                                try { e.target.destroy(); } catch (_) { /* */ }
                                return finish(false);
                            }
                            try {
                                const volume = Number.isFinite(AudioManager.masterVolume)
                                    ? AudioManager.masterVolume
                                    : 0.55;
                                const musicBus = AudioManager._busLevel('music');
                                const startAt = Math.max(0, Number(startSeconds) || 0);
                                // Start muted/soft then fade in for pleasant handoffs
                                e.target.setVolume(0);
                                e.target.unMute();
                                if (startAt > 0) e.target.seekTo(startAt, true);
                                e.target.playVideo();
                                AudioManager._targetMusicVol = 0;
                                const fadeIn = Number.isFinite(AudioManager._pendingFadeInMs)
                                    ? AudioManager._pendingFadeInMs
                                    : 1800;
                                AudioManager._fadeMusicTo(1, fadeIn);
                                // Don't resolve true yet — unavailable embeds often fire onReady then onError.
                            } catch (_) {
                                finish(false);
                            }
                        },
                        onStateChange: (e) => {
                            if (gen !== this.musicGen) return;
                            if (e.data === YT.PlayerState.PLAYING) {
                                finish(true);
                                AudioManager._scheduleThemeRotate();
                            } else if (e.data === YT.PlayerState.ENDED) {
                                if (loop) {
                                    try {
                                        const startAt = Math.max(0, Number(startSeconds) || 0);
                                        e.target.seekTo(startAt, true);
                                        e.target.playVideo();
                                    } catch (_) { /* */ }
                                } else if (AudioManager._themeRotates(AudioManager.currentTheme)) {
                                    AudioManager._softRotateNext();
                                }
                            }
                        },
                        onError: () => finish(false)
                    }
                });
            } catch (_) {
                finish(false);
            }

            setTimeout(() => finish(false), 8000);
        });
    },

    async _playTrack(track, { loop = true, gen = this.musicGen, allowYoutube = true } = {}) {
        if (!track || !this.enabled || gen !== this.musicGen) return false;

        if (track.src) {
            const local = await this._tryPlayFile(track.src, { loop });
            if (local && gen === this.musicGen) {
                this.nowPlaying = track.label || track.id || track.src;
                console.info('[BGM]', this.nowPlaying, '(local)');
                return true;
            }
        }

        if (allowYoutube && track.youtube) {
            // Clear failed local src noise
            if (this.htmlAudio) {
                this.htmlAudio.pause();
                this.htmlAudio.removeAttribute('src');
            }
            const yt = await this._playYoutube(track.youtube, {
                loop,
                gen,
                startSeconds: track.startSeconds
            });
            if (yt && gen === this.musicGen) {
                this.nowPlaying = track.label || track.id || track.youtube;
                console.info('[BGM]', this.nowPlaying, '(youtube)');
                return true;
            }
        }
        return false;
    },

    async _playFirstAvailable(tracks, { loop = true, gen = this.musicGen } = {}) {
        for (const t of tracks) {
            if (gen !== this.musicGen) return null;
            const ok = await this._playTrack(t, { loop, gen });
            if (ok) return t;
        }
        return null;
    },

    async _playWeightedBattleTrack(forceRotate = false, opts = {}) {
        if (!this.enabled) return;
        const soft = !!opts.soft;
        const fadeInMs = Number.isFinite(opts.fadeInMs) ? opts.fadeInMs : 1600;
        if (!soft) {
            // Caller did not fade — still avoid a hard click when possible
            try { await this._fadeMusicTo(0, forceRotate ? 900 : 400); } catch (_) { /* */ }
        }
        const gen = ++this.musicGen;
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
        if (this.battleRotateTimer) {
            clearTimeout(this.battleRotateTimer);
            this.battleRotateTimer = null;
        }
        if (this.themeRotatePoll) {
            clearInterval(this.themeRotatePoll);
            this.themeRotatePoll = null;
        }
        this.musicNodes.forEach(n => { try { n.stop(); } catch (_) { /* */ } });
        this.musicNodes = [];
        if (this.htmlAudio) {
            this.htmlAudio.pause();
            this.htmlAudio.removeAttribute('src');
        }
        if (this.ytPlayer) {
            try { this.ytPlayer.destroy(); } catch (_) { /* */ }
            this.ytPlayer = null;
        }

        const themeKey = (this.currentTheme && this.PLAYLIST[this.currentTheme])
            ? this.currentTheme
            : 'battle';
        const list = this.PLAYLIST[themeKey] || this.PLAYLIST.battle;
        const ranked = list.slice().sort((a, b) => (b.weight || 1) - (a.weight || 1));
        const maxW = ranked[0]?.weight || 1;
        const elite = ranked.filter((t) => (t.weight || 1) >= maxW * 0.55);

        let track;
        if (forceRotate) {
            track = this._pickWeightedExcluding(list, this._lastTrackKey);
        } else {
            // First pick among elite signatures — not always the #1 track
            track = this._pickWeighted(elite.length ? elite : ranked);
        }

        const preferYt = this._themeRotates(themeKey);
        const loop = false; // rotate on natural end instead of infinite loop of one OST
        this._pendingFadeInMs = fadeInMs;
        let ok = false;
        const tryPlay = async (t) => {
            if (!t) return false;
            if (preferYt && t.youtube) {
                const yt = await this._playYoutube(t.youtube, {
                    loop,
                    gen,
                    startSeconds: t.startSeconds
                });
                if (yt) {
                    this._clearSynthOnly();
                    this._lastTrackKey = this._trackKey(t);
                    this.activeTrack = t;
                    this.nowPlaying = t.label || t.youtube;
                    console.info('[BGM]', this.nowPlaying, `(${themeKey})`);
                    this._scheduleThemeRotate();
                    return true;
                }
            }
            const played = await this._playTrack(t, { loop, gen });
            if (played) {
                this._lastTrackKey = this._trackKey(t);
                this.activeTrack = t;
                this._applyMusicOutVolume(0);
                this._fadeMusicTo(1, this._pendingFadeInMs || 1600);
                this._scheduleThemeRotate();
            }
            return !!played;
        };

        ok = await tryPlay(track);
        if (!ok && gen === this.musicGen) {
            for (const t of ranked) {
                if (t === track) continue;
                if (await tryPlay(t)) { ok = true; break; }
            }
        }
        // YouTube-only playlists can wipe the synth bed and then fail → silence.
        if (!ok && gen === this.musicGen && this.enabled) {
            const bed = (this.currentTheme === 'bleach') ? 'bleach'
                : (this.currentTheme === 'stardew') ? 'stardew'
                : (this.currentTheme === 'menu_op') ? 'onepiece'
                : 'konoha';
            this._startSynthTheme(bed);
            console.warn('[BGM] all tracks failed for', themeKey, '· synth bed');
        }
    },

    setTheme(theme, opts = {}) {
        const map = {
            intro: 'stardew',
            letter: 'stardew',
            destiny: 'stardew',
            gacha: 'menu_op',
            final: 'stardew',
            stardew: 'stardew',
            hub: 'konoha',
            legendary: 'legendary',
            hunt: 'arena_mix',
            boss: 'battle_destiny',
            // Banner aliases
            onepiece: 'menu_op',
            naruto: 'menu_naruto',
            jojo: 'menu_jojo',
            bleach_menu: 'menu_bleach',
            jjk: 'menu_jjk',
            kimetsu: 'menu_kimetsu',
            chainsaw: 'menu_chainsaw',
            metaphor: 'menu_metaphor'
        };
        const resolved = map[theme] || theme;
        if (resolved === this.currentTheme && this._isMusicAlive()) return;
        const request = ++this._themeRequest;

        this.currentTheme = resolved;
        if (!this.enabled) {
            this.stopMusic();
            return;
        }

        // Banner switches want a snappy handoff; battle rotates stay longer/softer.
        const outMs = Number.isFinite(opts.fadeMs)
            ? Math.max(60, opts.fadeMs)
            : (this._isMusicAlive() ? 1400 : 80);
        const inMs = Number.isFinite(opts.fadeInMs)
            ? Math.max(60, opts.fadeInMs)
            : (outMs < 500 ? 450 : 1800);

        const handoff = async () => {
            if (resolved === 'menu_op') {
                this.stopMusic();
                this._startSynthTheme('onepiece');
            } else {
                await this._softStopMusic(outMs);
            }
            if (request !== this._themeRequest || this.currentTheme !== resolved || !this.enabled) return;
            const gen = this.musicGen;

            if (resolved === 'legendary') {
                this._startSynthTheme('legendary');
                return;
            }

            if (resolved === 'stardew') {
                this._startSynthTheme('stardew');
                this._upgradeToTracks(this.PLAYLIST.stardew, {
                    loop: true, gen, preferYoutube: false, allowYoutube: false
                });
                return;
            }

            if (this.PLAYLIST[resolved] && this._themeRotates(resolved)) {
                if (resolved === 'konoha' || resolved === 'bleach' || resolved.startsWith('menu_')) {
                    const synthTheme = resolved === 'bleach'
                        ? 'bleach'
                        : resolved === 'menu_op' ? 'onepiece' : 'konoha';
                    this._startSynthTheme(synthTheme);
                }
                this.musicGen = gen;
                this._playWeightedBattleTrack(false, { soft: true, fadeInMs: inMs });
                return;
            }

            this._startSynthTheme('konoha');
            this._upgradeToTracks(this.PLAYLIST.konoha || [], { loop: true, gen, preferYoutube: true });
        };
        handoff();
    },

    async _upgradeToTracks(tracks, {
        loop = true,
        gen = this.musicGen,
        preferYoutube = false,
        allowYoutube = true
    } = {}) {
        if (!this.enabled || gen !== this.musicGen) return;
        const ordered = preferYoutube
            ? [...tracks].sort((a, b) => (b.youtube ? 1 : 0) - (a.youtube ? 1 : 0))
            : tracks;

        for (const t of ordered) {
            if (gen !== this.musicGen || !this.enabled) return;

            if (preferYoutube && allowYoutube && t.youtube) {
                const yt = await this._playYoutube(t.youtube, {
                    loop,
                    gen,
                    startSeconds: t.startSeconds
                });
                if (yt && gen === this.musicGen && this._isMusicAlive()) {
                    this._clearSynthOnly();
                    this.activeTrack = t;
                    this.nowPlaying = t.label || t.youtube;
                    console.info('[BGM]', this.nowPlaying, '(youtube)');
                    return;
                }
                // Fake YT "ready" without audio → keep trying / keep synth
                continue;
            }

            const ok = await this._playTrack(t, { loop, gen, allowYoutube });
            if (ok && gen === this.musicGen) {
                this.activeTrack = t;
                // Only drop synth when local/YT is truly playing
                if (this.htmlAudio && !this.htmlAudio.paused && this.htmlAudio.currentSrc) {
                    this._clearSynthOnly();
                    if (this.ytPlayer) {
                        try { this.ytPlayer.stopVideo(); } catch (_) { /* */ }
                        try { this.ytPlayer.destroy(); } catch (_) { /* */ }
                        this.ytPlayer = null;
                    }
                    return;
                }
                if (allowYoutube && this._isMusicAlive()) {
                    this._clearSynthOnly();
                    return;
                }
            }
        }
        // All tracks failed → synth bed (if any) keeps playing
        if (gen === this.musicGen && !this._isMusicAlive() && this.currentTheme) {
            this._startSynthTheme(this.currentTheme === 'stardew' ? 'stardew' : this.currentTheme);
        }
    },

    _clearSynthOnly() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
        this.musicNodes.forEach(n => { try { n.stop(); } catch (_) { /* */ } });
        this.musicNodes = [];
    },

    _startSynthTheme(theme) {
        this._clearSynthOnly();
        if (!this.enabled || !this.ctx) return;

        const beds = {
            stardew: {
                sequence: [
                    [262, 330, 392], [294, 370, 440], [330, 392, 494], [294, 370, 440],
                    [220, 330, 392], [247, 370, 440], [262, 330, 523], [247, 311, 392]
                ],
                interval: 1400, type: 'triangle', vol: 0.055
            },
            /** Warm Konoha afternoon — never dark/scary sawtooth */
            konoha: {
                sequence: [
                    [392, 494, 587], [349, 440, 523], [330, 415, 494], [294, 370, 440],
                    [262, 330, 392], [294, 370, 440], [330, 415, 494], [349, 440, 523]
                ],
                interval: 1600, type: 'sine', vol: 0.05
            },
            bleach: {
                sequence: [
                    [110, 165, 220], [123, 185, 247], [130, 196, 261], [98, 147, 196],
                    [82, 123, 165], [110, 165, 220], [146, 220, 293], [98, 147, 196]
                ],
                interval: 520, type: 'sawtooth', vol: 0.045
            },
            legendary: {
                sequence: [[196, 247, 294], [220, 277, 330], [247, 311, 370], [262, 330, 392]],
                interval: 500, type: 'sine', vol: 0.08
            },
            onepiece: {
                sequence: [[196, 247, 294], [220, 277, 330], [247, 294, 370], [175, 220, 262]],
                interval: 1350, type: 'triangle', vol: 0.045
            }
        };

        const bed = beds[theme] || beds.konoha || beds.stardew;
        let step = 0;
        const playStep = () => {
            if (!this.enabled) return;
            const chord = bed.sequence[step % bed.sequence.length];
            chord.forEach((note, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = bed.type;
                osc.frequency.value = note;
                const t0 = this.ctx.currentTime + i * 0.03;
                gain.gain.setValueAtTime(bed.vol, t0);
                gain.gain.exponentialRampToValueAtTime(0.001, t0 + bed.interval / 1000 * 0.85);
                osc.connect(gain);
                gain.connect(this.musicGain);
                osc.start(t0);
                osc.stop(t0 + bed.interval / 1000);
                this.musicNodes.push(osc);
            });
            step++;
        };
        playStep();
        this.musicInterval = setInterval(playStep, bed.interval);
    },

    /**
     * Play Japanese technique voice. Returns a Promise that resolves when the
     * clip finishes (never truncated in code — full file plays).
     */
    shout(text, meta = {}) {
        if (!this.enabled) return Promise.resolve(0);
        // Never use speechSynthesis / AI TTS — only real anime voice clips.
        try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (_) { /* */ }

        const shoutId = `${meta.charId || ''}:${meta.skillId || meta.type || text || ''}`;
        const now = Date.now();
        if (this._lastShout
            && this._lastShout.charId === (meta.charId || '')
            && now - this._lastShout.at < 1400) {
            return Promise.resolve(0);
        }
        this._lastShout = { id: shoutId, charId: meta.charId || '', at: now };
        return Promise.resolve(0);
    },

    /**
     * Voice files: assets/voices/personaje-tecnica.mp3
     * Example: itachi-sharingan.mp3, sasuke-chidori-nagashi.mp3
     * skill ids use hyphens; sharingan_s / sharingan_k -> sharingan.
     */
    skillVoiceSlug(skillId) {
        if (!skillId) return '';
        if (skillId === 'sharingan_s' || skillId === 'sharingan_k' || skillId === 'sharingan_i') return 'sharingan';
        return String(skillId).replace(/_/g, '-');
    },

    voiceFileKey(charId, skillId) {
        if (!charId) return null;
        if (skillId) {
            const alias = this.VOICE_ALIASES[charId]?.[skillId];
            return `${charId}-${alias || this.skillVoiceSlug(skillId)}`;
        }
        return `${charId}-attack`;
    },

    _resolveVoiceKey(text, meta = {}) {
        const skillId = meta.skillId || '';
        const charId = meta.charId || '';
        if (charId) {
            return this.voiceFileKey(charId, skillId || null);
        }
        if (meta.voice) return meta.voice;
        return null;
    },

    _playVoiceClip(fileKey, meta = {}) {
        return new Promise((resolve) => {
            try {
                if (this._voiceAudio) {
                    try { this._voiceAudio.pause(); } catch (_) { /* */ }
                    this._voiceAudio = null;
                }
                if (this._voiceCapTimer) {
                    clearTimeout(this._voiceCapTimer);
                    this._voiceCapTimer = null;
                }
                const START_DELAY_MS = 60;
                const a = new Audio(`assets/voices/${fileKey}.mp3?v=15`);
                const volume = Number.isFinite(this.masterVolume) ? this.masterVolume : 0.55;
                a.volume = Math.min(1, volume * this._busLevel('voice') * 1.15);
                a.preload = 'auto';
                this._voiceAudio = a;
                let settled = false;
                let started = false;
                const done = (ms) => {
                    if (settled) return;
                    settled = true;
                    if (this._voiceCapTimer) { clearTimeout(this._voiceCapTimer); this._voiceCapTimer = null; }
                    resolve(Math.max(0, ms || 0));
                };
                const PACE_RESOLVE_MS = 520;
                const fallback = () => {
                    const attackKey = meta.charId ? this.voiceFileKey(meta.charId, null) : null;
                    if (!meta.skillId && attackKey && attackKey !== fileKey && !meta._triedAttackFallback) {
                        this._playVoiceClip(attackKey, { ...meta, _triedAttackFallback: true });
                        return;
                    }
                    this.sfx.skill(meta.type || 'strike', meta.skillId || '');
                };
                a.onended = () => done(Math.round((a.currentTime || a.duration || 0) * 1000));
                a.onerror = () => { fallback(); done(200); };
                const startPlayback = () => {
                    if (started || settled) return;
                    started = true;
                    a.play().catch(() => { fallback(); done(200); });
                };
                a.oncanplay = startPlayback;
                a.onloadedmetadata = () => {
                    if (!Number.isFinite(a.duration) || a.duration <= 0) {
                        try { a.pause(); } catch (_) { /* */ }
                        fallback();
                        done(200);
                        return;
                    }
                    // Long clips: still play, hard-stop at MAX so combat pacing stays tight
                    if (a.duration > this.MAX_VOICE_SECONDS) {
                        this._voiceCapTimer = setTimeout(() => {
                            try { a.pause(); } catch (_) { /* */ }
                            done(Math.round(this.MAX_VOICE_SECONDS * 1000));
                        }, Math.round(this.MAX_VOICE_SECONDS * 1000) + START_DELAY_MS);
                    }
                    setTimeout(startPlayback, START_DELAY_MS);
                    setTimeout(() => done(PACE_RESOLVE_MS), PACE_RESOLVE_MS + START_DELAY_MS);
                };
                this._voiceCapTimer = setTimeout(() => {
                    if (started || settled) return;
                    try { a.pause(); } catch (_) { /* */ }
                    fallback();
                    done(200);
                }, 4500);
                a.load();
            } catch (_) {
                this.sfx.skill(meta.type || 'strike', meta.skillId || '');
                resolve(450);
            }
        });
    },

    sfx: {
        button() {
            AudioManager.withCategory('ui', () => {
                AudioManager.playTone(800, 0.1, 'sine', 0.2);
                AudioManager.playTone(1200, 0.08, 'sine', 0.15, 0.05);
            });
        },
        drawer() {
            AudioManager.withCategory('ui', () => {
                AudioManager.playTone(90, 0.18, 'square', 0.12);
                AudioManager.playTone(140, 0.25, 'sawtooth', 0.08, 0.08);
                AudioManager.playTone(60, 0.2, 'triangle', 0.1, 0.2);
            });
        },
        paper() {
            AudioManager.withCategory('ui', () => {
                AudioManager.playTone(200, 0.3, 'triangle', 0.15);
                AudioManager.playTone(150, 0.2, 'sawtooth', 0.1, 0.1);
                AudioManager.playTone(320, 0.12, 'triangle', 0.08, 0.15);
            });
        },
        collect() {
            AudioManager.withCategory('ui', () => {
                AudioManager.playTone(880, 0.15, 'sine', 0.25);
                AudioManager.playTone(1320, 0.2, 'sine', 0.2, 0.08);
            });
        },
        attack() {
            AudioManager.withCategory('attack', () => {
                AudioManager.playTone(300, 0.1, 'square', 0.2);
                AudioManager.playTone(200, 0.15, 'sawtooth', 0.15, 0.05);
            });
        },
        anticipate() {
            AudioManager.withCategory('attack', () => {
                AudioManager.playTone(180, 0.12, 'triangle', 0.12);
                AudioManager.playTone(240, 0.1, 'sine', 0.08, 0.06);
            });
        },
        skill(type = 'strike', skillId = '') {
            AudioManager.withCategory('skill', () => {
                const id = String(skillId).toLowerCase();
                const eye = /sharingan|byakugan|genjutsu|kyoka|scan|oeil|time.stop|world|erase/.test(id);
                const heal = /heal|regen|restore|revive|food|soten|santen/.test(id);
                const shadow = /shadow|kage.shibari|kage.kubishibari|curse|cero|getsuga.black|menacing/.test(`${id} ${type}`);
                const element = eye ? 'psy' : (heal ? 'heal' : (shadow ? 'curse' : type));
                if (element === 'elec') {
                    AudioManager.playNoise(0.28, 0.2, 4200);
                    [1450, 900, 1900].forEach((f, i) => AudioManager.playTone(f, 0.08, 'square', 0.12, i * 0.055));
                } else if (element === 'fire') {
                    AudioManager.playNoise(0.42, 0.24, 900);
                    AudioManager.playTone(115, 0.35, 'sawtooth', 0.18);
                } else if (element === 'wind') {
                    AudioManager.playNoise(0.48, 0.2, 2400);
                    AudioManager.playTone(540, 0.3, 'sine', 0.11, 0.04);
                } else if (element === 'water' || element === 'ice') {
                    AudioManager.playNoise(0.32, 0.12, element === 'ice' ? 5200 : 1500);
                    [880, 1320, 1760].forEach((f, i) => AudioManager.playTone(f, 0.22, 'sine', 0.1, i * 0.045));
                } else if (element === 'slash' || element === 'pierce') {
                    AudioManager.playNoise(0.2, 0.22, 3600);
                    AudioManager.playTone(element === 'pierce' ? 1700 : 980, 0.16, 'sawtooth', 0.13);
                } else if (element === 'heal' || element === 'bless' || element === 'support') {
                    const notes = element === 'heal' ? [523, 659, 784] : [392, 587, 880];
                    notes.forEach((f, i) => AudioManager.playTone(f, 0.38, 'sine', 0.13, i * 0.08));
                } else if (element === 'psy' || element === 'curse') {
                    AudioManager.playTone(80, 0.5, 'sine', 0.18);
                    AudioManager.playTone(element === 'psy' ? 1180 : 145, 0.42, 'sawtooth', 0.1, 0.05);
                    AudioManager.playNoise(0.3, 0.1, 700, 0.05);
                } else {
                    AudioManager.playNoise(0.16, 0.2, 1000);
                    AudioManager.playTone(125, 0.24, 'square', 0.2);
                }
            });
        },
        ultimate() {
            AudioManager.withCategory('ultimate', () => {
                AudioManager.playNoise(0.5, 0.22, 1800);
                [98, 130, 196, 262, 330].forEach((f, i) => AudioManager.playTone(f, 0.36, 'sawtooth', 0.12, i * 0.05));
                AudioManager.playTone(520, 0.45, 'triangle', 0.14, 0.22);
            });
        },
        allOut() {
            AudioManager.withCategory('ultimate', () => {
                AudioManager.playNoise(0.65, 0.24, 2200);
                [110, 147, 196, 294].forEach((f, i) => AudioManager.playTone(f, 0.42, 'sawtooth', 0.13, i * 0.055));
            });
        },
        dodge() {
            AudioManager.withCategory('impact', () => {
                AudioManager.playTone(600, 0.08, 'sine', 0.2);
                AudioManager.playTone(900, 0.12, 'sine', 0.15, 0.04);
            });
        },
        perfectDodge() {
            AudioManager.withCategory('impact', () => {
                AudioManager.playChord([523, 659, 784, 1047], 0.4, 'sine', 0.3);
                AudioManager.playTone(1200, 0.3, 'sine', 0.2, 0.1);
            });
        },
        hit() {
            AudioManager.withCategory('impact', () => {
                AudioManager.playTone(150, 0.2, 'sawtooth', 0.3);
                AudioManager.playTone(80, 0.3, 'square', 0.2, 0.05);
            });
        },
        combo() {
            AudioManager.withCategory('impact', () => {
                AudioManager.playTone(440 + Math.random() * 200, 0.1, 'sine', 0.15);
            });
        },
        bossHit() {
            AudioManager.withCategory('death', () => {
                AudioManager.playTone(100, 0.3, 'square', 0.4);
                AudioManager.playTone(60, 0.4, 'sawtooth', 0.3, 0.1);
            });
        },
        death() {
            AudioManager.withCategory('death', () => {
                AudioManager.playNoise(0.35, 0.18, 700);
                AudioManager.playTone(90, 0.4, 'sawtooth', 0.28);
                AudioManager.playTone(55, 0.55, 'sine', 0.2, 0.08);
            });
        },
        victory() {
            AudioManager.withCategory('ui', () => {
                const notes = [523, 587, 659, 784, 880, 1047];
                notes.forEach((n, i) => AudioManager.playTone(n, 0.3, 'sine', 0.25, i * 0.15));
            });
        },
        pullStart() {
            /* WuWa convene: low whoosh + rising crystalline charge */
            AudioManager.withCategory('gacha', () => {
                AudioManager.playNoise(0.55, 0.16, 900, 0, 'gacha');
                AudioManager.playNoise(0.35, 0.1, 2400, 0.12, 'gacha');
                AudioManager.playTone(110, 0.55, 'sine', 0.14, 0, 'gacha');
                AudioManager.playTone(165, 0.45, 'triangle', 0.1, 0.08, 'gacha');
                AudioManager.playTone(520, 0.28, 'sine', 0.08, 0.22, 'gacha');
                AudioManager.playTone(780, 0.22, 'sine', 0.07, 0.34, 'gacha');
            });
        },
        pullUpgrade() {
            /* Ladder climb ping — bright shimmer */
            AudioManager.withCategory('gacha', () => {
                AudioManager.playNoise(0.18, 0.08, 3200, 0, 'gacha');
                AudioManager.playTone(660, 0.1, 'sine', 0.16, 0, 'gacha');
                AudioManager.playTone(990, 0.12, 'sine', 0.14, 0.06, 'gacha');
                AudioManager.playTone(1320, 0.16, 'triangle', 0.12, 0.12, 'gacha');
                AudioManager.playTone(1760, 0.2, 'sine', 0.08, 0.18, 'gacha');
            });
        },
        pullLock() {
            AudioManager.withCategory('gacha', () => {
                AudioManager.playNoise(0.22, 0.1, 520, 0, 'gacha');
                AudioManager.playTone(92, 0.42, 'triangle', 0.18, 0, 'gacha');
                AudioManager.playTone(184, 0.3, 'sine', 0.1, 0.12, 'gacha');
            });
        },
        pullConverge() {
            AudioManager.withCategory('gacha', () => {
                [196, 247, 294, 392].forEach((f, i) => AudioManager.playTone(f, 0.32, 'triangle', 0.1, i * 0.055, 'gacha'));
                AudioManager.playNoise(0.18, 0.08, 3600, 0.12, 'gacha');
            });
        },
        pullLaunch() {
            AudioManager.withCategory('gacha', () => {
                AudioManager.playNoise(0.42, 0.16, 2400, 0, 'gacha');
                AudioManager.playTone(58, 0.32, 'sine', 0.2, 0, 'gacha');
                AudioManager.playTone(116, 0.24, 'sawtooth', 0.12, 0.08, 'gacha');
                AudioManager.playTone(880, 0.16, 'square', 0.08, 0.2, 'gacha');
            });
        },
        pullCharacterReveal() {
            AudioManager.withCategory('gacha', () => {
                AudioManager.playNoise(0.26, 0.12, 4200, 0, 'gacha');
                AudioManager.playChord([523, 659, 784], 0.34, 'sine', 0.18, 'gacha');
                AudioManager.playTone(1047, 0.48, 'triangle', 0.14, 0.18, 'gacha');
            });
        },
        pullCommon() {
            AudioManager.withCategory('gacha', () => {
                AudioManager.playNoise(0.12, 0.06, 1800, 0, 'gacha');
                AudioManager.playTone(380, 0.16, 'triangle', 0.14, 0, 'gacha');
                AudioManager.playTone(520, 0.12, 'sine', 0.08, 0.06, 'gacha');
            });
        },
        pullRare() {
            AudioManager.withCategory('gacha', () => {
                AudioManager.playNoise(0.2, 0.09, 2200, 0, 'gacha');
                AudioManager.playChord([440, 554, 659], 0.28, 'sine', 0.2, 'gacha');
                AudioManager.playTone(880, 0.22, 'triangle', 0.1, 0.14, 'gacha');
            });
        },
        pullEpic() {
            AudioManager.withCategory('gacha', () => {
                AudioManager.playNoise(0.35, 0.12, 1600, 0, 'gacha');
                AudioManager.playNoise(0.22, 0.08, 3600, 0.1, 'gacha');
                AudioManager.playChord([330, 415, 523, 659], 0.42, 'sine', 0.22, 'gacha');
                AudioManager.playTone(784, 0.28, 'triangle', 0.12, 0.16, 'gacha');
                AudioManager.playTone(1175, 0.32, 'sine', 0.1, 0.28, 'gacha');
            });
        },
        pullLegendary() {
            /* Gold break: deep boom + cascading crystal fanfare */
            AudioManager.withCategory('gacha', () => {
                AudioManager.playNoise(0.5, 0.18, 700, 0, 'gacha');
                AudioManager.playTone(70, 0.55, 'sine', 0.22, 0, 'gacha');
                AudioManager.playTone(140, 0.4, 'triangle', 0.12, 0.05, 'gacha');
                const notes = [523, 659, 784, 988, 1175, 1480];
                notes.forEach((n, i) => AudioManager.playTone(n, 0.32, 'sine', 0.16, 0.12 + i * 0.07, 'gacha'));
                setTimeout(() => {
                    AudioManager.withCategory('gacha', () => {
                        AudioManager.playNoise(0.4, 0.1, 2800, 0, 'gacha');
                        AudioManager.playChord([659, 831, 988, 1319], 0.85, 'sine', 0.28, 'gacha');
                    });
                }, 520);
            });
        },
        pullMythic() {
            /* Crimson / celestial rupture — darker than gold */
            AudioManager.withCategory('gacha', () => {
                AudioManager.playNoise(0.62, 0.22, 480, 0, 'gacha');
                AudioManager.playNoise(0.4, 0.12, 1800, 0.08, 'gacha');
                AudioManager.playTone(48, 0.7, 'sine', 0.26, 0, 'gacha');
                AudioManager.playTone(96, 0.45, 'sawtooth', 0.1, 0.06, 'gacha');
                AudioManager.playTone(220, 0.35, 'triangle', 0.1, 0.14, 'gacha');
                [392, 494, 587, 740].forEach((n, i) =>
                    AudioManager.playTone(n, 0.28, 'sine', 0.12, 0.22 + i * 0.06, 'gacha'));
                setTimeout(() => {
                    AudioManager.withCategory('gacha', () => {
                        AudioManager.playNoise(0.35, 0.14, 900, 0, 'gacha');
                        AudioManager.playChord([311, 415, 622, 830], 0.9, 'sawtooth', 0.18, 'gacha');
                    });
                }, 480);
            });
        },
        anomaly() {
            AudioManager.withCategory('gacha', () => {
                AudioManager.playTone(50, 0.8, 'sawtooth', 0.3);
                setTimeout(() => AudioManager.playTone(30, 1, 'square', 0.2, 0, 'gacha'), 200);
            });
        },
        reveal() {
            AudioManager.withCategory('gacha', () => {
                AudioManager.playChord([392, 523, 659], 0.6, 'sine', 0.3);
                AudioManager.playTone(880, 0.5, 'sine', 0.25, 0.3);
            });
        },
        copy() {
            AudioManager.withCategory('ui', () => {
                AudioManager.playTone(1000, 0.1, 'sine', 0.2);
                AudioManager.playTone(1500, 0.15, 'sine', 0.15, 0.08);
            });
        },
        achievement() {
            AudioManager.withCategory('ui', () => {
                AudioManager.playTone(392, 0.2, 'triangle', 0.16, 0, 'ui');
                AudioManager.playTone(659, 0.24, 'sine', 0.18, 0.07, 'ui');
                AudioManager.playTone(988, 0.34, 'sine', 0.2, 0.16, 'ui');
                AudioManager.playTone(1319, 0.5, 'triangle', 0.14, 0.27, 'ui');
            });
        }
    },

    /** Semantic facade — preferred call sites for game intent. */
    ui: {
        click() { AudioManager.sfx.button(); },
        drawer() { AudioManager.sfx.drawer(); },
        paper() { AudioManager.sfx.paper(); },
        collect() { AudioManager.sfx.collect(); },
        victory() { AudioManager.sfx.victory(); },
        copy() { AudioManager.sfx.copy(); },
        achievement() { AudioManager.sfx.achievement(); }
    },

    combat: {
        anticipate() { AudioManager.sfx.anticipate(); },
        attack() { AudioManager.sfx.attack(); },
        skill(type, skillId) { AudioManager.sfx.skill(type, skillId); },
        ultimate(meta = {}) {
            if (meta.allOut) AudioManager.sfx.allOut();
            else AudioManager.sfx.ultimate();
        },
        dodge() { AudioManager.sfx.dodge(); },
        perfectDodge() { AudioManager.sfx.perfectDodge(); },
        combo() { AudioManager.sfx.combo(); },
        impact(type = 'hit', meta = {}) {
            if (type === 'null' || type === 'dodge') return AudioManager.sfx.dodge();
            if (type === 'down' || type === 'perfect') return AudioManager.sfx.perfectDodge();
            if (type === 'crit' || meta.crit) {
                AudioManager.sfx.hit();
                AudioManager.sfx.combo();
                return;
            }
            if (type === 'weak') {
                AudioManager.sfx.hit();
                return;
            }
            AudioManager.sfx.hit();
        },
        death(meta = {}) {
            if (meta.heavy) return AudioManager.sfx.bossHit();
            AudioManager.sfx.death();
        },
        allOut() { AudioManager.sfx.allOut(); }
    },

    gacha: {
        start() { AudioManager.sfx.pullStart(); },
        upgrade() { AudioManager.sfx.pullUpgrade(); },
        lock() { AudioManager.sfx.pullLock(); },
        converge() { AudioManager.sfx.pullConverge(); },
        launch() { AudioManager.sfx.pullLaunch(); },
        characterReveal() { AudioManager.sfx.pullCharacterReveal(); },
        reveal(rarity = 'common') {
            const r = String(rarity || 'common').toLowerCase();
            if (r === 'celestial' || r === '7' || r === '7star') return AudioManager.sfx.pullMythic();
            if (r === 'mythic' || r === '6' || r === '6star') return AudioManager.sfx.pullMythic();
            if (r === 'legendary' || r === '5' || r === '5star') return AudioManager.sfx.pullLegendary();
            if (r === 'epic' || r === '4' || r === '4star') return AudioManager.sfx.pullEpic();
            if (r === 'rare') return AudioManager.sfx.pullRare();
            return AudioManager.sfx.pullCommon();
        },
        anomaly() { AudioManager.sfx.anomaly(); },
        revealDone() { AudioManager.sfx.reveal(); },
        async enterConvene() {
            /* Keep banner OST playing during the pull — only duck it under SFX */
            if (!AudioManager.enabled) return;
            if (AudioManager._conveneSavedTheme == null) {
                AudioManager._conveneSavedTheme = AudioManager.currentTheme || 'menu_op';
            }
            AudioManager._conveneMusicNorm = Number.isFinite(AudioManager._targetMusicVol)
                ? AudioManager._targetMusicVol
                : 1;
            try {
                await AudioManager._fadeMusicTo(
                    Math.max(0.28, (AudioManager._conveneMusicNorm || 1) * 0.42),
                    500
                );
            } catch (_) { /* */ }
        },
        async exitConvene() {
            const saved = AudioManager._conveneSavedTheme;
            const restore = AudioManager._conveneMusicNorm != null ? AudioManager._conveneMusicNorm : 1;
            AudioManager._conveneSavedTheme = null;
            AudioManager._conveneMusicNorm = null;
            if (!AudioManager.enabled) return;
            /* Restore volume; re-assert banner theme only if music died mid-pull */
            try {
                if (!AudioManager._isMusicAlive() && saved) {
                    AudioManager.setTheme(saved, { fadeMs: 200, fadeInMs: 700 });
                } else {
                    await AudioManager._fadeMusicTo(restore, 700);
                }
            } catch (_) { /* */ }
        }
    }
};
