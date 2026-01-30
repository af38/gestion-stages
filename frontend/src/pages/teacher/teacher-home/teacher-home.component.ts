import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { SidebarComponent } from '../../admin/components/sidebar/sidebar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { SidebarDataService } from '../../../services/sidebar-data.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { NavBarComponent } from '../../admin/components/admin-nav-bar/admin-nav-bar.component';


@Component({
  selector: 'app-teacher-home',
  standalone: true,
  providers: [MessageService],
  imports: [FormsModule ,NgFor, ToastModule,CommonModule, SidebarComponent, NavBarComponent, NgClass,DialogModule, NgxPaginationModule, ReactiveFormsModule, HttpClientModule, ButtonModule],
  templateUrl: './teacher-home.component.html'
})
export class TeacherHomeComponent implements OnInit{

  isOpen: boolean = true;
  isSubmitted: boolean = false;
  isMember:boolean = false;

  // pagination
  page: number = 1;
  totalLength: any;

  sidebarItems  = [];

  // student list
  students: any = [];
  stages: any = [];

  //modals
  // modal visibility
  visible_view: boolean = false;
  visible_reclamation: boolean = false;
  visible_seance: boolean = false;
  visible_note:boolean = false;

  // selected student
  selectedStudent: any = null;

  selectedStageId: Number = 0;

  //header
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  //services
  sidebarDataService: SidebarDataService = inject(SidebarDataService);
  MessageService :  MessageService = inject( MessageService);

  loggeduser:any;

  constructor(private fb: FormBuilder, private http: HttpClient){
  }

  getUser(){
    if(localStorage){
      const storedUser = localStorage.getItem('user');
      this.loggeduser = storedUser ? JSON.parse(storedUser) : null;
    }else{
      console.log('loclastorhs')
    }
    console.log(this.loggeduser);
  }

  isMemberfun() : void{
    // 76 to be changed
    this.http.get(`http://127.0.0.1:8000/api/enseignant/isMember/${this.loggeduser.idUser}`)
    .subscribe((data:any) => {
      this.isMember = data.status;
      this.sidebarItems = this.sidebarDataService.getSideBarData('teacher', false, this.isMember);
    })
  }

  // create reclamation function
  create(event: Event){
    event.preventDefault();
    this.formGroup.get('idEtudiant')?.setValue(this.selectedStudent.idEtudiant);
    this.formGroup.get('idEnseignant')?.setValue(this.loggeduser.idUser);

    this.http.post<any>("http://127.0.0.1:8000/api/reclamation", JSON.stringify(this.formGroup.value), {headers: this.headers})
    .subscribe({
      next: (res:any) => {
        this.MessageService.add({severity: 'success',summary: "Success", detail: res.message});
        this.formGroup.reset();
        this.isSubmitted = false;
        this.visible_reclamation = false;
      },
      error: (err:any) => {
        this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message});
        this.formGroup.reset();
        this.isSubmitted = false;
      }});
    this.isSubmitted = true;
  }

  // create seance d'incadrement function
  planifier(event: Event){
    event.preventDefault();
    this.seanceFormGroup.get('idEtudiant')?.setValue(this.selectedStudent.idEtudiant);
    this.seanceFormGroup.get('idEnseignant')?.setValue(this.loggeduser.idUser);
    console.log(this.seanceFormGroup.value);
    this.http.post<any>("http://127.0.0.1:8000/api/seance", JSON.stringify(this.seanceFormGroup.value), {headers: this.headers})
    .subscribe({
      next: (res:any) => {
        this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
        this.formGroup.reset();
        this.isSubmitted = false;
        this.visible_reclamation = false;
      },
      error: (err:any) => {
        this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message});
        this.formGroup.reset();
        this.isSubmitted = false;
      }});
    this.isSubmitted = true;
    this.visible_seance = false;
  }

  //ngOnInit function
  ngOnInit(){
    this.getUser();
    this.isMemberfun();
    console.log(this.isMember);
    this.getStages();
    this.getStudentsByStage();
  }

  // get stages of teacher
  getStages(){
    // to be changed
    this.http.get(`http://127.0.0.1:8000/api/enseignantStages/${this.loggeduser.idUser}`)
    .subscribe((data) => {
      this.stages = data;
    })
  }

  // get students by stage
  getStudentsByStage(){
    console.log(this.selectedStageId);
    if(this.selectedStageId !== 0){
      this.http.get(`http://127.0.0.1:8000/api/etudiantsparstage/${this.selectedStageId}`)
      .subscribe((data) => {
        this.students = data;
      })
    }
  }

  setNote(e: Event){
    e.preventDefault();
    this.http.post<any>(`http://127.0.0.1:8000/api/teacher/setnote?idEtudiant=${this.selectedStudent.idEtudiant}&idStage=${this.selectedStageId}`, JSON.stringify(this.noteGroup.value), {headers: this.headers})
    .subscribe({
      next: (res:any) => {
        this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
        this.visible_note = false;
      },
      error: (err:any) => this.MessageService.add({severity: 'success',summary: "erreur", detail: err.error.message})
    })
  }
  showNote(student: any){
    this.selectedStudent = student;
    this.visible_note = true;
  }

  showDialogView(student: any){
    this.selectedStudent = student;
    this.visible_view = true;
  }
  showDialogReclamation(student: any){
    this.selectedStudent = student;
    this.visible_reclamation = true;
  }
  showDialogSeance(student: any){
    this.selectedStudent = student;
    this.visible_seance= true;
  }

  // form Validation
  formGroup: FormGroup = this.fb.group({
    objet: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    description: [''],
    idEtudiant: [this.selectedStudent?.idEtudiant],
    idEnseignant: [0] //to be changed
  });

  noteGroup: FormGroup = this.fb.group({
    note: ['', Validators.required,],
  });


  seanceFormGroup: FormGroup = this.fb.group({
    dateSeance: ['', Validators.required],
    heureSeance: ['', Validators.required],
    idEtudiant: [this.selectedStudent?.idEtudiant],
    idEnseignant: [0] //to be changed
  });

  // isInvalid function to add error classes
  isInvalid(controlName: string){
    const control = this.formGroup?.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched || this.isSubmitted);
  }

  // getError function
  getError(controlName: string): string | null{
    const control = this.formGroup?.get(controlName);
    const errors = control?.errors as ValidationErrors | null;
    if(errors && (control?.dirty || control?.touched || this.isSubmitted)){
      if(errors['required']){
        return 'ce champe est requise';
      }
    }
    return null;
  }

}
