import React from 'react';
import * as THREE from 'three';
import AxisLine from './AxisLine';
import AxisMarkers from './AxisMarkers';
import RotationIndicator from './RotationIndicator';

const DebugAxes = () => {
  // Positive axis lines
  const xLineVertices = new Float32Array([0, 0, 0, 5000, 0, 0]);
  const yLineVertices = new Float32Array([0, 0, 0, 0, 5000, 0]);
  const zLineVertices = new Float32Array([0, 0, 0, 0, 0, 5000]);

  // Negative axis lines
  const negXLineVertices = new Float32Array([0, 0, 0, -5000, 0, 0]);
  const negYLineVertices = new Float32Array([0, 0, 0, 0, -5000, 0]);
  const negZLineVertices = new Float32Array([0, 0, 0, 0, 0, -5000]);

  return (
    <>
      {/* X axis */}
      <AxisLine vertices={xLineVertices} color="red" />
      <AxisLine vertices={negXLineVertices} color="#ff000080" opacity={0.5} />
      <AxisMarkers axis="x" color="red" fadedColor="#ff000080" />
      <RotationIndicator axis="x" color="red" />
      
      {/* Y axis */}
      <AxisLine vertices={yLineVertices} color="green" />
      <AxisLine vertices={negYLineVertices} color="#00ff0080" opacity={0.5} />
      <AxisMarkers axis="y" color="green" fadedColor="#00ff0080" />
      <RotationIndicator axis="y" color="green" />
      
      {/* Z axis */}
      <AxisLine vertices={zLineVertices} color="blue" />
      <AxisLine vertices={negZLineVertices} color="#0000ff80" opacity={0.5} />
      <AxisMarkers axis="z" color="blue" fadedColor="#0000ff80" />
      <RotationIndicator axis="z" color="blue" />
    </>
  );
};

export default DebugAxes;