import { pipeline, env } from '@xenova/transformers';

// Configure transformers.js to use local WebAssembly (no external server required)
env.allowLocalModels = false;
env.useBrowserCache = true;

class BrollSearchEngine {
	private static instance: any = null;
	private static isInitializing = false;

	// Use Xenova's generic CLIP model which can embed both text and images into the same vector space
	private static modelName = 'Xenova/clip-vit-base-patch32';

	static async getInstance(progressCallback?: (info: any) => void) {
		if (this.instance) return this.instance;
		if (this.isInitializing) {
			// Wait for initialization if already started
			while (this.isInitializing) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}
			return this.instance;
		}

		this.isInitializing = true;
		try {
			// We load the feature extraction pipeline (which outputs the embeddings)
			this.instance = await pipeline('feature-extraction', this.modelName, {
				progress_callback: progressCallback
			});
		} finally {
			this.isInitializing = false;
		}
		
		return this.instance;
	}

	/**
	 * Compute embedding for a search query.
	 */
	static async embedText(query: string): Promise<Float32Array> {
		const extractor = await this.getInstance();
		const output = await extractor(query);
		return output.data as Float32Array;
	}

	/**
	 * Compute embedding for a video frame (provided as a Data URL or Image object).
	 */
	static async embedImage(imageUrl: string): Promise<Float32Array> {
		const extractor = await this.getInstance();
		const output = await extractor(imageUrl);
		return output.data as Float32Array;
	}

	/**
	 * Cosine similarity between two vectors.
	 */
	static cosineSimilarity(a: Float32Array, b: Float32Array): number {
		let dotProduct = 0.0;
		let normA = 0.0;
		let normB = 0.0;
		for (let i = 0; i < a.length; i++) {
			dotProduct += a[i] * b[i];
			normA += a[i] * a[i];
			normB += b[i] * b[i];
		}
		return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
	}
}

export default BrollSearchEngine;
