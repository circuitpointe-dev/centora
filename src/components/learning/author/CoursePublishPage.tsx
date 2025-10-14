import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Eye, 
  Upload, 
  Plus,
  Check,
  X,
  Calendar,
  Download,
  Settings,
  Users,
  MessageSquare,
  Award,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

const CoursePublishPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get course data from navigation state
  const courseData = location.state?.courseData;
  const courseTitle = courseData?.title || 'Introduction to Digital Marketing Strategies';

  // State for form data
  const [pricingType, setPricingType] = useState<'free' | 'paid'>('free');
  const [authorName, setAuthorName] = useState('');
  const [authorImage, setAuthorImage] = useState('');
  const [courseTag, setCourseTag] = useState('Beginner');
  const [certificatesEnabled, setCertificatesEnabled] = useState(true);
  const [discussionsEnabled, setDiscussionsEnabled] = useState(true);
  const [learnerCanCreateThreads, setLearnerCanCreateThreads] = useState(true);
  const [allowUpvoting, setAllowUpvoting] = useState(true);
  const [notifyInstructor, setNotifyInstructor] = useState(false);
  const [moderatorName, setModeratorName] = useState('');
  const [moderatorImage, setModeratorImage] = useState('');
  const [requireApproval, setRequireApproval] = useState(true);
  const [enableProfanityFilter, setEnableProfanityFilter] = useState(true);
  const [blockExternalLinks, setBlockExternalLinks] = useState(true);
  const [releaseNotes, setReleaseNotes] = useState('Version 1.3 will be released upon publication');
  const [exportFormat, setExportFormat] = useState('SCROM 1.2');
  const [lmEndpoint, setLmEndpoint] = useState('https://lms-example.com');
  const [authKey, setAuthKey] = useState('');
  const [authSecret, setAuthSecret] = useState('');
  const [passedStatus, setPassedStatus] = useState('');
  const [tracking, setTracking] = useState('');

  const handleBackToCourseBuilder = () => {
    navigate('/dashboard/lmsAuthor/courses');
  };

  const handlePreview = () => {
    // Handle preview functionality
    console.log('Preview course');
  };

  const handlePublish = () => {
    // Handle publish functionality
    console.log('Publish course');
  };

  const handleScheduleForLater = () => {
    // Handle schedule for later functionality
    console.log('Schedule for later');
  };

  const handleExportFlagReport = () => {
    // Handle export flag report functionality
    console.log('Export flag report');
  };

  const handleAddCertificate = () => {
    // Handle add certificate functionality
    console.log('Add certificate');
  };

  const handleAddStarterThread = () => {
    // Handle add starter thread functionality
    console.log('Add starter thread');
  };

  const handleViewVersion = (version: string) => {
    // Handle view version functionality
    console.log('View version:', version);
  };

  const handleRollbackVersion = (version: string) => {
    // Handle rollback version functionality
    console.log('Rollback version:', version);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToCourseBuilder}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Course Builder
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-foreground">
              {courseTitle}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-medium">LA</span>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-medium">SA</span>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-medium">MJ</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* Publish Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Publish</h2>
          
          <div className="space-y-6">
            {/* Pricing & Access */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-foreground">Pricing & Access</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="pricing"
                    value="free"
                    checked={pricingType === 'free'}
                    onChange={(e) => setPricingType(e.target.value as 'free' | 'paid')}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <div className="font-medium text-foreground">Free</div>
                    <div className="text-sm text-muted-foreground">
                      This course would be available for free and will be accessible to users immediately upon publication.
                    </div>
                  </div>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="pricing"
                    value="paid"
                    checked={pricingType === 'paid'}
                    onChange={(e) => setPricingType(e.target.value as 'free' | 'paid')}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <div className="font-medium text-foreground">Paid</div>
                    <div className="text-sm text-muted-foreground">
                      This course will be paid and available to users after purchase.
                    </div>
                  </div>
                </label>
              </div>
              
              {pricingType === 'paid' && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    To set up a one-time payment, connect to Stripe or Paypal
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      Connect to Stripe
                    </Button>
                    <Button variant="outline" size="sm">
                      Connect to Paypal
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Author Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Author name</label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Enter author name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Author Image</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <Button variant="outline" size="sm">
                    Upload image
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Course Tag</label>
                <select
                  value={courseTag}
                  onChange={(e) => setCourseTag(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Certificate Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Certificate</h2>
            <Button variant="outline" size="sm" onClick={handleAddCertificate}>
              <Plus size={16} className="mr-2" />
              Add certificate
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="certificatesEnabled"
                checked={certificatesEnabled}
                onChange={(e) => setCertificatesEnabled(e.target.checked)}
                className="w-4 h-4 text-primary"
              />
              <label htmlFor="certificatesEnabled" className="text-sm font-medium text-foreground">
                Enable certificates for this course
              </label>
            </div>
            
            {certificatesEnabled && (
              <div className="space-y-4">
                {/* Default Template */}
                <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                  <div className="w-16 h-12 rounded overflow-hidden">
                    <img 
                      src="/src/assets/images/cert.png" 
                      alt="Default Certificate Template"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Default template</div>
                    <div className="text-sm text-muted-foreground">
                      This is a default certificate template that authors can customize as needed.
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                </div>
                
                {/* Standard Certificate Template */}
                <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                  <div className="w-16 h-12 rounded overflow-hidden">
                    <img 
                      src="/src/assets/images/cert.png" 
                      alt="Standard Certificate Template"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Standard Certificate Template</div>
                    <div className="text-sm text-muted-foreground">
                      This is a customizable certificate template designed for authors to modify according to their course requirements.
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Discussion Settings Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Discussion settings</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="discussionsEnabled"
                checked={discussionsEnabled}
                onChange={(e) => setDiscussionsEnabled(e.target.checked)}
                className="w-4 h-4 text-primary"
              />
              <label htmlFor="discussionsEnabled" className="text-sm font-medium text-foreground">
                Enable discussions for this course
              </label>
            </div>
            
            {discussionsEnabled && (
              <div className="space-y-4">
                {/* Starter Threads */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium text-foreground">Starter Threads</h3>
                    <Button variant="outline" size="sm" onClick={handleAddStarterThread}>
                      <Plus size={16} className="mr-2" />
                      Add starter thread
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground">Title</div>
                        <div className="text-sm text-muted-foreground">Introduce yourself</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground">Status</div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Pinned
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Preview Box */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary text-sm font-medium">LA</span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Leslie Alex</div>
                          <div className="text-sm text-muted-foreground">Pinned</div>
                        </div>
                      </div>
                      <div className="text-sm text-foreground mb-2">Introduce yourself</div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>15 Likes</span>
                        <span>2 Comments</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Learner Permissions */}
                <div className="space-y-3">
                  <h3 className="text-md font-medium text-foreground">Learner permissions</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={learnerCanCreateThreads}
                        onChange={(e) => setLearnerCanCreateThreads(e.target.checked)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-foreground">Allow learner to create threads</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={allowUpvoting}
                        onChange={(e) => setAllowUpvoting(e.target.checked)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-foreground">Allow post upvoting</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={notifyInstructor}
                        onChange={(e) => setNotifyInstructor(e.target.checked)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-foreground">Notify instructor of flagged content</span>
                    </label>
                  </div>
                </div>
                
                {/* Moderator Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Moderator name</label>
                    <Input
                      value={moderatorName}
                      onChange={(e) => setModeratorName(e.target.value)}
                      placeholder="Enter moderator name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Moderator Image</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <Button variant="outline" size="sm">
                        Upload image
                      </Button>
                    </div>
                  </div>
                  
                  {/* Moderator Settings */}
                  <div className="space-y-2">
                    <h3 className="text-md font-medium text-foreground">Moderator settings</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={requireApproval}
                          onChange={(e) => setRequireApproval(e.target.checked)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm text-foreground">Require approval to post</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={enableProfanityFilter}
                          onChange={(e) => setEnableProfanityFilter(e.target.checked)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm text-foreground">Enable profanity filter</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={blockExternalLinks}
                          onChange={(e) => setBlockExternalLinks(e.target.checked)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm text-foreground">Block external links</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Pre-Publish Checklist Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Pre-Publish Checklist</h2>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm text-foreground">Accessibility</span>
            </div>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-foreground">Broken links 2 found</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm text-foreground">Media optimization OK</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm text-foreground">Compatibility check SCROM 1.2</span>
            </div>
          </div>
        </Card>

        {/* Versioning Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Versioning</h2>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Auto-increment version number and optionally add release notes.
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Current version</label>
              <div className="text-sm text-foreground">v1.2 will increment to v1.3 upon publishing</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Release notes</label>
              <Input
                value={releaseNotes}
                onChange={(e) => setReleaseNotes(e.target.value)}
                placeholder="Enter release notes"
              />
            </div>
            
            {/* Version History */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Version history</label>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2">Version</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Author</th>
                      <th className="text-left py-2">Notes</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-2">v1.2</td>
                      <td className="py-2">Aug 2, 2025</td>
                      <td className="py-2">John smith</td>
                      <td className="py-2">Improved accessibility</td>
                      <td className="py-2">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewVersion('v1.2')}>
                            View
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRollbackVersion('v1.2')}>
                            Rollback
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-2">v1.3</td>
                      <td className="py-2">Sep 15, 2025</td>
                      <td className="py-2">Sarah Johnson</td>
                      <td className="py-2">Enhanced performance</td>
                      <td className="py-2">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewVersion('v1.3')}>
                            View
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRollbackVersion('v1.3')}>
                            Rollback
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-2">v1.4</td>
                      <td className="py-2">Oct 20, 2025</td>
                      <td className="py-2">Michael Brown</td>
                      <td className="py-2">Bug fixes and optimizations</td>
                      <td className="py-2">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewVersion('v1.4')}>
                            View
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRollbackVersion('v1.4')}>
                            Rollback
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">v1.5</td>
                      <td className="py-2">Nov 10, 2025</td>
                      <td className="py-2">Emily Davis</td>
                      <td className="py-2">UI redesign</td>
                      <td className="py-2">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewVersion('v1.5')}>
                            View
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRollbackVersion('v1.5')}>
                            Rollback
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>

        {/* Export Options Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Export options</h2>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="exportFormat"
                value="SCROM 1.2"
                checked={exportFormat === 'SCROM 1.2'}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm text-foreground">SCROM 1.2</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="exportFormat"
                value="SCROM 2004"
                checked={exportFormat === 'SCROM 2004'}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm text-foreground">SCROM 2004</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="exportFormat"
                value="xAPI"
                checked={exportFormat === 'xAPI'}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm text-foreground">xAPI</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="exportFormat"
                value="cmi5"
                checked={exportFormat === 'cmi5'}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm text-foreground">cmi5</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="exportFormat"
                value="Web"
                checked={exportFormat === 'Web'}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm text-foreground">Web</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="exportFormat"
                value="PDF"
                checked={exportFormat === 'PDF'}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm text-foreground">PDF</span>
            </label>
          </div>
        </Card>

        {/* Integration Settings Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Integration settings</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">LM endpoint</label>
              <Input
                value={lmEndpoint}
                onChange={(e) => setLmEndpoint(e.target.value)}
                placeholder="https://lms-example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Authentication</label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={authKey}
                  onChange={(e) => setAuthKey(e.target.value)}
                  placeholder="Key"
                />
                <Input
                  value={authSecret}
                  onChange={(e) => setAuthSecret(e.target.value)}
                  placeholder="Secret"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Completion</label>
              <Input
                value={passedStatus}
                onChange={(e) => setPassedStatus(e.target.value)}
                placeholder="Passed status"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tracking</label>
              <Input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="Interactions"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-background border-t border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleScheduleForLater}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Schedule for later
          </button>
          
          <Button
            onClick={handlePublish}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2"
          >
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoursePublishPage;
