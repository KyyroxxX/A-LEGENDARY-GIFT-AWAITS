/**
 * Naruto — data-driven SkelForm animation library.
 * Clips drive bones from assets/characters/naruto/skf (Naruto.skf export).
 *
 * Hierarchy (pelvis ROOT):
 *   pelvis → torso → neck → head → hair
 *         ↘ arms / legs chains
 *
 * Register via SkelCharacterRegistry — no engine branching on character id.
 */
const NarutoSkelAnims = (() => {
    const k = (t, props, easing) => ({ t, easing, ...props });

    /** Shared rest baseline until PRO parts/rig. Do NOT invent fight stance on broken pivots. */
    const STANCE = {
        __root: { x: 0, y: 0, rot: 0 },
        pelvis: { rot: 0, x: 0 },
        torso: { rot: 0, y: 0 },
        neck: { rot: 0 },
        head: { rot: 0 },
        hair: { rot: 0 },
        upper_arm_r: { rot: 0 },
        forearm_r: { rot: 0 },
        hand_r: { rot: 0 },
        upper_arm_l: { rot: 0 },
        forearm_l: { rot: 0 },
        hand_l: { rot: 0 },
        upper_leg_r: { rot: 0 },
        lower_leg_r: { rot: 0 },
        foot_r: { rot: 0 },
        upper_leg_l: { rot: 0 },
        lower_leg_l: { rot: 0 },
        foot_l: { rot: 0 }
    };

    const fromStance = (bone, over = {}, t = 0, easing) =>
        k(t, { ...(STANCE[bone] || {}), ...over }, easing);

    /** Idle: almost rest until PRO parts/rig land — tiny breath only (no fake fight stance). */
    const idle = {
        name: 'idle',
        duration: 2800,
        loop: true,
        events: [],
        tracks: {
            __root: [
                k(0, { y: 0 }),
                k(0.5, { y: 4 }, 'easeInOut'),
                k(1, { y: 0 }, 'easeInOut')
            ],
            torso: [
                k(0, { y: 0 }),
                k(0.5, { y: 2 }, 'easeInOut'),
                k(1, { y: 0 }, 'easeInOut')
            ],
            hair: [
                k(0, { rot: 0 }),
                k(0.5, { rot: 2 }, 'easeInOut'),
                k(1, { rot: 0 }, 'easeInOut')
            ]
        }
    };

    const walk = {
        name: 'walk',
        duration: 620,
        loop: true,
        events: [],
        tracks: {
            __root: [
                k(0, { y: 0 }),
                k(0.25, { y: 12 }, 'easeOut'),
                k(0.5, { y: 0 }, 'easeIn'),
                k(0.75, { y: 12 }, 'easeOut'),
                k(1, { y: 0 }, 'easeIn')
            ],
            pelvis: [
                k(0, { rot: 5, x: 0 }),
                k(0.5, { rot: -5 }, 'easeInOut'),
                k(1, { rot: 5 }, 'easeInOut')
            ],
            torso: [
                k(0, { rot: 4 }),
                k(0.5, { rot: -4 }, 'easeInOut'),
                k(1, { rot: 4 }, 'easeInOut')
            ],
            head: [
                k(0, { rot: -2 }),
                k(0.5, { rot: 2 }, 'easeInOut'),
                k(1, { rot: -2 }, 'easeInOut')
            ],
            hair: [
                k(0, { rot: -8 }),
                k(0.5, { rot: 8 }, 'easeInOut'),
                k(1, { rot: -8 }, 'easeInOut')
            ],
            upper_leg_r: [
                k(0, { rot: 30 }),
                k(0.5, { rot: -34 }, 'easeInOut'),
                k(1, { rot: 30 }, 'easeInOut')
            ],
            lower_leg_r: [
                k(0, { rot: 8 }),
                k(0.18, { rot: 38 }, 'easeInOut'),
                k(0.5, { rot: 6 }, 'easeInOut'),
                k(0.78, { rot: 22 }, 'easeInOut'),
                k(1, { rot: 8 }, 'easeInOut')
            ],
            foot_r: [
                k(0, { rot: -10 }),
                k(0.5, { rot: 12 }, 'easeInOut'),
                k(1, { rot: -10 }, 'easeInOut')
            ],
            upper_leg_l: [
                k(0, { rot: -34 }),
                k(0.5, { rot: 30 }, 'easeInOut'),
                k(1, { rot: -34 }, 'easeInOut')
            ],
            lower_leg_l: [
                k(0, { rot: 6 }),
                k(0.32, { rot: 20 }, 'easeInOut'),
                k(0.5, { rot: 38 }, 'easeInOut'),
                k(0.82, { rot: 10 }, 'easeInOut'),
                k(1, { rot: 6 }, 'easeInOut')
            ],
            foot_l: [
                k(0, { rot: 12 }),
                k(0.5, { rot: -10 }, 'easeInOut'),
                k(1, { rot: 12 }, 'easeInOut')
            ],
            upper_arm_r: [
                k(0, { rot: -24 }),
                k(0.5, { rot: 24 }, 'easeInOut'),
                k(1, { rot: -24 }, 'easeInOut')
            ],
            forearm_r: [
                k(0, { rot: -10 }),
                k(0.5, { rot: 14 }, 'easeInOut'),
                k(1, { rot: -10 }, 'easeInOut')
            ],
            upper_arm_l: [
                k(0, { rot: 24 }),
                k(0.5, { rot: -24 }, 'easeInOut'),
                k(1, { rot: 24 }, 'easeInOut')
            ],
            forearm_l: [
                k(0, { rot: 10 }),
                k(0.5, { rot: -14 }, 'easeInOut'),
                k(1, { rot: 10 }, 'easeInOut')
            ]
        }
    };

    const attack = {
        name: 'attack',
        duration: 980,
        loop: false,
        events: [
            { t: 0.00, name: 'ATTACK_START' },
            { t: 0.24, name: 'ATTACK_ACTIVE' },
            { t: 0.48, name: 'IMPACT' },
            { t: 1.00, name: 'ATTACK_END' }
        ],
        tracks: {
            __root: [
                fromStance('__root'),
                k(0.14, { x: -32, y: 8, rot: -5 }, 'easeInBack'),
                k(0.26, { x: -18, y: 5 }, 'easeOut'),
                k(0.48, { x: 78, y: -16, rot: 7 }, 'easeOutCubic'),
                k(0.64, { x: 42, y: -6 }, 'easeOut'),
                k(0.82, { x: 14, y: 0 }, 'easeInOut'),
                fromStance('__root', {}, 1, 'easeInOut')
            ],
            pelvis: [
                fromStance('pelvis'),
                k(0.16, { rot: 12 }, 'easeIn'),
                k(0.48, { rot: -16 }, 'easeOutCubic'),
                k(0.72, { rot: -4 }, 'easeOut'),
                fromStance('pelvis', {}, 1, 'easeInOut')
            ],
            torso: [
                fromStance('torso'),
                k(0.14, { rot: -18 }, 'easeInBack'),
                k(0.26, { rot: -22 }, 'easeOut'),
                k(0.48, { rot: 20 }, 'easeOutCubic'),
                k(0.7, { rot: 8 }, 'easeOut'),
                fromStance('torso', {}, 1, 'easeInOut')
            ],
            neck: [
                fromStance('neck'),
                k(0.18, { rot: -5 }, 'easeInOut'),
                k(0.48, { rot: 7 }, 'easeOut'),
                fromStance('neck', {}, 1, 'easeInOut')
            ],
            head: [
                fromStance('head'),
                k(0.16, { rot: -10 }, 'easeIn'),
                k(0.48, { rot: 12 }, 'easeOut'),
                fromStance('head', {}, 1, 'easeInOut')
            ],
            hair: [
                fromStance('hair'),
                k(0.16, { rot: -16 }, 'easeIn'),
                k(0.48, { rot: 22 }, 'easeOutBack'),
                k(0.76, { rot: 6 }, 'easeOut'),
                fromStance('hair', {}, 1, 'easeInOut')
            ],
            upper_arm_r: [
                fromStance('upper_arm_r'),
                k(0.14, { rot: 42 }, 'easeInBack'),
                k(0.26, { rot: 58 }, 'easeOut'),
                k(0.48, { rot: -62 }, 'easeOutCubic'),
                k(0.68, { rot: -20 }, 'easeOut'),
                fromStance('upper_arm_r', {}, 1, 'easeInOut')
            ],
            forearm_r: [
                fromStance('forearm_r'),
                k(0.18, { rot: 36 }, 'easeIn'),
                k(0.48, { rot: -40 }, 'easeOutCubic'),
                k(0.72, { rot: 8 }, 'easeOut'),
                fromStance('forearm_r', {}, 1, 'easeInOut')
            ],
            hand_r: [
                fromStance('hand_r'),
                k(0.22, { rot: 10 }, 'easeInOut'),
                k(0.48, { rot: -16 }, 'easeOut'),
                fromStance('hand_r', {}, 1, 'easeInOut')
            ],
            upper_arm_l: [
                fromStance('upper_arm_l'),
                k(0.18, { rot: -22 }, 'easeInOut'),
                k(0.48, { rot: 26 }, 'easeOut'),
                fromStance('upper_arm_l', {}, 1, 'easeInOut')
            ],
            forearm_l: [
                fromStance('forearm_l'),
                k(0.48, { rot: -8 }, 'easeOut'),
                fromStance('forearm_l', {}, 1, 'easeInOut')
            ],
            upper_leg_r: [
                fromStance('upper_leg_r'),
                k(0.18, { rot: -14 }, 'easeInOut'),
                k(0.48, { rot: 18 }, 'easeOut'),
                fromStance('upper_leg_r', {}, 1, 'easeInOut')
            ],
            lower_leg_r: [
                fromStance('lower_leg_r'),
                k(0.48, { rot: 16 }, 'easeOut'),
                fromStance('lower_leg_r', {}, 1, 'easeInOut')
            ],
            upper_leg_l: [
                fromStance('upper_leg_l'),
                k(0.18, { rot: 10 }, 'easeInOut'),
                k(0.48, { rot: -16 }, 'easeOut'),
                fromStance('upper_leg_l', {}, 1, 'easeInOut')
            ],
            foot_l: [
                fromStance('foot_l'),
                k(0.48, { rot: 10 }, 'easeOut'),
                fromStance('foot_l', {}, 1, 'easeInOut')
            ]
        }
    };

    const skill_1 = {
        name: 'skill_1',
        duration: 1100,
        loop: false,
        events: [
            { t: 0.00, name: 'ATTACK_START' },
            { t: 0.18, name: 'ATTACK_ACTIVE' },
            { t: 0.50, name: 'IMPACT' },
            { t: 1.00, name: 'ATTACK_END' }
        ],
        tracks: {
            __root: [
                fromStance('__root', { sx: 1, sy: 1 }),
                k(0.14, { x: -16, y: 6 }, 'easeIn'),
                k(0.30, { x: 0, y: 40, sx: 0.93, sy: 1.08 }, 'easeOut'),
                k(0.40, { x: 10, y: 12, sx: 1.06, sy: 0.94 }, 'easeIn'),
                k(0.50, { x: 50, y: -10, sx: 1.1, sy: 0.9 }, 'easeOutCubic'),
                k(0.72, { x: 20, y: -2, sx: 1 }, 'easeOut'),
                fromStance('__root', { sx: 1, sy: 1 }, 1, 'easeInOut')
            ],
            pelvis: [
                fromStance('pelvis'),
                k(0.28, { rot: -8 }, 'easeInOut'),
                k(0.50, { rot: 12 }, 'easeOut'),
                fromStance('pelvis', {}, 1, 'easeInOut')
            ],
            torso: [
                fromStance('torso'),
                k(0.22, { rot: -12 }, 'easeInOut'),
                k(0.50, { rot: 14 }, 'easeOut'),
                fromStance('torso', {}, 1, 'easeInOut')
            ],
            head: [
                fromStance('head'),
                k(0.28, { rot: -6 }, 'easeInOut'),
                k(0.50, { rot: 10 }, 'easeOut'),
                fromStance('head', {}, 1, 'easeInOut')
            ],
            hair: [
                fromStance('hair'),
                k(0.32, { rot: -18 }, 'easeIn'),
                k(0.54, { rot: 20 }, 'easeOutBack'),
                fromStance('hair', {}, 1, 'easeInOut')
            ],
            upper_arm_r: [
                fromStance('upper_arm_r'),
                k(0.20, { rot: -40 }, 'easeInBack'),
                k(0.38, { rot: -58 }, 'easeOut'),
                k(0.50, { rot: 28 }, 'easeOutCubic'),
                fromStance('upper_arm_r', {}, 1, 'easeInOut')
            ],
            upper_arm_l: [
                fromStance('upper_arm_l'),
                k(0.20, { rot: 40 }, 'easeInBack'),
                k(0.38, { rot: 58 }, 'easeOut'),
                k(0.50, { rot: -20 }, 'easeOutCubic'),
                fromStance('upper_arm_l', {}, 1, 'easeInOut')
            ],
            forearm_r: [
                fromStance('forearm_r'),
                k(0.32, { rot: -18 }, 'easeInOut'),
                k(0.50, { rot: 10 }, 'easeOut'),
                fromStance('forearm_r', {}, 1, 'easeInOut')
            ],
            forearm_l: [
                fromStance('forearm_l'),
                k(0.32, { rot: 18 }, 'easeInOut'),
                k(0.50, { rot: -10 }, 'easeOut'),
                fromStance('forearm_l', {}, 1, 'easeInOut')
            ],
            upper_leg_r: [
                fromStance('upper_leg_r'),
                k(0.30, { rot: -20 }, 'easeInOut'),
                k(0.50, { rot: 14 }, 'easeOut'),
                fromStance('upper_leg_r', {}, 1, 'easeInOut')
            ],
            upper_leg_l: [
                fromStance('upper_leg_l'),
                k(0.30, { rot: 16 }, 'easeInOut'),
                k(0.50, { rot: -12 }, 'easeOut'),
                fromStance('upper_leg_l', {}, 1, 'easeInOut')
            ]
        }
    };

    const skill_2 = {
        name: 'skill_2',
        duration: 1240,
        loop: false,
        events: [
            { t: 0.00, name: 'ATTACK_START' },
            { t: 0.26, name: 'ATTACK_ACTIVE' },
            { t: 0.56, name: 'IMPACT' },
            { t: 1.00, name: 'ATTACK_END' }
        ],
        tracks: {
            __root: [
                fromStance('__root'),
                k(0.20, { x: -20, y: 8 }, 'easeIn'),
                k(0.40, { x: -8, y: 5, rot: -6 }, 'easeOut'),
                k(0.56, { x: 70, y: -14, rot: 9 }, 'easeOutCubic'),
                k(0.76, { x: 26, y: -3 }, 'easeOut'),
                fromStance('__root', {}, 1, 'easeInOut')
            ],
            pelvis: [
                fromStance('pelvis'),
                k(0.28, { rot: 10 }, 'easeInOut'),
                k(0.56, { rot: -14 }, 'easeOut'),
                fromStance('pelvis', {}, 1, 'easeInOut')
            ],
            torso: [
                fromStance('torso'),
                k(0.26, { rot: -16 }, 'easeIn'),
                k(0.42, { rot: -12 }, 'easeOut'),
                k(0.56, { rot: 20 }, 'easeOutCubic'),
                fromStance('torso', {}, 1, 'easeInOut')
            ],
            head: [
                fromStance('head'),
                k(0.28, { rot: -8 }, 'easeInOut'),
                k(0.56, { rot: 12 }, 'easeOut'),
                fromStance('head', {}, 1, 'easeInOut')
            ],
            hair: [
                fromStance('hair'),
                k(0.32, { rot: 12 }, 'easeInOut'),
                k(0.62, { rot: -12 }, 'easeOutBack'),
                fromStance('hair', {}, 1, 'easeInOut')
            ],
            upper_arm_r: [
                fromStance('upper_arm_r'),
                k(0.22, { rot: -52 }, 'easeInBack'),
                k(0.42, { rot: -72 }, 'easeOut'),
                k(0.56, { rot: 36 }, 'easeOutCubic'),
                k(0.78, { rot: 12 }, 'easeOut'),
                fromStance('upper_arm_r', {}, 1, 'easeInOut')
            ],
            forearm_r: [
                fromStance('forearm_r'),
                k(0.28, { rot: -34 }, 'easeInOut'),
                k(0.56, { rot: 16 }, 'easeOut'),
                fromStance('forearm_r', {}, 1, 'easeInOut')
            ],
            hand_r: [
                fromStance('hand_r'),
                k(0.38, { rot: -14 }, 'easeInOut'),
                k(0.56, { rot: 10 }, 'easeOut'),
                fromStance('hand_r', {}, 1, 'easeInOut')
            ],
            upper_arm_l: [
                fromStance('upper_arm_l'),
                k(0.26, { rot: 34 }, 'easeInOut'),
                k(0.56, { rot: -14 }, 'easeOut'),
                fromStance('upper_arm_l', {}, 1, 'easeInOut')
            ],
            forearm_l: [
                fromStance('forearm_l'),
                k(0.32, { rot: 20 }, 'easeInOut'),
                fromStance('forearm_l', {}, 1, 'easeInOut')
            ],
            upper_leg_r: [
                fromStance('upper_leg_r'),
                k(0.32, { rot: -12 }, 'easeInOut'),
                k(0.56, { rot: 16 }, 'easeOut'),
                fromStance('upper_leg_r', {}, 1, 'easeInOut')
            ],
            upper_leg_l: [
                fromStance('upper_leg_l'),
                k(0.32, { rot: 10 }, 'easeInOut'),
                k(0.56, { rot: -14 }, 'easeOut'),
                fromStance('upper_leg_l', {}, 1, 'easeInOut')
            ]
        }
    };

    const ultimate = {
        name: 'ultimate',
        duration: 2200,
        loop: false,
        events: [
            { t: 0.00, name: 'ATTACK_START' },
            { t: 0.14, name: 'ULT_PREPARE' },
            { t: 0.34, name: 'ULT_POSE' },
            { t: 0.50, name: 'ATTACK_ACTIVE' },
            { t: 0.68, name: 'IMPACT' },
            { t: 1.00, name: 'ATTACK_END' }
        ],
        tracks: {
            __root: [
                fromStance('__root', { sx: 1, sy: 1 }),
                k(0.14, { x: -36, y: 12 }, 'easeInBack'),
                k(0.34, { x: -14, y: 38, sx: 1.08, sy: 0.92 }, 'easeOut'),
                k(0.50, { x: 18, y: 14, sx: 1.12, sy: 1.1 }, 'easeInOut'),
                k(0.68, { x: 96, y: -24, sx: 1.16, sy: 0.88, rot: 9 }, 'easeOutCubic'),
                k(0.84, { x: 34, y: -6, sx: 1.02 }, 'easeOut'),
                fromStance('__root', { sx: 1, sy: 1 }, 1, 'easeInOut')
            ],
            pelvis: [
                fromStance('pelvis'),
                k(0.28, { rot: 12 }, 'easeInOut'),
                k(0.68, { rot: -18 }, 'easeOut'),
                fromStance('pelvis', {}, 1, 'easeInOut')
            ],
            torso: [
                fromStance('torso'),
                k(0.16, { rot: -24 }, 'easeIn'),
                k(0.36, { rot: -12 }, 'easeOut'),
                k(0.68, { rot: 28 }, 'easeOutCubic'),
                k(0.86, { rot: 8 }, 'easeOut'),
                fromStance('torso', {}, 1, 'easeInOut')
            ],
            neck: [
                fromStance('neck'),
                k(0.32, { rot: -8 }, 'easeInOut'),
                k(0.68, { rot: 10 }, 'easeOut'),
                fromStance('neck', {}, 1, 'easeInOut')
            ],
            head: [
                fromStance('head'),
                k(0.20, { rot: -14 }, 'easeInOut'),
                k(0.38, { rot: 5 }, 'easeOut'),
                k(0.68, { rot: 16 }, 'easeOut'),
                fromStance('head', {}, 1, 'easeInOut')
            ],
            hair: [
                fromStance('hair'),
                k(0.26, { rot: -24 }, 'easeIn'),
                k(0.48, { rot: 14 }, 'easeOut'),
                k(0.72, { rot: 28 }, 'easeOutBack'),
                fromStance('hair', {}, 1, 'easeOutElastic')
            ],
            upper_arm_r: [
                fromStance('upper_arm_r'),
                k(0.20, { rot: -66 }, 'easeInBack'),
                k(0.38, { rot: -82 }, 'easeOut'),
                k(0.68, { rot: 52 }, 'easeOutCubic'),
                fromStance('upper_arm_r', {}, 1, 'easeInOut')
            ],
            forearm_r: [
                fromStance('forearm_r'),
                k(0.32, { rot: -40 }, 'easeInOut'),
                k(0.68, { rot: 20 }, 'easeOut'),
                fromStance('forearm_r', {}, 1, 'easeInOut')
            ],
            hand_r: [
                fromStance('hand_r'),
                k(0.38, { rot: -18 }, 'easeInOut'),
                k(0.68, { rot: 12 }, 'easeOut'),
                fromStance('hand_r', {}, 1, 'easeInOut')
            ],
            upper_arm_l: [
                fromStance('upper_arm_l'),
                k(0.20, { rot: 52 }, 'easeInBack'),
                k(0.38, { rot: 66 }, 'easeOut'),
                k(0.68, { rot: -30 }, 'easeOutCubic'),
                fromStance('upper_arm_l', {}, 1, 'easeInOut')
            ],
            forearm_l: [
                fromStance('forearm_l'),
                k(0.32, { rot: 28 }, 'easeInOut'),
                k(0.68, { rot: -12 }, 'easeOut'),
                fromStance('forearm_l', {}, 1, 'easeInOut')
            ],
            upper_leg_r: [
                fromStance('upper_leg_r'),
                k(0.32, { rot: -18 }, 'easeInOut'),
                k(0.68, { rot: 24 }, 'easeOut'),
                fromStance('upper_leg_r', {}, 1, 'easeInOut')
            ],
            lower_leg_r: [
                fromStance('lower_leg_r'),
                k(0.38, { rot: 16 }, 'easeInOut'),
                k(0.68, { rot: 8 }, 'easeOut'),
                fromStance('lower_leg_r', {}, 1, 'easeInOut')
            ],
            upper_leg_l: [
                fromStance('upper_leg_l'),
                k(0.32, { rot: 14 }, 'easeInOut'),
                k(0.68, { rot: -20 }, 'easeOut'),
                fromStance('upper_leg_l', {}, 1, 'easeInOut')
            ],
            foot_r: [
                fromStance('foot_r'),
                k(0.68, { rot: -10 }, 'easeOut'),
                fromStance('foot_r', {}, 1, 'easeInOut')
            ],
            foot_l: [
                fromStance('foot_l'),
                k(0.68, { rot: 12 }, 'easeOut'),
                fromStance('foot_l', {}, 1, 'easeInOut')
            ]
        }
    };

    const hit = {
        name: 'hit',
        duration: 480,
        loop: false,
        events: [
            { t: 0, name: 'HIT_START' },
            { t: 1, name: 'HIT_END' }
        ],
        tracks: {
            __root: [
                fromStance('__root'),
                k(0.18, { x: -34, y: 8, rot: -8 }, 'easeOut'),
                k(0.52, { x: -16, y: 3 }, 'easeInOut'),
                fromStance('__root', {}, 1, 'easeOutBack')
            ],
            pelvis: [
                fromStance('pelvis'),
                k(0.22, { rot: -12 }, 'easeOut'),
                fromStance('pelvis', {}, 1, 'easeInOut')
            ],
            torso: [
                fromStance('torso'),
                k(0.24, { rot: -18 }, 'easeOut'),
                fromStance('torso', {}, 1, 'easeInOut')
            ],
            head: [
                fromStance('head'),
                k(0.18, { rot: -16 }, 'easeOut'),
                fromStance('head', {}, 1, 'easeInOut')
            ],
            hair: [
                fromStance('hair'),
                k(0.24, { rot: -24 }, 'easeOutBack'),
                fromStance('hair', {}, 1, 'easeOut')
            ],
            upper_arm_r: [
                fromStance('upper_arm_r'),
                k(0.28, { rot: 34 }, 'easeOut'),
                fromStance('upper_arm_r', {}, 1, 'easeInOut')
            ],
            upper_arm_l: [
                fromStance('upper_arm_l'),
                k(0.28, { rot: -34 }, 'easeOut'),
                fromStance('upper_arm_l', {}, 1, 'easeInOut')
            ]
        }
    };

    const death = {
        name: 'death',
        duration: 1450,
        loop: false,
        events: [
            { t: 0, name: 'DEATH_START' },
            { t: 1, name: 'DEATH_END' }
        ],
        tracks: {
            __root: [
                fromStance('__root', { alpha: 1 }),
                k(0.22, { x: -28, y: 10, rot: -12 }, 'easeIn'),
                k(0.52, { x: -52, y: -32, rot: -46 }, 'easeInCubic'),
                k(0.78, { x: -62, y: -74, rot: -74 }, 'easeIn'),
                k(1, { x: -70, y: -108, rot: -90, alpha: 0.1 }, 'easeIn')
            ],
            pelvis: [
                fromStance('pelvis'),
                k(0.48, { rot: -20 }, 'easeIn'),
                k(1, { rot: -30 }, 'easeIn')
            ],
            torso: [
                fromStance('torso'),
                k(0.42, { rot: -24 }, 'easeIn'),
                k(1, { rot: -38 }, 'easeIn')
            ],
            head: [
                fromStance('head'),
                k(0.32, { rot: 20 }, 'easeInOut'),
                k(1, { rot: 30 }, 'easeIn')
            ],
            hair: [
                fromStance('hair'),
                k(0.42, { rot: 26 }, 'easeOut'),
                k(1, { rot: 14 }, 'easeIn')
            ],
            upper_arm_r: [
                fromStance('upper_arm_r'),
                k(0.48, { rot: 52 }, 'easeInOut'),
                k(1, { rot: 64 }, 'easeIn')
            ],
            upper_arm_l: [
                fromStance('upper_arm_l'),
                k(0.48, { rot: -46 }, 'easeInOut'),
                k(1, { rot: -58 }, 'easeIn')
            ],
            upper_leg_r: [
                fromStance('upper_leg_r'),
                k(0.58, { rot: 22 }, 'easeIn'),
                k(1, { rot: 30 }, 'easeIn')
            ],
            upper_leg_l: [
                fromStance('upper_leg_l'),
                k(0.58, { rot: -18 }, 'easeIn'),
                k(1, { rot: -24 }, 'easeIn')
            ]
        }
    };

    const victory = {
        name: 'victory',
        duration: 1700,
        loop: false,
        events: [
            { t: 0.32, name: 'VICTORY_POSE' },
            { t: 1, name: 'VICTORY_END' }
        ],
        tracks: {
            __root: [
                fromStance('__root'),
                k(0.18, { y: 32 }, 'easeOut'),
                k(0.36, { y: 0 }, 'easeIn'),
                k(0.52, { y: 12 }, 'easeOut'),
                k(1, { y: 4 }, 'easeInOut')
            ],
            pelvis: [
                fromStance('pelvis'),
                k(0.38, { rot: -5 }, 'easeOut'),
                k(1, { rot: -2 }, 'easeInOut')
            ],
            torso: [
                fromStance('torso'),
                k(0.38, { rot: -10 }, 'easeOut'),
                k(1, { rot: -4 }, 'easeInOut')
            ],
            head: [
                fromStance('head'),
                k(0.38, { rot: 12 }, 'easeOutBack'),
                k(1, { rot: 6 }, 'easeInOut')
            ],
            hair: [
                fromStance('hair'),
                k(0.32, { rot: 18 }, 'easeOutBack'),
                k(0.68, { rot: 5 }, 'easeOut'),
                k(1, { rot: 3 }, 'easeInOut')
            ],
            upper_arm_r: [
                fromStance('upper_arm_r'),
                k(0.42, { rot: -82 }, 'easeOutBack'),
                k(1, { rot: -64 }, 'easeInOut')
            ],
            forearm_r: [
                fromStance('forearm_r'),
                k(0.48, { rot: -28 }, 'easeOut'),
                k(1, { rot: -16 }, 'easeInOut')
            ],
            hand_r: [
                fromStance('hand_r'),
                k(0.48, { rot: -12 }, 'easeOut'),
                k(1, { rot: -6 }, 'easeInOut')
            ],
            upper_arm_l: [
                fromStance('upper_arm_l'),
                k(0.42, { rot: 32 }, 'easeOut'),
                k(1, { rot: 20 }, 'easeInOut')
            ],
            upper_leg_r: [
                fromStance('upper_leg_r'),
                k(0.38, { rot: 12 }, 'easeOut'),
                k(1, { rot: 6 }, 'easeInOut')
            ],
            upper_leg_l: [
                fromStance('upper_leg_l'),
                k(0.38, { rot: -6 }, 'easeOut'),
                k(1, { rot: -2 }, 'easeInOut')
            ]
        }
    };

    return {
        characterId: 'naruto',
        skfUrl: 'assets/characters/naruto/skf/',
        displayName: 'Naruto Uzumaki',
        clips: {
            idle, walk, attack, skill_1, skill_2, ultimate, hit, death, victory
        },
        skillMap: {
            attack: 'attack',
            rasengan: 'skill_2',
            kage_bunshin: 'skill_1',
            odama: 'ultimate',
            kyubi: 'ultimate',
            kyubi_claw: 'attack',
            kyubi_regen: 'skill_1',
            bijuu_roar: 'ultimate',
            menacing_ball: 'ultimate',
            guard: 'idle'
        },
        ultimateClip: 'ultimate',
        hitStopMs: { attack: 75, skill_1: 85, skill_2: 95, ultimate: 150 },
        shake: { attack: 8, skill_1: 9, skill_2: 11, ultimate: 18 }
    };
})();

if (typeof window !== 'undefined') window.NarutoSkelAnims = NarutoSkelAnims;
