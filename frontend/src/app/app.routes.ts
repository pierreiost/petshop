import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'clientes',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/clientes/clientes.component').then(m => m.ClientesComponent)
      },
      {
        path: 'clientes/:id',
        loadComponent: () => import('./pages/cliente-detalhe/cliente-detalhe.component').then(m => m.ClienteDetalheComponent)
      },
      {
        path: 'pets',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/pets/pets.component').then(m => m.PetsComponent)
      },
      {
        path: 'atendimentos',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/atendimentos/atendimentos.component').then(m => m.AtendimentosComponent)
      },
      {
        path: 'racas',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/racas/racas.component').then(m => m.RacasComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
