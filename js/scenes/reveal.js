const RevealScene = {
    render() {
        const el = document.createElement('div');
        el.className = 'scene reveal-scene active';
        el.innerHTML = `
            <div class="steam-code-box" id="reveal-box">
                <h2 class="title-sub">STEAM ACTIVATION CODE</h2>
                <div class="code-display code-hidden" id="code-display">XXXX-XXXX-XXXX-XXXX</div>
                <button class="btn-destiny" id="btn-reveal-code">REVELAR CÓDIGO</button>
                <button class="btn-secondary hidden" id="btn-copy-code" style="margin-top:1rem;">COPIAR CÓDIGO</button>
                <p class="text-body hidden" id="copy-msg" style="margin-top:0.5rem;font-size:0.9rem;">Código copiado.</p>
            </div>
        `;
        return el;
    },

    enter(el) {
        gsap.from(el.querySelector('#reveal-box'), { scale: 0.8, opacity: 0, duration: 1, ease: 'back.out(1.5)' });

        const codeDisplay = el.querySelector('#code-display');
        const btnReveal = el.querySelector('#btn-reveal-code');
        const btnCopy = el.querySelector('#btn-copy-code');
        const copyMsg = el.querySelector('#copy-msg');

        btnReveal.addEventListener('click', async () => {
            AudioManager.gacha.revealDone();
            screenShake(document.getElementById('app'));

            btnReveal.textContent = 'ROMPIENDO CADENAS...';
            btnReveal.disabled = true;

            await this.wait(1500);
            ParticleSystem.burst(window.innerWidth / 2, window.innerHeight / 2, 40, '#f4d03f');

            codeDisplay.textContent = CONFIG._steamCode || CONFIG.steamCode;
            codeDisplay.classList.remove('code-hidden');
            btnReveal.classList.add('hidden');
            btnCopy.classList.remove('hidden');

            GameState.set('codeRevealed', true);
            AudioManager.ui.victory();
        });

        btnCopy.addEventListener('click', () => {
            const code = CONFIG._steamCode || CONFIG.steamCode;

            const finish = (copied) => {
                AudioManager.ui.copy();
                copyMsg.classList.remove('hidden');
                copyMsg.textContent = copied
                    ? 'Código copiado. Ahora corre a Steam antes de que desaparezca mágicamente.'
                    : 'Selecciona y copia el código manualmente.';
                GameState.set('codeClaimed', true);

                if (!el.querySelector('#btn-to-final')) {
                    const next = document.createElement('button');
                    next.id = 'btn-to-final';
                    next.className = 'btn-destiny';
                    next.style.marginTop = '1.5rem';
                    next.textContent = 'CONTINUAR';
                    next.addEventListener('click', () => {
                        AudioManager.ui.click();
                        SceneManager.goTo('final');
                    });
                    el.querySelector('#reveal-box').appendChild(next);
                }

                setTimeout(() => {
                    if (GameState.get('currentScene') === 'reveal') SceneManager.goTo('final');
                }, 4000);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(code).then(() => finish(true)).catch(() => finish(false));
            } else {
                finish(false);
            }
        });

        if (GameState.get('codeRevealed')) {
            codeDisplay.textContent = CONFIG._steamCode || CONFIG.steamCode;
            codeDisplay.classList.remove('code-hidden');
            btnReveal.classList.add('hidden');
            btnCopy.classList.remove('hidden');
        }
    },

    wait(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
};
