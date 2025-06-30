import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Search, Save, Edit, ChevronDown, ChevronUp, School, Shirt } from 'lucide-react';
import CoordinatorNavbar from './CoordinatorNavbar';



const StudentAllotmentManager = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllotmentModal, setShowAllotmentModal] = useState(false);
  const [showBooksModal, setShowBooksModal] = useState(false);
  const [showUniformModal, setShowUniformModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classStats, setClassStats] = useState({});
  const [expandedClass, setExpandedClass] = useState(null);
  const [allotmentData, setAllotmentData] = useState({
    section: '',
    books: [],
    academicYear: ''
  });

  const classes = ['LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8'];
  const sections = ['A', 'B', 'C', 'D'];
  const books = [
    'Mathematics', 'English', 'Hindi', 'Science', 'Social Studies',
    'Computer Science', 'Art & Craft', 'Physical Education'
  ];

  // Toast notification function
  const toast = {
    info: (message) => alert(`Info: ${message}`),
    error: (message) => alert(`Error: ${message}`),
    success: (message) => alert(`Success: ${message}`)
  };

  // Mock navigation function
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
       
        const token = sessionStorage.getItem('coordinatorToken');
        if (!token) {
          toast.info('Please login to continue');
          navigate('/coordinator/login');
          return;
        }

        const res = await fetch('http://localhost:5000/api/final/admission/get/all/admissions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch student data');
        }

        const data = await res.json();
        const mockStudents = data.data || [];


        setStudents(mockStudents);
        setFilteredStudents(mockStudents);
        calculateClassStats(mockStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error(error.message || 'Error fetching student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const calculateClassStats = (studentData) => {
    const stats = {};
    classes.forEach(cls => {
      const classStudents = studentData.filter(student =>
        student.class === cls || student.grade === cls
      );
      stats[cls] = {
        total: classStudents.length,
        sections: {},
        allotted: classStudents.filter(s => s.section && s.books?.length > 0).length
      };

      sections.forEach(section => {
        stats[cls].sections[section] = classStudents.filter(s => s.section === section).length;
      });
    });
    setClassStats(stats);
  };

  useEffect(() => {
    let filtered = students;

    if (selectedClass !== 'all') {
      filtered = filtered.filter(student =>
        student.class === selectedClass || student.grade === selectedClass
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [students, selectedClass, searchTerm]);

  const handleAllotment = (student) => {
    setSelectedStudent(student);
    setAllotmentData({
      section: student.section || '',
      books: student.books || [],
      academicYear: student.academicYear || ''
    });
    setShowAllotmentModal(true);
  };

  // New: Allocate Books
  const handleAllocateBooks = (student) => {
    setSelectedStudent(student);
    setAllotmentData({
      books: student.books || [],
      academicYear: student.academicYear || ''
    });
    setShowBooksModal(true);
  };

  // New: Allocate Uniform
  const handleAllocateUniform = (student) => {
    setSelectedStudent(student);
    setAllotmentData({
      uniform: student.uniform || '',
      academicYear: student.academicYear || ''
    });
    setShowUniformModal(true);
  };

  // Save section/academicYear/allocated to backend
  const saveAllotment = async () => {
    if (!allotmentData.academicYear || !allotmentData.section) {
      toast.error('Please select section and enter academic year.');
      return;
    }
    try {
      const token = sessionStorage.getItem('coordinatorToken');
      if(!token){
        toast.info('Please login to continue');
        navigate('/coordinator/login');
        return;
      }
      const res = await fetch('http://localhost:5000/api/coordinator/students/allocate/students/allocate/section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          admissionId: selectedStudent.admissionId || selectedStudent.studentId || selectedStudent.id,
          section: allotmentData.section,
          academicYear: allotmentData.academicYear,
          alloted: true
        })
      });
      if (!res.ok) throw new Error('Failed to save allotment');
      toast.success('Allotment saved successfully!');
      setShowAllotmentModal(false);
      // Optionally refetch students here
    } catch (error) {
      console.error('Error saving allotment:', error);
      toast.error('Failed to save allotment');
    }
  };

  // Dummy save for books (implement your logic)
  const saveBooksAllotment = async () => {
    toast.success('Books allocated!');
    setShowBooksModal(false);
    // Optionally call your backend here
  };

  // Dummy save for uniform (implement your logic)
  const saveUniformAllotment = async () => {
    toast.success('Uniform allocated!');
    setShowUniformModal(false);
    // Optionally call your backend here
  };

  const toggleBookSelection = (book) => {
    setAllotmentData(prev => ({
      ...prev,
      books: prev.books.includes(book)
        ? prev.books.filter(b => b !== book)
        : [...prev.books, book]
    }));
  };

  const getStatusColor = (student) => {
    if (student.section && student.books?.length > 0) return { color: '#10b981', backgroundColor: '#d1fae5' };
    if (student.section || student.books?.length > 0) return { color: '#f59e0b', backgroundColor: '#fef3c7' };
    return { color: '#ef4444', backgroundColor: '#fee2e2' };
  };

  const getStatusText = (student) => {
    if (student.section && student.books?.length > 0) return 'Complete';
    if (student.section || student.books?.length > 0) return 'Partial';
    return 'Pending';
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '24px'
    },
    maxWidth: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      padding: '24px',
      marginBottom: '24px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    subtitle: {
      color: '#6b7280',
      margin: 0
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    classCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '16px'
    },
    classHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px'
    },
    classTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      margin: 0
    },
    statRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    },
    statLabel: {
      fontSize: '14px',
      color: '#6b7280'
    },
    statValue: {
      fontWeight: '600'
    },
    filterContainer: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap'
    },
    searchContainer: {
      position: 'relative',
      flex: 1,
      minWidth: '300px'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '40px',
      paddingRight: '16px',
      paddingTop: '12px',
      paddingBottom: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af'
    },
    select: {
      width: '200px',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white',
      outline: 'none'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      backgroundColor: '#f9fafb',
      padding: '12px 24px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderBottom: '1px solid #e5e7eb'
    },
    td: {
      padding: '16px 24px',
      borderBottom: '1px solid #e5e7eb'
    },
    studentInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    avatar: {
      width: '40px',
      height: '40px',
      backgroundColor: '#dbeafe',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    badge: {
      padding: '4px 8px',
      fontSize: '12px',
      fontWeight: '500',
      borderRadius: '16px'
    },
    button: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '8px 8px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '8px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    modalHeader: {
      padding: '24px',
      borderBottom: '1px solid #e5e7eb'
    },
    modalBody: {
      padding: '24px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none'
    },
    bookGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '12px'
    },
    bookItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    modalFooter: {
      padding: '24px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px'
    },
    cancelButton: {
      padding: '8px 16px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  };

  return (
    <div>
    <CoordinatorNavbar/>
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <School size={32} color="#2563eb" />
              <div>
                <h1 style={styles.title}>Student Allotment Manager</h1>
                <p style={styles.subtitle}>Manage sections and book allotments for students</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Academic Year</p>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#2563eb', margin: 0 }}>2024-25</p>
            </div>
          </div>
        </div>

        {/* Class-wise Stats */}
        <div style={styles.grid}>
          {classes.map(cls => (
            <div key={cls} style={styles.classCard}>
              <div style={styles.classHeader}>
                <h3 style={styles.classTitle}>Class {cls}</h3>
                <button
                  onClick={() => setExpandedClass(expandedClass === cls ? null : cls)}
                  className={`chevron-button ${expandedClass === cls ? 'expanded' : ''}`}
                  style={{
                    background: expandedClass === cls ? '#f3f4f6' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    borderRadius: '4px',
                    padding: '6px',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  {expandedClass === cls ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              <div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Total Students</span>
                  <span style={{ ...styles.statValue, color: '#2563eb' }}>{classStats[cls]?.total || 0}</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Allotted</span>
                  <span style={{ ...styles.statValue, color: '#10b981' }}>{classStats[cls]?.allotted || 0}</span>
                </div>
                {expandedClass === cls && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Section Distribution:</p>
                    {sections.map(section => (
                      <div key={section} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: '#6b7280' }}>Section {section}</span>
                        <span style={{ fontWeight: '500' }}>{classStats[cls]?.sections?.[section] || 0}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={styles.card}>
          <div style={styles.filterContainer}>
            <div style={styles.searchContainer}>
              <Search style={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search by name, student ID, or roll number..."
                style={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              style={styles.select}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div style={styles.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              Students ({filteredStudents.length})
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                <span>Complete</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
                <span>Partial</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
                <span>Pending</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '2px solid #e5e7eb',
                borderTop: '2px solid #2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px'
              }}></div>
              <p style={{ color: '#6b7280' }}>Loading students...</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student</th>
                    <th style={styles.th}>Class</th>
                    <th style={styles.th}>Section</th>
                    <th style={styles.th}>Roll No.</th>
                    <th style={styles.th}>Books</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id || index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                      <td style={styles.td}>
                        <div style={styles.studentInfo}>
                          <div style={styles.avatar}>
                            <Users size={20} color="#2563eb" />
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{student.name || 'N/A'}</div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>{student.studentId || student.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ fontSize: '14px', color: '#111827' }}>{student.class || student.grade || 'N/A'}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: student.section ? '#dbeafe' : '#f3f4f6',
                          color: student.section ? '#1e40af' : '#6b7280'
                        }}>
                          {student.section || 'Not Assigned'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ fontSize: '14px', color: '#111827' }}>{student.rollNo || 'Not Assigned'}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ fontSize: '14px', color: student.books?.length ? '#2563eb' : '#6b7280' }}>
                          {student.books?.length ? `${student.books.length} books` : 'No books'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          ...getStatusColor(student)
                        }}>
                          {getStatusText(student)}
                        </span>
                      </td>
                      <td style={styles.td} className='flex gap-2'>
                        <button
                          onClick={() => handleAllotment(student)}
                          style={styles.button}
                        >
                          <Edit size={14} />
                          Allot Section
                        </button>
                        <button
                          onClick={() => handleAllocateBooks(student)}
                          style={{ ...styles.button, backgroundColor: '#55c2da', marginLeft: 8 }}
                        >
                          <BookOpen size={14} />
                          Allocate Books
                        </button>
                        <button
                          onClick={() => handleAllocateUniform(student)}
                          style={{ ...styles.button, backgroundColor: '#43a047', marginLeft: 8 }}
                        >
                          <Shirt size={14} />
                          Allocate Uniform
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Allotment Modal */}
        {showAllotmentModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Student Allotment - {selectedStudent?.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>Class: {selectedStudent?.class || selectedStudent?.grade}</p>
              </div>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Assign Section</label>
                  <select
                    style={styles.input}
                    value={allotmentData.section}
                    onChange={(e) => setAllotmentData(prev => ({ ...prev, section: e.target.value }))}
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section} value={section}>Section {section}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Academic Year</label>
                  <input
                    style={styles.input}
                    value={allotmentData.academicYear}
                    onChange={(e) => setAllotmentData(prev => ({ ...prev, academicYear: e.target.value }))}
                    placeholder="Academic Year"
                  />
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button
                  onClick={() => setShowAllotmentModal(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={saveAllotment}
                  style={styles.button}
                >
                  <Save size={16} />
                  Save Allotment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Books Modal */}
        {showBooksModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Allocate Books - {selectedStudent?.name}
                </h3>
              </div>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Assign Books ({allotmentData.books?.length || 0} selected)
                  </label>
                  <div style={styles.bookGrid}>
                    {books.map(book => (
                      <label key={book} style={styles.bookItem}>
                        <input
                          type="checkbox"
                          checked={allotmentData.books?.includes(book)}
                          onChange={() => toggleBookSelection(book)}
                        />
                        <BookOpen size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151' }}>{book}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button
                  onClick={() => setShowBooksModal(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={saveBooksAllotment}
                  style={styles.button}
                >
                  <Save size={16} />
                  Save Books
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Uniform Modal */}
        {showUniformModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Allocate Uniform - {selectedStudent?.name}
                </h3>
              </div>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Uniform Details</label>
                  <input
                    style={styles.input}
                    value={allotmentData.uniform || ''}
                    onChange={(e) => setAllotmentData(prev => ({ ...prev, uniform: e.target.value }))}
                    placeholder="Uniform details"
                  />
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button
                  onClick={() => setShowUniformModal(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={saveUniformAllotment}
                  style={styles.button}
                >
                  <Save size={16} />
                  Save Uniform
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    .chevron-button {
                        transition: background-color 0.2s ease !important;
                    }
                    
                    .chevron-button:hover {
                        background-color: #f3f4f6 !important;
                    }
                    
                    .chevron-button.expanded {
                        background-color: #f3f4f6 !important;
                    }
                    
                    .chevron-button:hover.expanded {
                        background-color: #e5e7eb !important;
                    }
                `}
      </style>
    </div>
    </div>
  );
};

export default StudentAllotmentManager;