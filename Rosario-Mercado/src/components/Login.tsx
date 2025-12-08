import { useState } from "react";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const setUser = useUserStore((state) => state.setUser); 
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("Submitting login form:", form);
        e.preventDefault();
        if(!form.email || !form.password) {
            alert("Faltan datos obligatorios");
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
                token: data.token
            });
            console.log("Login exitoso:", data);
            navigate("/");
        }
    };

    return (
        <div className="w-full flex justify-center mt-10">
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

                <button 
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    onClick={handleSubmit}
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}

export default Login;
