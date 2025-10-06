import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TodoDTO } from '../../models/todo.interface';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="todo-container">
      <h2>Lista de Tarefas</h2>
      
      <div *ngIf="todos$ | async as todos; else loading">
        <div *ngIf="todos.length === 0" class="no-todos">
          <p>Nenhuma tarefa encontrada.</p>
        </div>
        
        <div *ngFor="let todo of todos" class="todo-item">
          <div class="todo-header">
            <h3>{{ todo.title }}</h3>
            <span [class.completed]="todo.status" class="status">
              {{ todo.status ? 'Concluído' : 'Pendente' }}
            </span>
          </div>
          <p *ngIf="todo.description">{{ todo.description }}</p>
          <div class="todo-footer">
            <span class="priority">Prioridade: {{ todo.priority }}</span>
            <div class="actions">
              <button (click)="editTodo(todo.id!)" class="btn-edit">Editar</button>
              <button (click)="deleteTodo(todo.id!)" class="btn-delete">Excluir</button>
            </div>
          </div>
        </div>
      </div>
      
      <ng-template #loading>
        <div class="loading">Carregando tarefas...</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .todo-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .todo-item {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 10px;
      background: white;
    }

    .todo-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }

    .status.completed {
      background-color: #d4edda;
      color: #155724;
    }

    .status:not(.completed) {
      background-color: #f8d7da;
      color: #721c24;
    }

    .todo-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }

    .actions button {
      margin-left: 5px;
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-edit {
      background-color: #007bff;
      color: white;
    }

    .btn-delete {
      background-color: #dc3545;
      color: white;
    }

    .loading {
      text-align: center;
      padding: 20px;
      font-style: italic;
    }

    .no-todos {
      text-align: center;
      padding: 20px;
      color: #666;
    }
  `]
})
export class TodoListComponent implements OnInit {
  todos$!: Observable<TodoDTO[]>;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todos$ = this.todoService.getAllTodos();
  }

  editTodo(id: number): void {
    console.log('Editar tarefa:', id);
  }

  deleteTodo(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.loadTodos();
        },
        error: (error: Error) => {
          console.error('Erro ao excluir tarefa:', error);
        }
      });
    }
  }
}