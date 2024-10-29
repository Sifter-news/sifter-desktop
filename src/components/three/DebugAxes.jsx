import React from 'react';
import * as THREE from 'three';
import AxisLine from './AxisLine';
import AxisMarkers from './AxisMarkers';

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
      
      {/* Y axis */}
      <AxisLine vertices={yLineVertices} color="green" />
      <AxisLine vertices={negYLineVertices} color="#00ff0080" opacity={0.5} />
      <AxisMarkers axis="y" color="green" fadedColor="#00ff0080" />
      
      {/* Z axis */}
      <AxisLine vertices={zLineVertices} color="blue" />
      <AxisLine vertices={negZLineVertices} color="#0000ff80" opacity={0.5} />
      <AxisMarkers axis="z" color="blue" fadedColor="#0000ff80" />
    </>
  );
};

export default DebugAxes;