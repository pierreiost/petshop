import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../core/services/auth.service';
import { ClienteService, PetService, AtendimentoService } from '../../shared/services/api.services';
import { Cliente, Pet, Atendimento } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatIconModule, MatButtonModule, MatTableModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Olá, {{ nomeUsuario }} 👋</h2>
      </div>

      <ng-container *ngIf="isAdmin">
        <div class="stats-grid">
          <mat-card class="stat-card" style="background: linear-gradient(135deg, #7b1fa2, #9c27b0)">
            <mat-card-content>
              <div class="stat-row">
                <div>
                  <div class="stat-num">{{ clientes.length }}</div>
                  <div class="stat-label">Clientes</div>
                </div>
                <mat-icon>people</mat-icon>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card" style="background: linear-gradient(135deg, #0288d1, #03a9f4)">
            <mat-card-content>
              <div class="stat-row">
                <div>
                  <div class="stat-num">{{ pets.length }}</div>
                  <div class="stat-label">Pets</div>
                </div>
                <mat-icon>pets</mat-icon>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card" style="background: linear-gradient(135deg, #2e7d32, #43a047)">
            <mat-card-content>
              <div class="stat-row">
                <div>
                  <div class="stat-num">{{ atendimentos.length }}</div>
                  <div class="stat-label">Atendimentos</div>
                </div>
                <mat-icon>medical_services</mat-icon>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card" style="background: linear-gradient(135deg, #e65100, #ef6c00)">
            <mat-card-content>
              <div class="stat-row">
                <div>
                  <div class="stat-num">{{ totalReceita | currency:'BRL':'symbol':'1.0-0' }}</div>
                  <div class="stat-label">Receita Total</div>
                </div>
                <mat-icon>attach_money</mat-icon>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card class="mt-16">
          <mat-card-header>
            <mat-card-title>Últimos Atendimentos</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="atendimentos.slice(0, 5)" class="w-full">
              <ng-container matColumnDef="pet">
                <th mat-header-cell *matHeaderCellDef>Pet</th>
                <td mat-cell *matCellDef="let a">{{ a.petNome }}</td>
              </ng-container>
              <ng-container matColumnDef="cliente">
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
              <tr mat-header-row *matHeaderRowDef="colsAtend"></tr>
              <tr mat-row *matRowDef="let row; columns: colsAtend"></tr>
            </table>
            <div class="empty-state" *ngIf="!atendimentos.length">Nenhum atendimento registrado.</div>
          </mat-card-content>
        </mat-card>
      </ng-container>

      <ng-container *ngIf="!isAdmin">
        <div class="stats-grid">
          <mat-card class="stat-card" style="background: linear-gradient(135deg, #0288d1, #03a9f4)">
            <mat-card-content>
              <div class="stat-row">
                <div>
                  <div class="stat-num">{{ pets.length }}</div>
                  <div class="stat-label">Meus Pets</div>
                </div>
                <mat-icon>pets</mat-icon>
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card" style="background: linear-gradient(135deg, #2e7d32, #43a047)">
            <mat-card-content>
              <div class="stat-row">
                <div>
                  <div class="stat-num">{{ atendimentos.length }}</div>
                  <div class="stat-label">Atendimentos</div>
                </div>
                <mat-icon>medical_services</mat-icon>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card class="mt-16" *ngIf="meuCliente">
          <mat-card-header>
            <mat-card-title>Meus Pets</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="pets-grid" *ngIf="pets.length; else semPets">
              <mat-card *ngFor="let p of pets" class="pet-item">
                <mat-card-content>
                  <div class="pet-header">
                    <mat-icon class="pet-icon">pets</mat-icon>
                    <div>
                      <strong>{{ p.nome }}</strong>
                      <div class="pet-raca">{{ p.raca?.descricao }}</div>
                    </div>
                  </div>
                  <div *ngIf="p.dataNascimento" class="pet-nasc">
                    <mat-icon class="sm-icon">cake</mat-icon>
                    {{ p.dataNascimento | date:'dd/MM/yyyy' }}
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
            <ng-template #semPets>
              <div class="empty-state">Nenhum pet cadastrado.</div>
            </ng-template>
          </mat-card-content>
        </mat-card>
      </ng-container>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 0;
    }
    .stat-card { border-radius: 12px !important; color: white; }
    .stat-row { display: flex; justify-content: space-between; align-items: center; }
    .stat-num { font-size: 30px; font-weight: 700; }
    .stat-label { font-size: 13px; opacity: 0.85; margin-top: 4px; }
    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; opacity: 0.6; }
    .mt-16 { margin-top: 16px; }
    .w-full { width: 100%; }
    .pets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
    .pet-item { border-radius: 10px !important; }
    .pet-header { display: flex; align-items: center; gap: 10px; }
    .pet-icon { color: #7b1fa2; font-size: 32px; width: 32px; height: 32px; }
    .pet-raca { font-size: 12px; color: #777; }
    .pet-nasc { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #555; margin-top: 8px; }
    .sm-icon { font-size: 14px; width: 14px; height: 14px; color: #9e9e9e; }
  `]
})
export class DashboardComponent implements OnInit {
  isAdmin = this.auth.isAdmin();
  nomeUsuario = this.auth.getUsuario()?.nome || '';
  clientes: Cliente[] = [];
  pets: Pet[] = [];
  atendimentos: Atendimento[] = [];
  meuCliente: Cliente | null = null;
  colsAtend = ['pet', 'cliente', 'descricao', 'valor'];

  get totalReceita(): number {
    return this.atendimentos.reduce((soma, a) => soma + (a.valor || 0), 0);
  }

  constructor(
    private auth: AuthService,
    private clienteApi: ClienteService,
    private petApi: PetService,
    private atendApi: AtendimentoService
  ) {}

  ngOnInit() {
    if (this.isAdmin) {
      this.clienteApi.listar().subscribe(data => this.clientes = data);
      this.petApi.listarTodos().subscribe(data => this.pets = data);
      this.atendApi.listarTodos().subscribe(data => this.atendimentos = data);
    } else {
      this.clienteApi.meuPerfil().subscribe({
        next: (cliente) => {
          this.meuCliente = cliente;
          if (cliente.id) {
            this.petApi.listarPorCliente(cliente.id).subscribe(data => this.pets = data);
            this.atendApi.listarPorCliente(cliente.id).subscribe(data => this.atendimentos = data);
          }
        },
        error: () => {}
      });
    }
  }
}
