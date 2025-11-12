import React from 'react';
import { X, Shield, AlertCircle } from 'lucide-react';

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield size={24} />
            <h2 className="text-2xl font-bold">Termos de Uso</h2>
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
            {/* Aviso Importante */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="text-yellow-800 font-bold text-lg mb-1">Aviso Importante</h3>
                  <p className="text-yellow-700 text-sm">
                    Ao utilizar este sistema, você concorda com todos os termos e condições descritos abaixo.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">1. Aceitação dos Termos</h3>
            <p className="text-gray-700 mb-4">
              Ao acessar e usar o Sistema de Avaliação SCORM para Moodle ("o Sistema"), você aceita e concorda 
              em cumprir estes Termos de Uso. Se você não concorda com qualquer parte destes termos, 
              não deve usar o Sistema.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3">2. Direitos Autorais e Propriedade Intelectual</h3>
            <p className="text-gray-700 mb-2">
              Este Sistema foi desenvolvido por <strong>Carlos Antonio de Oliveira Piquet</strong>, 
              Especialista em Inteligência Artificial e Redes de Computadores.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Todos os direitos autorais são reservados ao desenvolvedor</li>
              <li>O código-fonte está disponível sob a Licença MIT</li>
              <li>É permitido usar, modificar e distribuir conforme a licença</li>
              <li>A atribuição ao autor original deve ser mantida</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3">3. Uso Permitido</h3>
            <p className="text-gray-700 mb-2">Você está autorizado a:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Usar o Sistema para fins educacionais e comerciais</li>
              <li>Criar avaliações SCORM para seus cursos</li>
              <li>Modificar o código-fonte conforme suas necessidades</li>
              <li>Distribuir cópias do Sistema mantendo os créditos</li>
              <li>Integrar com plataformas LMS como Moodle</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3">4. Restrições de Uso</h3>
            <p className="text-gray-700 mb-2">É expressamente proibido:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Remover ou alterar os créditos do desenvolvedor</li>
              <li>Reivindicar autoria do Sistema</li>
              <li>Usar o Sistema para atividades ilegais</li>
              <li>Redistribuir sem manter a licença MIT</li>
              <li>Vender o Sistema como produto próprio sem modificações substanciais</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3">5. Garantias e Responsabilidades</h3>
            <p className="text-gray-700 mb-4">
              O Sistema é fornecido "COMO ESTÁ", sem garantias de qualquer tipo, expressas ou implícitas. 
              O desenvolvedor não se responsabiliza por:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Perda de dados ou informações</li>
              <li>Incompatibilidade com sistemas específicos</li>
              <li>Erros ou bugs não documentados</li>
              <li>Danos diretos ou indiretos resultantes do uso</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3">6. Privacidade e Dados</h3>
            <p className="text-gray-700 mb-4">
              O Sistema utiliza apenas armazenamento local (LocalStorage) do navegador. 
              Nenhum dado é enviado para servidores externos, exceto quando integrado com LMS como Moodle, 
              seguindo os protocolos SCORM padrão.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3">7. Atualizações e Manutenção</h3>
            <p className="text-gray-700 mb-4">
              O desenvolvedor pode, mas não é obrigado a, fornecer atualizações, correções ou suporte técnico. 
              Contribuições da comunidade são bem-vindas através do repositório GitHub.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3">8. Modificações nos Termos</h3>
            <p className="text-gray-700 mb-4">
              Estes termos podem ser atualizados periodicamente. A versão mais recente estará sempre 
              disponível no sistema e no repositório GitHub.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3">9. Legislação Aplicável</h3>
            <p className="text-gray-700 mb-4">
              Estes termos são regidos pelas leis brasileiras. Quaisquer disputas serão resolvidas 
              nos tribunais competentes do Brasil.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3">10. Contato</h3>
            <p className="text-gray-700 mb-4">
              Para dúvidas sobre estes termos, entre em contato através do GitHub:
              <br />
              <a 
                href="https://github.com/carlospiquet2023/criador_de_form_scormmoodle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                github.com/carlospiquet2023/criador_de_form_scormmoodle
              </a>
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
              <p className="text-blue-800 font-semibold">
                Última atualização: 12 de novembro de 2025
              </p>
              <p className="text-blue-700 text-sm mt-1">
                Versão 1.0.0 - Sistema de Avaliação SCORM para Moodle
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Entendi e Aceito
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
