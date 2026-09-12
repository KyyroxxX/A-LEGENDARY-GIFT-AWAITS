const EquipmentSystem = {
    ITEMS: {
        fragmento_sombrero: { name: 'Fragmento del Sombrero', series: 'One Piece', icon: 'assets/equipment/fragmento-sombrero.svg', effect: 'heal', value: 0.28, desc: 'Restaura 28% del HP máximo.' },
        den_den_mushi: { name: 'Den Den Mushi', series: 'One Piece', icon: 'assets/equipment/den-den-mushi.svg', effect: 'tempo', value: 28, desc: 'Recupera 28 CP y otorga +12% AGI durante 3 turnos.' },
        cartel_recompensa: { name: 'Cartel de recompensa', series: 'One Piece', icon: 'assets/equipment/cartel-recompensa.svg', effect: 'crit', value: 0.16, desc: '+16% de crítico durante 3 turnos.' },
        log_pose: { name: 'Log Pose', series: 'One Piece', icon: 'assets/equipment/log-pose.svg', effect: 'focus', value: 0.22, desc: '+22% ATK durante 3 turnos.' },
        kunai_oxidado: { name: 'Kunai oxidado', series: 'Naruto', icon: 'assets/equipment/kunai-oxidado.svg', effect: 'bleed', value: 0.06, desc: 'Aplica una herida: 6% del HP máximo enemigo durante 3 turnos.' },
        pergamino_vacio: { name: 'Pergamino vacío', series: 'Naruto', icon: 'assets/equipment/pergamino-vacio.svg', effect: 'sp', value: 42, desc: 'Recupera 42 CP.' },
        banda_ninja_rota: { name: 'Banda ninja rota', series: 'Naruto', icon: 'assets/equipment/banda-ninja.svg', effect: 'agi', value: 0.2, desc: '+20% AGI durante 3 turnos.' },
        sello_explosivo: { name: 'Sello explosivo', series: 'Naruto', icon: 'assets/equipment/sello-explosivo.svg', effect: 'blast', value: 0.12, desc: 'Golpea al enemigo por 12% de su HP máximo.' },
        fragmento_stand: { name: 'Fragmento Stand', series: 'JoJo', icon: 'assets/equipment/fragmento-stand.svg', effect: 'shield', value: 0.22, desc: 'Reduce 22% del daño recibido durante 3 turnos.' },
        flecha_rota: { name: 'Flecha rota', series: 'JoJo', icon: 'assets/equipment/flecha-rota.svg', effect: 'pierce', value: 0.18, desc: '+18% de daño durante 3 turnos.' },
        disco_memoria: { name: 'Disco de memoria', series: 'JoJo', icon: 'assets/equipment/disco-memoria.svg', effect: 'cleanse', value: 1, desc: 'Limpia debilitaciones y recupera 20 CP.' },
        reloj_arena: { name: 'Reloj de arena', series: 'JoJo', icon: 'assets/equipment/reloj-arena.svg', effect: 'skip', value: 1, desc: 'Ralentiza al enemigo: -25% AGI durante 3 turnos.' },
        zanpakuto_rosa: { name: 'Zanpakutō rosa', series: 'Bleach', icon: 'assets/equipment/zanpakuto-rosa.svg', effect: 'bleed', value: 0.08, desc: 'Corta el flujo enemigo: 8% de HP máximo durante 3 turnos.' },
        gikon: { name: 'Gikon', series: 'Bleach', icon: 'assets/equipment/gikon.svg', effect: 'revive', value: 0.28, desc: 'Si caes, evita el K.O. una vez con 28% de HP.' },
        alma_fragmentada: { name: 'Alma fragmentada', series: 'Bleach', icon: 'assets/equipment/alma-fragmentada.svg', effect: 'party_heal', value: 0.16, desc: 'Restaura 16% de HP a todo el equipo.' },
        hueco_mundo_scrap: { name: 'Hueco Mundo scrap', series: 'Bleach', icon: 'assets/equipment/hueco-mundo.svg', effect: 'drain', value: 0.1, desc: 'Drena 10% de HP enemigo y lo convierte en curación.' },
        talisman_roto: { name: 'Talismán roto', series: 'Jujutsu Kaisen', icon: 'assets/equipment/talisman-roto.svg', effect: 'cleanse', value: 1, desc: 'Limpia todos los estados negativos y da 24 CP.' },
        dedo_maldito: { name: 'Dedo maldito (réplica)', series: 'Jujutsu Kaisen', icon: 'assets/equipment/dedo-maldito.svg', effect: 'focus', value: 0.3, desc: '+30% ATK durante 2 turnos, pero recibes +8% daño.' },
        cuerda_negra: { name: 'Cuerda negra', series: 'Jujutsu Kaisen', icon: 'assets/equipment/cuerda-negra.svg', effect: 'break', value: 0.2, desc: 'Debilita la DEF enemiga un 20% durante 3 turnos.' },
        chispa_esperanza: { name: 'Chispa de esperanza', series: 'Metaphor', icon: 'assets/equipment/chispa-esperanza.svg', effect: 'party_sp', value: 18, desc: 'Recupera 18 CP a todo el equipo.' },
        nota_viaje: { name: 'Nota de viaje', series: 'Metaphor', icon: 'assets/equipment/nota-viaje.svg', effect: 'agi', value: 0.25, desc: '+25% AGI durante 3 turnos.' },
        moneda_tribes: { name: 'Moneda de Tribes', series: 'Metaphor', icon: 'assets/equipment/moneda-tribes.svg', effect: 'luck', value: 0.18, desc: '+18% de crítico durante 3 turnos.' },
        mascara_tengu: { name: 'Máscara tengu rota', series: 'Kimetsu no Yaiba', icon: 'assets/equipment/mascara-tengu.svg', effect: 'focus', value: 0.24, desc: '+24% ATK durante 3 turnos.' },
        nichirin_mellada: { name: 'Nichirin mellada', series: 'Kimetsu no Yaiba', icon: 'assets/equipment/nichirin-mellada.svg', effect: 'pierce', value: 0.15, desc: '+15% de daño e ignora parte de la defensa.' },
        talisman_ubuyashiki: { name: 'Talismán de Ubuyashiki', series: 'Kimetsu no Yaiba', icon: 'assets/equipment/talisman-ubuyashiki.svg', effect: 'party_heal', value: 0.12, desc: 'Restaura 12% de HP a todo el equipo.' },
        cordon_oxidado: { name: 'Cordón oxidado', series: 'Chainsaw Man', icon: 'assets/equipment/cordon-oxidado.svg', effect: 'fury', value: 0.26, desc: '+26% ATK durante 2 turnos.' },
        kunai_public_safety: { name: 'Kunai de Public Safety', series: 'Chainsaw Man', icon: 'assets/equipment/kunai-public-safety.svg', effect: 'pierce', value: 0.2, desc: '+20% de daño durante 3 turnos.' },
        lata_comida_gato: { name: 'Lata de comida de gato', series: 'Chainsaw Man', icon: 'assets/equipment/lata-gato.svg', effect: 'heal', value: 0.35, desc: 'Restaura 35% del HP máximo.' },
        pin_bomba: { name: 'Pin de bomba', series: 'Chainsaw Man', icon: 'assets/equipment/pin-bomba.svg', effect: 'blast', value: 0.18, desc: 'Explota y golpea al enemigo por 18% de su HP máximo.' }
    },
    ALIASES: {
        'Zanpakutō rota': 'zanpakuto_rosa',
        'Zanpakutō rosa': 'zanpakuto_rosa',
        'Dedo maldito (réplica)': 'dedo_maldito',
        'Banda ninja rota': 'banda_ninja_rota',
        'Sello explosivo': 'sello_explosivo',
        'Log Pose': 'log_pose',
        'Moneda de Tribes': 'moneda_tribes',
        'Máscara tengu rota': 'mascara_tengu',
        'Nichirin mellada': 'nichirin_mellada',
        'Talismán de Ubuyashiki': 'talisman_ubuyashiki',
        'Cordón oxidado': 'cordon_oxidado',
        'Kunai de Public Safety': 'kunai_public_safety',
        'Lata de comida de gato': 'lata_comida_gato',
        'Pin de bomba': 'pin_bomba',
        'Talismán roto': 'talisman_roto',
        'Dedo maldito (réplica)': 'dedo_maldito',
        'Cuerda negra': 'cuerda_negra',
        'Chispa de esperanza': 'chispa_esperanza',
        'Nota de viaje': 'nota_viaje',
        'Zanpakutō rosa': 'zanpakuto_rosa'
    },
    ensure() {
        let inv = GameState.get('equipmentInventory');
        let equipped = GameState.get('equippedEquipment');
        if (!inv || typeof inv !== 'object') { inv = {}; GameState.set('equipmentInventory', inv); }
        if (!equipped || typeof equipped !== 'object') { equipped = {}; GameState.set('equippedEquipment', equipped); }
        return { inv, equipped };
    },
    idForName(name) { return this.ALIASES[name] || Object.keys(this.ITEMS).find(id => this.ITEMS[id].name === name) || null; },
    get(id) { return this.ITEMS[id] || null; },
    artFor(item) {
        const entry = typeof item === 'string' ? this.get(item) : item;
        return entry?.photo || entry?.icon || 'assets/equipment/fragmento-sombrero.svg';
    },
    artForName(name) { return this.artFor(this.get(this.idForName(name))); },
    owned(id) { return Number(this.ensure().inv[id] || 0); },
    add(id, amount = 1) {
        if (!this.ITEMS[id]) return 0;
        const { inv } = this.ensure();
        inv[id] = Math.max(0, Number(inv[id] || 0) + amount);
        GameState.set('equipmentInventory', inv);
        return inv[id];
    },
    equippedFor(charId) {
        const id = this.ensure().equipped[charId];
        return id && this.ITEMS[id] && this.owned(id) > 0 ? { id, ...this.ITEMS[id] } : null;
    },
    equip(charId, itemId) {
        if (!charId || !this.ITEMS[itemId] || !this.owned(itemId)) return false;
        const { equipped } = this.ensure();
        equipped[charId] = itemId;
        GameState.set('equippedEquipment', equipped);
        return true;
    },
    unequip(charId) {
        const { equipped } = this.ensure();
        delete equipped[charId];
        GameState.set('equippedEquipment', equipped);
    },
    consume(id) {
        const { inv } = this.ensure();
        const current = Number(inv[id] || 0);
        if (current < 1) return false;
        inv[id] = current - 1;
        GameState.set('equipmentInventory', inv);
        return true;
    },
    result(name) {
        const id = this.idForName(name);
        const item = this.get(id);
        return item ? { kind: 'equipment', rarity: 'common', stars: 3, reward: item.name, equipmentId: id, equipment: { ...item }, dupe: this.owned(id) > 0 } : null;
    },
    openMenu() {
        this.ensure();
        const old = document.querySelector('.equipment-modal');
        if (old) old.remove();
        const owned = Object.keys(this.ITEMS).filter(id => this.owned(id));
        const chars = typeof GachaRoster !== 'undefined' ? GachaRoster.ownedTemplates() : [];
        const modal = document.createElement('div');
        modal.className = 'equipment-modal';
        modal.innerHTML = `<div class="equipment-panel"><button class="equipment-close" type="button">×</button><p class="equipment-kicker">ARSENAL DE CAMPAÑA</p><h2>EQUIPAMIENTO</h2><p class="equipment-intro">Elige un personaje y asígnale un objeto 3★. Solo puede activarlo una vez por combate.</p><div class="equipment-layout"><aside class="equipment-chars">${chars.map((c, i) => `<button class="equipment-char ${i === 0 ? 'is-active' : ''}" data-char="${c.id}" type="button"><span style="background-image:url('${c.img || `assets/sprites/anim/${c.id}_idle.png`}')"></span><b>${c.name}</b><small>${this.equippedFor(c.id)?.name || 'SIN EQUIPO'}</small></button>`).join('')}</aside><section class="equipment-items"><div class="equipment-selected" id="equipment-selected"></div><div class="equipment-grid">${owned.length ? owned.map(id => { const x = this.ITEMS[id]; return `<button class="equipment-item" data-item="${id}" type="button"><img src="${this.artFor(x)}" data-fallback="${x.icon}" onerror="this.onerror=null;this.src=this.dataset.fallback" alt=""><span class="equipment-stars">★★★</span><b>${x.name}</b><small>${x.desc}</small></button>`; }).join('') : '<p class="equipment-empty">Todavía no tienes objetos 3★. Consíguelos en el Convenio.</p>'}</div></section></div></div>`;
        document.body.appendChild(modal);
        let selected = chars[0]?.id || '';
        const paint = () => {
            modal.querySelectorAll('.equipment-char').forEach(b => b.classList.toggle('is-active', b.dataset.char === selected));
            const item = this.equippedFor(selected);
            const host = modal.querySelector('#equipment-selected');
            if (host) host.innerHTML = `<strong>${chars.find(c => c.id === selected)?.name || 'Personaje'}</strong><span>${item ? `Equipado: ${item.name}` : 'Selecciona un objeto para equiparlo'}</span>`;
        };
        modal.querySelectorAll('.equipment-char').forEach(btn => btn.onclick = () => { selected = btn.dataset.char; paint(); });
        modal.querySelectorAll('.equipment-item').forEach(btn => btn.onclick = () => { if (this.equip(selected, btn.dataset.item)) { paint(); this.openMenu(); } });
        modal.querySelector('.equipment-close').onclick = () => modal.remove();
        modal.onclick = e => { if (e.target === modal) modal.remove(); };
        paint();
    },
    use(state, user, action) {
        const itemId = action.itemId || this.ensure().equipped[user.id];
        const item = this.ITEMS[itemId];
        if (!item || !this.owned(itemId)) return { ok: false, logs: ['No tienes ese objeto equipado.'] };
        if (user._usedItem) return { ok: false, logs: [`${user.name} ya usó su objeto este combate.`] };
        user._usedItem = true;
        const logs = [`${user.name} activa ${item.name}.`];
        const heal = ratio => { const before = user.hp; user.hp = Math.min(user.maxHp, user.hp + Math.round(user.maxHp * ratio)); logs.push(`${user.name} recupera ${user.hp - before} HP.`); };
        const buff = (stat, value, turns = 3) => { BattleEngine.applyBuffMap(user, { [stat]: 1 + value }, turns); logs.push(`${user.name} recibe +${Math.round(value * 100)}% ${stat.toUpperCase()}.`); };
        if (item.effect === 'heal') heal(item.value);
        if (item.effect === 'party_heal') state.party.filter(x => x.hp > 0).forEach(x => { const before = x.hp; x.hp = Math.min(x.maxHp, x.hp + Math.round(x.maxHp * item.value)); logs.push(`${x.name} recupera ${x.hp - before} HP.`); });
        if (item.effect === 'sp' || item.effect === 'tempo') { user.sp = Math.min(user.maxSp, user.sp + item.value); logs.push(`${user.name} recupera ${item.value} CP.`); }
        if (item.effect === 'party_sp') state.party.filter(x => x.hp > 0).forEach(x => { x.sp = Math.min(x.maxSp, x.sp + item.value); });
        if (['focus', 'fury'].includes(item.effect)) buff('atk', item.value, item.effect === 'fury' ? 2 : 3);
        if (item.effect === 'agi') buff('agi', item.value);
        if (['crit', 'luck'].includes(item.effect)) { user.critBonus = (user.critBonus || 0) + item.value; logs.push(`${user.name} afina su precisión.`); }
        if (item.effect === 'shield') { user.damageTakenMul = Math.min(user.damageTakenMul || 1, 1 - item.value); user.buffs.shield_turns = 3; logs.push(`${user.name} queda protegido.`); }
        if (item.effect === 'cleanse') { Object.keys(user.buffs || {}).forEach(k => { if (typeof user.buffs[k] === 'number' && user.buffs[k] < 1) delete user.buffs[k]; }); user.sp = Math.min(user.maxSp, user.sp + 24); }
        if (item.effect === 'revive') { user.itemRevive = item.value; logs.push('Gikon queda preparado para salvarle del K.O.'); }
        if (item.effect === 'blast' || item.effect === 'pierce' || item.effect === 'bleed' || item.effect === 'drain' || item.effect === 'break' || item.effect === 'skip') {
            const target = state.enemies.find(x => x.hp > 0);
            if (target) {
                if (item.effect === 'blast') { const dmg = Math.max(1, Math.round(target.maxHp * item.value)); target.hp = Math.max(1, target.hp - dmg); logs.push(`${target.name} recibe ${dmg} de explosión.`); }
                if (item.effect === 'bleed') { target.dots = target.dots || []; target.dots.push({ name: item.name, amount: Math.round(target.maxHp * item.value), turns: 3 }); logs.push(`${target.name} queda herido.`); }
                if (item.effect === 'break') { BattleEngine.applyBuffMap(target, { def: 1 - item.value }, 3); logs.push(`${target.name} pierde DEF.`); }
                if (item.effect === 'skip') { BattleEngine.applyBuffMap(target, { agi: 0.75 }, 3); logs.push(`${target.name} queda ralentizado.`); }
                if (item.effect === 'pierce') buff('atk', item.value);
                if (item.effect === 'drain') { const dmg = Math.round(target.maxHp * item.value); target.hp = Math.max(1, target.hp - dmg); heal(item.value); }
            }
        }
        if (!this.consume(itemId)) return { ok: false, logs: ['El objeto ya no está disponible.'] };
        logs.push(`${item.name} se consume · quedan ${this.owned(itemId)}.`);
        return { ok: true, logs, equipment: item, hits: [] };
    }
};

Object.values(EquipmentSystem.ITEMS).forEach(item => {
    if (!item.icon) item.icon = 'assets/equipment/reliquia.svg';
});
['den_den_mushi', 'cartel_recompensa', 'log_pose', 'kunai_oxidado', 'pergamino_vacio', 'banda_ninja_rota', 'sello_explosivo', 'fragmento_stand', 'flecha_rota', 'disco_memoria', 'reloj_arena', 'alma_fragmentada', 'hueco_mundo_scrap', 'talisman_roto', 'dedo_maldito', 'cuerda_negra', 'chispa_esperanza', 'nota_viaje', 'moneda_tribes', 'mascara_tengu', 'nichirin_mellada', 'talisman_ubuyashiki', 'kunai_public_safety', 'lata_comida_gato'].forEach(id => {
    if (EquipmentSystem.ITEMS[id]) EquipmentSystem.ITEMS[id].icon = 'assets/equipment/reliquia.svg';
});
