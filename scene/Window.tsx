"use client";

import { forwardRef } from "react";
import type { Mesh, Texture } from "three";

/**
 * One window plane, shared by the hero and by every rival.
 *
 * Unlit on purpose. The face is a canvas texture that already contains its own
 * shading, so running it through a lit material would mean paying for lights
 * and normals to arrive back at roughly the picture we drew. Brightness is
 * instead a multiply on the material colour, which `Scene` drives per frame
 * from `moodAt`: cheap, exact, and reversible like everything else here.
 *
 * `depthWrite` is off because every window is transparent. Left on, a nearer
 * window would punch a hole in the depth buffer and the windows behind it would
 * vanish through its transparent rounded corners.
 */
export interface WindowProps {
  readonly texture: Texture | null;
  readonly width: number;
  readonly height: number;
  readonly renderOrder?: number;
}

const WindowPlane = forwardRef<Mesh, WindowProps>(function WindowPlane(
  { texture, width, height, renderOrder = 0 },
  ref,
) {
  return (
    <mesh ref={ref} renderOrder={renderOrder} frustumCulled={false}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture ?? undefined}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
});

export default WindowPlane;
