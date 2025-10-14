import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Eye, Users, Plus, Type, Video, Image, Music, ClipboardList, Zap, Grid3X3, MoreHorizontal, Trash2, Palette, Square, Circle, Triangle, Star, ArrowRight, Undo, Redo, AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline, Strikethrough, Link, Code, Quote, List, ListOrdered, Copy, Trash, X, Upload } from 'lucide-react';

const SlideEditor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const courseData = location.state?.courseData;
  const courseTitle = courseData?.courseName || 'Introduction to Digital Marketing Strategies';

  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showElementsPopup, setShowElementsPopup] = useState(false);
  const [showTextPopup, setShowTextPopup] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImageDragOver, setIsImageDragOver] = useState(false);
  const [isAudioDragOver, setIsAudioDragOver] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  const handleBackToCourseList = () => {
    navigate('/dashboard/lmsAuthor/dashboard');
  };

  const handlePreview = () => {
    const slideData = {
      slides: slides,
      quizQuestions: quizQuestions,
      courseTitle: courseTitle
    };
    navigate('/dashboard/lmsAuthor/slide-editor-preview', { state: { slideData } });
  };

  const handlePublish = () => {
    console.log('Publish slide course');
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: Date.now().toString(),
      content: '',
      backgroundColor: '#ffffff',
      elements: []
    };
    setSlides(prev => [...prev, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const handleVideoClick = () => {
    if (slides.length === 0) return;
    setShowVideoModal(true);
  };

  const handleImageClick = () => {
    if (slides.length === 0) return;
    setShowImageModal(true);
  };

  const handleAudioClick = () => {
    if (slides.length === 0) return;
    setShowAudioModal(true);
  };

  const handleCloseAudioModal = () => {
    setShowAudioModal(false);
    setIsAudioDragOver(false);
  };

  const handleQuizClick = () => {
    if (slides.length === 0) return;
    setIsQuizMode(true);
    // Close any open popups/modals
    setShowElementsPopup(false);
    setShowTextPopup(false);
    setShowVideoModal(false);
    setShowImageModal(false);
    setShowAudioModal(false);
    setSelectedElement(null);
  };

  const handleExitQuizMode = () => {
    setIsQuizMode(false);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      type: 'multiple-choice'
    };
    setQuizQuestions(prev => [...prev, newQuestion]);
  };

  const handleImportFromQuizBank = () => {
    console.log('Import from quiz bank');
    // TODO: Implement quiz bank import
  };

  const handleUpdateQuestion = (questionId: string, field: string, value: any) => {
    setQuizQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuizQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const handleSaveSlides = () => {
    const slideData = {
      slides: slides,
      quizQuestions: quizQuestions,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('slideEditorData', JSON.stringify(slideData));
    alert('Slides saved temporarily!');
  };

  const handleSaveQuizSlide = () => {
    if (quizQuestions.length === 0) {
      alert('No quiz questions to save!');
      return;
    }

    // Create a quiz slide element
    const quizSlideElement = {
      id: Date.now().toString(),
      type: 'quiz',
      quizQuestions: quizQuestions,
      x: 50,
      y: 50,
      width: 700,
      height: 500
    };

    // Add quiz element to current slide
    setSlides(prev => prev.map((slide, index) => 
      index === currentSlideIndex 
        ? { ...slide, elements: [...slide.elements, quizSlideElement] }
        : slide
    ));

    // Exit quiz mode
    setIsQuizMode(false);
    setQuizQuestions([]);
    
    alert('Quiz slide saved successfully!');
  };

  const handleLoadSlides = () => {
    const savedData = sessionStorage.getItem('slideEditorData');
    if (savedData) {
      try {
        const slideData = JSON.parse(savedData);
        setSlides(slideData.slides || []);
        setQuizQuestions(slideData.quizQuestions || []);
        setCurrentSlideIndex(0);
        alert('Slides loaded successfully!');
      } catch (error) {
        alert('Error loading slides: Invalid data');
      }
    } else {
      alert('No saved slides found');
    }
  };

  const handleClearSlides = () => {
    if (confirm('Are you sure you want to clear all slides? This cannot be undone.')) {
      setSlides([]);
      setQuizQuestions([]);
      setCurrentSlideIndex(0);
      setIsQuizMode(false);
      setSelectedElement(null);
      alert('All slides cleared!');
    }
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setIsDragOver(false);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setIsImageDragOver(false);
  };

  const handleFileUpload = (file: File, type: 'video' | 'image' | 'audio') => {
    if (file && file.size <= 25 * 1024 * 1024) { // 25MB limit
      const newElement = {
        id: Date.now().toString(),
        type: type,
        file: file,
        x: Math.random() * 400 + 200,
        y: Math.random() * 200 + 200,
        width: type === 'video' ? 300 : type === 'audio' ? 400 : 250,
        height: type === 'video' ? 200 : type === 'audio' ? 100 : 200,
        url: URL.createObjectURL(file)
      };
      
      // Add element to current slide
      setSlides(prev => prev.map((slide, index) => 
        index === currentSlideIndex 
          ? { ...slide, elements: [...slide.elements, newElement] }
          : slide
      ));
      
      if (type === 'video') {
        setShowVideoModal(false);
      } else if (type === 'image') {
        setShowImageModal(false);
      } else if (type === 'audio') {
        setShowAudioModal(false);
      }
    } else {
      alert('File size must be less than 25MB');
    }
  };

  const handleAudioUpload = (file: File) => {
    handleFileUpload(file, 'audio');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsImageDragOver(true);
  };

  const handleAudioDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsAudioDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleImageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsImageDragOver(false);
  };

  const handleAudioDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsAudioDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0], 'video');
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsImageDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0], 'image');
    }
  };

  const handleAudioDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsAudioDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0], 'audio');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'image' | 'audio') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0], type);
    }
  };

  const handleVideoFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInputChange(e, 'video');
  };

  const handleImageFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInputChange(e, 'image');
  };

  const handleAudioFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInputChange(e, 'audio');
  };

  const handleSelectFromMediaLibrary = () => {
    console.log('Select from media library');
    // TODO: Implement media library selection
  };

  const handleAddElement = (elementType: string) => {
    const newElement = {
      id: Date.now().toString(),
      type: elementType,
      x: Math.random() * 600 + 100, // Random position within slide
      y: Math.random() * 400 + 100,
      width: elementType === 'rectangle' ? 200 : 50,
      height: elementType === 'rectangle' ? 300 : 50,
      color: '#374151' // Dark gray color
    };
    
    // Add element to current slide
    setSlides(prev => prev.map((slide, index) => 
      index === currentSlideIndex 
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    ));
    
    setShowElementsPopup(false);
  };

  const handleElementsClick = () => {
    if (slides.length === 0) return;
    setShowElementsPopup(!showElementsPopup);
  };

  const handleTextClick = () => {
    if (slides.length === 0) return;
    setShowTextPopup(!showTextPopup);
  };

  const handleAddText = (textType: string = 'normal') => {
    const newTextElement = {
      id: Date.now().toString(),
      type: 'text',
      textType: textType,
      content: textType === 'heading1' ? 'Heading 1' : textType === 'heading2' ? 'Heading 2' : textType === 'heading3' ? 'Heading 3' : 'Text',
      x: Math.random() * 500 + 150, // Random position within slide
      y: Math.random() * 300 + 150,
      width: 200,
      height: 40,
      fontSize: textType === 'heading1' ? 32 : textType === 'heading2' ? 24 : textType === 'heading3' ? 20 : 16,
      fontWeight: textType.includes('heading') ? 'bold' : 'normal',
      color: '#000000'
    };
    
    // Add element to current slide
    setSlides(prev => prev.map((slide, index) => 
      index === currentSlideIndex 
        ? { ...slide, elements: [...slide.elements, newTextElement] }
        : slide
    ));
    
    setShowTextPopup(false);
  };

  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId);
  };

  const handleDuplicateElement = (elementId: string) => {
    const currentSlide = slides[currentSlideIndex];
    const element = currentSlide.elements.find(el => el.id === elementId);
    if (element) {
      const newElement = {
        ...element,
        id: Date.now().toString(),
        x: element.x + 20,
        y: element.y + 20
      };
      
      // Add duplicated element to current slide
      setSlides(prev => prev.map((slide, index) => 
        index === currentSlideIndex 
          ? { ...slide, elements: [...slide.elements, newElement] }
          : slide
      ));
    }
  };

  const handleDeleteElement = (elementId: string) => {
    // Remove element from current slide
    setSlides(prev => prev.map((slide, index) => 
      index === currentSlideIndex 
        ? { ...slide, elements: slide.elements.filter(el => el.id !== elementId) }
        : slide
    ));
    setSelectedElement(null);
  };

  const sidebarItems = [
    { icon: <div className="w-6 h-6 flex items-center justify-center"><div className="w-2 h-2 bg-gray-600 rounded-full"></div><div className="w-2 h-2 bg-gray-600 rounded-full mx-1"></div><div className="w-2 h-2 bg-gray-600 rounded-full"></div></div>, label: 'Elements', onClick: handleElementsClick },
    { icon: <Type size={20} className="text-gray-600" />, label: 'Text', onClick: handleTextClick },
    { icon: <Video size={20} className="text-gray-600" />, label: 'Video', onClick: handleVideoClick },
    { icon: <Image size={20} className="text-gray-600" />, label: 'Image', onClick: handleImageClick },
    { icon: <Music size={20} className="text-gray-600" />, label: 'Audio', onClick: handleAudioClick },
    { icon: <ClipboardList size={20} className="text-gray-600" />, label: 'Quiz', onClick: handleQuizClick },
    { icon: <Zap size={20} className="text-gray-600" />, label: 'Animate' }
  ];

  const colorPickerColors = [
    '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#3B0764',
    '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', '#172554',
    '#10B981', '#059669', '#047857', '#065F46', '#064E3B', '#022C22'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToCourseList}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Course list
            </button>
          </div>
          
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-foreground">{courseTitle}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Collaborators */}
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-muted rounded-full border-2 border-background"></div>
              <div className="w-8 h-8 bg-muted-foreground rounded-full border-2 border-background"></div>
              <div className="w-8 h-8 bg-foreground rounded-full border-2 border-background"></div>
            </div>
            
            <Button
              variant="outline"
              onClick={handlePreview}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border"
            >
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
            
            <Button
              onClick={handleSaveSlides}
              variant="outline"
              className="border-border text-foreground hover:bg-accent"
            >
              Save
            </Button>
            
            <Button
              onClick={handleLoadSlides}
              variant="outline"
              className="border-border text-foreground hover:bg-accent"
            >
              Load
            </Button>
            
            <Button
              onClick={handleClearSlides}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              Clear
            </Button>
            
            <Button
              onClick={handlePublish}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-64 bg-card border-r border-border p-6">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                className={`flex items-center space-x-3 w-full p-3 text-left rounded-lg transition-colors ${
                  slides.length === 0 || (isQuizMode && item.label !== 'Quiz')
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={item.onClick}
                disabled={slides.length === 0 || (isQuizMode && item.label !== 'Quiz')}
              >
                {item.icon}
                <span className="text-card-foreground font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          
          {/* Bottom Add Slide Button */}
          <div className="mt-8">
            <Button
              onClick={handleAddSlide}
              variant="outline"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
            >
              <Plus size={16} className="mr-2" />
              Add slide
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-muted flex items-center justify-center relative">
          {slides.length === 0 ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Start your course by adding the first slide.
              </h2>
              <Button
                onClick={handleAddSlide}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
              >
                <Plus size={20} className="mr-2" />
                Add slide
              </Button>
            </div>
          ) : isQuizMode ? (
            <div className="w-[800px] h-[600px] bg-white border-2 border-purple-600 rounded-lg flex flex-col">
              {/* Quiz Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Quiz Editor</h2>
                  <Button
                    onClick={handleExitQuizMode}
                    variant="outline"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Exit Quiz Mode
                  </Button>
                </div>
              </div>

              {/* Quiz Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {quizQuestions.length === 0 ? (
                  <div className="text-center h-full flex flex-col items-center justify-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add question to your quiz</h3>
                    <div className="flex space-x-4">
                      <Button
                        onClick={handleAddQuestion}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Add question
                      </Button>
                      <Button
                        onClick={handleImportFromQuizBank}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Import from quiz bank
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 pb-6">
                    {quizQuestions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                          <Button
                            onClick={() => handleDeleteQuestion(question.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Question
                            </label>
                            <input
                              type="text"
                              value={question.question}
                              onChange={(e) => handleUpdateQuestion(question.id, 'question', e.target.value)}
                              placeholder="Enter your question here..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Answer Options
                            </label>
                            <div className="space-y-2">
                              {question.options.map((option: string, optionIndex: number) => (
                                <div key={optionIndex} className="flex items-center space-x-3">
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={question.correctAnswer === optionIndex}
                                    onChange={() => handleUpdateQuestion(question.id, 'correctAnswer', optionIndex)}
                                    className="text-purple-600 focus:ring-purple-500"
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...question.options];
                                      newOptions[optionIndex] = e.target.value;
                                      handleUpdateQuestion(question.id, 'options', newOptions);
                                    }}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex space-x-4 sticky bottom-0 bg-white pt-4">
                      <Button
                        onClick={handleAddQuestion}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Add another question
                      </Button>
                      <Button
                        onClick={handleImportFromQuizBank}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Import from quiz bank
                      </Button>
                      <Button
                        onClick={handleSaveQuizSlide}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Save Quiz
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Text Popup */}
              {showTextPopup && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddText('normal')}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      Normal text
                    </button>
                    <button
                      onClick={() => handleAddText('heading1')}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors text-blue-600 font-semibold"
                    >
                      Heading 1
                    </button>
                    <button
                      onClick={() => handleAddText('heading2')}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      Heading 2
                    </button>
                    <button
                      onClick={() => handleAddText('heading3')}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      Heading 3
                    </button>
                  </div>
                </div>
              )}

              {/* Elements Popup */}
              {showElementsPopup && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Elements</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAddElement('square')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Square size={20} className="text-black" />
                      </button>
                      <button
                        onClick={() => handleAddElement('square')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Square size={20} className="text-black" />
                      </button>
                      <button
                        onClick={() => handleAddElement('circle')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Circle size={20} className="text-black" />
                      </button>
                      <button
                        onClick={() => handleAddElement('triangle')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Triangle size={20} className="text-black" />
                      </button>
                      <button
                        onClick={() => handleAddElement('star')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Star size={20} className="text-black" />
                      </button>
                      <button
                        onClick={() => handleAddElement('arrow')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ArrowRight size={20} className="text-black" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Formatting Toolbar */}
              {selectedElement && (
                <div className="absolute -top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Undo size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Redo size={16} />
                    </button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <select className="text-sm border-none bg-transparent focus:outline-none">
                      <option>Normal text</option>
                      <option>Heading 1</option>
                      <option>Heading 2</option>
                      <option>Heading 3</option>
                    </select>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <AlignLeft size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <AlignCenter size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <AlignRight size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <AlignJustify size={16} />
                    </button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <div className="w-4 h-4 bg-black rounded"></div>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Bold size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Italic size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Underline size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Strikethrough size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Link size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Code size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Quote size={16} />
                    </button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <List size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ListOrdered size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Slide Canvas */}
              <div 
                className="w-[800px] h-[600px] bg-card border-2 border-purple-600 rounded-lg shadow-lg relative"
                style={{ backgroundColor: slides[currentSlideIndex]?.backgroundColor || 'hsl(var(--card))' }}
              >
                {/* Color Picker Popup */}
                {showColorPicker && (
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg shadow-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-background border border-border rounded flex items-center justify-center">
                        <div className="w-3 h-3 bg-foreground rounded-full"></div>
                      </div>
                      <Trash2 size={16} className="text-muted-foreground" />
                    </div>
                    <div className="grid grid-cols-9 gap-1">
                      {colorPickerColors.map((color, index) => (
                        <button
                          key={index}
                          className="w-6 h-6 rounded border border-border hover:border-muted-foreground"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            const updatedSlides = [...slides];
                            updatedSlides[currentSlideIndex].backgroundColor = color;
                            setSlides(updatedSlides);
                            setShowColorPicker(false);
                          }}
                        >
                          {index === 0 && <div className="w-2 h-2 bg-foreground rounded-full mx-auto mt-1"></div>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Slide Elements */}
                {slides[currentSlideIndex]?.elements?.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute cursor-pointer ${selectedElement === element.id ? 'ring-2 ring-purple-500 ring-dashed' : ''}`}
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                    }}
                    onClick={() => handleElementClick(element.id)}
                  >
                    {element.type === 'text' ? (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          fontSize: element.fontSize,
                          fontWeight: element.fontWeight,
                          color: element.color
                        }}
                      >
                        {element.content}
                      </div>
                    ) : element.type === 'video' ? (
                      <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                        <video
                          src={element.url}
                          className="w-full h-full object-cover rounded"
                          controls
                        />
                      </div>
                    ) : element.type === 'image' ? (
                      <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        <img
                          src={element.url}
                          alt="Uploaded image"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ) : element.type === 'quiz' ? (
                      <div className="w-full h-full bg-purple-50 border-2 border-purple-200 rounded flex flex-col items-center justify-center p-4">
                        <ClipboardList size={32} className="text-purple-600 mb-2" />
                        <span className="text-purple-800 font-medium text-sm">Quiz</span>
                        <span className="text-purple-600 text-xs">{element.quizQuestions?.length || 0} questions</span>
                      </div>
                    ) : element.type === 'audio' ? (
                      <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                        <audio
                          src={element.url}
                          className="w-full h-full"
                          controls
                        />
                      </div>
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor: element.color,
                          borderRadius: element.type === 'circle' ? '50%' : element.type === 'triangle' ? '0' : '4px',
                        }}
                      >
                        {element.type === 'triangle' && (
                          <div 
                            className="w-full h-full"
                            style={{
                              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                              backgroundColor: element.color
                            }}
                          />
                        )}
                        {element.type === 'star' && (
                          <div className="w-full h-full flex items-center justify-center">
                            <Star size={Math.min(element.width, element.height) * 0.6} className="text-white" />
                          </div>
                        )}
                        {element.type === 'arrow' && (
                          <div className="w-full h-full flex items-center justify-center">
                            <ArrowRight size={Math.min(element.width, element.height) * 0.6} className="text-white" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Context Menu for selected element */}
                    {selectedElement === element.id && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded shadow-lg p-1">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleDuplicateElement(element.id)}
                            className="px-2 py-1 text-xs hover:bg-gray-100 rounded"
                          >
                            Duplicate
                          </button>
                          <button
                            className="px-2 py-1 text-xs hover:bg-gray-100 rounded"
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => handleDeleteElement(element.id)}
                            className="px-2 py-1 text-xs hover:bg-gray-100 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Slide Content Area - Empty for now */}
                <div className="w-full h-full flex items-center justify-center">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Palette size={24} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Upload Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upload video</h2>
              <button
                onClick={handleCloseVideoModal}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Choose a file or drag & drop it here</p>
              
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoFileInputChange}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="inline-block px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Browse file
              </label>
              
              <p className="text-sm text-gray-500 mt-4">Maximum size: 25MB</p>
              
              <div className="mt-6">
                <p className="text-gray-600 mb-2">OR</p>
                <button
                  onClick={handleSelectFromMediaLibrary}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Select from media library
                </button>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleCloseVideoModal}
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upload image</h2>
              <button
                onClick={handleCloseImageModal}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isImageDragOver 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleImageDragOver}
              onDragLeave={handleImageDragLeave}
              onDrop={handleImageDrop}
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Choose a file or drag & drop it here</p>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileInputChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-block px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Browse file
              </label>
              
              <p className="text-sm text-gray-500 mt-4">Maximum size: 25MB</p>
              
              <div className="mt-6">
                <p className="text-gray-600 mb-2">OR</p>
                <button
                  onClick={handleSelectFromMediaLibrary}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Select from media library
                </button>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleCloseImageModal}
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Upload Modal */}
      {showAudioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upload audio</h2>
              <button
                onClick={handleCloseAudioModal}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isAudioDragOver 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleAudioDragOver}
              onDragLeave={handleAudioDragLeave}
              onDrop={handleAudioDrop}
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Choose a file or drag & drop it here</p>
              
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioFileInputChange}
                className="hidden"
                id="audio-upload"
              />
              <label
                htmlFor="audio-upload"
                className="inline-block px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Browse file
              </label>
              
              <p className="text-sm text-gray-500 mt-4">Maximum size: 25MB</p>
              
              <div className="mt-6">
                <p className="text-gray-600 mb-2">OR</p>
                <button
                  onClick={handleSelectFromMediaLibrary}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Select from media library
                </button>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleCloseAudioModal}
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Slide Management Bar */}
      {slides.length > 0 && !isQuizMode && (
        <div className="bg-card border-t border-border px-6 py-4">
          <div className="flex items-center space-x-4">
            {/* Slide Thumbnails */}
            <div className="flex items-center space-x-2">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`relative cursor-pointer ${
                    index === currentSlideIndex ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setCurrentSlideIndex(index)}
                >
                  <div 
                    className="w-20 h-14 bg-card border-2 border-purple-600 rounded flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: slide.backgroundColor || 'hsl(var(--card))' }}
                  >
                    {/* Show elements in thumbnail */}
                    {slide.elements?.map((element) => (
                      <div
                        key={element.id}
                        className="absolute"
                        style={{
                          left: (element.x / 800) * 80, // Scale down for thumbnail
                          top: (element.y / 600) * 56, // Scale down for thumbnail
                          width: (element.width / 800) * 80,
                          height: (element.height / 600) * 56,
                          backgroundColor: element.type === 'text' ? 'transparent' : element.color,
                          borderRadius: element.type === 'circle' ? '50%' : element.type === 'triangle' ? '0' : '2px',
                          fontSize: element.type === 'text' ? '6px' : 'inherit',
                          color: element.type === 'text' ? element.color : 'inherit',
                          fontWeight: element.type === 'text' ? element.fontWeight : 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}
                      >
                        {element.type === 'text' && (
                          <span className="text-xs truncate">{element.content}</span>
                        )}
                        {element.type === 'video' && (
                          <div className="w-full h-full bg-gray-800 rounded"></div>
                        )}
                        {element.type === 'image' && (
                          <div className="w-full h-full bg-gray-100 rounded"></div>
                        )}
                        {element.type === 'quiz' && (
                          <div className="w-full h-full bg-purple-50 rounded flex items-center justify-center">
                            <ClipboardList size={8} className="text-purple-600" />
                          </div>
                        )}
                        {element.type === 'audio' && (
                          <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                            <Music size={8} className="text-white" />
                          </div>
                        )}
                        {element.type === 'triangle' && (
                          <div 
                            className="w-full h-full"
                            style={{
                              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                              backgroundColor: element.color
                            }}
                          />
                        )}
                        {element.type === 'star' && (
                          <Star size={8} className="text-white" />
                        )}
                        {element.type === 'arrow' && (
                          <ArrowRight size={8} className="text-white" />
                        )}
                      </div>
                    ))}
                    {(!slide.elements || slide.elements.length === 0) && (
                      <Grid3X3 size={16} className="text-muted-foreground" />
                    )}
                  </div>
                  <MoreHorizontal 
                    size={16} 
                    className="absolute bottom-1 right-1 text-muted-foreground" 
                  />
                </div>
              ))}
            </div>
            
            {/* Add Slide Button */}
            <Button
              onClick={handleAddSlide}
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
            >
              <Plus size={16} className="mr-2" />
              Add slide
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideEditor;
