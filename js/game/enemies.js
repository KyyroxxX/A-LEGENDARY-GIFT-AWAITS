/**
 * Enemy definitions for Destiny Hunt — abstract original designs
 */
const EnemyTypes = {
    createTextures(scene) {
        const ensure = (key, size, draw) => {
            if (scene.textures.exists(key)) return;
            const g = scene.add.graphics();
            draw(g, size);
            g.generateTexture(key, size * 2 + 12, size * 2 + 12);
            g.destroy();
        };

        ensure('enemy_common', 18, (g, s) => {
            // Gray fractured cube — The Common Pull
            g.fillStyle(0x6a6a6a, 0.95);
            g.fillRect(6, 6, s * 2, s * 2);
            g.lineStyle(2, 0xaaaaaa, 0.8);
            g.strokeRect(6, 6, s * 2, s * 2);
            g.fillStyle(0x333333, 0.6);
            g.fillTriangle(6, 6, s + 6, s + 6, 6, s * 2 + 6);
        });

        ensure('enemy_lost', 22, (g, s) => {
            // Split crimson shard — The Lost 50/50
            g.fillStyle(0xdc143c, 0.95);
            g.fillTriangle(s + 6, 4, s * 2 + 8, s * 2 + 8, 4, s * 2 + 8);
            g.fillStyle(0x1a1a1a, 0.9);
            g.fillTriangle(s + 6, 4, s + 6, s * 2 + 8, 4, s * 2 + 8);
            g.lineStyle(2, 0xf4d03f, 0.7);
            g.lineBetween(s + 6, 4, s + 6, s * 2 + 8);
        });

        ensure('enemy_pity', 26, (g, s) => {
            // Heavy violet monolith — The Hard Pity
            g.fillStyle(0x4a0080, 0.95);
            g.fillRoundedRect(6, 4, s * 2, s * 2 + 4, 4);
            g.lineStyle(2, 0x9d4edd, 0.9);
            g.strokeRoundedRect(6, 4, s * 2, s * 2 + 4, 4);
            g.fillStyle(0xffffff, 0.15);
            g.fillRect(10, 8, s * 2 - 8, 6);
        });

        ensure('enemy_rng', 20, (g, s) => {
            // Chaotic blue spiral — The RNG Curse
            g.fillStyle(0x1a237e, 0.95);
            g.fillCircle(s + 6, s + 6, s);
            g.lineStyle(3, 0x4da6ff, 0.9);
            g.strokeCircle(s + 6, s + 6, s * 0.7);
            g.lineStyle(2, 0xffffff, 0.5);
            g.strokeCircle(s + 6, s + 6, s * 0.4);
            g.fillStyle(0x4da6ff, 0.8);
            g.fillCircle(s + 6, s + 6, 4);
        });

        ensure('crystal', 10, (g, s) => {
            g.fillStyle(0x4da6ff, 0.9);
            g.fillTriangle(s + 6, 2, s * 2 + 8, s * 2 + 8, 4, s * 2 + 8);
            g.fillStyle(0xffffff, 0.6);
            g.fillTriangle(s + 6, 6, s + 12, s + 10, s, s + 10);
        });

        ensure('boss_5050', 48, (g, s) => {
            // Dual mask — light / dark
            g.fillStyle(0x0a0a12, 1);
            g.fillCircle(s + 6, s + 6, s);
            // Left half gold
            g.fillStyle(0xf4d03f, 1);
            g.slice(s + 6, s + 6, s * 0.85, Math.PI * 0.5, Math.PI * 1.5, false);
            g.fillPath();
            // Right half white/void
            g.fillStyle(0xf5f0e8, 0.95);
            g.slice(s + 6, s + 6, s * 0.85, Math.PI * 1.5, Math.PI * 0.5, false);
            g.fillPath();
            // Center crack
            g.lineStyle(3, 0xdc143c, 1);
            g.lineBetween(s + 6, 6, s + 6, s * 2 + 6);
            // Eyes
            g.fillStyle(0x0a0a12, 1);
            g.fillCircle(s - 10, s, 5);
            g.fillCircle(s + 22, s, 5);
            g.lineStyle(3, 0xc9a227, 0.9);
            g.strokeCircle(s + 6, s + 6, s);
        });

        ensure('projectile', 8, (g, s) => {
            g.fillStyle(0xdc143c, 0.95);
            g.fillCircle(s + 6, s + 6, s);
            g.fillStyle(0xffffff, 0.5);
            g.fillCircle(s + 4, s + 4, 3);
        });

        ensure('hitbox', 1, (g) => {
            g.fillStyle(0xffffff, 0.01);
            g.fillRect(0, 0, 90, 70);
        });
    },

    spawnEnemy(scene, x, y, type = 'enemy_common') {
        const enemy = scene.physics.add.sprite(x, y, type);
        enemy.enemyType = type;
        enemy.health = type === 'enemy_pity' ? 3 : type === 'enemy_lost' ? 2 : 1;
        enemy.maxHealth = enemy.health;
        enemy.attackTimer = Phaser.Math.Between(800, 1600);
        enemy.isAttacking = false;
        enemy.attackWindup = 0;
        enemy.setDepth(5);
        enemy.body.setVelocityX(-80 - scene.runNumber * 12);
        return enemy;
    },

    spawnCrystal(scene, x, y) {
        const crystal = scene.physics.add.sprite(x, y, 'crystal');
        crystal.isCrystal = true;
        crystal.setDepth(4);
        crystal.body.setVelocityX(-120 - scene.runNumber * 8);
        scene.tweens.add({
            targets: crystal,
            y: y - 10,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        return crystal;
    }
};
