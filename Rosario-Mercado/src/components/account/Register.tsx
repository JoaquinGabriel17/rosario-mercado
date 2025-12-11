import { useState } from "react";
import { validateRegister } from "../../utils/validateRegister";
import Alert from "../ui/Alert";
import Loading from "../ui/Loading";

type RegisterErrors = {
    name?: string;
    email?: string;
    password?: string;
};



function Register( { onChange }: { onChange: () => void } ) {

    const [loading, setLoading] = useState<boolean>(false)
 const [alert, setAlert] = useState({
  open: false,
  message: "",
  type: "info" as "info" | "success" | "error",
});

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [errors, setErrors] = useState<RegisterErrors>({});
    
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange =  (e: React.ChangeEvent<HTMLInputElement>) => {

        const updated = { ...form, [e.target.name]: e.target.value };
        setForm(updated);
        setErrors(validateRegister(updated));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const validation = validateRegister(form);

    if (Object.keys(validation).length > 0) {
        setErrors(validation);
        setLoading(false)
        return; // ❌ no enviar si hay errores
    }
        const res = await fetch(`${backendUrl}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        if(res.ok){
            setLoading(false)
setAlert({
  open: true,
  message: "Usuario creado con éxito",
  type: "success",
});
            setForm({ name: "", email: "", password: "" });
            setErrors({});
            onChange();
        }
        else{
            const data = await res.json();
            setLoading(false)
setAlert({
  open: true,
  message: `Error al crear usuario: ${data.message}`,
  type: "error",
});
        }

    };

    return (
        <div className="w-full flex justify-center mt-10">
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
                <h2 className="text-xl font-bold text-center">Crear cuenta</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Usuario"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
                {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                 {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                )}

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                )}

                <button 
                    type="submit"
                    className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
}

export default Register;
