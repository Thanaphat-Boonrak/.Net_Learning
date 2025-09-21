import { Component, inject, OnInit, output, signal } from '@angular/core';
import { RegisterCreds } from '../../type/user';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { formatDate, JsonPipe } from '@angular/common';
import { TextInput } from '../../shared/text-input/text-input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected creds = {} as RegisterCreds;
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cancelRegister = output<boolean>();
  protected credentialForm!: FormGroup;
  protected profileForm!: FormGroup;
  protected currentstep = signal(1);
  protected validationError = signal<string[]>([]);

  constructor() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ],
      confirmPassword: ['', [Validators.required, this.matchValue('password')]],
    });

    this.credentialForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialForm.controls['confirmPassword'].updateValueAndValidity();
    });

    this.profileForm = this.fb.group({
      gender: ['Male', [Validators.required]],
      dateofBirth: ['', [Validators.required]],
      City: ['', [Validators.required]],
      Country: ['', [Validators.required]],
    });
  }

  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  matchValue(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;
      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true };
    };
  }

  nextStep() {
    if (this.credentialForm.valid) {
      this.currentstep.update((currentValue) => currentValue + 1);
    }
  }

  backstep() {
    this.currentstep.update((currentValue) => currentValue - 1);
  }

  register() {
    if (this.profileForm.valid && this.credentialForm.valid) {
      const formData = {
        ...this.credentialForm.value,
        ...this.profileForm.value,
      };
      console.log(formData);
      this.accountService.register(formData).subscribe({
        next: (res) => {
          this.router.navigateByUrl('/members');
        },
        error: (err) => {
          console.log(err);
          this.validationError.set(err);
        },
      });
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
