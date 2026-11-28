"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Center,
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Move, Plus, Rotate3d, RotateCcw } from "lucide-react";
import {
  BUTTON_OPTIONS,
  type ButtonOption,
  type CatalogShirt,
} from "@/data/catalog";

const MODEL_PATH = "/models/shirt.glb";
const DEFAULT_CAMERA_Z = 3.85;
const MOBILE_CAMERA_Z = 3.4;
const MIN_CAMERA_DIST = 1.4;
const MAX_CAMERA_DIST = 5.6;
const ZOOM_STEP = 0.4;

export interface ShirtGLBViewerProps {
  shirt: CatalogShirt;
  buttonId: ButtonOption;
  step: 1 | 4;
  isMotionPaused: boolean;
  onWebGLError?: () => void;
}

interface WindowpaneUniforms {
  uWindowpane: { value: number };
  uLineColor: { value: THREE.Color };
}

/**
 * Generates a tileable procedural fabric CanvasTexture matching the 5 real weaves
 * while preserving the CLO3D normalMap folds & stitching.
 * Note: For "windowpane", only the woven linen-cotton base is drawn here; the
 * check lines themselves are projected seamlessly in 3D local space via shader
 * so left/right placket UV islands align with zero seam offset.
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
      // Subtle linen-cotton woven base (check lines projected in 3D local space)
      ctx.strokeStyle = shirt.secondaryHex;
      ctx.globalAlpha = 0.36;
      ctx.lineWidth = 1.4;
      for (let i = 0; i < size; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
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
  const repeatFactor = shirt.weaveKind === "windowpane" ? 8 : 10;
  texture.repeat.set(repeatFactor, repeatFactor);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Patches a cloth MeshStandardMaterial with a seamless 3D local-space windowpane
 * check overlay so horizontal & vertical lines align perfectly across the center placket.
 */
function attachSeamlessWindowpaneShader(
  mat: THREE.MeshStandardMaterial,
  uniforms: WindowpaneUniforms
) {
  mat.customProgramCacheKey = () => "cm-seamless-windowpane-v1";
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uWindowpane = uniforms.uWindowpane;
    shader.uniforms.uLineColor = uniforms.uLineColor;

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        varying vec3 vShirtLocalPos;
        varying vec3 vShirtLocalNormal;`
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vShirtLocalPos = position;
        vShirtLocalNormal = normalize(normal);`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uWindowpane;
        uniform vec3 uLineColor;
        varying vec3 vShirtLocalPos;
        varying vec3 vShirtLocalNormal;`
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        if (uWindowpane > 0.5) {
          // CLO3D model coordinates are in cm: ~4.4 cm windowpane grid
          float spacing = 4.4;
          // Use X on front/back and blend to Z on side seams so checks wrap cleanly
          float sideBlend = smoothstep(0.55, 0.85, abs(vShirtLocalNormal.x));
          float horizCoord = mix(vShirtLocalPos.x, vShirtLocalPos.z, sideBlend);
          float vertCoord = vShirtLocalPos.y;

          float gx = abs(fract((horizCoord + spacing * 0.5) / spacing) - 0.5) * spacing;
          float gy = abs(fract((vertCoord + spacing * 0.5) / spacing) - 0.5) * spacing;

          float fwX = max(fwidth(horizCoord), 0.04);
          float fwY = max(fwidth(vertCoord), 0.04);
          float halfWidth = 0.095;

          float lineX = 1.0 - smoothstep(halfWidth - fwX, halfWidth + fwX, gx);
          float lineY = 1.0 - smoothstep(halfWidth - fwY, halfWidth + fwY, gy);
          float checkMask = clamp(max(lineX, lineY), 0.0, 1.0);

          diffuseColor.rgb = mix(diffuseColor.rgb, uLineColor, checkMask * 0.62);
        }`
      );
  };
}

type InteractionMode = "rotate" | "pan";
type FocusPreset = "completa" | "cuello" | "puno";

const FOCUS_PRESETS: Record<
  FocusPreset,
  { label: string; target: [number, number, number]; distance: number }
> = {
  completa: { label: "Completa", target: [0, 0, 0], distance: DEFAULT_CAMERA_Z },
  cuello: { label: "Cuello", target: [0, 0.68, 0.05], distance: 1.7 },
  puno: { label: "Puño", target: [0.58, -0.56, 0.08], distance: 1.78 },
};

function CameraZoomRig({
  targetDistance,
  focusTarget,
  focusSignal,
  resetSignal,
  interactionMode,
  isMotionPaused,
  onMobileMount,
}: {
  targetDistance: number;
  focusTarget: [number, number, number];
  focusSignal: number;
  resetSignal: number;
  interactionMode: InteractionMode;
  isMotionPaused: boolean;
  onMobileMount: (mobileZ: number) => void;
}) {
  const { camera, get } = useThree();
  const controlsRef =
    useRef<React.ComponentRef<typeof OrbitControls> | null>(null);
  const desiredTargetRef = useRef<THREE.Vector3 | null>(null);
  const desiredDistRef = useRef<number | null>(null);

  // Calibrate mobile camera on real client mount (avoids static-export SSR hydration mismatch)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) {
      const cam = get().camera;
      cam.position.set(0, 0, MOBILE_CAMERA_Z);
      desiredDistRef.current = MOBILE_CAMERA_Z;
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
      onMobileMount(MOBILE_CAMERA_Z);
    }
  }, [get, onMobileMount]);

  // Trigger smooth distance transition when user clicks + / - / preset
  useEffect(() => {
    desiredDistRef.current = targetDistance;
  }, [targetDistance]);

  // Trigger smooth target transition only when user clicks a Focus Preset
  useEffect(() => {
    if (focusSignal === 0) return;
    desiredTargetRef.current = new THREE.Vector3(...focusTarget);
  }, [focusSignal, focusTarget]);

  // Explicit Reset returns cleanly to default front view for current viewport
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls || resetSignal === 0) return;
    desiredTargetRef.current = null;
    desiredDistRef.current = null;
    const baseZ =
      typeof window !== "undefined" && window.innerWidth < 768
        ? MOBILE_CAMERA_Z
        : DEFAULT_CAMERA_Z;
    camera.position.set(0, 0, baseZ);
    controls.target.set(0, 0, 0);
    controls.update();
  }, [resetSignal, camera]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const lerpAlpha = isMotionPaused ? 1 : Math.min(1, delta * 7);
    let dirty = false;

    if (desiredTargetRef.current) {
      const distToTarget = controls.target.distanceTo(desiredTargetRef.current);
      if (distToTarget > 0.004) {
        const prevTarget = controls.target.clone();
        controls.target.lerp(desiredTargetRef.current, lerpAlpha);
        // Move camera along with target delta so angle stays natural
        camera.position.add(controls.target.clone().sub(prevTarget));
        dirty = true;
      } else {
        desiredTargetRef.current = null;
      }
    }

    if (desiredDistRef.current !== null) {
      const offset = camera.position.clone().sub(controls.target);
      const currentDist = offset.length();
      if (
        currentDist > 0.001 &&
        Math.abs(currentDist - desiredDistRef.current) > 0.005
      ) {
        const nextDist = THREE.MathUtils.lerp(
          currentDist,
          desiredDistRef.current,
          lerpAlpha
        );
        offset.setLength(nextDist);
        camera.position.copy(controls.target).add(offset);
        dirty = true;
      } else {
        desiredDistRef.current = null;
      }
    }

    if (dirty) {
      controls.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={true}
      screenSpacePanning={true}
      panSpeed={0.9}
      minDistance={MIN_CAMERA_DIST}
      maxDistance={MAX_CAMERA_DIST}
      minPolarAngle={Math.PI / 2.9}
      maxPolarAngle={Math.PI / 1.72}
      dampingFactor={0.07}
      enableDamping
      onStart={() => {
        // Never fight manual user drag/pan
        desiredTargetRef.current = null;
      }}
      mouseButtons={
        interactionMode === "pan"
          ? {
              LEFT: THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.ROTATE,
            }
          : {
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN,
            }
      }
      touches={
        interactionMode === "pan"
          ? {
              ONE: THREE.TOUCH.PAN,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }
          : {
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_ROTATE,
            }
      }
    />
  );
}

function Clo3DShirtModel({
  shirt,
  buttonId,
  step,
  isMotionPaused,
  resetSignal,
  onReady,
}: ShirtGLBViewerProps & { resetSignal: number; onReady: () => void }) {
  const { scene } = useGLTF(MODEL_PATH, true);
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    onReady();
  }, [onReady]);

  // Clone scene & materials once and compute normalized 2.0 scale from CLO3D cm bounds
  const { clonedScene, normScale } = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const meshName = child.name.toLowerCase();
        const isButtonMesh = meshName.includes("button");
        const isStitchMesh =
          meshName.includes("topstitch") ||
          meshName.includes("bindedtrim") ||
          meshName.includes("bartack");

        const cloneAndPatch = (m: THREE.Material) => {
          const clonedMat = m.clone();
          if (
            clonedMat instanceof THREE.MeshStandardMaterial &&
            !isButtonMesh &&
            !isStitchMesh &&
            !clonedMat.name.toLowerCase().includes("button")
          ) {
            const uniforms: WindowpaneUniforms = {
              uWindowpane: { value: 0 },
              uLineColor: { value: new THREE.Color("#D6C3A5") },
            };
            clonedMat.userData.windowpaneUniforms = uniforms;
            attachSeamlessWindowpaneShader(clonedMat, uniforms);
          }
          return clonedMat;
        };

        if (Array.isArray(child.material)) {
          child.material = child.material.map(cloneAndPatch);
        } else if (child.material) {
          child.material = cloneAndPatch(child.material);
        }
      }
    });

    // Ensure world matrices are updated and compute Box3 strictly over visible Mesh children
    // (ignores any hidden armature/helper nodes that could shift vertical center upward)
    clone.updateMatrixWorld(true);
    const box = new THREE.Box3();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.visible) {
        box.expandByObject(child);
      }
    });
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    // Uniform 2.0 normalized size for strong presence across desktop and mobile
    const scale = 2.0 / maxDim;

    return {
      clonedScene: clone,
      normScale: scale,
    };
  }, [scene]);

  // Procedural fabric texture updated live when fabric changes
  const fabricTexture = useMemo(() => createFabricCanvasTexture(shirt), [shirt]);

  useEffect(() => {
    return () => {
      fabricTexture.dispose();
    };
  }, [fabricTexture]);

  // Reset turntable rotation when user clicks Reset
  useEffect(() => {
    if (resetSignal > 0 && groupRef.current) {
      groupRef.current.rotation.y = 0;
    }
  }, [resetSignal]);

  // Project fabric & button materials onto CLO3D meshes while preserving original normalMap folds
  useEffect(() => {
    const isWindowpane = shirt.weaveKind === "windowpane" ? 1 : 0;

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
          mat.roughnessMap = null;
          mat.metalnessMap = null;
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
          // Main garment cloth (Cloth_mesh / Cotton_50s_Poplin): natural matte sartorial weave
          const uniforms = mat.userData.windowpaneUniforms as
            | WindowpaneUniforms
            | undefined;
          if (uniforms) {
            uniforms.uWindowpane.value = isWindowpane;
          }
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

  // Gentle idle turntable rotation in Step 1 (paused while user is inspecting close-up);
  // smooth return to front-facing in Step 4 (Medidas)
  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || isMotionPaused) return;
    if (step === 1) {
      group.rotation.y += delta * 0.2;
    } else if (step === 4) {
      const current =
        ((group.rotation.y + Math.PI) % (Math.PI * 2) + Math.PI * 2) %
          (Math.PI * 2) -
        Math.PI;
      group.rotation.y = THREE.MathUtils.lerp(current, 0, Math.min(1, delta * 4));
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.02, 0]}>
      <group scale={normScale}>
        <Center>
          <primitive object={clonedScene} />
        </Center>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH, true);

export default function ShirtGLBViewer({
  shirt,
  buttonId,
  step,
  isMotionPaused,
  onWebGLError,
}: ShirtGLBViewerProps) {
  const { progress } = useProgress();
  const [modelReady, setModelReady] = useState(false);
  const [baseDistance, setBaseDistance] = useState(DEFAULT_CAMERA_Z);
  const [targetDistance, setTargetDistance] = useState(DEFAULT_CAMERA_Z);
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("rotate");
  const [activePreset, setActivePreset] = useState<FocusPreset>("completa");
  const [focusTarget, setFocusTarget] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [focusSignal, setFocusSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const canvasCleanupRef = useRef<(() => void) | null>(null);

  // Detect unsupported WebGL environments gracefully on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const testCanvas = document.createElement("canvas");
      const gl =
        testCanvas.getContext("webgl2") ||
        testCanvas.getContext("webgl") ||
        testCanvas.getContext("experimental-webgl");
      if (!gl) {
        onWebGLError?.();
      }
    } catch {
      onWebGLError?.();
    }
    return () => {
      canvasCleanupRef.current?.();
      canvasCleanupRef.current = null;
    };
  }, [onWebGLError]);

  const handleModelReady = useMemo(() => () => setModelReady(true), []);
  const handleMobileMount = useMemo(
    () => (mobileZ: number) => {
      setBaseDistance(mobileZ);
      setTargetDistance(mobileZ);
    },
    []
  );

  const handleZoomIn = () => {
    setTargetDistance((d) =>
      Math.max(MIN_CAMERA_DIST, Number((d - ZOOM_STEP).toFixed(2)))
    );
  };

  const handleZoomOut = () => {
    setTargetDistance((d) =>
      Math.min(MAX_CAMERA_DIST, Number((d + ZOOM_STEP).toFixed(2)))
    );
  };

  const handleSelectPreset = (presetKey: FocusPreset) => {
    const preset = FOCUS_PRESETS[presetKey];
    setActivePreset(presetKey);
    setFocusTarget(preset.target);
    setTargetDistance(
      presetKey === "completa" ? baseDistance : preset.distance
    );
    setFocusSignal((n) => n + 1);
    if (presetKey === "completa") {
      setInteractionMode("rotate");
    }
  };

  const handleReset = () => {
    setActivePreset("completa");
    setInteractionMode("rotate");
    setFocusTarget([0, 0, 0]);
    setTargetDistance(baseDistance);
    setResetSignal((n) => n + 1);
  };

  const shouldPauseSpin =
    isMotionPaused || interactionMode === "pan" || activePreset !== "completa";
  const roundedProgress = Math.min(100, Math.round(progress));

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* 3D Canvas Stage (enlarged mobile height fills the 360px stage while keeping CONFIRMAR TELA visible) */}
      <div
        className={`relative h-[315px] w-full sm:h-[355px] lg:h-auto lg:min-h-0 lg:flex-1 ${
          interactionMode === "pan"
            ? "cursor-move"
            : "cursor-grab active:cursor-grabbing"
        }`}
      >
        {/* Sartorial Long-Sleeve Silhouette + Diagonal Shimmer while GLB loads */}
        <AnimatePresence>
          {!modelReady && (
            <motion.div
              key="glb-sartorial-loader"
              role="status"
              aria-live="polite"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: isMotionPaused ? 0 : 0.35,
                ease: "easeOut",
              }}
              className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center p-4"
            >
              <svg
                viewBox="0 0 240 280"
                fill="none"
                aria-hidden="true"
                className="h-[78%] max-h-[340px] w-auto text-white/75 dark:text-white/20"
              >
                <defs>
                  <clipPath id="shirtSilhouetteClip">
                    <path d="M96 22 C104 28 136 28 144 22 L152 30 L194 46 C200 48 205 54 207 62 L226 196 C227 202 224 206 218 207 L202 209 C197 210 194 206 193 201 L179 112 L176 244 C176 254 152 264 120 264 C88 264 64 254 64 244 L61 112 L47 201 C46 206 43 210 38 209 L22 207 C16 206 13 202 14 196 L33 62 C35 54 40 48 46 46 L88 30 Z" />
                  </clipPath>
                  <linearGradient
                    id="shirtShimmerGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                    <stop
                      offset="50%"
                      stopColor="currentColor"
                      stopOpacity="0.9"
                    />
                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {/* Main tailored long-sleeve shirt silhouette */}
                <path
                  d="M96 22 C104 28 136 28 144 22 L152 30 L194 46 C200 48 205 54 207 62 L226 196 C227 202 224 206 218 207 L202 209 C197 210 194 206 193 201 L179 112 L176 244 C176 254 152 264 120 264 C88 264 64 254 64 244 L61 112 L47 201 C46 206 43 210 38 209 L22 207 C16 206 13 202 14 196 L33 62 C35 54 40 48 46 46 L88 30 Z"
                  className="fill-black/[0.06] stroke-black/15 dark:fill-white/[0.06] dark:stroke-white/15"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />

                {/* Collar flaps & subtle sartorial placket lines */}
                <path
                  d="M92 26 L112 52 L120 42 L128 52 L148 26"
                  className="stroke-black/15 dark:stroke-white/15"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="120"
                  y1="44"
                  x2="120"
                  y2="262"
                  className="stroke-black/12 dark:stroke-white/12"
                  strokeWidth="1.1"
                />
                <path
                  d="M17 188 L47 192 M193 192 L223 188"
                  className="stroke-black/12 dark:stroke-white/12"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />

                {/* Soft diagonal light shimmer clipped cleanly to the garment */}
                {!isMotionPaused && (
                  <g clipPath="url(#shirtSilhouetteClip)">
                    <motion.rect
                      x="-140"
                      y="-40"
                      width="130"
                      height="360"
                      fill="url(#shirtShimmerGrad)"
                      transform="rotate(20 120 140)"
                      initial={{ x: -160 }}
                      animate={{ x: 340 }}
                      transition={{
                        duration: 1.9,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 0.25,
                      }}
                    />
                  </g>
                )}
              </svg>

              <div className="liquid-glass mt-2 flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium text-[#111113] dark:text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#B08D57]" />
                <span className="font-mono tabular-nums">
                  Preparando prenda 3D… {roundedProgress}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Smooth 500ms Fade-In & subtle scale settle when 3D garment is ready */}
        <div
          className={`h-full w-full transition-all ease-out ${
            isMotionPaused ? "duration-0" : "duration-500"
          } ${modelReady ? "scale-100 opacity-100" : "scale-[0.97] opacity-0"}`}
        >
          <Canvas
            className="block !h-full !w-full"
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, DEFAULT_CAMERA_Z], fov: 34 }}
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.02,
            }}
            onCreated={({ gl }) => {
              const canvas = gl.domElement;
              let disposed = false;
              const handleContextLost = (e: Event) => {
                e.preventDefault();
                if (!disposed) {
                  onWebGLError?.();
                }
              };
              canvas.addEventListener("webglcontextlost", handleContextLost);
              canvasCleanupRef.current = () => {
                disposed = true;
                canvas.removeEventListener(
                  "webglcontextlost",
                  handleContextLost
                );
              };
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
                isMotionPaused={shouldPauseSpin}
                resetSignal={resetSignal}
                onReady={handleModelReady}
              />
            </Suspense>

            <ContactShadows
              position={[0, -1.04, 0]}
              opacity={0.2}
              scale={3.2}
              blur={2.4}
              far={2.2}
            />

            <CameraZoomRig
              targetDistance={targetDistance}
              focusTarget={focusTarget}
              focusSignal={focusSignal}
              resetSignal={resetSignal}
              interactionMode={interactionMode}
              isMotionPaused={isMotionPaused}
              onMobileMount={handleMobileMount}
            />
          </Canvas>
        </div>
      </div>

      {/* Controls Bar: Flush bottom-center (-/+/Reset) on mobile, flush bottom-left & bottom-right on lg+ */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-2 lg:justify-between">
        <div className="flex items-center gap-2">
          <div
            role="radiogroup"
            aria-label="Modo de control 3D"
            className="liquid-glass pointer-events-auto hidden items-center rounded-full p-0.5 text-[11px] lg:inline-flex"
          >
            <button
              type="button"
              role="radio"
              aria-checked={interactionMode === "rotate"}
              onClick={() => setInteractionMode("rotate")}
              className={`cursor-pointer inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 font-medium transition-colors lg:h-8 lg:min-h-0 lg:px-2.5 ${
                interactionMode === "rotate"
                  ? "bg-[#16233B] text-white dark:bg-white dark:text-[#0B0B0E]"
                  : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
              }`}
            >
              <Rotate3d className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Rotar</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={interactionMode === "pan"}
              onClick={() => setInteractionMode("pan")}
              className={`cursor-pointer inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 font-medium transition-colors lg:h-8 lg:min-h-0 lg:px-2.5 ${
                interactionMode === "pan"
                  ? "bg-[#16233B] text-white dark:bg-white dark:text-[#0B0B0E]"
                  : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
              }`}
            >
              <Move className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Mover</span>
            </button>
          </div>

          <div
            role="group"
            aria-label="Controles de zoom 3D"
            className="liquid-glass pointer-events-auto inline-flex items-center gap-0.5 rounded-full p-0.5 text-[#111113] dark:text-white"
          >
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={targetDistance >= MAX_CAMERA_DIST}
              aria-label="Alejar zoom"
              title="Alejar"
              className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/[0.07] disabled:cursor-not-allowed disabled:opacity-35 lg:h-8 lg:w-8 dark:hover:bg-white/[0.12]"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={targetDistance <= MIN_CAMERA_DIST}
              aria-label="Acercar zoom"
              title="Acercar"
              className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/[0.07] disabled:cursor-not-allowed disabled:opacity-35 lg:h-8 lg:w-8 dark:hover:bg-white/[0.12]"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              aria-label="Restablecer vista"
              title="Restablecer vista"
              className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/[0.07] lg:h-8 lg:w-8 dark:hover:bg-white/[0.12]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Quick Focus Presets (Completa · Cuello · Puño) */}
        {step === 1 && (
          <div
            role="group"
            aria-label="Enfoque rápido"
            className="liquid-glass pointer-events-auto hidden items-center gap-0.5 rounded-full p-0.5 text-[11px] sm:inline-flex"
          >
            {(["completa", "cuello", "puno"] as const).map((key) => {
              const active = activePreset === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectPreset(key)}
                  className={`cursor-pointer min-h-[44px] rounded-full px-3.5 font-medium transition-colors lg:h-8 lg:min-h-0 lg:px-3 ${
                    active
                      ? "bg-[#16233B] text-white dark:bg-white dark:text-[#0B0B0E]"
                      : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
                  }`}
                >
                  {FOCUS_PRESETS[key].label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
