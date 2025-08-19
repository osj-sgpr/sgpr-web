/**
 * SGPR - Controle Financeiro JavaScript
 * Funcionalidades específicas da página financeira
 */

let financialData = [];
let filteredTransactions = [];
let currentPage = 1;
const itemsPerPage = 15;

// Categorias financeiras completas (22 categorias)
const FINANCIAL_CATEGORIES = {
    'Receita': {
        '01 - Venda de Animais': [
            'Venda de Bovinos',
            'Venda de Suínos',
            'Venda de Aves',
            'Venda de Caprinos/Ovinos',
            'Outros Animais'
        ],
        '02 - Produtos Animais': [
            'Venda de Leite',
            'Venda de Ovos',
            'Venda de Queijo',
            'Venda de Carne',
            'Outros Produtos'
        ],
        '03 - Produtos Vegetais': [
            'Venda de Grãos',
            'Venda de Frutas',
            'Venda de Hortaliças',
            'Venda de Forragem',
            'Outros Vegetais'
        ],
        '04 - Serviços Prestados': [
            'Aluguel de Equipamentos',
            'Serviços de Transporte',
            'Consultoria Técnica',
            'Outros Serviços'
        ],
        '05 - Subsídios e Financiamentos': [
            'Crédito Rural',
            'Subsídios Governamentais',
            'Financiamentos',
            'Outros Recursos'
        ]
    },
    'Despesa': {
        '01 - Alimentação Animal': [
            'Ração Concentrada',
            'Suplementos Minerais',
            'Sal Mineral',
            'Forragem Comprada',
            'Outros Alimentos'
        ],
        '02 - Sanidade Animal': [
            'Vacinas',
            'Medicamentos',
            'Vermífugos',
            'Carrapaticidas',
            'Consultas Veterinárias'
        ],
        '03 - Reprodução': [
            'Inseminação Artificial',
            'Sêmen',
            'Hormônios',
            'Exames Reprodutivos',
            'Outros Reprodução'
        ],
        '04 - Mão de Obra': [
            'Salários',
            'Encargos Sociais',
            'Alimentação Funcionários',
            'Transporte Funcionários',
            'Outros Mão de Obra'
        ],
        '05 - Combustíveis e Lubrificantes': [
            'Diesel',
            'Gasolina',
            'Óleo Lubrificante',
            'Graxa',
            'Outros Combustíveis'
        ],
        '06 - Energia Elétrica': [
            'Energia Residencial',
            'Energia Rural',
            'Energia Irrigação',
            'Outros Energia'
        ],
        '07 - Manutenção e Reparos': [
            'Manutenção Equipamentos',
            'Manutenção Instalações',
            'Manutenção Veículos',
            'Peças e Componentes',
            'Outros Reparos'
        ],
        '08 - Impostos e Taxas': [
            'ITR',
            'ICMS',
            'Taxas Sindicais',
            'Licenças',
            'Outros Impostos'
        ],
        '09 - Seguros': [
            'Seguro Rural',
            'Seguro Veículos',
            'Seguro Equipamentos',
            'Outros Seguros'
        ],
        '10 - Transporte': [
            'Frete Animais',
            'Frete Insumos',
            'Combustível Transporte',
            'Outros Transportes'
        ],
        '11 - Sementes e Mudas': [
            'Sementes Forrageiras',
            'Sementes Grãos',
            'Mudas Frutíferas',
            'Outras Sementes'
        ],
        '12 - Fertilizantes e Corretivos': [
            'Calcário',
            'Adubo NPK',
            'Adubo Orgânico',
            'Outros Fertilizantes'
        ],
        '13 - Defensivos Agrícolas': [
            'Herbicidas',
            'Inseticidas',
            'Fungicidas',
            'Outros Defensivos'
        ],
        '14 - Ferramentas e Equipamentos': [
            'Ferramentas Manuais',
            'Equipamentos Pequenos',
            'Utensílios',
            'Outros Equipamentos'
        ],
        '15 - Construções e Benfeitorias': [
            'Material Construção',
            'Cercas',
            'Currais',
            'Outras Benfeitorias'
        ],
        '16 - Comunicação': [
            'Telefone',
            'Internet',
            'Correios',
            'Outras Comunicações'
        ],
        '17 - Despesas Administrativas': [
            'Material Escritório',
            'Contabilidade',
            'Assessoria Técnica',
            'Outras Administrativas'
        ],
        '18 - Despesas Financeiras': [
            'Juros Empréstimos',
            'Tarifas Bancárias',
            'IOF',
            'Outras Financeiras'
        ],
        '19 - Depreciação': [
            'Depreciação Máquinas',
            'Depreciação Equipamentos',
            'Depreciação Instalações',
            'Outras Depreciações'
        ],
        '20 - Arrendamentos': [
            'Arrendamento Terra',
            'Arrendamento Equipamentos',
            'Outros Arrendamentos'
        ],
        '21 - Despesas Diversas': [
            'Viagens',
            'Hospedagem',
            'Alimentação',
            'Outras Diversas'
        ],
        '22 - Investimentos': [
            'Compra Animais',
            'Compra Equipamentos',
            'Melhoramento Genético',
            'Outros Investimentos'
        ]
    }
};

// Inicializar página financeira
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    
    initFinancialPage();
});

async function initFinancialPage() {
    try {
        Utils.showLoading(true);
        
        // Carregar dados financeiros
        await loadFinancialData();
        
        // Configurar event listeners
        setupFinancialEventListeners();
        
        // Carregar categorias
        loadCategories();
        
        // Verificar se deve abrir modal
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        const type = urlParams.get('type');
        if (action === 'new' && type) {
            showAddTransactionModal(type);
        }
        
    } catch (error) {
        console.error('Erro ao inicializar página financeira:', error);
        Utils.showNotification('Erro ao carregar dados financeiros', 'error');
    } finally {
        Utils.showLoading(false);
    }
}

// Carregar dados financeiros
async function loadFinancialData() {
    try {
        const userData = Auth.getCurrentUser();
        if (!userData) return;
        
        // Por enquanto, usar dados mock
        financialData = await loadMockFinancialData(userData.propertyId);
        
        // Aplicar filtros
        applyFinancialFilters();
        
        // Atualizar estatísticas
        updateFinancialStats();
        
        // Renderizar tabela
        renderFinancialTable();
        
        // Salvar no cache
        SGPR.cache.financial = financialData;
        
    } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error);
        throw error;
    }
}

// Dados mock financeiros
async function loadMockFinancialData(propertyId) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTransactions = [
        {
            id: 'fin_001',
            data: '2024-12-01',
            tipo: 'Receita',
            categoria: '01 - Venda de Animais',
            subcategoria: 'Venda de Bovinos',
            descricao: 'Venda de 5 novilhos',
            valor: 15000.00,
            formaPagamento: 'PIX',
            observacoes: 'Animais de 18 meses',
            dataCadastro: '2024-12-01'
        },
        {
            id: 'fin_002',
            data: '2024-12-02',
            tipo: 'Despesa',
            categoria: '01 - Alimentação Animal',
            subcategoria: 'Ração Concentrada',
            descricao: 'Compra de ração para bovinos',
            valor: 2500.00,
            formaPagamento: 'Cartão Crédito',
            observacoes: '50 sacos de 25kg',
            dataCadastro: '2024-12-02'
        },
        {
            id: 'fin_003',
            data: '2024-12-03',
            tipo: 'Receita',
            categoria: '02 - Produtos Animais',
            subcategoria: 'Venda de Leite',
            descricao: 'Venda de leite - dezembro',
            valor: 8500.00,
            formaPagamento: 'Transferência',
            observacoes: 'Produção mensal',
            dataCadastro: '2024-12-03'
        },
        {
            id: 'fin_004',
            data: '2024-12-04',
            tipo: 'Despesa',
            categoria: '02 - Sanidade Animal',
            subcategoria: 'Vacinas',
            descricao: 'Vacinação do rebanho',
            valor: 800.00,
            formaPagamento: 'Dinheiro',
            observacoes: 'Vacina contra febre aftosa',
            dataCadastro: '2024-12-04'
        },
        {
            id: 'fin_005',
            data: '2024-12-05',
            tipo: 'Despesa',
            categoria: '04 - Mão de Obra',
            subcategoria: 'Salários',
            descricao: 'Pagamento funcionários',
            valor: 3200.00,
            formaPagamento: 'PIX',
            observacoes: 'Salário mensal',
            dataCadastro: '2024-12-05'
        }
    ];
    
    return mockTransactions;
}

// Configurar event listeners
function setupFinancialEventListeners() {
    // Filtros
    document.getElementById('filterPeriod').addEventListener('change', applyFinancialFilters);
    document.getElementById('filterType').addEventListener('change', applyFinancialFilters);
    document.getElementById('filterCategory').addEventListener('change', applyFinancialFilters);
    
    // Tipo de transação
    document.getElementById('transactionType').addEventListener('change', function() {
        loadCategoriesForType(this.value);
    });
    
    // Categoria
    document.getElementById('transactionCategory').addEventListener('change', function() {
        loadSubcategoriesForCategory(this.value);
    });
    
    // Form de transação
    document.getElementById('transactionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTransaction();
    });
}

// Carregar categorias no filtro
function loadCategories() {
    const filterCategory = document.getElementById('filterCategory');
    filterCategory.innerHTML = '<option value="">Todas</option>';
    
    // Adicionar todas as categorias
    Object.keys(FINANCIAL_CATEGORIES).forEach(type => {
        Object.keys(FINANCIAL_CATEGORIES[type]).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filterCategory.appendChild(option);
        });
    });
}

// Carregar categorias por tipo
function loadCategoriesForType(type) {
    const categorySelect = document.getElementById('transactionCategory');
    const subcategorySelect = document.getElementById('transactionSubcategory');
    
    categorySelect.innerHTML = '<option value="">Selecione</option>';
    subcategorySelect.innerHTML = '<option value="">Selecione a categoria primeiro</option>';
    
    if (type && FINANCIAL_CATEGORIES[type]) {
        Object.keys(FINANCIAL_CATEGORIES[type]).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
}

// Carregar subcategorias por categoria
function loadSubcategoriesForCategory(category) {
    const subcategorySelect = document.getElementById('transactionSubcategory');
    const type = document.getElementById('transactionType').value;
    
    subcategorySelect.innerHTML = '<option value="">Selecione</option>';
    
    if (type && category && FINANCIAL_CATEGORIES[type] && FINANCIAL_CATEGORIES[type][category]) {
        FINANCIAL_CATEGORIES[type][category].forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            subcategorySelect.appendChild(option);
        });
    }
}

// Aplicar filtros
function applyFinancialFilters() {
    const periodFilter = document.getElementById('filterPeriod').value;
    const typeFilter = document.getElementById('filterType').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    
    filteredTransactions = financialData.filter(transaction => {
        const matchPeriod = filterByPeriod(transaction, periodFilter);
        const matchType = !typeFilter || transaction.tipo === typeFilter;
        const matchCategory = !categoryFilter || transaction.categoria === categoryFilter;
        
        return matchPeriod && matchType && matchCategory;
    });
    
    currentPage = 1;
    renderFinancialTable();
    updateFinancialStats();
}

// Filtrar por período
function filterByPeriod(transaction, period) {
    if (period === 'all') return true;
    
    const transactionDate = new Date(transaction.data);
    const now = new Date();
    
    switch (period) {
        case 'current_month':
            return transactionDate.getMonth() === now.getMonth() && 
                   transactionDate.getFullYear() === now.getFullYear();
        case 'last_month':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return transactionDate.getMonth() === lastMonth.getMonth() && 
                   transactionDate.getFullYear() === lastMonth.getFullYear();
        case 'current_year':
            return transactionDate.getFullYear() === now.getFullYear();
        default:
            return true;
    }
}

// Atualizar estatísticas financeiras
function updateFinancialStats() {
    const receitas = filteredTransactions.filter(t => t.tipo === 'Receita');
    const despesas = filteredTransactions.filter(t => t.tipo === 'Despesa');
    
    const totalReceitas = receitas.reduce((sum, t) => sum + parseFloat(t.valor), 0);
    const totalDespesas = despesas.reduce((sum, t) => sum + parseFloat(t.valor), 0);
    const saldoTotal = totalReceitas - totalDespesas;
    
    // Saldo mensal (mês atual)
    const now = new Date();
    const monthlyTransactions = financialData.filter(t => {
        const tDate = new Date(t.data);
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    });
    
    const monthlyReceitas = monthlyTransactions.filter(t => t.tipo === 'Receita').reduce((sum, t) => sum + parseFloat(t.valor), 0);
    const monthlyDespesas = monthlyTransactions.filter(t => t.tipo === 'Despesa').reduce((sum, t) => sum + parseFloat(t.valor), 0);
    const saldoMensal = monthlyReceitas - monthlyDespesas;
    
    // Atualizar interface
    document.getElementById('totalReceitas').textContent = Utils.formatCurrency(totalReceitas);
    document.getElementById('totalDespesas').textContent = Utils.formatCurrency(totalDespesas);
    document.getElementById('saldoTotal').textContent = Utils.formatCurrency(saldoTotal);
    document.getElementById('saldoMensal').textContent = Utils.formatCurrency(saldoMensal);
    
    // Atualizar cores dos saldos
    const saldoTotalElement = document.getElementById('saldoTotal');
    const saldoMensalElement = document.getElementById('saldoMensal');
    
    saldoTotalElement.style.color = saldoTotal >= 0 ? 'var(--success-color)' : 'var(--error-color)';
    saldoMensalElement.style.color = saldoMensal >= 0 ? 'var(--success-color)' : 'var(--error-color)';
}

// Renderizar tabela financeira
function renderFinancialTable() {
    const tbody = document.getElementById('financialTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageTransactions = filteredTransactions.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageTransactions.map(transaction => `
        <tr>
            <td>${Utils.formatDate(transaction.data)}</td>
            <td>
                <span class="transaction-type-${transaction.tipo.toLowerCase()}">
                    <i class="fas fa-${transaction.tipo === 'Receita' ? 'arrow-up' : 'arrow-down'}"></i>
                    ${transaction.tipo}
                </span>
            </td>
            <td>${transaction.categoria}</td>
            <td>${transaction.subcategoria || '-'}</td>
            <td>${transaction.descricao}</td>
            <td class="transaction-value-${transaction.tipo === 'Receita' ? 'positive' : 'negative'}">
                ${transaction.tipo === 'Receita' ? '+' : '-'} ${Utils.formatCurrency(transaction.valor)}
            </td>
            <td>${transaction.formaPagamento || '-'}</td>
            <td>
                <div class="transaction-actions">
                    <button class="btn-edit" onclick="editTransaction('${transaction.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteTransaction('${transaction.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    renderFinancialPagination();
}

// Renderizar paginação
function renderFinancialPagination() {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const pagination = document.getElementById('financialPagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <button onclick="changeFinancialPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <button onclick="changeFinancialPage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<span>...</span>';
        }
    }
    
    paginationHTML += `
        <button onclick="changeFinancialPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Mudar página
function changeFinancialPage(page) {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderFinancialTable();
    }
}

// Mostrar modal de nova transação
function showAddTransactionModal(type) {
    document.getElementById('transactionModalTitle').innerHTML = `<i class="fas fa-plus"></i> Nova ${type}`;
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionId').value = '';
    document.getElementById('transactionType').value = type;
    document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
    
    // Carregar categorias para o tipo
    loadCategoriesForType(type);
    
    Modal.show('transactionModal');
}

// Editar transação
function editTransaction(transactionId) {
    const transaction = financialData.find(t => t.id === transactionId);
    if (!transaction) return;
    
    document.getElementById('transactionModalTitle').innerHTML = `<i class="fas fa-edit"></i> Editar ${transaction.tipo}`;
    
    // Preencher formulário
    document.getElementById('transactionId').value = transaction.id;
    document.getElementById('transactionDate').value = transaction.data;
    document.getElementById('transactionType').value = transaction.tipo;
    document.getElementById('transactionDescription').value = transaction.descricao;
    document.getElementById('transactionValue').value = transaction.valor;
    document.getElementById('transactionPayment').value = transaction.formaPagamento || '';
    document.getElementById('transactionObservations').value = transaction.observacoes || '';
    
    // Carregar categorias e selecionar
    loadCategoriesForType(transaction.tipo);
    setTimeout(() => {
        document.getElementById('transactionCategory').value = transaction.categoria;
        loadSubcategoriesForCategory(transaction.categoria);
        setTimeout(() => {
            document.getElementById('transactionSubcategory').value = transaction.subcategoria || '';
        }, 100);
    }, 100);
    
    Modal.show('transactionModal');
}

// Salvar transação
async function saveTransaction() {
    try {
        const form = document.getElementById('transactionForm');
        
        // Validações
        const data = document.getElementById('transactionDate').value;
        const tipo = document.getElementById('transactionType').value;
        const categoria = document.getElementById('transactionCategory').value;
        const descricao = document.getElementById('transactionDescription').value;
        const valor = document.getElementById('transactionValue').value;
        
        if (!data || !tipo || !categoria || !descricao || !valor) {
            Utils.showNotification('Preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        Utils.showLoading(true);
        
        // Simular salvamento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const transactionId = document.getElementById('transactionId').value;
        const transactionData = {
            id: transactionId || 'fin_' + Date.now(),
            data: data,
            tipo: tipo,
            categoria: categoria,
            subcategoria: document.getElementById('transactionSubcategory').value,
            descricao: descricao,
            valor: parseFloat(valor),
            formaPagamento: document.getElementById('transactionPayment').value,
            observacoes: document.getElementById('transactionObservations').value,
            dataCadastro: transactionId ? financialData.find(t => t.id === transactionId)?.dataCadastro : new Date().toISOString().split('T')[0]
        };
        
        if (transactionId) {
            // Atualizar transação existente
            const index = financialData.findIndex(t => t.id === transactionId);
            if (index !== -1) {
                financialData[index] = transactionData;
            }
            Utils.showNotification('Transação atualizada com sucesso!', 'success');
        } else {
            // Nova transação
            financialData.push(transactionData);
            Utils.showNotification('Transação cadastrada com sucesso!', 'success');
        }
        
        // Atualizar interface
        applyFinancialFilters();
        closeTransactionModal();
        
    } catch (error) {
        console.error('Erro ao salvar transação:', error);
        Utils.showNotification('Erro ao salvar transação', 'error');
    } finally {
        Utils.showLoading(false);
    }
}

// Excluir transação
function deleteTransaction(transactionId) {
    const transaction = financialData.find(t => t.id === transactionId);
    if (!transaction) return;
    
    if (confirm(`Tem certeza que deseja excluir a transação "${transaction.descricao}"?`)) {
        Utils.showLoading(true);
        
        setTimeout(() => {
            // Remover da lista
            financialData = financialData.filter(t => t.id !== transactionId);
            
            // Atualizar interface
            applyFinancialFilters();
            
            Utils.showLoading(false);
            Utils.showNotification('Transação excluída com sucesso!', 'success');
        }, 1000);
    }
}

// Fechar modal de transação
function closeTransactionModal() {
    Modal.hide('transactionModal');
}

// Atualizar dados financeiros
function refreshFinancial() {
    loadFinancialData();
}

// Exportar dados financeiros
function exportFinancial() {
    Utils.showLoading(true);
    
    setTimeout(() => {
        // Simular exportação
        const csvContent = generateFinancialCSV();
        downloadCSV(csvContent, 'financeiro_' + new Date().toISOString().split('T')[0] + '.csv');
        
        Utils.showLoading(false);
        Utils.showNotification('Dados exportados com sucesso!', 'success');
    }, 1500);
}

// Gerar CSV dos dados financeiros
function generateFinancialCSV() {
    const headers = ['Data', 'Tipo', 'Categoria', 'Subcategoria', 'Descrição', 'Valor', 'Forma Pagamento', 'Observações'];
    
    const rows = filteredTransactions.map(transaction => [
        transaction.data,
        transaction.tipo,
        transaction.categoria,
        transaction.subcategoria || '',
        transaction.descricao,
        transaction.valor.toFixed(2).replace('.', ','),
        transaction.formaPagamento || '',
        transaction.observacoes || ''
    ]);
    
    return [headers, ...rows].map(row => 
        row.map(field => `"${field}"`).join(',')
    ).join('\n');
}

// Download CSV
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Exportar funções globais
window.showAddTransactionModal = showAddTransactionModal;
window.editTransaction = editTransaction;
window.deleteTransaction = deleteTransaction;
window.saveTransaction = saveTransaction;
window.closeTransactionModal = closeTransactionModal;
window.refreshFinancial = refreshFinancial;
window.exportFinancial = exportFinancial;
window.changeFinancialPage = changeFinancialPage;

