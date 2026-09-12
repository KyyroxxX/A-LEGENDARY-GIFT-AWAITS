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
    }
};
