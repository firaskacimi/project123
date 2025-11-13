// components/LoadingSpinner.tsx
"use client";

import { useEffect, useState } from "react";

export default function LoadingSpinner({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (replace with real data loading if needed)
    const timer = setTimeout(() => setLoading(false), 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-linear-to-b from-[#0f0c29] to-[#302b63] text-white">
        <div className="flex space-x-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-10 bg-pink-500 animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <p className="mt-4 text-lg tracking-widest">LOADING</p>
      </div>
    );
  }

  return <>{children}</>;
}
