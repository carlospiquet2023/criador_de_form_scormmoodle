# 🚀 Guia Rápido de Início

Este guia irá ajudá-lo a configurar e executar o Sistema de Avaliação SCORM em menos de 5 minutos.

## ⚡ Início Rápido

### 1. Instalação (2 minutos)

Abra o PowerShell/Terminal no diretório do projeto e execute:

```powershell
# Instalar dependências
npm install
```

### 2. Executar (1 minuto)

```powershell
# Iniciar servidor de desenvolvimento
npm run dev
```

O sistema abrirá automaticamente em `http://localhost:3000`

### 3. Criar sua Primeira Avaliação (2 minutos)

1. **Preencha o cabeçalho**:
   - Título: "Avaliação do Curso XYZ"
   - Subtítulo: "Módulo 1"
   - Instituição: Sua instituição

2. **Mantenha as perguntas gerais** (já vêm pré-configuradas)

3. **Edite a primeira aula**:
   - Clique nos campos e personalize
   - Professor, tema, ementa

4. **Adicione mais aulas**:
   - Clique em "+ Adicionar Nova Aula"

5. **Salve**:
   - Clique em "Salvar"

### 4. Exportar para Moodle (1 minuto)

1. Clique em **"Exportar SCORM"**
2. Um arquivo ZIP será baixado
3. No Moodle:
   - Curso → Ativar edição
   - Adicionar atividade → Pacote SCORM
   - Faça upload do ZIP
   - Salvar

## 🎯 Comandos Principais

```powershell
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Cria versão otimizada
npm run preview      # Visualiza build de produção
```

## 📱 Testar o Sistema

### Como Editor
1. Aba "Editor" → Crie/edite avaliações

### Como Aluno
2. Aba "Visão do Aluno" → Responda avaliações

### Como Admin
3. Aba "Administração" → Veja estatísticas

## ⚙️ Configuração do Moodle

### Configurações Recomendadas:

- **Modo de exibição**: Janela nova
- **Largura**: 100%
- **Altura**: 600px
- **Tentativas permitidas**: 1
- **Nota para aprovação**: 80

## 🆘 Problemas Comuns

### Erro ao instalar
```powershell
# Limpe o cache do npm
npm cache clean --force
npm install
```

### Porta 3000 ocupada
```powershell
# Use outra porta
npm run dev -- --port 3001
```

### Pacote SCORM muito grande
- Moodle tem limite de 20MB por padrão
- Aumente em: Administração do site → Plugins → Atividades → SCORM

## 📚 Próximos Passos

1. Leia o [README.md](README.md) completo
2. Explore os exemplos
3. Personalize os estilos
4. Crie suas avaliações!

## 💡 Dicas

✅ **Salve frequentemente** - Use o botão "Salvar"  
✅ **Teste antes de exportar** - Use "Visualizar"  
✅ **Backup** - Exporte configurações regularmente  
✅ **Nomeie bem** - Títulos claros facilitam organização

---

**Dúvidas?** Consulte o README.md ou abra uma issue no GitHub.

**Pronto para começar!** 🎉
