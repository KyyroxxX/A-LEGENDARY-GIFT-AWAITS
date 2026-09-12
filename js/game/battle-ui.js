/**
 * Persona-style battle UI + animated pixel sprites
 */
const BattleUI = {
    state: null,
    root: null,
    mode: 'command',
    actionPhase: 'IDLE',
    selectedSkill: null,
    pendingOneMore: false,
    allOutReady: false,
    chainCount: 0,
    spriteTimers: {},
    renderedForms: {},

    setActionPhase(phase) {
        this.actionPhase = phase || 'IDLE';
        const banner = this.root?.querySelector('#p5-turn-banner');
        if (!banner) return;
        const actor = this.state ? BattleEngine.currentActor(this.state) : null;
        const allyTurn = actor && actor.side === 'ally' && this.mode !== 'enemy' && !this.state?.finished;
        banner.innerHTML = `<span>${this.phaseLabel(actor)}</span>`;
        banner.classList.toggle('enemy', !allyTurn);
        banner.dataset.phase = this.actionPhase;
        banner.classList.remove('phase-pulse');
        void banner.offsetWidth;
        banner.classList.add('phase-pulse');
    },

    phaseLabel(actor) {
        const phase = this.actionPhase || 'IDLE';
        const round = this.state?.turnCount ? `<strong class="p5ui-round-label">RONDA ${this.state.turnCount}</strong>` : '';
        const who = actor?.name ? `<small>${actor.name}</small>` : '';
        const base = actor && actor.side === 'ally' && this.mode !== 'enemy' && !this.state?.finished
            ? (this.pendingOneMore ? `¡OTRO TURNO!${who}` : `Turno del jugador${who}`)
            : `Turno enemigo${who}`;
        const map = {
            IDLE: base,
            PLAYER_SELECTING: `Selecciona acción${who}`,
            ACTION_START: `Acción en curso${who}`,
            CASTING: `Canalizando${who}`,
            ATTACKING: `Ataque${who}`,
            IMPACT: `Impacto${who}`,
            DAMAGE_APPLIED: `Daño aplicado${who}`,
            DEATH_CHECK: 'Comprobando caída',
            RETURNING: 'Retorno',
            NEXT_TURN: base
        };
        return `${round}${map[phase] || base}`;
    },

    captureVitals() {
        const snap = {};
        [...(this.state?.party || []), ...(this.state?.enemies || [])].forEach((u) => {
            snap[u.id] = {
                hp: Math.max(0, u.hp || 0),
                maxHp: Math.max(1, u.maxHp || 1),
                sp: Math.max(0, u.sp || 0),
                maxSp: Math.max(1, u.maxSp || 1)
            };
        });
        return snap;
    },

    updateUnitVisual(id, hp, sp) {
        if (!this.root) return;
        const unit = [...(this.state?.party || []), ...(this.state?.enemies || [])].find((u) => u.id === id);
        if (!unit) return;
        const hpPct = Math.max(0, Math.min(100, (hp / Math.max(1, unit.maxHp)) * 100));
        const spPct = Math.max(0, Math.min(100, (sp / Math.max(1, unit.maxSp || 1)) * 100));

        this.root.querySelectorAll(`[data-unit-hp="${id}"]`).forEach((el) => { el.style.width = `${hpPct}%`; });
        this.root.querySelectorAll(`[data-unit-sp="${id}"]`).forEach((el) => { el.style.width = `${spPct}%`; });
        this.root.querySelectorAll(`[data-unit-hp-text="${id}"]`).forEach((el) => { el.textContent = `${Math.round(hp)} / ${unit.maxHp}`; });
        this.root.querySelectorAll(`[data-unit-sp-text="${id}"]`).forEach((el) => { el.textContent = `${Math.round(sp)} / ${unit.maxSp || 0}`; });
        this.root.querySelectorAll(`[data-unit-hp-flat="${id}"]`).forEach((el) => { el.textContent = `HP ${Math.round(hp)}`; });
        this.root.querySelectorAll(`[data-unit-sp-flat="${id}"]`).forEach((el) => { el.textContent = `CP ${Math.round(sp)}`; });
        this.root.querySelectorAll(`[data-unit-mini-hp="${id}"]`).forEach((el) => { el.style.width = `${hpPct}%`; });

        const chip = this.root.querySelector(`.p5-party-chip[data-unit="${id}"]`);
        if (chip) {
            chip.classList.toggle('downed', hp <= 0);
            chip.classList.toggle('low', hp > 0 && hpPct < 35);
            chip.classList.toggle('critical', hp > 0 && hpPct < 18);
        }
        const ebar = this.root.querySelector(`.p5ui-ebar[data-unit="${id}"]`);
        if (ebar) {
            ebar.classList.toggle('dead', hp <= 0);
            ebar.classList.toggle('low', hp > 0 && hpPct < 35);
        }
        const fighter = this.fighterEl(id);
        if (fighter && hp > 0 && hpPct < 18) fighter.classList.add('hp-critical');
        else fighter?.classList.remove('hp-critical');
    },

    fighterEl(id, side = null) {
        const fighters = [...(this.root?.querySelectorAll('.p5-fighter') || [])]
            .filter((el) => el.dataset.id === String(id));
        if (side) return fighters.find((el) => el.dataset.side === side) || null;
        return fighters[0] || null;
    },

    unitForId(id, side = null) {
        const groups = side === 'enemy'
            ? [this.state?.enemies || []]
            : side === 'ally'
                ? [this.state?.party || []]
                : [this.state?.party || [], this.state?.enemies || []];
        return groups.flat().find((unit) => unit.id === id) || null;
    },

    targetSide(actor, isSupport, skill) {
        if (isSupport && !(skill?.targetEnemy || (skill?.debuff && !skill?.heal && !skill?.buff && !skill?.allyBuff))) {
            return actor?.side || 'ally';
        }
        return actor?.side === 'enemy' ? 'ally' : 'enemy';
    },

    async animateVitalsFrom(before, ids = []) {
        if (!this.root || !this.state) return;
        const unique = [...new Set((ids || []).filter(Boolean))];
        if (!unique.length) return;
        const duration = 360;
        const start = performance.now();
        await new Promise((resolve) => {
            const tick = (now) => {
                const t = Math.min(1, (now - start) / duration);
                const ease = 1 - Math.pow(1 - t, 3);
                unique.forEach((id) => {
                    const prev = before[id];
                    const next = [...this.state.party, ...this.state.enemies].find((u) => u.id === id);
                    if (!prev || !next) return;
                    const hp = prev.hp + ((Math.max(0, next.hp || 0) - prev.hp) * ease);
                    const sp = prev.sp + (((next.sp || 0) - prev.sp) * ease);
                    this.updateUnitVisual(id, hp, sp);
                });
                if (t >= 1) {
                    resolve();
                    return;
                }
                requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    },

    /** Baked battle sprites (anim/). */
    animSpriteUrl(id, kind = 'idle') {
        const v = 'v88';
        if (kind && String(kind).startsWith('skill_')) {
            const skillId = String(kind).slice('skill_'.length);
            const mapped = (typeof AttackSprites !== 'undefined' && AttackSprites.pathFor(id, skillId))
                || `assets/sprites/anim/${id}_skill_${skillId}.png`;
            return `${mapped}?${v}`;
        }
        if (kind === 'attack') return `assets/sprites/anim/${id}_attack.png?${v}`;
        if (kind === 'attack0') return `assets/sprites/anim/${id}_attack_0.png?${v}`;
        if (kind === 'attack1') return `assets/sprites/anim/${id}_attack_1.png?${v}`;
        if (kind === 'attack2') return `assets/sprites/anim/${id}_attack_2.png?${v}`;
        if (kind === 'transform') return `assets/sprites/anim/${id}_transform.png?${v}`;
        if (kind === 'reveal') return `assets/sprites/anim/${id}_reveal.png?${v}`;
        if (/^idle_[0-3]$/.test(kind)) return `assets/sprites/anim/${id}_${kind}.png?${v}`;
        if (/^transform_[1-9]\d*$/.test(kind)) return `assets/sprites/anim/${id}_${kind}.png?${v}`;
        return `assets/sprites/anim/${id}_idle.png?${v}`;
    },

    /** Prefer live _staged cutout when mapped; else anim. */
    spriteUrl(id, kind = 'idle') {
        const staged = typeof StagedSprites !== 'undefined' ? StagedSprites.url(id, kind) : null;
        return staged || this.animSpriteUrl(id, kind);
    },

    /**
     * CSS background-image for one sprite only (no stacking — alpha would composite).
     */
    spriteBg(id, kind = 'idle') {
        return `url('${this.spriteUrl(id, kind)}')`;
    },

    /**
     * Art that natively faces left (toward screen-left).
     * Allies need CSS flip to face enemies; enemies skip the default flip (face-native).
     * Prefer staged facing bake (Itachi etc. face right → no flip).
     */
    facesLeftNative(id, kind = 'idle') {
        if (typeof StagedSprites !== 'undefined' && StagedSprites.facesLeftNative) {
            return StagedSprites.facesLeftNative(id, kind);
        }
        return [
            'gyomei', 'mitsuri', 'sabito', 'urokodaki',
            'aki', 'power', 'dio', 'zoro'
        ].includes(id);
    },

    /** @deprecated alias — enemies whose art already faces the party */
    facesPartyNative(id) {
        return this.facesLeftNative(id);
    },

    affinityChipsHtml(u, { showResist = true, showNull = true } = {}) {
        if (!u) return '';
        const chip = (kind, types) => (types || []).map((t) =>
            `<i class="aff-chip ${kind}" data-type="${t}" title="${kind === 'weak' ? 'Débil a' : kind === 'resist' ? 'Resiste' : 'Anula'} ${BattleData.typeLabel(t)}">${BattleData.typeShort(t)}</i>`
        ).join('');
        const weak = chip('weak', u.weak);
        const resist = showResist ? chip('resist', u.resist) : '';
        const nulls = showNull ? chip('null', u.null) : '';
        if (!weak && !resist && !nulls) return '';
        return `<div class="aff-row">${weak}${resist}${nulls}</div>`;
    },

    /** Attack specialty badges (what they hit with). */
    specialtyChipsHtml(u, limit = 2) {
        if (!u || typeof BattleData === 'undefined' || !BattleData.specialtyTypes) return '';
        const types = BattleData.specialtyTypes(u, limit);
        if (!types.length) return '';
        return `<div class="spec-row" title="Especialidad de ataque">${types.map((t) =>
            `<i class="spec-chip type-${t}" data-type="${t}" title="Ataca con ${BattleData.typeLabel(t)}">${BattleData.typeShort(t)}</i>`
        ).join('')}</div>`;
    },

    /** Compact type kit for party select cards. */
    partyTypeKitHtml(u) {
        if (!u) return '';
        const spec = this.specialtyChipsHtml(u, 2);
        const aff = this.affinityChipsHtml(u, { showResist: true, showNull: true });
        if (!spec && !aff) return '';
        return `<div class="psel-typekit">${spec}${aff}</div>`;
    },

    /** Higher-res bust for party-select cards (falls back to battle sprite). */
    portraitUrl(id) {
        const v = 'v66';
        return `assets/sprites/portraits/${id}.png?${v}`;
    },

    /** Party-select cards: live _staged art first, else portrait, else anim idle. */
    partyArtUrl(id) {
        const staged = typeof StagedSprites !== 'undefined'
            ? (StagedSprites.normalUrl ? StagedSprites.normalUrl(id) : StagedSprites.url(id, 'idle'))
            : null;
        return staged || this.portraitUrl(id) || this.animSpriteUrl(id, 'idle');
    },

    partyArtBg(id) {
        return `url('${this.partyArtUrl(id)}')`;
    },

    starsHtml(count, { dual = false, dualLabel = '4★/5★' } = {}) {
        if (dual) return `<span class="psel-rarity is-dual" aria-label="${dualLabel}">${dualLabel}</span>`;
        const n = Math.min(7, Math.max(1, count | 0));
        const icons = Array.from({ length: n }, () => '<i class="psel-star" aria-hidden="true">★</i>').join('');
        return `<span class="psel-rarity" aria-label="${n} estrellas">${icons}</span>`;
    },

    formKind(unit) {
        if (unit?.transformed) {
            const stages = unit.transformStages || 1;
            const stage = unit.transformStage || 1;
            // Stage 1 uses *_transform.png; stage 2+ uses *_transform_2.png etc.
            if (stages <= 1 || stage <= 1) return 'transform';
            return `transform_${stage}`;
        }
        // Sasori Hiruko → Kazekage reveal after first hit
        if (unit?.armorBroken || unit?.revealed) return 'reveal';
        return 'idle';
    },

    fighterName(unit) {
        if (unit?.transformed) {
            if (unit.transformStages > 1) {
                const stage = unit.transformStage || 1;
                const named = (unit.transformStageNames || [])[stage - 1];
                if (named) return named;
                const tails = stage;
                return `${unit.transformName || unit.name} · ${tails} ${tails === 1 ? 'Cola' : 'Colas'}`;
            }
            const tn = unit.transformName || unit.name || '';
            return tn;
        }
        if (unit?.armorBroken || unit?.revealed) {
            return unit.armorBreakName || `${unit.name} · Revelado`;
        }
        return unit?.name || '';
    },

    frameUrl(id, i) {
        return `assets/sprites/anim/${id}_idle_${i}.png?v57`;
    },

    open(runKey) {
        GameManager.cleanupHUD();
        document.getElementById('scene-container').classList.add('hidden');
        const container = document.getElementById('game-container');
        container.classList.remove('hidden');
        container.classList.add('persona-mode');
        container.innerHTML = '';

        const saved = GameState.get('battleParty');
        if (typeof GachaRoster !== 'undefined') GachaRoster.ensureOwnedState();
        const owned = (typeof GachaRoster !== 'undefined')
            ? GachaRoster.ownedTemplates().map(t => t.id)
            : BattleData.party.map(p => p.id);
        const partyIds = (saved && saved.length)
            ? saved.filter(id => owned.includes(id))
            : ['luffy', 'naruto', 'jotaro'].filter(id => owned.includes(id));
        this.showPartySelect(container, runKey, partyIds);
    },

    async showPartySelect(container, runKey, defaultIds) {
        if (typeof StagedSprites !== 'undefined') {
            try { await StagedSprites.init(); } catch (_) { /* keep anim fallbacks */ }
        }
        const enc = BattleData.encounters[runKey];
        const minParty = enc?.minParty || 3;
        const maxParty = enc?.maxParty || 3;
        const isTraining = !!enc?.training;
        if (typeof GachaRoster !== 'undefined') GachaRoster.ensureOwnedState();
        const playable = (typeof GachaRoster !== 'undefined')
            ? GachaRoster.ownedTemplates()
            : BattleData.party.slice();
        const selected = new Set(defaultIds.filter(id => playable.some(p => p.id === id)));
        while (selected.size < Math.min(minParty, playable.length)) {
            const n = playable.find(p => !selected.has(p.id));
            if (!n) break;
            selected.add(n.id);
        }
        while (selected.size > maxParty) {
            selected.delete([...selected].pop());
        }
        const series = (typeof GachaRoster !== 'undefined')
            ? GachaRoster.seriesList()
            : ['One Piece', 'Naruto', 'JoJo', 'Bleach'];
        let activeSeries = series.find(s => playable.some(p => p.series === s && selected.has(p.id)))
            || series.find(s => playable.some(p => p.series === s))
            || series[0];
        let typeFilter = ''; // '' = all; otherwise BattleData type id

        const charById = (id) => playable.find(p => p.id === id) || (typeof GachaRoster !== 'undefined' ? GachaRoster.getTemplate(id) : null);

        const render = () => {
            const rosterAll = playable.filter(p => p.series === activeSeries);
            const roster = typeFilter
                ? rosterAll.filter(p => BattleData.dealsType(p, typeFilter))
                : rosterAll;
            const slots = [...selected].map(charById).filter(Boolean);
            while (slots.length < maxParty) slots.push(null);
            const prog = (typeof GachaRoster !== 'undefined') ? GachaRoster.collectionProgress() : null;
            const typeFilters = BattleData.TYPE_FILTERS || [];

            const ordLabel = (i) => (i === 0 ? 'LÍDER' : `${i + 1}º`);
            container.innerHTML = `
                <div class="psel psel-p5x">
                    <div class="psel-bg" aria-hidden="true"></div>
                    <header class="psel-head">
                        <div class="psel-kicker"><span>${isTraining ? 'MODO ENTRENO' : 'PHANTOM DESTINY'}</span></div>
                        <h1 class="psel-title">${enc.title}</h1>
                        <div class="psel-meta">
                            <span class="psel-diff">${isTraining ? 'PRÁCTICA' : `DIF ${enc.difficulty || 1}/9`}</span>
                            <em>${enc.hint || 'Elige tu escuadrón'}${prog ? ` · ${prog.have}/${prog.total}` : ''}</em>
                        </div>
                    </header>

                    <div class="psel-body">
                        <aside class="psel-squad">
                            <div class="psel-squad-label"><span>TU EQUIPO</span><b>${selected.size}/${maxParty}</b></div>
                            <div class="psel-slots">
                                ${slots.map((p, i) => p ? `
                                    <button class="psel-slot filled${i === 0 ? ' is-leader' : ''}" data-remove="${p.id}" type="button" style="--i:${i}">
                                        <span class="psel-slot-ord">${ordLabel(i)}</span>
                                        <div class="psel-slot-art" style="background-image:${this.partyArtBg(p.id)}"></div>
                                        <div class="psel-slot-meta">
                                            <strong>${p.name}</strong>
                                            <em>${p.role || 'DPS'}${p.transform ? ' ★' : ''}</em>
                                            ${this.specialtyChipsHtml(p, 2)}
                                            ${(() => {
                                                const primary = (typeof GachaRoster !== 'undefined' && GachaRoster.primaryStars)
                                                    ? GachaRoster.primaryStars(p.id) : 3;
                                                const n = Math.min(7, Math.max(3, primary));
                                                return this.starsHtml(n);
                                            })()}
                                        </div>
                                        <span class="psel-slot-x">×</span>
                                    </button>
                                ` : `
                                    <div class="psel-slot empty" style="--i:${i}">
                                        <span class="psel-slot-ord">${ordLabel(i)}</span>
                                        <b>${i + 1}</b>
                                        <span>Vacío</span>
                                    </div>
                                `).join('')}
                            </div>
                        </aside>

                        <div class="psel-divider" aria-hidden="true"></div>

                        <section class="psel-roster">
                            <nav class="psel-tabs" role="tablist">
                                ${series.map(s => {
                                    const n = playable.filter(p => p.series === s).length;
                                    return `
                                    <button class="psel-tab ${s === activeSeries ? 'on' : ''}" data-series="${s}" type="button" role="tab" ${n ? '' : 'disabled'}>
                                        <span>${s}${n ? ` (${n})` : ''}</span>
                                    </button>`;
                                }).join('')}
                            </nav>
                            <div class="psel-typebar" role="toolbar" aria-label="Filtrar por tipo de ataque">
                                <button type="button" class="psel-typepill ${!typeFilter ? 'on' : ''}" data-type="">TODOS</button>
                                ${typeFilters.map(t => {
                                    const n = rosterAll.filter(p => BattleData.dealsType(p, t)).length;
                                    return `<button type="button" class="psel-typepill type-${t} ${typeFilter === t ? 'on' : ''}" data-type="${t}" title="${BattleData.typeLabel(t)} · ${n} en esta serie" ${n ? '' : 'disabled'}>${BattleData.typeShort(t)}<em>${n}</em></button>`;
                                }).join('')}
                            </div>
                            <p class="psel-typelegend"><b>ESP</b> ataca con · <i class="aff-chip weak">DÉB</i> débil · <i class="aff-chip resist">RES</i> resiste · <i class="aff-chip null">NUL</i> anula</p>
                            <div class="psel-grid">
                                ${roster.length ? roster.map((p, i) => {
                                    const rarity = (typeof GachaRoster !== 'undefined' && GachaRoster.rarityFor)
                                        ? GachaRoster.rarityFor(p.id)
                                        : 'common';
                                    const primary = (typeof GachaRoster !== 'undefined' && GachaRoster.primaryStars)
                                        ? GachaRoster.primaryStars(p.id)
                                        : 3;
                                    const stars = Math.min(7, Math.max(3, primary));
                                    const c = (typeof CharProgress !== 'undefined') ? CharProgress.constellation(p.id) : 0;
                                    const maxC = (typeof CharProgress !== 'undefined') ? CharProgress.maxConstFor(p.id) : (stars >= 5 ? 3 : 6);
                                    const dupePct = maxC > 0 ? Math.round((c / maxC) * 100) : 0;
                                    const specs = (BattleData.specialtyTypes(p, 2) || []).join(',');
                                    return `
                                    <button class="psel-chip rarity-${rarity} ${selected.has(p.id) ? 'selected' : ''}" data-id="${p.id}" type="button" title="${p.name}${specs ? ' · ' + specs : ''}" style="--i:${i}">
                                        <div class="psel-chip-frame">
                                            <div class="psel-chip-art" style="background-image:${this.partyArtBg(p.id)}"></div>
                                            ${this.starsHtml(stars)}
                                            <span class="psel-const" aria-label="Constelación C${c} de ${maxC}"><strong>C${c}</strong><small>/${maxC}</small></span>
                                            <span class="psel-dupe-meter" aria-hidden="true"><i style="width:${dupePct}%"></i></span>
                                            <div class="psel-chip-info">
                                                <strong>${p.name}</strong>
                                                <span class="party-role role-${(p.role || '').toLowerCase()}">${p.role}${p.transform ? ' ★' : ''}${p.fromEnemy ? ' · EX' : ''}</span>
                                                ${p.roleTag ? `<span class="party-tagline">${p.roleTag}</span>` : ''}
                                                ${this.partyTypeKitHtml(p)}
                                            </div>
                                            ${selected.has(p.id) ? '<span class="psel-picked" aria-hidden="true">LISTO</span><i class="psel-check" aria-hidden="true">✓</i>' : ''}
                                        </div>
                                    </button>`;
                                }).join('') : `<p class="psel-tip">${typeFilter ? `Nadie de ${activeSeries} ataca con ${BattleData.typeLabel(typeFilter)}. Prueba otro filtro.` : 'Aún no tienes personajes de esta serie. Invócalos en el Convenio.'}</p>`}
                            </div>
                            ${playable.length < minParty ? `
                                <div class="psel-need-roster">
                                    <p>Necesitas al menos <strong>${minParty}</strong> personajes. Tienes <strong>${playable.length}</strong>.</p>
                                    <button type="button" class="psel-go psel-gacha-cta" id="btn-party-gacha">IR AL CONVENIO</button>
                                </div>
                            ` : ''}
                        </section>

                        <div class="psel-actions">
                            <button class="psel-back" id="btn-cancel-battle" type="button"><span>VOLVER</span></button>
                            <button class="psel-go" id="btn-start-battle" type="button"><span>ENTRAR EN COMBATE</span></button>
                        </div>
                    </div>
                </div>
            `;

            const syncBtn = () => {
                const btn = container.querySelector('#btn-start-battle');
                const label = btn.querySelector('span') || btn;
                const ok = selected.size >= minParty && selected.size <= maxParty;
                btn.disabled = !ok;
                if (ok) label.textContent = isTraining ? 'EMPEZAR ENTRENO' : 'ENTRAR EN COMBATE';
                else if (selected.size < minParty) label.textContent = `ELIGE ${minParty - selected.size} MÁS`;
                else label.textContent = `MÁX ${maxParty}`;
            };

            container.querySelectorAll('.psel-tab').forEach(tab => {
                tab.onclick = () => {
                    AudioManager.ui.click();
                    activeSeries = tab.dataset.series;
                    typeFilter = '';
                    render();
                };
            });
            container.querySelectorAll('.psel-typepill').forEach(pill => {
                pill.onclick = () => {
                    if (pill.disabled) return;
                    AudioManager.ui.click();
                    typeFilter = pill.dataset.type || '';
                    render();
                };
            });
            container.querySelectorAll('.psel-chip').forEach(card => {
                card.onclick = () => {
                    AudioManager.ui.click();
                    const id = card.dataset.id;
                    if (selected.has(id)) selected.delete(id);
                    else if (selected.size < maxParty) selected.add(id);
                    render();
                };
            });
            container.querySelectorAll('[data-remove]').forEach(btn => {
                btn.onclick = () => {
                    AudioManager.ui.click();
                    selected.delete(btn.dataset.remove);
                    render();
                };
            });
            container.querySelector('#btn-cancel-battle').onclick = () => {
                document.getElementById('game-container').classList.remove('persona-mode');
                GameManager.endHunt();
                SceneManager.goTo('arena');
            };
            container.querySelector('#btn-party-gacha')?.addEventListener('click', () => {
                document.getElementById('game-container').classList.remove('persona-mode');
                GameManager.endHunt();
                GameState.set('storyComplete', true);
                SceneManager.goTo('gacha');
            });
            container.querySelector('#btn-start-battle').onclick = () => {
                if (selected.size < minParty || selected.size > maxParty) return;
                GameState.set('battleParty', [...selected]);
                this.startBattle(runKey, [...selected]);
            };
            syncBtn();
        };

        AudioManager.setTheme('bleach');
        setTimeout(() => {
            if (AudioManager.enabled && AudioManager.currentTheme === 'bleach') {
                AudioManager.setTheme('bleach');
            }
        }, 300);
        render();
        setTimeout(() => {
            try { TutorialSpotlight?.onScene('party'); } catch (_) { /* ignore */ }
        }, 350);
    },

    async startBattle(runKey, partyIds) {
        if (typeof StagedSprites !== 'undefined' && typeof StagedSprites.init === 'function') {
            try { await StagedSprites.init(); } catch (_) { /* anim fallbacks remain available */ }
        }
        this.renderedForms = {};
        this.state = BattleEngine.createState(runKey, partyIds);
        if (typeof BattleRig !== 'undefined') {
            [...this.state.party, ...this.state.enemies].forEach(unit => {
                BattleRig.preloadFighter(unit.id, (id, kind) => this.spriteBg(id, kind));
            });
        }
        BattleEngine.startRound(this.state);
        Achievements.show('first_battle');
        if (partyIds.length >= 3) Achievements.show('triple_threat');
        if (!this.state.partyHasSupport) Achievements.show('no_support');
        this.mode = 'command';
        this.setActionPhase('PLAYER_SELECTING');
        this.pendingOneMore = false;
        this.allOutReady = false;
        this.chainCount = 0;
        const bgm = BattleData.musicFor(runKey);
        AudioManager.setTheme(bgm);
        setTimeout(() => {
            if (AudioManager.enabled) AudioManager.setTheme(bgm);
        }, 400);
        this.mount();
        // Personality cold open
        try {
            const lines = (typeof BattleFlavor !== 'undefined')
                ? BattleFlavor.battleOpenLines(this.state)
                : [];
            lines.forEach((line) => {
                if (this.state?.log) this.state.log.push(line);
            });
            const lead = this.state?.party?.find((p) => p.hp > 0);
            if (lead && typeof BattleFlavor !== 'undefined') {
                this.showCry(BattleFlavor.taglineOf(lead.id, lead), { family: '', fxType: 'support' });
            }
        } catch (_) { /* ignore */ }
        setTimeout(() => {
            try { TutorialSpotlight?.onScene('battle'); } catch (_) { /* ignore */ }
        }, 500);
        this.resetCameraPose(1);
        this.render();
        this.startSpriteLoops();
        this.continueFlow();
    },

    mount() {
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="p5-root hud-p5 hud-storm" id="battle-root">
                <div class="p5-stage p5-stage-ink">
                    <div class="p5-stage-bg" id="p5-stage-bg" aria-hidden="true"></div>
                    <div class="p5-cam-vignette" id="p5-cam-vignette" aria-hidden="true"></div>
                    <div class="p5-action-banner" id="p5-action-banner" aria-live="polite"></div>
                    <div class="p5-onemore" id="p5-onemore">¡OTRO TURNO!</div>
                    <div class="p5-round-card" id="p5-round-card" aria-live="polite"></div>
                    <div class="p5-cry" id="battle-cry"></div>
                    <div class="p5ui-chain" id="p5-chain" hidden></div>
                    <div class="p5ui-dmg-total" id="p5-dmg-total" hidden></div>
                    <div class="p5-fx" id="battle-fx"></div>
                    <div class="p5-enemies" id="battle-enemies"></div>
                    <div class="p5-allies-field" id="battle-allies"></div>

                    <aside class="p5-party-strip" id="p5-party-strip"></aside>

                    <aside class="p5ui-tr">
                        <div class="p5ui-mission" id="battle-title"></div>
                        <div class="p5ui-enemybars" id="p5-enemy-hud"></div>
                        <button class="p5ui-flee" id="btn-flee-battle" type="button"><span>SALIR</span></button>
                    </aside>

                    <div class="p5ui-bl">
                        <div class="p5ui-actor" id="p5-actor-hud"></div>
                    </div>

                    <nav class="p5ui-cmds" id="battle-command"></nav>
                    <div class="p5ui-bc" id="p5-skill-rail"></div>

                    <aside class="p5ui-tl p5ui-turn-dock">
                        <div class="p5ui-turn-banner" id="p5-turn-banner"><span>Turno del jugador</span></div>
                        <div class="p5ui-turnorder" id="p5-turnorder"></div>
                        <p class="p5ui-quote">El destino no se entrega. Se conquista.</p>
                    </aside>

                    <aside class="p5ui-br">
                        <div class="p5ui-desc" id="p5-desc"></div>
                        <div class="p5ui-log" id="battle-log"></div>
                    </aside>
                </div>
            </div>
        `;
        this.root = container.querySelector('#battle-root');
        this.root.querySelector('#btn-flee-battle').onclick = async () => {
            const choice = await this.confirmDialog({
                kicker: 'RETIRADA',
                title: '¿ABANDONAR?',
                body: 'Puedes rehacer el equipo o retirarte (cuenta como derrota).',
                confirmLabel: 'RETIRARSE',
                altLabel: 'CAMBIAR EQUIPO',
                cancelLabel: 'SEGUIR LUCHANDO',
                danger: true
            });
            if (choice === false || choice == null) return;
            if (choice === 'alt') {
                this.goToPartySelect();
                return;
            }
            GameManager.currentMissionId = null;
            GameState.set('pendingMission', null);
            this.state.finished = true;
            this.state.victory = false;
            this.showResult(false);
        };
    },

    /**
     * In-game confirm modal (Persona/Storm panel) — never use window.confirm.
     * @returns {Promise<boolean|'alt'>} true = confirm, false = cancel, 'alt' = optional third action
     */
    confirmDialog({
        kicker = 'CONFIRMAR',
        title = '¿Continuar?',
        body = '',
        confirmLabel = 'ACEPTAR',
        cancelLabel = 'CANCELAR',
        altLabel = '',
        danger = false
    } = {}) {
        return new Promise((resolve) => {
            const host = document.body;
            host.querySelectorAll('.battle-confirm').forEach((el) => el.remove());

            const altBtn = altLabel
                ? `<button type="button" class="btn-secondary" data-alt>${altLabel}</button>`
                : '';
            const overlay = document.createElement('div');
            overlay.className = `battle-confirm active${danger ? ' is-danger' : ''}`;
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');
            overlay.setAttribute('aria-label', title);
            overlay.innerHTML = `
                <div class="battle-confirm-panel br-panel">
                    <p class="battle-kicker">${kicker}</p>
                    <h2 class="title-main br-title">${title}</h2>
                    <p class="text-body battle-confirm-body">${body}</p>
                    <div class="br-actions battle-confirm-actions">
                        <button type="button" class="btn-destiny" data-confirm>${confirmLabel}</button>
                        ${altBtn}
                        <button type="button" class="btn-secondary" data-cancel>${cancelLabel}</button>
                    </div>
                </div>
            `;
            host.appendChild(overlay);

            let settled = false;
            const finish = (value) => {
                if (settled) return;
                settled = true;
                document.removeEventListener('keydown', onKey);
                overlay.classList.remove('active');
                overlay.classList.add('is-out');
                const drop = () => {
                    overlay.remove();
                    resolve(value);
                };
                overlay.addEventListener('animationend', drop, { once: true });
                setTimeout(drop, 280);
            };
            const onKey = (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    finish(false);
                }
            };

            overlay.querySelector('[data-confirm]').onclick = () => finish(true);
            overlay.querySelector('[data-cancel]').onclick = () => finish(false);
            overlay.querySelector('[data-alt]')?.addEventListener('click', () => finish('alt'));
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) finish(false);
            });
            document.addEventListener('keydown', onKey);
            requestAnimationFrame(() => overlay.querySelector('[data-cancel]')?.focus());
        });
    },

    /** Leave mid-battle / defeat and reopen party select for the same encounter. */
    goToPartySelect() {
        const runKey = this.state?.runKey;
        if (!runKey) return;
        const partyIds = (this.state?.party || []).map((p) => p.id).filter(Boolean);
        try {
            Object.values(this.spriteTimers || {}).forEach(clearInterval);
        } catch (_) { /* ignore */ }
        this.spriteTimers = {};
        if (this._atkFrameTimer) {
            clearInterval(this._atkFrameTimer);
            this._atkFrameTimer = null;
        }
        document.querySelectorAll('.game-result, .battle-confirm, .boss-victory-overlay').forEach((el) => el.remove());
        // Keep mission context so a remade team still counts for the same quest
        const container = document.getElementById('game-container');
        container.classList.remove('hidden');
        container.classList.add('persona-mode');
        this.root = null;
        this.state = null;
        this.showPartySelect(container, runKey, partyIds);
    },

    setCameraPose({ x = 0, y = 0, scale = 1, darken = 0, ms = 240 } = {}) {
        const stage = this.root?.querySelector('.p5-stage');
        if (!stage) return;
        stage.style.setProperty('--cam-x', `${x}px`);
        stage.style.setProperty('--cam-y', `${y}px`);
        stage.style.setProperty('--cam-scale', String(scale));
        stage.style.setProperty('--cam-dur', `${ms}ms`);
        stage.style.setProperty('--cam-darken', String(darken));
    },

    resetCameraPose(ms = 260) {
        this.setCameraPose({ x: 0, y: 0, scale: 1, darken: 0, ms });
    },

    focusCamera(actor, profile, moment = 'attack') {
        if (!actor) return;
        const enemySide = actor.side === 'enemy';
        const power = Math.max(0, profile?.shake || 0);
        const family = profile?.family || 'melee';
        const finisher = family === 'finisher';
        const casting = moment === 'cast';
        const impact = moment === 'impact';
        const soft = family === 'heal' || family === 'support';
        const hex = family === 'hex';
        const barrage = family === 'barrage';
        const projectile = !!profile?.projectile;
        let x = enemySide ? (impact ? 22 : 12) : (impact ? -22 : -12);
        let y = impact ? -8 : (casting ? -5 : 0);
        let scale = finisher ? (impact ? 1.075 : 1.05) : (impact ? 1.045 : 1.02 + Math.min(0.02, power / 800));
        let darken = finisher ? (impact ? 0.34 : 0.22) : (casting ? 0.12 : 0.08);
        if (soft) {
            x *= 0.45;
            y = casting ? -10 : -4;
            scale = impact ? 1.03 : 1.015;
            darken = casting ? 0.06 : 0.04;
        } else if (hex) {
            darken += impact ? 0.12 : 0.08;
            scale += 0.01;
        } else if (barrage && impact) {
            scale += 0.025;
            darken += 0.06;
            x *= 1.15;
        } else if (projectile && casting) {
            y -= 4;
            scale += 0.015;
            darken += 0.04;
        } else if ((family === 'lightning' || family === 'inferno') && impact) {
            scale += 0.02;
            darken += 0.05;
        }
        this.setCameraPose({
            x, y, scale, darken,
            ms: impact ? (barrage ? 90 : 120) : (casting ? 220 : 200)
        });
    },

    fighterHtml(u, isEnemy) {
        const transformed = !!u.transformed;
        const formShifted = transformed || !!u.armorBroken || !!u.revealed;
        const bg = this.spriteBg(u.id, this.formKind(u));
        const facesLeft = this.facesLeftNative(u.id, this.formKind(u));
        const orientation = isEnemy
            ? (facesLeft ? 'face-native' : 'face-flip')
            : (facesLeft ? 'face-flip' : 'face-native');
        const aura = this.auraClass(u);
        const hpPct = Math.max(0, u.hp / Math.max(1, u.maxHp) * 100);
        const weak = (u.weak || []).map(type => BattleData.typeLabel(type)).join(' · ') || '—';
        const resist = (u.resist || []).map(type => BattleData.typeLabel(type)).join(' · ') || '—';
        const nulls = (u.null || []).map(type => BattleData.typeLabel(type)).join(' · ');
        const useSkel = false; // SkelForm paused — full-body attack sprites instead
        const sprite = useSkel
            ? SkelBattleBridge.markup(u.id)
            : (typeof BattleRig !== 'undefined'
                ? BattleRig.markup(u.id, bg, this.formKind(u))
                : `<div class="p5-sprite" data-sprite="${u.id}" style="background-image:${bg}"></div>`);
        return `
            <div class="p5-fighter ${isEnemy ? 'enemy' : 'ally'} ${orientation} ${u.hp <= 0 ? 'dead' : ''} ${u.down ? 'down' : ''} ${formShifted ? 'form-shifted' : ''} ${transformed ? 'transformed' : ''} ${aura}" data-id="${u.id}" data-side="${isEnemy ? 'enemy' : 'ally'}">
                <div class="p5-aura" aria-hidden="true"></div>
                ${sprite}
                <div class="p5-status-row">${this.statusBadgesHtml(u, { compact: true, limit: 4 })}</div>
                ${isEnemy ? `<div class="p5-hpmini" title="HP ${Math.max(0, u.hp)}/${u.maxHp}"><i style="width:${hpPct}%"></i></div>` : ''}
                    <div class="p5-nameplate"><span>${this.fighterName(u)}${u.down ? ' CAÍDO' : ''}${u.cover ? ' 🛡' : ''}${transformed ? ' ★' : ''}</span></div>
                <div class="p5-affinity-stack">
                    <div class="p5-aff weak"><b>DÉBIL</b><span>${weak}</span></div>
                    ${isEnemy ? `<div class="p5-aff strong"><b>FUERTE</b><span>${resist}</span></div>` : ''}
                    ${isEnemy && nulls ? `<div class="p5-aff null"><b>ANULA</b><span>${nulls}</span></div>` : ''}
                </div>
            </div>
        `;
    },

    auraClass(u) {
        const b = u.buffs || {};
        const buffed = (b.atk > 1) || (b.def > 1) || (b.agi > 1) || (b.luk > 1) || (b.damage > 1) || (b.damageBonus > 0) || (b.critChance > 0) || (b.critDamage > 0) || (b.damageTaken && b.damageTaken < 1) || u.charged || u.cover;
        const debuffed = (b.atk && b.atk < 1) || (b.def && b.def < 1) || (b.agi && b.agi < 1) || (b.luk && b.luk < 1) || (b.damage && b.damage < 1) || (b.damageTaken && b.damageTaken > 1);
        if (u.transformed) return 'aura-transform';
        if (buffed && debuffed) return 'aura-mixed';
        if (buffed) return 'aura-buff';
        if (debuffed) return 'aura-debuff';
        return '';
    },

    statusShort(u) {
        const badges = this.statusList(u);
        return badges.length ? ' · ' + badges.map(b => b.label).join(' ') : '';
    },

    statusList(u) {
        const out = [];
        const b = u.buffs || {};
        const priority = {
            down: 100, xform: 90, guard: 80, cover: 75, charge: 70,
            atk: 40, def: 38, agi: 36, luk: 34, damage: 33, damageBonus: 32, critChance: 31, critDamage: 30, damageTaken: 29
        };
        const add = (key, label, icon, kind) => {
            if (b[key] == null) return;
            const turns = b[key + '_turns'];
            const up = b[key] > 1;
            const down = b[key] < 1;
            if (!up && !down) return;
            const resolvedKind = kind || (up ? 'buff' : 'debuff');
            out.push({
                key,
                icon,
                label: `${icon} ${label}${up ? '↑' : '↓'}${turns != null ? turns : ''}`,
                short: `${icon}${up ? '↑' : '↓'}${turns != null ? turns : ''}`,
                kind: resolvedKind,
                priority: priority[key] || 20,
                title: `${label} ×${Number(b[key]).toFixed(2)}${turns != null ? ` · ${turns} turno${turns === 1 ? '' : 's'}` : ''}`
            });
        };
        const addBonus = (key, label, icon) => {
            if (b[key] == null || Number(b[key]) <= 0) return;
            const turns = b[key + '_turns'];
            const amount = Math.round(Number(b[key]) * 100);
            out.push({
                key, icon,
                label: `${icon} ${label}↑${amount}%${turns != null ? turns : ''}`,
                short: `${icon}↑${amount}%`,
                kind: 'buff',
                priority: priority[key] || 20,
                title: `${label} +${amount}%${turns != null ? ` · ${turns} turno${turns === 1 ? '' : 's'}` : ''}`
            });
        };
        add('atk', 'ATK', '⚔');
        add('def', 'DEF', '🛡');
        add('agi', 'AGI', '💨');
        add('luk', 'LUK', '✦');
        add('damage', 'DAÑO', '◆');
        addBonus('damageBonus', 'POT', '✹');
        addBonus('critChance', 'PROB CRIT', '⚡');
        addBonus('critDamage', 'DAÑO CRIT', '✦');
        add('damageTaken', 'DAÑO RECIB.', '☠');
        if (u.charged) {
            out.push({
                key: 'charge', icon: '⚡', label: '⚡ CARGA', short: '⚡',
                kind: 'key buff', priority: priority.charge,
                title: 'Siguiente skill potenciada'
            });
        }
        if (u.cover) {
            out.push({
                key: 'cover', icon: '🛡', label: '🛡 COBERTURA', short: '🛡',
                kind: 'key buff', priority: priority.cover,
                title: 'Protege al equipo del próximo golpe'
            });
        }
        if (u.transformed) {
            out.push({
                key: 'xform', icon: '★', label: '★ FORMA', short: '★',
                kind: 'xform', priority: priority.xform,
                title: u.transformName ? `Transformado · ${u.transformName}` : 'Transformado'
            });
        }
        if (u.guard) {
            out.push({
                key: 'guard', icon: '▣', label: '▣ DEFENSA', short: '▣',
                kind: 'key buff', priority: priority.guard,
                title: 'Defendiendo · menos daño este turno'
            });
        }
        if (u.down) {
            out.push({
                key: 'down', icon: '⬇', label: '⬇ CAÍDO', short: '⬇',
                kind: 'key debuff', priority: priority.down,
                title: 'Derribado · pierde el próximo turno'
            });
        }
        if (u.stunTurns > 0) {
            out.push({
                key: 'stun', icon: '💫', label: `💫 ATURD${u.stunTurns}`, short: `💫${u.stunTurns}`,
                kind: 'key debuff', priority: 95,
                title: `Aturdido · ${u.stunTurns} turno${u.stunTurns === 1 ? '' : 's'}`
            });
        }
        (u.dots || []).forEach((dot) => {
            const label = (dot.type || 'DOT').toUpperCase();
            const icon = /fire|burn/i.test(label) ? '🔥'
                : /elec|shock|thunder/i.test(label) ? '⚡'
                : /ice|frost/i.test(label) ? '❄'
                : /poison|curse/i.test(label) ? '☠'
                : '●';
            out.push({
                key: `dot-${dot.type || 'x'}`,
                icon,
                label: `${icon} ${label}${dot.turns != null ? dot.turns : ''}`,
                short: `${icon}${dot.turns != null ? dot.turns : ''}`,
                kind: 'key debuff',
                priority: 60,
                title: `${label} · daño por turno${dot.turns != null ? ` · ${dot.turns} restantes` : ''}`
            });
        });
        out.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        return out;
    },

    statusBadgesHtml(u, opts = {}) {
        const list = this.statusList(u);
        if (!list.length) return '';
        const compact = !!opts.compact;
        const limit = opts.limit || (compact ? 4 : 8);
        const shown = list.slice(0, limit);
        const extra = list.length - shown.length;
        const bits = shown.map((s) => {
            const kindClass = String(s.kind || '').split(/\s+/).filter(Boolean).join(' ');
            return `<span class="p5-badge ${kindClass}" data-key="${s.key}" title="${s.title}">${compact ? (s.short || s.label) : s.label}</span>`;
        });
        if (extra > 0) {
            bits.push(`<span class="p5-badge more" title="+${extra} efectos">+${extra}</span>`);
        }
        return bits.join('');
    },

    render() {
        if (!this.state || !this.root) return;
        const s = this.state;
        if (s.enemies.some(unit => unit.transformed)) Achievements.show('first_transform');
        const actor = BattleEngine.currentActor(s);
        const titleEl = this.root.querySelector('#battle-title');
        if (titleEl) titleEl.textContent = s.encounter.title;

        const roundCard = this.root.querySelector('#p5-round-card');
        if (roundCard) {
            roundCard.innerHTML = `<span>RONDA</span><strong>${s.turnCount || 1}</strong>`;
        }

        const stageEl = this.root.querySelector('#p5-stage-bg');
        if (stageEl) {
            const theme = BattleData.stageFor(s.runKey || s.encounterId || GameManager.currentMissionId);
            stageEl.className = `p5-stage-bg stage-${theme || 'arena'}`;
        }

        this.root.querySelector('#battle-enemies').innerHTML = s.enemies.map(e => this.fighterHtml(e, true)).join('');
        this.root.querySelector('#battle-allies').innerHTML = s.party.map(p => this.fighterHtml(p, false)).join('');
        // SkelForm disabled — full-body sprites + mid-screen cut-ins
        if (typeof BattleRig !== 'undefined') {
            BattleRig.mountAll(this.root);
            [...s.party, ...s.enemies].forEach(unit => {
                const currentForm = this.formKind(unit);
                const unitKey = `${unit.side}:${unit.id}`;
                const previousForm = this.renderedForms[unitKey];
                const rig = this.fighterEl(unit.id, unit.side)?.querySelector('.p5-rig');
                // Only play stage-up morph when advancing multi-stage forms (e.g. Naruto tails).
                // Idle→transform (JoJo stands) must NOT flash base form first — that desyncs the stand.
                const isStageAdvance = previousForm
                    && previousForm !== currentForm
                    && previousForm.startsWith('transform')
                    && currentForm.startsWith('transform');
                if (rig && isStageAdvance
                    && BattleRig.hasRig(unit.id, BattleRig.normalizeForm(previousForm))
                    && BattleRig.hasRig(unit.id, BattleRig.normalizeForm(currentForm))) {
                    BattleRig.setForm(rig, previousForm)
                        .then(() => BattleRig.playStageUp(rig, currentForm));
                } else if (rig && previousForm !== currentForm && currentForm === 'transform') {
                    BattleRig.setForm(rig, currentForm);
                }
                this.renderedForms[unitKey] = currentForm;
            });
        }

        if (actor) {
            this.fighterEl(actor.id, actor.side)?.classList.add('active');
        }

        const banner = this.root.querySelector('#p5-turn-banner');
        if (banner) {
            const allyTurn = actor && actor.side === 'ally' && this.mode !== 'enemy' && !this.state.finished;
            banner.innerHTML = `<span>${this.phaseLabel(actor)}</span>`;
            banner.classList.toggle('enemy', !allyTurn);
        }

        const orderEl = this.root.querySelector('#p5-turnorder');
        if (orderEl) {
            const queue = s.turnQueue || [];
            const resolved = queue.map(slot => this.state && BattleEngine.findUnit(s, slot.id, slot.side)).filter(u => u && u.hp > 0);
            const list = resolved.length ? resolved : [...s.party, ...s.enemies].filter(u => u.hp > 0);
            orderEl.innerHTML = list.slice(0, 6).map((u, i) => {
                const tag = actor && actor.id === u.id ? 'NOW' : (i === 0 ? '1' : String(i + 1));
                return `
                <div class="p5ui-to ${actor && actor.id === u.id ? 'now' : ''} ${i === 1 ? 'next' : ''} ${u.side === 'enemy' ? 'foe' : ''}" title="${u.name}">
                    <div class="p5ui-to-face" style="background-image:${this.spriteBg(u.id, this.formKind(u))}"></div>
                    <b class="p5ui-to-tag">${tag}</b>
                </div>`;
            }).join('');
        }

        const enemyHud = this.root.querySelector('#p5-enemy-hud');
        if (enemyHud) {
            enemyHud.innerHTML = s.enemies.map(e => {
                const pct = Math.max(0, e.hp / Math.max(1, e.maxHp) * 100);
                const badges = this.statusBadgesHtml(e, { compact: true, limit: 3 });
                const aff = this.affinityChipsHtml(e);
                return `
                    <div class="p5ui-ebar ${e.hp <= 0 ? 'dead' : ''}" data-unit="${e.id}">
                        <div class="p5ui-ebar-kanji" aria-hidden="true">敵</div>
                        <div class="p5ui-ebar-body">
                            <strong>${e.name}</strong>
                            <div class="p5ui-ebar-track"><i data-unit-hp="${e.id}" style="width:${pct}%"></i></div>
                            <span data-unit-hp-text="${e.id}">HP ${Math.max(0, e.hp)} / ${e.maxHp}</span>
                            ${aff}
                            ${badges ? `<div class="p5-status-row compact">${badges}</div>` : ''}
                        </div>
                        <div class="p5ui-ebar-face" style="background-image:${this.spriteBg(e.id)}"></div>
                    </div>
                `;
            }).join('');
        }

        const actorHud = this.root.querySelector('#p5-actor-hud');
        if (actorHud) {
            const focus = (actor && actor.side === 'ally') ? actor : (s.party.find(p => p.hp > 0) || s.party[0]);
            if (focus) {
                const hpPct = Math.max(0, focus.hp / focus.maxHp * 100);
                const spPct = Math.max(0, focus.sp / Math.max(1, focus.maxSp) * 100);
                const badges = this.statusBadgesHtml(focus, { limit: 6 });
                actorHud.innerHTML = `
                    <div class="p5ui-portrait" style="background-image:${this.spriteBg(focus.id, this.formKind(focus))}"></div>
                    <div class="p5ui-stats">
                        <strong class="p5ui-cry-title">${(typeof BattleFlavor !== 'undefined' ? BattleFlavor.taglineOf(focus.id, focus) : (focus.tagline || '¡Vamos!'))}</strong>
                        <em class="p5ui-cry-line">${this.fighterName(focus)}${focus.transformed ? ' ★' : ''} · ${focus.roleTag || focus.role || 'Listo'}</em>
                        <div class="p5ui-bar hp"><span>HP</span><div class="track"><i data-unit-hp="${focus.id}" style="width:${hpPct}%"></i></div><em data-unit-hp-text="${focus.id}">${Math.max(0, focus.hp)} / ${focus.maxHp}</em></div>
                        <div class="p5ui-bar cp sp"><span>CP</span><div class="track"><i data-unit-sp="${focus.id}" style="width:${spPct}%"></i></div><em data-unit-sp-text="${focus.id}">${focus.sp} / ${focus.maxSp}</em></div>
                        <div class="p5ui-status">${badges || ''}</div>
                    </div>
                `;
            } else {
                actorHud.innerHTML = '';
            }
        }

        const partyStrip = this.root.querySelector('#p5-party-strip');
        if (partyStrip) {
            partyStrip.innerHTML = `
                <div class="p5ui-party-label"><span>TU EQUIPO</span></div>
                ${s.party.map(p => {
                const hpPct = Math.max(0, p.hp / Math.max(1, p.maxHp) * 100);
                const spPct = Math.max(0, (p.sp || 0) / Math.max(1, p.maxSp || 1) * 100);
                const low = hpPct < 35;
                const critical = hpPct > 0 && hpPct < 18;
                return `
                    <div class="p5-party-chip ${actor && actor.id === p.id ? 'active' : ''} ${p.hp <= 0 ? 'downed' : ''} ${low ? 'low' : ''} ${critical ? 'critical' : ''}" data-unit="${p.id}">
                        <div class="p5-party-face" style="background-image:${this.spriteBg(p.id, this.formKind(p))}"></div>
                        <div class="p5-party-meta">
                            <strong>${p.name}</strong>
                            <div class="bars">
                                <div class="bar hp ${low ? 'warn' : ''} ${critical ? 'danger' : ''}"><i data-unit-hp="${p.id}" style="width:${hpPct}%"></i></div>
                                <div class="bar sp"><i data-unit-sp="${p.id}" style="width:${spPct}%"></i></div>
                            </div>
                            <div class="nums"><span data-unit-hp-flat="${p.id}">${Math.max(0, p.hp)} / ${p.maxHp}</span><span data-unit-sp-flat="${p.id}">CP ${Math.round(spPct)}%</span></div>
                        </div>
                    </div>`;
                }).join('')}
            `;
        }

        const log = this.root.querySelector('#battle-log');
        if (log) {
            log.innerHTML = s.log.slice(-3).map(l => `<div>${l}</div>`).join('');
            log.scrollTop = log.scrollHeight;
        }

        this.renderCommands();
        this.startSpriteLoops();
        this.syncTargetHighlights();
    },

    syncTargetHighlights() {
        if (!this.root) return;
        const targeting = this.mode === 'target' || this.mode === 'target-ally';
        const stage = this.root.querySelector('.p5-stage');
        stage?.classList.toggle('is-targeting', targeting);
        stage?.classList.toggle('target-foes', this.mode === 'target');
        stage?.classList.toggle('target-allies', this.mode === 'target-ally');

        this.root.querySelectorAll('.p5-fighter').forEach((el) => {
            el.classList.remove('is-targetable', 'is-untargetable');
            el.onclick = null;
            el.removeAttribute('role');
            el.removeAttribute('tabindex');
        });
        if (!targeting || !this.state) return;

        const reviveMode = this.selectedSkill?.revive != null;
        const list = this.mode === 'target-ally'
            ? (reviveMode ? this.state.party.filter(u => u.hp <= 0) : BattleEngine.living(this.state.party))
            : BattleEngine.living(this.state.enemies);
        const ids = new Set(list.map(u => `${u.side}:${u.id}`));

        this.root.querySelectorAll('.p5-fighter').forEach((el) => {
            const id = el.dataset.id;
            if (ids.has(`${el.dataset.side}:${id}`)) {
                el.classList.add('is-targetable');
                el.setAttribute('role', 'button');
                el.tabIndex = 0;
                el.onclick = () => {
                    AudioManager.ui.click();
                    if (this.selectedSkill) this.resolvePlayerAction({ type: 'skill', skillId: this.selectedSkill.id, targetId: id });
                    else this.resolvePlayerAction({ type: 'attack', targetId: id });
                };
            } else {
                el.classList.add('is-untargetable');
            }
        });
    },

    startSpriteLoops() {
        Object.values(this.spriteTimers).forEach(clearInterval);
        this.spriteTimers = {};
        if (!this.state) return;
        // CSS bob + light idle frame cycle for flat sprites; rigs breathe via BattleRig.
        [...this.state.party, ...this.state.enemies].forEach(u => {
            const el = this.fighterEl(u.id, u.side)?.querySelector('.p5-sprite');
            if (!el) return;
            if (u.hp <= 0) {
                el.classList.remove('is-idle');
                if (typeof BattleRig !== 'undefined') BattleRig.stopIdle(el);
                if (typeof SkelBattleBridge !== 'undefined' && el.classList.contains('p5-skel')) {
                    SkelBattleBridge.stop(el);
                }
                const fighter = this.fighterEl(u.id, u.side);
                if (typeof BattleMotion !== 'undefined') BattleMotion.stop(fighter);
                fighter?.classList.remove('motion-active', 'attacking', 'casting', 'hit-flash', 'hit-recoil', 'hit-stagger');
                fighter?.querySelectorAll('.p5-afterimage, .p5-bunshin, .p5-atk-fx').forEach(node => node.remove());
                return;
            }
            if (el.closest('.attacking, .casting')) {
                el.classList.remove('is-idle');
                return;
            }
            if (typeof SkelBattleBridge !== 'undefined' && el.classList.contains('p5-skel')) {
                el.classList.remove('is-idle');
                SkelBattleBridge.startIdle(el);
                return;
            }
            const form = this.formKind(u);
            const bg = this.spriteBg(u.id, form);
            if (typeof BattleRig !== 'undefined' && el.classList.contains('p5-rig')) {
                BattleRig.setImage(el, bg);
                BattleRig.startIdle(el);
                el.classList.remove('is-idle');
            } else {
                if (typeof BattleRig !== 'undefined') BattleRig.stopIdle(el);
                // Single planted idle — smooth CSS breath only (frame cycle looked laggy/stuttery)
                el.style.backgroundImage = bg;
                el.classList.add('is-idle');
            }
        });
    },

    playDeathFx(unitIds = []) {
        const ids = [...new Set((unitIds || []).filter(Boolean))];
        ids.forEach((id, i) => {
            const unit = [...(this.state?.party || []), ...(this.state?.enemies || [])]
                .find(u => u.id === id && u.hp <= 0)
                || this.unitForId(id);
            const fighter = this.fighterEl(id, unit?.side);
            if (!fighter || fighter.classList.contains('dead')) return;
            if (!unit || unit.hp > 0) return;
            if (typeof BattleMotion !== 'undefined') BattleMotion.stop(fighter);
            fighter.classList.remove('motion-active', 'attacking', 'casting', 'hit-flash', 'hit-recoil', 'hit-stagger');
            fighter.querySelectorAll('.p5-afterimage, .p5-bunshin, .p5-atk-fx').forEach(node => node.remove());
            setTimeout(() => {
                fighter.classList.add('dead', 'ko-flash');
                const spr = fighter.querySelector('.p5-sprite');
                spr?.classList.remove('is-idle');
                if (spr && typeof BattleRig !== 'undefined') BattleRig.stopIdle(spr);
                if (spr && typeof SkelBattleBridge !== 'undefined' && spr.classList.contains('p5-skel')) {
                    SkelBattleBridge.playDeath(spr).catch(() => {});
                }
                if (typeof EffectManager !== 'undefined') {
                    EffectManager.spawn(fighter, 'skfx skfx-ko-burst', 720);
                } else {
                    this.spawnFxNode(fighter, 'skfx skfx-ko-burst', 720);
                }
                setTimeout(() => fighter.classList.remove('ko-flash'), 520);
            }, i * 90);
        });
    },

    setDesc(html) {
        const el = this.root?.querySelector('#p5-desc');
        if (el) el.innerHTML = html || '';
    },

    bindSkillPick(box, actor, listRoot) {
        const pick = (sk) => {
            this.selectedSkill = sk;
            AudioManager.ui.click();
            if (sk.aoeHeal || sk.transform || sk.skipEnemy || sk.partyBuff || sk.cover || sk.charge || (sk.buff && !sk.heal && !sk.power && !sk.targetAlly && !sk.allyBuff && !sk.targetEnemy && !sk.debuff && !sk.stun)) {
                this.resolvePlayerAction({ type: 'skill', skillId: sk.id, targetId: actor.id });
                return;
            }
            if ((sk.heal && !sk.power) || sk.targetAlly || sk.allyBuff || sk.revive != null) {
                this.mode = 'target-ally';
                this.render();
                return;
            }
            if (sk.targetEnemy || sk.stun || (sk.debuff && !sk.power)) {
                this.mode = 'target';
                this.render();
                return;
            }
            if (sk.aoe) { this.resolvePlayerAction({ type: 'skill', skillId: sk.id }); return; }
            if (sk.power) { this.mode = 'target'; this.render(); return; }
            this.resolvePlayerAction({ type: 'skill', skillId: sk.id, targetId: actor.id });
        };

        listRoot.querySelectorAll('[data-skill]').forEach(btn => {
            const sk = BattleData.activeSkills(actor).find(s => s.id === btn.dataset.skill);
            btn.onmouseenter = () => {
                if (!sk) return;
                this.setDesc(BattleData.skillDetailHtml(sk));
                listRoot.querySelectorAll('.p5ui-card').forEach(c => c.classList.remove('selected'));
                btn.classList.add('selected');
            };
            btn.onclick = () => { if (sk && BattleEngine.canUseSkill(actor, sk, this.state)) pick(sk); };
        });
        listRoot.querySelector('[data-back]')?.addEventListener('click', () => {
            this.mode = 'command';
            this.selectedSkill = null;
            this.render();
        });
    },

    renderCommands() {
        const box = this.root.querySelector('#battle-command');
        const rail = this.root.querySelector('#p5-skill-rail');
        const actor = BattleEngine.currentActor(this.state);
        if (!box || !rail) return;

        if (this.state.finished) {
            box.innerHTML = '';
            rail.innerHTML = '';
            this.setDesc('');
            return;
        }

        if (!actor || actor.side !== 'ally' || this.mode === 'enemy') {
            box.innerHTML = `<div class="p5ui-wait"><span></span> El enemigo actúa…</div>`;
            rail.innerHTML = '';
            this.setDesc('<p>Espera tu turno.</p>');
            return;
        }

        if (this.mode === 'skills' || this.mode === 'attacks') {
            const list = this.mode === 'attacks'
                ? BattleData.attackSkills(actor)
                : BattleData.techSkills(actor);
            const label = this.mode === 'attacks' ? 'ATACAR' : 'TÉCNICA';
            box.innerHTML = `
                <div class="p5ui-cmd-stack submenu">
                    <button class="p5ui-cmd back" data-back="1" type="button"><i class="ic">◀</i><span>Atrás</span></button>
                    <div class="p5ui-cmd active ghost"><i class="ic">${this.mode === 'attacks' ? '⚔' : '✦'}</i><span>${label}</span></div>
                </div>
            `;
            rail.innerHTML = `
                <div class="p5ui-cards">
                    ${list.length ? list.map((sk, i) => {
                        const glyph = BattleData.skillGlyph(sk);
                        const facts = BattleData.skillFacts(sk).slice(0, 1)[0] || sk.desc || '';
                        const usable = BattleEngine.canUseSkill(actor, sk, this.state);
                        const why = !usable
                            ? (sk.transform && !BattleEngine.transformReady(this.state, actor)
                                ? `R${BattleEngine.TRANSFORM_UNLOCK_ROUND}`
                                : (sk.transform && (actor.transformed || actor.transformUsed) ? '1 USO'
                                    : (sk.once && actor.usedOnce?.[sk.id] ? '1 USO'
                                        : ((sk.cooldown && (actor.skillCooldowns?.[sk.id] || 0) > 0)
                                            ? `CD ${actor.skillCooldowns[sk.id]}`
                                            : `${sk.cost} CP`))))
                            : `${sk.cost} CP`;
                        return `
                        <button class="p5ui-card type-${sk.type || 'support'} ${usable ? '' : 'locked'} ${this.selectedSkill?.id === sk.id ? 'selected' : ''}" data-skill="${sk.id}" type="button" style="--i:${i}" ${usable ? '' : 'disabled'}>
                            <div class="p5ui-card-art sk-art glyph-${glyph} type-${sk.type || 'support'}">
                                <span class="sk-art-label">${BattleData.typeLabel(sk.type)}</span>
                            </div>
                            <strong>${sk.name}</strong>
                            <small class="p5ui-card-blurb">${facts}</small>
                            <div class="p5ui-card-foot">
                                <em>${sk.once || sk.transform ? 'Único' : (sk.cooldown ? `CD ${sk.cooldown}` : (sk.aoe ? 'AoE' : (sk.hits > 1 ? sk.hits + '×' : 'Single')))}</em>
                                <span>${why}</span>
                            </div>
                        </button>`;
                    }).join('') : '<div class="p5ui-empty">Sin habilidades</div>'}
                </div>
            `;
            this.setDesc(list[0] ? BattleData.skillDetailHtml(list[0]) : `<h4>${label}</h4><p>Elige una carta.</p>`);
            this.bindSkillPick(box, actor, this.root);
            return;
        }

        if (this.mode === 'target' || this.mode === 'target-ally') {
            const reviveMode = this.selectedSkill?.revive != null;
            const list = this.mode === 'target-ally'
                ? (reviveMode ? this.state.party.filter(u => u.hp <= 0) : BattleEngine.living(this.state.party))
                : BattleEngine.living(this.state.enemies);
            const foe = this.mode === 'target';
            box.innerHTML = `
                <div class="p5ui-cmd-stack submenu">
                    <button class="p5ui-cmd back" data-back="1" type="button"><i class="ic">◀</i><span>Atrás</span></button>
                </div>
            `;
            rail.innerHTML = `
                <div class="p5ui-cards targets">
                    ${list.length ? list.map((t, i) => `
                        <button class="p5ui-card target ${foe ? 'foe' : 'ally'}" data-target="${t.id}" type="button" style="--i:${i}">
                            <div class="p5ui-card-art" style="background-image:${this.spriteBg(t.id, this.formKind(t))}"></div>
                            <strong>${t.name}</strong>
                            ${foe ? this.affinityChipsHtml(t, { showResist: true, showNull: false }) : ''}
                            <div class="p5ui-card-foot"><span>HP ${Math.max(0, t.hp)}/${t.maxHp}</span></div>
                        </button>
                    `).join('') : '<div class="p5ui-empty">Nadie disponible</div>'}
                </div>
            `;
            this.setDesc(this.selectedSkill
                ? BattleData.skillDetailHtml(this.selectedSkill) + `<p class="p5ui-target-hint">${reviveMode ? 'Elige aliado caído · o clica en el campo.' : foe ? 'Elige enemigo · o clica su sprite.' : 'Elige aliado · o clica su sprite.'}</p>`
                : `<h4>Objetivo</h4><p>${reviveMode ? 'Elige aliado caído.' : foe ? 'Elige enemigo en el campo o la lista.' : 'Elige aliado en el campo o la lista.'}</p>`);
            rail.querySelectorAll('[data-target]').forEach(btn => {
                btn.onmouseenter = () => {
                    this.fighterEl(btn.dataset.target, foe ? 'enemy' : 'ally')?.classList.add('is-target-hover');
                };
                btn.onmouseleave = () => {
                    this.fighterEl(btn.dataset.target, foe ? 'enemy' : 'ally')?.classList.remove('is-target-hover');
                };
                btn.onclick = () => {
                    AudioManager.ui.click();
                    if (this.selectedSkill) this.resolvePlayerAction({ type: 'skill', skillId: this.selectedSkill.id, targetId: btn.dataset.target });
                    else this.resolvePlayerAction({ type: 'attack', targetId: btn.dataset.target });
                };
            });
            box.querySelector('[data-back]').onclick = () => {
                this.mode = this.selectedSkill
                    ? (BattleData.isAttackSkill(this.selectedSkill) ? 'attacks' : 'skills')
                    : 'command';
                this.render();
            };
            this.syncTargetHighlights();
            return;
        }

        const atkN = BattleData.attackSkills(actor).length;
        const techN = BattleData.techSkills(actor).length;
        const equipped = (typeof EquipmentSystem !== 'undefined') ? EquipmentSystem.equippedFor(actor.id) : null;
        const itemUsed = !!actor._usedItem;
        box.innerHTML = `
            <div class="p5ui-cmd-stack">
                ${this.allOutReady ? '<button class="p5ui-cmd allout" data-act="allout" type="button"><i class="ic">★</i><span>Asalto</span></button>' : ''}
                <button class="p5ui-cmd" data-act="attack" type="button"><i class="ic">⚔</i><span>Atacar</span><b>${atkN}</b></button>
                <button class="p5ui-cmd" data-act="skill" type="button"><i class="ic">✦</i><span>Técnica</span><b>${techN}</b></button>
                <button class="p5ui-cmd" data-act="guard" type="button"><i class="ic">🛡</i><span>Defender</span></button>
                <button class="p5ui-cmd ${!equipped ? 'locked' : ''}" data-act="item" type="button" ${itemUsed || !equipped ? 'disabled' : ''}><i class="ic">◉</i><span>${equipped ? equipped.name : 'Sin objeto'}</span></button>
            </div>
        `;
        rail.innerHTML = this.pendingOneMore
            ? `<div class="p5ui-banner-om">¡OTRO TURNO! — actúa otra vez</div>`
            : '';
        this.setDesc('');

        box.querySelector('[data-act="attack"]').onclick = () => { this.selectedSkill = null; this.mode = 'attacks'; this.render(); };
        box.querySelector('[data-act="skill"]').onclick = () => { this.selectedSkill = null; this.mode = 'skills'; this.render(); };
        box.querySelector('[data-act="item"]').onclick = async () => {
            const a = BattleEngine.currentActor(this.state);
            if (!a) return;
            AudioManager.ui.click();
            this.resolvePlayerAction({ type: 'item', itemId: equipped?.id });
        };
        box.querySelector('[data-act="guard"]').onclick = () => this.resolvePlayerAction({ type: 'guard' });
        box.querySelector('[data-act="allout"]')?.addEventListener('click', async () => {
            await this.playAllOutSequence();
        });
    },

    async playAllOutSequence() {
        if (!this.state || !this.allOutReady) return;
        this.mode = 'enemy';
        this.setActionPhase('ATTACKING');
        this.hideActionBanner();
        this.showCry('¡ASALTO TOTAL!', { family: 'finisher', fxType: 'almighty' });
        const stage = this.root?.querySelector('.p5-stage');
        stage?.classList.add('allout-rush', 'assault-cinema');
        if (typeof EffectManager !== 'undefined') {
            EffectManager.spawn(stage, 'skfx skfx-assault-cinema', 1180);
        }
        this.setCameraPose({ x: 0, y: -6, scale: 1.08, darken: 0.35, ms: 180 });
        AudioManager.combat.ultimate({ allOut: true });
        const livingDown = BattleEngine.living(this.state.enemies).filter(e => e.down);
        livingDown.forEach((e, i) => {
            setTimeout(() => {
                const el = this.fighterEl(e.id, 'enemy');
                if (!el) return;
                el.classList.add('hit-flash', 'hit-recoil', 'hit-stagger');
                if (typeof EffectManager !== 'undefined') {
                    EffectManager.spawn(el, 'skfx skfx-assault-lock', 980);
                    EffectManager.impact(el, { fxType: 'almighty', family: 'finisher', slug: `sig-assault-${i}` }, true, 760);
                }
            }, 120 + i * 90);
        });
        BattleEngine.living(this.state.party).forEach((p, i) => {
            setTimeout(() => {
                const el = this.fighterEl(p.id, 'ally');
                el?.classList.add('attacking', 'fx-finisher', 'assault-squad');
            }, i * 60);
        });
        await this.wait(720);
        const before = this.captureVitals();
        const r = this.runWithUiSfx(() => BattleEngine.allOutAttack(this.state));
        Achievements.show('assault');
        this.allOutReady = false;
        this.pendingOneMore = false;
        stage?.classList.remove('allout-rush');
        this.root?.querySelectorAll('.p5-fighter.attacking').forEach(el => el.classList.remove('attacking', 'fx-finisher', 'assault-squad'));
        if (r.ok) {
            await this.animateVitalsFrom(before, [
                ...this.state.enemies.map(e => e.id),
                ...this.state.party.map(p => p.id)
            ]);
            if (r.finisher?.length) await this.playFinisherSequence(r.finisher, { allOut: true });
            this.playDeathFx(this.state.enemies.filter(e => e.hp <= 0).map(e => e.id));
        }
        stage?.classList.remove('assault-cinema');
        this.resetCameraPose(280);
        this.afterAction(r, false);
    },

    async playFinisherSequence(entries = [], { actor = null, allOut = false } = {}) {
        const targets = (entries || []).filter(Boolean);
        if (!targets.length) return;
        const stage = this.root?.querySelector('.p5-stage');
        stage?.classList.add('remate-cinema');
        const root = stage || this.root;
        const title = document.createElement('div');
        title.className = `p5-remate-title${allOut ? ' is-assault' : ''}`;
        title.innerHTML = `<span>${allOut ? '¡ASALTO TOTAL!' : '¡REMATE!'}</span><small>${allOut ? 'CADENA FINAL' : 'GOLPE DEFINITIVO'}</small>`;
        root?.appendChild(title);
        if (typeof EffectManager !== 'undefined') {
            EffectManager.spawn(root, `skfx skfx-remate-cinema ${allOut ? 'is-assault' : ''}`, 1060);
        }
        const executor = actor ? this.fighterEl(actor.id, actor.side) : null;
        executor?.classList.add('finisher-executor');
        targets.forEach((entry, index) => {
            const target = this.fighterEl(entry.id, entry.side || 'enemy');
            if (!target) return;
            target.classList.add('finisher-target');
            if (typeof EffectManager !== 'undefined') {
                EffectManager.spawn(target, 'skfx skfx-remate-sigil', 980);
                EffectManager.impact(target, {
                    characterId: actor?.id || 'assault',
                    family: 'finisher',
                    fxType: 'almighty',
                    slug: `sig-remate-${index}`
                }, true, 820);
            }
        });
        if (!allOut) AudioManager.combat.ultimate();
        this.setCameraPose({ x: 0, y: -8, scale: allOut ? 1.13 : 1.1, darken: 0.42, ms: 220 });
        await this.wait(280);
        this.shakeStage(allOut ? 15 : 12, 680);
        await this.wait(allOut ? 1040 : 940);
        executor?.classList.remove('finisher-executor');
        this.root?.querySelectorAll('.finisher-target').forEach(el => el.classList.remove('finisher-target'));
        title.remove();
        stage?.classList.remove('remate-cinema');
        this.resetCameraPose(420);
    },

    flashOneMore() {
        const om = this.root?.querySelector('#p5-onemore');
        const stage = this.root?.querySelector('.p5-stage');
        if (om) {
            om.classList.remove('show');
            void om.offsetWidth;
            om.classList.add('show');
        }
        stage?.classList.remove('onemore-pulse');
        void stage?.offsetWidth;
        stage?.classList.add('onemore-pulse');
        this.setCameraPose({ x: -8, y: -4, scale: 1.05, darken: 0.18, ms: 120 });
        setTimeout(() => this.resetCameraPose(260), 420);
        setTimeout(() => stage?.classList.remove('onemore-pulse'), 900);
        AudioManager.combat.combo();
    },

    async resolvePlayerAction(action) {
        const actor = BattleEngine.currentActor(this.state);
        if (!actor || actor.side !== 'ally') return;
        this.mode = 'enemy';
        this.setActionPhase('ACTION_START');
        this.render();

        const sk = BattleData.activeSkills(actor).find(s => s.id === action.skillId);
        await this.announceAction(actor, action, sk);
        this.setActionPhase((action.type === 'skill' && sk && !sk.power) || action.type === 'guard' ? 'CASTING' : 'ATTACKING');
        action.actorSide = actor.side;
        await this.playAttackAnim(actor.id, action, actor);
        const before = this.captureVitals();
        const result = this.runWithUiSfx(() => BattleEngine.execute(this.state, actor, action));
        this.checkCombatAchievements(result);
        if (!result.ok) {
            this.state.log.push(...(result.logs || ['Acción fallida']));
            this.hideActionBanner();
            this.setActionPhase('PLAYER_SELECTING');
            this.mode = 'command';
            this.render();
            return;
        }
        // Cry already shown once during the attack — do not flash again.
        if (result.hits?.length) {
            this.setActionPhase('IMPACT');
            this.playImpactAudio(result.hits, this.skillFxProfile(sk, action));
            this.showDamageFloats(result.hits, action);
            if (result.armorBreak) {
                this.showCry('¡CORAZA ROTA!', { family: 'transform', fxType: 'support' });
                // Sasori must visually leave Hiruko on the first successful hit,
                // before the damage timeline and the next turn continue.
                this.render();
            }
            await this.animateVitalsFrom(before, [...result.hits.map(h => h.id), actor.id]);
            this.setActionPhase('DEATH_CHECK');
            if (actor.side === 'ally' && result.finisher?.length) {
                await this.playFinisherSequence(result.finisher, { actor });
            }
            this.playDeathFx((result.hits || []).map(h => h.id));
            await this.wait(220);
        } else {
            await this.animateVitalsFrom(before, [actor.id]);
            this.setActionPhase('DAMAGE_APPLIED');
            await this.wait(180);
        }
        this.hideActionBanner();
        if (result.oneMore) {
            this.flashOneMore();
        }
        this.allOutReady = !!result.allOutReady;
        this.setActionPhase('RETURNING');
        this.render();
        if (this.state.finished) { await this.wait(700); this.showResult(this.state.victory); return; }
        if (result.oneMore) {
            this.pendingOneMore = true; this.mode = 'command'; this.selectedSkill = null; this.setActionPhase('PLAYER_SELECTING'); this.render(); return;
        }
        this.pendingOneMore = false;
        this.setActionPhase('NEXT_TURN');
        BattleEngine.advanceTurn(this.state, false);
        this.selectedSkill = null; this.mode = 'command'; this.render();
        await this.wait(280);
        this.continueFlow();
    },

    /** Thematic FX profile so every skill reads as its technique. */
    supportEffectKind(sk, action) {
        if (action?.type === 'guard') return 'guard';
        if (sk?.transform) return 'transform';
        if (sk?.heal || sk?.aoeHeal || sk?.revive != null) return 'heal';
        if (sk?.debuff) return 'debuff';
        if (sk?.buff || sk?.allyBuff || sk?.partyBuff || sk?.charge || sk?.cover) return 'buff';
        return 'support';
    },

    applySupportFx(target, profile, mode = 'support') {
        if (!target) return;
        target.classList.remove('support-pulse', 'support-heal', 'support-buff', 'support-guard', 'support-transform', 'support-debuff');
        void target.offsetWidth;
        target.classList.add('support-pulse', `support-${mode}`);
        setTimeout(() => target.classList.remove('support-pulse', `support-${mode}`), 900);
        if (typeof EffectManager !== 'undefined') {
            EffectManager.supportImpact(target, profile, mode);
        }
    },

    skillFxProfile(sk, action, actor = null) {
        const id = String(sk?.id || action?.skillId || '');
        const design = typeof BattleTechniqueDesigns !== 'undefined'
            ? BattleTechniqueDesigns.get(action?.actorId, id)
            : null;
        const type = sk?.type || action?.skillType || 'strike';
        const power = sk?.power || action?.power || 0;
        const hits = Math.max(1, sk?.hits || 1);
        const characterId = String(action?.actorId || action?.actor?.id || actor?.id || '').toLowerCase();
        const transformed = !!(actor?.transformed || action?.transformed || action?.actor?.transformed);
        const idText = `${id} ${sk?.name || ''}`.toLowerCase();
        const elementFromType = ['fire', 'water', 'ice', 'wind', 'elec', 'earth', 'sand', 'curse', 'psy', 'bless', 'almighty'].includes(String(type).toLowerCase())
            ? String(type).toLowerCase() : '';
        const elementFromName = /fire|flame|katon|burn|inferno|red_hawk|diable|amaterasu|explosion|bomb/i.test(idText) ? 'fire'
            : /water|suiton|wave|splash|tide|hydro/i.test(idText) ? 'water'
                : /ice|frost|hyorin|crystal|glacial|sode/i.test(idText) ? 'ice'
                    : /wind|gale|air|cyclone|tatsumaki|dust|whirlwind/i.test(idText) ? 'wind'
                        : /thunder|lightning|elec|chidori|raikiri|bolt|rai|storm|thor/i.test(idText) ? 'elec'
                            : /sand|desert|sunashield|iron_sand/i.test(idText) ? 'sand'
                                : /mist|fog|haze/i.test(idText) ? 'mist'
                                    : /poison|venom|toxin/i.test(idText) ? 'poison'
                                        : /curse|genjutsu|void|domain|kurohitsugi/i.test(idText) ? 'curse'
                                            : /shadow|kage/i.test(idText) ? 'shadow' : '';
        const transformElement = typeof EffectManager !== 'undefined'
            ? EffectManager.transformationElement[characterId] || '' : '';
        const element = elementFromType || elementFromName || (transformed ? transformElement : '');
        const isSupport = action?.type === 'guard' || (action?.type === 'skill' && sk && !sk.power);
        const supportMode = this.supportEffectKind(sk, action);
        const fxType = isSupport
            ? ((sk?.heal || sk?.aoeHeal || sk?.revive != null) ? 'heal' : 'support')
            : type;
        const slug = id ? `sig-${id.replace(/_/g, '-')}` : '';

        let family = 'melee';
        if (isSupport) family = supportMode === 'heal' ? 'heal' : (supportMode === 'debuff' ? 'hex' : (sk?.transform ? 'transform' : 'support'));
        else if (/rasengan|odama|bijuu|menacing|hadou|cero|getsuga|kuroi|yasaka|bomb|menacing_ball/i.test(id)) family = 'spiral';
        else if (/chidori|raiton|kirin|thunder|el_thor|lightning|raigeki|raikiri|byakurai/i.test(id)) family = 'lightning';
        else if (/katon|red_hawk|diable|amaterasu|fragor|fire|hikotsu/i.test(id)) family = 'inferno';
        else if (/hyorin|ice|frost|san_no_mai|sode|water_shot|water|sables|desert|sand|sabaku|sunashield/i.test(id)) family = 'element';
        else if (/ora|dona|muda|gatling|gum_|jet_|kyubi_claw|hihio|stone_free|star_breaker/i.test(id) || hits >= 4) family = 'barrage';
        else if (/oni_giri|ashura|getsuga|shunpo|senkei|slash|string|web|zabimaru|kubikiri|kusanagi|senkei_blade/i.test(id) || type === 'slash') family = 'blade';
        else if (/pierce|star_finger|shigan|senbon|injection|air_palm|hakke/i.test(id) || type === 'pierce') family = 'pierce';
        else if (/curse|tsukuyomi|kyoka|genjutsu|shadow|kage_|kamui|king_crimson|the_world|time_stop|erase/i.test(id) || type === 'curse' || type === 'psy') family = 'hex';
        else if (/almighty|bankai|senkei|god|lanza|king_kong|ashura|kirin|space/i.test(id) || power >= 160) family = 'finisher';
        else if (['fire', 'ice', 'elec', 'wind', 'water', 'bless', 'almighty'].includes(type)) family = 'element';

        const projectile = !isSupport && power > 0 && (
            family === 'spiral' || family === 'lightning' || family === 'inferno' || family === 'element'
            || family === 'hex' || family === 'finisher'
            || /rasengan|odama|getsuga|chidori|katon|thunder|menacing|bijuu|kirin|water_shot|thunderbolt|cero|hadou|yasaka|bomb|amaterasu|hyorin|lanza|el_thor/i.test(id)
            || ['fire', 'ice', 'elec', 'wind', 'water', 'curse', 'psy', 'bless', 'almighty'].includes(type)
        );

        const shake = isSupport ? (sk?.transform ? 10 : 3)
            : Math.min(18, 4 + Math.floor(power / 18) + (hits > 3 ? 3 : 0) + (sk?.aoe ? 2 : 0));

        return {
            characterId, element, transformed, transformElement, supportMode,
            fxType, slug, family, projectile, hits,
            style: design?.style || `${family}-signature`,
            bladeVariant: design?.bladeVariant || null,
            energyVariant: design?.energyVariant || null,
            impactStyle: design?.impact || 'signature-impact',
            cameraStyle: design?.camera || 'standard',
            charge: !isSupport || !!sk?.transform,
            rings: family === 'spiral' || family === 'finisher' || family === 'heal' ? 2 : (family === 'hex' ? 1 : 0),
            sparks: family === 'barrage' || family === 'lightning' || hits > 2 ? Math.min(8, hits + 2) : (family === 'blade' ? 4 : 3),
            shake,
            rush: family === 'barrage' || family === 'blade' || /shunpo|soru|jet_|bankai_shunpo|rokushiki/i.test(id),
            aoePulse: !!sk?.aoe && power > 0
        };
    },

    spawnFxNode(parent, className, ttl = 600) {
        if (typeof EffectManager !== 'undefined') return EffectManager.spawn(parent, className, ttl);
        if (!parent) return null;
        const node = document.createElement('div');
        node.className = className;
        parent.appendChild(node);
        setTimeout(() => node.remove(), ttl);
        return node;
    },

    shakeStage(intensity = 6, ms = 320) {
        const stage = this.root?.querySelector('.p5-stage') || this.root;
        if (!stage) return;
        stage.classList.add('skfx-shake');
        stage.style.setProperty('--skfx-shake', `${intensity}px`);
        clearTimeout(this._shakeTimer);
        this._shakeTimer = setTimeout(() => {
            stage.classList.remove('skfx-shake');
            stage.style.removeProperty('--skfx-shake');
        }, ms);
    },

    async hitStop(ms = 80) {
        const actors = [];
        this.root?.querySelectorAll('.p5-skel').forEach((spr) => {
            const actor = typeof SkelBattleBridge !== 'undefined' ? SkelBattleBridge.get(spr) : null;
            if (actor?.animator) actors.push(actor.animator);
        });
        actors.forEach((a) => a.setTimeScale(0.04));
        await this.wait(ms);
        actors.forEach((a) => a.setTimeScale(1));
    },

    async playSkelAttackAnim(el, spr, actor, action, sk, profile, isSupport, kind, typeClass, skillClass) {
        const actorId = actor?.id;
        const cfg = SkelCharacterRegistry.get(actorId);
        const clipName = SkelCharacterRegistry.resolveClipName(actorId, sk?.id || 'attack', profile)
            || (isSupport ? 'skill_1' : 'attack');
        const clip = cfg.clips?.[clipName] || cfg.clips?.attack;
        const stage = this.root?.querySelector('.p5-stage');
        const isUlt = clipName === (cfg.ultimateClip || 'ultimate') || profile.family === 'finisher';

        this.focusCamera(actor, profile, isUlt ? 'attack' : ((action.type === 'guard' || isSupport) ? 'cast' : 'attack'));
        if (isUlt && stage) stage.classList.add('skel-ult-cinema');
        if (!isSupport) AudioManager.combat.anticipate();
        else AudioManager.combat.skill(profile.fxType || 'support', sk?.id || '');
        if (isUlt) setTimeout(() => AudioManager.combat.ultimate(), 160);
        else if (!isSupport && sk?.power) setTimeout(() => AudioManager.combat.skill(profile.fxType || sk?.type || 'strike', sk?.id || ''), 90);

        el.classList.add(kind, typeClass, `fx-${profile.family}`);
        if (sk?.transform) el.classList.add('transforming', 'form-shifted');
        if (skillClass) el.classList.add(skillClass);
        const motion = typeof BattleMotion !== 'undefined'
            ? BattleMotion.start(el, spr, actor, sk, action, profile)
            : null;

        const fx = typeof EffectManager !== 'undefined' ? EffectManager : null;
        const fxBits = [];
        if (profile.charge || isUlt) {
            fxBits.push(fx ? fx.charge(el, profile) : this.spawnFxNode(el, `skfx skfx-charge ${profile.fxType} fam-${profile.family}`.trim(), 700));
        }

        const cryText = action.type === 'guard' ? '¡DEFENSA!' : (sk?.cry || sk?.name || null);
        if (cryText) this.showCry(cryText, { family: profile.family, fxType: profile.fxType, type: sk?.type });
        fxBits.push(fx ? fx.cast(el, profile, isSupport) : this.spawnFxNode(el, `p5-atk-fx skfx skfx-cast ${isSupport ? 'cast' : 'slash'} ${profile.fxType} fam-${profile.family}`.trim(), 600));
        if (!isSupport) {
            fxBits.push(fx ? fx.arc(el, profile) : this.spawnFxNode(el, `skfx skfx-arc ${profile.fxType} fam-${profile.family}`.trim(), 560));
        }

        const targets = [];
        if (sk?.aoe && sk.power) {
            const foes = el.classList.contains('enemy') ? this.state.party : this.state.enemies;
            BattleEngine.living(foes).forEach((t) => targets.push(t.id));
        } else if (action.targetId) {
            targets.push(action.targetId);
        } else if (isSupport && (sk?.aoeHeal || sk?.partyBuff)) {
            BattleEngine.living(this.state.party).forEach((t) => targets.push(t.id));
        } else if (isSupport && actor) {
            targets.push(actor.id);
        }

        let impactDone = false;
        const onImpact = async () => {
            if (impactDone) return;
            impactDone = true;
            if (isSupport) {
                targets.forEach((tid, i) => {
                    const tgt = this.fighterEl(tid, actor.side === 'enemy' ? 'ally' : 'enemy');
                    if (!tgt) return;
                    setTimeout(() => {
                        this.applySupportFx(tgt, profile, profile.supportMode);
                        AudioManager.combat.skill(profile.fxType || profile.supportMode || 'support', sk?.id || '');
                    }, i * 80);
                });
                return;
            }
            this.focusCamera(actor, profile, 'impact');
            const shake = cfg.shake?.[clipName] ?? profile.shake ?? 8;
            this.shakeStage(shake, isUlt ? 520 : 320);
            await this.hitStop(cfg.hitStopMs?.[clipName] ?? (isUlt ? 140 : 75));

            targets.forEach((tid, i) => {
                const tgt = this.fighterEl(tid, actor.side === 'enemy' ? 'ally' : 'enemy');
                if (!tgt) return;
                setTimeout(() => {
                    tgt.classList.remove('hit-flash', 'hit-recoil', 'hit-stagger');
                    void tgt.offsetWidth;
                    tgt.classList.add('hit-flash', 'hit-recoil', 'hit-stagger');
                    const targetSprite = tgt.querySelector('.p5-sprite');
                    if (targetSprite?.classList.contains('p5-skel')) {
                        SkelBattleBridge.playHit(targetSprite).catch(() => {});
                    }
                    if (fx) fx.impact(tgt, profile, (profile.hits || 1) > 1);
                    else this.spawnFxNode(tgt, `p5-impact skfx skfx-impact ${profile.fxType} fam-${profile.family}`.trim(), 560);
                    if (profile.rings) {
                        for (let r = 0; r < profile.rings; r++) {
                            setTimeout(() => (fx ? fx.ring(tgt, profile) : this.spawnFxNode(tgt, `skfx skfx-ring pop ${profile.fxType}`.trim(), 520)), r * 70);
                        }
                    }
                    AudioManager.combat.impact(profile.fxType || sk?.type || 'strike', {
                        multi: (profile.hits || 1) > 1,
                        heavy: isUlt || shake >= 10
                    });
                    setTimeout(() => tgt.classList.remove('hit-flash', 'hit-recoil', 'hit-stagger'), 520);
                }, i * 60);
            });
            if (sk?.aoe && sk.power && fx) fx.aoePulse(this.root, profile);
        };

        const playPromise = SkelBattleBridge.playClip(spr, clipName, async (evt) => {
            if (evt.name === 'ULT_PREPARE' || evt.name === 'ULT_POSE') {
                this.focusCamera(actor, { ...profile, shake: (profile.shake || 8) + 2 }, 'cast');
                if (fx) fx.charge(el, profile, 800);
            } else if (evt.name === 'ATTACK_ACTIVE') {
                if (fx) fx.arc(el, profile);
            } else if (evt.name === 'IMPACT') {
                await onImpact();
            }
        });

        const impactT = (clip?.events || []).find((e) => e.name === 'IMPACT')?.t ?? 0.52;
        const safety = setTimeout(() => { onImpact(); }, Math.round((clip?.duration || 900) * impactT));

        await playPromise;
        clearTimeout(safety);
        if (!impactDone) await onImpact();

        fxBits.forEach((n) => n?.remove?.());
        el.classList.remove(kind, typeClass, 'transforming', `fx-${profile.family}`);
        if (skillClass) el.classList.remove(skillClass);
        if (stage) stage.classList.remove('skel-ult-cinema');
        if (typeof BattleMotion !== 'undefined') BattleMotion.stop(el);
        this.resetCameraPose(isUlt ? 420 : 260);
        if (actor?.hp > 0) SkelBattleBridge.startIdle(spr);
        this.startSpriteLoops();
    },

    async playAttackAnim(actorId, action, actorOverride = null) {
        const actorSide = actorOverride?.side || action.actorSide || null;
        const el = this.fighterEl(actorId, actorSide);
        if (!el) { await this.wait(200); return; }
        const actor = actorOverride || this.unitForId(actorId, actorSide);
        action.actorId = actorId;
        const sk = BattleData.activeSkills(actor).find(s => s.id === action.skillId)
            || (action.skillId ? { id: action.skillId, name: action.skillName, type: action.skillType, power: action.power, cry: action.cry, aoe: action.aoe, transform: action.transform, voice: action.voice, hits: action.hits } : null);
        if (action.type !== 'guard' && !action._voicePlayed) {
            action._voicePlayed = true;
            AudioManager.shout(sk?.cry || sk?.name || 'ATAQUE', {
                charId: actorId,
                skillId: sk?.id || null,
                skillName: sk?.name,
                voice: sk?.voice,
                type: sk?.type || 'strike'
            });
        }
        const isSupport = action.type === 'guard' || (action.type === 'skill' && sk && !sk.power);
        const kind = isSupport ? 'casting' : 'attacking';
        const typeClass = sk?.type ? `atk-${sk.type}` : 'atk-strike';
        const skillClass = sk?.id ? `skill-${String(sk.id).replace(/_/g, '-')}` : '';
        const profile = this.skillFxProfile(sk, action, actor);
        const spr = el.querySelector('.p5-sprite');
        if (spr) {
            spr.classList.remove('is-idle');
            if (typeof BattleRig !== 'undefined') BattleRig.stopIdle(spr);
        }
        if (spr?.classList.contains('p5-skel')
            && typeof SkelCharacterRegistry !== 'undefined'
            && SkelCharacterRegistry.has(actorId)
            && typeof SkelBattleBridge !== 'undefined') {
            await this.playSkelAttackAnim(el, spr, actor, action, sk, profile, isSupport, kind, typeClass, skillClass);
            return;
        }
        const rigSkillId = sk?.id || (action.type === 'guard' ? 'guard' : 'attack');
        const useRig = !!(spr?.classList.contains('p5-rig')
            && typeof BattleRig !== 'undefined'
            && BattleRig.clipFor(actorId, rigSkillId));
        this.focusCamera(actor, profile, (action.type === 'guard' || isSupport) ? 'cast' : 'attack');
        if (!isSupport) AudioManager.combat.anticipate();
        else AudioManager.combat.skill(profile.fxType || 'support', sk?.id || '');
        if (profile.family === 'finisher') setTimeout(() => AudioManager.combat.ultimate(), 120);
        else if (!isSupport && sk?.power) setTimeout(() => AudioManager.combat.skill(profile.fxType || sk?.type || 'strike', sk?.id || ''), 90);
        if (spr && typeof BattleRig !== 'undefined' && !useRig) {
            BattleRig.pose(spr, 'anticipate', 190);
            await this.wait(150);
        }
        el.classList.add(kind, typeClass, `fx-${profile.family}`);
        if (sk?.transform) el.classList.add('transforming', 'form-shifted');
        if (skillClass) el.classList.add(skillClass);
        const motion = typeof BattleMotion !== 'undefined'
            ? BattleMotion.start(el, spr, actor, sk, action, profile)
            : null;
        if (spr && typeof BattleRig !== 'undefined' && !useRig) {
            BattleRig.pose(spr, 'strike', isSupport ? 430 : 560);
        }
        const rigClip = useRig ? BattleRig.clipFor(actorId, rigSkillId) : null;
        const rigRun = useRig ? BattleRig.playSkill(spr, actorId, rigSkillId) : null;

        const fx = typeof EffectManager !== 'undefined' ? EffectManager : null;
        const fxBits = [];
        if (profile.charge) {
            fxBits.push(fx ? fx.charge(el, profile) : this.spawnFxNode(el, `skfx skfx-charge ${profile.fxType} ${profile.slug} fam-${profile.family}`.trim(), 520));
        }

        // Fighter afterimages (rush / barrage trails)
        const ghosts = [];
        if (!isSupport && spr && (profile.rush || profile.family === 'barrage' || profile.family === 'blade')) {
            const src = this.spriteBg(actorId, (actor?.transformed || actor?.armorBroken || actor?.revealed) ? this.formKind(actor) : 'attack2');
            ['a0', 'a1', 'a2'].forEach(cls => {
                const g = document.createElement('div');
                g.className = `p5-afterimage ${cls}`;
                g.style.backgroundImage = src;
                el.appendChild(g);
                ghosts.push(g);
            });
        } else if (!isSupport && spr && profile.family === 'melee') {
            const src = this.spriteBg(actorId, (actor?.transformed || actor?.armorBroken || actor?.revealed) ? this.formKind(actor) : 'attack2');
            const g = document.createElement('div');
            g.className = 'p5-afterimage a1';
            g.style.backgroundImage = src;
            el.appendChild(g);
            ghosts.push(g);
        }
        if (sk?.id === 'kage_bunshin' && spr) {
            ['left', 'right'].forEach(side => {
                const clone = document.createElement('div');
                clone.className = `p5-bunshin ${side}`;
                clone.style.backgroundImage = this.spriteBg(actorId, 'idle');
                el.appendChild(clone);
                ghosts.push(clone);
            });
        }

        if (spr && action.type !== 'guard' && !useRig) {
            // Transform: stay on the stand/form sprite — never flash idle mid/post cast
            // (that caused JoJo stands to vanish for a beat then pop back).
            const frames = sk?.transform
                ? ['transform', 'transform', 'transform']
                : (typeof AttackSprites !== 'undefined'
                    ? AttackSprites.framesFor(actorId, sk?.id, {
                        isSupport,
                        transformed: !!actor?.transformed,
                        formKind: this.formKind(actor)
                    })
                    : (isSupport
                        ? [this.formKind(actor)]
                        : (actor?.transformed || actor?.armorBroken || actor?.revealed
                            ? [this.formKind(actor)]
                            : ['attack0', 'attack1', 'attack2', 'attack'])));
            if (typeof BattleRig !== 'undefined') {
                await BattleRig.preload(frames.map(frame => this.spriteBg(actorId, frame)));
            }
            const showFrame = (idx) => {
                const f = frames[Math.min(idx, frames.length - 1)] || 'idle';
                const bg = this.spriteBg(actorId, f);
                const fallbackKind = sk?.transform || actor?.transformed || actor?.armorBroken || actor?.revealed || f.startsWith('transform')
                    ? (actor?.transformed || actor?.armorBroken || actor?.revealed ? this.formKind(actor) : (f.startsWith('transform') ? f : 'transform'))
                    : (f.startsWith('attack') ? 'attack' : 'idle');
                if (typeof BattleRig !== 'undefined') BattleRig.setImage(spr, bg);
                else spr.style.backgroundImage = bg;
            };
            showFrame(0);
            if (this._atkFrameTimer) clearInterval(this._atkFrameTimer);
            this._atkFrameTimer = null;
            // Sync to stormAttackStable peaks (~580ms): wind-up → dash → impact → trail
            if (!isSupport && frames.length > 1) {
                [110, 260, 380].forEach((ms, i) => {
                    setTimeout(() => {
                        if (!spr?.isConnected) return;
                        showFrame(i + 1);
                    }, ms);
                });
            } else {
                let fi = 1;
                this._atkFrameTimer = setInterval(() => {
                    showFrame(fi++);
                }, isSupport ? 70 : 48);
            }
        }

        const cryText = action.type === 'guard'
            ? '¡DEFENSA!'
            : (sk?.cry || sk?.name || null);
        if (cryText) this.showCry(cryText, { family: profile.family, fxType: profile.fxType, type: sk?.type });
        const slash = fx
            ? fx.cast(el, profile, isSupport)
            : (() => {
                const node = document.createElement('div');
                node.className = `p5-atk-fx skfx skfx-cast ${isSupport ? 'cast' : 'slash'} ${profile.fxType} ${profile.slug} fam-${profile.family}`.trim();
                el.appendChild(node);
                return node;
            })();
        if (slash && !slash.parentElement) el.appendChild(slash);
        fxBits.push(slash);

        // Secondary cast layer (arc / aura) so the technique is readable
        if (!isSupport) {
            fxBits.push(fx ? fx.arc(el, profile) : this.spawnFxNode(el, `skfx skfx-arc ${profile.fxType} ${profile.slug} fam-${profile.family}`.trim(), 560));
        }

        const targets = [];
        if (sk?.aoe && sk.power) {
            const foes = actor?.side === 'enemy' ? this.state.party : this.state.enemies;
            BattleEngine.living(foes).forEach(t => targets.push(t.id));
        } else if (action.targetId) {
            targets.push(action.targetId);
        } else if (isSupport && (sk?.aoeHeal || sk?.partyBuff)) {
            BattleEngine.living(this.state.party).forEach(t => targets.push(t.id));
        } else if (isSupport && action.targetId) {
            targets.push(action.targetId);
        } else if (isSupport && actor) {
            targets.push(actor.id);
        }

        const bolts = [];
        if (profile.projectile && targets.length) {
            const firstTgt = this.fighterEl(targets[0], this.targetSide(actor, isSupport, sk));
            const aBox = el.getBoundingClientRect();
            const tBox = firstTgt?.getBoundingClientRect();
            const dx = tBox ? (tBox.left + tBox.width / 2) - (aBox.left + aBox.width / 2) : (actor?.side === 'ally' ? 140 : -140);
            const dy = tBox ? (tBox.top + tBox.height * 0.35) - (aBox.top + aBox.height * 0.4) : -30;
            bolts.push(fx ? fx.bolt(el, profile, Math.round(dx * 0.78), Math.round(dy * 0.78)) : (() => {
                const bolt = document.createElement('div');
                bolt.className = `skfx skfx-bolt ${profile.fxType} ${profile.slug} fam-${profile.family}`.trim();
                bolt.style.setProperty('--skfx-dx', `${Math.round(dx * 0.78)}px`);
                bolt.style.setProperty('--skfx-dy', `${Math.round(dy * 0.78)}px`);
                el.appendChild(bolt);
                return bolt;
            })());
            for (let i = 0; i < 2; i++) {
                const tdx = Math.round(dx * (0.45 + i * 0.15));
                const tdy = Math.round(dy * (0.45 + i * 0.15));
                const delay = 40 + i * 35;
                bolts.push(fx
                    ? fx.bolt(el, profile, tdx, tdy, { trail: true, delay })
                    : (() => {
                        const node = document.createElement('div');
                        node.className = `skfx skfx-bolt-trail ${profile.fxType} fam-${profile.family}`.trim();
                        node.style.setProperty('--skfx-dx', `${tdx}px`);
                        node.style.setProperty('--skfx-dy', `${tdy}px`);
                        node.style.animationDelay = `${delay}ms`;
                        el.appendChild(node);
                        return node;
                    })());
            }
        }

        const motionImpactRatio = motion?.kind === 'awakening' ? .64
            : motion?.kind === 'finisher' ? .62
                : motion?.kind === 'barrage' ? .48
                    : motion?.kind === 'recovery' || motion?.kind === 'stance' ? .58
                        : .52;
        const impactAt = useRig
            ? Math.round(rigClip.duration * (rigClip.impact ?? .52))
            : (motion ? Math.round(motion.duration * motionImpactRatio) : (isSupport ? 280 : (profile.projectile ? 300 : 340)));
        const afterImpact = Math.max(
            isSupport ? 240 : (profile.hits > 3 ? 340 : 280),
            !useRig && motion ? motion.duration - impactAt + 90 : 0
        );
        await this.wait(impactAt);

        if (isSupport) {
            this.focusCamera(actor, profile, 'cast');
        } else {
            this.focusCamera(actor, profile, 'impact');
            this.shakeStage(profile.shake, profile.family === 'finisher' ? 480 : 300);
        }

        const hitCount = profile.hits;
        const applyHitFx = (tgt, tid, wave = 0) => {
            if (!tgt) return;
            tgt.classList.remove('hit-flash', 'hit-recoil', 'hit-stagger');
            void tgt.offsetWidth;
            tgt.classList.add('hit-flash', 'hit-recoil', 'hit-stagger');
            const targetSprite = tgt.querySelector('.p5-sprite');
            if (targetSprite) {
                targetSprite.classList.remove('is-idle');
                if (typeof SkelBattleBridge !== 'undefined' && targetSprite.classList.contains('p5-skel')) {
                    SkelBattleBridge.playHit(targetSprite).catch(() => {});
                } else if (typeof BattleRig !== 'undefined') {
                    if (targetSprite.classList.contains('p5-rig')) BattleRig.pose(targetSprite, 'recoil', 420);
                    else BattleRig.stopIdle(targetSprite);
                }
            }
            if (sk?.type && sk.power) tgt.classList.add(`hit-${sk.type}`);
            if (fx) fx.impact(tgt, profile, hitCount > 1);
            else this.spawnFxNode(tgt, `p5-impact skfx skfx-impact ${profile.fxType} ${profile.slug} fam-${profile.family} ${hitCount > 1 ? 'multi' : ''}`.trim(), 560);
            if (profile.rings) {
                for (let r = 0; r < profile.rings; r++) {
                    setTimeout(() => {
                        if (fx) fx.ring(tgt, profile);
                        else this.spawnFxNode(tgt, `skfx skfx-ring pop ${profile.fxType} fam-${profile.family}`.trim(), 520);
                    }, r * 70 + wave * 40);
                }
            }
            for (let s = 0; s < Math.min(profile.sparks, 6); s++) {
                setTimeout(() => {
                    const ang = (s / 6) * Math.PI * 2 + wave * 0.4;
                    const sx = Math.round(Math.cos(ang) * (28 + s * 6));
                    const sy = Math.round(Math.sin(ang) * (22 + s * 5));
                    if (fx) fx.spark(tgt, profile, sx, sy);
                    else {
                        const spark = this.spawnFxNode(tgt, `skfx skfx-spark ${profile.fxType} fam-${profile.family}`.trim(), 380);
                        if (spark) {
                            spark.style.setProperty('--skfx-sx', `${sx}px`);
                            spark.style.setProperty('--skfx-sy', `${sy}px`);
                        }
                    }
                }, s * 28 + wave * 50);
            }
            if (profile.family === 'blade' || profile.fxType === 'slash') {
                if (fx) fx.cut(tgt, profile);
                else this.spawnFxNode(tgt, `skfx skfx-cut ${profile.fxType} ${profile.slug}`.trim(), 420);
            }
            if (fx && (profile.family === 'inferno' || profile.family === 'lightning' || profile.family === 'blade')) {
                fx.spriteBurst(tgt, profile);
            }
        };

        targets.forEach(tid => {
            const tgt = this.fighterEl(tid, this.targetSide(actor, isSupport, sk));
            if (isSupport) {
                this.applySupportFx(tgt, profile, profile.supportMode);
                return;
            }
            applyHitFx(tgt, tid, 0);
            if (hitCount > 2) {
                for (let i = 1; i < Math.min(hitCount, 6); i++) {
                    setTimeout(() => applyHitFx(tgt, tid, i), i * 68);
                }
            }
        });

        if (isSupport) {
            if (fx) fx.supportImpact(this.root.querySelector('#battle-fx') || this.root, profile, profile.supportMode, 700);
        } else if (profile.aoePulse) {
            if (fx) fx.aoePulse(this.root, profile);
            else {
                const layer = this.root.querySelector('#battle-fx');
                if (layer) {
                    layer.className = `p5-fx flash-${profile.fxType} aoe show skfx-aoe fam-${profile.family}`;
                    setTimeout(() => { layer.className = 'p5-fx'; }, 560);
                }
            }
        } else if (sk?.type || profile.fxType) {
            if (fx) fx.typeFlash(this.root, sk?.type || profile.fxType);
            else {
                const layer = this.root.querySelector('#battle-fx');
                if (layer) {
                    layer.className = `p5-fx flash-${sk?.type || profile.fxType} show`;
                    setTimeout(() => { layer.className = 'p5-fx'; }, 480);
                }
            }
        }

        if (rigRun) await rigRun;
        else await this.wait(afterImpact);

        if (this._atkFrameTimer) { clearInterval(this._atkFrameTimer); this._atkFrameTimer = null; }
        if (typeof BattleMotion !== 'undefined') BattleMotion.stop(el);
        ghosts.forEach(g => g.remove());
        bolts.forEach(b => b.remove());
        fxBits.forEach(n => n?.remove?.());
        if (spr) {
            if (useRig) {
                const restoreForm = sk?.transform ? 'transform' : this.formKind(actor);
                await BattleRig.setForm(spr, restoreForm);
                if (sk?.transform) this.renderedForms[`${actor.side}:${actorId}`] = restoreForm;
            } else {
                // Keep transform art visible after cast; engine applies transformed=true next.
                const restoreKind = sk?.transform ? 'transform' : this.formKind(actor);
                const restore = this.spriteBg(actorId, restoreKind);
                if (typeof BattleRig !== 'undefined') await BattleRig.setImage(spr, restore);
                else spr.style.backgroundImage = restore;
                if (sk?.transform) this.renderedForms[`${actor.side}:${actorId}`] = 'transform';
            }
        }
        this.resetCameraPose(profile.family === 'finisher' ? 380 : 260);
        el.classList.remove(kind, 'transforming', typeClass, `fx-${profile.family}`);
        if (skillClass) el.classList.remove(skillClass);
        this.root.querySelectorAll('.hit-flash, .hit-recoil, .hit-stagger').forEach(n => n.classList.remove('hit-flash', 'hit-recoil', 'hit-stagger'));
        this.root.querySelectorAll('[class*="hit-"]').forEach(n => {
            [...n.classList].filter(c => c.startsWith('hit-') && c !== 'hit-flash' && c !== 'hit-recoil' && c !== 'hit-stagger').forEach(c => n.classList.remove(c));
        });
        if (spr?.classList.contains('p5-skel') && typeof SkelBattleBridge !== 'undefined') {
            SkelBattleBridge.startIdle(spr);
        } else if (spr?.classList.contains('p5-rig') && typeof BattleRig !== 'undefined') {
            BattleRig.startIdle(spr);
        } else if (spr) {
            spr.classList.add('is-idle');
        }
    },

    showDamageFloats(hits) {
        let dealt = 0;
        let landed = 0;
        hits.forEach((h, i) => {
            const fighter = this.fighterEl(h.id, h.side);
            if (!fighter) return;
            const n = document.createElement('div');
            const affinity = h.affinity || h.tag;
            n.className = `p5-dmg ${affinity === 'WEAK' ? 'weak' : ''} ${affinity === 'RESIST' ? 'resist' : ''} ${h.crit ? 'crit' : ''} ${h.tag === 'NULL' ? 'null' : ''}`;
            n.innerHTML = h.tag === 'NULL'
                ? '<b>NULO</b>'
                : `${h.crit ? '<b>¡CRÍTICO!</b>' : ''}${affinity === 'WEAK' ? '<b>¡DÉBIL!</b>' : ''}${affinity === 'RESIST' ? '<b>RESISTE</b>' : ''}<span>${Number(h.damage || 0).toLocaleString('es-ES')}</span>`;
            fighter.appendChild(n);
            setTimeout(() => n.remove(), 900 + i * 40);
            if (h.tag !== 'NULL' && h.damage > 0) {
                dealt += h.damage;
                landed += 1;
            }
        });
        if (landed > 0) {
            this.chainCount = (this.chainCount || 0) + landed;
            this.flashChain(this.chainCount, dealt);
        }
    },

    /** Play impact/death SFX timed to the IMPACT phase (engine stays quiet when _sfxFromUi). */
    playImpactAudio(hits, profile) {
        if (!hits?.length) return;
        let playedDeath = false;
        hits.forEach((h, i) => {
            const delay = i * 55;
            setTimeout(() => {
                if (h.tag === 'NULL') {
                    AudioManager.combat.impact('null');
                    return;
                }
                const unit = this.unitForId(h.id, h.side);
                if (unit && (unit.hp <= 0 || unit.isDead)) {
                    if (!playedDeath) {
                        playedDeath = true;
                        AudioManager.combat.death({ heavy: profile?.family === 'finisher' });
                    }
                    return;
                }
                if (h.tag === 'WEAK') AudioManager.combat.impact('weak', { crit: h.crit });
                else if (h.crit) AudioManager.combat.impact('crit', { crit: true });
                else AudioManager.combat.impact('hit');
            }, delay);
        });
        if (this.state?.downedEnemies?.size && hits.some(h => h.tag !== 'NULL')) {
            const anyDown = hits.some(h => {
                const u = this.unitForId(h.id, h.side);
                return u && u.down;
            });
            if (anyDown) setTimeout(() => AudioManager.combat.impact('down'), 80);
        }
    },

    runWithUiSfx(fn) {
        if (!this.state) return fn();
        this.state._sfxFromUi = true;
        try {
            return fn();
        } finally {
            this.state._sfxFromUi = false;
        }
    },

    flashChain(chain, totalDmg) {
        const chainEl = this.root?.querySelector('#p5-chain');
        const dmgEl = this.root?.querySelector('#p5-dmg-total');
        if (chainEl && chain > 1) {
            const mult = (1 + Math.min(chain, 12) * 0.08).toFixed(1);
            chainEl.hidden = false;
            chainEl.textContent = `${chain} Cadena ×${mult}`;
            chainEl.classList.remove('pop');
            void chainEl.offsetWidth;
            chainEl.classList.add('pop');
            clearTimeout(this._chainHide);
            this._chainHide = setTimeout(() => {
                if (chainEl) chainEl.hidden = true;
            }, 1400);
        }
        if (dmgEl && totalDmg > 0) {
            dmgEl.hidden = false;
            dmgEl.textContent = `Daño total: ${totalDmg.toLocaleString('es-ES')}`;
            dmgEl.classList.remove('pop');
            void dmgEl.offsetWidth;
            dmgEl.classList.add('pop');
            clearTimeout(this._dmgHide);
            this._dmgHide = setTimeout(() => {
                if (dmgEl) dmgEl.hidden = true;
            }, 1600);
        }
    },

    showCry(text, opts = {}) {
        const cry = this.root?.querySelector('#battle-cry');
        if (!cry || !text) return;
        const family = opts.family || '';
        const fxType = opts.fxType || opts.type || '';
        cry.textContent = text;
        cry.className = `p5-cry show ${family ? `fam-${family}` : ''} ${fxType ? `type-${fxType}` : ''}`.trim();
        void cry.offsetWidth;
        cry.classList.add('show');
    },

    async announceAction(actor, action, sk) {
        const banner = this.root?.querySelector('#p5-action-banner');
        if (!banner || !actor) return this.wait(80);
        const profile = this.skillFxProfile(sk, action);
        let title = '';
        let detail = '';
        let tag = 'ACCIÓN';
        if (action.type === 'guard') {
            title = `${actor.name} se defiende`;
            detail = 'Menos daño este turno';
            tag = 'GUARD';
        } else if (sk) {
            title = sk.name || 'Técnica';
            detail = `${this.fighterName(actor)} · ${sk.desc || BattleData.skillFacts(sk).slice(0, 1)[0] || BattleData.typeLabel(sk.type)}`;
            tag = profile.family === 'finisher' ? 'ULTIMATE'
                : (profile.family === 'heal' || profile.family === 'support' ? 'SUPPORT'
                    : (BattleData.typeLabel?.(sk.type) || sk.type || 'SKILL').toUpperCase());
        } else if (action.type === 'attack') {
            title = 'Ataque';
            detail = `${actor.name} · golpe básico`;
            tag = 'ATK';
        } else {
            title = `${actor.name} actúa`;
            detail = '';
        }
        const finisher = profile.family === 'finisher';
        banner.className = [
            'p5-action-banner', 'show',
            actor.side === 'enemy' ? 'foe' : 'ally',
            `fam-${profile.family || 'melee'}`,
            finisher ? 'is-ultimate' : ''
        ].filter(Boolean).join(' ');
        banner.innerHTML = `
            <div class="p5-action-face" style="background-image:${this.spriteBg(actor.id, this.formKind(actor))}"></div>
            <div class="p5-action-text">
                <em class="p5-action-tag">${tag}</em>
                <strong>${title}</strong>
                <span>${detail}</span>
            </div>
        `;

        await this.wait(finisher ? 280 : (actor.side === 'enemy' ? 240 : 180));
    },

    hideActionBanner() {
        const banner = this.root?.querySelector('#p5-action-banner');
        if (banner) {
            banner.classList.remove('show', 'is-ultimate');
            banner.innerHTML = '';
        }
    },

    async continueFlow() {
        if (!this.state || this.state.finished) return;
        let guard = 0;
        while (!this.state.finished && guard++ < 40) {
            const actor = BattleEngine.currentActor(this.state);
            if (!actor) { BattleEngine.startRound(this.state); this.render(); continue; }
            if (actor.side === 'ally') {
                this.hideActionBanner();
                this.chainCount = 0;
                // Training: refill SP so you can test every technique in one fight
                if (this.state.encounter?.training && actor.hp > 0) {
                    actor.sp = actor.maxSp;
                }
                this.setActionPhase('PLAYER_SELECTING');
                this.mode = 'command';
                this.render();
                return;
            }
            this.setActionPhase('ACTION_START');
            this.mode = 'enemy';
            this.render();
            const isDummy = actor.ai === 'dummy' || actor.id === 'dummy' || this.state.encounter?.training;
            await this.wait(isDummy ? 120 : 380);

            if (actor.down) {
                this.state.log.push(`${actor.name} se levanta.`);
                actor.down = false;
                this.state.downedEnemies?.delete?.(actor.id);
                this.showCry(`${actor.name} se levanta!`);
                await this.wait(450);
                BattleEngine.advanceTurn(this.state);
                this.render();
                continue;
            }

            const decision = BattleAI.choose(actor, this.state.enemies, this.state.party, this.state);
            if (!decision || !decision.skill) {
                if (isDummy) this.state.log.push(`${actor.name} no hace nada.`);
                BattleEngine.advanceTurn(this.state);
                this.render();
                await this.wait(isDummy ? 80 : 220);
                continue;
            }
            if (!(actor.skills || []).find(s => s.id === decision.skill.id)) {
                actor.skills = actor.skills || [];
                actor.skills.push(decision.skill);
            }

            const sk = decision.skill;
            const action = {
                type: 'skill',
                skillId: sk.id,
                targetId: decision.target?.id,
                skillName: sk.name,
                skillType: sk.type,
                power: sk.power,
                cry: sk.cry || `${sk.name}!`,
                aoe: sk.aoe,
                transform: sk.transform
            };

            this.setActionPhase((sk && !sk.power) ? 'CASTING' : 'ATTACKING');
            await this.announceAction(actor, action, sk);
            action.actorSide = actor.side;
            await this.playAttackAnim(actor.id, action, actor);
            const before = this.captureVitals();
            const result = this.runWithUiSfx(() => BattleEngine.execute(this.state, actor, action));
            this.checkCombatAchievements(result);
            if (result.transformed) this.render();
            if (!result.ok) {
                const forced = this.runWithUiSfx(() => BattleEngine.execute(this.state, actor, {
                    type: 'attack',
                    targetId: decision.target?.id
                }));
                if (forced?.hits?.length) {
                    this.playImpactAudio(forced.hits, this.skillFxProfile(null, { type: 'attack' }));
                    this.showDamageFloats(forced.hits);
                }
                this.state.log.push(...(forced?.logs || result.logs || []));
                if (forced?.transformed) this.render();
                this.setActionPhase('DEATH_CHECK');
                this.playDeathFx([
                    ...(forced?.hits || []).map(h => h.id),
                    ...(result.hits || []).map(h => h.id)
                ]);
                await this.wait(220);
            } else if (result.hits?.length) {
                this.setActionPhase('IMPACT');
                this.playImpactAudio(result.hits, this.skillFxProfile(sk, action));
                this.showDamageFloats(result.hits);
                if (result.armorBreak) {
                    this.showCry('¡CORAZA ROTA!', { family: 'transform', fxType: 'support' });
                    this.render();
                }
                await this.animateVitalsFrom(before, [...result.hits.map(h => h.id), actor.id]);
                this.setActionPhase('DEATH_CHECK');
                this.playDeathFx((result.hits || []).map(h => h.id));
                await this.wait(220);
            } else {
                await this.animateVitalsFrom(before, [actor.id]);
                this.setActionPhase('DAMAGE_APPLIED');
                await this.wait(180);
            }
            this.hideActionBanner();
            this.setActionPhase('NEXT_TURN');
            BattleEngine.advanceTurn(this.state);
            this.render();
            if (this.state.finished) { await this.wait(700); this.showResult(this.state.victory); return; }
            await this.wait(280);
        }
        this.setActionPhase('PLAYER_SELECTING');
        this.mode = 'command';
        this.render();
    },

    afterAction(result, advance) {
        this.checkCombatAchievements(result);
        this.render();
        if (this.state.finished) { setTimeout(() => this.showResult(this.state.victory), 600); return; }
        if (advance !== false) BattleEngine.advanceTurn(this.state);
        this.setActionPhase('PLAYER_SELECTING');
        this.mode = 'command';
        this.render();
        setTimeout(() => this.continueFlow(), 350);
    },

    checkCombatAchievements(result) {
        if (!result || result.ok === false) return;
        if (result.transformed) Achievements.show('first_transform');
        if (result.finisher?.length) Achievements.show('finisher');
        if (result.hits?.some(hit => hit.crit)) Achievements.show('critical_hit');
        if (result.hits?.some(hit => hit.tag === 'WEAK' || hit.affinity === 'WEAK')) Achievements.show('weakness_exploited');
        if ((this.state?.turnCount || 0) >= 10) Achievements.show('long_battle');
    },

    showResult(victory) {
        // Skel victory / defeat poses before result card
        if (typeof SkelBattleBridge !== 'undefined' && this.root) {
            this.root.querySelectorAll('.p5-fighter.ally .p5-skel').forEach((spr) => {
                if (victory) SkelBattleBridge.playVictory(spr).catch(() => {});
                else SkelBattleBridge.playDeath(spr).catch(() => {});
            });
        }
        Object.values(this.spriteTimers).forEach(clearInterval);
        const enc = this.state.encounter;
        let mission = null;
        if (victory) {
            Achievements.show('first_victory');
            if (this.state.party.some(unit => unit.hp > 0 && unit.hp / unit.maxHp < 0.15)) {
                Achievements.show('last_stand');
            }
            mission = GameManager.onBattleVictory(enc, this.state.runKey);
            if (enc.isBoss || mission?.isFinal) {
                this.playBossVictory().then(() => {
                    document.getElementById('game-container').classList.remove('persona-mode');
                    GameManager.endHunt();
                    GameState.set('storyComplete', true);
                    const inv = GameState.get('invocations') || 0;
                    const meta = GameState.get('metaphorTickets') || 0;
                    DialogueScene.open({
                        title: 'VICTORIA DE HISTORIA',
                        lines: [
                            { speaker: 'Sistema', text: mission?.rewardText || 'DESTINY HAS BEEN DEFEATED.' },
                            { speaker: 'Narrador', text: `Tienes ${meta} tiradas Metaphor (rojas). Conviértelas en el banner Metaphor. Las INV se compran con Chikistrites (${typeof GameState.chikiPerInv === 'function' ? GameState.chikiPerInv() : 160} = 1).` },
                            { speaker: 'Sistema', text: 'Gasta las tiradas rojas en el banner Metaphor. Ahí sale el juego.' }
                        ],
                        onComplete: () => SceneManager.goTo('gacha')
                    });
                });
                return;
            }
        }
        const result = document.createElement('div');
        const invGain = victory
            ? (typeof GameManager !== 'undefined' && GameManager.lastInvGain
                ? GameManager.lastInvGain()
                : 0)
            : 0;
        const chikiGain = victory && typeof GameManager !== 'undefined' && GameManager.lastChikiGain
            ? GameManager.lastChikiGain()
            : 0;
        const metaGain = victory && typeof GameManager !== 'undefined' && GameManager.lastMetaGain
            ? GameManager.lastMetaGain()
            : 0;
        const invTotal = GameState.get('invocations') || 0;
        const chikiTotal = GameState.get('chikistrites') || 0;
        const metaTotal = GameState.get('metaphorTickets') || 0;
        const rate = (typeof GameState.chikiPerInv === 'function') ? GameState.chikiPerInv() : 160;
        const repeatNote = victory && GameManager._lastWasRepeat
            ? '<p class="text-body br-repeat">Ya limpiaste este combate — farm ligero de Chikistrites.</p>'
            : '';
        const chips = [];
        if (chikiGain > 0) {
            chips.push(`<div class="br-chip is-chiki"><span>Chiki</span><strong>+${chikiGain.toLocaleString('es-ES')}</strong><em>${chikiTotal.toLocaleString('es-ES')} total</em></div>`);
        }
        if (invGain > 0) {
            chips.push(`<div class="br-chip is-inv"><span>≈ INV</span><strong>${invGain}</strong><em>${rate} Chiki = 1</em></div>`);
        }
        if (metaGain > 0) {
            chips.push(`<div class="br-chip is-meta"><span>Metaphor</span><strong>+${metaGain}</strong><em>${metaTotal} total</em></div>`);
        } else if (!chips.length) {
            chips.push(`<div class="br-chip"><span>Chiki</span><strong>${chikiTotal.toLocaleString('es-ES')}</strong><em>en cartera</em></div>`);
            chips.push(`<div class="br-chip is-inv"><span>INV</span><strong>${invTotal}</strong><em>listas</em></div>`);
        }
        const faces = (this.state?.party || []).slice(0, 4).map(p => `
            <div class="br-face ${p.hp <= 0 ? 'down' : ''}" style="background-image:${this.spriteBg(p.id, this.formKind(p))}" title="${p.name}"></div>
        `).join('');
        const walletChips = `
            <div class="br-chips">
                <div class="br-chip is-chiki"><span>Chiki</span><strong>${chikiTotal.toLocaleString('es-ES')}</strong><em>en cartera</em></div>
                <div class="br-chip is-inv"><span>INV</span><strong>${invTotal}</strong><em>listas</em></div>
                ${metaTotal > 0 ? `<div class="br-chip is-meta"><span>Metaphor</span><strong>${metaTotal}</strong><em>tiradas rojas</em></div>` : ''}
            </div>
        `;
        result.className = `game-result active battle-result ${victory ? 'is-win' : 'is-lose'}`;
        result.innerHTML = victory ? `
            <div class="br-panel">
                <p class="battle-kicker">VICTORIA</p>
                <h2 class="title-main br-title">COMBATE SUPERADO</h2>
                <div class="br-faces">${faces}</div>
                <p class="text-body">${mission?.rewardText || 'El Destino anota tu victoria.'}</p>
                <div class="br-chips">${chips.join('')}</div>
                ${repeatNote}
                <div class="br-actions">
                    <button class="btn-destiny" id="btn-battle-gacha">IR AL CONVENIO</button>
                    <button class="btn-secondary" id="btn-battle-next">VOLVER A LA ARENA</button>
                </div>
            </div>
        ` : `
            <div class="br-panel">
                <p class="battle-kicker">DERROTA</p>
                <h2 class="title-main br-title">HAS CAÍDO</h2>
                <div class="br-faces">${faces}</div>
                <p class="text-body">Te han destrozado. Cambia el equipo, reintenta con el mismo, o refuerza el roster en el Convenio.</p>
                ${walletChips}
                <div class="br-actions">
                    <button class="btn-destiny" id="btn-battle-reteam">CAMBIAR EQUIPO</button>
                    <button class="btn-secondary" id="btn-battle-retry">REINTENTAR</button>
                    <button class="btn-secondary" id="btn-battle-gacha-lose">IR AL CONVENIO</button>
                    <button class="btn-secondary" id="btn-battle-back">VOLVER A LA ARENA</button>
                </div>
            </div>
        `;
        document.getElementById('game-container').appendChild(result);
        (victory ? AudioManager.ui.victory() : AudioManager.combat.death({ heavy: true }));
        this.shakeStage(victory ? 8 : 14, victory ? 420 : 560);
        const leave = (scene) => {
            document.getElementById('game-container').classList.remove('persona-mode');
            GameManager.currentMissionId = null;
            GameState.set('pendingMission', null);
            GameManager.endHunt();
            SceneManager.goTo(scene);
        };
        if (victory) {
            result.querySelector('#btn-battle-next').onclick = () => leave('arena');
            result.querySelector('#btn-battle-gacha').onclick = () => leave('gacha');
        } else {
            result.querySelector('#btn-battle-reteam').onclick = () => {
                result.remove();
                this.goToPartySelect();
            };
            result.querySelector('#btn-battle-retry').onclick = () => {
                result.remove();
                this.startBattle(this.state.runKey, this.state.party.map(p => p.id));
            };
            result.querySelector('#btn-battle-gacha-lose').onclick = () => leave('gacha');
            result.querySelector('#btn-battle-back').onclick = () => leave('arena');
        }
    },

    async playBossVictory() {
        const overlay = document.createElement('div');
        overlay.className = 'boss-victory-overlay';
        overlay.innerHTML = `<div class="boss-counter" id="boss-counter">50 / 50</div>`;
        document.getElementById('game-container').appendChild(overlay);
        const counter = overlay.querySelector('#boss-counter');
        for (const n of [50, 51, 67, 83, 99, 100]) {
            await this.wait(380);
            counter.textContent = String(n);
            if (n === 100) { counter.classList.add('win'); ParticleSystem.burst(innerWidth / 2, innerHeight / 2, 90, '#f4d03f'); AudioManager.ui.victory(); }
        }
        await this.wait(800);
        overlay.innerHTML = `
            <h2 class="title-main">DESTINY HAS BEEN DEFEATED</h2>
            <p class="text-body">+${this.state.encounter.rewardInvocations} LIMITED DESTINY INVOCATION</p>
            <button class="btn-destiny" id="btn-boss-go">IR AL BANNER</button>
        `;
        return new Promise(r => overlay.querySelector('#btn-boss-go').onclick = r);
    },

    wait(ms) { return new Promise(r => setTimeout(r, ms)); }
};
