class HuntScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HuntScene' });
    }

    init(data) {
        this.runNumber = data.runNumber || 1;
        this.fragments = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.multiplier = 1;
        this.enemiesKilled = 0;
        this.perfectDodges = 0;
        this.levelComplete = false;
        this.tutorialPhase = this.runNumber;
        this.eventActive = null;
        this.eventTimer = 0;
        this.showGlitchMessages = this.runNumber >= 5;
        this.messageIndex = 0;
        this.glitchMessages = [
            'Algo te está observando.',
            'El sistema del destino está cambiando.',
            'Una presencia desconocida ha sido detectada.'
        ];
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        this.createBackground(w, h);
        EnemyTypes.createTextures(this);

        // Invisible hitbox texture for attacks
        const hitG = this.add.graphics();
        hitG.fillStyle(0xffffff, 0.01);
        hitG.fillRect(0, 0, 80, 60);
        hitG.generateTexture('hitbox', 80, 60);
        hitG.destroy();

        this.player = PlayerConfig.createSprite(this, 100, h / 2);
        this.enemies = this.physics.add.group();
        this.crystals = this.physics.add.group();
        this.attackHitbox = this.physics.add.sprite(0, 0, 'hitbox');
        this.attackHitbox.body.setSize(80, 60);
        this.attackHitbox.setVisible(false);

        this.physics.add.overlap(this.player, this.crystals, this.collectCrystal, null, this);
        this.physics.add.overlap(this.attackHitbox, this.enemies, this.hitEnemy, null, this);

        this.setupInput();
        this.setupHUD();
        this.setupMobileControls();

        this.dashCooldown = 0;
        this.isDashing = false;
        this.dashTimer = 0;
        this.attackCooldown = 0;
        this.isAttacking = false;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.perfectDodgeWindow = false;
        this.perfectDodgeTimer = 0;

        this.spawnTimer = 0;
        this.crystalTimer = 0;
        this.levelTimer = 0;
        this.levelDuration = 32000 + this.runNumber * 4000;
        this.lastMoveX = 1;
        this.lastMoveY = 0;

        if (this.runNumber === 1) this.showTutorial('Usa WASD o flechas para moverte.\nRecoge los cristales azules.\n¡Destruye enemigos con ESPACIO!');
        else if (this.runNumber === 2) this.showTutorial('SHIFT para esquivar.\nEsquiva en el momento justo = PERFECT EVASION (+3 fragmentos)');
        else if (this.runNumber === 3) this.showTutorial('Encadena acciones para subir tu DESTINY COMBO.\n¡Más combo = más multiplicador!');
        else if (this.runNumber === 4) this.showTutorial('Eventos aleatorios activados.\nRNG BLESSING · 50/50 CURSE · CHIKI POWER');
        else if (this.runNumber >= 5) this.showTutorial('El destino se tambalea...\nAlgo grande se acerca.');

        this.cameras.main.setBackgroundColor(0x0a0a12);
        AudioManager.setTheme('hunt');
    }

    createBackground(w, h) {
        const colors = [0x1a1030, 0x0d1b3e, 0x8b0000, 0x1a237e];
        for (let i = 0; i < 5; i++) {
            const bg = this.add.rectangle(
                Phaser.Math.Between(0, w), Phaser.Math.Between(0, h),
                Phaser.Math.Between(100, 300), Phaser.Math.Between(50, 150),
                colors[i % colors.length], 0.15
            );
            this.tweens.add({
                targets: bg, x: bg.x + Phaser.Math.Between(-50, 50),
                duration: Phaser.Math.Between(3000, 8000),
                yoyo: true, repeat: -1
            });
        }

        for (let i = 0; i < 30; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, w), Phaser.Math.Between(0, h),
                Phaser.Math.FloatBetween(0.5, 2), 0xf4d03f, Phaser.Math.FloatBetween(0.1, 0.5)
            );
            this.tweens.add({
                targets: star, alpha: 0.1,
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true, repeat: -1
            });
        }
    }

    setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey('A');
        this.keyD = this.input.keyboard.addKey('D');
        this.keyW = this.input.keyboard.addKey('W');
        this.keyS = this.input.keyboard.addKey('S');
        this.keySpace = this.input.keyboard.addKey('SPACE');
        this.keyShift = this.input.keyboard.addKey('SHIFT');
    }

    setupHUD() {
        const hud = document.querySelector('.game-hud') || document.createElement('div');
        hud.className = 'game-hud';
        hud.innerHTML = `
            <div>
                <div class="hud-stat">FRAGMENTOS: <span id="hud-fragments">0</span></div>
                <div class="hud-stat">RUN ${this.runNumber}</div>
            </div>
            <div style="text-align:center;">
                <div class="hud-combo" id="hud-combo">COMBO x1</div>
                <div class="hud-rank" id="hud-rank">Chiki</div>
            </div>
            <div>
                <div class="hud-stat">MULT x<span id="hud-mult">1</span></div>
                <div class="hud-stat" id="hud-timer">--:--</div>
            </div>
        `;
        if (!document.querySelector('.game-hud')) {
            document.getElementById('game-container').appendChild(hud);
        }

        this.perfectText = document.createElement('div');
        this.perfectText.className = 'perfect-dodge-text';
        this.perfectText.textContent = 'PERFECT EVASION';
        document.getElementById('game-container').appendChild(this.perfectText);
    }

    setupMobileControls() {
        const controls = document.querySelector('.mobile-controls') || document.createElement('div');
        controls.className = 'mobile-controls visible';
        controls.innerHTML = `
            <div class="mobile-dpad">
                <button class="mobile-btn" id="mb-up">▲</button>
                <div class="mobile-dpad-row">
                    <button class="mobile-btn" id="mb-left">◀</button>
                    <button class="mobile-btn" id="mb-down">▼</button>
                    <button class="mobile-btn" id="mb-right">▶</button>
                </div>
            </div>
            <div class="mobile-actions">
                <button class="mobile-btn" id="mb-dash">DODGE</button>
                <button class="mobile-btn" id="mb-attack">ATK</button>
            </div>
        `;
        if (!document.querySelector('.mobile-controls')) {
            document.getElementById('game-container').appendChild(controls);
        }

        this.mobileLeft = false;
        this.mobileRight = false;
        this.mobileUp = false;
        this.mobileDown = false;

        const bindHold = (id, prop) => {
            const el = document.getElementById(id);
            if (!el) return;
            const on = (e) => { e.preventDefault(); this[prop] = true; };
            const off = () => { this[prop] = false; };
            el.addEventListener('touchstart', on, { passive: false });
            el.addEventListener('touchend', off);
            el.addEventListener('touchcancel', off);
            el.addEventListener('mousedown', on);
            el.addEventListener('mouseup', off);
            el.addEventListener('mouseleave', off);
        };

        bindHold('mb-left', 'mobileLeft');
        bindHold('mb-right', 'mobileRight');
        bindHold('mb-up', 'mobileUp');
        bindHold('mb-down', 'mobileDown');
        document.getElementById('mb-dash')?.addEventListener('touchstart', (e) => { e.preventDefault(); this.doDash(); }, { passive: false });
        document.getElementById('mb-attack')?.addEventListener('touchstart', (e) => { e.preventDefault(); this.doAttack(); }, { passive: false });
        document.getElementById('mb-dash')?.addEventListener('mousedown', (e) => { e.preventDefault(); this.doDash(); });
        document.getElementById('mb-attack')?.addEventListener('mousedown', (e) => { e.preventDefault(); this.doAttack(); });

        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch || window.innerWidth < 900) controls.classList.add('visible');
    }

    showTutorial(text) {
        const t = this.add.text(this.scale.width / 2, 80, text, {
            fontFamily: 'Cinzel, serif', fontSize: '14px', color: '#f4d03f',
            align: 'center', wordWrap: { width: 400 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        this.tweens.add({ targets: t, alpha: 0, delay: 5000, duration: 1000, onComplete: () => t.destroy() });
    }

    update(time, delta) {
        if (this.levelComplete) return;

        this.levelTimer += delta;
        this.updateTimer();
        this.handleMovement(delta);
        this.handleCombat(delta);
        this.updateEnemies(delta);
        this.updateSpawning(delta);
        this.updateCombo(delta);
        this.updateEvents(delta);
        this.updateGlitchMessages(delta);

        if (this.levelTimer >= this.levelDuration) {
            this.completeLevel();
        }
    }

    updateTimer() {
        const remaining = Math.max(0, this.levelDuration - this.levelTimer);
        const secs = Math.floor(remaining / 1000);
        const mins = Math.floor(secs / 60);
        document.getElementById('hud-timer').textContent = `${mins}:${(secs % 60).toString().padStart(2, '0')}`;
    }

    handleMovement(delta) {
        if (this.isDashing) {
            this.dashTimer -= delta;
            if (this.dashTimer <= 0) {
                this.isDashing = false;
                this.player.body.setVelocity(0, 0);
            }
            return;
        }

        let moveX = 0;
        let moveY = 0;
        if (this.cursors.left.isDown || this.keyA.isDown || this.mobileLeft) moveX = -1;
        if (this.cursors.right.isDown || this.keyD.isDown || this.mobileRight) moveX = 1;
        if (this.cursors.up.isDown || this.keyW.isDown || this.mobileUp) moveY = -1;
        if (this.cursors.down.isDown || this.keyS.isDown || this.mobileDown) moveY = 1;

        this.player.body.setVelocity(moveX * PlayerConfig.speed, moveY * PlayerConfig.speed);
        if (moveX !== 0 || moveY !== 0) {
            this.lastMoveX = moveX || this.lastMoveX || 1;
            this.lastMoveY = moveY;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyShift)) this.doDash();
        if (Phaser.Input.Keyboard.JustDown(this.keySpace)) this.doAttack();
    }

    doDash() {
        if (this.dashCooldown > 0 || this.isDashing) return;
        const dirX = this.lastMoveX || (this.player.body.velocity.x >= 0 ? 1 : -1);
        const dirY = this.lastMoveY || 0;
        const len = Math.hypot(dirX, dirY) || 1;
        this.isDashing = true;
        this.dashTimer = PlayerConfig.dashDuration;
        this.dashCooldown = PlayerConfig.dashCooldown;
        this.player.body.setVelocity(
            (dirX / len) * PlayerConfig.dashSpeed,
            (dirY / len) * PlayerConfig.dashSpeed
        );
        AudioManager.combat.dodge();

        if (this.perfectDodgeWindow) {
            this.triggerPerfectDodge();
        }

        this.player.setAlpha(0.5);
        this.time.delayedCall(PlayerConfig.dashDuration, () => this.player.setAlpha(1));
    }

    doAttack() {
        if (this.attackCooldown > 0 || this.isAttacking) return;
        this.isAttacking = true;
        this.attackCooldown = PlayerConfig.attackCooldown;
        AudioManager.combat.attack();

        const dir = this.lastMoveX || 1;
        this.attackHitbox.setPosition(this.player.x + dir * 40, this.player.y);
        this.attackHitbox.setVisible(true);

        const slash = this.add.graphics();
        slash.lineStyle(3, 0xf4d03f, 0.8);
        slash.strokeCircle(this.attackHitbox.x, this.attackHitbox.y, 30);
        this.tweens.add({ targets: slash, alpha: 0, duration: 200, onComplete: () => slash.destroy() });

        this.time.delayedCall(150, () => {
            this.attackHitbox.setVisible(false);
            this.isAttacking = false;
        });

        this.addCombo(1);
    }

    handleCombat(delta) {
        if (this.dashCooldown > 0) this.dashCooldown -= delta;
        if (this.attackCooldown > 0) this.attackCooldown -= delta;
        if (this.invincibleTimer > 0) {
            this.invincibleTimer -= delta;
            if (this.invincibleTimer <= 0) this.invincible = false;
        }
        if (this.perfectDodgeTimer > 0) {
            this.perfectDodgeTimer -= delta;
            if (this.perfectDodgeTimer <= 0) this.perfectDodgeWindow = false;
        }
    }

    updateEnemies(delta) {
        this.enemies.getChildren().forEach(enemy => {
            if (!enemy.active) return;

            if (enemy.x < -60) {
                enemy.destroy();
                return;
            }

            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            if (dist < 400) {
                this.physics.moveToObject(enemy, this.player, 80 + this.runNumber * 10);
            }

            enemy.attackTimer -= delta;
            if (enemy.attackTimer <= 0 && dist < 140 && !enemy.isAttacking) {
                enemy.isAttacking = true;
                enemy.attackWindup = 650;
                this.showAttackWarning(enemy);
            }

            if (enemy.isAttacking) {
                enemy.attackWindup -= delta;
                if (enemy.attackWindup <= 280 && enemy.attackWindup > 0) {
                    this.perfectDodgeWindow = true;
                    this.perfectDodgeTimer = 280;
                }
                if (enemy.attackWindup <= 0) {
                    const hitDist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
                    if (hitDist < 90 && !this.isDashing && !this.invincible) {
                        this.takeDamage();
                    }
                    enemy.isAttacking = false;
                    enemy.attackTimer = 2000;
                }
            }
        });

        this.crystals.getChildren().forEach(crystal => {
            if (crystal.active && crystal.x < -40) crystal.destroy();
        });
    }

    showAttackWarning(enemy) {
        const warn = this.add.circle(enemy.x, enemy.y, 40, 0xdc143c, 0.3);
        this.tweens.add({
            targets: warn, scale: 1.5, alpha: 0,
            duration: 400, onComplete: () => warn.destroy()
        });
    }

    triggerPerfectDodge() {
        this.perfectDodges++;
        this.perfectDodgeWindow = false;
        const bonus = Math.floor(3 * this.multiplier);
        this.fragments += bonus;
        this.addCombo(3);
        AudioManager.combat.perfectDodge();
        screenShake(document.getElementById('game-container'));

        this.perfectText.style.opacity = '1';
        gsap.to(this.perfectText, { opacity: 0, duration: 1, delay: 0.5 });
        this.cameras.main.flash(200, 244, 208, 63);

        this.multiplier = Math.min(this.multiplier + 0.5, 5);
        this.updateHUD();
    }

    takeDamage() {
        if (this.invincible) return;
        this.combo = 0;
        this.multiplier = Math.max(1, this.multiplier - 0.5);
        AudioManager.combat.impact();
        this.cameras.main.shake(200, 0.01);
        this.updateHUD();
    }

    updateSpawning(delta) {
        this.spawnTimer -= delta;
        this.crystalTimer -= delta;

        if (this.spawnTimer <= 0) {
            const types = ['enemy_common', 'enemy_common', 'enemy_lost', 'enemy_rng'];
            if (this.runNumber >= 3) types.push('enemy_pity');
            const type = types[Phaser.Math.Between(0, types.length - 1)];
            const y = Phaser.Math.Between(60, this.scale.height - 60);
            this.enemies.add(EnemyTypes.spawnEnemy(this, this.scale.width + 30, y, type));
            this.spawnTimer = Math.max(800, 2000 - this.runNumber * 200);
        }

        if (this.crystalTimer <= 0) {
            const y = Phaser.Math.Between(40, this.scale.height - 40);
            this.crystals.add(EnemyTypes.spawnCrystal(this, this.scale.width + 20, y));
            this.crystalTimer = 1200;
        }
    }

    collectCrystal(player, crystal) {
        crystal.destroy();
        const amount = Math.ceil(1 * this.multiplier);
        this.fragments += amount;
        this.addCombo(1);
        AudioManager.ui.collect();
        this.updateHUD();

        const spark = this.add.circle(crystal.x, crystal.y, 8, 0x4da6ff, 0.8);
        this.tweens.add({ targets: spark, scale: 2, alpha: 0, duration: 300, onComplete: () => spark.destroy() });
    }

    hitEnemy(hitbox, enemy) {
        if (!enemy.active || !this.isAttacking) return;
        enemy.health--;
        if (enemy.health <= 0) {
            enemy.destroy();
            this.enemiesKilled++;
            const amount = Math.ceil(5 * this.multiplier);
            this.fragments += amount;
            this.addCombo(2);
            AudioManager.combat.impact();
            this.updateHUD();
            ParticleSystem.burst(enemy.x, enemy.y, 10, '#dc143c');
        }
    }

    addCombo(amount) {
        this.combo += amount;
        this.comboTimer = 3000;
        const multBoost = Math.floor(this.combo / 10) * 0.5;
        this.multiplier = Math.min(1 + multBoost, 5);
        this.updateHUD();
        if (this.combo > 1) AudioManager.combat.combo();
    }

    updateCombo(delta) {
        if (this.comboTimer > 0) {
            this.comboTimer -= delta;
            if (this.comboTimer <= 0) {
                this.combo = 0;
                this.updateHUD();
            }
        }
    }

    updateEvents(delta) {
        if (this.runNumber < 4) return;

        this.eventTimer -= delta;
        if (this.eventTimer <= 0) {
            const events = ['blessing', 'curse', 'power'];
            this.triggerEvent(events[Phaser.Math.Between(0, 2)]);
            this.eventTimer = 15000;
        }
    }

    triggerEvent(type) {
        this.eventActive = type;
        const msg = this.add.text(this.scale.width / 2, 150, '', {
            fontFamily: 'Cinzel', fontSize: '16px', color: '#f4d03f'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        if (type === 'blessing') {
            msg.setText('✦ RNG BLESSING — Fragmentos x2 ✦');
            this.multiplier *= 2;
            this.time.delayedCall(8000, () => { this.multiplier /= 2; });
        } else if (type === 'curse') {
            msg.setText('⚠ 50/50 CURSE — Multiplicador reducido ⚠');
            this.multiplier = Math.max(0.5, this.multiplier * 0.5);
            this.time.delayedCall(8000, () => { this.multiplier = Math.min(this.multiplier * 2, 5); });
        } else {
            msg.setText('★ CHIKI POWER — Invencible ★');
            this.invincible = true;
            this.invincibleTimer = 5000;
            this.player.setTint(0xf4d03f);
            this.time.delayedCall(5000, () => this.player.clearTint());
        }

        this.tweens.add({ targets: msg, alpha: 0, delay: 4000, duration: 1000, onComplete: () => msg.destroy() });
    }

    updateGlitchMessages(delta) {
        if (!this.showGlitchMessages) return;
        if (this.levelTimer > 10000 && this.messageIndex < this.glitchMessages.length) {
            const interval = 12000;
            if (Math.floor(this.levelTimer / interval) > this.messageIndex) {
                const msg = this.add.text(this.scale.width / 2, this.scale.height - 60,
                    this.glitchMessages[this.messageIndex], {
                        fontFamily: 'Cormorant Garamond', fontSize: '14px', color: '#dc143c', fontStyle: 'italic'
                    }).setOrigin(0.5).setScrollFactor(0).setAlpha(0.7);
                this.tweens.add({ targets: msg, alpha: 0, delay: 3000, duration: 2000, onComplete: () => msg.destroy() });
                this.messageIndex++;
            }
        }
    }

    updateHUD() {
        document.getElementById('hud-fragments').textContent = this.fragments;
        document.getElementById('hud-combo').textContent = `COMBO x${this.combo || 1}`;
        document.getElementById('hud-mult').textContent = this.multiplier.toFixed(1);
        const rank = PlayerConfig.getStyleRank(this.combo);
        document.getElementById('hud-rank').textContent = rank.label;
    }

    completeLevel() {
        this.levelComplete = true;
        this.player.body.setVelocity(0, 0);

        const bonus = 20;
        this.fragments += bonus;

        const runs = GameState.get('huntRunsCompleted') + 1;
        GameState.set('huntRunsCompleted', runs);
        GameState.addChikistrites(this.fragments);

        if (!GameState.get('bossDefeated')) {
            GameState.addInvocation();
        }

        if (runs >= 3) Achievements.show('chiki_master');

        this.showResult();
    }

    showResult() {
        const result = document.querySelector('.game-result') || document.createElement('div');
        result.className = 'game-result';
        const rank = PlayerConfig.getStyleRank(this.combo);
        const runs = GameState.get('huntRunsCompleted');

        result.innerHTML = `
            <h2 class="title-main" style="font-size:2rem;">RUN COMPLETADA</h2>
            <p class="text-body">Fragmentos: ${this.fragments}</p>
            <p class="text-body">Perfect Dodges: ${this.perfectDodges}</p>
            <p class="text-body">Rango: ${rank.label}</p>
            ${!GameState.get('bossDefeated') ? '<p class="text-body" style="color:var(--gold-light);margin-top:1rem;">+1 INVOCACIÓN DESBLOQUEADA</p>' : ''}
            <button class="btn-destiny" id="btn-continue" style="margin-top:1.5rem;">CONTINUAR</button>
        `;
        if (!document.querySelector('.game-result')) {
            document.getElementById('game-container').appendChild(result);
        }

        gsap.to(result, { opacity: 1, duration: 0.5, onStart: () => result.classList.add('active') });
        AudioManager.ui.victory();

        document.getElementById('btn-continue').onclick = () => {
            GameManager.endHunt();
            if (runs >= 5 && !GameState.get('bossDefeated')) {
                GameManager.startBoss();
            } else {
                SceneManager.goTo('destiny');
            }
        };
    }
}
