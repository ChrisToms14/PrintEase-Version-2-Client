import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I place a print order?",
      answer: "Log in to your account → Go to Orders → Fill in your printing details → Choose payment method → Place order. It's that simple!"
    },
    {
      question: "What formats are supported for upload?",
      answer: "We support PDF, DOCX, JPG, and PNG formats. Make sure your files are under 20MB each for optimal upload speed."
    },
    {
      question: "How is pricing calculated?",
      answer: "Pricing is based on the number of pages, print type (black & white or color), binding options, and paper size. You'll see the total cost before confirming your order."
    },
    {
      question: "Can I cancel my order?",
      answer: "Unfortunately, orders cannot be cancelled once placed as we begin processing immediately to ensure quick turnaround times."
    },
    {
      question: "Can I pay later?",
      answer: "Yes! You can choose the 'Pay at Pickup' option during checkout and pay when you collect your prints."
    },
    {
      question: "How long does it take to process my order?",
      answer: "Most orders are ready within an Hour. You'll receive notifications when your order is ready for pickup."
    },
    {
      question: "What if there's an issue with my print quality?",
      answer: "We guarantee high-quality prints. If you're not satisfied, please contact us immediately and we'll reprint your order at no extra cost."
    },
    {
      question: "Can I print confidential documents?",
      answer: "Yes, we have a 'Confidential' option during order placement. These documents are handled with extra care and privacy."
    },
    {
      question: "Do you offer bulk printing discounts?",
      answer: "Currently, our pricing is standardized. However, we're working on introducing bulk discounts for large orders in the future."
    },
    {
      question: "How do I track my order status?",
      answer: "You can track your order status in real-time through your dashboard. You'll also receive notifications via the platform."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <HelpCircle size={40} className="text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions about PrintEase
            </p>
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={24} className="text-gray-500" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-12 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-lg opacity-90 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;