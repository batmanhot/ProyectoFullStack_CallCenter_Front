import { useMemo, useState } from 'react';
import { Award, BookOpen, CheckCircle, GraduationCap, PlayCircle } from 'lucide-react';

export default function TrainingCenter({ modules, onSubmitAnswer }) {
  const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id || 0);
  const selectedModule = useMemo(() => modules.find((module) => module.id === selectedModuleId) || modules[0], [modules, selectedModuleId]);
  const [selectedAnswer, setSelectedAnswer] = useState(selectedModule?.selectedAnswer || '');

  const handleSelectModule = (module) => {
    setSelectedModuleId(module.id);
    setSelectedAnswer(module.selectedAnswer || '');
  };

  const handleSubmit = () => {
    if (!selectedModule || !selectedAnswer) return;
    onSubmitAnswer(selectedModule.id, selectedAnswer);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Capacitacion de Agentes</h2>
          <p className="text-slate-500 text-sm">Cada modulo ya permite iniciar, responder y actualizar su estado de avance.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <Award className="text-blue-600" size={20} />
          <span className="text-sm font-bold text-blue-700">Nivel: Especialista Industrial</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2"><BookOpen size={16} /> Modulos Disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module) => (
              <button
                type="button"
                key={module.id}
                onClick={() => handleSelectModule(module)}
                className={`p-5 rounded-2xl border transition-all text-left ${selectedModule?.id === module.id ? 'bg-white border-blue-600 shadow-md ring-1 ring-blue-600' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${module.category === 'Tecnico' ? 'bg-orange-100 text-orange-700' : module.category === 'Comercial' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{module.category}</span>
                  {module.status === 'Completado' ? <CheckCircle className="text-emerald-500" size={16} /> : null}
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{module.title}</h4>
                <p className="text-xs text-slate-500 mb-4">{module.description}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{module.duration}</span>
                  <span className="text-xs font-bold text-blue-600">{module.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedModule ? (
            <div className="bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden sticky top-6">
              <div className="aspect-video bg-slate-800 flex items-center justify-center relative group cursor-pointer">
                <PlayCircle size={48} className="text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
                  <p className="text-xs font-bold truncate">{selectedModule.title}</p>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold mb-4 flex items-center gap-2"><GraduationCap size={18} className="text-blue-400" /> Evaluacion de Modulo</h4>
                <div className="space-y-4">
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400 mb-2 italic">Pregunta de certificacion:</p>
                    <p className="text-sm font-medium">{selectedModule.question}</p>
                  </div>
                  <div className="space-y-2">
                    {selectedModule.options.map((option) => (
                      <QuizOption key={option} label={option} active={selectedAnswer === option} onClick={() => setSelectedAnswer(option)} />
                    ))}
                  </div>
                  <button type="button" onClick={handleSubmit} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all mt-4">
                    Enviar Respuestas
                  </button>
                  {selectedModule.feedback ? <p className="text-xs text-slate-300 bg-slate-800 rounded-lg p-3">{selectedModule.feedback}</p> : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function QuizOption({ label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border transition-colors text-sm ${active ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'}`}>
      {label}
    </button>
  );
}