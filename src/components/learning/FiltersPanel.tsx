import React, { useState } from 'react';

interface FiltersPanelProps {
  onFiltersChange?: (filters: {
    category: string;
    price: string;
    sortBy: string;
  }) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ onFiltersChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('paid');
  const [selectedSort, setSelectedSort] = useState('newest');

  const categories = [
    { name: 'Governance', count: 12 },
    { name: 'Digital tools', count: 8 },
    { name: 'Finance', count: 5 },
    { name: 'Accessibility', count: 6 },
    { name: 'Leadership', count: 7 },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'a-z', label: 'A-Z' },
    { value: 'z-a', label: 'Z-A' },
    { value: 'most-popular', label: 'Most Popular' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.name} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.name.toLowerCase()}
                checked={selectedCategory === category.name.toLowerCase()}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  onFiltersChange?.({
                    category: e.target.value,
                    price: selectedPrice,
                    sortBy: selectedSort,
                  });
                }}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">
                {category.name} ({category.count})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Price</h4>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="price"
              value="free"
              checked={selectedPrice === 'free'}
              onChange={(e) => {
                setSelectedPrice(e.target.value);
                onFiltersChange?.({
                  category: selectedCategory,
                  price: e.target.value,
                  sortBy: selectedSort,
                });
              }}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-700">Free</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="price"
              value="paid"
              checked={selectedPrice === 'paid'}
              onChange={(e) => {
                setSelectedPrice(e.target.value);
                onFiltersChange?.({
                  category: selectedCategory,
                  price: e.target.value,
                  sortBy: selectedSort,
                });
              }}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-700">Paid</span>
          </label>
        </div>
      </div>

      {/* Sort By Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Sort by</h4>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={selectedSort === option.value}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  onFiltersChange?.({
                    category: selectedCategory,
                    price: selectedPrice,
                    sortBy: e.target.value,
                  });
                }}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;