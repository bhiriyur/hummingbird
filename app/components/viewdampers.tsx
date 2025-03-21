"use client";

import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { buildingProps } from "../common/types";

export const DamperX = (props: buildingProps) => {
  const { BX, BY, BZ } = props;
  const dia = props?.CYLDIA ? props.CYLDIA : 1.0;

  const TopModuleX = props?.XLOC == "In Modules" ? true : false;
  const NX = props?.XLOC == "On Roof" ? props.NCYLX : 0;
  const LX = props?.LCYLX ? props.LCYLX : 40;

  const cylsX = [];
  for (let i = 0; i < (NX || 0); i++) {
    cylsX.push(new THREE.Vector3(0, i * dia, 0));
  }

  const meshList = [];

  if (TopModuleX) {
    // Box Module
    meshList.push(
      <mesh key={"BoxModuleX"} {...props} scale={1} position={[0, 0, 0]}>
        <boxGeometry args={[props.MODL, props.MODW, 4]} />
        <meshStandardMaterial color={"red"} />
        <Edges scale={1} threshold={15} color="black" renderOrder={1000} />
      </mesh>
    );
  } else {
    // Cylinders
    cylsX.map((pos, index) => {
      meshList.push(
        <mesh key={index} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.5 * dia, 0.5 * dia, LX, 32]} />
          <meshStandardMaterial
            color={"#FA5522"}
            metalness={0.8}
            roughness={0.2}
          />
          <Edges scale={1} threshold={15} color="black" renderOrder={1000} />
        </mesh>
      );
    });
  }

  return (
    <Canvas
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        up: [0, 0, 1],
        position: [0.75 * BX, 0.75 * BX, 10],
      }}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#f0f0f0",
      }}
    >
      <ambientLight intensity={2} />
      <pointLight intensity={80000} position={[2 * BX, 2 * BY, 0.2 * BZ]} />

      {meshList}
      <OrbitControls />
    </Canvas>
  );
};

export const DamperY = (props: buildingProps) => {
  const { BX, BY, BZ } = props;
  const dia = props?.CYLDIA ? props.CYLDIA : 1.0;

  const TopModuleY = props?.YLOC == "In Modules" ? true : false;
  const NY = props?.YLOC == "On Roof" ? props.NCYLY : 0;
  const LY = props?.LCYLY ? props.LCYLY : 40;

  const cylsY = [];
  for (let i = 0; i < (NY || 0); i++) {
    cylsY.push(new THREE.Vector3(i * dia, 0, 0));
  }

  const meshList = [];

  if (TopModuleY) {
    // Box Module
    meshList.push(
      <mesh key={"BoxModuleY"} {...props} scale={1} position={[0, 0, 0]}>
        <boxGeometry args={[props.MODW, props.MODL, 4]} />
        <meshStandardMaterial color={"green"} />
        <Edges scale={1} threshold={15} color="black" renderOrder={1000} />
      </mesh>
    );
  } else {
    // Cylinders
    cylsY.map((pos, index) => {
      meshList.push(
        <mesh key={index} position={pos} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.5 * dia, 0.5 * dia, LY, 32]} />
          <meshStandardMaterial
            color={"#55FA22"}
            metalness={0.8}
            roughness={0.2}
          />
          <Edges scale={1} threshold={15} color="black" renderOrder={1000} />
        </mesh>
      );
    });
  }

  return (
    <Canvas
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        up: [0, 0, 1],
        position: [0.75 * BY, 0.75 * BY, 10],
      }}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#f0f0f0",
      }}
    >
      <ambientLight intensity={2} />
      <pointLight intensity={80000} position={[2 * BX, 2 * BY, 0.2 * BZ]} />

      {meshList}
      <OrbitControls />
    </Canvas>
  );
};
