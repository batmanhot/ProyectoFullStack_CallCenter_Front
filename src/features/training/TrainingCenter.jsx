import { useMemo, useState } from 'react';
import {
  Award, BookOpen, CheckCircle2, ChevronRight,
  Clock, GraduationCap, RotateCcw, XCircle,
} from 'lucide-react';

// ─── Category styles ──────────────────────────────────────────────────────────
const CAT_META = {
  Tecnico:   { cls: 'bg-orange-100 text-orange-700 border-orange-200',  dot: 'bg-orange-500'  },
  Comercial: { cls: 'bg-blue-100 text-blue-700 border-blue-200',        dot: 'bg-blue-500'    },
  Legal:     { cls: 'bg-slate-100 text-slate-600 border-slate-200',     dot: 'bg-slate-400'   },
};

const STATUS_META = {
  Completado: { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={14} /> },
  'En curso': { cls: 'bg-amber-100 text-amber-700 border-amber-200',       icon: <ChevronRight size={14} /> },
  Pendiente:  { cls: 'bg-slate-100 text-slate-500 border-slate-200',       icon: <Clock size={14} />        },
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function TrainingCenter({ modules, onSubmitAnswer }) {
  const [activeId,      setActiveId]      = useState(null);   // null = list view
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const activeModule = useMemo(
    () => modules.find(m => m.id === activeId) || null,
    [modules, activeId],
  );

  // ── Overall progress ──
  const progress = useMemo(() => {
    const done  = modules.filter(m => m.status === 'Completado').length;
    const total = modules.length;
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  }, [modules]);

  const openModule = m => {
    setActiveId(m.id);
    setSelectedAnswer(m.selectedAnswer || '');
  };

  const backToList = () => {
    setActiveId(null);
    setSelectedAnswer('');
  };

  const handleSubmit = () => {
    if (!activeModule || !selectedAnswer) return;
    onSubmitAnswer(activeModule.id, selectedAnswer);
    // Re-read updated feedback on next render — no need to setActiveId(null)
  };

  // ─────────────────────────────────────────────────────────────────────────
  // MODULE LIST VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (!activeModule) {
    return (
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Capacitación de Agentes</h2>
            <p className="text-slate-500 text-sm">
              Completa cada módulo, responde la evaluación y obtén tu certificación.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100">
            <Award className="text-blue-600" size={18} />
            <span className="text-sm font-bold text-blue-700">Nivel: Especialista Industrial</span>
          </div>
        </div>

        {/* Global progress card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-slate-600" />
              <span className="font-bold text-slate-700 text-sm">Tu progreso general</span>
            </div>
            <span className="text-sm font-black text-slate-800">
              {progress.done} / {progress.total} módulos completados
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-700"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            <span>Inicio</span>
            <span className={`${progress.pct === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
              {progress.pct}% completado
            </span>
            <span>Certificado</span>
          </div>
        </div>

        {/* How it works — quick guide for agents */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-4">
            ¿Cómo funciona?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Lee el módulo',   desc: 'Haz clic en un módulo para ver su contenido y descripción.', color: 'bg-blue-600'    },
              { step: '2', title: 'Responde la evaluación', desc: 'Selecciona la respuesta correcta a la pregunta de certificación.', color: 'bg-violet-600' },
              { step: '3', title: 'Obtén tu certificado', desc: 'Al completar todos los módulos se habilita tu certificación.', color: 'bg-emerald-600' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full ${s.color} text-white text-xs font-black flex items-center justify-center flex-shrink-0`}>
                  {s.step}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{s.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Completados',  value: modules.filter(m => m.status === 'Completado').length, cls: 'text-emerald-600' },
            { label: 'En curso',     value: modules.filter(m => m.status === 'En curso').length,   cls: 'text-amber-600'  },
            { label: 'Pendientes',   value: modules.filter(m => m.status === 'Pendiente').length,  cls: 'text-slate-500'  },
          ].map(k => (
            <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Module cards */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-4 flex items-center gap-2">
            <BookOpen size={12} /> Módulos disponibles
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(m => {
              const catMeta    = CAT_META[m.category]    || CAT_META.Legal;
              const statusMeta = STATUS_META[m.status]   || STATUS_META.Pendiente;
              const isComplete = m.status === 'Completado';
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => openModule(m)}
                  className={`text-left p-5 rounded-2xl border transition-all hover:shadow-md group ${
                    isComplete
                      ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {/* Top row: category + status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${catMeta.cls}`}>
                      {m.category}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusMeta.cls}`}>
                      {statusMeta.icon} {m.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-slate-800 text-sm mb-1.5 leading-snug group-hover:text-blue-700 transition-colors">
                    {m.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                    {m.description}
                  </p>

                  {/* Bottom row: duration + CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                      <Clock size={10} /> {m.duration}
                    </span>
                    <span className={`text-xs font-bold flex items-center gap-1 ${isComplete ? 'text-emerald-600' : 'text-blue-600'}`}>
                      {isComplete ? 'Ver detalle' : 'Iniciar'} <ChevronRight size={12} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate banner if all complete */}
        {progress.pct === 100 && (
          <div className="bg-emerald-600 rounded-2xl p-6 text-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Award size={40} className="text-emerald-200 flex-shrink-0" />
              <div>
                <p className="font-black text-lg">¡Felicitaciones! Completaste todos los módulos.</p>
                <p className="text-emerald-200 text-sm">Has obtenido la certificación de Especialista Industrial.</p>
              </div>
            </div>
            <CheckCircle2 size={32} className="text-emerald-300 flex-shrink-0" />
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MODULE DETAIL VIEW (single module open)
  // ─────────────────────────────────────────────────────────────────────────
  const catMeta    = CAT_META[activeModule.category]  || CAT_META.Legal;
  const isComplete = activeModule.status === 'Completado';
  const isWrong    = activeModule.feedback && activeModule.feedback.includes('incorrecta');
  const hasAnswered = !!activeModule.selectedAnswer;

  return (
    <div className="space-y-5">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={backToList}
          className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
        >
          ← Volver a módulos
        </button>
        <span className="text-slate-400">/</span>
        <span className="text-slate-500 truncate">{activeModule.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6 items-start">

        {/* Left: content */}
        <div className="space-y-4">

          {/* Module header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${catMeta.cls}`}>
                      {activeModule.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                      <Clock size={10} /> {activeModule.duration}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 text-lg leading-snug">{activeModule.title}</h3>
                </div>
              </div>
              {isComplete && <CheckCircle2 size={24} className="text-emerald-500 flex-shrink-0" />}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{activeModule.description}</p>
          </div>

          {/* What you'll learn */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.18em] mb-3">
              Lo que aprenderás en este módulo
            </p>
            <ul className="space-y-2">
              {[
                'Conceptos clave aplicados al sector industrial B2B',
                'Situaciones prácticas del trabajo diario como agente',
                'Protocolo correcto para actuar ante clientes y supervisores',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                  <CheckCircle2 size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: evaluation */}
        <div className="bg-slate-900 text-white rounded-2xl overflow-hidden shadow-xl">

          {/* Panel header */}
          <div className="px-5 py-4 border-b border-slate-700 flex items-center gap-2">
            <GraduationCap size={16} className="text-blue-400" />
            <span className="font-bold text-sm">Evaluación del módulo</span>
          </div>

          <div className="p-5 space-y-4">

            {/* Instruction */}
            <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Instrucción
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Lee la pregunta y selecciona la respuesta correcta. Solo se permite un intento por sesión para respuestas incorrectas.
              </p>
            </div>

            {/* Question */}
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">
                Pregunta de certificación
              </p>
              <p className="text-sm font-medium text-white leading-relaxed">
                {activeModule.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {activeModule.options.map((option, i) => {
                const isSelected = selectedAnswer === option;
                const isCorrect  = hasAnswered && option === activeModule.correctAnswer && isComplete;
                const isWrongSel = hasAnswered && isSelected && isWrong;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => !hasAnswered && setSelectedAnswer(option)}
                    disabled={hasAnswered}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                      isCorrect   ? 'bg-emerald-600 border-emerald-500 text-white'           :
                      isWrongSel  ? 'bg-red-600/40 border-red-500 text-red-200'              :
                      isSelected  ? 'bg-blue-600 border-blue-500 text-white'                 :
                      hasAnswered ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' :
                                    'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600 cursor-pointer'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                      isSelected || isCorrect ? 'border-white bg-white/20' : 'border-slate-600'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isCorrect  && <CheckCircle2 size={15} className="text-white flex-shrink-0" />}
                    {isWrongSel && <XCircle size={15} className="text-red-300 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {activeModule.feedback && (
              <div className={`rounded-xl p-3 border text-xs font-medium ${
                isComplete
                  ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-red-600/20 border-red-500/40 text-red-300'
              }`}>
                {isComplete ? <CheckCircle2 size={13} className="inline mr-1.5" /> : <XCircle size={13} className="inline mr-1.5" />}
                {activeModule.feedback}
              </div>
            )}

            {/* Actions */}
            {!hasAnswered ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all"
              >
                Enviar respuesta
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={backToList}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-sm transition-all"
                >
                  Volver a módulos
                </button>
                {!isComplete && (
                  <button
                    type="button"
                    onClick={() => { setSelectedAnswer(''); }}
                    className="py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-bold text-sm transition-all"
                    title="Reintentar"
                  >
                    <RotateCcw size={15} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
