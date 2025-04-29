import { useState, useRef } from 'react';
import '../cssfile/postcreate.css';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { v4 } from 'uuid';
import Alert from '../component/Alert';

function PostCreator() {
  const [content, setContent] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const contentRef = useRef(null);
  const fileInputRef = useRef(null);

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
    if (contentRef.current) { 
      contentRef.current.focus();
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingImage(true);

    try {
      // Convert image to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Store image data in Firestore
      const imageDoc = await addDoc(collection(db, 'images'), {
        id: v4(),
        name: file.name,
        type: file.type,
        base64: base64,
        createdAt: serverTimestamp()
      });

      // Update UI with the base64 image
      setUploadedImages((prev) => [...prev, { url: base64, id: imageDoc.id }]);
      
      if (contentRef.current) {
        contentRef.current.focus();
      }

      // Show success message with file details
      setAlertMessage(`Successfully uploaded ${file.name} (${file.type})`);
      setShowAlert(true);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setAlertMessage(`Failed to upload image: ${error.message}`);
      setShowAlert(true);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.currentTarget.innerHTML);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      document.execCommand('insertLineBreak');
      e.preventDefault();
    }
  };

  const removeImage = (indexToRemove) => {
    setUploadedImages(uploadedImages.filter((_, index) => index !== indexToRemove));
  };

  const handlePost = async () => {
    if (!content.trim() && uploadedImages.length === 0) {
      setAlertMessage('Please add some content or images to your post');
      setShowAlert(true);
      return;
    }

    setIsPosting(true);

    try {
      // Create the post in Firestore
      const postData = {
        content: content,
        images: uploadedImages.map(img => ({
          url: img.url,
          id: img.id
        })),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'posts'), postData);

      // Clear the form
      setContent('');
      setUploadedImages([]);
      if (contentRef.current) {
        contentRef.current.innerHTML = '';
      }

      setAlertMessage('Post created successfully!');
      setShowAlert(true);
    } catch (error) {
      console.error('Error creating post:', error);
      setAlertMessage(`Failed to create post: ${error.message}`);
      setShowAlert(true);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="post-creator">
      {showAlert && (
        <Alert 
          message={alertMessage} 
          type={alertMessage.includes('Successfully') || alertMessage.includes('created') ? 'success' : 'error'}
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="toolbar">
        <button onClick={() => applyFormat('bold')} title="Bold">
          <strong>B</strong>
        </button>
        <button onClick={() => applyFormat('italic')} title="Italic">
          <em>I</em>
        </button>
        <button onClick={() => applyFormat('underline')} title="Underline">
          <u>U</u>
        </button>
        <button onClick={() => applyFormat('insertUnorderedList')} title="Bullet List">
          • List
        </button>
        <button onClick={() => applyFormat('insertOrderedList')} title="Numbered List">
          1. List
        </button>
        <button onClick={handleImageClick} title="Insert Image">
          🖼️
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
          accept="image/*"
        />
      </div>

      <div
        ref={contentRef}
        className="post-input"
        contentEditable
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        placeholder="Share something Useful"
      />

      {loadingImage && <div className="loading">Uploading Image...</div>}

      {uploadedImages.length > 0 && (
        <div className="uploaded-images">
          {uploadedImages.map((img, index) => (
            <div key={index} className="image-container">
              <img src={img.url} alt={`Uploaded ${index + 1}`} />
              <button 
                className="remove-image-btn"
                onClick={() => removeImage(index)}
                title="Remove Image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button 
        className="post-btn" 
        onClick={handlePost}
        disabled={isPosting}
      >
        {isPosting ? 'Posting...' : 'Post'}
      </button>
    </div>
  );
}

export default PostCreator;
