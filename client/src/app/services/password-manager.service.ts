import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collectionData } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class PasswordManagerService {
  constructor(private firestore: Firestore, private auth: Auth) {}
  addSite(data: object) {
    const collectionInstance = collection(this.firestore, 'sites');
    return addDoc(collectionInstance, data);
  }

  loadSites() {
    const collectionInstance = collection(this.firestore, 'sites');
    return collectionData(collectionInstance, { idField: 'id' });
  }

  updateSite(id: string, data: object) {
    const docInstance = doc(this.firestore, 'sites', id);
    return updateDoc(docInstance, data);
  }

  deleteSite(id: string) {
    const docInstance = doc(this.firestore, 'sites', id);
    return deleteDoc(docInstance);
  }

  //password queries

  addPassword(passwordData: object, siteId: string) {
    const dbInstance = collection(this.firestore, `sites/${siteId}/passwords`);
    return addDoc(dbInstance, passwordData);
  }

  loadPasswords(siteId: string) {
    const dbInstance = collection(this.firestore, `sites/${siteId}/passwords`);
    return collectionData(dbInstance, { idField: 'id' });
  }

  updatePassword(siteId: string, passwordId: string, passwordData: object) {
    const docInstance = doc(
      this.firestore,
      `sites/${siteId}/passwords`,
      passwordId
    );
    return updateDoc(docInstance, passwordData);
  }
  deletePassword(siteId: string, passwordId: string) {
    const docInstance = doc(
      this.firestore,
      `sites/${siteId}/passwords`,
      passwordId
    );
    return deleteDoc(docInstance);
  }

  //login
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

}
