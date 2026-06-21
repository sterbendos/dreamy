"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AbstractEditor() {
	const group = useRef<THREE.Group>(null);
	const tracks = useRef<THREE.Mesh[]>([]);

	useFrame((state) => {
		const scrollY = window.scrollY;
		const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
		const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
		
		if (group.current) {
			// Subtle continuous rotation based on scroll
			group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, progress * Math.PI, 0.05);
			group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, progress * 4, 0.05);
		}

		// Animate individual tracks
		tracks.current.forEach((track, i) => {
			if (!track) return;
			// At progress=0 they are scattered, at progress=0.5 they form a timeline, at progress=1 they scatter again
			const targetX = (i - 2) * 0.5;
			const targetY = -i * 0.8;
			const targetZ = 0;

			// Scatter positions
			const scatterX = Math.sin(i * 123) * 8;
			const scatterY = Math.cos(i * 321) * 8;
			const scatterZ = Math.sin(i * 231) * 8;

			let mix = 0;
			if (progress < 0.3) {
				mix = progress / 0.3; // 0 to 1
			} else if (progress > 0.7) {
				mix = 1 - ((progress - 0.7) / 0.3); // 1 to 0
			} else {
				mix = 1;
			}

			// Easing function for smoother assembly
			const easedMix = 1 - Math.pow(1 - mix, 3);

			const curX = THREE.MathUtils.lerp(scatterX, targetX, easedMix);
			const curY = THREE.MathUtils.lerp(scatterY, targetY, easedMix);
			const curZ = THREE.MathUtils.lerp(scatterZ, targetZ, easedMix);

			track.position.x = THREE.MathUtils.lerp(track.position.x, curX, 0.05);
			track.position.y = THREE.MathUtils.lerp(track.position.y, curY, 0.05);
			track.position.z = THREE.MathUtils.lerp(track.position.z, curZ, 0.05);

			// Rotate towards viewer when assembled
			track.rotation.x = THREE.MathUtils.lerp(track.rotation.x, mix * 0.2, 0.05);
			track.rotation.y = THREE.MathUtils.lerp(track.rotation.y, mix * 0.1, 0.05);
		});
	});

	return (
		<group ref={group} position={[3, 0, -5]}>
			<Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
				{/* Abstract timeline tracks */}
				{[0, 1, 2, 3, 4].map((i) => (
					<mesh
						key={i}
						ref={(el) => {
							if (el) tracks.current[i] = el;
						}}
					>
						<boxGeometry args={[5, 0.3, 0.1]} />
						<meshStandardMaterial
							color={new THREE.Color(`hsl(${250 + i * 20}, 80%, 60%)`)}
							emissive={new THREE.Color(`hsl(${250 + i * 20}, 80%, 60%)`)}
							emissiveIntensity={0.4}
							roughness={0.2}
							metalness={0.8}
						/>
					</mesh>
				))}
				{/* Playhead */}
				<mesh position={[0, -1.6, 0.2]}>
					<cylinderGeometry args={[0.02, 0.02, 6, 8]} />
					<meshStandardMaterial
						color="#ff0055"
						emissive="#ff0055"
						emissiveIntensity={2}
						roughness={0.2}
						metalness={0.8}
					/>
				</mesh>
			</Float>
		</group>
	);
}

export function Scene() {
	return (
		<div className="pointer-events-none fixed inset-0 -z-10 bg-background overflow-hidden">
			<Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
				<ambientLight intensity={0.5} />
				<pointLight position={[10, 10, 10]} intensity={1} />
				<pointLight position={[-10, -10, -10]} intensity={0.5} color="#8a2be2" />
				<AbstractEditor />
				<Sparkles count={100} scale={15} size={1} speed={0.2} opacity={0.15} color="#a855f7" />
				<Environment preset="city" />
			</Canvas>
		</div>
	);
}
