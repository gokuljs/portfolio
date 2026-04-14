export type ActivityCategory = 'reading' | 'building' | 'done';
export type ActivityStatus = 'active' | 'complete' | 'backlog' | 'paused';

export interface ActivityItem {
  id: string;
  category: ActivityCategory;
  title: string;
  detail?: string;
  description?: string;
  url?: string;
  codeUrl?: string;
  blogUrl?: string;
  status: ActivityStatus;
  date: string;
  main: boolean;
  paper?: {
    venue: string;
    authors: string;
  };
}

export const activities: ActivityItem[] = [
  {
    id: 'rag-pipeline',
    category: 'done',
    title: 'Building Production RAG Pipelines',
    detail: '90% retrieval accuracy on production RAG — from first principles.',
    description:
      'Implementing the full retrieval stack — BM25, dense vectors, hybrid fusion, cross-encoder re-ranking — with eval pipelines.',
    codeUrl: 'https://github.com/gokuljs/DeepRAG',
    blogUrl: '/blogs/retrieval-from-first-principles',
    status: 'complete',
    date: '2025-04-14',
    main: true,
  },
  {
    id: 'doc-to-lora',
    category: 'done',
    title: 'Doc-to-LoRA: Learning to Instantly Internalize Contexts',
    detail: 'Charakorn, Cetin, Uesaka, Lange · Sakana AI',
    description:
      'A hypernetwork that reads a doc once and generates a LoRA adapter in a single forward pass — the LLM answers without the doc ever touching the context window. If this scales, it basically kills the retrieval problem.',
    codeUrl: 'https://github.com/gokuljs/DeepRAG',
    blogUrl: '/blogs/retrieval-from-first-principles',
    status: 'complete',
    date: '2025-04-10',
    main: true,
    paper: {
      venue: 'arxiv · 2602.15902',
      authors: 'Charakorn, Cetin, Uesaka, Lange · Sakana AI',
    },
  },
];
