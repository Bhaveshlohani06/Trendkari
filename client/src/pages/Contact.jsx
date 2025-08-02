// pages/Contact.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../Layout/Layout';
import API from '../../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/api/v1/contact', formData);
      if (data.success) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Layout>
    <div className="container mt-5 mb-5" style={{ maxWidth: '700px' }}>
      <h2 className="text-center mb-4 fw-bold">📬 Contact Us</h2>
      <p className="text-center text-muted mb-4">
        We'd love to hear your feedback, collaborations, or partnership ideas!
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            required
            onChange={handleChange}
            className="form-control"
            placeholder="Your name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
            className="form-control"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Your Message</label>
          <textarea
            name="message"
            value={formData.message}
            required
            onChange={handleChange}
            className="form-control"
            rows="5"
            placeholder="Write your message here..."
          ></textarea>
        </div>

        <button type="submit" className="btn btn-warning w-100 fw-bold">
          Send Message
        </button>
      </form>
    </div>
    </Layout>
  );
};

export default Contact;
