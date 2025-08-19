/**
 * SGPR - Relatórios e Fichas JavaScript
 * Funcionalidades para geração de relatórios e fichas PDF
 */

let reportsData = {
    animals: [],
    reproduction: [],
    weighing: [],
    financial: []
};

// Inicializar página de relatórios
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    
    initReportsPage();
});

async function initReportsPage() {
    try {
        Utils.showLoading(true);
        
        // Carregar dados para relatórios
        await loadReportsData();
        
        // Configurar event listeners
        setupReportsEventListeners();
        
        // Gerar relatórios iniciais
        await updateReports();
        
    } catch (error) {
        console.error('Erro ao inicializar página de relatórios:', error);
        Utils.showNotification('Erro ao carregar dados dos relatórios', 'error');
    } finally {
        Utils.showLoading(false);
    }
}

// Carregar dados para relatórios
async function loadReportsData() {
    try {
        const userData = Auth.getCurrentUser();
        if (!userData) return;
        
        // Carregar dados mock
        reportsData.animals = await loadMockAnimalsData();
        reportsData.reproduction = await loadMockReproductionData();
        reportsData.weighing = await loadMockWeighingData();
        
    } catch (error) {
        console.error('Erro ao carregar dados dos relatórios:', error);
        throw error;
    }
}

// Dados mock para relatórios
async function loadMockAnimalsData() {
    return [
        {
            numero: '001',
            nome: 'Estrela',
            sexo: 'Fêmea',
            raca: 'Nelore',
            dataNascimento: '2022-03-15',
            pesoNascimento: 32.5,
            pesoAtual: 285.0,
            gmd: 1.2,
            previsaoAbate: '2025-03-15'
        },
        {
            numero: '002',
            nome: 'Touro Forte',
            sexo: 'Macho',
            raca: 'Angus',
            dataNascimento: '2021-08-20',
            pesoNascimento: 38.0,
            pesoAtual: 450.0,
            gmd: 1.5,
            previsaoAbate: '2024-12-20'
        },
        {
            numero: '003',
            nome: 'Bonita',
            sexo: 'Fêmea',
            raca: 'Nelore',
            dataNascimento: '2022-01-10',
            pesoNascimento: 30.0,
            pesoAtual: 320.0,
            gmd: 1.3,
            previsaoAbate: '2025-01-10'
        },
        {
            numero: '004',
            nome: 'Veloz',
            sexo: 'Macho',
            raca: 'Brahman',
            dataNascimento: '2023-05-12',
            pesoNascimento: 35.0,
            pesoAtual: 180.0,
            gmd: 1.1,
            previsaoAbate: '2025-11-12'
        },
        {
            numero: '005',
            nome: 'Princesa',
            sexo: 'Fêmea',
            raca: 'Gir',
            dataNascimento: '2022-11-08',
            pesoNascimento: 28.0,
            pesoAtual: 250.0,
            gmd: 1.0,
            previsaoAbate: '2025-05-08'
        }
    ];
}

async function loadMockReproductionData() {
    return [
        {
            numero: '003',
            nome: 'Bonita',
            evento: 'Inseminação',
            dataEvento: '2024-06-15',
            partoPrevisao: '2025-03-15',
            diasParto: 45
        },
        {
            numero: '005',
            nome: 'Princesa',
            evento: 'Diagnóstico Positivo',
            dataEvento: '2024-07-20',
            partoPrevisao: '2025-04-20',
            diasParto: 81
        },
        {
            numero: '001',
            nome: 'Estrela',
            evento: 'Inseminação',
            dataEvento: '2024-08-10',
            partoPrevisao: '2025-05-10',
            diasParto: 101
        }
    ];
}

async function loadMockWeighingData() {
    return [
        { animalId: '001', peso: 285.0, data: '2024-12-01', gmd: 1.2 },
        { animalId: '002', peso: 450.0, data: '2024-12-01', gmd: 1.5 },
        { animalId: '003', peso: 320.0, data: '2024-12-01', gmd: 1.3 },
        { animalId: '004', peso: 180.0, data: '2024-12-01', gmd: 1.1 },
        { animalId: '005', peso: 250.0, data: '2024-12-01', gmd: 1.0 }
    ];
}

// Configurar event listeners
function setupReportsEventListeners() {
    // Filtro de período
    document.getElementById('reportPeriod').addEventListener('change', function() {
        const customGroups = document.querySelectorAll('[id^="customDateGroup"]');
        if (this.value === 'custom') {
            customGroups.forEach(group => group.style.display = 'block');
        } else {
            customGroups.forEach(group => group.style.display = 'none');
        }
    });
}

// Atualizar relatórios
async function updateReports() {
    try {
        Utils.showLoading(true);
        
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Gerar relatório de animais
        generateAnimalsReport();
        
        // Gerar relatório de reprodução
        generateReproductionReport();
        
        // Gerar estatísticas
        generateStatsReport();
        
        Utils.showNotification('Relatórios atualizados com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao atualizar relatórios:', error);
        Utils.showNotification('Erro ao atualizar relatórios', 'error');
    } finally {
        Utils.showLoading(false);
    }
}

// Gerar relatório de animais
function generateAnimalsReport() {
    const tbody = document.getElementById('animalsReportBody');
    
    tbody.innerHTML = reportsData.animals.map(animal => `
        <tr>
            <td><strong>${animal.numero}</strong></td>
            <td>${animal.nome}</td>
            <td>
                <i class="fas fa-${animal.sexo === 'Macho' ? 'mars' : 'venus'}" 
                   style="color: ${animal.sexo === 'Macho' ? '#2196F3' : '#E91E63'}"></i>
                ${animal.sexo}
            </td>
            <td>${animal.raca}</td>
            <td>${Utils.formatDate(animal.dataNascimento)}</td>
            <td>${animal.pesoNascimento} kg</td>
            <td>${animal.pesoAtual} kg</td>
            <td class="${animal.gmd >= 1.2 ? 'gmd-positive' : 'gmd-negative'}">
                ${animal.gmd.toFixed(2)} kg/dia
            </td>
            <td class="prediction-date">${Utils.formatDate(animal.previsaoAbate)}</td>
        </tr>
    `).join('');
}

// Gerar relatório de reprodução
function generateReproductionReport() {
    const tbody = document.getElementById('reproductionReportBody');
    
    tbody.innerHTML = reportsData.reproduction.map(item => {
        let daysClass = 'days-normal';
        if (item.diasParto <= 30) daysClass = 'days-urgent';
        else if (item.diasParto <= 60) daysClass = 'days-soon';
        
        return `
            <tr>
                <td><strong>${item.numero}</strong></td>
                <td>${item.nome}</td>
                <td>${item.evento}</td>
                <td>${Utils.formatDate(item.dataEvento)}</td>
                <td class="prediction-date">${Utils.formatDate(item.partoPrevisao)}</td>
                <td>
                    <span class="days-to-birth ${daysClass}">
                        ${item.diasParto} dias
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

// Gerar estatísticas do rebanho
function generateStatsReport() {
    const animals = reportsData.animals;
    
    // Calcular estatísticas
    const totalAnimals = animals.length;
    const averageWeight = animals.reduce((sum, a) => sum + a.pesoAtual, 0) / totalAnimals;
    const averageGMD = animals.reduce((sum, a) => sum + a.gmd, 0) / totalAnimals;
    const pregnantAnimals = reportsData.reproduction.length;
    const pregnancyRate = totalAnimals > 0 ? (pregnantAnimals / animals.filter(a => a.sexo === 'Fêmea').length) * 100 : 0;
    
    // Atualizar valores
    document.getElementById('totalAnimalsReport').textContent = totalAnimals;
    document.getElementById('averageWeightReport').textContent = averageWeight.toFixed(1) + ' kg';
    document.getElementById('averageGMDReport').textContent = averageGMD.toFixed(2) + ' kg/dia';
    document.getElementById('pregnancyRateReport').textContent = pregnancyRate.toFixed(1) + '%';
    
    // Gerar gráficos
    generateSexChart();
    generateRaceChart();
}

// Gerar gráfico de distribuição por sexo
function generateSexChart() {
    const canvas = document.getElementById('sexChart');
    const ctx = canvas.getContext('2d');
    
    const males = reportsData.animals.filter(a => a.sexo === 'Macho').length;
    const females = reportsData.animals.filter(a => a.sexo === 'Fêmea').length;
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configurações do gráfico
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    const total = males + females;
    const maleAngle = (males / total) * 2 * Math.PI;
    const femaleAngle = (females / total) * 2 * Math.PI;
    
    // Desenhar fatias
    let currentAngle = 0;
    
    // Machos (azul)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + maleAngle);
    ctx.closePath();
    ctx.fillStyle = '#2196F3';
    ctx.fill();
    
    currentAngle += maleAngle;
    
    // Fêmeas (rosa)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + femaleAngle);
    ctx.closePath();
    ctx.fillStyle = '#E91E63';
    ctx.fill();
    
    // Legenda
    ctx.font = '12px Arial';
    ctx.fillStyle = '#2196F3';
    ctx.fillText(`Machos: ${males}`, 10, canvas.height - 30);
    ctx.fillStyle = '#E91E63';
    ctx.fillText(`Fêmeas: ${females}`, 10, canvas.height - 10);
}

// Gerar gráfico de distribuição por raça
function generateRaceChart() {
    const canvas = document.getElementById('raceChart');
    const ctx = canvas.getContext('2d');
    
    // Contar animais por raça
    const raceCount = {};
    reportsData.animals.forEach(animal => {
        raceCount[animal.raca] = (raceCount[animal.raca] || 0) + 1;
    });
    
    const races = Object.keys(raceCount);
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configurações do gráfico
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    const total = Object.values(raceCount).reduce((sum, count) => sum + count, 0);
    
    let currentAngle = 0;
    
    races.forEach((race, index) => {
        const count = raceCount[race];
        const angle = (count / total) * 2 * Math.PI;
        
        // Desenhar fatia
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        
        currentAngle += angle;
    });
    
    // Legenda
    ctx.font = '10px Arial';
    races.forEach((race, index) => {
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillText(`${race}: ${raceCount[race]}`, 10, 15 + (index * 15));
    });
}

// Gerar fichas PDF
async function generateFichaPesagem() {
    try {
        Utils.showLoading(true);
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar fonte
        doc.setFont('helvetica');
        
        // Cabeçalho
        doc.setFontSize(20);
        doc.setTextColor(46, 125, 50);
        doc.text('SGPR - Sistema de Gestão de Propriedades Rurais', 105, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('FICHA DE PESAGEM', 105, 35, { align: 'center' });
        
        // Informações da propriedade
        const userData = Auth.getCurrentUser();
        doc.setFontSize(12);
        doc.text(`Propriedade: ${userData.propertyName}`, 20, 55);
        doc.text(`Data: ___/___/______`, 150, 55);
        doc.text(`Responsável: _________________________`, 20, 70);
        
        // Linha separadora
        doc.line(20, 80, 190, 80);
        
        // Cabeçalho da tabela
        doc.setFontSize(10);
        doc.setFillColor(46, 125, 50);
        doc.setTextColor(255, 255, 255);
        doc.rect(20, 90, 170, 10, 'F');
        
        doc.text('Nº Animal', 25, 97);
        doc.text('Nome', 50, 97);
        doc.text('Peso (kg)', 80, 97);
        doc.text('Observações', 110, 97);
        doc.text('Assinatura', 150, 97);
        
        // Linhas da tabela
        doc.setTextColor(0, 0, 0);
        for (let i = 0; i < 25; i++) {
            const y = 105 + (i * 8);
            doc.line(20, y, 190, y);
            
            // Linhas verticais
            doc.line(20, 90, 20, y);
            doc.line(45, 90, 45, y);
            doc.line(75, 90, 75, y);
            doc.line(105, 90, 105, y);
            doc.line(145, 90, 145, y);
            doc.line(190, 90, 190, y);
        }
        
        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('SGPR - Gerado automaticamente em ' + new Date().toLocaleDateString('pt-BR'), 105, 280, { align: 'center' });
        
        // Salvar PDF
        doc.save('Ficha_Pesagem_' + new Date().toISOString().split('T')[0] + '.pdf');
        
        Utils.showNotification('Ficha de pesagem gerada com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar ficha de pesagem:', error);
        Utils.showNotification('Erro ao gerar ficha de pesagem', 'error');
    } finally {
        Utils.showLoading(false);
    }
}

async function generateFichaInseminacao() {
    try {
        Utils.showLoading(true);
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar fonte
        doc.setFont('helvetica');
        
        // Cabeçalho
        doc.setFontSize(20);
        doc.setTextColor(46, 125, 50);
        doc.text('SGPR - Sistema de Gestão de Propriedades Rurais', 105, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('FICHA DE INSEMINAÇÃO ARTIFICIAL', 105, 35, { align: 'center' });
        
        // Informações da propriedade
        const userData = Auth.getCurrentUser();
        doc.setFontSize(12);
        doc.text(`Propriedade: ${userData.propertyName}`, 20, 55);
        doc.text(`Data: ___/___/______`, 150, 55);
        doc.text(`Técnico: _________________________`, 20, 70);
        
        // Linha separadora
        doc.line(20, 80, 190, 80);
        
        // Cabeçalho da tabela
        doc.setFontSize(9);
        doc.setFillColor(46, 125, 50);
        doc.setTextColor(255, 255, 255);
        doc.rect(20, 90, 170, 10, 'F');
        
        doc.text('Nº Fêmea', 25, 97);
        doc.text('Nome', 45, 97);
        doc.text('Touro/Sêmen', 65, 97);
        doc.text('Hora IA', 95, 97);
        doc.text('Cio', 115, 97);
        doc.text('Observações', 135, 97);
        doc.text('OK', 175, 97);
        
        // Linhas da tabela
        doc.setTextColor(0, 0, 0);
        for (let i = 0; i < 20; i++) {
            const y = 105 + (i * 8);
            doc.line(20, y, 190, y);
            
            // Linhas verticais
            doc.line(20, 90, 20, y);
            doc.line(40, 90, 40, y);
            doc.line(60, 90, 60, y);
            doc.line(90, 90, 90, y);
            doc.line(110, 90, 110, y);
            doc.line(130, 90, 130, y);
            doc.line(170, 90, 170, y);
            doc.line(190, 90, 190, y);
        }
        
        // Instruções
        doc.setFontSize(10);
        doc.text('Instruções:', 20, 275);
        doc.setFontSize(8);
        doc.text('• Registrar horário da inseminação', 20, 285);
        doc.text('• Anotar características do cio (1-Fraco, 2-Médio, 3-Forte)', 20, 292);
        doc.text('• Marcar OK após confirmação do procedimento', 20, 299);
        
        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('SGPR - Gerado automaticamente em ' + new Date().toLocaleDateString('pt-BR'), 105, 310, { align: 'center' });
        
        // Salvar PDF
        doc.save('Ficha_Inseminacao_' + new Date().toISOString().split('T')[0] + '.pdf');
        
        Utils.showNotification('Ficha de inseminação gerada com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar ficha de inseminação:', error);
        Utils.showNotification('Erro ao gerar ficha de inseminação', 'error');
    } finally {
        Utils.showLoading(false);
    }
}

async function generateFichaGestacao() {
    try {
        Utils.showLoading(true);
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar fonte
        doc.setFont('helvetica');
        
        // Cabeçalho
        doc.setFontSize(20);
        doc.setTextColor(46, 125, 50);
        doc.text('SGPR - Sistema de Gestão de Propriedades Rurais', 105, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('FICHA DE DIAGNÓSTICO DE GESTAÇÃO', 105, 35, { align: 'center' });
        
        // Informações da propriedade
        const userData = Auth.getCurrentUser();
        doc.setFontSize(12);
        doc.text(`Propriedade: ${userData.propertyName}`, 20, 55);
        doc.text(`Data Diagnóstico: ___/___/______`, 130, 55);
        doc.text(`Veterinário: _________________________`, 20, 70);
        doc.text(`Método: ( ) Palpação ( ) Ultrassom`, 130, 70);
        
        // Linha separadora
        doc.line(20, 80, 190, 80);
        
        // Cabeçalho da tabela
        doc.setFontSize(9);
        doc.setFillColor(46, 125, 50);
        doc.setTextColor(255, 255, 255);
        doc.rect(20, 90, 170, 10, 'F');
        
        doc.text('Nº Fêmea', 25, 97);
        doc.text('Nome', 45, 97);
        doc.text('Data IA', 65, 97);
        doc.text('Resultado', 85, 97);
        doc.text('Idade Fetal', 110, 97);
        doc.text('Parto Previsto', 140, 97);
        doc.text('Obs', 170, 97);
        
        // Linhas da tabela
        doc.setTextColor(0, 0, 0);
        for (let i = 0; i < 20; i++) {
            const y = 105 + (i * 8);
            doc.line(20, y, 190, y);
            
            // Linhas verticais
            doc.line(20, 90, 20, y);
            doc.line(40, 90, 40, y);
            doc.line(60, 90, 60, y);
            doc.line(80, 90, 80, y);
            doc.line(105, 90, 105, y);
            doc.line(135, 90, 135, y);
            doc.line(165, 90, 165, y);
            doc.line(190, 90, 190, y);
        }
        
        // Legenda
        doc.setFontSize(10);
        doc.text('Legenda - Resultado:', 20, 275);
        doc.setFontSize(8);
        doc.text('P = Prenha | V = Vazia | D = Duvidoso', 20, 285);
        
        // Resumo
        doc.setFontSize(10);
        doc.text('Resumo:', 120, 275);
        doc.setFontSize(8);
        doc.text('Total examinadas: ____', 120, 285);
        doc.text('Prenhas: ____', 120, 292);
        doc.text('Vazias: ____', 120, 299);
        doc.text('Taxa prenhez: ____%', 120, 306);
        
        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('SGPR - Gerado automaticamente em ' + new Date().toLocaleDateString('pt-BR'), 105, 320, { align: 'center' });
        
        // Salvar PDF
        doc.save('Ficha_Gestacao_' + new Date().toISOString().split('T')[0] + '.pdf');
        
        Utils.showNotification('Ficha de gestação gerada com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar ficha de gestação:', error);
        Utils.showNotification('Erro ao gerar ficha de gestação', 'error');
    } finally {
        Utils.showLoading(false);
    }
}

async function generateFichaCadastro() {
    try {
        Utils.showLoading(true);
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar fonte
        doc.setFont('helvetica');
        
        // Cabeçalho
        doc.setFontSize(20);
        doc.setTextColor(46, 125, 50);
        doc.text('SGPR - Sistema de Gestão de Propriedades Rurais', 105, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('FICHA DE CADASTRO DE ANIMAIS', 105, 35, { align: 'center' });
        
        // Informações da propriedade
        const userData = Auth.getCurrentUser();
        doc.setFontSize(12);
        doc.text(`Propriedade: ${userData.propertyName}`, 20, 55);
        doc.text(`Data: ___/___/______`, 150, 55);
        doc.text(`Responsável: _________________________`, 20, 70);
        
        // Linha separadora
        doc.line(20, 80, 190, 80);
        
        // Cabeçalho da tabela
        doc.setFontSize(8);
        doc.setFillColor(46, 125, 50);
        doc.setTextColor(255, 255, 255);
        doc.rect(20, 90, 170, 10, 'F');
        
        doc.text('Nº', 23, 97);
        doc.text('Nome', 35, 97);
        doc.text('Sexo', 55, 97);
        doc.text('Raça', 70, 97);
        doc.text('Nasc.', 85, 97);
        doc.text('P.Nasc', 105, 97);
        doc.text('P.Atual', 120, 97);
        doc.text('Mãe', 135, 97);
        doc.text('Pai', 150, 97);
        doc.text('Obs', 165, 97);
        
        // Linhas da tabela
        doc.setTextColor(0, 0, 0);
        for (let i = 0; i < 25; i++) {
            const y = 105 + (i * 6);
            doc.line(20, y, 190, y);
            
            // Linhas verticais
            doc.line(20, 90, 20, y);
            doc.line(30, 90, 30, y);
            doc.line(50, 90, 50, y);
            doc.line(65, 90, 65, y);
            doc.line(80, 90, 80, y);
            doc.line(100, 90, 100, y);
            doc.line(115, 90, 115, y);
            doc.line(130, 90, 130, y);
            doc.line(145, 90, 145, y);
            doc.line(160, 90, 160, y);
            doc.line(190, 90, 190, y);
        }
        
        // Instruções
        doc.setFontSize(8);
        doc.text('Instruções: Sexo (M/F), Nasc. (dd/mm/aa), P.Nasc/P.Atual (kg)', 20, 265);
        
        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('SGPR - Gerado automaticamente em ' + new Date().toLocaleDateString('pt-BR'), 105, 280, { align: 'center' });
        
        // Salvar PDF
        doc.save('Ficha_Cadastro_' + new Date().toISOString().split('T')[0] + '.pdf');
        
        Utils.showNotification('Ficha de cadastro gerada com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar ficha de cadastro:', error);
        Utils.showNotification('Erro ao gerar ficha de cadastro', 'error');
    } finally {
        Utils.showLoading(false);
    }
}

// Exportar relatórios
async function exportReport(reportType) {
    try {
        Utils.showLoading(true);
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar fonte
        doc.setFont('helvetica');
        
        // Cabeçalho
        doc.setFontSize(20);
        doc.setTextColor(46, 125, 50);
        doc.text('SGPR - Sistema de Gestão de Propriedades Rurais', 105, 20, { align: 'center' });
        
        const userData = Auth.getCurrentUser();
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Propriedade: ${userData.propertyName}`, 20, 40);
        doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 150, 40);
        
        let title = '';
        switch (reportType) {
            case 'animals':
                title = 'RELATÓRIO DE ANIMAIS POR PROPRIEDADE';
                break;
            case 'reproduction':
                title = 'RELATÓRIO DE REPRODUÇÃO';
                break;
            case 'stats':
                title = 'ESTATÍSTICAS DO REBANHO';
                break;
        }
        
        doc.setFontSize(16);
        doc.text(title, 105, 55, { align: 'center' });
        
        // Linha separadora
        doc.line(20, 65, 190, 65);
        
        if (reportType === 'animals') {
            // Cabeçalho da tabela de animais
            doc.setFontSize(8);
            doc.setFillColor(46, 125, 50);
            doc.setTextColor(255, 255, 255);
            doc.rect(20, 75, 170, 8, 'F');
            
            doc.text('Nº', 23, 80);
            doc.text('Nome', 35, 80);
            doc.text('Sexo', 55, 80);
            doc.text('Raça', 70, 80);
            doc.text('Nasc.', 90, 80);
            doc.text('P.Nasc', 110, 80);
            doc.text('P.Atual', 125, 80);
            doc.text('GMD', 145, 80);
            doc.text('Prev.Abate', 165, 80);
            
            // Dados dos animais
            doc.setTextColor(0, 0, 0);
            reportsData.animals.forEach((animal, index) => {
                const y = 90 + (index * 8);
                if (y > 270) return; // Evitar sair da página
                
                doc.text(animal.numero, 23, y);
                doc.text(animal.nome.substring(0, 8), 35, y);
                doc.text(animal.sexo[0], 55, y);
                doc.text(animal.raca.substring(0, 6), 70, y);
                doc.text(Utils.formatDate(animal.dataNascimento), 90, y);
                doc.text(animal.pesoNascimento + 'kg', 110, y);
                doc.text(animal.pesoAtual + 'kg', 125, y);
                doc.text(animal.gmd.toFixed(2), 145, y);
                doc.text(Utils.formatDate(animal.previsaoAbate), 165, y);
            });
        }
        
        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('SGPR - Gerado automaticamente em ' + new Date().toLocaleDateString('pt-BR'), 105, 290, { align: 'center' });
        
        // Salvar PDF
        doc.save(`Relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`);
        
        Utils.showNotification('Relatório exportado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao exportar relatório:', error);
        Utils.showNotification('Erro ao exportar relatório', 'error');
    } finally {
        Utils.showLoading(false);
    }
}

// Exportar funções globais
window.updateReports = updateReports;
window.generateFichaPesagem = generateFichaPesagem;
window.generateFichaInseminacao = generateFichaInseminacao;
window.generateFichaGestacao = generateFichaGestacao;
window.generateFichaCadastro = generateFichaCadastro;
window.exportReport = exportReport;

