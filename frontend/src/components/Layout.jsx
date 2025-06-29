import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import BACKEND_URL from '../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

export default function Layout({ onLogout }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete your account permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/user/delete`, {
        headers: { Authorization: `${token}` },
      });

      localStorage.removeItem('token');
      onLogout();
      navigate('/');

      toast.success('Account deleted successfully!');
    } catch (err) {
      console.error('Error deleting account:', err);
      toast.error('Failed to delete account');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          borderBottom: '1px solid #e5e7eb',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#2563eb',
            margin: 0,
          }}
        >
          Attendance Manager
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: '#374151',
              fontWeight: 500,
              fontSize: '1rem',
            }}
          >
            Hi, {user?.name || 'User'}
          </span>

          <button onClick={() => navigate('/')} style={dashboardButtonStyle}>
            Dashboard
          </button>

          <button onClick={handleLogout} style={logoutButtonStyle}>
            Logout
          </button>

          <button onClick={handleDeleteAccount} style={deleteButtonStyle}>
            Delete Account
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          padding: '24px',
          flex: '1',
        }}
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#2563eb',
          padding: '12px 24px',
          textAlign: 'center',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
          fontSize: '0.9rem',
          color: 'white',
        }}
      >
        © {new Date().getFullYear()} Attendance Manager | Developed by Piyush Lokhande | All rights reserved.
      </footer>

      {/* Inline CSS for responsiveness */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

          @media (max-width: 600px) {
            header {
              flex-direction: column;
              align-items: flex-start;
            }
            header h1 {
              font-size: 1.3rem;
            }
            header span {
              font-size: 0.95rem;
            }
            header div {
              width: 100%;
              justify-content: space-between;
              flex-wrap: wrap;
            }
            header button {
              flex: 1 1 auto;
              min-width: 120px;
              padding: 8px 10px;
              font-size: 0.85rem;
            }
            footer {
              font-size: 0.75rem;
              padding: 8px 16px;
            }
          }
        `}
      </style>
    </div>
  );
}

// ✅ Button Styles
const dashboardButtonStyle = {
  backgroundColor: '#2563eb',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.95rem',
  transition: 'background-color 0.3s',
};

const logoutButtonStyle = {
  backgroundColor: '#ef4444',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.95rem',
  transition: 'background-color 0.3s',
};

const deleteButtonStyle = {
  backgroundColor: '#991b1b',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.95rem',
  transition: 'background-color 0.3s',
};
