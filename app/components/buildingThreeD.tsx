"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";



interface BuildingDimensions {
  height: number;
  numFLoors: number;
  xWidth: number;
  yWidth: number;
}

function Box(props: BuildingDimensions) {
  const [clicked, click] = useState(false);

  return (
    <mesh
    {...props}
    scale={clicked ? 1.5 : 1}
    onClick={() => click(!clicked)}
  >
      <boxGeometry args={[props.xWidth, props.height, props.yWidth, 1, props.numFLoors, 1]} />
      <meshStandardMaterial wireframe color={clicked ? "hotpink" : "orange"} />
      {/* <Edges edges={new THREE.EdgesGeometry(new THREE.BoxGeometry(10, 20, 40))} color="black" /> */}
    </mesh>    
  );
}

const BuildingThreeD = ( bldgSize: BuildingDimensions ) => {
  return (
    <div>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box {...bldgSize} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default BuildingThreeD;
