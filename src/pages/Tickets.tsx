import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, AlertCircle, CheckCircle2, Clock, ChevronUp, ChevronDown, Equal } from 'lucide-react';
import Layout from '../components/Layout';
import { useIssues, Issue } from '../context/IssueContext';

export default function Tickets() {
  const { issues, addIssue, updateIssueStatus, userProfile } = useIssues();
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [viewIssue, setViewIssue] = useState<Issue | null>(null);
  const [viewImageUrl, setViewImageUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const getCompanyNameFromEmail = (email: string) => {
    if (!email) return '';
    const domain = email.split('@')[1];
    if (!domain) return '';
    const name = domain.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // New Issue Form State
  const [clientName, setClientName] = useState(getCompanyNameFromEmail(userProfile.email));
  const [projectName, setProjectName] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [reporterName, setReporterName] = useState(userProfile.name);
  const [contactEmail, setContactEmail] = useState(userProfile.email);
  const [contactPhone, setContactPhone] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [issueDesc, setIssueDesc] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setAttachment(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachmentUrl(null);
    }
  };

  const handleSubmitIssue = (e: FormEvent) => {
    e.preventDefault();
    const newIssue: Issue = {
      id: `ISS-00${issues.length + 1}`,
      title: issueTitle,
      status: 'Open',
      priority: 'Medium', // Defaulting to Medium as it's not in the new form
      date: new Date().toISOString().split('T')[0],
      clientName,
      projectName,
      description: issueDesc,
      reporterName,
      contactEmail,
      contactPhone,
      issueDate,
      attachment: attachment ? attachment.name : undefined,
      attachmentUrl: attachmentUrl || undefined
    };
    addIssue(newIssue);
    setShowNewIssue(false);
    // Reset form
    setClientName(getCompanyNameFromEmail(userProfile.email));
    setProjectName('');
    setIssueTitle('');
    setReporterName(userProfile.name);
    setContactEmail(userProfile.email);
    setContactPhone('');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setIssueDesc('');
    setAttachment(null);
    setAttachmentUrl(null);
  };

  const handleUpdateStatus = (id: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    updateIssueStatus(id, newStatus);
    if (viewIssue && viewIssue.id === id) {
      setViewIssue({ ...viewIssue, status: newStatus });
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <div className="flex items-center gap-2"><ChevronUp className="text-red-500" size={16} /><span className="text-gray-700">High</span></div>;
      case 'Medium':
        return <div className="flex items-center gap-2"><Equal className="text-orange-500" size={16} /><span className="text-gray-700">Medium</span></div>;
      case 'Low':
        return <div className="flex items-center gap-2"><ChevronDown className="text-blue-500" size={16} /><span className="text-gray-700">Low</span></div>;
      case 'Lowest':
        return <div className="flex items-center gap-2"><div className="flex flex-col -space-y-2"><ChevronDown className="text-blue-400" size={16} /><ChevronDown className="text-blue-400" size={16} /></div><span className="text-gray-700">Lowest</span></div>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Ticket Board</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track your reported issues.</p>
        </div>
        <button 
          onClick={() => setShowNewIssue(true)}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
        >
          <Plus size={18} />
          Report New Issue
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Open Issues</p>
            <p className="text-3xl font-bold text-slate-900">{issues.filter(i => i.status === 'Open').length}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">In Progress</p>
            <p className="text-3xl font-bold text-slate-900">{issues.filter(i => i.status === 'In Progress').length}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Resolved</p>
            <p className="text-3xl font-bold text-slate-900">{issues.filter(i => i.status === 'Resolved').length}</p>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <h2 className="font-semibold text-gray-900">Recent Tickets</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Ticket ID</th>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Priority</th>
                <th className="px-6 py-3 font-medium">Date Reported</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {issues.filter(issue => 
                issue.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                issue.title.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{issue.id}</td>
                  <td className="px-6 py-4 text-gray-700">{issue.title}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${issue.status === 'Open' ? 'bg-red-100 text-red-800' : 
                        issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getPriorityIcon(issue.priority)}</td>
                  <td className="px-6 py-4 text-gray-500">{issue.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setViewIssue(issue)}
                      className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-all duration-200 active:scale-95"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {issues.filter(issue => 
                issue.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                issue.title.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    ไม่พบข้อมูล Ticket ที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Issue Modal */}
      {showNewIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Report New Issue</h3>
              <button 
                onClick={() => setShowNewIssue(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitIssue} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <select 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="" disabled>Select a project</option>
                  <option value="Website Redesign">Website Redesign</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Database Migration">Database Migration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reporter Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Issue <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                    {attachment ? (
                      <span className="text-blue-600 font-medium">{attachment.name}</span>
                    ) : (
                      <>
                        <span>Drop file to upload here</span>
                        <Plus size={16} />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowNewIssue(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Issue Modal */}
      {viewIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Ticket Details</h3>
              <button 
                onClick={() => setViewIssue(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{viewIssue.id}</p>
                  <h4 className="text-xl font-bold text-gray-900 mt-1">{viewIssue.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${viewIssue.status === 'Open' ? 'bg-red-100 text-red-800' : 
                      viewIssue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`}
                  >
                    {viewIssue.status}
                  </span>
                  {getPriorityIcon(viewIssue.priority)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Date Reported</p>
                  <p className="font-medium text-gray-900">{viewIssue.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company Name</p>
                  <p className="font-medium text-gray-900">{viewIssue.clientName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Project Name</p>
                  <p className="font-medium text-gray-900">{viewIssue.projectName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reporter Name</p>
                  <p className="font-medium text-gray-900">{viewIssue.reporterName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Email</p>
                  <p className="font-medium text-gray-900">{viewIssue.contactEmail || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Phone</p>
                  <p className="font-medium text-gray-900">{viewIssue.contactPhone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Issue</p>
                  <p className="font-medium text-gray-900">{viewIssue.issueDate || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Attachment</p>
                  {viewIssue.attachment ? (
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (viewIssue.attachmentUrl) {
                          setViewImageUrl(viewIssue.attachmentUrl);
                        } else {
                          // For mock issues without a real URL, show a placeholder
                          setViewImageUrl('https://picsum.photos/seed/attachment/800/600');
                        }
                      }} 
                      className="font-medium text-blue-600 hover:underline break-all inline-block"
                    >
                      {viewIssue.attachment}
                    </a>
                  ) : (
                    <p className="font-medium text-gray-900">-</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 min-h-[100px]">
                  {viewIssue.description || 'No description provided.'}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button 
                  onClick={() => setViewIssue(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Image Modal */}
      {viewImageUrl && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setViewImageUrl(null)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setViewImageUrl(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2"
            >
              <span className="text-3xl">&times;</span>
            </button>
            <img 
              src={viewImageUrl} 
              alt="Attachment Preview" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      )}
    </Layout>
  );
}
