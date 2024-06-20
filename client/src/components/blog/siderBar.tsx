import React from 'react';

interface Category {
  name: string;
  slug: string;
}

interface SidebarProps {
  categories: Category[];
}

const Sidebar: React.FC<SidebarProps> = ({ categories }) => {
  return (
    <div className="bg-gray-100 p-4 rounded">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.slug} className="mb-2">
            <a
              href={`/category/${category.slug}`}
              className="text-blue-500 hover:underline"
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
