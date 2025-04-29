import { Component } from '@angular/core';
import { StageService, Stage } from '../../../services/stage.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // ✅

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.css']
})
export class StagesComponent {
  stages: Stage[] = [];
  isLoading = true;
  expandedId: number | null = null;
  searchQuery: string = '';
  filteredStages: Stage[] = [];

  showMapModal = false; 
  mapUrl!: SafeResourceUrl; // ✅ au lieu de googleMapsUrl

  constructor(
    private stageService: StageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.stageService.getAllStages().subscribe({
      next: (data) => {
        this.stages = data;
        this.filteredStages = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching stages', err);
        this.isLoading = false;
      }
    });
  }

  toggleDetails(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  filterStages(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredStages = this.stages.filter(stage =>
      stage.type.toLowerCase().includes(query) ||
      stage.domaine.toLowerCase().includes(query) ||
      stage.entreprise.toLowerCase().includes(query)
    );
  }

  afficherMap(entreprise: string): void { // ✅ version moderne
    const encoded = encodeURIComponent(entreprise);
    const url = `https://www.google.com/maps?q=${encoded}&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.showMapModal = true;
  }

  closeMapModal(): void {
    this.showMapModal = false;
  }
}
