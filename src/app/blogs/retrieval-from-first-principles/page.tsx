import { Metadata } from 'next';
import { BlogArticleLayout } from '@/components/ui/blog-article-layout';
import { ThemeImage } from '@/components/ui/theme-image';
import { getBlogBySlug, generateBlogMetadata, generateBlogJsonLd } from '@/data/blogs-data';

export const dynamic = 'force-static';

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
        <div className="pipeline-wrapper">
          <ThemeImage
            lightSrc="/blogs/keyword-search-index-white.svg"
            darkSrc="/blogs/Keyword-search-index-black.svg"
            alt="Keyword search index build pipeline"
            className="pipeline-img"
            expandable
          />
        </div>
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

        <h3>Term Frequency (TF)</h3>
        <p>
          The inverted index tells you which documents contain your search terms. But it does not tell you which document is most relevant. Two documents both contain the word &quot;space&quot;. How do you pick the better one?
        </p>
        <p>
          The first signal is how often the term appears. A document that mentions &quot;space&quot; fifteen times is probably more about space than one that mentions it once. But you cannot just use the raw count. A longer document will naturally contain more occurrences of any term. Raw counts are biased toward longer documents.
        </p>
        <p>
          So you normalize. TF is the ratio of how many times the term appears to the total number of terms in the document. That makes it length-independent.
        </p>
        <pre><code>{`TF(term, doc) = (occurrences of term in doc) / (total terms in doc)

doc_1 (5 words):  "python is fast readable python"         → TF("python") = 2/5 = 0.40
doc_2 (6 words):  "java is verbose but runs everywhere"    → TF("python") = 0/6 = 0.0`}</code></pre>
        <p>
          doc_1 ranks higher for &quot;python&quot;. But TF alone has a problem. It cannot tell the difference between a meaningful term and a common one. A document full of the word &quot;code&quot; scores high on TF for &quot;code&quot;, but so does every other document in a programming dataset. The term carries no real signal.
        </p>

        <h3>Inverse Document Frequency (IDF)</h3>
        <p>
          IDF answers a different question. Not how often does this term appear in this document, but how rare is this term across all documents. The rarer the term, the more discriminating it is. The more common the term, the less it tells you.
        </p>
        <pre><code>{`IDF(term) = log((total_docs + 1) / (docs_containing_term + 1))

100 documents total:

"code"     → in 98 docs → ln(101/99) = 0.02  ← universal, tells you nothing
"function" → in 60 docs → ln(101/61) = 0.50  ← common, weak signal
"deadlock" → in 3 docs  → ln(101/4)  = 3.22  ← rare, strong signal`}</code></pre>
        <p>
          A term that appears in every document scores zero. It is noise. A term that appears in very few documents scores high. It is a genuine signal.
        </p>
        <p>
          The +1 in both numerator and denominator is for numerical stability, to avoid division by zero in edge cases. It is not for handling terms that were never seen. If a term is not in the index, you simply do not compute IDF for it at all.
        </p>
        <p>
          TF and IDF are never used alone. They are always multiplied together to produce a single score per term per document. That combined score is TF-IDF.
        </p>
        <pre><code>{`TF-IDF(term, doc) = TF(term, doc) × IDF(term)`}</code></pre>

        <h3>TF-IDF</h3>
        <p>
          TF and IDF solve two opposite problems.
        </p>
        <p>
          TF asks: does this document talk a lot about this word? IDF asks: is this word even worth caring about? Neither answer alone is enough. You need both to be true at the same time.
        </p>
        <p>
          That is why you multiply. A word that appears often but means nothing scores zero on IDF. A word that is rare but absent from the document scores zero on TF. TF-IDF is high only when both hold. Miss either one and the score collapses.
        </p>
        <p>
          That is the entire insight.
        </p>
        <p>
          Here is a full example. Three documents, query is &quot;python machine learning&quot;.
        </p>
        <pre><code>{`query: "python machine learning"

doc_1: "python python machine learning python deep learning model training python"
doc_2: "python web development flask django api"
doc_3: "java enterprise spring boot microservices deployment"

--- Step 1: TF ---
formula: TF = occurrences of term in doc / total terms in doc

              doc_1       doc_2       doc_3
"python"      4/10=0.40   1/6=0.17    0/6=0.0
"machine"     1/10=0.10   0/6=0.0     0/6=0.0
"learning"    2/10=0.20   0/6=0.0     0/6=0.0

--- Step 2: IDF ---
formula: IDF = ln((total_docs + 1) / (docs_containing_term + 1))

"python"   → in 2 docs → ln(4/3) = 0.29   ← common across corpus
"machine"  → in 1 doc  → ln(4/2) = 0.69   ← more specific
"learning" → in 1 doc  → ln(4/2) = 0.69   ← more specific

--- Step 3: TF-IDF ---
formula: TF-IDF = TF × IDF

              doc_1                        doc_2                doc_3
"python"      0.40 × 0.29 = 0.116         0.17 × 0.29 = 0.049  0.0
"machine"     0.10 × 0.69 = 0.069         0.0                  0.0
"learning"    0.20 × 0.69 = 0.138         0.0                  0.0

score         0.116+0.069+0.138 = 0.323   0.049                0.0

--- Final ranking ---

1. doc_1  0.323  ← talks about python AND machine learning
2. doc_2  0.049  ← only has python
3. doc_3  0.0    ← no match at all`}</code></pre>
        <p>
          doc_1 wins because it has all three query terms, and the rarer terms like &quot;machine&quot; and &quot;learning&quot; carry more weight than the common &quot;python&quot;. doc_2 matches on python but contributes nothing for the other terms. doc_3 scores zero.
        </p>
        <p>
          That is TF-IDF doing exactly what you want. Frequent, specific terms in the right document rise to the top.
        </p>
        <p>
          But TF-IDF has a flaw. And it is a quiet one.
        </p>

        <h3>BM25</h3>
        <p>
          TF-IDF works. But it breaks in three specific ways that matter in production. BM25, formally called Okapi BM25, was built to fix all three. It is what Elasticsearch, Solr, and Lucene use as their default ranking function today.
        </p>
        <p>
          The three problems: an unstable IDF, term frequency that grows without limit, and no awareness of document length. Take them one at a time.
        </p>

        <h4>Problem 1: Unstable IDF</h4>
        <p>
          Classic TF-IDF uses log(N / df) for IDF. It breaks at the edges in two ways.
        </p>
        <p>
          When a term is extremely rare, df is tiny and the score explodes. A term appearing in just one document out of a million gets an absurdly high IDF that can dominate the entire score, regardless of how the term actually contributes to relevance.
        </p>
        <p>
          When a term appears in every document, you get log(1) = 0. Fine so far. But with some implementations, very common terms produce negative IDF scores. A negative relevance score is meaningless.
        </p>
        <p>
          BM25 replaces the formula entirely.
        </p>
        <pre><code>{`BM25 IDF = log((N - df + 0.5) / (df + 0.5) + 1)

Core ratio: (N - df) / df
  Numerator   (N - df)  documents that do NOT contain the term
  Denominator (df)      documents that DO contain the term

Instead of asking "how many docs have this term",
it asks "how many docs don't have it vs how many do".
Rare terms: large numerator, high score.
Common terms: small numerator, low score.

+0.5 on both sides   Laplace smoothing, prevents division by zero
+1 at the end        guarantees IDF is always positive, no exceptions`}</code></pre>
        <p>
          Rare terms score high but not infinitely. Common terms score low but never negative. Stable across all cases.
        </p>

        <h4>Problem 2: TF Never Saturates</h4>
        <p>
          In TF-IDF, TF is linear. A document that mentions &quot;bear&quot; 100 times scores 10x higher than one that mentions it 10 times. But is it 10x more relevant? No.
        </p>
        <p>
          Consider these two documents for the query &quot;bear hunting&quot;:
        </p>
        <pre><code>{`doc_A: "bear bear bear bear bear"              → tf("bear") = 5
doc_B: "bear hunting guide for beginners"      → tf("bear") = 1

Basic TF: doc_A scores 5x higher. But doc_B is clearly more useful.`}</code></pre>
        <p>
          After a term appears enough times to establish that a document is about that concept, more occurrences add almost no new relevance signal. TF-IDF does not model this. BM25 does, through saturation.
        </p>
        <pre><code>{`BM25 TF = (tf * (k1 + 1)) / (tf + k1)

k1 controls how fast saturation kicks in. Typical value: 1.2 to 2.0

tf    Basic TF    BM25 TF (k1=1.5)
1     1           1.0
2     2           1.4
5     5           1.9
10    10          2.2
20    20          2.3

Basic TF grows forever. BM25 TF flattens toward k1+1 = 2.5.
The first few occurrences matter. After that, almost nothing.`}</code></pre>
        <svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '80%', margin: '0 auto', display: 'block', maxWidth: '560px' }}>
          <rect width="560" height="320" fill="var(--bg-primary, #0f1117)" rx="12"/>
          <line x1="60" y1="265" x2="520" y2="265" stroke="var(--border, #4b5563)" strokeWidth="1.5"/>
          <line x1="60" y1="265" x2="60" y2="25" stroke="var(--border, #4b5563)" strokeWidth="1.5"/>
          <text x="290" y="300" textAnchor="middle" fill="var(--text-muted, #9ca3af)" fontFamily="monospace" fontSize="12">Term Frequency (tf)</text>
          <text x="50" y="268" textAnchor="end" fill="var(--text-muted, #6b7280)" fontFamily="monospace" fontSize="10">0</text>
          <text x="50" y="226" textAnchor="end" fill="var(--text-muted, #6b7280)" fontFamily="monospace" fontSize="10">2</text>
          <text x="50" y="184" textAnchor="end" fill="var(--text-muted, #6b7280)" fontFamily="monospace" fontSize="10">4</text>
          <text x="50" y="142" textAnchor="end" fill="var(--text-muted, #6b7280)" fontFamily="monospace" fontSize="10">6</text>
          <text x="50" y="100" textAnchor="end" fill="var(--text-muted, #6b7280)" fontFamily="monospace" fontSize="10">8</text>
          <text x="50" y="58"  textAnchor="end" fill="var(--text-muted, #6b7280)" fontFamily="monospace" fontSize="10">10</text>
          <text x="100" y="282" textAnchor="middle" fill="var(--text-muted, #6b7280)" fontFamily="monospace" fontSize="10">1</text>
          <text x="165" y="282" textAnchor="middle" fill="var(--text-muted, #6b7280)" fontFamily="monospace" fontSize="10">2</text>
          <text x="280" y="282" textAnchor="middle" fill="var(--text-muted, #6b7280)" fontFamily="monospace" fontSize="10">5</text>
          <text x="395" y="282" textAnchor="middle" fill="var(--text-muted, #6b7280)" fontFamily="monospace" fontSize="10">10</text>
          <text x="510" y="282" textAnchor="middle" fill="var(--text-muted, #6b7280)" fontFamily="monospace" fontSize="10">20</text>
          <line x1="60" y1="226" x2="520" y2="226" stroke="#1f2937" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"/>
          <line x1="60" y1="184" x2="520" y2="184" stroke="#1f2937" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"/>
          <line x1="60" y1="142" x2="520" y2="142" stroke="#1f2937" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"/>
          <line x1="60" y1="100" x2="520" y2="100" stroke="#1f2937" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"/>
          <line x1="60" y1="58"  x2="520" y2="58"  stroke="#1f2937" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"/>
          {/* Basic TF — linear (red) */}
          <polyline points="60,265 105,223 172,160 285,55 340,30" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="345" y="28" fill="#f87171" fontFamily="monospace" fontSize="11">↑ keeps going</text>
          {/* BM25 TF — saturating (green) */}
          <polyline points="60,265 82,244 105,235 127,230 172,225 240,221 285,219 397,217 510,215" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Asymptote */}
          <line x1="60" y1="212" x2="520" y2="212" stroke="#4ade80" strokeWidth="1" strokeDasharray="5,5" opacity="0.35"/>
          <text x="524" y="216" fill="#4ade80" fontFamily="monospace" fontSize="9" opacity="0.6">k1+1</text>
          {/* Legend */}
          <rect x="310" y="60" width="185" height="60" rx="6" fill="var(--bg-secondary, #111827)" stroke="#374151" strokeWidth="1"/>
          <line x1="323" y1="80" x2="350" y2="80" stroke="#f87171" strokeWidth="2.5"/>
          <text x="358" y="84" fill="var(--text-primary, #e2e8f0)" fontFamily="monospace" fontSize="11">Basic TF (linear)</text>
          <line x1="323" y1="104" x2="350" y2="104" stroke="#4ade80" strokeWidth="2.5"/>
          <text x="358" y="108" fill="var(--text-primary, #e2e8f0)" fontFamily="monospace" fontSize="11">BM25 TF (k1=1.5)</text>
        </svg>

        <h4>Problem 3: Document Length Is Ignored</h4>
        <p>
          Longer documents naturally accumulate more term occurrences just by being long. A 2000-word article will almost always outscore a focused 200-word summary on raw TF, even if the summary is more relevant.
        </p>
        <pre><code>{`Query: "bear"

doc_A: "Boots is a silly bear wizard."
doc_B: "Ted is a wonderful human who has a stuffed bear that loves honey,
        salmon, picnics, and hanging out with other bears in the woods.
        Ted's bear is so nice to hang out with Ted all day long."

doc_B has more occurrences of "bear" — not because it is more relevant,
but because it is longer.`}</code></pre>
        <p>
          BM25 normalizes term frequency against the document&apos;s length relative to the average document length in the corpus.
        </p>
        <pre><code>{`length_norm = 1 - b + b * (doc_length / avg_doc_length)

BM25 TF (full) = (tf * (k1 + 1)) / (tf + k1 * length_norm)

b controls how aggressively length is penalized.
  b = 0   ignore length entirely
  b = 1   full normalization
  b = 0.75 (default)  partial, works well for most corpora

doc_length / avg_doc_length:
  = 1.0   average length, no change
  > 1.0   longer than average, penalized
  < 1.0   shorter than average, boosted`}</code></pre>
        <p>
          A focused short document that mentions the term twice will outscore a bloated long document that mentions it five times. That is the behaviour you want.
        </p>

        <h4>Tuning k1 and b</h4>
        <p>
          Both parameters have sensible defaults that work for most cases. But your corpus is not generic, and tuning them matters more than most people expect.
        </p>
        <p>
          k1 controls how much term repetition still counts. A low k1 means the first occurrence of a term does almost all the work. A high k1 means multiple occurrences keep adding meaningful score before the curve flattens.
        </p>
        <pre><code>{`k1 = 0.5   saturation is aggressive. First occurrence dominates.
           Good for: short documents, product titles, code identifiers,
           queries where one mention is as strong as ten.

k1 = 1.2   default. Works well for most general text corpora.

k1 = 2.0   saturation is slow. Repetition keeps contributing longer.
           Good for: long technical documents, legal text, scientific papers
           where a term recurring throughout genuinely signals relevance.`}</code></pre>
        <p>
          b controls how hard you penalize long documents. A high b means document length matters a lot. A low b means you mostly ignore it.
        </p>
        <pre><code>{`b = 0.0   length is ignored entirely. Every document competes on raw TF.
          Good for: corpora where length correlates with coverage,
          encyclopedic content, or documents of uniform length.

b = 0.75  default. Partial normalization, works well in practice.

b = 1.0   full normalization. Length is fully accounted for.
          Good for: mixed corpora with huge length variance,
          FAQs mixed with long articles, or boilerplate-heavy documents.`}</code></pre>
        <p>
          When tuning, change one parameter at a time and evaluate against real queries from your domain. The defaults are a good starting point, not an endpoint.
        </p>

        <h4>The Complete BM25 Formula</h4>
        <p>
          Put the fixed IDF and the saturating, length-normalized TF together and you get the full BM25 score:
        </p>
        <pre><code>{`BM25(doc, query) = sum for each query term qt of:
  BM25_IDF(qt) * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (doc_length / avg_doc_length)))

Steps:
1. Tokenize the query
2. For each token, compute BM25 score against each document
3. Sum the scores across all query tokens
4. Sort documents by total score, descending
5. Return top N`}</code></pre>
        <p>
          BM25 is fast, explainable, and hard to beat on exact keyword queries. Every score can be traced to specific term statistics, which matters when you need to debug why a result ranked where it did.
        </p>
        <p>
          But it is still a bag-of-words model. It matches tokens, not meaning. Search for &quot;how to fix a deadlock&quot; and a document about &quot;concurrency issues and thread contention&quot; scores zero, even if it is exactly what you needed. The tokens did not match.
        </p>
        <p>
          That is the limit of keyword search. That is where semantic search begins.
        </p>
        <div className="pipeline-wrapper">
          <ThemeImage
            lightSrc="/blogs/Keyword-searq-query-pipeline-white.svg"
            darkSrc="/blogs/keyword-search-query-pipeline-dark.svg"
            alt="Keyword search query processing pipeline"
            className="pipeline-img"
            expandable
          />
        </div>

        <h2>Semantic Search</h2>
        <p>
          Keyword search matches words. Semantic search matches meaning. That is the fundamental difference.
        </p>
        <p>
          Search for &quot;heart attack&quot; and keyword search will never find a document that says &quot;myocardial infarction&quot;. Search for &quot;how to make code run faster&quot; and it will miss a document titled &quot;performance optimization techniques&quot;. The words are different. The meaning is the same. Keyword search cannot cross that gap.
        </p>
        <p>
          Semantic search can. It handles three things that keyword search fundamentally cannot.
        </p>
        <p>
          Synonym matching. &quot;Car&quot; and &quot;automobile&quot; are different strings but the same concept. Keyword search treats them as unrelated. Semantic search knows they are the same.
        </p>
        <p>
          Conceptual queries. A user searching for &quot;movies about loneliness in space&quot; is not looking for documents that contain those exact words. They are looking for documents about that idea. Keyword search needs the exact terms. Semantic search understands the concept.
        </p>
        <p>
          Natural language. People do not search in keywords. They ask questions. &quot;Why does my database keep locking up?&quot; is a natural language query. The relevant document might talk about &quot;deadlocks&quot; and &quot;contention&quot;. Semantic search bridges that gap.
        </p>
        <p>
          The thing that makes all of this work is embeddings.
        </p>
        <p>
          An embedding is a vector. A vector is a list of numbers. That is it. You take a piece of text, pass it through a model, and you get back a list of numbers that represents the meaning of that text. Not the words. The meaning.
        </p>
        <p>
          Texts with similar meaning end up close together in this space. Texts with different meaning end up far apart.
        </p>
        <p>
          And unlike keyword search, you do not need to preprocess anything. No lowercasing, no stemming, no stopword removal, no punctuation stripping. The embedding model handles all of that internally. It is context-aware. &quot;Running a server&quot; and &quot;running in a park&quot; produce different vectors because the model understands the difference. Keyword search would treat both as the same stem.
        </p>
        <ThemeImage
          lightSrc="/blogs/embedding-space-light.svg"
          darkSrc="/blogs/embedding-space-dark.svg"
          alt="Embedding space: similar words cluster together, different words are far apart"
          style={{ width: '100%', maxWidth: '560px', margin: '1.5rem auto' }}
          expandable
        />

        <h3>Choosing an Embedding Model</h3>
        <p>
          The embedding model you pick determines how good your semantic search is. Get this wrong and nothing downstream can fix it.
        </p>
        <p>
          For most use cases, a general-purpose embedding model works fine. OpenAI and Gemini both offer embedding APIs that handle broad queries well out of the box. If you are building a standard RAG system over general text, start here.
        </p>
        <p>
          But general models have limits. They were trained on broad data, not your data. If your domain has specialized vocabulary, medical records, legal contracts, codebases, the general model will miss nuances that matter. &quot;Infarction&quot; and &quot;heart attack&quot; might not land as close as they should. Domain-specific terms get blurred.
        </p>
        <p>
          This is where fine-tuning or training your own embedding model pays off. Cursor did exactly this for code search. They trained a custom embedding model specifically for semantic code retrieval, and it made a measurable difference. You can read about their approach at <a href="https://cursor.com/blog/semsearch" target="_blank" rel="noopener noreferrer">cursor.com/blog/semsearch</a>.
        </p>
        <p>
          If you want to explore open-source embedding models, the <a href="https://huggingface.co/spaces/mteb/leaderboard" target="_blank" rel="noopener noreferrer">MTEB leaderboard</a> on HuggingFace ranks them across retrieval benchmarks. Pick one that scores well on tasks similar to yours.
        </p>
        <p>
          One rule that is non-negotiable: the same embedding model must be used for both indexing and querying. If you embed your documents with model A and your queries with model B, the vector spaces will not align. The distances will be meaningless. Your results will be garbage and you will not get an error telling you why.
        </p>
        <p>
          Also check what similarity metric your model was trained for. Most modern models are trained for cosine similarity. Some use dot product. If the model was optimized for cosine and you run dot product at query time, the rankings shift. Match the metric to the model.
        </p>
        <blockquote>
          Note: this is one of those silent failures. The system runs, results come back, no error anywhere. But the rankings are wrong because the metric does not match what the model was trained for. You will spend hours debugging retrieval quality before you think to check this.
        </blockquote>

        <h3>Cosine Similarity</h3>
        <p>
          Cosine similarity measures the angle between two vectors. It does not care about length. Two vectors pointing in the same direction score 1, no matter how long or short they are. Two vectors at right angles score 0. Opposite directions score -1.
        </p>
        <p>
          This makes it useful when you care purely about meaning. A short document and a long document about the same topic will have vectors pointing in the same direction. Cosine treats them equally.
        </p>
        <pre><code>{`cosine_similarity(A, B) = (A . B) / (|A| * |B|)

Range: -1 to 1
  1  = identical direction
  0  = perpendicular (unrelated)
 -1  = opposite direction`}</code></pre>
        <ThemeImage
          lightSrc="/blogs/cosine-similarity-light.svg"
          darkSrc="/blogs/cosine-similarity-dark.svg"
          alt="Cosine similarity: measures angle between vectors, ignores magnitude"
          style={{ width: '100%', maxWidth: '400px', margin: '1.5rem auto' }}
          expandable
        />

        <h3>Dot Product</h3>
        <p>
          Dot product cares about both direction and magnitude. Two vectors pointing the same way score high, but a longer vector scores even higher. It rewards not just similar meaning, but confidence in that meaning.
        </p>
        <p>
          If your embedding model produces vectors where magnitude encodes importance or confidence, dot product captures that signal. Cosine throws it away.
        </p>
        <pre><code>{`dot_product(A, B) = A1*B1 + A2*B2 + ... + An*Bn

No fixed range. Scales with vector magnitude.
Same direction + longer vectors = higher score.`}</code></pre>
        <ThemeImage
          lightSrc="/blogs/dot-product-light.svg"
          darkSrc="/blogs/dot-product-dark.svg"
          alt="Dot product: measures both direction and magnitude of vectors"
          style={{ width: '100%', maxWidth: '400px', margin: '1.5rem auto' }}
          expandable
        />

        <h3>Which One to Use</h3>
        <p>
          For most RAG systems, cosine similarity is the right default. You care about whether two texts mean the same thing, not how long or detailed they are. Cosine normalizes that away.
        </p>
        <p>
          Use dot product when magnitude carries signal. Some models encode confidence or specificity in the vector length. A longer vector means the model is more certain about the meaning. In that case, you want magnitude to influence the score. Dot product preserves it. Cosine discards it.
        </p>
        <p>
          In practice, check the model card. If it says cosine, use cosine. If it says inner product or dot product, use that. Do not mix them. The model was trained to optimize for one, and using the other will shift your rankings in ways that are hard to debug.
        </p>

        <h3>How Semantic Search Works</h3>
        <p>
          The pipeline has two phases. Indexing happens once. Search happens on every query.
        </p>
        <pre><code>{`Indexing (once):
1. Take each document
2. Convert it to a vector using your embedding model
3. Store the vector in a vector store

Search (per query):
1. Convert the user query to a vector using the same model
2. Compare the query vector against all stored vectors
3. Rank by similarity score
4. Return the top results`}</code></pre>
        <p>
          That is it. No text preprocessing, no inverted index, no BM25 scoring. You embed, you compare, you rank.
        </p>
        <p>
          But this only works at small scale. Comparing the query vector against every stored vector one by one is O(n). With a million documents, that is a million comparisons per query. It does not scale.
        </p>

        <h3>Vector Databases</h3>
        <p>
          Looping through a list of embeddings works for a demo. At a million documents, it does not. You need a database built for vectors.
        </p>
        <p>
          The key difference is indexing. Instead of comparing every vector, the database pre-organizes them so it only checks a small subset. The details of how these indexes work are beyond the scope of this post, but the tradeoff is simple: you might miss the absolute nearest neighbor, but you get very close ones in milliseconds instead of seconds.
        </p>

        <h3>Chunking</h3>
        <p>
          With keyword search, you index entire documents. With semantic search, you cannot. An embedding model compresses text into a fixed-size vector. The longer the text, the more meaning gets averaged together, and the less precise the vector becomes.
        </p>
        <p>
          A long technical document covers architecture decisions, deployment steps, error handling, and performance benchmarks. If you embed all of that as one vector, a query about &quot;how to handle timeout errors&quot; matches weakly because the vector represents everything at once. The specific signal gets diluted.
        </p>
        <p>
          Chunking fixes this. You split the document into smaller pieces and embed each piece separately. A query about box office hits the chunk that actually talks about box office, not the chunk about the cast.
        </p>

        <h4>Fixed-Size Chunking</h4>
        <p>
          The simplest approach. Split text every N words or N tokens. Predictable sizes, simple to implement, easy to control token limits. But it is dumb. It splits in the middle of sentences, in the middle of thoughts.
        </p>

        <h4>Chunk Overlap</h4>
        <p>
          Fixed-size chunking breaks context at boundaries. Consider this text:
        </p>
        <pre><code>{`"the bear attack was terrifying. The stunning special effects led to record breaking sales."

Without overlap:
  chunk 1: "the bear attack was"
  chunk 2: "terrifying. The stunning special effects led"
  chunk 3: "to record breaking sales."

What was terrifying? What had record breaking sales? Context is lost.

With overlap:
  chunk 1: "the bear attack was terrifying."
  chunk 2: "terrifying. The stunning special effects led to record breaking sales."

Now each chunk carries enough context to make sense on its own.`}</code></pre>
        <p>
          How much overlap? There is no universal answer. Make it configurable and test on your data.
        </p>

        <h4>Semantic Chunking</h4>
        <p>
          Even with overlap, word-based splitting cuts at arbitrary positions. &quot;Ted explores themes&quot; gets separated from &quot;of friendship and growing up&quot;. The author&apos;s intended meaning is split across chunks.
        </p>
        <p>
          Semantic chunking respects natural language structure. Instead of splitting at word counts, you split at sentence or paragraph boundaries. Each chunk contains a complete thought as the author organized it.
        </p>
        <pre><code>{`Word-based:
  "Ted explores themes"
  "of friendship and growing up"
  "growing up while John must"

Semantic:
  "Ted is a 2012 comedy film directed by Seth MacFarlane."
  "The story follows John Bennett and his magical teddy bear."
  "The film explores themes of friendship and growing up."`}</code></pre>

        <h4>The Edge Cases</h4>
        <p>
          Chunking seems straightforward until you point it at real data. Then you spend a week fixing things you did not expect to break.
        </p>
        <p>
          The first thing you notice with PDFs is the headers and footers. Every single page has the same company name, the same page number, the same disclaimer. And all of it ends up in your chunks. So you start looking for commonalities across pages and stripping them out. That helps, until you hit a document with two-column layouts. The text extractor reads straight across both columns and merges them into one garbled paragraph. You fix that, and then you find tables where the rows and columns got flattened into a single line of text that makes no sense at all. Then the font encoding breaks and half your text is random symbols.
        </p>
        <p>
          Markdown and HTML have their own version of this. You chunk a technical doc and suddenly a code block is split in half across two chunks. Bullet points that made sense as a list now live in separate chunks with no connection to each other. A long quote lands in one chunk while the sentence that says who said it lands in the next one.
        </p>
        <p>
          There is no library that handles all of this for you. You chunk your data, you look at what came out, and you fix what broke. Then you chunk again. The way you get reliable chunks is by manually inspecting the output over and over until it stops surprising you.
        </p>

        <h3>Contextual Retrieval</h3>
        <p>
          You spend all that effort getting your chunks clean. You fix the PDFs, you handle the edge cases, you get the boundaries right. And then you realize there is another problem you did not see coming.
        </p>
        <p>
          When you break a document into pieces, each piece loses the context of the whole. A chunk that says &quot;revenue grew by 3% over the previous quarter&quot; is perfectly clean. But it does not say which company. It does not say which quarter. Someone queries for &quot;ACME Corp Q2 2023 revenue&quot; and this chunk does not match, even though it is exactly the right answer. The information is there. The context is not.
        </p>
        <p>
          You start noticing this everywhere. A chunk says &quot;the API returns a 429 status code&quot; but does not mention which service. A chunk says &quot;latency increased by 40ms&quot; but does not say which endpoint or when. Every chunk is a sentence ripped out of a conversation. It makes sense if you read the whole document. It makes no sense on its own.
        </p>
        <p>
          Anthropic published a solution for this called <a href="https://www.anthropic.com/engineering/contextual-retrieval" target="_blank" rel="noopener noreferrer">Contextual Retrieval</a>. The idea is simple: before you embed a chunk, pass it to an LLM along with the full document and ask for a short context that situates the chunk. Then prepend that context to the chunk before embedding.
        </p>
        <pre><code>{`Before:
  "Revenue grew by 3% over the previous quarter."

After:
  "This chunk is from ACME Corp's Q2 2023 SEC filing.
   Previous quarter revenue was $314 million.
   Revenue grew by 3% over the previous quarter."`}</code></pre>
        <p>
          Now the chunk carries enough information to match the right queries. The embedding captures not just what the text says, but what it is about.
        </p>
        <p>
          Anthropic tested this across codebases, scientific papers, and financial filings. Contextual embeddings alone reduced retrieval failures by 35%. Combining contextual embeddings with contextual BM25 reduced failures by 49%. Add reranking on top and failures dropped by 67%. Each layer fixes what the previous one missed.
        </p>
        <p>
          The cost is a one-time preprocessing step. You run it once when you index your documents. After that, the chunks carry their context forever.
        </p>
        <p>
          If you are building a RAG system today and want a solid starting point, this is it. Contextual retrieval with hybrid search gives you the best of both keyword and semantic, with the context problem already handled. Start here and optimize from this baseline.
        </p>

        <h3>ColBERT</h3>
        <p>
          There is another approach to the chunking problem that takes a completely different angle. Instead of creating one embedding per chunk, what if you created one embedding per word?
        </p>
        <p>
          That is what <a href="https://arxiv.org/pdf/2004.12832" target="_blank" rel="noopener noreferrer">ColBERT</a> does. Every token in the text gets its own contextualized embedding. The word &quot;bank&quot; in &quot;river bank&quot; gets a different vector than &quot;bank&quot; in &quot;bank account&quot; because the surrounding words shape each embedding individually.
        </p>
        <p>
          This is called multi-vector retrieval. Instead of compressing an entire chunk into one vector and losing detail, you keep the full granularity. When a query comes in, each query token is matched against each document token, and the best matches are aggregated into a final score.
        </p>
        <p>
          The tradeoff is straightforward: storage and compute. A single chunk that used to be one vector is now hundreds of vectors. Multiply that across your entire corpus and the storage cost grows fast. Search gets more expensive too because you are comparing token-level vectors instead of chunk-level ones.
        </p>
        <p>
          I have not used ColBERT in production myself. But it is worth knowing about because it solves a real problem, the loss of precision when you compress meaning into a single vector, in a fundamentally different way than chunking strategies do.
        </p>

        <h3>Late Chunking</h3>
        <p>
          There is yet another way to think about the chunking problem. With normal chunking, you split the text first, then embed each chunk separately. Each chunk has no idea what the other chunks say. The context is gone before the embedding model ever sees it.
        </p>
        <p>
          Late chunking flips the order. You pass the entire document through the embedding model first. The model processes all the tokens at once, so every token gets a vector that is informed by the full document context. Then you chunk the token-level vectors after the fact and pool each chunk into a single embedding.
        </p>
        <p>
          That is why it is called late chunking. The chunking happens late, after the model has already seen everything.
        </p>
        <p>
          The difference matters. In normal chunking, a sentence that says &quot;the city has 3.85 million inhabitants&quot; gets embedded without knowing that &quot;the city&quot; refers to Berlin, because that was mentioned three chunks ago. In late chunking, the model already processed the full document, so the vector for &quot;the city&quot; carries the Berlin context with it.
        </p>
        <p>
          The catch: you need a long-context embedding model that can handle the full document in one pass. If your document is 50,000 tokens and your model caps at 8,192, you cannot do late chunking on the whole thing. You can read more about this approach at <a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/" target="_blank" rel="noopener noreferrer">Jina AI&apos;s writeup on late chunking</a>.
        </p>

        <h2>Hybrid Search</h2>
        <p>
          By now you have seen what keyword search is good at and where it fails. And you have seen the same for semantic search. They fail in opposite ways. Keyword search misses meaning. Semantic search misses exact terms. No single approach wins on every query.
        </p>
        <p>
          So you run both. That is hybrid search. You take the same query, run BM25 against your inverted index, and run a vector similarity search against your embeddings. You get two separate ranked lists of results. Then you merge them into one.
        </p>
        <p>
          From here the game changes. You have results from both systems. BM25 scores and semantic scores on completely different scales. The job is to bring them to the same scale, rerank the combined list to get the best documents to the top, and pass those to the LLM. That is the rest of the pipeline.
        </p>

        <h3>Score Normalization</h3>
        <p>
          You cannot compare these scores directly. BM25 gives you numbers anywhere from 0 to 100 or higher. Cosine similarity gives you 0 to 1. A BM25 score of 12 and a cosine score of 0.85 mean nothing next to each other. You need them on the same scale first.
        </p>
        <p>
          The simplest way to do this is min-max normalization. Take the list of scores from each system, find the lowest and highest, and rescale everything to sit between 0 and 1. The lowest score becomes 0, the highest becomes 1, and everything else falls proportionally in between.
        </p>
        <pre><code>{`normalized = (score - min_score) / (max_score - min_score)`}</code></pre>
        <p>
          Now both systems speak the same language. Every score is between 0 and 1.
        </p>

        <h3>Weighted Combination</h3>
        <p>
          Normalization puts both scores on the same scale. But you still have two separate scores per document. You need one final score to sort by. And you probably do not want to treat both systems equally for every query. Some queries are better served by keyword search, some by semantic. You need a way to control that balance. That is what the weighted combination does.
        </p>
        <pre><code>{`hybrid_score = alpha * bm25_score + (1 - alpha) * semantic_score`}</code></pre>
        <p>
          Alpha is a dial. Turn it all the way to 1 and you are doing pure keyword search. Turn it to 0 and you are doing pure semantic search. Anywhere in between is a blend.
        </p>
        <pre><code>{`alpha = 1.0   100% keyword, 0% semantic
alpha = 0.7   70% keyword, 30% semantic
alpha = 0.5   50/50 split
alpha = 0.2   20% keyword, 80% semantic
alpha = 0.0   0% keyword, 100% semantic`}</code></pre>
        <p>
          The right alpha depends on what your users are searching for. Someone typing &quot;The Revenant&quot; is looking for an exact title. Keyword should dominate. Alpha 0.8. Someone typing &quot;feel good family movies&quot; is searching by meaning. Semantic should dominate. Alpha 0.2. Someone typing &quot;2015 comedies&quot; needs both the year as a keyword and the concept of comedy. Alpha 0.5.
        </p>
        <p>
          There is no universal right answer. Build your system so alpha is configurable, test it against real queries from your users, and tune from there.
        </p>
        <p>
          But weighted combination has a flaw. Here is where it breaks.
        </p>
        <pre><code>{`Query: "python asyncio tutorial"

BM25 scores:                    Semantic scores:
  doc_A: 45.2                     doc_A: 0.92
  doc_B: 44.8                     doc_C: 0.85
  doc_C: 44.1                     doc_B: 0.41
  doc_D: 41.0                     doc_D: 0.38

After min-max normalization (0 to 1):

BM25 normalized:                Semantic normalized:
  doc_A: 1.00                     doc_A: 1.00
  doc_B: 0.90                     doc_C: 0.87
  doc_C: 0.74                     doc_B: 0.06
  doc_D: 0.00                     doc_D: 0.00

Weighted combination (alpha = 0.5):
  doc_A: 0.5 * 1.00 + 0.5 * 1.00 = 1.00
  doc_B: 0.5 * 0.90 + 0.5 * 0.06 = 0.48
  doc_C: 0.5 * 0.74 + 0.5 * 0.87 = 0.81
  doc_D: 0.5 * 0.00 + 0.5 * 0.00 = 0.00

Final ranking: doc_A, doc_C, doc_B, doc_D`}</code></pre>
        <p>
          Look at doc_B. In BM25, it scored 44.8, barely behind doc_A at 45.2. Almost identical. But after normalization, that tiny gap of 0.4 became a gap of 0.10. And semantic gave doc_B a 0.41, which normalized to 0.06, almost zero. So a document that was genuinely relevant by keyword match got crushed because normalization turned small score differences into large ones. The weighted combination punished doc_B for something the raw scores never said.
        </p>
        <p>
          This is the fundamental problem. Min-max normalization is sensitive to the distribution of scores. When one system returns tightly clustered scores and the other returns spread out ones, the blending gets distorted. Your rankings end up shaped by the math, not by relevance.
        </p>

        <h3>Reciprocal Rank Fusion (RRF)</h3>
        <p>
          RRF sidesteps the problem entirely. It throws away the scores and uses only the ranks. It does not matter what the BM25 score was or what the cosine similarity was. All that matters is: where did each document land in each list?
        </p>
        <pre><code>{`RRF score = sum of 1 / (k + rank) for each system

k is a constant (typically 60)

Example: document X ranks #2 in BM25 and #5 in semantic
  RRF = 1/(60+2) + 1/(60+5) = 0.016 + 0.015 = 0.031

Document Y ranks #1 in BM25 but absent from semantic
  RRF = 1/(60+1) + 0 = 0.016

X wins because it showed up in both lists.`}</code></pre>
        <p>
          No normalization needed. No alpha to tune. Documents that rank well in both systems rise to the top naturally.
        </p>
        <p>
          The k parameter controls how steeply the ranking drops off. A lower k like 20 gives much more weight to the top-ranked results and almost nothing to the rest. A higher k like 100 flattens the curve, so lower-ranked results still have meaningful influence. The default of 60 is a reasonable middle ground for most use cases.
        </p>

        <h3>Query Enhancement</h3>
        <p>
          Everything so far assumes the user typed a good query. They usually did not. People misspell words, write vague questions, and leave out context that would make the search work better. The retrieval pipeline can only find what the query asks for. If the query is bad, the results are bad.
        </p>
        <p>
          You can fix this before the search even runs. Pass the raw query through an LLM first. Let it fix typos, expand abbreviations, break apart complex questions into simpler ones, and add missing context. Then search with the cleaned-up version instead of the original.
        </p>
        <p>
          The user types &quot;how do i fix timout erors in my api&quot;. The LLM rewrites it to &quot;how to fix timeout errors in REST API requests&quot;. Now the search has the right spelling, the right terminology, and enough specificity to return useful results.
        </p>
        <p>
          It is a small step that makes everything downstream work better. The retrieval does not get smarter. The query just stops being the bottleneck.
        </p>
        <div className="pipeline-wrapper">
          <ThemeImage
            lightSrc="/blogs/semantic-search-pipeline-white.svg"
            darkSrc="/blogs/semantic-search-pipeline-dark.svg"
            alt="Semantic search pipeline"
            className="pipeline-img"
            expandable
          />
        </div>

        <h2>Reranking</h2>
        <p>
          A search might return 50 or 100 documents. The user cares about the top 5 to 10. Getting those right is what matters.
        </p>
        <p>
          Reranking does something that neither BM25 nor vector search can. It looks at the query and the full document together at the same time. BM25 matches keywords without understanding the query. Vector search compares pre-computed embeddings without seeing the actual text. Reranking sees both, side by side, and scores relevance based on that full picture.
        </p>
        <p>
          That is why it is more accurate. It is also why it is slow. You cannot pre-compute anything. Every query-document pair has to be scored from scratch. You cannot afford to run this on your entire corpus.
        </p>
        <p>
          So you do not. You use BM25 and vector search to quickly eliminate the majority of documents and get a rough top 50 to 100. Then you run the expensive reranker only on those candidates. Fast retrieval first, precise reranking second.
        </p>
        <p>
          You can make this faster. Instead of scoring each document individually against the query in separate LLM calls, you batch them. Pass all the candidate documents to the LLM in one call and ask it to rank them together.
        </p>
        <p>
          This is better for two reasons. Speed and cost, obviously. You are not re-sending the system prompt and query for every single document. But the bigger win is quality. When the LLM scores documents one at a time, each score is independent. It picks a number on some arbitrary scale with no reference point. When it sees all the documents together, it compares them against each other in the same context. The ranking is relative, which is what you actually want.
        </p>

        <h3>Cross-Encoder Reranking</h3>
        <p>
          There is a faster alternative to using an LLM for reranking. A cross-encoder.
        </p>
        <p>
          The embeddings we used for semantic search came from a bi-encoder. It embeds the query and the document separately, then you compare them with cosine similarity. A cross-encoder does something different. It takes the query and the document together as a single input and outputs a relevance score directly. No separate embeddings, no cosine similarity. Just one number.
        </p>
        <p>
          Because the cross-encoder sees the query and document side by side in the same pass, it catches subtle relationships that bi-encoders miss. It understands how the query interacts with the document, not just how similar their embeddings are.
        </p>
        <p>
          The big advantage over LLM reranking is speed. A cross-encoder is a small regression model. It does one thing: take a query-document pair, output a score. No generation, no chain of thought, no token-by-token output. It is much faster and cheaper than calling an LLM.
        </p>
        <p>
          The other advantage is that you can fine-tune it on your own data. Train it on query-document pairs from your domain, and it learns the exact relevance patterns your users care about. That is harder and more expensive to do with an LLM. You can explore pre-trained cross-encoders and how to use them at <a href="https://sbert.net/examples/cross_encoder/applications/README.html" target="_blank" rel="noopener noreferrer">sbert.net</a>.
        </p>

        <h2>Evaluation</h2>
        <p>
          This is the most important part of your retrieval pipeline. Everything else you have built so far, the chunking, the embeddings, the hybrid search, the reranking, all of it is guesswork until you measure it.
        </p>
        <p>
          Evaluation is the knob. It is what tells you whether your chunk size is right. Whether your chunk overlap is too small. Whether your alpha is wrong. Whether the reranker is making things better or worse. Without evaluation, you are tuning blind.
        </p>
        <p>
          And the quality of your evaluation depends entirely on the quality of your dataset. A golden dataset of queries paired with their expected results. The better the dataset, the more you can trust the numbers. The more you can trust the numbers, the more confidently you can change things. Spend time here. Build the dataset carefully. It is the foundation everything else sits on.
        </p>
        <p>
          Three metrics matter.
        </p>

        <h3>Precision</h3>
        <p>
          Your system returns 10 documents for a query. You compare them against your golden dataset. 7 of the 10 are actually relevant. Precision is 7 out of 10. That is 0.7.
        </p>
        <pre><code>{`precision = relevant_retrieved / total_retrieved`}</code></pre>
        <p>
          In practice you measure this as Precision@K, where K is the number of results the user actually sees. If your UI shows the top 5, you care about Precision@5. The documents beyond that do not matter because nobody looks at them.
        </p>

        <h3>Recall</h3>
        <p>
          Precision asks how much of what you returned is relevant. Recall asks a different question. How much of what is relevant did you actually find?
        </p>
        <pre><code>{`recall = relevant_retrieved / total_relevant`}</code></pre>
        <p>
          Say there are 20 relevant documents in your corpus for a query. Your system retrieved 8 of them. Recall is 8 out of 20. That is 0.4. You found less than half of what was there.
        </p>
        <p>
          This matters more than most people think. If your pipeline does not retrieve the relevant documents in the first stage, nothing downstream can save you. Your reranker cannot rerank documents it never received. In medical, legal, and safety applications, missing relevant information is not just bad UX. It has consequences.
        </p>
        <p>
          I always optimize for recall first. If the pipeline is not surfacing all the relevant documents, that is the bigger problem. Precision you can improve later with reranking. Missing documents you cannot fix after the fact.
        </p>

        <h3>The Tradeoff</h3>
        <p>
          Higher recall usually means lower precision. You retrieve more documents to make sure you do not miss anything, but that means more irrelevant ones slip in. Tighten precision and you start dropping relevant results. They pull in opposite directions.
        </p>
        <p>
          The right balance is a product question as much as a technical one. What is worse for your users, seeing some irrelevant results or missing the answer entirely?
        </p>

        <h3>F1 Score</h3>
        <p>
          When you need a single number that captures both precision and recall, you use F1. It is the harmonic mean of the two.
        </p>
        <pre><code>{`f1 = 2 * (precision * recall) / (precision + recall)`}</code></pre>
        <p>
          F1 punishes imbalance. A system with 0.95 precision and 0.10 recall gets an F1 of 0.18. It looks great on precision but it is barely finding anything. F1 exposes that. A system with 0.70 precision and 0.70 recall gets an F1 of 0.70. Balanced and honest.
        </p>
        <p>
          Use F1 when precision and recall matter equally. Use it when you want to compare different pipeline configurations against each other with one number. But if one metric matters more than the other for your use case, optimize for that directly instead of hiding behind an average.
        </p>

        <h3>Error Analysis</h3>
        <p>
          Metrics tell you something is wrong. They do not tell you where. When a query returns bad results, you need to trace it through the entire pipeline and find exactly where it broke.
        </p>
        <p>
          Did the preprocessing strip something it should not have? Did query rewriting change the meaning? Did keyword search miss it? Did semantic search rank it low? Did the reranker push it down? The failure could be at any stage, and each stage has different fixes.
        </p>
        <p>
          Add debug logging at every step. Make it optional so it does not slow things down in production, but make sure you can turn it on and see what each stage received, what it returned, and what got dropped. When something goes wrong, that trail is how you find it.
        </p>

        <h2>Overall Architecture</h2>
        <div className="pipeline-wrapper">
          <ThemeImage
            lightSrc="/blogs/overall-pipeline-white.svg"
            darkSrc="/blogs/overall-pipline-dark.svg"
            alt="Overall retrieval pipeline architecture"
            className="pipeline-img"
            expandable
          />
        </div>

        <h2>Conclusion</h2>
        <p>
          Every retrieval algorithm exists because the previous one had a flaw.
        </p>
        <p>
          If you are starting from scratch, start with BM25 for keyword search and contextual retrieval for semantic search. That is a strong baseline. From there, spend time building a good evaluation dataset. Give recall more weight than precision. The documents your pipeline misses are the ones that hurt you, and no amount of reranking can fix what was never retrieved.
        </p>
        <p>
          Good evals are the only way to make your pipeline better. They are the knob you turn. Without them, every change is a guess.
        </p>
        <p>
          That is the full arc. Each layer exists for a reason. If you understand the reason, you know when to use it and when to skip it.
        </p>
        <p>
          The bare-metal implementation of everything covered here is at <a href="https://github.com/gokuljs/DeepRAG" target="_blank" rel="noopener noreferrer">DeepRAG</a>. Read the code. Trace the trail.
        </p>

      </BlogArticleLayout>
    </>
  );
}
