import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">

          {/* Brand and Social */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Trendkari</h5>
            <p className="small">
              Curating daily viral trends across tech, fashion, memes & more.
            </p>
            <div className="d-flex gap-3 mt-3">
  <a href="#" className="text-light fs-5" target="_blank" rel="noopener noreferrer">
    <FaTwitter />
  </a>
  <a href="#" className="text-light fs-5" target="_blank" rel="noopener noreferrer">
    <FaFacebookF />
  </a>
  <a href="#" className="text-light fs-5" target="_blank" rel="noopener noreferrer">
    <FaInstagram />
  </a>
  <a href="#" className="text-light fs-5" target="_blank" rel="noopener noreferrer">
    <FaLinkedinIn />
  </a>
  <a href="#" className="text-light fs-5" target="_blank" rel="noopener noreferrer">
    <FaGithub />
  </a>
</div>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled small mt-3">
              <li className="mb-2"><Link to="/about" className="text-light text-decoration-none">About Us</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
              <li className="mb-2"><Link to="/privacypolicy" className="text-light text-decoration-none">Privacy Policy</Link></li>
              <li className="mb-2"><a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none">GitHub</a></li>
              <li><a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none">LinkedIn</a></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="col-md-4">
            <h5 className="fw-bold">Stay in the Loop</h5>
            <p className="small mt-3">Subscribe to get the hottest trends daily in your inbox.</p>
            <form className="d-flex flex-column flex-sm-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="form-control form-control-sm"
              />
              <button type="submit" className="btn btn-warning btn-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Attribution */}
        <div className="text-center mt-4 small text-secondary">
          Built with ❤️ by <strong>Bhavesh</strong> | &copy; {new Date().getFullYear()} Trendkari. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
