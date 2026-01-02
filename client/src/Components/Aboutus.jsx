import React from 'react';
import Layout from '../Layout/Layout';

const AboutUs = () => {
  return (
    <Layout>
      <div
        className="container py-5"
        style={{ maxWidth: "800px" }}
      >
        <h1 className="fw-bold mb-3">About Trendkari</h1>

        <p className="text-muted">
          Trendkari is a <strong>hyperlocal content platform</strong> built to
          bring you news, stories, and updates that matter — from your city,
          your area, and your people.
        </p>

        <p>
          In a world flooded with global news, we focus on what’s happening
          <strong> around you</strong>. From local news and city updates to
          trending topics, events, and community stories — Trendkari keeps you
          informed, fast.
        </p>

        <h3 className="mt-4 fw-semibold">Our Mission</h3>
        <p>
          To create a trusted hyperlocal platform where people can easily
          discover, read, and share content based on their
          <strong> location, language, and interests</strong>.
        </p>

        <h3 className="mt-4 fw-semibold">What You’ll Find on Trendkari</h3>
        <ul>
          <li>📍 City & area-wise news and updates</li>
          <li>🗞️ Local stories that don’t make national headlines</li>
          <li>🔥 Trending topics from your neighborhood</li>
          <li>🗣️ Community voices & regional creators</li>
          <li>🌐 Content in your preferred language</li>
        </ul>

        <h3 className="mt-4 fw-semibold">Why Trendkari?</h3>
        <p>
          Because local matters. We believe every city, town, and neighborhood
          has stories worth telling. Trendkari is designed to surface those
          stories — simply, cleanly, and without noise.
        </p>

        <h3 className="mt-4 fw-semibold">Built for People, Not Just Pageviews</h3>
        <p>
          Trendkari is built with a reader-first mindset. No clutter, no fake
          virality — just relevant content that helps you stay connected with
          what’s happening nearby.
        </p>

        <h3 className="mt-4 fw-semibold">Join the Trendkari Community</h3>
        <p>
          Whether you’re a reader, a local writer, or a community contributor —
          Trendkari is open for you.  
          Have a story, update, or idea to share?
        </p>

        <p>
          📩 Reach us at{" "}
          <a href="mailto:contact@trendkari.com">
            contact@trendkari.com
          </a>
        </p>

        <p className="text-muted mt-4">
          Trendkari — <strong>Local stories. Real voices. Your city.</strong>
        </p>
      </div>
    </Layout>
  );
};

export default AboutUs;
