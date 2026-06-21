"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Environment, ContactShadows, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

function GlassEditor() {
	return (
		<Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
			<group position={[0, 0, 0]}>
				{/* Glass Panel */}
				<mesh castShadow receiveShadow>
					<boxGeometry args={[6, 4, 0.1]} />
					<meshPhysicalMaterial
						roughness={0.2}
						transmission={1}
						thickness={0.5}
						clearcoat={1}
						clearcoatRoughness={0.1}
						color={new THREE.Color("hsl(258, 80%, 70%)")}
						ior={1.5}
					/>
				</mesh>

				{/* UI Elements - Video Preview Area */}
				<mesh position={[0, 0.5, 0.1]}>
					<boxGeometry args={[5, 2.5, 0.05]} />
					<meshStandardMaterial color="#0a0a0f" roughness={0.8} />
				</mesh>

				{/* UI Elements - Timeline Tracks */}
				<mesh position={[-1, -1.2, 0.1]}>
					<boxGeometry args={[2.8, 0.3, 0.1]} />
					<meshStandardMaterial color={new THREE.Color("hsl(258, 85%, 70%)")} />
				</mesh>
				<mesh position={[1, -1.2, 0.1]}>
					<boxGeometry args={[1.5, 0.3, 0.1]} />
					<meshStandardMaterial color={new THREE.Color("hsl(295, 65%, 68%)")} />
				</mesh>
				
				{/* UI Elements - Glowing Playhead */}
				<mesh position={[0, -1.2, 0.15]}>
					<boxGeometry args={[0.05, 0.6, 0.1]} />
					<meshStandardMaterial 
						color="#ff0055" 
						emissive="#ff0055" 
						emissiveIntensity={2} 
						toneMapped={false}
					/>
				</mesh>
			</group>
		</Float>
	);
}

export function HeroScene() {
	return (
		<div className="w-full h-full min-h-[500px]">
			<Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
				<pointLight position={[-10, -10, -10]} intensity={0.5} color="#8a2be2" />
				
				<PresentationControls
					global
					config={{ mass: 2, tension: 500 }}
					snap={{ mass: 4, tension: 1500 }}
					rotation={[0, -0.2, 0]}
					polar={[-Math.PI / 3, Math.PI / 3]}
					azimuth={[-Math.PI / 1.4, Math.PI / 2]}
				>
					<GlassEditor />
				</PresentationControls>

				<ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
				<Environment preset="city" />
			</Canvas>
		</div>
	);
}
