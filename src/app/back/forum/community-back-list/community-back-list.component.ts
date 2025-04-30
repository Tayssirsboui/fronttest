import { Component, OnInit } from '@angular/core';
import { CommunityService } from 'src/app/services/community.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'src/app/services/confirmation.service'; // Pour confirmation avant suppression
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { end, start } from '@popperjs/core';

@Component({
  selector: 'app-community-back-list',
  templateUrl: './community-back-list.component.html',
  styleUrls: ['./community-back-list.component.css']
})
export class CommunityBackListComponent implements OnInit {
  communities: any[] = [];
  filteredCommunities: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 8;
  totalCommunities: number = 0;

  constructor(
    private communityService: CommunityService,
    private router: Router,
    private confirmationService: ConfirmationService // Service pour confirmer la suppression
  ) {}
  downloadPageAsPDF(event: Event): void {
    event.preventDefault();
    const pageElement = document.getElementById('admin-page');
    if (pageElement) {
      html2canvas(pageElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('admin-page.pdf');
      });
    }
  }

  ngOnInit(): void {
    this.communityService.getAllCommunities().subscribe({
      next: (data) => {
        this.communities = data;
        this.totalCommunities = data.length;
        this.updateFilteredCommunities(); // Initialise les communautés filtrées avec toutes les communautés
      },
      error: (err) => console.error('Erreur de récupération des communautés', err)
    });
  }

  updateFilteredCommunities(): void {
    if (!this.communities) {
      this.filteredCommunities = [];
      this.totalCommunities = 0;
      return;
    }
  
    let communitiesToDisplay = [...this.communities]; // on copie bien
  
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      communitiesToDisplay = communitiesToDisplay.filter(c =>
        c.name?.toLowerCase().includes(term)
      );
    }

    const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
    this.filteredCommunities = communitiesToDisplay.slice(start, end);
    this.totalCommunities = communitiesToDisplay.length;
 
  }
    

  onSearchChange(): void {
    // Réinitialiser à la première page lors d'une nouvelle recherche
    this.currentPage = 1;
    this.updateFilteredCommunities();
  }

  goToCommunity(id: number) {
    this.router.navigate(['/community', id]);
  }

  createCommunity() {
    this.router.navigate(['/create-community']);
  }

  editCommunity(id: number) {
    this.router.navigate([`/admin/edit-community/${id}`]);
  }

  deleteCommunity(id: number) {
    // Confirmation avant suppression
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette communauté ?',
      accept: () => {
        this.communityService.deleteCommunity(id).subscribe({
          next: () => {
            this.communities = this.communities.filter(c => c.id !== id);
            this.updateFilteredCommunities(); // Met à jour la liste après suppression
          },
          error: (err) => console.error('Erreur lors de la suppression de la communauté', err)
        });
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updateFilteredCommunities();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredCommunities();
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalCommunities / this.pageSize);
  }
  goToReportedPosts(): void {
    this.router.navigate(['back/admin/reported-posts']);
  }
  
}
