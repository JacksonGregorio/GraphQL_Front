import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Tipos para os dados de login
export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    message?: string;
    user?: {
        id: number;
        name: string;
        email: string;
        position: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    };
    tokens?: {
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
    };
}

// Função para fazer a requisição de login
const loginUser = async (loginData: LoginData): Promise<LoginResponse> => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer login');
    }

    return response.json();
};

// Hook personalizado para login
export const useLogin = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ['login'], // Adicionar chave para facilitar debug
        mutationFn: loginUser,
        onSuccess: (data) => {
            console.log('Login realizado com sucesso:', data);
            // Salvar tokens no localStorage
            if (data.tokens) {
                localStorage.setItem('accessToken', data.tokens.accessToken);
                localStorage.setItem('refreshToken', data.tokens.refreshToken);
                localStorage.setItem('tokenExpiresIn', data.tokens.expiresIn);
            }
            // Salvar dados do usuário se necessário
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            // Invalidar a query de status de autenticação para atualizá-la
            queryClient.invalidateQueries({ queryKey: ['authStatus'] });
        },
        onError: (error) => {
            console.error('Erro no login:', error);
        },
    });
};

// Hook para logout
export const useLogout = () => {
    return () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresIn');
        localStorage.removeItem('user');
        // Aqui você pode adicionar mais lógica de logout, como redirect
        window.location.reload(); // Recarregar a página para limpar o estado
    };
};

// Hook para verificar se o usuário está autenticado
export const useAuthStatus = () => {
    return useQuery({
        queryKey: ['authStatus'],
        queryFn: () => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const user = localStorage.getItem('user');
            return {
                isAuthenticated: !!accessToken,
                accessToken,
                refreshToken,
                user: user ? JSON.parse(user) : null,
            };
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};
