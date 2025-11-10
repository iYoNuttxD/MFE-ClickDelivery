# MFE-ClickDelivery

Microfrontend (MFE) da plataforma ClickDelivery - Sistema completo de delivery com múltiplos perfis de usuário.

## 🚀 Stack Tecnológica

- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router v6** - Roteamento com code splitting
- **Zustand** - Gerenciamento de estado
- **Tailwind CSS** - Framework CSS
- **Auth0** - Autenticação e autorização
- **Axios** - Cliente HTTP
- **react-i18next** - Internacionalização
- **Jest + React Testing Library** - Testes

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🔧 Configuração Local

### 1. Clone o repositório

```bash
git clone https://github.com/iYoNuttxD/MFE-ClickDelivery.git
cd MFE-ClickDelivery
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
VITE_API_BASE_URL=https://cd-apim-gateway.azure-api.net/api/v1
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://cd-apim-gateway.azure-api.net
VITE_AUTH0_REDIRECT_URI=http://localhost:3000
VITE_ENVIRONMENT=development
```

### 4. Execute o projeto em modo desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🏗️ Arquitetura

### Estrutura de Pastas

```
MFE-ClickDelivery/
├── src/
│   ├── app/                      # Configuração da aplicação
│   │   ├── providers/            # Context providers (Auth, I18n)
│   │   ├── guards/               # Route guards (Protected, Role)
│   │   ├── router.tsx            # Configuração de rotas
│   │   └── App.tsx               # Componente raiz
│   ├── shared/                   # Código compartilhado
│   │   ├── api/                  # HTTP client e configuração
│   │   ├── config/               # Configurações de ambiente
│   │   ├── utils/                # Utilitários (correlation ID, JWT)
│   │   ├── hooks/                # Custom hooks
│   │   └── ui/components/        # Componentes UI compartilhados
│   ├── entities/                 # Entidades de domínio
│   │   ├── user/                 # Usuário
│   │   ├── restaurant/           # Restaurante
│   │   ├── order/                # Pedido
│   │   ├── delivery/             # Entrega
│   │   ├── rental/               # Aluguel
│   │   ├── vehicle/              # Veículo
│   │   └── notification/         # Notificação
│   ├── features/                 # Features/Funcionalidades
│   │   ├── auth/                 # Autenticação
│   │   ├── cart/                 # Carrinho de compras
│   │   ├── order-tracking/       # Rastreamento de pedidos
│   │   ├── reviews/              # Avaliações
│   │   ├── vehicle-rental/       # Aluguel de veículos
│   │   └── admin-management/     # Gerenciamento admin
│   ├── pages/                    # Páginas da aplicação
│   │   ├── public/               # Páginas públicas
│   │   ├── customer/             # Páginas do cliente
│   │   ├── restaurant/           # Páginas do restaurante
│   │   ├── courier/              # Páginas do entregador
│   │   ├── owner/                # Páginas do proprietário
│   │   └── admin/                # Páginas do admin
│   └── widgets/                  # Widgets/Layouts
│       ├── layout/               # Layouts (Main, Admin)
│       └── notifications/        # Centro de notificações
├── tests/                        # Testes
└── public/                       # Arquivos estáticos
```

### Princípios de Arquitetura

1. **API Gateway Único**: Todas as requisições HTTP são feitas através do API Gateway: `https://cd-apim-gateway.azure-api.net/api/v1`
2. **Nunca Acesso Direto**: Nunca acessar diretamente hosts `*.azurewebsites.net` dos microservices
3. **Headers Obrigatórios**: Todas as requisições incluem:
   - `Authorization`: Token JWT do usuário autenticado
   - `x-correlation-id`: UUID único para rastreamento de requisições
4. **Tratamento de Erros Padronizado**: Erros seguem o formato:
   ```json
   {
     "error": "ERROR_CODE",
     "message": "Error message",
     "statusCode": 400,
     "correlationId": "uuid",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

## 👥 Perfis de Usuário

### Customer (Cliente)
- Explorar restaurantes
- Fazer pedidos
- Acompanhar entregas
- Gerenciar perfil

### Restaurant (Restaurante)
- Gerenciar cardápio
- Receber e processar pedidos
- Visualizar estatísticas

### Courier (Entregador)
- Aceitar entregas
- Alugar veículos
- Visualizar ganhos

### Owner (Proprietário)
- Cadastrar veículos
- Gerenciar aluguéis
- Visualizar receita

### Admin (Administrador)
- Gerenciar usuários
- Gerenciar restaurantes
- Visualizar relatórios
- Auditoria do sistema

## 🔐 Autenticação

A autenticação é gerenciada pelo Auth0:

1. O usuário é redirecionado para o Auth0 para login
2. Após autenticação bem-sucedida, o token JWT é armazenado
3. O token é automaticamente incluído em todas as requisições HTTP
4. As roles são extraídas do token JWT
5. Guards de rota verificam autenticação e autorização

### Configuração Auth0

#### Variáveis de Ambiente Obrigatórias

```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=clickdelivery-ap
VITE_AUTH0_SCOPE=openid profile email offline_access
VITE_AUTH0_REDIRECT_URI=http://localhost:3000
```

#### Descrição das Variáveis

- **VITE_AUTH0_DOMAIN**: Domínio do seu tenant Auth0 (ex: `dev-abc123.auth0.com`)
- **VITE_AUTH0_CLIENT_ID**: Client ID da aplicação SPA no Auth0
- **VITE_AUTH0_AUDIENCE**: API Identifier configurado no Auth0 (`clickdelivery-ap`)
- **VITE_AUTH0_SCOPE**: Escopos OAuth2 solicitados (sempre inclua `offline_access` para refresh tokens)
- **VITE_AUTH0_REDIRECT_URI**: URL de callback após login (deve estar configurada no Auth0)

#### Configuração no Dashboard Auth0

1. **Criar Application**:
   - Tipo: Single Page Application
   - Allowed Callback URLs: `http://localhost:3000, https://seu-dominio.azurestaticapps.net`
   - Allowed Logout URLs: `http://localhost:3000, https://seu-dominio.azurestaticapps.net`
   - Allowed Web Origins: `http://localhost:3000, https://seu-dominio.azurestaticapps.net`

2. **Criar API**:
   - Name: ClickDelivery API
   - Identifier: `clickdelivery-ap` (usar exatamente este valor)
   - Signing Algorithm: RS256

3. **Configurar Roles** (opcional):
   - No Auth0, criar as roles: `customer`, `restaurant`, `courier`, `owner`, `admin`
   - Adicionar Action para incluir roles no token (namespace: `https://schemas.example.com/roles`)

#### Diferenças entre Desenvolvimento e Produção

**Desenvolvimento (Local)**:
```env
VITE_AUTH0_REDIRECT_URI=http://localhost:3000
VITE_ENVIRONMENT=development
```

**Produção (Azure)**:
```env
VITE_AUTH0_REDIRECT_URI=https://seu-dominio.azurestaticapps.net
VITE_ENVIRONMENT=production
```

#### GitHub Actions Secrets

Configure os seguintes secrets no GitHub (Settings > Secrets and variables > Actions):

⚠️ **IMPORTANTE**: Certifique-se de usar `VITE_API_BASE_URL` (não `VITE_APT_BASE_URL`)

```
AZURE_STATIC_WEB_APPS_API_TOKEN_THANKFUL_FIELD_020885B0F
VITE_API_BASE_URL=https://cd-apim-gateway.azure-api.net/api/v1
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-production-client-id
VITE_AUTH0_AUDIENCE=clickdelivery-ap
VITE_AUTH0_SCOPE=openid profile email offline_access
VITE_AUTH0_REDIRECT_URI=https://seu-dominio.azurestaticapps.net
VITE_ENVIRONMENT=production
```

#### Fluxo de Autenticação

1. **Login**: Usuário clica em "Login" → Redirecionado para Auth0
2. **Callback**: Auth0 redireciona de volta com `code` e `state` na URL
3. **Token Exchange**: AuthProvider troca o code por tokens (automático)
4. **Cleanup**: Parâmetros `code` e `state` são removidos da URL
5. **Token Storage**: Access token armazenado em localStorage
6. **Silent Refresh**: Refresh token usado para renovar tokens automaticamente
7. **Protected Routes**: Guards verificam autenticação antes de renderizar

#### Troubleshooting

**Erro: "Oops! something went wrong"**
- Verifique se `VITE_AUTH0_AUDIENCE` está correto (`clickdelivery-ap`)
- Confirme que o API Identifier no Auth0 corresponde ao audience

**Erro: Loop de redirecionamento**
- Verifique se os Allowed Callback URLs estão configurados no Auth0
- Confirme que `VITE_AUTH0_REDIRECT_URI` corresponde à URL atual

**Token não persiste após refresh**
- Verifique se `offline_access` está incluído no scope
- Confirme que refresh tokens estão habilitados no Auth0

**Roles não aparecem no token**
- Configure um Auth0 Action para adicionar roles ao token
- Verifique o namespace usado: `https://schemas.example.com/roles`

## 🧪 Testes

### Executar todos os testes

```bash
npm run test
```

### Executar testes em modo watch

```bash
npm run test:watch
```

### Gerar relatório de cobertura

```bash
npm run test:coverage
```

## 🎨 Linting e Formatação

### Executar linter

```bash
npm run lint
```

### Corrigir problemas de lint automaticamente

```bash
npm run lint:fix
```

### Formatar código

```bash
npm run format
```

### Verificar formatação

```bash
npm run format:check
```

## 🏗️ Build

### Build para produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`

### Preview do build

```bash
npm run preview
```

## 🚀 Deploy para Azure Static Web Apps

### Pré-requisitos

1. Conta Azure ativa
2. Azure Static Web App criado
3. Token de deploy do Azure Static Web Apps

### Configuração no GitHub

1. Vá em **Settings** > **Secrets and variables** > **Actions**
2. Adicione os seguintes secrets:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`: Token do Azure Static Web Apps
   - `VITE_API_BASE_URL`: URL base do API Gateway
   - `VITE_AUTH0_DOMAIN`: Domínio do Auth0
   - `VITE_AUTH0_CLIENT_ID`: Client ID do Auth0
   - `VITE_AUTH0_AUDIENCE`: Audience do Auth0

### Deploy Automático

O deploy é automaticamente acionado quando:
- Push é feito na branch `main`
- Pull Request é aberto/atualizado

O workflow executa:
1. Checkout do código
2. Setup do Node.js
3. Instalação de dependências
4. Lint
5. Testes
6. Build da aplicação (com variáveis de ambiente injetadas)
7. Deploy para Azure Static Web Apps

**⚠️ Ação Requerida**: Se você tiver um secret chamado `VITE_APT_BASE_URL` (typo), você deve:
1. Deletá-lo do GitHub Secrets
2. Criar um novo secret com o nome correto: `VITE_API_BASE_URL`
3. Usar o valor: `https://cd-apim-gateway.azure-api.net/api/v1`

### Deploy Manual

Para fazer deploy manual via Azure CLI:

```bash
# Login no Azure
az login

# Deploy
az staticwebapp deploy \
  --name <app-name> \
  --resource-group <resource-group> \
  --app-location "/" \
  --output-location "dist"
```

## 🌍 Internacionalização (i18n)

O projeto está configurado com `react-i18next` para suportar múltiplos idiomas.

Idioma padrão: **pt-BR** (Português do Brasil)

Para adicionar novos idiomas, edite o arquivo `src/app/providers/I18nProvider.tsx`

## 🔄 API Endpoints

Todos os endpoints são acessados através do API Gateway.

### Exemplos de endpoints:

- `GET /me/summary` - Resumo do usuário autenticado
- `GET /users/me` - Perfil do usuário
- `PUT /users/me` - Atualizar perfil do usuário
- `GET /orders/restaurantes` - Lista de restaurantes
- `GET /orders/pedidos` - Lista de pedidos
- `POST /orders/pedidos` - Criar novo pedido
- `PATCH /orders/pedidos/{id}/cancelar` - Cancelar pedido
- `GET /deliveries/entregas` - Lista de entregas
- `GET /deliveries/veiculos` - Lista de veículos
- `GET /rentals/rentals` - Lista de aluguéis

## 📊 Estado Global (Zustand)

O gerenciamento de estado é feito com Zustand, organizado por domínio:

- **useUserStore**: Estado do usuário
- **useOrderStore**: Estado de pedidos
- **useCartStore**: Estado do carrinho de compras

## 🛡️ Segurança

- **Auth0 SPA SDK**: Autenticação segura
- **JWT Tokens**: Armazenados em localStorage
- **HTTPS Only**: Todas as requisições via HTTPS
- **Correlation ID**: Rastreamento de requisições
- **Security Headers**: Configurados no Azure Static Web Apps
- **Role-based Access Control**: Guards de rota por perfil

## 🐛 Debug

### Logs de Requisições

Todas as requisições HTTP incluem um `x-correlation-id` que pode ser usado para rastrear requisições nos logs do backend.

### React DevTools

Instale a extensão React DevTools para debug de componentes:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

## 📝 Convenções de Código

- **TypeScript**: Uso obrigatório de tipagem
- **Componentes Funcionais**: Sempre use function components
- **Hooks**: Prefixo `use` para custom hooks
- **Naming**: PascalCase para componentes, camelCase para funções
- **Imports**: Sempre use path aliases `@/*`
- **CSS**: Tailwind classes, evite CSS inline

## 🤝 Contribuindo

1. Crie uma branch feature: `git checkout -b feature/nova-feature`
2. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
3. Push para a branch: `git push origin feature/nova-feature`
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para questões e suporte, entre em contato através dos issues do GitHub.

## 🔗 Links Úteis

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Auth0 Documentation](https://auth0.com/docs)
- [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)

---

Desenvolvido com ❤️ para a plataforma ClickDelivery