import { useEffect, useState } from "react";
import BestProductsCarousel from "../components/products/BestProductsCarousel";
import Loading from "../components/ui/Loading";
import Alert from "../components/ui/Alert";

/*setAlert({
  open: true,
  message: "Producto creado con éxito",
  type: "success",
});*/
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  imageId: string;
  userId: string;
  stock: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProductsInfo {
  bestSellers: Product[];
  combos: Product[];
  bebidasTop: Product[];
}


function Home() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [loading, setLoading] = useState<boolean>(false)
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "info" as "info" | "success" | "error",
    });

    const [productsInfo, setProductsInfo] = useState<ProductsInfo>({
  bestSellers: [],
  combos: [],
  bebidasTop: []
});


    const getProductsInfo = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${backendUrl}/products/home`)

            if(response.ok){
                setLoading(false)
                const data = await response.json();
                setProductsInfo(data)
            }
            else{
                console.log('ERROR AL OBTENER PRODUCTOS',response)
            }
        } catch (error) {
            console.log('ERROR AL OBTENER PRODUCTOS', error)
        }
        finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        getProductsInfo()
    }, []);

    return (
        <div>
              {loading && <Loading></Loading>}
    {alert && <Alert
  open={alert.open}
  message={alert.message}
  type={alert.type}
  onClose={() => setAlert({ ...alert, open: false })}/>}

            {productsInfo.bestSellers.length > 0 && (
                <div className="lg:h-1/2 border-black border-t-4 border-b-4 mb-4">
                <h2 className="font-bold text-3xl text-center m-2">Los mas vendidos</h2>
      <BestProductsCarousel products={productsInfo.bestSellers} />
      </div>
    )}
    {productsInfo.combos.length > 0 && (
                <div className="border-black border-t-4 border-b-4 mb-4">
                <h2 className=" font-bold text-3xl text-center m-2">Combos especiales</h2>
      <BestProductsCarousel products={productsInfo.combos} />
      </div>
    )}
    {productsInfo.bebidasTop.length > 0 && (
                <div className="border-black border-t-4 border-b-4 mb-4">
                <h2 className="font-bold text-3xl text-center m-2">Bebidas mas vendidas</h2>
      <BestProductsCarousel products={productsInfo.bebidasTop} />
      </div>
    )}
        </div>
    );
}   
export default Home;