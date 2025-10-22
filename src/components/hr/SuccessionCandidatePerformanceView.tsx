import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'

interface Props {
  onBack: () => void
  candidateName: string
  candidateRole?: string
}

const perfData = [
  { period: '2023 H1', rating: 3.8 },
  { period: '2023 H2', rating: 3.9 },
  { period: '2024 H1', rating: 4.0 },
  { period: '2024 H2', rating: 4.1 },
  { period: '2025 H1', rating: 4.2 },
]

const SuccessionCandidatePerformanceView: React.FC<Props> = ({ onBack, candidateName, candidateRole = 'Operations Manager' }) => {
  const [activeTab, setActiveTab] = React.useState<'overview'|'competencies'|'goals'|'feedback'>('overview')
  const getDot = (val: number) => {
    if (val >= 4.5) return 'bg-emerald-500'
    if (val >= 4.0) return 'bg-blue-500'
    if (val >= 3.5) return 'bg-amber-500'
    return 'bg-rose-500'
  }
  const competencies = [
    {
      group: 'Technical',
      items: [
        { label: 'Technical Expertise', value: 4.5 },
        { label: 'Problem Solving', value: 4.3 },
      ]
    },
    {
      group: 'Leadership',
      items: [
        { label: 'Team Leadership', value: 4.0 },
        { label: 'Strategic Thinking', value: 3.8 },
      ]
    },
    {
      group: 'Business',
      items: [
        { label: 'Stakeholder Management', value: 4.2 },
        { label: 'Financial Acumen', value: 3.5 },
      ]
    },
    {
      group: 'Interpersonal',
      items: [
        { label: 'Communication', value: 4.4 },
        { label: 'Collaboration', value: 4.3 },
      ]
    },
  ]
  const avg = (competencies.flatMap(c=>c.items).reduce((a,b)=>a+b.value,0)/competencies.flatMap(c=>c.items).length).toFixed(2)
  const goals = [
    { title: 'Launch new product feature', progress: 100, status: 'Achieved' },
    { title: 'Improve team efficiency by 20%', progress: 100, status: 'Achieved' },
    { title: 'Complete leadership training', progress: 75, status: 'On Track' },
    { title: 'Mentor 2 junior team members', progress: 100, status: 'Achieved' },
    { title: 'Reduce operational costs by 15%', progress: 60, status: 'On Track' },
  ]
  const feedback = [
    { text: 'Exceptional technical skills and ability to solve complex problems quickly', from: 'Manager', date: '2025-06-15', positive: true },
    { text: 'Great communicator and collaborator across teams', from: 'Peer', date: '2025-05-20', positive: true },
    { text: 'Could benefit from more strategic thinking and long-term planning', from: 'Manager', date: '2025-06-15', positive: false },
    { text: 'Takes initiative and drives projects to completion', from: 'Direct Report', date: '2025-04-10', positive: true },
    { text: 'Sometimes needs to delegate more effectively', from: 'Peer', date: '2025-03-25', positive: false },
  ]
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
        <span>/</span>
        <span>View plan</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold text-foreground">{candidateName}</div>
          <div className="text-sm text-muted-foreground">{candidateRole}</div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Overall Rating</div>
            <div className="mt-2 text-2xl font-bold text-foreground">4.2</div>
            <div className="text-xs text-muted-foreground">vs. previous review +0.2</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Potential</div>
            <div className="mt-2 text-2xl font-bold text-foreground">4.2</div>
            <div className="text-xs text-muted-foreground">High potential</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Goal Achievement</div>
            <div className="mt-2 text-2xl font-bold text-foreground">3/5</div>
            <div className="text-xs text-muted-foreground">60% completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs header */}
      <div className="flex items-center space-x-6 text-sm">
        <button onClick={()=>setActiveTab('overview')} className={`pb-2 font-medium ${activeTab==='overview'?'border-b-2 border-purple-600 text-purple-600':'text-muted-foreground hover:text-foreground'}`}>Overview</button>
        <button onClick={()=>setActiveTab('competencies')} className={`pb-2 font-medium ${activeTab==='competencies'?'border-b-2 border-purple-600 text-purple-600':'text-muted-foreground hover:text-foreground'}`}>Competencies</button>
        <button onClick={()=>setActiveTab('goals')} className={`pb-2 font-medium ${activeTab==='goals'?'border-b-2 border-purple-600 text-purple-600':'text-muted-foreground hover:text-foreground'}`}>Goals</button>
        <button onClick={()=>setActiveTab('feedback')} className={`pb-2 font-medium ${activeTab==='feedback'?'border-b-2 border-purple-600 text-purple-600':'text-muted-foreground hover:text-foreground'}`}>Feedback</button>
      </div>

      {activeTab === 'overview' && (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={perfData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <YAxis domain={[0, 5]} allowDecimals={false} tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <Tooltip cursor={{ stroke: '#8B5CF6', strokeWidth: 1 }} formatter={(v: any) => [`${v}`, 'Rating']} />
                <Line type="monotone" dataKey="rating" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      )}

      {activeTab === 'overview' && (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Review History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {[
            { p: '2025 Mid-Year', r: '4.2', by: 'John Smith', d: '2025-06-30' },
            { p: '2024 Annual', r: '4.0', by: 'John Smith', d: '2024-12-31' },
            { p: '2024 Mid-Year', r: '3.8', by: 'Sarah Johnson', d: '2024-06-30' },
            { p: '2023 Annual', r: '3.7', by: 'Sarah Johnson', d: '2023-12-31' },
          ].map((x, i) => (
            <div key={i} className="flex items-center justify-between border rounded-md p-3">
              <div>
                <div className="font-medium">{x.p}</div>
                <div className="text-muted-foreground">Reviewed by {x.by} • {x.d}</div>
              </div>
              <div className="text-foreground font-semibold">{x.r}</div>
            </div>
          ))}
        </CardContent>
      </Card>
      )}

      {activeTab === 'overview' && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Key Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>Exceptional technical skills and ability to solve complex problems quickly</li>
              <li>Great communicator and collaborator across teams</li>
              <li>Takes initiative and drives projects to completion</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Development Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>Could benefit from more strategic thinking and long-term planning</li>
              <li>Sometimes needs to delegate more effectively</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      )}

      {activeTab === 'competencies' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Competency Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">Average: {avg} / 5.0</div>
            <div className="space-y-6">
              {competencies.map((group, gi) => (
                <div key={gi} className="space-y-3">
                  <div className="font-medium text-foreground">{group.group}</div>
                  {group.items.map((it, ii) => (
                    <div key={ii} className="space-y-1">
                      <div className="text-sm text-muted-foreground">{it.label}</div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-gray-900 h-2 rounded-full" style={{ width: `${(it.value/5)*100}%` }} />
                        </div>
                        <span className={`w-2 h-2 rounded-full ${getDot(it.value)}`} />
                        <span className="text-sm text-foreground" style={{ minWidth: 28 }}>{it.value.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-muted/50 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-foreground mb-3">Rating Scale</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /> <span>4.5-5.0: Exceptional</span></div>
                <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> <span>4.0-4.4: Exceeds</span></div>
                <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-amber-500" /> <span>3.5-3.9: Meets</span></div>
                <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-rose-500" /> <span>&lt;3.5: Below</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'goals' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Current Year Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">2025 Performance Goals • {goals.filter(g=>g.progress===100).length} of {goals.length} achieved</div>
            <div className="space-y-4">
              {goals.map((g, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-foreground">{g.title}</div>
                    <span className={`text-xs px-2 py-1 rounded ${g.status==='Achieved' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-700'}`}>{g.status}</span>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">Progress</div>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-900 h-2 rounded-full" style={{ width: `${g.progress}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground" style={{ minWidth: 32 }}>{g.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'feedback' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">Feedback from managers, peers, and direct reports</div>
            <div className="space-y-4">
              {feedback.map((f, i) => (
                <div key={i} className="border rounded-lg p-4 flex items-start space-x-3">
                  <div className={`mt-1 ${f.positive ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {f.positive ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-foreground">{f.text}</div>
                    <div className="mt-2 flex items-center space-x-3 text-xs text-muted-foreground">
                      <span className={`px-2 py-0.5 rounded border ${f.positive ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>{f.from}</span>
                      <span>{f.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SuccessionCandidatePerformanceView


