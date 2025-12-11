// src/components/ui/Loading.tsx
import React from "react";

interface LoadingProps {
  fullscreen?: boolean; // Si querés que tape toda la pantalla
}

const Loading: React.FC<LoadingProps> = ({ fullscreen = true }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullscreen ? "fixed inset-0" : "w-full h-full"
      } bg-black/20 backdrop-blur-sm z-50`}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-600" />
    </div>
  );
};

export default Loading;
