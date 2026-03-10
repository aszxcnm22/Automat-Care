import React, { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, AlertCircle, CheckCircle2, Clock, ChevronUp, ChevronDown, Equal, FileText, FileArchive, File, Download, Eye, X, ExternalLink, FileSpreadsheet } from 'lucide-react';
import Layout from '../components/Layout';
import { useIssues, Issue } from '../context/IssueContext';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

export default function Tickets() {
  const { issues, addIssue, userProfile } = useIssues();
  const { projects } = useProjects();
  const { user } = useAuth();
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [viewIssue, setViewIssue] = useState<Issue | null>(null);
  const [viewAttachment, setViewAttachment] = useState<{ url: string; name: string; content?: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  // Clean up Blob URL when preview is closed
  useEffect(() => {
    if (!viewAttachment && pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  }, [viewAttachment, pdfBlobUrl]);

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const openInNewTab = (url: string) => {
    if (url.startsWith('data:')) {
      try {
        const blob = dataURLtoBlob(url);
        const bUrl = URL.createObjectURL(blob);
        const win = window.open(bUrl, '_blank');
        if (!win) alert('โปรดอนุญาตให้เปิด Pop-up เพื่อดูไฟล์');
      } catch (e) {
        window.open(url, '_blank');
      }
    } else {
      const win = window.open(url, '_blank');
      if (!win) alert('โปรดอนุญาตให้เปิด Pop-up เพื่อดูไฟล์');
    }
  };

  const getCompanyNameFromEmail = (email: string) => {
    if (!email) return '';
    const domain = email.split('@')[1];
    if (!domain) return '';
    const name = domain.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // New Issue Form State
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [issueDesc, setIssueDesc] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (showNewIssue) {
        if (user?.role === 'Admin') {
            setClientName(''); // Admin can type anything
        } else if (user?.group) {
            setClientName(user.group); // Pre-fill for others
        } else {
            setClientName(getCompanyNameFromEmail(userProfile.email));
        }
    }
  }, [showNewIssue, user, userProfile.email]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFileError(null);

    if (file) {
      // Validate file type
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'txt', 'log', 'zip', 'xlsx', 'csv'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        setFileError('Invalid file type. Allowed: jpg, png, pdf, txt, log, zip, xlsx, csv');
        setAttachment(null);
        setAttachmentUrl(null);
        e.target.value = ''; // Reset input
        return;
      }

      // Validate file size (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setFileError('File size exceeds 10MB limit.');
        setAttachment(null);
        setAttachmentUrl(null);
        e.target.value = ''; // Reset input
        return;
      }

      setAttachment(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachment(null);
      setAttachmentUrl(null);
    }
  };

  const handleSubmitIssue = (e: FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate title or description
    const duplicateIssue = issues.find(
      (issue) => 
        issue.projectName === projectName && issue.title.toLowerCase() === issueTitle.toLowerCase()
    );

    if (duplicateIssue) {
      setDuplicateWarning(`Warning: An issue with this Project Name and Title already exists (Ticket ID: ${duplicateIssue.id}).`);
      return;
    }

    const newIssue: Issue = {
      id: `AMC-00${issues.length + 1}`,
      title: issueTitle,
      date: new Date().toISOString().split('T')[0],
      clientName,
      group: clientName, // Use clientName as group
      projectName,
      description: issueDesc,
      reporterName: userProfile.name,
      contactEmail: userProfile.email,
      contactPhone,
      issueDate,
      attachment: attachment ? attachment.name : undefined,
      attachmentUrl: attachmentUrl || undefined
    };
    addIssue(newIssue);
    setShowNewIssue(false);
    // Reset form
    setClientName('');
    setProjectName('');
    setIssueTitle('');
    setDuplicateWarning(null);
    setContactPhone('');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setIssueDesc('');
    setAttachment(null);
    setAttachmentUrl(null);
  };



  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        ease: "easeOut"
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
        issue.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role-based filtering
    let matchesGroup = true;
    if (user?.role !== 'Admin') {
        // For ORG Admin and Member, only show tickets from their group
        // We check both 'group' field and 'clientName' for backward compatibility or if group isn't set
        matchesGroup = issue.group === user?.group || issue.clientName === user?.group;
    }

    return matchesSearch && matchesGroup;
  });

  return (
    <Layout>
      <div className="w-full min-w-0">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Ticket Board</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track your reported issues.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewIssue(true)}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
        >
          <Plus size={18} />
          Report New Issue
        </motion.button>
      </motion.div>

      {/* Issues List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
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
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Ticket ID</th>
                <th className="px-6 py-3 font-medium">Project Name</th>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Detailed Description</th>
                <th className="px-6 py-3 font-medium">Date Reported</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={container}
              initial="hidden"
              animate="show"
              className="divide-y divide-gray-200"
            >
              {filteredIssues.map((issue) => (
                <motion.tr 
                  key={issue.id} 
                  variants={item}
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{issue.id}</td>
                  <td className="px-6 py-4 text-gray-700">{issue.projectName || '-'}</td>
                  <td className="px-6 py-4 text-gray-700">{issue.title}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={issue.description}>{issue.description || '-'}</td>
                  <td className="px-6 py-4 text-gray-500">{issue.date}</td>
                  <td className="px-6 py-4 text-right">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewIssue(issue)}
                      className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      View
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
              {filteredIssues.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    ไม่พบข้อมูล Ticket ที่ค้นหา
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </motion.div>

      {/* New Issue Modal */}
      <AnimatePresence>
        {showNewIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
                <h3 className="text-lg font-semibold text-gray-900">Report New Issue</h3>
                <button 
                  onClick={() => setShowNewIssue(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmitIssue} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${user?.role !== 'Admin' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                    required
                    readOnly={user?.role !== 'Admin'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-shadow"
                    required
                  >
                    <option value="" disabled>Select a project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.name}>{project.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={issueTitle}
                    onChange={(e) => {
                      setIssueTitle(e.target.value);
                      setDuplicateWarning(null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    required
                  />
                </div>

                {duplicateWarning && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                    {duplicateWarning}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    value={contactPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setContactPhone(value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-shadow"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                  <motion.div 
                    whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                    className={`border-2 border-dashed rounded-md p-4 text-center transition-colors cursor-pointer relative ${fileError ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  >
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.pdf,.txt,.log,.zip,.xlsx,.csv"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-1">
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
                      <p className="text-[10px] text-gray-400">
                        Allowed: JPG, PNG, PDF, TXT, LOG, ZIP, XLSX, CSV (Max 10MB)
                      </p>
                    </div>
                  </motion.div>
                  {fileError && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{fileError}</p>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowNewIssue(false)}
                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    Submit
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Issue Modal */}
      <AnimatePresence>
        {viewIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-[10px] text-white">T</div>
                  <span>{viewIssue.projectName || 'PROJECT'}</span>
                  <span>/</span>
                  <span className="text-gray-900">{viewIssue.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setViewIssue(null)}
                    className="p-1.5 hover:bg-gray-200 rounded-md text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{viewIssue.id}</p>
                    <h4 className="text-xl font-bold text-gray-900 mt-1">{viewIssue.title}</h4>
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
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-3 font-medium">Attachments</p>
                  {viewIssue.attachment ? (
                    <div className="flex flex-wrap gap-4">
                      {/* Jira Style Attachment Card */}
                      <div className="group relative w-48 border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-all duration-200">
                        <div className="h-28 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100 relative">
                          {(() => {
                            const ext = viewIssue.attachment?.split('.').pop()?.toLowerCase();
                            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '') && viewIssue.attachmentUrl) {
                              return <img src={viewIssue.attachmentUrl} alt="thumb" className="w-full h-full object-cover" />;
                            }
                            if (ext === 'pdf') return <FileText size={32} className="text-red-500" />;
                            if (['xlsx', 'csv'].includes(ext || '')) return <FileSpreadsheet size={32} className="text-green-500" />;
                            if (ext === 'zip') return <FileArchive size={32} className="text-blue-500" />;
                            return <File size={32} className="text-gray-400" />;
                          })()}
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            {(() => {
                              const ext = viewIssue.attachment?.split('.').pop()?.toLowerCase();
                              return (
                                <button 
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    const fileName = viewIssue.attachment || 'file';
                                    const url = viewIssue.attachmentUrl || 'https://picsum.photos/seed/attachment/800/600';
                                    
                                    // Handle PDF separately to avoid Chrome blocking data URLs in iframes
                                    if (ext === 'pdf' && url.startsWith('data:')) {
                                      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
                                      const blob = dataURLtoBlob(url);
                                      const bUrl = URL.createObjectURL(blob);
                                      setPdfBlobUrl(bUrl);
                                      setViewAttachment({ url: bUrl, name: fileName });
                                      return;
                                    }

                                    if (['txt', 'log', 'csv'].includes(ext || '') && viewIssue.attachmentUrl?.startsWith('data:')) {
                                      try {
                                        const base64Content = viewIssue.attachmentUrl.split(',')[1];
                                        const text = decodeURIComponent(escape(atob(base64Content)));
                                        setViewAttachment({ url, name: fileName, content: text });
                                      } catch (err) {
                                        setViewAttachment({ url, name: fileName });
                                      }
                                    } else {
                                      setViewAttachment({ url, name: fileName });
                                    }
                                  }}
                                  className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 shadow-sm transition-colors"
                                  title="View"
                                >
                                  <Eye size={18} />
                                </button>
                              );
                            })()}
                            <a 
                              href={viewIssue.attachmentUrl} 
                              download={viewIssue.attachment}
                              className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 shadow-sm transition-colors"
                              title="Download"
                              onClick={(e) => !viewIssue.attachmentUrl && e.preventDefault()}
                            >
                              <Download size={18} />
                            </a>
                          </div>
                        </div>
                        <div className="p-3 bg-white">
                          <p className="text-xs font-semibold text-gray-900 truncate" title={viewIssue.attachment}>
                            {viewIssue.attachment}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">
                            {viewIssue.attachment?.split('.').pop()} File
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 text-center">
                      <p className="text-sm text-gray-400 italic">No attachments found</p>
                    </div>
                  )}
                </div>

                <div className="mt-6">
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
      </AnimatePresence>

      {/* Attachment Preview Modal (Jira Style Media Viewer) */}
      <AnimatePresence>
        {viewAttachment && (
          <div 
            className="fixed inset-0 bg-[#091E42]/95 z-[60] flex flex-col"
            onClick={() => setViewAttachment(null)}
          >
            {/* Jira Style Header */}
            <div 
              className="h-14 bg-[#091E42] border-b border-white/10 flex items-center justify-between px-6 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                  {(() => {
                    const ext = viewAttachment.name.split('.').pop()?.toLowerCase();
                    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return <Eye size={16} className="text-blue-400" />;
                    if (ext === 'pdf') return <FileText size={16} className="text-red-400" />;
                    if (['xlsx', 'csv'].includes(ext || '')) return <FileSpreadsheet size={16} className="text-green-400" />;
                    if (ext === 'zip') return <FileArchive size={16} className="text-blue-400" />;
                    return <File size={16} className="text-gray-400" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm truncate max-w-md">{viewAttachment.name}</h3>
                  <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">
                    {viewAttachment.name.split('.').pop()} File
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openInNewTab(viewAttachment.url)}
                  className="h-9 px-4 bg-white/10 hover:bg-white/20 text-white rounded flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <ExternalLink size={16} />
                  Open in New Tab
                </button>
                <a 
                  href={viewAttachment.url} 
                  download={viewAttachment.name}
                  className="h-9 px-4 bg-white/10 hover:bg-white/20 text-white rounded flex items-center gap-2 text-sm font-medium transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={16} />
                  Download
                </a>
                <button 
                  onClick={() => setViewAttachment(null)}
                  className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded transition-all"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
            </div>

            {/* Viewer Area */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex items-center justify-center p-8 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full flex items-center justify-center">
                {(() => {
                  const ext = viewAttachment.name.split('.').pop()?.toLowerCase();
                  
                  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
                    return (
                      <img 
                        src={viewAttachment.url} 
                        alt="Preview" 
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                        referrerPolicy="no-referrer"
                      />
                    );
                  }
                  
                  if (ext === 'pdf') {
                    return (
                      <div className="w-full h-full bg-white rounded shadow-2xl overflow-hidden flex flex-col relative">
                        <object 
                          data={viewAttachment.url} 
                          type="application/pdf" 
                          className="w-full h-full"
                        >
                          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                            <FileText size={48} className="text-gray-200 mb-4" />
                            <p className="text-gray-600 mb-4 font-medium">ไม่สามารถแสดงตัวอย่าง PDF ได้ในเบราว์เซอร์นี้</p>
                            <button 
                              onClick={() => openInNewTab(viewAttachment.url)}
                              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md font-medium active:scale-95"
                            >
                              เปิดไฟล์ในหน้าต่างใหม่
                            </button>
                          </div>
                        </object>
                      </div>
                    );
                  }
                  
                  if (viewAttachment.content) {
                    return (
                      <div className="w-full max-w-4xl h-full bg-white rounded shadow-2xl p-8 overflow-auto font-mono text-sm text-gray-800">
                        <pre className="whitespace-pre-wrap">{viewAttachment.content}</pre>
                      </div>
                    );
                  }

                  return (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl max-w-md mx-auto">
                      {(() => {
                        if (['xlsx', 'csv'].includes(ext || '')) return <FileSpreadsheet size={64} className="text-green-400 mb-6" />;
                        if (ext === 'zip') return <FileArchive size={64} className="text-blue-400 mb-6" />;
                        return <File size={64} className="text-gray-400 mb-6" />;
                      })()}
                      <h3 className="text-xl font-semibold text-white mb-2">ไม่มีตัวอย่างสำหรับไฟล์นี้</h3>
                      <p className="text-white/70 mb-8 text-sm leading-relaxed">
                        เบราว์เซอร์ไม่สามารถแสดงตัวอย่างไฟล์ประเภทนี้ได้โดยตรง กรุณาเปิดไฟล์ในหน้าต่างใหม่หรือดาวน์โหลดลงเครื่อง
                      </p>
                      <button 
                        onClick={() => openInNewTab(viewAttachment.url)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg font-medium flex items-center gap-2 active:scale-95"
                      >
                        <ExternalLink size={18} />
                        เปิดไฟล์ในหน้าต่างใหม่
                      </button>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </Layout>
  );
}
