import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarDataService {

  constructor() { }

  protected teacherSideBarData: any[] = [
    { label: "page d'acueil", link: '/teacher-home', icon: 'pi-home'},
    { label: 'stages déposés', link: '/stages-deposes', icon: 'pi-briefcase' },
    { label: 'calendrier', link: '/calendrier', icon: 'pi-calendar' },
    { label: 'reclamation', link: '/teacher-reclamations', icon: 'pi-flag'}
  ];

  protected studentSideBarData: any[] = [
    { label: "page d'acueil", link: '/student-home', icon: 'pi-home'},
    { label: "déposer des stages", link: '/deposer-stage', icon: 'pi-briefcase'},
    { label: "rapports", link: '/rapports', icon: 'pi-folder'}
  ];

  protected adminSideBarData: any[] = [
    { label: 'comptes', link: '/create-accounts', icon: 'pi-users'},
    { label: 'Paramétrage', link: '/parametrage', icon: 'pi-info-circle' },
    { label: 'gere les donnes', link: '/gere-donnes', icon: 'pi-database'}
  ];

  protected respSideBarData: any[] = [
    { label: 'reclamations', link: '/reclamations', icon: 'pi-flag'},
    { label: 'affectation des etudiants', link: '/affectation', icon: ' pi-user-plus' },
    { label: "l'archive des rapports", link: '/archive-rapports', icon: 'pi-folder' },
    { label: 'les lists', link: '/lists', icon: 'pi pi-users'},
    { label: "organismes", link: '/organisations', icon: 'pi-building-columns' },
    { label: "les stages", link: '/stages', icon: 'pi-briefcase' },
    { label: "commissions", link: '/commissions', icon: 'pi-thumbs-up' }
  ];

  getSideBarData(type: string, isIntern:Boolean, isMember:boolean): any{
    let data: any;
    switch (type) {
      case 'admin':
        data = this.adminSideBarData;
        break;
      case 'resp':
        data = this.respSideBarData
        break;
      case 'student':
        data = isIntern ? this.studentSideBarData.filter(item => item.label !== "déposer des stages") : this.studentSideBarData;
          break;
      case 'teacher':
        data = isMember ?  this.teacherSideBarData : this.teacherSideBarData.filter(itesm => itesm.label !== 'stages déposés');
        break;
    }
    return data;
  }
}
