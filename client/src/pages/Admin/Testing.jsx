import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BACKEND_URL = "http://localhost:8080/api/v1/post";

const Testing = () => {
  const editorRef = useRef(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

const generateAndHumanize = async () => {
  if (!title) {
    toast.error('Please enter a title');
    return;
  }

  setLoading(true);

  try {
    // Step 1: Generate raw AI content
    const genRes = await axios.post(`${BACKEND_URL}/generate`, {
      prompt: title
    });

    const generated = genRes?.data?.content;

    if (!generated) {
      toast.error("Failed to generate content");
      return;
    }

    // Step 2: Send raw content to backend to humanize it
    const humRes = await axios.post(`${BACKEND_URL}/humanize`, {
      htmlContent: generated  // ✅ Match backend key
    });

    const humanized = humRes?.data?.content;  // ✅ match response key from backend

    if (!humanized) {
      toast.error("Failed to humanize content");
      return;
    }

    // Step 3: Load into editor
    setContent(humanized);
    if (editorRef.current) {
      editorRef.current.setContent(humanized);
    }

    toast.success('Content generated and humanized!');
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <input
        type="text"
        value={title}
        placeholder="Enter blog topic"
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          marginBottom: '10px',
        }}
      />
      <button
        onClick={generateAndHumanize}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          marginBottom: '20px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Generating...' : 'Generate with AI'}
      </button>

      <Editor
        apiKey="6ag1d56giw5nj7cnellrwfzqxnsuknbv6ubgyx8sbetcpsjs"
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={content}
        init={{
          height: 500,
          menubar: false,
          plugins: 'link lists image table code help wordcount',
          toolbar:
            'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
          branding: false,
        }}
      />
    </div>
  );
};

export default Testing;
