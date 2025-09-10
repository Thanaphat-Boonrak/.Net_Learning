import { Component, inject, input, output } from '@angular/core';
import { RegisterCreds } from '../../type/user';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected creds = {} as RegisterCreds;
  private accountService = inject(AccountService);
  cancelRegister = output<boolean>();
  register() {
    this.accountService.register(this.creds).subscribe({
      next: (res) => {
        console.log(res);
        this.cancel();
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
