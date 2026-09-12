const IntroScene = {
    render() {
        const el = document.createElement('div');
        el.className = 'scene intro-scene active';
        el.innerHTML = `
            <div class="intro-atmosphere" aria-hidden="true">
                <div class="intro-orb intro-orb-a"></div>
                <div class="intro-orb intro-orb-b"></div>
                <div class="intro-ring"></div>
            </div>
            <div class="intro-content">
                <p class="intro-kicker">OPERATION CHIKITRISKIS</p>
                <div class="intro-ornament" aria-hidden="true">✦</div>
                <h1 class="intro-title">
                    <span class="intro-title-line">Para mi</span>
                    <span class="intro-title-name">Chikiwitina Chikitriskis</span>
                </h1>
                <div class="intro-heart-wrap" aria-hidden="true">
                    <span class="intro-heart">♥</span>
                </div>
                <p class="intro-subtitle">Tengo algo preparado para ti...</p>
                <button class="btn-destiny intro-start-button" id="btn-start" type="button">COMENZAR LA AVENTURA <span aria-hidden="true">→</span></button>
            </div>
            <div class="intro-transition-text" id="intro-transition">
                <p class="intro-transition-copy">Toda gran aventura comienza con algo inesperado...</p>
            </div>
            <button class="hidden-star" style="top:15%;right:10%;" data-egg="star" type="button">✦</button>
        `;
        return el;
    },

    enter(el) {
        AudioManager.setTheme('stardew');
        ParticleSystem.setIntensity(1.35);

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from(el.querySelector('.intro-kicker'), { y: 16, opacity: 0, duration: 0.8 })
          .from(el.querySelector('.intro-ornament'), { scale: 0.6, opacity: 0, duration: 0.6 }, '-=0.3')
          .from(el.querySelector('.intro-title-line'), { y: 24, opacity: 0, duration: 0.9 }, '-=0.2')
          .from(el.querySelector('.intro-title-name'), { y: 28, opacity: 0, duration: 1 }, '-=0.55')
          .from(el.querySelector('.intro-heart-wrap'), { scale: 0.5, opacity: 0, duration: 0.7 }, '-=0.4')
          .from(el.querySelector('.intro-subtitle'), { y: 16, opacity: 0, duration: 0.8 }, '-=0.35')
          .from(el.querySelector('.btn-destiny'), { y: 18, opacity: 0, duration: 0.75 }, '-=0.25');

        el.querySelector('#btn-start').addEventListener('click', () => this.startTransition(el));
        el.querySelector('[data-egg="star"]')?.addEventListener('click', () => {
            Achievements.show('curious');
            ParticleSystem.burst(window.innerWidth * 0.9, window.innerHeight * 0.15, 20);
        });
    },

    startTransition(el) {
        AudioManager.ui.click();
        ParticleSystem.setIntensity(2.2);

        const transition = el.querySelector('#intro-transition');
        gsap.to(el.querySelector('.intro-content'), { opacity: 0, scale: 0.98, duration: 0.7, ease: 'power2.in' });
        gsap.to(transition, {
            opacity: 1,
            duration: 1,
            delay: 0.35,
            onStart: () => { transition.style.pointerEvents = 'auto'; }
        });
        gsap.from(transition.querySelector('.intro-transition-copy'), {
            y: 20, opacity: 0, duration: 1.1, delay: 0.55
        });

        setTimeout(() => {
            ParticleSystem.setIntensity(1);
            SceneManager.goTo('letter');
        }, 3400);
    }
};
