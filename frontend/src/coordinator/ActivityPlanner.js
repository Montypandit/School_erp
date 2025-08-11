import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { utils, writeFileXLSX } from 'xlsx';
import CoordinatorNavbar from '../component/coordinator/CoordinatorNavbar';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

// Styled Components (reuse from monthlyPlanner.js)
const PlannerContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 1.8rem;
  margin: 0;
`;

const NavButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover { background: #357abd; transform: translateY(-1px);}
  &:disabled { background: #bdc3c7; cursor: not-allowed;}
`;

const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const MonthTitle = styled.h2`
  color: #2c3e50;
  min-width: 200px;
  text-align: center;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DayHeader = styled.div`
  text-align: center;
  font-weight: 600;
  color: #7f8c8d;
  padding: 0.5rem;
`;

const DayCell = styled(motion.div)`
  aspect-ratio: 1;
  background: ${({ $isCurrentMonth, $isToday }) => 
    $isToday ? '#e3f2fd' : $isCurrentMonth ? 'white' : '#f9f9f9'};
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const DayNumber = styled.div`
  font-weight: 600;
  color: ${({ $isCurrentMonth, $isToday }) => 
    $isToday ? '#1e88e5' : $isCurrentMonth ? '#2c3e50' : '#bdc3c7'};
  margin-bottom: 0.5rem;
`;

const Event = styled(motion.div)`
  background: ${({ color }) => color || '#4a90e2'};
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  margin-bottom: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 10000;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border 0.2s ease;
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border 0.2s ease;
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  &.primary {
    background: #4a90e2;
    color: white;
    &:hover { background: #357abd; }
  }
  &.secondary {
    background: #f5f5f5;
    color: #2c3e50;
    &:hover { background: #e0e0e0; }
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const StyledButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  &.primary {
    background: #4a90e2;
    color: white;
    &:hover { background: #357abd; }
  }
  &.danger {
    background: #e74c3c;
    color: white;
    &:hover { background: #c0392b; }
  }
`;

const activityTypes = [
  'Sports', 'Cultural', 'Academic', 'Workshop', 'Seminar', 'Competition', 'Field Trip', 'Exhibition', 'Meeting', 'Celebration', 'Training', 'Other'
];
const statuses = ['planned', 'approved', 'ongoing', 'completed', 'cancelled', 'postponed'];
const classOptions = [
  'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
];
const sectionOptions = ['A', 'B', 'C', 'D'];

const ActivityPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activityType: 'Sports',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    time: {
      startTime: '',
      endTime: ''
    },
    venue: '',
    classesInvolved: [],
    status: 'planned'
  });
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    type: 'month',
    month: currentDate.getMonth(), // 0-11
    year: currentDate.getFullYear(),
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const navigate = useNavigate();

  // Fetch all activities
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('coordinatorToken');
      if(!token){
        toast.error('Please login to continue');
        navigate('/');
        return;
      }
      const res = await fetch('https://school-erp-11-mr7k.onrender.com/api/activity/planner/get/all/activities', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(!res.ok) throw new Error('Failed to fetch activities');
      const data = await res.json();
      setActivities(data.data || []);
    } catch (err) {
      toast.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line
  }, [currentDate, showModal]);

  // Filter activities for current month (show if any part of activity is in this month)
  const monthActivities = activities.filter(act => {
    const start = parseISO(act.startDate);
    const end = parseISO(act.endDate);
    const monthStartDate = startOfMonth(currentDate);
    const monthEndDate = endOfMonth(currentDate);
    return (start <= monthEndDate && end >= monthStartDate);
  });

  // Calendar logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = monthStart.getDay();
  const days = [];
  for (let i = 0; i < startDay; i++) {
    const date = new Date(monthStart);
    date.setDate(-startDay + i + 1);
    days.push(date);
  }
  days.push(...daysInMonth);
  const remainingDays = 42 - days.length;
  if (remainingDays > 0) {
    const lastDay = new Date(monthEnd);
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(lastDay);
      date.setDate(lastDay.getDate() + i);
      days.push(date);
    }
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  
const downloadExcel = () => {
  const filteredActivities = monthActivities.filter(act => 
    act.classesInvolved?.some(cls => 
      cls.class === selectedClass && cls.section === selectedSection
    )
  );

  if (filteredActivities.length === 0) {
    toast.info("No activities found for selected class & section");
    return;
  }

  const data = filteredActivities.map(act => ({
    Date: `${format(parseISO(act.startDate), 'dd MMM yyyy')} - ${format(parseISO(act.endDate), 'dd MMM yyyy')}`,
    Time: `${act.time?.startTime} - ${act.time?.endTime}`,
    Title: act.title,
    ActivityType: act.activityType,
    Venue: act.venue,
    Status: act.status,
    Description: act.description || '',
    Classes: act.classesInvolved?.map(c => `${c.class}${c.section ? '-' + c.section : ''}`).join(', ')
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Monthly Activities");

  const fileName = `Activity_${selectedClass}_${selectedSection}_${format(currentDate, 'MMM_yyyy')}.xlsx`;
  XLSX.writeFile(wb, fileName);
  toast.success("Excel file downloaded successfully");
};



  // Get activities for a specific day
  const getActivitiesForDay = (day) => {
    return monthActivities.filter(act => {
      const start = format(parseISO(act.startDate), 'yyyy-MM-dd');
      const end = format(parseISO(act.endDate), 'yyyy-MM-dd');
      const d = format(day, 'yyyy-MM-dd');
      return d >= start && d <= end;
    });
  };

  // Modal handlers
  const openModal = (day) => {
    setFormData({
      title: '',
      description: '',
      activityType: 'Sports',
      startDate: format(day, 'yyyy-MM-dd'),
      endDate: format(day, 'yyyy-MM-dd'),
      time: {
        startTime: '',
        endTime: ''
      },
      venue: '',
      classesInvolved: [],
      status: 'planned'
    });
    setIsUpdateMode(false);
    setShowModal(true);
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startTime' || name === 'endTime') {
      setFormData(prev => ({
        ...prev,
        time: { ...prev.time, [name]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle classes involved (multi-select)
  const handleClassSectionChange = (idx, field, value) => {
    setFormData(prev => {
      const updated = [...prev.classesInvolved];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, classesInvolved: updated };
    });
  };

  const addClassSection = () => {
    setFormData(prev => ({
      ...prev,
      classesInvolved: [...prev.classesInvolved, { class: '', section: '' }]
    }));
  };

  const removeClassSection = (idx) => {
    setFormData(prev => ({
      ...prev,
      classesInvolved: prev.classesInvolved.filter((_, i) => i !== idx)
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = sessionStorage.getItem('coordinatorToken');
      if (!token) {
        toast.error('Please login to continue');
        navigate('/');
        return;
      }

      // Prepare the payload
      const payload = { ...formData };

      const url = isUpdateMode
        ? `https://school-erp-11-mr7k.onrender.com/api/activity/planner/update/activity/${formData._id}`
        : 'https://school-erp-11-mr7k.onrender.com/api/activity/planner/create/new/activity';
      
      const method = isUpdateMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${isUpdateMode ? 'update' : 'create'} activity`);
      }

      toast.success(`Activity ${isUpdateMode ? 'Updated' : 'Created'} Successfully`);
      setShowModal(false);
      fetchActivities();
    } catch (err) {
      toast.error(err.message || `An error occurred`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem('coordinatorToken');
      const res = await fetch(`https://school-erp-11-mr7k.onrender.com/api/activity/planner/delete/activity/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete activity');
      toast.success('Activity deleted successfully');
      fetchActivities();
      setSelectedDay(null); // Optionally close the popup after delete
    } catch (err) {
      toast.error('Failed to delete activity');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (act) => {
    setFormData({
      _id: act._id,
      title: act.title,
      description: act.description,
      activityType: act.activityType,
      startDate: format(parseISO(act.startDate), 'yyyy-MM-dd'),
      endDate: format(parseISO(act.endDate), 'yyyy-MM-dd'),
      time: {
        startTime: act.time?.startTime || '',
        endTime: act.time?.endTime || ''
      },
      venue: act.venue,
      classesInvolved: act.classesInvolved || [],
      status: act.status
    });
    setIsUpdateMode(true);
    setShowModal(true);
  };

  const handleDownload = () => {
    let filteredActivities = [];
    if (filterOptions.type === 'month') {
      const selectedMonth = parseInt(filterOptions.month, 10);
      const selectedYear = parseInt(filterOptions.year, 10);
      filteredActivities = activities.filter(act => {
        const actDate = parseISO(act.startDate);
        return actDate.getMonth() === selectedMonth && actDate.getFullYear() === selectedYear;
      });
    } else { // dateRange
      const start = new Date(filterOptions.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(filterOptions.endDate);
      end.setHours(23, 59, 59, 999);
      filteredActivities = activities.filter(act => {
        const actStart = parseISO(act.startDate);
        return actStart >= start && actStart <= end;
      });
    }

    if (filteredActivities.length === 0) {
      toast.warn('No activities found for the selected filter.');
      return;
    }

    const dataForExcel = filteredActivities.map(act => ({
      'Title': act.title,
      'Activity Type': act.activityType,
      'Start Date': format(parseISO(act.startDate), 'dd-MM-yyyy'),
      'End Date': format(parseISO(act.endDate), 'dd-MM-yyyy'),
      'Start Time': act.time?.startTime || 'N/A',
      'End Time': act.time?.endTime || 'N/A',
      'Venue': act.venue,
      'Status': act.status,
      'Classes Involved': act.classesInvolved?.map(c => `${c.class}${c.section ? '-' + c.section : ''}`).join(', ') || 'N/A',
      'Description': act.description
    }));

    const worksheet = utils.json_to_sheet(dataForExcel);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Activities');

    const cols = Object.keys(dataForExcel[0]).map(key => ({
      wch: Math.max(key.length, ...dataForExcel.map(row => (row[key] || '').toString().length)) + 2
    }));
    worksheet['!cols'] = cols;

    writeFileXLSX(workbook, `Activity_Report_${filterOptions.type === 'month' ? `${filterOptions.month + 1}-${filterOptions.year}` : `${filterOptions.startDate}_to_${filterOptions.endDate}`}.xlsx`);
    setShowDownloadModal(false);
  };

  return (
    <>
      <CoordinatorNavbar />
      <PlannerContainer>
        <Header>
          <Title>Activity Planner (Class-wise)</Title>
          <MonthSelector>
            <NavButton onClick={prevMonth}><span>‹</span> Previous</NavButton>
            <MonthTitle>{format(currentDate, 'MMMM yyyy')}</MonthTitle>
            <NavButton onClick={nextMonth}>Next <span>›</span></NavButton>
          </MonthSelector>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <NavButton onClick={() => setShowDownloadModal(true)}>Download Report</NavButton>
            <NavButton onClick={() => openModal(new Date())}>+ Create Activity</NavButton>
          </div>
        </Header>

        <DaysGrid>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <DayHeader key={day}>{day}</DayHeader>
          ))}
          {days.map((day, i) => {
            const dayActs = getActivitiesForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            return (
              <DayCell
                key={i}
                $isCurrentMonth={isCurrentMonth} // transient prop
                $isToday={isToday} // transient prop
                onClick={() => setSelectedDay(format(day, 'yyyy-MM-dd'))}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.01 }}
                style={{ position: 'relative' }}
              >
                <DayNumber $isCurrentMonth={isCurrentMonth} $isToday={isToday}>
                  {format(day, 'd')}
                </DayNumber>
                <AnimatePresence>
                  {dayActs.map(act => (
                    <Event
                      key={act._id}
                      color="#43a047"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      layout
                    >
                      <div style={{ fontWeight: 600 }}>{act.title}</div>
                      <div style={{ fontSize: '0.7em' }}>{act.activityType}</div>
                    </Event>
                  ))}
                </AnimatePresence>
              </DayCell>
            );
          })}
        </DaysGrid>
        
<div style={{ marginTop: '1rem', textAlign: 'center' }}>
          
          <h2 style={{ marginBottom: '0.5rem', color: 'blue',   }}>Download Monthly Activity Report</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>

        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
  <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
    <option value="">Select Class</option>
    {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
  </select>
  <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
    <option value="">Select Section</option>
    {sectionOptions.map(s => <option key={s} value={s}>{s}</option>)}
  </select>
  <button 
    onClick={downloadExcel}
    disabled={!selectedClass || !selectedSection}
    style={{
      padding: '0.6rem 1rem',
      border: 'none',
      borderRadius: '6px',
      background: '#2ecc71',
      color: 'white',
      cursor: 'pointer'
    }}
  >
    📥 Download Excel
  </button>

 <button 
  onClick={() => {
    const message = `Hello! Please find the activity report for Class ${selectedClass}, Section ${selectedSection}.`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  }}
  disabled={!selectedClass || !selectedSection}
  style={{
    padding: '0.6rem 1rem',
    border: 'none',
    borderRadius: '6px',
    background: '#25D366', // WhatsApp green
    color: 'white',
    cursor: 'pointer'
  }}
>
  📥 Share via WhatsApp
</button>

</div>
        </div>
        </div>


        {/* Modal for creating an activity */}
        <AnimatePresence>
          {showModal && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <ModalContent
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <h2>{isUpdateMode ? 'Update Activity' : 'Create Activity'}</h2>
                <form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label>Title</Label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Description</Label>
                    <TextArea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Activity Type</Label>
                    <select
                      name="activityType"
                      value={formData.activityType}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: 6, border: '1px solid #ddd' }}
                    >
                      {activityTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </FormGroup>
                  <FormGroup>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      name="startTime"
                      value={formData.time.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      name="endTime"
                      value={formData.time.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Venue</Label>
                    <Input
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Classes Involved</Label>
                    {formData.classesInvolved.map((cls, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <select
                          value={cls.class}
                          onChange={e => handleClassSectionChange(idx, 'class', e.target.value)}
                          required
                        >
                          <option value="">Class</option>
                          {classOptions.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <select
                          value={cls.section}
                          onChange={e => handleClassSectionChange(idx, 'section', e.target.value)}
                          required
                        >
                          <option value="">Section</option>
                          {sectionOptions.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <Button type="button" className="danger" onClick={() => removeClassSection(idx)} style={{ padding: '0 10px' }}>×</Button>
                      </div>
                    ))}
                    <Button type="button" className="secondary" onClick={addClassSection}>+ Add Class/Section</Button>
                  </FormGroup>
                  <FormGroup>
                    <Label>Status</Label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: 6, border: '1px solid #ddd' }}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </FormGroup>
                  <ButtonGroup>
                    <StyledButton 
                      type="button" 
                      className="secondary"
                      onClick={() => setShowModal(false)}
                      style={{ 
                        fontSize: '1rem', 
                        padding: '10px 20px', 
                        borderRadius: '8px',
                        minWidth: '120px'
                      }}
                    >
                      Cancel
                    </StyledButton>
                    <StyledButton 
                      type="submit" 
                      className="primary"
                      disabled={loading}
                      style={{ 
                        fontSize: '1rem', 
                        padding: '10px 20px', 
                        borderRadius: '8px',
                        minWidth: '120px'
                      }}
                    >
                      {loading ? 'Saving...' : isUpdateMode ? 'Update' : 'Create'}
                    </StyledButton>
                  </ButtonGroup>
                </form>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* Popup for viewing all activities on a day */}
        {selectedDay && getActivitiesForDay(new Date(selectedDay)).length > 0 && (
          <div
            style={{
              position: 'fixed',
              top: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              background: '#fff',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              borderRadius: 14,
              minWidth: 320,
              maxWidth: 480,
              maxHeight: 420,
              overflowY: 'auto',
              padding: '1.5rem 2rem',
              fontSize: '1em',
              border: '1px solid #e3e3e3',
              textAlign: 'left',
              pointerEvents: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: '#1976d2', fontSize: '1.15em' }}>
                Activities for {format(new Date(selectedDay), 'dd MMM yyyy')} ({getActivitiesForDay(new Date(selectedDay)).length})
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5em',
                  color: '#888',
                  cursor: 'pointer',
                  marginLeft: 12,
                  lineHeight: 1
                }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            {getActivitiesForDay(new Date(selectedDay)).map(act => (
              <div key={act._id} style={{ marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 8, position: 'relative' }}>
                <div style={{ fontWeight: 600, color: '#333', fontSize: '1.05em' }}>{act.title}</div>
                <div style={{ fontSize: '0.95em', color: '#1976d2', fontWeight: 500 }}>{act.activityType}</div>
                <div style={{ fontSize: '0.92em', color: '#888' }}>
                  {format(parseISO(act.startDate), 'dd MMM yyyy')} {act.time?.startTime} - {format(parseISO(act.endDate), 'dd MMM yyyy')} {act.time?.endTime}
                </div>
                <div style={{ fontSize: '0.92em', color: '#888' }}>
                  Venue: {act.venue}
                </div>
                <div style={{ fontSize: '0.92em', color: '#888' }}>
                  Status: {act.status}
                </div>
                <div style={{ fontSize: '0.92em', color: '#888' }}>
                  Classes: {act.classesInvolved?.map(c => `${c.class}${c.section ? '-' + c.section : ''}`).join(', ')}
                </div>
                {act.description && (
                  <div style={{ fontSize: '0.92em', color: '#555', marginTop: 2 }}>
                    {act.description}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 12 }}>
                  <StyledButton 
                    onClick={() => handleEdit(act)}
                    className="primary"
                    style={{ 
                      fontSize: '1rem', 
                      padding: '10px 20px', 
                      borderRadius: '8px',
                      minWidth: '120px'
                    }}
                  >
                    Update
                  </StyledButton>
                  <StyledButton 
                    onClick={() => handleDelete(act._id)}
                    className="danger"
                    style={{ 
                      fontSize: '1rem', 
                      padding: '10px 20px', 
                      borderRadius: '8px',
                      minWidth: '120px'
                    }}
                  >
                    Delete
                  </StyledButton>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Download Modal */}
        <AnimatePresence>
          {showDownloadModal && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDownloadModal(false)}
            >
              <ModalContent
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <h2>Download Activity Report</h2>
                <FormGroup>
                  <Label>Filter Type</Label>
                  <Select
                    value={filterOptions.type}
                    onChange={e => setFilterOptions(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="month">By Month</option>
                    <option value="dateRange">By Date Range</option>
                  </Select>
                </FormGroup>

                {filterOptions.type === 'month' ? (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Month</Label>
                      <Select
                        value={filterOptions.month}
                        onChange={e => setFilterOptions(prev => ({ ...prev, month: e.target.value }))}
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i}>{format(new Date(0, i), 'MMMM')}</option>
                        ))}
                      </Select>
                    </FormGroup>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Year</Label>
                      <Input type="number" value={filterOptions.year} onChange={e => setFilterOptions(prev => ({ ...prev, year: e.target.value }))} />
                    </FormGroup>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Start Date</Label>
                      <Input type="date" value={filterOptions.startDate} onChange={e => setFilterOptions(prev => ({ ...prev, startDate: e.target.value }))} />
                    </FormGroup>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>End Date</Label>
                      <Input type="date" value={filterOptions.endDate} onChange={e => setFilterOptions(prev => ({ ...prev, endDate: e.target.value }))} />
                    </FormGroup>
                  </div>
                )}

                <ButtonGroup>
                  <Button type="button" className="secondary" onClick={() => setShowDownloadModal(false)}>Cancel</Button>
                  <Button type="button" className="primary" onClick={handleDownload}>Download</Button>
                </ButtonGroup>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </PlannerContainer>
    </>
  );
};

export default ActivityPlanner;
