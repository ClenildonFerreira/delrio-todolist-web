# delrio-todolist-web

Aplicação Angular para gerenciar uma lista de tarefas (To‑Do). Inclui CRUD básico de tarefas usando Angular Material.

## Requisitos
- Node.js 18+
- NPM 9+ 
- Angular CLI (`@angular/cli`) 20+

## Começando
1. Instale as dependências:
   - `npm install`
2. Suba o servidor de desenvolvimento:
   - `npm start`
3. Acesse em `http://localhost:4200/`.

## Scripts
- `npm start`: roda `ng serve`
- `npm test`: executa testes com Karma/Jasmine.

## Stack principal
- Angular 20 (core, router, forms)
- Angular Material e CDK
- RxJS

## Estrutura
```
src/
  app/
    components/
      todo-list/        # Lista de tarefas
      todo-form/        # Formulário de criação/edição
      todo-dialog/      # Diálogo para criar/editar tarefa
      confirm-dialog/   # Diálogo de confirmação
    services/
      todo.service.ts   # Lógica de dados
    models/
      todo.interface.ts # Tipagem de To‑Do
  main.ts               # Bootstrap da aplicação
  styles.scss           # Estilos globais
public/                 # Assets estáticos
```