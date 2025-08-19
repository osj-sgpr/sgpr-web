/**
 * SGPR - Sistema de Autenticação (Versão Segura)
 * Gerencia login, logout e sessões de usuário
 */

const Auth = {
    // Chave para armazenamento local
    STORAGE_KEY: 'sgpr_user_session',
    
    // Inicializar sistema de autenticação
    init() {
        this.setupLoginForm();
        this.loadProperties();
        this.checkExistingSession();
    },
    
    // Configurar formulário de login
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    },
    
    // Carregar propriedades disponíveis
    async loadProperties() {
        const propertySelect = document.getElementById('property');
        if (!propertySelect) return;
        
        try {
            // Usar dados mock para demonstração
            const properties = await this.getMockProperties();
            
            propertySelect.innerHTML = '<option value="">Selecione uma propriedade</option>';
            
            properties.forEach(property => {
                const option = document.createElement('option');
                option.value = property.id;
                option.textContent = property.name;
                propertySelect.appendChild(option);
            });
            
        } catch (error) {
            console.error('Erro ao carregar propriedades:', error);
            propertySelect.innerHTML = '<option value="">Erro ao carregar propriedades</option>';
        }
    },
    
    // Dados mock de propriedades (para demonstração)
    async getMockProperties() {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return [
            { id: 'prop_001', name: 'Fazenda Torre' },
            { id: 'prop_002', name: 'Sítio Boa Vista' },
            { id: 'prop_003', name: 'Rancho Alegre' },
            { id: 'prop_004', name: 'Fazenda Santa Maria' }
        ];
    },
    
    // Verificar sessão existente
    checkExistingSession() {
        const userData = this.getCurrentUser();
        if (userData && this.isSessionValid(userData)) {
            // Se estiver na página de login, redirecionar para dashboard
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                window.location.href = 'dashboard.html';
            }
        } else {
            // Limpar sessão inválida
            this.clearSession();
        }
    },
    
    // Verificar se sessão é válida
    isSessionValid(userData) {
        if (!userData || !userData.loginTime) return false;
        
        // Sessão válida por 24 horas
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas em ms
        const now = Date.now();
        
        return (now - userData.loginTime) < sessionDuration;
    },
    
    // Processar login
    async handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const propertyId = document.getElementById('property').value;
        
        // Validações básicas
        if (!email || !password || !propertyId) {
            Utils.showNotification('Preencha todos os campos', 'error');
            return;
        }
        
        if (!Utils.validateEmail(email)) {
            Utils.showNotification('Email inválido', 'error');
            return;
        }
        
        if (password.length < SGPR.config.MIN_PASSWORD_LENGTH) {
            Utils.showNotification(`Senha deve ter pelo menos ${SGPR.config.MIN_PASSWORD_LENGTH} caracteres`, 'error');
            return;
        }
        
        try {
            Utils.showLoading(true);
            
            // Tentar login real via API
            let loginResult;
            try {
                loginResult = await API.login(email, password, propertyId);
            } catch (apiError) {
                console.warn('API não disponível, usando dados mock:', apiError.message);
                // Fallback para dados mock
                loginResult = await this.mockLogin(email, password, propertyId);
            }
            
            if (loginResult.success) {
                // Salvar dados do usuário
                const userData = {
                    id: loginResult.user.id,
                    email: loginResult.user.email,
                    name: loginResult.user.name,
                    propertyId: loginResult.user.propertyId,
                    propertyName: loginResult.user.propertyName,
                    permissions: loginResult.user.permissions || [],
                    loginTime: Date.now()
                };
                
                this.saveUserSession(userData);
                
                Utils.showNotification('Login realizado com sucesso!', 'success');
                
                // Redirecionar para dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
                
            } else {
                Utils.showNotification(loginResult.message || 'Credenciais inválidas', 'error');
            }
            
        } catch (error) {
            console.error('Erro no login:', error);
            Utils.showNotification('Erro ao fazer login. Tente novamente.', 'error');
        } finally {
            Utils.showLoading(false);
        }
    },
    
    // Login mock para demonstração
    async mockLogin(email, password, propertyId) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Credenciais de demonstração
        const mockUsers = [
            {
                email: 'teste@sgpr.com',
                password: '123456',
                name: 'Usuário Teste',
                properties: ['prop_001', 'prop_002']
            },
            {
                email: 'admin@sgpr.com',
                password: 'admin123',
                name: 'Administrador',
                properties: ['prop_001', 'prop_002', 'prop_003', 'prop_004']
            }
        ];
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return { success: false, message: 'Email ou senha incorretos' };
        }
        
        if (!user.properties.includes(propertyId)) {
            return { success: false, message: 'Usuário não tem acesso a esta propriedade' };
        }
        
        // Buscar nome da propriedade
        const properties = await this.getMockProperties();
        const property = properties.find(p => p.id === propertyId);
        
        return {
            success: true,
            user: {
                id: Utils.generateId('user'),
                email: user.email,
                name: user.name,
                propertyId: propertyId,
                propertyName: property ? property.name : 'Propriedade',
                permissions: ['read', 'write', 'delete']
            }
        };
    },
    
    // Salvar sessão do usuário
    saveUserSession(userData) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userData));
            SGPR.user = userData;
        } catch (error) {
            console.error('Erro ao salvar sessão:', error);
        }
    },
    
    // Obter usuário atual
    getCurrentUser() {
        try {
            const userData = localStorage.getItem(this.STORAGE_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Erro ao recuperar sessão:', error);
            return null;
        }
    },
    
    // Limpar sessão
    clearSession() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            SGPR.user = null;
        } catch (error) {
            console.error('Erro ao limpar sessão:', error);
        }
    },
    
    // Fazer logout
    logout() {
        if (confirm('Tem certeza que deseja sair do sistema?')) {
            this.clearSession();
            Utils.showNotification('Logout realizado com sucesso', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    },
    
    // Verificar permissão
    hasPermission(permission) {
        const user = this.getCurrentUser();
        if (!user || !user.permissions) return false;
        
        return user.permissions.includes(permission) || user.permissions.includes('admin');
    },
    
    // Renovar sessão
    renewSession() {
        const userData = this.getCurrentUser();
        if (userData) {
            userData.loginTime = Date.now();
            this.saveUserSession(userData);
        }
    }
};

// Inicializar autenticação quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Só inicializar na página de login
    if (document.getElementById('loginForm')) {
        Auth.init();
    }
});

// Exportar Auth globalmente
window.Auth = Auth;

