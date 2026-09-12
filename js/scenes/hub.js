/**
 * Hub = Konoha walkable village + calendar HUD (Persona loop)
 */
const HubScene = {
    render() {
        const el = document.createElement('div');
        el.className = 'scene hub-scene active';
        el.innerHTML = `
            <div class="hub-hud" id="hub-hud"></div>
            <div class="hub-world" id="hub-world"></div>
        `;
        return el;
    },

    enter(el) {
        AudioManager.setTheme('konoha');
        this.el = el;
        this.hud = el.querySelector('#hub-hud');
        this.world = el.querySelector('#hub-world');
        this.refreshHud();
        KonohaWorld.mount(this.world, {
            onInteract: (ent) => this.handleEntity(ent),
            onMapChange: () => this.refreshHud()
        });
    },

    exit() {
        KonohaWorld.unmount();
    },

    refresh() {
        this.refreshHud();
        KonohaWorld.rebuildEntities();
        KonohaWorld.resume();
    },

    refreshHud() {
        const h = Calendar.hud();
        const dayIntro = StoryData.dayIntros[h.day] || '';
        const stats = {
            atk: GameState.get('trainAtk') || 0,
            def: GameState.get('trainDef') || 0,
            agi: GameState.get('trainAgi') || 0,
            sp: GameState.get('trainSp') || 0
        };
        const mustMission = h.gatePending;
        const needBond = h.day >= 14 && !StoryData.bondRequirementMet();
        const weekday = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'][(h.day + 5) % 7];
        const dayNum = Calendar.START_DAY_NUM + h.day - 1;
        const monthNum = dayNum <= 30 ? 4 : 5;
        const dom = dayNum <= 30 ? dayNum : dayNum - 30;
        const slotPersona = h.slot === 'afternoon' ? 'After school' : 'Evening';

        this.hud.innerHTML = `
            <div class="hub-top">
                <div class="p5-cal">
                    <div class="p5-cal-date">${monthNum}/${dom} <span>${weekday}</span></div>
                    <div class="p5-cal-slot">${slotPersona}</div>
                    <div class="p5-cal-sub">${h.dateLabel} · Día ${h.day}/${Calendar.TOTAL_DAYS}</div>
                </div>
                <div class="hub-you">
                    <div class="hub-you-face" style="background-image:url('assets/characters/naruto.webp')"></div>
                    <div>
                        <strong>NARUTO UZUMAKI</strong>
                        <span id="hub-zone-name">Konoha · Phantom Destiny</span>
                    </div>
                </div>
                <div class="hub-stats">
                    <div class="hub-stat"><em>ATK</em><strong>+${stats.atk}</strong></div>
                    <div class="hub-stat"><em>DEF</em><strong>+${stats.def}</strong></div>
                    <div class="hub-stat"><em>AGI</em><strong>+${stats.agi}</strong></div>
                    <div class="hub-stat"><em>SP</em><strong>+${stats.sp}</strong></div>
                </div>
                <div class="hub-ap" title="Acciones esta franja">
                    <span class="hub-ap-label">AP</span>
                    ${Array.from({ length: h.actionsMax }, (_, i) =>
                        `<i class="hub-ap-pip ${i < h.actionsLeft ? 'on' : ''}"></i>`
                    ).join('')}
                </div>
                <button class="hub-clock-btn" id="btn-hub-advance" type="button" ${Calendar.canAdvance() ? '' : 'disabled'}>
                    ${h.slot === 'afternoon' ? 'NOCHE ▶' : (h.day >= Calendar.TOTAL_DAYS ? 'CLAVE ▶' : 'DORMIR ▶')}
                </button>
            </div>
            <p class="hub-intro">${dayIntro}</p>
            ${mustMission ? `<div class="hub-alert">Portal rojo: misión de historia (como en Persona).</div>` : ''}
            ${needBond ? `<div class="hub-alert soft">Necesitas Lazo Lv.3+ antes del final.</div>` : ''}
            ${!mustMission ? `<div class="hub-alert soft">Esta franja: ${h.actionsLeft}/${h.actionsMax} acciones · charlas gratis · Shift = correr</div>` : ''}
        `;
        this.hud.querySelector('#btn-hub-advance')?.addEventListener('click', () => this.doAdvance());
        const zone = this.hud.querySelector('#hub-zone-name');
        if (zone && typeof KonohaWorld !== 'undefined' && KonohaWorld.map) {
            zone.textContent = KonohaWorld.map.name;
        }
    },

    spendAction() {
        Calendar.markActionTaken();
    },

    withPause(fn) {
        KonohaWorld.pause();
        fn();
    },

    handleEntity(ent) {
        if (ent.kind === 'talk') {
            this.withPause(() => {
                DialogueScene.open({
                    title: ent.name,
                    portrait: ent.portrait || '',
                    lines: ent.lines || [{ speaker: ent.name, text: '…' }],
                    onComplete: () => KonohaWorld.resume()
                });
            });
            return;
        }

        if (ent.kind === 'bond') {
            if (ent.bondId === 'chiki' || ent.prop === 'mirror') {
                this.openWardrobe();
                return;
            }
            this.doBond(ent.bondId);
            return;
        }

        if (ent.kind === 'explore') {
            this.doExplore(ent.locId);
            return;
        }

        if (ent.kind === 'train') {
            this.openTrainMenu();
            return;
        }

        if (ent.kind === 'mission') {
            this.doMission(ent.missionId);
            return;
        }

        if (ent.kind === 'advance') {
            this.doAdvance();
        }
    },

    doExplore(locId) {
        if (!Calendar.hasAction()) {
            this.withPause(() => DialogueScene.open({
                lines: [{ speaker: 'Sistema', text: Calendar.mustDoMission()
                    ? 'Primero la misión de historia (portal rojo).'
                    : 'Sin AP esta franja. Avanza el tiempo (NOCHE/DORMIR) o explora charlando gratis.' }],
                onComplete: () => KonohaWorld.resume()
            }));
            return;
        }
        const text = Locations.exploreText(locId);
        const loc = Locations.get(locId);
        this.withPause(() => {
            DialogueScene.open({
                title: loc?.name || 'Explorar',
                lines: [
                    { speaker: 'Narrador', text },
                    { speaker: 'Sistema', text: `AP −1 · quedan ${Calendar.actionsLeft() - 1}/${Calendar.actionsMax()} esta franja.` }
                ],
                onComplete: () => {
                    this.spendAction();
                    GameState.set('exploreCount', (GameState.get('exploreCount') || 0) + 1);
                    GameState.addChikistrites(5);
                    this.refresh();
                }
            });
        });
    },

    openWardrobe() {
        const cur = OutfitData.currentId();
        const lines = [{
            speaker: 'Espejo Chiki',
            text: 'Vestuario de esta era. Sin spoilers. Elige look:',
            choices: OutfitData.list().map(o => {
                const locked = !OutfitData.isUnlocked(o.id);
                return {
                    text: locked ? `🔒 ${o.name}` : `${o.id === cur ? '✓ ' : ''}${o.name}`,
                    bond: 0,
                    onPick: () => {
                        if (!locked) OutfitData.equip(o.id);
                    }
                };
            })
        }];
        this.withPause(() => {
            DialogueScene.open({
                title: 'ESPEJO · VESTUARIO',
                portrait: 'assets/characters/sakura.webp',
                lines,
                onComplete: () => {
                    const o = OutfitData.current();
                    this.refreshHud();
                    DialogueScene.open({
                        lines: [{ speaker: 'Espejo Chiki', text: `Llevas: ${o.name}. ${o.blurb}` }],
                        onComplete: () => KonohaWorld.resume()
                    });
                }
            });
        });
    },

    doBond(bondId) {
        if (!Calendar.hasAction()) {
            this.withPause(() => DialogueScene.open({
                lines: [{ speaker: 'Sistema', text: Calendar.mustDoMission()
                    ? 'La historia llama. Ve al portal rojo primero.'
                    : 'Sin AP. Charla gratis sigue OK; lazos gastan 1 AP.' }],
                onComplete: () => KonohaWorld.resume()
            }));
            return;
        }
        const forceBondEvening = Calendar.getDay() >= Calendar.TOTAL_DAYS
            && Calendar.getSlot() === 'evening'
            && !StoryData.bondRequirementMet();
        // forceBondEvening still allows bonds

        const scene = BondData.nextRankScene(bondId);
        const char = BondData.get(bondId);
        if (!scene || !char) {
            this.withPause(() => DialogueScene.open({
                lines: [{ speaker: 'Sistema', text: 'Lazo al máximo. Solo queda pelear… o charlar sin subir rank.' }],
                onComplete: () => KonohaWorld.resume()
            }));
            return;
        }
        this.withPause(() => {
            DialogueScene.open({
                title: `LAZO · ${char.name}`,
                portrait: char.img,
                bondLevel: GameState.getBond(bondId),
                bondLabel: `Lv. ${GameState.getBond(bondId)} → ${scene.rank} · ${scene.title}`,
                lines: scene.lines,
                choices: scene.choices.map(c => ({
                    text: c.text,
                    onPick: () => GameState.addBond(bondId, c.bond || 1)
                })),
                onComplete: () => {
                    this.spendAction();
                    GameState.set('bondActions', (GameState.get('bondActions') || 0) + 1);
                    const lv = GameState.getBond(bondId);
                    DialogueScene.open({
                        portrait: char.img,
                        bondLevel: lv,
                        lines: [
                            { speaker: 'Sistema', text: `${char.name} — Lazo Lv. ${lv}/5` },
                            ...(lv >= (char.passiveAt || 3)
                                ? [{ speaker: 'Sistema', text: `Pasiva: ${char.passive.label}` }]
                                : [])
                        ],
                        onComplete: () => this.refresh()
                    });
                }
            });
        });
    },

    openTrainMenu() {
        if (!Calendar.hasAction()) {
            this.withPause(() => DialogueScene.open({
                lines: [{ speaker: 'Sistema', text: Calendar.mustDoMission()
                    ? 'Misión de historia primero.'
                    : 'Sin AP para entrenar esta franja.' }],
                onComplete: () => KonohaWorld.resume()
            }));
            return;
        }
        const forceBondEvening = Calendar.getDay() >= Calendar.TOTAL_DAYS
            && Calendar.getSlot() === 'evening'
            && !StoryData.bondRequirementMet();
        if (forceBondEvening) {
            this.withPause(() => DialogueScene.open({
                lines: [{ speaker: 'Sistema', text: 'Última noche: habla con alguien (Lazo), no entrenes.' }],
                onComplete: () => KonohaWorld.resume()
            }));
            return;
        }
        this.withPause(() => {
            DialogueScene.open({
                title: 'CAMPO DE ENTRENAMIENTO',
                lines: [{ speaker: 'Narrador', text: '¿Qué entrenas esta franja?' }],
                choices: [
                    { text: 'ATK — golpe duro', onPick: () => this.applyTrain('atk') },
                    { text: 'DEF — aguante', onPick: () => this.applyTrain('def') },
                    { text: 'AGI — velocidad', onPick: () => this.applyTrain('agi') },
                    { text: 'SP — meditar', onPick: () => this.applyTrain('sp') }
                ],
                onComplete: () => {
                    KonohaWorld.resume();
                }
            });
        });
    },

    applyTrain(stat) {
        const key = ({ atk: 'trainAtk', def: 'trainDef', agi: 'trainAgi', sp: 'trainSp' })[stat];
        const cap = 12;
        const cur = GameState.get(key) || 0;
        if (cur >= cap) {
            DialogueScene.open({
                lines: [{ speaker: 'Sistema', text: 'Ese stat ya está al tope.' }],
                onComplete: () => this.refresh()
            });
            return;
        }
        GameState.set(key, cur + 1);
        GameState.set('trainCount', (GameState.get('trainCount') || 0) + 1);
        this.spendAction();
        DialogueScene.open({
            title: 'ENTRENAMIENTO',
            lines: [
                { speaker: 'Narrador', text: `${stat.toUpperCase()} +1 → ${cur + 1}/${cap}. Sudor de verdad.` },
                { speaker: 'Sistema', text: 'Bonus listo para el próximo combate Persona.' }
            ],
            onComplete: () => this.refresh()
        });
    },

    doMission(missionId) {
        const mission = StoryData.missions[missionId];
        if (!mission) return;
        if (mission.optional && (!Calendar.hasAction() || Calendar.mustDoMission())) {
            this.withPause(() => DialogueScene.open({
                lines: [{ speaker: 'Sistema', text: 'Combate opcional bloqueado ahora (sin AP o hay misión forzada).' }],
                onComplete: () => KonohaWorld.resume()
            }));
            return;
        }
        GameState.set('pendingMission', missionId);
        if (mission.optional) this.spendAction();
        this.withPause(() => {
            DialogueScene.open({
                title: mission.title,
                lines: [
                    { speaker: 'Sistema', text: mission.blurb },
                    { speaker: 'Narrador', text: 'Combate por turnos estilo Persona. Elige 3. Debilidades. Transforms.' }
                ],
                onComplete: () => {
                    KonohaWorld.unmount();
                    GameManager.startMission(mission.encounter, missionId);
                }
            });
        });
    },

    doAdvance() {
        const res = Calendar.advanceSlot();
        AudioManager.ui.click();
        this.withPause(() => {
            if (!res.ok) {
                DialogueScene.open({
                    lines: [{ speaker: 'Sistema', text: res.reason || 'No puedes avanzar aún.' }],
                    onComplete: () => { KonohaWorld.resume(); this.refreshHud(); }
                });
                return;
            }
            if (res.finished || (res.day >= Calendar.TOTAL_DAYS && GameState.flag('gate_final_cleared') && res.finished)) {
                this.tryFinale();
                return;
            }
            // evening advance on last day when finished flag
            if (res.finished) {
                this.tryFinale();
                return;
            }
            const lines = [];
            if (res.advancedDay) {
                lines.push({ speaker: 'Narrador', text: `Amanece en Konoha. ${Calendar.dateLabel(res.day)}.` });
                if (res.unlocks?.length) {
                    res.unlocks.forEach(id => {
                        const loc = Locations.get(id);
                        if (loc) lines.push({ speaker: 'Sistema', text: `Nueva zona abierta: ${loc.name}` });
                    });
                }
                lines.push({ speaker: 'Narrador', text: StoryData.dayIntros[res.day] || 'Otro día.' });
            } else {
                lines.push({ speaker: 'Narrador', text: 'La noche tiñe el pueblo de rojo Persona.' });
            }
            DialogueScene.open({
                lines,
                onComplete: () => this.refresh()
            });
        });
    },

    tryFinale() {
        if (!GameState.flag('gate_final_cleared')) {
            DialogueScene.open({
                lines: [{ speaker: 'Sistema', text: 'Aún no has derrotado a THE 50/50.' }],
                onComplete: () => this.refresh()
            });
            return;
        }
        if (!StoryData.bondRequirementMet()) {
            DialogueScene.open({
                lines: [
                    { speaker: 'Sistema', text: 'Necesitas Lazo Lv.3+. Habla con alguien en el pueblo.' }
                ],
                onComplete: () => this.refresh()
            });
            return;
        }
        GameState.set('storyComplete', true);
        KonohaWorld.unmount();
        DialogueScene.open({
            title: 'EPÍLOGO',
            lines: [
                { speaker: 'Narrador', text: 'Has caminado Konoha. Has hablado. Has peleado.' },
                { speaker: 'Sistema', text: 'Convenio Legendario…' }
            ],
            onComplete: () => SceneManager.goTo('legendary')
        });
    }
};
