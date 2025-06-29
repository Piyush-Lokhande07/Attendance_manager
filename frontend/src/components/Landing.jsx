import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faGithub,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';


export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #2563eb, #9333ea)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          background: 'radial-gradient(circle at top, rgba(255,255,255,0.1), transparent 70%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            maxWidth: '700px',
            animation: 'fadeIn 1.5s ease-in-out',
          }}
        >
          <h1
            style={{
              fontSize: '3rem',
              color: 'white',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            Effortless Attendance <br /> for Modern Educators
          </h1>
          <p
            style={{
              color: 'white',
              fontSize: '1.1rem',
              marginBottom: '25px',
              opacity: 0.9,
            }}
          >
            Manage your classes, students, and attendance all in one place.
            Simple, fast, and reliable.
          </p>

          <button
            onClick={() => navigate('/login')}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e0f2fe';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
            }}
          >
            🚀 Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '60px 20px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            justifyContent: 'center',
          }}
        >
          {features.map((item) => (
            <div
              key={item.title}
              style={{
                background: '#f9fafb',
                borderRadius: '12px',
                padding: '20px',
                flex: '1 1 280px',
                boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <h3 style={{ color: '#2563eb', marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ color: '#374151', fontSize: '0.95rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#1e293b',
          color: 'white',
          padding: '16px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginBottom: '10px' }}>
          <FooterIcon href="https://www.instagram.com/piyush_lokhande_77/" icon={faInstagram} />
          <FooterIcon href="https://github.com/Piyush-Lokhande07" icon={faGithub} />
          <FooterIcon href="https://www.linkedin.com/in/piyush-lokhande-173477298/" icon={faLinkedin} />
          <FooterIcon href="mailto:piyushkailas88@gmail.com" icon={faEnvelope} />
          <FooterIcon href="https://x.com/PiyushLokh84694" icon={faTwitter} />
        </div>
        <div style={{ fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} Attendance Manager | Developed by Piyush Lokhande | All rights reserved.
        </div>
      </footer>

      {/* CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media (max-width: 640px) {
            h1 {
              font-size: 2rem !important;
            }
            p {
              font-size: 0.95rem !important;
            }
            button {
              padding: 10px 20px !important;
              font-size: 0.9rem !important;
            }
          }
        `}
      </style>
    </div>
  );
}

// ✅ Components
const FooterIcon = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: 'white',
      transition: 'transform 0.3s',
      fontSize: '1.2rem',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.3)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
  >
    <FontAwesomeIcon icon={icon} />
  </a>
);

// ✅ Styles
const buttonStyle = {
  backgroundColor: 'white',
  color: '#2563eb',
  padding: '14px 28px',
  borderRadius: '8px',
  fontWeight: '600',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  transition: 'all 0.3s ease',
  fontSize: '1rem',
};

// ✅ Features
// const features = [
//   { title: 'Class Management', desc: 'Easily create, edit, and manage multiple classes with a simple interface.' },
//   { title: 'Student Database', desc: 'Add, edit, and delete students efficiently. Keep student info organized.' },
//   { title: 'Attendance Tracking', desc: 'Mark attendance in real-time and keep records accessible anytime.' },
//   { title: 'Secure Login', desc: 'Your data is protected with token-based secure authentication.' },
// ];

const features = [
  {
    title: 'Class Management',
    desc: 'Easily create, edit, and manage multiple classes. Stay organized with a streamlined and intuitive interface.'
  },
  {
    title: 'Student Management',
    desc: 'Quickly add, edit, or remove student records. Keep student details like roll numbers, names, and enrollment well-organized.'
  },
  {
    title: 'Smart Attendance Tracking',
    desc: 'Mark daily attendance with just a few clicks. Access detailed attendance history, summaries, and percentages anytime.'
  },
  {
    title: 'Attendance Reports & Export',
    desc: 'Generate detailed reports and export attendance data as Excel files for sharing or record-keeping.'
  },
  {
    title: 'Secure Authentication',
    desc: 'Protect your data with secure, token-based authentication. Only you have access to your classes and student records.'
  },
  // {
  //   title: 'Data Privacy & Control',
  //   desc: 'You own your data — with the ability to delete your account and all associated data permanently anytime.'
  // },
  {
    title: 'Responsive & User-Friendly',
    desc: 'Use it seamlessly across devices — desktop, tablet, or mobile. Clean, simple, and distraction-free design.'
  }
];


