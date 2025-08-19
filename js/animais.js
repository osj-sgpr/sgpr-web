/**
 * SGPR - Gestão de Animais JavaScript
 * Funcionalidades específicas da página de animais
 */

let animalsData = [];
let filteredAnimals = [];
let currentPage = 1;
const itemsPerPage = 10;

// Inicializar página de animais
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    
    initAnimalsPage();
});

async function initAnimalsPage() {
    try {
        Utils.showLoading(true);
        
        // Carregar dados dos animais
        await loadAnimals();
        
        // Configurar event listeners
        setupAnimalsEventListeners();
        
        // Verificar se deve abrir modal de novo animal
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'new') {
            showAddAnimalModal();
        }
        
    } catch (error) {
        console.error('Erro ao inicializar página de animais:', error);
        Utils.showNotification('Erro ao carregar dados dos animais', 'error');
    } finally {
        Utils.showLoading(false);
    }
}

// Carregar animais
async function loadAnimals() {
    try {
        const userData = Auth.getCurrentUser();
        if (!userData) return;
        
        // Por enquanto, usar dados mock
        animalsData = await loadMockAnimals(userData.propertyId);
        
        // Aplicar filtros
        applyFilters();
        
        // Atualizar estatísticas
        updateAnimalsStats();
        
        // Renderizar tabela
        renderAnimalsTable();
        
        // Salvar no cache
        SGPR.cache.animals = animalsData;
        
    } catch (error) {
        console.error('Erro ao carregar animais:', error);
        throw error;
    }
}

// Dados mock de animais
async function loadMockAnimals(propertyId) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockAnimals = [
        {
            id: 'animal_001',
            numero: '001',
            nome: 'Estrela',
            sexo: 'Fêmea',
            raca: 'Nelore',
            dataNascimento: '2022-03-15',
            pesoNascimento: 32.5,
            pesoAtual: 285.0,
            mae: '',
            pai: '',
            status: 'Ativo',
            observacoes: 'Animal de boa linhagem',
            dataCadastro: '2022-03-15'
        },
        {
            id: 'animal_002',
            numero: '002',
            nome: 'Touro Forte',
            sexo: 'Macho',
            raca: 'Angus',
            dataNascimento: '2021-08-20',
            pesoNascimento: 38.0,
            pesoAtual: 450.0,
            mae: '',
            pai: '',
            status: 'Ativo',
            observacoes: 'Reprodutor principal',
            dataCadastro: '2021-08-20'
        },
        {
            id: 'animal_003',
            numero: '003',
            nome: 'Bonita',
            sexo: 'Fêmea',
            raca: 'Nelore',
            dataNascimento: '2022-01-10',
            pesoNascimento: 30.0,
            pesoAtual: 320.0,
            mae: '001',
            pai: '002',
            status: 'Gestante',
            observacoes: 'Primeira gestação',
            dataCadastro: '2022-01-10'
        },
        {
            id: 'animal_004',
            numero: '004',
            nome: 'Veloz',
            sexo: 'Macho',
            raca: 'Brahman',
            dataNascimento: '2023-05-12',
            pesoNascimento: 35.0,
            pesoAtual: 180.0,
            mae: '003',
            pai: '002',
            status: 'Ativo',
            observacoes: 'Jovem promissor',
            dataCadastro: '2023-05-12'
        },
        {
            id: 'animal_005',
            numero: '005',
            nome: 'Princesa',
            sexo: 'Fêmea',
            raca: 'Gir',
            dataNascimento: '2022-11-08',
            pesoNascimento: 28.0,
            pesoAtual: 250.0,
            mae: '',
            pai: '',
            status: 'Ativo',
            observacoes: 'Boa produtora de leite',
            dataCadastro: '2022-11-08'
        }
    ];
    
    return mockAnimals;
}

// Configurar event listeners
function setupAnimalsEventListeners() {
    // Filtros
    document.getElementById('searchAnimal').addEventListener('input', applyFilters);
    document.getElementById('filterSex').addEventListener('change', applyFilters);
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    document.getElementById('filterRace').addEventListener('change', applyFilters);
    
    // Form de animal
    document.getElementById('animalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveAnimal();
    });
}

// Aplicar filtros
function applyFilters() {
    const search = document.getElementById('searchAnimal').value.toLowerCase();
    const sexFilter = document.getElementById('filterSex').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const raceFilter = document.getElementById('filterRace').value;
    
    filteredAnimals = animalsData.filter(animal => {
        const matchSearch = !search || 
            animal.numero.toLowerCase().includes(search) ||
            (animal.nome && animal.nome.toLowerCase().includes(search)) ||
            animal.id.toLowerCase().includes(search);
            
        const matchSex = !sexFilter || animal.sexo === sexFilter;
        const matchStatus = !statusFilter || animal.status === statusFilter;
        const matchRace = !raceFilter || animal.raca === raceFilter;
        
        return matchSearch && matchSex && matchStatus && matchRace;
    });
    
    currentPage = 1;
    renderAnimalsTable();
}

// Atualizar estatísticas
function updateAnimalsStats() {
    const total = animalsData.length;
    const females = animalsData.filter(a => a.sexo === 'Fêmea').length;
    const males = animalsData.filter(a => a.sexo === 'Macho').length;
    const young = animalsData.filter(a => calculateAge(a.dataNascimento) < 365).length;
    
    document.getElementById('totalAnimalsCount').textContent = total;
    document.getElementById('femaleCount').textContent = females;
    document.getElementById('maleCount').textContent = males;
    document.getElementById('youngCount').textContent = young;
}

// Calcular idade em dias
function calculateAge(birthDate) {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    return Math.floor((today - birth) / (1000 * 60 * 60 * 24));
}

// Renderizar tabela de animais
function renderAnimalsTable() {
    const tbody = document.getElementById('animalsTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageAnimals = filteredAnimals.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageAnimals.map(animal => `
        <tr>
            <td><strong>${animal.numero}</strong></td>
            <td>${animal.nome || '-'}</td>
            <td>
                <i class="fas fa-${animal.sexo === 'Macho' ? 'mars' : 'venus'}" 
                   style="color: ${animal.sexo === 'Macho' ? '#2196F3' : '#E91E63'}"></i>
                ${animal.sexo}
            </td>
            <td>${animal.raca || '-'}</td>
            <td>${animal.dataNascimento ? Utils.formatDate(animal.dataNascimento) : '-'}</td>
            <td>${animal.dataNascimento ? Math.floor(calculateAge(animal.dataNascimento) / 30) + ' meses' : '-'}</td>
            <td>${animal.pesoAtual ? animal.pesoAtual + ' kg' : '-'}</td>
            <td>
                <span class="status-badge status-${animal.status.toLowerCase()}">
                    ${animal.status}
                </span>
            </td>
            <td>
                <div class="animal-actions">
                    <button class="btn-view" onclick="viewAnimalDetails('${animal.id}')" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit" onclick="editAnimal('${animal.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteAnimal('${animal.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    renderPagination();
}

// Renderizar paginação
function renderPagination() {
    const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
    const pagination = document.getElementById('animalsPagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<span>...</span>';
        }
    }
    
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Mudar página
function changePage(page) {
    const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderAnimalsTable();
    }
}

// Mostrar modal de novo animal
function showAddAnimalModal() {
    document.getElementById('animalModalTitle').innerHTML = '<i class="fas fa-plus"></i> Novo Animal';
    document.getElementById('animalForm').reset();
    document.getElementById('animalId').value = '';
    document.getElementById('animalStatus').value = 'Ativo';
    Modal.show('animalModal');
}

// Editar animal
function editAnimal(animalId) {
    const animal = animalsData.find(a => a.id === animalId);
    if (!animal) return;
    
    document.getElementById('animalModalTitle').innerHTML = '<i class="fas fa-edit"></i> Editar Animal';
    
    // Preencher formulário
    document.getElementById('animalId').value = animal.id;
    document.getElementById('animalNumber').value = animal.numero;
    document.getElementById('animalName').value = animal.nome || '';
    document.getElementById('animalSex').value = animal.sexo;
    document.getElementById('animalRace').value = animal.raca || '';
    document.getElementById('animalBirthDate').value = animal.dataNascimento || '';
    document.getElementById('animalBirthWeight').value = animal.pesoNascimento || '';
    document.getElementById('animalCurrentWeight').value = animal.pesoAtual || '';
    document.getElementById('animalStatus').value = animal.status;
    document.getElementById('animalMother').value = animal.mae || '';
    document.getElementById('animalFather').value = animal.pai || '';
    document.getElementById('animalObservations').value = animal.observacoes || '';
    
    Modal.show('animalModal');
}

// Ver detalhes do animal
function viewAnimalDetails(animalId) {
    const animal = animalsData.find(a => a.id === animalId);
    if (!animal) return;
    
    const age = calculateAge(animal.dataNascimento);
    const ageText = age > 0 ? `${Math.floor(age / 30)} meses e ${age % 30} dias` : 'Não informado';
    
    const detailsHTML = `
        <div class="animal-details">
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> Informações Básicas</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Número:</label>
                        <span>${animal.numero}</span>
                    </div>
                    <div class="detail-item">
                        <label>Nome:</label>
                        <span>${animal.nome || 'Não informado'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Sexo:</label>
                        <span>
                            <i class="fas fa-${animal.sexo === 'Macho' ? 'mars' : 'venus'}" 
                               style="color: ${animal.sexo === 'Macho' ? '#2196F3' : '#E91E63'}"></i>
                            ${animal.sexo}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>Raça:</label>
                        <span>${animal.raca || 'Não informado'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Status:</label>
                        <span class="status-badge status-${animal.status.toLowerCase()}">
                            ${animal.status}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>Idade:</label>
                        <span>${ageText}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-weight"></i> Informações de Peso</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Peso ao Nascer:</label>
                        <span>${animal.pesoNascimento ? animal.pesoNascimento + ' kg' : 'Não informado'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Peso Atual:</label>
                        <span>${animal.pesoAtual ? animal.pesoAtual + ' kg' : 'Não informado'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Ganho de Peso:</label>
                        <span>${animal.pesoNascimento && animal.pesoAtual ? 
                            (animal.pesoAtual - animal.pesoNascimento).toFixed(1) + ' kg' : 
                            'Não calculado'}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-family"></i> Genealogia</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Mãe:</label>
                        <span>${animal.mae || 'Não informado'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Pai:</label>
                        <span>${animal.pai || 'Não informado'}</span>
                    </div>
                </div>
            </div>
            
            ${animal.observacoes ? `
                <div class="detail-section">
                    <h4><i class="fas fa-sticky-note"></i> Observações</h4>
                    <p>${animal.observacoes}</p>
                </div>
            ` : ''}
            
            <div class="detail-section">
                <h4><i class="fas fa-calendar"></i> Datas</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Data de Nascimento:</label>
                        <span>${animal.dataNascimento ? Utils.formatDate(animal.dataNascimento) : 'Não informado'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Data de Cadastro:</label>
                        <span>${Utils.formatDate(animal.dataCadastro)}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .animal-details {
                max-height: 70vh;
                overflow-y: auto;
            }
            .detail-section {
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 1px solid #E0E0E0;
            }
            .detail-section:last-child {
                border-bottom: none;
            }
            .detail-section h4 {
                color: var(--primary-color);
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .detail-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }
            .detail-item {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            .detail-item label {
                font-weight: 600;
                color: var(--text-secondary);
                font-size: 0.9rem;
            }
            .detail-item span {
                color: var(--text-primary);
                font-weight: 500;
            }
        </style>
    `;
    
    document.getElementById('animalDetailsContent').innerHTML = detailsHTML;
    Modal.show('animalDetailsModal');
}

// Salvar animal
async function saveAnimal() {
    try {
        const form = document.getElementById('animalForm');
        const formData = new FormData(form);
        
        // Validações
        const numero = document.getElementById('animalNumber').value;
        const sexo = document.getElementById('animalSex').value;
        
        if (!numero || !sexo) {
            Utils.showNotification('Preencha os campos obrigatórios', 'error');
            return;
        }
        
        // Verificar se o número já existe (para novos animais)
        const animalId = document.getElementById('animalId').value;
        if (!animalId) {
            const existingAnimal = animalsData.find(a => a.numero === numero);
            if (existingAnimal) {
                Utils.showNotification('Já existe um animal com este número', 'error');
                return;
            }
        }
        
        Utils.showLoading(true);
        
        // Simular salvamento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const animalData = {
            id: animalId || 'animal_' + Date.now(),
            numero: numero,
            nome: document.getElementById('animalName').value,
            sexo: sexo,
            raca: document.getElementById('animalRace').value,
            dataNascimento: document.getElementById('animalBirthDate').value,
            pesoNascimento: parseFloat(document.getElementById('animalBirthWeight').value) || null,
            pesoAtual: parseFloat(document.getElementById('animalCurrentWeight').value) || null,
            status: document.getElementById('animalStatus').value,
            mae: document.getElementById('animalMother').value,
            pai: document.getElementById('animalFather').value,
            observacoes: document.getElementById('animalObservations').value,
            dataCadastro: animalId ? animalsData.find(a => a.id === animalId)?.dataCadastro : new Date().toISOString().split('T')[0]
        };
        
        if (animalId) {
            // Atualizar animal existente
            const index = animalsData.findIndex(a => a.id === animalId);
            if (index !== -1) {
                animalsData[index] = animalData;
            }
            Utils.showNotification('Animal atualizado com sucesso!', 'success');
        } else {
            // Novo animal
            animalsData.push(animalData);
            Utils.showNotification('Animal cadastrado com sucesso!', 'success');
        }
        
        // Atualizar interface
        applyFilters();
        updateAnimalsStats();
        closeAnimalModal();
        
    } catch (error) {
        console.error('Erro ao salvar animal:', error);
        Utils.showNotification('Erro ao salvar animal', 'error');
    } finally {
        Utils.showLoading(false);
    }
}

// Excluir animal
function deleteAnimal(animalId) {
    const animal = animalsData.find(a => a.id === animalId);
    if (!animal) return;
    
    if (confirm(`Tem certeza que deseja excluir o animal ${animal.numero} - ${animal.nome || 'Sem nome'}?`)) {
        Utils.showLoading(true);
        
        setTimeout(() => {
            // Remover da lista
            animalsData = animalsData.filter(a => a.id !== animalId);
            
            // Atualizar interface
            applyFilters();
            updateAnimalsStats();
            
            Utils.showLoading(false);
            Utils.showNotification('Animal excluído com sucesso!', 'success');
        }, 1000);
    }
}

// Fechar modal de animal
function closeAnimalModal() {
    Modal.hide('animalModal');
}

// Atualizar lista de animais
function refreshAnimals() {
    loadAnimals();
}

// Importar animais
function importAnimals() {
    Modal.create('importModal', 'Importar Animais', `
        <div class="import-options">
            <div class="import-option" onclick="importFromExcel()">
                <i class="fas fa-file-excel"></i>
                <h4>Importar do Excel</h4>
                <p>Importe uma planilha Excel com os dados dos animais</p>
            </div>
            <div class="import-option" onclick="downloadTemplate()">
                <i class="fas fa-download"></i>
                <h4>Baixar Modelo</h4>
                <p>Baixe o modelo de planilha para preenchimento</p>
            </div>
        </div>
        
        <style>
            .import-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
            }
            .import-option {
                padding: 25px;
                border: 2px solid #E0E0E0;
                border-radius: 12px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .import-option:hover {
                border-color: var(--primary-color);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .import-option i {
                font-size: 2.5rem;
                color: var(--primary-color);
                margin-bottom: 15px;
            }
            .import-option h4 {
                margin-bottom: 10px;
                color: var(--text-primary);
            }
            .import-option p {
                color: var(--text-secondary);
                font-size: 0.9rem;
                margin: 0;
            }
        </style>
    `);
    
    Modal.show('importModal');
}

// Exportar animais
function exportAnimals() {
    Utils.showLoading(true);
    
    setTimeout(() => {
        // Simular exportação
        const csvContent = generateAnimalsCSV();
        downloadCSV(csvContent, 'animais_' + new Date().toISOString().split('T')[0] + '.csv');
        
        Utils.showLoading(false);
        Utils.showNotification('Dados exportados com sucesso!', 'success');
    }, 1500);
}

// Gerar CSV dos animais
function generateAnimalsCSV() {
    const headers = ['Número', 'Nome', 'Sexo', 'Raça', 'Data Nascimento', 'Peso Nascimento', 'Peso Atual', 'Status', 'Mãe', 'Pai', 'Observações'];
    
    const rows = filteredAnimals.map(animal => [
        animal.numero,
        animal.nome || '',
        animal.sexo,
        animal.raca || '',
        animal.dataNascimento || '',
        animal.pesoNascimento || '',
        animal.pesoAtual || '',
        animal.status,
        animal.mae || '',
        animal.pai || '',
        animal.observacoes || ''
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

// Funções mock para importação
function importFromExcel() {
    Modal.hide('importModal');
    Utils.showNotification('Funcionalidade de importação será implementada em breve', 'info');
}

function downloadTemplate() {
    Modal.hide('importModal');
    const templateContent = generateAnimalsCSV();
    downloadCSV('Número,Nome,Sexo,Raça,Data Nascimento,Peso Nascimento,Peso Atual,Status,Mãe,Pai,Observações\n001,Exemplo,Fêmea,Nelore,2023-01-01,30,250,Ativo,,,Animal de exemplo', 'modelo_animais.csv');
    Utils.showNotification('Modelo baixado com sucesso!', 'success');
}

// Exportar funções globais
window.showAddAnimalModal = showAddAnimalModal;
window.editAnimal = editAnimal;
window.viewAnimalDetails = viewAnimalDetails;
window.deleteAnimal = deleteAnimal;
window.saveAnimal = saveAnimal;
window.closeAnimalModal = closeAnimalModal;
window.refreshAnimals = refreshAnimals;
window.importAnimals = importAnimals;
window.exportAnimals = exportAnimals;
window.changePage = changePage;
window.importFromExcel = importFromExcel;
window.downloadTemplate = downloadTemplate;

