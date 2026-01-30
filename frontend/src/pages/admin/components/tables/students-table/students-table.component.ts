import { ToastModule } from 'primeng/toast';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';



interface Student {
  idEtudiant: number;
  idStage: number;
  dateNaissance: Date;
  filiere: string;
  niveauEtude: string;
  cne:string;
  specialite: string;
  utilisateur: {
    nom: string;
    prenom: string;
    numTel: string;
    email: string;
  };
}

@Component({
  selector: 'app-students-table',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [RouterLink,FormsModule, DialogModule, HttpClientModule, ConfirmDialogModule ,ToastModule, NgxPaginationModule, NgIf, NgFor, FormsModule, NgxPaginationModule],
  templateUrl: './students-table.component.html'
})
export class StudentsTableComponent implements OnInit {

  membershipStatus: { [key: number]: boolean } = {};

  students: any = [];
  selectedStudent: any;
  filiere:string = '';
  query:string = '';
  uniqueFilieres: string[] = [];

  //services
  ConfirmationService: ConfirmationService = inject(ConfirmationService );
  MessageService :  MessageService = inject( MessageService);

  // pagination
  page: number = 1;
  totalLength: any;

  // constructor
  constructor(private http: HttpClient){
  }

  //ngonit
  ngOnInit(): void{
    this.getStudents();
    this.getFeliers();
  }

  //functions
  getStudents(){
    this.http.get<Student[]>(`http://127.0.0.1:8000/api/etudiants/search?query=${this.query}&filiere=${this.filiere}`)
    .subscribe((data) => {
      this.students = data;
      this.students.forEach((teacher : Student)=> {
        this.checkMemberStatus(teacher.idEtudiant);
      });
    })
  }
  getFeliers(){
    this.http.get<any>("http://127.0.0.1:8000/api/etudiants/filieres")
      .subscribe((data) => {
        this.uniqueFilieres = data;
      })
  }

  disaffecter(id: number): void{
    this.ConfirmationService.confirm({
      header: "Êtes-vous sûr(e)?",
      message: "Veuillez confirmer pour continuer",
      accept: () => {
        this.http.delete(`http://127.0.0.1:8000/api/dissafecterEtudiant/${id}`)
        .subscribe({
          next: (res:any) => {
            this.MessageService.add({severity: 'success',summary: "Succès", detail: res.message});
            this.getStudents();
          },
          error: (err:any) => this.MessageService.add({severity: 'error',summary: "Erreur", detail: err.error.message})
        });
      }
    });
    this.getStudents();
  }

  checkMemberStatus(id: number) {
    this.http.get<any>(`http://127.0.0.1:8000/api/etudiant/isIntern/${id}`).subscribe(
      res => {
        this.membershipStatus[id] = res.status;
      },
      error => {
        console.error('Error fetching member status:', error);
        this.membershipStatus[id] = false;
      }
    );
  }

}
