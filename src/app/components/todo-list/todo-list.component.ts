import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { TodoDTO, PagedResponse, StatusTarefa } from '../../models/todo.interface';
import { TodoService } from '../../services/todo.service';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  imports: [
    CommonModule,
    NgIf,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule
  ]
})
export class TodoListComponent implements OnInit, AfterViewInit {
  private refreshIntervalId: any;
  displayedColumns: string[] = ['title', 'description', 'status', 'priority', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<TodoDTO>();
  isLoading = false;
  error: string | null = null;
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: TodoDTO, filter: string) => {
      const f = filter.trim().toLowerCase();
      if (!f) return true;
      const fields = [
        data.title,
        data.description,
        data.status,
        String(data.priority),
        this.getPriorityLabel(data.priority),
        data.createdAt
      ];
      return fields.some(field => (field || '').toString().toLowerCase().includes(f));
    };

    this.loadTodos();

    this.refreshIntervalId = setInterval(() => {
      this.dataSource.data = [...this.dataSource.data];
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
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
        this.sortTodos();
        this.pageIndex = response.page ?? page;
        this.pageSize = response.size ?? size;
        if (response.totalElements != null) {
          this.totalElements = response.totalElements;
        } else {
          const received = response.content?.length ?? 0;
          if (received < (response.size ?? size)) {
            this.totalElements = page * (response.size ?? size) + received;
          } else {
            this.totalElements = (page + 1) * (response.size ?? size) + 1;
          }
        }
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
              this.sortTodos();
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
            this.dataSource.data = this.dataSource.data.filter(todo => todo.id !== id);
            if (this.totalElements > 0) this.totalElements = Math.max(0, this.totalElements - 1);
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
            this.sortTodos();
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

  getPriorityLabel(priority?: number): string {
    switch (priority) {
      case 1:
        return 'Alta';
      case 2:
        return 'Média';
      case 3:
        return 'Baixa';
      default:
        return 'Alta';
    }
  }

  toggleStatus(todo: TodoDTO): void {
    const newStatus: StatusTarefa = todo.status === 'CONCLUIDA' ? 'ABERTA' : 'CONCLUIDA';
    const updatedTodo = { ...todo, status: newStatus };

    const index = this.dataSource.data.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      this.dataSource.data[index] = updatedTodo;
      this.dataSource.data = [...this.dataSource.data];
    }

    this.todoService.patchTodo(todo.id!, { status: newStatus }).subscribe({
      error: () => {
        this.dataSource.data[index] = todo;
        this.dataSource.data = [...this.dataSource.data];
        this.snackBar.open('Erro ao atualizar status', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  private sortTodos(): void {
    this.dataSource.data = [...this.dataSource.data].sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (ta !== tb) return tb - ta;
      const pa = a.priority ?? 1;
      const pb = b.priority ?? 1;
      return pa - pb;
    });
  }

  isRecent(todo: TodoDTO, minutes = 0.5): boolean {
    if (!todo.createdAt) return false;
    const created = new Date(todo.createdAt).getTime();
    const now = Date.now();
    return (now - created) <= minutes * 60 * 1000;
  }

  applyFilter(value: string): void {
    this.dataSource.filter = (value || '').trim().toLowerCase();
  }

  startTodo(todo: TodoDTO): void {
    if (todo.status !== 'ABERTA') { return; }
    const optimistic: TodoDTO = { ...todo, status: 'EM_ANDAMENTO' };
    const index = this.dataSource.data.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      this.dataSource.data[index] = optimistic;
      this.dataSource.data = [...this.dataSource.data];
    }
    this.todoService.patchTodo(todo.id!, { status: 'EM_ANDAMENTO' }).subscribe({
      next: () => {
        this.snackBar.open('Tarefa iniciada', 'Fechar', { duration: 2500 });
      },
      error: () => {
        if (index !== -1) {
          this.dataSource.data[index] = todo;
          this.dataSource.data = [...this.dataSource.data];
        }
        this.snackBar.open('Erro ao iniciar tarefa', 'Fechar', { duration: 3000 });
      }
    });
  }

  completeTodo(todo: TodoDTO): void {
    if (todo.status !== 'EM_ANDAMENTO') { return; }
    const optimistic: TodoDTO = { ...todo, status: 'CONCLUIDA' };
    const index = this.dataSource.data.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      this.dataSource.data[index] = optimistic;
      this.dataSource.data = [...this.dataSource.data];
    }
    this.todoService.patchTodo(todo.id!, { status: 'CONCLUIDA' }).subscribe({
      next: () => {
        this.snackBar.open('Tarefa concluída', 'Fechar', { duration: 2500 });
      },
      error: () => {
        if (index !== -1) {
          this.dataSource.data[index] = todo;
          this.dataSource.data = [...this.dataSource.data];
        }
        this.snackBar.open('Erro ao concluir tarefa', 'Fechar', { duration: 3000 });
      }
    });
  }
}