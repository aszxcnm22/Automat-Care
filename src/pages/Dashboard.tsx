import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { BarChart3, Activity, Download } from 'lucide-react';
import { useIssues } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { issues } = useIssues();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'Admin') {
        navigate('/tickets');
    }
  }, [user, navigate]);

  if (user?.role !== 'Admin') {
      return null; // Or a loading spinner
  }

  const generateCSV = (headers: string[], rows: any[][], fileName: string) => {
    const csvContent =
      [headers, ...rows]
        .map(row => row.map(field => `"${field ?? ''}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllIssues = () => {
    if (!issues.length) return;

    const headers = ['ID', 'Title', 'Description', 'Date'];
    const rows = issues.map(issue => [
      issue.id,
      issue.title,
      issue.description,
      issue.date
    ]);

    generateCSV(headers, rows, `issues-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadSummary = () => {
    const headers = ['Metric', 'Count'];
    const rows = [
      ['Total Issues', issues.length],
    ];

    generateCSV(headers, rows, `dashboard-summary-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <Layout>
      <div className="w-full min-w-0">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Overview of the system and all issues
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadAllIssues}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              <Download size={18} />
              Download All CSV
            </button>

            <button
              onClick={downloadSummary}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              <Download size={18} />
              Download Summary CSV
            </button>
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
                <div
                  key={issue.id}
                  className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New Ticket Created ({issue.id})
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {issue.date === new Date().toISOString().split('T')[0]
                        ? 'Today'
                        : issue.date}
                    </p>
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
      </div>
    </Layout>
  );
}