import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RacaApiService } from '../../shared/services/api.services';
import { Raca } from '../../models';

@Component({
  selector: 'app-raca-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Nova' }} Raça</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Descrição</mat-label>
          <input matInput formControlName="descricao" placeholder="Ex: Golden Retriever">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmar()" [disabled]="form.invalid">Salvar</button>
    </mat-dialog-actions>
  `,
  styles: ['.w-full { width: 100%; min-width: 320px; }']
})
export class RacaFormDialogComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder, private ref: MatDialogRef<RacaFormDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Raca | null) {
    this.form = this.fb.group({ descricao: [data?.descricao || '', Validators.required] });
  }
  confirmar() { if (this.form.valid) this.ref.close(this.form.value); }
}

@Component({
  selector: 'app-racas',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule,
    MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Raças</h2>
        <button mat-raised-button color="primary" (click)="abrirForm()">
          <mat-icon>add</mat-icon> Nova Raça
        </button>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="racas">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let r">{{ r.id }}</td>
          </ng-container>
          <ng-container matColumnDef="descricao">
            <th mat-header-cell *matHeaderCellDef>Descrição</th>
            <td mat-cell *matCellDef="let r">{{ r.descricao }}</td>
          </ng-container>
          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let r">
              <button mat-icon-button color="accent" (click)="abrirForm(r)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="excluir(r)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="colunas"></tr>
          <tr mat-row *matRowDef="let row; columns: colunas"></tr>
        </table>
        <div class="empty-state" *ngIf="!racas.length">Nenhuma raça cadastrada.</div>
      </div>
    </div>
  `
})
export class RacasComponent implements OnInit {
  racas: Raca[] = [];
  colunas = ['id', 'descricao', 'acoes'];

  constructor(
    private racaApi: RacaApiService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() { this.carregar(); }

  carregar() { this.racaApi.listar().subscribe(data => this.racas = data); }

  abrirForm(raca?: Raca) {
    const ref = this.dialog.open(RacaFormDialogComponent, { data: raca || null });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (raca?.id) {
        this.racaApi.atualizar(raca.id, result).subscribe({
          next: () => { this.carregar(); this.snack.open('Raça atualizada!', 'OK', { duration: 3000 }); },
          error: (e) => this.snack.open(e.error?.mensagem || 'Já existe uma raça com esse nome', 'Fechar', { duration: 4000 })
        });
      } else {
        this.racaApi.criar(result).subscribe({
          next: () => { this.carregar(); this.snack.open('Raça criada!', 'OK', { duration: 3000 }); },
          error: (e) => this.snack.open(e.error?.mensagem || 'Já existe uma raça com esse nome', 'Fechar', { duration: 4000 })
        });
      }
    });
  }

  excluir(raca: Raca) {
    if (!confirm(`Excluir a raça "${raca.descricao}"?`)) return;
    this.racaApi.deletar(raca.id!).subscribe({ next: () => this.carregar() });
  }
}
