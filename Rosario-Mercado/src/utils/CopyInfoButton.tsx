import React, { useState } from "react";

type Props = {
  phoneNumber?: string | null;
  textInButton?: string | null;
};

export const CopyInfoButton: React.FC<Props> = ({ phoneNumber, textInButton }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback para navegadores antiguos
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // indicador temporal
    } catch {
      // opcional: manejar error (mostrar mensaje, console.log, etc.)
      setCopied(false);
    }
  };

  if (!phoneNumber) return null;

  return (
    <button
      type="button"
      onClick={() => copyToClipboard(phoneNumber)}
      className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
      aria-label={`Copiar número ${phoneNumber}`}
    >
      {copied ? "Copiado" : textInButton}
    </button>
  );
};

export default CopyInfoButton;