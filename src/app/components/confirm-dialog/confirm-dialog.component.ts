import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
    title?: string;
    message?: string;
}

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title id="confirm-title">{{ data?.title || 'Confirmar ação' }}</h2>
    <mat-dialog-content role="document" aria-describedby="confirm-message">
      <p id="confirm-message">{{ data?.message || 'Tem certeza que deseja continuar?' }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" cdkFocusInitial aria-label="Cancelar">Cancelar</button>
      <button mat-raised-button color="warn" (click)="onConfirm()" aria-label="Confirmar exclusão">Excluir</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData | null
    ) {
        this.data = this.data ?? {} as ConfirmDialogData;
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
