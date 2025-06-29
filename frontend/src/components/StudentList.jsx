import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import useClassInfo from './useClassInfo';
import BACKEND_URL from '../config';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

export default function StudentList() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', rollNo: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', rollNo: '' });
  const classInfo = useClassInfo(classId);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/student/${classId}`, {
        headers: { Authorization: `${token}` },
      });
      const sortedStudents = res.data.sort((a, b) => a.rollNo - b.rollNo);
      setStudents(sortedStudents);
    } catch (err) {
      console.error('Error fetching students:', err);
      toast.error('Error fetching data');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/student`,
        { ...newStudent, classId },
        { headers: { Authorization: `${token}` } }
      );
      setStudents((prev) => [...prev, res.data]);
      setNewStudent({ name: '', rollNo: '' });
      toast.success('Student added');
    } catch (err) {
      console.error('Error adding student:', err);
      toast.error('Error adding student');
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setEditData({ name: student.name, rollNo: student.rollNo });
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await axios.put(
        `${BACKEND_URL}/api/student/${id}`,
        editData,
        { headers: { Authorization: `${token}` } }
      );
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? { ...s, ...res.data } : s))
      );
      setEditingId(null);
      toast.success('Student updated');
    } catch (err) {
      console.error('Error updating student:', err);
      toast.error('Error updating student');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the student permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/student/${id}`, {
        headers: { Authorization: `${token}` },
      });
      setStudents((prev) => prev.filter((s) => s._id !== id));
      toast.success('Student deleted successfully! ');
    } catch (err) {
      console.error('Error deleting student:', err);
      toast.error('Error deleting student');
    }
  };

  return (
    <div
      style={{
        padding: '24px',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
      }}
    >
      <h2
        style={{
          fontSize: '1.8rem',
          fontWeight: '600',
          marginBottom: '20px',
          color: '#1f2937',
        }}
      >
        {classInfo.name} ({classInfo.subject}) - Manage Students
      </h2>

      {/* Add Student Form */}
      <form
        onSubmit={handleAddStudent}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '24px',
          maxWidth: '700px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="Roll No"
            value={newStudent.rollNo}
            onChange={(e) =>
              setNewStudent({ ...newStudent, rollNo: e.target.value })
            }
            required
            style={{ ...inputStyle, flex: '1 1 120px' }}
          />

          <input
            type="text"
            placeholder="Name"
            value={newStudent.name}
            onChange={(e) =>
              setNewStudent({ ...newStudent, name: e.target.value })
            }
            required
            style={{ ...inputStyle, flex: '1 1 200px' }}
          />
          <button type="submit" style={addButtonStyle}>
            <FontAwesomeIcon
              icon={faPlus}
              style={{ color: 'white', fontSize: '15px', marginRight: '5px' }}
            />
            Add Student
          </button>
        </div>
      </form>

      {/* Student List Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#e5e7eb' }}>
              <th style={thStyle}>Roll No</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => (
              <tr
                key={s._id}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white',
                }}
              >
                <td style={tdStyle}>
                  {editingId === s._id ? (
                    <input
                      type="text"
                      value={editData.rollNo}
                      onChange={(e) =>
                        setEditData({ ...editData, rollNo: e.target.value })
                      }
                      style={inputStyle}
                    />
                  ) : (
                    s.rollNo
                  )}
                </td>
                <td style={tdStyle}>
                  {editingId === s._id ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      style={inputStyle}
                    />
                  ) : (
                    s.name
                  )}
                </td>
                <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                  {editingId === s._id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(s._id)}
                        style={actionButtonStyle('#22c55e')}
                      >
                        ✅ Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={actionButtonStyle('#6b7280')}
                      >
                        ❌ Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(s)}
                        style={actionButtonStyle('#2563eb')}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        style={actionButtonStyle('#ef4444')}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: 'white', marginRight: '5px' }}
                        />
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ✅ Styles
const inputStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  outline: 'none',
  fontSize: '1rem',
  minWidth: '120px',
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

const addButtonStyle = {
  backgroundColor: '#2563eb',
  color: 'white',
  padding: '10px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '500',
  flex: '0 0 auto',
};

const actionButtonStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: 'white',
  padding: '6px 10px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  marginRight: '6px',
  fontSize: '0.85rem',
});
