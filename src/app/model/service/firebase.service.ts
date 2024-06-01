import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Farm } from '../entities/farm';
import { Animal } from '../entities/Animal';
import jsPDF from 'jspdf';
import { user } from '../entities/user';

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
    return this.firestore.collection(this.PATHFarm).add({farmName: farm.farmName, location: farm.location, uid: farm.uid, farmId: farm.id});
  }

  registerAnimal(animal: Animal){
    return this.firestore.collection(this.PATHAnimal).add({name: animal.name, species: animal.species, birthDate: animal.birthDate, uid: animal.uid, farmId: animal.id, number: animal.number, historyOfIllnesses: animal.historyOfIllnesses, treatmentHistory: animal.treatmentHistory, life: animal.life});
  }

  editAnimal(animal: Animal, id: string){
    return this.firestore.collection(this.PATHAnimal).doc(id).update({name: animal.name, species: animal.species, birthDate: animal.birthDate, uid: animal.uid, farmId: animal.farmId, number: animal.number, historyOfIllnesses: animal.historyOfIllnesses, treatmentHistory: animal.treatmentHistory, life: animal.life});
  }

  getAllFarms(){
    this.user = this.injectAuthService().getUserLogged();
    return this.firestore.collection(this.PATHFarm, ref => ref.where('uid', '==', this.user.uid)).snapshotChanges();
  }

  getAllAnimalsByFarm(farmId: string) {
    this.user = this.injectAuthService().getUserLogged();
    return this.firestore.collection(this.PATHAnimal, ref => ref.where('uid', '==', this.user.uid).where('farmId', '==', farmId).where('life', '==', true)).snapshotChanges();
  }

  getAllAnimalsDeathByFarm(farmId: string) {
    this.user = this.injectAuthService().getUserLogged();
    return this.firestore.collection(this.PATHAnimal, ref => ref.where('uid', '==', this.user.uid).where('farmId', '==', farmId).where('life', '==', false)).snapshotChanges();
  }

  deleteAnimal(id: string){
    return this.firestore.collection(this.PATHAnimal).doc(id).delete();
  }
  
  deleteFarm(id: string) {
    return this.firestore.collection(this.PATHFarm).doc(id).delete()
  }

  generateId() {
    return this.firestore.createId();
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
    const farmDoc = await this.firestore.collection(this.PATHFarm, ref => ref.where('id', '==', animal.farmId)).get().toPromise();
  
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
  
    doc.setFontSize(16);
    doc.text('Informações do Perfil', 10, 10);
    doc.setFontSize(12);
    doc.text(`Nome: ${user.name}`, 10, 20);
    doc.text(`Email: ${user.email}`, 10, 30);
    doc.text(`Telefone: ${user.number}`, 10, 40);
  
    doc.setFontSize(16);
    doc.text('Informações da Fazenda', 10, 50);
    doc.setFontSize(12);
    doc.text(`Nome da Fazenda: ${farm.farmName}`, 10, 60);
    doc.text(`Localização: ${farm.location}`, 10, 70);
  
    doc.setFontSize(16);
    doc.text('Detalhes do Animal', 10, 90);
    doc.setFontSize(12);
    const textWidth = 180;
    const wrapText = (text: string, width: number) => {
      return doc.splitTextToSize(text, width);
    };
  
    doc.text(`Nome do animal: ${animal.name}`, 10, 100);
    doc.text(`Espécie do animal: ${animal.species}`, 10, 110);
    doc.text(`Data de nascimento do animal: ${animal.birthDate}`, 10, 120);
    doc.text(`Número de identificação: ${animal.number}`, 10, 130);
    doc.text(`Estado do animal: ${animal.life ? 'Vivo' : 'Morto'}`, 10, 140);
    doc.text(`Histórico de doenças:`, 10, 150);
    const illnessText = wrapText(animal.historyOfIllnesses, textWidth);
    doc.text(illnessText, 10, 160);
    const newYPosition = 160 + (illnessText.length * 10);
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