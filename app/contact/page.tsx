// app/contact/page.tsx
"use client";

import { useState, useEffect } from "react";
import FloatingNav from "@/components/layout/FloatingNav";
import { useLiveStatus } from "@/contexts/LiveStatusContext";
import { sendContactEmail, isEmailJSConfigured } from "@/lib/emailjs";
import { validateContactForm } from "@/lib/utils";
import { SOCIAL_LINKS } from "@/lib/constants";

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

export default function ContactPage() {
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

  const [emailConfigured, setEmailConfigured] = useState(false);

  useEffect(() => {
    setEmailConfigured(isEmailJSConfigured());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormState({
      isSubmitting: true,
      isSubmitted: false,
      error: null,
      success: null,
    });

    try {
      // Client-side validation
      const validation = validateContactForm(formData);

      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      if (!emailConfigured) {
        throw new Error("Email service is not configured");
      }

      // Send email using EmailJS
      const emailResult = await sendContactEmail(formData);

      if (!emailResult.success) {
        throw new Error(emailResult.message);
      }

      setFormState({
        isSubmitting: false,
        isSubmitted: true,
        error: null,
        success: "Message sent!",
      });

      // Reset form
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

      // Check if it's a rate limit error
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
    >
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Have questions about the project? Want to collaborate? Or just
              want to say hi? Shoot me a message below or at one of the given
              links.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-neutral-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Send a Message
              </h2>

              {/* Email configuration warning */}
              {!emailConfigured && (
                <div className="mb-6 p-4 bg-yellow-600 text-white rounded-lg">
                  <p className="text-sm">
                    Email service is not fully configured. Form submission will
                    be limited.
                  </p>
                </div>
              )}

              {/* Success/Error Messages */}
              {formState.success && (
                <div className="mb-6 p-4 bg-green-500 text-white rounded-lg">
                  {formState.success}
                </div>
              )}

              {formState.error && (
                <div className="mb-6 p-4 bg-red-500 text-white rounded-lg">
                  {formState.error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-white font-medium mb-2"
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
                    className="w-full px-4 py-3 bg-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-white font-medium mb-2"
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
                    className="w-full px-4 py-3 bg-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-white font-medium mb-2"
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
                    className="w-full px-4 py-3 bg-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a subject</option>
                    <option value="collaboration">
                      Collaboration Opportunity
                    </option>
                    <option value="feedback">Game Feedback</option>
                    <option value="technical">Technical Question</option>
                    <option value="general">General Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-white font-medium mb-2"
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
                    className="w-full px-4 py-3 bg-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none resize-vertical disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Tell me about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState.isSubmitting || !emailConfigured}
                  className="w-full border border-red-500 hover:bg-red-600 hover:bg-red-500 text-red-500 hover:text-white/90 disabled:bg-red-400 disabled:border-red-400 disabled:cursor-not-allowed font-semibold py-3 px-6 rounded-full transition-colors flex items-center justify-center"
                >
                  {formState.isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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

            {/* Right Side - All other panels grouped together */}
            <div className="space-y-8">
              <div className="bg-neutral-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Quick Links
                </h3>
                <a
                  href={SOCIAL_LINKS.TWITCH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/90 hover:text-purple-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                  </svg>
                  Twitch Channel
                </a>
                <a
                  href={SOCIAL_LINKS.DISCORD}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/90 hover:text-indigo-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z" />
                  </svg>
                  Discord Server
                </a>
                <a
                  href={SOCIAL_LINKS.X}
                  className="flex items-center text-white/90 hover:text-blue-500 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X Account
                </a>
              </div>

              <div className="bg-neutral-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Response Time
                </h3>
                <p className="text-white/90 mb-4">
                  I typically respond to messages within 24-48 hours. For urgent
                  stuff, you can reach out via Discord or check if im live.
                </p>
              </div>

              <div className="bg-neutral-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Prefer Live Chat?
                </h3>
                <p className="text-white/90 mb-4">
                  Join me during live development streams! It&apos;s the best
                  way to ask questions and get real-time answers about the game
                  development process.
                </p>

                {isLive && !isLoading ? (
                  <a
                    href={SOCIAL_LINKS.TWITCH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-purple-600 text-purple-600 hover:text-purple-500 font-semibold py-3 px-8 rounded-full transition-all duration-200 text-lg backdrop-blur-sm inline-block"
                    style={{
                      animation:
                        "pulse-purple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                    }}
                  >
                    Live Now
                  </a>
                ) : (
                  <a
                    href={SOCIAL_LINKS.TWITCH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-purple-500 hover:border-purple-500 hover:bg-purple-500 text-purple-500 hover:text-white/90 font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg inline-block"
                  >
                    Check Stream
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
