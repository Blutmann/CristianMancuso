"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import {
  BUTTON_OPTIONS,
  type ButtonOption,
  type CatalogShirt,
} from "@/data/catalog";

const MODEL_PATH = "/models/shirt.glb";

export interface ShirtGLBViewerProps {
  shirt: CatalogShirt;
  buttonId: ButtonOption;
  step: 1 | 4;
  isMotionPaused: boolean;
}

/**
 * Generates a tileable procedural fabric CanvasTexture matching the 5 real weaves
 * while preserving the CLO3D normalMap folds & stitching.
 */
function createFabricCanvasTexture(shirt: CatalogShirt): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = shirt.baseHex;
    ctx.fillRect(0, 0, size, size);

    if (shirt.weaveKind === "twill") {
      // Fine Peruvian Pima 120/2 diagonal twill
      ctx.strokeStyle = shirt.secondaryHex;
      ctx.globalAlpha = 0.42;
      ctx.lineWidth = 2;
      for (let i = -size; i < size * 2; i += 7) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
        ctx.stroke();
      }
    } else if (shirt.weaveKind === "linen") {
      // Natural Italian Biella linen slub weave
      ctx.globalAlpha = 0.34;
      for (let y = 0; y < size; y += 6) {
        ctx.strokeStyle = y % 12 === 0 ? shirt.secondaryHex : shirt.baseHex;
        ctx.lineWidth = y % 18 === 0 ? 2.1 : 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.22;
      for (let x = 0; x < size; x += 8) {
        ctx.strokeStyle = shirt.secondaryHex;
        ctx.lineWidth = x % 24 === 0 ? 1.8 : 0.9;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
      }
    } else if (shirt.weaveKind === "oxford") {
      // Classic Oxford basketweave dots
      ctx.fillStyle = shirt.secondaryHex;
      ctx.globalAlpha = 0.48;
      for (let y = 0; y < size; y += 6) {
        for (let x = 0; x < size; x += 6) {
          if ((x / 6 + y / 6) % 2 === 0) {
            ctx.fillRect(x, y, 3, 2);
          }
        }
      }
    } else if (shirt.weaveKind === "windowpane") {
      // Subtle warm windowpane check over dark navy blend
      ctx.strokeStyle = shirt.secondaryHex;
      ctx.globalAlpha = 0.38;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < size; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
      }
      ctx.strokeStyle = "#D6C3A5";
      ctx.globalAlpha = 0.62;
      ctx.lineWidth = 2.4;
      const cell = 128;
      for (let p = cell / 2; p < size; p += cell) {
        ctx.beginPath();
        ctx.moveTo(p, 0);
        ctx.lineTo(p, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, p);
        ctx.lineTo(size, p);
        ctx.stroke();
      }
    } else if (shirt.weaveKind === "mineral-stripe") {
      // Fine slate vertical stripes on pale pearl-blush cloque
      ctx.strokeStyle = "#5B6472";
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 2.5;
      for (let x = 8; x < size; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
      }
      ctx.strokeStyle = shirt.secondaryHex;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1;
      for (let y = 0; y < size; y += 6) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const repeatFactor = shirt.weaveKind === "windowpane" ? 5 : 10;
  texture.repeat.set(repeatFactor, repeatFactor);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function Clo3DShirtModel({
  shirt,
  buttonId,
  step,
  isMotionPaused,
}: ShirtGLBViewerProps) {
  const { scene } = useGLTF(MODEL_PATH, true);
  const groupRef = useRef<THREE.Group | null>(null);

  // Clone scene & materials once and compute exact centering/normalization from CLO3D cm bounds
  const { clonedScene, normScale, normOffset } = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (Array.isArray(child.material)) {
          child.material = child.material.map((m) => m.clone());
        } else if (child.material) {
          child.material = child.material.clone();
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 1.85 / maxDim;
    const offset = center.multiplyScalar(-scale);

    return {
      clonedScene: clone,
      normScale: scale,
      normOffset: [offset.x, offset.y, offset.z] as [number, number, number],
    };
  }, [scene]);

  // Procedural fabric texture updated live when fabric changes
  const fabricTexture = useMemo(() => createFabricCanvasTexture(shirt), [shirt]);

  useEffect(() => {
    return () => {
      fabricTexture.dispose();
    };
  }, [fabricTexture]);

  // Project fabric & button materials onto CLO3D meshes while preserving original normalMap folds
  useEffect(() => {
    const btnOption =
      BUTTON_OPTIONS.find((b) => b.id === buttonId) ?? BUTTON_OPTIONS[3];
    const buttonColorHex =
      buttonId === "Mismo tono que la camisa" ? shirt.baseHex : btnOption.fill;

    const fabricRoughness =
      shirt.weaveKind === "linen"
        ? 0.92
        : shirt.weaveKind === "twill"
          ? 0.78
          : 0.85;

    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      const meshName = child.name.toLowerCase();
      const isButtonMesh = meshName.includes("button");
      const isStitchMesh =
        meshName.includes("topstitch") ||
        meshName.includes("bindedtrim") ||
        meshName.includes("bartack");

      materials.forEach((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return;
        const matName = mat.name.toLowerCase();
        const isButtonMat = isButtonMesh || matName.includes("button");
        const isStitchMat =
          isStitchMesh ||
          matName.includes("bartack") ||
          matName.includes("placket") ||
          matName.includes("yoke") ||
          matName.includes("collar") ||
          matName.includes("cuff") ||
          matName.includes("ss_");

        if (isButtonMat) {
          mat.map = null;
          mat.color.set(buttonColorHex);
          mat.roughness = buttonId === "Nácar blanco" ? 0.18 : 0.42;
          mat.metalness = buttonId === "Nácar blanco" ? 0.16 : 0.04;
          mat.envMapIntensity = 0.85;
          mat.needsUpdate = true;
        } else if (isStitchMat) {
          mat.map = null;
          mat.roughnessMap = null;
          mat.color.set(shirt.secondaryHex);
          mat.roughness = 0.88;
          mat.metalness = 0;
          mat.envMapIntensity = 0.4;
          mat.needsUpdate = true;
        } else {
          // Main garment cloth (Cloth_mesh / solid_2580): natural matte sartorial weave
          mat.map = fabricTexture;
          mat.roughnessMap = null;
          mat.metalnessMap = null;
          mat.color.set("#FFFFFF");
          mat.roughness = fabricRoughness;
          mat.metalness = 0;
          mat.envMapIntensity = 0.45;
          if (mat instanceof THREE.MeshPhysicalMaterial) {
            mat.clearcoat = 0;
            mat.specularIntensity = 0.18;
          }
          if (mat.normalMap) {
            mat.normalScale.set(1.15, 1.15);
          }
          mat.needsUpdate = true;
        }
      });
    });
  }, [clonedScene, fabricTexture, shirt, buttonId]);

  // Gentle idle turntable rotation in Step 1; smooth return to front-facing in Step 4 (Medidas)
  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || isMotionPaused) return;
    if (step === 1) {
      group.rotation.y += delta * 0.22;
    } else if (step === 4) {
      // Normalize angle cleanly to [-PI, PI] and lerp smoothly to front
      const current =
        ((group.rotation.y + Math.PI) % (Math.PI * 2) + Math.PI * 2) %
          (Math.PI * 2) -
        Math.PI;
      group.rotation.y = THREE.MathUtils.lerp(current, 0, Math.min(1, delta * 4));
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={clonedScene}
        scale={normScale}
        position={normOffset}
      />
    </group>
  );
}

useGLTF.preload(MODEL_PATH, true);

export default function ShirtGLBViewer({
  shirt,
  buttonId,
  step,
  isMotionPaused,
}: ShirtGLBViewerProps) {
  return (
    <div className="relative h-full w-full cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.02, 4.4], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.02,
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[3.5, 4.5, 4.5]}
          intensity={1.15}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-3.5, 2.2, -2.5]} intensity={0.55} />

        {/* Offline procedural studio softboxes (Cloudflare Pages static-safe) */}
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={1.4}
            position={[0, 4, 3]}
            rotation={[Math.PI / 4, 0, 0]}
            scale={[8, 4, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.0}
            position={[-5, 1.5, 2]}
            rotation={[0, Math.PI / 2.2, 0]}
            scale={[5, 5, 1]}
          />
          <Lightformer
            form="rect"
            intensity={0.8}
            position={[5, 1.5, -1]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[5, 5, 1]}
          />
        </Environment>

        <Suspense fallback={null}>
          <Clo3DShirtModel
            shirt={shirt}
            buttonId={buttonId}
            step={step}
            isMotionPaused={isMotionPaused}
          />
        </Suspense>

        <ContactShadows
          position={[0, -1.06, 0]}
          opacity={0.28}
          scale={3.6}
          blur={2.5}
          far={2.2}
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.9}
          maxPolarAngle={Math.PI / 1.72}
          dampingFactor={0.07}
          enableDamping
        />
      </Canvas>
    </div>
  );
}
