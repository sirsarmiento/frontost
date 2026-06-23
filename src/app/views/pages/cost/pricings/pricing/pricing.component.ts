import { Component, OnInit } from '@angular/core';          
import { AssetService } from 'src/app/core/services/Cost/asset.service';
import { ProductService } from 'src/app/core/services/Cost/product.service';
import { FixeService } from 'src/app/core/services/Cost/fixe.service';
import { ConfigService } from 'src/app/core/services/Cost/config.service';
import { Fixe } from 'src/app/core/models/Cost/fixe';
import { forkJoin } from 'rxjs';

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
  minMargenGanancia: number = 0;
  margenDeseado: number = 30; // 30% por defecto
  precioSugerido: number = 0;
  
  // Variables para desglose en UI (Izquierda)
  totalDirectoPrecio: number = 0;
  indirectoProrrateadoPrecio: number = 0;

  // Variables para Punto de Equilibrio (Derecha)
  idProdEquilibrio: number;
  precioVentaManual: number = 0;
  costoVariableProd: number = 0;
  unidadesEquilibrio: number = 0;
  totalFijoIndirecto: number = 0;
  totalDepreciacionMensual: number = 0;

  // Variables para desglose en UI (Derecha)
  costoFijoDirectoProd: number = 0;
  fijosIndirectosProrrateados: number = 0;
  costosFijosTotalesParaProd: number = 0;

  constructor(
    private assetService: AssetService,
    private productService: ProductService,
    private fixeService: FixeService,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.cargarConfiguracionGlobal();
    this.cargarDatosIniciales();
  }

  cargarConfiguracionGlobal() {
    this.configService.getAll().subscribe((resp: any) => {
      const configs = resp.data || [];
      if (configs.length > 0) {
        const config = configs[0];
        this.minMargenGanancia = config.margenGanancia || 0;
        // set default to minimum margin
        this.margenDeseado = this.minMargenGanancia;
        this.calcularPrecioSugerido();
      }
    });
  }

  cargarDatosIniciales() {
    forkJoin({
      productos: this.productService.getAll(),
      activos: this.assetService.getAll(),
      costos: this.fixeService.getAll()
    }).subscribe({
      next: (res: any) => {
        this.productos = res.productos?.data || [];
        this.allFixes = res.costos?.data || [];
        
        // 1. Calcular Depreciación Mensual de Activos
        const activos = res.activos?.data || [];
        this.totalDepreciacionMensual = activos.reduce((sum: number, asset: any) => {
          const costo = parseFloat(asset.costoInicial) || 0;
          const residual = parseFloat(asset.valorResidual) || 0;
          const vida = parseInt(asset.vidaUtil) || 0;
          return vida > 0 ? sum + ((costo - residual) / vida / 12) : sum;
        }, 0);

        // 2. Calcular Costos Fijos Indirectos
        const indirectos = this.allFixes.filter(item => item.clasificacion === 'Indirecto');
        this.totalFijoIndirecto = indirectos.reduce((total, item) => total + (Number(item.precio) || 0), 0);

        // 3. Costos Fijos Totales Operativos (Generales)
        this.costosFijosTotales = this.totalFijoIndirecto + this.totalDepreciacionMensual;
        
        const numProductos = this.productos.length || 1;
        this.fijosIndirectosProrrateados = this.costosFijosTotales / numProductos;
        this.costosFijosTotalesParaProd = this.fijosIndirectosProrrateados;

        // Recalcular si ya hay valores seleccionados
        if (this.idProdPrecio) {
          this.onProductoPrecioChange();
        }
        if (this.idProdEquilibrio) {
          this.onProductoEquilibrioChange();
        }
      },
      error: (err) => {
        console.error('Error al cargar datos iniciales de precios:', err);
      }
    });
  }

  // --- LÓGICA CALCULADORA PRECIO (IZQUIERDA) ---
  onProductoPrecioChange() {
    const prod = this.productos.find(p => p.id == this.idProdPrecio);
    
    if (prod) {
      // Costos directos (pueden ser Fijos o Variables, pero asignados al producto)
      const costosDirectos = this.allFixes.filter(f => 
        f.producto == prod.id && (f.tipo === 'Variable' || f.tipo === 'Fijo')
      );
      this.totalDirectoPrecio = costosDirectos.reduce((sum, f) => sum + (Number(f.precio) || 0), 0);
      const numProductos = this.productos.length || 1; 

      // (Indirectos + Depreciación) / Cantidad total de Productos
      this.indirectoProrrateadoPrecio = (this.totalFijoIndirecto + this.totalDepreciacionMensual) / numProductos;

      this.costoUnitarioPrecio = this.totalDirectoPrecio + this.indirectoProrrateadoPrecio;

      this.calcularPrecioSugerido();
    } else {
      this.totalDirectoPrecio = 0;
      this.indirectoProrrateadoPrecio = 0;
      this.costoUnitarioPrecio = 0;
      this.precioSugerido = 0;
    }
  }

  calcularPrecioSugerido() {
    const costo = Number(this.costoUnitarioPrecio) || 0;
    let margen = Number(this.margenDeseado) || 0;

    // Use minMargenGanancia as fallback for the suggested price calculation if the input is smaller
    const activeMargen = margen < this.minMargenGanancia ? this.minMargenGanancia : margen;
    const factorGanancia = activeMargen < 1 ? activeMargen : activeMargen / 100;

    if (factorGanancia >= 1) {
      // Evitar división por cero si el margen es 100% o mayor
      this.precioSugerido = costo / 0.0001;
    } else {
      // Fórmula estándar de margen de ganancia sobre precio de venta (Profit Margin)
      this.precioSugerido = costo / (1 - factorGanancia);
    }
  }

  // --- LÓGICA PUNTO DE EQUILIBRIO (DERECHA) ---
  onProductoEquilibrioChange() {
    const prod = this.productos.find(p => p.id == this.idProdEquilibrio);
    
    if (prod && this.allFixes.length > 0) {
      // Solo variables directos del producto
      const variablesDirectos = this.allFixes.filter(f => 
        f.producto == prod.id && f.tipo === 'Variable'
      );
      this.costoVariableProd = variablesDirectos.reduce((sum, f) => sum + (Number(f.precio) || 0), 0);
      
      // Costos fijos directos del producto
      const fijosDirectos = this.allFixes.filter(f => 
        f.producto == prod.id && f.tipo === 'Fijo'
      );
      this.costoFijoDirectoProd = fijosDirectos.reduce((sum, f) => sum + (Number(f.precio) || 0), 0);

      const numProductos = this.productos.length || 1;
      this.fijosIndirectosProrrateados = this.costosFijosTotales / numProductos;

      // Costos fijos totales para el producto = Indirectos Prorrateados + Directos Fijos
      this.costosFijosTotalesParaProd = this.fijosIndirectosProrrateados + this.costoFijoDirectoProd;

      this.calcularPuntoEquilibrio();
    } else {
      this.costoVariableProd = 0;
      this.costoFijoDirectoProd = 0;
      this.fijosIndirectosProrrateados = 0;
      this.costosFijosTotalesParaProd = 0;
      this.unidadesEquilibrio = 0;
    }
  }

  calcularPuntoEquilibrio() {
    // El Margen de Contribución es: Precio de Venta - Costo Variable Unitario
    const margenContribucion = this.precioVentaManual - this.costoVariableProd;

    // Solo calculamos si el precio de venta es mayor al costo variable
    if (margenContribucion > 0 && this.costosFijosTotalesParaProd > 0) {
      // Costos Fijos Totales / Margen de Contribución
      this.unidadesEquilibrio = Math.ceil(this.costosFijosTotalesParaProd / margenContribucion);
    } else {
      this.unidadesEquilibrio = 0;
    }
  }
}
