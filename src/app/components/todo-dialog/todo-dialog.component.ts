import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  standalone: true,
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss'],
  imports: [
    CommonModule,
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
    @Inject(MAT_DIALOG_DATA) public data: TodoDialogData | null
  ) {
    this.data = this.data ?? {} as TodoDialogData;
    this.isEditMode = !!this.data.todo;
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
      priority: [3]
    });
  }

  private populateForm(): void {
    if (this.data && this.data.todo) {
      const td = this.data.todo;
      this.todoForm.patchValue({
        title: td.title,
        description: td.description || '',
        status: td.status || 'ABERTA',
        priority: td.priority || 3
      });
    }
  }

  onSave(): void {
    if (this.todoForm.valid) {
      const formValue = this.todoForm.value;
      const result: Partial<TodoDTO> = {
        ...formValue,
        // Force ABERTA when creating
        status: this.isEditMode ? formValue.status : 'ABERTA',
        id: this.data?.todo?.id
      };
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}