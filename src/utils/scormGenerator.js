import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Função auxiliar para escapar XML
const escapeXml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Função auxiliar para escapar HTML
const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Gera o arquivo imsmanifest.xml
const generateManifest = (formData) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.scorm.avaliacao.${formData.id}" version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
          xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
          xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd
                              http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd
                              http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd
                              http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  <organizations default="ORG-001">
    <organization identifier="ORG-001">
      <title>${escapeXml(formData.title)}</title>
      <item identifier="ITEM-001" identifierref="RES-001">
        <title>${escapeXml(formData.title)}</title>
        <adlcp:masteryscore>80</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-001" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html"/>
      <file href="scorm-api-wrapper.js"/>
      <file href="evaluation.js"/>
      <file href="styles.css"/>
    </resource>
  </resources>
</manifest>`;
};

// Gera o wrapper da API SCORM
const generateScormAPIWrapper = () => {
  return `/**
 * SCORM 2004 API Wrapper
 */
var API_1484_11 = {
  initialized: false,
  terminated: false,
  data: {},
  
  Initialize: function(parameter) {
    if (this.initialized) return 'false';
    this.initialized = true;
    this.data = {
      'cmi.completion_status': 'incomplete',
      'cmi.success_status': 'unknown',
      'cmi.score.raw': '0',
      'cmi.score.min': '0',
      'cmi.score.max': '100'
    };
    return 'true';
  },
  
  Terminate: function(parameter) {
    if (this.terminated) return 'false';
    this.terminated = true;
    return 'true';
  },
  
  GetValue: function(element) {
    return this.data[element] || '';
  },
  
  SetValue: function(element, value) {
    this.data[element] = value;
    return 'true';
  },
  
  Commit: function(parameter) {
    return 'true';
  },
  
  GetLastError: function() {
    return '0';
  },
  
  GetErrorString: function(errorCode) {
    return 'No error';
  },
  
  GetDiagnostic: function(errorCode) {
    return 'No error';
  }
};

// Tentar encontrar API no LMS
function findAPI(win) {
  var findAPITries = 0;
  while ((win.API_1484_11 == null) && (win.parent != null) && (win.parent != win)) {
    findAPITries++;
    if (findAPITries > 7) return null;
    win = win.parent;
  }
  return win.API_1484_11;
}

// Usar API do LMS se disponível, senão usar mock
if (typeof API_1484_11 === 'undefined') {
  var lmsAPI = findAPI(window);
  if (lmsAPI != null) {
    API_1484_11 = lmsAPI;
  }
}`;
};

// Gera o HTML da avaliação
const generateHTML = (formData) => {
  // Função auxiliar para gerar campos de pergunta baseado no tipo
  const generateQuestionField = (question, namePrefix) => {
    const questionName = `${namePrefix}_${question.id}`;
    
    switch (question.type) {
      case 'single':
        return `
          <div class="options-list">
            ${question.options.map((option, idx) => `
              <label class="radio-option">
                <input type="radio" name="${questionName}" value="${escapeHtml(option)}" ${question.required ? 'required' : ''}>
                <span>${escapeHtml(option)}</span>
              </label>
            `).join('')}
          </div>`;
      
      case 'multiple':
        return `
          <div class="options-list">
            ${question.options.map((option, idx) => `
              <label class="checkbox-option">
                <input type="checkbox" name="${questionName}" value="${escapeHtml(option)}">
                <span>${escapeHtml(option)}</span>
              </label>
            `).join('')}
          </div>`;
      
      case 'scale':
        return `
          <div class="scale-options">
            <span class="scale-label">${escapeHtml(question.scaleLabels[0])}</span>
            ${[1, 2, 3, 4, 5].map(val => `
              <label class="radio-option scale-radio">
                <input type="radio" name="${questionName}" value="${val}" ${question.required ? 'required' : ''}>
                <span class="scale-number">${val}</span>
              </label>
            `).join('')}
            <span class="scale-label">${escapeHtml(question.scaleLabels[1])}</span>
          </div>`;
      
      case 'text':
        return `
          <input type="text" name="${questionName}" class="text-input" ${question.required ? 'required' : ''} placeholder="Digite sua resposta">`;
      
      case 'textarea':
        return `
          <textarea name="${questionName}" class="textarea-input" rows="4" ${question.required ? 'required' : ''} placeholder="Digite sua resposta"></textarea>`;
      
      default:
        return '';
    }
  };

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(formData.title)}</title>
  <link rel="stylesheet" href="styles.css">
  <script src="scorm-api-wrapper.js"></script>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>${escapeHtml(formData.title)}</h1>
      ${formData.header ? `
        <div class="header-intro">
          <p class="greeting">${escapeHtml(formData.header.greeting)}</p>
          ${formData.header.paragraphs.map(p => `<p class="intro-paragraph">${escapeHtml(p)}</p>`).join('')}
          ${formData.header.deadline ? `<p class="deadline"><em>${escapeHtml(formData.header.deadline)}</em></p>` : ''}
          ${formData.header.closing ? `<p class="closing">${escapeHtml(formData.header.closing).replace(/\n/g, '<br>')}</p>` : ''}
        </div>
      ` : ''}
    </header>

    <form id="evaluationForm" class="evaluation-form">
      ${formData.sections && formData.sections.length > 0 ? formData.sections.map((section, sectionIdx) => `
        <section class="form-section">
          <div class="section-header">
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
            ${section.subtitle ? `<p class="section-subtitle">${escapeHtml(section.subtitle)}</p>` : ''}
          </div>
          
          <div class="questions-list">
            ${section.questions.map((question, qIdx) => `
              <div class="question-item">
                <div class="question-header">
                  <span class="question-number">${qIdx + 1}.</span>
                  <p class="question-text">
                    ${escapeHtml(question.text)}
                    ${question.required ? '<span class="required-mark">*</span>' : ''}
                  </p>
                </div>
                <div class="question-answer">
                  ${generateQuestionField(question, `section${sectionIdx}_q${qIdx}`)}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `).join('') : ''}

      <div class="form-actions">
        <button type="submit" class="btn-submit">Enviar Avaliação</button>
      </div>
    </form>

    <div id="successMessage" class="success-message" style="display: none;">
      <div class="success-icon">✓</div>
      <h3>Avaliação Enviada com Sucesso!</h3>
      <p>Obrigado por sua participação.</p>
    </div>
  </div>

  <script src="evaluation.js"></script>
</body>
</html>`;
};

// Gera o JavaScript da avaliação
const generateEvaluationJS = () => {
  return `
// Inicializar SCORM
let scormInitialized = false;
let startTime = new Date();

function initializeSCORM() {
  try {
    if (window.API_1484_11) {
      const result = window.API_1484_11.Initialize('');
      scormInitialized = (result === 'true' || result === true);
      
      if (scormInitialized) {
        window.API_1484_11.SetValue('cmi.completion_status', 'incomplete');
        window.API_1484_11.SetValue('cmi.success_status', 'unknown');
        window.API_1484_11.Commit('');
        console.log('SCORM inicializado com sucesso');
      }
    }
  } catch (e) {
    console.warn('Erro ao inicializar SCORM:', e);
  }
}

function calculateSessionTime() {
  const endTime = new Date();
  const milliseconds = endTime - startTime;
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  const s = seconds % 60;
  const m = minutes % 60;
  const h = hours;
  
  return 'PT' + h + 'H' + m + 'M' + s + 'S';
}

function submitToSCORM(formData) {
  if (!scormInitialized) return;
  
  try {
    // Calcular tempo de sessão
    const sessionTime = calculateSessionTime();
    window.API_1484_11.SetValue('cmi.session_time', sessionTime);
    
    // Salvar respostas como interactions
    let interactionIndex = 0;
    const formEntries = Array.from(formData.entries());
    
    formEntries.forEach(([key, value]) => {
      window.API_1484_11.SetValue(\`cmi.interactions.\${interactionIndex}.id\`, key);
      window.API_1484_11.SetValue(\`cmi.interactions.\${interactionIndex}.type\`, 'choice');
      window.API_1484_11.SetValue(\`cmi.interactions.\${interactionIndex}.learner_response\`, value);
      window.API_1484_11.SetValue(\`cmi.interactions.\${interactionIndex}.result\`, 'correct');
      interactionIndex++;
    });
    
    // Marcar como completado
    window.API_1484_11.SetValue('cmi.completion_status', 'completed');
    window.API_1484_11.SetValue('cmi.success_status', 'passed');
    window.API_1484_11.SetValue('cmi.score.raw', '100');
    
    // Commit
    window.API_1484_11.Commit('');
    
    console.log('Dados enviados ao SCORM com sucesso');
  } catch (e) {
    console.error('Erro ao enviar dados ao SCORM:', e);
  }
}

function terminateSCORM() {
  if (!scormInitialized) return;
  
  try {
    window.API_1484_11.Terminate('');
    console.log('SCORM terminado');
  } catch (e) {
    console.error('Erro ao terminar SCORM:', e);
  }
}

// Inicializar quando a página carregar
window.addEventListener('load', function() {
  initializeSCORM();
  
  const form = document.getElementById('evaluationForm');
  const successMessage = document.getElementById('successMessage');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    
    // Enviar ao SCORM
    submitToSCORM(formData);
    
    // Mostrar mensagem de sucesso
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Terminar SCORM após 2 segundos
    setTimeout(() => {
      terminateSCORM();
    }, 2000);
  });
});

// Terminar SCORM quando a janela fechar
window.addEventListener('beforeunload', function() {
  terminateSCORM();
});
`;
};

// Gera o CSS
const generateCSS = () => {
  return `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.header-intro {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: left;
}

.header-intro .greeting {
  font-weight: 600;
  margin-bottom: 10px;
}

.header-intro .intro-paragraph {
  margin-bottom: 10px;
  line-height: 1.7;
}

.header-intro .deadline {
  margin-top: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 5px;
  font-style: italic;
}

.header-intro .closing {
  margin-top: 15px;
  font-weight: 500;
  white-space: pre-line;
}

.evaluation-form {
  padding: 30px;
}

.form-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 2px solid #e5e7eb;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-header {
  margin-bottom: 25px;
}

.section-title {
  font-size: 1.75rem;
  color: #667eea;
  margin-bottom: 8px;
  font-weight: 700;
}

.section-subtitle {
  font-size: 1rem;
  color: #6b7280;
  font-style: italic;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.question-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.question-item:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  border-color: #667eea;
}

.question-header {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.question-number {
  background: #667eea;
  color: white;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  min-width: 35px;
  text-align: center;
  flex-shrink: 0;
}

.question-text {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 500;
  color: #1f2937;
}

.required-mark {
  color: #ef4444;
  margin-left: 4px;
  font-weight: bold;
}

.question-answer {
  margin-left: 45px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option,
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-option:hover,
.checkbox-option:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.radio-option input[type="radio"],
.checkbox-option input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.radio-option input[type="radio"]:checked ~ span,
.checkbox-option input[type="checkbox"]:checked ~ span {
  font-weight: 600;
  color: #667eea;
}

.scale-options {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.scale-label {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
  max-width: 150px;
  text-align: center;
}

.scale-radio {
  flex-direction: column;
  padding: 10px;
  min-width: 50px;
  border: 2px solid #e5e7eb;
  background: white;
}

.scale-radio:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.scale-radio input[type="radio"]:checked {
  accent-color: #667eea;
}

.scale-radio input[type="radio"]:checked ~ .scale-number {
  color: #667eea;
  font-weight: bold;
}

.scale-number {
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
}

.text-input,
.textarea-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.text-input:focus,
.textarea-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  margin-top: 40px;
  text-align: center;
  padding: 30px;
  background: #f9fafb;
  border-radius: 8px;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 48px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-submit:active {
  transform: translateY(0);
}

.success-message {
  text-align: center;
  padding: 60px 30px;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #10b981;
  color: white;
  font-size: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  animation: successPulse 0.6s ease;
}

@keyframes successPulse {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.success-message h3 {
  color: #10b981;
  font-size: 2rem;
  margin-bottom: 10px;
}

.success-message p {
  color: #6b7280;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  body {
    padding: 10px;
  }
  
  .header h1 {
    font-size: 1.8rem;
  }
  
  .section-title {
    font-size: 1.4rem;
  }
  
  .question-answer {
    margin-left: 0;
    margin-top: 10px;
  }
  
  .scale-options {
    flex-direction: column;
  }
  
  .scale-label {
    max-width: 100%;
  }
}
`;
};

// Função principal para gerar o pacote SCORM
export const generateSCORMPackage = async (formData) => {
  try {
    const zip = new JSZip();

    // Adicionar arquivos ao ZIP
    zip.file('imsmanifest.xml', generateManifest(formData));
    zip.file('scorm-api-wrapper.js', generateScormAPIWrapper());
    zip.file('index.html', generateHTML(formData));
    zip.file('evaluation.js', generateEvaluationJS());
    zip.file('styles.css', generateCSS());

    // Gerar o ZIP
    const content = await zip.generateAsync({ type: 'blob' });

    // Fazer download
    const fileName = `${formData.title.replace(/\s+/g, '_')}_SCORM.zip`;
    saveAs(content, fileName);

    console.log('Pacote SCORM gerado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar pacote SCORM:', error);
    alert('Erro ao gerar pacote SCORM. Verifique o console para mais detalhes.');
  }
};
