/**
 * SGPR - Arquivo de Configuração
 * CONFIGURADO COM OS LINKS FORNECIDOS
 */

// ✅ CONFIGURAÇÃO ATUALIZADA ✅
const SGPR_CONFIG = {
    // URL do Google Apps Script (Web App)
    API_URL: 'https://script.google.com/macros/s/AKfycbxkC2-X5jWFx2mfNn6-eGag0M9uy-k5gq6x35AVHeTZ1ylFPOu_0ddGphh6UpZ3gb57/exec',
    
    // Configurações do sistema
    SYSTEM_NAME: 'SGPR - Sistema de Gestão de Propriedades Rurais',
    VERSION: '1.0.0',
    
    // Configurações de interface
    ITEMS_PER_PAGE: 15,
    AUTO_SAVE_INTERVAL: 30000, // 30 segundos
    
    // Configurações de validação
    MIN_PASSWORD_LENGTH: 6,
    MAX_ANIMAL_NUMBER: 99999,
    
    // Configurações de relatórios
    DEFAULT_REPORT_PERIOD: 'current_month',
    MAX_EXPORT_RECORDS: 1000
};

// Exportar configuração
window.SGPR_CONFIG = SGPR_CONFIG;

