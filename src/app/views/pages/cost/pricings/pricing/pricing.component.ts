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
      // Filtramos los costos asociados al producto seleccionado
      const costosVariablesProducto = this.allFixes.filter(f => 
        f.tipo === 'Variable' && f.producto == prod.id
      );

      // 2. CORRECCIÓN: Usamos costoVariableProd en lugar de costoVariableUnitario
      this.costoVariableProd = costosVariablesProducto.reduce((sum, f) => sum + (Number(f.precio) || 0), 0);

      // 3. El costo unitario para el precio sugerido será este total variable
      this.costoUnitarioPrecio = this.costoVariableProd;

      console.log(`Producto: ${prod.nombre} | Costo Variable Total: ${this.costoUnitarioPrecio}`);
      
      this.calcularPrecioSugerido();
    }
  }

  calcularPrecioSugerido() {
    const costo = Number(this.costoUnitarioPrecio) || 0;
    let margen = Number(this.margenDeseado) || 0;

    // Si el usuario puso 0.3, lo convertimos a 30 automáticamente
    if (margen > 0 && margen < 1) {
      margen = margen * 100;
    }

    const margenDecimal = margen / 100;

    if (margenDecimal < 1 && costo > 0) {
      this.precioSugerido = costo / (1 - margenDecimal);
    } else {
      this.precioSugerido = costo;
    }
  }

  // --- LÓGICA PUNTO DE EQUILIBRIO (DERECHA) ---
  onProductoEquilibrioChange() {
    const prod = this.productos.find(p => p.id == this.idProdEquilibrio);
    if (prod) {
      // Usamos el costo variable o costo unitario para la resta
      this.costoVariableProd = parseFloat(prod.unitCost) || 0;
      this.calcularPuntoEquilibrio();
    }
  }

  calcularPuntoEquilibrio() {
    const margenContribucion = this.precioVentaManual - this.costoVariableProd;
    if (margenContribucion > 0) {
      this.unidadesEquilibrio = Math.ceil(this.costosFijosTotales / margenContribucion);
    } else {
      this.unidadesEquilibrio = 0;
    }
  }

  // --- CARGA FIJA ---
  calcularCargaFijaTotal() {
    this.assetService.getAll().subscribe((resp: any) => {
      const activos = resp.data || [];
      const depMensualTotal = activos.reduce((sum: number, asset: any) => {
        const costo = parseFloat(asset.costoInicial) || 0;
        const residual = parseFloat(asset.valorResidual) || 0;
        const vida = parseInt(asset.vidaUtil) || 0;
        return vida > 0 ? sum + ((costo - residual) / vida / 12) : sum;
      }, 0);
      this.costosFijosTotales = depMensualTotal + 1500; // 1500 base operativa
    });
  }
}
