import { useEffect, useState } from 'react';
import axios from 'axios';
import BACKEND_URL from '../config';

export default function useClassInfo(classId) {
  const [classInfo, setClassInfo] = useState({ name: '', subject: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/class/${classId}`,
          { headers: { Authorization: `${token}` } }
        );
        setClassInfo(res.data);
      } catch (err) {
        console.error('Error fetching class info:', err);
      }
    };

    if (classId) fetchClassInfo();
  }, [classId]);

  return classInfo;
}
