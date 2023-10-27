import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Site } from 'src/app/interfaces/site.interface';
import { PasswordManagerService } from 'src/app/services/password-manager.service';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss'],
})
export class SiteListComponent implements OnDestroy, OnInit {
  constructor(private passManagerService: PasswordManagerService) {}
  allSites!: Observable<Array<any>>;
  formState: string = 'Add New';
  alertMessage: string = '';
  alertType: string = '';
  deletingSiteId = '';
  deleteSiteLoading = false;

  editingSite: Site = {
    id: '',
    siteName: '',
    siteImgUrl: '',
    siteUrl: '',
  };

  private ngUnsubscribe$ = new Subject<void>();
  ngOnInit(): void {
    this.loadSites();
  }

  onSubmitForm(values: object) {
    if (this.formState == 'Add New') {
      this.passManagerService
        .addSite(values)
        .then((data) => {
          console.log('Data saved successfully');
          this.alertMessage = 'New site added successfully';
          this.alertType = 'success';
        })
        .catch((err) => {
          console.log(err);
          this.alertMessage = 'Error! adding new site failed.';
          this.alertType = 'error';
        });
    } else {
      this.passManagerService
        .updateSite(this.editingSite.id!, values)
        .then((data) => {
          this.alertMessage = 'site updated successfully';
          this.alertType = 'info';
        })
        .catch((err) => {
          console.log(err);
          this.alertMessage = 'Error! site updation failed';
          this.alertType = 'error';
        });
    }
  }

  loadSites() {
    this.allSites = this.passManagerService.loadSites();
  }

  editSite(site: Site) {
    this.editingSite = { ...site };
    this.formState = 'Edit';
  }

  closeAlert() {
    this.alertMessage = '';
    this.alertType = '';
  }

  deleteSite() {
    this.deleteSiteLoading = true;
    this.passManagerService
      .deleteSite(this.deletingSiteId)
      .then(() => {
        this.deleteSiteLoading = false;
        this.alertMessage = 'site deleted successfully';
        this.alertType = 'info';
        this.closeDeleteSiteModal();
      })
      .catch(() => {
        this.deleteSiteLoading = false;
        this.alertMessage = 'Error! site deletion failed';
        this.alertType = 'error';
        this.closeDeleteSiteModal();
      });
  }

  showDeleteSiteModal(id: string) {
    const deleteSiteModal = document.getElementById(
      'deleteSiteModal'
    ) as HTMLDialogElement;
    deleteSiteModal.showModal();
    this.deletingSiteId = id;
  }

  closeDeleteSiteModal() {
    const deleteSiteModal = document.getElementById(
      'deleteSiteModal'
    ) as HTMLDialogElement;
    deleteSiteModal.close();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
