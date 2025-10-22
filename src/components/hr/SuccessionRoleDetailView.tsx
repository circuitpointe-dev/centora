import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import SuccessionCandidatePerformanceView from './SuccessionCandidatePerformanceView'
import { useNavigate } from 'react-router-dom'

interface SuccessionRoleDetailViewProps {
  onBack: () => void
  role?: string
}

const SuccessionRoleDetailView: React.FC<SuccessionRoleDetailViewProps> = ({ onBack, role = 'Head of Operations' }) => {
  const [showCandidateView, setShowCandidateView] = React.useState<null | { name: string, role: string }>(null)
  const navigate = useNavigate()
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <button onClick={onBack} className="flex items-center space-x-1 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          <span>Succession planning</span>
        </button>
        <span>/</span>
        <span>Critical plan mapping</span>
        <span>/</span>
        <span>View detail</span>
      </div>

      {/* Role Header */}
      <div className="space-y-1">
        <div className="text-2xl font-bold text-foreground">{role}</div>
        <div className="text-sm text-muted-foreground">View critical role details, successor candidates, and succession planning metrics.</div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-2">
              <div><span className="text-muted-foreground">Role Profile</span></div>
              <div><span className="text-muted-foreground">Incumbent:</span> L. Mensah</div>
              <div><span className="text-muted-foreground">Department:</span> Operations</div>
              <div><span className="text-muted-foreground">Location:</span> New York</div>
              <div><span className="text-muted-foreground">Impact Level:</span> Critical</div>
            </div>
            <div className="space-y-2">
              <div className="text-muted-foreground">Succession Metrics</div>
              <div className="flex items-center justify-between"><span>Ready Now</span><span>0</span></div>
              <div className="flex items-center justify-between"><span>≤12 months</span><span>1</span></div>
              <div className="flex items-center justify-between"><span>≤24 months</span><span>1</span></div>
              <div>
                <div className="flex items-center justify-between"><span>Coverage</span><span>67%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-gray-900 h-2 rounded-full" style={{ width: '67%' }} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Successor candidates */}
      {showCandidateView ? (
        <SuccessionCandidatePerformanceView
          onBack={() => setShowCandidateView(null)}
          candidateName={showCandidateView.name}
          candidateRole={showCandidateView.role}
        />
      ) : (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Successor candidates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { n: 'Alex Bello', role: 'Operations Manager', tag: '≤12 months', perf: '3.8', pot: '4.2', risk: 'Low Flight Risk' },
            { n: 'Sarah Kim', role: 'Senior Engineer', tag: 'Ready Now', perf: '4.1', pot: '4.3', risk: 'Low Flight Risk' },
            { n: 'Ryan Cole', role: 'Sales Director', tag: '≤6 months', perf: '3.9', pot: '4.0', risk: 'Low Flight Risk' },
            { n: 'Maria Rodriguez', role: 'Supply Chain Manager', tag: '≤24 months', perf: '3.6', pot: '4.1', risk: 'Low Flight Risk' },
          ].map((c, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-muted-foreground">{c.n.split(' ').map(p=>p[0]).join('').slice(0,2)}</div>
                <div>
                  <div className="text-sm font-medium text-foreground">{c.n}</div>
                  <div className="text-xs text-muted-foreground">{c.role}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${c.tag.includes('Ready') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{c.tag}</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div>
                  <div className="text-muted-foreground">Performance</div>
                  <div className="text-foreground">{c.perf}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Potential</div>
                  <div className="text-foreground">{c.pot}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-800">{c.risk}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="px-2">⋮</Button>
                  </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem>Assign Dev Plan</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard/hr/succession/candidate-performance')}>View Performance</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-rose-600">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      )}

      {/* Performance x Potential matrix (simplified static UI) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Performance × Potential matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium text-foreground mb-3">Nine-Box Talent Matrix</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="h-32 rounded-lg bg-muted/50 border" />
            <div className="h-32 rounded-lg bg-blue-50 border" />
            <div className="h-32 rounded-lg bg-blue-100 border" />
            <div className="h-32 rounded-lg bg-muted/50 border" />
            <div className="h-32 rounded-lg bg-muted/50 border" />
            <div className="h-32 rounded-lg bg-blue-50 border" />
            <div className="h-32 rounded-lg bg-muted/50 border" />
            <div className="h-32 rounded-lg bg-muted/50 border" />
            <div className="h-32 rounded-lg bg-blue-50 border" />
          </div>
          <div className="mt-4 flex items-start space-x-2 text-sm text-muted-foreground bg-muted/50 border border-gray-200 rounded-md p-3">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
            <span>Matrix Legend: Star/Top Talent, High Potential/Performer, Core Player/Solid, Development Area.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SuccessionRoleDetailView


