import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all students from backend
    fetch('https://your-backend-url.com/get/all/students')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error(err));
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(query.toLowerCase()) ||
    student.admissionId.includes(query)
  );

  return (
    <div style={{ padding: '20px' }}>
      <TextField
        label="Search by name or admission ID"
        variant="outlined"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <List>
        {filteredStudents.map(student => (
          <ListItem
            key={student.admissionId}
            secondaryAction={
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/update-fees/${student.admissionId}`)}
              >
                Update Fees
              </Button>
            }
          >
            <ListItemText
              primary={student.name}
              secondary={`Admission ID: ${student.admissionId}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default StudentListPage;
