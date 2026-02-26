import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="login-wrapper">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="login-logo">
            <mat-icon class="logo-icon">pets</mat-icon>
            <h1>PetShop</h1>
            <p>Sistema de Gestão</p>
          </div>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="entrar()">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>CPF</mat-label>
              <input matInput formControlName="cpf" placeholder="00000000000">
              <mat-icon matSuffix>badge</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Senha</mat-label>
              <input matInput [type]="mostrarSenha ? 'text' : 'password'" formControlName="senha">
              <button type="button" mat-icon-button matSuffix (click)="mostrarSenha = !mostrarSenha">
                <mat-icon>{{ mostrarSenha ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="w-full btn-login"
                    [disabled]="form.invalid || carregando">
              {{ carregando ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>

          <div class="demo-box">
            <strong>Credenciais de demonstração:</strong>
            <p>Admin: <code>00000000000</code> / <code>admin123</code></p>
            <p>Cliente: <code>12345678901</code> / <code>cliente123</code></p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background:  #605F61;
    }
    .login-card {
      width: 420px;
      padding: 16px;
      border-radius: 16px !important;
    }
    .login-logo {
      text-align: center;
      width: 100%;
      margin-bottom: 24px;
    }
    .logo-icon { font-size: 56px; width: 56px; height: 56px; color: #7b1fa2; }
    .login-logo h1 { margin: 8px 0 4px; font-size: 26px; font-weight: 700; color: #333; }
    .login-logo p { color: #777; margin: 0; }
    .w-full { width: 100%; }
    .btn-login { height: 48px; font-size: 16px; margin-top: 8px; }
    .demo-box {
      margin-top: 24px;
      padding: 16px;
      background: #605F61;
      border-radius: 8px;
      font-size: 13px;
      color: #FDFDFD;
    }
    .demo-box p { margin: 4px 0; }
    code { background: #7b1fa2; padding: 1px 6px; border-radius: 4px; font-size: 12px; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  mostrarSenha = false;
  carregando = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      cpf: ['', Validators.required],
      senha: ['', Validators.required]
    });

    if (auth.isAutenticado()) {
      router.navigate(['/dashboard']);
    }
  }

  entrar() {
    if (this.form.invalid) return;
    this.carregando = true;

    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.carregando = false;
        this.snack.open('CPF ou senha inválidos', 'Fechar', { duration: 4000 });
      }
    });
  }
}
