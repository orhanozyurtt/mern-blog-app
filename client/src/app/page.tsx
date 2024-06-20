import React from 'react';
import Sidebar from '@/components/blog/siderBar';
import BlogList from '@/components/blog/blogList';

interface Category {
  name: string;
  slug: string;
}

interface Blog {
  title: string;
  excerpt: string;
}

const Home: React.FC = () => {
  const categories: Category[] = [
    { name: 'Technology', slug: 'technology' },
    { name: 'Health', slug: 'health' },
    { name: 'Travel', slug: 'travel' },
  ];

  const blogs: Blog[] = [
    { title: 'First Blog', excerpt: 'This is the excerpt for the first blog.' },
    {
      title: 'Second Blog',
      excerpt: 'This is the excerpt for the second blog.',
    },
    { title: 'Third Blog', excerpt: 'This is the excerpt for the third blog.' },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-4 gap-4">
        <aside className="col-span-1">
          <Sidebar categories={categories} />
        </aside>
        <main className="col-span-3">
          <h1 className="text-3xl font-bold mb-4">Blog List</h1>
          <BlogList blogs={blogs} />
        </main>
      </div>
    </div>
  );
};

export default Home;
