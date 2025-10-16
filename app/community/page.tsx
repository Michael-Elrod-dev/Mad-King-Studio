// app/community/page.tsx
"use client";

import React, { useState } from "react";
import FloatingNav from "@/components/layout/FloatingNav";
import LiveStatus from "@/components/community/LiveStatus";
import { useLiveStatus } from "@/contexts/LiveStatusContext";
import { sendContactEmail, isEmailJSConfigured } from "@/lib/api/emailjs";
import { validateContactForm } from "@/lib";
import { SOCIAL_LINKS, CONTACT_SUBJECTS } from "@/lib/data/constants";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  success: string | null;
}

export default function CommunityPage() {
  const { liveStatus } = useLiveStatus();
  const { isLive, isLoading } = liveStatus;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
    success: null,
  });

  const emailConfigured = isEmailJSConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormState({
      isSubmitting: true,
      isSubmitted: false,
      error: null,
      success: null,
    });

    // Validate form data
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setFormState({
        isSubmitting: false,
        isSubmitted: false,
        error: validation.errors.join(", "),
        success: null,
      });
      return;
    }

    // Check email configuration
    if (!emailConfigured) {
      setFormState({
        isSubmitting: false,
        isSubmitted: false,
        error: "Email service is not configured",
        success: null,
      });
      return;
    }

    // Attempt to send email
    try {
      const emailResult = await sendContactEmail(formData);

      if (!emailResult.success) {
        setFormState({
          isSubmitting: false,
          isSubmitted: false,
          error: emailResult.message,
          success: null,
        });
        return;
      }

      // Success!
      setFormState({
        isSubmitting: false,
        isSubmitted: true,
        error: null,
        success: "Message sent!",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);

      let errorMessage = "An unexpected error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage.includes("Too many")) {
        errorMessage =
          "You've submitted too many forms recently. Please wait 15 minutes before trying again.";
      }

      setFormState({
        isSubmitting: false,
        isSubmitted: false,
        error: errorMessage,
        success: null,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (formState.error || formState.success) {
      setFormState({
        ...formState,
        error: null,
        success: null,
      });
    }
  };
  return (
    <div className="min-h-screen pb-12">
      <FloatingNav />
      <div className="pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
              Community
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Join the community on Twitch, Discord, and YouTube. Watch live
              coding and be part of the development journey.
            </p>
          </div>

          <LiveStatus />

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Left Column - Social Links (2x2 grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Twitch Panel */}
              <div className="group relative bg-gradient-to-br from-purple-600/90 to-purple-700/90 border border-purple-500/50 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 flex flex-col items-center justify-center min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex justify-center mb-6">
                  <div className="relative bg-white/10 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                    </svg>
                    {isLive && !isLoading && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Twitch Stream
                  </h3>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Watch live game development
                  </p>

                  {isLive && !isLoading ? (
                    <a
                      href={SOCIAL_LINKS.TWITCH}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full border-2 border-white hover:bg-white text-white hover:text-purple-600 font-bold py-3 rounded-full transition-all duration-300 text-lg hover:scale-105"
                    >
                      Watch
                    </a>
                  ) : (
                    <a
                      href={SOCIAL_LINKS.TWITCH}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full border-2 border-white hover:bg-white text-white hover:text-purple-600 font-bold py-3 rounded-full transition-all duration-300 text-lg hover:scale-105"
                    >
                      Follow
                    </a>
                  )}
                </div>
              </div>

              {/* Discord Panel */}
              <div className="group relative bg-gradient-to-br from-indigo-600/90 to-indigo-700/90 border border-indigo-500/50 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 flex flex-col items-center justify-center min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex justify-center mb-6">
                  <div className="bg-white/10 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Discord Server
                  </h3>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Chat with other community members and post memes
                  </p>

                  <a
                    href={SOCIAL_LINKS.DISCORD}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full border-2 border-white hover:bg-white text-white hover:text-indigo-600 font-bold py-3 rounded-full transition-all duration-300 text-lg hover:scale-105"
                  >
                    Join
                  </a>
                </div>
              </div>

              {/* YouTube Panel */}
              <div className="group relative bg-gradient-to-br from-red-600/90 to-red-700/90 border border-red-500/50 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30 flex flex-col items-center justify-center min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex justify-center mb-6">
                  <div className="bg-white/10 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    YouTube Channel
                  </h3>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Watch development updates and tutorials
                  </p>

                  <a
                    href={SOCIAL_LINKS.YOUTUBE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full border-2 border-white hover:bg-white text-white hover:text-red-600 font-bold py-3 rounded-full transition-all duration-300 text-lg hover:scale-105"
                  >
                    Subscribe
                  </a>
                </div>
              </div>

              {/* X Panel */}
              <div className="group relative bg-gradient-to-br from-blue-500/90 to-blue-600/90 border border-blue-400/50 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 flex flex-col items-center justify-center min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex justify-center mb-6">
                  <div className="bg-white/10 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    X Account
                  </h3>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Follow for quick updates and development snippets
                  </p>

                  <a
                    href={SOCIAL_LINKS.X}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full border-2 border-white hover:bg-white text-white hover:text-blue-500 font-bold py-3 rounded-full transition-all duration-300 text-lg hover:scale-105"
                  >
                    Follow
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border border-neutral-800/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
                <h2 className="text-3xl font-bold text-white">Send an Email</h2>
              </div>

              {/* Email configuration warning */}
              {!emailConfigured && (
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/50 text-yellow-300 rounded-xl">
                  <p className="text-sm font-medium">
                    Email service is not fully configured. Form submission will
                    be limited.
                  </p>
                </div>
              )}

              {/* Success/Error Messages */}
              {formState.success && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/50 text-green-300 rounded-xl">
                  <p className="font-medium">{formState.success}</p>
                </div>
              )}

              {formState.error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/50 text-red-300 rounded-xl">
                  <p className="font-medium">{formState.error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-white font-semibold mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    disabled={formState.isSubmitting}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-white font-semibold mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={formState.isSubmitting}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-white font-semibold mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={formState.isSubmitting}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all [&>option]:bg-neutral-800 [&>option]:text-white [&>option]:py-2"
                  >
                    <option value="" className="bg-neutral-800 text-white">
                      Select a subject
                    </option>
                    {CONTACT_SUBJECTS.map((subject) => (
                      <option
                        key={subject.value}
                        value={subject.value}
                        className="bg-neutral-800 text-white"
                      >
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-white font-semibold mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={formState.isSubmitting}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none resize-vertical disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    placeholder="Tell me about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState.isSubmitting || !emailConfigured}
                  className="w-full bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border-2 border-red-500/50 hover:border-red-500/70 text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-4 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center"
                >
                  {formState.isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
