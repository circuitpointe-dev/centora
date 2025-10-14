import React, { useState } from 'react';
import { Search, Bell, Filter, Plus, Grid3X3, List, MoreHorizontal, Eye, DollarSign, Users, BookOpen, ChevronDown, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'in-review' | 'published';
  price: number;
  learners: number;
  image: string;
  collaborators?: {
    name: string;
    avatar: string;
    status: string;
  }[];
}

const LMSAuthorDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Navigate to Course Builder
  const handleEditCourse = (courseId: string) => {
    navigate('/dashboard/lmsAuthor/courses-builder');
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const coursesPerPage = 6;

  // Mock data for courses
  const courses: Course[] = [
    {
      id: '1',
      title: 'Responsive Design Principles',
      description: 'Understand the key concepts to create designs that adapt to various screen sizes.',
      status: 'draft',
      price: 10,
      learners: 0,
      image: '/src/assets/images/dummy image.png',
      collaborators: [
        { name: 'Mark Luke', avatar: '/placeholder-avatar.jpg', status: 'Editing' },
        { name: 'Elijah Luna', avatar: '/placeholder-avatar.jpg', status: 'Editing' }
      ]
    },
    {
      id: '2',
      title: 'Responsive Design Principles',
      description: 'Understand the key concepts to create designs that adapt to various screen sizes.',
      status: 'in-review',
      price: 0,
      learners: 1000,
      image: '/src/assets/images/dummy image.png'
    },
    {
      id: '3',
      title: 'Responsive Design Principles',
      description: 'Understand the key concepts to create designs that adapt to various screen sizes.',
      status: 'published',
      price: 10,
      learners: 1000,
      image: '/src/assets/images/dummy image.png'
    },
    {
      id: '4',
      title: 'Responsive Design Principles',
      description: 'Understand the key concepts to create designs that adapt to various screen sizes.',
      status: 'draft',
      price: 10,
      learners: 0,
      image: '/src/assets/images/dummy image.png'
    },
    {
      id: '5',
      title: 'Responsive Design Principles',
      description: 'Understand the key concepts to create designs that adapt to various screen sizes.',
      status: 'in-review',
      price: 0,
      learners: 1000,
      image: '/src/assets/images/dummy image.png'
    },
    {
      id: '6',
      title: 'Responsive Design Principles',
      description: 'Understand the key concepts to create designs that adapt to various screen sizes.',
      status: 'published',
      price: 10,
      learners: 1000,
      image: '/src/assets/images/dummy image.png'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Draft</Badge>;
      case 'in-review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In-review</Badge>;
      case 'published':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Published</Badge>;
      default:
        return null;
    }
  };

  const getPriceText = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(courseSearchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        
        {/* Period Dropdown */}
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="appearance-none bg-background border border-border rounded-md px-4 py-2 pr-8 text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annually">Annually</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Course Revenue */}
        <div className="bg-card p-6 rounded-lg border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-center min-h-[140px]">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-card-foreground">$100,000</div>
            <div className="text-sm text-muted-foreground font-medium">Total course revenue</div>
          </div>
        </div>

        {/* Overall Learners */}
        <div className="bg-card p-6 rounded-lg border-2 border-dashed border-green-300 flex flex-col items-center justify-center text-center min-h-[140px]">
          <div className="p-4 rounded-full bg-green-100 mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-card-foreground">3,500</div>
            <div className="text-sm text-muted-foreground font-medium">Overall learners</div>
          </div>
        </div>

        {/* Total Course Created */}
        <div className="bg-card p-6 rounded-lg border-2 border-dashed border-blue-300 flex flex-col items-center justify-center text-center min-h-[140px]">
          <div className="p-4 rounded-full bg-blue-100 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-card-foreground">24</div>
            <div className="text-sm text-muted-foreground font-medium">Total course created</div>
          </div>
        </div>
      </div>

      {/* Course List Section */}
      <div className="space-y-4">
        {/* Course List Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Course list</h2>
          <div className="flex items-center space-x-4">
            {/* Course Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search course..."
                value={courseSearchQuery}
                onChange={(e) => setCourseSearchQuery(e.target.value)}
                className="w-64 pr-10"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Filter Button */}
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            
            {/* Create Course Button */}
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => navigate('/dashboard/lmsAuthor/create-course')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create course
            </Button>
          </div>
        </div>

        {/* Course List/Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden flex flex-col h-full">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(course.status)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 p-1 h-8 w-8"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex-grow space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price: {getPriceText(course.price)}</span>
                      <span className="text-muted-foreground">Learners: {course.learners}</span>
                    </div>
                    
                    {/* Collaborators */}
                    {course.collaborators && course.collaborators.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {course.collaborators.map((collaborator, index) => (
                            <Avatar key={index} className="w-6 h-6 border-2 border-background">
                              <AvatarImage src={collaborator.avatar} />
                              <AvatarFallback className="text-xs">
                                {collaborator.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">Editing</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditCourse(course.id)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Course
                    </Button>
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => navigate('/dashboard/lmsAuthor/course-analytics')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Learners</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCourses.map((course) => (
                    <tr key={course.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium text-foreground">{course.title}</div>
                            <div className="text-sm text-muted-foreground">{course.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-foreground font-medium">{getPriceText(course.price)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-foreground">{course.learners}</span>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(course.status)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-8 w-8"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/dashboard/lmsAuthor/course-analytics')}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredCourses.length)} of {filteredCourses.length} course list
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMSAuthorDashboard;
