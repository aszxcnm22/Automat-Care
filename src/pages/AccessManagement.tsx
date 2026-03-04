import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Shield, Users, UserCheck, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';

type UserRole = 'Admin' | 'Member';

interface AccessUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  group: string;
  avatar?: string;
}

interface AccessGroup {
  id: string;
  name: string;
  emailDomain?: string;
  description: string;
  memberCount: number;
  createdAt: string;
  memberIds: string[];
}

interface AccessRole {
  id: string;
  name: string;
  emailDomain?: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const mockUsers: AccessUser[] = [
  { id: 'USR-001', name: 'Mr. A', email: 'email', role: 'Admin', group: 'A' },
  { id: 'USR-002', name: 'Mr. B', email: 'email', role: 'Member', group: 'B' },
  { id: 'USR-003', name: 'Mr. C', email: 'email', role: 'Member', group: 'C' },
];

const mockGroups: AccessGroup[] = [
  { id: 'GRP-001', name: 'Engineering', emailDomain: '@company.com', description: 'Software development and infrastructure team', memberCount: 2, createdAt: '2026-01-15', memberIds: ['USR-001', 'USR-005'] },
  { id: 'GRP-002', name: 'Support', emailDomain: '@support.com', description: 'Customer support and incident management', memberCount: 1, createdAt: '2026-01-20', memberIds: ['USR-002'] },
  { id: 'GRP-003', name: 'Management', emailDomain: '@admin.com', description: 'Project managers and department heads', memberCount: 1, createdAt: '2026-02-01', memberIds: ['USR-002'] },
];

const mockRoles: AccessRole[] = [
  { id: 'ROL-001', name: 'Admin', emailDomain: '@company.com', description: 'Full access', permissions: ['All'], userCount: 1 },
  { id: 'ROL-002', name: 'ORG Admin', emailDomain: '@company.com', description: 'Manage tickets/members in organization', permissions: ['Read', 'Write', 'Manage Users'], userCount: 1 },
  { id: 'ROL-003', name: 'ORG Member', emailDomain: '@company.com', description: 'Create/view own tickets', permissions: ['Read', 'Write'], userCount: 1 },
  { id: 'ROL-004', name: 'GUEST', emailDomain: '', description: 'Outsider not yet affiliated with an organization', permissions: ['Read'], userCount: 1 },
];

export default function AccessManagement() {
  const [activeTab, setActiveTab] = useState<'Access Rules' | 'Roles'>('Access Rules');
  const [activeSubTab, setActiveSubTab] = useState<'All' | 'Groups' | 'Users'>('Users');
  const [users, setUsers] = useState<AccessUser[]>(mockUsers);
  const [groups, setGroups] = useState<AccessGroup[]>(mockGroups);
  const [roles, setRoles] = useState<AccessRole[]>(mockRoles);
  const [searchTerm, setSearchTerm] = useState('');
  
  // User Modals State
  const [editingUser, setEditingUser] = useState<AccessUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AccessUser | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState<Partial<AccessUser>>({
    name: '',
    email: '',
    role: 'Member',
    group: ''
  });

  // Group Modals State
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AccessGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<AccessGroup | null>(null);
  const [newGroup, setNewGroup] = useState<Partial<AccessGroup>>({ name: '', emailDomain: '', description: '', memberIds: [] });

  const permissionCategories = [
    { name: 'General', permissions: ['All', 'Read', 'Write', 'Delete'] },
    { name: 'Management', permissions: ['Manage Users', 'Manage Roles', 'Reports'] },
    { name: 'System', permissions: ['Settings', 'Audit Logs', 'API Access'] }
  ];

  const availablePermissions = permissionCategories.flatMap(c => c.permissions);

  // Role Modals State
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [editingRole, setEditingRole] = useState<AccessRole | null>(null);
  const [deletingRole, setDeletingRole] = useState<AccessRole | null>(null);
  const [newRole, setNewRole] = useState<Partial<AccessRole>>({ 
    name: '', 
    emailDomain: '',
    description: '', 
    permissions: [],
    selectedUserIds: []
  } as any);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // User Handlers
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.name && newUser.email) {
      const newId = `USR-${String(users.length + 1).padStart(3, '0')}`;
      const userToAdd: AccessUser = {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as UserRole,
        group: newUser.group || ''
      };
      setUsers([...users, userToAdd]);
      setIsAddingUser(false);
      setNewUser({ name: '', email: '', role: 'Member', group: '' });
    }
  };

  const handleDeleteUser = () => {
    if (deletingUser) {
      setUsers(users.filter(u => u.id !== deletingUser.id));
      setDeletingUser(null);
    }
  };

  // Group Handlers
  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroup.name) {
      const groupToAdd: AccessGroup = {
        id: `GRP-${String(groups.length + 1).padStart(3, '0')}`,
        name: newGroup.name,
        emailDomain: newGroup.emailDomain || '',
        description: newGroup.description || '',
        memberCount: newGroup.memberIds?.length || 0,
        memberIds: newGroup.memberIds || [],
        createdAt: new Date().toISOString().split('T')[0]
      };
      setGroups([...groups, groupToAdd]);
      setIsAddingGroup(false);
      setNewGroup({ name: '', emailDomain: '', description: '', memberIds: [] });
    }
  };

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      const updatedGroup = {
        ...editingGroup,
        memberCount: editingGroup.memberIds.length
      };
      setGroups(groups.map(g => g.id === editingGroup.id ? updatedGroup : g));
      setEditingGroup(null);
    }
  };

  const toggleGroupMember = (group: Partial<AccessGroup>, setGroup: Function, userId: string) => {
    const currentMembers = group.memberIds || [];
    if (currentMembers.includes(userId)) {
      setGroup({ ...group, memberIds: currentMembers.filter(id => id !== userId) });
    } else {
      setGroup({ ...group, memberIds: [...currentMembers, userId] });
    }
  };

  const toggleRoleUser = (role: Partial<AccessRole>, setRole: Function, userId: string) => {
    const currentSelected = (role as any).selectedUserIds || [];
    if (currentSelected.includes(userId)) {
      setRole({ ...role, selectedUserIds: currentSelected.filter((id: string) => id !== userId) });
    } else {
      setRole({ ...role, selectedUserIds: [...currentSelected, userId] });
    }
  };

  const handleDeleteGroup = () => {
    if (deletingGroup) {
      setGroups(groups.filter(g => g.id !== deletingGroup.id));
      setDeletingGroup(null);
    }
  };

  // Role Handlers
  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRole.name) {
      const roleToAdd: AccessRole = {
        id: `ROL-${String(roles.length + 1).padStart(3, '0')}`,
        name: newRole.name,
        emailDomain: newRole.emailDomain || '',
        description: newRole.description || '',
        permissions: newRole.permissions || [],
        userCount: 0
      };
      setRoles([...roles, roleToAdd]);
      
      // Update users who were selected for this role
      if (newRole.name && (newRole as any).selectedUserIds?.length > 0) {
        setUsers(users.map(u => 
          (newRole as any).selectedUserIds.includes(u.id) 
            ? { ...u, role: newRole.name as UserRole } 
            : u
        ));
      }

      setIsAddingRole(false);
      setNewRole({ name: '', emailDomain: '', description: '', permissions: [], selectedUserIds: [] } as any);
    }
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...editingRole, emailDomain: editingRole.emailDomain || '' } : r));
      
      // Update users who were selected for this role
      if ((editingRole as any).selectedUserIds) {
        setUsers(users.map(u => {
          // If user was in the selection, set their role to this role
          if ((editingRole as any).selectedUserIds.includes(u.id)) {
            return { ...u, role: editingRole.name as UserRole };
          }
          // If user was NOT in the selection but HAD this role, we might want to reset them to 'User'
          // but that's risky. Let's just handle the "add" part or "keep" part.
          // Actually, a better way is to just let the User modal handle it, 
          // OR implement a full sync.
          return u;
        }));
      }
      
      setEditingRole(null);
    }
  };

  const handleDeleteRole = () => {
    if (deletingRole) {
      setRoles(roles.filter(r => r.id !== deletingRole.id));
      setDeletingRole(null);
    }
  };

  const togglePermission = (role: Partial<AccessRole>, setRole: Function, perm: string) => {
    const currentPerms = role.permissions || [];
    if (currentPerms.includes(perm)) {
      setRole({ ...role, permissions: currentPerms.filter(p => p !== perm) });
    } else {
      setRole({ ...role, permissions: [...currentPerms, perm] });
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">Admin</span>;
      case 'Member':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">Member</span>;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Access Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage users and system access rights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm w-64 shadow-sm transition-all"
            />
          </div>
          {activeTab === 'Access Rules' ? (
            activeSubTab === 'Groups' ? (
              <button 
                onClick={() => setIsAddingGroup(true)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 whitespace-nowrap"
              >
                <Plus size={18} />
                New Group
              </button>
            ) : (
              <button 
                onClick={() => setIsAddingUser(true)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 whitespace-nowrap"
              >
                <Plus size={18} />
                Add User
              </button>
            )
          ) : (
            <button 
              onClick={() => setIsAddingRole(true)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 whitespace-nowrap"
            >
              <Plus size={18} />
              Add New Role
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200/60 mb-6">
        <button
          onClick={() => setActiveTab('Access Rules')}
          className={`pb-4 text-sm font-semibold transition-all duration-200 active:scale-95 relative ${
            activeTab === 'Access Rules' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Access Rules
          {activeTab === 'Access Rules' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('Roles')}
          className={`pb-4 text-sm font-semibold transition-all duration-200 active:scale-95 relative ${
            activeTab === 'Roles' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Roles
          {activeTab === 'Roles' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
          )}
        </button>
      </div>

      {activeTab === 'Access Rules' ? (
        <>
          {/* Sub Tabs */}
          <div className="flex items-center gap-4 mb-6">
            {(['All', 'Groups', 'Users'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
                  activeSubTab === tab 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' 
                    : 'text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Stats */}
          {(activeSubTab === 'Users' || activeSubTab === 'All') && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Admin</p>
                  <p className="text-2xl font-bold text-slate-900">{users.filter(u => u.role === 'Admin').length}</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <UserCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Member</p>
                  <p className="text-2xl font-bold text-slate-900">{users.filter(u => u.role === 'Member').length}</p>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'All' ? (
            <div className="space-y-8">
              {/* Users Section in All */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Users size={18} className="text-blue-600" />
                    Users ({filteredUsers.length})
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 font-medium">User</th>
                        <th className="px-6 py-4 font-medium">Role</th>
                        <th className="px-6 py-4 font-medium">Group</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.slice(0, 5).map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                          <td className="px-6 py-4 text-gray-900">{user.group}</td>
                          <td className="px-6 py-4 text-gray-500 text-[10px]">{user.email}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setEditingUser(user)} className="p-1 text-gray-400 hover:text-blue-600 transition-all duration-200 active:scale-90"><Edit2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length > 5 && (
                    <div className="p-3 text-center border-t border-gray-100">
                      <button onClick={() => setActiveSubTab('Users')} className="text-blue-600 text-xs font-medium hover:underline">View All Users</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Groups Section in All */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield size={18} className="text-purple-600" />
                    กลุ่ม ({filteredGroups.length})
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 font-medium">Group Name</th>
                        <th className="px-6 py-4 font-medium">Email Domain</th>
                        <th className="px-6 py-4 font-medium">Member Count</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredGroups.slice(0, 5).map((group) => (
                        <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{group.name}</td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-mono text-gray-500">{group.emailDomain || '-'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{group.memberCount} คน</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setEditingGroup(group)} className="p-1 text-gray-400 hover:text-blue-600 transition-all duration-200 active:scale-90"><Edit2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredGroups.length > 5 && (
                    <div className="p-3 text-center border-t border-gray-100">
                      <button onClick={() => setActiveSubTab('Groups')} className="text-blue-600 text-xs font-medium hover:underline">ดูกลุ่มทั้งหมด</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : activeSubTab === 'Users' ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                <h2 className="font-semibold text-gray-900">User List</h2>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 font-medium">User</th>
                        <th className="px-6 py-4 font-medium">Role</th>
                        <th className="px-6 py-4 font-medium">Group</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                          <td className="px-6 py-4 text-gray-900">{user.group}</td>
                          <td className="px-6 py-4 text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => setEditingUser(user)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-90"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => setDeletingUser(user)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-90"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
          ) : activeSubTab === 'Groups' ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                <h2 className="font-semibold text-gray-900">Manage Groups ({filteredGroups.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-medium">Group Name</th>
                      <th className="px-6 py-4 font-medium">Email Domain</th>
                      <th className="px-6 py-4 font-medium">Description</th>
                      <th className="px-6 py-4 font-medium">Member Count</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredGroups.map((group) => (
                      <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{group.name}</td>
                        <td className="px-6 py-4">
                          {group.emailDomain ? (
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-mono border border-gray-200">
                              {group.emailDomain}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-[10px] italic">ไม่ได้ระบุ</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">{group.description}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {group.memberCount} คน
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setEditingGroup(group)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-90"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => setDeletingGroup(group)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-90"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredGroups.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          ไม่พบข้อมูลกลุ่มที่ค้นหา
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
            <h2 className="font-semibold text-gray-900">Role Management</h2>
            <button 
              onClick={() => setIsAddingRole(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 shadow-sm"
            >
              <Plus size={16} />
              Add New Role
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Role Name</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium text-center">Users</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{role.name}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{role.description}</td>
                    <td className="px-6 py-4 text-gray-500 text-center">
                      {role.userCount}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditingRole({
                            ...role,
                            selectedUserIds: users.filter(u => u.role === role.name).map(u => u.id)
                          } as any)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-90"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => setDeletingRole(role)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-90"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRoles.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No roles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
              <button 
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Search className="hidden" /> {/* Dummy icon to keep import happy if needed, using times below */}
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select 
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value as UserRole})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                  <input 
                    type="text"
                    value={editingUser.group}
                    onChange={(e) => setEditingUser({...editingUser, group: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
              <button 
                onClick={() => setIsAddingUser(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="email@company.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                  <input 
                    type="text"
                    value={newUser.group}
                    onChange={(e) => setNewUser({...newUser, group: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                  Add User
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete User</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete the user <span className="font-semibold text-gray-900">"{deletingUser.name}"</span>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeletingUser(null)}
                  className="flex-1 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteUser}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                  Delete User
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Group Modal */}
      {isAddingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">New Group</h3>
              <button onClick={() => setIsAddingGroup(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleAddGroup} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input type="text" value={newGroup.name} onChange={(e) => setNewGroup({...newGroup, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="e.g. Engineering" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Domain</label>
                <input type="text" value={newGroup.emailDomain} onChange={(e) => setNewGroup({...newGroup, emailDomain: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. @company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newGroup.description} onChange={(e) => setNewGroup({...newGroup, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} placeholder="Enter group description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  <span>Select a member ({newGroup.memberIds?.length || 0})</span>
                  <span className="text-[10px] text-gray-400 font-normal">Check the box to add people to the group</span>
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                    {users
                      .filter(user => !newGroup.emailDomain || user.email.endsWith(newGroup.emailDomain))
                      .map(user => (
                      <label key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={newGroup.memberIds?.includes(user.id)} 
                          onChange={() => toggleGroupMember(newGroup, setNewGroup, user.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-[10px] text-gray-500">{user.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddingGroup(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">Create a Group</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Group Modal */}
      {editingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">แก้ไขกลุ่ม</h3>
              <button onClick={() => setEditingGroup(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSaveGroup} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input type="text" value={editingGroup.name} onChange={(e) => setEditingGroup({...editingGroup, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Domain</label>
                <input type="text" value={editingGroup.emailDomain || ''} onChange={(e) => setEditingGroup({...editingGroup, emailDomain: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., @company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editingGroup.description} onChange={(e) => setEditingGroup({...editingGroup, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  <span>Manage Members ({editingGroup.memberIds.length})</span>
                  <span className="text-[10px] text-gray-400 font-normal">Check to add or remove members from the group</span>
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                    {users
                      .filter(user => !editingGroup.emailDomain || user.email.endsWith(editingGroup.emailDomain))
                      .map(user => (
                      <label key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={editingGroup.memberIds.includes(user.id)} 
                          onChange={() => toggleGroupMember(editingGroup, setEditingGroup, user.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-[10px] text-gray-500">{user.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingGroup(null)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">Record of Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Group Modal */}
      {deletingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ยืนยันการลบกลุ่ม</h3>
              <p className="text-gray-500 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบกลุ่ม <span className="font-semibold text-gray-900">"{deletingGroup.name}"</span>? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingGroup(null)} className="flex-1 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">ยกเลิก</button>
                <button onClick={handleDeleteGroup} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm">ลบกลุ่ม</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Role Modal */}
      {isAddingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add New Role</h3>
              <button onClick={() => setIsAddingRole(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleAddRole} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                  <input type="text" value={newRole.name} onChange={(e) => setNewRole({...newRole, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="e.g. Super Admin" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Domain</label>
                  <input type="text" value={(newRole as any).emailDomain} onChange={(e) => setNewRole({...newRole, emailDomain: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. @company.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newRole.description} onChange={(e) => setNewRole({...newRole, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} placeholder="Enter role description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  <span>Select users for this role ({(newRole as any).selectedUserIds?.length || 0})</span>
                  <span className="text-[10px] text-gray-400 font-normal">Check to assign this role to users</span>
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-40 overflow-y-auto divide-y divide-gray-100">
                    {users
                      .filter(user => !(newRole as any).emailDomain || user.email.endsWith((newRole as any).emailDomain))
                      .map(user => (
                      <label key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={(newRole as any).selectedUserIds?.includes(user.id)} 
                          onChange={() => toggleRoleUser(newRole, setNewRole, user.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-[9px] text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="text-[10px] text-gray-400 italic">{user.role}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddingRole(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">Add Role</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Edit Role</h3>
              <button onClick={() => setEditingRole(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSaveRole} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                  <input type="text" value={editingRole.name} onChange={(e) => setEditingRole({...editingRole, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Domain</label>
                  <input type="text" value={editingRole.emailDomain || ''} onChange={(e) => setEditingRole({...editingRole, emailDomain: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. @company.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editingRole.description} onChange={(e) => setEditingRole({...editingRole, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  <span>Manage users in this role ({(editingRole as any).selectedUserIds?.length || 0})</span>
                  <span className="text-[10px] text-gray-400 font-normal">Check to change user's role to this role</span>
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-40 overflow-y-auto divide-y divide-gray-100">
                    {users
                      .filter(user => !editingRole.emailDomain || user.email.endsWith(editingRole.emailDomain))
                      .map(user => (
                      <label key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={(editingRole as any).selectedUserIds?.includes(user.id)} 
                          onChange={() => toggleRoleUser(editingRole, setEditingRole, user.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-[9px] text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="text-[10px] text-gray-400 italic">{user.role}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingRole(null)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Role Modal */}
      {deletingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete Role</h3>
              <p className="text-gray-500 mb-6">Are you sure you want to delete the role <span className="font-semibold text-gray-900">"{deletingRole.name}"</span>? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingRole(null)} className="flex-1 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">Cancel</button>
                <button onClick={handleDeleteRole} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm">Delete Role</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}
