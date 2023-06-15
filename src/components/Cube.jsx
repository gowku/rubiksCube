import { useRef, useState, useEffect } from 'react';
import { BoxGeometry, EdgesGeometry, LineBasicMaterial, LineSegments, MeshBasicMaterial } from 'three';

const Cube = ({ id, position, colors, selectedCube, onClick, groupToRotate, setGroupToRotate }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [faceColors, setFaceColors] = useState([]);
  const faceNames = ['Front', 'Back', 'Top', 'Bottom', 'Left', 'Right']; // Array of face names

  useEffect(() => {
    const determineFaceColors = () => {
      const [frontColor, backColor, topColor, bottomColor, leftColor, rightColor] = colors;

      setFaceColors([frontColor, backColor, topColor, bottomColor, leftColor, rightColor]);
    };

    determineFaceColors();
  }, [colors]);

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

  const clickHandler = (e) => {
    e.stopPropagation();
    console.log(getClickedSide(e));
    const clickedSide = getClickedSide(e);
    onClick(position, colors, id, clickedSide);
  };

  const getClickedSide = (e) => {
    const canvas = document.querySelector('canvas');
    const boundingRect = canvas.getBoundingClientRect();
    const { width, height, left, top } = boundingRect;
    const { clientX, clientY } = e;
    const offsetX = clientX - left;
    const offsetY = clientY - top;
    const xRatio = offsetX / width;
    const yRatio = offsetY / height;

    if (xRatio > yRatio && xRatio > 1 - yRatio) {
      return 'Right';
    } else if (xRatio > yRatio && xRatio < 1 - yRatio) {
      return 'Front';
    } else if (xRatio < yRatio && xRatio > 1 - yRatio) {
      return 'Back';
    } else if (xRatio < yRatio && xRatio < 1 - yRatio) {
      return 'Left';
    }
  };

  const pointerDownHandler = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    setIsVisible(selectedCube?.id !== id);
    // console.log(selectedCube);

    // if (selectedCube?.id === id) {
    //   console.log(cubeRef.current);
    // }
  }, [selectedCube, id]);

  useEffect(() => {
    // console.log(groupToRotate);
    if (groupToRotate.group.includes(id)) {
      const rotationAngle = ((groupToRotate.sign ? 1 : -1) * Math.PI) / 2; // 90 degrees in radians

      switch (groupToRotate.axis) {
        case 'x':
          cubeRef.current.rotation.x += rotationAngle;
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
        onClick={clickHandler}
        onPointerDown={pointerDownHandler}
      />
      <primitive object={edges} />
    </group>
  );
};

export default Cube;
