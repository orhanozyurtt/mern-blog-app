import React from 'react';

interface Blog {
  title: string;
  excerpt: string;
}

interface BlogListProps {
  blogs: Blog[];
}

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
  return (
    <div className="space-y-4">
      {blogs.map((blog, index) => (
        <div key={index} className="p-4 border-b border-gray-200">
          <h3 className="text-2xl font-bold">{blog.title}</h3>
          <p>{blog.excerpt}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
