import { useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Cube from './components/Cube';
import './Scene.css';

function Scene() {
  const [rowOffset, setRowOffset] = useState(0);
  const [colOffset, setColOffset] = useState(0);
  const [groupToRotate, setGroupToRotate] = useState({ group: [], axis: '', sign: true });
  const [selectedCube, setSelectedCube] = useState();
  const [cubeLayout, setCubeLayout] = useState([]);
  const configCamera = (state) => {
    state.camera.position.set(0, 0, 10);
    state.camera.fov = 75;
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.near = 0.1;
    state.camera.far = 1000;
  };
  const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'white'];

  useEffect(() => {
    const newCubeLayout = [];
    let id = 0;
    for (let layer = 1; layer >= -1; layer--) {
      for (let row = -1; row <= 1; row++) {
        for (let col = -1; col <= 1; col++) {
          const position = [col + colOffset, row + rowOffset, layer];
          const faceColors = colors.slice();

          newCubeLayout.push({ position, faceColors, id: id++ });
        }
      }
    }
    setCubeLayout(newCubeLayout);
  }, [rowOffset, colOffset]);

  const updateGroupAndAxis = (id, newAxis, sign) => {
    setGroupToRotate((prevState) => ({
      ...prevState,
      group: [...prevState.group, id],
      axis: newAxis,
      sign,
    }));
  };

  useEffect(() => {
    console.log(selectedCube);
  }, [selectedCube]);

  useEffect(() => {
    // console.log(selectedCube);
    // const handleKeyDown = (event) => {
    //   event.stopPropagation();

    //   if (!selectedCube) return;
    //   const { keyCode } = event;
    //   console.log(keyCode);
    //   let newCubeLayout = [];

    //   switch (keyCode) {
    //     case 87:
    //       // w - rotate the right face up
    //       newCubeLayout = cubeLayout.map((cube) => {
    //         // console.log(cube);
    //         const { position } = cube;
    //         const [x, y, z] = position;
    //         let newX = x;
    //         let newY = y;
    //         let newZ = z;

    //         if (x === selectedCube.position[0]) {
    //           // Top face rotation
    //           switch (`${y},${z}`) {
    //             case '1,1':
    //               newY = 1;
    //               newZ = -1;

    //               updateGroupAndAxis(cube.id, 'x', false);
    //               break;
    //             case '1,-1':
    //               newY = -1;
    //               newZ = -1;
    //               updateGroupAndAxis(cube.id, 'x', false);
    //               break;
    //             case '-1,-1':
    //               newY = -1;
    //               newZ = 1;
    //               updateGroupAndAxis(cube.id, 'x', false);
    //               break;
    //             case '-1,1':
    //               newY = 1;
    //               newZ = 1;
    //               updateGroupAndAxis(cube.id, 'x', false);
    //               break;
    //             case '0,1':
    //               newY = 1;
    //               newZ = 0;
    //               updateGroupAndAxis(cube.id, 'x', false);
    //               break;
    //             case '1,0':
    //               newY = 0;
    //               newZ = -1;
    //               updateGroupAndAxis(cube.id, 'x', false);
    //               break;
    //             case '0,-1':
    //               newY = -1;
    //               newZ = 0;
    //               updateGroupAndAxis(cube.id, 'x', false);
    //               break;
    //             case '-1,0':
    //               newY = 0;
    //               newZ = 1;
    //               updateGroupAndAxis(cube.id, 'x', false);
    //             default:
    //               break;
    //           }
    //         }

    //         return { ...cube, position: [newX, newY, newZ] };
    //       });
    //       break;
    //     case 65:
    //       // a - rotate the right face left
    //       newCubeLayout = cubeLayout.map((cube) => {
    //         const { position } = cube;
    //         const [x, y, z] = position;
    //         let newX = x;
    //         let newY = y;
    //         let newZ = z;

    //         if (y === selectedCube.position[1]) {
    //           // Top face rotation
    //           switch (`${x},${z}`) {
    //             case '-1,1':
    //               newX = -1;
    //               newZ = -1;
    //               updateGroupAndAxis(cube.id, 'y', false);
    //               break;
    //             case '-1,-1':
    //               newX = 1;
    //               newZ = -1;
    //               updateGroupAndAxis(cube.id, 'y', false);
    //               break;
    //             case '1,-1':
    //               newX = 1;
    //               newZ = 1;
    //               updateGroupAndAxis(cube.id, 'y', false);
    //               break;
    //             case '1,1':
    //               newX = -1;
    //               newZ = 1;
    //               updateGroupAndAxis(cube.id, 'y', false);
    //               break;
    //             case '0,1':
    //               newX = -1;
    //               newZ = 0;
    //               updateGroupAndAxis(cube.id, 'y', false);
    //               break;
    //             case '-1,0':
    //               newX = 0;
    //               newZ = -1;
    //               updateGroupAndAxis(cube.id, 'y', false);
    //               break;
    //             case '0,-1':
    //               newX = 1;
    //               newZ = 0;
    //               updateGroupAndAxis(cube.id, 'y', false);
    //               break;
    //             case '1,0':
    //               newX = 0;
    //               newZ = 1;
    //               updateGroupAndAxis(cube.id, 'y', false);
    //             default:
    //               break;
    //           }
    //         }

    //         return { ...cube, position: [newX, newY, newZ] };
    //       });

    //     // case 83:
    //     // case 68:

    //     default:
    //       return;
    //   }
    //   setCubeLayout(newCubeLayout);
    // };

    const handleKeyDown = (event) => {
      event.stopPropagation();

      if (!selectedCube) return;
      const { keyCode } = event;
      console.log(keyCode);

      switch (keyCode) {
        case 87:
          // w - rotate the right face up
          setCubeLayout((prevCubeLayout) => {
            const newCubeLayout = prevCubeLayout.map((cube) => {
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
                    updateGroupAndAxis(cube.id, 'x', false);
                    break;
                  case '1,-1':
                    newY = -1;
                    newZ = -1;
                    updateGroupAndAxis(cube.id, 'x', false);
                    break;
                  case '-1,-1':
                    newY = -1;
                    newZ = 1;
                    updateGroupAndAxis(cube.id, 'x', false);
                    break;
                  case '-1,1':
                    newY = 1;
                    newZ = 1;
                    updateGroupAndAxis(cube.id, 'x', false);
                    break;
                  case '0,1':
                    newY = 1;
                    newZ = 0;
                    updateGroupAndAxis(cube.id, 'x', false);
                    break;
                  case '1,0':
                    newY = 0;
                    newZ = -1;
                    updateGroupAndAxis(cube.id, 'x', false);
                    break;
                  case '0,-1':
                    newY = -1;
                    newZ = 0;
                    updateGroupAndAxis(cube.id, 'x', false);
                    break;
                  case '-1,0':
                    newY = 0;
                    newZ = 1;
                    updateGroupAndAxis(cube.id, 'x', false);
                    break;
                  default:
                    break;
                }
              }

              return { ...cube, position: [newX, newY, newZ] };
            });

            return newCubeLayout;
          });
          break;
        case 65:
          // a - rotate the right face left
          setCubeLayout((prevCubeLayout) => {
            const newCubeLayout = prevCubeLayout.map((cube) => {
              const { position } = cube;
              const [x, y, z] = position;
              let newX = x;
              let newY = y;
              let newZ = z;

              if (y === selectedCube.position[1]) {
                // Top face rotation
                switch (`${x},${z}`) {
                  case '-1,1':
                    newX = -1;
                    newZ = -1;
                    updateGroupAndAxis(cube.id, 'y', true);
                    break;
                  case '-1,-1':
                    newX = 1;
                    newZ = -1;
                    updateGroupAndAxis(cube.id, 'y', true);
                    break;
                  case '1,-1':
                    newX = 1;
                    newZ = 1;
                    updateGroupAndAxis(cube.id, 'y', true);
                    break;
                  case '1,1':
                    newX = -1;
                    newZ = 1;
                    updateGroupAndAxis(cube.id, 'y', true);
                    break;
                  case '0,1':
                    newX = -1;
                    newZ = 0;
                    updateGroupAndAxis(cube.id, 'y', true);
                    break;
                  case '-1,0':
                    newX = 0;
                    newZ = -1;
                    updateGroupAndAxis(cube.id, 'y', true);
                    break;
                  case '0,-1':
                    newX = 1;
                    newZ = 0;
                    updateGroupAndAxis(cube.id, 'y', true);
                    break;
                  case '1,0':
                    newX = 0;
                    newZ = 1;
                    updateGroupAndAxis(cube.id, 'y', true);
                    break;
                  default:
                    break;
                }
              }

              return { ...cube, position: [newX, newY, newZ] };
            });

            return newCubeLayout;
          });
          break;
        default:
          return;
      }
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
      <Canvas onCreated={configCamera}>
        <OrbitControls enableZoom={false} />
        <PerspectiveCamera makeDefault {...configCamera} />
        {cubeLayout.map((cube) => (
          <Cube
            key={cube.id}
            id={cube.id}
            position={cube.position}
            colors={colors}
            faceColors={cube.faceColors}
            selectedCube={selectedCube}
            setSelectedCube={setSelectedCube}
            groupToRotate={groupToRotate}
            setGroupToRotate={setGroupToRotate}
          />
        ))}
      </Canvas>
    </div>
  );
}

export default Scene;
