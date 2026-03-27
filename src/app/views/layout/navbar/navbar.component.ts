import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  firstName: string | undefined;
  lastName: string | undefined;

  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private renderer: Renderer2,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userInfo = this.getUserInfoFromLocalStorage();
    
    if (userInfo) {
      
      // Asignar a variables del componente
      this.firstName = userInfo.firstName;
      this.lastName = userInfo.lastName;
    }
  }

  getUserInfoFromLocalStorage(): { firstName: string, lastName: string } | null {
    try {
      // Obtener el valor del Local Storage
      const cusrData = localStorage.getItem('cusr');
      
      if (!cusrData) {
        console.warn('No se encontró la clave "cusr" en Local Storage');
        return null;
      }

      // Parsear el JSON
      const parsedData = JSON.parse(cusrData);
      
      // Verificar que la estructura sea la esperada
      if (parsedData && parsedData.user && parsedData.user.firstName && parsedData.user.lastName) {
        return {
          firstName: parsedData.user.firstName,
          lastName: parsedData.user.lastName
        };
      } else {
        console.warn('Estructura del objeto "cusr" no es la esperada');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener datos del Local Storage:', error);
      return null;
    }
  } 

  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    e.preventDefault();
    localStorage.removeItem('isLoggedin');

    if (!localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }

}
