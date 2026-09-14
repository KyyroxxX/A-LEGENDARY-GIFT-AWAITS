/**
 * Achievement System
 */
const Achievements = {
    queue: [],
    showing: false,

    show(id) {
        const unlocked = GameState.unlockAchievement(id);
        if (!unlocked) return;

        const achievement = CONFIG.achievements.find(a => a.id === id);
        if (!achievement) return;

        this.queue.push(achievement);
        this.flush();
    },

    flush() {
        if (this.showing || !this.queue.length) return;
        const achievement = this.queue.shift();
        const container = document.getElementById('achievement-container');
        if (!container) return;

        this.showing = true;
        AudioManager.ui.achievement();
        const toast = document.createElement('div');
        toast.className = 'achievement-toast persona-achievement';
        toast.setAttribute('role', 'status');
        toast.innerHTML = `
            <div class="persona-achievement-mark" aria-hidden="true"><img src="assets/branding/app-logo.png?v=3" alt=""></div>
            <div class="persona-achievement-copy">
                <div class="achievement-label">LOGRO DESBLOQUEADO</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-desc">${achievement.desc}</div>
                <div class="persona-achievement-foot">PHANTOM DESTINY · ARCHIVO DEL DESTINO</div>
            </div>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => {
                toast.remove();
                this.showing = false;
                this.flush();
            }, 550);
        }, 5000);
    },

    checkScene(scene) {
        if (scene === 'gacha' && GameState.get('pullsDone') === 0) {
            // Will trigger on first pull
        }
    },

    /** Logros ocultos: se muestran como ??? hasta conseguirlos. */
    HIDDEN: ['curious', 'useless_btn', 'volume_touch'],

    /** Cómo conseguir los no ocultos que falten. */
    HINTS: {
        first_pull: 'Haz tu primera tirada en el Convenio.',
        rng_survivor: 'Sobrevive a otro banner (tira 2+ veces).',
        chiki_master: 'Domina la Caza del Destino (progresa en la crónica).',
        boss_5050: 'Derrota a THE 50/50.',
        legendary: 'Obtén la recompensa legendaria (regalo).',
        curious: 'Hay secretos escondidos en las pantallas…',
        useless_btn: 'Hay un botón que parecía no hacer nada…',
        volume_touch: 'Toca el control de volumen del destino.',
        first_battle: 'Entra por primera vez en combate.',
        first_victory: 'Gana tu primer combate.',
        triple_threat: 'Forma un equipo completo de 3 personajes.',
        no_support: 'Entra en combate sin ningún support.',
        critical_hit: 'Consigue un golpe crítico.',
        weakness_exploited: 'Explota una debilidad elemental.',
        first_transform: 'Presencia una transformación en combate.',
        finisher: 'Ejecuta un remate.',
        assault: 'Desata un Asalto contra el enemigo.',
        long_battle: 'Llega a la ronda 10 de un combate.',
        last_stand: 'Gana con un aliado al límite.',
        multi_pull: 'Haz una invocación múltiple (×10).',
        dupe_hunter: 'Consigue un duplicado (dupe).',
        five_star: 'Obtén un personaje de 5★.',
        six_star: 'Obtén un personaje de 6★.'
    },

    unlockedList() {
        const list = (typeof GameState !== 'undefined' && GameState.get('achievements')) || [];
        return Array.isArray(list) ? list : [];
    },

    open() {
        this.close();
        const all = (typeof CONFIG !== 'undefined' && CONFIG.achievements) || [];
        const owned = new Set(this.unlockedList());
        const modal = document.createElement('div');
        modal.className = 'ach-modal';
        modal.id = 'ach-modal';
        const pct = all.length ? Math.round((all.filter(a => owned.has(a.id)).length / all.length) * 100) : 0;
        modal.innerHTML = `<div class="ach-panel" role="dialog" aria-modal="true" aria-label="Logros">
            <button class="ach-close" type="button" aria-label="Cerrar">×</button>
            <p class="ach-kicker">ARCHIVO DEL DESTINO</p>
            <h2>LOGROS</h2>
            <div class="ach-progress"><div class="ach-progress-fill" style="width:${pct}%"></div></div>
            <p class="ach-count">${all.filter(a => owned.has(a.id)).length}/${all.length} · ${pct}%</p>
            <div class="ach-list">${all.map((a) => {
                const has = owned.has(a.id);
                const hidden = !has && this.HIDDEN.includes(a.id);
                return `<div class="ach-row${has ? ' is-done' : ''}${hidden ? ' is-hidden' : ''}">
                    <span class="ach-star" aria-hidden="true">${has ? '★' : '☆'}</span>
                    <div>
                        <b>${hidden ? '???' : a.title}</b>
                        <small>${hidden ? 'Logro oculto: sigue jugando…' : (has ? a.desc : (this.HINTS[a.id] || a.desc))}</small>
                    </div>
                    ${has ? '<i class="ach-check" aria-hidden="true">✓</i>' : ''}
                </div>`;
            }).join('')}</div>
        </div>`;
        document.body.appendChild(modal);
        modal.querySelector('.ach-close').onclick = () => this.close();
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });
        try { AudioManager.ui.click(); } catch (_) { /* ignore */ }
    },

    close() {
        document.querySelector('#ach-modal')?.remove();
    }
};
