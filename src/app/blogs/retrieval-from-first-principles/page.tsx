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
        <p>
          Keyword search is exactly what it sounds like. Does the term the user typed exist in the document or not. That is the entire idea. You look for the words. You find them or you do not.
        </p>
        <p>
          But before you can match anything, you have to clean the query. Raw user input is messy. And if you match on raw text, you will miss things that should obviously match.
        </p>
        <p>
          The first step is lowercasing. A user searching for &quot;The Matrix&quot; and a document that says &quot;the matrix&quot; should match. They are the same thing. Case should never be the reason a result is missed. So everything goes lowercase before anything else.
        </p>
        <p>
          Next, remove punctuation. It adds nothing to the search. &quot;Nolan&apos;s best film&quot; and &quot;Nolans best film&quot; should hit the same documents. The apostrophe is noise.
        </p>
        <p>
          Then remove stopwords. Words like &quot;the&quot;, &quot;is&quot;, &quot;a&quot;, &quot;of&quot; carry no retrieval signal. If you keep them, they show up in almost every document and pollute your results. Strip them out.
        </p>
        <p>
          Now you tokenize. Split the cleaned query into individual terms. &quot;best sci-fi movies about space&quot; becomes &quot;best&quot;, &quot;sci-fi&quot;, &quot;movies&quot;, &quot;space&quot;. Each token is what you search for.
        </p>
        <p>
          Finally, stemming. Users do not search in base forms. They type naturally. &quot;running&quot;, &quot;runner&quot;, &quot;ran&quot; should all match documents about &quot;run&quot;. Stemming reduces each word to its root so variations do not cause misses. &quot;watching&quot; becomes &quot;watch&quot;. &quot;jumping&quot; becomes &quot;jump&quot;. The query and the document meet at the same root, even if the surface form was different.
        </p>
        <p>
          By the time you are done, &quot;The Matrix is a great film&quot; has become &quot;matrix&quot;, &quot;great&quot;, &quot;film&quot;. Clean, consistent, ready to match.
        </p>
        <p>
          That is the query side. But what about the documents? You cannot scan every document on every search. That does not scale. You need a data structure that makes lookups fast. That structure is the inverted index.
        </p>

        <h3>Inverted Index</h3>
        <p>
          A forward index maps document to words. Given a document, you can tell what words are in it. That is useful for display, not for search.
        </p>
        <p>
          An inverted index flips it. It maps word to documents. Given a word, you instantly know every document that contains it. That is what makes search fast.
        </p>
        <p>
          Think of it like the index at the back of a book. You do not read the whole book to find where &quot;recursion&quot; appears. You look it up in the index and it tells you exactly which pages. An inverted index is that, but for your entire document corpus.
        </p>
        <p>
          At query time, you take your cleaned tokens, look each one up in the index, and get back the list of matching documents instantly. No scanning. No brute force. Just a lookup.
        </p>
        <pre><code>{`"matrix" → [doc_1, doc_4, doc_7]
"film"   → [doc_1, doc_2, doc_9]
"nolan"  → [doc_2, doc_4]`}</code></pre>
        <p>
          A query for &quot;nolan matrix&quot; looks up both terms and intersects the lists. doc_4 appears in both. That is your result. This is called boolean search. A document either contains the term or it does not. AND intersects. OR unions. Simple, fast, predictable.
        </p>
        <p>
          And the symmetry matters. The same cleaning pipeline runs on both sides. Every document goes through it once at index time. Every query goes through it at search time. Both land on the same root forms. A user types &quot;running shoes&quot;, the query becomes &quot;run&quot;, &quot;shoe&quot;. A document indexed with &quot;runner&quot; and &quot;shoes&quot; also became &quot;run&quot;, &quot;shoe&quot;. They meet. The match happens.
        </p>
        <p>
          The flaw: boolean search has no ranking. If 50 documents match &quot;nolan matrix&quot;, they all come back as equal results. There is no score, no signal for which one is actually more relevant. You either matched or you did not.
        </p>
        <p>
          When you have 5 results, that is fine. When you have 5000, it is useless. You need a way to score and rank. That is what TF-IDF was built to solve.
        </p>

        <h2>Term Frequency (TF)</h2>

      </BlogArticleLayout>
    </>
  );
}
