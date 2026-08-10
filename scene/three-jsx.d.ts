// Teaches TypeScript that <mesh>, <planeGeometry> and friends are real elements.
//
// React 19 moved the JSX namespace inside `React`, so react-three-fiber v9 no
// longer augments the old global one and every three.js element reads as an
// unknown intrinsic. This is the augmentation r3f documents for React 19, kept
// in the scene folder because that is the only place these elements appear.

import type { ThreeElements } from "@react-three/fiber";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}
