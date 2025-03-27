import React from "react";
import Layout from "../components/Layout/Layout";
import "../Styles/Policy.css";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="policy-container">
        <h1 className="policy-title">Privacy Policy</h1>
        <p className="policy-date">Last updated: March 27, 2025</p>

        <section className="policy-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to our e-commerce platform. Your privacy is important to us.
            This policy outlines how we collect, use, and protect your
            information.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Information We Collect</h2>
          <p>
            We may collect personal data, including your name, email, address,
            and payment details when you use our services.
          </p>
        </section>

        <section className="policy-section">
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide and improve our services</li>
            <li>To process transactions securely</li>
            <li>To communicate with you about orders and promotions</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Data Security</h2>
          <p>
            We take appropriate measures to protect your personal data from
            unauthorized access, loss, or misuse.
          </p>
        </section>

        <section className="policy-section">
          <h2>5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal
            information. Contact us for any requests.
          </p>
        </section>

        <section className="policy-section">
          <h2>6. Changes to This Policy</h2>
          <p>
            We may update this policy periodically. Please check this page for
            the latest information.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this policy, please contact us at
            <a href="mailto:support@example.com"> support@example.com</a>.
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default Policy;