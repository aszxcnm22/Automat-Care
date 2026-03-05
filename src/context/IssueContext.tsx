import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Issue = {
  id: string;
  title: string;
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
  group?: string;
};

const mockIssues: Issue[] = [
  { id: 'AMC-005', title: 'dddd', date: '2026-02-21', group: 'Global Tech Holdings' },
  { id: 'AMC-004', title: 'dd', date: '2026-02-21', group: 'Green Energy Group' },
  { id: 'AMC-001', title: 'Cannot access database', date: '2026-02-21', clientName: 'Acme Corp', projectName: 'Website Redesign', description: 'User cannot login to the database.', group: 'Global Tech Holdings' },
  { id: 'AMC-002', title: 'Login page loading slowly', date: '2026-02-20', group: 'Retail Giant Corp' },
  { id: 'AMC-003', title: 'Email notification failure', date: '2026-02-18', group: 'Global Tech Holdings' },
];

type IssueContextType = {
  issues: Issue[];
  addIssue: (issue: Issue) => void;
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
    <IssueContext.Provider value={{ issues, addIssue, userProfile, updateUserProfile }}>
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
