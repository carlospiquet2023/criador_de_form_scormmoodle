import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Gera o arquivo imsmanifest.xml
const generateManifest = (formData) => {
  const timestamp = new Date().toISOString();
  
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
    <adlcp:location>metadata.xml</adlcp:location>
  </metadata>
  <organizations default="ORG-001">
    <organization identifier="ORG-001">
      <title>${escapeXml(formData.title)}</title>
      <item identifier="ITEM-001" identifierref="RES-001">
        <title>${escapeXml(formData.subtitle || formData.title)}</title>
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
      <file href="config.json"/>
    </resource>
  </resources>
</manifest>`;
};

// Gera o arquivo metadata.xml
const generateMetadata = (formData) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<lom xmlns="http://ltsc.ieee.org/xsd/LOM"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://ltsc.ieee.org/xsd/LOM lom.xsd">
  <general>
    <title>
      <string language="pt-BR">${escapeXml(formData.title)}</string>
    </title>
    <description>
      <string language="pt-BR">${escapeXml(formData.subtitle || '')}</string>
    </description>
    <language>pt-BR</language>
  </general>
  <lifecycle>
    <status>
      <source>LOMv1.0</source>
      <value>Final</value>
    </status>
  </lifecycle>
  <technical>
    <format>text/html</format>
  </technical>
  <educational>
    <learningResourceType>
      <source>LOMv1.0</source>
      <value>questionnaire</value>
    </learningResourceType>
  </educational>
</lom>`;
};

// Gera o wrapper da API SCORM
const generateScormAPIWrapper = () => {
  return `/**
 * SCORM 2004 API Wrapper
 * Adaptado para funcionar com LMS Moodle
 */

var API_1484_11 = {
  initialized: false,
  terminated: false,
  data: {},
  
  Initialize: function(parameter) {
    if (this.initialized) {
      this.SetValue('cmi.core.lesson_status', 'incomplete');
      return 'false';
    }
    this.initialized = true;
    this.data = {
      'cmi.completion_status': 'incomplete',
      'cmi.success_status': 'unknown',
      'cmi.exit': '',
      'cmi.score.raw': '0',
      'cmi.score.min': '0',
      'cmi.score.max': '100',
      'cmi.session_time': 'PT0H0M0S'
    };
    return 'true';
  },
  
  Terminate: function(parameter) {
    if (!this.initialized || this.terminated) {
      return 'false';
    }
    this.terminated = true;
    return 'true';
  },
  
  GetValue: function(element) {
    if (!this.initialized || this.terminated) {
      return '';
    }
    return this.data[element] || '';
  },
  
  SetValue: function(element, value) {
    if (!this.initialized || this.terminated) {
      return 'false';
    }
    this.data[element] = value;
    
    // Salvar no localStorage como backup
    try {
      localStorage.setItem('scorm_data_' + element, value);
    } catch(e) {
      console.warn('Não foi possível salvar no localStorage:', e);
    }
    
    return 'true';
  },
  
  Commit: function(parameter) {
    if (!this.initialized || this.terminated) {
      return 'false';
    }
    // Aqui seria feito o envio ao LMS
    console.log('SCORM Data committed:', this.data);
    return 'true';
  },
  
  GetLastError: function() {
    return '0';
  },
  
  GetErrorString: function(errorCode) {
    return 'No error';
  },
  
  GetDiagnostic: function(errorCode) {
    return 'No diagnostic available';
  }
};

// Tentar encontrar a API no parent/opener
function findAPI(win) {
  var attempts = 0;
  var maxAttempts = 500;
  
  while (win.API_1484_11 == null && win.parent != null && win.parent != win && attempts < maxAttempts) {
    attempts++;
    win = win.parent;
  }
  
  return win.API_1484_11;
}

// Procurar API no window ou usar fallback
var scormAPI = findAPI(window);
if (!scormAPI && window.opener) {
  scormAPI = findAPI(window.opener);
}
if (!scormAPI) {
  console.warn('SCORM API não encontrada. Usando implementação local.');
  scormAPI = API_1484_11;
}

// Expor globalmente
window.API_1484_11 = scormAPI;
`;
};

// Gera o arquivo HTML principal
const generateHTML = (formData) => {
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
      <h2>${escapeHtml(formData.subtitle || '')}</h2>
      <p class="institution">${escapeHtml(formData.institution || '')}</p>
      ${formData.deadline ? `<p class="deadline"><strong>Prazo:</strong> ${escapeHtml(formData.deadline)}</p>` : ''}
    </header>

    <form id="evaluationForm" class="evaluation-form">
      <!-- Informações do Aluno -->
      <section class="student-info">
        <h3>Informações do Aluno</h3>
        <div class="form-grid">
          <div class="form-group">
            <label for="studentName">Nome Completo *</label>
            <input type="text" id="studentName" name="studentName" required>
          </div>
          <div class="form-group">
            <label for="studentEmail">Email *</label>
            <input type="email" id="studentEmail" name="studentEmail" required>
          </div>
          <div class="form-group">
            <label for="studentClass">Turma</label>
            <input type="text" id="studentClass" name="studentClass">
          </div>
          <div class="form-group">
            <label for="studentRegistration">Matrícula</label>
            <input type="text" id="studentRegistration" name="studentRegistration">
          </div>
        </div>
      </section>

      ${formData.generalQuestions.length > 0 ? `
      <!-- Perguntas Gerais -->
      <section class="general-questions">
        <h3>Perguntas Gerais do Módulo</h3>
        ${formData.generalQuestions.map((q, idx) => `
        <div class="question-item">
          <p class="question-text">${idx + 1}. ${escapeHtml(q.text)}</p>
          <div class="scale-options">
            <span class="scale-label">${escapeHtml(q.scaleLabels[0])}</span>
            ${[1, 2, 3, 4, 5].map(val => `
            <label class="radio-option">
              <input type="radio" name="general_${q.id}" value="${val}" required>
              <span>${val}</span>
            </label>
            `).join('')}
            <span class="scale-label">${escapeHtml(q.scaleLabels[1])}</span>
          </div>
        </div>
        `).join('')}
      </section>
      ` : ''}

      ${formData.classes.map((classItem, classIdx) => `
      <!-- Aula ${classIdx + 1} -->
      <section class="class-section">
        <h3>${escapeHtml(classItem.title)}</h3>
        <h4>${escapeHtml(classItem.theme)}</h4>
        <p class="professor"><strong>Professor(a):</strong> ${escapeHtml(classItem.professor)}</p>
        <p class="syllabus">${escapeHtml(classItem.syllabus)}</p>
        
        <div class="class-questions">
          ${classItem.questions.map((q, qIdx) => `
          <div class="question-item">
            <p class="question-text">${escapeHtml(q.text)}</p>
            <div class="scale-options">
              <span class="scale-label">${escapeHtml(q.scaleLabels[0])}</span>
              ${[1, 2, 3, 4, 5].map(val => `
              <label class="radio-option">
                <input type="radio" name="class${classItem.id}_q${q.id}" value="${val}" required>
                <span>${val}</span>
              </label>
              `).join('')}
              <span class="scale-label">${escapeHtml(q.scaleLabels[1])}</span>
            </div>
          </div>
          `).join('')}
        </div>
      </section>
      `).join('')}

      <div class="form-actions">
        <button type="submit" class="btn-submit">Enviar Avaliação</button>
      </div>
    </form>

    <div id="successMessage" class="success-message" style="display: none;">
      <h3>✓ Avaliação Enviada com Sucesso!</h3>
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
    
    // Salvar dados do aluno
    window.API_1484_11.SetValue('cmi.learner_name', formData.get('studentName'));
    
    // Salvar respostas como interactions
    let interactionIndex = 0;
    const formEntries = Array.from(formData.entries());
    
    formEntries.forEach(([key, value]) => {
      if (key.startsWith('general_') || key.startsWith('class')) {
        const interactionId = \`interaction_\${interactionIndex}\`;
        window.API_1484_11.SetValue(\`cmi.interactions.\${interactionIndex}.id\`, key);
        window.API_1484_11.SetValue(\`cmi.interactions.\${interactionIndex}.type\`, 'choice');
        window.API_1484_11.SetValue(\`cmi.interactions.\${interactionIndex}.learner_response\`, value);
        window.API_1484_11.SetValue(\`cmi.interactions.\${interactionIndex}.result\`, 'correct');
        interactionIndex++;
      }
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
    
    // Salvar localmente também
    const responses = {};
    formData.forEach((value, key) => {
      responses[key] = value;
    });
    
    try {
      localStorage.setItem('evaluation_responses', JSON.stringify(responses));
      localStorage.setItem('evaluation_submitted_at', new Date().toISOString());
    } catch (e) {
      console.warn('Não foi possível salvar localmente:', e);
    }
  });
});

// Terminar SCORM ao sair
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
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
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.header h2 {
  font-size: 1.3rem;
  font-weight: 400;
  margin-bottom: 15px;
  opacity: 0.95;
}

.institution {
  font-size: 0.9rem;
  opacity: 0.9;
}

.deadline {
  margin-top: 10px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.2);
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
}

.evaluation-form {
  padding: 30px;
}

section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
}

section:last-child {
  border-bottom: none;
}

h3 {
  font-size: 1.5rem;
  color: #667eea;
  margin-bottom: 20px;
}

.student-info h3 {
  color: #333;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
}

.form-group input {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.class-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 25px;
  border-radius: 12px;
  border: none;
}

.class-section h3 {
  color: #333;
  font-size: 1.3rem;
}

.class-section h4 {
  color: #667eea;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.professor {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 8px;
}

.syllabus {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.class-questions {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.question-item {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.question-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.question-text {
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
  font-size: 1rem;
}

.scale-options {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.scale-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
  min-width: 120px;
}

.radio-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: transform 0.2s;
}

.radio-option:hover {
  transform: scale(1.1);
}

.radio-option input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.radio-option span {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
}

.form-actions {
  text-align: center;
  padding-top: 20px;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 50px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-submit:active {
  transform: translateY(0);
}

.success-message {
  padding: 60px 30px;
  text-align: center;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.success-message h3 {
  font-size: 2rem;
  color: white;
  margin-bottom: 15px;
}

.success-message p {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .scale-options {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .scale-label {
    width: 100%;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
  
  .header h2 {
    font-size: 1.1rem;
  }
}
`;
};

// Helpers
const escapeXml = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const escapeHtml = (str) => {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// Função principal para gerar o pacote SCORM
export const generateSCORMPackage = async (formData) => {
  const zip = new JSZip();
  
  // Adicionar arquivos ao ZIP
  zip.file('imsmanifest.xml', generateManifest(formData));
  zip.file('metadata.xml', generateMetadata(formData));
  zip.file('index.html', generateHTML(formData));
  zip.file('scorm-api-wrapper.js', generateScormAPIWrapper());
  zip.file('evaluation.js', generateEvaluationJS());
  zip.file('styles.css', generateCSS());
  zip.file('config.json', JSON.stringify(formData, null, 2));
  
  // Gerar o arquivo ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  
  // Download
  const fileName = `scorm_${formData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.zip`;
  saveAs(blob, fileName);
  
  return fileName;
};

export default generateSCORMPackage;
