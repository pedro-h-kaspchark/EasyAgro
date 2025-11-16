import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/model/service/firebase.service';
import { AuthService } from 'src/app/model/service/auth.service';
import { loading } from 'src/app/common/loading';
import { Alert } from 'src/app/common/alert';
import { Router } from '@angular/router';
import { PDFGeneratorService } from 'src/app/model/service/pdf-generator.service';

@Component({
  selector: 'app-feeding-management-visualizer',
  templateUrl: './feeding-management-visualizer.page.html',
  styleUrls: ['./feeding-management-visualizer.page.scss'],
})
export class FeedingManagementVisualizerPage implements OnInit {
  feedings: any[] = [];
  farmId: string | null = null;
  user: any;

  constructor(private router: Router, private firebaseService: FirebaseService, private auth: AuthService, private loading: loading, private alert: Alert,  private pdf: PDFGeneratorService) {}

  ngOnInit() {
    this.user = this.auth.getUserLogged();
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;

    if (state && state.farm && state.farm.farmId) {
      this.farmId = state.farm.farmId;
      this.loadFeeding();
    } else {
      this.alert.presentAlert('Erro', 'Não foi possível identificar a fazenda.');
    }
  }
  async loadFeeding() {
  this.loading.showLoading(40);

  this.firebaseService.getFeedingsByFarm(this.user.uid, this.farmId!).subscribe({
    next: async (res) => {
      const feedingsRaw = res.map((feeding) => ({
        id: feeding.payload.doc.id,
        ...(feeding.payload.doc.data() as any),
      }));

      const feedingsResult = [];

      for (const feed of feedingsRaw) {
        const animalName = await this.firebaseService.getAnimalNameById(feed.animalId);
        const animalNumber = await this.firebaseService.getAnimalNumberById(feed.animalId);

        feedingsResult.push({
          ...feed,
          animalName: animalName || 'Animal não encontrado',
          animalNumber: animalNumber || '--',
        });
      }

      this.feedings = feedingsResult;
    },
    error: (err) => {
      console.error(err);
      this.alert.presentAlert('Erro', 'Falha ao carregar alimentações.');
    },
  });
}

  backFarmPage(){
    this.router.navigate(['/farm']);
  }

async exportFeedingsPDF() {
  if (!this.feedings || this.feedings.length === 0) {
    this.alert.presentAlert("Aviso", "Nenhuma alimentação disponível para gerar PDF.");
    return;
  }

  const navigation = this.router.getCurrentNavigation();
  const state: any = navigation?.extras?.state;

  const farmName = state?.['farm']?.farmName || "Fazenda";

  this.pdf.generateMonthlyReport(
    "Relatório de Alimentações",
    farmName,
    this.feedings,
    [
      { header: "Data", key: "date" },
      { header: "Tipo", key: "feedType" },
      { header: "Animal Nº", key: "animalNumber" },
      { header: "Quantidade", key: "amount" },
      { header: "Notas", key: "notes" }
    ],
    "date"
    );
  }
}
