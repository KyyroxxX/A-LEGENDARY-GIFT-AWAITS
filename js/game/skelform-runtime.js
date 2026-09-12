/**
 * SkelForm runtime (DOM Canvas) — loads armature.json + atlas, draws bone hierarchy.
 * Compatible with SkelForm 0.8.x exports (ZIP .skf → armature.json + atlas0.png).
 *
 * Coordinate space: SkelForm Y-up. Canvas Y-down (flipped on draw).
 * Textures are centered on bone pivots (SkelForm default when pivot_pos is 0,0).
 */
const SkelFormRuntime = (() => {
    const DEG = Math.PI / 180;

    function clonePose(bones) {
        const pose = Object.create(null);
        bones.forEach((b) => {
            pose[b.name] = {
                x: 0, y: 0, rot: 0,
                sx: 1, sy: 1,
                alpha: 1
            };
        });
        pose.__root = { x: 0, y: 0, rot: 0, sx: 1, sy: 1, alpha: 1 };
        return pose;
    }

    function topo(bones) {
        const byId = Object.create(null);
        bones.forEach((b) => { byId[b.id] = b; });
        const ordered = [];
        const seen = new Set();
        const visit = (b) => {
            if (seen.has(b.id)) return;
            if (b.parent_id >= 0 && byId[b.parent_id]) visit(byId[b.parent_id]);
            seen.add(b.id);
            ordered.push(b);
        };
        bones.forEach(visit);
        return { byId, ordered };
    }

    async function loadPack(baseUrl) {
        const root = baseUrl.replace(/\/?$/, '/');
        const armature = await fetch(`${root}armature.json`).then((r) => {
            if (!r.ok) throw new Error(`armature missing: ${root}`);
            return r.json();
        });
        const atlasName = armature.atlases?.[0]?.filename || 'atlas0.png';
        const atlas = await new Promise((resolve, reject) => {
            const img = new Image();
            img.decoding = 'async';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`atlas missing: ${atlasName}`));
            img.src = `${root}${atlasName}`;
        });
        if (imgDecode(atlas)) await imgDecode(atlas);
        return buildModel(armature, atlas, root);
    }

    function imgDecode(img) {
        return img.decode ? img.decode().catch(() => {}) : null;
    }

    function buildModel(armature, atlas, rootUrl) {
        const { byId, ordered } = topo(armature.bones || []);
        const style = (armature.styles && armature.styles[0]) || { textures: [] };
        const texByName = Object.create(null);
        (style.textures || []).forEach((t) => { texByName[t.name] = t; });
        const visuals = armature.visuals || [];

        const parts = ordered.map((bone) => {
            const vis = visuals[bone.visuals_id] || {};
            const texName = vis.tex || bone.name;
            const tex = texByName[texName];
            return {
                bone,
                vis,
                tex,
                z: vis.zindex ?? 0,
                tint: vis.tint || { r: 1, g: 1, b: 1, a: 1 }
            };
        }).filter((p) => p.tex);

        // Rest-pose world AABB for fitting
        const rest = computeWorld(ordered, byId, clonePose(armature.bones), null);
        let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;
        parts.forEach((p) => {
            const w = rest[p.bone.name];
            if (!w) return;
            const hw = p.tex.size.x * 0.5;
            const hh = p.tex.size.y * 0.5;
            minX = Math.min(minX, w.x - hw);
            maxX = Math.max(maxX, w.x + hw);
            minY = Math.min(minY, w.y - hh);
            maxY = Math.max(maxY, w.y + hh);
        });

        return {
            version: armature.version,
            rootUrl,
            armature,
            atlas,
            style,
            texByName,
            bones: armature.bones,
            ordered,
            byId,
            parts,
            restBounds: { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY },
            createPose: () => clonePose(armature.bones)
        };
    }

    function computeWorld(ordered, byId, pose, facing = 1) {
        const world = Object.create(null);
        const root = pose.__root || { x: 0, y: 0, rot: 0, sx: 1, sy: 1 };
        ordered.forEach((bone) => {
            const init = bone;
            const delta = pose[bone.name] || { x: 0, y: 0, rot: 0, sx: 1, sy: 1 };
            const lx = (init.init_pos?.x ?? init.pos.x) + (delta.x || 0);
            const ly = (init.init_pos?.y ?? init.pos.y) + (delta.y || 0);
            const lr = ((init.init_rot ?? init.rot) + (delta.rot || 0)) * DEG;
            const lsx = (init.init_scale?.x ?? init.scale.x) * (delta.sx ?? 1);
            const lsy = (init.init_scale?.y ?? init.scale.y) * (delta.sy ?? 1);

            let px = root.x;
            let py = root.y;
            let pr = root.rot * DEG;
            let psx = root.sx * (facing || 1);
            let psy = root.sy;

            if (bone.parent_id >= 0 && world[byId[bone.parent_id]?.name]) {
                const p = world[byId[bone.parent_id].name];
                px = p.x; py = p.y; pr = p.rot; psx = p.sx; psy = p.sy;
            }

            const c = Math.cos(pr);
            const s = Math.sin(pr);
            const wx = px + (lx * c - ly * s) * Math.abs(psx);
            const wy = py + (lx * s + ly * c) * Math.abs(psy);
            world[bone.name] = {
                x: wx,
                y: wy,
                rot: pr + lr,
                sx: psx * lsx,
                sy: psy * lsy,
                alpha: delta.alpha ?? 1
            };
        });
        return world;
    }

    function fitTransform(bounds, canvasW, canvasH, pad = 0.22) {
        const bw = Math.max(1, bounds.w);
        const bh = Math.max(1, bounds.h);
        // Extra pad for lunges / ultimate dash / hair follow-through
        const scale = Math.min(
            (canvasW * (1 - pad * 2.15)) / bw,
            (canvasH * (1 - pad * 2.35)) / bh
        ) * 0.84;
        const originX = canvasW * 0.46 - ((bounds.minX + bounds.maxX) * 0.5) * scale;
        const originY = canvasH * (1 - pad * 0.42) + bounds.minY * scale;
        return { scale, originX, originY };
    }

    function draw(ctx, model, pose, opts = {}) {
        const { atlas, parts, ordered, byId, restBounds } = model;
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        const facing = opts.facing ?? 1;
        const fit = opts.fit || fitTransform(restBounds, w, h);
        const world = computeWorld(ordered, byId, pose, facing);

        ctx.clearRect(0, 0, w, h);
        ctx.save();
        if (opts.shadow !== false) {
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            ctx.beginPath();
            ctx.ellipse(w * 0.5, h * 0.96, w * 0.22, h * 0.03, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        const sorted = parts.slice().sort((a, b) => a.z - b.z);
        sorted.forEach((p) => {
            const wr = world[p.bone.name];
            if (!wr) return;
            const tw = p.tex.size.x;
            const th = p.tex.size.y;
            const sx = p.tex.offset.x;
            const sy = p.tex.offset.y;
            const cx = fit.originX + wr.x * fit.scale;
            const cy = fit.originY - wr.y * fit.scale;
            const rot = -wr.rot; // Y-up → canvas

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rot);
            ctx.scale(Math.sign(wr.sx) || 1, Math.sign(wr.sy) || 1);
            const drawW = tw * fit.scale * Math.abs(wr.sx);
            const drawH = th * fit.scale * Math.abs(wr.sy);
            ctx.globalAlpha = (p.tint.a ?? 1) * (wr.alpha ?? 1);
            ctx.drawImage(atlas, sx, sy, tw, th, -drawW * 0.5, -drawH * 0.5, drawW, drawH);
            ctx.restore();
        });
        ctx.restore();
        return fit;
    }

    /** Inspect helper for debugging exports */
    function inspect(armature) {
        const bones = armature.bones || [];
        return {
            version: armature.version,
            baked_ik: armature.baked_ik,
            img_format: armature.img_format,
            boneCount: bones.length,
            bones: bones.map((b) => ({
                id: b.id,
                name: b.name,
                parent_id: b.parent_id,
                pos: b.pos,
                rot: b.rot,
                scale: b.scale,
                visuals_id: b.visuals_id,
                ik_family_id: b.ik_family_id,
                physics_id: b.physics_id
            })),
            hierarchy: bones.map((b) => {
                const parent = bones.find((x) => x.id === b.parent_id);
                return `${parent ? parent.name : '(root)'} → ${b.name}`;
            }),
            styles: (armature.styles || []).map((s) => ({
                id: s.id,
                name: s.name,
                textures: (s.textures || []).map((t) => ({
                    name: t.name,
                    atlas_idx: t.atlas_idx,
                    offset: t.offset,
                    size: t.size
                }))
            })),
            visuals: armature.visuals,
            atlases: armature.atlases,
            inverse_kinematics: armature.inverse_kinematics,
            physics: armature.physics,
            animations: armature.animations || [],
            meshes: armature.meshes || null,
            weights: armature.weights || null,
            attachments: armature.attachments || null,
            notes: [
                'No baked animations in this export — drive bones via code keyframes.',
                'No mesh/weights/skins beyond style textures (rigid sprite-per-bone).',
                'Textures live in atlas; style.textures provide UV rects (attachments).'
            ]
        };
    }

    return { loadPack, buildModel, computeWorld, fitTransform, draw, clonePose, inspect };
})();

if (typeof window !== 'undefined') window.SkelFormRuntime = SkelFormRuntime;
