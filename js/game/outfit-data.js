/**
 * Outfits — early Shippuden only (hasta 1ª visita sede Orochimaru).
 * Sin The Last, Sage, Guerra, Hokage, etc.
 */
const OutfitData = {
    /** @type {Record<string, { id: string, name: string, blurb: string, unlock: string|null, worldTint?: string, battleSuffix?: string }>} */
    catalog: {
        genin: {
            id: 'genin',
            name: 'Uniforme Genin',
            blurb: 'Naranja clásico · equipo 7 original.',
            unlock: null,
            worldTint: null
        },
        shippuden: {
            id: 'shippuden',
            name: 'Chaqueta Negra',
            blurb: 'Look de misión · después del salto temporal.',
            unlock: 'day_2',
            worldTint: '#1a1a2e'
        },
        training: {
            id: 'training',
            name: 'Ropa de Entrenamiento',
            blurb: 'Más ligera · AGI mental + sudor.',
            unlock: 'train_3',
            worldTint: '#2c3e50'
        },
        mission: {
            id: 'mission',
            name: 'Equipo de Infiltración',
            blurb: 'Oscuro · para no llamar la atención.',
            unlock: 'gate_orochimaru_cleared',
            worldTint: '#0d1b12'
        },
        ramen: {
            id: 'ramen',
            name: 'Casual Ichiraku',
            blurb: 'Cómodo. Prioridades claras.',
            unlock: 'explore_5',
            worldTint: '#e67e22'
        }
    },

    list() {
        return Object.values(this.catalog);
    },

    get(id) {
        return this.catalog[id] || this.catalog.genin;
    },

    isUnlocked(id) {
        const o = this.get(id);
        if (!o.unlock) return true;
        const day = GameState.get('day') || 1;
        if (o.unlock === 'day_2') return day >= 2;
        if (o.unlock === 'train_3') return (GameState.get('trainCount') || 0) >= 3;
        if (o.unlock === 'explore_5') return (GameState.get('exploreCount') || 0) >= 5;
        if (o.unlock.startsWith('gate_') || o.unlock.includes('_cleared')) {
            return GameState.flag(o.unlock);
        }
        return GameState.flag(o.unlock);
    },

    currentId() {
        const id = GameState.get('outfitId') || 'genin';
        return this.isUnlocked(id) ? id : 'genin';
    },

    current() {
        return this.get(this.currentId());
    },

    equip(id) {
        if (!this.isUnlocked(id)) return false;
        GameState.set('outfitId', id);
        return true;
    }
};
