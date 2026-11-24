/** Datos de la tienda: ajústalos a tu negocio. */
export const storeConfig = {
  name: 'Tienda Pablo',
  slogan: 'Compra fácil, reporta tu pago y listo.',
  locale: 'es-VE',
  currency: 'USD',
  paymentInstructions: [
    'Realiza el pago por transferencia o pago móvil a los datos de la tienda.',
    'Guarda el número de referencia que te da tu banco.',
    'Toma una foto o captura del comprobante y adjúntala en el formulario.',
    'Revisaremos tu pago y te confirmaremos por correo.',
  ],
} as const
