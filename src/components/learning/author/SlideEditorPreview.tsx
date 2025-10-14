import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Play, Volume2, Maximize, Subtitles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SlideEditorPreview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const slideData = location.state?.slideData;
  const courseTitle = slideData?.courseTitle || 'Responsive Design Principles';

  const [activeTab, setActiveTab] = useState('modules');

  const handleBackToSlideEditor = () => {
    navigate('/dashboard/lmsAuthor/slide-editor', { state: { slideData } });
  };

  const handlePublish = () => {
    console.log('Publish slide course');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'modules', label: 'Modules' },
    { id: 'discussion', label: 'Discussion' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToSlideEditor}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-lg font-medium text-foreground">
              You are currently in preview mode
            </h1>
          </div>
          
          <Button
            onClick={handlePublish}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
          >
            Publish
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Course Summary Card */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-8 mb-8">
          <div className="flex items-center space-x-8">
            {/* Course Image */}
            <div className="w-80 h-48 bg-muted rounded-lg overflow-hidden">
              <img
                src="/src/assets/images/dummy image.png"
                alt="Course preview"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Course Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {courseTitle}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Understand the key concepts to create designs that adapt to various screen sizes.
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Beginner
                  </span>
                </div>
                
                {/* Instructor Profile */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full overflow-hidden">
                    <img
                      src="/src/assets/images/dummy image.png"
                      alt="Instructor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">Leslie Alex</p>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-1 text-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video/Slide Preview Card */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-8">
          <div className="flex items-center space-x-8">
            {/* Video/Slide Preview */}
            <div className="w-80 h-48 bg-muted rounded-lg overflow-hidden relative">
              <img
                src="/src/assets/images/dummy image.png"
                alt="Video preview"
                className="w-full h-full object-cover"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 bg-background bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                  <Play size={24} className="text-foreground ml-1" />
                </button>
              </div>
            </div>
            
            {/* Video Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {courseTitle}
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Understand the key concepts to create designs that adapt to various screen sizes.
              </p>
              
              {/* Instructor Profile */}
              <div className="flex items-center justify-end">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full overflow-hidden">
                    <img
                      src="/src/assets/images/dummy image.png"
                      alt="Instructor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">Leslie Alex</p>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Video Controls */}
          <div className="mt-8 flex items-center space-x-4">
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
              <Play size={16} className="text-gray-600" />
            </button>
            
            <span className="text-sm text-gray-600 font-mono">4:03</span>
            <span className="text-sm text-gray-400">/</span>
            <span className="text-sm text-gray-600 font-mono">7:36</span>
            
            {/* Progress Bar */}
            <div className="flex-1 h-1 bg-gray-200 rounded-full mx-4">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: '54%' }}></div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
                <Subtitles size={16} className="text-gray-600" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
                <Volume2 size={16} className="text-gray-600" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
                <Maximize size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideEditorPreview;
