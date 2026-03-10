import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useProjects, Project } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, FolderGit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [projectError, setProjectError] = useState<string | null>(null);

  if (user?.role !== 'Admin') {
    return (
      <Layout>
        <div className="p-8 max-w-7xl mx-auto text-center flex flex-col items-center justify-center h-[60vh]">
          <FolderGit2 size={64} className="text-slate-300 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-500 mt-2">You do not have permission to view this page.</p>
        </div>
      </Layout>
    );
  }

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({ name: project.name, description: project.description });
    } else {
      setEditingProject(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projects.some(p => p.name.toLowerCase() === formData.name.toLowerCase() && p.id !== editingProject?.id)) {
      setProjectError('Project name already exists.');
      return;
    }
    setProjectError(null);
    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      addProject(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (project: Project) => {
    setDeletingProject(project);
  };

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <FolderGit2 className="text-blue-600" size={32} />
              Projects
            </h1>
            <p className="text-slate-500 mt-1">Manage your organization's projects</p>
          </div>
          
          {(user?.role === 'Admin' || user?.role === 'ORG Admin') && (
            <button 
              onClick={() => handleOpenModal()}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/20"
            >
              <Plus size={18} />
              Create Project
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{project.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{project.id}</p>
                </div>
              </div>
              
              <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">{project.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">Created: {project.createdAt}</span>
                
                {(user?.role === 'Admin' || user?.role === 'ORG Admin') && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(project)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(project)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {projects.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
              <FolderGit2 size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">No projects found</h3>
              <p className="text-slate-500">Create your first project to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {projectError && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                    {projectError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    required
                    placeholder="e.g. Website Redesign"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none h-24"
                    placeholder="Brief description of the project..."
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-md shadow-blue-500/20"
                  >
                    {editingProject ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setDeletingProject(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Project?</h3>
              <p className="text-slate-600 mb-6">Are you sure you want to delete <span className="font-semibold">{deletingProject.name}</span>? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setDeletingProject(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    deleteProject(deletingProject.id);
                    setDeletingProject(null);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-md shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
