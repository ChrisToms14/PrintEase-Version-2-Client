import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">
        Welcome to PrintEase! By using our services, you agree to the following terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Service</h2>
      <p className="mb-4">
        You agree to use PrintEase only for lawful purposes. You are responsible for any content you upload and print.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. User Accounts</h2>
      <p className="mb-4">
        You are responsible for maintaining the confidentiality of your login credentials and for any activity under your account.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Payments</h2>
      <p className="mb-4">
        All payments are final. Refunds are handled at the discretion of the print shop admin.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Service Availability</h2>
      <p className="mb-4">
        We strive for 99% uptime but do not guarantee uninterrupted service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to Terms</h2>
      <p className="mb-4">
        We may modify these terms at any time. Continued use of the service means you accept the updated terms.
      </p>

      <p className="text-sm text-gray-500 mt-8">
        Last updated: July 2025
      </p>
    </div>
  );
};

export default TermsOfServicePage;
