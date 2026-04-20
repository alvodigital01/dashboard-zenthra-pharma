# Zenthra Pharma Sales Dashboard

Sistema web completo de dashboard comercial e controle de vendas para operacoes farmaceuticas, construido com:

- Next.js 14 com App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Banco de dados
- Recharts para visualizacoes

## O que foi entregue

- Login com email e senha via Supabase Auth
- Protecao de rotas com middleware
- Dashboard principal com metricas semanais e mensais
- Calculo automatico de bonus por performance
- CRUD completo de vendas
- Filtros por periodo, produto, status e busca textual
- Relatorios com agrupamento semanal e mensal
- Exportacao CSV do conjunto filtrado
- Estrutura pronta para evolucao futura para multiplos usuarios

## Regra de bonus

- Meta semanal fixa: `75` unidades
- Valor por unidade excedente: `R$ 20,00`
- Apenas vendas com status `paid` ou `completed` entram nas metricas principais
- Vendas `cancelled` nao contam para faturamento nem bonus
- O bonus mensal e calculado como soma dos bonuses das semanas reais contidas no periodo

## Estrutura principal

```text
app/
components/
hooks/
lib/
services/
supabase/
types/
utils/
```

## Configuracao

1. Copie `.env.example` para `.env.local`.
2. Preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3. No painel do Supabase:
   - habilite Email/Password em `Authentication > Providers`
   - crie ao menos um usuario autenticado
4. Execute o SQL de [supabase/schema.sql](/d:/ESTUDOS/dashboard-zenthra-pharma/supabase/schema.sql:1) no SQL Editor do Supabase.
5. Se o projeto ja estiver rodando, execute novamente o mesmo SQL para adicionar `payment_method` e `installments` na tabela `sales`.

## Rodando localmente

```bash
npm install
npm run dev
```

Aplicacao: `http://localhost:3000`

## Validacao executada

```bash
npm run build
npm run lint
```

## Fluxos do sistema

- `/login`: autenticacao
- `/`: dashboard comercial
- `/sales`: listagem completa e filtros
- `/sales/new`: nova venda
- `/sales/[id]/edit`: edicao de venda
- `/reports`: relatorios e exportacao
- `/api/export/sales`: endpoint CSV protegido por autenticacao

## Observacoes tecnicas

- `total_price` e uma coluna calculada automaticamente no banco com `quantity * unit_price`
- As politicas RLS isolam os dados por `user_id`
- O projeto esta pronto para futuras expansoes de perfis e regras comerciais
- A camada `services/export.ts` ja prepara a exportacao estruturada para evolucao futura
