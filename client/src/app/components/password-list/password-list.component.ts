import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Site } from 'src/app/interfaces/site.interface';
import { PasswordManagerService } from 'src/app/services/password-manager.service';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.scss'],
})
export class PasswordListComponent {
  site!: Site;
  passwordList!: Observable<Array<any>>;
  editingPassword = {
    id: '',
    username: '',
    email: '',
    password: '',
  };
  formState = 'Add New';

  constructor(
    private route: ActivatedRoute,
    private passwordManagerService: PasswordManagerService
  ) {
    this.route.queryParams.subscribe({
      next: (values: any) => {
        this.site = {
          id: values.id,
          siteName: values.siteName,
          siteImgUrl: values.siteImgUrl,
          siteUrl: values.siteUrl,
        };
      },
    });

    this.loadPasswords();
  }

  onSubmitPasswordForm(values: object) {
    if (this.formState == 'Add New') {
      this.passwordManagerService
        .addPassword(values, this.site.id!)
        .then(() => {
          console.log('data saved successfully');
          this.resetForm();
        })
        .catch(() => {});
    } else {
      this.passwordManagerService
        .updatePassword(this.site.id!, this.editingPassword.id, values)
        .then(() => {
          console.log('data updated successfully');
          this.resetForm();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  editPassword(password: any) {
    this.editingPassword = { ...password };
    this.formState = 'Edit';
  }

  resetForm() {
    this.editingPassword = {
      id: '',
      username: '',
      email: '',
      password: '',
    };
    this.formState = 'Add New';
  }

  deletePassword(passwordId: string) {
    this.passwordManagerService
      .deletePassword(this.site.id!, passwordId)
      .then(() => {
        console.log('password deleted successfully');
      })
      .catch((err) => {
        console.error(err);
      });
  }

  loadPasswords() {
    this.passwordList = this.passwordManagerService.loadPasswords(
      this.site.id!
    );
  }
}
