import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useClassInfo from './useClassInfo';
import BACKEND_URL from '../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

export default function EditAttendance() {
  const { classId, date } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const classInfo = useClassInfo(classId);

  useEffect(() => {
    if (!token) return navigate('/login');

    const fetchData = async () => {
      try {
        const studentRes = await axios.get(
          `${BACKEND_URL}/api/student/${classId}`,
          { headers: { Authorization: `${token}` } }
        );
        const sortedStudents = studentRes.data.sort(
          (a, b) => Number(a.rollNo) - Number(b.rollNo)
        );
        setStudents(sortedStudents);

        const attendanceRes = await axios.get(
          `${BACKEND_URL}/api/attendance/${classId}/${date}`,
          { headers: { Authorization: `${token}` } }
        );

        const initial = {};
        attendanceRes.data.records.forEach(r => {
          initial[r.studentId._id] = r.status;
        });

        sortedStudents.forEach(s => {
          if (!initial[s._id]) {
            initial[s._id] = 'Absent';
          }
        });

        setAttendance(initial);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Error fetching data');
        navigate('/');
      }
    };

    fetchData();
  }, [classId, date]);

  const handleToggle = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present',
    }));
  };

  const handleSubmit = async () => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this attendance?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, update it!',
    });

    if (!confirm.isConfirmed) return;

    const records = students.map(s => ({
      studentId: s._id,
      status: attendance[s._id] || 'Absent',
    }));

    try {
      await axios.put(
        `${BACKEND_URL}/api/attendance/${classId}/${date}`,
        { records },
        { headers: { Authorization: `${token}` } }
      );

      toast.success('Attendance updated successfully!');
      navigate(`/attendance/view/${classId}`);
    } catch (err) {
      console.error('Error updating attendance:', err);
      toast.error('Error updating attendance');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>
        {classInfo.name} ({classInfo.subject}) - Edit Attendance
      </h2>
      <p style={subHeaderStyle}>
        Date: <strong>{date}</strong>
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: '#e5e7eb' }}>
              <th style={thStyle}>Roll No</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id} style={rowStyle}>
                <td style={tdStyle}>{student.rollNo}</td>
                <td style={tdStyle}>{student.name}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <label style={labelStyle}>
                    <input
                      type="checkbox"
                      checked={attendance[student._id] === 'Present'}
                      onChange={() => handleToggle(student._id)}
                    />
                    <span>
                      {attendance[student._id] === 'Present' ? 'Present' : 'Absent'}
                    </span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '24px',
        }}
      >
        <button
          onClick={handleSubmit}
          style={blueButton}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          ✅ Update Attendance
        </button>
        <button
          type="button"
          onClick={() => navigate(`/attendance/view/${classId}`)}
          style={cancelButton}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ✅ Styles
const containerStyle = {
  maxWidth: '1000px',
  margin: '20px auto',
  padding: '20px',
  backgroundColor: '#f9fafb',
  minHeight: '100vh',
};
const headerStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '16px',
  color: '#1f2937',
};
const subHeaderStyle = {
  marginBottom: '16px',
  color: '#374151',
};
const tableStyle = {
  width: '100%',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  border: '1px solid #e5e7eb',
  borderCollapse: 'collapse',
};
const thStyle = {
  border: '1px solid #e5e7eb',
  padding: '12px',
  textAlign: 'left',
  fontWeight: '600',
  color: '#374151',
};
const tdStyle = {
  border: '1px solid #e5e7eb',
  padding: '10px',
  color: '#374151',
};
const rowStyle = {
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};
const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  justifyContent: 'center',
};
const blueButton = {
  backgroundColor: '#2563eb',
  color: 'white',
  padding: '10px 24px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginRight: '12px',
};
const cancelButton = {
  background: 'none',
  border: 'none',
  color: '#4b5563',
  cursor: 'pointer',
  textDecoration: 'underline',
  textAlign: 'center',
  fontSize: '0.9rem',
  padding: '4px',
};
