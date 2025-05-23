import axios from 'axios';

const uploadPYQ = async (file, name, subject, userName, usn, role) => {
  const formData = new FormData();
  formData.append('file', file); // Must match multer field name
  formData.append('name', name);
  formData.append('subject', subject);
  formData.append('userName', userName);
  formData.append('usn', usn);
  formData.append('role', role);

  try {
    const response = await axios.post('http://localhost:5000/api/pyqs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('✅ PYQ uploaded:', response.data);
  } catch (err) {
    console.error('❌ Upload failed:', err);
  }
};

export default uploadPYQ;
