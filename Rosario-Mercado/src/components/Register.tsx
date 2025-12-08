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
        <div className="auth-container">
            <form 
                onSubmit={handleSubmit} 
                className="auth-form"
            >
                <h2 className="auth-title">Crear cuenta</h2>

                <input
                    type="text"
                    name="username"
                    placeholder="Usuario"
                    value={form.username}
                    onChange={handleChange}
                    className="auth-input"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="auth-input"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    className="auth-input"
                    required
                />

                <button 
                    type="submit"
                    className="auth-btn"
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
}

export default Register;
