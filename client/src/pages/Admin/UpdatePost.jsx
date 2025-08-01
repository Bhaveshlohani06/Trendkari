import React, { useEffect, useState } from 'react';
import Layout from '../../Layout/Layout';
import AdminMenu from '../../Layout/AdminMenu';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Select } from 'antd';

const { Option } = Select;

const UpdatePost = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [id, setId] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-categories');
      if (data?.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error('Error loading categories');
    }
  };

  // Fetch single post by slug
  const getSinglePost = async () => {
    try {
      const { data } = await axios.get(`/api/v1/post/get-post/${params.slug}`);
      if (data?.post) {
        setId(data.post._id);
        setTitle(data.post.title);
        setContent(data.post.content);
        setCategory(data.post.category._id);
        setIsPublished(data.post.isPublished);
      }
    } catch (error) {
      console.log(error);
      toast.error('Error loading post details');
    }
  };

  useEffect(() => {
    getAllCategory();
    getSinglePost();
  }, []);

  // Update post
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('isPublished', isPublished);
      if (image) formData.append('image', image);

      const { data } = await axios.put(
        `/api/v1/post/update-post/${id}`,
        formData
      );

      if (data?.success === false) {
        toast.error(data.message);
      } else {
        toast.success('Post updated successfully');
        navigate('/dashboard/admin/posts');
      }
    } catch (error) {
      console.log(error);
      toast.error('Update failed');
    }
  };

  // Delete post
  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this post?');
      if (!confirmDelete) return;

      const { data } = await axios.delete(`/api/v1/post/delete-post/${id}`);
      if (data.success) {
        toast.success('Post deleted');
        navigate('/dashboard/admin/posts');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Error deleting post');
    }
  };

  return (
    <Layout title={'Admin Dashboard - Update Post'}>
      <div className='container-fluid m-3 p-3 dashboard'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>Edit Post</h1>
            <div className='m-1 w-75'>

              {/* Category Selector */}
              <Select
                bordered={false}
                placeholder="Select Category"
                size="large"
                showSearch
                className="form-select mb-3"
                value={category}
                onChange={(value) => setCategory(value)}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>{c.name}</Option>
                ))}
              </Select>

              {/* Image Upload */}
              <div className='mb-3'>
                <label className='btn btn-outline-secondary col-md-12'>
                  {image ? image.name : 'Upload New Image'}
                  <input
                    type='file'
                    name='image'
                    accept='image/*'
                    onChange={(e) => setImage(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              {/* Image Preview */}
              <div className='mb-3 text-center'>
                <img
                  src={image ? URL.createObjectURL(image) : `/api/v1/post/post-image/${id}`}
                  alt='post'
                  height="200px"
                  className='img img-responsive'
                />
              </div>

              {/* Title Input */}
              <div className='mb-3'>
                <input
                  type='text'
                  value={title}
                  placeholder='Post Title'
                  className='form-control'
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Content Textarea */}
              <div className='mb-3'>
                <textarea
                  value={content}
                  placeholder='Write post content...'
                  className='form-control'
                  rows="6"
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Publish Toggle */}
              <div className='mb-3'>
                <Select
                  bordered={false}
                  placeholder='Publish Status'
                  size='large'
                  className='form-select mb-3'
                  value={isPublished ? "1" : "0"}
                  onChange={(value) => setIsPublished(value === "1")}
                >
                  <Option value="1">Published</Option>
                  <Option value="0">Unpublished</Option>
                </Select>
              </div>

              {/* Buttons */}
              <div className='d-flex gap-2'>
                <button className='btn btn-primary' onClick={handleUpdate}>
                  UPDATE POST
                </button>
                <button className='btn btn-danger' onClick={handleDelete}>
                  DELETE POST
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdatePost;
