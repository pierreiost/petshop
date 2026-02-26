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
import { PetService, ClienteService, RacaApiService } from '../../shared/services/api.services';
import { Pet, Cliente, Raca } from '../../models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-pet-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data?.pet ? 'Editar' : 'Novo' }} Pet</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="w-full"><mat-label>Nome</mat-label><input matInput formControlName="nome"></mat-form-field>
        <mat-form-field appearance="outline" class="w-full"><mat-label>Raça</mat-label><mat-select formControlName="racaId"><mat-option *ngFor="let r of data?.racas" [value]="r.id">{{ r.descricao }}</mat-option></mat-select></mat-form-field>
        <mat-form-field appearance="outline" class="w-full" *ngIf="!data?.pet"><mat-label>Cliente (Tutor)</mat-label><mat-select formControlName="clienteId"><mat-option *ngFor="let c of data?.clientes" [value]="c.id">{{ c.nome }}</mat-option></mat-select></mat-form-field>
        <mat-form-field appearance="outline" class="w-full"><mat-label>Data de Nascimento</mat-label><input matInput type="date" formControlName="dataNascimento"></mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmar()" [disabled]="form.invalid">Salvar</button>
    </mat-dialog-actions>
  `,
  styles: ['.w-full { width: 100%; min-width: 380px; }']
})
export class PetFormDialogComponent {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<PetFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pet: Pet | null, racas: Raca[], clientes: Cliente[] }
  ) {
    this.form = this.fb.group({
      nome: [data?.pet?.nome || '', Validators.required],
      racaId: [data?.pet?.raca?.id || '', Validators.required],
      clienteId: [data?.pet?.clienteId || (data?.pet ? null : ''), data?.pet ? [] : [Validators.required]],
      dataNascimento: [data?.pet?.dataNascimento || '']
    });
  }
  confirmar() { if (this.form.valid) this.ref.close(this.form.value); }
}

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule,
    MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Pets</h2>
        <button mat-raised-button color="primary" (click)="abrirForm()">
          <mat-icon>add</mat-icon> Novo Pet
        </button>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="pets">
          <ng-container matColumnDef="nome">
            <th mat-header-cell *matHeaderCellDef>Nome</th>
            <td mat-cell *matCellDef="let p">{{ p.nome }}</td>
          </ng-container>
          <ng-container matColumnDef="raca">
            <th mat-header-cell *matHeaderCellDef>Raça</th>
            <td mat-cell *matCellDef="let p">{{ p.raca?.descricao }}</td>
          </ng-container>
          <ng-container matColumnDef="tutor">
            <th mat-header-cell *matHeaderCellDef>Tutor</th>
            <td mat-cell *matCellDef="let p">{{ p.clienteNome }}</td>
          </ng-container>
          <ng-container matColumnDef="dataNascimento">
            <th mat-header-cell *matHeaderCellDef>Nascimento</th>
            <td mat-cell *matCellDef="let p">{{ p.dataNascimento ? (p.dataNascimento | date:'dd/MM/yyyy') : '—' }}</td>
          </ng-container>
          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let p">
              <button mat-icon-button color="accent" (click)="abrirForm(p)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="excluir(p)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="colunas"></tr>
          <tr mat-row *matRowDef="let row; columns: colunas"></tr>
        </table>
        <div class="empty-state" *ngIf="!pets.length">Nenhum pet cadastrado.</div>
      </div>
    </div>
  `
})
export class PetsComponent implements OnInit {
  pets: Pet[] = [];
  clientes: Cliente[] = [];
  racas: Raca[] = [];
  colunas = ['nome', 'raca', 'tutor', 'dataNascimento', 'acoes'];

  constructor(
    private petApi: PetService,
    private clienteApi: ClienteService,
    private racaApi: RacaApiService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.carregar();
    this.clienteApi.listar().subscribe(data => this.clientes = data);
    this.racaApi.listar().subscribe(data => this.racas = data);
  }

  carregar() {
    this.petApi.listarTodos().subscribe(data => this.pets = data);
  }

  abrirForm(pet?: Pet) {
    const ref = this.dialog.open(PetFormDialogComponent, { data: { pet: pet || null, racas: this.racas, clientes: this.clientes } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (pet?.id) {
        this.petApi.atualizar(pet.id, result).subscribe({
          next: () => { this.carregar(); this.snack.open('Pet atualizado!', 'OK', { duration: 3000 }); },
          error: (e) => this.snack.open(e.error?.mensagem || 'Erro', 'Fechar', { duration: 4000 })
        });
      } else {
        const { clienteId, ...petData } = result;
        this.petApi.criar(clienteId, petData).subscribe({
          next: () => { this.carregar(); this.snack.open('Pet criado!', 'OK', { duration: 3000 }); },
          error: (e) => this.snack.open(e.error?.mensagem || 'Erro', 'Fechar', { duration: 4000 })
        });
      }
    });
  }

  excluir(pet: Pet) {
    if (!confirm(`Excluir o pet "${pet.nome}"?`)) return;
    this.petApi.deletar(pet.id!).subscribe({ next: () => this.carregar() });
  }
}
