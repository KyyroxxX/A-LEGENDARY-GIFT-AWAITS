globalThis.window = globalThis;
globalThis.GameState = { get: () => undefined, flag: () => false };
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const load = (rel, names) => {
  let code = fs.readFileSync(path.join(root, rel), 'utf8');
  for (const n of names) code = code.replace(new RegExp(`^(const|let|var)\\s+(${n})\\s*=`, 'm'), 'globalThis.$2 =');
  eval(code);
};
load('js/game/battle-data.js', ['BattleData']);
load('js/game/fighter-kits.js', ['FighterKits']);
load('js/game/roster-expansion.js', []);
load('js/game/user-character-expansion.js', ['UserCharacterExpansion']);
load('js/game/jjk-data.js', ['JJKData']);
load('js/game/kimetsu-data.js', ['KimetsuData']);
load('js/game/chainsaw-data.js', ['ChainsawData']);
load('js/game/final-trio-data.js', []);
load('js/game/character-registry.js', ['CharacterRegistry']);
load('js/game/char-progress.js', ['CharProgress']);
load('js/game/gacha-roster.js', ['GachaRoster']);
const GR = globalThis.GachaRoster;
for (const u of globalThis.BattleData.party) {
  const sk = [...(u.skills || []), ...(u.transformedSkills || [])];
  const heal = sk.filter(s => s.heal).reduce((m, s) => Math.max(m, s.heal || 0), 0);
  if (!heal && !['Healer', 'Support'].includes(u.role)) continue;
  let stars = '?';
  try { stars = GR.primaryStars(u.id); } catch (_) {}
  if (Number(stars) <= 4) console.log(`- ${u.id} [${u.role}] ${stars}★ hp=${u.maxHp} heal=${heal}`);
}
