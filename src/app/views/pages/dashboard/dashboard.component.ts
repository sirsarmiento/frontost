import { User } from './../../../core/models/user';
import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../shared/components/base/base.component';
import { ProductService } from 'src/app/core/services/Cost/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  preserveWhitespaces: true
})
export class DashboardComponent extends BaseComponent implements OnInit {
  user: User;
  products: any[] = [];               // Todos los productos
  perfilesNames: string[] = [];       // Lista única de perfilName
  selectedPerfilName: string = '';    // PerfilName seleccionado
  filteredProducts: any[] = [];       // Productos filtrados por el perfilName

  // ... tus otras variables (processes, risks, etc.)

  constructor(private productService: ProductService) {
    super();
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getAll().subscribe(resp => {
      this.products = resp.data;               // Guardamos todos los productos
      this.extractUniquePerfilNames();         // Extraemos los perfilName únicos
      // Si quieres que al cargar se seleccione el primero automáticamente:
      if (this.perfilesNames.length > 0) {
        this.selectedPerfilName = this.perfilesNames[0];
        this.onPerfilNameChange();              // Filtra los productos del primero
      }
    });
  }

  // Extrae valores únicos de perfilName
  private extractUniquePerfilNames(): void {
    const names = this.products.map(p => p.perfilName);
    this.perfilesNames = [...new Set(names)];   // Elimina duplicados
  }

  // Se ejecuta cada vez que cambia el perfilName seleccionado
  onPerfilNameChange(): void {
    if (this.selectedPerfilName) {
      this.filteredProducts = this.products.filter(
        p => p.perfilName === this.selectedPerfilName
      );
    } else {
      this.filteredProducts = [];
    }
  }
}