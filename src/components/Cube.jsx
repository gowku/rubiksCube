import { useThree } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import {
  BoxGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  MeshBasicMaterial,
  Raycaster,
  Vector2,
} from 'three';

const Cube = ({ id, position, colors, selectedCube, setSelectedCube, groupToRotate, setGroupToRotate }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [faceColors, setFaceColors] = useState([]);
  const faceNames = ['Front', 'Back', 'Top', 'Bottom', 'Left', 'Right']; // Array of face names
  const rubiksCubeFaces = ['front', 'back', 'top', 'bottom', 'left', 'right']; // Array of face names

  useEffect(() => {
    const determineFaceColors = () => {
      const [frontColor, backColor, topColor, bottomColor, leftColor, rightColor] = colors;

      setFaceColors([frontColor, backColor, topColor, bottomColor, leftColor, rightColor]);
    };

    determineFaceColors();
  }, []);

  const cubeRef = useRef(null);
  const cubeGeometry = new BoxGeometry(1, 1, 1);
  const cubeMaterials = faceColors.map((color, i) => {
    const material = new MeshBasicMaterial({ color });
    material.name = faceNames[i];
    return material;
  });
  const cubeMaterialTransparent = new MeshBasicMaterial({ opacity: 0.5, transparent: true });
  const edgesGeometry = new EdgesGeometry(cubeGeometry);
  const edgesMaterial = new LineBasicMaterial({ color: 'black' });
  const edges = new LineSegments(edgesGeometry, edgesMaterial);

  // const camera = useThree((state) => state.camera);
  // const { camera } = useThree();
  // const aaa = useThree((state) => state);
  // console.log(aaa);
  // const scene = useThree((state) => state.scene);
  // const { scene } = useThree();

  const clickHandler = (e) => {
    e.stopPropagation();
    setSelectedCube({ position, colors, id, uuid: cubeRef.current.uuid });

    // const raycaster = new THREE.Raycaster();
    // const mouse = new THREE.Vector2();

    // mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    // mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // raycaster.setFromCamera(mouse, camera);
    // // const intersects = raycaster.intersectObjects(cubeRef.current.children);
    // // const intersects = raycaster.intersectObjects(scene.children, true);
    // const intersects = raycaster.intersectObjects(e.object, true);
    // console.log(intersects);

    // for (let i = 0; i < intersects.length; i++) {
    //   console.log(intersects[i]);
    //   if (intersects[i].faceIndex !== null) {
    //   }
    // }
  };

  const pointerDownHandler = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    // selectedCube?.uuid !== cubeRef.current.uuid ? setIsVisible(true) : setIsVisible(false);
    setIsVisible(selectedCube?.uuid !== cubeRef.current.uuid);
    // console.log(cubeRef.current);
  }, [selectedCube]);

  useEffect(() => {
    if (groupToRotate.group.includes(id)) {
      const rotationAngle = ((groupToRotate.sign ? 1 : -1) * Math.PI) / 2; // 90 degrees in radians

      switch (groupToRotate.axis) {
        case 'x':
          // cubeRef.current.rotation.x += rotationAngle;
          break;
        case 'y':
          cubeRef.current.rotation.y += rotationAngle;
          break;
        case 'z':
          cubeRef.current.rotation.z += rotationAngle;
          break;
        default:
          break;
      }
      setGroupToRotate((prev) => ({ ...prev, group: [], axis: '' }));
    }
  }, [groupToRotate]);

  return (
    <group ref={cubeRef} position={position}>
      <mesh
        geometry={cubeGeometry}
        material={isVisible ? cubeMaterials : cubeMaterialTransparent}
        // material={cubeMaterials}
        onClick={clickHandler}
        onPointerDown={pointerDownHandler}
      />
      <primitive object={edges} />
    </group>
  );
};

export default Cube;
