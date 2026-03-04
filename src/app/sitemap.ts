import { MetadataRoute } from 'next';
import { getSortedBlogs } from '@/data/blogs-data';

const BASE_URL = 'https://gokuljs.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/experience`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = getSortedBlogs('desc').map((blog) => ({
    url: `${BASE_URL}/blogs/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes];
}
