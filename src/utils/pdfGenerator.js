import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Gerar PDF individual do aluno
export const generatePDFReport = async (evaluation, studentInfo, responses) => {
  const doc = new jsPDF();
  
  // Configurar fonte
  doc.setFont('helvetica');
  
  // Cabeçalho
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('Relatório de Avaliação', 105, 15, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(evaluation.title, 105, 25, { align: 'center' });
  
  if (evaluation.subtitle) {
    doc.setFontSize(11);
    doc.text(evaluation.subtitle, 105, 32, { align: 'center' });
  }
  
  // Reset cor
  doc.setTextColor(0, 0, 0);
  
  let yPosition = 50;
  
  // Informações do aluno
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informações do Aluno', 14, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${studentInfo.name}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Email: ${studentInfo.email}`, 14, yPosition);
  yPosition += 6;
  if (studentInfo.class) {
    doc.text(`Turma: ${studentInfo.class}`, 14, yPosition);
    yPosition += 6;
  }
  if (studentInfo.registrationNumber) {
    doc.text(`Matrícula: ${studentInfo.registrationNumber}`, 14, yPosition);
    yPosition += 6;
  }
  doc.text(`Data de Submissão: ${new Date().toLocaleString('pt-BR')}`, 14, yPosition);
  yPosition += 12;
  
  // Perguntas Gerais
  if (evaluation.generalQuestions.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Perguntas Gerais do Módulo', 14, yPosition);
    yPosition += 8;
    
    const generalData = evaluation.generalQuestions.map((q, idx) => {
      const response = responses[`general_${q.id}`] || 'N/A';
      return [
        `${idx + 1}. ${q.text}`,
        `${response}/5`,
        `${q.scaleLabels[0]} → ${q.scaleLabels[1]}`
      ];
    });
    
    doc.autoTable({
      startY: yPosition,
      head: [['Pergunta', 'Resposta', 'Escala']],
      body: generalData,
      theme: 'striped',
      headStyles: { fillColor: [102, 126, 234] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 110 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 50 }
      }
    });
    
    yPosition = doc.lastAutoTable.finalY + 12;
  }
  
  // Avaliação por Aula
  evaluation.classes.forEach((classItem, classIdx) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${classItem.title} - ${classItem.theme}`, 14, yPosition);
    yPosition += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Professor(a): ${classItem.professor}`, 14, yPosition);
    yPosition += 8;
    
    const classData = classItem.questions.map((q, qIdx) => {
      const response = responses[`class${classItem.id}_${q.id}`] || 'N/A';
      return [
        q.text,
        `${response}/5`,
        `${q.scaleLabels[0]} → ${q.scaleLabels[1]}`
      ];
    });
    
    doc.autoTable({
      startY: yPosition,
      head: [['Pergunta', 'Resposta', 'Escala']],
      body: classData,
      theme: 'striped',
      headStyles: { fillColor: [102, 126, 234] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 110 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 50 }
      }
    });
    
    yPosition = doc.lastAutoTable.finalY + 12;
  });
  
  // Rodapé
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    if (evaluation.institution) {
      doc.text(
        evaluation.institution,
        105,
        doc.internal.pageSize.height - 5,
        { align: 'center' }
      );
    }
  }
  
  // Salvar PDF
  const fileName = `relatorio_${studentInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`;
  doc.save(fileName);
  
  return fileName;
};

// Gerar relatório consolidado (Admin)
export const generateConsolidatedReport = async (evaluation, submissions, statistics) => {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('Relatório Consolidado', 105, 15, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(evaluation.title, 105, 25, { align: 'center' });
  
  if (evaluation.subtitle) {
    doc.setFontSize(11);
    doc.text(evaluation.subtitle, 105, 32, { align: 'center' });
  }
  
  doc.setFontSize(10);
  doc.text(`Total de Respostas: ${statistics.totalResponses}`, 105, 39, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  
  let yPosition = 55;
  
  // Estatísticas Gerais
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Estatísticas - Perguntas Gerais', 14, yPosition);
  yPosition += 8;
  
  if (evaluation.generalQuestions.length > 0) {
    const generalStats = evaluation.generalQuestions.map((q, idx) => {
      const avg = statistics.averages[`general_${q.id}`] || 'N/A';
      const dist = statistics.distribution[`general_${q.id}`] || [0, 0, 0, 0, 0];
      return [
        `${idx + 1}. ${q.text.substring(0, 60)}...`,
        avg,
        dist.map((count, i) => `${i + 1}:${count}`).join(' | ')
      ];
    });
    
    doc.autoTable({
      startY: yPosition,
      head: [['Pergunta', 'Média', 'Distribuição (1-5)']],
      body: generalStats,
      theme: 'grid',
      headStyles: { fillColor: [102, 126, 234] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 75 }
      }
    });
    
    yPosition = doc.lastAutoTable.finalY + 12;
  }
  
  // Estatísticas por Aula
  evaluation.classes.forEach((classItem, classIdx) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${classItem.title} - ${classItem.theme}`, 14, yPosition);
    yPosition += 6;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Professor(a): ${classItem.professor}`, 14, yPosition);
    yPosition += 8;
    
    const classStats = classItem.questions.map((q, qIdx) => {
      const key = `class${classItem.id}_${q.id}`;
      const avg = statistics.averages[key] || 'N/A';
      const dist = statistics.distribution[key] || [0, 0, 0, 0, 0];
      return [
        q.text,
        avg,
        dist.map((count, i) => `${i + 1}:${count}`).join(' | ')
      ];
    });
    
    doc.autoTable({
      startY: yPosition,
      head: [['Pergunta', 'Média', 'Distribuição (1-5)']],
      body: classStats,
      theme: 'grid',
      headStyles: { fillColor: [102, 126, 234] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 75 }
      }
    });
    
    yPosition = doc.lastAutoTable.finalY + 12;
  });
  
  // Nova página para lista de participantes
  doc.addPage();
  yPosition = 20;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Lista de Participantes', 14, yPosition);
  yPosition += 8;
  
  const participantsData = submissions.map((sub, idx) => [
    idx + 1,
    sub.studentInfo.name,
    sub.studentInfo.email,
    sub.studentInfo.class || '-',
    new Date(sub.submittedAt).toLocaleDateString('pt-BR')
  ]);
  
  doc.autoTable({
    startY: yPosition,
    head: [['#', 'Nome', 'Email', 'Turma', 'Data']],
    body: participantsData,
    theme: 'striped',
    headStyles: { fillColor: [102, 126, 234] },
    styles: { fontSize: 8 }
  });
  
  // Rodapé
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      105,
      doc.internal.pageSize.height - 5,
      { align: 'center' }
    );
  }
  
  // Salvar PDF
  const fileName = `relatorio_consolidado_${evaluation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`;
  doc.save(fileName);
  
  return fileName;
};

export default { generatePDFReport, generateConsolidatedReport };
