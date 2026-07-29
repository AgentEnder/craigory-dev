import { join } from 'node:path';
import { EMBED_DIM } from './db';

/**
 * Split text into embedding-sized windows on paragraph boundaries, carrying a
 * small overlap tail so a concept straddling a boundary still lands whole in at
 * least one chunk. Pure and deterministic, so it is testable without the model.
 * `maxChars ~= 400 tokens`, under bge's 512-token limit.
 */
export function chunkText(
  text: string,
  maxChars = 1600,
  overlapChars = 200
): string[] {
  const clean = text.replace(/\r\n/g, '\n').trim();
  if (!clean) return [];
  if (clean.length <= maxChars) return [clean];

  const paragraphs = clean
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = '';
  const flush = () => {
    if (current.trim()) chunks.push(current.trim());
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxChars) {
      // One oversized paragraph (a code block, usually): hard-split it.
      flush();
      current = '';
      for (let i = 0; i < paragraph.length; i += maxChars - overlapChars) {
        chunks.push(paragraph.slice(i, i + maxChars));
      }
      continue;
    }
    if (current && current.length + paragraph.length + 2 > maxChars) {
      flush();
      const tail = current.slice(Math.max(0, current.length - overlapChars));
      current = `${tail}\n\n${paragraph}`;
    } else {
      current = current ? `${current}\n\n${paragraph}` : paragraph;
    }
  }
  flush();
  return chunks;
}

type Extractor = (
  input: string | string[],
  options: { pooling: 'mean'; normalize: boolean }
) => Promise<{ tolist(): number[][] }>;

let modelPromise: Promise<Extractor> | null = null;

/**
 * bge-small-en-v1.5 over onnxruntime with a pure-JS tokenizer, so it runs the
 * same on every platform and in CI. Imported lazily — loading this module must
 * not pull in the model runtime, only actually embedding should.
 *
 * bge is asymmetric (retrieval queries take an instruction prefix that passages
 * do not), but this feature only ever compares passages to passages, so no
 * prefix is used anywhere.
 */
function getModel(cacheDir: string): Promise<Extractor> {
  if (!modelPromise) {
    modelPromise = (async () => {
      const { pipeline, env } = await import('@huggingface/transformers');
      // ~130MB of ONNX weights land here on first use, then are reused.
      env.cacheDir = join(cacheDir, 'models');
      return pipeline(
        'feature-extraction',
        'Xenova/bge-small-en-v1.5'
      ) as unknown as Promise<Extractor>;
    })();
  }
  return modelPromise;
}

const batchesOf = <T>(items: T[], size: number): T[][] => {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
};

/** Embed passages. Returns 384-dim unit vectors. */
export async function embedPassages(
  texts: string[],
  cacheDir: string
): Promise<Float32Array[]> {
  if (!texts.length) return [];
  const model = await getModel(cacheDir);
  const vectors: Float32Array[] = [];

  for (const batch of batchesOf(texts, 16)) {
    try {
      const output = await model(batch, { pooling: 'mean', normalize: true });
      for (const vector of output.tolist()) {
        vectors.push(Float32Array.from(vector));
      }
    } catch {
      // Rare onnxruntime batching quirk — retry this batch one at a time.
      for (const text of batch) {
        const output = await model([text], {
          pooling: 'mean',
          normalize: true,
        });
        vectors.push(Float32Array.from(output.tolist()[0]));
      }
    }
  }

  return vectors;
}

/**
 * Mean of a document's chunk vectors, renormalized to unit length.
 *
 * The mean of unit vectors is not itself a unit vector, and vec0's L2 distance
 * is only convertible to cosine similarity for unit vectors — so skipping the
 * renormalize would silently distort every score.
 */
export function meanVector(vectors: Float32Array[]): Float32Array {
  const mean = new Float32Array(EMBED_DIM);
  for (const vector of vectors) {
    for (let i = 0; i < EMBED_DIM; i++) mean[i] += vector[i];
  }

  let magnitude = 0;
  for (let i = 0; i < EMBED_DIM; i++) magnitude += mean[i] * mean[i];
  magnitude = Math.sqrt(magnitude);
  if (magnitude === 0) return mean;

  for (let i = 0; i < EMBED_DIM; i++) mean[i] /= magnitude;
  return mean;
}

/**
 * vec0 reports L2 distance. For unit vectors `L2^2 = 2 - 2*cos`, so cosine
 * similarity comes back exactly — no second pass over the vectors needed.
 */
export const l2ToCosine = (distance: number) => 1 - (distance * distance) / 2;
