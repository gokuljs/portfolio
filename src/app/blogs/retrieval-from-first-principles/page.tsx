import { Metadata } from 'next';
import { BlogArticleLayout } from '@/components/ui/blog-article-layout';
import { ThemeImage } from '@/components/ui/theme-image';
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
        <ThemeImage
          lightSrc="/blogs/embedding-space-light.svg"
          darkSrc="/blogs/embedding-space-dark.svg"
          alt="Embedding space: similar words cluster together, different words are far apart"
          style={{ maxWidth: '560px', margin: '1.5rem auto' }}
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
          Also check what similarity metric your model was trained for. Most modern models are trained for cosine similarity. Some use dot product or euclidean distance. If the model was optimized for cosine and you run dot product at query time, the rankings shift. Match the metric to the model.
        </p>

      </BlogArticleLayout>
    </>
  );
}
