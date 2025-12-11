"use client";

import Link from "next/link";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { Settings } from "@/lib/types";

interface FooterProps {
  settings?: Settings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-semibold mb-4">
              {settings?.siteTitle || "Blog"}
            </h3>
            <p className="text-gray-400 mb-4">
              {settings?.siteDescription ||
                "Stay updated with the latest insights and articles."}
            </p>
            <NewsletterSignup />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="hover:text-white transition-colors"
                >
                  Search
                </Link>
              </li>
              {settings?.footerLinks?.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            © {currentYear} {settings?.siteTitle || "Blog"}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

