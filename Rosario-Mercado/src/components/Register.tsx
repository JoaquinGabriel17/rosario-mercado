import { useState } from "react";

function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Datos de registro:", form);
        // acá hacés el fetch/axios al endpoint /register
    };

    return (
        <div className="w-full flex justify-center mt-10">
            <form 
                onSubmit={handleSubmit} 
                className="flex flex-col gap-4 p-6 rounded-xl shadow-md w-80"
            >
                <h2 className="text-xl font-bold text-center">Crear cuenta</h2>

                <input
                    type="text"
                    name="username"
                    placeholder="Usuario"
                    value={form.username}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="border p-2 rounded"
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
                    className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
}

export default Register;
