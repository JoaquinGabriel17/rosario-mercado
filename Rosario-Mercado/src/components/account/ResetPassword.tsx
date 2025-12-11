// src/pages/ResetPassword.tsx
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "../ui/Button";
import Alert from "../ui/Alert";
import Loading from "../ui/Loading";

const backendUrl = import.meta.env.VITE_BACKEND_URL;



const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState<boolean>(false)
 const [alert, setAlert] = useState({
  open: false,
  message: "",
  type: "info" as "info" | "success" | "error",
});


  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true)

    if(!password || !confirmPassword) {
        setLoading(false)
        setAlert({
  open: true,
  message: "Debe completar todos los campos para continuar",
  type: "error",
});
return;
    }

    if(password !== confirmPassword){
        setLoading(false)
        setAlert({
            open: true,
            message: "Las contraseñas ingresadas no coinciden, deben coincidir",
            type: "error"
        })
        return;
    }

    const res = await fetch(`${backendUrl}/users/resetPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    console.log(data);
    if(res.ok){
        setLoading(false)
        setAlert({
            open: true,
            message: "Contraseña actualizada correctamente",
            type: "success"
        })
    }
    else{
        setLoading(false)
        setAlert({
            open: true,
            message: `Error al actualizar contraseña: ${data.message}`,
            type: "error"
        })
        
    }
    
  };

  if (!token) return <h2>Token inválido</h2>;
  return (
    <div className="flex flex-col items-center mt-20">
        
  {loading && <Loading></Loading>}
    {alert && <Alert
  open={alert.open}
  message={alert.message}
  type={alert.type}
  onClose={() => setAlert({ ...alert, open: false })}/>}
      <h1 className="text-2xl">Restablecer contraseña</h1>

      <form 
        className="flex flex-col gap-4 p-6 rounded-xl shadow-md w-80"
        onSubmit={handleSubmit}>
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Nueva contraseña"
          onChange={e => setPassword(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Confirmar nueva contraseña"
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <Button type="submit">Cambiar contraseña</Button>
      </form>
    </div>
  );
};

export default ResetPassword;
