// components/CategorySlider.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import {
  FaNewspaper, FaLaptop, FaLaughBeam, FaTshirt, FaRobot, FaRocket,
  FaFire, FaBriefcase, FaGamepad, FaBook, FaChartLine, FaGlobe
} from 'react-icons/fa';
import API from '../../utils/api';

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    news: FaNewspaper,
    tech: FaLaptop,
    memes: FaLaughBeam,
    fashion: FaTshirt,
    ai: FaRobot,
    startup: FaRocket,
    trending: FaFire,
    business: FaBriefcase,
    gaming: FaGamepad,
    education: FaBook,
    finance: FaChartLine,
    politics: FaGlobe,
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get(`/category/categories`);
      if (data?.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-3 bg-light">
        <Spinner animation="border" size="sm" variant="primary" />
      </div>
    );
  }

  if (categories.length === 0) {
    return null; // Don't show anything if no categories
  }

  // Duplicate categories for seamless scrolling
  const duplicatedCategories = [...categories, ...categories];

  return (
    <div className="category-slider-container bg-light py-2 position-relative overflow-hidden">
      {/* Gradient overlays for smooth edges */}
      {/* <div className="position-absolute start-0 top-0 h-100 w-25 gradient-overlay-left z-2"></div>
      <div className="position-absolute end-0 top-0 h-100 w-25 gradient-overlay-right z-2"></div> */}
      
      <div className="scrolling-wrapper">
        <div className="scrolling-content">
          {duplicatedCategories.map((category, index) => {
            const Icon = iconMap[category.slug?.toLowerCase()] || FaFire;
            return (
              <Link
                key={`${category._id}-${index}`}
                to={`/category/${category.slug}`}
                className="category-slide-item text-decoration-none"
              >
                <div className="d-flex align-items-center gap-2 px-3 py-1">
                  <Icon size={16} className="text-warning" />
                  <span className="text-dark fw-medium text-nowrap">{category.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .category-slider-container {
          border-bottom: 1px solid #333;
        }
        
        .scrolling-wrapper {
          overflow: hidden;
          position: relative;
          width: 100%;
        }
        
        .scrolling-content {
          display: flex;
          animation: scroll 30s linear infinite;
          width: max-content;
        }
        
        .category-slide-item {
          transition: all 0.3s ease;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0 4px;
        }
        
        .category-slide-item:hover {
          background: rgba(255, 193, 7, 0.2);
          transform: translateY(-1px);
        }
        
        .gradient-overlay-left {
          background: linear-gradient(90deg, #212529 0%, transparent 100%);
          pointer-events: none;
        }
        
        .gradient-overlay-right {
          background: linear-gradient(270deg, #212529 0%, transparent 100%);
          pointer-events: none;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        /* Pause animation on hover */
        .scrolling-wrapper:hover .scrolling-content {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default CategorySlider;