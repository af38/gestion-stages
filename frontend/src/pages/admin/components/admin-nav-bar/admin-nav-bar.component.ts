import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './admin-nav-bar.component.html'
})
export class NavBarComponent implements OnInit  {

  constructor(private http: HttpClient){
    this.getEtablissement();
  }

  ngOnInit(): void {
  }

  @Output() toggle = new EventEmitter<void>();
  etablissement: any;
  toggleSideBar(){
    this.toggle.emit();
  }

  getEtablissement(){
    this.http.get<any>("http://127.0.0.1:8000/api/etablissement")
    .subscribe({
      next: (res:any) => this.etablissement = res,
      error: err => console.log('error fetching data')
    });
  }

}
