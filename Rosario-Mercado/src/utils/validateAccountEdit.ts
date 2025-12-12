export interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  businessHours: string;
  whatsappAvailable: boolean;
  delivery: boolean;
}

// Recibe: form con los valores ingresados y editEnabled con qué campos están habilitados
export function validateEditAccountForm(
  form: Partial<FormData>,
  editEnabled: Partial<Record<keyof FormData, boolean>>
): string | null {
  // Solo validar campos cuyo checkbox "editar" está activado
  const fieldsToValidate = Object.keys(editEnabled).filter(
    (key) => editEnabled[key as keyof FormData]
  ) as (keyof FormData)[];

  if (fieldsToValidate.length === 0) {
    return "Debes habilitar y editar al menos un campo antes de guardar.";
  }

  if(!Object.keys(form).length) return "Debes editar al menos un campo antes de guardar"

  // VALIDACIONES
  for (const field of fieldsToValidate) {
    const value = form[field];

    if (field === "name" && typeof value === 'string' && value.length < 3) {
      return "El nombre debe tener al menos 3 caracteres.";
    }

    if (field === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
      return "Email inválido.";
    }

    if (field === "password" && typeof value === 'string' && value.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }

    if (field === "phoneNumber" && typeof value === 'string' && value.length < 6) {
      return "Número de teléfono inválido.";
    }
  }

  return null;
}
