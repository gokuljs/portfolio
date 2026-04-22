import { Metadata } from 'next';
import { BlogArticleLayout } from '@/components/ui/blog-article-layout';
import { getBlogBySlug, generateBlogMetadata, generateBlogJsonLd } from '@/data/blogs-data';

export const dynamic = 'force-static';

const slug = 'raft-consensus-algorithm';
const blog = getBlogBySlug(slug)!;
const jsonLd = generateBlogJsonLd(slug)!;

export const metadata: Metadata = generateBlogMetadata(slug);

export default function RaftConsensusAlgorithmPage() {
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
          I was looking at the Raft consensus algorithm. Why it exists, why it is so important in distributed systems. The reason is it purely solves this one problem: how do multiple machines agree on the same data, even when some of them fail?
        </p>
        <p>
          The mental model is simple. Say me and a group of friends are going out for dinner. One person decides which restaurant to go to, and the rest of them agree. That is consensus. One person leads, everyone else follows. If that person disappears, someone else steps up and decides. The group keeps moving as long as enough people are around to agree.
        </p>
        <p>
          Same idea for machines. When you distribute data across multiple servers, it is all about agreement. Who to follow, what the current state is, and making sure everyone has the same data. That is the entire game. Raft is the protocol that makes this work.
        </p>
        <p>
          If you want to go deep, read the original paper: <a href="https://raft.github.io/raft.pdf" target="_blank" rel="noopener noreferrer">In Search of an Understandable Consensus Algorithm</a>. This is just simplefied version.
        </p>

      </BlogArticleLayout>
    </>
  );
}
