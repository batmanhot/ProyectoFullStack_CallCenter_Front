
// Datos maestros simulados para el call center B2B

export const clients = [
  {
    id: 1,
    company: "Minera Andina S.A.",
    contact: "Carlos Pérez",
    email: "c.perez@andina.com",
    phone: "+51 999 111 222",
    status: "Activo",
  },
  {
    id: 2,
    company: "Metalúrgica del Sur",
    contact: "Lucía Torres",
    email: "l.torres@metalurgica.com",
    phone: "+51 988 333 444",
    status: "Prospecto",
  },
];

export const products = [
  { id: 1, name: "Planchas de metal", price: 1200 },
  { id: 2, name: "Carbón para motores", price: 800 },
];

export const agents = [
  { id: 1, name: "Juan Ramírez", role: "Agente" },
  { id: 2, name: "María López", role: "Supervisor" },
];

export const campaigns = [
  { id: 1, name: "Campaña Q1 - Minería", status: "Activa" },
  { id: 2, name: "Campaña Q2 - Industria", status: "Planificada" },
];
