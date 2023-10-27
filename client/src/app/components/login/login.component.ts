import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordManagerService } from 'src/app/services/password-manager.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private passwordManagerService: PasswordManagerService,
    private router: Router
  ) {}

  alertMessage = '';
  alertType = '';

  onSubmitLoginForm(values: any) {
    this.passwordManagerService
      .login(values.email, values.password)
      .then(() => {
        console.log('login success');
        this.router.navigate(['/site-list']);
      })
      .catch((err) => {
        console.log(err, 'login failed');
        this.alertMessage = 'Invalid credentials';
        this.alertType = 'error';
      });
  }

  closeAlert() {
    this.alertMessage = '';
    this.alertType = '';
  }
}
