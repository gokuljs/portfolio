export interface ResearchPaper {
  title: string;
  authors: string;
  url: string;
  venue: string;
}

export interface Research {
  title: string;
  description: string;
  goal?: string;
  tags: string[];
  github?: string;
  status: 'active' | 'paused' | 'complete';
  paper?: ResearchPaper;
}

export const currentResearch: Research = {
  title: 'Building Production RAG Pipelines',
  description:
    'Understanding the retrieval stack from first principles: inverted indices, BM25 scoring, and dense vector search, through to production concerns: hybrid fusion, cross-encoder re-ranking, evaluation metrics, and agentic retrieval loops.',
  goal: '90% retrieval accuracy on production RAG — from first principles.',
  tags: ['BM25', 'Embeddings', 'Vector DB', 'Hybrid Search', 'Re-ranking', 'Multimodal'],
  github: 'https://github.com/gokuljs/Advanced-rag',
  status: 'active',
  paper: {
    title: 'Doc-to-LoRA: Learning to Instantly Internalize Contexts',
    authors: 'Charakorn, Cetin, Uesaka, Lange · Sakana AI',
    url: 'https://arxiv.org/abs/2602.15902',
    venue: 'arxiv · 2602.15902',
  },
};
