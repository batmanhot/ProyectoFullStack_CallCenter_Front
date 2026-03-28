export const DATA = {
  products: [
    { id: 1, name: 'Planchas de Metal A4', price: 1200, unit: 'Tonelada' },
    { id: 2, name: 'Carbón para Motores', price: 450, unit: 'Saco 50kg' },
    { id: 3, name: 'Válvulas Hidráulicas', price: 850, unit: 'Unidad' }
  ],
  clients: [
    { 
      id: 1, 
      name: 'Minera del Norte S.A.', 
      sector: 'Minería', 
      contact: 'John Doe', 
      phone: '555-0101',
      status: 'Prospección' // [cite: 56, 16]
    },
    { 
      id: 2, 
      name: 'Aceros Industriales', 
      sector: 'Fábrica', 
      contact: 'Marta Gómez', 
      phone: '555-0202',
      status: 'Cotización' 
    }
  ],
  kpis: [
    { label: 'Tasa de Conversión', value: '24%', formula: 'Oportunidades cerradas / totales' }, // [cite: 62]
    { label: 'Llamadas Efectivas', value: '68%', formula: 'Contacto / total llamadas' }, // [cite: 62]
    { label: 'Valor Total Ventas', value: '$124,500', formula: 'Suma de montos cerrados' } // [cite: 62]
  ]
};