import { useState } from "react";
import { validateRegister } from "../utils/validateRegister";

type RegisterErrors = {
    name?: string;
    email?: string;
    password?: string;
};



function Register( { onChange }: { onChange: () => void } ) {

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
        
        const validation = validateRegister(form);

    if (Object.keys(validation).length > 0) {
        setErrors(validation);
        return; // ❌ no enviar si hay errores
    }
        const res = await fetch(`${backendUrl}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        if(res.ok){
            alert("Usuario creado con éxito");
            setForm({ name: "", email: "", password: "" });
            setErrors({});
            onChange();
        }
        else{
            const data = await res.json();
            alert(`Error: ${data.message}`);
        }


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
