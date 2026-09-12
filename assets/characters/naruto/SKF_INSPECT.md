# Naruto.skf — inspección (SkelForm 0.8.0)

Fuente: `assets/characters/naruto/Naruto.skf` (ZIP).  
Runtime: `assets/characters/naruto/skf/` (`armature.json` + `atlas0.png`).

## Contenido

| Archivo | Rol |
|---------|-----|
| `armature.json` | Huesos, estilos/texturas (UVs), visuals, atlases |
| `atlas0.png` | Atlas de texturas |
| `editor.json` | Solo editor |
| `thumbnail.png` | Preview |
| `readme.md` | Spec tips |

## Bones (17) — jerarquía (reordenada)

```
pelvis (ROOT)
 ├ torso
 │  ├ neck → head → hair
 │  ├ upper_arm_r → forearm_r → hand_r
 │  └ upper_arm_l → forearm_l → hand_l
 ├ upper_leg_r → lower_leg_r → foot_r
 └ upper_leg_l → lower_leg_l → foot_l
```

Campos: `id`, `name`, `parent_id`, `pos`/`rot`/`scale`, `init_*`, `visuals_id`, IK/physics ids.

## Styles / textures

Style `Naruto`: 17 texturas con `offset`/`size` en atlas (UV rects). Sin meshes/weights deformables.

## Visuals

`tex`, `tint`, `zindex`, `pivot_*` (pivots a 0 → textura centrada en el bone).

## Animaciones baked

Ninguna en el `.skf`. Las clips viven en `js/game/characters/naruto-skel-anims.js` y mueven bones por nombre.

## Refresh pack

```bash
python scripts/refresh-naruto-skf-pack.py
```
