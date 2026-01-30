import { TagModule } from 'primeng/tag';
import { Component, OnInit, inject } from '@angular/core';
import { SidebarComponent } from '../../admin/components/sidebar/sidebar.component';
import { NgClass, NgFor, CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { DialogModule } from 'primeng/dialog';

import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { SidebarDataService } from '../../../services/sidebar-data.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { NavBarComponent } from '../../admin/components/admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-stages-proposes',
  standalone: true,
  providers:[MessageService],
  imports: [HttpClientModule,TagModule, ToastModule, DialogModule,CommonModule, NavBarComponent, SidebarComponent, NgClass, NgxPaginationModule, NgFor, ButtonModule],
  templateUrl: './stages-proposes.component.html'
})
export class StagesProposesComponent implements OnInit {

  //http header
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  //services
  MessageService :  MessageService = inject( MessageService);
  sidebarDataService: SidebarDataService = inject(SidebarDataService);

  isOpen: boolean = true;

  //pagination
  page: number = 1;
  totalLength: any;

  selectedStage: any;
  selectedStudent: any;
  selectedOrganisme: any;

  //view modal
  stage_view: boolean = false;
  student_view: boolean = false;
  organisme_view: boolean = false;

  stages: any = [];
  loggeduser:any;

  // sidebar items
  sidebarItems  = [];


  //ngonit
  ngOnInit(){
    this.getAllProposedStages();
  }

  //constructor

  constructor(private http: HttpClient){
    this.sidebarItems = this.sidebarDataService.getSideBarData('teacher', false, true);
  }

  getAllProposedStages(){
    this.http.get("http://127.0.0.1:8000/api/deposer")
    .subscribe((data) => {
      this.stages = data;
    })
  }

  showStudent(student: any){
    this.selectedStudent = student;
    this.student_view = true;
  }
  showStage(stage: any){
    this.selectedStage = stage
    this.stage_view = true;
  }
  showOrganime(organisme: any){
    this.selectedOrganisme = organisme;
    this.organisme_view = true;
  }

  //accepter stage
  accepter(stage: any){
    this.http.get(`http://127.0.0.1:8000/api/deposee/accept?idEtudiant=${stage.depose.idEtudiant}&idStage=${stage.idStage}`)
    .subscribe({
      next: (res:any) => {
        this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
        this.getAllProposedStages();
      },
      error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
    }
    )
  }
  //refuser stage
  refuser(stage: any){
    this.http.get(`http://127.0.0.1:8000/api/deposee/refuse?idEtudiant=${stage.depose.idEtudiant}&idStage=${stage.idStage}`)
    .subscribe({
      next: (res:any) => {
        this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
        this.getAllProposedStages();
    },
      error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
    })
  }

}
