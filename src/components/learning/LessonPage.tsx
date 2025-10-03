import React, { useState, useRef } from 'react';
import { ArrowLeft, Play, Pause, Volume2, Maximize, Download, MessageCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LessonPageProps {
  lessonId?: string;
  courseId?: string;
}

const LessonPage: React.FC<LessonPageProps> = ({ lessonId, courseId }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(260); // 4:20 in seconds
  const [duration, setDuration] = useState(456); // 7:36 in seconds

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const resources = [
    { name: 'Transcript', type: 'document', size: '', icon: '📄' },
    { name: 'Handout.pdf', type: 'document', size: '1.2 MB', icon: '📄' },
    { name: 'Audio.mp3', type: 'audio', size: '5.2 MB', icon: '🎵' }
  ];

  const comments = [
    {
      id: 1,
      author: 'MJ Mark Joel',
      date: 'Jul 5, 2025 09:00 pm',
      content: 'I have a question about this module it is regarding the part where you mention digital tools in the video, i got lost.'
    }
  ];

  const handleLessonNavigation = (direction: 'previous' | 'next') => {
    // Navigate to previous or next lesson
    if (direction === 'previous') {
      console.log('Navigate to previous lesson');
    } else {
      console.log('Navigate to next lesson');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/dashboard/learning/enrolled-course-${courseId}`)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} className="mr-2" />
                <span className="text-sm font-medium">Back to Course workspace</span>
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-900">Module 2: Advanced features of digital tools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Video Player */}
          <div className="bg-black rounded-xl overflow-hidden">
            <div className="relative aspect-video">
              {/* Video Placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play size={32} />
                  </div>
                  <p className="text-lg font-medium">Video Lesson</p>
                  <p className="text-sm opacity-80">Click play to start</p>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-600 rounded-full h-1 cursor-pointer" onClick={handleProgressBarClick}>
                    <div 
                      className="bg-purple-600 h-1 rounded-full transition-all duration-200"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <span className="text-sm font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors">
                        <span className="text-sm">CC</span>
                      </button>
                      <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors">
                        <Volume2 size={20} />
                      </button>
                      <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors">
                        <Maximize size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
            <div className="space-y-3">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{resource.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{resource.name}</p>
                      {resource.size && (
                        <p className="text-sm text-gray-500">{resource.size}</p>
                      )}
                    </div>
                  </div>
                  <button className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Next
              </button>
            </div>
          </div>

          {/* Comments/Discussion Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-6">
              <MessageCircle size={20} className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Comments / Discussion</h3>
            </div>
            
            {/* Existing Comments */}
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-sm text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
            
            {/* Add Comment */}
            <div className="space-y-3">
              <div className="border border-gray-300 rounded-lg">
                <textarea
                  placeholder="Add a comment..."
                  className="w-full p-4 border-0 rounded-lg resize-none focus:ring-0 focus:outline-none"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Post
                </button>
              </div>
            </div>
          </div>

          {/* Lesson Navigation */}
          <div className="flex justify-between items-center bg-white rounded-lg shadow-sm border p-6">
            <button
              onClick={() => handleLessonNavigation('previous')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Previous lesson
            </button>
            <button
              onClick={() => handleLessonNavigation('next')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Next lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
