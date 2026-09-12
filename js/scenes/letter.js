/**
 * Stardew Valley intro — desk frames + drawer → letter
 * Hotspots are laid out in image-space so they stay aligned with object-fit:contain.
 */
const LetterScene = {
    phase: 'desk',
    _layoutBound: null,

    // Percent of each source image (natural pixels)
    HOTSPOTS: {
        closed: {
            // bottom drawer unit on desk-closed.png
            drawer: { left: 66, top: 52, width: 30, height: 42 }
        },
        open: {
            // sealed envelope on desk-open.png (seal ~68%, 62%)
            letter: { left: 50, top: 48, width: 36, height: 30 }
        }
    },

    render() {
        const el = document.createElement('div');
        el.className = 'scene letter-scene active';
        el.innerHTML = `
            <div class="sdv-office" id="sdv-office">
                <div class="sdv-stage" id="sdv-stage">
                    <img class="sdv-frame sdv-frame-closed" id="sdv-img-closed" src="assets/ui/sdv/desk-closed.png" alt="Escritorio" draggable="false">
                    <img class="sdv-frame sdv-frame-open" id="sdv-img-open" src="assets/ui/sdv/desk-open.png" alt="Cajón abierto" draggable="false">

                    <button class="sdv-hotspot sdv-hotspot-drawer" id="sdv-drawer-btn" type="button" aria-label="Abrir cajón"></button>
                    <button class="sdv-hotspot sdv-hotspot-letter" id="sdv-envelope-btn" type="button" aria-label="Coger la carta" hidden></button>
                </div>
                <p class="sdv-prompt" id="sdv-prompt">Haz clic en el cajón…</p>
            </div>
        `;
        return el;
    },

    layoutStage(el) {
        const office = el.querySelector('#sdv-office');
        const stage = el.querySelector('#sdv-stage');
        const closed = el.querySelector('#sdv-img-closed');
        const open = el.querySelector('#sdv-img-open');
        const drawerBtn = el.querySelector('#sdv-drawer-btn');
        const letterBtn = el.querySelector('#sdv-envelope-btn');
        if (!office || !stage || !closed.naturalWidth) return;

        const active = this.phase === 'desk' ? closed : open;
        const nw = active.naturalWidth;
        const nh = active.naturalHeight;
        const ow = office.clientWidth;
        const oh = office.clientHeight;
        if (!nw || !nh || !ow || !oh) return;

        const scale = Math.min(ow / nw, oh / nh);
        const dw = Math.round(nw * scale);
        const dh = Math.round(nh * scale);
        const left = Math.round((ow - dw) / 2);
        const top = Math.round((oh - dh) / 2);

        stage.style.width = `${dw}px`;
        stage.style.height = `${dh}px`;
        stage.style.left = `${left}px`;
        stage.style.top = `${top}px`;

        const place = (btn, box) => {
            if (!btn || !box) return;
            btn.style.left = `${box.left}%`;
            btn.style.top = `${box.top}%`;
            btn.style.width = `${box.width}%`;
            btn.style.height = `${box.height}%`;
            btn.style.right = 'auto';
            btn.style.bottom = 'auto';
        };

        place(drawerBtn, this.HOTSPOTS.closed.drawer);
        place(letterBtn, this.HOTSPOTS.open.letter);
    },

    enter(el) {
        this.phase = 'desk';
        AudioManager.setTheme('stardew');

        const canvas = document.getElementById('particle-canvas');
        if (canvas) canvas.style.opacity = '0';

        const office = el.querySelector('#sdv-office');
        const drawerBtn = el.querySelector('#sdv-drawer-btn');
        const envelopeBtn = el.querySelector('#sdv-envelope-btn');
        const prompt = el.querySelector('#sdv-prompt');
        const closed = el.querySelector('#sdv-img-closed');
        const open = el.querySelector('#sdv-img-open');

        const relayout = () => this.layoutStage(el);
        this._layoutBound = relayout;
        window.addEventListener('resize', relayout);

        const whenReady = () => {
            if (closed.complete && closed.naturalWidth && open.complete && open.naturalWidth) {
                relayout();
            }
        };
        closed.addEventListener('load', whenReady);
        open.addEventListener('load', whenReady);
        whenReady();
        // GSAP fade-in can leave size mid-transition
        setTimeout(relayout, 50);
        setTimeout(relayout, 450);

        drawerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.phase !== 'desk') return;
            this.phase = 'open';
            AudioManager.ui.drawer();
            office.classList.add('is-opening');
            drawerBtn.hidden = true;
            envelopeBtn.hidden = false;
            prompt.textContent = 'Haz clic en la carta sellada…';
            // open frame has different aspect — re-anchor hotspots
            requestAnimationFrame(relayout);
            setTimeout(relayout, 40);
        });

        envelopeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.phase !== 'open') return;
            this.phase = 'letter';
            AudioManager.ui.paper();
            office.classList.add('is-lift');
            prompt.style.opacity = '0';
            setTimeout(() => {
                office.classList.add('is-gone');
                this.showLetter(el);
            }, 500);
        });
    },

    exit() {
        if (this._layoutBound) {
            window.removeEventListener('resize', this._layoutBound);
            this._layoutBound = null;
        }
        const canvas = document.getElementById('particle-canvas');
        if (canvas) canvas.style.opacity = '';
    },

    showLetter(el) {
        if (this._layoutBound) {
            window.removeEventListener('resize', this._layoutBound);
            this._layoutBound = null;
        }

        const letter = document.createElement('div');
        letter.className = 'sdv-letter';
        letter.innerHTML = `
            <div class="sdv-letter-paper" id="sdv-paper">
                <p class="sdv-greeting">${CONFIG.letterContent.greeting}</p>
                ${CONFIG.letterContent.paragraphs.map(p => `<p class="sdv-p">${p}</p>`).join('')}
                <div class="sdv-closing">
                    ${CONFIG.letterContent.closing.map(p => `<p>${p}</p>`).join('')}
                </div>
                <button class="sdv-next" id="btn-accept" type="button" aria-label="Continuar" title="Continuar"></button>
            </div>
        `;
        el.appendChild(letter);

        if (window.gsap) {
            gsap.fromTo(letter, { opacity: 0 }, { opacity: 1, duration: 0.4 });
            gsap.fromTo(letter.querySelector('.sdv-letter-paper'), {
                y: 24, scale: 0.97
            }, { y: 0, scale: 1, duration: 0.5, ease: 'power2.out' });
        }

        const go = () => {
            AudioManager.ui.click();
            const canvas = document.getElementById('particle-canvas');
            if (canvas) canvas.style.opacity = '';
            SceneManager.goTo('prologue');
        };
        letter.querySelector('#btn-accept').addEventListener('click', go);
    }
};
