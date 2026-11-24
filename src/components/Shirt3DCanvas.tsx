"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  BUTTON_OPTIONS,
  type ButtonOption,
  type CatalogShirt,
  type CollarOption,
  type MonogramPlacement,
} from "@/data/catalog";

export interface Shirt3DCanvasProps {
  shirt: CatalogShirt;
  collar: CollarOption;
  buttonId: ButtonOption;
  monogramDisplay: string;
  monogramPlacement: MonogramPlacement;
  step: 1 | 2 | 3 | 4;
  isMotionPaused: boolean;
}

/**
 * Generates procedural fabric color CanvasTexture + matching bumpMap
 * for Pima twill, open Biella linen, Oxford, windowpane, and mineral stripe.
 */
function createFabricTextures(shirt: CatalogShirt) {
  const size = 512;
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = size;
  colorCanvas.height = size;
  const ctx = colorCanvas.getContext("2d");

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext("2d");

  if (ctx && bCtx) {
    // Base fabric tone
    ctx.fillStyle = shirt.baseHex;
    ctx.fillRect(0, 0, size, size);

    bCtx.fillStyle = "#808080";
    bCtx.fillRect(0, 0, size, size);

    if (shirt.weaveKind === "twill") {
      // Fine diagonal 120/2 Pima twill ridges
      ctx.strokeStyle = shirt.secondaryHex;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 2;
      bCtx.strokeStyle = "#b8b8b8";
      bCtx.lineWidth = 2;

      for (let i = -size; i < size * 2; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
        ctx.stroke();

        bCtx.beginPath();
        bCtx.moveTo(i, 0);
        bCtx.lineTo(i + size, size);
        bCtx.stroke();
      }
    } else if (shirt.weaveKind === "linen") {
      // Open slub Biella linen weave
      ctx.globalAlpha = 0.35;
      for (let y = 0; y < size; y += 6) {
        ctx.strokeStyle = y % 12 === 0 ? shirt.secondaryHex : shirt.baseHex;
        ctx.lineWidth = y % 18 === 0 ? 2.2 : 1.1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();

        bCtx.strokeStyle = y % 12 === 0 ? "#c8c8c8" : "#646464";
        bCtx.lineWidth = 1.6;
        bCtx.beginPath();
        bCtx.moveTo(0, y);
        bCtx.lineTo(size, y);
        bCtx.stroke();
      }
      for (let x = 0; x < size; x += 8) {
        ctx.strokeStyle = shirt.secondaryHex;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();

        bCtx.strokeStyle = "#a4a4a4";
        bCtx.lineWidth = 1.2;
        bCtx.beginPath();
        bCtx.moveTo(x, 0);
        bCtx.lineTo(x, size);
        bCtx.stroke();
      }
    } else if (shirt.weaveKind === "oxford") {
      // Basketweave Oxford micro-grid
      for (let y = 0; y < size; y += 6) {
        for (let x = 0; x < size; x += 6) {
          const alt = ((x + y) / 6) % 2 === 0;
          ctx.fillStyle = alt ? shirt.secondaryHex : shirt.baseHex;
          ctx.globalAlpha = alt ? 0.5 : 0.85;
          ctx.fillRect(x, y, 4, 4);

          bCtx.fillStyle = alt ? "#c4c4c4" : "#6a6a6a";
          bCtx.fillRect(x, y, 4, 4);
        }
      }
    } else if (shirt.weaveKind === "windowpane") {
      // Subtle twill base + crisp tailored windowpane check
      ctx.strokeStyle = shirt.secondaryHex;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1.5;
      for (let i = -size; i < size * 2; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.65;
      ctx.strokeStyle = "#D6C3A5";
      ctx.lineWidth = 2.2;
      for (let pos = 32; pos < size; pos += 64) {
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(size, pos);
        ctx.stroke();
      }
    } else {
      // Mineral stripe & cloqué texture
      for (let x = 0; x < size; x += 18) {
        ctx.fillStyle = shirt.secondaryHex;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x, 0, 5, size);

        bCtx.fillStyle = "#b8b8b8";
        bCtx.fillRect(x, 0, 5, size);
      }
    }
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(3, 3);
  map.colorSpace = THREE.SRGBColorSpace;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(3, 3);

  return { map, bumpMap };
}

function createMonogramTexture(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 256, 128);
    if (text) {
      ctx.fillStyle = "#D6C3A5";
      ctx.font = "italic 600 58px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 128, 64);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function ProceduralShirt3D({
  shirt,
  collar,
  buttonId,
  monogramDisplay,
  monogramPlacement,
  step,
  isMotionPaused,
}: Shirt3DCanvasProps) {
  const groupRef = useRef<THREE.Group | null>(null);

  const selectedButton =
    BUTTON_OPTIONS.find((b) => b.id === buttonId) ?? BUTTON_OPTIONS[0];

  const { map, bumpMap } = useMemo(() => createFabricTextures(shirt), [shirt]);
  const monogramMap = useMemo(
    () => createMonogramTexture(monogramDisplay),
    [monogramDisplay]
  );

  useEffect(() => {
    return () => {
      map.dispose();
      bumpMap.dispose();
    };
  }, [map, bumpMap]);

  useEffect(() => {
    return () => {
      monogramMap.dispose();
    };
  }, [monogramMap]);

  // Anatomical sculpted torso using LatheGeometry (athletic chest -> tapered waist -> tailored hem)
  const torsoGeometry = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.01, -1.18),
      new THREE.Vector2(0.62, -1.14),
      new THREE.Vector2(0.61, -0.78),
      new THREE.Vector2(0.56, -0.32),
      new THREE.Vector2(0.63, 0.22),
      new THREE.Vector2(0.68, 0.72),
      new THREE.Vector2(0.56, 0.94),
      new THREE.Vector2(0.28, 1.04),
      new THREE.Vector2(0.24, 1.08),
    ];
    const geo = new THREE.LatheGeometry(pts, 48);
    // Oval human torso cross-section + subtle vertical tailoring drape
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const drape = 1 + Math.sin(Math.atan2(z, x) * 6) * 0.012;
      pos.setXYZ(i, x * 1.12 * drape, y, z * 0.62 * drape);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      torsoGeometry.dispose();
    };
  }, [torsoGeometry]);

  const fabricMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map,
        bumpMap,
        bumpScale: 0.018,
        roughness: shirt.weaveKind === "linen" ? 0.86 : 0.7,
        metalness: 0.02,
        sheen: shirt.weaveKind === "twill" ? 0.65 : 0.35,
        sheenRoughness: 0.45,
        sheenColor: new THREE.Color(shirt.secondaryHex),
      }),
    [map, bumpMap, shirt.weaveKind, shirt.secondaryHex]
  );

  useEffect(() => {
    return () => {
      fabricMaterial.dispose();
    };
  }, [fabricMaterial]);

  // Subtle alive turntable sway on Step 1 when motion is active
  useFrame((state) => {
    if (!groupRef.current) return;
    if (step === 1 && !isMotionPaused) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.45) * 0.22;
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0,
        0.08
      );
    }
  });

  const buttonYs = [0.76, 0.42, 0.08, -0.26, -0.6];
  const collarWingAngle = collar === "Francés" ? 0.55 : 0.32;

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      {/* Sculpted Anatomical Torso */}
      <mesh
        geometry={torsoGeometry}
        material={fabricMaterial}
        castShadow
        receiveShadow
      />

      {/* Shoulder Yoke Caps */}
      <mesh
        position={[-0.64, 0.78, 0]}
        scale={[1.05, 0.78, 0.72]}
        material={fabricMaterial}
        castShadow
      >
        <sphereGeometry args={[0.24, 24, 24]} />
      </mesh>
      <mesh
        position={[0.64, 0.78, 0]}
        scale={[1.05, 0.78, 0.72]}
        material={fabricMaterial}
        castShadow
      >
        <sphereGeometry args={[0.24, 24, 24]} />
      </mesh>

      {/* Right Long Sleeve (Viewer Left) + Buttoned Cuff */}
      <group position={[-0.76, 0.72, 0]} rotation={[0.04, 0, -0.24]}>
        <mesh position={[0, -0.78, 0]} material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.21, 0.145, 1.56, 28]} />
        </mesh>
        {/* Cuff */}
        <mesh position={[0, -1.62, 0]} material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.152, 0.148, 0.24, 28]} />
        </mesh>
        {/* Cuff Button */}
        <mesh
          position={[-0.08, -1.62, 0.13]}
          rotation={[Math.PI / 2, 0, -0.4]}
        >
          <cylinderGeometry args={[0.032, 0.032, 0.014, 20]} />
          <meshPhysicalMaterial
            color={selectedButton.fill}
            roughness={0.18}
            clearcoat={1}
            metalness={0.12}
          />
        </mesh>
      </group>

      {/* Left Long Sleeve (Viewer Right) + Buttoned Cuff + Optional Cuff Monogram */}
      <group position={[0.76, 0.72, 0]} rotation={[0.04, 0, 0.24]}>
        <mesh position={[0, -0.78, 0]} material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.21, 0.145, 1.56, 28]} />
        </mesh>
        {/* Cuff */}
        <mesh position={[0, -1.62, 0]} material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.152, 0.148, 0.24, 28]} />
        </mesh>
        {/* Cuff Button */}
        <mesh
          position={[0.08, -1.62, 0.13]}
          rotation={[Math.PI / 2, 0, 0.4]}
        >
          <cylinderGeometry args={[0.032, 0.032, 0.014, 20]} />
          <meshPhysicalMaterial
            color={selectedButton.fill}
            roughness={0.18}
            clearcoat={1}
            metalness={0.12}
          />
        </mesh>
        {/* Embroidered Monogram on Left Cuff */}
        {monogramDisplay && monogramPlacement === "Puño izquierdo" && (
          <mesh position={[-0.02, -1.62, 0.156]}>
            <planeGeometry args={[0.22, 0.11]} />
            <meshBasicMaterial map={monogramMap} transparent depthWrite={false} />
          </mesh>
        )}
      </group>

      {/* Center Front Tailored Placket */}
      <mesh position={[0, -0.02, 0.39]} material={fabricMaterial} castShadow>
        <boxGeometry args={[0.16, 1.98, 0.04]} />
      </mesh>

      {/* 5 Luminous 3D Mother-of-Pearl / Custom Buttons */}
      {buttonYs.map((by) => (
        <group key={by} position={[0, by, 0.42]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.038, 0.038, 0.016, 24]} />
            <meshPhysicalMaterial
              color={selectedButton.fill}
              roughness={0.16}
              clearcoat={1}
              clearcoatRoughness={0.1}
              metalness={0.14}
            />
          </mesh>
          {/* Cross-Stitch Thread Accent */}
          <mesh position={[0, 0, 0.01]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.034, 0.008, 0.006]} />
            <meshStandardMaterial color={selectedButton.thread} />
          </mesh>
          <mesh position={[0, 0, 0.01]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.034, 0.008, 0.006]} />
            <meshStandardMaterial color={selectedButton.thread} />
          </mesh>
        </group>
      ))}

      {/* Embroidered Monogram on Chest (Pechera) */}
      {monogramDisplay && monogramPlacement === "Pechera" && (
        <mesh position={[0.32, 0.36, 0.39]} rotation={[0, 0.24, 0]}>
          <planeGeometry args={[0.28, 0.14]} />
          <meshBasicMaterial map={monogramMap} transparent depthWrite={false} />
        </mesh>
      )}

      {/* Dynamic 3D Collar Assembly */}
      <group position={[0, 1.06, 0.02]}>
        {/* Standing Collar Band (Pie de Cuello) */}
        <mesh material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.265, 0.295, 0.19, 36, 1, true]} />
        </mesh>

        {/* Collar Wings (Hidden for Mao) */}
        {collar !== "Mao" && (
          <>
            {/* Viewer Left Collar Wing */}
            <group
              position={[-0.17, 0.01, 0.22]}
              rotation={[0.24, -0.42, collarWingAngle]}
            >
              <mesh material={fabricMaterial} castShadow>
                <boxGeometry args={[0.28, 0.22, 0.028]} />
              </mesh>
              {collar === "Button-Down" && (
                <mesh
                  position={[-0.08, -0.07, 0.02]}
                  rotation={[Math.PI / 2, 0, 0]}
                >
                  <cylinderGeometry args={[0.02, 0.02, 0.01, 16]} />
                  <meshPhysicalMaterial
                    color={selectedButton.fill}
                    roughness={0.2}
                    clearcoat={1}
                  />
                </mesh>
              )}
            </group>

            {/* Viewer Right Collar Wing */}
            <group
              position={[0.17, 0.01, 0.22]}
              rotation={[0.24, 0.42, -collarWingAngle]}
            >
              <mesh material={fabricMaterial} castShadow>
                <boxGeometry args={[0.28, 0.22, 0.028]} />
              </mesh>
              {collar === "Button-Down" && (
                <mesh
                  position={[0.08, -0.07, 0.02]}
                  rotation={[Math.PI / 2, 0, 0]}
                >
                  <cylinderGeometry args={[0.02, 0.02, 0.01, 16]} />
                  <meshPhysicalMaterial
                    color={selectedButton.fill}
                    roughness={0.2}
                    clearcoat={1}
                  />
                </mesh>
              )}
            </group>
          </>
        )}
      </group>
    </group>
  );
}

function CameraRig({
  step,
  monogramPlacement,
  isMotionPaused,
  controlsRef,
}: {
  step: 1 | 2 | 3 | 4;
  monogramPlacement: MonogramPlacement;
  isMotionPaused: boolean;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();
  const desiredPos = useMemo(() => new THREE.Vector3(0, 0.15, 4.35), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(0, -0.05, 0), []);

  useEffect(() => {
    if (step === 2) {
      desiredPos.set(0.28, 1.32, 1.85);
      desiredTarget.set(0, 1.04, 0.14);
    } else if (step === 3) {
      if (monogramPlacement === "Puño izquierdo") {
        desiredPos.set(1.55, -0.58, 2.05);
        desiredTarget.set(0.95, -0.78, 0.12);
      } else {
        desiredPos.set(0.32, 0.42, 1.95);
        desiredTarget.set(0.14, 0.34, 0.32);
      }
    } else {
      desiredPos.set(0, 0.12, 4.35);
      desiredTarget.set(0, -0.06, 0);
    }
  }, [step, monogramPlacement, desiredPos, desiredTarget]);

  useFrame((_, delta) => {
    const lerpFactor = isMotionPaused ? 1 : Math.min(delta * 4.2, 1);
    camera.position.lerp(desiredPos, lerpFactor);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(desiredTarget, lerpFactor);
      controlsRef.current.update();
    }
  });

  return null;
}

export default function Shirt3DCanvas(props: Shirt3DCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.15, 4.35], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Studio Three-Point Lighting */}
        <ambientLight intensity={0.45} />
        <spotLight
          position={[3.5, 4.5, 4.5]}
          angle={0.45}
          penumbra={0.8}
          intensity={2.4}
          castShadow
          color="#FFF7ED"
        />
        <directionalLight
          position={[-4, 2, -2]}
          intensity={1.25}
          color="#CBD5E1"
        />
        <directionalLight
          position={[0, -3, 2]}
          intensity={0.45}
          color="#E2E8F0"
        />

        {/* Procedural Offline Studio Softboxes (Zero External HDRI Network Fetches) */}
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={2.2}
            position={[0, 4, 2]}
            scale={[6, 2, 1]}
            rotation={[Math.PI / 3, 0, 0]}
            color="#FFFFFF"
          />
          <Lightformer
            form="rect"
            intensity={1.5}
            position={[-4, 1, 2]}
            scale={[2, 5, 1]}
            rotation={[0, Math.PI / 2.5, 0]}
            color="#E2E8F0"
          />
          <Lightformer
            form="rect"
            intensity={1.2}
            position={[4, 0, -2]}
            scale={[2, 5, 1]}
            rotation={[0, -Math.PI / 2, 0]}
            color="#F5E6D3"
          />
        </Environment>

        <ProceduralShirt3D {...props} />

        <ContactShadows
          position={[0, -1.55, 0]}
          opacity={0.42}
          scale={5}
          blur={2.4}
          far={2.6}
        />

        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.75}
          rotateSpeed={0.65}
        />

        <CameraRig
          step={props.step}
          monogramPlacement={props.monogramPlacement}
          isMotionPaused={props.isMotionPaused}
          controlsRef={controlsRef}
        />
      </Canvas>
    </div>
  );
}
