import { useRef, useState } from 'react';
import { BoxGeometry, EdgesGeometry, LineBasicMaterial, LineSegments, MeshBasicMaterial } from 'three';

const Cube = ({ position, colors, isSelected, onClick }) => {
  // console.log(isSelected);
  const [isVisible, setIsVisible] = useState(true);

  const cubeRef = useRef(null);
  const cubeGeometry = new BoxGeometry(1, 1, 1);
  const cubeMaterials = colors.map((color) => new MeshBasicMaterial({ color }));
  const cubeMaterial = new MeshBasicMaterial({ opacity: 0.5, transparent: true });

  const edgesGeometry = new EdgesGeometry(cubeGeometry);
  const edgesMaterial = new LineBasicMaterial({ color: 'black' });
  const edges = new LineSegments(edgesGeometry, edgesMaterial);

  const clickHandler = (e) => {
    e.stopPropagation();
    setIsVisible((prev) => !prev);
    onClick(position);
  };

  const isSameRow = position[1] === isSelected?.position[1];
  const isSameColumn = position[0] === isSelected?.position[0];

  return (
    <group ref={cubeRef} position={position}>
      <mesh
        geometry={cubeGeometry}
        material={isVisible ? cubeMaterials : cubeMaterial}
        onClick={clickHandler}
        // visible={!isSameRow && !isSameColumn}
      />
      <primitive object={edges} />
    </group>
  );
};

export default Cube;
