import React from 'react';
import { Github, Shield, FileText } from 'lucide-react';

const Footer = ({ onShowTerms, onShowLicense }) => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seção Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Sobre o Projeto */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-300">
              Sistema SCORM para Moodle
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sistema profissional completo para criação de avaliações em formato SCORM 2004, 
              compatível com Moodle e outros LMS. Geração automática de pacotes e relatórios em PDF.
            </p>
          </div>

          {/* Links Importantes */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-300">
              Documentação e Legal
            </h3>
            <div className="space-y-2">
              <button
                onClick={onShowTerms}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
              >
                <FileText size={16} />
                Termos de Uso
              </button>
              <button
                onClick={onShowLicense}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Shield size={16} />
                Licença MIT
              </button>
              <a
                href="https://github.com/carlospiquet2023/criador_de_form_scormmoodle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Github size={16} />
                Código no GitHub
              </a>
            </div>
          </div>

          {/* Créditos do Desenvolvedor */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-300">
              Desenvolvido por
            </h3>
            <div className="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-lg p-4 border border-blue-600">
              <p className="font-bold text-white text-lg mb-1">
                Carlos Antonio de Oliveira Piquet
              </p>
              <p className="text-blue-200 text-sm font-semibold mb-2">
                Especialista em Inteligência Artificial e Redes de Computadores
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 bg-blue-900 rounded text-xs text-blue-200">
                  IA & Machine Learning
                </span>
                <span className="px-2 py-1 bg-blue-900 rounded text-xs text-blue-200">
                  Redes de Computadores
                </span>
                <span className="px-2 py-1 bg-blue-900 rounded text-xs text-blue-200">
                  E-Learning
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Divisória */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2025 <span className="font-semibold text-white">Carlos Antonio de Oliveira Piquet</span>. 
                Todos os direitos reservados.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Sistema desenvolvido com React, Vite e Tailwind CSS
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-green-900 text-green-200 rounded-full text-xs font-semibold">
                SCORM 2004
              </span>
              <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-xs font-semibold">
                Moodle Compatible
              </span>
              <span className="px-3 py-1 bg-purple-900 text-purple-200 rounded-full text-xs font-semibold">
                v1.0.0
              </span>
            </div>
          </div>
        </div>

        {/* Tecnologias */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-400 text-xs">
            Desenvolvido com ❤️ usando React • Vite • Tailwind CSS • jsPDF • JSZip • SCORM 2004 API
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
