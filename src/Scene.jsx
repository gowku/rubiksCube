import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Cube from './components/Cube';
import './Scene.css';

function Scene() {
  const [rowOffset, setRowOffset] = useState(0);
  const [colOffset, setColOffset] = useState(0);
  const [groupToRotate, setGroupToRotate] = useState({ group: [], axis: '', sign: true });
  const [selectedCube, setSelectedCube] = useState();
  const [cubeLayout, setCubeLayout] = useState([]);

  const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'white'];

  useEffect(() => {
    const newCubeLayout = [];
    let id = 0;
    for (let layer = 1; layer >= -1; layer--) {
      for (let row = -1; row <= 1; row++) {
        for (let col = -1; col <= 1; col++) {
          const position = [col + colOffset, row + rowOffset, layer];

          newCubeLayout.push({ position, id: id++ });
        }
      }
    }
    setCubeLayout(newCubeLayout);
  }, [rowOffset, colOffset]);

  const handleCubeClick = (position, faceColors) => {
    setSelectedCube({ position, faceColors });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      event.stopPropagation();

      if (!selectedCube) return;
      const { keyCode } = event;

      let newCubeLayout = [];
      // let groupToRotate = [];

      switch (keyCode) {
        case 87:
          // w - rotate the right face up
          newCubeLayout = cubeLayout.map((cube) => {
            const { position } = cube;
            const [x, y, z] = position;

            let newX = x;
            let newY = y;
            let newZ = z;

            if (x === selectedCube.position[0]) {
              // Top face rotation
              switch (`${y},${z}`) {
                case '1,1':
                  newY = 1;
                  newZ = -1;
                  // setGroupToRotate((oldArray) => [...oldArray, cube.id]);
                  // setGroupToRotate({ group: [...groupToRotate.group, cube.id] });
                  setGroupToRotate((prev) => ({ ...prev, group: [...prev.group, cube.id], axis: 'x' }));
                  break;
                case '1,-1':
                  newY = -1;
                  newZ = -1;
                  setGroupToRotate((prev) => ({ ...prev, group: [...prev.group, cube.id], axis: 'x' }));
                  break;
                case '-1,-1':
                  newY = -1;
                  newZ = 1;
                  setGroupToRotate((prev) => ({ ...prev, group: [...prev.group, cube.id], axis: 'x' }));
                  break;
                case '-1,1':
                  newY = 1;
                  newZ = 1;
                  setGroupToRotate((prev) => ({ ...prev, group: [...prev.group, cube.id], axis: 'x' }));
                  break;
                case '0,1':
                  newY = 1;
                  newZ = 0;
                  setGroupToRotate((prev) => ({ ...prev, group: [...prev.group, cube.id], axis: 'x' }));
                  break;
                case '1,0':
                  newY = 0;
                  newZ = -1;
                  setGroupToRotate((prev) => ({ ...prev, group: [...prev.group, cube.id], axis: 'x' }));
                  break;
                case '0,-1':
                  newY = -1;
                  newZ = 0;
                  setGroupToRotate((prev) => ({ ...prev, group: [...prev.group, cube.id], axis: 'x' }));
                  break;
                case '-1,0':
                  newY = 0;
                  newZ = 1;
                  setGroupToRotate((prev) => ({ ...prev, group: [...prev.group, cube.id], axis: 'x' }));
                default:
                  break;
              }
            }

            return { ...cube, position: [newX, newY, newZ] };
          });
          break;
        // case 65:
        // case 83:
        // case 68:

        default:
          return;
      }
      setCubeLayout(newCubeLayout);
      setGroupToRotate((prev) => ({ ...prev, group: [], axis: '' }));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCube, cubeLayout]);

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
            key={cube.id}
            id={cube.id}
            position={cube.position}
            colors={colors}
            faceColors={cube.faceColors}
            isSelected={selectedCube}
            groupToRotate={groupToRotate}
            onClick={handleCubeClick}
          />
        ))}
      </Canvas>
    </div>
  );
}

export default Scene;
