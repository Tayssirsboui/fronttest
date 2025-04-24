
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BlogService } from 'src/app/services/blog.service';

@Component({
selector: 'app-stat-posts',
templateUrl: './stat-posts.component.html',
styleUrls: ['./stat-posts.component.css']
})
export class StatPostsComponent implements OnInit {
constructor(private blogService: BlogService) {}

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

dashboardStats: any[] = [];

chartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

chartData: ChartConfiguration<'bar'>['data'] = {
  labels: this.chartLabels,
  datasets: [
    {
      label: 'Posts per Month',
      data: Array(12).fill(0), // Initialiser avec 0
      backgroundColor: '#0d6efd',
      borderRadius: 6
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
    y: {
      beginAtZero: true
    }
  }
};


ngOnInit(): void {
  this.loadStats();
  this.loadPostsPerMonth();
}

loadStats() {
  this.blogService.getDashboardStats().subscribe(stats => {
    this.dashboardStats = [
      { label: 'Total Posts', value: stats.totalPosts, icon: 'bi bi-file-earmark-text' },
      { label: 'Total Comments', value: stats.totalComments, icon: 'bi bi-chat-dots' },
      { label: 'Active Authors', value: stats.activeAuthors, icon: 'bi bi-people' },
      { label: 'Most Liked Post', value: stats.mostLikedPost, icon: 'bi bi-heart-fill' }
    ];
  });
}

loadPostsPerMonth() {
  this.blogService.getPosts().subscribe(posts => {
    // Initialise un tableau avec 12 zéros (1 pour chaque mois)
    const monthlyCounts = Array(12).fill(0);

    posts.forEach(post => {
      if (post.createdAt) {
        const date = new Date(post.createdAt);
        const month = date.getMonth(); // 0 pour Janvier, 11 pour Décembre
        monthlyCounts[month]++;
      }
    });

    // Met à jour les données du graphique
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Posts per Month',
          data: monthlyCounts,
          backgroundColor: '#0d6efd',
          borderRadius: 6
        }
      ]
    };
  });
} downloadChartAsPNG(event: Event): void {
  event.preventDefault();
  const canvas = this.chartCanvas.nativeElement;
  html2canvas(canvas).then(canvas => {
    const link = document.createElement('a');
    link.download = 'statistics-chart.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

downloadChartAsJPEG(event: Event): void {
  event.preventDefault();
  const canvas = this.chartCanvas.nativeElement;
  html2canvas(canvas).then(canvas => {
    const link = document.createElement('a');
    link.download = 'statistics-chart.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  });
}

downloadChartAsPDF(event: Event): void {
  event.preventDefault();
  const canvas = this.chartCanvas.nativeElement;
  html2canvas(canvas).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('statistics-chart.pdf');
  });
}

downloadDataAsCSV(event: Event): void {
  event.preventDefault();
  const headers = ['Month', 'Value'];
  const data = this.chartData.labels?.map((label, index) => ({
    Month: label,
    Value: this.chartData.datasets[0].data[index]
  })) || [];

  let csv = headers.join(',') + '\n';
  data.forEach(row => {
    csv += `${row.Month},${row.Value}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'statistics-data.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


}