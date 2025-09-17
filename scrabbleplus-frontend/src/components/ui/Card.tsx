import React from "react";

export default function Card({ className="", children }:{ className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-gray-200 bg-white/70 shadow-sm p-4 ${className}`}>{children}</div>;
}
