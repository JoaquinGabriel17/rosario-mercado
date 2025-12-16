import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import Loading from "../ui/Loading";
import Alert from "../ui/Alert";
import { Button } from "../ui/Button";

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface ProductForm {
  title: string;
  description: string;
  price: number | "";
  category: string;
  image?: File | null;
}


export default function CreateProduct() {
    const user = useUserStore((state) => state.user);

  const [form, setForm] = useState<ProductForm>({
    title: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  const [errors, setErrors] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)
  const [ alert, setAlert] = useState({
    open: false, 
    message: "", 
    type: "info" as "info" | "success" | "error",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "price" ? Number(value) || "" : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      image: e.target.files ? e.target.files[0] : null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault();

    // Validaciones obligatorias
    if (!form.title || !form.price || !form.category || !form.image) {
      setLoading(false)
      setAlert({
  open: true,
  message: "Debe completar todos los campos obligatorios *",
  type: "error",
});
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    if(form.description) formData.append("description", form.description);
    formData.append("price", form.price.toString());
    formData.append("category", form.category);
    formData.append("image", form.image); 



    setErrors("");

    const res = await fetch(`${backendUrl}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user?.token}`, 
      // NO agregar Content-Type, fetch lo hace solo cuando hay FormData
    },
    body: formData,
  });

  const data = await res.json();
    
    if (!res.ok) {
    console.log("Error:", data.message);
    setLoading(false)
    return;
  }
  setLoading(false)
  setAlert({
  open: true,
  message: "Producto creado con éxito",
  type: "success",
});

    // Reset form
    setForm({
      title: "",
      description: "",
      price: "",
      category: "",
      image: null,
    });
    
  };
  


  return (
    
    <div className="p-4 text-left">
    {loading && <Loading></Loading>}
    {alert && <Alert
  open={alert.open}
  message={alert.message}
  type={alert.type}
  onClose={() => setAlert({ ...alert, open: false })}/>}

      <h2 className="text-xl font-semibold mb-4 text-center">Crear Producto</h2>

      {errors && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
          {errors}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* TÍTULO */}
        <div>
          <label className="font-medium">Título *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ej: Pizza de muzzarella"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* DESCRIPCIÓN */}
        <div>
          <label className="font-medium">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Ej: Pizza casera con queso..."
            className="w-full p-2 border rounded-lg h-24"
          />
        </div>

        {/* PRECIO */}
        <div>
          <label className="font-medium">Precio *</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Ej: 1500"
            className="w-full p-2 border rounded-lg"
            required
            min="1"
          />
        </div>

        {/* CATEGORÍA */}
        <div>
          <label className="font-medium">Categoría *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Seleccionar categoría</option>
            <option value="comidas">Comidas</option>
            <option value="bebidas">Bebidas</option>
            <option value="combos">Combos</option>
          </select>
        </div>

        {/* IMAGEN */}
        <div>
          <label className="font-medium">Imagen *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg bg-white"
          />
        </div>

        {/* SUBMIT */}
        <Button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg active:scale-95 transition"
        >
          Crear producto
        </Button>
      </form>
    </div>
  );
}
