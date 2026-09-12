class BossScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BossScene' });
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        this.cameras.main.setBackgroundColor(0x0a0818);
        this.createBossBackground(w, h);
        EnemyTypes.createTextures(this);

        this.player = PlayerConfig.createSprite(this, 120, h / 2);
        this.boss = this.physics.add.sprite(w - 180, h / 2, 'boss_5050');
        this.boss.body.setImmovable(true);
        this.bossHP = 50;
        this.bossMaxHP = 50;
        this.bossAttackTimer = 3000;
        this.bossAttacking = false;
        this.bossVulnerable = false;
        this.projectiles = this.physics.add.group();
        this.bossActive = false;
        this.bossDefeated = false;
        this.lastMoveX = 1;
        this.lastMoveY = 0;

        this.physics.add.overlap(this.player, this.projectiles, this.playerHitProjectile, null, this);

        this.setupInput();
        this.setupBossHUD();
        this.setupMobileControls();

        this.dashCooldown = 0;
        this.isDashing = false;
        this.dashTimer = 0;
        this.attackCooldown = 0;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.perfectDodgeWindow = false;
        this.perfectDodgeTimer = 0;
        this.playerHP = 100;

        AudioManager.setTheme('boss');
        this.showBossIntro();

        // Gentle float without spawning infinite tweens
        this.tweens.add({
            targets: this.boss,
            y: this.boss.y - 25,
            duration: 2200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createBossBackground(w, h) {
        for (let i = 0; i < 20; i++) {
            const p = this.add.rectangle(
                Phaser.Math.Between(0, w), Phaser.Math.Between(0, h),
                Phaser.Math.Between(50, 200), 2,
                Phaser.Math.RND.pick([0xf4d03f, 0xdc143c, 0xffffff]), 0.1
            );
            this.tweens.add({
                targets: p,
                x: p.x - 120,
                duration: Phaser.Math.Between(2500, 5500),
                repeat: -1
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

    setupBossHUD() {
        let hud = document.querySelector('.game-hud');
        if (!hud) {
            hud = document.createElement('div');
            hud.className = 'game-hud';
            document.getElementById('game-container').appendChild(hud);
        }
        hud.innerHTML = `
            <div class="hud-stat">THE 50/50</div>
            <div style="text-align:center;">
                <div class="hud-combo" id="boss-hp">HP: 50 / 50</div>
            </div>
            <div class="hud-stat">TU VIDA: <span id="player-hp">100</span></div>
        `;

        this.perfectText = document.createElement('div');
        this.perfectText.className = 'perfect-dodge-text';
        this.perfectText.textContent = 'PERFECT EVASION';
        document.getElementById('game-container').appendChild(this.perfectText);
    }

    setupMobileControls() {
        const controls = document.createElement('div');
        controls.className = 'mobile-controls';
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
        document.getElementById('game-container').appendChild(controls);

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

    showBossIntro() {
        const w = this.scale.width;
        const intro = this.add.text(w / 2, this.scale.height / 2,
            'THE 50/50\n\nHP: 50 / 50', {
                fontFamily: 'Cinzel, serif', fontSize: '28px', color: '#f4d03f',
                align: 'center', stroke: '#000', strokeThickness: 4
            }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

        this.tweens.add({
            targets: intro, alpha: 0, delay: 2500, duration: 1000,
            onComplete: () => intro.destroy()
        });

        this.time.delayedCall(3500, () => { this.bossActive = true; });
    }

    update(time, delta) {
        if (!this.bossActive || this.bossDefeated) return;

        this.handleMovement(delta);
        this.handleCombat(delta);
        this.updateBoss(delta);
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
        const dirX = this.lastMoveX || 1;
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
            this.perfectDodgeWindow = false;
            AudioManager.combat.perfectDodge();
            this.cameras.main.flash(200, 244, 208, 63);
            this.damageBoss(5);
            if (this.perfectText) {
                this.perfectText.style.opacity = '1';
                gsap.to(this.perfectText, { opacity: 0, duration: 1, delay: 0.4 });
            }
        }

        this.player.setAlpha(0.5);
        this.time.delayedCall(PlayerConfig.dashDuration, () => this.player.setAlpha(1));
    }

    doAttack() {
        if (this.attackCooldown > 0) return;
        this.attackCooldown = 280;

        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.boss.x, this.boss.y);
        if (dist < 140) {
            this.damageBoss(3);
            AudioManager.combat.attack();
            const slash = this.add.graphics();
            slash.lineStyle(4, 0xf4d03f, 1);
            slash.lineBetween(this.player.x, this.player.y, this.boss.x, this.boss.y);
            this.tweens.add({ targets: slash, alpha: 0, duration: 200, onComplete: () => slash.destroy() });
        } else {
            AudioManager.combat.attack();
        }
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

    updateBoss(delta) {
        this.bossAttackTimer -= delta;

        if (this.bossAttackTimer <= 0 && !this.bossAttacking) {
            const attacks = ['lost5050', 'hardPity', 'rateUp', 'guaranteed'];
            const attack = attacks[Phaser.Math.Between(0, attacks.length - 1)];
            this.executeBossAttack(attack);
            this.bossAttackTimer = Phaser.Math.Between(2200, 3800);
        }
    }

    executeBossAttack(type) {
        this.bossAttacking = true;
        const w = this.scale.width;
        const h = this.scale.height;

        const attackLabel = this.add.text(w / 2, 60, '', {
            fontFamily: 'Cinzel', fontSize: '14px', color: '#dc143c'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        if (type === 'lost5050') {
            attackLabel.setText('LOST THE 50/50');
            const wave = this.add.rectangle(this.boss.x, this.boss.y, 40, h, 0xdc143c, 0.55);
            this.perfectDodgeWindow = true;
            this.perfectDodgeTimer = 900;
            this.tweens.add({
                targets: wave,
                x: 40,
                width: w * 0.85,
                duration: 1400,
                onUpdate: () => {
                    const hit =
                        this.player.x > wave.x - wave.width / 2 &&
                        this.player.x < wave.x + wave.width / 2 &&
                        Math.abs(this.player.y - wave.y) < h / 2;
                    if (hit && !this.isDashing && !this.invincible && wave.active) {
                        this.applyPlayerDamage();
                        wave.destroy();
                        this.bossAttacking = false;
                    }
                },
                onComplete: () => {
                    if (wave.active) wave.destroy();
                    this.bossAttacking = false;
                }
            });
        } else if (type === 'hardPity') {
            attackLabel.setText('HARD PITY');
            for (let i = 0; i < 5; i++) {
                this.time.delayedCall(i * 350, () => {
                    if (this.bossDefeated) return;
                    const frag = this.physics.add.sprite(
                        Phaser.Math.Between(80, w - 80), -30, 'crystal'
                    );
                    frag.setScale(2.5);
                    frag.setTint(0xdc143c);
                    frag.body.setVelocityY(280);
                    this.projectiles.add(frag);
                    this.time.delayedCall(3500, () => { if (frag.active) frag.destroy(); });
                });
            }
            this.time.delayedCall(2500, () => { this.bossAttacking = false; });
        } else if (type === 'rateUp') {
            attackLabel.setText('RATE UP — FAKE OUT');
            for (let i = 0; i < 3; i++) {
                const fake = this.add.circle(this.boss.x - 50 + i * 50, this.boss.y, 15, 0xdc143c, 0.4);
                this.tweens.add({
                    targets: fake,
                    x: this.player.x + Phaser.Math.Between(-40, 40),
                    y: this.player.y + Phaser.Math.Between(-40, 40),
                    alpha: 0.8,
                    duration: 700,
                    delay: i * 180,
                    onComplete: () => fake.destroy()
                });
            }
            this.time.delayedCall(1400, () => { this.bossAttacking = false; });
        } else {
            attackLabel.setText('GUARANTEED — VULNERABLE!');
            this.boss.setTint(0x7CFC00);
            this.bossVulnerable = true;
            this.time.delayedCall(4000, () => {
                this.boss.clearTint();
                this.bossVulnerable = false;
                this.bossAttacking = false;
            });
        }

        this.tweens.add({
            targets: attackLabel,
            alpha: 0,
            delay: 2000,
            duration: 500,
            onComplete: () => attackLabel.destroy()
        });
    }

    damageBoss(amount) {
        if (this.bossVulnerable) amount *= 2;
        this.bossHP = Math.max(0, this.bossHP - amount);
        const hpEl = document.getElementById('boss-hp');
        if (hpEl) hpEl.textContent = `HP: ${this.bossHP} / 50`;

        this.tweens.add({ targets: this.boss, alpha: 0.5, duration: 100, yoyo: true });
        screenShake(document.getElementById('game-container'));
        AudioManager.combat.death({ heavy: true });

        if (this.bossHP <= 0) {
            this.defeatBoss();
        }
    }

    playerHitProjectile(player, projectile) {
        if (projectile.active) projectile.destroy();
        this.applyPlayerDamage();
    }

    applyPlayerDamage() {
        if (this.invincible || this.isDashing || this.bossDefeated) return;
        this.playerHP -= 15;
        const hpEl = document.getElementById('player-hp');
        if (hpEl) hpEl.textContent = this.playerHP;
        this.invincible = true;
        this.invincibleTimer = 900;
        AudioManager.combat.impact();
        this.cameras.main.shake(200, 0.02);

        if (this.playerHP <= 0) {
            this.playerHP = 100;
            if (hpEl) hpEl.textContent = this.playerHP;
            const msg = this.add.text(this.scale.width / 2, this.scale.height / 2 + 80,
                'El destino te da otra oportunidad...', {
                    fontFamily: 'Cormorant Garamond', fontSize: '16px', color: '#f5f0e8', fontStyle: 'italic'
                }).setOrigin(0.5).setDepth(150);
            this.tweens.add({ targets: msg, alpha: 0, delay: 1500, duration: 800, onComplete: () => msg.destroy() });
        }
    }

    async defeatBoss() {
        this.bossDefeated = true;
        this.bossActive = false;
        this.projectiles.clear(true, true);

        this.tweens.add({ targets: this.boss, alpha: 0, scale: 0, duration: 1000 });

        await this.playDefeatSequence();
    }

    async playDefeatSequence() {
        const w = this.scale.width;
        const h = this.scale.height;

        const counter = this.add.text(w / 2, h / 2, '50 / 50', {
            fontFamily: 'Cinzel', fontSize: '48px', color: '#f4d03f',
            stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

        const numbers = [50, 51, 67, 83, 99, 100];
        for (let i = 0; i < numbers.length; i++) {
            await this.wait(400);
            counter.setText(String(numbers[i]));
            if (numbers[i] === 100) {
                counter.setColor('#f4d03f');
                counter.setScale(1.5);
                ParticleSystem.burst(w / 2, h / 2, 100, '#f4d03f');
                screenShake(document.getElementById('game-container'), 2);
                AudioManager.ui.victory();
            }
        }

        await this.wait(1500);
        counter.destroy();

        this.add.text(w / 2, h / 2 - 60, 'DESTINY HAS BEEN DEFEATED', {
            fontFamily: 'Cinzel', fontSize: '24px', color: '#f4d03f'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

        await this.wait(2000);

        GameState.set('bossDefeated', true);
        GameState.setFlag('gate_final_cleared', true);
        GameState.set('storyComplete', true);
        GameState.addInvocation();
        Achievements.show('boss_5050');

        const result = document.createElement('div');
        result.className = 'game-result active';
        result.innerHTML = `
            <h2 class="title-main" style="font-size:1.8rem;">DESTINY HAS BEEN DEFEATED</h2>
            <p class="text-body">Has derrotado al azar.</p>
            <p class="text-body">Ahora solo queda reclamar aquello que siempre estuvo destinado a ser tuyo.</p>
            <p class="text-body" style="color:var(--gold-light);margin-top:1rem;">+1 LIMITED DESTINY INVOCATION</p>
            <button class="btn-destiny" id="btn-boss-continue" style="margin-top:1.5rem;">RECLAMAR INVOCACIÓN</button>
        `;
        document.getElementById('game-container').appendChild(result);
        gsap.fromTo(result, { opacity: 0 }, { opacity: 1, duration: 0.5 });

        document.getElementById('btn-boss-continue').onclick = () => {
            GameManager.endHunt();
            SceneManager.goTo('gacha');
        };
    }

    wait(ms) {
        return new Promise(r => this.time.delayedCall(ms, r));
    }
}
