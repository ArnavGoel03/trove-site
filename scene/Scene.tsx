"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  Color,
  FogExp2,
  type GridHelper,
  type LineBasicMaterial,
  type Mesh,
  type MeshBasicMaterial,
  type PerspectiveCamera,
  type Texture,
} from "three";

import { ACCENT } from "@/lib/brand-tokens.generated";
import { TROVE } from "@/lib/brand";
import { SECTIONS } from "@/lib/panes";
import type { ProgressStore } from "@/components/stage/progress";
import type { Capability } from "./quality";
import {
  HERO_H,
  HERO_SECTION,
  HERO_W,
  heroPose,
  heroSectionIndex,
  moodAt,
} from "./drive";
import { CAMERA_LAMBDA, damp, OPENING, poseAt, type CameraPose } from "./rig";
import Sprawl from "./Sprawl";
import WindowPlane from "./Window";
import { glowTexture, heroTexture } from "./textures";

/**
 * The page's background colour, read from the stylesheet rather than retyped.
 *
 * Fog fades geometry toward this value, and the canvas is transparent, so if
 * this and `--color-bg` ever disagreed there would be a visible rectangle where
 * the scene sits. Reading the custom property keeps globals.css the one place
 * the colour is decided.
 */
function pageBackground(): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-bg")
    .trim();
  return value || "#000000";
}

/** Section names for the hero window's sidebar, straight from the pane catalogue. */
const SIDEBAR = SECTIONS.map((s) => s.name);

/** The distinct sidebar rows any beat highlights, so we draw only those faces. */
const HERO_FACES = Array.from(
  new Set<number>([0, ...Object.values(HERO_SECTION).filter((n): n is number => typeof n === "number")]),
);

function Rig({
  store,
  narrow,
  onReady,
}: {
  readonly store: ProgressStore;
  readonly narrow: boolean;
  readonly onReady: () => void;
}) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const held = useRef<CameraPose | null>(null);
  const announced = useRef(false);

  useFrame((_, dt) => {
    // Composition depends on how wide the frame actually is, so it is read from
    // the camera each frame rather than guessed once: a window resize or a
    // phone rotating recomposes the shot instead of cropping it.
    const target = poseAt(store.get(), { narrow, aspect: camera.aspect || 16 / 9 });
    // First frame lands on the target exactly, so the scene opens in its pose
    // instead of swooping in from wherever the default camera happened to be.
    const now = held.current ?? target;

    const next: CameraPose = held.current
      ? {
          x: damp(now.x, target.x, CAMERA_LAMBDA, dt),
          y: damp(now.y, target.y, CAMERA_LAMBDA, dt),
          z: damp(now.z, target.z, CAMERA_LAMBDA, dt),
          tx: damp(now.tx, target.tx, CAMERA_LAMBDA, dt),
          ty: damp(now.ty, target.ty, CAMERA_LAMBDA, dt),
          fov: damp(now.fov, target.fov, CAMERA_LAMBDA, dt),
        }
      : target;
    held.current = next;

    camera.position.set(next.x, next.y, next.z);
    camera.lookAt(next.tx, next.ty, 0);
    if (Math.abs(camera.fov - next.fov) > 0.002) {
      camera.fov = next.fov;
      camera.updateProjectionMatrix();
    }

    // One frame is on screen, so the poster underneath can go. Announcing it
    // from inside the loop rather than on mount is the point: the canvas
    // element exists well before three has drawn anything into it, and fading
    // the poster on mount shows a black frame for as long as that takes.
    if (!announced.current) {
      announced.current = true;
      onReady();
    }
  });

  return null;
}

function Atmosphere({ store, background }: { readonly store: ProgressStore; readonly background: string }) {
  const scene = useThree((s) => s.scene);
  const fog = useMemo(() => new FogExp2(new Color(background).getHex(), 0.06), [background]);

  useEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);

  useFrame(() => {
    fog.density = moodAt(store.get()).fog;
  });

  return null;
}

/**
 * A floor, drawn as lines rather than a surface.
 *
 * A lit plane would need a light, and the windows are unlit; a flat coloured
 * plane at this size reads as a glowing slab. Lines give the frame a horizon
 * and a sense of depth for the price of one draw call, and the fog does the
 * rest: the far rows dissolve into the page background exactly where the
 * sprawl's deepest windows do.
 */
function Floor({ store }: { readonly store: ProgressStore }) {
  const grid = useRef<GridHelper>(null);
  const line = useMemo(() => new Color(ACCENT).lerp(new Color("#ffffff"), 0.3), []);

  useEffect(() => {
    const material = grid.current?.material as LineBasicMaterial | undefined;
    if (material) {
      material.transparent = true;
      material.depthWrite = false;
    }
  }, []);

  useFrame(() => {
    const material = grid.current?.material as LineBasicMaterial | undefined;
    if (material) material.opacity = moodAt(store.get()).grid;
  });

  return <gridHelper ref={grid} args={[60, 60, line, line]} position={[0, -2.6, -6]} />;
}

function Hero({ store }: { readonly store: ProgressStore }) {
  const mesh = useRef<Mesh>(null);
  const glow = useRef<Mesh>(null);
  const shown = useRef(-1);

  const faces = useMemo(() => {
    const map = new Map<number, Texture | null>();
    for (const index of HERO_FACES) {
      map.set(index, heroTexture(TROVE.name, SIDEBAR, ACCENT, index));
    }
    return map;
  }, []);
  const halo = useMemo(() => glowTexture(ACCENT), []);

  useEffect(() => {
    return () => {
      for (const t of faces.values()) t?.dispose();
      halo?.dispose();
    };
  }, [faces, halo]);

  useFrame(() => {
    const frame = store.get();
    const pose = heroPose(frame);
    const mood = moodAt(frame);

    const node = mesh.current;
    if (node) {
      node.position.set(pose.x, pose.y, pose.z);
      node.rotation.set(pose.rx, pose.ry, pose.rz);
      node.scale.setScalar(pose.scale);

      const material = node.material as MeshBasicMaterial;
      material.opacity = pose.opacity;
      // The texture already carries its own shading, so "light" here is a
      // multiply on it. Cheap, and it cannot blow out to white.
      material.color.setScalar(mood.key);

      const face = heroSectionIndex(frame);
      if (face !== shown.current) {
        shown.current = face;
        const texture = faces.get(face);
        if (texture) {
          material.map = texture;
          material.needsUpdate = true;
        }
      }
    }

    const behind = glow.current;
    if (behind) {
      behind.position.set(pose.x, pose.y, pose.z - 0.4);
      behind.scale.setScalar(pose.scale * (1 + mood.rim * 0.3));
      (behind.material as MeshBasicMaterial).opacity = mood.rim * 0.38;
    }
  });

  return (
    <group>
      <mesh ref={glow} renderOrder={0}>
        <planeGeometry args={[HERO_W * 2.4, HERO_H * 2.4]} />
        <meshBasicMaterial
          map={halo ?? undefined}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <WindowPlane
        ref={mesh}
        texture={faces.get(0) ?? null}
        width={HERO_W}
        height={HERO_H}
        renderOrder={2}
      />
    </group>
  );
}

export interface SceneProps {
  readonly store: ProgressStore;
  readonly capability: Capability;
  /** Called once, on the first frame three actually draws. */
  readonly onReady: () => void;
}

/**
 * The WebGL half of the stage.
 *
 * Reached only through `next/dynamic` with `ssr: false`, and only once the
 * client has confirmed WebGL2 and no reduced-motion preference. Everything it
 * draws is geometry: not one glyph of the argument lives in here, because text
 * in a canvas is text no screen reader will read, no visitor can select, and no
 * crawler will index.
 *
 * The render loop stops entirely when the stage scrolls out of view. A page
 * that keeps a GPU busy drawing something nobody is looking at is a page that
 * drains a battery to no purpose, and this one is nine viewports tall.
 */
export default function Scene({ store, capability, onReady }: SceneProps) {
  const host = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  const [background, setBackground] = useState<string | null>(null);

  useEffect(() => setBackground(pageBackground()), []);

  useEffect(() => {
    const node = host.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "10%" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className="size-full">
      <Canvas
        dpr={capability.dpr}
        frameloop={onScreen ? "always" : "never"}
        gl={{
          alpha: true,
          antialias: capability.quality !== "low",
          powerPreference: "high-performance",
        }}
        camera={{ position: [OPENING.x, OPENING.y, OPENING.z], fov: OPENING.fov, near: 0.1, far: 60 }}
      >
        {background ? <Atmosphere store={store} background={background} /> : null}
        <Rig store={store} narrow={capability.narrow} onReady={onReady} />
        <Floor store={store} />
        <Hero store={store} />
        <Sprawl store={store} />
      </Canvas>
    </div>
  );
}
