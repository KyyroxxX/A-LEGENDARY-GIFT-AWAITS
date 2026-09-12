/**
 * Game State — LocalStorage persistence (RPG Persona-style)
 */
const GameState = {
    STORAGE_KEY: 'chikitriskis_arena_v1',

    defaultState() {
        return {
            currentScene: 'intro',
            // RPG calendar
            day: 1,
            slot: 'afternoon', // afternoon | evening
            actionTaken: false,
            actionsLeft: 3,
            energy: 2,
            // Training removed — power comes from constellation + gear
            trainAtk: 0,
            trainDef: 0,
            trainAgi: 0,
            trainSp: 0,
            charCopies: { luffy: 1, naruto: 1, jotaro: 1 },
            charGear: {},
            equipmentInventory: {},
            equippedEquipment: {},
            // Bonds: { sakura: 1, ... } level 0-5
            bonds: {},
            bondSeen: {},
            // Story
            storyFlags: {},
            locationsUnlocked: ['ramen', 'academy', 'training'],
            prologueDone: false,
            storyComplete: false,
            pendingMission: null,
            lastMissionResult: null,
            // Legacy / finale
            chikistrites: 0,
            invocations: 0,
            pullsDone: 0,
            pity: 0,
            pullHistory: [],
            ownedCharacters: ['luffy', 'naruto', 'jotaro'],
            invocationsEarned: 0,
            metaphorTickets: 0,
            metaphorTicketsEarned: 0,
            starSeals: 0,
            starSeals5: 0,
            starSeals6: 0,
            huntRunsCompleted: 0,
            bossDefeated: false,
            legendaryObtained: false,
            gojoObtained: false,
            bossUnlockedByGojo: false,
            finalTenGranted: false,
            bannerGacha: {},
            gachaVersion: 2,
            migratedInvBonus: false,
            codeRevealed: false,
            codeClaimed: false,
            finalSeen: false,
            achievements: [],
            easterEggsFound: [],
            soundEnabled: true,
            soundMuted: false,
            masterVolume: 0.55,
            audioVolumes: {
                music: 1,
                ui: 1,
                attack: 1,
                impact: 1,
                skill: 1,
                ultimate: 1,
                death: 1,
                gacha: 1,
                voice: 1
            },
            battleParty: ['luffy', 'naruto', 'jotaro'],
            tutorialDone: false,
            tutorialStarted: false,
            tutorialStep: 0
        };
    },

    load() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                this._state = { ...this.defaultState(), ...JSON.parse(saved) };
                if (!this._state.bonds) this._state.bonds = {};
                if (!this._state.storyFlags) this._state.storyFlags = {};
                if (!Array.isArray(this._state.ownedCharacters) || !this._state.ownedCharacters.length) {
                    this._state.ownedCharacters = ['luffy', 'naruto', 'jotaro'];
                }
                if (this._state.invocationsEarned == null) this._state.invocationsEarned = 0;
                if (this._state.metaphorTickets == null) this._state.metaphorTickets = 0;
                if (this._state.metaphorTicketsEarned == null) this._state.metaphorTicketsEarned = 0;
                if (this._state.starSeals == null) this._state.starSeals = 0;
                if (this._state.starSeals5 == null) this._state.starSeals5 = 0;
                if (this._state.starSeals6 == null) this._state.starSeals6 = 0;
                if (!this._state.locationsUnlocked) {
                    this._state.locationsUnlocked = ['ramen', 'academy', 'training'];
                }
                if (!this._state.bannerGacha) this._state.bannerGacha = {};
                if (this._state.gachaVersion == null) this._state.gachaVersion = 1;
                if (!this._state.charCopies || typeof this._state.charCopies !== 'object') {
                    this._state.charCopies = { luffy: 1, naruto: 1, jotaro: 1 };
                }
                if (!this._state.charGear || typeof this._state.charGear !== 'object') {
                    this._state.charGear = {};
                }
            } else {
                this._state = this.defaultState();
            }
        } catch (e) {
            this._state = this.defaultState();
        }
        if (typeof GachaRoster !== 'undefined' && GachaRoster.migrateIfNeeded) {
            GachaRoster.migrateIfNeeded();
        }
        return this._state;
    },

    save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._state));
        } catch (e) {
            console.warn('Could not save progress');
        }
    },

    get(key) {
        if (!this._state) this.load();
        return this._state[key];
    },

    set(key, value) {
        if (!this._state) this.load();
        this._state[key] = value;
        this.save();
    },

    update(updates) {
        if (!this._state) this.load();
        Object.assign(this._state, updates);
        this.save();
    },

    flag(id) {
        return !!(this.get('storyFlags') || {})[id];
    },

    setFlag(id, val = true) {
        const flags = { ...(this.get('storyFlags') || {}) };
        flags[id] = val;
        this.set('storyFlags', flags);
    },

    getBond(id) {
        return (this.get('bonds') || {})[id] || 0;
    },

    setBond(id, level) {
        const bonds = { ...(this.get('bonds') || {}) };
        bonds[id] = Math.max(0, Math.min(5, level));
        this.set('bonds', bonds);
    },

    addBond(id, delta = 1) {
        const next = this.getBond(id) + delta;
        this.setBond(id, next);
        return this.getBond(id);
    },

    unlockLocation(id) {
        const list = [...(this.get('locationsUnlocked') || [])];
        if (!list.includes(id)) {
            list.push(id);
            this.set('locationsUnlocked', list);
        }
    },

    addChikistrites(amount) {
        const current = this.get('chikistrites') || 0;
        this.set('chikistrites', current + amount);
        return current + amount;
    },

    useChikistrites(amount) {
        const need = Math.max(0, amount | 0);
        const current = this.get('chikistrites') || 0;
        if (current < need) return false;
        this.set('chikistrites', current - need);
        return true;
    },

    chikiPerInv() {
        return (typeof CONFIG !== 'undefined' && CONFIG.chikiPerInvocation)
            ? CONFIG.chikiPerInvocation
            : 160;
    },

    /** Convert soft currency → invocaciones (tickets). */
    convertChikiToInv(count = 1) {
        const n = Math.max(0, Math.floor(Number(count) || 0));
        if (n < 1) return { ok: false, reason: 'Cantidad inválida.' };
        const rate = this.chikiPerInv();
        const cost = n * rate;
        const chiki = this.get('chikistrites') || 0;
        if (chiki < cost) {
            return {
                ok: false,
                reason: `Necesitas ${cost.toLocaleString('es-ES')} Chikistrites (${rate} = 1 INV).`,
                need: cost,
                have: chiki,
                rate
            };
        }
        if (!this.useChikistrites(cost)) {
            return { ok: false, reason: 'No hay Chikistrites suficientes.', rate };
        }
        for (let i = 0; i < n; i++) this.addInvocation();
        return {
            ok: true,
            gained: n,
            cost,
            rate,
            chikistrites: this.get('chikistrites') || 0,
            invocations: this.get('invocations') || 0
        };
    },

    maxConvertibleInv() {
        const rate = this.chikiPerInv();
        return Math.floor((this.get('chikistrites') || 0) / rate);
    },

    addInvocation() {
        const current = this.get('invocations') || 0;
        this.set('invocations', current + 1);
        return current + 1;
    },

    addMetaphorTicket(n = 1) {
        const add = Math.max(0, n | 0);
        const current = this.get('metaphorTickets') || 0;
        const earned = this.get('metaphorTicketsEarned') || 0;
        this.update({
            metaphorTickets: current + add,
            metaphorTicketsEarned: earned + add
        });
        return current + add;
    },

    useMetaphorTicket() {
        const current = this.get('metaphorTickets') || 0;
        if (current > 0) {
            this.set('metaphorTickets', current - 1);
            return true;
        }
        return false;
    },

    addStarSeal(n = 1, stars = 4) {
        const add = Math.max(0, n | 0);
        const current = this.get('starSeals') || 0;
        const tierKey = Number(stars) >= 6 ? 'starSeals6' : Number(stars) >= 5 ? 'starSeals5' : null;
        const update = { starSeals: current + add };
        if (tierKey) update[tierKey] = (this.get(tierKey) || 0) + add;
        this.update(update);
        return current + add;
    },

    useStarSeal(n = 1, stars = 4) {
        const need = Math.max(1, n | 0);
        const current = this.get('starSeals') || 0;
        const tierKey = Number(stars) >= 6 ? 'starSeals6' : Number(stars) >= 5 ? 'starSeals5' : null;
        const tierCurrent = tierKey ? (this.get(tierKey) || 0) : current;
        if (current < need || tierCurrent < need) return false;
        const update = { starSeals: current - need };
        if (tierKey) update[tierKey] = tierCurrent - need;
        this.update(update);
        return true;
    },

    useInvocation() {
        const current = this.get('invocations') || 0;
        if (current > 0) {
            this.set('invocations', current - 1);
            return true;
        }
        return false;
    },

    recordPull(rarity, reward, meta = {}) {
        const pullsDone = (this.get('pullsDone') || 0) + 1;
        const isLegendary = rarity === 'legendary' || meta.kind === 'legendary';
        // Pity counts pulls since last legendary; reset on legendary (do not mirror historical total).
        const pity = isLegendary ? 0 : (this.get('pity') || 0) + 1;
        const history = this.get('pullHistory') || [];
        history.push({
            rarity,
            reward,
            pull: pullsDone,
            charId: meta.charId || null,
            kind: meta.kind || 'item'
        });
        this.update({ pullsDone, pity, pullHistory: history });
    },

    unlockAchievement(id) {
        const achievements = this.get('achievements') || [];
        if (!achievements.includes(id)) {
            achievements.push(id);
            this.set('achievements', achievements);
            return true;
        }
        return false;
    },

    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        // Also clear legacy key
        localStorage.removeItem('chikitriskis_save');
        this._state = this.defaultState();
        this.save();
    }
};

/** Manual QA helpers — paste in DevTools. Does not auto-run. */
if (typeof window !== 'undefined') {
    window.__qa = {
        /** Unlock every playable character (C0+). */
        unlockAll() {
            const ids = (typeof GachaRoster !== 'undefined')
                ? GachaRoster.playableIds()
                : [];
            GameState.set('ownedCharacters', [...ids]);
            GameState.setFlag('full_roster_unlock', true);
            const copies = { ...(GameState.get('charCopies') || {}) };
            ids.forEach((id) => { if (!copies[id] || copies[id] < 1) copies[id] = 1; });
            GameState.set('charCopies', copies);
            GameState.save();
            console.log(`[QA] unlocked ${ids.length} characters`);
            return ids.length;
        },
        /** Fill INV + Chiki + Metaphor tickets (full test bank). Opens convene. */
        fillPulls() {
            const budget = (typeof GachaRoster !== 'undefined')
                ? GachaRoster.totalPullsRequired()
                : ((typeof CONFIG !== 'undefined' && CONFIG.invocationCap) || 2800);
            const metaBank = (typeof GachaRoster !== 'undefined' && GachaRoster.METAPHOR_TOTAL)
                ? GachaRoster.METAPHOR_TOTAL
                : 80;
            const rate = (typeof CONFIG !== 'undefined' && CONFIG.chikiPerInvocation) || 160;
            GameState.update({
                invocations: budget,
                invocationsEarned: budget,
                chikistrites: budget * rate,
                metaphorTickets: metaBank,
                metaphorTicketsEarned: metaBank,
                prologueDone: true,
                storyComplete: true
            });
            console.log(`[QA] INV ${budget} · Metaphor ${metaBank} · Chiki ${budget * rate}`);
            return { invocations: budget, metaphorTickets: metaBank, chikistrites: budget * rate };
        },

        /**
         * Cambia el código Steam de Metaphor: ReFantazio (pantalla final / reveal).
         * Uso: __qa.setSteamCode('AAAA-BBBB-CCCC-DDDD')
         */
        setSteamCode(code) {
            const next = String(code == null ? '' : code).trim();
            if (!next) {
                console.warn('[QA] setSteamCode: pasa un código, ej. __qa.setSteamCode("AAAA-BBBB-CCCC-DDDD")');
                return null;
            }
            if (typeof CONFIG === 'undefined') {
                console.warn('[QA] CONFIG no cargado');
                return null;
            }
            CONFIG.steamCode = next;
            CONFIG._steamCode = next;
            const display = document.getElementById('code-display');
            if (display && !display.classList.contains('code-hidden')) {
                display.textContent = next;
            }
            console.log(`[QA] Steam code → ${next}`);
            return next;
        },

        /** Lee el código actual (sin revelar la escena). */
        getSteamCode() {
            if (typeof CONFIG === 'undefined') return null;
            return CONFIG._steamCode || CONFIG.steamCode || null;
        }
    };
}
