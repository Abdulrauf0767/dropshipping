import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const faqData = [
    {
      id: 1,
      question: "What is Dropshipping?",
      answer:
        "Dropshipping is a business model where we don’t keep products in stock. Instead, when you order from our store, the product is shipped directly from our supplier to your doorstep.",
    },
    {
      id: 2,
      question: "How long does delivery take?",
      answer:
        "On average, delivery takes 7–15 business days, depending on your location and the product supplier.",
    },
    {
      id: 3,
      question: "Can I return a product?",
      answer:
        "Yes, we have a 7–14 days return policy (depending on supplier). The product must be unused and in original packaging.",
    },
  ];

  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div id="faq" className="w-full max-w-3xl mx-auto p-6">
      {/* Heading */}
      <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className="border border-gray-200 rounded-2xl shadow-md bg-white hover:shadow-lg transition duration-300"
          >
            {/* Question */}
            <button
              onClick={() => toggleFAQ(faq.id)}
              className="w-full flex justify-between items-center p-5 text-left text-lg font-semibold text-gray-800 rounded-2xl"
            >
              {faq.question}
              <span
                className={`ml-2 text-xl font-bold transition-transform duration-300 ${
                  openId === faq.id ? "rotate-180 text-purple-600" : "text-gray-500"
                }`}
              >
                ▼
              </span>
            </button>

            {/* Answer with animation */}
            <AnimatePresence>
              {openId === faq.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 pb-5 text-gray-600 text-base"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
