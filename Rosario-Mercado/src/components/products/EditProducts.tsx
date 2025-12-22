import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useUserStore } from "../../store/userStore";
import Loading from "../ui/Loading";
import Alert from "../ui/Alert";
import { useParams } from "react-router-dom";


export default function EditProducts() {
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const user = useUserStore((state) => state.user);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "info" as "info" | "success" | "error",
  });


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: null as File | null,
    stock: "",
  });

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const fetchProductToEdit = async () => {
    try {
      setLoading(true)
      if (!user) {
        setLoading(false)
        setAlert({
          open: true,
          message: "Usuario no identificado",
          type: "error",
        });
        ; return;
      }
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) {
        setLoading(false)
        setAlert({
          open: true,
          message: "Error al cargar producto para editar",
          type: "error",
        });
        console.log(res)
        return;
      }
      const data = await res.json();
      setSelectedProduct(data.product);
    } catch (err) {
      setLoading(false)

      setAlert({
        open: true,
        message: "Error al cargar producto para editar",
        type: "error",
      });
      console.log(err)
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (productId) {

      fetchProductToEdit();
    } else {
      setLoading(false)
      setAlert({
        open: true,
        message: "Error al cargar producto para editar",
        type: "error",
      });
      return
    }
  }, []);

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
      setLoading(true)
      if (!user) {
        setLoading(false)
        setAlert({
          open: true,
          message: "Usuario no identificado",
          type: "error",
        });
        return;
      }

      if (!formData.stock && !formData.title && !formData.description && !formData.price && !formData.category && !formData.image) {
        setLoading(false)
        setAlert({
          open: true,
          message: "Debe modificar al menos un campo",
          type: "error",
        });
        return;
      }

      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        setAlert({
        open: true,
        message: "Error al actualizar el producto",
        type: "error",
      });
      return;
      }
      setLoading(false)
      setAlert({
        open: true,
        message: "Producto actualizado correctamente",
        type: "success",
      });
      setFormData({
    title: "",
    description: "",
    price: "",
    category: "",
    image: null as File | null,
    stock: "",
  });
    } catch (err) {
      setLoading(false)
      console.log(err)
      setAlert({
        open: true,
        message: "Error al actualizar producto",
        type: "error",
      });
    }
    finally {
      setLoading(false)
    }
  };

  const handleCloseAlert = () => {
    if (alert.type === "success") {
      setAlert({ ...alert, open: false });
      return;
    }
    setAlert({ ...alert, open: false });
  }


  return (
    <div className="p-4">
        {loading && <Loading></Loading>}
    {alert && <Alert
  open={alert.open}
  message={alert.message}
  type={alert.type}
  onClose={handleCloseAlert}/>}
  {selectedProduct && ( <>
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
          min="1"
        />

        <label className="font-medium m-0">Stock</label>
        <input
          name="stock"
          type="number"
          className="border rounded-xl px-3 py-2"
          placeholder={selectedProduct.stock}
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
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
</>)}
    </div>
  );
}
