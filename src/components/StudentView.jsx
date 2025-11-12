import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { generatePDFReport } from '../utils/pdfGenerator';

const StudentView = ({ evaluations }) => {
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    email: '',
    class: '',
    registrationNumber: ''
  });
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleResponseChange = (questionType, questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [`${questionType}_${questionId}`]: value
    }));
  };

  const handleSubmit = async () => {
    if (!studentInfo.name || !studentInfo.email) {
      alert('Por favor, preencha seu nome e email.');
      return;
    }

    // Verificar se todas as perguntas foram respondidas
    const totalQuestions = 
      selectedEvaluation.generalQuestions.length +
      selectedEvaluation.classes.reduce((sum, c) => sum + c.questions.length, 0);

    if (Object.keys(responses).length < totalQuestions) {
      alert('Por favor, responda todas as perguntas.');
      return;
    }

    // Salvar no localStorage (simula envio ao LMS)
    const submission = {
      id: Date.now(),
      evaluationId: selectedEvaluation.id,
      studentInfo,
      responses,
      submittedAt: new Date().toISOString()
    };

    const submissions = JSON.parse(localStorage.getItem('scorm-submissions') || '[]');
    submissions.push(submission);
    localStorage.setItem('scorm-submissions', JSON.stringify(submissions));

    setSubmitted(true);
    alert('Avaliação enviada com sucesso!');
  };

  const handleDownloadReport = async () => {
    try {
      await generatePDFReport(selectedEvaluation, studentInfo, responses);
      alert('Relatório PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar relatório PDF.');
    }
  };

  if (!selectedEvaluation) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Selecione uma Avaliação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evaluations.map(evaluation => (
              <div
                key={evaluation.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                onClick={() => setSelectedEvaluation(evaluation)}
              >
                <h3 className="font-semibold text-gray-900">{evaluation.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{evaluation.subtitle}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {evaluation.generalQuestions.length} perguntas gerais • {evaluation.classes.length} aulas
                </p>
              </div>
            ))}
          </div>
          {evaluations.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              Nenhuma avaliação disponível no momento.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Avaliação Enviada com Sucesso!
          </h2>
          <p className="text-gray-600 mb-6">
            Obrigado por sua participação, {studentInfo.name}.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={20} />
              Baixar Relatório PDF
            </button>
            <button
              onClick={() => {
                setSelectedEvaluation(null);
                setSubmitted(false);
                setResponses({});
                setStudentInfo({ name: '', email: '', class: '', registrationNumber: '' });
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Fazer Outra Avaliação
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{selectedEvaluation.title}</h1>
        <h2 className="text-xl text-gray-600 mt-2">{selectedEvaluation.subtitle}</h2>
        <p className="text-sm text-gray-500 mt-2">{selectedEvaluation.institution}</p>
        {selectedEvaluation.deadline && (
          <p className="text-sm text-red-600 mt-2">
            <strong>Prazo:</strong> {selectedEvaluation.deadline}
          </p>
        )}
      </div>

      {/* Informações do Aluno */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Informações do Aluno</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              value={studentInfo.name}
              onChange={(e) => setStudentInfo(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={studentInfo.email}
              onChange={(e) => setStudentInfo(prev => ({ ...prev, email: e.target.value }))}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Turma
            </label>
            <input
              type="text"
              value={studentInfo.class}
              onChange={(e) => setStudentInfo(prev => ({ ...prev, class: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula
            </label>
            <input
              type="text"
              value={studentInfo.registrationNumber}
              onChange={(e) => setStudentInfo(prev => ({ ...prev, registrationNumber: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Perguntas Gerais */}
      {selectedEvaluation.generalQuestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Perguntas Gerais do Módulo</h3>
          <div className="space-y-6">
            {selectedEvaluation.generalQuestions.map((q, idx) => (
              <div key={q.id} className="pb-4 border-b last:border-b-0">
                <p className="font-medium text-gray-900 mb-3">
                  {idx + 1}. {q.text}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-600 font-medium">
                    {q.scaleLabels[0]}
                  </span>
                  {[1, 2, 3, 4, 5].map(value => (
                    <label
                      key={value}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name={`general_${q.id}`}
                        value={value}
                        onChange={() => handleResponseChange('general', q.id, value)}
                        className="cursor-pointer w-4 h-4"
                        required
                      />
                      <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                        {value}
                      </span>
                    </label>
                  ))}
                  <span className="text-sm text-gray-600 font-medium">
                    {q.scaleLabels[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avaliação por Aula */}
      {selectedEvaluation.classes.map((classItem, classIdx) => (
        <div key={classItem.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900">{classItem.title}</h3>
          <h4 className="text-lg text-blue-600 mb-2">{classItem.theme}</h4>
          <p className="text-sm text-gray-700 mb-1">
            <strong>Professor(a):</strong> {classItem.professor}
          </p>
          <p className="text-sm text-gray-600 mb-4">{classItem.syllabus}</p>

          <div className="bg-white rounded-lg p-4 space-y-4">
            {classItem.questions.map((q, qIdx) => (
              <div key={q.id} className="pb-3 border-b last:border-b-0">
                <p className="font-medium text-gray-900 mb-2">{q.text}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-600 font-medium">
                    {q.scaleLabels[0]}
                  </span>
                  {[1, 2, 3, 4, 5].map(value => (
                    <label
                      key={value}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name={`class${classItem.id}_q${q.id}`}
                        value={value}
                        onChange={() => handleResponseChange(`class${classItem.id}`, q.id, value)}
                        className="cursor-pointer w-4 h-4"
                        required
                      />
                      <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                        {value}
                      </span>
                    </label>
                  ))}
                  <span className="text-sm text-gray-600 font-medium">
                    {q.scaleLabels[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Botão de Envio */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setSelectedEvaluation(null)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <FileText size={20} />
            Enviar Avaliação
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentView;
