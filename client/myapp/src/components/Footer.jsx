import React from "react";
import {
  Facebook,
  WhatsApp,
  MusicNote, // TikTok replacement since MUI mein direct TikTok nahi hai
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 p-6">
      <div className="flex items-start justify-between flex-wrap ">
        {/* Quick Links */}
        <section className="flex flex-col  ">
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-3">
            <li>
              <a href="/home" className="hover:text-blue-400 transition">
                Home
              </a>
            </li>
            <li>
              <Link to="/home/about" className="hover:text-blue-400 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/home/contact" className="hover:text-blue-400 transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </section>

        {/* Customer Service */}
        <section className="flex flex-col  ">
          <h3 className="text-xl font-semibold text-white mb-4">
            Customer Service
          </h3>
          <ul className="space-y-3">
            <li>
                <button
                    onClick={() => {
                    document.getElementById("faq").scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-blue-400 transition"
                >
                    FAQs
                </button>
                </li>
            <li>
              <a href="/shipping" className="hover:text-blue-400 transition">
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="/returns" className="hover:text-blue-400 transition">
                Returns & Refunds
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-blue-400 transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </section>

        {/* Social Media */}
        <section className="flex flex-col  items-end ">
          <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-y-3 flex-col   ">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-500 transition"
            >
              <Facebook fontSize="large" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500 transition"
            >
              <MusicNote fontSize="large" />
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noreferrer"
              className="hover:text-green-500 transition"
            >
              <WhatsApp fontSize="large" />
            </a>
          </div>
        </section>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-gray-400 text-sm mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} YourDropshipStore. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
