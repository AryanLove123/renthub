import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService, RegisterUser } from '../../../../core/services/auth.service';
import { UserRole } from '../../../../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  errorMessage = signal<string | null>(null);
  router = inject(Router);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);

  registerForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    role: [UserRole.TENANT, [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    this.errorMessage.set(null);
    if (this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value);
      const formValue = this.registerForm.getRawValue();
      const userPayload: RegisterUser = {
        firstName: formValue.firstName!,
        lastName: formValue.lastName || undefined,
        email: formValue.email!,
        role: formValue.role!,
        password: formValue.password!,
      };
      this.authService.register(userPayload).subscribe({
        next:(newUser) =>{
          this.router.navigateByUrl('/login');
        },
        error: (err: Error) =>{
          this.errorMessage.set(err.message);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
