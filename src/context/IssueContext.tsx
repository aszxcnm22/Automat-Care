import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Issue = {
  id: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low' | 'Lowest';
  date: string;
  clientName?: string;
  projectName?: string;
  description?: string;
  reporterName?: string;
  contactEmail?: string;
  contactPhone?: string;
  issueDate?: string;
  attachment?: string;
  attachmentUrl?: string;
};

const mockIssues: Issue[] = [
  { id: 'AMC-005', title: 'dddd', status: 'Open', priority: 'Medium', date: '2026-02-21' },
  { id: 'AMC-004', title: 'dd', status: 'Open', priority: 'Low', date: '2026-02-21' },
  { id: 'AMC-001', title: 'Cannot access database', status: 'Open', priority: 'High', date: '2026-02-21', clientName: 'Acme Corp', projectName: 'Website Redesign', description: 'User cannot login to the database.' },
  { id: 'AMC-002', title: 'Login page loading slowly', status: 'In Progress', priority: 'Medium', date: '2026-02-20' },
  { id: 'AMC-003', title: 'Email notification failure', status: 'Resolved', priority: 'Low', date: '2026-02-18' },
];

type IssueContextType = {
  issues: Issue[];
  addIssue: (issue: Issue) => void;
  updateIssueStatus: (id: string, status: 'Open' | 'In Progress' | 'Resolved') => void;
  userProfile: {
    name: string;
    email: string;
    profilePic: string | null;
  };
  updateUserProfile: (profile: { name: string; email: string; profilePic: string | null }) => void;
};

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export function IssueProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [userProfile, setUserProfile] = useState({
    name: localStorage.getItem('userName') || 'คุณธนวัฒน์',
    email: localStorage.getItem('userEmail') || 'thanawat@company.com',
    profilePic: localStorage.getItem('userProfilePic') || null,
  });

  const addIssue = (issue: Issue) => {
    setIssues([issue, ...issues]);
  };

  const updateIssueStatus = (id: string, status: 'Open' | 'In Progress' | 'Resolved') => {
    setIssues(issues.map(issue => issue.id === id ? { ...issue, status } : issue));
  };

  const updateUserProfile = (profile: { name: string; email: string; profilePic: string | null }) => {
    setUserProfile(profile);
    localStorage.setItem('userName', profile.name);
    localStorage.setItem('userEmail', profile.email);
    if (profile.profilePic) {
      localStorage.setItem('userProfilePic', profile.profilePic);
    } else {
      localStorage.removeItem('userProfilePic');
    }
  };

  return (
    <IssueContext.Provider value={{ issues, addIssue, updateIssueStatus, userProfile, updateUserProfile }}>
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
}
