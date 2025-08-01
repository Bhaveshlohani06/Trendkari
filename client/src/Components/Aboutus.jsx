import React from 'react';
import Layout from '../Layout/Layout';

const AboutUs = () => {
  return (
    <Layout>
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>About TrendKari</h1>

      <p>
        Welcome to <strong>TrendKari</strong> — your go-to destination for the latest trends, insights, and inspiration across fashion, lifestyle, tech, and more.
      </p>

      <p>
        At TrendKari, we’re obsessed with what’s next. Whether it's street style, social media buzz, emerging brands, or game-changing gadgets — we’re here to bring the most exciting and relevant content straight to your screen.
      </p>

      <h2>Our Mission</h2>
      <p>
        To help our readers stay ahead of the curve by curating fresh, valuable, and trend-savvy content that informs, inspires, and empowers.
      </p>

      <h2>What We Cover</h2>
      <ul>
        <li>🛍️ Fashion & Style</li>
        <li>📱 Tech & Gadgets</li>
        <li>💡 Lifestyle & Wellness</li>
        <li>📈 Digital Trends & Culture</li>
        <li>📰 Reviews, How-Tos, and Buying Guides</li>
      </ul>

      <h2>Why TrendKari?</h2>
      <p>
        "Kari" means "do it" — and that’s exactly what we believe in. Don't just follow trends — understand them, adapt them, and make them your own.
        Whether you're a curious reader or a trend enthusiast, TrendKari is here to give you the tools to explore what's hot and what’s next.
      </p>

      <h2>Join the TrendKari Community</h2>
      <p>
        We’re more than a blog — we’re a growing community of forward-thinkers, creators, and doers. Got something to share? Want to collaborate?  
        <a href="mailto:contact@trendkari.com">Email us</a> or follow us on social media. Let’s grow and trend together.
      </p>

      <h2>Stay Connected</h2>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:contact@trendkari.com">contact@trendkari.com</a></li>
        {/* <li><strong>Instagram:</strong> @trendkari</li>
        <li><strong>Twitter:</strong> @trendkari</li> */}
      </ul>
    </div>
    </Layout>
  );
};

export default AboutUs;
