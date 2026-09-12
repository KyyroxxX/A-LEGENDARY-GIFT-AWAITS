/**
 * Player entity helpers for Phaser scenes
 */
const PlayerConfig = {
    speed: 260,
    dashSpeed: 520,
    dashDuration: 180,
    dashCooldown: 700,
    attackRange: 70,
    attackCooldown: 320,
    maxHealth: 100,

    ensureTexture(scene, key, drawFn, size) {
        if (scene.textures.exists(key)) return;
        const g = scene.add.graphics();
        drawFn(g);
        g.generateTexture(key, size, size);
        g.destroy();
    },

    createSprite(scene, x, y) {
        this.ensureTexture(scene, 'player', (g) => {
            // Soft outer glow
            g.fillStyle(0xc9a227, 0.25);
            g.fillCircle(24, 24, 22);
            // Body — golden orb / destiny sigil
            g.fillStyle(0xf4d03f, 1);
            g.fillCircle(24, 24, 16);
            g.fillStyle(0xc9a227, 1);
            g.fillCircle(24, 24, 11);
            // Inner light
            g.fillStyle(0xffffff, 0.9);
            g.fillCircle(20, 20, 4);
            // Accent ring
            g.lineStyle(2, 0xdc143c, 0.8);
            g.strokeCircle(24, 24, 16);
        }, 48);

        const player = scene.physics.add.sprite(x, y, 'player');
        player.setCollideWorldBounds(true);
        player.body.setSize(28, 28);
        player.setDepth(10);
        return player;
    },

    getStyleRank(combo) {
        if (combo >= 100) return { rank: 'SSS', label: CONFIG.styleRanks.SSS };
        if (combo >= 50) return { rank: 'SS', label: CONFIG.styleRanks.SS };
        if (combo >= 25) return { rank: 'S', label: CONFIG.styleRanks.S };
        if (combo >= 10) return { rank: 'A', label: CONFIG.styleRanks.A };
        if (combo >= 5) return { rank: 'B', label: CONFIG.styleRanks.B };
        if (combo >= 2) return { rank: 'C', label: CONFIG.styleRanks.C };
        return { rank: 'D', label: CONFIG.styleRanks.D };
    }
};
