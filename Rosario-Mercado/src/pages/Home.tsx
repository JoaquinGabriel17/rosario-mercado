import { useEffect, useState } from "react";
import BestProductsCarousel from "../components/products/BestProductsCarousel";
import Alert from "../components/ui/Alert";
import type { ProductsInfo } from "../types/product";
import { useTicketsStore } from "../store/ticketsStore";
import { useUserStore } from "../store/userStore";


function Home() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [loading, setLoading] = useState<boolean>(false)
  const user = useUserStore((state) => state.user);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "info" as "info" | "success" | "error",
  });
  const { setOpenTickets } = useTicketsStore();

  const [productsInfo, setProductsInfo] = useState<ProductsInfo>({
    comidas: [],
    combos: [],
    bebidasTop: []
  });

  //Obtener información de tickets
   const fetchTickets = async () => {
    if(!user || user.role === "user") return;
      const res = await fetch(`${backendUrl}/tickets/all`,{
        method: "GET",
        headers:{
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        }
      });
      if(!res.ok) {
        setAlert({open: true, message: "Error al obtener tickets", type: "error"});
        return;
      }
      const data = await res.json();
      setOpenTickets(data); 
    };

// Obtener información de productos
  const getProductsInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${backendUrl}/products/home`)

      if (response.ok) {
        setLoading(false)
        const data = await response.json();
        setProductsInfo(data)
      }
      else {
        console.log('ERROR AL OBTENER PRODUCTOS', response)
      }
    } catch (error) {
      console.log('ERROR AL OBTENER PRODUCTOS', error)
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getProductsInfo();
    fetchTickets();
  }, []);

    return (
      <div>
        {loading && <h2>Cargando productos...</h2>}
        {alert && <Alert
          open={alert.open}
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, open: false })} />}

          {productsInfo.bebidasTop.length > 0 && (
          <div className="border-black border-t-4 border-b-4 mb-4">
            <h2 className="font-bold text-3xl text-center m-2">Bebidas</h2>
            <BestProductsCarousel products={productsInfo.bebidasTop} />
          </div>
        )}
        {productsInfo.comidas.length > 0 && (
          <div className="lg:h-1/2 border-black border-t-4 border-b-4 mb-4">
            <h2 className="font-bold text-3xl text-center m-2">Comidas</h2>
            <BestProductsCarousel products={productsInfo.comidas} />
          </div>
        )}
        {productsInfo.combos.length > 0 && (
          <div className="border-black border-t-4 border-b-4 mb-4">
            <h2 className=" font-bold text-3xl text-center m-2">Combos especiales</h2>
            <BestProductsCarousel products={productsInfo.combos} />
          </div>
        )}
        
      </div>
    );
}   
export default Home;