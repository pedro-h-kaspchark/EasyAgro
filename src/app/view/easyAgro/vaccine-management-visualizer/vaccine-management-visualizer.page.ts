import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/model/service/firebase.service';
import { AuthService } from 'src/app/model/service/auth.service';
import { loading } from 'src/app/common/loading';
import { Alert } from 'src/app/common/alert';
import { PDFGeneratorService } from 'src/app/model/service/pdf-generator.service';

@Component({
  selector: 'app-vaccine-management-visualizer',
  templateUrl: './vaccine-management-visualizer.page.html',
  styleUrls: ['./vaccine-management-visualizer.page.scss'],
})
export class VaccineManagementVisualizerPage implements OnInit {
  vaccines: any[] = [];
  farmId: string | null = null;
  user: any;

  constructor(private router: Router, private firebaseService: FirebaseService, private auth: AuthService, private loading: loading, private alert: Alert, private pdf: PDFGeneratorService) {}

  ngOnInit() {
    this.user = this.auth.getUserLogged();
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;

    if (state && state.farm && state.farm.farmId) {
      this.farmId = state.farm.farmId;
      this.loadVaccines();
    } else {
      this.alert.presentAlert('Erro', 'Não foi possível identificar a fazenda.');
    }
  }

  loadVaccines() {
  this.loading.showLoading(40);

  this.firebaseService.getVaccinesByFarm(this.user.uid, this.farmId!).subscribe({
    next: async (res) => {
      const vaccinesRaw = res.map((vaccine) => ({
        id: vaccine.payload.doc.id,
        ...(vaccine.payload.doc.data() as any),
      }));
      const vaccinesResult = [];
        for (const vac of vaccinesRaw) {
          const animalNumber = await this.firebaseService.getAnimalNumberById(vac.animalId);

          vaccinesResult.push({
            ...vac,
            animalNumber: animalNumber || '--'
          });
        }
      this.vaccines = vaccinesResult;
    },
    error: (err) => {
      console.error(err);
      this.alert.presentAlert('Erro', 'Falha ao carregar vacinas.');
    },
  });
}

  backFarmPage(){
    this.router.navigate(['/farm']);
  }

exportVaccinesPDF() {
  if (this.vaccines.length === 0) {
    this.alert.presentAlert("Aviso", "Nenhuma vacina encontrada.");
    return;
  }

  const state: any = this.router.getCurrentNavigation()?.extras?.state;
  const farmName = state?.['farm']?.farmName || "Fazenda";

  this.pdf.generateMonthlyReport(
    "Relatório de Vacinas",
    farmName,
    this.vaccines,
    [
      { header: "Data", key: "date" },
      { header: "Vacina", key: "name" },
      { header: "Animal Nº", key: "animalNumber" },
      { header: "Responsável", key: "administeredBy" },
      { header: "Notas", key: "notes" }
    ],
    "date"
    );
  }
}
