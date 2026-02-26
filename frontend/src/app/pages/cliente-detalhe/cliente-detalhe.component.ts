import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClienteService, PetService, AtendimentoService, RacaApiService } from '../../shared/services/api.services';
import { Cliente, Endereco, Contato, Pet, Atendimento, Raca } from '../../models';

@Component({
  selector: 'app-endereco-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Novo' }} Endereço</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="w-full"><mat-label>Logradouro</mat-label><input matInput formControlName="logradouro"></mat-form-field>
        <mat-form-field appearance="outline" class="w-full"><mat-label>Bairro</mat-label><input matInput formControlName="bairro"></mat-form-field>
        <mat-form-field appearance="outline" class="w-full"><mat-label>Cidade</mat-label><input matInput formControlName="cidade"></mat-form-field>
        <mat-form-field appearance="outline" class="w-full"><mat-label>Complemento</mat-label><input matInput formControlName="complemento"></mat-form-field>
        <mat-form-field appearance="outline" class="w-full"><mat-label>Tag (ex: Casa, Trabalho)</mat-label><input matInput formControlName="tag"></mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmar()" [disabled]="form.invalid">Salvar</button>
    </mat-dialog-actions>
  `,
  styles: ['.w-full { width: 100%; min-width: 380px; }']
})
export class EnderecoDialogComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder, private ref: MatDialogRef<EnderecoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Endereco | null) {
    this.form = this.fb.group({ logradouro: [data?.logradouro || '', Validators.required], bairro: [data?.bairro || '', Validators.required], cidade: [data?.cidade || '', Validators.required], complemento: [data?.complemento || ''], tag: [data?.tag || ''] });
  }
  confirmar() { if (this.form.valid) this.ref.close(this.form.value); }
}

@Component({
  selector: 'app-contato-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Novo' }} Contato</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="w-full"><mat-label>Tipo</mat-label><mat-select formControlName="tipo"><mat-option value="EMAIL">E-mail</mat-option><mat-option value="TELEFONE">Telefone</mat-option></mat-select></mat-form-field>
        <mat-form-field appearance="outline" class="w-full"><mat-label>Valor</mat-label><input matInput formControlName="valor"></mat-form-field>
        <mat-form-field appearance="outline" class="w-full"><mat-label>Tag</mat-label><input matInput formControlName="tag"></mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmar()" [disabled]="form.invalid">Salvar</button>
    </mat-dialog-actions>
  `,
  styles: ['.w-full { width: 100%; min-width: 380px; }']
})
export class ContatoDialogComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder, private ref: MatDialogRef<ContatoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Contato | null) {
    this.form = this.fb.group({ tipo: [data?.tipo || '', Validators.required], valor: [data?.valor || '', Validators.required], tag: [data?.tag || ''] });
  }
  confirmar() { if (this.form.valid) this.ref.close(this.form.value); }
}

@Component({
  selector: 'app-pet-detalhe-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data?.pet ? 'Editar' : 'Novo' }} Pet</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="w-full"><mat-label>Nome</mat-label><input matInput formControlName="nome"></mat-form-field>
        <mat-form-field appearance="outline" class="w-full"><mat-label>Raça</mat-label><mat-select formControlName="racaId"><mat-option *ngFor="let r of data?.racas" [value]="r.id">{{ r.descricao }}</mat-option></mat-select></mat-form-field>
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
export class PetDetalheDialogComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder, private ref: MatDialogRef<PetDetalheDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { pet: Pet | null, racas: Raca[] }) {
    this.form = this.fb.group({ nome: [data?.pet?.nome || '', Validators.required], racaId: [data?.pet?.raca?.id || '', Validators.required], dataNascimento: [data?.pet?.dataNascimento || ''] });
  }
  confirmar() { if (this.form.valid) this.ref.close(this.form.value); }
}

@Component({
  selector: 'app-cliente-detalhe',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatTabsModule,
    MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="page-container" *ngIf="cliente">
      <div class="page-header">
        <div class="header-left">
          <button mat-icon-button routerLink="/clientes"><mat-icon>arrow_back</mat-icon></button>
          <h2>{{ cliente.nome }}</h2>
          <span class="cpf-badge" *ngIf="cliente.cpf">CPF: {{ cliente.cpf }}</span>
        </div>
      </div>

      <mat-tab-group animationDuration="150ms">

        <mat-tab label="Endereços">
          <div class="tab-body">
            <button mat-raised-button color="primary" class="mb-12" (click)="abrirEnderecoDialog()">
              <mat-icon>add</mat-icon> Adicionar Endereço
            </button>
            <div class="cards-grid" *ngIf="enderecos.length; else vazioEnd">
              <mat-card *ngFor="let e of enderecos" class="item-card">
                <mat-card-content>
                  <div class="item-head">
                    <span class="badge" *ngIf="e.tag">{{ e.tag }}</span>
                    <div>
                      <button mat-icon-button color="accent" (click)="abrirEnderecoDialog(e)"><mat-icon>edit</mat-icon></button>
                      <button mat-icon-button color="warn" (click)="excluirEndereco(e)"><mat-icon>delete</mat-icon></button>
                    </div>
                  </div>
                  <p class="item-info"><mat-icon class="sm-icon">place</mat-icon> {{ e.logradouro }}</p>
                  <p class="item-info">{{ e.bairro }}, {{ e.cidade }}</p>
                  <p class="item-info" *ngIf="e.complemento">{{ e.complemento }}</p>
                </mat-card-content>
              </mat-card>
            </div>
            <ng-template #vazioEnd><div class="empty-state">Nenhum endereço cadastrado.</div></ng-template>
          </div>
        </mat-tab>

        <mat-tab label="Contatos">
          <div class="tab-body">
            <button mat-raised-button color="primary" class="mb-12" (click)="abrirContatoDialog()">
              <mat-icon>add</mat-icon> Adicionar Contato
            </button>
            <div class="cards-grid" *ngIf="contatos.length; else vazioCtx">
              <mat-card *ngFor="let c of contatos" class="item-card">
                <mat-card-content>
                  <div class="item-head">
                    <span class="badge">{{ c.tipo }}</span>
                    <div>
                      <button mat-icon-button color="accent" (click)="abrirContatoDialog(c)"><mat-icon>edit</mat-icon></button>
                      <button mat-icon-button color="warn" (click)="excluirContato(c)"><mat-icon>delete</mat-icon></button>
                    </div>
                  </div>
                  <p class="item-info"><mat-icon class="sm-icon">{{ c.tipo === 'EMAIL' ? 'email' : 'phone' }}</mat-icon> {{ c.valor }}</p>
                  <p class="item-info" *ngIf="c.tag">{{ c.tag }}</p>
                </mat-card-content>
              </mat-card>
            </div>
            <ng-template #vazioCtx><div class="empty-state">Nenhum contato cadastrado.</div></ng-template>
          </div>
        </mat-tab>

        <mat-tab label="Pets">
          <div class="tab-body">
            <button mat-raised-button color="primary" class="mb-12" (click)="abrirPetDialog()">
              <mat-icon>add</mat-icon> Adicionar Pet
            </button>
            <div class="cards-grid" *ngIf="pets.length; else vazioPet">
              <mat-card *ngFor="let p of pets" class="item-card">
                <mat-card-content>
                  <div class="item-head">
                    <span class="pet-nome"><mat-icon class="sm-icon pet-icon">pets</mat-icon> {{ p.nome }}</span>
                    <div>
                      <button mat-icon-button color="accent" (click)="abrirPetDialog(p)"><mat-icon>edit</mat-icon></button>
                      <button mat-icon-button color="warn" (click)="excluirPet(p)"><mat-icon>delete</mat-icon></button>
                    </div>
                  </div>
                  <p class="item-info">{{ p.raca?.descricao }}</p>
                  <p class="item-info" *ngIf="p.dataNascimento"><mat-icon class="sm-icon">cake</mat-icon> {{ p.dataNascimento | date:'dd/MM/yyyy' }}</p>
                </mat-card-content>
              </mat-card>
            </div>
            <ng-template #vazioPet><div class="empty-state">Nenhum pet cadastrado.</div></ng-template>
          </div>
        </mat-tab>

        <mat-tab label="Atendimentos">
          <div class="tab-body">
            <div class="atend-list" *ngIf="atendimentos.length; else vazioAtend">
              <mat-card *ngFor="let a of atendimentos" class="atend-card">
                <mat-card-content>
                  <div class="atend-row">
                    <div>
                      <strong>{{ a.petNome }}</strong> — {{ a.descricao }}
                      <div class="atend-data">{{ a.data | date:'dd/MM/yyyy HH:mm' }}</div>
                    </div>
                    <span class="valor-destaque">{{ a.valor | currency:'BRL' }}</span>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
            <ng-template #vazioAtend><div class="empty-state">Nenhum atendimento encontrado.</div></ng-template>
          </div>
        </mat-tab>

      </mat-tab-group>
    </div>
  `,
  styles: [`
    .header-left { display: flex; align-items: center; gap: 12px; }
    .cpf-badge { background: #e1bee7; color: #6a1b9a; padding: 4px 10px; border-radius: 20px; font-size: 12px; }
    .tab-body { padding: 20px 0; }
    .mb-12 { margin-bottom: 12px; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
    .item-card { border-radius: 10px !important; }
    .item-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .badge { background: #e1bee7; color: #6a1b9a; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .item-info { margin: 4px 0; font-size: 14px; color: #444; display: flex; align-items: center; gap: 4px; }
    .sm-icon { font-size: 16px; width: 16px; height: 16px; color: #9e9e9e; }
    .pet-icon { color: #7b1fa2 !important; }
    .pet-nome { display: flex; align-items: center; gap: 6px; font-weight: 600; }
    .atend-list { display: flex; flex-direction: column; gap: 10px; }
    .atend-card { border-radius: 10px !important; }
    .atend-row { display: flex; justify-content: space-between; align-items: center; }
    .atend-data { font-size: 12px; color: #9e9e9e; margin-top: 4px; }
  `]
})
export class ClienteDetalheComponent implements OnInit {
  cliente: Cliente | null = null;
  enderecos: Endereco[] = [];
  contatos: Contato[] = [];
  pets: Pet[] = [];
  atendimentos: Atendimento[] = [];
  racas: Raca[] = [];
  clienteId!: number;

  constructor(
    private route: ActivatedRoute,
    private clienteApi: ClienteService,
    private petApi: PetService,
    private atendApi: AtendimentoService,
    private racaApi: RacaApiService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.racaApi.listar().subscribe(data => this.racas = data);
    this.carregar();
  }

  carregar() {
    this.clienteApi.buscar(this.clienteId).subscribe(c => this.cliente = c);
    this.clienteApi.listarEnderecos(this.clienteId).subscribe(data => this.enderecos = data);
    this.clienteApi.listarContatos(this.clienteId).subscribe(data => this.contatos = data);
    this.petApi.listarPorCliente(this.clienteId).subscribe(data => this.pets = data);
    this.atendApi.listarPorCliente(this.clienteId).subscribe(data => this.atendimentos = data);
  }

  abrirEnderecoDialog(endereco?: Endereco) {
    const ref = this.dialog.open(EnderecoDialogComponent, { data: endereco || null });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (endereco?.id) {
        this.clienteApi.atualizarEndereco(this.clienteId, endereco.id, result).subscribe({ next: () => this.carregar() });
      } else {
        this.clienteApi.adicionarEndereco(this.clienteId, result).subscribe({ next: () => this.carregar() });
      }
    });
  }

  excluirEndereco(e: Endereco) {
    if (!confirm('Excluir endereço?')) return;
    this.clienteApi.deletarEndereco(this.clienteId, e.id!).subscribe({ next: () => this.carregar() });
  }

  abrirContatoDialog(contato?: Contato) {
    const ref = this.dialog.open(ContatoDialogComponent, { data: contato || null });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (contato?.id) {
        this.clienteApi.atualizarContato(this.clienteId, contato.id, result).subscribe({ next: () => this.carregar() });
      } else {
        this.clienteApi.adicionarContato(this.clienteId, result).subscribe({ next: () => this.carregar() });
      }
    });
  }

  excluirContato(c: Contato) {
    if (!confirm('Excluir contato?')) return;
    this.clienteApi.deletarContato(this.clienteId, c.id!).subscribe({ next: () => this.carregar() });
  }

  abrirPetDialog(pet?: Pet) {
    const ref = this.dialog.open(PetDetalheDialogComponent, { data: { pet: pet || null, racas: this.racas } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (pet?.id) {
        this.petApi.atualizar(pet.id, result).subscribe({ next: () => this.carregar() });
      } else {
        this.petApi.criar(this.clienteId, result).subscribe({ next: () => this.carregar() });
      }
    });
  }

  excluirPet(p: Pet) {
    if (!confirm(`Excluir o pet "${p.nome}"?`)) return;
    this.petApi.deletar(p.id!).subscribe({ next: () => this.carregar() });
  }
}
