/**
 * Per-technique motion director for the battle presentation.
 * It animates the existing character art without replacing or compositing it.
 */
const BattleMotion = {
    running: new WeakMap(),

    hash(value) {
        let result = 2166136261;
        for (const char of String(value || '')) {
            result ^= char.charCodeAt(0);
            result = Math.imul(result, 16777619);
        }
        return Math.abs(result >>> 0);
    },

    signatureFor(characterId, skill, action = {}, profile = {}) {
        const id = String(skill?.id || action?.skillId || 'attack');
        const seed = this.hash(`${characterId}:${id}`);
        const unit = (shift, modulo, offset = 0) => ((seed >>> shift) % modulo) + offset;
        return {
            seed,
            archetype: unit(0, 16),
            entry: unit(4, 7, -3),
            apex: unit(8, 15, 4),
            recoil: unit(12, 19, 8),
            rotation: unit(16, 31, -15),
            snap: unit(21, 17, 8),
            travel: unit(25, 28, 24),
            density: unit(2, 6, 2),
            impact: unit(18, 9, 1),
            recovery: unit(27, 13, 8),
            family: profile?.family || 'motion'
        };
    },

    motionFor(characterId, skill, action, profile) {
        const id = String(skill?.id || action?.skillId || 'attack');
        const design = typeof BattleTechniqueDesigns !== 'undefined'
            ? BattleTechniqueDesigns.get(String(characterId), id)
            : null;
        const name = `${id} ${skill?.name || ''}`.toLowerCase();
        const type = String(skill?.type || profile?.fxType || 'strike').toLowerCase();
        const hits = Math.max(1, Number(skill?.hits || profile?.hits || 1));
        const power = Number(skill?.power || profile?.power || 0);
        let kind = 'step-in';

        if (skill?.transform || /awaken|bankai|gear|mode|liberad|sharingan|requiem|world|ashura|sage|puerta|gates/i.test(name)) {
            kind = 'awakening';
        } else if (action?.type === 'guard') {
            kind = 'guard';
        } else if (skill?.debuff || /debuff|lower|weaken|break|bind|seal/i.test(name)) {
            kind = 'debuff';
        } else if (skill?.heal || skill?.aoeHeal || skill?.revive != null || /heal|restore|regen|soten|santen|katsuyu/i.test(name)) {
            kind = 'heal';
        } else if (skill?.buff || skill?.allyBuff || skill?.partyBuff || skill?.charge || skill?.cover || /protect|buff|shield|support|mirage|byakugan|epitaph|quiet_life/i.test(name)) {
            kind = 'buff';
        } else if (/ora|muda|gatling|barrage|rush|flurry|claw|punch|kick|dora|hihio|hakke|palms|frenzy/i.test(name) || hits >= 4) {
            kind = 'barrage';
        } else if (/slash|giri|senkei|getsuga|shunpo|zabimaru|sword|blade|sever|string|web|birdcage|overheat/i.test(name) || type === 'slash') {
            kind = 'blade';
        } else if (power >= 180 || /king_kong|road_roller|mugetsu|night_guy|fate|finisher|ultimate/i.test(name)) {
            kind = 'finisher';
        } else if (/rasengan|bomb|ball|beam|roar|shot|water|thunder|chidori|kirin|katon|amaterasu|fire|ice|frost|wind|sand|cero/i.test(name) || ['fire', 'ice', 'elec', 'wind', 'water', 'curse', 'almighty'].includes(type)) {
            kind = /fire|katon|amaterasu|red_hawk|diable/i.test(name) ? 'projectile-fire'
                : /ice|frost|water|sand/i.test(name) ? 'projectile-element'
                    : 'projectile';
        } else if (/trap|bind|shadow|kage|genjutsu|time|erase|shambles|scan|room|bites|tsukuyomi/i.test(name)) {
            kind = 'control';
        }

        if (design?.motion) kind = design.motion;

        const signature = this.signatureFor(characterId, skill, action, profile);
        signature.style = design?.style || `${kind}-signature`;
        signature.impactStyle = design?.impact || 'signature-impact';
        signature.camera = design?.camera || 'standard';
        const { seed } = signature;
        return { kind, seed, signature, design, duration: Math.max(520, Math.min(1320, 620 + (seed % 260) + (hits > 3 ? 160 : 0) + (power >= 180 ? 140 : 0))) };
    },

    facing(fighter) {
        if (fighter?.classList.contains('face-native')) return 1;
        if (fighter?.classList.contains('enemy') || fighter?.classList.contains('face-flip')) return -1;
        return 1;
    },

    direction(fighter) {
        return fighter?.classList.contains('enemy') ? -1 : 1;
    },

    keyframes(kind, facing, direction, seed, signature = {}) {
        const f = facing;
        const d = direction;
        const variation = (seed >>> 0) / 4294967295;
        const reach = 28 + variation * 58;
        const lift = 3 + variation * 15;
        const twist = (seed % 2 ? 1 : -1) * (3 + variation * 11);
        const recoil = signature.recoil || (8 + variation * 18);
        const pulse = 1.015 + (variation * .055) + ((signature.snap || 0) - 8) * .0015;
        const entry = signature.entry || 0;
        const apex = signature.apex || 10;
        const rotation = signature.rotation || twist;
        const travel = signature.travel || reach;
        const rise = signature.apex ? signature.apex : lift;
        const base = (x, y, scale = 1, rotate = 0) => ({ transform: `scaleX(${f}) translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)` });
        const sets = {
            'step-in': [base(entry * d, 0), base(-recoil * d, lift / 2, .98, rotation / 2), base(travel * d, -rise, pulse, -rotation), base(travel * .35 * d, 0, 1.01, rotation / 3), base(0, 0)],
            'blade': [base(entry * d, 0), base(-recoil * 1.4 * d, lift, .96, -rotation), base(travel * .55 * d, -rise / 2, pulse, rotation * 1.6), base((travel + 28) * d, -rise - 3, 1.02, -rotation), base(0, 0)],
            'barrage': [base(0, 0), base(-recoil * d, 1, .98, -rotation / 2), base(travel * .45 * d, -2, pulse, rotation), base(travel * .65 * d, 1, 1.02, -rotation), base(travel * .9 * d, -3, pulse, rotation), base(0, 0)],
            'projectile': [base(entry * d, 0), base(-recoil * 1.5 * d, lift, .97, -rotation / 2), base(-recoil * .3 * d, -rise, pulse, rotation), base(travel * .12 * d, -rise / 2, 1.02, -rotation / 2), base(0, 0)],
            'projectile-fire': [base(entry * d, 0), base(-recoil * 1.7 * d, lift, .96, -rotation), base(-recoil * .2 * d, -rise * 1.5, 1.08, rotation), base(travel * .15 * d, -rise, 1.03, -rotation / 2), base(0, 0)],
            'projectile-element': [base(entry * d, 0), base(-recoil * d, lift + 2, .97, -rotation / 2), base(0, -rise * 2, 1.07, rotation), base(travel * .2 * d, -rise, 1.03, -rotation / 2), base(0, 0)],
            'control': [base(entry * d, 0), base(-recoil * d, lift, .98, -rotation / 2), base(0, -rise * 1.5, 1.06, rotation / 2), base(travel * .2 * d, -rise / 2, 1.02, -rotation / 2), base(0, 0)],
            'debuff': [base(entry * d, 0), base(-recoil * .45 * d, lift * .6, .98, -rotation), base(0, -rise * 1.15, 1.04, rotation * 1.4), base(-travel * .16 * d, -rise * .35, 1.02, -rotation), base(0, 0)],
            'stance': [base(entry * d, 0), base(0, -rise, 1.02, -rotation / 2), base(0, -rise * 2, 1.06, rotation), base(0, -rise / 2, 1.02, 0), base(0, 0)],
            'recovery': [base(entry * d, 0), base(0, -rise * 1.2, 1.03, -rotation / 2), base(0, -rise * 2.2, 1.08, rotation), base(0, -rise / 2, 1.03, 0), base(0, 0)],
            'heal': [base(entry * .35 * d, 0), base(0, -rise * .7, 1.03, -rotation / 2), base(0, -rise * 1.7, 1.1, rotation), base(0, -rise * .45, 1.04, 0), base(0, 0)],
            'buff': [base(entry * .2 * d, 0), base(-recoil * .25 * d, -lift * .25, 1.01, -rotation), base(0, -rise * 1.35, 1.07, rotation * .7), base(recoil * .12 * d, -rise * .4, 1.03, -rotation / 2), base(0, 0)],
            'guard': [base(0, 0), base(-recoil * .12 * d, 1, .99, -rotation / 2), base(0, -rise * .65, 1.04, rotation / 2), base(0, 0, 1.02), base(0, 0)],
            'awakening': [base(entry * d, 0), base(-3 * d, rise, .94, -rotation / 2), base(0, -rise * 2.2, 1.14, rotation), base(0, -rise / 2, 1.07, -rotation / 2), base(0, 0)],
            'finisher': [base(entry * d, 0), base(-recoil * 2 * d, rise + 3, .93, -rotation), base(travel * .2 * d, -rise * 2, 1.1, rotation), base((travel + 32) * d, -rise, 1.08, -rotation * 1.3), base(0, 0)]
        };
        const frames = sets[kind] || sets['step-in'];
        const offset = seed % 3;
        return frames.map((frame, index) => ({ ...frame, offset: Math.min(1, Math.max(0, (index + offset * .06) / (frames.length - 1))) }));
    },

    bodyKeyframes(kind, direction, seed, signature = {}) {
        const d = direction;
        const amount = signature.travel || (16 + ((seed >>> 0) % 28));
        const lift = signature.apex || (4 + ((seed >>> 8) % 12));
        const lean = signature.rotation || (((seed >>> 16) % 9) - 4);
        const pulse = 1 + (((seed >>> 24) % 5) * .012);
        const base = (x, y, scale = 1, rotate = 0, brightness = 1) => ({
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`,
            filter: `brightness(${brightness})`
        });
        const sets = {
            'step-in': [base(0, 0), base(-amount * .25 * d, lift, .98, lean), base(amount * d, -lift, pulse, -lean, 1.18), base(amount * .28 * d, 0, 1.01, lean / 2), base(0, 0)],
            'blade': [base(0, 0), base(-amount * .4 * d, lift, .96, -lean - 4), base(amount * .4 * d, -lift, pulse, lean + 8, 1.24), base(amount * .9 * d, -lift / 2, 1.02, -lean), base(0, 0)],
            'barrage': [base(0, 0), base(-amount * .25 * d, 1, .98, -lean), base(amount * .3 * d, -2, pulse, lean, 1.14), base(amount * .55 * d, 1, 1.02, -lean), base(amount * .75 * d, -2, pulse, lean, 1.2), base(0, 0)],
            'projectile': [base(0, 0), base(-amount * .55 * d, lift, .97, -lean), base(-amount * .1 * d, -lift, pulse, lean, 1.22), base(amount * .12 * d, -lift / 2, 1.02, -lean), base(0, 0)],
            'projectile-fire': [base(0, 0), base(-amount * .6 * d, lift, .95, -lean - 3), base(-amount * .1 * d, -lift * 1.5, 1.08, lean + 3, 1.34), base(amount * .15 * d, -lift, 1.03, -lean), base(0, 0)],
            'projectile-element': [base(0, 0), base(-amount * .35 * d, lift, .97, -lean), base(0, -lift * 1.7, 1.07, lean, 1.2), base(amount * .18 * d, -lift, 1.03, -lean), base(0, 0)],
            'control': [base(0, 0), base(-amount * .3 * d, lift, .98, -lean), base(0, -lift * 1.3, 1.06, lean, 1.15), base(amount * .2 * d, -lift / 2, 1.02, -lean), base(0, 0)],
            'debuff': [base(0, 0), base(-amount * .12 * d, lift * .45, .99, -lean), base(0, -lift * 1.1, 1.04, lean * 1.4, 1.16), base(-amount * .08 * d, -lift * .35, 1.02, -lean), base(0, 0)],
            'stance': [base(0, 0), base(0, -lift, 1.02, lean), base(0, -lift * 1.8, 1.06, -lean, 1.14), base(0, -lift / 2, 1.02), base(0, 0)],
            'recovery': [base(0, 0), base(0, -lift * 1.2, 1.03, lean, 1.1), base(0, -lift * 2, 1.08, -lean, 1.3), base(0, -lift / 2, 1.03), base(0, 0)],
            'heal': [base(0, 0), base(0, -lift * .65, 1.03, lean, 1.12), base(0, -lift * 1.55, 1.1, -lean, 1.38), base(0, -lift * .35, 1.04), base(0, 0)],
            'buff': [base(0, 0), base(-amount * .08 * d, -lift * .25, 1.01, lean, 1.08), base(0, -lift * 1.2, 1.07, -lean, 1.28), base(amount * .06 * d, -lift * .35, 1.03, lean / 2), base(0, 0)],
            'guard': [base(0, 0), base(-amount * .04 * d, 1, .99, -lean, 1.05), base(0, -lift * .55, 1.04, lean / 2, 1.16), base(0, 0, 1.02), base(0, 0)],
            'awakening': [base(0, 0), base(-amount * .08, lift, .94, lean, 1.2), base(0, -lift * 2.2, 1.14, -lean, 1.5), base(0, -lift / 2, 1.07, lean), base(0, 0)],
            'finisher': [base(0, 0), base(-amount * .7 * d, lift * 1.2, .92, -lean - 5), base(amount * .3 * d, -lift * 2, 1.1, lean + 5, 1.5), base(amount * 1.2 * d, -lift, 1.08, -lean, 1.18), base(0, 0)]
        };
        const frames = sets[kind] || sets['step-in'];
        return frames.map((frame, index) => ({ ...frame, offset: index / (frames.length - 1) }));
    },

    start(fighter, sprite, actor, skill, action, profile) {
        this.stop(fighter);
        if (!fighter || !sprite || typeof sprite.animate !== 'function') return null;
        const spec = this.motionFor(actor?.id, skill, action, profile);
        const direction = this.direction(fighter);
        const frames = this.keyframes(spec.kind, this.facing(fighter), direction, spec.seed, spec.signature);
        fighter.dataset.motion = spec.kind;
        fighter.dataset.motionSkill = String(skill?.id || action?.skillId || 'attack');
        fighter.dataset.motionStyle = spec.signature?.style || 'signature';
        fighter.classList.add('motion-active', `motion-${spec.kind}`);
        fighter.classList.add(`motion-style-${spec.signature?.style || 'signature'}`);
        const animation = sprite.animate(frames, {
            duration: spec.duration,
            easing: spec.kind === 'barrage' ? 'cubic-bezier(.15,.8,.25,1)' : 'cubic-bezier(.12,.88,.2,1)',
            fill: 'both'
        });
        const bodyAnimation = fighter.animate(this.bodyKeyframes(spec.kind, direction, spec.seed, spec.signature), {
            duration: spec.duration,
            easing: spec.kind === 'barrage' ? 'cubic-bezier(.18,.82,.24,1)' : 'cubic-bezier(.12,.88,.2,1)',
            fill: 'both'
        });
        animation.onfinish = () => {
            if (this.running.get(fighter)?.animation === animation) this.stop(fighter);
        };
        this.running.set(fighter, { animation, bodyAnimation, kind: spec.kind });
        return { ...spec, animation, bodyAnimation };
    },

    stop(fighter) {
        const current = fighter && this.running.get(fighter);
        current?.animation?.cancel();
        current?.bodyAnimation?.cancel();
        if (!fighter) return;
        fighter.classList.remove('motion-active');
        [...fighter.classList].filter(name => name.startsWith('motion-')).forEach(name => fighter.classList.remove(name));
        delete fighter.dataset.motion;
        delete fighter.dataset.motionSkill;
        delete fighter.dataset.motionStyle;
        [...fighter.classList].filter(name => name.startsWith('motion-style-')).forEach(name => fighter.classList.remove(name));
        this.running.delete(fighter);
    }
};

if (typeof window !== 'undefined') window.BattleMotion = BattleMotion;
