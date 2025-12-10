
import * as React from "react";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}


