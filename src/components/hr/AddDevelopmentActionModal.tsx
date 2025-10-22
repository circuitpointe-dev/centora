import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Target, Users, GraduationCap, Building, Settings, CheckCircle, X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onAddAction: (action: { title: string; type: string; duration: string }) => void
}

const AddDevelopmentActionModal: React.FC<Props> = ({ isOpen, onClose, onAddAction }) => {
  const [mounted, setMounted] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const developmentActions = [
    {
      id: 'cross-functional-rotation',
      title: 'Cross-functional rotation',
      type: 'Rotation',
      duration: '3 months',
      icon: Target,
      description: 'Gain experience across different departments'
    },
    {
      id: 'executive-mentorship',
      title: 'Executive mentorship',
      type: 'Mentorship',
      duration: '6 months',
      icon: Users,
      description: 'Work with senior leadership for guidance'
    },
    {
      id: 'leadership-development',
      title: 'Leadership development program',
      type: 'Course',
      duration: '12 weeks',
      icon: GraduationCap,
      description: 'Structured program for leadership skills'
    },
    {
      id: 'strategic-initiative',
      title: 'Strategic initiative ownership',
      type: 'Project',
      duration: '6 months',
      icon: Building,
      description: 'Lead a strategic business initiative'
    },
    {
      id: 'technical-skill',
      title: 'Technical skill development',
      type: 'Skill',
      duration: '3 months',
      icon: Settings,
      description: 'Enhance technical capabilities'
    }
  ]

  const handleAddAction = () => {
    if (selectedAction) {
      const action = developmentActions.find(a => a.id === selectedAction)
      if (action) {
        onAddAction({
          title: action.title,
          type: action.type,
          duration: action.duration
        })
      }
    }
    setSelectedAction(null)
    onClose()
  }

  const handleCancel = () => {
    setSelectedAction(null)
    onClose()
  }

  return (
    <>
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          {/* Blurred Background Overlay */}
          <div 
            className="absolute inset-0 bg-background/30 backdrop-blur-md"
            onClick={onClose}
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          />
          
          {/* Modal Content */}
          <div className="relative bg-card rounded-lg shadow-lg w-full max-w-md mx-4 h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Add development action</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a template to quickly add a development action to the plan.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Scrollable Action Templates List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {developmentActions.map((action) => {
                const IconComponent = action.icon
                const isSelected = selectedAction === action.id
                
                return (
                  <div
                    key={action.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-border hover:border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedAction(action.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
                        }`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <div className={`font-medium ${
                            isSelected ? 'text-green-900' : 'text-foreground'
                          }`}>
                            {action.title}
                          </div>
                          <div className={`text-sm ${
                            isSelected ? 'text-green-700' : 'text-muted-foreground'
                          }`}>
                            {action.type} • {action.duration}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between p-6 border-t flex-shrink-0">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddAction}
                disabled={!selectedAction}
                className="bg-foreground hover:bg-muted-foreground text-background"
              >
                Add action
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default AddDevelopmentActionModal
