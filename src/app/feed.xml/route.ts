import { blogsData } from '@/data/blogs-data';

const BASE_URL = 'https://gokuljs.com';

export const dynamic = 'force-static';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const sorted = [...blogsData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const items = sorted
    .map((blog) => {
      const url = `${BASE_URL}/blogs/${blog.slug}`;
      const pubDate = new Date(blog.date).toUTCString();
      const categories = (blog.tags ?? [])
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join('\n        ');

      return `
    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(blog.description)}</description>
      <pubDate>${pubDate}</pubDate>
      ${categories}
      ${blog.image ? `<enclosure url="${BASE_URL}${blog.image}" type="image/png" />` : ''}
    </item>`;
    })
    .join('');

  const lastBuildDate = sorted[0]
    ? new Date(sorted[0].date).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Gokul JS — Blog</title>
    <link>${BASE_URL}/blogs</link>
    <description>Articles on real-time AI systems, voice agents, LLMs, and software engineering by Gokul JS — ex-YC founding engineer.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
