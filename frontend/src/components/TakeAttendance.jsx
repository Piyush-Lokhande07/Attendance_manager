import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useClassInfo from './useClassInfo';
import BACKEND_URL from '../config';


export default function TakeAttendance() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const classInfo = useClassInfo(classId);

  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  useEffect(() => {
    if (!token) return navigate('/login');

    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/student/${classId}`,
          { headers: { Authorization: `${token}` } }
        );
        setStudents(res.data);

        const initial = {};
        res.data.forEach((s) => (initial[s._id] = 'Absent'));
        setAttendance(initial);
      } catch (err) {
        console.error('Error fetching students:', err);
        alert('Failed to fetch students.');
        navigate('/');
      }
    };

    fetchStudents();
  }, [classId]);

  const handleToggle = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present',
    }));
  };

  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to submit attendance?')) return;

    const data = students.map((s) => ({
      studentId: s._id,
      status: attendance[s._id] || 'Absent',
    }));

    try {
      await axios.post(
        `${BACKEND_URL}/api/attendance/`,
        { classId, date: today, records: data },
        { headers: { Authorization: `${token}` } }
      );
      alert('Attendance saved successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error saving attendance:', err);
      alert('Error saving attendance.');
    }
  };

  return (
    <div
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '24px',
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
      }}
    >
      
      <h2
        style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: '#1f2937',
        }}
      >
        {classInfo.name} ({classInfo.subject}) - Take Attendance
      </h2>
      <p style={{ marginBottom: '24px' }}>
        Date: <strong>{today}</strong>
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#e5e7eb' }}>
              <th style={thStyle}>Roll No</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student._id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <td style={tdStyle}>{student.rollNo}</td>
                <td style={tdStyle}>{student.name}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={attendance[student._id] === 'Present'}
                      onChange={() => handleToggle(student._id)}
                    />
                    {attendance[student._id] === 'Present' ? 'Present' : 'Absent'}
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#15803d')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#16a34a')}
        >
          ✅ Save Attendance
        </button>
      </div>
    </div>
  );
}

// ✅ Styles
const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: '600',
  color: '#374151',
  borderBottom: '2px solid #d1d5db',
};

const tdStyle = {
  padding: '10px 16px',
  color: '#374151',
  fontSize: '0.95rem',
};
