/**
 * Operation Chikitriskis — Main Application
 */
document.addEventListener('DOMContentLoaded', () => {
    GameState.load();
    ParticleSystem.init();
    SceneManager.init();
    setupVolumeControl();
    setupEasterEggs();

    const vol = Number(GameState.get('masterVolume'));
    AudioManager.masterVolume = Number.isFinite(vol) ? Math.max(0, Math.min(1, vol)) : 0.55;
    AudioManager._volumeBeforeMute = AudioManager.masterVolume > 0.001
        ? AudioManager.masterVolume
        : 0.55;
    AudioManager.muted = !!GameState.get('soundMuted') || AudioManager.masterVolume <= 0.001;
    if (AudioManager.muted && AudioManager.masterVolume > 0.001) {
        AudioManager.setVolume(0, { fromMute: true });
    }
    AudioManager.enabled = true;
    syncVolumeUI(AudioManager.masterVolume);

    // Browsers need a gesture — unlock on first interaction, keep audio "on".
    const unlockOnce = () => {
        AudioManager.unlock();
        document.removeEventListener('pointerdown', unlockOnce, true);
        document.removeEventListener('keydown', unlockOnce, true);
    };
    document.addEventListener('pointerdown', unlockOnce, true);
    document.addEventListener('keydown', unlockOnce, true);

    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    SceneManager.resume();
});

function syncVolumeUI(vol01) {
    const slider = document.getElementById('vol-slider');
    const pct = document.getElementById('vol-pct');
    const btn = document.getElementById('vol-mute-btn');
    const dock = document.getElementById('vol-dock');
    const muted = typeof AudioManager !== 'undefined' && AudioManager.isMuted
        ? AudioManager.isMuted()
        : vol01 <= 0.001;
    const v = Math.round(Math.max(0, Math.min(1, vol01)) * 100);
    if (slider) slider.value = String(v);
    if (pct) pct.textContent = String(v);
    if (btn) {
        btn.classList.toggle('is-muted', muted);
        btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
        btn.setAttribute('aria-label', muted ? 'Activar sonido' : 'Silenciar');
        btn.title = muted ? 'Activar sonido' : 'Silenciar';
    }
    if (dock) dock.classList.toggle('is-muted', muted);
}

function setupVolumeControl() {
    const slider = document.getElementById('vol-slider');
    const btn = document.getElementById('vol-mute-btn');
    if (!slider) return;

    const applyFromSlider = () => {
        AudioManager.unlock();
        const vol = AudioManager.setVolume(Number(slider.value) / 100);
        syncVolumeUI(vol);
        Achievements.show('volume_touch');
    };
    slider.addEventListener('input', applyFromSlider);
    slider.addEventListener('change', applyFromSlider);

    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            AudioManager.unlock();
            Achievements.show('volume_touch');
            const muted = AudioManager.toggleMute();
            syncVolumeUI(AudioManager.getVolume());
            btn.classList.remove('is-popping');
            // restart pop animation
            void btn.offsetWidth;
            btn.classList.add('is-popping');
            clearTimeout(btn._popTimer);
            btn._popTimer = setTimeout(() => btn.classList.remove('is-popping'), 560);
            dockTitle(muted);
        });
    }
}

function dockTitle(muted) {
    const dock = document.getElementById('vol-dock');
    if (dock) dock.title = muted ? 'Silenciado' : 'Volumen';
    return true;
}

function setupEasterEggs() {
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' && e.shiftKey) {
            showDevMessage('No es RNG si el novio controla el servidor.');
        }
    });
}

function showDevMessage(msg) {
    const t = document.createElement('div');
    t.className = 'achievement-toast';
    t.style.transform = 'translateX(0)';
    document.getElementById('achievement-container').appendChild(t);
    t.innerHTML = `<div class="achievement-desc">${msg}</div>`;
    setTimeout(() => t.remove(), 3500);
}

// Expose reset for debugging (console: resetProgress())
window.resetProgress = () => {
    GameState.reset();
    location.reload();
};

// Dev: saltar al hub día N (ej. debugJumpDay(16))
window.debugJumpDay = (day = 16) => {
    GameState.update({
        prologueDone: true,
        day: Math.min(Calendar.TOTAL_DAYS, Math.max(1, day)),
        slot: 'afternoon',
        actionTaken: false,
        bonds: { chiki: 3, sakura: 2, kakashi: 2 },
        trainAtk: 4,
        trainDef: 3,
        trainAgi: 3,
        trainSp: 3,
        locationsUnlocked: ['ramen', 'academy', 'training', 'forest', 'tower', 'wave', 'suna'],
        exploreMap: 'plaza',
        storyFlags: {
            gate_zabuza_cleared: day > 3,
            gate_akatsuki_cleared: day > 6,
            gate_orochimaru_cleared: day > 9,
            gate_alliance_cleared: day > 12,
            gate_aizen_cleared: day > 14
        }
    });
    SceneManager.goTo('hub');
};
