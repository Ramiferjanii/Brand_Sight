"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";

/* ──────────────────────────────────────────────
   Static fallback FAQs (shown before AI questions load)
────────────────────────────────────────────── */
const STATIC_FAQS = [
  {
    q: "How do I start a new scraping job?",
    a: "Go to the Scraping page, fill in the target URL, configure fields, then click 'Start Scraping'. Results appear in Scraping Results when done.",
  },
  {
    q: "How is the Competitor Battle analysis generated?",
    a: "The platform uses AI to compare your products against competitor listings, evaluating price, description quality, and review sentiment.",
  },
  {
    q: "What does the Market Reports page show?",
    a: "Market Reports aggregate price trends, category demand signals, and competitor movement over time.",
  },
  {
    q: "How do I track price changes over time?",
    a: "Each product card has a 'Price History' chart. The platform re-scrapes tracked products on a schedule and records each price point.",
  },
  {
    q: "Why is my scraping job returning 0 results?",
    a: "Check the Scraping Health page for diagnostics. Common causes: anti-bot protections, site structure changes, or invalid selectors.",
  },
];

interface AiQuestion {
  question: string;
  count: number;
}

export default function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [aiQuestions, setAiQuestions] = useState<AiQuestion[]>([]);
  const [loadingAi, setLoadingAi] = useState(true);

  /* Fetch top AI questions from backend */
  useEffect(() => {
    api
      .get("/chat/top-questions")
      .then((res) => {
        if (res.data?.questions) setAiQuestions(res.data.questions);
      })
      .catch(() => {/* silently fallback */})
      .finally(() => setLoadingAi(false));
  }, []);

  /* Open the floating chatbot (dispatches custom event) */
  const openChatbot = () => {
    window.dispatchEvent(new CustomEvent("open-ai-chatbot"));
  };

  /* Merge: AI questions first (with "Asked X times" badge), then static */
  const dynamicFaqs = [
    ...aiQuestions.map((q) => ({
      q: q.question,
      a: null, // AI questions have no static answer
      count: q.count,
      isAi: true,
    })),
    ...STATIC_FAQS.map((f) => ({ ...f, count: 0, isAi: false })),
  ];

  const filtered = dynamicFaqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      (f.a && f.a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Hero ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)",
          borderRadius: "20px",
          padding: "48px 40px",
          textAlign: "center",
          color: "#fff",
          marginBottom: "40px",
          boxShadow: "0 8px 32px rgba(14,165,233,0.25)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            marginBottom: 16,
            backdropFilter: "blur(8px)",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
            <path
              d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-2.5 2.5V13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16.5" r="0.75" fill="white" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800,
            margin: "0 0 12px",
            letterSpacing: "-0.5px",
          }}
        >
          Help & Support
        </h1>
        <p style={{ fontSize: 16, opacity: 0.9, margin: "0 0 28px" }}>
          Find answers, guides, and resources to get the most out of the platform.
        </p>

        {/* AI Chatbot CTA */}
        <Link
          href="/help-center"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.2)",
            border: "1.5px solid rgba(255,255,255,0.4)",
            borderRadius: 12,
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            padding: "10px 22px",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            transition: "all 0.2s ease",
            marginBottom: 28,
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget).style.background = "rgba(255,255,255,0.3)";
            (e.currentTarget).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget).style.background = "rgba(255,255,255,0.2)";
            (e.currentTarget).style.transform = "translateY(0)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          ✨ Open AI Assistant
        </Link>

        {/* Search */}
        <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help articles…"
            style={{
              width: "100%",
              padding: "12px 16px 12px 44px",
              borderRadius: "10px",
              border: "1.5px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 40,
        }}
      >
        {(
          [
            { label: "Scraping Docs", icon: "🕷️", href: "/scraping" },
            { label: "Market Reports", icon: "📊", href: "/market-reports" },
            { label: "Scraping Health", icon: "🩺", href: "/scraping-health" },
            { label: "AI Assistant", icon: "✨", href: "#", onClick: openChatbot },
          ] as { label: string; icon: string; href: string; onClick?: () => void }[]
        ).map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={item.onClick ? (e) => { e.preventDefault(); item.onClick!(); } : undefined}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "24px 16px",
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 14,
              textDecoration: "none",
              color: "#1e293b",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#0ea5e9";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e2e8f0";
            }}
          >
            <span style={{ fontSize: 28 }}>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </div>

      {/* ── AI Questions Section ── */}
      {(loadingAi || aiQuestions.length > 0) && (
        <div
          style={{
            background: "linear-gradient(135deg, #f0f9ff, #faf5ff)",
            border: "1.5px solid #c4b5fd",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(124,58,237,0.08)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              padding: "20px 28px",
              borderBottom: "1.5px solid #ede9fe",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontWeight: 700,
              fontSize: 16,
              color: "#5b21b6",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                stroke="#7c3aed"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Most Asked by Users (AI Chat)
            <span
              style={{
                fontSize: 11,
                background: "#7c3aed",
                color: "#fff",
                borderRadius: 20,
                padding: "2px 10px",
                fontWeight: 600,
                marginLeft: 4,
              }}
            >
              LIVE
            </span>
          </div>

          {loadingAi ? (
            <div style={{ padding: "24px 28px", display: "flex", gap: 8 }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 12,
                    borderRadius: 6,
                    background: "#e9d5ff",
                    width: `${60 + i * 20}px`,
                    animation: "pulse 1.5s infinite",
                  }}
                />
              ))}
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {aiQuestions.map((q, i) => (
                <li
                  key={i}
                  style={{
                    borderBottom: i < aiQuestions.length - 1 ? "1px solid #ede9fe" : "none",
                  }}
                >
                  <button
                    onClick={openChatbot}
                    title="Click to ask this in AI Assistant"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "14px 28px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 14,
                      color: "#4c1d95",
                      fontWeight: 500,
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget).style.background = "rgba(139,92,246,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget).style.background = "none";
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#a78bfa" strokeWidth="2" />
                        <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-2.5 2.5V13" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="16.5" r="0.75" fill="#a78bfa" />
                      </svg>
                      {q.question}
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: 11,
                        background: "#ede9fe",
                        color: "#7c3aed",
                        borderRadius: 20,
                        padding: "2px 8px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      ×{q.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── Static FAQ Accordion ── */}
      <div
        style={{
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            padding: "20px 28px",
            borderBottom: "1.5px solid #e2e8f0",
            fontWeight: 700,
            fontSize: 16,
            color: "#0f172a",
          }}
        >
          Frequently Asked Questions
        </div>

        {filtered.filter((f) => !f.isAi && f.a).length === 0 ? (
          <div style={{ padding: "32px 28px", color: "#94a3b8", fontSize: 14 }}>
            No results found for &quot;{search}&quot;.
          </div>
        ) : (
          filtered
            .filter((f) => !f.isAi && f.a)
            .map((faq, i, arr) => (
              <div
                key={i}
                style={{ borderBottom: i < arr.length - 1 ? "1.5px solid #f1f5f9" : "none" }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "18px 28px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#0f172a",
                    gap: 12,
                  }}
                >
                  <span>{faq.q}</span>
                  <span
                    style={{
                      flexShrink: 0,
                      transition: "transform 0.2s",
                      transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                      color: "#0ea5e9",
                    }}
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                {openIndex === i && (
                  <div
                    style={{
                      padding: "0 28px 20px",
                      fontSize: 14,
                      color: "#475569",
                      lineHeight: 1.7,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))
        )}
      </div>

      {/* ── Contact card ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
          border: "1.5px solid #86efac",
          borderRadius: 16,
          padding: "32px 28px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#15803d" }}>
            Still need help?
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: "#16a34a" }}>
            Chat with our support team directly on WhatsApp.
          </p>
        </div>
        <a
          href="https://wa.me/21658215477"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg, #25d366, #128c7e)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            padding: "12px 24px",
            borderRadius: 10,
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(37,211,102,0.35)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 20px rgba(37,211,102,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 12px rgba(37,211,102,0.35)";
          }}
        >
          {/* WhatsApp icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.563 4.14 1.535 5.874L0 24l6.302-1.513A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.374l-.36-.213-3.737.897.934-3.627-.234-.373A9.818 9.818 0 0 1 2.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z" />
          </svg>
          Contact Support
        </a>
      </div>
    </div>
  );
}
