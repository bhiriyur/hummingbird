"use client";

import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

interface DamperSettings {
  pos?: number[];
  type: number; // 1 = roof, 2 = module
  orientation: string; // Longitudinal orientation (X, Y or Z)
  Lmod?: number;
  Wmod?: number;
  dia: number;
  length: number;
  n1: number;
  n2: number;
}

const Cylinders = (config: DamperSettings) => {
  // Draw the cylinders only
  const position = config?.pos ? config.pos : [0, 0, 0];
  const { n1, n2, dia, length, orientation } = config;
  const delta = 2;
  const cyls = [];
  let pos;
  for (let i = 0; i < n1; i++) {
    pos = [...position];
    pos[0] += i * dia + delta;
    for (let j = 0; j < n2; j++) {
      pos[1] = j * dia + delta;
      cyls.push(new THREE.Vector3(...pos));
    }
  }

  console.log("CYLINDERS: ", cyls);

  return (
    <>
      {cyls.map((pos, index) => (
        <mesh
          key={index}
          position={pos}
          rotation={
            orientation == "X" ? [Math.PI / 2, 0, 0] : [0, Math.PI / 2, 0]
          }
        >
          <cylinderGeometry args={[0.5 * dia, 0.5 * dia, length, 32]} />
          <meshStandardMaterial color={"red"} />
          <Edges scale={1} threshold={15} color="black" renderOrder={1000} />
        </mesh>
      ))}
    </>
  );
};

const Dampers = (config: DamperSettings) => {
  return (
    <Canvas
      gl={{preserveDrawingBuffer:true}}
      orthographic
      camera={{
        position: [30, 30, 30],
        zoom: 20
      }}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#f0f0f0",
      }}
    >
      <ambientLight intensity={0.9} />
      <Cylinders {...config} />

      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
    </Canvas>
  );
};

export default Dampers;
