import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowLeft, AlertTriangle, GraduationCap, CheckCircle, Upload, ExternalLink, Calendar, Plus } from 'lucide-react'
import UploadEvidenceModal from './UploadEvidenceModal'
import AddDevelopmentActionModal from './AddDevelopmentActionModal'

interface Props {
  onBack: () => void
  employeeName: string
  employeeRole: string
  targetRole: string
}

const SuccessorDevelopmentPlanDetailView: React.FC<Props> = ({ 
  onBack, 
  employeeName, 
  employeeRole, 
  targetRole 
}) => {
  const initials = employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false)
  const [isAddActionModalOpen, setIsAddActionModalOpen] = React.useState(false)
  
  const handleUploadEvidence = (data: { type: string; description: string; file: File | null }) => {
    console.log('Upload evidence:', data)
    // Handle the upload logic here
  }

  const handleAddAction = (action: { title: string; type: string; duration: string }) => {
    console.log('Add development action:', action)
    // Handle adding the action to the plan
  }
  
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button onClick={onBack} className="flex items-center space-x-1 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          <span>Succession planning</span>
        </button>
        <span>/</span>
        <span>Successor development plan</span>
        <span>/</span>
        <span>View detail</span>
      </div>

      {/* Employee Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium text-gray-700">
          {initials}
        </div>
        <div>
          <div className="text-xl font-semibold text-gray-900">{employeeName}</div>
          <div className="text-sm text-gray-600">Development plan for {targetRole}</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-2">Current Readiness</div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              ≤12 months
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-2">Plan Progress</div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-gray-900 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
              <span className="text-sm text-gray-900">60%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-2">Forecast Ready</div>
            <div className="text-sm text-gray-900">2026-03-15</div>
          </CardContent>
        </Card>
      </div>

      {/* Current Blockers */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-gray-900">Current Blockers</span>
          </div>
          <Input 
            value="Financial acumen certification pending"
            className="border-red-200 bg-red-50 text-red-800"
            readOnly
          />
        </CardContent>
      </Card>

      {/* Development Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Development Actions</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAddActionModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add action
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Action Item */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <GraduationCap className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">Operations Finance</div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="text-xs">Course</Badge>
                      <Badge variant="destructive" className="text-xs">Critical</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Executive education program on operational finance
                    </div>
                    <div className="text-xs text-gray-500">
                      Owner: A. Bello • Due: 2025-08-15
                    </div>
                  </div>
                </div>
                <Badge variant="destructive" className="text-xs">Overdue</Badge>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4 flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Evidence
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  LMS Link
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Review Schedule */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-900">Next review scheduled for 2025-07-15</span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button className="bg-gray-900 hover:bg-gray-800 text-white">
          Update Plan
        </Button>
        <Button variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Report
        </Button>
      </div>

      {/* Upload Evidence Modal */}
      <UploadEvidenceModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadEvidence}
      />

      {/* Add Development Action Modal */}
      <AddDevelopmentActionModal
        isOpen={isAddActionModalOpen}
        onClose={() => setIsAddActionModalOpen(false)}
        onAddAction={handleAddAction}
      />
    </div>
  )
}

export default SuccessorDevelopmentPlanDetailView
