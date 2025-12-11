"use client";

import { useState, useEffect } from "react";
import { PortableTextBlock } from "@portabletext/react";

interface TOCProps {
  content: PortableTextBlock[];
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TOC({ content }: TOCProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const extractedHeadings: Heading[] = [];

    content.forEach((block) => {
      if (block._type === "block" && block.style) {
        const style = block.style;
        if (style.startsWith("h") && style.length === 2) {
          const level = parseInt(style[1]);
          if (level >= 2 && level <= 4) {
            const text = block.children
              ?.map((child: any) => child.text || "")
              .join("") || "";
            if (text) {
              const id = text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
              extractedHeadings.push({ id, text, level });
            }
          }
        }
      }
    });

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
          Table of Contents
        </h3>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block text-sm transition-colors ${
                  activeId === heading.id
                    ? "text-primary-600 font-medium"
                    : "text-gray-600 hover:text-primary-600"
                }`}
                style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

