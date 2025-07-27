import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        At PrintEase, we respect your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Your name and email address when you sign up</li>
        <li>Order details (files uploaded, preferences, delivery options)</li>
        <li>Payment information (handled securely via third-party services)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>To process and manage your print orders</li>
        <li>To provide customer support</li>
        <li>To improve our services</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
      <p className="mb-4">
        We use industry-standard measures to protect your information. However, no method of transmission over the internet is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
      <p className="mb-4">
        We may update this policy occasionally. We encourage you to review it regularly.
      </p>

      <p className="text-sm text-gray-500 mt-8">
        Last updated: July 2025
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
