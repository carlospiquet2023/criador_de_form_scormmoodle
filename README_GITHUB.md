# Sistema de Avaliação SCORM para Moodle

Sistema profissional completo para criação de avaliações em formato SCORM 2004, compatível com Moodle e outros LMS.

## 👨‍💻 Desenvolvedor

**Carlos Antonio de Oliveira Piquet**  
Especialista em Inteligência Artificial e Redes de Computadores

- 🔬 Especialização: Inteligência Artificial e Machine Learning
- 🌐 Especialização: Redes de Computadores e Segurança
- 📚 Expertise: E-Learning e Sistemas Educacionais

## ✨ Funcionalidades

### 📝 Editor Visual Completo
- Interface intuitiva para criação de avaliações
- Adicionar/remover perguntas dinamicamente
- Gerenciamento de múltiplas aulas
- Sistema de escalas Likert personalizáveis (1-5)
- Preview em tempo real
- Salvamento automático (LocalStorage)

### 📦 Geração de Pacotes SCORM 2004
- Totalmente compatível com Moodle 3.9+
- Geração automática de imsmanifest.xml
- SCORM API Wrapper funcional
- Tracking completo de interações
- Download automático em formato ZIP

### 👨‍🎓 Interface do Aluno
- Formulário responsivo e acessível
- Validação completa de campos
- Envio de respostas ao LMS via SCORM API
- Geração de relatório PDF individual
- Design mobile-friendly

### 📊 Painel Administrativo
- Visualização de todas as submissões
- Estatísticas consolidadas por avaliação
- Cálculo automático de médias
- Distribuição de respostas (1-5)
- Geração de relatórios PDF consolidados
- Gerenciamento de participantes

### 📄 Geração de PDFs
- Relatórios individuais completos
- Relatórios consolidados com estatísticas
- Gráficos de distribuição
- Tabelas formatadas profissionalmente
- Design corporativo

## 🚀 Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/carlospiquet2023/criador_de_form_scormmoodle.git

# 2. Entre no diretório
cd criador_de_form_scormmoodle

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O sistema abrirá automaticamente em `http://localhost:3000`

## 📖 Como Usar

### 1. Criar uma Avaliação
1. Acesse a aba "Editor"
2. Preencha título, instituição e prazo
3. Configure perguntas gerais
4. Adicione aulas e suas respectivas perguntas
5. Clique em "Salvar"

### 2. Exportar para Moodle
1. Clique em "Exportar SCORM"
2. Baixe o arquivo ZIP gerado
3. No Moodle: Curso → Adicionar atividade → Pacote SCORM
4. Faça upload do arquivo ZIP
5. Configure e salve

### 3. Ver Resultados
1. Acesse a aba "Administração"
2. Veja estatísticas consolidadas
3. Gere relatórios PDF
4. Analise distribuição de respostas

## 🛠️ Tecnologias Utilizadas

- **React 18.3** - Framework JavaScript moderno
- **Vite 5** - Build tool ultrarrápido
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **jsPDF 2.5** - Geração de documentos PDF
- **JSZip 3.10** - Compressão de arquivos
- **Lucide React** - Biblioteca de ícones
- **SCORM 2004 4th Edition** - Padrão e-learning

## 📦 Estrutura do Projeto

```
criador_de_form_scormmoodle/
├── src/
│   ├── components/
│   │   ├── SCORMEditor.jsx      # Editor de avaliações
│   │   ├── StudentView.jsx      # Interface do aluno
│   │   ├── AdminPanel.jsx       # Painel administrativo
│   │   ├── Footer.jsx           # Rodapé com créditos
│   │   ├── TermsModal.jsx       # Modal de termos de uso
│   │   └── LicenseModal.jsx     # Modal de licença MIT
│   ├── utils/
│   │   ├── scormGenerator.js    # Gerador de pacotes SCORM
│   │   ├── pdfGenerator.js      # Gerador de relatórios PDF
│   │   └── uuid.js              # Gerador de IDs únicos
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Entrada da aplicação
│   └── index.css                # Estilos globais
├── README.md                     # Este arquivo
├── LICENSE                       # Licença MIT
└── package.json                  # Dependências
```

## 📊 Compatibilidade

### LMS Testados
- ✅ Moodle 3.9+
- ✅ Moodle 4.0+
- ✅ Moodle 4.1+
- ⚠️ Outros LMS com suporte SCORM 2004

### Navegadores
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Dispositivos móveis (iOS/Android)

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork este repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

### Resumo da Licença MIT:
- ✅ Uso comercial permitido
- ✅ Modificação permitida
- ✅ Distribuição permitida
- ✅ Uso privado permitido
- ⚠️ Manter atribuição ao autor original
- ⚠️ Incluir cópia da licença

## 🎯 Roadmap

### Versão 1.1.0 (Planejado)
- [ ] Importação de avaliações de JSON/CSV
- [ ] Templates de perguntas pré-configurados
- [ ] Modo escuro
- [ ] Mais tipos de perguntas

### Versão 1.2.0 (Planejado)
- [ ] Exportação para Excel
- [ ] Gráficos interativos
- [ ] Dashboard avançado
- [ ] API REST

### Versão 2.0.0 (Futuro)
- [ ] Suporte multi-idioma
- [ ] Temas customizáveis
- [ ] Integração com Google Forms
- [ ] Backend opcional com banco de dados

## 📧 Contato e Suporte

- **GitHub Issues**: [Reportar problemas](https://github.com/carlospiquet2023/criador_de_form_scormmoodle/issues)
- **GitHub Discussions**: [Discussões e perguntas](https://github.com/carlospiquet2023/criador_de_form_scormmoodle/discussions)
- **Desenvolvedor**: Carlos Antonio de Oliveira Piquet

## 🌟 Agradecimentos

- Comunidade React
- Projeto SCORM.com pela documentação
- Moodle.org pela plataforma LMS
- Todos os contribuidores e usuários

## 📈 Status do Projeto

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-18.3-61dafb.svg)
![SCORM](https://img.shields.io/badge/SCORM-2004%204th%20Ed-orange.svg)

---

**Desenvolvido com ❤️ por Carlos Antonio de Oliveira Piquet**  
**Especialista em Inteligência Artificial e Redes de Computadores**

© 2025 - Todos os direitos reservados
