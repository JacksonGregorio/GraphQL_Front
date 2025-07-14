# 🚀 Teste GraphQL - Instruções

## ✅ Status Atual
- ✅ Frontend React com GraphQL integrado
- ✅ Aplicação rodando em: http://localhost:8080
- ✅ Cliente GraphQL configurado para: http://localhost:3000/graphql
- ✅ React Query + GraphQL funcionando
- ✅ Autenticação GraphQL implementada

## 🔧 Para testar:

### 1. **Certifique-se que seu backend GraphQL está rodando**
   - Servidor deve estar em: `http://localhost:3000/graphql`
   - Verifique se o schema está acessível

### 2. **Teste no navegador**
   - Acesse: http://localhost:8080
   - Você verá a interface do GraphQL Demo
   - Use as credenciais de teste do seu backend

### 3. **Funcionalidades disponíveis:**
   - ✅ Login via GraphQL mutation
   - ✅ Buscar dados do usuário logado (query `me`)
   - ✅ Listar todos os usuários (query `users`)
   - ✅ Logout com limpeza de cache
   - ✅ Integração com React Query para cache

### 4. **Estrutura das Queries/Mutations utilizadas:**

```graphql
# Login
mutation Login($input: LoginInput!) {
  login(input: $input) {
    message
    user { id, name, email, position, isActive, createdAt, updatedAt }
    tokens { accessToken, refreshToken, expiresIn }
  }
}

# Buscar usuários
query GetUsers {
  users { id, name, email, position, isActive, createdAt, updatedAt }
}

# Dados do usuário atual
query GetMe {
  me { id, name, email, position, isActive, createdAt, updatedAt }
}
```

### 5. **Debug**
   - Abra o DevTools do navegador (F12)
   - Vá na aba Console para ver logs de debug
   - Vá na aba Network para ver as requisições GraphQL

### 6. **React Query Devtools**
   - Pressione o ícone da React Query Devtools (canto inferior da tela)
   - Você pode monitorar o cache e estado das queries

## 🐛 Possíveis Problemas:

1. **Erro de conexão**: Verifique se o backend está rodando na porta 3000
2. **CORS**: Certifique-se que o backend permite requisições do localhost:8080
3. **Schema**: Verifique se o schema GraphQL do backend corresponde às queries

## 📂 Arquivos principais:
- `src/lib/graphql.ts` - Cliente GraphQL
- `src/hooks/useGraphQL.ts` - Hooks personalizados
- `src/components/GraphQLDemo.tsx` - Interface de teste
- `schema.graphql` - Documentação do schema

## 🎯 Próximos passos após teste:
- Implementar mais queries conforme necessário
- Adicionar tratamento de erros específicos
- Configurar cache policies do React Query
- Implementar refresh token automático
