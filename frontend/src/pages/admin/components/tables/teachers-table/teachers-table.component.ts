import { ToastModule } from 'primeng/toast';
import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';


interface Teacher {
  idEnseignant: number;
  utilisateur: {
    nom: string;
    prenom: string;
    numTel: string;
    email: string;
  };
  departement: string;
}

@Component({
  selector: 'app-teachers-table',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [NgxPaginationModule ,FormsModule, DialogModule, HttpClientModule, ConfirmDialogModule ,ToastModule, NgxPaginationModule, NgIf, NgFor, FormsModule],
  templateUrl: './teachers-table.component.html'
})
export class TeachersTableComponent {

  membershipStatus: { [key: number]: boolean } = {};

  //http header
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  //services
  ConfirmationService: ConfirmationService = inject(ConfirmationService );
  MessageService :  MessageService = inject( MessageService);

  // pagination
  page: number = 1;
  totalLength: any;

  teachers: any = [];
  visible_view: boolean = false;
  selectedTeacher: any;
  idCommission: number = 0;
  idCommissionDesafect: number = 0;
  commissions: any = [];
  teacherComms: any = [];
  query :string = '';
  d:string = '';
  departements: string[] = [];

  // constructor
  constructor(private http: HttpClient){

  }

  //ngonit
  ngOnInit(){
    this.getTeachers();
    this.getAllCommissions();
    this.getDepartemetns();
  }

  // functions
  affecter(teacher: any):void{
    this.selectedTeacher = teacher;
    this.visible_view = true;
  }

  affectation(){
    let data = {
      idCommission: this.idCommission,
      idEnseignant: this.selectedTeacher.idEnseignant
    }
    this.http.post<any>("http://127.0.0.1:8000/api/commission/rejoindre", JSON.stringify(data), {headers: this.headers})
    .subscribe({
      next: (res:any) => {
        this.MessageService.add({severity: 'success',summary: "Succès", detail: res.message});
        this.getAllCommissions();
      },
      error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
    })
  }

  disaffecter(teacher: any): void{
    this.getCommsByTeacher(teacher.idEnseignant);
    this.ConfirmationService.confirm({
      header: "Êtes-vous sûr(e)?",
      message: "Veuillez confirmer pour continuer",
      accept: () => {
        // teacher id is first
        this.http.delete(`http://127.0.0.1:8000/api/commission/disaffecter/${teacher.idEnseignant}`)
        .subscribe({
          next: (res:any) => {
            this.MessageService.add({severity: 'success',summary: "Succès", detail: res.message})
            this.getTeachers();
          },
          error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
        });}
    });
  }
  getTeachers(){
    this.http.get<Teacher[]>(`http://127.0.0.1:8000/api/enseignant/search?query=${this.query}&d=${this.d}`)
    .subscribe((data) => {
      this.teachers = data;
      this.teachers.forEach((teacher : Teacher)=> {
      this.checkMemberStatus(teacher.idEnseignant);
      });
    })
  }

  getAllCommissions(){
    this.http.get("http://127.0.0.1:8000/api/commission")
    .subscribe((data) => {
      this.commissions = data;
    })
  }
  isMember(id: number) : boolean{
    let status: boolean = false;
    this.http.get(`http://127.0.0.1:8000/api/enseignant/isMember/${id}`).subscribe(
      (res: any) => {
       status = res.status;
      }
    )
    return status;
  }
  getCommsByTeacher(id: number){
    this.http.get(`http://127.0.0.1:8000/api/commission/commByTeacher/${id}`)
    .subscribe((data) => {
      this.teacherComms = data;
    })
  }

  checkMemberStatus(id: number) {
    this.http.get<any>(`http://127.0.0.1:8000/api/enseignant/isMember/${id}`).subscribe(
      res => {
        this.membershipStatus[id] = res.status;
      },
      error => {
        console.error('Error fetching member status:', error);
        this.membershipStatus[id] = false;
      }
    );
  }
  getDepartemetns(){
    // http://127.0.0.1:8000/api/enseignantt/departements
    this.http.get<any>("http://127.0.0.1:8000/api/enseignantt/departements", {headers: this.headers})
      .subscribe((data) => {
        this.departements = data;
    })
  }
}
