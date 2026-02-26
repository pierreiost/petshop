import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatIconModule, MatButtonModule, MatDividerModule
  ],
  template: `
    <mat-sidenav-container class="shell-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="sidenav-brand">
          <mat-icon class="brand-icon">pets</mat-icon>
          <span>PetShop</span>
        </div>

        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="nav-active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>

          <ng-container *ngIf="isAdmin">
            <a mat-list-item routerLink="/clientes" routerLinkActive="nav-active">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>Clientes</span>
            </a>
            <a mat-list-item routerLink="/pets" routerLinkActive="nav-active">
              <mat-icon matListItemIcon>pets</mat-icon>
              <span matListItemTitle>Pets</span>
            </a>
            <a mat-list-item routerLink="/atendimentos" routerLinkActive="nav-active">
              <mat-icon matListItemIcon>medical_services</mat-icon>
              <span matListItemTitle>Atendimentos</span>
            </a>
            <a mat-list-item routerLink="/racas" routerLinkActive="nav-active">
              <mat-icon matListItemIcon>category</mat-icon>
              <span matListItemTitle>Raças</span>
            </a>
          </ng-container>

          <ng-container *ngIf="!isAdmin">
            <a mat-list-item routerLink="/clientes/minha-conta" routerLinkActive="nav-active">
              <mat-icon matListItemIcon>account_circle</mat-icon>
              <span matListItemTitle>Minha Conta</span>
            </a>
          </ng-container>
        </mat-nav-list>

        <div class="sidenav-footer">
          <div class="user-info">
            <mat-icon>account_circle</mat-icon>
            <div>
              <div class="user-name">{{ usuario?.nome }}</div>
              <div class="user-role">{{ usuario?.perfil }}</div>
            </div>
          </div>
          <button mat-icon-button (click)="sair()" title="Sair">
            <mat-icon>logout</mat-icon>
          </button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="main-content">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .shell-container { height: 100vh; }

    .sidenav {
      width: 240px;
      background: #0084FF;
      color: white;
      display: flex;
      flex-direction: column;
    }

    .sidenav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      background: #0084FF;
      font-size: 20px;
      font-weight: 700;
    }

    .brand-icon { color: #ce93d8; font-size: 32px; width: 32px; height: 32px; }

    mat-nav-list { flex: 1; padding-top: 8px; }

    .mat-mdc-list-item {
      color: rgba(255,255,255,0.7) !important;
      border-radius: 8px !important;
      margin: 2px 8px !important;
    }

    .mat-mdc-list-item:hover {
      background: rgba(255,255,255,0.08) !important;
    }

    .nav-active {
      background: rgba(206,147,216,0.2) !important;
      color: #ce93d8 !important;
    }

    .nav-active mat-icon { color: #ce93d8 !important; }

    .sidenav-footer {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .user-info { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.7); }
    .user-info mat-icon { color: rgba(255,255,255,0.4); }
    .user-name { font-size: 13px; font-weight: 600; }
    .user-role { font-size: 11px; color: #ce93d8; text-transform: uppercase; letter-spacing: 0.5px; }

    .main-content { background: #f5f5f5; overflow-y: auto; }
  `]
})
export class ShellComponent {
  usuario = this.auth.getUsuario();
  isAdmin = this.auth.isAdmin();

  constructor(private auth: AuthService, private router: Router) {}

  sair() {
    this.auth.logout();
  }
}
