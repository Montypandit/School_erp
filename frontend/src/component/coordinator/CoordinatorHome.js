import React, { useState } from 'react';
import { 
  Download, 
  Eye, 
  Users, 
  MessageSquare, 
  Send, 
  Calendar, 
  Search, 
  X 
} from 'lucide-react';

const CoordinatorHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data for inquiries
  const mockInquiries = [
    {
      id: 1,
      title: "Student Inquiry",
      studentName: "John Doe",
      email: "john.doe@email.com",
      phone: "+1234567890",
      class: "Class 5",
      status: "New",
      createdAt: "2024-01-15",
      description: "Interested in admission for Class 5",
    },
    {
      id: 2,
      title: "Fee Inquiry",
      studentName: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1234567891",
      class: "Class 3",
      status: "In Progress",
      createdAt: "2024-01-14",
      description: "Questions about annual fees",
    },
    {
      id: 3,
      title: "School Visit",
      studentName: "Mike Johnson",
      email: "mike.johnson@email.com",
      phone: "+1234567892",
      class: "Class 1",
      status: "Resolved",
      createdAt: "2024-01-13",
      description: "Scheduled school visit for tomorrow",
    },
  ];

  const filteredInquiries = mockInquiries.filter(inquiry => 
    inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Coordinator Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Recent Inquiries</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              style={{ 
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}
              onClick={() => {
                setSelectedInquiry(inquiry);
                setShowDetails(true);
              }}
            >
              <h3>{inquiry.title}</h3>
              <p style={{ color: '#666' }}>{inquiry.studentName}</p>
              <p style={{ color: '#666' }}>{inquiry.class}</p>
              <p style={{ color: '#666' }}>{inquiry.createdAt}</p>
              <p style={{ color: inquiry.status === 'New' ? '#f44336' : inquiry.status === 'In Progress' ? '#2196f3' : '#4caf50' }}>
                {inquiry.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {showDetails && selectedInquiry && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            position: 'relative'
          }}>
            <button
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px'
              }}
              onClick={() => setShowDetails(false)}
            >
              <X />
            </button>
            
            <h2>Inquiry Details</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              <p><strong>Title:</strong> {selectedInquiry.title}</p>
              <p><strong>Student Name:</strong> {selectedInquiry.studentName}</p>
              <p><strong>Email:</strong> {selectedInquiry.email}</p>
              <p><strong>Phone:</strong> {selectedInquiry.phone}</p>
              <p><strong>Class:</strong> {selectedInquiry.class}</p>
              <p><strong>Status:</strong> {selectedInquiry.status}</p>
              <p><strong>Created:</strong> {selectedInquiry.createdAt}</p>
              <p><strong>Description:</strong> {selectedInquiry.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorHome;
