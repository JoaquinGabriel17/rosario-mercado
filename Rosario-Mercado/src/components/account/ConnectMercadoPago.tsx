
const ConnectMercadoPago = () => {
  // Configuración
  const APP_ID = import.meta.env.VITE_MP_APP_ID;
  const REDIRECT_URI = import.meta.env.VITE_MP_REDIRECT_URI;
  // Genera un string aleatorio para seguridad (CSRF protection)
  const STATE = "pasando-me-la-me-huevos";

  console.log(`https://auth.mercadopago.com.ar/authorization?client_id=${APP_ID}&response_type=code&platform_id=mp&state=${STATE}&redirect_uri=${REDIRECT_URI}`)

  const handleLink = () => {
    const url = `https://auth.mercadopago.com.ar/authorization?client_id=${APP_ID}&response_type=code&platform_id=mp&state=${STATE}&redirect_uri=${REDIRECT_URI}`;

    window.location.href = url;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl border border-gray-200 mt-10">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
          Configuración de Pagos
        </div>
        <h2 className="block mt-1 text-lg leading-tight font-medium text-black">
          Vincula tu cuenta para recibir cobros
        </h2>
        <p className="mt-2 text-gray-500">
          Para poder ofrecer los métodos de pago de Mercado Pago en nuestra plataforma, necesitamos que autorices a 
          Mercado Pago para procesar los pagos en tu nombre. El dinero irá directamente 
          a tu cuenta.
        </p>
        
        <div className="mt-6">
          <button
            onClick={handleLink}
            className="bg-[#009EE3] hover:bg-[#007eb5] text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors"
          >
            {/* Icono MP simple */}
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
               <path d="M14.66 12.87l-1.04-3.89 3.25-2.76-4.24-.36L10.8 2 8.97 5.86l-4.24.36 3.25 2.76-1.04 3.89L10.8 10.6l3.86 2.27z" /> 
            </svg>
            Conectar con Mercado Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectMercadoPago;