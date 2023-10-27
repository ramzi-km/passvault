import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AES, enc } from 'crypto-js';
import { Observable } from 'rxjs';
import { Site } from 'src/app/interfaces/site.interface';
import { PasswordManagerService } from 'src/app/services/password-manager.service';
import { environment } from 'src/environments/environment';

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
  deletingPassId = '';
  deletePasswordLoading = false;
  showPassword = {
    id: '',
    value: false,
  };

  alertMessage: string = '';
  alertType: string = '';

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

  onSubmitPasswordForm(values: any) {
    values.password = this.encryptPassword(values.password);
    if (this.formState == 'Add New') {
      this.passwordManagerService
        .addPassword(values, this.site.id!)
        .then(() => {
          this.alertMessage = 'New password added successfully';
          this.alertType = 'success';
          this.resetForm();
        })
        .catch(() => {
          this.alertMessage = 'Error! adding new password failed.';
          this.alertType = 'error';
        });
    } else {
      this.passwordManagerService
        .updatePassword(this.site.id!, this.editingPassword.id, values)
        .then(() => {
          this.alertMessage = 'password updated successfully';
          this.alertType = 'info';
          this.resetForm();
        })
        .catch((err) => {
          console.error(err);
          this.alertMessage = 'Error! updating  password failed.';
          this.alertType = 'error';
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

  closeAlert() {
    this.alertMessage = '';
    this.alertType = '';
  }

  deletePassword() {
    const passwordId = this.deletingPassId;
    this.deletePasswordLoading = true;

    this.passwordManagerService
      .deletePassword(this.site.id!, passwordId)
      .then(() => {
        this.alertMessage = 'password deleted successfully';
        this.alertType = 'info';
        this.deletePasswordLoading = false;
        this.closeDeletePassModal();
      })
      .catch((err) => {
        console.error(err);
        this.alertMessage = 'Error! deleting  password failed.';
        this.alertType = 'error';
        this.deletePasswordLoading = false;
        this.closeDeletePassModal();
      });
  }

  showDeletePassModal(id: string) {
    const deletePassModal = document.getElementById(
      'deletePassModal'
    ) as HTMLDialogElement;
    deletePassModal.showModal();
    this.deletingPassId = id;
  }

  closeDeletePassModal() {
    const deletePassModal = document.getElementById(
      'deletePassModal'
    ) as HTMLDialogElement;
    deletePassModal.close();
  }

  loadPasswords() {
    this.passwordList = this.passwordManagerService.loadPasswords(
      this.site.id!
    );
  }

  encryptPassword(password: string) {
    const secretKey = environment.encryptionKey;
    const encryptedPassword = AES.encrypt(password, secretKey).toString();
    return encryptedPassword;
  }
  decryptPassword(password: string) {
    const secretKey = environment.encryptionKey;
    const decryptedPassword = AES.decrypt(password, secretKey).toString(
      enc.Utf8
    );
    return decryptedPassword;
  }

  displayPassword(id: string) {
    this.showPassword = {
      id,
      value: true,
    };
  }
  hidePassword(id: string) {
    this.showPassword = {
      id: '',
      value: false,
    };
  }
}
