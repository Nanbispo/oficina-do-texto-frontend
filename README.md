# saraloia-frontend

Descrição breve

Front-end da aplicação "Oficina do texto" (repositório: Oficina do texto-frontend). Projeto construído com React + TypeScript e empacotado com Vite. Contém uma estrutura típica de SPA com rotas, chamadas HTTP e gerenciamento de estado/caching para integrar com uma API.

Avaliação do que o projeto se trata

- Objetivo: implementar a interface cliente de uma aplicação web moderna — páginas, formulários, chamadas a APIs e navegação entre telas.
- Estrutura: código organizado em entradas (main.tsx / App.tsx), páginas em /src/pages, hooks reutilizáveis em /src/hooks e camada de API em /src/api.

Stack detectada (baseado em package.json)

- Linguagem e bundler: TypeScript, Vite
- UI: React (v19)
- Roteamento: react-router-dom
- Requisições HTTP: axios
- Estado remoto / cache: @tanstack/react-query
- Formulários: react-hook-form
- Validação: zod (com @hookform/resolvers)
- Linting / DX: ESLint, plugins relacionados

Principais scripts (package.json)

- npm run dev — inicia servidor de desenvolvimento (Vite)
- npm run build — compila TypeScript e gera build do Vite
- npm run lint — executa ESLint
- npm run preview — pré-visualiza build estático

Habilidades desenvolvidas ao trabalhar neste projeto

- Desenvolvimento com React + TypeScript: tipagem de componentes, props e modelagem de tipos em /src/types
- Arquitetura de frontend: separação entre pages, hooks e camada de API
- Consumo de APIs: uso de axios e organização de chamadas em /src/api
- Gerenciamento de dados remotos: caching e sincronização com @tanstack/react-query
- Tratamento de formulários e validação: react-hook-form + zod
- Roteamento de SPA com react-router-dom
- Ferramentas de build e produtividade: configuração e uso do Vite, scripts npm, e ESLint para qualidade de código

Sugestões rápidas de seção a incluir/atualizar no README (opcional)

- Como rodar localmente (ex.: npm install && npm run dev)
- Como contribuir
- Estrutura de pastas (breve mapa)
- Requisitos (Node versão recomendada)

Como rodar

1. Instalar dependências:

   npm install

2. Rodar em modo dev:

   npm run dev

