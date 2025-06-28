import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import useClassInfo from './useClassInfo';
import BACKEND_URL from '../config';

export default function ViewAttendance() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [attendanceByDate, setAttendanceByDate] = useState(null);
  const [summary, setSummary] = useState([]);
  const classInfo = useClassInfo(classId);

  const handleViewByDate = async () => {
    if (!date) return alert('Please select a date');

    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/attendance/${classId}/${date}`,
        { headers: { Authorization: ` ${token}` } }
      );
      setAttendanceByDate(res.data);
      setSummary([]);
    } catch (err) {
      alert(err.response?.data?.message || 'Error fetching attendance');
      setAttendanceByDate(null);
    }
  };

  const handleViewByRange = async () => {
  if (!start || !end) return alert('Select both start and end dates');

  try {
    const res = await axios.get(
      `${BACKEND_URL}/api/attendance/summary/${classId}`,
      {
        params: { start, end },
        headers: { Authorization: `${token}` },
      }
    );
    const sorted = res.data.sort((a, b) => Number(a.rollNo) - Number(b.rollNo));
    setSummary(sorted);
    setAttendanceByDate(null);
  } catch (err) {
    alert(err.response?.data?.message || 'Error fetching summary');
    setSummary([]);
  }
};

const handleExportExcel = async () => {
  if (!start || !end) return alert('Select both start and end dates');

  try {
    const res = await axios.get(
      `${BACKEND_URL}/api/attendance/export/${classId}`,
      {
        params: { start, end },
        headers: { Authorization: `${token}` },
        responseType: 'blob',
      }
    );
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `attendance-summary-${start}-to-${end}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    alert('Error exporting to Excel');
  }
};


  return (
    <div
      style={{
        maxWidth: '1000px',
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
          marginBottom: '16px',
          color: '#1f2937',
        }}
      >
        {classInfo.name} ({classInfo.subject}) - View Attendance
      </h2>

      {/* Control Panel */}
      <div style={{ display: 'flex', gap: '48px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {/* View by Date */}
        <div>
          <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>View by Date</h3>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleViewByDate} style={blueBtn}>
            Fetch
          </button>
        </div>

        {/* View by Range */}
        <div>
          <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>View Summary (Range)</h3>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={inputStyle}
          />
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleViewByRange} style={greenBtn}>
            Fetch
          </button>
          <button onClick={handleExportExcel} style={yellowBtn}>
            Export Excel
          </button>
        </div>
      </div>

      {/* Attendance By Date */}
      {attendanceByDate && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>
            Attendance on {attendanceByDate.date}
          </h3>
          <Table
            headers={['Roll No', 'Name', 'Status']}
            rows={attendanceByDate.records.map((r) => [
              r.studentId.rollNo,
              r.studentId.name,
              r.status,
            ])}
          />
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={() => navigate(`/attendance/edit/${classId}/${date}`)}
              style={redBtn}
            >
              ✏️ Edit Attendance for {date}
            </button>
          </div>
        </div>
      )}

      {/* Attendance Summary */}
      {summary.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '32px', marginBottom: '8px' }}>
            Attendance Summary from {start} to {end}
          </h3>
          <Table
            headers={['Roll No', 'Name', 'Present', 'Total', 'Percentage (%)']}
            rows={summary.map((s) => [
              s.rollNo,
              s.name,
              s.present,
              s.total,
              s.percentage,
            ])}
          />
        </div>
      )}
    </div>
  );
}

// ✅ Table Component
function Table({ headers, rows }) {
  return (
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
            {headers.map((head) => (
              <th key={head} style={thStyle}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                backgroundColor: i % 2 === 0 ? '#f9fafb' : 'white',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              {row.map((cell, j) => (
                <td key={j} style={tdStyle}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ✅ Shared Styles
const inputStyle = {
  border: '1px solid #d1d5db',
  padding: '6px 12px',
  borderRadius: '6px',
  marginRight: '8px',
};

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

// ✅ Button Styles
const blueBtn = {
  backgroundColor: '#2563eb',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '600',
};
const greenBtn = {
  ...blueBtn,
  backgroundColor: '#16a34a',
};
const redBtn = {
  ...blueBtn,
  backgroundColor: '#dc2626',
};
const yellowBtn = {
  ...blueBtn,
  backgroundColor: '#ca8a04',
  marginLeft: '8px',
};
