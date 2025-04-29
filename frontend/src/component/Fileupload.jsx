import React, { useState, useRef, useEffect } from 'react';
import '../cssfile/fillupload.css'; // Adjust the path as necessary

function FileUploader() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Get current user from localStorage
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }

    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/materials');
      const data = await response.json();
      const formattedFiles = data.map(file => ({
        name: file.filename,
        type: '',
        size: '',
        status: 'done',
        url: file.url,
        uploadedBy: file.uploadedBy,
        uploaderName: file.uploaderName
      }));
      setFiles(formattedFiles);
    } catch (err) {
      console.error('Failed to fetch files:', err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleFileChange = (e) => {
    prepareFiles(e.target.files);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      prepareFiles(e.dataTransfer.files);
    }
  };
  

  const triggerFileSelect = () => {
    inputRef.current.click();
  };

  const prepareFiles = (filesList) => {
    const newFiles = Array.from(filesList).map(file => ({
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1),
      type: file.type,
      status: file.size > 10485760 ? 'failed' : 'pending'
    }));
  
    setFiles(prev => [...prev, ...newFiles]);
  };
  
  const uploadPendingFiles = async () => {
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    for (const fileObj of files) {
      if (fileObj.status !== 'pending') continue;
  
      const formData = new FormData();
      formData.append('file', fileObj.file);
      formData.append('title', fileObj.name);
      formData.append('uploadedBy', currentUser.id);
      formData.append('uploaderName', currentUser.name || 'Anonymous');
  
      setFiles(prev =>
        prev.map(f => f.name === fileObj.name ? { ...f, status: 'uploading' } : f)
      );
  
      try {
        const response = await fetch('http://localhost:5000/api/materials', {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          const data = await response.json();
          setFiles(prev =>
            prev.map(f =>
              f.name === fileObj.name
                ? { 
                    ...f, 
                    status: 'done', 
                    url: data.url,
                    uploadedBy: currentUser.id,
                    uploaderName: currentUser.name || 'Anonymous'
                  }
                : f
            )
          );
        } else {
          throw new Error('Upload failed');
        }
      } catch (err) {
        setFiles(prev =>
          prev.map(f => f.name === fileObj.name ? { ...f, status: 'failed' } : f)
        );
      }
    }
  };
  

  const getIconForType = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "bmp", "svg", "webp"].includes(ext)) return '🖼️';
    if (["pdf"].includes(ext)) return '📄';
    if (["doc", "docx"].includes(ext)) return '📝';
    if (["ppt", "pptx"].includes(ext)) return '📊';
    if (["xls", "xlsx", "csv"].includes(ext)) return '📈';
    return '📁';
  };

  const uploadFiles = async (filesList) => {
    const newFiles = Array.from(filesList).map(file => ({
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1),
      type: file.type,
      status: file.size > 10485760 ? 'failed' : 'uploading'
    }));

    for (const fileObj of newFiles) {
      if (fileObj.status === 'failed') {
        setFiles(prev => [...prev, fileObj]);
        continue;
      }

      const formData = new FormData();
      formData.append('file', fileObj.file);
      formData.append('title', fileObj.name);
      formData.append('uploadedBy', '6623eddf98f54b32707d64f7');

      setFiles(prev => [...prev, fileObj]);

      try {
        const response = await fetch('http://localhost:5000/api/materials', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          setFiles(prev =>
            prev.map(f => f.name === fileObj.name ? { ...f, status: 'done', url: `http://localhost:5000/uploads/${fileObj.name}` } : f)
          );
        } else {
          throw new Error('Upload failed');
        }
      } catch (err) {
        setFiles(prev =>
          prev.map(f => f.name === fileObj.name ? { ...f, status: 'failed' } : f)
        );
      }
    }
  };

  return (
    <div className="file-uploader">
      <h2>Upload Files</h2>
      <p>Uploaded project attachments.</p>

      <div className={`drop-zone ${dragActive ? 'active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
        <input ref={inputRef} type="file" multiple onChange={handleFileChange} hidden />
        <div className="drop-content" onClick={triggerFileSelect}>
          <div className="icon" />
          <p>Drag & drop your files here or</p>
          <button className="choose-btn">Choose files</button>
        </div>
      </div>

      <p className="note">Supported: Images, PDF, DOCX, PPTX. Max size: 10MB.</p>

      <div className="uploaded-files">
        {files.map((file, idx) => (
          <div key={idx} className={`file-card ${file.status}`}>
            <div className="file-info">
              <div className="file-icon">{getIconForType(file.name)}</div>
              <div className="file-details">
                <span>
                  {file.url ? (
                    <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                  ) : (
                    file.name
                  )}
                </span>
                <span className="uploader-name">
                  Uploaded by: {file.uploaderName || 'Anonymous'}
                </span>
              </div>
            </div>
            {file.status === 'uploading' && <div className="progress-bar"><div style={{ width: '53%' }} /></div>}
            {file.status === 'failed' && <span className="error">Upload failed (max 10MB)</span>}
          </div>
        ))}
      </div>
      {files.some(f => f.status === 'pending') && (
        <button className="share-btn" onClick={uploadPendingFiles}>Share Files to Backend</button>
      )}
    </div>
  );
}

export default FileUploader;    
