"use client";
import { useState } from "react";
import { Mail, Send, Check, Lock, Gift, Sparkles } from "lucide-react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="relative py-24 bg-gradient-to-b from-indigo-50 to-purple-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2rem] p-1 shadow-2xl group">
          <div className="relative rounded-[calc(2rem-4px)] overflow-hidden">
            {/* Static Border */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-[conic-gradient(var(--tw-gradient-stops))] from-purple-400 via-indigo-400 to-purple-400 [animation-duration:6s]">
                <div className="absolute inset-[2px] bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[calc(2rem-4px)]" />
              </div>
            </div>

            <div className="relative p-12 text-center">
              {/* Header Section */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-white/10 px-6 py-2 rounded-full mb-6">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-indigo-100 font-medium">Exclusive Updates</span>
                </div>
                <h2 className="text-5xl font-bold text-white mb-4">
                  Join Our Premium Circle
                </h2>
                <p className="text-indigo-200 text-xl max-w-2xl mx-auto">
                  Get early access to new collections, special discounts, and members-only content
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { icon: Gift, title: "First Access", text: "Early product releases" },
                  { icon: Sparkles, title: "Exclusive Deals", text: "Members-only discounts" },
                  { icon: Lock, title: "Priority Support", text: "Dedicated assistance" },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="p-6 bg-white/5 rounded-xl backdrop-blur-sm"
                  >
                    <Icon className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">{title}</h3>
                    <p className="text-indigo-200">{text}</p>
                  </div>
                ))}
              </div>

              {/* Subscription Form */}
              <form
                className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 placeholder-indigo-300 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute right-4 top-4 w-6 h-6 text-indigo-300" />
                </div>
                <button
                  type="submit"
                  className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold flex items-center gap-2 justify-center hover:bg-indigo-50 transition-colors"
                >
                  Subscribe Now <Send className="w-5 h-5" />
                </button>
              </form>

              {/* Success Message */}
              {submitted && (
                <div className="mt-6 bg-green-500/20 p-4 rounded-xl inline-flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-400" />
                  <span className="text-green-200">
                    Thanks for subscribing! Check your inbox for confirmation
                  </span>
                </div>
              )}

              {/* Privacy Assurance */}
              <p className="text-indigo-300 text-sm mt-8 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                We respect your privacy. No spam, ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};