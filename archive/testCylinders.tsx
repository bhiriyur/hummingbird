import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';

// Custom component for the main box
function MainBox() {


  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="royalblue" />
    </mesh>
  );
}

// Custom component for cylinders
function RandomCylinders() {
  const cylinderPositions = [
    { pos: [3, 0, 2], color: 'green', radius: 0.5, height: 3 },
    { pos: [-3, 0, -2], color: 'red', radius: 0.3, height: 2 },
    { pos: [2, 0, -3], color: 'orange', radius: 0.4, height: 2.5 }
  ];

  return (
    <>
      {cylinderPositions.map((cylinder, index) => (
        <mesh 
          key={index} 
          position={new Vector3(...cylinder.pos)}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry 
            args={[cylinder.radius, cylinder.radius, cylinder.height, 32]} 
          />
          <meshStandardMaterial color={cylinder.color} />
        </mesh>
      ))}
    </>
  );
}

// Main 3D Visualization Component
function ThreeDVisualization() {
  return (
    <Canvas 
      gl={{preserveDrawingBuffer:true}}
      camera={{ 
        position: [0, 5, 10], 
        fov: 45 
      }}
      style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: '#f0f0f0' 
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <MainBox />
      <RandomCylinders />
      
      <OrbitControls />
      <gridHelper args={[10, 10]} />
    </Canvas>
  );
}

export default ThreeDVisualization;