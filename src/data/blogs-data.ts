export interface Blog {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date string for sorting
  readTime?: string;
  tags?: string[];
}

export const blogsData: Blog[] = [];

// Helper function to get blogs sorted by date (newest first)
export const getSortedBlogs = (): Blog[] => {
  return [...blogsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Helper function to get a single blog by slug
export const getBlogBySlug = (slug: string): Blog | undefined => {
  return blogsData.find((blog) => blog.slug === slug);
};
