import { User } from './../../../core/models/user';
import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../shared/components/base/base.component';
import { ProductService } from 'src/app/core/services/Cost/product.service';
import { FixeService } from 'src/app/core/services/Cost/fixe.service';
import { AssetService } from 'src/app/core/services/Cost/asset.service';
import { Asset } from 'src/app/core/models/Cost/asset';

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
  totalProducto: number = 0;

  totalDepreciacionMensual: number = 0;
  totalFijoIndirecto: number = 0;

  constructor(
    private productService: ProductService,
    private fixeService: FixeService,
    private assetService: AssetService,
    
  ) {
    super();
  }

  ngOnInit(): void {
    this.getProducts();
    this.getFixes();
    this.getAssets();
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

        // Filtrar y totalizar los Fijos Indirectos
        const fijosIndirectos = this.costItems.filter(
          item => item.tipo === 'Fijo' && item.clasificacion === 'Indirecto'
        );
        this.totalFijoIndirecto = fijosIndirectos.reduce(
          (total, item) => total + parseFloat(item.precio),
          0
        );
      }
    ));
  }

  getAssets(){
    this.assetService.getAll().subscribe((resp: any) => {
      // Normalizar los datos numéricos
      const datosNormalizados = resp.data.map((item: any) => ({
        ...item,
        costoInicial: this.normalizarNumero(item.costoInicial),
        valorResidual: this.normalizarNumero(item.valorResidual),
        vidaUtil: this.normalizarNumero(item.vidaUtil)
      }));

      this.calcularTotales(datosNormalizados);
    });
  }

  calcularTotales(assets: Asset[]): void {
    this.totalDepreciacionMensual = 0;

    assets.forEach(asset => {
      this.totalDepreciacionMensual += this.calcularDepreciacionMensual(asset);
    });

  }

  calcularDepreciacionMensual(row: Asset): number {
    const depreciacionAnual = this.calcularDepreciacionAnual(row);
    // Depreciación mensual
    const depreciacionMensual = depreciacionAnual / 12;

    return depreciacionMensual;
  }

  
  calcularDepreciacionAnual(row: Asset): number {
    if (!row.costoInicial || !row.valorResidual === undefined || !row.vidaUtil) {
        return 0;
    }

    const costoInicial = row.costoInicial;
    const valorResidual = row.valorResidual;
    const vidaUtil = row.vidaUtil;

    // Validar valores
    if (costoInicial <= 0 || vidaUtil <= 0 || valorResidual < 0) {
        return 0;
    }

    // CORRECCIÓN: Solo retornar 0 si valorResidual es MAYOR que costoInicial
    if (valorResidual > costoInicial) {
        return 0;
    }
    
    // Cálculo de depreciación anual
    const depreciacionAnual = (costoInicial - valorResidual) / vidaUtil;

    console.log(depreciacionAnual);
    
    return depreciacionAnual;
  }

  // Extrae valores únicos de perfilName
  private extractUniquePerfilNames(): void {
    const names = this.products.map(p => p.perfilName);
    this.perfilesNames = [...new Set(names)];   // Elimina duplicados
  }

  // Se ejecuta cada vez que cambia el perfilName seleccionado
  onPerfilNameChange(): void {
    this.totalProducto = 0; // Reinicia el total antes de recalcular

    if (this.selectedPerfilName) {
      this.filteredProducts = this.products.filter(
        p => p.perfilName === this.selectedPerfilName
      );

       this.totalProducto = this.filteredProducts.length;

       console.log(this.totalProducto);
    } else {
      this.filteredProducts = [];
    }
    this.selectedProductId = null; // 🔁 Limpia la selección anterior
  }


    // Opcional: método que se ejecuta al cambiar la selección del dropdown
  onProductChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const productId = select.value ? parseInt(select.value, 10) : null;
    this.selectedProductId = productId;
    this.filterCostsByProduct(productId);
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

  calcularTotal() {
    this.totalPrecio = this.filteredCostItems.reduce((sum, item) => {
      // Convierte el precio a número (si es string)
      const precioNum = parseFloat(item.precio);
      return sum + (isNaN(precioNum) ? 0 : precioNum);
    }, 0);

    let indirecto = (this.totalFijoIndirecto + this.totalDepreciacionMensual) / this.totalProducto;
    console.log(this.totalFijoIndirecto, this.totalDepreciacionMensual, this.totalProducto);
    console.log(indirecto);
    this.totalPrecio += indirecto;
  }

    // Función para normalizar números desde el backend
  normalizarNumero(valor: any): number {
    if (valor === null || valor === undefined) return 0;
    if (typeof valor === 'number') return valor;
    if (typeof valor === 'string') {
      // Convertir string a número
      const numero = parseFloat(valor);
      return isNaN(numero) ? 0 : numero;
    }
    return 0;
  }
}