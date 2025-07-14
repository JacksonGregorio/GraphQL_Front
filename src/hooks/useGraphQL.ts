import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import graphqlClient, { setAuthToken, removeAuthToken } from '../lib/graphql';

// Tipos para GraphQL
export interface User {
    id: number;
    name: string;
    email: string;
    position: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GraphQLUsersResponse {
    users: User[];
}

export interface GraphQLMeResponse {
    me: User;
}

export interface GraphQLLoginInput {
    input: {
        email: string;
        password: string;
    };
}

export interface GraphQLLoginResponse {
    login: {
        message: string;
        user: User;
        tokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: string;
        };
    };
}

// Queries GraphQL
const LOGIN_MUTATION = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            message
            user {
                id
                name
                email
                position
                isActive
                createdAt
                updatedAt
            }
            tokens {
                accessToken
                refreshToken
                expiresIn
            }
        }
    }
`;

const GET_USERS_QUERY = gql`
    query GetUsers {
        users {
            id
            name
            email
            position
            isActive
            createdAt
            updatedAt
        }
    }
`;

const GET_ME_QUERY = gql`
    query GetMe {
        me {
            id
            name
            email
            position
            isActive
            createdAt
            updatedAt
        }
    }
`;

// Hook para login com GraphQL
export const useGraphQLLogin = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ['graphql-login'],
        mutationFn: async (variables: GraphQLLoginInput): Promise<GraphQLLoginResponse> => {
            return graphqlClient.request(LOGIN_MUTATION, variables);
        },
        onSuccess: (data) => {
            console.log('GraphQL Login realizado com sucesso:', data);
            const { tokens, user } = data.login;
            
            // Salvar tokens no localStorage
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            localStorage.setItem('tokenExpiresIn', tokens.expiresIn);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Configurar token no cliente GraphQL
            setAuthToken(tokens.accessToken);
            
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['authStatus'] });
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
        onError: (error) => {
            console.error('Erro no GraphQL login:', error);
        },
    });
};

// Hook para buscar usuários
export const useGetUsers = () => {
    return useQuery<GraphQLUsersResponse>({
        queryKey: ['users'],
        queryFn: async (): Promise<GraphQLUsersResponse> => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                setAuthToken(token);
            }
            return graphqlClient.request(GET_USERS_QUERY);
        },
        enabled: !!localStorage.getItem('accessToken'), // Só executa se tiver token
    });
};

// Hook para buscar dados do usuário atual
export const useGetMe = () => {
    return useQuery<GraphQLMeResponse>({
        queryKey: ['me'],
        queryFn: async (): Promise<GraphQLMeResponse> => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                setAuthToken(token);
            }
            return graphqlClient.request(GET_ME_QUERY);
        },
        enabled: !!localStorage.getItem('accessToken'), // Só executa se tiver token
    });
};

// Hook para logout GraphQL
export const useGraphQLLogout = () => {
    const queryClient = useQueryClient();
    
    return () => {
        // Remover tokens do localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresIn');
        localStorage.removeItem('user');
        
        // Remover token do cliente GraphQL
        removeAuthToken();
        
        // Limpar cache das queries
        queryClient.clear();
        
        // Recarregar a página
        window.location.reload();
    };
};
