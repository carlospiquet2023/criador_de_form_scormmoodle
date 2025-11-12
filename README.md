# 🎓 Sistema de Avaliação SCORM para Moodle

Sistema completo e profissional para criação, edição e gerenciamento de avaliações em formato SCORM 2004, compatível com Moodle e outros LMS.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-18.3-61dafb.svg)
![SCORM](https://img.shields.io/badge/SCORM-2004%204th%20Ed-orange.svg)

## ✨ Características Principais

### 📝 Editor Visual Completo
- ✅ Interface intuitiva e moderna
- ✅ Adicionar/remover perguntas dinamicamente
- ✅ Gerenciar múltiplas aulas
- ✅ Sistema de perguntas com escala Likert (1-5)
- ✅ Preview em tempo real
- ✅ Salvamento automático no LocalStorage

### 📦 Geração de Pacotes SCORM
- ✅ Compatível com SCORM 2004 4th Edition
- ✅ Totalmente compatível com Moodle
- ✅ Geração de pacote ZIP pronto para upload
- ✅ Inclui imsmanifest.xml completo
- ✅ API SCORM implementada
- ✅ Tracking de progresso e respostas

### 👨‍🎓 Interface do Aluno
- ✅ Formulário responsivo e acessível
- ✅ Validação de campos
- ✅ Envio de respostas ao LMS
- ✅ Geração de relatório PDF individual
- ✅ Confirmação visual de envio

### 📊 Painel Administrativo
- ✅ Visualização de todas as submissões
- ✅ Estatísticas consolidadas
- ✅ Médias por pergunta
- ✅ Distribuição de respostas
- ✅ Geração de relatórios consolidados em PDF
- ✅ Exportação de dados

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ e npm/yarn
- Navegador moderno (Chrome, Firefox, Edge, Safari)

### Passo a Passo

```bash
# 1. Clone ou navegue até o diretório
cd froms_moodle

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Abra no navegador
# http://localhost:3000
```

## 📖 Como Usar

### 1️⃣ Criar uma Avaliação

1. **Acesse o Editor** - Clique na aba "Editor" no topo
2. **Preencha as informações básicas**:
   - Título da avaliação
   - Subtítulo
   - Instituição
   - Data limite (opcional)

3. **Configure as Perguntas Gerais**:
   - Clique em "Adicionar Pergunta" para criar novas
   - Edite o texto da pergunta
   - Defina os rótulos da escala (mínimo e máximo)
   - Remova perguntas desnecessárias

4. **Adicione Aulas**:
   - Clique em "Adicionar Nova Aula"
   - Preencha título, tema, professor e ementa
   - Configure as perguntas de avaliação da aula
   - Adicione ou remova perguntas conforme necessário

5. **Salve a Avaliação** - Clique em "Salvar"

### 2️⃣ Visualizar e Testar

1. Clique em "Visualizar" para ver como os alunos verão o formulário
2. Teste o fluxo completo de resposta
3. Retorne à edição clicando em "Editar"

### 3️⃣ Exportar para Moodle

1. **Exportar SCORM**:
   - Clique em "Exportar SCORM"
   - Um arquivo ZIP será baixado

2. **Upload no Moodle**:
   ```
   Moodle > Curso > Ativar edição > Adicionar uma atividade ou recurso
   > Pacote SCORM > Escolher arquivo > Upload do ZIP gerado
   > Salvar e exibir
   ```

3. **Configurações Recomendadas no Moodle**:
   - **Modo de exibição**: Janela nova
   - **Largura**: 100%
   - **Altura**: 600px (ou maior)
   - **Tentativas**: 1 (ou conforme necessário)
   - **Nota para aprovação**: 80%

### 4️⃣ Testar como Aluno

1. **No Sistema (Desenvolvimento)**:
   - Clique em "Visão do Aluno"
   - Selecione uma avaliação
   - Preencha os dados do aluno
   - Responda todas as perguntas
   - Clique em "Enviar Avaliação"
   - Baixe o relatório PDF

2. **No Moodle (Produção)**:
   - Alunos acessam a atividade SCORM
   - Preenchem o formulário
   - Enviam as respostas
   - O LMS registra automaticamente

### 5️⃣ Acompanhar Resultados

1. **No Sistema**:
   - Acesse "Administração"
   - Veja estatísticas consolidadas
   - Gere relatórios PDF
   - Visualize todas as submissões

2. **No Moodle**:
   ```
   Curso > Atividade SCORM > Relatórios
   > Ver relatório detalhado de tentativas
   ```

## 🏗️ Estrutura do Projeto

```
froms_moodle/
├── src/
│   ├── components/
│   │   ├── SCORMEditor.jsx      # Editor de avaliações
│   │   ├── StudentView.jsx      # Interface do aluno
│   │   └── AdminPanel.jsx       # Painel administrativo
│   ├── utils/
│   │   ├── scormGenerator.js    # Gerador de pacotes SCORM
│   │   ├── pdfGenerator.js      # Gerador de relatórios PDF
│   │   └── uuid.js              # Gerador de IDs únicos
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Entrada da aplicação
│   └── index.css                # Estilos globais
├── public/                       # Arquivos estáticos
├── index.html                   # HTML principal
├── package.json                 # Dependências
├── vite.config.js               # Configuração Vite
├── tailwind.config.js           # Configuração Tailwind
└── README.md                    # Esta documentação
```

## 📦 Conteúdo do Pacote SCORM

Quando você exporta, o sistema gera um ZIP contendo:

```
scorm_package.zip
├── imsmanifest.xml           # Manifesto SCORM 2004
├── metadata.xml              # Metadados LOM
├── index.html                # Página principal
├── scorm-api-wrapper.js      # Wrapper da API SCORM
├── evaluation.js             # Lógica do formulário
├── styles.css                # Estilos da avaliação
└── config.json               # Configuração da avaliação
```

## 🎨 Personalização

### Cores e Tema

Edite `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3b82f6',  // Azul principal
        600: '#2563eb',  // Azul escuro
        // ...
      }
    }
  }
}
```

### Estilos do SCORM

Edite `src/utils/scormGenerator.js` na função `generateCSS()` para customizar a aparência do formulário exportado.

## 🔧 Tecnologias Utilizadas

- **React 18.3** - Framework JavaScript
- **Vite 5** - Build tool e dev server
- **Tailwind CSS 3.4** - Framework CSS
- **jsPDF 2.5** - Geração de PDFs
- **JSZip 3.10** - Compressão de arquivos
- **Lucide React** - Ícones modernos
- **SCORM 2004 4th Edition** - Padrão e-learning

## 📊 Compatibilidade

### LMS Testados
- ✅ Moodle 3.9+
- ✅ Moodle 4.0+
- ⚠️ Outros LMS com suporte SCORM 2004

### Navegadores
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🐛 Solução de Problemas

### Pacote SCORM não carrega no Moodle

**Problema**: Erro ao fazer upload ou atividade não abre.

**Solução**:
1. Verifique se o arquivo ZIP não está corrompido
2. Confirme que o Moodle suporta SCORM 2004
3. Aumente o limite de upload do PHP se necessário:
   ```php
   upload_max_filesize = 20M
   post_max_size = 20M
   ```

### Respostas não são salvas

**Problema**: Dados não aparecem nos relatórios do Moodle.

**Solução**:
1. Verifique se a API SCORM está sendo inicializada (console do navegador)
2. Confirme que o aluno clicou em "Enviar Avaliação"
3. Verifique as configurações de rastreamento do SCORM no Moodle

### PDF não baixa

**Problema**: Erro ao gerar relatório PDF.

**Solução**:
1. Limpe o cache do navegador
2. Verifique se o bloqueador de pop-ups está desativado
3. Teste em modo anônimo/privado

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] Importar avaliações de JSON/CSV
- [ ] Templates de perguntas pré-configurados
- [ ] Suporte a questões dissertativas
- [ ] Gráficos interativos de estatísticas
- [ ] Exportação para Excel
- [ ] Tradução para inglês e espanhol
- [ ] Temas customizáveis
- [ ] Integração com Google Forms
- [ ] API REST para integração externa

## 📧 Suporte

Para dúvidas, sugestões ou reportar bugs:
- 📧 Email: suporte@example.com
- 💬 Issues: [GitHub Issues](https://github.com/seu-usuario/scorm-evaluation/issues)

## 🌟 Agradecimentos

- Comunidade React
- Projeto SCORM.com pela documentação
- Moodle.org pela plataforma

---

Desenvolvido com ❤️ para facilitar a avaliação educacional

**Versão:** 1.0.0  
**Última atualização:** Novembro 2025
