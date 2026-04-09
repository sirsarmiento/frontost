import { Component, OnInit, ViewChild } from '@angular/core';          
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AssetService } from 'src/app/core/services/Cost/asset.service';
import { ProductService } from 'src/app/core/services/Cost/product.service';
import { FixeService } from 'src/app/core/services/Cost/fixe.service';
import { Fixe } from 'src/app/core/models/Cost/fixe';
import { AnalisisPrecios } from 'src/app/core/models/Cost/pricing';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html'
})
export class PricingComponent implements OnInit {

  productos: any[] = [];
  allFixes: Fixe[] = [];
  costosFijosTotales: number = 0;

  // Variables para Calculadora de Precio (Izquierda)
  idProdPrecio: number;
  costoUnitarioPrecio: number = 0;
  margenDeseado: number = 30; // 30% por defecto
  precioSugerido: number = 0;

  // Variables para Punto de Equilibrio (Derecha)
  idProdEquilibrio: number;
  precioVentaManual: number = 0;
  costoVariableProd: number = 0;
  unidadesEquilibrio: number = 0;
  totalFijoIndirecto: number = 0;
  totalDepreciacionMensual: number = 0;

  constructor(
    private assetService: AssetService,
    private productService: ProductService,
    private fixeService: FixeService
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
    this.calcularCargaFijaTotal();
    this.cargarCostos();
    this.fixeService.getAll().subscribe(resp => {
    this.allFixes = resp.data || [];
  });
  }

  cargarProductos() {
    this.productService.getAll().subscribe((resp: any) => {
      this.productos = resp.data || [];
    });
  }

  cargarCostos() {
    this.fixeService.getAll().subscribe((resp: any) => {
      this.allFixes = resp.data || [];
    });
  }

  // --- LÓGICA CALCULADORA PRECIO (IZQUIERDA) ---
  onProductoPrecioChange() {
    const prod = this.productos.find(p => p.id == this.idProdPrecio);
    
    if (prod) {
      const costosDirectos = this.allFixes.filter(f => 
        f.producto == prod.id && (f.tipo === 'Variable' || f.tipo === 'Fijo')
      );
      const totalDirecto = costosDirectos.reduce((sum, f) => sum + (Number(f.precio) || 0), 0);
      const numProductos = this.productos.length || 1; 

      // (Indirectos + Depreciación) / Cantidad de Productos
      let indirectoProrrateado = (this.totalFijoIndirecto + this.totalDepreciacionMensual) / numProductos;

      this.costoUnitarioPrecio = totalDirecto + indirectoProrrateado;

      this.calcularPrecioSugerido();
    }
  }

  calcularPrecioSugerido() {
    const costo = Number(this.costoUnitarioPrecio) || 0;
    let margen = Number(this.margenDeseado) || 0;
    const factorGanancia = margen < 1 ? margen : margen / 100;

    this.precioSugerido = costo * (1 + factorGanancia);
  }

  // --- LÓGICA PUNTO DE EQUILIBRIO (DERECHA) ---
  onProductoEquilibrioChange() {
    const prod = this.productos.find(p => p.id == this.idProdEquilibrio);
    
    if (prod && this.allFixes.length > 0) {
      const costosDirectos = this.allFixes.filter(f => 
        f.producto == prod.id && (f.tipo === 'Variable' || f.tipo === 'Fijo')
      );
      
      this.costoVariableProd = costosDirectos.reduce((sum, f) => sum + (Number(f.precio) || 0), 0);
      
      console.log('Costo Variable para Equilibrio:', this.costoVariableProd);
      this.calcularPuntoEquilibrio();
    } else {
      // Si no hay producto o costos, reseteamos a 0
      this.costoVariableProd = 0;
      this.unidadesEquilibrio = 0;
    }
  }

  calcularPuntoEquilibrio() {
    // El Margen de Contribución es: Precio de Venta - Costo de Materiales
    const margenContribucion = this.precioVentaManual - this.costoVariableProd;

    // Solo calculamos si el precio de venta es mayor al costo de los materiales
    if (margenContribucion > 0 && this.costosFijosTotales > 0) {
      // Costos Fijos Totales / (Precio Venta - Costo Variable)
      this.unidadesEquilibrio = Math.ceil(this.costosFijosTotales / margenContribucion);
    } else {
      this.unidadesEquilibrio = 0;
    }
    
    console.log('Costos Fijos Totales:', this.costosFijosTotales);
    console.log('Margen Contribución:', margenContribucion);
  }

  // --- CARGA FIJA ---
  calcularCargaFijaTotal() {
    // Cargar Activos para la Depreciación
    this.assetService.getAll().subscribe((resp: any) => {
      const activos = resp.data || [];
      this.totalDepreciacionMensual = activos.reduce((sum: number, asset: any) => {
        const costo = parseFloat(asset.costoInicial) || 0;
        const residual = parseFloat(asset.valorResidual) || 0;
        const vida = parseInt(asset.vidaUtil) || 0;
        return vida > 0 ? sum + ((costo - residual) / vida / 12) : sum;
      }, 0);
    });

    // Cargar Costos Fijos Indirectos
    this.fixeService.getAll().subscribe(resp => {
      const todosLosCostos = resp.data || [];
      // Filtramos solo los que son "Indirecto" tal cual lo haces en el Dashboard
      const indirectos = todosLosCostos.filter(item => item.clasificacion === 'Indirecto');
      this.totalFijoIndirecto = indirectos.reduce((total, item) => total + parseFloat(item.precio), 0);
      
      // El total de costos fijos operativos para el Punto de Equilibrio
      this.costosFijosTotales = this.totalFijoIndirecto + this.totalDepreciacionMensual;
    });
  }
}
