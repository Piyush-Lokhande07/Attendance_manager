import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import BACKEND_URL from '../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      onLogin();
      // alert('Login successful!');
      toast.success("Login successfull");
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      // alert(err.response?.data?.message || 'Login failed');
      toast.error("Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(202, 201, 207, 0.26)',
        fontFamily: `'Segoe UI', 'Poppins', 'Inter', sans-serif`,
        position: 'relative',
      }}
    >
      {/* Back Arrow */}
      <FontAwesomeIcon
        icon={faArrowLeft}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          cursor: 'pointer',
          color: '#2563eb',
          fontSize: '1.5rem',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        title="Back to Home"
      />

      {/* Card */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          width: '90%',
          maxWidth: '400px',
          animation: 'fadeIn 1s ease-in-out',
        }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
            color: '#1e293b',
          }}
        >
          Login to Your Account
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
        
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            autoComplete="email"
            style={inputStyle}
            onFocus={(e) => (e.target.style.border = '1px solid #3b82f6')}
            onBlur={(e) => (e.target.style.border = '1px solid #cbd5e1')}
          />

          
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              autoComplete="current-password"
              style={{ ...inputStyle, width: '100%' }}
              onFocus={(e) => (e.target.style.border = '1px solid #3b82f6')}
              onBlur={(e) => (e.target.style.border = '1px solid #cbd5e1')}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#64748b',
              }}
              title={showPassword ? 'Hide Password' : 'Show Password'}
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#2563eb')}
          >
            Login
          </button>
        </form>

        <p
          style={{
            marginTop: '20px',
            fontSize: '0.9rem',
            textAlign: 'center',
            color: '#334155',
          }}
        >
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{
              color: '#2563eb',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Register
          </span>
        </p>
      </div>

      {/* Animations and Media Query */}
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

// ✅ Input Style
const inputStyle = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
};

// ✅ Button Style
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
