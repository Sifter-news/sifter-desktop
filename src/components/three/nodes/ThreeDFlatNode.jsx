import React, { useRef, useState } from 'react';
import { Text, Billboard, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from "@/components/ui/button";
import { Trash2, Layout, Square, StickyNote } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ThreeDFlatNode = ({ 
  node,
  position = [0, 0, 0],
  title = "Title",
  subline = "Subline",
  avatarUrl = "/default-image.png",
  onDelete,
  onStyleChange,
  activeTool,
  isSelected,
  onSelect,
  onHover,
  onHoverEnd
}) => {
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const textureLoader = new THREE.TextureLoader();
  const avatarTexture = textureLoader.load(avatarUrl);

  const avatarGeometry = new THREE.CircleGeometry(0.5, 32);
  const avatarMaterial = new THREE.MeshBasicMaterial({
    map: avatarTexture,
    transparent: true,
    side: THREE.DoubleSide
  });

  const handlePointerOver = () => {
    if (activeTool === 'select') {
      setIsHovered(true);
      onHover?.();
    }
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    onHoverEnd?.();
  };

  const handleClick = (e) => {
    if (activeTool === 'select') {
      e.stopPropagation();
      onSelect?.();
    }
  };

  return (
    <Billboard
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <group ref={groupRef} position={position}>
        {/* Selection outline */}
        {(isHovered || isSelected) && (
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[4.2, 2.2]} />
            <meshBasicMaterial 
              color={isSelected ? "#3b82f6" : "#60a5fa"} 
              transparent 
              opacity={0.3} 
            />
          </mesh>
        )}

        {/* Background plane */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[4, 2]} />
          <meshBasicMaterial color="white" transparent opacity={0.9} />
        </mesh>

        {/* Avatar circle */}
        <mesh position={[0, 0, 0]}>
          <primitive object={avatarGeometry} />
          <primitive object={avatarMaterial} />
        </mesh>

        {/* Title text */}
        <Text
          position={[-0.5, 0.3, 0]}
          fontSize={0.5}
          color="black"
          anchorX="left"
          anchorY="middle"
        >
          {title}
        </Text>

        {/* Subline text */}
        <Text
          position={[-0.5, -0.1, 0]}
          fontSize={0.15}
          color="gray"
          anchorX="left"
          anchorY="middle"
        >
          {subline}
        </Text>

        {/* Hover Tooltip */}
        {isHovered && (
          <Html position={[0, 1.2, 0]} center>
            <div className="bg-black/80 text-white p-2 rounded-lg shadow-lg flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Layout className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black text-white">
                  <DropdownMenuItem onClick={() => onStyleChange('compact')}>
                    <Square className="h-4 w-4 mr-2" />
                    Compact (48x48)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStyleChange('default')}>
                    <Layout className="h-4 w-4 mr-2" />
                    Default (128x48)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStyleChange('postit')}>
                    <StickyNote className="h-4 w-4 mr-2" />
                    Post-it (256x256)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-red-500/50"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Html>
        )}
      </group>
    </Billboard>
  );
};

export default ThreeDFlatNode;