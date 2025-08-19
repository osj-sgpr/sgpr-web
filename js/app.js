/**
 * SGPR - Aplicação Principal (Versão Segura)
 * Sistema de Gestão de Propriedades Rurais
 */

// Verificar se a configuração foi carregada
if (typeof SGPR_CONFIG === 'undefined') {
    console.error('⚠️ ERRO: Arquivo config.js não foi carregado');
    alert('Erro de configuração. Verifique se o arquivo config.js está presente.');
}

// Objeto principal da aplicação
const SGPR = {
    config: SGPR_CONFIG,
    cache: {},
    user: null,
    
    // Inicializar aplicação
    init() {
        console.log(`${this.config.SYSTEM_NAME} v${this.config.VERSION}`);
        this.checkConfiguration();
        this.setupGlobalEventListeners();
    },
    
    // Verificar configuração
    checkConfiguration() {
        if (this.config.API_URL === 'SUBSTITUA_PELA_URL_DO_SEU_GOOGLE_APPS_SCRIPT') {
            this.showConfigurationError();
            return false;
        }
        return true;
    },
    
    // Mostrar erro de configuração
    showConfigurationError() {
        const errorHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0,0,0,0.9); z-index: 10000; display: flex; 
                        align-items: center; justify-content: center; color: white; 
                        font-family: Arial, sans-serif; text-align: center;">
                <div style="background: #f44336; padding: 30px; border-radius: 10px; max-width: 500px;">
                    <h2>⚠️ Configuração Necessária</h2>
                    <p>O sistema precisa ser configurado antes do uso.</p>
                    <p><strong>Configure a URL do Google Apps Script no arquivo config.js</strong></p>
                    <p>Consulte o manual de instalação para mais detalhes.</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
    },
    
    // Configurar event listeners globais
    setupGlobalEventListeners() {
        // Interceptar erros de rede
        window.addEventListener('online', () => {
            Utils.showNotification('Conexão restaurada', 'success');
        });
        
        window.addEventListener('offline', () => {
            Utils.showNotification('Sem conexão com internet', 'warning');
        });
        
        // Interceptar erros JavaScript
        window.addEventListener('error', (event) => {
            console.error('Erro JavaScript:', event.error);
        });
    }
};

// Utilitários gerais
const Utils = {
    // Mostrar/ocultar loading
    showLoading(show = true) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('hidden', !show);
        }
    },
    
    // Mostrar notificação
    showNotification(message, type = 'info', duration = 3000) {
        // Remover notificações existentes
        const existing = document.querySelectorAll('.notification');
        existing.forEach(n => n.remove());
        
        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(notification);
        
        // Remover automaticamente
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    },
    
    // Ícone da notificação
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    },
    
    // Formatar data
    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    },
    
    // Formatar moeda
    formatCurrency(value) {
        if (typeof value !== 'number') value = parseFloat(value) || 0;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },
    
    // Formatar número
    formatNumber(value, decimals = 2) {
        if (typeof value !== 'number') value = parseFloat(value) || 0;
        return value.toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },
    
    // Validar email
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    // Gerar ID único
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Debounce para otimizar buscas
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Sistema de Modal
const Modal = {
    show(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Focar no primeiro input
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    },
    
    hide(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    },
    
    hideAll() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = '';
    }
};

// API para comunicação com Google Apps Script
const API = {
    // Fazer requisição para o Google Apps Script
    async request(action, data = {}) {
        try {
            const response = await fetch(SGPR.config.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: action,
                    data: data,
                    timestamp: Date.now()
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.message || 'Erro desconhecido');
            }
            
            return result;
            
        } catch (error) {
            console.error('Erro na API:', error);
            
            // Tratar erros específicos
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Erro de conexão. Verifique sua internet.');
            } else if (error.message.includes('HTTP 404')) {
                throw new Error('Serviço não encontrado. Verifique a configuração.');
            } else {
                throw error;
            }
        }
    },
    
    // Métodos específicos da API
    async login(email, password, propertyId) {
        return await this.request('login', { email, password, propertyId });
    },
    
    async getProperties() {
        return await this.request('getProperties');
    },
    
    async getAnimals(propertyId, filters = {}) {
        return await this.request('getAnimals', { propertyId, filters });
    },
    
    async saveAnimal(animalData) {
        return await this.request('saveAnimal', animalData);
    },
    
    async deleteAnimal(animalId) {
        return await this.request('deleteAnimal', { animalId });
    },
    
    async getFinancial(propertyId, filters = {}) {
        return await this.request('getFinancial', { propertyId, filters });
    },
    
    async saveTransaction(transactionData) {
        return await this.request('saveTransaction', transactionData);
    },
    
    async deleteTransaction(transactionId) {
        return await this.request('deleteTransaction', { transactionId });
    },
    
    async getReports(propertyId, reportType, filters = {}) {
        return await this.request('getReports', { propertyId, reportType, filters });
    }
};

// Verificar autenticação necessária
function requireAuth() {
    const currentUser = Auth.getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    
    // Atualizar informações do usuário na interface
    updateUserInterface(currentUser);
    return true;
}

// Atualizar interface com dados do usuário
function updateUserInterface(userData) {
    // Atualizar nome do usuário
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        el.textContent = userData.name || userData.email;
    });
    
    // Atualizar propriedade
    const userPropertyElements = document.querySelectorAll('.user-property');
    userPropertyElements.forEach(el => {
        el.textContent = userData.propertyName || 'Propriedade';
    });
}

// Funções globais para suporte
function showSupport() {
    Modal.show('supportModal');
}

function closeSupportModal() {
    Modal.hide('supportModal');
}

// Inicializar aplicação quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    SGPR.init();
});

// Exportar objetos globais
window.SGPR = SGPR;
window.Utils = Utils;
window.Modal = Modal;
window.API = API;
window.requireAuth = requireAuth;

