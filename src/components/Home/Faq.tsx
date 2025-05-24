"use client";
import { useState } from 'react';
import { ChevronDown, HelpCircle, Check, Mail } from 'lucide-react';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const questions = [
    {
      question: "How do I list an item for rent?",
      answer: "Start by creating a free account, then use our easy listing wizard to add details, photos, and pricing for your item.",
      steps: ["Sign up", "Create listing", "Set availability"]
    },
    {
      question: "What safety measures are in place?",
      answer: "All transactions are protected with secure payments, user verifications, and optional insurance coverage.",
      methods: ["ID Verification", "Secure Payments", "Damage Protection"]
    },
    {
      question: "How are payments handled?",
      answer: "We hold payments securely until the rental period is completed successfully. Owners receive payment within 24 hours of item return.",
      bonus: "No transaction fees for first 5 rentals"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-6 py-2 rounded-full mb-6">
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">FAQ</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Common Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Quick answers to frequent queries about renting and listing items
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {questions.map(({ question, answer, ...details }, i) => (
            <div key={question} className="mb-4">
              <div
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer border border-gray-200"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {openIndex === i ? (
                        <Check className="w-5 h-5 text-blue-600" />
                      ) : (
                        <span className="text-blue-600 font-bold">{i + 1}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{question}</h3>
                  </div>
                  <div>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <div className={`overflow-hidden ${openIndex === i ? 'block' : 'hidden'}`}>
                  <div className="pl-14 pt-4">
                    <p className="text-gray-600 mb-4">{answer}</p>

                    {details.steps && (
                      <ul className="space-y-2 mb-4">
                        {details.steps.map((step, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-blue-600">
                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                              {idx + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    )}

                    {details.methods && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {details.methods.map((method, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-sm">
                            {method}
                          </span>
                        ))}
                      </div>
                    )}

                    {details.bonus && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-600 text-sm">🌟 {details.bonus}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-12 p-6 bg-blue-600 rounded-xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Still need help?
            </h3>
            <p className="text-blue-200 mb-4">
              Our support team is ready to assist you
            </p>
            <button
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};