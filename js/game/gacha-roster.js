/**
 * Multi-banner gacha — series convenes (6★ mythic / 5★ / 4★ / 3★) + Metaphor 7★ celestial.
 * Dupes → 4★ C0–C6 · 5★/6★ C0–C3. Maxeados → Sellos Estelares.
 */
const GachaRoster = {
    STARTERS: ['luffy', 'naruto', 'jotaro'],
    EXCLUDED: new Set(['dummy', 'boss5050']),
    GOJO_ID: 'gojo',
    FINAL_TEN: 10, // Metaphor tickets from THE 50/50 (red convene)
    INVOCATION_CAP: 2700,
    /** @deprecated use CharProgress.maxConstFor(id) */
    MAX_CONST: 6,
    /** Maxeados → Sellos Estelares; se canjean por dupes de 5★/6★. */
    STAR_SEAL_FROM_4: 1,
    STAR_SEAL_FROM_5: 1,
    STAR_SEAL_FROM_6: 2,
    STAR_SEAL_COST_5: 1,
    STAR_SEAL_COST_6: 2,
    /** Red Metaphor tickets: 14×5 section finales + 10 boss = 80 (hard pity). */
    METAPHOR_TOTAL: 80,
    METAPHOR_SECTION: 14,
    METAPHOR_BOSS: 10,

    /** Shared anime-banner rates (gift-game friendly). */
    SERIES_RATES: {
        rate6: 0.003,
        soft6: 55,
        hard6: 80,
        rate5: 0.02,
        rate4: 0.12,
        soft5: 35,
        hard5: 50,
        hard4: 8,
        featured5050: true,
        featuredRate: 0.7
    },

    ENEMY_SERIES: {
        crocodile: 'One Piece', enel: 'One Piece', lucci: 'One Piece', doflamingo: 'One Piece',
        zabuza: 'Naruto', orochimaru: 'Naruto', sasori: 'Naruto', deidara: 'Naruto', kisame: 'Naruto',
        dio: 'JoJo', kira: 'JoJo', diavolo: 'JoJo',
        aizen: 'Bleach', grimmjow: 'Bleach', ulquiorra: 'Bleach',
        sukuna: 'Jujutsu Kaisen', geto: 'Jujutsu Kaisen', mahito: 'Jujutsu Kaisen', jogo: 'Jujutsu Kaisen',
        toji: 'Jujutsu Kaisen',
        kokushibo: 'Kimetsu no Yaiba', akaza: 'Kimetsu no Yaiba', doma: 'Kimetsu no Yaiba',
        daki: 'Kimetsu no Yaiba', hantengu: 'Kimetsu no Yaiba', gyokko: 'Kimetsu no Yaiba',
        makima: 'Chainsaw Man', denji: 'Chainsaw Man', power: 'Chainsaw Man',
        reze: 'Chainsaw Man', beam: 'Chainsaw Man'
    },

    /** Playable series banners + late Metaphor */
    BANNERS: {
        onepiece: {
            id: 'onepiece',
            series: 'One Piece',
            short: 'OP',
            title: 'GRAN LINE',
            titleLines: ['GRAN', 'LINE'],
            subtitle: 'Piratas, emperadores y el One Piece.',
            tag: 'One Piece',
            featuredId: 'luffy',
            featured: 'Monkey D. Luffy',
            featuredNote: '5★ rate-up · Capitán',
            thumb: 'assets/gacha/banners/onepiece-thumb.webp',
            art: 'assets/gacha/banners/onepiece-stage.webp',
            banner: 'assets/gacha/banners/onepiece-stage.webp',
            objectPosition: '50% 30%',
            accent: '#e74c3c',
            rate6: 0.003, soft6: 55, hard6: 80,
            rate5: 0.02, rate4: 0.12, soft5: 35, hard5: 50, hard4: 8,
            featured5050: true,
            featuredRate: 0.7,
            pool6: ['doflamingo', 'zoro', 'sanji'],
            pool5Std: ['law', 'shanks', 'mihawk'],
            pool4: ['nami', 'robin', 'crocodile', 'enel', 'lucci'],
            pool3: ['brook', 'franky', 'chopper', 'usopp'],
            pool3Names: ['Fragmento del Sombrero', 'Den Den Mushi', 'Cartel de recompensa', 'Log Pose']
        },
        naruto: {
            id: 'naruto',
            series: 'Naruto',
            short: 'Naruto',
            title: 'PERGAMINO SHINOBI',
            titleLines: ['PERGAMINO', 'SHINOBI'],
            subtitle: 'Konoha, Akatsuki y el poder de los Hokage.',
            tag: 'Naruto',
            featuredId: 'naruto',
            featured: 'Naruto Uzumaki',
            featuredNote: '5★ rate-up · Hokage',
            thumb: 'assets/gacha/banners/naruto-thumb.webp',
            art: 'assets/gacha/banners/naruto-stage.webp',
            banner: 'assets/gacha/banners/naruto-stage.webp',
            objectPosition: '45% 58%',
            accent: '#f39c12',
            rate6: 0.003, soft6: 55, hard6: 80,
            rate5: 0.02, rate4: 0.12, soft5: 35, hard5: 50, hard4: 8,
            featured5050: true,
            featuredRate: 0.7,
            pool6: ['sasuke', 'jiraiya', 'kakashi', 'itachi', 'hidan'],
            pool5Std: ['gai', 'minato', 'tsunade', 'kisame'],
            pool4: ['gaara', 'sakura', 'zabuza', 'orochimaru', 'sasori', 'deidara'],
            pool3: ['shikamaru', 'hinata', 'sai', 'neji', 'lee'],
            pool3Names: ['Kunai oxidado', 'Pergamino vacío', 'Banda ninja rota', 'Sello explosivo']
        },
        jojo: {
            id: 'jojo',
            series: 'JoJo',
            short: 'JoJo',
            title: 'FLECHA STAND',
            titleLines: ['FLECHA', 'STAND'],
            subtitle: 'Stands, Hamon y destinos absurdos.',
            tag: 'JoJo',
            featuredId: 'jotaro',
            featured: 'Jotaro Kujo',
            featuredNote: '5★ rate-up · Star Platinum',
            thumb: 'assets/gacha/banners/jojo-thumb.webp',
            art: 'assets/gacha/banners/jojo-stage.webp',
            banner: 'assets/gacha/banners/jojo-stage.webp',
            objectPosition: '52% 38%',
            accent: '#9b59b6',
            rate6: 0.003, soft6: 55, hard6: 80,
            rate5: 0.02, rate4: 0.12, soft5: 35, hard5: 50, hard4: 8,
            featured5050: true,
            featuredRate: 0.7,
            pool6: ['dio', 'diavolo', 'kira', 'pucci', 'weather', 'giorno'],
            pool5Std: ['polnareff', 'kakyoin', 'mista', 'bucciarati', 'anasui', 'risotto', 'caesar', 'rohan'],
            pool4: ['josuke', 'jolyne', 'joseph', 'narancia', 'abbacchio', 'okuyasu', 'trish', 'ff'],
            pool3Names: ['Fragmento Stand', 'Flecha rota', 'Disco de memoria', 'Reloj de arena']
        },
        bleach: {
            id: 'bleach',
            series: 'Bleach',
            short: 'Bleach',
            title: 'SOCIEDAD DE ALMAS',
            titleLines: ['SOCIEDAD', 'DE ALMAS'],
            subtitle: 'Shinigami, Espada y Bankai.',
            tag: 'Bleach',
            featuredId: 'ichigo',
            featured: 'Ichigo Kurosaki',
            featuredNote: '5★ rate-up · Shinigami',
            thumb: 'assets/gacha/banners/bleach-thumb.webp',
            art: 'assets/gacha/banners/bleach-stage.webp',
            banner: 'assets/gacha/banners/bleach-stage.webp',
            objectPosition: '70% 42%',
            accent: '#c0392b',
            rate6: 0.003, soft6: 55, hard6: 80,
            rate5: 0.02, rate4: 0.12, soft5: 35, hard5: 50, hard4: 8,
            featured5050: true,
            featuredRate: 0.7,
            pool6: ['aizen', 'ulquiorra', 'grimmjow', 'shunsui'],
            pool5Std: ['byakuya', 'rukia', 'toshiro', 'yoruichi', 'urahara', 'kenpachi'],
            pool4: ['renji', 'orihime', 'ginjo', 'gantenbainne'],
            pool3Names: ['Zanpakutō rosa', 'Gikon', 'Alma fragmentada', 'Hueco Mundo scrap']
        },
        jjk: {
            id: 'jjk',
            series: 'Jujutsu Kaisen',
            short: 'JJK',
            title: 'TÉCNICA MALDITA',
            titleLines: ['TÉCNICA', 'MALDITA'],
            subtitle: 'Hechiceros, maldiciones… y un 50/50 falso.',
            tag: 'Jujutsu Kaisen',
            featuredId: 'gojo',
            featured: 'Satoru Gojo',
            featuredNote: '6★ rate-up · desbloquea THE 50/50',
            featuredStars: 6,
            thumb: 'assets/gacha/banners/jjk-thumb.webp',
            art: 'assets/gacha/banners/jjk-stage.webp',
            banner: 'assets/gacha/banners/jjk-stage.webp',
            objectPosition: '50% 55%',
            accent: '#5dade2',
            rate6: 0.003, soft6: 55, hard6: 80,
            rate5: 0.02, rate4: 0.12, soft5: 35, hard5: 50, hard4: 8,
            featured5050: true,
            featuredRate: 0.7,
            pool6: ['gojo', 'sukuna', 'hakari', 'yuta'],
            pool5Std: ['geto', 'toji', 'nanami', 'yuki', 'higuruma', 'choso'],
            pool4: ['yuji', 'megumi', 'maki', 'nobara', 'mahito', 'jogo', 'uro', 'ryu'],
            pool3: ['todo'],
            pool3Names: ['Talismán roto', 'Dedo maldito (réplica)', 'Cuerda negra']
        },
        metaphor: {
            id: 'metaphor',
            series: 'Metaphor',
            short: 'Metaphor',
            title: 'LA CRÓNICA DE LOS ELEGIDOS',
            titleLines: ['LA CRÓNICA', 'ELEGIDOS'],
            subtitle: 'Tiradas 7★ · 80 sellos = hard pity celestial.',
            tag: 'Sellos carmesí',
            featuredId: null,
            featured: 'METAPHOR: REFANTAZIO',
            featuredNote: '7★ celestial · hard pity 80.',
            thumb: 'assets/gacha/banners/metaphor-thumb.webp',
            art: 'assets/gacha/banners/metaphor-stage.webp',
            banner: 'assets/gacha/banners/metaphor-stage.webp',
            objectPosition: '48% 58%',
            accent: '#9b59b6',
            rate7: 0.008, rate4: 0.10, soft7: 50, hard7: 80, hard4: 10,
            featured5050: true,
            isMetaphor: true,
            pool5StdNames: ['Destino Falso', 'Clave espejismo', 'Sueño de royal'],
            pool4Names: ['Fragmento Real', 'Éter de Archetype', 'Sello de Príncipe'],
            pool3Names: ['Chispa de esperanza', 'Nota de viaje', 'Moneda de Tribes']
        },
        kimetsu: {
            id: 'kimetsu',
            series: 'Kimetsu no Yaiba',
            short: 'Kimetsu',
            title: 'RESPIRACIÓN',
            titleLines: ['RESPIRACIÓN', 'DEL SOL'],
            subtitle: 'Hashira, lunas superiores… y un 50/50 con olor a sangre.',
            tag: 'Demon Slayer',
            featuredId: 'tanjiro',
            featured: 'Tanjiro Kamado',
            featuredNote: '6★ rate-up · Hinokami Kagura',
            featuredStars: 6,
            thumb: 'assets/gacha/sourced/kimetsu-thumb.webp',
            art: 'assets/gacha/sourced/kimetsu-stage.webp',
            banner: 'assets/gacha/sourced/kimetsu-stage.webp',
            objectPosition: '50% 42%',
            accent: '#c0392b',
            rate6: 0.003, pity6: 55, hard6: 80,
            rate5: 0.02, rate4: 0.12, pity5: 35, hard5: 50, hard4: 8,
            featured5050: true,
            featuredRate: 0.7,
            pool6: ['tanjiro', 'gyomei', 'kokushibo', 'rengoku'],
            pool5Std: ['giyu', 'tengen', 'sanemi', 'mitsuri', 'muichiro', 'obanai', 'akaza', 'doma', 'nezuko'],
            pool4: ['zenitsu', 'inosuke', 'daki', 'hantengu', 'gyokko', 'sabito'],
            pool3: ['urokodaki'],
            pool3Names: ['Máscara tengu rota', 'Nichirin mellada', 'Talismán de Ubuyashiki']
        },
        chainsaw: {
            id: 'chainsaw',
            series: 'Chainsaw Man',
            short: 'CSM',
            title: 'KICK BACK',
            titleLines: ['KICK', 'BACK'],
            subtitle: 'Diablos, híbridos y un 50/50 con olor a gasolina.',
            tag: 'Chainsaw Man',
            featuredId: 'denji',
            featured: 'Denji',
            featuredNote: '6★ rate-up · Chainsaw Man',
            featuredStars: 6,
            thumb: 'assets/gacha/sourced/chainsaw-thumb.webp',
            art: 'assets/gacha/sourced/chainsaw-stage.webp',
            banner: 'assets/gacha/sourced/chainsaw-stage.webp',
            objectPosition: '58% 48%',
            accent: '#c0392b',
            rate6: 0.003, pity6: 55, hard6: 80,
            rate5: 0.02, rate4: 0.12, pity5: 35, hard5: 50, hard4: 8,
            featured5050: true,
            featuredRate: 0.7,
            pool6: ['denji', 'makima'],
            pool5Std: ['power', 'reze', 'aki', 'angel'],
            pool4: ['beam'],
            pool3Names: ['Cordón oxidado', 'Kunai de Public Safety', 'Lata de comida de gato', 'Pin de bomba']
        }
    },

    SERIES_ORDER: ['onepiece', 'naruto', 'jojo', 'bleach', 'jjk', 'kimetsu', 'chainsaw', 'metaphor'],

    enemyTemplate(id) {
        if (!this._enemyCache) {
            this._enemyCache = {};
            const encs = (typeof BattleData !== 'undefined' && BattleData.encounters) || {};
            Object.values(encs).forEach(enc => {
                (enc.enemies || []).forEach(e => {
                    if (e?.id && !this._enemyCache[e.id]) this._enemyCache[e.id] = e;
                });
            });
            if (typeof JJKData !== 'undefined') {
                Object.values(JJKData.enemies || {}).forEach(e => {
                    if (e?.id && !this._enemyCache[e.id]) this._enemyCache[e.id] = e;
                });
            }
            if (typeof KimetsuData !== 'undefined') {
                Object.values(KimetsuData.enemies || {}).forEach(e => {
                    if (e?.id && !this._enemyCache[e.id]) this._enemyCache[e.id] = e;
                });
            }
            if (typeof ChainsawData !== 'undefined') {
                Object.values(ChainsawData.enemies || {}).forEach(e => {
                    if (e?.id && !this._enemyCache[e.id]) this._enemyCache[e.id] = e;
                });
            }
        }
        return this._enemyCache[id] || null;
    },

    enemyIds() {
        return Object.keys(this.ENEMY_SERIES).filter(id => !this.EXCLUDED.has(id) && this.enemyTemplate(id));
    },

    partyUnlockIds() {
        if (typeof CharacterRegistry !== 'undefined') {
            return CharacterRegistry.playableIds()
                .filter(id => !this.STARTERS.includes(id) && !this.EXCLUDED.has(id));
        }
        const party = (typeof BattleData !== 'undefined' && BattleData.party) || [];
        return party.map(p => p.id).filter(id => !this.STARTERS.includes(id) && !this.EXCLUDED.has(id));
    },

    poolIds() {
        const set = new Set([...this.partyUnlockIds(), ...this.enemyIds()]);
        set.add(this.GOJO_ID);
        return [...set];
    },

    allCharIdsFromBanners() {
        const set = new Set(this.STARTERS);
        Object.values(this.BANNERS).forEach(b => {
            if (b.isMetaphor) return;
            if (b.featuredId) set.add(b.featuredId);
            (b.pool6 || []).forEach(id => set.add(id));
            (b.pool5Std || []).forEach(id => set.add(id));
            (b.pool4 || []).forEach(id => set.add(id));
            (b.pool3 || []).forEach(id => set.add(id));
        });
        return [...set].filter(id => !this.EXCLUDED.has(id));
    },

    /** Only ids that exist as battle templates (real playables). */
    playableIds() {
        if (typeof CharacterRegistry !== 'undefined') {
            return this.allCharIdsFromBanners().filter(id => CharacterRegistry.isImplemented(id));
        }
        return this.allCharIdsFromBanners().filter(id => !!this.getTemplate(id));
    },

    isCopyMaxed(id) {
        if (typeof CharProgress !== 'undefined') return CharProgress.isMaxed(id);
        return this.owns(id);
    },

    availablePool(ids = [], includeMaxed = false) {
        const list = (ids || []).filter(Boolean);
        const open = list.filter(id => this.isPlayableId(id) && (includeMaxed || !this.isCopyMaxed(id)));
        if (open.length) return open;
        // If every char in this tier is maxed, allow empty → caller refunds INV
        return [];
    },

    bannerFullyMaxed(bannerId) {
        const b = this.BANNERS[bannerId];
        if (!b || b.isMetaphor) return false;
        const ids = [
            b.featuredId,
            ...(b.pool6 || []),
            ...(b.pool5Std || []),
            ...(b.pool4 || []),
            ...(b.pool3 || [])
        ].filter(id => this.isPlayableId(id));
        return ids.length > 0 && ids.every(id => this.isCopyMaxed(id));
    },

    totalCharacters() {
        return this.playableIds().length;
    },

    totalPullsRequired() {
        if (typeof CharProgress !== 'undefined') {
            return Math.max(
                (typeof CONFIG !== 'undefined' && CONFIG.invocationCap) || this.INVOCATION_CAP,
                CharProgress.worstCasePullsNeeded()
            );
        }
        return (typeof CONFIG !== 'undefined' && CONFIG.invocationCap)
            ? CONFIG.invocationCap
            : this.INVOCATION_CAP;
    },

    invocationBudget() {
        return this.totalPullsRequired();
    },

    owned() {
        const list = GameState.get('ownedCharacters');
        const raw = (Array.isArray(list) && list.length) ? [...new Set(list)] : [...this.STARTERS];
        // Hide unimplemented placeholders from all production surfaces.
        return raw.filter(id => this.isPlayableId(id) || this.STARTERS.includes(id));
    },

    owns(id) {
        return this.owned().includes(id);
    },

    ensureOwnedState() {
        let list = GameState.get('ownedCharacters');
        if (!Array.isArray(list) || !list.length) {
            list = [...this.STARTERS];
            GameState.set('ownedCharacters', list);
        }
        let changed = false;
        this.STARTERS.forEach(id => {
            if (!list.includes(id)) { list.push(id); changed = true; }
        });
        // Expansion sync + QA unlockAll: grant newly added planteles without
        // forcing the player to re-pull / re-run unlockAll.
        const all = this.playableIds();
        const ownedSet = new Set(list);
        const missing = all.filter(id => !ownedSet.has(id));
        const fullUnlock = typeof GameState !== 'undefined' && GameState.flag?.('full_roster_unlock');
        if (missing.length) {
            const toGrant = fullUnlock
                ? missing
                : this._expansionIdsToGrant(missing, ownedSet);
            toGrant.forEach(id => {
                if (!list.includes(id)) { list.push(id); changed = true; }
            });
        }
        if (changed) GameState.set('ownedCharacters', list);
        return list;
    },

    /** Grant Kimetsu / Chainsaw (etc.) when the save already has a deep classic roster. */
    _expansionIdsToGrant(missing, ownedSet) {
        if (!missing.length || ownedSet.size < 60) return [];
        const expansionSeries = new Set(['Kimetsu no Yaiba', 'Chainsaw Man']);
        const seriesOf = (id) => {
            const party = (typeof BattleData !== 'undefined' && BattleData.party) || [];
            const fromParty = party.find(p => p.id === id);
            if (fromParty?.series) return fromParty.series;
            if (this.ENEMY_SERIES[id]) return this.ENEMY_SERIES[id];
            const t = this.getTemplate(id);
            return t?.series || '';
        };
        return missing.filter(id => expansionSeries.has(seriesOf(id)));
    },

    unlock(id) {
        const list = this.ensureOwnedState();
        if (list.includes(id)) return false;
        list.push(id);
        GameState.set('ownedCharacters', list);
        return true;
    },

    collectionProgress() {
        const all = this.playableIds();
        const owned = this.owned().filter(id => all.includes(id));
        const dupes = (typeof CharProgress !== 'undefined')
            ? CharProgress.collectionDupesProgress()
            : { have: owned.length, total: all.length };
        return {
            have: owned.length,
            total: all.length,
            left: all.length - owned.length,
            copiesHave: dupes.have,
            copiesTotal: dupes.total
        };
    },

    rosterComplete() {
        return this.remainingPool().length === 0;
    },

    remainingPool() {
        const owned = new Set(this.owned());
        return this.playableIds().filter(id => !owned.has(id));
    },

    isEnemyPlayable(id) {
        return !!this.ENEMY_SERIES[id];
    },

    enemyAsAlly(id) {
        const e = this.enemyTemplate(id);
        if (!e && typeof FighterKits === 'undefined') return null;
        if (typeof FighterKits !== 'undefined') {
            const series = this.ENEMY_SERIES[id] || e?.series || 'Destino';
            const base = { ...(e || { id, name: id }), series };
            const ally = FighterKits.asAlly(id, base);
            // Preserve armor / transform extras from encounter template when kit lacks them
            if (e) {
                if (e.armorShell) {
                    ally.armorShell = true;
                    ally.armorBreakName = e.armorBreakName;
                    ally.armorBreakDefMul = e.armorBreakDefMul;
                    ally.armorBreakAtkMul = e.armorBreakAtkMul;
                    ally.armorScratchPct = e.armorScratchPct;
                }
                if (e.transform && !ally.transform) {
                    ally.transform = true;
                    ally.transformName = e.transformName;
                    ally.transformedSkills = e.transformedSkills || null;
                }
            }
            return ally;
        }
        if (!e) return null;
        const skills = (e.skills || []).map(sk => {
            const copy = { ...sk };
            if (copy.cost == null) {
                copy.cost = copy.power
                    ? Math.max(18, Math.min(70, Math.round(copy.power * 0.35)))
                    : 28;
            }
            if (!copy.desc) copy.desc = copy.name || 'Técnica desbloqueada.';
            return copy;
        });
        if (!skills.some(s => s.power)) {
            skills.unshift({
                id: `${id}_strike`, name: 'Golpe Básico', cry: '!', cost: 18, power: 75, type: 'strike',
                desc: 'Ataque básico del desbloqueado.'
            });
        }
        return {
            id: e.id,
            name: e.name,
            series: this.ENEMY_SERIES[id] || e.series || 'Destino',
            role: e.role || 'DPS',
            roleTag: e.roleTag || 'Desbloqueado',
            img: e.img || (typeof StagedSprites !== 'undefined' && StagedSprites.url(id, 'idle')) || `assets/sprites/anim/${id}_idle.png`,
            color: e.color || '#c41e3a',
            accent: e.accent || '#f4d03f',
            resist: e.resist || [],
            weak: e.weak || [],
            null: e.null || [],
            maxHp: Math.max(220, Math.round((e.maxHp || 260) * 0.95)),
            maxSp: 128,
            atk: Math.max(42, e.atk || 52),
            def: Math.max(14, e.def || 20),
            agi: Math.max(18, e.agi || 26),
            luk: Math.max(10, e.luk || 16),
            skills,
            fromEnemy: true,
            transform: !!e.transform,
            transformName: e.transformName,
            transformedSkills: e.transformedSkills || null,
            armorShell: !!e.armorShell,
            armorBreakName: e.armorBreakName,
            armorBreakDefMul: e.armorBreakDefMul,
            armorBreakAtkMul: e.armorBreakAtkMul,
            armorScratchPct: e.armorScratchPct
        };
    },

    getTemplate(id) {
        if (typeof CharacterRegistry !== 'undefined') {
            const entry = CharacterRegistry.getEntry(id);
            // Registry knows this id → never fall through to raw BattleData placeholders.
            if (entry) return entry.implemented ? entry.template : null;
        }
        const party = (typeof BattleData !== 'undefined' && BattleData.party) || [];
        const fromParty = party.find(p => p.id === id);
        if (fromParty) return fromParty;
        if (this.isEnemyPlayable(id)) return this.enemyAsAlly(id);
        return null;
    },

    /** Ids safe for gacha pools / party UI (implemented templates only). */
    isPlayableId(id) {
        if (!id || this.EXCLUDED.has(id)) return false;
        if (typeof CharacterRegistry !== 'undefined') return CharacterRegistry.isImplemented(id);
        return !!this.getTemplate(id);
    },

    ownedTemplates() {
        if (typeof CharacterRegistry !== 'undefined') return CharacterRegistry.ownedTemplates();
        return this.owned().map(id => this.getTemplate(id)).filter(Boolean);
    },

    seriesList() {
        return [
            'One Piece', 'Naruto', 'JoJo', 'Bleach', 'Jujutsu Kaisen',
            'Kimetsu no Yaiba', 'Chainsaw Man'
        ];
    },

    metaphorUnlocked() {
        const bossCleared = !!(
            GameState.get('bossDefeated') ||
            GameState.flag('gate_final_cleared')
        );

        if (bossCleared && !GameState.get('bossDefeated')) {
            GameState.set('bossDefeated', true);
        }
        return bossCleared;
    },

    isBannerUnlocked(bannerId) {
        if (bannerId === 'metaphor') return this.metaphorUnlocked();
        return !!this.BANNERS[bannerId];
    },

    stateKey() {
        return 'bannerGacha';
    },

    getState(bannerId) {
        const all = GameState.get(this.stateKey()) || {};
        if (!all[bannerId]) {
            all[bannerId] = {
                pity7: 0,
                pity6: 0,
                pity5: 0,
                pity4: 0,
                guaranteedFeatured: false,
                pulls: 0,
                history: []
            };
            GameState.set(this.stateKey(), all);
        }
        const st = all[bannerId];
        if (st.pity6 == null) st.pity6 = 0;
        if (st.pity7 == null) st.pity7 = 0;
        return st;
    },

    saveState(bannerId, st) {
        const all = GameState.get(this.stateKey()) || {};
        all[bannerId] = st;
        GameState.set(this.stateKey(), all);
    },

    rarityFor(id) {
        const stars = this.primaryStars(id);
        if (typeof GachaRates !== 'undefined') return GachaRates.rarityLabel(stars);
        if (stars >= 7) return 'celestial';
        if (stars >= 6) return 'mythic';
        if (stars >= 5) return 'epic';
        if (stars === 4) return 'rare';
        if (stars === 3) return 'common';
        if (id === this.GOJO_ID) return 'mythic';
        if (this.isEnemyPlayable(id)) return 'rare';
        return 'common';
    },

    /** Star tiers this id appears in across banners (and enemy EX as 4★). */
    bannerStars(id) {
        const stars = new Set();
        if (!id) return [];
        Object.values(this.BANNERS).forEach((b) => {
            if (!b || b.isMetaphor) return;
            const featStars = b.featuredStars || 5;
            if (b.featuredId === id) stars.add(featStars);
            if ((b.pool6 || []).includes(id)) stars.add(6);
            if ((b.pool5Std || []).includes(id)) stars.add(5);
            if ((b.pool4 || []).includes(id)) stars.add(4);
            if ((b.pool3 || []).includes(id)) stars.add(3);
        });
        // Do NOT add 4★ just because the id is also a story enemy — that made
        // banner 5★/6★ units show a fake "4★/5★" dual label in party select.
        return [...stars].sort((a, b) => b - a);
    },

    primaryStars(id) {
        const list = this.bannerStars(id);
        if (list.length) return list[0];
        if (typeof CharacterRegistry !== 'undefined') {
            const r = CharacterRegistry.rarityOf(id);
            if (r) return r;
        }
        return this.isEnemyPlayable(id) ? 4 : 3;
    },

    isFiveStarChar(id) {
        const s = this.bannerStars(id);
        return s.includes(5) || s.includes(6) || id === this.GOJO_ID;
    },

    isSixStarChar(id) {
        return this.bannerStars(id).includes(6) || id === this.GOJO_ID;
    },

    isFourStarChar(id) {
        return this.bannerStars(id).includes(4) && !this.isFiveStarChar(id);
    },

    starSealRewardFor(stars) {
        return Number(stars) >= 6 ? this.STAR_SEAL_FROM_6 : this.STAR_SEAL_FROM_5;
    },

    starSealCostFor(id) {
        return this.isFourStarChar(id) ? 1 : (this.isSixStarChar(id) ? this.STAR_SEAL_COST_6 : this.STAR_SEAL_COST_5);
    },

    /** True only if the unit is on BOTH 4★ and 5★ banner pools (rare). Never from enemy EX. */
    isDualRarity(id) {
        if (!id) return false;
        let has4 = false;
        let has5 = false;
        Object.values(this.BANNERS).forEach((b) => {
            if (!b || b.isMetaphor) return;
            if ((b.pool4 || []).includes(id)) has4 = true;
            if ((b.pool5Std || []).includes(id)) has5 = true;
            if (b.featuredId === id && (b.featuredStars || 5) >= 5) has5 = true;
        });
        return has4 && has5;
    },

    starsLabel(id) {
        // Always a single rarity for UI — dual 4★/5★ labels confused players.
        const s = this.primaryStars(id);
        if (s >= 7) return '7★';
        if (s >= 6) return '6★';
        if (s >= 5) return '5★';
        if (s === 4) return '4★';
        if (s === 3) return '3★';
        return `${s}★`;
    },

    shardResult(name, stars = 3) {
        const rarity = (typeof GachaRates !== 'undefined')
            ? GachaRates.rarityLabel(stars)
            : (stars >= 5 ? 'epic' : stars === 4 ? 'rare' : 'common');
        return {
            kind: 'shard',
            rarity,
            stars,
            reward: name || 'Fragmento del Destino',
            charId: null,
            dupe: false
        };
    },

    characterResult(charId, stars, featured) {
        const tpl = this.getTemplate(charId);
        if (!tpl) {
            return this.shardResult(`Eco · ${charId}`, stars);
        }
        const copies = (typeof CharProgress !== 'undefined')
            ? CharProgress.copiesOf(charId)
            : (this.owns(charId) ? 1 : 0);
        const maxC = (typeof CharProgress !== 'undefined')
            ? CharProgress.maxConstFor(charId)
            : (stars >= 5 ? 3 : 6);
        const maxed = copies >= maxC + 1;
        const rarity = (typeof GachaRates !== 'undefined')
            ? GachaRates.rarityLabel(stars)
            : this.rarityFor(charId);

        if (maxed) {
            // WuWa-style: still reveal the character art, then convert underneath.
            const name = tpl.name || charId;
            const base = {
                kind: 'converted',
                converted: true,
                rarity,
                stars,
                reward: name,
                charId,
                dupeOf: charId,
                featured: !!featured,
                series: tpl.series || '',
                fromEnemy: !!tpl.fromEnemy,
                constellation: maxC,
                maxed: true
            };
            if (stars === 4) {
                const n = this.STAR_SEAL_FROM_4 || 1;
                return {
                    ...base,
                    convertTo: 'star_seal',
                    starSeals: n,
                    convertLabel: `+${n} Sello Estelar`
                };
            }
            if (stars <= 3) {
                return {
                    ...base,
                    convertTo: 'shard',
                    convertLabel: `Eco · ya C${maxC}`,
                    chikiGain: 15
                };
            }
            if (stars >= 5) {
                const n = this.starSealRewardFor(stars);
                return {
                    ...base,
                    convertTo: 'star_seal',
                    starSeals: n,
                    convertLabel: `+${n} Sellos Estelares · tienda de dupes`
                };
            }
            return {
                ...base,
                convertTo: 'inv',
                refundInv: 1,
                convertLabel: '+1 INV'
            };
        }

        const already = copies >= 1;
        if (already) {
            const nextC = copies;
            return {
                kind: 'dupe',
                rarity,
                stars,
                reward: `${tpl.name} · C${Math.min(maxC, nextC)}`,
                charId,
                dupe: true,
                dupeOf: charId,
                constellationAfter: Math.min(maxC, nextC),
                featured: !!featured,
                series: tpl.series || '',
                fromEnemy: !!tpl.fromEnemy
            };
        }
        return {
            kind: charId === this.GOJO_ID ? 'gojo' : 'character',
            rarity,
            stars,
            reward: tpl.name || charId,
            charId,
            featured: !!featured,
            series: tpl.series || '',
            fromEnemy: !!tpl.fromEnemy
        };
    },

    invRefundResult(stars, note) {
        return {
            kind: 'inv_refund',
            rarity: 'rare',
            stars: stars || 3,
            reward: note || '+1 INV (colección completa)',
            charId: null,
            refundInv: 1,
            dupe: false
        };
    },

    starSealResult(stars = 4, fromName = null) {
        const n = this.STAR_SEAL_FROM_4 || 1;
        const tier = Number(stars) >= 6 ? 6 : Number(stars) >= 5 ? 5 : 4;
        return {
            kind: 'star_seal',
            rarity: 'rare',
            stars: stars || 4,
            reward: fromName
                ? `+${n} Sello ${tier}★ · ${fromName} max`
                : `+${n} Sello ${tier}★`,
            charId: null,
            starSeals: n,
            dupe: false
        };
    },

    /** 5★/6★ owned and not C-max — shop targets. */
    dupeShopList() {
        const out = [];
        const seen = new Set();
        Object.values(this.BANNERS).forEach((b) => {
            if (b.isMetaphor) return;
            const ids = [b.featuredId, ...(b.pool6 || []), ...(b.pool5Std || []), ...(b.pool4 || [])].filter(Boolean);
            ids.forEach((id) => {
                if (seen.has(id) || !this.getTemplate(id)) return;
                seen.add(id);
                if (!this.owns(id)) return;
                if (this.isCopyMaxed(id)) return;
                const tpl = this.getTemplate(id);
                const c = typeof CharProgress !== 'undefined' ? CharProgress.constellation(id) : 0;
                out.push({
                    id,
                    name: tpl.name || id,
                    constellation: c,
                    max: typeof CharProgress !== 'undefined' ? CharProgress.maxConstFor(id) : 3,
                    stars: this.starsLabel(id),
                    cost: this.starSealCostFor(id),
                    dual: this.isDualRarity(id),
                    art: `assets/sprites/anim/${id}_idle.png`
                });
            });
        });
        return out.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    },

    fiveStarDupeShopList() {
        return this.dupeShopList();
    },

    buyDupe(charId, requestedTier = null) {
        const id = String(charId || '').trim();
        if (!id) return { ok: false, reason: 'Personaje inválido.' };
        // Prefer a real battle template; dual 4★/5★ enemies still resolve via enemyAsAlly.
        const tpl = this.getTemplate(id) || (this.isEnemyPlayable(id) ? this.enemyAsAlly(id) : null);
        if (!tpl) return { ok: false, reason: 'Personaje inválido.' };
        const tier = requestedTier || (this.isFourStarChar(id) ? 4 : (this.isSixStarChar(id) ? 6 : 5));
        if (tier === 4 ? !this.isFourStarChar(id) : !this.isFiveStarChar(id) || (tier === 6 && !this.isSixStarChar(id))) return { ok: false, reason: `Este personaje no pertenece a la tienda ${tier}★.` };
        if (!this.owns(id)) return { ok: false, reason: 'Primero tienes que sacar al personaje.' };
        if (this.isCopyMaxed(id)) return { ok: false, reason: 'Ya está al máximo.' };
        const cost = this.starSealCostFor(id);
        const seals = GameState.get('starSeals') || 0;
        if (seals < cost) return { ok: false, reason: `Necesitas ${cost} Sello${cost === 1 ? '' : 's'} Estelar.` };
        const sealTier = tier;
        if (!GameState.useStarSeal(cost, sealTier)) return { ok: false, reason: `Sin sellos ${sealTier}★ suficientes.` };
        const info = typeof CharProgress !== 'undefined'
            ? CharProgress.addCopy(id)
            : { constellation: 0 };
        return {
            ok: true,
            charId: id,
            name: tpl.name || id,
            constellation: info.constellation,
            maxed: !!info.maxed,
            cost,
            sealsLeft: GameState.get('starSeals') || 0
        };
    },

    buyFiveStarDupe(charId) {
        return this.buyDupe(charId, this.isSixStarChar(charId) ? 6 : 5);
    },

    buyFourStarDupe(charId) {
        return this.buyDupe(charId, 4);
    },

    pickCharFrom(pool, pickFn) {
        const open = this.availablePool(pool);
        if (!open.length) return null;
        return this.pickWithCollectionBias(open, pickFn);
    },

    pickWithCollectionBias(pool, pickFn) {
        const list = (pool || []).filter(Boolean);
        if (!list.length) return null;
        const pick = pickFn || ((items) => items[Math.floor(Math.random() * items.length)]);
        const missing = list.filter(id => !this.owns(id));
        if (missing.length && Math.random() < 0.78) return pick(missing);
        return pick(list);
    },

    rollOne(bannerId) {
        const b = this.BANNERS[bannerId];
        if (!b) return null;
        if (bannerId === 'metaphor' && GameState.get('legendaryObtained')) {
            return this.shardResult('Banner Metaphor completado', 3);
        }
        if (!this.isBannerUnlocked(bannerId)) return null;

        // Entire playable banner maxed → INV instead of junk shards
        if (!b.isMetaphor && this.bannerFullyMaxed(bannerId) && typeof CharProgress !== 'undefined' && CharProgress.allMaxed()) {
            const stFull = this.getState(bannerId);
            stFull.pity7 = (stFull.pity7 || 0) + 1;
            stFull.pity6 = (stFull.pity6 || 0) + 1;
            stFull.pity5 += 1;
            stFull.pity4 += 1;
            stFull.pulls += 1;
            this.saveState(bannerId, stFull);
            return this.invRefundResult(4, '+1 INV · colección max');
        }

        const st = this.getState(bannerId);
        st.pity7 = (st.pity7 || 0) + 1;
        st.pity6 = (st.pity6 || 0) + 1;
        st.pity5 += 1;
        st.pity4 += 1;
        st.pulls += 1;

        const rates = typeof GachaRates !== 'undefined' ? GachaRates : null;
        const pick = rates ? rates.pick.bind(rates) : (list) => list[Math.floor(Math.random() * list.length)];
        const featChance = b.featuredRate != null
            ? b.featuredRate
            : (this.SERIES_RATES?.featuredRate ?? 0.7);
        const featStars = b.featuredStars || 5;

        const rollHigh = (starsTarget) => {
            const force = st.guaranteedFeatured || !b.featured5050;
            let charId = null;
            let featured = false;
            const poolKey = starsTarget >= 6 ? 'pool6' : 'pool5Std';
            const rawStd = (b[poolKey] || []).filter((id) => id !== b.featuredId || featStars !== starsTarget);
            const stdOpen = this.availablePool(rawStd, true);
            const featOpen = b.featuredId
                && featStars === starsTarget
                && this.getTemplate(b.featuredId);

            if (force || Math.random() < featChance) {
                if (featOpen) {
                    charId = b.featuredId;
                    featured = true;
                    st.guaranteedFeatured = false;
                } else if (stdOpen.length) {
                    charId = this.pickWithCollectionBias(stdOpen, pick);
                    st.guaranteedFeatured = false;
                }
            } else if (stdOpen.length) {
                charId = this.pickWithCollectionBias(stdOpen, pick);
                st.guaranteedFeatured = true;
            } else if (featOpen) {
                charId = b.featuredId;
                featured = true;
                st.guaranteedFeatured = false;
            }

            if (!charId) {
                return (typeof CharProgress !== 'undefined' && CharProgress.allMaxed())
                    ? this.invRefundResult(starsTarget, `+1 INV · ${starsTarget}★ max`)
                    : this.invRefundResult(starsTarget, `+1 INV · pool ${starsTarget}★ completo`);
            }
            return this.characterResult(charId, starsTarget, featured);
        };

        let result;

        if (b.isMetaphor) {
            const r7 = rates
                ? rates.effectiveRate(b.rate7 || 0.008, b.soft7 || 50, b.hard7 || 80, st.pity7 - 1)
                : (b.rate7 || 0.008);
            const roll = Math.random();
            let stars = 3;
            if (roll < r7 || st.pity7 >= (b.hard7 || 80)) stars = 7;
            else if (st.pity4 >= b.hard4 || Math.random() < (b.rate4 || 0.10) / Math.max(0.001, 1 - r7)) stars = 4;

            if (stars === 7) {
                st.pity7 = 0;
                st.pity6 = 0;
                st.pity5 = 0;
                st.pity4 = 0;
                const force = st.guaranteedFeatured || !b.featured5050;
                if (force || Math.random() < featChance) {
                    st.guaranteedFeatured = false;
                    result = {
                        kind: 'legendary',
                        rarity: 'celestial',
                        stars: 7,
                        reward: (CONFIG.gachaRewards?.legendary?.name) || 'METAPHOR: REFANTAZIO',
                        charId: null,
                        metaphor: true,
                        featured: true,
                        bannerId
                    };
                } else {
                    st.guaranteedFeatured = true;
                    result = this.shardResult(pick(b.pool5StdNames) || 'Destino Falso', 5);
                    result.featured = false;
                }
            } else if (stars === 4) {
                st.pity4 = 0;
                result = this.shardResult(pick(b.pool4Names) || 'Fragmento Real', 4);
            } else {
                    const itemName = pick(b.pool3Names) || 'Chispa de esperanza';
                    result = (typeof EquipmentSystem !== 'undefined' && EquipmentSystem.result(itemName)) || this.shardResult(itemName, 3);
            }
        } else {
            const r6 = rates
                ? rates.effectiveRate(b.rate6 || 0.003, b.soft6 || 55, b.hard6 || 80, st.pity6 - 1)
                : (b.rate6 || 0.003);
            const r5 = rates
                ? rates.effectiveRate(b.rate5 || 0.02, b.soft5 || 35, b.hard5 || 50, st.pity5 - 1)
                : (b.rate5 || 0.02);
            const roll = Math.random();
            let stars = 3;
            if (roll < r6 || st.pity6 >= (b.hard6 || 80)) stars = 6;
            else if (roll < r6 + r5 || st.pity5 >= (b.hard5 || 50)) stars = 5;
            else if (st.pity4 >= b.hard4 || Math.random() < (b.rate4 || 0.12) / Math.max(0.001, 1 - r6 - r5)) stars = 4;

            if (stars === 6) {
                st.pity6 = 0;
                st.pity5 = 0;
                st.pity4 = 0;
                result = rollHigh(6);
            } else if (stars === 5) {
                st.pity5 = 0;
                st.pity4 = 0;
                result = rollHigh(5);
            } else if (stars === 4) {
                st.pity4 = 0;
                const charId = this.pickCharFrom(b.pool4 || [], pick);
                if (!charId) {
                    result = this.starSealResult(4);
                } else {
                    result = this.characterResult(charId, 4, false);
                }
            } else {
                const charId = this.pickCharFrom(b.pool3 || [], pick);
                if (charId) {
                    result = this.characterResult(charId, 3, false);
                } else if (b.pool3Names?.length) {
                    const itemName = pick(b.pool3Names) || 'Fragmento del Destino';
                    result = (typeof EquipmentSystem !== 'undefined' && EquipmentSystem.result(itemName)) || this.shardResult(itemName, 3);
                } else {
                    result = (typeof EquipmentSystem !== 'undefined' && EquipmentSystem.result('Fragmento del Destino')) || this.shardResult('Fragmento del Destino', 3);
                }
            }
        }

        result.bannerId = bannerId;
        result.game = b.series;
        const histReward = (result.converted || result.kind === 'converted')
            ? `${result.reward} · convertido (${result.convertLabel || 'recurso'})`
            : result.reward;
        st.history.push({
            reward: histReward,
            rarity: result.rarity,
            stars: result.stars,
            featured: !!result.featured,
            converted: !!(result.converted || result.kind === 'converted'),
            t: Date.now()
        });
        if (st.history.length > 80) st.history = st.history.slice(-80);
        this.saveState(bannerId, st);
        return result;
    },
    planPulls(bannerIdOrCount, maybeCount) {
        let bannerId = 'onepiece';
        let count = 1;
        if (typeof bannerIdOrCount === 'string') {
            bannerId = bannerIdOrCount;
            count = maybeCount || 1;
        } else {
            count = bannerIdOrCount || 1;
            bannerId = 'onepiece';
        }

        const planned = [];
        for (let i = 0; i < count; i++) {
            const r = this.rollOne(bannerId);
            if (!r) continue;
            // Simulate copy gain so subsequent rolls in the same ×10 skip maxed
            if (r.charId && typeof CharProgress !== 'undefined'
                && r.kind !== 'inv_refund'
                && r.kind !== 'converted'
                && !r.converted
                && r.kind !== 'star_seal'
                && r.kind !== 'shard') {
                const copies = GameState.get('charCopies') || {};
                copies[r.charId] = (copies[r.charId] || 0) + 1;
                GameState.set('charCopies', copies);
                r._plannedCopy = true;
            }
            planned.push(r);
        }

        // Revert simulated copies; applyPull adds them for real
        planned.forEach((r) => {
            if (!r._plannedCopy || !r.charId) return;
            const copies = GameState.get('charCopies') || {};
            copies[r.charId] = Math.max(
                this.STARTERS.includes(r.charId) ? 1 : 0,
                (copies[r.charId] || 1) - 1
            );
            if (copies[r.charId] === 0) delete copies[r.charId];
            GameState.set('charCopies', copies);
            delete r._plannedCopy;
        });
        if (typeof CharProgress !== 'undefined') CharProgress.ensure();

        if (count >= 10 && planned.length >= 10) {
            const hasRarePlus = planned.some(r => (r.stars || 0) >= 4);
            if (!hasRarePlus) {
                const st = this.getState(bannerId);
                const idx = planned.findIndex(r => (r.stars || 3) <= 3);
                if (idx >= 0) {
                    const b = this.BANNERS[bannerId];
                    if (b?.isMetaphor) {
                        planned[idx] = this.shardResult(
                            (typeof GachaRates !== 'undefined' ? GachaRates.pick(b.pool4Names) : b.pool4Names[0]) || 'Fragmento Real',
                            4
                        );
                        planned[idx].bannerId = bannerId;
                    } else if (b?.pool4?.length) {
                        const charId = this.pickCharFrom(b.pool4) || b.pool4[0];
                        planned[idx] = this.characterResult(charId, 4, false);
                        planned[idx].bannerId = bannerId;
                    }
                    st.pity4 = 0;
                    this.saveState(bannerId, st);
                }
            }

            // Soft double-5★ gift on multis: exciting, not free every time.
            // ~40% when exactly one 5★ landed → frequent doubles without flooding.
            const b = this.BANNERS[bannerId];
            if (b && !b.isMetaphor) {
                const fiveSlots = planned
                    .map((r, i) => ((r.stars || 0) >= 5 || r.rarity === 'epic' || r.rarity === 'legendary') ? i : -1)
                    .filter((i) => i >= 0);
                if (fiveSlots.length === 1 && Math.random() < 0.40) {
                    const slot = planned.findIndex((r, i) => !fiveSlots.includes(i) && (r.stars || 0) < 5);
                    if (slot >= 0) {
                        const st = this.getState(bannerId);
                        const featOpen = b.featuredId
                            && (b.featuredStars || 5) === 5
                            && this.getTemplate(b.featuredId);
                        const stdOpen = this.availablePool(b.pool5Std || [], true);
                        let charId = null;
                        let featured = false;
                        if (featOpen && Math.random() < (b.featuredRate ?? 0.7)) {
                            charId = b.featuredId;
                            featured = true;
                        } else if (stdOpen.length) {
                            charId = stdOpen[Math.floor(Math.random() * stdOpen.length)];
                        } else if (featOpen) {
                            charId = b.featuredId;
                            featured = true;
                        }
                        if (charId) {
                            planned[slot] = this.characterResult(charId, 5, featured);
                            planned[slot].bannerId = bannerId;
                            planned[slot].doubleBoost = true;
                            st.pity5 = 0;
                            st.pity4 = 0;
                            this.saveState(bannerId, st);
                        }
                    }
                }
            }
        }
        return planned;
    },

    applyPull(result) {
        if (result.kind === 'equipment' && result.equipmentId && typeof EquipmentSystem !== 'undefined') {
            EquipmentSystem.add(result.equipmentId, 1);
            result.reward = result.reward || result.equipment?.name || 'Objeto 3★';
            result.historyReward = `${result.reward} · objeto equipable`;
            GameState.recordPull(result.rarity, result.historyReward, {
                kind: 'equipment', bannerId: result.bannerId || null, stars: 3, equipmentId: result.equipmentId
            });
            return result;
        }
        if (result.kind === 'converted' || result.converted) {
            if (result.convertTo === 'inv' || result.refundInv) {
                const n = result.refundInv || 1;
                for (let i = 0; i < n; i++) {
                    if (typeof GameState.addInvocation === 'function') GameState.addInvocation();
                }
            }
            if (result.convertTo === 'star_seal' || result.starSeals) {
                const n = result.starSeals || this.STAR_SEAL_FROM_4 || 1;
                if (typeof GameState.addStarSeal === 'function') GameState.addStarSeal(n, result.stars || 4);
                result.starSeals = n;
            }
            if (result.convertTo === 'shard' || result.chikiGain) {
                GameState.addChikistrites(result.chikiGain || 15);
            }
            const name = result.reward || result.charId || 'Personaje';
            const label = result.convertLabel || 'recurso';
            result.reward = name;
            result.historyReward = `${name} · convertido (${label})`;
            GameState.recordPull(result.rarity, result.historyReward, {
                charId: result.charId || result.dupeOf || null,
                kind: 'converted',
                bannerId: result.bannerId || null,
                stars: result.stars || null,
                constellation: result.constellation,
                converted: true,
                convertTo: result.convertTo || null
            });
            return result;
        }

        if (result.kind === 'inv_refund' || result.refundInv) {
            const n = result.refundInv || 1;
            for (let i = 0; i < n; i++) {
                if (typeof GameState.addInvocation === 'function') GameState.addInvocation();
            }
        }

        if (result.kind === 'star_seal' || result.starSeals) {
            const n = result.starSeals || this.STAR_SEAL_FROM_4 || 1;
            if (typeof GameState.addStarSeal === 'function') GameState.addStarSeal(n, result.stars || 4);
            result.starSeals = n;
            result.reward = result.reward || `+${n} Sello Estelar`;
        }

        if ((result.kind === 'character' || result.kind === 'gojo' || result.kind === 'dupe' || result.dupe) && result.charId) {
            if (typeof CharProgress !== 'undefined') {
                const info = CharProgress.addCopy(result.charId);
                result.constellation = info.constellation;
                result.maxed = info.maxed;
                if (result.kind === 'dupe' || result.dupe) {
                    const name = (result.reward || '').split('·')[0].trim() || result.charId;
                    result.reward = `${name} · C${info.constellation}`;
                }
            } else {
                this.unlock(result.charId);
            }
        }

        if (result.kind === 'gojo' || result.charId === this.GOJO_ID) {
            GameState.set('gojoObtained', true);
            GameState.set('bossUnlockedByGojo', true);
            GameState.setFlag('gate_gojo_unlock', true);
            GameState.setFlag('gate_aizen_cleared', true); // legacy saves
        }
        if (result.kind === 'legendary' || result.metaphor) {
            GameState.set('legendaryObtained', true);
        }
        if (result.kind === 'shard' && !result.dupe) {
            GameState.addChikistrites(result.stars >= 7 ? 120 : result.stars >= 6 ? 90 : result.stars >= 5 ? 60 : result.stars >= 4 ? 30 : 15);
        }
        GameState.recordPull(result.rarity, result.reward, {
            charId: result.charId || result.dupeOf || null,
            kind: result.kind,
            bannerId: result.bannerId || null,
            stars: result.stars || null,
            constellation: result.constellation
        });
        return result;
    },

    ratesBlurb(b) {
        return (typeof GachaRates !== 'undefined')
            ? GachaRates.ratesBlurb(b)
            : `5★ · 4★ · 3★ · hard ${b.hard5}`;
    },

    /** Last 10 red Metaphor tickets after THE 50/50 (completes the 80 pity bank). */
    grantFinalTenIfEligible() {
        if (GameState.get('finalTenGranted')) return 0;
        if (!GameState.get('bossDefeated') && !GameState.flag('gate_final_cleared')) return 0;
        GameState.set('finalTenGranted', true);
        const n = this.METAPHOR_BOSS || this.FINAL_TEN || 10;
        if (typeof GameState.addMetaphorTicket === 'function') {
            GameState.addMetaphorTicket(n);
        }
        return n;
    },

    /** Metaphor tickets from clearing the last mission of a section. */
    metaphorRewardFor(missionId, runKey) {
        const section = this.METAPHOR_SECTION || 14;
        const chronicleIds = (typeof ChronicleData !== 'undefined')
            ? ChronicleData.metaphorMissionIds()
            : [];
        const byMission = {
            gate_10: section,
            gate_13: section,
            gate_19: section,
            gate_21: section,
            arc_beam: section,
            // legacy keys (old saves / unused lists)
            gate_aizen: section,
            free_doflamingo: section,
            gate_jjk_4: section,
            side_akatsuki: section,
            wave_12: section
        };
        chronicleIds.forEach((id) => { byMission[id] = section; });
        if (missionId && byMission[missionId]) return byMission[missionId];
        if (String(runKey) === '12') return section;
        return 0;
    },

    /** One-time migration from v1 unique-100 banner. */
    migrateIfNeeded() {
        if (GameState.get('gachaVersion') >= 2) return;
        const all = {};
        this.SERIES_ORDER.forEach(id => {
            all[id] = {
                pity5: 0,
                pity4: 0,
                guaranteedFeatured: false,
                pulls: 0,
                history: []
            };
        });
        const oldPity = Math.min(89, GameState.get('pity') || 0);
        all.onepiece.pity5 = oldPity;
        GameState.set(this.stateKey(), all);

        const earned = GameState.get('invocationsEarned') || 0;
        if (earned > 0 && earned <= 100 && !GameState.get('migratedInvBonus')) {
            const bonus = Math.min(200, Math.max(0, 200 - earned));
            if (bonus > 0) {
                for (let i = 0; i < bonus; i++) GameState.addInvocation();
                GameState.set('invocationsEarned', earned + bonus);
            }
            GameState.set('migratedInvBonus', true);
        }
        GameState.set('gachaVersion', 2);
    }
};

if (typeof BattleData !== 'undefined') {
    BattleData.getPlayable = (id) => GachaRoster.getTemplate(id);
    BattleData.ownedParty = () => GachaRoster.ownedTemplates();
}

if (typeof window !== 'undefined') window.GachaRoster = GachaRoster;
