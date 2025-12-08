import { useState } from "react";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Datos de login:", form);
        // acá hacés el fetch/axios a tu backend
    };

    return (
        <div className="auth-container">
            <form 
                onSubmit={handleSubmit} 
                className="auth-form"
            >
                <h2 className="auth-title">Iniciar sesión</h2>

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
                    Entrar
                </button>
            </form>
        </div>
    );
}

export default Login;
