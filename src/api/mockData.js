// src/api/mockData.js

// Definición de Roles según el documento (Control Institucional)
export const ROLES = {
  AGENT: 'agente',
  SUPERVISOR: 'supervisor'
};

// Usuario actual simulado (Cambia esto para probar flujos)
export const currentUser = {
  id: 1,
  name: 'Ana García',
  role: ROLES.AGENT // Cambiar a SUPERVISOR para probar aprobaciones
};

// Datos Maestros de Productos (Punto 5 del PDF)
export const industrialProducts = [
  { id: 'PROD01', name: 'Planchas de Metal - A4', price: 150.00 },
  { id: 'PROD02', name: 'Carbón para Motores Industriales', price: 85.50 },
  { id: 'PROD03', name: 'Válvulas Hidráulicas de Alta Presión', price: 310.00 }
];

// CRM B2B: Jerarquía Empresa -> Contacto Clave (Punto 5 del PDF)
export const b2bClients = [
  {
    id: 1,
    companyName: 'Minera del Norte S.A.',
    sector: 'Minería',
    contacts: [
      { id: 101, name: 'John Doe', position: 'Gerente de Compras', phone: '555-0123', email: 'jdoe@minera.com' },
      { id: 102, name: 'Marta Gómez', position: 'Jefa de Mantenimiento', phone: '555-0124', email: 'mgomez@minera.com' }
    ],
    status: 'Oportunidad'
  },
  {
    id: 2,
    companyName: 'Aceros Industriales Latam',
    sector: 'Fábrica/Metalúrgica',
    contacts: [
      { id: 103, name: 'Pedro Luis', position: 'Director de Planta', phone: '555-0200', email: 'pluis@aceros.lat' }
    ],
    status: 'Cliente'
  }
];

// Workflow de Cotizaciones (Punto 3 del PDF)
export const quoteStatuses = {
  DRAFT: 'BORRADOR',
  PENDING: 'PENDIENTE_APROBACION',
  APPROVED: 'APROBADA',
  REJECTED: 'RECHAZADA'
};

export const currentQuotes = [
  {
    id: 'COT001',
    companyId: 1,
    contactId: 101,
    products: [{ productId: 'PROD01', quantity: 50 }],
    total: 7500.00,
    status: quoteStatuses.PENDING, // Esta requiere acción del supervisor
    createdBy: 1, // ID del Agente Ana García
  },
  {
    id: 'COT002',
    companyId: 2,
    contactId: 103,
    products: [{ productId: 'PROD03', quantity: 10 }],
    total: 3100.00,
    status: quoteStatuses.APPROVED,
    createdBy: 1,
  }
];