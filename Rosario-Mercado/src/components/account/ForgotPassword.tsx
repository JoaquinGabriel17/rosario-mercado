import { useState } from "react";
import Alert from "../ui/Alert";
import Loading from "../ui/Loading";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false)
 const [alert, setAlert] = useState({
  open: false,
  message: "",
  type: "info" as "info" | "success" | "error",
});
    const backendUrl = import.meta.env.VITE_BACKEND_URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if(!email){
        setLoading(false)
        setAlert({
  open: true,
  message: "Debe ingresar el e-mail con el que registró la cuenta",
  type: "error",
})
    }

    try {
      const res = await fetch(`${backendUrl}/users/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false)
        setAlert({
  open: true,
  message: data.message || "Error al enviar el correo",
  type: "error",
})
        
      } else {
        setLoading(false)
        setAlert({
  open: true,
  message: "Te enviamos un correo con instrucciones para restablecer la contraseña",
  type: "success",
})
    setEmail("")
    navigate("/auth")
      }
    } catch (err) {
        setLoading(false)
      setAlert({
  open: true,
  message: "Error al enviar correo",
  type: "error",
})
console.log(err)
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center text-center justify-center h-screen">
         {loading && <Loading></Loading>}
    {alert && <Alert
  open={alert.open}
  message={alert.message}
  type={alert.type}
  onClose={() => setAlert({ ...alert, open: false })}/>}
        <Button className="absolute top-5 left-5" onClick={() => navigate("/auth")} >Volver</Button>
      <form onSubmit={handleSubmit}
            className=" flex flex-col gap-4 p-6 rounded-xl shadow-md w-80"

      >
        <label className="text-2xl mb-6" >Ingresa el e-mail con el que registraste la cuenta</label>
        <input
          type="email"
          placeholder="Ingresá tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
          
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar instrucciones"}
        </Button>
      </form>

    </div>
  );
};


export default ForgotPassword;
