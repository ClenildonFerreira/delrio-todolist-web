import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TodoDTO } from '../../models/todo.interface';

export interface TodoDialogData {
  todo?: TodoDTO;
}

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class TodoDialogComponent implements OnInit {
  todoForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TodoDialogData
  ) {
    this.isEditMode = !!data.todo;
    this.todoForm = this.createForm();
  }

  ngOnInit(): void {
    this.populateForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['ABERTA'],
      priority: [1]
    });
  }

  private populateForm(): void {
    if (this.data.todo) {
      this.todoForm.patchValue({
        title: this.data.todo.title,
        description: this.data.todo.description || '',
        status: this.data.todo.status || 'ABERTA',
        priority: this.data.todo.priority || 1
      });
    }
  }

  onSave(): void {
    if (this.todoForm.valid) {
      const result: Partial<TodoDTO> = {
        ...this.todoForm.value,
        id: this.data.todo?.id
      };
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}