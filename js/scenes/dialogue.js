/**
 * Visual-novel style dialogue — Persona portraits + slanted panels
 */
const DialogueScene = {
    queue: [],
    onComplete: null,
    choiceHandler: null,
    root: null,

    /**
     * open({ lines, choices, onComplete, title, bondLabel, portrait, bondLevel })
     * lines: [{ speaker, text, portrait? }]
     */
    open({
        lines = [],
        choices = null,
        onComplete = null,
        title = '',
        bondLabel = '',
        portrait = '',
        bondLevel = null
    } = {}) {
        this.close();
        this.queue = [...lines];
        this.onComplete = onComplete;
        this.choiceHandler = choices;
        this._title = title;
        this._bondLabel = bondLabel;
        this._portrait = portrait;
        this._bondLevel = bondLevel;

        const root = document.createElement('div');
        root.className = 'vn-root';
        root.id = 'vn-root';
        const hearts = typeof bondLevel === 'number'
            ? `<div class="vn-lazo"><span class="vn-heart">♥</span> Lazo Lv. ${bondLevel}</div>`
            : (bondLabel ? `<div class="vn-lazo">${bondLabel}</div>` : '');

        root.innerHTML = `
            <div class="vn-dim"></div>
            <div class="vn-stage">
                <div class="vn-portrait-wrap ${portrait ? '' : 'empty'}">
                    <div class="vn-portrait" id="vn-portrait" style="${portrait ? `background-image:url('${portrait}')` : ''}"></div>
                </div>
                ${hearts}
                <div class="vn-panel">
                    ${title ? `<div class="vn-title">${title}</div>` : ''}
                    <div class="vn-speaker" id="vn-speaker"></div>
                    <div class="vn-text" id="vn-text"></div>
                    <div class="vn-choices hidden" id="vn-choices"></div>
                    <button class="vn-next" id="vn-next" type="button">▼</button>
                </div>
            </div>
        `;
        document.body.appendChild(root);
        this.root = root;

        root.querySelector('#vn-next').onclick = () => this.advance();
        root.addEventListener('click', (e) => {
            if (e.target.closest('.vn-choice')) return;
            if (e.target.closest('#vn-choices') && !e.target.closest('.vn-choice')) return;
            if (!root.querySelector('#vn-choices')?.classList.contains('hidden')) return;
            if (e.target.closest('.vn-next') || e.target.closest('.vn-panel') || e.target.closest('.vn-dim')) {
                this.advance();
            }
        });

        this.showNext();
        AudioManager.setTheme('stardew');
    },

    setPortrait(src) {
        const el = this.root?.querySelector('#vn-portrait');
        const wrap = this.root?.querySelector('.vn-portrait-wrap');
        if (!el || !wrap) return;
        if (src) {
            el.style.backgroundImage = `url('${src}')`;
            wrap.classList.remove('empty');
        }
    },

    showNext() {
        if (!this.root) return;
        const speaker = this.root.querySelector('#vn-speaker');
        const text = this.root.querySelector('#vn-text');
        const nextBtn = this.root.querySelector('#vn-next');
        const choicesEl = this.root.querySelector('#vn-choices');

        if (!this.queue.length) {
            if (this.choiceHandler && this.choiceHandler.length) {
                nextBtn.classList.add('hidden');
                choicesEl.classList.remove('hidden');
                choicesEl.innerHTML = this.choiceHandler.map((c, i) =>
                    `<button class="vn-choice" data-i="${i}" type="button">${c.text}</button>`
                ).join('');
                choicesEl.querySelectorAll('.vn-choice').forEach(btn => {
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        const i = +btn.dataset.i;
                        const choice = this.choiceHandler[i];
                        AudioManager.ui.click();
                        if (choice.onPick) choice.onPick();
                        this.choiceHandler = null;
                        this.finish(choice);
                    };
                });
                if (window.gsap) {
                    gsap.fromTo(choicesEl.querySelectorAll('.vn-choice'),
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'expo.out', force3D: true, overwrite: 'auto' }
                    );
                }
                return;
            }
            this.finish(null);
            return;
        }

        const line = this.queue.shift();
        speaker.textContent = line.speaker || '';
        text.textContent = line.text || '';
        if (line.portrait) this.setPortrait(line.portrait);
        nextBtn.classList.remove('hidden');
        choicesEl.classList.add('hidden');
        if (window.gsap) {
            gsap.fromTo(speaker, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.24, ease: 'expo.out', force3D: true });
            gsap.fromTo(text, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', force3D: true });
        }
    },

    advance() {
        if (!this.root) return;
        if (!this.root.querySelector('#vn-choices')?.classList.contains('hidden')) return;
        AudioManager.ui.click();
        this.showNext();
    },

    finish(choice) {
        const cb = this.onComplete;
        this.close();
        if (cb) cb(choice);
    },

    close() {
        if (this.root) {
            this.root.remove();
            this.root = null;
        }
        this.queue = [];
        this.choiceHandler = null;
        this.onComplete = null;
    }
};
