import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const mockProjects: Project[] = [
  { id: 'PRJ-001', name: 'Website Redesign', description: 'Redesigning the main corporate website', createdAt: '2026-01-15' },
  { id: 'PRJ-002', name: 'Mobile App Development', description: 'Developing the new iOS and Android app', createdAt: '2026-02-01' },
  { id: 'PRJ-003', name: 'Database Migration', description: 'Migrating legacy database to cloud', createdAt: '2026-02-20' },
];

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : mockProjects;
  });

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `PRJ-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updatedData: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
