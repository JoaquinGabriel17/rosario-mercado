export const validateRegister = (form: {
    name: string;
    email: string;
    password: string;
}) => {

    const errors: Partial<typeof form> = {};

    // Username
    if (!form.name.trim()) {
        errors.name = "El nombre de usuario es obligatorio";
    } else if (form.name.length < 3) {
        errors.name = "Debe tener al menos 3 caracteres";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.name)) {
        errors.name = "Solo letras, números y guiones bajos";
    }

    // Email
    if (!form.email.trim()) {
        errors.email = "El email es obligatorio";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
        errors.email = "Formato de email inválido";
    }

    // Password
    if (!form.password) {
        errors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 3) {
        errors.password = "Debe tener al menos 3 caracteres";
    }

    return errors;
};
