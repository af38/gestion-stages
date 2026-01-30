import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Input, OnInit, inject, Inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent  implements OnInit{

  document: Document = inject(DOCUMENT);
  user:any;

  constructor(){
    const localStorage = this.document.defaultView?.localStorage;
    if(localStorage){
      const storedUser = localStorage.getItem('user');
      this.user = storedUser ? JSON.parse(storedUser) : null;
    }

  }
  @Input() items: { label: string, link: string, icon: string}[] | undefined;
  @Input() isOpen: boolean = false;

  authservice: AuthService = inject(AuthService);


  logout():void {
    this.authservice.logout();
  }

  //ngonit
  ngOnInit(){

  }

}
