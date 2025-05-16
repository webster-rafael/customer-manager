
# 🧾 Gerenciador de Clientes - Backend

API RESTful desenvolvida com Node.js, Fastify e TypeScript, responsável por gerenciar o cadastro, listagem de clientes e autenticação de usuários.

---

## 📋 Regras de Negócio

- [x] O sistema deve permitir que um usuário se autentique via login e senha.
- [x] O sistema deve gerar um token JWT após autenticação bem-sucedida.
- [x] O token JWT deve ser obrigatório para acessar rotas protegidas.
- [x] Cada requisição autenticada deve ser verificada por um middleware (`verifyJwt`).
- [x] O sistema deve permitir listar todos os clientes cadastrados.
- [x] O sistema deve permitir cadastrar um novo cliente.
- [ ] O sistema deve permitir editar os dados de um cliente.
- [ ] O sistema deve permitir excluir um cliente.
- [ ] O sistema deve permitir visualizar os dados de um cliente individual.

---

## ✅ Funcionalidades Implementadas

- [x] Autenticação de usuário com JWT
- [x] Middleware de verificação de token (`verifyJwt`)
- [x] Listagem de clientes
- [x] Arquitetura desacoplada com Dependency Inversion
- [x] Testes unitários:
  - [x] Controller de autenticação
  - [x] Controller de clientes
  - [x] Middleware de autenticação
  - [x] Rota de autenticação
  - [x] Rota de clientes
  - [x] Service de autenticação
  - [x] UseCase de clientes
  - [x] Repository TypeORM de clientes
- [x] Cadastro de cliente
- [ ] Update de cliente
- [ ] Delete de cliente
- [ ] Listagem paginada ou com filtros
- [ ] Integração com banco de dados real (atualmente mockado)
- [ ] Deploy em produção

---

## 🚀 Tecnologias

- Node.js
- TypeScript
- Fastify
- Fastify-JWT
- TypeORM
- PostgreSQL
- Jest (testes)
- Docker

---

## 🧪 Rodando os testes

```bash
npm run test
```

---

## 🏁 Como rodar o projeto

```bash
# Instale as dependências
npm install

# Execute o servidor
npm run dev
```