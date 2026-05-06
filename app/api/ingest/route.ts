import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { getEmbedding } from '@/lib/embeddings';

const ingestSchema = z.object({
  content: z.string().min(1),
  metadata: z.record(z.string(), z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, metadata } = ingestSchema.parse(body);

    const embedding = await getEmbedding(content);
    const embeddingString = `[${embedding.join(',')}]`;

    const result = await sql`
      INSERT INTO documents (content, embedding, metadata)
      VALUES (${content}, ${embeddingString}::vector, ${JSON.stringify(metadata ?? {})}::jsonb)
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error('Ingest error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
