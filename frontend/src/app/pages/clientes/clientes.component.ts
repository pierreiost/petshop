import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClienteService } from '../../shared/services/api.services';
import { Cliente } from '../../models';

@Component({
  selector: 'app-cliente-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Novo' }} Cliente</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome">
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>CPF</mat-label>
          <input matInput formControlName="cpf">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmar()" [disabled]="form.invalid">Salvar</button>
    </mat-dialog-actions>
  `,
  styles: [`.w-full { width: 100%; min-width: 380px; }`]
})
export class ClienteFormDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<ClienteFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente | null
  ) {
    this.form = this.fb.group({
      nome: [data?.nome || '', Validators.required],
      cpf: [data?.cpf || '']
    });
  }

  confirmar() {
    if (this.form.valid) this.ref.close(this.form.value);
  }
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatSnackBarModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Clientes</h2>
        <button mat-raised-button color="primary" (click)="abrirForm()">
          <mat-icon>add</mat-icon> Novo Cliente
        </button>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="clientes">
          <ng-container matColumnDef="nome">
            <th mat-header-cell *matHeaderCellDef>Nome</th>
            <td mat-cell *matCellDef="let c">{{ c.nome }}</td>
          </ng-container>
          <ng-container matColumnDef="cpf">
            <th mat-header-cell *matHeaderCellDef>CPF</th>
            <td mat-cell *matCellDef="let c">{{ c.cpf || '—' }}</td>
          </ng-container>
          <ng-container matColumnDef="dataCadastro">
            <th mat-header-cell *matHeaderCellDef>Cadastro</th>
            <td mat-cell *matCellDef="let c">{{ c.dataCadastro | date:'dd/MM/yyyy HH:mm' }}</td>
          </ng-container>
          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let c">
              <button mat-icon-button color="primary" [routerLink]="['/clientes', c.id]" matTooltip="Detalhes">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="accent" (click)="abrirForm(c)" matTooltip="Editar">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="excluir(c)" matTooltip="Excluir">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="colunas"></tr>
          <tr mat-row *matRowDef="let row; columns: colunas" class="row-hover"></tr>
        </table>
        <div class="empty-state" *ngIf="!clientes.length">Nenhum cliente cadastrado.</div>
      </div>
    </div>
  `,
  styles: [`.row-hover:hover { background: #fce4ec; cursor: pointer; }`]
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  colunas = ['nome', 'cpf', 'dataCadastro', 'acoes'];

  constructor(
    private clienteApi: ClienteService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.clienteApi.listar().subscribe(data => this.clientes = data);
  }

  abrirForm(cliente?: Cliente) {
    const ref = this.dialog.open(ClienteFormDialogComponent, { data: cliente || null });
    ref.afterClosed().subscribe(resultado => {
      if (!resultado) return;
      if (cliente?.id) {
        this.clienteApi.atualizar(cliente.id, resultado).subscribe({
          next: () => { this.carregar(); this.snack.open('Cliente atualizado!', 'OK', { duration: 3000 }); },
          error: (e) => this.snack.open(e.error?.mensagem || 'Erro ao atualizar', 'Fechar', { duration: 4000 })
        });
      } else {
        this.clienteApi.criar(resultado).subscribe({
          next: () => { this.carregar(); this.snack.open('Cliente criado!', 'OK', { duration: 3000 }); },
          error: (e) => this.snack.open(e.error?.mensagem || 'Erro ao criar', 'Fechar', { duration: 4000 })
        });
      }
    });
  }

  excluir(cliente: Cliente) {
    if (!confirm(`Excluir o cliente "${cliente.nome}"?`)) return;
    this.clienteApi.deletar(cliente.id!).subscribe({
      next: () => { this.carregar(); this.snack.open('Cliente excluído!', 'OK', { duration: 3000 }); }
    });
  }
}
