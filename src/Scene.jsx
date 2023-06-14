import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Cube from './components/cube';
import './Scene.css';

function Scene() {
  const [rowOffset, setRowOffset] = useState(0);
  const [colOffset, setColOffset] = useState(0);

  const [selectedCube, setSelectedCube] = useState();

  const cubeLayout = [];
  const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'white'];

  for (let layer = 1; layer >= -1; layer--) {
    // Loop through the rows (-1, 0, 1)
    for (let row = -1; row <= 1; row++) {
      // Loop through the columns (-1, 0, 1)
      for (let col = -1; col <= 1; col++) {
        cubeLayout.push({ position: [col, row, layer] });
      }
    }
  }

  const handleCubeClick = (position) => {
    // console.log(position);
    setSelectedCube({ position });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedCube) return;
      const { keyCode } = event;
      let newRowOffset = rowOffset;
      let newColOffset = colOffset;

      switch (keyCode) {
        case 87:
          console.log('ici');
          newRowOffset = rowOffset - 1;
          break;
        case 65:
          newColOffset = colOffset - 1;
          break;
        case 83:
          newRowOffset = rowOffset + 1;
          break;
        case 68:
          newColOffset = colOffset + 1;
          break;
        default:
          return;
      }

      setRowOffset(newRowOffset);
      setColOffset(newColOffset);
    };

    window.addEventListener('keydown', handleKeyDown);
    // return () => {
    //   window.removeEventListener('keydown', handleKeyDown);
    // };
  }, [selectedCube, rowOffset, colOffset]);

  return (
    <div className='scene'>
      <div className='controls'>
        <button onClick={() => setRowOffset(rowOffset - 1)}>&lt;</button>
        <button onClick={() => setRowOffset(rowOffset + 1)}>&gt;</button>
        <button onClick={() => setColOffset(colOffset - 1)}>&lt;</button>
        <button onClick={() => setColOffset(colOffset + 1)}>&gt;</button>
      </div>
      <Canvas>
        <OrbitControls />
        {cubeLayout.map((cube, index) => (
          <Cube
            key={index}
            position={cube.position}
            colors={colors}
            isSelected={selectedCube}
            onClick={handleCubeClick}
          />
        ))}
      </Canvas>
    </div>
  );
}

export default Scene;
