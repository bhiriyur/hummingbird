"use client";

import { OrbitControls } from "@react-three/drei";
import React, { useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';


interface BuildingDimensions {
  height: number;
  numFLoors: number;
  xWidth: number;
  yWidth: number;
}

function CameraPosition() {
  const { camera } = useThree();
  const [position, setPosition] = useState(camera.position.toArray());

  useFrame(() => {
    setPosition(camera.position.toArray());
  });

  return (
    <Text position={[0, 10, 20]} fontSize={20} color="red">
      Camera Position: {position.map(coord => coord.toFixed(2)).join(', ')}
    </Text>
  );
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

const BuildingThreeD = ( props: BuildingDimensions ) => {
  return (
    <div style={{"height": "100%"}}>
      <Canvas  camera={{ position: [4*props.xWidth, 0.3*props.height, 8*props.yWidth] }}>
        <ambientLight intensity={Math.PI / 2} />
        {/* <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        /> */}
        {/* <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} /> */}
        <Box {...props} />
        {/* <CameraPosition /> */}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default BuildingThreeD;
