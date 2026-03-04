import React from 'react';
import Layout from '../components/Layout';
import { AlertCircle, CheckCircle2, Clock, BarChart3, Activity } from 'lucide-react';
import { useIssues } from '../context/IssueContext';

export default function Dashboard() {
  const { issues } = useIssues();

  const openIssues = issues.filter(i => i.status === 'Open').length;
  const inProgressIssues = issues.filter(i => i.status === 'In Progress').length;
  const resolvedIssues = issues.filter(i => i.status === 'Resolved').length;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of the system and status of all issues</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Open Issues</p>
            <p className="text-3xl font-bold text-slate-900">{openIssues}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">In Progress</p>
            <p className="text-3xl font-bold text-slate-900">{inProgressIssues}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Resolved</p>
            <p className="text-3xl font-bold text-slate-900">{resolvedIssues}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-blue-500" />
            <h2 className="text-lg font-semibold">Latest Activity</h2>
          </div>
          <div className="space-y-4">
            {issues.slice(0, 3).map((issue) => (
              <div key={issue.id} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New Ticket Created ({issue.id})</p>
                  <p className="text-xs text-gray-500 mt-1">{issue.date === new Date().toISOString().split('T')[0] ? 'Today' : issue.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-gray-400">
          <BarChart3 size={48} className="mb-4 opacity-50" />
          <p>Area for displaying statistics charts</p>
        </div>
      </div>
    </Layout>
  );
}
