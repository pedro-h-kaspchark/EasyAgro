import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Farm } from '../entities/farm';
import { Animal } from '../entities/Animal';
import { Vaccine } from '../entities/Vaccine';
import { Feeding } from '../entities/Feeding';
import jsPDF from 'jspdf';
import { user } from '../entities/user';
import { arrayUnion } from 'firebase/firestore';
import { arrayRemove } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private PATHFarm: string = "farm";
  private PATHAnimal: string = "animal"
  private PATHVaccine = 'vaccine';
  private PATHFeeding = 'feeding';
  user: any;
  farm: any;
  animal: any;

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore, @Inject(Injector) private readonly injector: Injector){}

  private injectAuthService(){
    return this.injector.get(AuthService);
  }

  getUserByEmail(email: string): Promise<any | null> {
    return this.firestore.collection('users', (ref) => ref.where('email', '==', email)).get().toPromise().then((snapshot) => {
        if (!snapshot || snapshot.empty) {
          return null;
        }
        return snapshot.docs[0].data();
      }).catch(() => null);
  }

  registerFarm(farm: Farm, ownerEmail: string) {
    return this.firestore.collection(this.PATHFarm).add({farmName: farm.farmName, location: farm.location, uid: farm.uid, ownerUid: farm.uid, newFarmId: farm.newFarmId, allowedUsers: [ownerEmail]});
  }

  registerAnimal(animal: Animal){
    return this.firestore.collection(this.PATHAnimal).add({name: animal.name, species: animal.species, birthDate: animal.birthDate, uid: animal.uid, farmId: animal.id, number: animal.number, type: animal.type, lotId: animal.lotId, historyOfIllnesses: animal.historyOfIllnesses, treatmentHistory: animal.treatmentHistory, life: animal.life});
  }

  editAnimal(animal: Animal, id: string){
    return this.firestore.collection(this.PATHAnimal).doc(id).update({name: animal.name, species: animal.species, birthDate: animal.birthDate, uid: animal.uid, farmId: animal.farmId, number: animal.number, type: animal.type, lotId: animal.lotId, historyOfIllnesses: animal.historyOfIllnesses, treatmentHistory: animal.treatmentHistory, life: animal.life});
  }

  setDeathDate(animal: Animal, id: string){
    return this.firestore.collection(this.PATHAnimal).doc(id).update({name: animal.name, species: animal.species, birthDate: animal.birthDate, uid: animal.uid, farmId: animal.farmId, number: animal.number, historyOfIllnesses: animal.historyOfIllnesses, treatmentHistory: animal.treatmentHistory, life: animal.life, deathDate: animal.deathDate});
  }

  getAllFarms(){
    this.user = this.injectAuthService().getUserLogged();
    return this.firestore.collection(this.PATHFarm, ref => ref.where('uid', '==', this.user.uid)).snapshotChanges();
  }

  getFarms(email: string) {
    return this.firestore.collection(this.PATHFarm, ref => ref.where('allowedUsers', 'array-contains', email)).snapshotChanges();
  }

  addEmployeeToFarm(farmId: string, email: string) {
    const farmRef = this.firestore.collection('farm').doc(farmId);
    return farmRef.update({allowedUsers: arrayUnion(email)});
  }

  removeEmployeeFromFarm(docId: string, email: string) {
    return this.firestore.collection(this.PATHFarm).doc(docId).update({
      allowedUsers: arrayRemove(email)
    });
  }

  getAllAnimalsByFarm(farmId: string) {
    this.user = this.injectAuthService().getUserLogged();
    return this.firestore.collection(this.PATHAnimal, ref => ref.where('farmId', '==', farmId).where('farmId', '==', farmId).where('life', '==', true)).snapshotChanges();
  }

  getAllAnimalsDeathByFarm(farmId: string) {
    this.user = this.injectAuthService().getUserLogged();
    return this.firestore.collection(this.PATHAnimal, ref => ref.where('farmId', '==', farmId).where('farmId', '==', farmId).where('life', '==', false)).snapshotChanges();
  }

  deleteAnimal(id: string){
    return this.firestore.collection(this.PATHAnimal).doc(id).delete();
  }
  
  deleteFarm(id: string) {
    return this.firestore.collection(this.PATHFarm).doc(id).delete();
  }

  generateId() {
    return this.firestore.createId();
  }

  getVaccinesByFarm(uid: string, farmId: string) {
    return this.firestore.collection(this.PATHVaccine, ref => ref.where('uid', '==', uid).where('farmId', '==', farmId)).snapshotChanges();
  }

  getFeedingsByFarm(uid: string, farmId: string) {
    return this.firestore.collection(this.PATHFeeding, ref => ref.where('uid', '==', uid).where('farmId', '==', farmId)).snapshotChanges();
  }

  getAnimalNameById(animalId: string): Promise<string | null> {
    return this.firestore.collection('animal').doc(animalId).get().toPromise().then((doc) => {
        if (doc?.exists) {
          const data = doc.data() as any;
          return data.name || null;
        }
        return null;
      });
  }

    getAnimalNumberById(animalId: string): Promise<string | null> {
    return this.firestore.collection('animal').doc(animalId).get().toPromise().then((doc) => {
      if (doc?.exists) {
        const data = doc.data() as any;
        return data.number || null;
      }
      return null;
    });
  }

  registerVaccine(vaccine: Vaccine) {
    const uid = this.injectAuthService().getUserLogged()?.uid;
    return this.firestore.collection(this.PATHVaccine).add({
      animalId: vaccine.animalId,
      farmId: vaccine.farmId,
      name: vaccine.name,
      date: vaccine.date,
      notes: vaccine.notes,
      administeredBy: vaccine.administeredBy,
      uid: uid
    });
  }

  getVaccinesByAnimal(animalId: string) {
    this.user = this.injectAuthService().getUserLogged();
    return this.firestore.collection(this.PATHVaccine, ref =>
      ref.where('uid', '==', this.user.uid).where('animalId', '==', animalId).orderBy('date', 'desc')
    ).snapshotChanges();
  }

  registerFeeding(feeding: Feeding) {
    const uid = this.injectAuthService().getUserLogged()?.uid;
    return this.firestore.collection(this.PATHFeeding).add({
      animalId: feeding.animalId,
      farmId: feeding.farmId,
      date: feeding.date,
      feedType: feeding.feedType,
      amount: feeding.amount,
      notes: feeding.notes,
      uid: uid
    });
  }

  getFeedingsByAnimal(animalId: string) {
    this.user = this.injectAuthService().getUserLogged();
    return this.firestore.collection(this.PATHFeeding, ref =>
      ref.where('uid', '==', this.user.uid).where('animalId', '==', animalId).orderBy('date', 'desc')
    ).snapshotChanges();
  }

  async getProfile(): Promise<user> {
    const user = await this.injectAuthService().getUserLogged();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const userProfileDoc = await this.firestore
      .collection('users')
      .doc(user.uid)
      .get()
      .toPromise();

    if (!userProfileDoc?.exists) {
      throw new Error('Perfil do usuário não encontrado');
    }

    const profileData = userProfileDoc.data() as user;
    return profileData;
  }

  async getFarm(animal: Animal): Promise<Farm> {
    const farmDoc = await this.firestore.collection(this.PATHFarm, ref => ref.where('newFarmId', '==', animal.farmId)).get().toPromise();
    if (!farmDoc || farmDoc.empty || farmDoc.docs.length === 0) {
      console.error('Fazenda não encontrada');
      throw new Error('Fazenda não encontrada');
    }
    const farmData = farmDoc.docs[0].data() as Farm;
    return farmData;
  }


    async generatePDF(animal: Animal): Promise<Blob> {
      const doc = new jsPDF();
      const user = await this.getProfile();
      const farm = await this.getFarm(animal);

      const textWidth = 180;
      const margin = 10;
      const pageHeight = doc.internal.pageSize.height;
      let currentPosition = 10;

      const wrapText = (text: string, width: number) => {
          return doc.splitTextToSize(text, width);
      };

      const addText = (text: string, x: number, y: number, increase: number) => {
          if (y + increase > pageHeight - margin) {
              doc.addPage();
              y = margin;
          }
          doc.text(text, x, y);
          return y + increase;
      };

      const formatDateBR = (date: string) => {
          const [year, month, day] = date.split('-');
          return `${day}/${month}/${year}`;
      };

      doc.setFontSize(16);
      currentPosition = addText('Informações do Perfil', margin, currentPosition, 10);

      doc.setFontSize(12);
      currentPosition = addText(`Nome: ${user.name}`, margin, currentPosition, 10);
      currentPosition = addText(`Email: ${user.email}`, margin, currentPosition, 10);
      currentPosition = addText(`Telefone: ${user.number}`, margin, currentPosition, 10);

      doc.setFontSize(16);
      currentPosition = addText('Informações da Fazenda', margin, currentPosition, 10);

      doc.setFontSize(12);
      currentPosition = addText(`Nome da Fazenda: ${farm.farmName}`, margin, currentPosition, 10);
      currentPosition = addText(`Localização: ${farm.location}`, margin, currentPosition, 10);

      doc.setFontSize(16);
      currentPosition = addText('Detalhes do Animal', margin, currentPosition, 20);

      doc.setFontSize(12);
      currentPosition = addText(`Nome do animal: ${animal.name}`, margin, currentPosition, 10);
      currentPosition = addText(`Espécie do animal: ${animal.species}`, margin, currentPosition, 10);
      currentPosition = addText(`Data de nascimento: ${formatDateBR(animal.birthDate)}`, margin, currentPosition, 10);

      if (animal.deathDate) {
          currentPosition = addText(`Data de óbito: ${formatDateBR(animal.deathDate)}`, margin, currentPosition, 10);
      }

      currentPosition = addText(`Número de identificação: ${animal.number}`, margin, currentPosition, 10);
      currentPosition = addText(`Estado do animal: ${animal.life ? 'Vivo' : 'Morto'}`, margin, currentPosition, 10);

      currentPosition = addText('Histórico de doenças:', margin, currentPosition, 10);
      const illnessText = wrapText(animal.historyOfIllnesses, textWidth);
      for (const line of illnessText) {
          currentPosition = addText(line, margin, currentPosition, 10);
      }

      currentPosition = addText('Histórico de tratamentos:', margin, currentPosition, 10);
      const treatmentText = wrapText(animal.treatmentHistory, textWidth);
      for (const line of treatmentText) {
          currentPosition = addText(line, margin, currentPosition, 10);
      }

      return new Promise((resolve) => {
          const pdfBlob = doc.output('blob');
          resolve(pdfBlob);
      });
  }

  async uploadPDF(animal: Animal): Promise<string> {
      const pdfBlob = await this.generatePDF(animal);
      const pdfPath = `animals/${animal.name}_${new Date().getTime()}.pdf`;
      const task = this.storage.upload(pdfPath, pdfBlob);

      return new Promise((resolve, reject) => {
          task.snapshotChanges().subscribe({
              next: (snapshot) => {
                  if (snapshot && snapshot.state === 'success') {
                      snapshot.ref.getDownloadURL().then(resolve).catch(reject);
                  }
              },
              error: reject,
          });
      });
  }
}