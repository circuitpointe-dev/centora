import React, { useState } from 'react';
import { Search, ThumbsUp, MessageCircle, Plus } from 'lucide-react';
import CreatePostModal from './CreatePostModal';

interface DiscussionPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: 'instructor' | 'student';
  };
  topic: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

interface DiscussionTabProps {
  courseId?: string;
}

const DiscussionTab: React.FC<DiscussionTabProps> = ({ courseId = '1' }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'new' | 'my-posts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Mock discussion posts data based on the image
  const posts: DiscussionPost[] = [
    {
      id: '1',
      author: {
        name: 'Leslie Alex',
        avatar: '/placeholder-instructor.jpg',
        role: 'instructor'
      },
      topic: 'Accessibility in E-learning',
      content: 'What are your thoughts on accessibility principles and how can we enhance e-learning environments?',
      timestamp: '3 hours ago',
      likes: 15,
      comments: 2,
      isLiked: false
    },
    {
      id: '2',
      author: {
        name: 'Max well',
        avatar: '/placeholder-student.jpg',
        role: 'student'
      },
      topic: 'Inclusive Design in Online Learning',
      content: 'What are your views on accessibility strategies and how can we improve online learning platforms?',
      timestamp: '3 hours ago',
      likes: 15,
      comments: 1,
      isLiked: false
    }
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'bg-purple-100 text-purple-700';
      case 'student':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'Instructor';
      case 'student':
        return 'Student';
      default:
        return 'User';
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'new' && post.timestamp.includes('hours ago')) ||
                         (selectedFilter === 'my-posts' && post.author.name === 'Current User'); // Mock current user
    const matchesSearch = post.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleLike = (postId: string) => {
    console.log(`Liked post ${postId}`);
    // In a real implementation, this would update the like count
  };

  const handleComment = (postId: string) => {
    console.log(`Comment on post ${postId}`);
    // In a real implementation, this would open a comment modal or navigate to post detail
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const handlePostSubmit = (postData: { topic: string; content: string }) => {
    console.log('New post created:', postData);
    // In a real implementation, this would add the post to the discussion
  };

  return (
    <div className="space-y-6">
      {/* Discussion Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Discussion</h3>
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search....."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
            />
          </div>
          
          {/* Create Post Button */}
          <button
            onClick={handleCreatePost}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            <span>Create post</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Sort by</h4>
                {(['all', 'new', 'my-posts'] as const).map((filter) => (
                  <label key={filter} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="discussionFilter"
                      value={filter}
                      checked={selectedFilter === filter}
                      onChange={() => setSelectedFilter(filter)}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">
                      {filter === 'all' ? 'All posts' : filter === 'new' ? 'New' : 'My posts'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Discussion Posts */}
        <div className="lg:col-span-3">
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {/* Author Avatar */}
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium text-sm">
                          {post.author.name.split(' ').map(name => name[0]).join('')}
                        </span>
                      </div>
                      
                      {/* Author Info */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 text-sm">
                            {post.author.name}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(post.author.role)}`}>
                            {getRoleLabel(post.author.role)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {post.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {post.topic}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Post Engagement */}
                  <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        post.isLiked
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ThumbsUp size={16} />
                      <span>{post.likes} Likes</span>
                    </button>
                    
                    <button
                      onClick={() => handleComment(post.id)}
                      className="flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <MessageCircle size={16} />
                      <span>{post.comments} Comments</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MessageCircle size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery ? 'No posts match your search criteria.' : 'No posts available for this filter.'}
                </p>
                <button
                  onClick={handleCreatePost}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Create the first post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handlePostSubmit}
      />
    </div>
  );
};

export default DiscussionTab;
