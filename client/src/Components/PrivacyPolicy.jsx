// For React: Save as PrivacyPolicy.jsx
// For Next.js: Save as pages/privacy.js

import React from 'react';
import Layout from '../Layout/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Privacy Policy</h1>

      <p>
        Welcome to <strong>Trendkari</strong> (accessible from <a href="https://www.trendkari.in">Trendkari</a>).
        Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>a. Personal Information</h3>
      <p>Name, email address (if you contact us or subscribe to a newsletter).</p>

      <h3>b. Usage Data</h3>
      <p>Pages visited, time spent on pages, and other analytics data (via tools like Google Analytics).</p>

      <h3>c. Cookies</h3>
      <p>We use cookies to enhance your experience, track traffic, and personalize content.</p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Respond to inquiries or support requests</li>
        <li>Improve website performance and content</li>
        <li>Send updates or newsletters (only if you subscribe)</li>
        <li>Monitor usage and detect issues</li>
      </ul>

      <h2>3. Third-Party Services</h2>
      <p>
        We may use third-party services that collect, monitor, and analyze data, such as:
        Google Analytics, email providers, or advertising networks (if applicable). These services have their own privacy policies.
      </p>

      <h2>4. Cookies</h2>
      <p>
        We use cookies to remember your preferences, understand how visitors use our site,
        and provide relevant content or ads. You can choose to disable cookies through your browser settings.
      </p>

      <h2>5. Data Protection</h2>
      <p>
        We implement reasonable security measures to protect your personal information.
        However, no method of transmission over the internet is 100% secure.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        Depending on your country or region, you may have rights to:
      </p>
      <ul>
        <li>Access, update, or delete your personal data</li>
        <li>Withdraw consent for marketing</li>
        <li>File a complaint with a data protection authority</li>
      </ul>
      <p>Contact us if you wish to exercise these rights.</p>

      <h2>7. External Links</h2>
      <p>
        Our website may contain links to other websites. We are not responsible for their content or privacy practices.
      </p>

      <h2>8. Children’s Privacy</h2>
      <p>
        This website is not intended for children under the age of 13. We do not knowingly collect data from children.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy occasionally. Any changes will be posted on this page with an updated effective date.
      </p>

      <h2>10. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at:</p>
      <p><strong>Email:</strong> admin@trendkari.in</p>
      <p><strong>Website:</strong> <a href="https://www.trendkari.in">https://www.trendkari.in</a></p>
    </div>
    </Layout>
  );
};

export default PrivacyPolicy;
