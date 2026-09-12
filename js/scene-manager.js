/**
 * Scene Manager — prepare under wipe, then reveal (no FOUC)
 */
const SceneManager = {
    container: null,
    currentScene: null,
    scenes: {},
    _transitioning: false,

    init() {
        this.container = document.getElementById('scene-container');
        this.registerScenes();
        if (typeof MotionFx !== 'undefined') MotionFx.ensureWipe();
    },

    registerScenes() {
        this.scenes = {
            intro: IntroScene,
            letter: LetterScene,
            prologue: PrologueScene,
            arena: ArenaScene,
            hub: ArenaScene,
            destiny: DestinySystemScene,
            gacha: GachaScene,
            legendary: LegendaryPullScene,
            reveal: RevealScene,
            final: FinalScene
        };
    },

    goTo(sceneName, data = {}) {
        if (this._transitioning) return;
        this._transitioning = true;

        if (this.currentScene && this.scenes[this.currentScene]?.exit) {
            try {
                this.scenes[this.currentScene].exit();
            } catch (err) {
                console.error('Scene exit failed:', this.currentScene, err);
            }
        }

        const oldEl = this.container.querySelector('.scene.active');
        this.currentScene = sceneName;
        GameState.set('currentScene', sceneName);

        const scene = this.scenes[sceneName];
        if (!scene) {
            console.error('Scene not found:', sceneName);
            this._transitioning = false;
            return;
        }

        const midSwap = () => {
            const el = scene.render(data);
            el.classList.add('scene', 'active', 'mx-booting');
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            this.container.appendChild(el);
            return el;
        };

        // Runs WHILE wipe still covers / opacity 0 — wire UI + correct banner first
        const prepareIn = async (el) => {
            if (scene.enter) {
                scene.enter(el, data);
            }
            // Decode primary stage briefly — don't block entry on heavy assets
            if ((sceneName === 'gacha' || el.classList.contains('gacha-scene'))
                && typeof GachaScene !== 'undefined'
                && GachaScene.waitStageReady) {
                try {
                    await GachaScene.waitStageReady(el, 120);
                } catch (_) { /* ignore */ }
            }
            // Unlock boot chrome UNDER the wipe — otherwise fade-in shows an empty shell
            if (typeof MotionFx !== 'undefined') {
                if (sceneName === 'gacha' || el.classList.contains('gacha-scene')) {
                    MotionFx.revealGacha(el);
                } else if (sceneName === 'arena' || sceneName === 'hub' || el.classList.contains('arena-scene')) {
                    MotionFx.revealArena(el);
                } else {
                    el.classList.remove('mx-booting');
                }
            } else {
                el.classList.remove('mx-booting');
            }
        };

        // After parent is visible — finish transition bookkeeping only
        const afterIn = (el) => {
            el.style.opacity = '';
            el.style.visibility = '';
            this._transitioning = false;
            if (typeof MotionFx === 'undefined') {
                el.classList.remove('mx-booting');
            }
        };

        const runFallback = () => {
            if (oldEl) oldEl.remove();
            const el = midSwap();
            prepareIn(el);
            el.style.visibility = 'visible';
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(el, { opacity: 0 }, {
                    opacity: 1,
                    duration: 0.4,
                    onComplete: () => afterIn(el)
                });
            } else {
                el.style.opacity = '1';
                afterIn(el);
            }
        };

        if (typeof MotionFx !== 'undefined' && MotionFx.swapScene) {
            // Gacha: skip CONVOCAR wipe — heavy thumbs + stage already tax the GPU
            const mode = (sceneName === 'gacha') ? 'quick' : undefined;
            MotionFx.swapScene({ outEl: oldEl, midSwap, prepareIn, afterIn, mode }).catch((err) => {
                console.error('MotionFx swap failed', err);
                this._transitioning = false;
                runFallback();
            });
        } else {
            runFallback();
        }
    },

    resume() {
        const saved = GameState.get('currentScene') || 'intro';

        if (GameState.get('finalSeen')) {
            this.goTo('arena');
        } else if (GameState.get('codeClaimed')) {
            this.goTo('final');
        } else if (GameState.get('legendaryObtained') || GameState.get('codeRevealed')) {
            this.goTo('reveal');
        } else if (GameState.get('storyComplete') && GameState.flag('gate_final_cleared') && !GameState.get('bossDefeated')) {
            this.goTo('gacha');
        } else if (GameState.get('prologueDone') || saved === 'hub' || saved === 'destiny' || saved === 'arena') {
            this.goTo('arena');
        } else if (saved === 'prologue') {
            this.goTo('prologue');
        } else if (saved === 'letter') {
            this.goTo('letter');
        } else {
            this.goTo('intro');
        }
    }
};
