import { Metadata } from 'next';
import { BlogArticleLayout } from '@/components/ui/blog-article-layout';
import { getBlogBySlug, generateBlogMetadata, generateBlogJsonLd } from '@/data/blogs-data';

const slug = 'retrieval-from-first-principles';
const blog = getBlogBySlug(slug)!;
const jsonLd = generateBlogJsonLd(slug)!;

export const metadata: Metadata = generateBlogMetadata(slug);

export default function RetrievalFromFirstPrinciplesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumbJsonLd) }}
      />
      <BlogArticleLayout
        title={blog.title}
        description={blog.description}
        date={new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        dateISO={blog.date}
        tags={blog.tags}
      >

        <p>
          I started with the basics of RAG. Then I wanted to go deeper. What actually makes a retrieval pipeline good, what are the real problems, and how far can you push it. So I built a bare-metal implementation of the entire stack, from keyword search all the way to multimodal RAG, every layer by hand. You can find it at <a href="https://github.com/gokuljs/DeepRAG" target="_blank" rel="noopener noreferrer">DeepRAG</a>. Read the blog first. Then go to the code. You will have a much better mental model of why each piece exists.
        </p>
        <p>
          But before any of that. Why does RAG exist at all?
        </p>

        <h2>The Problem RAG Solves</h2>
        <p>
          Every LLM has a training cutoff. Everything that happened after that date, the model does not know. And your internal documents, your org&apos;s wikis, support tickets, codebases, contracts, the model has never seen any of it. You need a way to get that information in.
        </p>
        <p>
          The obvious answer: just put the documents in the context window. And honestly, for small documents, that is the right answer. If your data fits under roughly 200k tokens, pass it in directly. Simpler, no infrastructure to maintain, no retrieval pipeline to debug. The simplest solution wins.
        </p>
        <p>
          But what if you have more data than fits? What if you have an infinite set of documents?
        </p>

        <h2>When the Simple Answer Breaks</h2>
        <p>
          Three things go wrong as your document set grows.
        </p>
        <p>
          First, accuracy drops. When you push more than 200k tokens into the context, LLMs get worse at using it. The signal gets buried in the noise. The model starts missing things it should find.
        </p>
        <p>
          Second, the re-reading tax. In a multi-turn conversation, you are sending all that text back to the model on every single turn. Token usage explodes. Cost scales with every message.
        </p>
        <p>
          Third, the needle-in-the-haystack problem. Even with a perfectly stuffed context, models still hallucinate. They pick the wrong needle, or they invent one. The model does not magically become reliable just because you gave it more text.
        </p>
        <p>
          RAG is the answer to all three. Instead of giving the model everything, you give it exactly what it needs. The relevant documents, retrieved at query time. You hand it the needle.
        </p>
        <p>
          The basic idea is simple: retrieve relevant documents, attach them to your prompt, generate an answer. That is the version most people know. But the surface-level understanding hides a lot of problems. What counts as relevant? How do you retrieve it? What happens when retrieval is wrong?
        </p>
        <p>
          That is what this blog is about. Every retrieval algorithm exists because the previous one had a flaw. Let&apos;s trace all of them.
        </p>

        <p>
          Now when it comes to RAG, it is not perfect either. The worst failures are the silent ones. The system runs, returns an answer, no crash, no error. But the document with the right information never showed up in retrieval. The model answered without it. You will never know.
        </p>
        <p>
          The whole game is how close you can get to surfacing the right documents every single time. And that is much harder than it sounds.
        </p>
        <p>
          Most RAG systems start with semantic search. You embed the query, embed the documents, find the nearest vectors. It works well for meaning-based queries. But say the user asks about &quot;GPT-4o&quot;, or &quot;CVE-2024-1234&quot;, or &quot;numpy==1.24.0&quot;, or an internal ticket ID like &quot;ENG-4821&quot;. These are exact identifiers. They have no semantic meaning in the embedding space. The similarity search drifts toward general content and misses the exact thing the user needed. No error. Just the wrong documents, returned confidently.
        </p>
        <p>
          This is the gap keyword search was built to fill.
        </p>

        <h2>Keyword Search</h2>

      </BlogArticleLayout>
    </>
  );
}
