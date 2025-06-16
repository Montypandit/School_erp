import React from 'react';
import { Link } from 'react-router-dom';

const CoordinatorHome = () => {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1>Welcome Coordinator</h1>
      <div style={{ marginTop: '30px' }}>
        <Link 
          to="/coordinator/inquiry"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#667eea',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#764ba2'}
          onMouseLeave={(e) => e.target.style.background = '#667eea'}
        >
          Add New Inquiry
        </Link>
      </div>
    </div>
  );
};

export default CoordinatorHome;
