import { TagModule } from 'primeng/tag';
import { CommonModule, DOCUMENT, NgClass, NgFor } from '@angular/common';
import { SidebarDataService } from '../../../services/sidebar-data.service';
import { SidebarComponent } from './../../admin/components/sidebar/sidebar.component';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NavBarComponent } from '../../admin/components/admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [HttpClientModule, RouterLink,CommonModule ,NavBarComponent, SidebarComponent, NgClass, NgFor,TagModule],
  templateUrl: './student-home.component.html'
})
export class StudentHomeComponent implements OnInit{

  //logged student
  user:any;

  // services
  sidebarDataService: SidebarDataService = inject(SidebarDataService);
  authService: AuthService = inject(AuthService);

  isOpen: boolean = true;
  sidebarItems:any  = [];
  stage:any;
  student:any;
  historis: any;
  seances:any;
  isIntern:boolean = false;

  ngOnInit(): void {
    this.getUser();
    this.isInternfun();
    this.getStage();
    this.getHistory();
    this.getSeances();
  }

  //constructor
  document: Document = Inject(DOCUMENT);
  loggeduser:any;
  // user$ = this.authService.getUser().subscribe(res => this.loggeduser = res);

  constructor(private http: HttpClient){}

  getUser(){
    if(localStorage){
      const storedUser = localStorage.getItem('user');
      this.loggeduser = storedUser ? JSON.parse(storedUser) : null;
    }else{
      console.log('loclastorhs')
    }
  }

  isInternfun():void{
    this.http.get<any>(`http://127.0.0.1:8000/api/etudiant/isIntern/${this.loggeduser.idUser}`)
    .subscribe((data:any) => {
      this.isIntern = data.status;
      this.sidebarItems = this.sidebarDataService.getSideBarData('student', this.isIntern, false);
    })
  }

  // get stage
  getStage(){
    // 78 to be changes
    this.http.get<any>(`http://127.0.0.1:8000/api/stageparetudiantid/${this.loggeduser.idUser}`)
      .subscribe((data: any) => {
        this.stage = data.stage;
    })
    console.log(this.stage);
  }

  //get history
  getHistory(){
    // to be changed
    this.http.get<any>(`http://127.0.0.1:8000/api/etudiants/getHistory?id=${this.loggeduser.idUser}`)
    .subscribe((data: any) => {
      this.historis = data;
  });
  }

  getSeances(){
    this.http.get<any>(`http://127.0.0.1:8000/api/etudiant/seances/${this.loggeduser.idUser}`)
    .subscribe((data: any) => {
      this.seances = data;
  });
  }
}
