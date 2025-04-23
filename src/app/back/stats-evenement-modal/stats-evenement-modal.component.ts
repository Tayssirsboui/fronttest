import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParticipationService } from 'src/app/services/participation.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-stats-evenement-modal',
  templateUrl: './stats-evenement-modal.component.html'
})
export class StatsEvenementModalComponent implements OnInit {
  nbInscrits: number = 0;
  nbMax: number = 0;
  taux: number = 0;

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Participants', 'Places restantes'],
    datasets: [
      {
        data: [0, 0],
        label: 'Répartition',
        backgroundColor: ['#2196f3', '#e0e0e0'] // bleu + gris
      }
    ]
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#333',
          font: {
            size: 13,
            weight: 'bold'
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#555',
          stepSize: 1,
          font: {
            size: 12,
            weight: 'normal'
          }
        },
        grid: {
          color: '#e0e0e0',
          display: true
        }
      }
    }
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { evenementId: number; nbMax: number },
    private participationService: ParticipationService
  ) {}

  ngOnInit(): void {
    this.nbMax = this.data.nbMax;

    this.participationService.countByEvent(this.data.evenementId).subscribe(nb => {
      this.nbInscrits = nb;
      this.taux = this.nbMax > 0 ? Math.round((nb / this.nbMax) * 100) : 0;

      const placesRestantes = this.nbMax - nb;
      this.chartData.datasets[0].data = [nb, placesRestantes];
    });
  }
}
