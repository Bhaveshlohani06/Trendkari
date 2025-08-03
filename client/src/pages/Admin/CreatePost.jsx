import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Layout from '../../Layout/Layout';
import AdminMenu from '../../Layout/AdminMenu';
import toast from 'react-hot-toast';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import API from '../../../utils/api';

const { Option } = Select;
const BACKEND_URL = "http://localhost:8080/api/v1/post";


const CreatePost = () => {
  const navigate = useNavigate();
    const editorRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('draft');

  // Load categories
  const getAllCategories = async () => {
    try {
      const { data } = await API.get('/category/categories');
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error('Error while loading categories');
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // Generate content with AI
  const generateAndHumanize = async () => {
  if (!title) {
    toast.error('Please enter a title');
    return;
  }

  setLoading(true);

  try {
    // Step 1: Generate raw AI content
    const genRes = await API.post(`${BACKEND_URL}/generate`, {
      prompt: title
    });

    const generated = genRes?.data?.content;

    if (!generated) {
      toast.error("Failed to generate content");
      return;
    }

    // Step 2: Send raw content to backend to humanize it
    const humRes = await API.post(`${BACKEND_URL}/humanize`, {
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

  // Submit post handler
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('category', category);
      postData.append('status', status);
      postData.append('isFeatured', isFeatured);
      postData.append('image', image);
      postData.append('tags', tags);

      const { data } = await API.post('/post/create-post', postData);

      if (data?.success) {
        toast.success('Post created successfully');
        navigate('/dashboard/admin');
      } else {
        toast.error(data?.message || 'Failed to create post');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while creating the post');
    }
  };

  return (
    <Layout>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Post</h1>
            <form onSubmit={handleCreate}>
              {/* Title */}
              <div className="mb-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post Title"
                  className="form-control"
                  required
                />
              </div>

              {/* Generate with AI + TinyMCE Editor */}
              <div className="mb-3 d-flex flex-column gap-2">
                <button
                  type="button"
                  onClick={generateAndHumanize}
                  className="btn btn-warning align-self-start"
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate with AI'}
                </button>

                <Editor
        apiKey="6ag1d56giw5nj7cnellrwfzqxnsuknbv6ubgyx8sbetcpsjs"
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
        value={content}
        onEditorChange={setContent}
        init={{
          height: 500,
          menubar: false,
          plugins: 'link lists image table code help wordcount',
          toolbar: 'undo redo | formatselect | ' +
                   'bold italic | alignleft aligncenter alignright | ' +
                   'bullist numlist | link image | code',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3',
          paste_as_text: false, // Set to true if you only want plain text
          branding: false
        }}
      />
              </div>

              {/* Category - Fixed deprecated bordered prop */}
              <div className="mb-3">
                <Select
                  variant="outlined" // Replaced deprecated 'bordered'
                  placeholder="Select a category"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => setCategory(value)}
                  required
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Tags */}
              <div className="mb-3">
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags (comma separated)"
                  className="form-control"
                />
              </div>

              {/* Status */}
              <div className="mb-3">
                <Select
                  value={status}
                  onChange={(value) => setStatus(value)}
                  className="form-select"
                  variant="outlined"
                >
                  <Option value="draft">Draft</Option>
                  <Option value="published">Published</Option>
                </Select>
              </div>

              {/* Featured */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="featuredCheck"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="featuredCheck">
                  Mark as featured
                </label>
              </div>

              {/* Image Upload */}
              <div className="mb-3">
                <label htmlFor="imageUpload" className="form-label">Post Image</label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="form-control"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Create Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;