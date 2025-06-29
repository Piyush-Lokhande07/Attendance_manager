import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TakeAttendance from './components/TakeAttendance';
import StudentList from './components/StudentList';
import ViewAttendance from './components/ViewAttendance';
import AttendanceSummary from './components/AttendanceSummary';
import Layout from './components/Layout';
import CreateClass from './components/CreateClass';
import { useState, useEffect } from 'react';
import EditClass from './components/EditClass';
import EditAttendance from './components/EditAttendance';
import Landing from './components/Landing';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('isAuthenticated:', isAuthenticated);
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={2000} />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />

        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        {isAuthenticated ? (
            <Route path="/"
                element={
                  <Layout
                    onLogout={() => {
                      localStorage.removeItem('token');
                      setIsAuthenticated(false);
                    }}
                  />
                }
              >
            <Route index element={<Dashboard />} />
            <Route path="class/create" element={<CreateClass />} />
            <Route path="class/edit/:classId" element={<EditClass />} />
            <Route path="class/:classId/students" element={<StudentList />} />
            
            <Route path="attendance/mark/:classId" element={<TakeAttendance />} />
            <Route path="attendance/view/:classId" element={<ViewAttendance />} />
            <Route path="attendance/edit/:classId/:date" element={<EditAttendance />} />
            <Route path="attendance/summary/:classId" element={<AttendanceSummary />} />
          </Route>
        ) : (
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
