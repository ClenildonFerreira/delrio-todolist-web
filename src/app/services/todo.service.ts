import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoDTO, CreateTodoDTO } from '../models/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly apiUrl = 'http://localhost:8080/todos';

  constructor(private http: HttpClient) {}

  getAllTodos(): Observable<TodoDTO[]> {
    return this.http.get<TodoDTO[]>(this.apiUrl);
  }

  getTodoById(id: number): Observable<TodoDTO> {
    return this.http.get<TodoDTO>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: CreateTodoDTO): Observable<TodoDTO> {
    return this.http.post<TodoDTO>(this.apiUrl, todo);
  }

  updateTodo(id: number, todo: CreateTodoDTO): Observable<TodoDTO> {
    return this.http.put<TodoDTO>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}