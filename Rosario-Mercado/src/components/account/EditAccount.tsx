import React, { useState } from "react";
import { useUserStore } from "../../store/userStore";
import type { FormData } from "../../utils/validateAccountEdit";
import { validateEditAccountForm } from "../../utils/validateAccountEdit";
import { Button } from "../ui/Button";
import Alert from "../ui/Alert";
import Loading from "../ui/Loading";



export default function EditAccount() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const user = useUserStore((state) => state.user);
    const [loading, setLoading] = useState<boolean>(false)
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "info" as "info" | "success" | "error",
    });


    const [form, setForm] = useState<Partial<FormData>>({});
    const [error, setError] = useState("");
    const setUser = useUserStore((state) => state.setUser);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const target = e.target;

        const { name, value } = target;

        // Si es un input checkbox, tomamos target.checked
        const newValue =
            target instanceof HTMLInputElement && target.type === "checkbox"
                ? target.checked
                : value;

        setForm((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setLoading(true)

            const validationError = validateEditAccountForm(form, editEnabled);
            if (validationError) {
                setError(validationError);
                setLoading(false)
                return;
            }
            setError("");
            console.log(user?.token)

            const response = await fetch(`${backendUrl}/users/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`,
                },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (response.ok) {
                setLoading(false)
                setAlert({
                    open: true,
                    message: "La información de la cuenta fue actualizada con éxito.",
                    type: "success",
                });
                setForm({})
                setEditEnabled({
                    name: false,
                    email: false,
                    phoneNumber: false,
                    businessHours: false,
                    whatsappAvailable: false,
                    delivery: false,
                });
                setUser({
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.name,
                    token: data.token,
                    whatsappAvailable: data.user.whatsappAvailable,
                    delivery: data.user.delivery,
                    phoneNumber: data.user.phoneNumber || undefined,
                    businessHours: data.user.businessHours || undefined,
                    address: data.user.address || undefined
                });
            }
            else{
                setLoading(false);
                setAlert({
                    open: true,
                    message: "Error al actualizar la información de la cuenta: " + data.message,
                    type: "error",
                });
            }

        } catch (error) {
            console.log(error)
            setLoading(false)
            setAlert({
                open: true,
                message: "Error al actualizar la información de la cuenta:" + error,
                type: "error",
            });
        }
        finally { setLoading(false) }

    };

    // === NUEVO: estado para checkboxes de edición ===
    const [editEnabled, setEditEnabled] = useState({
        name: false,
        email: false,
        phoneNumber: false,
        businessHours: false,
        whatsappAvailable: false,
        delivery: false,
    });

    const handleToggleEdit = (field: keyof FormData) => {
        setEditEnabled((prev: any) => ({ ...prev, [field]: !prev[field] }));
        delete form[field]
    };

  return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 w-full max-w-md mx-auto">
          {loading && <Loading></Loading>}
          {alert && <Alert
              open={alert.open}
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert({ ...alert, open: false })} />}
          <h2 className="text-xl font-semibold text-center">Editar cuenta</h2>
          { !user?.businessHours || !user?.phoneNumber ? 
            <h3 className="border-2 border-red-500 p-2 rounded-2xl">Para usuarios vendedores recomendamos completar la información remarcada en rojo.</h3>
          : ""}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <label className="flex items-center gap-2">
              <input type="checkbox" checked={editEnabled.name} onChange={() => handleToggleEdit("name")} />
              Editar nombre
          </label>
          <input
              type="text"
              value={form.name ?? ""}
              name="name"
              placeholder={user?.name}
              onChange={handleChange}
              className="border p-2 rounded"
              disabled={!editEnabled.name}
          />
          <div className="w- border border-black"></div>

          <label className="flex items-center gap-2">
              <input type="checkbox" checked={editEnabled.email} onChange={() => handleToggleEdit("email")} />
              Editar email
          </label>
          <input
              type="email"
              name="email"
              value={form.email ?? ""}
              placeholder={user?.email}
              onChange={handleChange}
              className="border p-2 rounded"
              disabled={!editEnabled.email}
          />
          <div className="w- border border-black"></div>

          <label className="flex items-center gap-2">
              <input type="checkbox" 
                
                checked={editEnabled.phoneNumber} onChange={() => handleToggleEdit("phoneNumber")} />
              Editar número de teléfono
          </label>
          <input
              type="text"
              name="phoneNumber"
              className={user?.phoneNumber ? "border p-2 rounded" : "border-red-500 border p-2 rounded"}
              value={form.phoneNumber ?? ""}
              placeholder={user?.phoneNumber || "Número de eléfono"}
              onChange={handleChange}
              disabled={!editEnabled.phoneNumber}
          />
          <div className="w- border border-black"></div>

          <label className="flex items-center gap-2">
              <input type="checkbox" 
                checked={editEnabled.businessHours} onChange={() => handleToggleEdit("businessHours")} />
              Editar horario de atención
          </label>
          <input
              type="text"
              name="businessHours"
              value={form.businessHours ?? ""}
              className={user?.businessHours ? "border p-2 rounded" : "border-red-500 border p-2 rounded"}
              placeholder={user?.businessHours || "Horario de atención"}
              onChange={handleChange}
              disabled={!editEnabled.businessHours}
          />
          <div className="w- border border-black"></div>

          <label className="flex items-center gap-2">
              <input type="checkbox" checked={editEnabled.whatsappAvailable} onChange={() => handleToggleEdit("whatsappAvailable")} />
              Editar disponibilidad en WhatsApp
          </label>
          <label className="flex items-center gap-2">
              <input
                  type="checkbox"
                  name="whatsappAvailable"
                  checked={form.whatsappAvailable ?? false}
                  onChange={handleChange}
                  disabled={!editEnabled.whatsappAvailable}

              />
              Disponible en WhatsApp
          </label>
          <div className="w- border border-black"></div>

          <label className="flex items-center gap-2">
              <input type="checkbox" checked={editEnabled.delivery} onChange={() => handleToggleEdit("delivery")} />
              Editar disponibilidad de delivery
          </label>
          <label className="flex items-center gap-2">
              <input
                  type="checkbox"
                  name="delivery"
                  checked={form.delivery ?? false}
                  onChange={handleChange}
                  disabled={!editEnabled.delivery}
              />
              Ofrece delivery
          </label>

          <Button
              type="submit"
              onClick={handleSubmit}

          >
              Guardar cambios
          </Button>
      </form>
  );
}
