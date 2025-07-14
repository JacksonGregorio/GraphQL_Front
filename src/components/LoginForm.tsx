import React, { useState } from 'react';
import { useLogin, useAuthStatus, useLogout } from '../hooks/useAuth';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const loginMutation = useLogin();
    const { data: authStatus, isLoading: isCheckingAuth } = useAuthStatus();
    const logout = useLogout();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        

        if (!email || !password) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        loginMutation.mutate({ email, password });
    };

    return (
        <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px' }}>
            <h1>Login</h1>
            
            {/* Mostrar status de autenticação */}
            {authStatus && (
                <div style={{ 
                    marginBottom: '20px',
                    padding: '10px',
                    backgroundColor: authStatus.isAuthenticated ? '#e8f5e8' : '#fff3cd',
                    border: `1px solid ${authStatus.isAuthenticated ? '#4caf50' : '#ffc107'}`,
                    borderRadius: '4px'
                }}>
                    Status: {authStatus.isAuthenticated ? 'Autenticado' : 'Não autenticado'}
                    {authStatus.user && <div>Usuário: {authStatus.user.email}</div>}
                    {authStatus.isAuthenticated && (
                        <button 
                            onClick={logout}
                            style={{
                                marginTop: '10px',
                                padding: '5px 10px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        style={{ 
                            width: '100%', 
                            padding: '8px', 
                            marginTop: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                        placeholder="joao.silva@example2.com"
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        style={{ 
                            width: '100%', 
                            padding: '8px', 
                            marginTop: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                        placeholder="minhasenhAAAA123"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loginMutation.isLoading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: loginMutation.isLoading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loginMutation.isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loginMutation.isLoading ? 'Fazendo login...' : 'Login'}
                </button>
            </form>
            
            {/* Mostrar erros se houver */}
            {loginMutation.isError && (
                <div style={{ 
                    color: 'red', 
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    border: '1px solid #f44336',
                    borderRadius: '4px'
                }}>
                    Erro: {(loginMutation.error as Error)?.message || 'Erro desconhecido'}
                </div>
            )}
            
            {/* Mostrar sucesso se houver */}
            {loginMutation.isSuccess && (
                <div style={{ 
                    color: 'green', 
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #4caf50',
                    borderRadius: '4px'
                }}>
                    Login realizado com sucesso!
                </div>
            )}
        </div>
    );
};

export default LoginForm;