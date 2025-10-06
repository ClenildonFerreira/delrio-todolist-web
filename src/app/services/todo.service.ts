import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse, TodoDTO } from '../models/todo.interface';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private base = '/todos';

  constructor(private http: HttpClient) { }

  listTodos(page = 0, size = 10): Observable<PagedResponse<TodoDTO>> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.http.get<PagedResponse<TodoDTO>>(this.base, { params });
  }

  createTodo(todo: Partial<TodoDTO>) {
    return this.http.post<TodoDTO>(this.base, todo);
  }

  patchTodo(id: number, body: Partial<TodoDTO>) {
    return this.http.patch<TodoDTO>(`${this.base}/${id}`, body);
  }

  deleteTodo(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}