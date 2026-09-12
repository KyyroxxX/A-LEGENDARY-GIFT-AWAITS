const FinalScene = {
    render() {
        const el = document.createElement('div');
        el.className = 'scene final-scene active';
        el.innerHTML = `
            <div class="final-content">
                <h1 class="final-title">MISIÓN COMPLETADA ❤️</h1>
                <button class="btn-destiny final-continue" id="btn-continue-playing" type="button">SEGUIR JUGANDO · VOLVER A LA ARENA</button>
                <p class="final-message">Enhorabuena, ${CONFIG.recipientShort}.</p>
                <p class="final-message">Has sobrevivido al sistema de gacha.</p>
                <p class="final-message">Has derrotado al RNG.</p>
                <p class="final-message">Has destruido al 50/50.</p>
                <p class="final-message">Y has conseguido el premio legendario.</p>
                <br>
                <p class="final-message">Pero espero que disfrutes algo más que el juego.</p>
                <p class="final-message">Espero que recuerdes toda esta pequeña aventura.</p>
                <p class="final-message">Porque podría haberte dado simplemente una clave.</p>
                <p class="final-message">Pero quería darte algo diferente.</p>
                <p class="final-message">Algo que pudieras abrir. Explorar. Jugar. Descubrir.</p>
                <p class="final-message">Algo hecho especialmente para ti.</p>
                <p class="final-message">Porque tú mereces cosas especiales.</p>
                <p class="final-message">Y porque me encanta hacer cosas absurdamente complicadas cuando se trata de ti.</p>
                <h2 class="final-love">${CONFIG.finalMessage}</h2>
                <p class="final-signature">${CONFIG.signature}</p>
                <p class="final-subtitle">${CONFIG.signatureSubtitle}</p>
            </div>
        `;
        return el;
    },

    enter(el) {
        AudioManager.setTheme('stardew');
        const messages = el.querySelectorAll('.final-message, .final-title, .final-love, .final-signature, .final-subtitle');
        messages.forEach((msg, i) => {
            gsap.from(msg, { opacity: 0, y: 20, duration: 0.6, delay: 0.5 + i * 0.2 });
        });
        el.querySelector('#btn-continue-playing')?.addEventListener('click', () => {
            AudioManager.ui.click();
            GameState.set('finalSeen', true);
            SceneManager.goTo('arena');
        });
        ParticleSystem.setIntensity(1.5);
        AudioManager.ui.victory();
    }
};
