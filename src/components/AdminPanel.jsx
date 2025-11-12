import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Eye, BarChart3 } from 'lucide-react';
import { generateConsolidatedReport } from '../utils/pdfGenerator';

const AdminPanel = ({ evaluations }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    const saved = localStorage.getItem('scorm-submissions');
    if (saved) {
      setSubmissions(JSON.parse(saved));
    }
  };

  const deleteSubmission = (submissionId) => {
    if (confirm('Tem certeza que deseja excluir esta submissão?')) {
      const updated = submissions.filter(s => s.id !== submissionId);
      setSubmissions(updated);
      localStorage.setItem('scorm-submissions', JSON.stringify(updated));
    }
  };

  const calculateStatistics = (evaluationId) => {
    const evalSubmissions = submissions.filter(s => s.evaluationId === evaluationId);
    const evaluation = evaluations.find(e => e.id === evaluationId);

    if (!evaluation || evalSubmissions.length === 0) {
      return null;
    }

    const stats = {
      totalResponses: evalSubmissions.length,
      averages: {},
      distribution: {}
    };

    // Calcular médias para perguntas gerais
    evaluation.generalQuestions.forEach(q => {
      const responses = evalSubmissions
        .map(s => parseInt(s.responses[`general_${q.id}`]))
        .filter(r => !isNaN(r));
      
      if (responses.length > 0) {
        const avg = responses.reduce((a, b) => a + b, 0) / responses.length;
        stats.averages[`general_${q.id}`] = avg.toFixed(2);
        
        // Distribuição
        stats.distribution[`general_${q.id}`] = [1, 2, 3, 4, 5].map(val => 
          responses.filter(r => r === val).length
        );
      }
    });

    // Calcular médias por aula
    evaluation.classes.forEach(classItem => {
      classItem.questions.forEach(q => {
        const key = `class${classItem.id}_${q.id}`;
        const responses = evalSubmissions
          .map(s => parseInt(s.responses[`class${classItem.id}_${q.id}`]))
          .filter(r => !isNaN(r));
        
        if (responses.length > 0) {
          const avg = responses.reduce((a, b) => a + b, 0) / responses.length;
          stats.averages[key] = avg.toFixed(2);
          
          stats.distribution[key] = [1, 2, 3, 4, 5].map(val => 
            responses.filter(r => r === val).length
          );
        }
      });
    });

    return stats;
  };

  const handleGenerateConsolidatedReport = async (evaluationId) => {
    const evaluation = evaluations.find(e => e.id === evaluationId);
    const evalSubmissions = submissions.filter(s => s.evaluationId === evaluationId);
    const stats = calculateStatistics(evaluationId);

    try {
      await generateConsolidatedReport(evaluation, evalSubmissions, stats);
      alert('Relatório consolidado gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório consolidado.');
    }
  };

  const viewStatistics = (evaluationId) => {
    const stats = calculateStatistics(evaluationId);
    setStatistics(stats);
    setSelectedEvaluation(evaluationId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Painel Administrativo
        </h2>

        {/* Estatísticas por Avaliação */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Avaliações</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evaluations.map(evaluation => {
              const evalSubmissions = submissions.filter(s => s.evaluationId === evaluation.id);
              return (
                <div
                  key={evaluation.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <h4 className="font-semibold text-gray-900">{evaluation.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{evaluation.subtitle}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {evalSubmissions.length} respostas
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => viewStatistics(evaluation.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      <BarChart3 size={16} />
                      Estatísticas
                    </button>
                    <button
                      onClick={() => handleGenerateConsolidatedReport(evaluation.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      disabled={evalSubmissions.length === 0}
                    >
                      <Download size={16} />
                      Relatório
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estatísticas Detalhadas */}
        {statistics && selectedEvaluation && (
          <div className="mb-8 bg-blue-50 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Estatísticas Detalhadas
              </h3>
              <button
                onClick={() => {
                  setStatistics(null);
                  setSelectedEvaluation(null);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-lg mb-4">
                <strong>Total de Respostas:</strong> {statistics.totalResponses}
              </p>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Médias por Pergunta:</h4>
                {Object.entries(statistics.averages).map(([key, avg]) => (
                  <div key={key} className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-48">{key}:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{ width: `${(parseFloat(avg) / 5) * 100}%` }}
                      />
                      <span className="absolute right-2 top-0 text-xs font-semibold text-gray-700">
                        {avg}/5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lista de Submissões */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Todas as Submissões ({submissions.length})
          </h3>
          {submissions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhuma submissão registrada ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aluno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Turma
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avaliação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map(submission => {
                    const evaluation = evaluations.find(e => e.id === submission.evaluationId);
                    return (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {submission.studentInfo.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.studentInfo.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.studentInfo.class || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {evaluation?.title || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(submission.submittedAt).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => deleteSubmission(submission.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
