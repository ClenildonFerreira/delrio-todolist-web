import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { TodoDTO, PagedResponse, StatusTarefa } from '../../models/todo.interface';
import { TodoService } from '../../services/todo.service';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatChipsModule
  ]
})
export class TodoListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['title', 'description', 'status', 'priority', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<TodoDTO>();
  todos$!: PagedResponse<TodoDTO>;
  isLoading = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.loadTodos(this.paginator.pageIndex, this.paginator.pageSize);
      });
    }
  }

  loadTodos(page: number = 0, size: number = 10): void {
    this.isLoading = true;
    this.error = null;

    this.todoService.listTodos(page, size).subscribe({
      next: (response: PagedResponse<TodoDTO>) => {
        this.dataSource.data = response.content;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar tarefas';
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar tarefas', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  editTodo(todo: TodoDTO): void {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      width: '500px',
      data: { todo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.patchTodo(result.id!, result).subscribe({
          next: (updatedTodo) => {
            const index = this.dataSource.data.findIndex(t => t.id === updatedTodo.id);
            if (index !== -1) {
              this.dataSource.data[index] = updatedTodo;
              this.dataSource.data = [...this.dataSource.data];
            }
            this.snackBar.open('Tarefa atualizada com sucesso!', 'Fechar', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Erro ao atualizar tarefa', 'Fechar', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  deleteTodo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '320px',
      data: {
        title: 'Confirmar exclusão',
        message: 'Tem certeza que deseja excluir esta tarefa?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.deleteTodo(id).subscribe({
          next: () => {
            // Otimistic update
            this.dataSource.data = this.dataSource.data.filter(todo => todo.id !== id);
            this.snackBar.open('Tarefa excluída com sucesso!', 'Fechar', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Erro ao excluir tarefa', 'Fechar', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.createTodo(result).subscribe({
          next: (newTodo) => {
            this.dataSource.data = [...this.dataSource.data, newTodo];
            this.snackBar.open('Tarefa criada com sucesso!', 'Fechar', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Erro ao criar tarefa', 'Fechar', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  getStatusClass(status: StatusTarefa): string {
    switch (status) {
      case 'ABERTA': return 'status-open';
      case 'EM_ANDAMENTO': return 'status-in-progress';
      case 'CONCLUIDA': return 'status-completed';
      default: return '';
    }
  }

  toggleStatus(todo: TodoDTO): void {
    const newStatus: StatusTarefa = todo.status === 'CONCLUIDA' ? 'ABERTA' : 'CONCLUIDA';
    const updatedTodo = { ...todo, status: newStatus };

    // Otimistic update
    const index = this.dataSource.data.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      this.dataSource.data[index] = updatedTodo;
      this.dataSource.data = [...this.dataSource.data];
    }

    this.todoService.patchTodo(todo.id!, { status: newStatus }).subscribe({
      error: () => {
        // Reverter otimistic update em caso de erro
        this.dataSource.data[index] = todo;
        this.dataSource.data = [...this.dataSource.data];
        this.snackBar.open('Erro ao atualizar status', 'Fechar', {
          duration: 3000
        });
      }
    });
  }
}