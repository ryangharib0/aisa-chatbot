import { google } from '@ai-sdk/google';
import { embed } from 'ai';

export async function getEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: google.textEmbeddingModel('gemini-embedding-001'),
    value: text,
    providerOptions: {
      google: {
        outputDimensionality: 768,
      },
    },
  });
  return embedding;
}
