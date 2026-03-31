// ─── Datos Maestros — Ecosistema Integral CallCenter B2B ─────────────────────
// Fuente única de verdad. App.jsx usa estos registros como seeds de localStorage.

export const DATA = {

  // ── Productos ────────────────────────────────────────────────────────────────
  // Incluye todos los campos que ProductManager necesita (category, sku, description, active)
  products: [
    { id: 1, name: 'Planchas de Metal A4',   price: 1200, unit: 'Tonelada',  category: 'Metales',     sku: 'PROD-001', description: 'Planchas de acero A4 con tratamiento anticorrosivo grado 4. Aplicación en minería e industria pesada.', active: true },
    { id: 2, name: 'Carbón para Motores',    price:  450, unit: 'Saco 50kg', category: 'Combustibles', sku: 'PROD-002', description: 'Carbón mineral de alta pureza para motores industriales y generadores.', active: true },
    { id: 3, name: 'Válvulas Hidráulicas',   price:  850, unit: 'Unidad',    category: 'Hidráulica',   sku: 'PROD-003', description: 'Válvulas de alta presión para sistemas hidráulicos industriales.', active: true },
  ],

  // ── Clientes B2B ─────────────────────────────────────────────────────────────
  clients: [
    {
      id: 1,
      name:     'Minera del Norte S.A.',
      sector:   'Mineria',
      contact:  'John Doe',
      phone:    '555-0101',
      email:    'jdoe@minera.com',
      position: 'Gerente de Compras',
      status:   'Prospeccion',
      contacts: [
        { id: 101, name: 'John Doe',    position: 'Gerente de Compras',    phone: '555-0101', email: 'jdoe@minera.com'    },
        { id: 102, name: 'Marta Gomez', position: 'Jefa de Mantenimiento', phone: '555-0124', email: 'mgomez@minera.com'  },
      ],
    },
    {
      id: 2,
      name:     'Aceros Industriales',
      sector:   'Fabrica',
      contact:  'Pedro Luis',
      phone:    '555-0200',
      email:    'pluis@aceros.lat',
      position: 'Director de Planta',
      status:   'Cotizacion',
      contacts: [
        { id: 103, name: 'Pedro Luis', position: 'Director de Planta', phone: '555-0200', email: 'pluis@aceros.lat' },
      ],
    },
    {
      id: 3,
      name:     'Válvulas del Sur S.A.C.',
      sector:   'Mineria',
      contact:  'Carmen Rios',
      phone:    '555-0310',
      email:    'crios@valvulassur.pe',
      position: 'Gerente General',
      status:   'Cliente',
      contacts: [
        { id: 104, name: 'Carmen Rios',  position: 'Gerente General',   phone: '555-0310', email: 'crios@valvulassur.pe'  },
        { id: 105, name: 'Luis Paredes', position: 'Jefe de Logística', phone: '555-0311', email: 'lparedes@valvulassur.pe' },
      ],
    },
  ],

  // ── Agentes y Supervisores ───────────────────────────────────────────────────
  agents: [
    { id: 'AGT-01', name: 'Ana Garcia',    role: 'Agente',     campaigns: ['CMP-001'] },
    { id: 'AGT-02', name: 'Carlos Ruiz',   role: 'Agente',     campaigns: ['CMP-001', 'CMP-002'] },
    { id: 'AGT-03', name: 'Luis Torres',   role: 'Agente',     campaigns: ['CMP-002'] },
    { id: 'SUP-01', name: 'Marta Salinas', role: 'Supervisor', campaigns: [] },
  ],

  // ── Matriz de KPIs — Sección 5 del documento ────────────────────────────────
  kpis: [
    { id: 'kpi-conversion',    category: 'Ventas',        label: 'Tasa de Conversión',          value: '24%',      formula: 'Oportunidades cerradas / oportunidades totales',    description: 'Cotizaciones aprobadas vs total generadas' },
    { id: 'kpi-effective-calls',category:'Productividad', label: 'Llamadas Efectivas por Agente',value: '68%',      formula: 'Llamadas con contacto / total llamadas',             description: 'Ratio de contacto efectivo sobre marcaciones' },
    { id: 'kpi-closing-time',  category: 'Tiempo',        label: 'Tiempo Promedio de Cierre',   value: '14 días',  formula: 'Días desde contacto inicial hasta cierre',           description: 'Media de días en ciclo de venta completo' },
    { id: 'kpi-total-sales',   category: 'Financiero',    label: 'Valor Total de Ventas',       value: '$124,500', formula: 'Suma de montos de cotizaciones cerradas (APROBADA)',  description: 'Monto acumulado de cierres en el período' },
    { id: 'kpi-quote-approval',category: 'Calidad',       label: 'Cotizaciones Aprobadas',      value: '72%',      formula: 'Cotizaciones aprobadas / cotizaciones enviadas',      description: 'Tasa de aprobación en flujo de supervisión' },
  ],

  // ── Etapas del pipeline de oportunidades ────────────────────────────────────
  opportunityStages: [
    { id: 'PROSPECCION', label: 'Prospección',      color: 'blue',   order: 1 },
    { id: 'CONTACTO',    label: 'Contacto Inicial', color: 'purple', order: 2 },
    { id: 'COTIZACION',  label: 'Cotización',       color: 'amber',  order: 3 },
    { id: 'NEGOCIACION', label: 'Negociación',      color: 'teal',   order: 4 },
    { id: 'CIERRE',      label: 'Cierre',           color: 'green',  order: 5 },
    { id: 'PERDIDO',     label: 'Perdido',          color: 'red',    order: 6 },
  ],  
};

// ==================== NUEVA SECCIÓN: CONFIGURACIÓN DE LLAMADAS ====================

export const CALL_CONFIG = {
  channels: [
    { id: 'analog', label: 'Teléfono Análogo', icon: '📞' },
    { id: 'cell', label: 'Celular', icon: '📱' },
    { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
    { id: 'facebook', label: 'Facebook Messenger', icon: '📘' },
    { id: 'email', label: 'Email', icon: '✉️' },
    { id: 'other', label: 'Otro', icon: '🌐' },
  ],

  callStatuses: [
    { id: 'interested', label: 'Atendida - Interesado', color: 'bg-green-500', icon: '✅' },
    { id: 'followup', label: 'Atendida - Seguimiento', color: 'bg-blue-500', icon: '📅' },
    { id: 'quote', label: 'Atendida - Cotizar', color: 'bg-orange-500', icon: '📋' },
    { id: 'no_answer', label: 'No contestó', color: 'bg-yellow-500', icon: '📳' },
    { id: 'voicemail', label: 'Buzón / Mensaje enviado', color: 'bg-gray-500', icon: '📨' },
    { id: 'not_interested', label: 'No interesado', color: 'bg-red-500', icon: '❌' },
    { id: 'closed_sale', label: 'Venta Cerrada', color: 'bg-emerald-600', icon: '💰' },
  ]
};