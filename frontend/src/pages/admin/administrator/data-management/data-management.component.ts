import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { saveAs } from 'file-saver';
import { Component, OnInit, inject } from '@angular/core';
import { NavBarComponent } from '../../components/admin-nav-bar/admin-nav-bar.component';
import { NgClass, NgFor } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SidebarDataService } from '../../../../services/sidebar-data.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-data-management',
  standalone: true,
  providers: [MessageService],
  imports: [FormsModule, NavBarComponent, SidebarComponent, NgClass,NgFor, HttpClientModule, ButtonModule, ToastModule],
  templateUrl: './data-management.component.html',
})
export class DataManagementComponent implements OnInit {
  //headers
  headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
  isOpen = true;
  sidebarItems  = [];
  table:string = '';
  tables:string[] = [];
  selectedFile: File | null = null;

// services
sidebarDataService: SidebarDataService = inject(SidebarDataService);

// constructor
constructor(private http: HttpClient, private messageService: MessageService){
  this.sidebarItems = this.sidebarDataService.getSideBarData('admin', false, false);
}

ngOnInit(): void {
  this.getTables();
}

// import
onFileChange(event: any) {
  this.selectedFile = event.target.files[0];
  console.log(this.selectedFile);
}
import(){
  if(this.selectedFile && this.table){
    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile);
    this.http.post<any>(`http://127.0.0.1:8000/api/import/${this.table}`,formData).
    subscribe({
      next: (data:any) => this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message }),
      error: (err:any)=> this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.error.message })
    }
    )
  }
}
getTables(){
  this.http.get('http://127.0.0.1:8000/api/getTables').subscribe(
    (data:any) => {
      this.tables = data;
    }
  )
}

exportData(){
  this.http.get('http://127.0.0.1:8000/api/export', { responseType: 'blob' }).subscribe(
    data => {
      saveAs(data, 'gestion-stages-DB.zip')
    },
    (error) => {
      console.log(error)
    }
  )
}

}
