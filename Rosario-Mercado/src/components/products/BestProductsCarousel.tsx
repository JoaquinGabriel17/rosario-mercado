import { useState } from "react";
import type { Product } from "../../pages/Home";
import { useNavigate } from "react-router-dom";

export default function BestProductsCarousel({ products }: { products: Array<Product> }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate()

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % products.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);

  return (
    <div className="w-full relative flex flex-col items-center p-4">
      {/* Imagen con overlay */}
      <div onClick={() => navigate(`/products/${products[currentIndex]._id}`)} className="w-full h-92  rounded-2xl shadow-lg overflow-hidden relative">
        <img
          src={products[currentIndex].imageUrl}
          alt={products[currentIndex].title}
          className="w-full h-full   object-contain bg-black transform transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute bottom-0 w-full h-1/3 bg-linear-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Info del producto */}
      <div className="text-center mt-4 px-3">
        <h3 className="text-xl font-bold text-gray-800">{products[currentIndex].title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{products[currentIndex].description}</p>
        <p className="text-2xl font-extrabold text-green-600 mt-2">${products[currentIndex].price}</p>
      </div>

      {/* Controles */}
      <div className="flex justify-between w-full mt-1 px-10 ">
        <button
          onClick={prevSlide}
          className="w-15 h-15 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md hover:bg-black/40 transition active:scale-95"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="w-15 h-15 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md hover:bg-black/40 transition active:scale-95"
        >
          ▶
        </button>
      </div>

      {/* Indicadores */}
      <div className="flex gap-2 mt-4">
        {products.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-blue-600 scale-110" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}