"use client";

import { useEffect, useState } from "react";
import { StatKey, STAT_DEFS } from "@/lib/stats";

interface StatChange {
  key: StatKey;
  diff: number;
}

interface StatPopupProps {
  changes: StatChange[];
  onDone: () => void;
}

export default function StatPopup({ changes, onDone }: StatPopupProps) {
  const [visible, setVisible] = useState<number[]>([]);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (changes.length === 0) {
      onDone();
      return;
    }

    // Show each change one by one
    changes.forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, i]);
      }, i * 600);
    });

    // Start exit after all shown
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, changes.length * 600 + 2000);

    const doneTimer = setTimeout(() => {
      onDone();
    }, changes.length * 600 + 2800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [changes, onDone]);

  if (changes.length === 0) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-opacity duration-700 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        {changes.map((change, i) => {
          const stat = STAT_DEFS.find((s) => s.key === change.key);
          if (!stat) return null;
          const isVisible = visible.includes(i);

          return (
            <div
              key={change.key}
              className={`stat-popup-item ${isVisible ? "stat-popup-enter" : "opacity-0"}`}
            >
              <div className="glass-card px-6 py-3 flex items-center gap-3 shadow-lg shadow-purple-900/30 border-purple-500/50">
                <span className="text-2xl">{stat.icon}</span>
                <span className="font-bold text-purple-300">
                  +{change.diff}
                </span>
                <span className="text-sm text-gray-300">{stat.name}!</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
