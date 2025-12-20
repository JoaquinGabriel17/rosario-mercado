
export function Button({ children, className = "", ...props }: any) {
  return (
    <button
      className={`cursor-pointer m-1 p-4 rounded font-semibold shadow-sm active:scale-95 transition-all bg-blue-600 text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}