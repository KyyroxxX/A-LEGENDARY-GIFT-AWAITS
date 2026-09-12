/**
 * Calendar engine — 16 days, afternoon/evening slots, story gates
 * Multiple actions per time slot (AP), not just one.
 */
const Calendar = {
    TOTAL_DAYS: 16,
    MONTH: 'Abril',
    START_DAY_NUM: 7,
    ACTIONS_PER_SLOT: 3,

    SLOT_LABELS: {
        afternoon: 'TARDE',
        evening: 'NOCHE'
    },

    GATE_DAYS: {
        3: 'gate_zabuza',
        6: 'gate_akatsuki',
        9: 'gate_orochimaru',
        12: 'gate_alliance',
        14: 'gate_aizen',
        16: 'gate_final'
    },

    dateLabel(day) {
        const n = this.START_DAY_NUM + (day - 1);
        if (n <= 30) return `${this.MONTH} ${n}`;
        return `Mayo ${n - 30}`;
    },

    getDay() {
        return GameState.get('day') || 1;
    },

    getSlot() {
        return GameState.get('slot') || 'afternoon';
    },

    isGateDay(day = this.getDay()) {
        return !!this.GATE_DAYS[day];
    },

    gateId(day = this.getDay()) {
        return this.GATE_DAYS[day] || null;
    },

    gateCleared(day = this.getDay()) {
        const id = this.gateId(day);
        if (!id) return true;
        return GameState.flag(id + '_cleared');
    },

    mustDoMission() {
        return this.isGateDay() && !this.gateCleared();
    },

    ensureActions() {
        let left = GameState.get('actionsLeft');
        if (typeof left !== 'number' || left < 0) {
            left = this.ACTIONS_PER_SLOT;
            GameState.set('actionsLeft', left);
        }
        return left;
    },

    actionsLeft() {
        return this.ensureActions();
    },

    actionsMax() {
        return this.ACTIONS_PER_SLOT;
    },

    hasAction() {
        if (this.mustDoMission()) return false;
        return this.actionsLeft() > 0;
    },

    /** Spent at least one AP this slot (or legacy actionTaken) — can advance time */
    canAdvance() {
        if (this.mustDoMission()) return false;
        const left = this.actionsLeft();
        const max = this.ACTIONS_PER_SLOT;
        if (left < max) return true;
        return !!GameState.get('actionTaken');
    },

    markActionTaken() {
        const left = Math.max(0, this.actionsLeft() - 1);
        GameState.update({
            actionsLeft: left,
            actionTaken: true
        });
    },

    resetSlotActions() {
        GameState.update({
            actionsLeft: this.ACTIONS_PER_SLOT,
            actionTaken: false
        });
    },

    advanceSlot() {
        if (!this.canAdvance()) {
            return {
                ok: false,
                reason: this.mustDoMission()
                    ? 'Completa la misión de historia (portal) primero.'
                    : 'Haz al menos 1 actividad (lazo / explorar / entrenar) o habla… luego avanza.'
            };
        }

        const day = this.getDay();
        const slot = this.getSlot();

        if (slot === 'afternoon') {
            GameState.update({ slot: 'evening' });
            this.resetSlotActions();
            return { ok: true, day, slot: 'evening', advancedDay: false };
        }

        if (day >= this.TOTAL_DAYS) {
            if (GameState.flag('gate_final_cleared')) {
                return { ok: true, finished: true };
            }
            return { ok: false, reason: 'Debes completar la misión final del Destino.' };
        }

        const next = day + 1;
        const unlocks = [];
        if (next >= 3) { GameState.unlockLocation('wave'); unlocks.push('wave'); }
        if (next >= 4) { GameState.unlockLocation('forest'); unlocks.push('forest'); }
        if (next >= 6) { GameState.unlockLocation('suna'); unlocks.push('suna'); }
        if (next >= 8) { GameState.unlockLocation('tower'); unlocks.push('tower'); }

        GameState.update({
            day: next,
            slot: 'afternoon',
            energy: 2
        });
        this.resetSlotActions();

        return { ok: true, day: next, slot: 'afternoon', advancedDay: true, unlocks };
    },

    hud() {
        const day = this.getDay();
        const left = this.actionsLeft();
        return {
            day,
            slot: this.getSlot(),
            slotLabel: this.SLOT_LABELS[this.getSlot()],
            dateLabel: this.dateLabel(day),
            gate: this.gateId(day),
            gatePending: this.mustDoMission(),
            actionTaken: !!GameState.get('actionTaken'),
            actionsLeft: left,
            actionsMax: this.ACTIONS_PER_SLOT,
            progress: Math.round((day / this.TOTAL_DAYS) * 100)
        };
    }
};
