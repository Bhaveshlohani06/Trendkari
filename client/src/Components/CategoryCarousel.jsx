// components/CategoryCarousel.jsx
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaNewspaper, FaLaptop, FaLaughBeam, FaTshirt, FaRobot, FaRocket,
  FaFire, FaBriefcase, FaGamepad, FaBook, FaChartLine, FaGlobe
} from 'react-icons/fa';
import API from '../../utils/api';

const CategoryCarousel = () => {
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
        let categoriesWithExtras = [...data.categories];

        // If less than 12, add mock/filler categories
        const predefined = [
          { name: 'Finance', slug: 'finance', description: 'Latest financial insights' },
          { name: 'Politics', slug: 'politics', description: 'Updates on Indian and global politics' },
        ];

        if (categoriesWithExtras.length < 12) {
          categoriesWithExtras = [...categoriesWithExtras, ...predefined.slice(0, 12 - categoriesWithExtras.length)];
        }

        setCategories(categoriesWithExtras);
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

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (categories.length === 0) {
    return <p className="text-center">No categories available right now.</p>;
  }

  const categoryChunks = chunkArray(categories, 3); // 3 per slide

  return (
    <section className="container my-5">
      <h2 className="text-center mb-2 text-dark fw-bold">CATEGORIES</h2>
      <p className="text-center fw-medium mb-4 text-muted">
        Discover Top Trending Topics from Trendakari
      </p>

      <div
        id="categoryCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >
        <div className="carousel-inner">
          {categoryChunks.map((chunk, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
              <div className="row justify-content-center">
                {chunk.map((cat) => {
                  const Icon = iconMap[cat.slug?.toLowerCase()] || FaFire;
                  return (
                    <div key={cat._id || cat.slug} className="col-md-4 mb-4">
                      <div className="card h-100 text-center shadow-sm border-0" style={{ maxHeight: '350px' }}>
                        {cat.image ? (
                          <img
                            src={cat.image}
                            className="card-img-top"
                            alt={cat.name}
                            style={{ height: '160px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center bg-light"
                            style={{ height: '160px' }}
                          >
                            <Icon size={60} className="text-warning" />
                          </div>
                        )}

                        <div className="card-body py-2 px-3">
                          <h6 className="card-title fw-bold">{cat.name}</h6>
                          <p className="card-text text-muted small mb-2">
                            {cat.description ? `${cat.description.slice(  0, 60)}...` : 'Trendkari'}
                          </p>
                          <Link
                            to={`/category/${cat.slug}`}
                            className="btn btn-outline-warning btn-sm"
                          >
                            Explore
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {categoryChunks.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#categoryCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#categoryCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryCarousel;
