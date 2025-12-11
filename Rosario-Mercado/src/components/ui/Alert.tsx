// src/components/ui/Alert.tsx
import React from "react";

interface AlertProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "info" | "success" | "error";
}

const Alert: React.FC<AlertProps> = ({
  open,
  onClose,
  title = "Aviso",
  message,
  type = "info",
}) => {
  if (!open) return null;

  const colors = {
    info: "border-blue-500",
    success: "border-green-500",
    error: "border-red-500",
  };

 /* // Para mostrar uno:
 import Loading from "../ui/Loading";
import Alert from "../ui/Alert";

const [loading, setLoading] = useState<boolean>(false)
 const [alert, setAlert] = useState({
  open: false,
  message: "",
  type: "info" as "info" | "success" | "error",
});

setLoading(false)
setAlert({
  open: true,
  message: "Producto creado con éxito",
  type: "success",
});


  {loading && <Loading></Loading>}
    {alert && <Alert
  open={alert.open}
  message={alert.message}
  type={alert.type}
  onClose={() => setAlert({ ...alert, open: false })}/>}

  
*/
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-100 px-4">
      <div
        className={`bg-white rounded-xl shadow-lg p-5 w-full max-w-sm border-l-8 ${colors[type]}`}
      >
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-700 mb-4">{message}</p>

        <button
          onClick={onClose}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg active:scale-95 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Alert;
