import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

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

// Component
const MonthlyPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(() => {
    // Load events from localStorage if available
    const savedEvents = localStorage.getItem('plannerEvents');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#4a90e2',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const colorOptions = [
    '#4a90e2', // blue
    '#e74c3c', // red
    '#2ecc71', // green
    '#f39c12', // orange
    '#9b59b6', // purple
    '#1abc9c', // teal
  ];

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('plannerEvents', JSON.stringify(events));
  }, [events]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate the day of the week the month starts on (0 = Sunday, 1 = Monday, etc.)
  const startDay = monthStart.getDay();
  
  // Create array of days to display, including days from previous/next month to fill the grid
  const days = [];
  
  // Add days from previous month
  for (let i = 0; i < startDay; i++) {
    const date = new Date(monthStart);
    date.setDate(-startDay + i + 1);
    days.push(date);
  }
  
  // Add days of current month
  days.push(...daysInMonth);
  
  // Add days from next month to complete the grid (if needed)
  const remainingDays = 42 - days.length; // 6 rows of 7 days
  if (remainingDays > 0) {
    const lastDay = new Date(monthEnd);
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(lastDay);
      date.setDate(lastDay.getDate() + i);
      days.push(date);
    }
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setFormData({
      title: '',
      description: '',
      color: '#4a90e2',
      date: format(day, 'yyyy-MM-dd'),
    });
    setSelectedEvent(null);
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleEventClick = (event, day) => {
    // Prevent event click from triggering day click
    event.stopPropagation();
    
    setSelectedDate(day);
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      color: event.color,
      date: format(parseISO(event.date), 'yyyy-MM-dd'),
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorSelect = (color) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;
    
    if (isEditMode && selectedEvent) {
      // Update existing event
      setEvents(prev => 
        prev.map(evt => 
          evt.id === selectedEvent.id 
            ? { ...formData, id: selectedEvent.id, date: formData.date }
            : evt
        )
      );
    } else {
      // Add new event
      const newEvent = {
        ...formData,
        id: Date.now().toString(),
      };
      setEvents(prev => [...prev, newEvent]);
    }
    
    setShowModal(false);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      setEvents(prev => prev.filter(evt => evt.id !== selectedEvent.id));
      setShowModal(false);
    }
  };

  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, day);
    });
  };

  return (
    <PlannerContainer>
      <Header>
        <Title>Monthly Planner</Title>
        <MonthSelector>
          <NavButton onClick={prevMonth}>
            <span>‹</span> Previous
          </NavButton>
          <MonthTitle>{format(currentDate, 'MMMM yyyy')}</MonthTitle>
          <NavButton onClick={nextMonth}>
            Next <span>›</span>
          </NavButton>
        </MonthSelector>
      </Header>
      
      <DaysGrid>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
        
        {days.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          
          return (
            <DayCell 
              key={i}
              onClick={() => handleDayClick(day)}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.01 }}
            >
              <DayNumber isCurrentMonth={isCurrentMonth} isToday={isToday}>
                {format(day, 'd')}
              </DayNumber>
              
              <AnimatePresence>
                {dayEvents.map(event => (
                  <Event
                    key={event.id}
                    color={event.color}
                    onClick={(e) => handleEventClick(event, day)}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    layout
                  >
                    {event.title}
                  </Event>
                ))}
              </AnimatePresence>
              
              {isCurrentMonth && (
                <AddEventButton onClick={(e) => {
                  e.stopPropagation();
                  handleDayClick(day);
                }}>
                  +
                </AddEventButton>
              )}
            </DayCell>
          );
        })}
      </DaysGrid>
      
      {/* Event Modal */}
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
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{isEditMode ? 'Edit Event' : 'Add New Event'}</h2>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Event title"
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
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
                    placeholder="Add event details..."
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Color</Label>
                  <EventColors>
                    {colorOptions.map(color => (
                      <ColorOption
                        key={color}
                        color={color}
                        selected={formData.color === color}
                        onClick={() => handleColorSelect(color)}
                      />
                    ))}
                  </EventColors>
                </FormGroup>
                
                <ButtonGroup>
                  {isEditMode && (
                    <Button 
                      type="button" 
                      className="danger"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  )}
                  <Button 
                    type="button" 
                    className="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="primary"
                  >
                    {isEditMode ? 'Update' : 'Add'} Event
                  </Button>
                </ButtonGroup>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PlannerContainer>
  );
};

export default MonthlyPlanner;