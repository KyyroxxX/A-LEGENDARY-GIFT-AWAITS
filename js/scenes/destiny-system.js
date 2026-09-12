const DestinySystemScene = {
    render() {
        const invocations = GameState.get('invocations') || 0;
        const runs = GameState.get('huntRunsCompleted') || 0;
        const bossDefeated = GameState.get('bossDefeated');

        const el = document.createElement('div');
        el.className = 'scene destiny-scene active';
        el.innerHTML = `
            <div class="system-panel">
                <h2 class="system-title">DESTINY SYSTEM INITIALIZED</h2>
                <p class="text-body">Para reclamar aquello que te espera...</p>
                <p class="text-body">Primero deberás conseguir Invocaciones del Destino.</p>

                <div class="currency-display">
                    <div class="currency-icon">✦</div>
                    <div>
                        <div class="currency-name">${CONFIG.currencyName}</div>
                        <div class="text-body" style="font-size:0.9rem;margin-top:0.3rem;">Combate táctico · debilidades · All-Out Attack</div>
                    </div>
                </div>

                <p class="text-body">Enfréntate en combates por turnos.<br>Derrota al RNG con One Piece, Naruto y JoJo.<br>Convierte tus victorias en invocaciones.</p>

                <div class="gacha-stat" style="margin:1.5rem auto;text-align:center;max-width:280px;">
                    <div class="gacha-stat-label">INVOCACIONES DISPONIBLES</div>
                    <div class="gacha-stat-value" id="invocation-count">${invocations}</div>
                </div>

                <div id="destiny-actions">
                    ${!bossDefeated ? `
                        <button class="btn-destiny" id="btn-hunt">COMENZAR COMBATE DEL DESTINO</button>
                        ${runs > 0 ? `<p class="text-body" style="margin-top:1rem;font-size:0.9rem;">Combates completados: ${runs} / 5 · luego THE 50/50</p>` : ''}
                    ` : `
                        <button class="btn-destiny" id="btn-gacha">IR AL BANNER</button>
                    `}
                    ${invocations > 0 ? `
                        <button class="btn-secondary" id="btn-gacha-early" style="margin-top:1rem;">ABRIR CONVENUE (${invocations})</button>
                    ` : ''}
                </div>
            </div>
            <button class="easter-egg-btn" data-egg="useless" type="button"></button>
        `;
        return el;
    },

    enter(el) {
        AudioManager.setTheme('stardew');
        gsap.from(el.querySelector('.system-panel'), { scale: 0.92, opacity: 0, duration: 0.85, ease: 'power3.out' });

        el.querySelector('#btn-hunt')?.addEventListener('click', () => {
            AudioManager.ui.click();
            SceneManager.goTo('arena');
        });

        el.querySelector('#btn-gacha')?.addEventListener('click', () => {
            AudioManager.ui.click();
            SceneManager.goTo('gacha');
        });

        el.querySelector('#btn-gacha-early')?.addEventListener('click', () => {
            AudioManager.ui.click();
            SceneManager.goTo('gacha');
        });

        let uselessClicks = 0;
        el.querySelector('[data-egg="useless"]')?.addEventListener('click', () => {
            uselessClicks++;
            if (uselessClicks === 1) this.showEggMessage('Este botón no hacía nada.');
            else if (uselessClicks >= 2) {
                this.showEggMessage('Ahora sí.');
                Achievements.show('useless_btn');
                ParticleSystem.burst(30, window.innerHeight - 30, 15);
            }
        });
    },

    showEggMessage(msg) {
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.style.transform = 'translateX(0)';
        toast.style.position = 'fixed';
        toast.style.bottom = '2rem';
        toast.style.left = '1rem';
        toast.innerHTML = `<div class="achievement-desc">${msg}</div>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};
