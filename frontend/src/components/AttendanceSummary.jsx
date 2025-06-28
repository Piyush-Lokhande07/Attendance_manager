import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BACKEND_URL from '../config';

export default function AttendanceSummary() {
  const { classId } = useParams();
  const token = localStorage.getItem('token');

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [summary, setSummary] = useState([]);

  const fetchSummary = async () => {
    if (!start || !end) return alert('Please select both start and end dates');
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/attendance/summary/${classId}?start=${start}&end=${end}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSummary(res.data);
    } catch (err) {
      alert('Failed to load summary');
    }
  };

  const exportExcel = async () => {
    if (!start || !end) return alert('Please select both start and end dates');
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/attendance/export/${classId}?start=${start}&end=${end}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );

      // Create link and trigger download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance-summary.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export Excel');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Attendance Summary</h2>

      {/* Date Filters */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="date"
          value={start}
          onChange={e => setStart(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          value={end}
          onChange={e => setEnd(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={fetchSummary}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Get Summary
        </button>
      </div>

      {/* Summary Table */}
      {summary.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Roll No</th>
                <th className="p-2 border">Present</th>
                <th className="p-2 border">Total Days</th>
                <th className="p-2 border">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((s, index) => (
                <tr key={index}>
                  <td className="p-2 border">{s.name}</td>
                  <td className="p-2 border">{s.rollNo}</td>
                  <td className="p-2 border">{s.present}</td>
                  <td className="p-2 border">{s.total}</td>
                  <td className="p-2 border">{s.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={exportExcel}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Export as Excel
          </button>
        </div>
      ) : (
        <p className="text-gray-600">No data yet. Select date range above.</p>
      )}
    </div>
  );
}
