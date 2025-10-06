import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { TodoDTO, StatusTarefa } from '../../models/todo.interface';
@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
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
      status: ['ABERTA' as StatusTarefa],
      priority: [1]
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const todoData: Partial<TodoDTO> = this.todoForm.value;

      const operation = this.isEditMode && this.todoId
        ? this.todoService.patchTodo(this.todoId, todoData)
        : this.todoService.createTodo(todoData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/todos']);
        },
        error: (error: Error) => {
          console.error('Erro ao salvar tarefa:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/todos']);
  }
}