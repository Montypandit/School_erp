import React, { useState } from 'react';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

const AdminAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('normal');
  const [selectedGroups, setSelectedGroups] = useState([]);

  const toggleGroup = (group) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const getPriorityIcon = () => {
    switch (priority) {
      case 'important': return '⚠️ IMPORTANT: ';
      case 'urgent': return '🚨 URGENT: ';
      default: return '📢 ';
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const buildMessage = () => {
    return `${getPriorityIcon()}${title || 'Announcement'}

📅 ${currentDate}

${text || 'No content'}

📱 Sent via Admin Announcement System
👥 Groups: ${selectedGroups.join(', ')}`;
  };

  const shareToWhatsApp = () => {
    if (!title && !text) return alert('⚠️ Please enter a title or content.');
    if (selectedGroups.length === 0) return alert('📱 Select at least one group.');

    const message = encodeURIComponent(buildMessage());
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
    <AdminNavbar />
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">📢 Admin Announcement Center</h1>
          <p className="text-gray-600 mt-2">Create and share announcements instantly via WhatsApp</p>
        </div>

        <div className="space-y-6 mb-6">
          <div>
            <label className="font-semibold text-gray-700 block mb-2">📝 Announcement Title</label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-2">📄 Announcement Content</label>
            <textarea
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-2">⚡ Priority Level</label>
            <select
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="normal">📢 Normal</option>
              <option value="important">⚠️ Important</option>
              <option value="urgent">🚨 Urgent</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-2">📱 Select WhatsApp Groups</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['general', 'staff', 'students', 'parents', 'management', 'emergency'].map((group) => (
                <div
                  key={group}
                  onClick={() => toggleGroup(group)}
                  className={`border-2 px-4 py-3 rounded-xl text-center cursor-pointer transition ${
                    selectedGroups.includes(group)
                      ? 'bg-green-500 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-green-100'
                  }`}
                >
                  <input type="checkbox" readOnly checked={selectedGroups.includes(group)} className="hidden" />
                  {{
                    general: '👥 General Group',
                    staff: '💼 Staff Group',
                    students: '🎓 Students Group',
                    parents: '👨‍👩‍👧‍👦 Parents Group',
                    management: '🏢 Management Group',
                    emergency: '🚨 Emergency Group',
                  }[group]}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-xl border-l-4 border-indigo-500 mb-6">
          <h2 className="font-semibold text-indigo-600 mb-2">👁️ Announcement Preview</h2>
          {!title && !text ? (
            <p className="italic text-gray-400 text-center">Your announcement preview will appear here...</p>
          ) : (
            <div className="space-y-3 text-gray-800">
              <h3 className="text-lg font-bold">{getPriorityIcon()}{title}</h3>
              <p className="text-sm text-gray-500">📅 {currentDate}</p>
              <p className="whitespace-pre-line">{text}</p>
              <hr />
              <p className="text-xs text-center text-gray-500">📱 Sent via Admin Announcement System</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={shareToWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Share via WhatsApp
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminAnnouncement;
