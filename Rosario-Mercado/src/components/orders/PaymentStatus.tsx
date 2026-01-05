import { useParams } from "react-router-dom";
import React from "react"
import { useCartStore } from "../../store/cartStore";

export const PaymentStatus: React.FC = () => {

    const {clearCart} = useCartStore();

    const { status } = useParams<{ status: string }>();
    if(status === "success") clearCart();

    return(
        <div className="text-center text-3xl font-bold mt-20">
            { status === "success" && <h1>Orden completada. Puedes contactar al vendedor para consultar por el envío.</h1> }
            { status === "failure" && <h1>Fallo al completar la orden. Puedes reintentar el pago si deseas completar el pedido.</h1> }
            { status === "pending" && <h1>Orden pendiente de pago. En tus notificaciones tienes el enlace para realizar el pago.</h1> }
        </div>
    )
}