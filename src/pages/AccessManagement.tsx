import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Shield, Users, UserCheck, MoreVertical, Edit2, Trash2, ShieldCheck, User } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

type UserRole = string;

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
  description: string;
  emailDomain?: string;
  memberCount: number;
  createdAt: string;
  memberIds: string[];
  history?: { action: string; user: string; date: string }[];
}

interface AccessRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  selectedUserIds?: string[];
}

const mockUsers: AccessUser[] = [
  { id: 'USR-001', name: 'Mr. A', email: 'email', role: 'Admin', group: 'Global Tech Holdings Company' },
  { id: 'USR-002', name: 'Mr. B', email: 'email', role: 'Member', group: 'Green Energy Group' },
  { id: 'USR-003', name: 'Mr. C', email: 'email', role: 'Member', group: 'Retail Giant Corp' },
];

const mockGroups: AccessGroup[] = [
  { 
    id: 'GRP-001', 
    name: 'Global Tech Holdings Company', 
    description: 'ศูนย์รวมนวัตกรรมซอฟต์แวร์และการพัฒนา AI สำหรับองค์กรในระดับสากล', 
    emailDomain: 'globaltech.com',
    memberCount: 1, 
    createdAt: '2026-01-15', 
    memberIds: ['USR-001'],
    history: [
      { action: 'Joined', user: 'Mr. A', date: '2026-01-15' }
    ]
  },
  { 
    id: 'GRP-002', 
    name: 'Green Energy Group', 
    description: 'กลุ่มธุรกิจพลังงานสะอาด มุ่งเน้นการผลิตโซลาร์เซลล์และพลังงานลมเพื่อความยั่งยืน', 
    emailDomain: 'greenenergy.com',
    memberCount: 1, 
    createdAt: '2026-01-20', 
    memberIds: ['USR-002'],
    history: [
      { action: 'Created', user: 'System Admin', date: '2026-01-20' },
      { action: 'Joined', user: 'Mr. B', date: '2026-01-20' }
    ]
  },
  { 
    id: 'GRP-003', 
    name: 'Retail Giant Corp', 
    description: 'ผู้นำด้านค้าปลีกและอุปโภคบริโภค ครอบคลุมห้างสรรพสินค้าและร้านสะดวกซื้อทั่วประเทศ', 
    emailDomain: 'retailgiant.com',
    memberCount: 1, 
    createdAt: '2026-02-01', 
    memberIds: ['USR-002'],
    history: [
      { action: 'Created', user: 'System Admin', date: '2026-02-01' },
      { action: 'Joined', user: 'Mr. B', date: '2026-02-01' }
    ]
  },
];

const mockRoles: AccessRole[] = [
  { id: 'ROL-001', name: 'Admin', description: 'Full access', permissions: ['All'], userCount: 1 },
  { id: 'ROL-002', name: 'ORG Admin', description: 'Manage tickets/members in organization', permissions: ['Read', 'Write', 'Manage Users'], userCount: 1 },
  { id: 'ROL-003', name: 'ORG Member', description: 'Create/view own tickets', permissions: ['Read', 'Write'], userCount: 1 },
  { id: 'ROL-004', name: 'GUEST', description: 'Outsider not yet affiliated with an organization', permissions: ['Read'], userCount: 1 },
];

export default function AccessManagement() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'Access Rules' | 'Roles'>('Access Rules');
  const [activeSubTab, setActiveSubTab] = useState<'All' | 'Groups' | 'Users'>('Users');
  const [users, setUsers] = useState<AccessUser[]>(() => {
    const saved = localStorage.getItem('access_users');
    return saved ? JSON.parse(saved) : mockUsers;
  });
  const [groups, setGroups] = useState<AccessGroup[]>(() => {
    const saved = localStorage.getItem('access_groups');
    return saved ? JSON.parse(saved) : mockGroups;
  });
  const [roles, setRoles] = useState<AccessRole[]>(() => {
    const saved = localStorage.getItem('access_roles');
    return saved ? JSON.parse(saved) : mockRoles;
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('access_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('access_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('access_roles', JSON.stringify(roles));
  }, [roles]);

  // Listen for changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_users' && e.newValue) {
        setUsers(JSON.parse(e.newValue));
      }
      if (e.key === 'access_groups' && e.newValue) {
        setGroups(JSON.parse(e.newValue));
      }
      if (e.key === 'access_roles' && e.newValue) {
        setRoles(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters
  const [filterRole, setFilterRole] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');

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

  // Selector & Context Menu State
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean } | null>(null);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, userId: string) => {
    e.preventDefault();
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers([userId]);
    }
    
    // Adjust position to stay within viewport
    const menuWidth = 192;
    const menuHeight = 280; // Approximate height of the menu
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    setContextMenu({ x, y, visible: true });
  };

  const closeContextMenu = () => setContextMenu(null);

  useEffect(() => {
    const handleClick = () => closeContextMenu();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleChangeRole = (newRole: UserRole) => {
    setUsers(users.map(u => selectedUsers.includes(u.id) ? { ...u, role: newRole } : u));
    closeContextMenu();
    setSelectedUsers([]);
  };

  const handleRemoveSelectedUsers = () => {
    setUsers(users.filter(u => !selectedUsers.includes(u.id)));
    // Also remove from groups
    setGroups(groups.map(g => ({
      ...g,
      memberIds: g.memberIds.filter(id => !selectedUsers.includes(id)),
      memberCount: g.memberIds.filter(id => !selectedUsers.includes(id)).length
    })));
    closeContextMenu();
    setSelectedUsers([]);
  };


  // Group Modals State
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AccessGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<AccessGroup | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<AccessGroup | null>(null);
  const [deletingMember, setDeletingMember] = useState<AccessUser | null>(null);
  const [newGroup, setNewGroup] = useState<Partial<AccessGroup>>({ name: '', description: '', emailDomain: '', memberIds: [] });

  const handleRemoveMember = () => {
    if (!selectedGroup || !deletingMember) return;

    const updatedGroup = {
        ...selectedGroup,
        memberIds: selectedGroup.memberIds.filter(id => id !== deletingMember.id),
        memberCount: selectedGroup.memberCount - 1,
        history: [...(selectedGroup.history || []), { action: 'Removed', user: deletingMember.name, date: new Date().toISOString().split('T')[0] }]
    };
    setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
    setSelectedGroup(updatedGroup);
    // Also update user object to remove group name
    setUsers(users.map(u => u.id === deletingMember.id ? { ...u, group: '' } : u));
    setDeletingMember(null);
  };

  const permissionCategories = [
    { name: 'General', permissions: ['All', 'Read', 'Write', 'Delete'] },
    { name: 'Management', permissions: ['Manage Users', 'Manage Roles', 'Reports'] },
    { name: 'System', permissions: ['Settings', 'Audit Logs', 'API Access'] }
  ];

  // Role Modals State
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [editingRole, setEditingRole] = useState<AccessRole | null>(null);
  const [deletingRole, setDeletingRole] = useState<AccessRole | null>(null);
  const [newRole, setNewRole] = useState<Partial<AccessRole>>({ 
    name: '', 
    description: '', 
    permissions: [],
    selectedUserIds: []
  });

  useEffect(() => {
    if (isAddingUser && currentUser?.role === 'ORG Admin' && currentUser.group) {
        setNewUser(prev => ({ ...prev, group: currentUser.group }));
    }
  }, [isAddingUser, currentUser]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesGroup = filterGroup === 'All' || user.group === filterGroup;

    // Role-based filtering
    let matchesAccess = true;
    if (currentUser?.role === 'ORG Admin' || currentUser?.role === 'Member') {
        matchesAccess = user.group === currentUser.group;
    }

    return matchesSearch && matchesRole && matchesGroup && matchesAccess;
  });

  const filteredGroups = groups.filter(group => {
    const matchesSearch = 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        group.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role-based filtering
    let matchesAccess = true;
    if (currentUser?.role === 'ORG Admin' || currentUser?.role === 'Member') {
        // They shouldn't see groups tab anyway, but just in case
        matchesAccess = false; 
    }
    return matchesSearch && matchesAccess;
  });

  const filteredRoles = roles.filter(role => {
    const matchesSearch = 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        role.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Role-based filtering
    let matchesAccess = true;
    if (currentUser?.role === 'ORG Admin' || currentUser?.role === 'Member') {
        // They shouldn't see roles tab anyway
        matchesAccess = false;
    }
    return matchesSearch && matchesAccess;
  });

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

  // User Handlers
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const originalUser = users.find(u => u.id === editingUser.id);
      const oldGroupName = originalUser?.group;
      const newGroupName = editingUser.group;

      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));

      if (oldGroupName !== newGroupName) {
        setGroups(groups.map(g => {
          if (g.name === oldGroupName) {
            return {
              ...g,
              memberIds: g.memberIds.filter(id => id !== editingUser.id),
              memberCount: Math.max(0, g.memberCount - 1)
            };
          }
          if (g.name === newGroupName) {
            return {
              ...g,
              memberIds: [...g.memberIds, editingUser.id],
              memberCount: g.memberCount + 1
            };
          }
          return g;
        }));
      }
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

      if (userToAdd.group) {
        setGroups(groups.map(g => 
          g.name === userToAdd.group 
            ? { ...g, memberIds: [...g.memberIds, userToAdd.id], memberCount: g.memberCount + 1 }
            : g
        ));
      }

      setIsAddingUser(false);
      setNewUser({ name: '', email: '', role: 'Member', group: '' });
    }
  };

  const handleDeleteUser = () => {
    if (deletingUser) {
      setUsers(users.filter(u => u.id !== deletingUser.id));

      if (deletingUser.group) {
        setGroups(groups.map(g => 
          g.name === deletingUser.group
            ? { ...g, memberIds: g.memberIds.filter(id => id !== deletingUser.id), memberCount: Math.max(0, g.memberCount - 1) }
            : g
        ));
      }

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
        description: newGroup.description || '',
        emailDomain: newGroup.emailDomain || '',
        memberCount: newGroup.memberIds?.length || 0,
        memberIds: newGroup.memberIds || [],
        createdAt: new Date().toISOString().split('T')[0],
        history: [
          { action: 'Created', user: 'System Admin', date: new Date().toISOString().split('T')[0] }
        ]
      };
      setGroups([...groups, groupToAdd]);

      if (groupToAdd.memberIds.length > 0) {
        setUsers(users.map(u => 
          groupToAdd.memberIds.includes(u.id)
            ? { ...u, group: groupToAdd.name }
            : u
        ));
      }

      setIsAddingGroup(false);
      setNewGroup({ name: '', description: '', emailDomain: '', memberIds: [] });
    }
  };

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      const originalGroup = groups.find(g => g.id === editingGroup.id);
      const oldName = originalGroup?.name;

      const updatedGroup = {
        ...editingGroup,
        memberCount: editingGroup.memberIds.length
      };
      setGroups(groups.map(g => g.id === editingGroup.id ? updatedGroup : g));
      
      // Update selectedGroup if we are currently viewing this group
      if (selectedGroup && selectedGroup.id === editingGroup.id) {
        setSelectedGroup(updatedGroup);
      }

      setUsers(users.map(u => {
        if (updatedGroup.memberIds.includes(u.id)) {
          return { ...u, group: updatedGroup.name };
        }
        if ((u.group === oldName || u.group === updatedGroup.name) && !updatedGroup.memberIds.includes(u.id)) {
          return { ...u, group: '' };
        }
        return u;
      }));

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
    const currentSelected = role.selectedUserIds || [];
    if (currentSelected.includes(userId)) {
      setRole({ ...role, selectedUserIds: currentSelected.filter((id: string) => id !== userId) });
    } else {
      setRole({ ...role, selectedUserIds: [...currentSelected, userId] });
    }
  };

  const handleDeleteGroup = () => {
    if (deletingGroup) {
      setGroups(groups.filter(g => g.id !== deletingGroup.id));
      setUsers(users.map(u => 
        u.group === deletingGroup.name ? { ...u, group: '' } : u
      ));
      setDeletingGroup(null);
    }
  };

  // Role Handlers
  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRole.name) {
      // Generate a unique ID based on the highest existing ID
      const maxId = roles.reduce((max, role) => {
        const idPart = role.id.split('-')[1];
        const num = idPart ? parseInt(idPart) : 0;
        return num > max ? num : max;
      }, 0);
      
      const roleToAdd: AccessRole = {
        id: `ROL-${String(maxId + 1).padStart(3, '0')}`,
        name: newRole.name,
        description: newRole.description || '',
        permissions: newRole.permissions || [],
        userCount: newRole.selectedUserIds?.length || 0
      };
      setRoles([...roles, roleToAdd]);
      
      // Update users who were selected for this role
      if (newRole.name && newRole.selectedUserIds && newRole.selectedUserIds.length > 0) {
        setUsers(users.map(u => 
          newRole.selectedUserIds?.includes(u.id) 
            ? { ...u, role: newRole.name as UserRole } 
            : u
        ));
      }

      setIsAddingRole(false);
      setNewRole({ name: '', description: '', permissions: [], selectedUserIds: [] });
    }
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      const updatedRole = {
        ...editingRole,
        userCount: editingRole.selectedUserIds?.length || 0
      };
      setRoles(roles.map(r => r.id === editingRole.id ? updatedRole : r));
      
      // Update users who were selected for this role
      if (editingRole.selectedUserIds) {
        setUsers(users.map(u => {
          // If user is selected for this role, update their role
          if (editingRole.selectedUserIds?.includes(u.id)) {
            return { ...u, role: editingRole.name as UserRole };
          }
          // If user currently has this role but is NOT selected anymore, clear their role (or set to default Member)
          if (u.role === editingRole.name && !editingRole.selectedUserIds?.includes(u.id)) {
             return u; 
          }
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
        return <span>Admin</span>;
      case 'Member':
        return <span>Member</span>;
      default:
        return <span>{role}</span>;
    }
  };

  return (
    <Layout>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
      >
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
              currentUser?.role !== 'Member' && (
              <button 
                onClick={() => setIsAddingUser(true)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 whitespace-nowrap"
              >
                <Plus size={18} />
                Add User
              </button>
              )
            )
          ) : null}
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
        {currentUser?.role === 'Admin' && (
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
        )}
      </div>

      {activeTab === 'Access Rules' ? (
        <>
          {/* Sub Tabs */}
          <div className="flex items-center gap-4 mb-6">
            {(['All', 'Groups', 'Users'] as const).filter(tab => {
                if (currentUser?.role === 'ORG Admin' || currentUser?.role === 'Member') {
                    return tab === 'Users';
                }
                return true;
            }).map((tab) => (
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
            <div className="mb-6 flex flex-wrap items-center gap-4">
              {/* Role Filter */}
              {currentUser?.role !== 'Member' && (
              <div className="relative">
                <select 
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium shadow-sm"
                >
                  <option value="All">All Roles</option>
                  {roles
                    .filter(role => currentUser?.role === 'ORG Admin' ? role.name !== 'Admin' : true)
                    .map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              )}

              {/* Group Filter */}
              {currentUser?.role === 'Admin' && (
              <div className="relative">
                <select 
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium shadow-sm"
                >
                  <option value="All">All Groups</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.name}>{g.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              )}
            </div>
          )}

          {(activeSubTab === 'Users' || activeSubTab === 'All') && (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8"
            >
              {(() => {
                const scopeUsers = users.filter(user => {
                  if (currentUser?.role === 'Admin') return true;
                  if (currentUser?.role === 'ORG Admin' || currentUser?.role === 'Member') {
                    return user.group === currentUser.group;
                  }
                  return false;
                });

                return (
                  <>
                    <motion.div 
                      variants={item}
                      whileHover={{ scale: 1.02, translateY: -5 }}
                      className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        <Users size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Users</p>
                        <p className="text-2xl font-bold text-slate-900">{scopeUsers.length}</p>
                      </div>
                    </motion.div>
                    {currentUser?.role === 'Admin' && (
                    <motion.div 
                      variants={item}
                      whileHover={{ scale: 1.02, translateY: -5 }}
                      className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        <Shield size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Admin</p>
                        <p className="text-2xl font-bold text-slate-900">{scopeUsers.filter(u => u.role === 'Admin').length}</p>
                      </div>
                    </motion.div>
                    )}
                    <motion.div 
                      variants={item}
                      whileHover={{ scale: 1.02, translateY: -5 }}
                      className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">ORG Admin</p>
                        <p className="text-2xl font-bold text-slate-900">{scopeUsers.filter(u => u.role === 'ORG Admin').length}</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      variants={item}
                      whileHover={{ scale: 1.02, translateY: -5 }}
                      className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        <UserCheck size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Member</p>
                        <p className="text-2xl font-bold text-slate-900">{scopeUsers.filter(u => u.role === 'Member').length}</p>
                      </div>
                    </motion.div>
                    {(currentUser?.role === 'Admin' || currentUser?.role === 'ORG Admin') && (
                    <motion.div 
                      variants={item}
                      whileHover={{ scale: 1.02, translateY: -5 }}
                      className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center text-teal-600 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">GUEST</p>
                        <p className="text-2xl font-bold text-slate-900">{scopeUsers.filter(u => u.role === 'GUEST').length}</p>
                      </div>
                    </motion.div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          )}

          {activeSubTab === 'All' ? (
            <div className="space-y-8">
              {/* Users Section in All */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Users size={18} className="text-blue-600" />
                    User List
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
                    <motion.tbody 
                      key={filteredUsers.slice(0, 5).map(u => u.id).join(',')}
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="divide-y divide-gray-200"
                    >
                      {filteredUsers.slice(0, 5).map((user) => (
                        <motion.tr 
                          key={user.id} 
                          variants={item}
                          className="hover:bg-gray-50 transition-colors"
                        >
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
                          <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                          <td className="px-6 py-4 text-gray-900">{user.group}</td>
                          <td className="px-6 py-4 text-gray-500 text-[10px]">{user.email}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setEditingUser(user)} className="p-1 text-gray-400 hover:text-blue-600 transition-all duration-200 active:scale-90"><Edit2 size={14} /></button>
                          </td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
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
                        <th className="px-6 py-4 font-medium">Member Count</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <motion.tbody 
                      key={filteredGroups.slice(0, 5).map(g => g.id).join(',')}
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="divide-y divide-gray-200"
                    >
                      {filteredGroups.slice(0, 5).map((group) => (
                        <motion.tr 
                          key={group.id} 
                          variants={item}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setActiveSubTab('Groups');
                            setSelectedGroup(group);
                          }}
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">{group.name}</td>
                          <td className="px-6 py-4">
                            <span className="text-blue-700 font-medium">{group.memberCount} คน</span>
                          </td>
                          <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setEditingGroup(group)} className="p-1 text-gray-400 hover:text-blue-600 transition-all duration-200 active:scale-90"><Edit2 size={14} /></button>
                          </td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </table>
                  {filteredGroups.length > 5 && (
                    <div className="p-3 text-center border-t border-gray-100">
                      <button onClick={() => setActiveSubTab('Groups')} className="text-blue-600 text-xs font-medium hover:underline">View All Groups</button>
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
              <div className="overflow-x-auto relative">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                      <tr>
                        {currentUser?.role !== 'Member' && (
                        <th className="px-6 py-4 font-medium w-10">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                            onChange={handleSelectAll}
                          />
                        </th>
                        )}
                        <th className="px-6 py-4 font-medium">User</th>
                        {currentUser?.role !== 'Member' && <th className="px-6 py-4 font-medium">Role</th>}
                        <th className="px-6 py-4 font-medium">Group</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        {currentUser?.role !== 'Member' && <th className="px-6 py-4 font-medium text-right">Action</th>}
                      </tr>
                    </thead>
                    <motion.tbody 
                      key={filteredUsers.map(u => u.id).join(',')}
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="divide-y divide-gray-200"
                    >
                      {filteredUsers.map((user) => (
                        <motion.tr 
                          key={user.id} 
                          variants={item}
                          className={`hover:bg-gray-50 transition-colors ${selectedUsers.includes(user.id) ? 'bg-blue-50/50' : ''}`}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            if (currentUser?.role !== 'Member') {
                              handleContextMenu(e, user.id);
                            }
                          }}
                        >
                          {currentUser?.role !== 'Member' && (
                          <td className="px-6 py-4">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleSelectUser(user.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          )}
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
                          {currentUser?.role !== 'Member' && <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>}
                          <td className="px-6 py-4 text-gray-900">{user.group}</td>
                          <td className="px-6 py-4 text-gray-500">{user.email}</td>
                          {currentUser?.role !== 'Member' && (
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* ORG Admin cannot edit Admin */}
                              {!(currentUser?.role === 'ORG Admin' && user.role === 'Admin') && (
                              <button 
                                onClick={() => setEditingUser(user)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-90"
                              >
                                <Edit2 size={16} />
                              </button>
                              )}
                              {/* Only Admin or ORG Admin can delete users */}
                              {(currentUser?.role === 'Admin' || (currentUser?.role === 'ORG Admin' && user.role !== 'Admin')) && (
                              <button 
                                onClick={() => setDeletingUser(user)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-90"
                              >
                                <Trash2 size={16} />
                              </button>
                              )}
                            </div>
                          </td>
                          )}
                        </motion.tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      )}
                    </motion.tbody>
                  </table>
                  
                  {/* Context Menu */}
                  {contextMenu && contextMenu.visible && (() => {
                    const selectedUserObjects = users.filter(u => selectedUsers.includes(u.id));
                    const hasAdminOrOrgAdminSelected = selectedUserObjects.some(u => u.role === 'Admin' || u.role === 'ORG Admin');
                    const canChangeRole = currentUser?.role === 'Admin' || (currentUser?.role === 'ORG Admin' && !hasAdminOrOrgAdminSelected);

                    return (
                    <div 
                      className="fixed bg-white border border-gray-200 shadow-lg rounded-lg py-1 z-50 w-48"
                      style={{ top: contextMenu.y, left: contextMenu.x }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100 mb-1">
                        Selected: {selectedUsers.length} user(s)
                      </div>
                      
                      <div className="px-2 py-1">
                        <p className="px-2 py-1 text-xs font-medium text-gray-400 uppercase">Change Role</p>
                        {!canChangeRole ? (
                          <p className="px-2 py-2 text-xs text-amber-600 italic">
                            Cannot change role for {hasAdminOrOrgAdminSelected ? 'Admin/ORG Admin' : 'these users'}
                          </p>
                        ) : (
                          <>
                            {currentUser?.role === 'Admin' && (
                              <button 
                                onClick={() => handleChangeRole('Admin')}
                                className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md flex items-center gap-2"
                              >
                                <Shield size={14} /> Admin
                              </button>
                            )}
                            <button 
                              onClick={() => handleChangeRole('ORG Admin')}
                              className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md flex items-center gap-2"
                            >
                              <ShieldCheck size={14} /> ORG Admin
                            </button>
                            <button 
                              onClick={() => handleChangeRole('Member')}
                              className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md flex items-center gap-2"
                            >
                              <UserCheck size={14} /> Member
                            </button>
                            <button 
                              onClick={() => handleChangeRole('GUEST')}
                              className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md flex items-center gap-2"
                            >
                              <Users size={14} /> GUEST
                            </button>
                          </>
                        )}
                      </div>

                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button 
                        onClick={handleRemoveSelectedUsers}
                        disabled={currentUser?.role === 'ORG Admin' && hasAdminOrOrgAdminSelected}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                          currentUser?.role === 'ORG Admin' && hasAdminOrOrgAdminSelected 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={14} /> Remove Selected Users
                      </button>
                    </div>
                    );
                  })()}
                </div>
              </div>
          ) : activeSubTab === 'Groups' ? (
            selectedGroup ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setSelectedGroup(null)}
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      Back to Groups
                    </button>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => setEditingGroup(selectedGroup)}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                      >
                        Edit Group
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedGroup.name}</h2>
                      <p className="text-gray-500">{selectedGroup.description}</p>
                      {selectedGroup.emailDomain && (
                        <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                          <span className="font-medium">Domain:</span> {selectedGroup.emailDomain}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{selectedGroup.memberCount}</div>
                      <div className="text-sm text-gray-500">Members</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Members</h3>
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 font-medium">User</th>
                          <th className="px-6 py-3 font-medium">Email</th>
                          <th className="px-6 py-3 font-medium">Role</th>
                          <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.filter(u => selectedGroup.memberIds.includes(u.id)).map(member => (
                          <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{member.name}</td>
                            <td className="px-6 py-4 text-gray-500">{member.email}</td>
                            <td className="px-6 py-4">
                              {currentUser?.role === 'Member' ? (
                                <span className="text-gray-900">{member.role}</span>
                              ) : (
                                <select 
                                  value={member.role}
                                  onChange={(e) => {
                                    const newRole = e.target.value as UserRole;
                                    setUsers(users.map(u => u.id === member.id ? { ...u, role: newRole } : u));
                                  }}
                                  className="text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                  disabled={currentUser?.role === 'ORG Admin' && member.role === 'Admin'}
                                >
                                  {roles
                                    .filter(role => currentUser?.role === 'ORG Admin' ? role.name !== 'Admin' : true)
                                    .map(role => (
                                    <option key={role.id} value={role.name}>{role.name}</option>
                                  ))}
                                </select>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => setDeletingMember(member)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-90"
                                title="Remove member"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {selectedGroup.memberIds.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No members in this group</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {selectedGroup.history && selectedGroup.history.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">History</h3>
                      <div className="space-y-3">
                        {selectedGroup.history.map((record, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium text-gray-900 mr-2">{record.user}</span>
                            <span>was {record.action.toLowerCase()}</span>
                            <span className="ml-auto text-gray-400 text-xs">{record.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                <h2 className="font-semibold text-gray-900">Manage Groups ({filteredGroups.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-medium">Group Name</th>
                      <th className="px-6 py-4 font-medium">Description</th>
                      <th className="px-6 py-4 font-medium">Domain</th>
                      <th className="px-6 py-4 font-medium">Member Count</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <motion.tbody 
                    key={filteredGroups.map(g => g.id).join(',')}
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="divide-y divide-gray-200"
                  >
                    {filteredGroups.map((group) => (
                      <motion.tr 
                        key={group.id} 
                        variants={item}
                        className="hover:bg-gray-50 transition-colors cursor-pointer" 
                        onClick={() => setSelectedGroup(group)}
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">{group.name}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">{group.description}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">{group.emailDomain || '-'}</td>
                        <td className="px-6 py-4">
                          <span className="text-blue-700 font-medium">
                            {group.memberCount} คน
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setDeletingGroup(group)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-90"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {filteredGroups.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          ไม่พบข้อมูลกลุ่มที่ค้นหา
                        </td>
                      </tr>
                    )}
                  </motion.tbody>
                </table>
              </div>
            </div>
            )
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
              <motion.tbody 
                variants={container}
                initial="hidden"
                animate="show"
                className="divide-y divide-gray-200"
              >
                {filteredRoles.map((role) => (
                  <motion.tr 
                    key={role.id} 
                    variants={item}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{role.name}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{role.description}</td>
                    <td className="px-6 py-4 text-gray-500 text-center">
                      {users.filter(u => u.role === role.name).length}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditingRole({
                            ...role,
                            selectedUserIds: users.filter(u => u.role === role.name).map(u => u.id)
                          })}
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
                  </motion.tr>
                ))}
                {filteredRoles.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No roles found
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
                    {roles
                        .filter(role => {
                            if (currentUser?.role === 'ORG Admin') {
                                return role.name !== 'Admin';
                            }
                            return true;
                        })
                        .map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                  <div className="flex gap-2">
                    {currentUser?.role === 'ORG Admin' ? (
                      <input 
                        type="text" 
                        value={editingUser.group} 
                        readOnly 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-50 text-gray-500" 
                      />
                    ) : (
                    <select 
                      value={editingUser.group}
                      onChange={(e) => setEditingUser({...editingUser, group: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      disabled={currentUser?.role === 'ORG Admin'}
                    >
                      <option value="">Select Group</option>
                      {groups
                        .filter(g => {
                            if (currentUser?.role === 'ORG Admin') {
                                return g.name === currentUser.group;
                            }
                            return true;
                        })
                        .map(g => (
                        <option key={g.id} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                    )}
                    {currentUser?.role !== 'ORG Admin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(null);
                        setActiveSubTab('Groups');
                        setIsAddingGroup(true);
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors whitespace-nowrap"
                      title="Create New Group"
                    >
                      <Plus size={18} />
                    </button>
                    )}
                  </div>
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
        </motion.div>
      )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddingUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
                    {roles
                        .filter(role => {
                            if (currentUser?.role === 'ORG Admin') {
                                return role.name !== 'Admin';
                            }
                            return true;
                        })
                        .map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                  <div className="flex gap-2">
                    {currentUser?.role === 'ORG Admin' ? (
                      <input 
                        type="text" 
                        value={newUser.group} 
                        readOnly 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-50 text-gray-500" 
                      />
                    ) : (
                    <select 
                      value={newUser.group}
                      onChange={(e) => setNewUser({...newUser, group: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      disabled={currentUser?.role === 'ORG Admin'}
                    >
                      <option value="">Select Group</option>
                      {groups
                        .filter(g => {
                            if (currentUser?.role === 'ORG Admin') {
                                return g.name === currentUser.group;
                            }
                            return true;
                        })
                        .map(g => (
                        <option key={g.id} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                    )}
                    {currentUser?.role !== 'ORG Admin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingUser(false);
                        setActiveSubTab('Groups');
                        setIsAddingGroup(true);
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors whitespace-nowrap"
                      title="Create New Group"
                    >
                      <Plus size={18} />
                    </button>
                    )}
                  </div>
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
        </motion.div>
      )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
        </motion.div>
      )}
      </AnimatePresence>

      {/* Delete Member Confirmation Modal */}
      <AnimatePresence>
        {deletingMember && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Remove Member</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to remove <span className="font-semibold text-gray-900">"{deletingMember.name}"</span> from this group?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeletingMember(null)}
                  className="flex-1 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRemoveMember}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                  Remove Member
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Add Group Modal */}
      <AnimatePresence>
        {isAddingGroup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
            >
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
                <input type="text" value={newGroup.emailDomain} onChange={(e) => setNewGroup({...newGroup, emailDomain: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. company.com" />
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
                      .filter(user => 
                        (!newGroup.emailDomain || user.email.toLowerCase().includes(newGroup.emailDomain.toLowerCase())) || 
                        (newGroup.memberIds || []).includes(user.id)
                      )
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
                    {users.filter(user => 
                      (currentUser?.role === 'Admin') || 
                      (!newGroup.emailDomain || user.email.toLowerCase().includes(newGroup.emailDomain.toLowerCase())) || 
                      (newGroup.memberIds || []).includes(user.id)
                    ).length === 0 && (
                      <div className="p-4 text-center text-gray-500 text-sm">No users found</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddingGroup(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">Create a Group</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Edit Group Modal */}
      <AnimatePresence>
        {editingGroup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
            >
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
                <input type="text" value={editingGroup.emailDomain || ''} onChange={(e) => setEditingGroup({...editingGroup, emailDomain: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                      .filter(user => 
                        (!editingGroup.emailDomain || user.email.toLowerCase().includes(editingGroup.emailDomain.toLowerCase())) || 
                        editingGroup.memberIds.includes(user.id)
                      )
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
                    {users.filter(user => 
                      (currentUser?.role === 'Admin') || 
                      (!editingGroup.emailDomain || user.email.toLowerCase().includes(editingGroup.emailDomain.toLowerCase())) || 
                      editingGroup.memberIds.includes(user.id)
                    ).length === 0 && (
                      <div className="p-4 text-center text-gray-500 text-sm">No users found</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingGroup(null)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">Record of Changes</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Delete Group Modal */}
      <AnimatePresence>
        {deletingGroup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
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
        </motion.div>
      )}
      </AnimatePresence>

      {/* Add Role Modal */}
      <AnimatePresence>
        {isAddingRole && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
            >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add New Role</h3>
              <button onClick={() => setIsAddingRole(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleAddRole} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input type="text" value={newRole.name} onChange={(e) => setNewRole({...newRole, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="e.g. Super Admin" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newRole.description} onChange={(e) => setNewRole({...newRole, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} placeholder="Enter role description..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="border border-gray-200 rounded-lg p-4 space-y-4 max-h-60 overflow-y-auto">
                  {permissionCategories.map((category) => (
                    <div key={category.name}>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{category.name}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.permissions.map((perm) => (
                          <label key={perm} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={newRole.permissions?.includes(perm)}
                              onChange={() => togglePermission(newRole, setNewRole, perm)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddingRole(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">Add Role</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Edit Role Modal */}
      <AnimatePresence>
        {editingRole && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
            >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Edit Role</h3>
              <button onClick={() => setEditingRole(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSaveRole} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input type="text" value={editingRole.name} onChange={(e) => setEditingRole({...editingRole, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editingRole.description} onChange={(e) => setEditingRole({...editingRole, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="border border-gray-200 rounded-lg p-4 space-y-4 max-h-60 overflow-y-auto">
                  {permissionCategories.map((category) => (
                    <div key={category.name}>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{category.name}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.permissions.map((perm) => (
                          <label key={perm} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={editingRole.permissions?.includes(perm)}
                              onChange={() => togglePermission(editingRole, setEditingRole, perm)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingRole(null)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Delete Role Modal */}
      <AnimatePresence>
        {deletingRole && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
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
        </motion.div>
      )}
      </AnimatePresence>
      </motion.div>
    </Layout>
  );
}
