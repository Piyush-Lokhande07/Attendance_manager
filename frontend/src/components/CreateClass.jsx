import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateClass() {
  const [form, setForm] = useState({ name: '', subject: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/class`, form, {
        headers: {
          Authorization: `${token}`,
        },
      });
      // alert('Class created successfully!');
      toast.success("Class created successfully!");
      navigate('/');
    } catch (err) {
      console.error('Error creating class:', err);
      // alert(err.response?.data?.message || 'Failed to create class');
      toast.error("Failed to create class");
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '24px',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '420px',
          animation: 'fadeIn 1s ease-in-out',
        }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
            color: '#2563eb',
          }}
        >
          Create New Class
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Class Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.border = '1px solid #2563eb')}
            onBlur={(e) => (e.target.style.border = '1px solid #cbd5e1')}
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.border = '1px solid #2563eb')}
            onBlur={(e) => (e.target.style.border = '1px solid #cbd5e1')}
          />

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#2563eb')}
          >
            Create Class
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#4b5563',
              cursor: 'pointer',
              textDecoration: 'underline',
              textAlign: 'center',
              fontSize: '0.9rem',
              padding: '4px',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#2563eb')}
            onMouseLeave={(e) => (e.target.style.color = '#4b5563')}
          >
            Cancel
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media (max-width: 480px) {
            h2 {
              font-size: 1.5rem !important;
            }
            input {
              padding: 8px 12px !important;
            }
            button {
              padding: 10px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

// ✅ Reusable styles
const inputStyle = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '1rem',
  outline: 'none',
};

const buttonStyle = {
  backgroundColor: '#2563eb',
  color: 'white',
  padding: '12px',
  borderRadius: '8px',
  fontWeight: '600',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};
