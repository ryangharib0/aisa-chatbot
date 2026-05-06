import { google } from '@ai-sdk/google';
import { embed } from 'ai';

export async function getEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: google.textEmbeddingModel('text-embedding-004'),
    value: text,
  });
  return embedding;
}
