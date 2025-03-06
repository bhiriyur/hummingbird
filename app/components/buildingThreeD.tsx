"use client";

import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";
import { PerspectiveCamera } from "three";

interface BuildingDimensions {
  BX: number;
  BY: number;
  BZ: number;
  N: number;
}

function CameraLogger() {
  const { camera } = useThree();

  useFrame(() => {
    if (camera! instanceof PerspectiveCamera) {
      const position = camera.position.clone();
      console.log("Camera Position:", position);
    }
  });

  return null;
}

function Box(props: BuildingDimensions) {
  const { BX, BY, BZ, N } = props;
  const BYF = BY / N;
  const OFFSET = [-10, 0, -10];

  // Build Box List
  const boxList = [];
  for (let i = 0; i < N; i++) {
    boxList.push(
      <mesh
        key={"Box" + i}
        {...props}
        scale={1}
        position={[0.5 * BX, 0.5 * BY, 0.5 * BZ]}
      >
        <boxGeometry
          args={[OFFSET[0] + BX, OFFSET[1] + i * BYF, OFFSET[2] + BZ]}
        />
        <meshStandardMaterial color={"orange"} opacity={1} />
        <Edges scale={1} threshold={15} color="black" renderOrder={1000} />
      </mesh>
    );
  }

  return <>{ boxList }</>;
}

const BuildingThreeD = (props: BuildingDimensions) => {
  const { BX, BY, BZ } = props;
  return (
    <div style={{ height: "100%" }}>
      {/* <Canvas orthographic camera={{ position: [4*BX, 1*BY, 8*BZ] }}> */}
      <Canvas
        orthographic
        camera={{
          position: [4 * BX, 1 * BY, 8 * BZ],
        }}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f0f0f0",
        }}
      >
        <ambientLight intensity={Math.PI / 2} />
        <Box {...props} />
        <axesHelper args={[5]} />
        <CameraLogger />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default BuildingThreeD;
