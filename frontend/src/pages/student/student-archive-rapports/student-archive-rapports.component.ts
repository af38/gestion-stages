import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../admin/components/sidebar/sidebar.component';
import { NgClass, NgFor } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SidebarDataService } from '../../../services/sidebar-data.service';
import { HttpHeaders, HttpClientModule, HttpClient } from '@angular/common/http';
import { NavBarComponent } from '../../admin/components/admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-student-archive-rapports',
  standalone: true,
  imports: [FormsModule, HttpClientModule, SidebarComponent, NavBarComponent, NgFor, NgxPaginationModule, NgClass],
  templateUrl: './student-archive-rapports.component.html'
})
export class StudentArchiveRapportsComponent {

  // http header
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  //services
  sidebarDataService: SidebarDataService = inject(SidebarDataService);

  isOpen: boolean = true;
  sidebarItems  = [];
  query:string = '';
  keyword:string = '';
  rapports:any;
  isIntern:boolean = false;
  loggeduser:any;

  //pagination
  page: number = 1;
  totalLength: any;

  //constructor
  constructor(private http: HttpClient){
  }
  getUser(){
    if(localStorage){
      const storedUser = localStorage.getItem('user');
      this.loggeduser = storedUser ? JSON.parse(storedUser) : null;
    }else{
      console.log('loclastorhs')
    }
  }
  ngOnInit(): void {
    this.getUser();
    this.isInternfun();
    this.getAllRapports();
 }
  //get all rapports
  getAllRapports(){
    this.http.get<any>(`http://127.0.0.1:8000/api/rapportes/search?query=${this.query}&keyword=${this.keyword}`, {headers: this.headers})
    .subscribe((data) => {
      this.rapports = data;
    })
  }

  isInternfun():void{
    this.http.get<any>(`http://127.0.0.1:8000/api/etudiant/isIntern/${this.loggeduser.idUser}`, {headers: this.headers})
    .subscribe((data:any) => {
      this.isIntern = data.status;
      this.sidebarItems = this.sidebarDataService.getSideBarData('student', this.isIntern, false);
    })
  }
}
