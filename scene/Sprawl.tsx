"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, MeshBasicMaterial } from "three";

import { RIVALS } from "@/lib/rivals";
import type { ProgressStore } from "@/components/stage/progress";
import { RIVAL_H, RIVAL_W, rivalPose, spreadAt } from "./drive";
import { rivalTexture } from "./textures";
import WindowPlane from "./Window";

/**
 * The mess: one window per app in the ledger, flying out and folding back in.
 *
 * The count is `RIVALS.length` and nothing here knows what that number is. The
 * ledger loses an entry the next time a vendor's price cannot be verified, and
 * when it does, this scene simply has one window fewer. A hardcoded twelve
 * would put the sales argument and the picture of the sales argument out of
 * step, which is the exact failure the receipt is meant to be immune to.
 *
 * Poses are written straight onto the Object3D in `useFrame` rather than
 * through React state. Ten windows at 120Hz is 1,200 re-renders a second, and
 * React would be doing reconciliation work to arrive at numbers we already have.
 */
export default function Sprawl({ store }: { readonly store: ProgressStore }) {
  const meshes = useRef<(Mesh | null)[]>([]);

  const textures = useMemo(() => RIVALS.map((r) => rivalTexture(r.name, r.does)), []);
  useEffect(() => {
    return () => {
      for (const t of textures) t?.dispose();
    };
  }, [textures]);

  useFrame(() => {
    const frame = store.get();
    const spread = spreadAt(frame);

    for (let i = 0; i < meshes.current.length; i++) {
      const mesh = meshes.current[i];
      if (!mesh) continue;

      const pose = rivalPose(i, RIVALS.length, spread);
      // Below this the window contributes nothing but a transparent draw call,
      // and there are ten of them.
      mesh.visible = pose.opacity > 0.003;
      if (!mesh.visible) continue;

      mesh.position.set(pose.x, pose.y, pose.z);
      mesh.rotation.set(pose.rx, pose.ry, pose.rz);
      mesh.scale.setScalar(pose.scale);
      (mesh.material as MeshBasicMaterial).opacity = pose.opacity;
    }
  });

  return (
    <group>
      {RIVALS.map((rival, i) => (
        <WindowPlane
          key={rival.name}
          ref={(el: Mesh | null) => {
            meshes.current[i] = el;
          }}
          texture={textures[i]}
          width={RIVAL_W}
          height={RIVAL_H}
          renderOrder={1}
        />
      ))}
    </group>
  );
}
