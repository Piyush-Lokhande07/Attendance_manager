import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import BACKEND_URL from '../config';

export default function Dashboard() {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const user = token ? jwtDecode(token) : { name: '' };

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchClasses = async () => {
      try {
        const classRes = await axios.get(`${BACKEND_URL}/api/class`, {
          headers: { Authorization: `${token}` },
        });
        setClasses(classRes.data);
      } catch (err) {
        console.error('Fetching classes failed:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchClasses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/class/${id}`, {
        headers: { Authorization: `${token}` },
      });
      setClasses((prev) => prev.filter((cls) => cls._id !== id));
      alert('Class deleted successfully!');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete class');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1f2937' }}>
          Your Classes
        </h2>
        <button
          onClick={() => navigate('/class/create')}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: 'background-color 0.3s',
            
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#2563eb')}
        >
          <FontAwesomeIcon
                        icon={faPlus}
                        style={{ color: 'white', fontSize: '14px', marginRight: '5px' }}
                      />
          Create Class
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {classes.map((cls) => (
          <div
            key={cls._id}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937' }}>
              {cls.name}
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#4b5563' }}>
              Subject: {cls.subject}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginTop: '10px',
              }}
            >
              <button
                onClick={() => navigate(`/class/edit/${cls._id}`)}
                style={buttonStyle('#facc15')}
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => handleDelete(cls._id)}
                style={buttonStyle('#f87171')}
              >
                <FontAwesomeIcon icon={faTrash} style={{ color: 'rgb(64, 62, 76)', marginRight: '5px' }} />
                Delete
              </button>

              <button
                onClick={() => navigate(`/attendance/mark/${cls._id}`)}
                style={buttonStyle('#34d399')}
              >
                📋 Take Attendance
              </button>

              <button
                onClick={() => navigate(`/attendance/view/${cls._id}`)}
                style={buttonStyle('#60a5fa')}
              >
                📄 View Attendance
              </button>

              <button
                onClick={() => navigate(`/class/${cls._id}/students`)}
                style={buttonStyle('#a78bfa')}
              >
                👥 Manage Students
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Reusable button styling
const buttonStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: '#1f2937',
  padding: '8px 12px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.9rem',
  transition: 'opacity 0.3s',
  boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
  opacity: 1,
  whiteSpace: 'nowrap',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  // Simple hover effect without darker shades
  onMouseEnter: (e) => (e.target.style.opacity = 0.9),
  onMouseLeave: (e) => (e.target.style.opacity = 1),
});
