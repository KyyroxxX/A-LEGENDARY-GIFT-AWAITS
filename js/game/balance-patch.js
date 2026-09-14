/**
 * Balance patch — per-unit base stats for the user-expansion roster.
 * Before this patch every new unit shared make() defaults (290/145/62/28/34),
 * so tanks, healers and carries felt identical. Values follow the old-cast
 * bands (HP 260–330 · ATK 54–70 · DEF 22–28 · AGI 32–42, tanks/healers aside).
 */
const BalancePatch = {
    STATS: {
        tobirama: { maxHp: 275, maxSp: 160, atk: 66, def: 24, agi: 48, luk: 22 },
        jugo: { maxHp: 340, maxSp: 130, atk: 58, def: 38, agi: 26, luk: 14 },
        kakuzu: { maxHp: 310, maxSp: 140, atk: 68, def: 30, agi: 30, luk: 16 },
        tobi: { maxHp: 300, maxSp: 165, atk: 66, def: 26, agi: 40, luk: 24 },
        karin: { maxHp: 250, maxSp: 170, atk: 46, def: 20, agi: 34, luk: 22 },
        marshall: { maxHp: 330, maxSp: 140, atk: 76, def: 30, agi: 28, luk: 18 },
        marco: { maxHp: 290, maxSp: 175, atk: 58, def: 26, agi: 36, luk: 20 },
        jinbe: { maxHp: 380, maxSp: 135, atk: 56, def: 44, agi: 26, luk: 16 },
        katakuri: { maxHp: 310, maxSp: 145, atk: 74, def: 28, agi: 40, luk: 26 },
        kashimo: { maxHp: 280, maxSp: 150, atk: 78, def: 22, agi: 46, luk: 20 },
        meimei: { maxHp: 265, maxSp: 140, atk: 68, def: 24, agi: 36, luk: 28 },
        muzan: { maxHp: 340, maxSp: 155, atk: 76, def: 30, agi: 38, luk: 22 },
        shinobu: { maxHp: 255, maxSp: 150, atk: 66, def: 22, agi: 44, luk: 24 },
        kishibe: { maxHp: 290, maxSp: 135, atk: 70, def: 28, agi: 38, luk: 18 },
        kobeni: { maxHp: 260, maxSp: 130, atk: 60, def: 22, agi: 44, luk: 30 },
        quanxi: { maxHp: 295, maxSp: 145, atk: 76, def: 26, agi: 48, luk: 22 },
        katana: { maxHp: 285, maxSp: 140, atk: 70, def: 26, agi: 42, luk: 16 },
        asa: { maxHp: 290, maxSp: 160, atk: 68, def: 24, agi: 36, luk: 20 },
        strohl: { maxHp: 285, maxSp: 140, atk: 70, def: 26, agi: 36, luk: 18 },
        heismay: { maxHp: 270, maxSp: 150, atk: 62, def: 24, agi: 46, luk: 24 },
        junah: { maxHp: 265, maxSp: 165, atk: 64, def: 22, agi: 34, luk: 22 },
        eupha: { maxHp: 275, maxSp: 180, atk: 60, def: 24, agi: 32, luk: 22 },
        basilio: { maxHp: 410, maxSp: 135, atk: 66, def: 44, agi: 26, luk: 14 },
        ren: { maxHp: 290, maxSp: 160, atk: 74, def: 24, agi: 40, luk: 26 },
        goro: { maxHp: 285, maxSp: 155, atk: 74, def: 24, agi: 42, luk: 22 },
        ann: { maxHp: 260, maxSp: 160, atk: 64, def: 22, agi: 34, luk: 20 },
        sumire: { maxHp: 280, maxSp: 150, atk: 74, def: 26, agi: 44, luk: 24 },
        tae: { maxHp: 255, maxSp: 170, atk: 48, def: 22, agi: 30, luk: 20 },
        futaba: { maxHp: 240, maxSp: 175, atk: 44, def: 20, agi: 32, luk: 26 },
        makoto: { maxHp: 370, maxSp: 140, atk: 58, def: 42, agi: 30, luk: 18 },
        hualkenberg: { maxHp: 385, maxSp: 135, atk: 56, def: 46, agi: 24, luk: 16 },
        genya: { maxHp: 300, maxSp: 130, atk: 70, def: 28, agi: 34, luk: 16 },
        kimimaro: { maxHp: 295, maxSp: 140, atk: 70, def: 30, agi: 40, luk: 16 },
        suigetsu: { maxHp: 350, maxSp: 130, atk: 54, def: 40, agi: 28, luk: 14 },
        yourichi: { maxHp: 300, maxSp: 155, atk: 80, def: 26, agi: 46, luk: 24 },
        konan: { maxHp: 265, maxSp: 160, atk: 64, def: 22, agi: 36, luk: 20 },
        pain: { maxHp: 310, maxSp: 170, atk: 72, def: 26, agi: 34, luk: 22 }
    },

    boot() {
        if (typeof BattleData === 'undefined' || !Array.isArray(BattleData.party)) return;
        BattleData.party.forEach((unit) => {
            const s = unit?.id && this.STATS[unit.id];
            if (!s) return;
            Object.assign(unit, { ...s, hp: s.maxHp, sp: s.maxSp });
        });
    }
};

BalancePatch.boot();

if (typeof window !== 'undefined') window.BalancePatch = BalancePatch;
