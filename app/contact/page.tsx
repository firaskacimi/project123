"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ContactUsPage() {
  const [fadeIn, setFadeIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setFadeIn(true), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with your backend endpoint
      const res = await fetch("http://localhost:4000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");

      toast.success("Message envoyé avec succès !");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'envoi du message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen py-20 text-white p-8 flex flex-col items-center transition-all duration-1000 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-5xl font-extrabold mb-12 text-center bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent animate-fadeInDown">
        Contact Us
      </h1>

      <p className="max-w-2xl text-center text-gray-400 mb-12 animate-fadeInUp">
        Have questions, feedback, or want to collaborate? Send us a message and we’ll get back to
        you as soon as possible.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-gray-900 rounded-3xl p-8 shadow-lg animate-fadeInUp"
      >
        <div className="mb-6">
          <label className="block mb-2 text-gray-400">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-cyan-400 outline-none transition"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-400 outline-none transition"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-400">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            rows={5}
            className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none transition resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-md transition-all duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {/* Optional contact info */}
      <div className="mt-12 text-center text-gray-400 space-y-2 animate-fadeInUp delay-200">
        <p>Email: support@yourcompany.com</p>
        <p>Phone: +1 (555) 123-4567</p>
        <p>Address: 123 Tech Street, Silicon Valley, CA</p>
      </div>
    </div>
  );
}
