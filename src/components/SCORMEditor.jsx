import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, Save, Eye, FileText, Edit2 } from 'lucide-react';
import { generateSCORMPackage } from '../utils/scormGenerator';
import { uuidv4 } from '../utils/uuid';

const SCORMEditor = ({ onSave, evaluations }) => {
  const [formData, setFormData] = useState({
    id: uuidv4(),
    title: 'Avaliação do Módulo',
    header: {
      greeting: 'Prezados alunos,',
      paragraphs: [
        'A Escola Superior de Advocacia Pública (ESAP) da PGE-RJ tem a satisfação de tê-los como alunos do curso de Pós-graduação em Direito e Advocacia Pública.',
        'Com o encerramento do Módulo de Princípios Institucionais da Advocacia de Estado, gostaríamos de solicitar encarecidamente a participação de todos na avaliação, com a finalidade de ajudar-nos a aprimorar nosso trabalho e manter sempre o elevado padrão de excelência que almejamos para o Programa de Pós-Graduação da ESAP.',
        'Sua opinião é muito importante. Você não será identificado e a participação levará cerca de 5 minutos.'
      ],
      deadline: 'O formulário ficará disponível até o dia 29/08/2025',
      closing: 'Agradecemos desde já pela colaboração!\n\nAtenciosamente,\nCoordenadoria de Ensino – ESAP'
    },
    sections: [
      {
        id: uuidv4(),
        title: 'Para iniciar, gostaríamos de saber um pouco sobre você',
        subtitle: 'Sua sinceridade é importante! :-) E não se preocupe: você não será identificado(a).',
        questions: [
          {
            id: uuidv4(),
            text: 'Meu gênero é:',
            type: 'single',
            required: true,
            options: ['Feminino', 'Masculino', 'Prefiro não informar']
          },
          {
            id: uuidv4(),
            text: 'Por favor nos informe sua Turma',
            type: 'single',
            required: true,
            options: ['Turma A', 'Turma B', 'Turma C', 'Turma D', 'Turma E']
          },
          {
            id: uuidv4(),
            text: 'Por favor nos informe sua faixa etária',
            type: 'single',
            required: true,
            options: ['Entre 20 e 24 anos', 'Entre 25 a 29 anos', 'Entre 30 a 34 anos', 'Mais do que 34 anos']
          }
        ]
      },
      {
        id: uuidv4(),
        title: 'Agora gostaríamos de saber como foi sua interação com o módulo',
        subtitle: '',
        questions: [
          {
            id: uuidv4(),
            text: 'Frequentei e acompanhei com empenho todas as aulas do Módulo',
            type: 'scale',
            required: true,
            scaleLabels: ['Nem tanto', 'Sempre']
          },
          {
            id: uuidv4(),
            text: 'Tinha experiência e conhecimento anterior sobre o tema exposto',
            type: 'scale',
            required: true,
            scaleLabels: ['Pouco', 'Muito']
          },
          {
            id: uuidv4(),
            text: 'Senti-me motivado pelo conjunto: disciplina/tema, professores e abordagem',
            type: 'scale',
            required: true,
            scaleLabels: ['Nada', 'Muito']
          }
        ]
      }
    ]
  });

  const [editingHeader, setEditingHeader] = useState(false);

  // Atualizar título
  const updateTitle = (value) => {
    setFormData(prev => ({ ...prev, title: value }));
  };

  // Atualizar cabeçalho
  const updateHeader = (field, value) => {
    setFormData(prev => ({
      ...prev,
      header: { ...prev.header, [field]: value }
    }));
  };

  const updateHeaderParagraph = (index, value) => {
    setFormData(prev => {
      const newParagraphs = [...prev.header.paragraphs];
      newParagraphs[index] = value;
      return {
        ...prev,
        header: { ...prev.header, paragraphs: newParagraphs }
      };
    });
  };

  const addHeaderParagraph = () => {
    setFormData(prev => ({
      ...prev,
      header: {
        ...prev.header,
        paragraphs: [...prev.header.paragraphs, 'Novo parágrafo...']
      }
    }));
  };

  const removeHeaderParagraph = (index) => {
    setFormData(prev => ({
      ...prev,
      header: {
        ...prev.header,
        paragraphs: prev.header.paragraphs.filter((_, i) => i !== index)
      }
    }));
  };

  // Adicionar nova seção
  const addSection = () => {
    const newSection = {
      id: uuidv4(),
      title: 'Nova Seção',
      subtitle: '',
      questions: []
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  // Remover seção
  const removeSection = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
  };

  // Atualizar seção
  const updateSection = (sectionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, [field]: value } : s
      )
    }));
  };

  // Adicionar pergunta a uma seção
  const addQuestion = (sectionId, type = 'single') => {
    const newQuestion = {
      id: uuidv4(),
      text: 'Nova pergunta',
      type: type,
      required: true,
      ...(type === 'single' || type === 'multiple' ? { options: ['Opção 1', 'Opção 2'] } : {}),
      ...(type === 'scale' ? { scaleLabels: ['Mínimo', 'Máximo'] } : {}),
    };

    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      )
    }));
  };

  // Remover pergunta
  const removeQuestion = (sectionId, questionId) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, questions: s.questions.filter(q => q.id !== questionId) }
          : s
      )
    }));
  };

  // Atualizar pergunta
  const updateQuestion = (sectionId, questionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map(q =>
                q.id === questionId ? { ...q, [field]: value } : q
              )
            }
          : s
      )
    }));
  };

  // Adicionar opção a uma pergunta
  const addOption = (sectionId, questionId) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map(q =>
                q.id === questionId
                  ? { ...q, options: [...(q.options || []), 'Nova opção'] }
                  : q
              )
            }
          : s
      )
    }));
  };

  // Remover opção
  const removeOption = (sectionId, questionId, optionIndex) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map(q =>
                q.id === questionId
                  ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
                  : q
              )
            }
          : s
      )
    }));
  };

  // Atualizar opção
  const updateOption = (sectionId, questionId, optionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map(q =>
                q.id === questionId
                  ? {
                      ...q,
                      options: q.options.map((opt, i) => (i === optionIndex ? value : opt))
                    }
                  : q
              )
            }
          : s
      )
    }));
  };

  // Salvar avaliação
  const handleSave = () => {
    const evaluation = {
      ...formData,
      updatedAt: new Date().toISOString()
    };
    onSave(evaluation);
    alert('Avaliação salva com sucesso!');
  };

  // Exportar SCORM
  const handleExportSCORM = () => {
    generateSCORMPackage(formData);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Editor de Formulários SCORM
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar
            </button>
            <button
              onClick={handleExportSCORM}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar SCORM
            </button>
          </div>
        </div>

        {/* Título do Formulário */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título do Formulário
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-bold"
            placeholder="Título do formulário"
          />
        </div>

        {/* Cabeçalho/Introdução */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-purple-900 flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Cabeçalho / Introdução
            </h2>
            <button
              onClick={() => setEditingHeader(!editingHeader)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              {editingHeader ? 'Visualizar' : 'Editar'}
            </button>
          </div>

          {editingHeader ? (
            <div className="space-y-4">
              {/* Saudação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Saudação
                </label>
                <input
                  type="text"
                  value={formData.header.greeting}
                  onChange={(e) => updateHeader('greeting', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Prezados alunos,"
                />
              </div>

              {/* Parágrafos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Parágrafos do Texto
                  </label>
                  <button
                    onClick={addHeaderParagraph}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Parágrafo
                  </button>
                </div>
                {formData.header.paragraphs.map((paragraph, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <textarea
                      value={paragraph}
                      onChange={(e) => updateHeaderParagraph(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows="3"
                      placeholder={`Parágrafo ${index + 1}`}
                    />
                    <button
                      onClick={() => removeHeaderParagraph(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Prazo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo / Data Limite
                </label>
                <input
                  type="text"
                  value={formData.header.deadline}
                  onChange={(e) => updateHeader('deadline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: O formulário ficará disponível até..."
                />
              </div>

              {/* Despedida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Despedida / Assinatura
                </label>
                <textarea
                  value={formData.header.closing}
                  onChange={(e) => updateHeader('closing', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows="4"
                  placeholder="Ex: Agradecemos desde já...\n\nAtenciosamente,\n..."
                />
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg border border-gray-200 prose max-w-none">
              <p className="font-medium mb-2">{formData.header.greeting}</p>
              {formData.header.paragraphs.map((paragraph, index) => (
                <p key={index} className="mb-2">{paragraph}</p>
              ))}
              <p className="italic text-gray-700 mb-2">{formData.header.deadline}</p>
              <p className="whitespace-pre-line text-gray-800">{formData.header.closing}</p>
            </div>
          )}
        </div>
      </div>

      {/* Seções de Perguntas */}
      {formData.sections.map((section, sectionIndex) => (
        <div key={section.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                className="w-full text-xl font-bold text-gray-800 border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                placeholder="Título da Seção"
              />
              <input
                type="text"
                value={section.subtitle}
                onChange={(e) => updateSection(section.id, 'subtitle', e.target.value)}
                className="w-full text-sm text-gray-600 italic border-b border-transparent hover:border-gray-300 focus:border-gray-400 focus:outline-none px-2 py-1 mt-1"
                placeholder="Subtítulo (opcional)"
              />
            </div>
            <button
              onClick={() => removeSection(section.id)}
              className="text-red-500 hover:text-red-700 ml-4"
              title="Remover seção"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Perguntas da Seção */}
          <div className="space-y-4 mb-4">
            {section.questions.map((question, qIndex) => (
              <div key={question.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                    {qIndex + 1}
                  </span>
                  <div className="flex-1">
                    <textarea
                      value={question.text}
                      onChange={(e) => updateQuestion(section.id, question.id, 'text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="Texto da pergunta"
                    />
                  </div>
                  <button
                    onClick={() => removeQuestion(section.id, question.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remover pergunta"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Tipo de Pergunta */}
                <div className="ml-11 space-y-3">
                  <div className="flex gap-4 items-center">
                    <label className="text-sm font-medium text-gray-700">Tipo:</label>
                    <select
                      value={question.type}
                      onChange={(e) => {
                        const newType = e.target.value;
                        const updates = { type: newType };
                        
                        if (newType === 'single' || newType === 'multiple') {
                          updates.options = question.options || ['Opção 1', 'Opção 2'];
                          delete updates.scaleLabels;
                        } else if (newType === 'scale') {
                          updates.scaleLabels = question.scaleLabels || ['Mínimo', 'Máximo'];
                          delete updates.options;
                        } else {
                          delete updates.options;
                          delete updates.scaleLabels;
                        }
                        
                        setFormData(prev => ({
                          ...prev,
                          sections: prev.sections.map(s =>
                            s.id === section.id
                              ? {
                                  ...s,
                                  questions: s.questions.map(q =>
                                    q.id === question.id ? { ...q, ...updates } : q
                                  )
                                }
                              : s
                          )
                        }));
                      }}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="single">Múltipla escolha (uma resposta)</option>
                      <option value="multiple">Múltipla escolha (várias respostas)</option>
                      <option value="scale">Escala de 1 a 5</option>
                      <option value="text">Texto curto</option>
                      <option value="textarea">Texto longo</option>
                    </select>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) => updateQuestion(section.id, question.id, 'required', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-gray-700">Obrigatória</span>
                    </label>
                  </div>

                  {/* Opções para múltipla escolha */}
                  {(question.type === 'single' || question.type === 'multiple') && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Opções:</label>
                        <button
                          onClick={() => addOption(section.id, question.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar Opção
                        </button>
                      </div>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex gap-2 mb-2">
                          <span className="text-gray-500 mt-2">○</span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(section.id, question.id, optIndex, e.target.value)}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder={`Opção ${optIndex + 1}`}
                          />
                          {question.options.length > 2 && (
                            <button
                              onClick={() => removeOption(section.id, question.id, optIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Labels para escala */}
                  {question.type === 'scale' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Label Mínimo (1):
                        </label>
                        <input
                          type="text"
                          value={question.scaleLabels[0]}
                          onChange={(e) => updateQuestion(section.id, question.id, 'scaleLabels', [e.target.value, question.scaleLabels[1]])}
                          className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Nada"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Label Máximo (5):
                        </label>
                        <input
                          type="text"
                          value={question.scaleLabels[1]}
                          onChange={(e) => updateQuestion(section.id, question.id, 'scaleLabels', [question.scaleLabels[0], e.target.value])}
                          className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Muito"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Botões para Adicionar Pergunta */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => addQuestion(section.id, 'single')}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Múltipla Escolha
            </button>
            <button
              onClick={() => addQuestion(section.id, 'scale')}
              className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Escala 1-5
            </button>
            <button
              onClick={() => addQuestion(section.id, 'text')}
              className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Texto Curto
            </button>
            <button
              onClick={() => addQuestion(section.id, 'textarea')}
              className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Texto Longo
            </button>
          </div>
        </div>
      ))}

      {/* Botão Adicionar Seção */}
      <div className="text-center">
        <button
          onClick={addSection}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition flex items-center gap-2 mx-auto shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Adicionar Nova Seção
        </button>
      </div>

      {/* Footer Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center gap-4">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-lg text-lg font-semibold"
        >
          <Save className="w-5 h-5" />
          Salvar Avaliação
        </button>
        <button
          onClick={handleExportSCORM}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-lg text-lg font-semibold"
        >
          <Download className="w-5 h-5" />
          Exportar SCORM
        </button>
      </div>
    </div>
  );
};

export default SCORMEditor;
