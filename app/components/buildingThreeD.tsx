"use client";

import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

export interface BuildingProps {
  BX: number;
  BY: number;
  BZ: number;
  N: number;
  CYLDIA?: number;
  XLOC?: string;
  YLOC?: string;
  NCYLX?: number;
  NCYLY?: number;
  LCYLX?: number;
  LCYLY?: number;
  MODL?: number;
  MODW?: number;
  LOGS: string;
}

function XZGrid() {
  const size = 100;
  const divs = 10;
  const GH = new THREE.GridHelper(size, divs);
  return (
    <primitive object={GH} rotation-x={Math.PI / 2} position={[50, 50, 0]} />
  );
}

function RoofCylinders(props: BuildingProps) {
  // Render Roof cylinder elements
  const { BX, BY, BZ } = props;
  const dia = props?.CYLDIA ? props.CYLDIA : 1.0;
  // Center of roof top
  const origin = [0.5 * BX, 0.5 * BY, BZ + 0.5 * dia];

  const NX = props?.XLOC == "On Roof" ? props.NCYLX : 0;
  const LX = props?.LCYLX ? props.LCYLX : 40;

  const cylsX = [];
  for (let i = 0; i < (NX || 0); i++) {
    cylsX.push(new THREE.Vector3(origin[0], origin[1] + i * dia, origin[2]));
  }

  const NY = props?.YLOC == "On Roof" ? props.NCYLY : 0;
  const LY = props?.LCYLY ? props.LCYLY : 40;

  const cylsY = [];
  for (let i = 0; i < (NY || 0); i++) {
    cylsY.push(new THREE.Vector3(origin[0] + i * dia, origin[1], origin[2]));
  }

  return (
    <>
      {cylsX.map((pos, index) => (
        <mesh key={index} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.5 * dia, 0.5 * dia, LX, 32]} />
          <meshStandardMaterial
            color={"#FA5522"}
            metalness={0.8}
            roughness={0.2}
          />
          <Edges scale={1} threshold={15} color="black" renderOrder={1000} />
        </mesh>
      ))}

      {cylsY.map((pos, index) => (
        <mesh key={index} position={pos} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.5 * dia, 0.5 * dia, LY, 32]} />
          <meshStandardMaterial
            color={"#55FA22"}
            metalness={0.8}
            roughness={0.2}
          />
          <Edges scale={1} threshold={15} color="black" renderOrder={1000} />
        </mesh>
      ))}
    </>
  );
}

function Box(props: BuildingProps) {
  const { BX, BY, BZ, N } = props;
  const BZF = BZ / N;

  const TopModuleX = props?.XLOC == "In Modules" ? true : false;
  const TopModuleY = props?.YLOC == "In Modules" ? true : false;

  let transparent = false;
  let opacity = 1;

  // Build Box List
  const boxList = [];
  for (let i = 0; i < N; i++) {
    if (i === N - 1 && (TopModuleX || TopModuleY)) {
      transparent = true;
      opacity = 0.5;
    }
    boxList.push(
      <mesh
        key={"Box" + i}
        {...props}
        scale={1}
        position={[0.5 * BX, 0.5 * BY, (i + 0.5) * BZF]}
      >
        <boxGeometry args={[BX, BY, BZF]} />
        <meshStandardMaterial
          transparent={transparent}
          opacity={opacity}
          color={"orange"}
        />
        <Edges scale={1} threshold={15} color="black" renderOrder={1000} />
      </mesh>
    );
  }

  // Add Module X
  if (TopModuleX) {
    boxList.push(
      <mesh
        key={"BoxModuleX"}
        {...props}
        scale={1}
        position={[0.5 * BX, 0.5 * BY, BZ - 0.5 * BZF]}
      >
        <boxGeometry args={[props.MODL, props.MODW, 0.9 * BZF]} />
        <meshStandardMaterial color={"red"} />
        <Edges scale={1} threshold={15} color="black" renderOrder={1000} />
      </mesh>
    );
  }

  // Add Module Y
  if (TopModuleY) {
    boxList.push(
      <mesh
        key={"BoxModuleX"}
        {...props}
        scale={1}
        position={[0.5 * BX, 0.5 * BY, BZ - 0.5 * BZF]}
      >
        <boxGeometry args={[props.MODW, props.MODL, BZF]} />
        <meshStandardMaterial color={"green"} />
        <Edges scale={1} threshold={15} color="black" renderOrder={1000} />
      </mesh>
    );
  }
  return <>{boxList}</>;
}

export const BuildingThreeD = (props: BuildingProps) => {
  const { BX, BY, BZ } = props;

  return (
    <div style={{ height: "100%" }}>
      {/* <Canvas orthographic camera={{ position: [4*BX, 1*BY, 8*BZ] }}> */}
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        orthographic
        camera={{
          up: [0, 0, 1],
          position: [2 * BX, 2 * BY, BZ],
        }}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f0f0f0",
        }}
      >
        <ambientLight intensity={2} />
        <pointLight
          color={"white"}
          position={[props.BX, props.BY, 1.2 * props.BZ]}
          intensity={80000}
        />
        <Box {...props} />
        <RoofCylinders {...props} />
        <OrbitControls />
        <XZGrid></XZGrid>
        <axesHelper args={[100]} />
      </Canvas>
    </div>
  );
};

export default BuildingThreeD;
