import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TodoDTO } from '../../models/todo.interface';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
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