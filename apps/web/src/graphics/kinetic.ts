import type { GraphicRenderContext } from "./types";
import { GraphicDefinition } from "./types";

export interface KineticTextSchema {
	type: "kinetic_text";
	text: string;
	font: string;
	style: {
		color: string;
		fontSize: number;
		weight?: string;
	};
	animations: {
		property: string;
		keyframes: {
			time: number;
			value: number;
			easing?: any;
		}[];
	}[];
}

function lerp(start: number, end: number, t: number) {
	return start * (1 - t) + end * t;
}

function getValueAtTime(keyframes: any[], localTime: number): number {
	if (!keyframes || keyframes.length === 0) return 0;
	if (localTime <= keyframes[0].time) return keyframes[0].value;
	if (localTime >= keyframes[keyframes.length - 1].time) return keyframes[keyframes.length - 1].value;

	for (let i = 0; i < keyframes.length - 1; i++) {
		const k1 = keyframes[i];
		const k2 = keyframes[i + 1];
		if (localTime >= k1.time && localTime < k2.time) {
			const t = (localTime - k1.time) / (k2.time - k1.time);
			// Assuming linear easing for simplicity in this baseline implementation
			// We can plug in bezier easing later based on the JSON schema
			return lerp(k1.value, k2.value, t);
		}
	}
	return 0;
}

export const kineticTextDefinition: GraphicDefinition = {
	id: "ai-kinetic-text",
	name: "Kinetic Text",
	keywords: ["text", "kinetic", "ai"],
	params: [
		{
			id: "schema",
			name: "JSON Schema",
			type: "string",
			defaultValue: '{"type":"kinetic_text","text":"Hello World","font":"Fraunces","style":{"color":"#FFF","fontSize":60},"animations":[]}',
		},
		{
			id: "localTime",
			name: "Local Time (s)",
			type: "number",
			defaultValue: 0,
		}
	],
	render({ ctx, params, width, height }: GraphicRenderContext) {
		const schemaStr = params.schema as string;
		const localTime = params.localTime as number;

		let schema: KineticTextSchema;
		try {
			schema = JSON.parse(schemaStr);
		} catch (e) {
			return; // Invalid schema
		}

		if (schema.type !== "kinetic_text") return;

		let opacity = 1;
		let translateY = 0;

		// Resolve animated properties
		if (schema.animations) {
			for (const anim of schema.animations) {
				if (anim.property === "opacity") {
					opacity = getValueAtTime(anim.keyframes, localTime);
				}
				if (anim.property === "translateY") {
					translateY = getValueAtTime(anim.keyframes, localTime);
				}
			}
		}

		ctx.save();
		ctx.globalAlpha = opacity;
		
		// Apply typography styles
		const weight = schema.style.weight || "normal";
		ctx.font = `${weight} ${schema.style.fontSize}px ${schema.font}, sans-serif`;
		ctx.fillStyle = schema.style.color;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		// Draw with translations
		ctx.translate(width / 2, height / 2 + translateY);
		ctx.fillText(schema.text, 0, 0);

		ctx.restore();
	}
};
