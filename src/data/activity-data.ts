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
    id: 'agent-harness',
    category: 'reading',
    title: 'AI Agent Harness Internals',
    detail: 'Agent loops, streaming tool execution, MCP, subagent orchestration.',
    description:
      'Researching the core runtime that makes AI agents work: agent loop architecture, streaming tool calls over SSE, partial tool-call parsing mid-stream, doom-loop detection, context window compaction, rate-limit aware retry, multi-provider LLM abstraction, JSON Schema tool validation, permission-gated execution, subagent spawning, swarm orchestration, and MCP for dynamic tool discovery.',
    status: 'active',
    date: '2025-04-14',
    main: true,
  },
  {
    id: 'gosfu',
    category: 'building',
    title: 'GoSFU: Realtime Voice AI over WebRTC',
    detail: 'Go SFU with Pion, STT/LLM/TTS pipeline, end-to-end latency analysis.',
    description:
      'Building a minimal audio-first SFU in Go using Pion, wired into a streaming AI pipeline (STT, LLM, TTS). The real focus is measuring and understanding system behavior: per-stage latency breakdowns, streaming vs batch tradeoffs, backpressure handling, failure modes at every layer, and bottleneck identification across the full mic-to-speaker path.',
    status: 'active',
    date: '2025-04-14',
    main: true,
  },
  {
    id: 'rag-pipeline',
    category: 'done',
    title: 'Building Production RAG Pipelines',
    detail: '90% retrieval accuracy on production RAG, from first principles.',
    description:
      'Implementing the full retrieval stack: BM25, dense vectors, hybrid fusion, cross-encoder re-ranking, with eval pipelines.',
    codeUrl: 'https://github.com/gokuljs/DeepRAG',
    blogUrl: '/blogs/retrieval-from-first-principles',
    status: 'complete',
    date: '2025-04-14',
    main: false,
  },
  {
    id: 'doc-to-lora',
    category: 'done',
    title: 'Doc-to-LoRA: Learning to Instantly Internalize Contexts',
    detail: 'Charakorn, Cetin, Uesaka, Lange · Sakana AI',
    description:
      'A hypernetwork that reads a doc once and generates a LoRA adapter in a single forward pass. The LLM answers without the doc ever touching the context window. If this scales, it basically kills the retrieval problem.',
    url: 'https://arxiv.org/pdf/2602.15902',
    status: 'complete',
    date: '2025-04-10',
    main: false,
    paper: {
      venue: 'arxiv · 2602.15902',
      authors: 'Charakorn, Cetin, Uesaka, Lange · Sakana AI',
    },
  },
];
