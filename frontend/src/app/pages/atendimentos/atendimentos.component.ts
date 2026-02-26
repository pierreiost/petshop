import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AtendimentoService, PetService } from '../../shared/services/api.services';
import { Atendimento, Pet } from '../../models';

@Component({
  selector: 'app-atend-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data?.atend ? 'Editar' : 'Novo' }} Atendimento</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="w-full" *ngIf="!data?.atend">
          <mat-label>Pet</mat-label>
          <mat-select formControlName="petId">
            <mat-option *ngFor="let p of data?.pets" [value]="p.id">{{ p.nome }} ({{ p.clienteNome }})</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full"><mat-label>Descrição do Serviço</mat-label><input matInput formControlName="descricao"></mat-form-field>
        <mat-form-field appearance="outline" class="w-full"><mat-label>Valor (R$)</mat-label><input matInput type="number" step="0.01" formControlName="valor"></mat-form-field>
        <mat-form-field appearance="outline" class="w-full"><mat-label>Data/Hora</mat-label><input matInput type="datetime-local" formControlName="data"></mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmar()" [disabled]="form.invalid">Salvar</button>
    </mat-dialog-actions>
  `,
  styles: ['.w-full { width: 100%; min-width: 400px; }']
})
export class AtendFormDialogComponent {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<AtendFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { atend: Atendimento | null, pets: Pet[] }
  ) {
    this.form = this.fb.group({
      petId: [data?.atend?.petId || (data?.atend ? null : ''), data?.atend ? [] : [Validators.required]],
      descricao: [data?.atend?.descricao || '', Validators.required],
      valor: [data?.atend?.valor || '', [Validators.required, Validators.min(0.01)]],
      data: [data?.atend?.data || '']
    });
  }
  confirmar() { if (this.form.valid) this.ref.close(this.form.value); }
}

@Component({
  selector: 'app-atendimentos',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule,
    MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Atendimentos</h2>
        <button mat-raised-button color="primary" (click)="abrirForm()">
          <mat-icon>add</mat-icon> Novo Atendimento
        </button>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="atendimentos">
          <ng-container matColumnDef="pet">
            <th mat-header-cell *matHeaderCellDef>Pet</th>
            <td mat-cell *matCellDef="let a">{{ a.petNome }}</td>
          </ng-container>
          <ng-container matColumnDef="tutor">
            <th mat-header-cell *matHeaderCellDef>Tutor</th>
            <td mat-cell *matCellDef="let a">{{ a.clienteNome }}</td>
          </ng-container>
          <ng-container matColumnDef="descricao">
            <th mat-header-cell *matHeaderCellDef>Serviço</th>
            <td mat-cell *matCellDef="let a">{{ a.descricao }}</td>
          </ng-container>
          <ng-container matColumnDef="valor">
            <th mat-header-cell *matHeaderCellDef>Valor</th>
            <td mat-cell *matCellDef="let a" class="valor-destaque">{{ a.valor | currency:'BRL' }}</td>
          </ng-container>
          <ng-container matColumnDef="data">
            <th mat-header-cell *matHeaderCellDef>Data</th>
            <td mat-cell *matCellDef="let a">{{ a.data | date:'dd/MM/yyyy HH:mm' }}</td>
          </ng-container>
          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let a">
              <button mat-icon-button color="accent" (click)="abrirForm(a)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="excluir(a)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="colunas"></tr>
          <tr mat-row *matRowDef="let row; columns: colunas"></tr>
        </table>
        <div class="empty-state" *ngIf="!atendimentos.length">Nenhum atendimento registrado.</div>
      </div>
    </div>
  `
})
export class AtendimentosComponent implements OnInit {
  atendimentos: Atendimento[] = [];
  pets: Pet[] = [];
  colunas = ['pet', 'tutor', 'descricao', 'valor', 'data', 'acoes'];

  constructor(
    private atendApi: AtendimentoService,
    private petApi: PetService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.carregar();
    this.petApi.listarTodos().subscribe(data => this.pets = data);
  }

  carregar() {
    this.atendApi.listarTodos().subscribe(data => this.atendimentos = data);
  }

  abrirForm(atend?: Atendimento) {
    const ref = this.dialog.open(AtendFormDialogComponent, { data: { atend: atend || null, pets: this.pets } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (atend?.id) {
        const { petId, ...dados } = result;
        this.atendApi.atualizar(atend.id, dados).subscribe({
          next: () => { this.carregar(); this.snack.open('Atendimento atualizado!', 'OK', { duration: 3000 }); },
          error: (e) => this.snack.open(e.error?.mensagem || 'Erro', 'Fechar', { duration: 4000 })
        });
      } else {
        const { petId, ...dados } = result;
        this.atendApi.criar(petId, dados).subscribe({
          next: () => { this.carregar(); this.snack.open('Atendimento criado!', 'OK', { duration: 3000 }); },
          error: (e) => this.snack.open(e.error?.mensagem || 'Erro', 'Fechar', { duration: 4000 })
        });
      }
    });
  }

  excluir(a: Atendimento) {
    if (!confirm('Excluir este atendimento?')) return;
    this.atendApi.deletar(a.id!).subscribe({ next: () => this.carregar() });
  }
}
