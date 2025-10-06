import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from 'src/app/services/todo.service';
import { CreateTodoDTO } from 'src/app/models/todo.interface';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>{{ isEditMode ? 'Editar Tarefa' : 'Nova Tarefa' }}</h2>
      
      <form [formGroup]="todoForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Título *</label>
          <input 
            type="text" 
            id="title" 
            formControlName="title" 
            placeholder="Digite o título da tarefa"
          />
          <div *ngIf="todoForm.get('title')?.invalid && todoForm.get('title')?.touched" class="error">
            Título é obrigatório
          </div>
        </div>

        <div class="form-group">
          <label for="description">Descrição</label>
          <textarea 
            id="description" 
            formControlName="description" 
            placeholder="Digite a descrição da tarefa"
            rows="3"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="priority">Prioridade</label>
            <select id="priority" formControlName="priority">
              <option value="0">Alta</option>
              <option value="1">Média</option>
              <option value="2">Baixa</option>
            </select>
          </div>

          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" formControlName="status">
              <option [value]="false">Pendente</option>
              <option [value]="true">Concluído</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="todoForm.invalid" class="btn-primary">
            {{ isEditMode ? 'Atualizar' : 'Criar' }}
          </button>
          <button type="button" (click)="onCancel()" class="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-row {
      display: flex;
      gap: 15px;
    }

    .form-row .form-group {
      flex: 1;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input, textarea, select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #007bff;
    }

    .error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    button:hover:not(:disabled) {
      opacity: 0.9;
    }
  `]
})
export class TodoFormComponent implements OnInit {
  todoForm!: FormGroup;
  isEditMode = false;
  todoId?: number;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: [false],
      priority: [1]
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const todoData: CreateTodoDTO = this.todoForm.value;

      const operation = this.isEditMode && this.todoId
        ? this.todoService.updateTodo(this.todoId, todoData)
        : this.todoService.createTodo(todoData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/todos']);
        },
        error: (error) => {
          console.error('Erro ao salvar tarefa:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/todos']);
  }
}