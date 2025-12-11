
export function Button({ children, className = "", ...props }: any) {
  return (
    <button
      className={`cursor-pointer m-1 py-6 px-8 rounded-xl font-semibold shadow-sm active:scale-95 transition-all bg-blue-600 text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}