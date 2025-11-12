# 📖 Guia Completo de Upload SCORM no Moodle

Este guia detalha passo a passo como fazer upload e configurar pacotes SCORM gerados pelo sistema no Moodle.

## 📋 Pré-requisitos

- ✅ Acesso ao Moodle como Professor ou Administrador
- ✅ Pacote SCORM (.zip) gerado pelo sistema
- ✅ Curso criado no Moodle

## 🚀 Passo a Passo Completo

### 1️⃣ Preparar o Pacote SCORM

1. **Gere o pacote** no Sistema de Avaliação:
   - Abra o editor
   - Configure sua avaliação
   - Clique em "Exportar SCORM"
   - Salve o arquivo `.zip` gerado

2. **Verifique o arquivo**:
   - Nome: `scorm_avaliacao_xxxxx.zip`
   - Tamanho: Geralmente < 5MB
   - **NÃO descompacte o arquivo!**

### 2️⃣ Acessar o Curso no Moodle

1. Faça login no Moodle
2. Navegue até o curso desejado
3. Clique em **"Ativar edição"** (canto superior direito)

### 3️⃣ Adicionar Atividade SCORM

1. Na seção desejada, clique em **"Adicionar uma atividade ou recurso"**

2. Selecione **"Pacote SCORM"** na lista de atividades

3. Clique em **"Adicionar"**

### 4️⃣ Configurações Gerais

#### Nome e Descrição
```
Nome: Avaliação do Módulo 1
Descrição: Avaliação de satisfação sobre o módulo...
☑ Exibir descrição na página do curso
```

#### Arquivo do Pacote
1. Clique em **"Escolher arquivo"** ou arraste o ZIP
2. Selecione o arquivo `.zip` gerado
3. Clique em **"Enviar este arquivo"**
4. Aguarde o upload (barra de progresso)

### 5️⃣ Configurações de Aparência

```
Modo de exibição: Janela nova
Largura da janela: 100%
Altura da janela: 600 (ou mais)
☑ Permitir que a atividade seja redimensionada
☐ Usar modo tela cheia (opcional)
```

### 6️⃣ Configurações de Disponibilidade

```
☑ Disponível
☐ Exibir na página inicial do curso (opcional)

Datas:
- Permitir a partir de: [Data de início]
- Prazo: [Data limite]
```

### 7️⃣ Configurações de Nota

```
Nota máxima: 100
Método de avaliação: Situação de aprovação

☑ Rastrear tentativas
☐ Forçar conclusão
☐ Forçar nova tentativa
```

### 8️⃣ Configurações de Tentativas

```
Número de tentativas: 1 (ou conforme necessário)
Nota para aprovação: 80

☑ Exigir pontuação mínima
☐ Mostrar blocos durante tentativa SCORM
```

### 9️⃣ Configurações Avançadas (Opcional)

```
Opções de rastreamento:
☑ Rastrear status da lição
☑ Rastrear pontuação
☑ Rastrear interações

Auto-continuar: Não
Auto-commit: Não
```

### 🔟 Salvar e Testar

1. **Salvar**:
   - Role até o final
   - Clique em **"Salvar e exibir"**

2. **Testar como Professor**:
   - A atividade será aberta
   - Teste o formulário completo
   - Verifique se todas as perguntas aparecem

3. **Testar como Aluno** (Recomendado):
   - Use o recurso "Mudar papel para..." → Aluno
   - Ou peça a um aluno teste real
   - Complete a avaliação
   - Verifique se os dados são salvos

## 🔍 Verificar se Funcionou

### ✅ Checklist Pós-Upload

- [ ] Atividade aparece no curso
- [ ] Ao clicar, abre em nova janela
- [ ] Formulário carrega completamente
- [ ] Todas as perguntas estão visíveis
- [ ] É possível selecionar respostas
- [ ] Botão "Enviar Avaliação" funciona
- [ ] Mensagem de sucesso aparece
- [ ] Dados aparecem nos relatórios do Moodle

### 📊 Ver Relatórios

1. **Como Professor**:
   ```
   Curso → Atividade SCORM → Engrenagem (⚙️)
   → Relatórios → Ver relatório detalhado de tentativas
   ```

2. **Ver dados de um aluno**:
   - Clique no nome do aluno
   - Veja todas as respostas registradas

## ⚠️ Problemas Comuns e Soluções

### Problema 1: "Erro ao fazer upload do arquivo"

**Causa**: Arquivo muito grande ou tipo incorreto

**Solução**:
1. Verifique o tamanho do arquivo (< 20MB)
2. Certifique-se que é um arquivo `.zip`
3. Aumente o limite de upload do Moodle:
   ```
   Administração do site → Servidor → PHP
   upload_max_filesize = 20M
   post_max_size = 20M
   ```

### Problema 2: "Atividade não abre ou fica em branco"

**Causa**: Bloqueador de pop-ups ou configuração incorreta

**Solução**:
1. Desative bloqueador de pop-ups para o Moodle
2. Use navegador compatível (Chrome, Firefox, Edge)
3. Verifique configurações de "Modo de exibição"

### Problema 3: "Dados não são salvos"

**Causa**: Problema com API SCORM ou configurações

**Solução**:
1. Verifique console do navegador (F12) para erros
2. Confirme que "Rastrear tentativas" está ativado
3. Teste com outro navegador
4. Regenere o pacote SCORM

### Problema 4: "Formulário aparece cortado"

**Causa**: Altura da janela insuficiente

**Solução**:
1. Edite a atividade
2. Aumente "Altura da janela" para 700 ou 800
3. Marque "Permitir redimensionar"

## 🔧 Configurações Específicas do Moodle

### Para Moodle 3.9+

```
Aparência:
- Modo de exibição: Janela nova
- Largura: 100%
- Altura: 600
- Opções da janela: status=no,toolbar=no,menubar=no
```

### Para Moodle 4.0+

```
Aparência:
- Modo de exibição: Nova janela
- Dimensões: 100% x 600px
- Interface do usuário: Moderna
```

## 📱 Compatibilidade Mobile

O formulário é responsivo e funciona em dispositivos móveis:

- ✅ Smartphones (iOS, Android)
- ✅ Tablets
- ✅ Desktop

**Dica**: Teste em diferentes dispositivos antes de liberar aos alunos.

## 🎯 Melhores Práticas

### Antes do Upload
1. ✅ Teste no sistema local
2. ✅ Revise todas as perguntas
3. ✅ Valide o preview
4. ✅ Salve uma cópia de backup

### Durante o Upload
1. ✅ Use nomes descritivos
2. ✅ Configure datas adequadas
3. ✅ Defina número correto de tentativas
4. ✅ Teste como aluno

### Após o Upload
1. ✅ Teste com aluno real
2. ✅ Monitore relatórios
3. ✅ Colete feedback
4. ✅ Ajuste conforme necessário

## 📞 Suporte Adicional

Se problemas persistirem:

1. **Administrador Moodle**: Verifique logs do servidor
2. **Suporte Técnico**: Entre em contato com TI
3. **Comunidade Moodle**: [moodle.org/forums](https://moodle.org/forums)
4. **GitHub Issues**: Reporte bugs específicos do sistema

## 📚 Recursos Adicionais

- [Documentação Oficial Moodle SCORM](https://docs.moodle.org/pt_br/SCORM)
- [SCORM 2004 Specification](https://adlnet.gov/projects/scorm/)
- [Moodle SCORM FAQ](https://docs.moodle.org/pt_br/FAQ_do_SCORM)

---

**Última atualização**: Novembro 2025  
**Versão do Guia**: 1.0  
**Compatibilidade**: Moodle 3.9 - 4.3+

✅ **Pronto!** Seu pacote SCORM está no ar e funcionando! 🎉
