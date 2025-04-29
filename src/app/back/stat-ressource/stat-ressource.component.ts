
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartOptions, ChartData } from 'chart.js';

// Importez le module ChartsModule ici
import { NgChartsModule } from 'ng2-charts';
@Component({
  selector: 'app-stat-ressource',
  templateUrl: './stat-ressource.component.html',
  styleUrls: ['./stat-ressource.component.css']
})
export class StatRessourceComponent {
 
  public chartData: ChartData<'bar'> = {
    datasets: [],  // Initialisation vide des datasets
    labels: []     // Initialisation vide des labels
  };
  public chartOptions: ChartOptions = {
    responsive: true,
  };
  public chartLegend = true;
  public chartType: 'bar' = 'bar';  // Spécifier le type de graphique (bar, line, etc.)

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:5010/ressources/resource-stats').subscribe(data => {
      this.chartData = {
        datasets: [
          { data: data.views, label: "Fréquence d'achat" },
          { data: data.likes, label: 'Evaluation' },
          { data: data.comments, label: 'Commentaires' }
        ],
        labels: data.labels  // Les labels (Ressource 1, Ressource 2, etc.)
      };
    });
  }

}
