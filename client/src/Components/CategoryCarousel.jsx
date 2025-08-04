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
  <h2 className="text-center mb-2 text-dark fw-bold display-5">CATEGORIES</h2>
  <p className="text-center fw-medium mb-4 text-muted fs-5">
    Discover Top Trending Topics from Trendkari
  </p>

  {/* Mobile View - Horizontal Scroll */}
  <div className="d-md-none">
    <div className="scrolling-wrapper pb-3" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
      {categories.flat().map((cat) => {
        const Icon = iconMap[cat.slug?.toLowerCase()] || FaFire;
        return (
          <div key={cat._id || cat.slug} className="d-inline-block mx-2" style={{ width: '150px' }}>
            <div className="card h-100 text-center shadow-sm border-0">
              {cat.image ? (
                <img
                  src={cat.image}
                  className="card-img-top rounded-top"
                  alt={cat.name}
                  style={{ 
                    height: '100px', 
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-light rounded-top"
                  style={{ height: '100px' }}
                >
                  <Icon size={40} className="text-warning" />
                </div>
              )}

              <div className="card-body py-2 px-2">
                <h6 className="card-title fw-bold mb-1 text-truncate">{cat.name}</h6>
                <Link
                  to={`/category/${cat.slug}`}
                  className="btn btn-warning btn-sm text-white fw-bold"
                  style={{ fontSize: '0.75rem' }}
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

  {/* Desktop View - Carousel */}
  <div className="d-none d-md-block">
    <div
      id="categoryCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="4000"
    >
      <div className="carousel-inner px-md-5">
        {categoryChunks.map((chunk, i) => (
          <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
            <div className="row g-4 justify-content-center">
              {chunk.map((cat) => {
                const Icon = iconMap[cat.slug?.toLowerCase()] || FaFire;
                return (
                  <div key={cat._id || cat.slug} className="col-md-4 col-lg-3">
                    <div className="card h-100 text-center shadow-sm border-0 hover-scale">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          className="card-img-top rounded-top"
                          alt={cat.name}
                          style={{ 
                            height: '160px', 
                            objectFit: 'cover',
                            objectPosition: 'center'
                          }}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center bg-light rounded-top"
                          style={{ height: '160px' }}
                        >
                          <Icon size={60} className="text-warning" />
                        </div>
                      )}

                      <div className="card-body py-3 px-3 d-flex flex-column">
                        <h6 className="card-title fw-bold mb-2">{cat.name}</h6>
                        <p className="card-text text-muted small mb-3 flex-grow-1">
                          {cat.description ? `${cat.description.slice(0, 60)}${cat.description.length > 60 ? '...' : ''}` : 'Trendkari'}
                        </p>
                        <Link
                          to={`/category/${cat.slug}`}
                          className="btn btn-warning btn-sm text-white fw-bold align-self-center"
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
            <span className="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#categoryCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}
    </div>
  </div>
</section>
  );
};

export default CategoryCarousel;
