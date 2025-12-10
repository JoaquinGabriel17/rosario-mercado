import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useUserStore } from "../../store/userStore";



export default function EditProducts({ productId, onBack }:{ productId: string, onBack: () => void; } ) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const user = useUserStore((state) => state.user);


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: null as File | null,
  });

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const fetchProductToEdit = async () => {
    try {
        setLoading(true)
        if(!user){ alert('Usuario no identificado'); return;}
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error("Error al cargar producto para editar");
      const data = await res.json();

      setSelectedProduct(data);
    } catch (err) {
      setError("Error al cargar el producto seleccionado");
    }
    finally{
        setLoading(false)
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductToEdit();
    } else {
      setLoading(false)
      setError("No se seleccionó un producto para editar")
      return
    }
  }, [productId]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      image: e.target.files ? e.target.files[0] : null,
    });
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
        if(!user){ alert('Usuario no identificado'); return;}

      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al actualizar producto");
      alert("Producto actualizado correctamente");
      onBack()
    } catch (err) {
      alert("Error al actualizar");
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Editando producto {selectedProduct.title}</h2>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="font-medium m-0">Título</label>
        <input
          name="title"
          className="border rounded-xl px-3 py-2"
          placeholder={selectedProduct.title}
          value={formData.title}
          onChange={handleChange}
          required
        />
        <label className="font-medium m-0">Descripción</label>
        <textarea
          name="description"
          className="border rounded-xl px-3 py-2"
          placeholder={selectedProduct.description}
          value={formData.description}
          onChange={handleChange}
          required
        />
        <label className="font-medium m-0">Precio</label>
        <input
          name="price"
          type="number"
          className="border rounded-xl px-3 py-2"
          placeholder={selectedProduct.price}
          value={formData.price}
          onChange={handleChange}
          required
        />
        
        <label className="font-medium">Categoría</label>
        <h2 className="m-0 font-light">Cateogoría actual: {selectedProduct.category}</h2>
        <select
          name="category"
          className="border rounded-xl px-3 py-2"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar categoría</option>
          <option value="comidas">Comidas</option>
          <option value="bebidas">Bebidas</option>
        </select>

        {/* Imagen */}
        <div>
          <label className="font-medium">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg bg-white"
          />
        </div>

        <Button onClick={handleSubmit} type="submit">Guardar cambios</Button>
      </form>
    </div>
  );
}
