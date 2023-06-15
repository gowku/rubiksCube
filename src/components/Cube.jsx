import { useRef, useState, useEffect } from 'react';
import { BoxGeometry, EdgesGeometry, LineBasicMaterial, LineSegments, MeshBasicMaterial } from 'three';

const Cube = ({ id, position, colors, isSelected, onClick, groupToRotate }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [faceColors, setFaceColors] = useState([]);

  useEffect(() => {
    const determineFaceColors = () => {
      const [frontColor, backColor, topColor, bottomColor, leftColor, rightColor] = colors;

      setFaceColors([frontColor, backColor, topColor, bottomColor, leftColor, rightColor]);
    };

    determineFaceColors();
  }, [colors]);

  const cubeRef = useRef(null);
  const cubeGeometry = new BoxGeometry(1, 1, 1);
  const cubeMaterials = faceColors.map((color) => new MeshBasicMaterial({ color }));
  const cubeMaterialTransparent = new MeshBasicMaterial({ opacity: 0.5, transparent: true });

  const edgesGeometry = new EdgesGeometry(cubeGeometry);
  const edgesMaterial = new LineBasicMaterial({ color: 'black' });
  const edges = new LineSegments(edgesGeometry, edgesMaterial);

  const clickHandler = (e) => {
    e.stopPropagation();
    setIsVisible((prev) => !prev);
    onClick(position, faceColors);
  };

  // useEffect(() => {
  //   console.log('groupToRotate', groupToRotate);
  //   if (groupToRotate.group.includes(id)) {
  //     const rotationAngle = Math.PI / 2; // 90 degrees in radians

  //     switch (groupToRotate.axis) {
  //       case 'x':
  //         cubeRef.current.rotation.x += rotationAngle;
  //         break;
  //       case 'y':
  //         cubeRef.current.rotation.y += rotationAngle;
  //         break;
  //       case 'z':
  //         cubeRef.current.rotation.z += rotationAngle;
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // }, [groupToRotate]);

  return (
    <group ref={cubeRef} position={position}>
      <mesh
        geometry={cubeGeometry}
        material={isVisible ? cubeMaterials : cubeMaterialTransparent}
        onClick={clickHandler}
      />
      <primitive object={edges} />
    </group>
  );
};

export default Cube;
