import React from 'react';
import { X, FileText, Github } from 'lucide-react';

const LicenseModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText size={24} />
            <h2 className="text-2xl font-bold">Licença MIT</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="prose max-w-none">
            {/* Badge Open Source */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 text-green-800 px-6 py-3 rounded-full font-bold text-lg flex items-center gap-2">
                <Github size={24} />
                Open Source Software
              </div>
            </div>

            {/* Informações do Projeto */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Sistema de Avaliação SCORM para Moodle
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">
                    <strong>Desenvolvedor:</strong> Carlos Antonio de Oliveira Piquet
                  </p>
                  <p className="text-gray-600">
                    <strong>Especialização:</strong> Inteligência Artificial e Redes de Computadores
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Versão:</strong> 1.0.0
                  </p>
                  <p className="text-gray-600">
                    <strong>Data:</strong> 12 de novembro de 2025
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mt-3">
                <strong>Repositório:</strong>{' '}
                <a
                  href="https://github.com/carlospiquet2023/criador_de_form_scormmoodle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  github.com/carlospiquet2023/criador_de_form_scormmoodle
                </a>
              </p>
            </div>

            {/* Licença MIT Original */}
            <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
              <pre className="whitespace-pre-wrap">{`MIT License

Copyright (c) 2025 Carlos Antonio de Oliveira Piquet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}</pre>
            </div>

            {/* Explicação em Português */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              O que significa esta licença?
            </h3>
            
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <h4 className="font-bold text-green-900 mb-2">✅ Você PODE:</h4>
                <ul className="list-disc list-inside text-green-800 space-y-1">
                  <li>Usar comercialmente</li>
                  <li>Modificar o código</li>
                  <li>Distribuir cópias</li>
                  <li>Usar em projetos privados</li>
                  <li>Sublicenciar</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Você DEVE:</h4>
                <ul className="list-disc list-inside text-yellow-800 space-y-1">
                  <li>Incluir a licença e o aviso de copyright</li>
                  <li>Manter os créditos do autor original</li>
                </ul>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <h4 className="font-bold text-red-900 mb-2">❌ Limitações:</h4>
                <ul className="list-disc list-inside text-red-800 space-y-1">
                  <li>Sem garantias</li>
                  <li>Autor não é responsável por problemas</li>
                  <li>Use por sua própria conta e risco</li>
                </ul>
              </div>
            </div>

            {/* Créditos Obrigatórios */}
            <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6 mt-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                📋 Atribuição Obrigatória
              </h3>
              <p className="text-blue-800 mb-3">
                Ao usar este software, você deve manter os seguintes créditos:
              </p>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="font-mono text-sm text-gray-800">
                  Sistema de Avaliação SCORM para Moodle<br />
                  Desenvolvido por: <strong>Carlos Antonio de Oliveira Piquet</strong><br />
                  Especialista em Inteligência Artificial e Redes de Computadores<br />
                  GitHub: <a 
                    href="https://github.com/carlospiquet2023"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    @carlospiquet2023
                  </a>
                </p>
              </div>
            </div>

            {/* Tecnologias */}
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                🛠️ Tecnologias Utilizadas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-100 px-3 py-2 rounded text-center text-sm font-semibold">
                  React 18.3
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-center text-sm font-semibold">
                  Vite 5
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-center text-sm font-semibold">
                  Tailwind CSS
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-center text-sm font-semibold">
                  jsPDF
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-center text-sm font-semibold">
                  JSZip
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-center text-sm font-semibold">
                  SCORM 2004
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-center text-sm font-semibold">
                  Lucide Icons
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-center text-sm font-semibold">
                  File Saver
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <a
            href="https://github.com/carlospiquet2023/criador_de_form_scormmoodle"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Github size={20} />
            <span className="text-sm font-semibold">Ver no GitHub</span>
          </a>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LicenseModal;
