import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class LotService {

  constructor(private firestore: AngularFirestore) {}

  getLots() {
    return this.firestore.collection('lots').valueChanges({ idField: 'id' });
  }

  createLot(data: any) {
    return this.firestore.collection('lots').add(data);
  }

  updateLot(id: string, data: any) {
    return this.firestore.collection('lots').doc(id).update(data);
  }

  deleteLot(id: string) {
    return this.firestore.collection('lots').doc(id).delete();
  }
}
