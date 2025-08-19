/**
 * SGPR - Dashboard JavaScript
 * Funcionalidades específicas da página do dashboard
 */

let animalChart, financialChart;

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    
    initDashboard();
});

async function initDashboard() {
    try {
        Utils.showLoading(true);
        
        // Carregar dados do dashboard
        await loadDashboardData();
        
        // Inicializar gráficos
        initCharts();
        
        // Configurar atualizações automáticas
        setupAutoRefresh();
        
    } catch (error) {
        console.error('Erro ao inicializar dashboard:', error);
        Utils.showNotification('Erro ao carregar dados do dashboard', 'error');
    } finally {
        Utils.showLoading(false);
    }
}

// Carregar dados do dashboard
async function loadDashboardData() {
    try {
        const userData = Auth.getCurrentUser();
        if (!userData) return;
        
        // Carregar dados mock por enquanto
        const dashboardData = await loadMockDashboardData(userData.propertyId);
        
        // Atualizar estatísticas
        updateStatistics(dashboardData.stats);
        
        // Atualizar atividades recentes
        updateRecentActivities(dashboardData.activities);
        
        // Atualizar alertas
        updateAlerts(dashboardData.alerts);
        
        // Salvar no cache
        SGPR.cache.dashboardData = dashboardData;
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        throw error;
    }
}

// Dados mock do dashboard
async function loadMockDashboardData(propertyId) {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData = {
        stats: {
            totalAnimals: 156,
            totalFemales: 98,
            totalMales: 58,
            pregnantAnimals: 23,
            monthlyRevenue: 45750.00,
            averageGMD: 1.35
        },
        activities: [
            {
                id: 1,
                type: 'animal',
                icon: 'fas fa-cow',
                title: 'Animal cadastrado',
                description: 'Novilha #156 adicionada ao rebanho',
                time: '2 horas atrás',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
                id: 2,
                type: 'financial',
                icon: 'fas fa-dollar-sign',
                title: 'Receita registrada',
                description: 'Venda de leite - R$ 1.250,00',
                time: 'Ontem',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
            },
            {
                id: 3,
                type: 'weighing',
                icon: 'fas fa-weight',
                title: 'Pesagem realizada',
                description: '15 animais pesados',
                time: '2 dias atrás',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                id: 4,
                type: 'reproduction',
                icon: 'fas fa-heart',
                title: 'Inseminação registrada',
                description: 'Vaca #089 inseminada',
                time: '3 dias atrás',
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                id: 5,
                type: 'health',
                icon: 'fas fa-syringe',
                title: 'Vacinação realizada',
                description: '25 animais vacinados contra febre aftosa',
                time: '1 semana atrás',
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
        ],
        alerts: [
            {
                id: 1,
                type: 'warning',
                icon: 'fas fa-exclamation-triangle',
                title: 'Vacinação pendente',
                description: '5 animais precisam de vacinação esta semana',
                priority: 'high'
            },
            {
                id: 2,
                type: 'info',
                icon: 'fas fa-calendar',
                title: 'Partos previstos',
                description: '3 fêmeas com parto previsto para este mês',
                priority: 'medium'
            },
            {
                id: 3,
                type: 'success',
                icon: 'fas fa-check-circle',
                title: 'Meta atingida',
                description: 'GMD médio do mês superou a meta de 1,2 kg/dia',
                priority: 'low'
            }
        ],
        charts: {
            animalDistribution: {
                labels: ['Vacas', 'Novilhas', 'Touros', 'Novilhos', 'Bezerros'],
                data: [45, 32, 8, 25, 46]
            },
            financialEvolution: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                receitas: [35000, 42000, 38000, 45000, 41000, 47000],
                despesas: [28000, 31000, 29000, 33000, 30000, 35000]
            }
        }
    };
    
    return mockData;
}

// Atualizar estatísticas
function updateStatistics(stats) {
    document.getElementById('totalAnimals').textContent = stats.totalAnimals;
    document.getElementById('totalFemales').textContent = stats.totalFemales;
    document.getElementById('totalMales').textContent = stats.totalMales;
    document.getElementById('pregnantAnimals').textContent = stats.pregnantAnimals;
    document.getElementById('monthlyRevenue').textContent = Utils.formatCurrency(stats.monthlyRevenue);
    document.getElementById('averageGMD').textContent = `${stats.averageGMD} kg`;
}

// Atualizar atividades recentes
function updateRecentActivities(activities) {
    const container = document.getElementById('recentActivities');
    if (!container) return;
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon} ${getActivityColor(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Obter cor da atividade
function getActivityColor(type) {
    const colors = {
        animal: 'text-primary',
        financial: 'text-success',
        weighing: 'text-warning',
        reproduction: 'text-error',
        health: 'text-info'
    };
    return colors[type] || 'text-secondary';
}

// Atualizar alertas
function updateAlerts(alerts) {
    const container = document.getElementById('alerts');
    if (!container) return;
    
    container.innerHTML = alerts.map(alert => `
        <div class="alert alert-${alert.type}">
            <i class="${alert.icon}"></i>
            <div>
                <strong>${alert.title}</strong>
                <p>${alert.description}</p>
            </div>
        </div>
    `).join('');
}

// Inicializar gráficos
function initCharts() {
    const dashboardData = SGPR.cache.dashboardData;
    if (!dashboardData) return;
    
    // Gráfico de distribuição de animais
    initAnimalDistributionChart(dashboardData.charts.animalDistribution);
    
    // Gráfico financeiro
    initFinancialChart(dashboardData.charts.financialEvolution);
}

// Gráfico de distribuição de animais
function initAnimalDistributionChart(data) {
    const ctx = document.getElementById('animalDistributionChart');
    if (!ctx) return;
    
    animalChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: [
                    '#2E7D32',
                    '#4CAF50',
                    '#66BB6A',
                    '#81C784',
                    '#A5D6A7'
                ],
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Gráfico financeiro
function initFinancialChart(data) {
    const ctx = document.getElementById('financialChart');
    if (!ctx) return;
    
    financialChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Receitas',
                    data: data.receitas,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Despesas',
                    data: data.despesas,
                    borderColor: '#F44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${Utils.formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return Utils.formatCurrency(value);
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Configurar atualização automática
function setupAutoRefresh() {
    // Atualizar dados a cada 5 minutos
    setInterval(async () => {
        try {
            await loadDashboardData();
            updateCharts();
        } catch (error) {
            console.error('Erro na atualização automática:', error);
        }
    }, 5 * 60 * 1000);
}

// Atualizar gráficos
function updateCharts() {
    const dashboardData = SGPR.cache.dashboardData;
    if (!dashboardData) return;
    
    // Atualizar gráfico de animais
    if (animalChart) {
        animalChart.data.datasets[0].data = dashboardData.charts.animalDistribution.data;
        animalChart.update();
    }
    
    // Atualizar gráfico financeiro
    if (financialChart) {
        financialChart.data.datasets[0].data = dashboardData.charts.financialEvolution.receitas;
        financialChart.data.datasets[1].data = dashboardData.charts.financialEvolution.despesas;
        financialChart.update();
    }
}

// Ações rápidas
function quickAddAnimal() {
    window.location.href = 'animais.html?action=new';
}

function quickAddFinancial() {
    window.location.href = 'financeiro.html?action=new';
}

function quickWeighing() {
    Modal.create('weighingModal', 'Registro Rápido de Pesagem', `
        <form id="quickWeighingForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="animalSelect">Animal:</label>
                    <select id="animalSelect" required>
                        <option value="">Selecione um animal</option>
                        <option value="001">Vaca #001</option>
                        <option value="002">Novilha #002</option>
                        <option value="003">Touro #003</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="weight">Peso (kg):</label>
                    <input type="number" id="weight" step="0.1" min="0" required>
                </div>
            </div>
            <div class="form-group">
                <label for="weighingDate">Data da Pesagem:</label>
                <input type="date" id="weighingDate" value="${new Date().toISOString().split('T')[0]}" required>
            </div>
            <div class="form-group">
                <label for="weighingNotes">Observações:</label>
                <textarea id="weighingNotes" rows="3"></textarea>
            </div>
        </form>
    `, [
        {
            text: 'Salvar',
            class: 'btn-success',
            icon: 'fas fa-save',
            onclick: 'saveQuickWeighing()'
        },
        {
            text: 'Cancelar',
            class: 'btn-secondary',
            onclick: 'Modal.hide("weighingModal")'
        }
    ]);
    
    Modal.show('weighingModal');
}

function saveQuickWeighing() {
    const form = document.getElementById('quickWeighingForm');
    const formData = new FormData(form);
    
    // Validar dados
    const animal = document.getElementById('animalSelect').value;
    const weight = document.getElementById('weight').value;
    const date = document.getElementById('weighingDate').value;
    
    if (!animal || !weight || !date) {
        Utils.showNotification('Preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    // Simular salvamento
    Utils.showLoading(true);
    setTimeout(() => {
        Utils.showLoading(false);
        Utils.showNotification('Pesagem registrada com sucesso!', 'success');
        Modal.hide('weighingModal');
        
        // Atualizar atividades
        refreshActivities();
    }, 1000);
}

function generateReport() {
    Modal.create('reportModal', 'Gerar Relatório Rápido', `
        <div class="report-options">
            <div class="report-option" onclick="generateQuickReport('animals')">
                <i class="fas fa-cow"></i>
                <h4>Relatório de Animais</h4>
                <p>Lista completa do rebanho com dados atuais</p>
            </div>
            <div class="report-option" onclick="generateQuickReport('financial')">
                <i class="fas fa-dollar-sign"></i>
                <h4>Relatório Financeiro</h4>
                <p>Resumo financeiro do mês atual</p>
            </div>
            <div class="report-option" onclick="generateQuickReport('reproduction')">
                <i class="fas fa-heart"></i>
                <h4>Relatório Reprodutivo</h4>
                <p>Status reprodutivo e previsões</p>
            </div>
        </div>
        
        <style>
            .report-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }
            .report-option {
                padding: 20px;
                border: 2px solid #E0E0E0;
                border-radius: 12px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .report-option:hover {
                border-color: var(--primary-color);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .report-option i {
                font-size: 2rem;
                color: var(--primary-color);
                margin-bottom: 10px;
            }
            .report-option h4 {
                margin-bottom: 8px;
                color: var(--text-primary);
            }
            .report-option p {
                color: var(--text-secondary);
                font-size: 0.9rem;
                margin: 0;
            }
        </style>
    `);
    
    Modal.show('reportModal');
}

function generateQuickReport(type) {
    Modal.hide('reportModal');
    Utils.showLoading(true);
    
    setTimeout(() => {
        Utils.showLoading(false);
        Utils.showNotification(`Relatório ${type} gerado com sucesso!`, 'success');
        
        // Simular download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `relatorio_${type}_${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
    }, 2000);
}

function backupData() {
    if (confirm('Deseja fazer backup de todos os dados da propriedade?')) {
        Utils.showLoading(true);
        
        setTimeout(() => {
            Utils.showLoading(false);
            Utils.showNotification('Backup realizado com sucesso!', 'success');
        }, 3000);
    }
}

function refreshActivities() {
    Utils.showLoading(true);
    
    setTimeout(async () => {
        try {
            await loadDashboardData();
            Utils.showNotification('Atividades atualizadas!', 'success');
        } catch (error) {
            Utils.showNotification('Erro ao atualizar atividades', 'error');
        } finally {
            Utils.showLoading(false);
        }
    }, 1000);
}

// Exportar funções globais
window.quickAddAnimal = quickAddAnimal;
window.quickAddFinancial = quickAddFinancial;
window.quickWeighing = quickWeighing;
window.saveQuickWeighing = saveQuickWeighing;
window.generateReport = generateReport;
window.generateQuickReport = generateQuickReport;
window.backupData = backupData;
window.refreshActivities = refreshActivities;

