/**
 * Game Manager — arena / battle lifecycle
 */
const GameManager = {
    currentMissionId: null,

    startHunt() {
        SceneManager.goTo('arena');
    },

    startBoss() {
        this.startMission('boss', 'gate_final');
    },

    startMission(encounterKey, missionId) {
        this.currentMissionId = missionId || null;
        BattleUI.open(encounterKey);
    },

    /** First-clear key for an encounter (invocations only on first clear). */
    clearFlagFor(runKey, missionId) {
        const mission = missionId ? StoryData.missions[missionId] : null;
        if (mission?.flagClear) return mission.flagClear;
        return `enc_cleared_${runKey}`;
    },

    onBattleVictory(encounter, runKey) {
        const missionId = this.currentMissionId || GameState.get('pendingMission');
        const mission = missionId ? StoryData.missions[missionId] : null;
        const clearFlag = this.clearFlagFor(runKey, missionId);
        const alreadyCleared = !!GameState.flag(clearFlag);

        if (clearFlag) GameState.setFlag(clearFlag, true);
        if (runKey === 'boss' || mission?.isFinal || encounter?.isBoss) {
            GameState.set('bossDefeated', true);
            GameState.setFlag('gate_final_cleared', true);
            GameState.set('storyComplete', true);
            if (typeof Achievements !== 'undefined') Achievements.show('boss_5050');
        }

        GameState.set('pendingMission', null);
        this.currentMissionId = null;
        GameState.set('huntRunsCompleted', (GameState.get('huntRunsCompleted') || 0) + 1);

        // Economy: combats grant Chikistrites (soft). Player converts them into INV in gacha.
        const rate = (typeof GameState.chikiPerInv === 'function')
            ? GameState.chikiPerInv()
            : ((typeof CONFIG !== 'undefined' && CONFIG.chikiPerInvocation) || 160);
        let invGain = 0; // pull-equivalents credited toward budget (for tracking)
        let chikiGain = 0;
        let metaGain = 0;

        if (encounter?.training) {
            this._lastInvGain = 0;
            this._lastChikiGain = 0;
            this._lastMetaGain = 0;
            this._lastWasRepeat = alreadyCleared;
            return mission;
        }

        if (alreadyCleared) {
            chikiGain = rate * 10;
            GameState.addChikistrites(chikiGain);
        } else {
            const earned = GameState.get('invocationsEarned') || 0;
            const budget = (typeof GachaRoster !== 'undefined')
                ? GachaRoster.invocationBudget()
                : (CONFIG.invocationCap || 2800);
            const pullValue = Math.max(0, encounter?.rewardInvocations || 0);
            if (earned < budget && pullValue > 0) {
                invGain = Math.min(pullValue, budget - earned);
                GameState.set('invocationsEarned', earned + invGain);
                chikiGain = invGain * rate;
                GameState.addChikistrites(chikiGain);
            }

            // Red Metaphor tickets: last quest of each section + boss finale
            if (typeof GachaRoster !== 'undefined') {
                const sectionMeta = GachaRoster.metaphorRewardFor(missionId, runKey);
                if (sectionMeta > 0) {
                    GameState.addMetaphorTicket(sectionMeta);
                    metaGain += sectionMeta;
                }
                if (runKey === 'boss' || mission?.isFinal || encounter?.isBoss) {
                    const bossMeta = GachaRoster.grantFinalTenIfEligible();
                    if (bossMeta > 0) metaGain += bossMeta;
                }
            }
        }

        this._lastInvGain = invGain;
        this._lastChikiGain = chikiGain;
        this._lastMetaGain = metaGain;
        this._lastWasRepeat = alreadyCleared;
        return mission;
    },

    lastInvGain() {
        return this._lastInvGain || 0;
    },

    lastChikiGain() {
        return this._lastChikiGain || 0;
    },

    lastMetaGain() {
        return this._lastMetaGain || 0;
    },

    endHunt() {
        this.cleanupHUD();
        document.getElementById('game-container').classList.add('hidden');
        document.getElementById('game-container').classList.remove('persona-mode');
        document.getElementById('game-container').innerHTML = '';
        document.getElementById('scene-container').classList.remove('hidden');
    },

    cleanupHUD() {
        document.querySelectorAll('.game-hud, .mobile-controls, .perfect-dodge-text, .game-result, .boss-victory-overlay, .battle-root, .battle-setup, .psel').forEach(el => el.remove());
    }
};
