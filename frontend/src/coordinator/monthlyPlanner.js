import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import {toast} from 'react-toastify';
import CoordinatorNavbar from '../component/coordinator/CoordinatorNavbar';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

// Styled Components
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
  
  &:hover {
    background: #357abd;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
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
  background: ${({ isCurrentMonth, isToday }) => 
    isToday ? '#e3f2fd' : isCurrentMonth ? 'white' : '#f9f9f9'};
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
  color: ${({ isCurrentMonth, isToday }) => 
    isToday ? '#1e88e5' : isCurrentMonth ? '#2c3e50' : '#bdc3c7'};
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

const AddEventButton = styled.button`
  width: 100%;
  margin-top: 0.5rem;
  background: #e3f2fd;
  border: 1px dashed #4a90e2;
  color: #4a90e2;
  border-radius: 4px;
  padding: 0.3rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #bbdefb;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
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
    
    &:hover {
      background: #357abd;
    }
  }
  
  &.secondary {
    background: #f5f5f5;
    color: #2c3e50;
    
    &:hover {
      background: #e0e0e0;
    }
  }
  
  &.danger {
    background: #e74c3c;
    color: white;
    
    &:hover {
      background: #c0392b;
    }
  }
`;

const EventColors = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ColorOption = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ color }) => color};
  cursor: pointer;
  border: 2px solid ${({ selected, color }) => (selected ? '#2c3e50' : 'transparent')};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const eventTypes = [
  'academic', 'exam', 'holiday', 'meeting', 'event', 'assignment', 'project', 'extracurricular', 'maintenance', 'other'
];
const semesters = ['1st', '2nd', 'summer'];
const statuses = ['planned', 'ongoing', 'completed', 'cancelled', 'postponed'];

const classOptions = [
  'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
];

// Component
const MonthlyPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    class: '',
    description: '',
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    eventType: 'academic',
    status: 'planned',
    academicYear: `${currentDate.getFullYear()}-${currentDate.getFullYear() + 1}`,
    venue: ''
  });
  const [loading, setLoading] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
   const [selectedClass, setSelectedClass] = useState('');
   

    

  const downloadExcel = () => {
    const filteredActivities = monthPlans.filter(act => 
  act.classesInvolved?.some(cls => cls.class === selectedClass)
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
      Class: act.classesInvolved?.[0]?.class || ''

    }));
  
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Activities");
  
    const fileName = `Activity_${selectedClass}_${format(currentDate, 'MMM_yyyy')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success("Excel file downloaded successfully");
  };
  
  // Fetch all plans for the month
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('coordinatorToken');
        const res = await fetch('http://localhost:5000/api/monthly/planner/get/all/monthly/planners', {
          method:'GET',
          headers: { 
            'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setPlans(data.data || []);
      } catch (err) {
        console.log(err);
        toast.error('Failed to update planner')
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [showModal]);

  // Filter plans for current month
  const monthPlans = plans.filter(
    plan => plan.month === (currentDate.getMonth() + 1) && plan.year === currentDate.getFullYear()
  );
  
  const navigate = useNavigate();

  // Calendar logic (same as before)
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
  //const sectionOptions = ['A', 'B', 'C', 'D', 'E', 'F']; // or dynamic from backend

  // Get plans for a specific day
  const getPlansForDay = (day) => {
    return monthPlans.filter(plan => {
      const start = format(parseISO(plan.startDate), 'yyyy-MM-dd');
      const end = format(parseISO(plan.endDate), 'yyyy-MM-dd');
      const d = format(day, 'yyyy-MM-dd');
      return d >= start && d <= end;
    });
  };

  // Modal handlers
  const openModal = (day, plan) => {
    if(plan){
      setFormData({
        ...formData,
        title: plan.title,
        class: plan.class,
        description: plan.description,
        month: plan.month,
        year: plan.year,
        startDate: plan.startDate,
        endDate: plan.endDate,
        eventType: plan.eventType,
        status: plan.status,
        academicYear: plan.academicYear,
        venue: plan.venue,
        _id: plan._id
      });
    } else {
      setFormData({
        ...formData,
        startDate: format(day, 'yyyy-MM-dd'),
        endDate: format(day, 'yyyy-MM-dd'),
        month: day.getMonth() + 1,
        year: day.getFullYear()
      });
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = sessionStorage.getItem('coordinatorToken');
      if(!token){
        toast.error('Please login to continue');
        navigate('/');
        return;
      }
      if(formData._id){
        const res = await fetch(`http://localhost:5000/api/monthly/planner/update/monthly/plan/by/${formData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Failed to update plan');
        toast.success('Planner Updated Successfully');
      } else {
        const res = await fetch('http://localhost:5000/api/monthly/planner/create/monthly/planner', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Failed to create plan');
        toast.success('Planner Created Successfully');
      }
      setShowModal(false);
    } catch (err) {
      console.log(err);
      toast.error('Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem('coordinatorToken');
      const res = await fetch(`http://localhost:5000/api/monthly/planner/delete/monthly/plan/by/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete plan');
      toast.success('Plan deleted successfully');
      setSelectedDay(null); // Optionally close the popup after delete
      // Refetch plans
      const fetchPlans = async () => {
        try {
          const token = sessionStorage.getItem('coordinatorToken');
          const res = await fetch('http://localhost:5000/api/monthly/planner/get/all/monthly/planners', {
            method:'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          setPlans(data.data || []);
        } catch (err) {
          toast.error('Failed to update planner');
        }
      };
      fetchPlans();
    } catch (err) {
      toast.error('Failed to delete plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CoordinatorNavbar />
      <PlannerContainer>
        <Header>
          <Title>Monthly Planner (Class-wise)</Title>
          <MonthSelector>
            <NavButton onClick={prevMonth}><span>‹</span> Previous</NavButton>
            <MonthTitle>{format(currentDate, 'MMMM yyyy')}</MonthTitle>
            <NavButton onClick={nextMonth}>Next <span>›</span></NavButton>
          </MonthSelector>
          <NavButton onClick={() => openModal(new Date())}>+ Create Plan</NavButton>
        </Header>

        <DaysGrid>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <DayHeader key={day}>{day}</DayHeader>
          ))}
          {days.map((day, i) => {
            const dayPlans = getPlansForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            return (
              <DayCell
                key={i}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                onClick={() => setSelectedDay(format(day, 'yyyy-MM-dd'))}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.01 }}
                style={{ position: 'relative' }}
              >
                <DayNumber isCurrentMonth={isCurrentMonth} isToday={isToday}>
                  {format(day, 'd')}
                </DayNumber>
                <AnimatePresence>
                  {dayPlans.map(plan => (
                    <Event
                      key={plan._id}
                      color="#4a90e2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      layout
                    >
                      <div style={{ fontWeight: 600 }}>{plan.title}</div>
                      <div style={{ fontSize: '0.7em' }}>{plan.class}</div>
                    </Event>
                  ))}
                </AnimatePresence>
                {/* Tooltip for all tasks on hover */}
                {hoveredDay === format(day, 'yyyy-MM-dd') && dayPlans.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 10px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 200,
                      background: '#fff',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                      borderRadius: 10,
                      minWidth: 240,
                      maxWidth: 340,
                      maxHeight: 260,
                      overflowY: 'auto',
                      padding: '1rem',
                      fontSize: '0.97em',
                      border: '1px solid #e3e3e3',
                      textAlign: 'left',
                      pointerEvents: 'auto'
                    }}
                  >
                    {/* Arrow */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: -10,
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '10px solid transparent',
                      borderRight: '10px solid transparent',
                      borderTop: '10px solid #fff',
                      filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.08))'
                    }} />
                    <div style={{ fontWeight: 700, marginBottom: 8, color: '#1976d2', fontSize: '1.05em' }}>
                      Scheduled Tasks ({dayPlans.length})
                    </div>
                    {dayPlans.map(plan => (
                      <div key={plan._id} style={{ marginBottom: 10, borderBottom: '1px solid #f0f0f0', paddingBottom: 6 }}>
                        <div style={{ fontWeight: 600, color: '#333' }}>{plan.title}</div>
                        <div style={{ fontSize: '0.9em', color: '#1976d2', fontWeight: 500 }}>{plan.class}</div>
                        <div style={{ fontSize: '0.85em', color: '#888' }}>
                          {plan.eventType} | {plan.status}
                        </div>
                        {plan.venue && (
                          <div style={{ fontSize: '0.85em', color: '#888' }}>
                            Venue: {plan.venue}
                          </div>
                        )}
                        {plan.description && (
                          <div style={{ fontSize: '0.85em', color: '#555', marginTop: 2 }}>
                            {plan.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
 
    
  <button 
    onClick={downloadExcel}
    disabled={!selectedClass }
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
    const message = `Hello! Please find the activity report for Class ${selectedClass} for ${format(currentDate, 'MMMM yyyy')}.`;

    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  }}
  disabled={!selectedClass }
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

        {/* Modal for creating a plan */}
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
                <h2>{formData._id ? 'Update Monthly Plan' : 'Create Monthly Plan'}</h2>
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
                    <Label>Class</Label>
                    <select
                      name="class"
                      value={formData.class}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: 6, border: '1px solid #ddd' }}
                    >
                      <option value="">Select Class</option>
                      {classOptions.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </FormGroup>
                  <FormGroup>
                    <Label>Description</Label>
                    <TextArea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Event Type</Label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: 6, border: '1px solid #ddd' }}
                    >
                      {eventTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
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
                  <FormGroup>
                    <Label>Academic Year</Label>
                    <Input
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
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
                    <Label>Venue</Label>
                    <Input
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <ButtonGroup>
                    <Button type="button" className="secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="primary" disabled={loading}>
                      {loading ? (formData._id ? 'Updating...' : 'Saving...') : (formData._id ? 'Update' : 'Create')}
                    </Button>
                  </ButtonGroup>
                </form>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {selectedDay && getPlansForDay(new Date(selectedDay)).length > 0 && (
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
                Plans for {format(new Date(selectedDay), 'dd MMM yyyy')} ({getPlansForDay(new Date(selectedDay)).length})
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
            {getPlansForDay(new Date(selectedDay)).map(plan => (
              <div key={plan._id} style={{ marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 8, position: 'relative' }}>
                <div style={{ fontWeight: 600, color: '#333', fontSize: '1.05em' }}>{plan.title}</div>
                <div style={{ fontSize: '0.95em', color: '#1976d2', fontWeight: 500 }}>{plan.class}</div>
                <div style={{ fontSize: '0.85em', color: '#888' }}>
                  {plan.eventType} | {plan.status}
                </div>
                {plan.venue && (
                  <div style={{ fontSize: '0.85em', color: '#888' }}>
                    Venue: {plan.venue}
                  </div>
                )}
                {plan.description && (
                  <div style={{ fontSize: '0.85em', color: '#555', marginTop: 2 }}>
                    {plan.description}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, gap: 8 }}>
                  <Button 
                    onClick={() => openModal(null, plan)}
                    className="primary"
                    style={{ fontSize: '0.85em', padding: '4px 12px' }}
                  >
                    Update
                  </Button>
                  <Button 
                    onClick={() => handleDelete(plan._id)}
                    className="danger"
                    style={{ fontSize: '0.85em', padding: '4px 12px' }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </PlannerContainer>
    </>
  );
};

export default MonthlyPlanner;