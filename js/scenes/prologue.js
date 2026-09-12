/**
 * Prologue after Stardew letter → Arena
 */
const PrologueScene = {
    render() {
        const el = document.createElement('div');
        el.className = 'scene prologue-scene active';
        el.innerHTML = `
            <div class="hub-splash">
                <p class="hub-kicker">PHANTOM DESTINY</p>
                <h1 class="hub-splash-title">La esencia de Persona…<br>en tu operación legendaria</h1>
                <p class="hub-splash-sub">Combates · Invocaciones · Convenio · Regalo</p>
                <p class="hub-splash-note">Pelear gana tiradas. El legendario sale del gacha.</p>
                <button class="btn-destiny" id="btn-prologue" type="button">ENTRAR A LA ARENA</button>
            </div>
        `;
        return el;
    },

    enter(el) {
        if (typeof AudioManager !== 'undefined' && AudioManager.setTheme) {
            AudioManager.setTheme('stardew');
        }

        const btn = el.querySelector('#btn-prologue');
        if (!btn) return;

        const goArena = () => {
            GameState.update({ prologueDone: true, currentScene: 'arena' });
            SceneManager.goTo('arena');
        };

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
                AudioManager.sfx?.button?.();
            } catch (_) { /* ignore */ }

            const lines = (typeof StoryData !== 'undefined' && StoryData.prologue) ? StoryData.prologue : [];
            if (typeof DialogueScene !== 'undefined' && lines.length) {
                try {
                    DialogueScene.open({
                        title: 'PRÓLOGO',
                        lines,
                        onComplete: goArena
                    });
                    return;
                } catch (err) {
                    console.error('Dialogue failed, going to arena:', err);
                }
            }
            goArena();
        };
    }
};
