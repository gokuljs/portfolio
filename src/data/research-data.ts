export interface Research {
  title: string;
  description: string;
  goal?: string;
  tags: string[];
  github?: string;
  status: 'active' | 'paused' | 'complete';
}

export const currentResearch: Research = {
  title: 'Building Production RAG Pipelines',
  description:
    'Understanding the retrieval stack from first principles: inverted indices, BM25 scoring, and dense vector search, through to production concerns: hybrid fusion, cross-encoder re-ranking, evaluation metrics, and agentic retrieval loops.',
  goal: 'Design and ship a production-grade RAG system with robust retrieval, evaluation pipelines, and agentic query handling.',
  tags: ['BM25', 'Embeddings', 'Vector DB', 'Hybrid Search', 'Re-ranking', 'Multimodal'],
  github: 'https://github.com/gokuljs/Advanced-rag',
  status: 'active',
};
