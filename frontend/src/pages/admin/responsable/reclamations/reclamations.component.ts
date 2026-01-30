import { ButtonModule } from 'primeng/button';
import { Component, inject } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';

import { ChangeDetectorRef } from '@angular/core';
import { SidebarDataService } from '../../../../services/sidebar-data.service';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../components/admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-reclamations',
  standalone: true,
  imports: [FormsModule, HttpClientModule, DialogModule, ConfirmDialogModule,ButtonModule, ToastModule,TagModule ,NavBarComponent, SidebarComponent, NgClass, NgxPaginationModule, NgFor],
  providers: [ConfirmationService, MessageService],
  templateUrl: './reclamations.component.html'
})
export class ReclamationsComponent {

  isOpen: boolean = true;
  isSubmitted: boolean = false;

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  //services
  ConfirmationService: ConfirmationService = inject(ConfirmationService );
  MessageService :  MessageService = inject( MessageService);
  sidebarDataService: SidebarDataService = inject(SidebarDataService);

  // modal visibility
  visible_teacher: boolean = false;
  visible_student: boolean = false;
  reclamations:any;

  // pagination
  page: number = 1;
  totalLength: any;

  selectedReclamation: any;
  selectedStudent: any;
  selectedTeacher: any;

  sidebarItems  = [];
  query:string = '';
  etat:string = '';

  //constructor
  constructor(private http: HttpClient, private cdr :ChangeDetectorRef){
    this.sidebarItems =this.sidebarDataService.getSideBarData('resp', false, false);
  }

  //fonctions

  //ngonit
  ngOnInit(){
    this.getReclamations();
  }

  // get stages
  getReclamations(){
    this.http.get<any>(`http://127.0.0.1:8000/api/reclamations/search?query=${this.query}&etat=${this.etat}`, {headers: this.headers})
    .subscribe((data) => {
      this.reclamations = data;
    })
    // this.http.get<any>('http://127.0.0.1:8000/api/getRespReclamations', {headers: this.headers})

  }

  // get teacher
  getTeacher(teacher: any){
    this.selectedTeacher = teacher;
    this.visible_teacher = true;

  }
  // get student
  getStudent(student: any){
    this.selectedStudent = student;
    this.visible_student = true;
  }

  // changin reclamation etat
  review(id: number){
    let newEtat = {
      etat: "En cours"
    }
    this.http.put(`http://127.0.0.1:8000/api/reclamation/${id}`, JSON.stringify(newEtat), {headers: this.headers}).subscribe(
      res => {
        console.log("success")
      },
      error => {
        console.error("Error marking reclamation as 'En cours':", error);
      }
    )
    this.getReclamations();
  }
  checked(id: number){
    console.log(id);
    let newEtat = {
      etat: "Traitée"
    }
    this.http.put(`http://127.0.0.1:8000/api/reclamation/${id}`, JSON.stringify(newEtat), {headers: this.headers}).subscribe(
      res => {
        console.log("success")
      },
      error => {
        console.error("Error marking reclamation as 'Traitée':", error);
      }
    )
    this.getReclamations();
  }
  cancel(id: number){
    let newEtat = {
      etat: "Annulée"
    }
    this.http.put(`http://127.0.0.1:8000/api/reclamation/${id}`, JSON.stringify(newEtat), {headers: this.headers}).subscribe(
      res => {
        console.log("success")
      },
      error => {
        console.error("Error marking reclamation as 'Annulée':", error);
      }
    )
    this.getReclamations();
  }



}
