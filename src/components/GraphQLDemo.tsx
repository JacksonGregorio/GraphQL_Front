import React, { useState } from 'react';
import { useGraphQLLogin, useGetUsers, useGetMe, useGraphQLLogout } from '../hooks/useGraphQL';
import { useAuthStatus } from '../hooks/useAuth';

const GraphQLDemo: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const graphqlLogin = useGraphQLLogin();
    const { data: users, isLoading: usersLoading, error: usersError } = useGetUsers();
    const { data: me, isLoading: meLoading } = useGetMe();
    const { data: authStatus } = useAuthStatus();
    const logout = useGraphQLLogout();

    const handleGraphQLLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Por favor, preencha todos os campos');
            return;
        }
        graphqlLogin.mutate({ 
            input: { 
                email, 
                password 
            }
        });
    };

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
            <h1>GraphQL Demo</h1>
            
            {/* Status de Autenticação */}
            {authStatus && (
                <div style={{ 
                    marginBottom: '20px',
                    padding: '10px',
                    backgroundColor: authStatus.isAuthenticated ? '#e8f5e8' : '#fff3cd',
                    border: `1px solid ${authStatus.isAuthenticated ? '#4caf50' : '#ffc107'}`,
                    borderRadius: '4px'
                }}>
                    <strong>Status:</strong> {authStatus.isAuthenticated ? 'Autenticado' : 'Não autenticado'}
                    {authStatus.user && (
                        <div>
                            <strong>Usuário:</strong> {authStatus.user.name} ({authStatus.user.email})
                        </div>
                    )}
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

            {/* Formulário de Login GraphQL */}
            {!authStatus?.isAuthenticated && (
                <div style={{ marginBottom: '30px' }}>
                    <h2>Login com GraphQL</h2>
                    <form onSubmit={handleGraphQLLogin}>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="graphql-email">Email:</label>
                            <input 
                                type="email" 
                                id="graphql-email" 
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
                            <label htmlFor="graphql-password">Password:</label>
                            <input 
                                type="password" 
                                id="graphql-password" 
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
                            disabled={graphqlLogin.isPending}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: graphqlLogin.isPending ? '#ccc' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: graphqlLogin.isPending ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {graphqlLogin.isPending ? 'Fazendo login GraphQL...' : 'Login GraphQL'}
                        </button>
                    </form>
                    
                    {/* Mostrar erros do GraphQL */}
                    {graphqlLogin.isError && (
                        <div style={{ 
                            color: 'red', 
                            marginTop: '10px',
                            padding: '10px',
                            backgroundColor: '#ffebee',
                            border: '1px solid #f44336',
                            borderRadius: '4px'
                        }}>
                            Erro GraphQL: {(graphqlLogin.error as Error)?.message || 'Erro desconhecido'}
                        </div>
                    )}
                    
                    {/* Mostrar sucesso do GraphQL */}
                    {graphqlLogin.isSuccess && (
                        <div style={{ 
                            color: 'green', 
                            marginTop: '10px',
                            padding: '10px',
                            backgroundColor: '#e8f5e8',
                            border: '1px solid #4caf50',
                            borderRadius: '4px'
                        }}>
                            Login GraphQL realizado com sucesso!
                        </div>
                    )}
                </div>
            )}

            {/* Dados do usuário atual (GraphQL) */}
            {authStatus?.isAuthenticated && (
                <div style={{ marginBottom: '30px' }}>
                    <h2>Meus Dados (GraphQL)</h2>
                    {meLoading ? (
                        <p>Carregando dados do usuário...</p>
                    ) : me ? (
                        <div style={{
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            borderRadius: '4px'
                        }}>
                            <p><strong>ID:</strong> {me.me.id}</p>
                            <p><strong>Nome:</strong> {me.me.name}</p>
                            <p><strong>Email:</strong> {me.me.email}</p>
                            <p><strong>Posição:</strong> {me.me.position}</p>
                            <p><strong>Ativo:</strong> {me.me.isActive ? 'Sim' : 'Não'}</p>
                            <p><strong>Criado em:</strong> {new Date(me.me.createdAt).toLocaleDateString()}</p>
                        </div>
                    ) : (
                        <p>Não foi possível carregar os dados do usuário.</p>
                    )}
                </div>
            )}

            {/* Lista de usuários (GraphQL) */}
            {authStatus?.isAuthenticated && (
                <div>
                    <h2>Lista de Usuários (GraphQL)</h2>
                    {usersLoading ? (
                        <p>Carregando usuários...</p>
                    ) : usersError ? (
                        <div style={{ color: 'red' }}>
                            Erro ao carregar usuários: {(usersError as Error)?.message || 'Erro desconhecido'}
                        </div>
                    ) : users ? (
                        <div style={{
                            display: 'grid',
                            gap: '10px',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
                        }}>
                            {users.users.map((user: any) => (
                                <div key={user.id} style={{
                                    padding: '15px',
                                    backgroundColor: '#f8f9fa',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '4px'
                                }}>
                                    <h4>{user.name}</h4>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Posição:</strong> {user.position}</p>
                                    <p><strong>Ativo:</strong> {user.isActive ? 'Sim' : 'Não'}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Nenhum usuário encontrado.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default GraphQLDemo;
