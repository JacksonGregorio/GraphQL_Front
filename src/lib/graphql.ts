import { GraphQLClient } from 'graphql-request';

// Configurar o cliente GraphQL
const graphqlClient = new GraphQLClient('http://localhost:3000/graphql', {
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include', // Para cookies de autenticação
});

// Função para adicionar token de autorização
export const setAuthToken = (token: string) => {
    graphqlClient.setHeader('Authorization', `Bearer ${token}`);
};

// Função para remover token de autorização
export const removeAuthToken = () => {
    graphqlClient.setHeader('Authorization', '');
};

export default graphqlClient;
