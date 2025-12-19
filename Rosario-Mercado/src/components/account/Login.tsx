import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import Loading from "../ui/Loading";
import Alert from "../ui/Alert";
import { Button } from "../ui/Button";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState<boolean>(false)
 const [alert, setAlert] = useState({
  open: false,
  message: "",
  type: "info" as "info" | "success" | "error",
});

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const setUser = useUserStore((state) => state.setUser); 
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            setLoading(true)
            e.preventDefault();
        if(!form.email || !form.password) {
            setLoading(false)
setAlert({
  open: true,
  message: "Faltan datos obligatorios",
  type: "error",
});
            return;
        }
        
        const res = await fetch(`${backendUrl}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (res.ok) {
            setUser({
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                token: data.token,
                whatsappAvailable: data.user.whatsappAvailable,
                delivery: data.user.delivery,
                phoneNumber: data.user.phoneNumber || undefined,
                businessHours: data.user.businessHours || undefined,
                address: data.user.address || undefined,
                facebookUrl: data.user.facebookUrl || undefined,
                instagramUrl: data.user.instagramUrl || undefined,
                role: data.user.role || "user",
            });
            setLoading(false)
            navigate("/");
        }
        else{
           setLoading(false)
setAlert({
  open: true,
  message: "Error al iniciar sesión",
  type: "error",
});
return;
        }
        } catch (error) {
            setLoading(false)
setAlert({
  open: true,
  message: "Error al iniciar sesión",
  type: "error",
});
return;
        }
        finally{
            setLoading(false);
        }
        
    };

    

    return (
        <div className="w-full flex flex-col items-center justify-center mt-10">
            {loading && <Loading></Loading>}
    {alert && <Alert
  open={alert.open}
  message={alert.message}
  type={alert.type}
  onClose={() => setAlert({ ...alert, open: false })}/>}
            <form 
                onSubmit={handleSubmit} 
                className="flex flex-col gap-4 p-6 rounded-xl shadow-md w-80"
            >
                <h2 className="text-xl font-bold text-center">Iniciar sesión</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <Button 
                    type="submit"
                    onClick={handleSubmit}
                >
                    Entrar
                </Button>
            </form>
            <a className="mt-8 cursor-pointer text-blue-700"
            onClick={() => navigate("/forgot-password")}
            >¿Olvidaste tu contraseña? Haz click aquí para restablecerla.</a>
        </div>
    );
}

export default Login;
