import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, Edit2, Save, X, Eye, Settings, FileText, Copy } from 'lucide-react';
import { generateSCORMPackage } from '../utils/scormGenerator';
import { uuidv4 } from '../utils/uuid';

const SCORMEditor = ({ onSave, evaluations }) => {
  const [mode, setMode] = useState('edit');
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [formData, setFormData] = useState({
    id: uuidv4(),
    title: 'Avaliação do Módulo',
    subtitle: 'Princípios Institucionais da Advocacia de Estado',
    institution: 'Escola Superior de Advocacia Pública (ESAP) - PGE-RJ',
    deadline: '29/08/2025',
    generalQuestions: [
      { id: 1, text: 'Frequentei e acompanhei com empenho todas as aulas do Módulo', type: 'scale', scaleLabels: ['Nem tanto', 'Sempre'] },
      { id: 2, text: 'Tinha experiência e conhecimento anterior sobre o tema exposto', type: 'scale', scaleLabels: ['Pouco', 'Muito'] },
      { id: 3, text: 'Senti-me motivado pelo conjunto: disciplina/tema, professores e abordagem', type: 'scale', scaleLabels: ['Nada', 'Muito'] },
      { id: 4, text: 'O módulo mudou minha percepção sobre o tema', type: 'scale', scaleLabels: ['Nada', 'Muito'] },
      { id: 5, text: 'Importância da disciplina na minha formação', type: 'scale', scaleLabels: ['Irrelevante', 'Essencial'] },
      { id: 6, text: 'Qualidade do material didático disponibilizado', type: 'scale', scaleLabels: ['Superficial', 'Elaborado'] },
      { id: 7, text: 'Grau de dificuldade do conteúdo exposto', type: 'scale', scaleLabels: ['Trivial / muito fácil', 'Complexo / muito difícil'] },
      { id: 8, text: 'Abordagem do tema em relação às minhas expectativas', type: 'scale', scaleLabels: ['Frustrou minhas expectativas', 'Superou minhas expectativas'] },
      { id: 9, text: 'Duração do módulo como um todo', type: 'scale', scaleLabels: ['Insuficiente (pouco tempo)', 'Excessivo (mais tempo do que o necessário)'] }
    ],
    classes: [
      {
        id: 1,
        title: 'AULA 01',
        theme: 'A Advocacia Pública na Constituição da República',
        professor: 'Diego Fabião',
        syllabus: 'A Advocacia Pública na Constituição Federal. Advocacia Pública e Federação. Advocacia-Geral da União, Procuradorias dos Estados e do Distrito Federal e Procuradorias Municipais.',
        questions: [
          { id: 1, text: 'Clareza na exposição do tema', type: 'scale', scaleLabels: ['Confuso', 'Elucidante'] },
          { id: 2, text: 'Conhecimento sobre o assunto', type: 'scale', scaleLabels: ['Limitado', 'Profundo'] },
          { id: 3, text: 'Utilização do tempo dedicado à exposição', type: 'scale', scaleLabels: ['Insuficiente', 'Suficiente'] },
          { id: 4, text: 'Empatia com os alunos', type: 'scale', scaleLabels: ['Indiferente', 'Atencioso'] },
          { id: 5, text: 'Utilização dos recursos áudio-visuais', type: 'scale', scaleLabels: ['Precário', 'Excelente'] },
          { id: 6, text: 'Pontualidade', type: 'scale', scaleLabels: ['Impontual', 'Pontual'] }
        ]
      }
    ]
  });

  const updateFormField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateClass = (classId, field, value) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.map(c => 
        c.id === classId ? { ...c, [field]: value } : c
      )
    }));
  };

  const updateClassQuestion = (classId, questionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.map(c => 
        c.id === classId 
          ? {
              ...c,
              questions: c.questions.map(q =>
                q.id === questionId ? { ...q, [field]: value } : q
              )
            }
          : c
      )
    }));
  };

  const addNewClass = () => {
    const newId = Math.max(...formData.classes.map(c => c.id), 0) + 1;
    setFormData(prev => ({
      ...prev,
      classes: [...prev.classes, {
        id: newId,
        title: `AULA ${String(newId).padStart(2, '0')}`,
        theme: 'Novo Tema',
        professor: 'Nome do Professor',
        syllabus: 'Descreva a ementa da aula...',
        questions: [
          { id: 1, text: 'Clareza na exposição do tema', type: 'scale', scaleLabels: ['Confuso', 'Elucidante'] },
          { id: 2, text: 'Conhecimento sobre o assunto', type: 'scale', scaleLabels: ['Limitado', 'Profundo'] },
          { id: 3, text: 'Pontualidade', type: 'scale', scaleLabels: ['Impontual', 'Pontual'] }
        ]
      }]
    }));
  };

  const addQuestionToClass = (classId) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.map(c => {
        if (c.id === classId) {
          const newId = Math.max(...c.questions.map(q => q.id), 0) + 1;
          return {
            ...c,
            questions: [...c.questions, {
              id: newId,
              text: 'Nova pergunta',
              type: 'scale',
              scaleLabels: ['Mínimo', 'Máximo']
            }]
          };
        }
        return c;
      })
    }));
  };

  const removeQuestionFromClass = (classId, questionId) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.map(c => 
        c.id === classId 
          ? { ...c, questions: c.questions.filter(q => q.id !== questionId) }
          : c
      )
    }));
  };

  const addGeneralQuestion = () => {
    const newId = Math.max(...formData.generalQuestions.map(q => q.id), 0) + 1;
    setFormData(prev => ({
      ...prev,
      generalQuestions: [...prev.generalQuestions, {
        id: newId,
        text: 'Nova pergunta geral',
        type: 'scale',
        scaleLabels: ['Mínimo', 'Máximo']
      }]
    }));
  };

  const removeGeneralQuestion = (questionId) => {
    setFormData(prev => ({
      ...prev,
      generalQuestions: prev.generalQuestions.filter(q => q.id !== questionId)
    }));
  };

  const removeClass = (classId) => {
    if (confirm('Tem certeza que deseja remover esta aula?')) {
      setFormData(prev => ({
        ...prev,
        classes: prev.classes.filter(c => c.id !== classId)
      }));
    }
  };

  const handleSave = () => {
    onSave(formData);
    alert('Avaliação salva com sucesso!');
  };

  const handleExportSCORM = async () => {
    try {
      await generateSCORMPackage(formData);
      alert('Pacote SCORM gerado com sucesso! Verifique seus downloads.');
    } catch (error) {
      console.error('Erro ao gerar SCORM:', error);
      alert('Erro ao gerar pacote SCORM. Verifique o console para mais detalhes.');
    }
  };

  const loadEvaluation = (evaluation) => {
    setFormData(evaluation);
    setCurrentEvaluation(evaluation);
  };

  const createNewEvaluation = () => {
    setFormData({
      id: uuidv4(),
      title: 'Nova Avaliação',
      subtitle: '',
      institution: '',
      deadline: '',
      generalQuestions: [],
      classes: []
    });
    setCurrentEvaluation(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header com ações */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormField('title', e.target.value)}
              className="text-3xl font-bold text-gray-900 w-full border-0 border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Título da Avaliação"
            />
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => updateFormField('subtitle', e.target.value)}
              className="text-lg text-gray-600 mt-2 w-full border-0 border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Subtítulo"
            />
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {mode === 'edit' ? <Eye size={20} /> : <Settings size={20} />}
              {mode === 'edit' ? 'Visualizar' : 'Editar'}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={20} />
              Salvar
            </button>
            <button
              onClick={handleExportSCORM}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={20} />
              Exportar SCORM
            </button>
          </div>
        </div>
        
        <textarea
          value={formData.institution}
          onChange={(e) => updateFormField('institution', e.target.value)}
          className="w-full text-sm text-gray-500 border-0 border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-colors resize-none"
          rows={2}
          placeholder="Instituição"
        />
        
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">Data Limite:</label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => updateFormField('deadline', e.target.value)}
            className="ml-2 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Avaliações salvas */}
      {evaluations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Avaliações Salvas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evaluations.map(evaluation => (
              <div
                key={evaluation.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                onClick={() => loadEvaluation(evaluation)}
              >
                <h3 className="font-semibold text-gray-900">{evaluation.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{evaluation.subtitle}</p>
                <p className="text-xs text-gray-500 mt-2">{evaluation.classes.length} aulas</p>
              </div>
            ))}
          </div>
          <button
            onClick={createNewEvaluation}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Nova Avaliação
          </button>
        </div>
      )}

      {mode === 'edit' ? (
        <>
          {/* Perguntas Gerais */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Perguntas Gerais do Módulo</h2>
              <button
                onClick={addGeneralQuestion}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus size={16} />
                Adicionar Pergunta
              </button>
            </div>
            <div className="space-y-4">
              {formData.generalQuestions.map((q, idx) => (
                <div key={q.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg">
                  <div className="flex gap-2 items-start">
                    <span className="text-sm font-semibold text-gray-500 mt-2">{idx + 1}.</span>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => {
                        const updated = [...formData.generalQuestions];
                        updated[idx].text = e.target.value;
                        updateFormField('generalQuestions', updated);
                      }}
                      className="flex-1 text-gray-900 border-0 border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
                    />
                    <button
                      onClick={() => removeGeneralQuestion(q.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex gap-4 mt-2 ml-6 text-sm">
                    <input
                      type="text"
                      value={q.scaleLabels[0]}
                      onChange={(e) => {
                        const updated = [...formData.generalQuestions];
                        updated[idx].scaleLabels[0] = e.target.value;
                        updateFormField('generalQuestions', updated);
                      }}
                      className="w-48 text-gray-600 px-2 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-white rounded"
                      placeholder="Rótulo inferior"
                    />
                    <span className="text-gray-400">→</span>
                    <input
                      type="text"
                      value={q.scaleLabels[1]}
                      onChange={(e) => {
                        const updated = [...formData.generalQuestions];
                        updated[idx].scaleLabels[1] = e.target.value;
                        updateFormField('generalQuestions', updated);
                      }}
                      className="w-48 text-gray-600 px-2 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-white rounded"
                      placeholder="Rótulo superior"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aulas */}
          <div className="space-y-6">
            {formData.classes.map((classItem) => (
              <div key={classItem.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={classItem.title}
                      onChange={(e) => updateClass(classItem.id, 'title', e.target.value)}
                      className="text-xl font-bold text-gray-900 w-full border-0 border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <input
                      type="text"
                      value={classItem.theme}
                      onChange={(e) => updateClass(classItem.id, 'theme', e.target.value)}
                      className="text-lg text-blue-600 mt-2 w-full border-0 border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => removeClass(classItem.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professor(a):</label>
                  <input
                    type="text"
                    value={classItem.professor}
                    onChange={(e) => updateClass(classItem.id, 'professor', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ementa:</label>
                  <textarea
                    value={classItem.syllabus}
                    onChange={(e) => updateClass(classItem.id, 'syllabus', e.target.value)}
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">Perguntas de Avaliação</h3>
                    <button
                      onClick={() => addQuestionToClass(classItem.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      <Plus size={14} />
                      Adicionar
                    </button>
                  </div>
                  <div className="space-y-3">
                    {classItem.questions.map((q, idx) => (
                      <div key={q.id} className="bg-gray-50 rounded-lg p-3 relative">
                        <button
                          onClick={() => removeQuestionFromClass(classItem.id, q.id)}
                          className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                        <input
                          type="text"
                          value={q.text}
                          onChange={(e) => updateClassQuestion(classItem.id, q.id, 'text', e.target.value)}
                          className="w-full pr-8 text-gray-900 mb-2 bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                        />
                        <div className="flex gap-4 text-sm">
                          <input
                            type="text"
                            value={q.scaleLabels[0]}
                            onChange={(e) => {
                              const newLabels = [...q.scaleLabels];
                              newLabels[0] = e.target.value;
                              updateClassQuestion(classItem.id, q.id, 'scaleLabels', newLabels);
                            }}
                            className="w-40 text-gray-600 bg-white px-2 py-1 border border-gray-300 rounded"
                            placeholder="Mínimo"
                          />
                          <span className="text-gray-400 self-center">→</span>
                          <input
                            type="text"
                            value={q.scaleLabels[1]}
                            onChange={(e) => {
                              const newLabels = [...q.scaleLabels];
                              newLabels[1] = e.target.value;
                              updateClassQuestion(classItem.id, q.id, 'scaleLabels', newLabels);
                            }}
                            className="w-40 text-gray-600 bg-white px-2 py-1 border border-gray-300 rounded"
                            placeholder="Máximo"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addNewClass}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={24} />
              Adicionar Nova Aula
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Visualização do Formulário</h2>
          <p className="text-gray-600 mb-4">Esta é a visualização de como os alunos verão o formulário no Moodle.</p>
          
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-xl font-bold text-gray-900">Perguntas Gerais</h3>
            {formData.generalQuestions.map((q, idx) => (
              <div key={q.id} className="pb-4 border-b">
                <p className="font-medium text-gray-900 mb-3">{idx + 1}. {q.text}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">{q.scaleLabels[0]}</span>
                  {[1, 2, 3, 4, 5].map(value => (
                    <label key={value} className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" name={`q${q.id}`} value={value} className="cursor-pointer" />
                      <span className="text-sm text-gray-600">{value}</span>
                    </label>
                  ))}
                  <span className="text-sm text-gray-500">{q.scaleLabels[1]}</span>
                </div>
              </div>
            ))}

            {formData.classes.map((classItem) => (
              <div key={classItem.id} className="bg-blue-50 rounded-lg p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900">{classItem.title}</h3>
                <h4 className="text-lg text-blue-600 mb-2">{classItem.theme}</h4>
                <p className="text-sm text-gray-700 mb-1"><strong>Professor(a):</strong> {classItem.professor}</p>
                <p className="text-sm text-gray-600 mb-4">{classItem.syllabus}</p>
                
                <div className="space-y-4 bg-white rounded-lg p-4">
                  {classItem.questions.map((q, idx) => (
                    <div key={q.id} className="pb-3 border-b last:border-b-0">
                      <p className="font-medium text-gray-900 mb-2">{q.text}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-500">{q.scaleLabels[0]}</span>
                        {[1, 2, 3, 4, 5].map(value => (
                          <label key={value} className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name={`class${classItem.id}q${q.id}`} value={value} className="cursor-pointer" />
                            <span className="text-sm text-gray-600">{value}</span>
                          </label>
                        ))}
                        <span className="text-sm text-gray-500">{q.scaleLabels[1]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SCORMEditor;
