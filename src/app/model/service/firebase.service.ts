import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Farm } from '../entities/farm';
import { Animal } from '../entities/Animal';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private PATHFarm: string = "farm";
  private PATHAnimal: string = "animal"
  user: any;
  farm: any;
  animal: any;

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore, @Inject(Injector) private readonly injector: Injector){}

  private injectAuthService(){
    return this.injector.get(AuthService);
  }

  registerFarm(farm: Farm){
    return this.firestore.collection(this.PATHFarm).add({farmName: farm.farmName, location: farm.location, uid: farm.uid, id: farm.id});
  }

  registerAnimal(animal: Animal){
    return this.firestore.collection(this.PATHAnimal).add({name: animal.name, species: animal.species, birthDate: animal.birthDate, uid: animal.uid, farmId: animal.id, number: animal.number, historyOfIllnesses: animal.historyOfIllnesses, treatmentHistory: animal.treatmentHistory});
  }

  editAnimal(animal: Animal, id: string){
    return this.firestore.collection(this.PATHAnimal).doc(id).update({name: animal.name, species: animal.species, birthDate: animal.birthDate, uid: animal.uid, farmId: animal.farmId, number: animal.number, historyOfIllnesses: animal.historyOfIllnesses, treatmentHistory: animal.treatmentHistory});
  }

  getAllFarms(){
    this.user = this.injectAuthService().getUserLogged();
    return this.firestore.collection(this.PATHFarm, ref => ref.where('uid', '==', this.user.uid)).snapshotChanges();
  }

  getAllAnimalsByFarm(farmId: string) {
    this.user = this.injectAuthService().getUserLogged();
    return this.firestore.collection(this.PATHAnimal, ref => ref.where('uid', '==', this.user.uid).where('farmId', '==', farmId)).snapshotChanges();
  }

  generateId() {
    return this.firestore.createId();
  }

  async generatePDF(animal: Animal): Promise<Blob>{
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Detalhes do animal', 10, 10);
    doc.setFontSize(12);
    const textWidth = 180;
    const wrapText = (text: string, width: number) => {
      return doc.splitTextToSize(text, width);
    };

    doc.text(`Nome do animal: ${animal.name}`, 10, 20);
    doc.text(`Espécie do animal: ${animal.species}`, 10, 30);
    doc.text(`Data de nascimento do animal: ${animal.birthDate}`, 10, 40);
    doc.text(`Numero de identificação: ${animal.number}`, 10, 50);
    doc.text(`Histórico de doenças:`, 10, 60);
    const illnessText = wrapText(animal.historyOfIllnesses, textWidth);
    doc.text(illnessText, 10, 70);
    const newYPosition = 70 + (illnessText.length * 10);
    doc.text(`Histórico de tratamentos:`, 10, newYPosition + 10);
    const treatmentText = wrapText(animal.treatmentHistory, textWidth);
    doc.text(treatmentText, 10, newYPosition + 20);
    return new Promise((resolve) => {
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    });
  }

  async uploadPDF(animal: Animal): Promise<string>{
    const pdfBlob = await this.generatePDF(animal);
    const pdfPath = `animals/${animal.name}_${new Date().getTime()}.pdf`;
    const task = this.storage.upload(pdfPath, pdfBlob);

    return new Promise((resolve, reject) => {
      task.snapshotChanges().subscribe({
        next: (snapshot) => {
          if (snapshot && snapshot.state === 'success'){
            snapshot.ref.getDownloadURL().then(resolve).catch(reject);
          }
        },
        error: reject,
      });
    });
  }
}