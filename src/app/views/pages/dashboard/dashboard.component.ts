import { User } from './../../../core/models/user';
import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../shared/components/base/base.component';
import { ProductService } from 'src/app/core/services/Cost/product.service';
import { FixeService } from 'src/app/core/services/Cost/fixe.service';

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

  // Lista completa de costos obtenida del servicio
  costItems: any[] = [];
  // Lista filtrada que se mostrará en la vista
  filteredCostItems: any[] = [];

  // Para el select, puedes usar un modelo
  selectedProductId: any = null;
  totalPrecio: number = 0;

  constructor(
    private productService: ProductService,
    private fixeService: FixeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getProducts();
    this.getFixes();
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

  getFixes(): void {
    this.fixeService.getAll().subscribe(( resp => {
        console.log('RESP.DATA:', resp.data);
        this.costItems = resp.data;
      // Inicialmente muestra todos los costos (sin filtrar)
        this.filteredCostItems = [...this.costItems];
      }
    ));
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
    this.selectedProductId = null; // 🔁 Limpia la selección anterior
  }

    // Método que filtra los costos por el ID del producto seleccionado
  filterCostsByProduct(productId: number | null): void {
    if (productId === null || productId === 0) {
      // Si no hay producto seleccionado, muestra todos
      this.filteredCostItems = [...this.costItems];
    } else {
      // Filtra los costos cuyo campo 'producto' coincida con el ID
      console.log(productId);
      this.filteredCostItems = this.costItems.filter(
        (costo) => costo.producto === productId
      );
    }

    console.log('Costos filtrados:', this.filteredCostItems);

    // Actualizar total después de filtrar
    this.calcularTotal();

  }

    // Opcional: método que se ejecuta al cambiar la selección del dropdown
  onProductChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const productId = select.value ? parseInt(select.value, 10) : null;
    this.selectedProductId = productId;
    this.filterCostsByProduct(productId);
  }

  calcularTotal() {
    this.totalPrecio = this.filteredCostItems.reduce((sum, item) => {
      // Convierte el precio a número (si es string)
      const precioNum = parseFloat(item.precio);
      return sum + (isNaN(precioNum) ? 0 : precioNum);
    }, 0);
  }
}