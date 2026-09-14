/* Authentic signature direction — researched look per iconic 5★/6★ move.
 * Merges PER SKILL into BattleTechniqueDesigns (never wipes a character block),
 * so it safely layers over technique-designs.js + the generated
 * signature-designs.js. Load AFTER signature-designs.js.
 * style 'auth-<archetype>' -> css/signature-authentic.css. Rows without `style`
 * keep their existing geometry and only fix family/motion/impact/camera/colors.
 * colors [primary, secondary] ride through skillFxProfile -> EffectManager. */
const SignatureAuthentic = {
    blocks: {
        doflamingo: {
            overheat: { family: 'blade', motion: 'blade', impact: 'chain-crash', camera: 'side-slice', colors: ['#FFD7F2', '#FF2E88'] },
            parasite: { family: 'hex', motion: 'control', impact: 'power-lock', camera: 'locked-frame', colors: ['#F8F8FF', '#C084FC'] },
            ito_awaken: { family: 'transform', motion: 'awakening', impact: 'rebuild-bloom', camera: 'aura-rise', colors: ['#FF7EDB', '#7B2FF7'] }
        },
        zoro: {
            oni_giri: { style: 'auth-blade-draw', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'micro-lunge', colors: ['#E8F4FF', '#00C97B'] },
            tatsumaki: { style: 'auth-blade-storm', family: 'spiral', motion: 'blade', impact: 'sky-split', camera: 'orbit-pull', colors: ['#CFFFF0', '#1A8F5F'] },
            ashura: { style: 'auth-black-flash', family: 'transform', motion: 'awakening', impact: 'form-break', camera: 'stand-rise', colors: ['#8B5CF6', '#0B0B0F'] }
        },
        sanji: {
            diable: { style: 'auth-flame-dance', family: 'inferno', motion: 'step-in', impact: 'ember-bloom', camera: 'heat-wave', colors: ['#FF6A00', '#C1121F'] },
            diable_max: { style: 'auth-flame-eruption', family: 'transform', motion: 'awakening', impact: 'form-break', camera: 'aura-rise', colors: ['#4DC9FF', '#003CFF'] },
            ifrit_kick: { style: 'auth-flame-eruption', family: 'inferno', motion: 'step-in', impact: 'crossfire-burst', camera: 'punch-dolly', colors: ['#33CCFF', '#0B1EFF'] }
        },
        marshall: {
            marshall_strike: { family: 'hex', motion: 'control', impact: 'orb-crush', camera: 'void-dolly', colors: ['#7B2FF7', '#05050A'] },
            marshall_transform: { family: 'transform', motion: 'awakening', impact: 'crater-break', camera: 'scale-push', colors: ['#F2F8FF', '#8ECAE6'] },
            marshall_x_finisher: { family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'wide-shock', colors: ['#FFFFFF', '#7B2FF7'] }
        },
        katakuri: {
            katakuri_strike: { family: 'pierce', motion: 'step-in', impact: 'signature-impact', camera: 'micro-lunge', colors: ['#FFF1F5', '#FF5FA2'] },
            katakuri_transform: { family: 'transform', motion: 'awakening', impact: 'rebuild-bloom', camera: 'aura-rise', colors: ['#FFFFFF', '#FF8FC7'] },
            katakuri_x_finisher: { family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'vertical-strike', colors: ['#FFD6E8', '#2B2B33'] }
        },
        luffy: {
            gum_gatling: { style: 'auth-rubber-barrage', family: 'barrage', motion: 'barrage', impact: 'ora-impact', camera: 'rush-track', colors: ['#FFBF8F', '#D63C2F'] },
            red_hawk: { style: 'auth-flame-eruption', family: 'inferno', motion: 'step-in', impact: 'crossfire-burst', camera: 'punch-dolly', colors: ['#FF4D00', '#7A0D0D'] }
        },
        shanks: {
            divine_departure: { style: 'auth-black-flash', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'snap-zoom', colors: ['#FF3B30', '#0A0A0A'] },
            conqueror: { style: 'auth-black-flash', family: 'hex', motion: 'stance', impact: 'power-lock', camera: 'wide-shock', colors: ['#8B0000', '#000000'] }
        },
        mihawk: {
            kokuto: { style: 'auth-crescent-slash', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'side-slice', colors: ['#00FF87', '#0B0F0C'] },
            world_slash: { style: 'auth-crescent-slash', family: 'finisher', motion: 'finisher', impact: 'sky-split', camera: 'vertical-strike', colors: ['#3DFF8E', '#0A1F14'] }
        },
        marco: {
            marco_strike: { style: 'auth-flame-dance', family: 'inferno', motion: 'step-in', impact: 'flame-fan', camera: 'fluid-track', colors: ['#33CCFF', '#FFE066'] },
            marco_transform: { style: 'auth-heal-glow', family: 'transform', motion: 'awakening', impact: 'rebuild-bloom', camera: 'reveal-rise', colors: ['#00BFFF', '#E6F7FF'] }
        },
        jinbe: {
            jinbe_burst: { style: 'auth-water-wheel', family: 'element', motion: 'projectile-element', impact: 'water-splash', camera: 'fluid-track', colors: ['#1E90FF', '#E6F7FF'] },
            jinbe_guard: { style: 'auth-guard-iron', family: 'support', motion: 'guard', impact: 'guard-lock', camera: 'locked-frame', colors: ['#0A3D62', '#7ED6FF'] }
        },
        sasuke: {
            chidori: { style: 'auth-lightning-hand', family: 'lightning', motion: 'step-in', impact: 'spear-pierce', camera: 'snap-zoom', colors: ['#7FD4FF', '#FFFFFF'] },
            kirin: { style: 'auth-lightning-fall', family: 'lightning', motion: 'finisher', impact: 'sky-split', camera: 'wide-shock', colors: ['#9FD8FF', '#FFF9C4'] },
            katon: { style: 'auth-flame-eruption', family: 'inferno', motion: 'projectile-fire', impact: 'flame-fan', camera: 'heat-wave', colors: ['#FF6A00', '#FFC400'] }
        },
        jiraiya: {
            rasengan_j: { style: 'auth-spiral-orb', family: 'spiral', motion: 'projectile', impact: 'orb-crush', camera: 'micro-lunge', colors: ['#2E86F2', '#BFE6FF'] },
            katon_j: { style: 'auth-flame-eruption', family: 'inferno', motion: 'projectile-fire', impact: 'ember-bloom', camera: 'heat-wave', colors: ['#FF6A00', '#FFD23B'] },
            cho_odama_j: { style: 'auth-spiral-orb', family: 'finisher', motion: 'finisher', impact: 'gravity-crush', camera: 'scale-push', colors: ['#2E86F2', '#FF7A00'] }
        },
        kakashi: {
            raiton: { style: 'auth-lightning-hand', family: 'lightning', motion: 'step-in', impact: 'spear-pierce', camera: 'snap-zoom', colors: ['#7FD4FF', '#FFFFFF'] },
            kamui: { style: 'auth-time-stop', family: 'hex', motion: 'control', impact: 'illusion-fracture', camera: 'void-dolly', colors: ['#FF6A2A', '#1A1A2E'] },
            lightning_hound: { style: 'auth-lightning-hand', family: 'lightning', motion: 'barrage', impact: 'ground-current', camera: 'rush-track', colors: ['#7FD4FF', '#2E86F2'] }
        },
        itachi: {
            amaterasu: { style: 'auth-cursed-slash', family: 'finisher', motion: 'control', impact: 'ember-bloom', camera: 'dutch-drift', colors: ['#FF3B00', '#0A0A0A'] },
            tsukuyomi: { family: 'hex', motion: 'control', impact: 'illusion-fracture', camera: 'dutch-drift', colors: ['#FF1A1A', '#0A0A0A'] },
            amaterasu_x: { style: 'auth-cursed-slash', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly', colors: ['#FF6A00', '#0A0A0A'] }
        },
        hidan: {
            scythe_sweep: { style: 'auth-cursed-slash', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'side-slice', colors: ['#C0392B', '#1A1A1A'] },
            jashin_blood: { family: 'hex', motion: 'control', impact: 'illusion-fracture', camera: 'dutch-drift', colors: ['#C0392B', '#0A0A0A'] },
            jashin_judgment: { style: 'auth-cursed-slash', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly', colors: ['#C0392B', '#FF3B00'] }
        },
        tobi: {
            tobi_strike: { style: 'auth-time-stop', family: 'hex', motion: 'control', impact: 'illusion-fracture', camera: 'void-dolly', colors: ['#FF6A2A', '#1A1A2E'] },
            tobi_eye: { family: 'hex', motion: 'control', impact: 'illusion-fracture', camera: 'dutch-drift', colors: ['#FF1A1A', '#0A0A0A'] },
            tobi_fan: { style: 'auth-black-flash', family: 'melee', motion: 'step-in', impact: 'signature-impact', camera: 'micro-lunge', colors: ['#5D4037', '#FF6A2A'] }
        },
        pain: {
            pain_strike: { family: 'finisher', motion: 'control', impact: 'gravity-crush', camera: 'wide-shock', colors: ['#C9D4FF', '#5D6D7E'] },
            pain_x_strike: { family: 'finisher', motion: 'finisher', impact: 'gravity-crush', camera: 'wide-shock', colors: ['#8E7CC3', '#1A1A2E'] },
            pain_x_finisher: { style: 'auth-blood-orb', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'void-dolly', colors: ['#3B2F4A', '#C9D4FF'] }
        },
        naruto: {
            rasengan: { style: 'auth-spiral-orb', family: 'spiral', motion: 'projectile', impact: 'orb-crush', camera: 'micro-lunge', colors: ['#2E86F2', '#BFE6FF'] },
            menacing_ball: { style: 'auth-blood-orb', family: 'spiral', motion: 'projectile', impact: 'black-orb-collapse', camera: 'void-dolly', colors: ['#1A1A2E', '#9B59B6'] }
        },
        gai: {
            gai_peacock: { style: 'auth-flame-eruption', family: 'barrage', motion: 'barrage', impact: 'crossfire-burst', camera: 'rush-track', colors: ['#FF3B00', '#FFC400'] },
            gai_night: { style: 'auth-black-flash', family: 'melee', motion: 'finisher', impact: 'crater-break', camera: 'heavy-dolly', colors: ['#FF2A1A', '#FFB300'] }
        },
        minato: {
            rasengan_m: { style: 'auth-spiral-orb', family: 'spiral', motion: 'projectile', impact: 'orb-crush', camera: 'micro-lunge', colors: ['#2E86F2', '#BFE6FF'] },
            ftg_raikiri: { style: 'auth-time-stop', family: 'lightning', motion: 'step-in', impact: 'spear-pierce', camera: 'snap-zoom', colors: ['#FFE93B', '#2E86F2'] }
        },
        tsunade: {
            heaven_punch: { style: 'auth-black-flash', family: 'melee', motion: 'step-in', impact: 'crater-break', camera: 'micro-lunge', colors: ['#FFD23B', '#7CFC90'] },
            heal_tsu: { style: 'auth-heal-glow', family: 'heal', motion: 'recovery', impact: 'rebuild-bloom', camera: 'locked-frame', colors: ['#7CFC90', '#FFF8B0'] }
        },
        kisame: {
            water_shark: { style: 'auth-water-wheel', family: 'element', motion: 'projectile-element', impact: 'water-splash', camera: 'fluid-track', colors: ['#2E86C1', '#7FD4FF'] },
            great_shark_max: { style: 'auth-water-wheel', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly', colors: ['#1A5276', '#7FD4FF'] }
        },
        tobirama: {
            tobirama_strike: { style: 'auth-water-wheel', family: 'element', motion: 'projectile-element', impact: 'water-splash', camera: 'fluid-track', colors: ['#2E86C1', '#BFE6FF'] },
            tobirama_x_strike: { style: 'auth-time-stop', family: 'melee', motion: 'step-in', impact: 'signature-impact', camera: 'snap-zoom', colors: ['#FFE93B', '#2E86C1'] }
        },
        konan: {
            konan_strike: { style: 'auth-mist-veil', family: 'pierce', motion: 'projectile', impact: 'spear-pierce', camera: 'orbit-pull', colors: ['#E8DCFF', '#8B5BB3'] },
            konan_x_finisher: { style: 'auth-mist-veil', family: 'finisher', motion: 'finisher', impact: 'crossfire-burst', camera: 'wide-shock', colors: ['#E8DCFF', '#FF6A00'] }
        },
        kimimaro: {
            kimimaro_strike: { style: 'auth-blade-draw', family: 'pierce', motion: 'step-in', impact: 'spear-pierce', camera: 'micro-lunge', colors: ['#EFEFE0', '#8A8F6A'] },
            kimimaro_x_finisher: { style: 'auth-blade-draw', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly', colors: ['#EFEFE0', '#C0392B'] }
        },
        kakuzu: {
            kakuzu_strike: { style: 'auth-cursed-slash', family: 'melee', motion: 'control', impact: 'chain-crash', camera: 'micro-lunge', colors: ['#7CFF6A', '#2E3440'] },
            kakuzu_x_finisher: { style: 'auth-flame-eruption', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly', colors: ['#FF6A00', '#2E3440'] }
        },
        dio: {
            muda_max: { style: 'auth-stand-barrage', family: 'barrage', motion: 'barrage', impact: 'ora-impact', camera: 'rush-track', colors: ['#F4D03F', '#C0392B'] },
            road_roller: { style: 'auth-time-stop', family: 'finisher', motion: 'finisher', impact: 'crater-break', camera: 'wide-shock', colors: ['#F4D03F', '#C0392B'] },
            time_stop_dio: { style: 'auth-time-stop', family: 'support', motion: 'buff', impact: 'clock-freeze', camera: 'freeze-frame', colors: ['#F4D03F', '#C0392B'] }
        },
        diavolo: {
            erase: { style: 'auth-time-stop', family: 'melee', motion: 'step-in', impact: 'illusion-fracture', camera: 'snap-zoom', colors: ['#E74C3C', '#8E44AD'] },
            time_erase: { style: 'auth-time-stop', family: 'support', motion: 'buff', impact: 'illusion-fracture', camera: 'freeze-frame', colors: ['#E74C3C', '#8E44AD'] },
            fate_crush: { style: 'auth-time-stop', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly', colors: ['#E74C3C', '#8E44AD'] }
        },
        kira: {
            first_bomb: { style: 'auth-flame-eruption', family: 'hex', motion: 'step-in', impact: 'ember-bloom', camera: 'micro-lunge', colors: ['#F4D03F', '#8E44AD'] },
            detonate: { style: 'auth-flame-eruption', family: 'inferno', motion: 'projectile-fire', impact: 'ember-bloom', camera: 'heat-wave', colors: ['#F4D03F', '#8E44AD'] },
            bites_dust: { style: 'auth-time-stop', family: 'support', motion: 'control', impact: 'clock-freeze', camera: 'void-dolly', colors: ['#F4D03F', '#8E44AD'] }
        },
        pucci: {
            mih_slash: { style: 'auth-stand-barrage', family: 'blade', motion: 'barrage', impact: 'chain-crash', camera: 'side-slice', colors: ['#F4D03F', '#2C3E50'] },
            time_accel: { style: 'auth-time-stop', family: 'support', motion: 'buff', impact: 'clock-freeze', camera: 'rush-track', colors: ['#ECF0F1', '#2C3E50'] },
            universe_reset: { style: 'auth-time-stop', family: 'finisher', motion: 'finisher', impact: 'sky-split', camera: 'wide-shock', colors: ['#F4D03F', '#2C3E50'] }
        },
        weather: {
            rain_storm: { style: 'auth-water-wheel', family: 'element', motion: 'projectile-element', impact: 'water-splash', camera: 'fluid-track', colors: ['#5DADE2', '#ECF0F1'] },
            heavy_weather: { family: 'support', motion: 'control', impact: 'illusion-fracture', camera: 'dutch-drift', colors: ['#A569BD', '#5DADE2'] },
            atmosphere: { family: 'finisher', motion: 'finisher', impact: 'crater-break', camera: 'wide-shock', colors: ['#5DADE2', '#ECF0F1'] }
        },
        giorno: {
            muda_storm: { style: 'auth-stand-barrage', family: 'barrage', motion: 'barrage', impact: 'ora-impact', camera: 'punch-dolly', colors: ['#F1C40F', '#8E44AD'] },
            requiem_field: { style: 'auth-heal-glow', family: 'heal', motion: 'recovery', impact: 'rebuild-bloom', camera: 'aura-rise', colors: ['#F1C40F', '#8E44AD'] },
            return_to_zero: { style: 'auth-requiem-beam', family: 'support', motion: 'guard', impact: 'perfect-parry', camera: 'stand-rise', colors: ['#F1C40F', '#8E44AD'] }
        },
        jotaro: {
            ora_overdrive: { style: 'auth-stand-barrage', family: 'barrage', motion: 'barrage', impact: 'ora-impact', camera: 'punch-dolly', colors: ['#F4D03F', '#1A5276'] },
            time_stop: { style: 'auth-time-stop', family: 'support', motion: 'buff', impact: 'clock-freeze', camera: 'freeze-frame', colors: ['#F4D03F', '#1A5276'] }
        },
        polnareff: {
            million_stab: { style: 'auth-blade-draw', family: 'pierce', motion: 'barrage', impact: 'chain-crash', camera: 'rush-track', colors: ['#BDC3C7', '#E74C3C'] },
            chariot_finale: { style: 'auth-blade-draw', family: 'finisher', motion: 'finisher', impact: 'cross-cut', camera: 'vertical-strike', colors: ['#BDC3C7', '#E74C3C'] }
        },
        kakyoin: {
            emerald_splash: { style: 'auth-stand-barrage', family: 'barrage', motion: 'barrage', impact: 'crossfire-burst', camera: 'micro-lunge', colors: ['#1E8449', '#58D68D'] },
            emerald_max: { style: 'auth-stand-barrage', family: 'barrage', motion: 'barrage', impact: 'crossfire-burst', camera: 'heavy-dolly', colors: ['#1E8449', '#58D68D'] }
        },
        mista: {
            six_shots: { style: 'auth-stand-barrage', family: 'pierce', motion: 'barrage', impact: 'crossfire-burst', camera: 'micro-lunge', colors: ['#2980B9', '#E74C3C'] },
            point_blank: { style: 'auth-stand-barrage', family: 'pierce', motion: 'step-in', impact: 'signature-impact', camera: 'snap-zoom', colors: ['#2980B9', '#E74C3C'] }
        },
        bucciarati: {
            aria: { style: 'auth-stand-barrage', family: 'barrage', motion: 'barrage', impact: 'ora-impact', camera: 'punch-dolly', colors: ['#5D93D6', '#F4D03F'] },
            arrivederci: { style: 'auth-blade-draw', family: 'finisher', motion: 'finisher', impact: 'form-break', camera: 'side-slice', colors: ['#5D93D6', '#F4D03F'] }
        },
        anasui: {
            bone_twist: { family: 'melee', motion: 'step-in', impact: 'form-break', camera: 'micro-lunge', colors: ['#16A085', '#9B59B6'] },
            full_dive: { style: 'auth-stand-barrage', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly', colors: ['#16A085', '#9B59B6'] }
        },
        risotto: {
            iron_needles: { style: 'auth-stand-barrage', family: 'pierce', motion: 'barrage', impact: 'chain-crash', camera: 'micro-lunge', colors: ['#C0392B', '#1C2833'] },
            assassin_finisher: { style: 'auth-blade-draw', family: 'finisher', motion: 'finisher', impact: 'cross-cut', camera: 'heavy-dolly', colors: ['#C0392B', '#1C2833'] }
        },
        caesar: {
            bubble_launcher: { style: 'auth-water-wheel', family: 'spiral', motion: 'projectile-element', impact: 'water-splash', camera: 'micro-lunge', colors: ['#F4D03F', '#5DADE2'] },
            final_ripple: { family: 'finisher', motion: 'finisher', impact: 'sky-split', camera: 'heavy-dolly', colors: ['#F4D03F', '#5DADE2'] }
        },
        rohan: {
            heaven_page: { family: 'hex', motion: 'control', impact: 'power-lock', camera: 'dutch-drift', colors: ['#1A5276', '#9B59B6'] },
            masterpiece: { family: 'hex', motion: 'finisher', impact: 'illusion-fracture', camera: 'heavy-dolly', colors: ['#1A5276', '#9B59B6'] }
        },
        ichigo: {
            getsuga: { style: 'auth-crescent-slash', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'side-slice', colors: ['#BDEBFF', '#1E5CFF'] },
            bankai: { style: 'auth-bankai-aura', family: 'transform', motion: 'awakening', impact: 'stand-reveal', camera: 'aura-rise', colors: ['#4D7CFF', '#0B0B12'] },
            mugetsu: { style: 'auth-black-flash', family: 'finisher', motion: 'finisher', impact: 'sky-split', camera: 'wide-shock', colors: ['#9BEAFF', '#0A0A0A'] }
        },
        aizen: {
            kyoka: { style: 'auth-mist-veil', family: 'hex', motion: 'control', impact: 'illusion-fracture', camera: 'dutch-drift', colors: ['#B388FF', '#2A0A4A'] },
            hadou90: { style: 'auth-cursed-slash', family: 'hex', motion: 'projectile-element', impact: 'orb-crush', camera: 'void-dolly', colors: ['#9D4EDD', '#1A0033'] },
            muken_kuro: { style: 'auth-cursed-slash', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly', colors: ['#C77DFF', '#0D001A'] }
        },
        ulquiorra: {
            cero: { style: 'auth-cero-beam', family: 'element', motion: 'projectile-element', impact: 'orb-crush', camera: 'punch-dolly', colors: ['#39FF6A', '#08240F'] },
            lanza: { style: 'auth-lightning-hand', family: 'pierce', motion: 'projectile-element', impact: 'spear-pierce', camera: 'rush-track', colors: ['#7CFF00', '#0E3B1E'] },
            cero_osc: { style: 'auth-cero-beam', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'void-dolly', colors: ['#39FF6A', '#0A0F0A'] }
        },
        grimmjow: {
            desgarron: { style: 'auth-blade-draw', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'side-slice', colors: ['#9BEAFF', '#1E5CFF'] },
            hierro_g: { style: 'auth-guard-iron', family: 'support', motion: 'guard', impact: 'guard-lock', camera: 'locked-frame', colors: ['#C0C8D0', '#5A6570'] },
            desgarron_max: { style: 'auth-blade-storm', family: 'barrage', motion: 'barrage', impact: 'chain-crash', camera: 'heavy-dolly', colors: ['#4DD8FF', '#0A2A5A'] }
        },
        shunsui: {
            bushogoma: { style: 'auth-blade-storm', family: 'spiral', motion: 'projectile-element', impact: 'chain-crash', camera: 'orbit-pull', colors: ['#FFD1DC', '#1A5276'] },
            takaoni: { style: 'auth-blade-draw', family: 'blade', motion: 'blade', impact: 'sky-split', camera: 'vertical-strike', colors: ['#F5F0E1', '#9D4E62'] },
            kageoni_fin: { style: 'auth-mist-veil', family: 'finisher', motion: 'finisher', impact: 'illusion-fracture', camera: 'void-dolly', colors: ['#9D4E62', '#0B0B12'] }
        },
        byakuya: {
            senbon: { style: 'auth-blade-storm', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'orbit-pull', colors: ['#FFB7D5', '#FF4D8D'] },
            hakuteiken: { style: 'auth-blade-storm', family: 'finisher', motion: 'finisher', impact: 'sky-split', camera: 'heavy-dolly', colors: ['#FFE3EE', '#E91E63'] }
        },
        rukia: {
            tsugi: { style: 'auth-water-wheel', family: 'element', motion: 'projectile-element', impact: 'water-splash', camera: 'punch-dolly', colors: ['#E8F9FF', '#7EC8E3'] },
            togame_finisher: { style: 'auth-water-wheel', family: 'finisher', motion: 'finisher', impact: 'crater-break', camera: 'wide-shock', colors: ['#FFFFFF', '#5DADE2'] }
        },
        toshiro: {
            hyorin: { style: 'auth-water-wheel', family: 'element', motion: 'projectile-element', impact: 'water-splash', camera: 'rush-track', colors: ['#AEEBFF', '#1E90FF'] },
            hyoten: { style: 'auth-water-wheel', family: 'element', motion: 'control', impact: 'crater-break', camera: 'scale-push', colors: ['#D6F4FF', '#2E86C1'] }
        },
        yoruichi: {
            shunko: { style: 'auth-lightning-hand', family: 'lightning', motion: 'step-in', impact: 'orb-crush', camera: 'snap-zoom', colors: ['#FFE93D', '#2E86FF'] },
            flash_step_y: { style: 'auth-black-flash', family: 'support', motion: 'buff', impact: 'rebuild-bloom', camera: 'aura-rise', colors: ['#FFF9C4', '#FFC400'] }
        },
        urahara: {
            nake_benihime: { style: 'auth-cursed-slash', family: 'inferno', motion: 'projectile-fire', impact: 'flame-fan', camera: 'micro-lunge', colors: ['#FF2A2A', '#7A0000'] },
            hado99: { style: 'auth-cursed-slash', family: 'finisher', motion: 'finisher', impact: 'crossfire-burst', camera: 'heat-wave', colors: ['#FF6B00', '#2A0A4A'] }
        },
        kenpachi: {
            kendo: { style: 'auth-blade-draw', family: 'melee', motion: 'step-in', impact: 'cross-cut', camera: 'micro-lunge', colors: ['#FFD23F', '#5A0A00'] },
            noza_finisher: { style: 'auth-blade-draw', family: 'finisher', motion: 'finisher', impact: 'crater-break', camera: 'wide-shock', colors: ['#FF3B1F', '#1A0A00'] }
        },
        gojo: {
            blue: { style: 'auth-spiral-orb', family: 'spiral', motion: 'control', impact: 'gravity-crush', camera: 'orbit-pull', colors: ['#2E9BFF', '#0A1E9E'] },
            red: { style: 'auth-spiral-orb', family: 'spiral', motion: 'control', impact: 'orb-crush', camera: 'wide-shock', colors: ['#FF2E2E', '#7A0A0A'] },
            hollow_purple: { style: 'auth-void-orb', family: 'hex', motion: 'finisher', impact: 'black-orb-collapse', camera: 'void-dolly', colors: ['#A855F7', '#FF2E2E'] }
        },
        sukuna: {
            cleave_max: { style: 'auth-crescent-slash', family: 'blade', motion: 'blade', impact: 'sky-split', camera: 'side-slice', colors: ['#E8E8E8', '#5D6D7E'] },
            fuga: { style: 'auth-flame-eruption', family: 'inferno', motion: 'projectile-fire', impact: 'ember-bloom', camera: 'heat-wave', colors: ['#FF6B00', '#FFD23F'] },
            malevolent: { style: 'auth-domain-shrine', family: 'support', motion: 'awakening', impact: 'stand-reveal', camera: 'reveal-rise', colors: ['#B03A2E', '#1A0A0A'] }
        },
        hakari: {
            jackpot: { style: 'auth-heal-glow', family: 'transform', motion: 'awakening', impact: 'rebuild-bloom', camera: 'aura-rise', colors: ['#27AE60', '#F4D03F'] },
            jackpot_fists: { family: 'barrage', motion: 'barrage', impact: 'chain-crash', camera: 'rush-track', colors: ['#27AE60', '#F4D03F'] },
            train_crash: { family: 'finisher', motion: 'finisher', impact: 'crater-break', camera: 'wide-shock', colors: ['#1ABC9C', '#F4D03F'] }
        },
        yuta: {
            rika_manifest: { family: 'transform', motion: 'awakening', impact: 'stand-reveal', camera: 'reveal-rise', colors: ['#ECF0F1', '#9B59B6'] },
            rika_smash: { style: 'auth-black-flash', family: 'barrage', motion: 'barrage', impact: 'meteor-fist', camera: 'punch-dolly', colors: ['#FF1A1A', '#0A0A0A'] },
            pure_love: { style: 'auth-void-orb', family: 'hex', motion: 'projectile-element', impact: 'chakra-bloom', camera: 'rush-track', colors: ['#FFFFFF', '#9B59B6'] }
        },
        kashimo: {
            kashimo_strike: { style: 'auth-lightning-hand', family: 'lightning', motion: 'projectile-element', impact: 'crossfire-burst', camera: 'snap-zoom', colors: ['#FFB300', '#FF6B00'] },
            kashimo_transform: { style: 'auth-lightning-fall', family: 'transform', motion: 'awakening', impact: 'form-break', camera: 'aura-rise', colors: ['#FFB800', '#FFF3B0'] },
            kashimo_x_finisher: { style: 'auth-lightning-fall', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly', colors: ['#FFAA00', '#FF3D00'] }
        },
        geto: {
            uzumaki: { style: 'auth-spiral-orb', family: 'hex', motion: 'control', impact: 'black-orb-collapse', camera: 'orbit-pull', colors: ['#8E44AD', '#1A1A2E'] },
            spirit_swarm: { style: 'auth-cursed-slash', family: 'barrage', motion: 'barrage', impact: 'chain-crash', camera: 'rush-track', colors: ['#58D68D', '#1A5276'] }
        },
        toji: {
            inv_spear: { style: 'auth-blade-draw', family: 'pierce', motion: 'step-in', impact: 'spear-pierce', camera: 'micro-lunge', colors: ['#AAB7B8', '#2C3E50'] },
            split_soul: { style: 'auth-crescent-slash', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'side-slice', colors: ['#D5DBDB', '#2C3E50'] }
        },
        nanami: {
            ratio: { style: 'auth-blade-draw', family: 'melee', motion: 'step-in', impact: 'crater-break', camera: 'micro-lunge', colors: ['#F4D03F', '#1C2833'] },
            critical_ratio: { style: 'auth-crescent-slash', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'side-slice', colors: ['#F9E79F', '#B7950B'] }
        },
        yuki: {
            star_rage: { style: 'auth-black-flash', family: 'melee', motion: 'step-in', impact: 'meteor-fist', camera: 'punch-dolly', colors: ['#F4D03F', '#E74C3C'] },
            black_hole: { style: 'auth-void-orb', family: 'finisher', motion: 'finisher', impact: 'black-orb-collapse', camera: 'void-dolly', colors: ['#8E44AD', '#0A0A0A'] }
        },
        higuruma: {
            deadly: { style: 'auth-domain-shrine', family: 'transform', motion: 'awakening', impact: 'power-lock', camera: 'locked-frame', colors: ['#F4D03F', '#1C2833'] },
            exec_slash: { style: 'auth-cursed-slash', family: 'blade', motion: 'finisher', impact: 'cross-cut', camera: 'vertical-strike', colors: ['#FFFFFF', '#1C2833'] }
        },
        choso: {
            piercing_blood: { style: 'auth-blood-orb', family: 'pierce', motion: 'projectile-element', impact: 'spear-pierce', camera: 'rush-track', colors: ['#C0392B', '#7B0A0A'] },
            pierce_max: { style: 'auth-blood-orb', family: 'finisher', motion: 'finisher', impact: 'spear-pierce', camera: 'snap-zoom', colors: ['#FF1A1A', '#5D0A0A'] }
        },
        meimei: {
            meimei_strike: { style: 'auth-cursed-slash', family: 'blade', motion: 'projectile', impact: 'chain-crash', camera: 'fluid-track', colors: ['#7C5CBF', '#1A1A1A'] },
            meimei_burst: { style: 'auth-blade-draw', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'side-slice', colors: ['#8B6CD9', '#D5DBDB'] }
        },
        tanjiro: {
            water_wheel: { style: 'auth-water-wheel', family: 'element', motion: 'projectile-element', impact: 'water-splash', camera: 'fluid-track', colors: ['#1E90FF', '#AED6F1'] },
            dance_fire: { style: 'auth-flame-dance', family: 'inferno', motion: 'blade', impact: 'ember-bloom', camera: 'heat-wave', colors: ['#FF4500', '#FFC300'] },
            setting_sun: { style: 'auth-flame-dance', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'vertical-strike', colors: ['#FF3B00', '#FFD23F'] }
        },
        gyomei: {
            serpentine: { family: 'melee', motion: 'barrage', impact: 'chain-crash', camera: 'heavy-dolly', colors: ['#F5B041', '#5D6D7E'] },
            arches: { family: 'barrage', motion: 'barrage', impact: 'crater-break', camera: 'wide-shock', colors: ['#F5B041', '#5D6D7E'] },
            pebble: { family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'scale-push', colors: ['#F5B041', '#5D6D7E'] }
        },
        kokushibo: {
            crescent: { style: 'auth-crescent-slash', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'side-slice', colors: ['#8E44AD', '#FFF3B0'] },
            sixteen_moons: { style: 'auth-crescent-slash', family: 'barrage', motion: 'barrage', impact: 'cross-cut', camera: 'orbit-pull', colors: ['#6C3483', '#D7BDE2'] },
            moon_dragon: { style: 'auth-crescent-slash', family: 'blade', motion: 'blade', impact: 'sky-split', camera: 'void-dolly', colors: ['#6C3483', '#D7BDE2'] }
        },
        rengoku: {
            unknowing_fire: { style: 'auth-flame-eruption', family: 'inferno', motion: 'step-in', impact: 'ember-bloom', camera: 'rush-track', colors: ['#FF3B00', '#FFD23F'] },
            flame_tiger: { style: 'auth-flame-eruption', family: 'inferno', motion: 'blade', impact: 'flame-fan', camera: 'heat-wave', colors: ['#FF3B00', '#FFD23F'] },
            rengoku_form: { style: 'auth-flame-dance', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'vertical-strike', colors: ['#E74C3C', '#F9E79F'] }
        },
        muzan: {
            muzan_strike: { family: 'hex', motion: 'control', impact: 'cross-cut', camera: 'micro-lunge', colors: ['#FFDFE4', '#8F1D2C'] },
            muzan_x_strike: { family: 'hex', motion: 'barrage', impact: 'chain-crash', camera: 'heavy-dolly', colors: ['#FFDFE4', '#8F1D2C'] },
            muzan_x_finisher: { style: 'auth-black-flash', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'scale-push', colors: ['#FFDFE4', '#8F1D2C'] }
        },
        yourichi: {
            yourichi_strike: { style: 'auth-flame-dance', family: 'inferno', motion: 'blade', impact: 'cross-cut', camera: 'side-slice', colors: ['#C33D1F', '#FFEDD6'] },
            yourichi_x_strike: { style: 'auth-flame-dance', family: 'inferno', motion: 'blade', impact: 'sky-split', camera: 'void-dolly', colors: ['#C33D1F', '#FFEDD6'] },
            yourichi_x_finisher: { style: 'auth-flame-dance', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'vertical-strike', colors: ['#FF5A00', '#FFE5B4'] }
        },
        giyu: {
            flowing_dance: { style: 'auth-water-wheel', family: 'element', motion: 'blade', impact: 'water-splash', camera: 'fluid-track', colors: ['#1A5276', '#5DADE2'] },
            water_dragon: { style: 'auth-water-wheel', family: 'element', motion: 'projectile-element', impact: 'water-splash', camera: 'orbit-pull', colors: ['#1A5276', '#5DADE2'] }
        },
        tengen: {
            string_performance: { style: 'auth-sound-blast', family: 'barrage', motion: 'barrage', impact: 'crossfire-burst', camera: 'punch-dolly', colors: ['#F4D03F', '#E74C3C'] },
            bomb_rush: { style: 'auth-sound-blast', family: 'element', motion: 'projectile-fire', impact: 'crossfire-burst', camera: 'wide-shock', colors: ['#F4D03F', '#FF6B00'] }
        },
        sanemi: {
            gale_slash: { style: 'auth-blade-storm', family: 'element', motion: 'blade', impact: 'cross-cut', camera: 'side-slice', colors: ['#27AE60', '#ECF0F1'] },
            idaten: { style: 'auth-blade-storm', family: 'element', motion: 'barrage', impact: 'sky-split', camera: 'orbit-pull', colors: ['#27AE60', '#ECF0F1'] }
        },
        mitsuri: {
            swinging: { style: 'auth-love-whip', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'fluid-track', colors: ['#E91E8C', '#FFD6E8'] },
            cathexis: { style: 'auth-love-whip', family: 'element', motion: 'barrage', impact: 'ember-bloom', camera: 'orbit-pull', colors: ['#E91E8C', '#82E0AA'] }
        },
        muichiro: {
            sea_mist: { style: 'auth-mist-veil', family: 'element', motion: 'blade', impact: 'illusion-fracture', camera: 'dutch-drift', colors: ['#1ABC9C', '#D5F5E3'] },
            moon_mist: { style: 'auth-mist-veil', family: 'blade', motion: 'barrage', impact: 'illusion-fracture', camera: 'void-dolly', colors: ['#1ABC9C', '#D5F5E3'] }
        },
        obanai: {
            winding: { style: 'auth-serpent-slash', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'side-slice', colors: ['#A569BD', '#2C3E50'] },
            slithering: { style: 'auth-serpent-slash', family: 'barrage', motion: 'barrage', impact: 'chain-crash', camera: 'orbit-pull', colors: ['#A569BD', '#2C3E50'] }
        },
        akaza: {
            disorder: { style: 'auth-explosive-fist', family: 'melee', motion: 'barrage', impact: 'meteor-fist', camera: 'punch-dolly', colors: ['#AED6F1', '#E74C3C'] },
            annihilation: { style: 'auth-explosive-fist', family: 'melee', motion: 'step-in', impact: 'crater-break', camera: 'heavy-dolly', colors: ['#AED6F1', '#E74C3C'] }
        },
        doma: {
            lotus: { family: 'element', motion: 'projectile-element', impact: 'water-splash', camera: 'heat-wave', colors: ['#AED6F1', '#F5D67B'] },
            glacial: { family: 'element', motion: 'projectile-element', impact: 'illusion-fracture', camera: 'scale-push', colors: ['#AED6F1', '#F5D67B'] }
        },
        nezuko: {
            bakuketsu: { style: 'auth-flame-eruption', family: 'inferno', motion: 'projectile-fire', impact: 'ember-bloom', camera: 'heat-wave', colors: ['#E91E63', '#FF7B00'] },
            awakened_strike: { style: 'auth-flame-eruption', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'vertical-strike', colors: ['#E91E63', '#FF7B00'] }
        },
        shinobu: {
            shinobu_strike: { style: 'auth-poison-moth', family: 'pierce', motion: 'step-in', impact: 'cross-cut', camera: 'micro-lunge', colors: ['#7B3FB5', '#F2E4FF'] },
            shinobu_x_finisher: { style: 'auth-poison-moth', family: 'finisher', motion: 'finisher', impact: 'illusion-fracture', camera: 'heavy-dolly', colors: ['#7B3FB5', '#A8E6A3'] }
        },
        genya: {
            genya_strike: { family: 'pierce', motion: 'projectile', impact: 'crossfire-burst', camera: 'snap-zoom', colors: ['#8A4B23', '#FFE3CF'] },
            genya_x_finisher: { family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly', colors: ['#8A4B23', '#FFE3CF'] }
        },
        denji: {
            arm_ripper: { style: 'auth-chainsaw-rev', family: 'barrage', motion: 'barrage', impact: 'chain-crash', camera: 'punch-dolly', colors: ['#FF8C00', '#C0392B'] },
            head_chainsaw: { style: 'auth-chainsaw-rev', family: 'melee', motion: 'step-in', impact: 'crater-break', camera: 'rush-track', colors: ['#FF8C00', '#C0392B'] },
            endless_chainsaw: { style: 'auth-chainsaw-rev', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly', colors: ['#E8C547', '#C0392B'] }
        },
        makima: {
            finger_gun: { family: 'hex', motion: 'control', impact: 'orb-crush', camera: 'snap-zoom', colors: ['#C0392B', '#F4D03F'] },
            crush: { family: 'hex', motion: 'control', impact: 'orb-crush', camera: 'void-dolly', colors: ['#C0392B', '#F4D03F'] },
            absolute_control: { family: 'finisher', motion: 'finisher', impact: 'stand-reveal', camera: 'reveal-rise', colors: ['#C0392B', '#F4D03F'] }
        },
        quanxi: {
            quanxi_strike: { style: 'auth-blade-storm', family: 'pierce', motion: 'projectile', impact: 'cross-cut', camera: 'rush-track', colors: ['#E9E9EE', '#4A4A58'] },
            quanxi_x_strike: { style: 'auth-blade-storm', family: 'barrage', motion: 'barrage', impact: 'crossfire-burst', camera: 'punch-dolly', colors: ['#E9E9EE', '#4A4A58'] },
            quanxi_x_finisher: { style: 'auth-blade-storm', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly', colors: ['#E9E9EE', '#4A4A58'] }
        },
        asa: {
            asa_strike: { family: 'hex', motion: 'control', impact: 'form-break', camera: 'micro-lunge', colors: ['#D5D8DC', '#7B241C'] },
            asa_x_burst: { style: 'auth-black-flash', family: 'finisher', motion: 'projectile', impact: 'sky-split', camera: 'scale-push', colors: ['#FF6B00', '#7B241C'] },
            asa_x_finisher: { style: 'auth-explosive-fist', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'wide-shock', colors: ['#D5D8DC', '#7B241C'] }
        },
        power: {
            blood_spear: { family: 'pierce', motion: 'projectile', impact: 'cross-cut', camera: 'rush-track', colors: ['#E74C3C', '#5DADE2'] },
            blood_rain: { family: 'finisher', motion: 'projectile-element', impact: 'crater-break', camera: 'wide-shock', colors: ['#E74C3C', '#5DADE2'] }
        },
        reze: {
            chain_blast: { style: 'auth-explosive-fist', family: 'inferno', motion: 'projectile-fire', impact: 'crossfire-burst', camera: 'wide-shock', colors: ['#FF5A00', '#FFC300'] },
            city_bomb: { style: 'auth-explosive-fist', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'scale-push', colors: ['#FF5A00', '#FFC300'] }
        },
        aki: {
            katana_draw: { style: 'auth-blade-draw', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'micro-lunge', colors: ['#85929E', '#1A5276'] },
            kon: { family: 'hex', motion: 'stance', impact: 'stand-reveal', camera: 'snap-zoom', colors: ['#85929E', '#1A5276'] }
        },
        angel: {
            year_blade: { style: 'auth-blade-draw', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'side-slice', colors: ['#F9E79F', '#E67E22'] },
            century_sword: { style: 'auth-blade-draw', family: 'finisher', motion: 'finisher', impact: 'sky-split', camera: 'reveal-rise', colors: ['#F9E79F', '#E67E22'] }
        },
        katana: {
            katana_strike: { style: 'auth-blade-draw', family: 'blade', motion: 'blade', impact: 'cross-cut', camera: 'micro-lunge', colors: ['#5DADE2', '#212F3D'] },
            katana_x_finisher: { style: 'auth-blade-storm', family: 'finisher', motion: 'finisher', impact: 'cinematic-crash', camera: 'heavy-dolly', colors: ['#5DADE2', '#212F3D'] }
        },
        kishibe: {
            kishibe_strike: { style: 'auth-blade-draw', family: 'melee', motion: 'step-in', impact: 'cross-cut', camera: 'micro-lunge', colors: ['#E8E4DA', '#4D4A42'] },
            kishibe_burst: { style: 'auth-blade-draw', family: 'pierce', motion: 'barrage', impact: 'form-break', camera: 'rush-track', colors: ['#E8E4DA', '#4D4A42'] }
        }
    },

    transformationElement: {
        sanji: 'fire', kashimo: 'elec', denji: 'fire',
        yuta: 'curse', giorno: 'bless', dio: 'psy'
    },

    boot() {
        if (typeof BattleTechniqueDesigns === 'undefined') return;
        Object.entries(this.blocks).forEach(([char, skills]) => {
            BattleTechniqueDesigns[char] = { ...(BattleTechniqueDesigns[char] || {}), ...skills };
        });
        if (typeof EffectManager !== 'undefined') {
            Object.assign(EffectManager.transformationElement, this.transformationElement);
        }
    }
};

SignatureAuthentic.boot();

if (typeof window !== 'undefined') window.SignatureAuthentic = SignatureAuthentic;
