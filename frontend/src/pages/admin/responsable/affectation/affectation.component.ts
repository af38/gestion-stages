import { FormsModule } from '@angular/forms';
import { Component, OnInit, inject } from '@angular/core';

import { CommonModule, DOCUMENT, NgClass, NgFor } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import { ToastModule } from 'primeng/toast';

import { SidebarDataService } from '../../../../services/sidebar-data.service';
import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { AuthService } from '../../../../services/auth.service';
import { NavBarComponent } from '../../components/admin-nav-bar/admin-nav-bar.component';


@Component({
  selector: 'app-affectation',
  standalone: true,
  imports: [
    NgFor, NgxPaginationModule, CommonModule,
    NavBarComponent, FormsModule,
    NgClass, ToastModule,
    SidebarComponent, FormsModule,
    HttpClientModule, ButtonModule, StepperModule
    ],
  providers: [MessageService],
  styles: [".p-stepper {flex-basis: 50rem;}"],
  templateUrl: './affectation.component.html',
  styleUrl: './affectation.component.css'
})
export class AffectationComponent implements OnInit{

  logedUser:any;

  stageIsSelected: boolean = false;

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  //services
  MessageService :  MessageService = inject( MessageService);
  sidebarDataService: SidebarDataService = inject(SidebarDataService);
  authservice: AuthService = inject(AuthService);

  idStage: Number = 0;
  idEnseignant: Number = 0;
  nombreStagairesPossible : number = 0;

  isOpen: boolean = true;
  //ngmodel variables
  selectedStageRadio:any;
  selectedTeacherRadio:number = 0;

  stages: any;
  teachers: any;
  organismes: any;
  students: any;

  selectedStage: any;
  selectedStudents: any[] = [];
  selectedTeacher: any;

  sidebarItems:any = [];
  departements: string[] = [];
  uniqueFilieres: string[] = [];
  query: string = '';
  search_organisme: number = 0;
  filiere: string = '';
  student_query: string = '';
  teacher_query: string = '';
  d: string = ''; //separtement

  // pagination
  page: number = 1;
  page1: number = 1;
  page2: number = 1;
  totalLength: any;

  ngOnInit(): void {
    this.getAllStages();
    this.getAllStudents();
    this.getAllTeachers();
    this.getAllOrganismes();
    this.getDepartemetns();
    this.getFeliers();
  }

  // constructor
  document: Document = inject(DOCUMENT);
  loggeduser:any;
  constructor(private http: HttpClient){
    this.sidebarItems = this.sidebarDataService.getSideBarData('resp', false, false);

    const localStorage = this.document.defaultView?.localStorage;
    if(localStorage){
      const storedUser = localStorage.getItem('user');
      this.loggeduser = storedUser ? JSON.parse(storedUser) : null;
    }
  }

  // for stages selections
  selectStage(stage: any){
    this.selectedStage = stage;
    this.idStage = stage.idStage;


    console.log(this.idStage);
    this.http.get(`http://127.0.0.1:8000/api/getAuthStagairesNumber/${stage.idStage}`)
    .subscribe((data:any) => {
      this.nombreStagairesPossible = data;
    })
  }

  isStageSelected(stage: any) : boolean{
    return this.selectedStage === stage;
  }

  // for student selection
  toggleRowSelection(row: any) {
    if (this.isSelectedStudent(row)) {
      this.selectedStudents = this.selectedStudents.filter(r => r !== row);
    } else {
      this.selectedStudents.push(row);
    }
    if(this.selectedStudents.length > this.nombreStagairesPossible){
      this.MessageService.add({
        severity: 'error',summary: "erreur", detail: 'Le nombre de stagiaires possible pour le stage sélectionné est dépassé.'
      })
    }
    console.log(this.selectedStudents.map(e => e.idEtudiant));
  }

  isSelectedStudent(row: any): boolean {
    return this.selectedStudents.includes(row);
  }
  isAnyStudentSelected(){
    if( this.selectedStudents.length > this.nombreStagairesPossible){
      return false;
    }
    return this.selectedStudents.length>0;
  }

  //for teacher selection

  selectRowTeacher(teacher: any){
    this.idEnseignant = teacher.idEnseignant;
    console.log(this.idEnseignant);
  }

  isSelectedTeacher(row: any) : boolean{
    return this.selectedTeacher === row;
  }


  // get stages
  getAllStages(){
    this.http.get(`http://127.0.0.1:8000/api/stages/search?query=${this.query}&organisme=${this.search_organisme}`)
    .subscribe((data) => {
      this.stages = data;
    })
    console.log(this.stages);
  }


  // get organismes
  getAllOrganismes(){
    this.http.get("http://127.0.0.1:8000/api/organisme")
    .subscribe((data) => {
      this.organismes = data;
    })
  }

  //get students
  getAllStudents(){
    this.http.get<any>(`http://127.0.0.1:8000/api/etudiants/search?query=${this.student_query}&filiere=${this.filiere}&resp=${true}`, {headers: this.headers})
      .subscribe((data) => {
        this.students = data;
      })
  }

  getFeliers(){
    this.http.get<any>("http://127.0.0.1:8000/api/etudiants/filieres", {headers: this.headers})
      .subscribe((data) => {
        this.uniqueFilieres = data;
      })
  }

  //get teachers
  getAllTeachers(){
    this.http.get<any>(`http://127.0.0.1:8000/api/enseignant/search?query=${this.teacher_query}&d=${this.d}`, {headers: this.headers})
      .subscribe((data) => {
        this.teachers = data;
    })
  }

  getDepartemetns(){
    // http://127.0.0.1:8000/api/enseignantt/departements
    this.http.get<any>("http://127.0.0.1:8000/api/enseignantt/departements", {headers: this.headers})
      .subscribe((data) => {
        this.departements = data;
    })
  }

  affecter(){
    let data = {
      idStage: this.idStage,
      idEnseignant: this.idEnseignant,
      students: this.selectedStudents.map(e => e.idEtudiant)
    }
    console.log(data);

    this.http.post("http://127.0.0.1:8000/api/affectation", data, {headers: this.headers})
      .subscribe({
        next: (res:any) => this.MessageService.add({severity: 'success',summary: "succès", detail: res.message}),
        error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
      });
  }




}
