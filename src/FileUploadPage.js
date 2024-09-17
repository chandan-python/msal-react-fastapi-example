import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function FileUploadPage({ userId }) {
  const [file, setFile] = useState(null);
  const [messageData, setMessageData] = useState({ message: null, fileName: null });
  const ws = useRef(null);

  // Placeholder for actual token retrieval logic
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/ws?user_id=${userId}`);
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message)
      setMessageData({ message: message.message, fileName: message.filename });
    };

    return () => {
      ws.current.close();
    };
  }, [userId]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId); // Include the user_id in the payload

    try {
      const response = await fetch('http://localhost:8000/uploadfile/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload</button>
        <div>
          <p>File name: {messageData.fileName}</p>
           <p>Status: {messageData.message}</p>
        </div>
      </header>
    </div>
  );
}

export default FileUploadPage;
