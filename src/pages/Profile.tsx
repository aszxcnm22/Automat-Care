import React from 'react';
import Layout from '../components/Layout';
import { User, Shield, Calendar, Mail, Key } from 'lucide-react';
import { useIssues } from '../context/IssueContext';

export default function Profile() {
  const { userProfile, updateUserProfile } = useIssues();
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempEmail, setTempEmail] = React.useState(userProfile.email);
  const [tempName, setTempName] = React.useState(userProfile.name);
  const [tempProfilePic, setTempProfilePic] = React.useState<string | null>(userProfile.profilePic);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateUserProfile({
      name: tempName,
      email: tempEmail,
      profilePic: tempProfilePic
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">โปรไฟล์</h1>
        <p className="text-gray-500 text-sm mt-1">จัดการข้อมูลส่วนตัวของคุณ</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-500 relative"></div>
        
        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-indigo-500 flex items-center justify-center text-white text-5xl font-bold shadow-md overflow-hidden">
                {(isEditing ? tempProfilePic : userProfile.profilePic) ? (
                  <img src={(isEditing ? tempProfilePic : userProfile.profilePic) as string} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  (isEditing ? tempName : userProfile.name).charAt(0)
                )}
              </div>
              {isEditing && (
                <div 
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="text-white text-sm font-medium">เปลี่ยนรูป</span>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <div className="mt-2 flex flex-col gap-2 max-w-sm">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900"
                    placeholder="ชื่อ-นามสกุล"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="อีเมล"
                    />
                    <button 
                      onClick={handleSave}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      บันทึก
                    </button>
                    <button 
                      onClick={() => {
                        setTempEmail(userProfile.email);
                        setTempName(userProfile.name);
                        setTempProfilePic(userProfile.profilePic);
                        setIsEditing(false);
                      }}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{userProfile.name}</h2>
                  <p className="text-gray-500">{userProfile.email}</p>
                </>
              )}
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
              >
                แก้ไขโปรไฟล์
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">สถานะบัญชี</p>
                <p className="font-semibold text-gray-900">ใช้งานอยู่</p>
              </div>
            </div>
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">เข้าร่วมเมื่อ</p>
                <p className="font-semibold text-gray-900">ม.ค. 2024</p>
              </div>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="space-y-6 border-t border-gray-100 pt-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-gray-400">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">อีเมล</p>
                <p className="text-gray-900">{userProfile.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 text-gray-400">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">สิทธิ์การเข้าถึง</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  ผู้ใช้งาน
                </span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 text-gray-400">
                <Key size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">รหัสผู้ใช้</p>
                <p className="text-gray-900">{userProfile.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">ความปลอดภัย</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">การยืนยันตัวตนแบบสองขั้นตอน</p>
              <p className="text-sm text-gray-500 mt-1">เพิ่มความปลอดภัยให้กับบัญชีของคุณ</p>
            </div>
            <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors border border-gray-200">
              เปิดใช้งาน
            </button>
          </div>
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">เปลี่ยนรหัสผ่าน</p>
              <p className="text-sm text-gray-500 mt-1">แนะนำให้เปลี่ยนรหัสผ่านเป็นระยะ</p>
            </div>
            <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors border border-gray-200">
              เปลี่ยน
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">ประวัติการเข้าสู่ระบบ</p>
              <p className="text-sm text-gray-500 mt-1">ดูกิจกรรมการเข้าสู่ระบบล่าสุด</p>
            </div>
            <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors border border-gray-200">
              ดูประวัติ
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
