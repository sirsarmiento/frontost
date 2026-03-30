import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Asset } from 'src/app/core/models/Cost/asset';
import { AssetService } from 'src/app/core/services/Cost/asset.service';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html'
})
export class AssetComponent implements OnInit {

  loading = true;
  selectedRow;
  displayedColumns: string[] = ['nombre', 'costoInicial', 'valorResidual', 'vidaUtil', 'fechaCompra', 'depreciacionMensual', 'depreciacionAnual', 'actions'];
  displayedColumnsCirculantes: string[] = ['nombre', 'descripcion', 'ubicacion', 'cantidad', 'valorUnitario','costoInicial', 'actions'];
  dataSource: MatTableDataSource<Asset>;
  totalDepreciacionMensual: number = 0;

  dataSourceFijos: MatTableDataSource<Asset>;
  dataSourceCirculantes: MatTableDataSource<Asset>; 

  totalFijos: number = 0;
  totalCirculantes: number = 0;

  @ViewChild('paginatorFijos') paginatorFijos: MatPaginator;
  @ViewChild('sortFijos', { static: false }) sortFijos: MatSort;

  @ViewChild('paginatorCirculantes') paginatorCirculantes: MatPaginator;
  @ViewChild('sortCirculantes', { static: false }) sortCirculantes: MatSort;

  constructor(
    private assetService: AssetService,
    private router: Router,
    public matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getAssets();
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

  // Función auxiliar para formatear números en el template
  formatearNumero(valor: number): string {
    return valor.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  getAssets() {
    this.assetService.getAll().subscribe((resp: any) => {
      console.log("Datos recibidos del servidor:", resp.data);
      const datosNormalizados = resp.data.map((item: any) => {
        const asset = {
          ...item,
          costoInicial: this.normalizarNumero(item.costoInicial),
          valorResidual: this.normalizarNumero(item.valorResidual),
          vidaUtil: this.normalizarNumero(item.vidaUtil),

          cantidad: this.normalizarNumero(item.cantidad),
          valorUnitario: this.normalizarNumero(item.valorUnitario),

          nombre: item.nombre || '',
          descripcion: item.descripcion || '',
          ubicacion: item.ubicacion || '',
          unidadMedida: item.unidadMedida || '',
          presentacion: item.presentacion || ''
        };
        // Inyectamos los cálculos para que el filtrado y ordenamiento funcionen mejor
        asset.depMensual = this.calcularDepreciacionMensual(asset);
        asset.depAnual = this.calcularDepreciacionAnual(asset);
        return asset;
      });
      
      this.initTables(datosNormalizados);
    });
  }
  

  initTables(data: Asset[]) {
    // Los que dicen "Fijo" O los que NO tienen tipo pero SÍ tienen vida útil
    const fijos = data.filter(item => 
      item.tipo?.toLowerCase().trim() === 'fijo' || 
      (!item.tipo && item.vidaUtil > 0)
    );
    this.dataSourceFijos = new MatTableDataSource(fijos);
    
    // Los que dicen "Circulante" O los que NO tienen tipo y su vida útil es 0
    const circulantes = data.filter(item => 
      item.tipo?.toLowerCase().trim() === 'circulante' || 
      (!item.tipo && item.vidaUtil === 0 && item.id > 0) // El caso de 'agua' entraría aquí
    );
    this.dataSourceCirculantes = new MatTableDataSource(circulantes);

    // Recalcular total de fijos
    this.totalFijos = fijos.reduce((sum, item) => sum + (this.calcularDepreciacionMensual(item) || 0), 0);
    this.totalCirculantes = circulantes.reduce((sum, item) => sum + (item.costoInicial || 0), 0);
    
    setTimeout(() => {
      if (this.dataSourceFijos) {
        this.dataSourceFijos.paginator = this.paginatorFijos;
        this.dataSourceFijos.sort = this.sortFijos;
      }
      if (this.dataSourceCirculantes) {
        this.dataSourceCirculantes.paginator = this.paginatorCirculantes;
        this.dataSourceCirculantes.sort = this.sortCirculantes;
      }
    });
    
    this.loading = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    
    this.dataSourceFijos.filter = filterValue;
    this.dataSourceCirculantes.filter = filterValue;

    if (this.dataSourceFijos.paginator) this.dataSourceFijos.paginator.firstPage();
    if (this.dataSourceCirculantes.paginator) this.dataSourceCirculantes.paginator.firstPage();
  }

  applyFilterFijos(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceFijos.filter = filterValue.trim().toLowerCase();
  if (this.dataSourceFijos.paginator) {
    this.dataSourceFijos.paginator.firstPage();
  }
}

  applyFilterCirculantes(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCirculantes.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceCirculantes.paginator) {
      this.dataSourceCirculantes.paginator.firstPage();
    }
  }

  onEdit(row: Asset){
    this.router.navigate(['/assets/add-asset']);
    this.assetService.sharingData = row;
  }

  openAdd(){
    this.router.navigate(['/assets/add-asset']);
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

    // Solo retornar 0 si valorResidual es MAYOR que costoInicial
    if (valorResidual > costoInicial) {
        return 0;
    }
    
    // Cálculo de depreciación anual
    const depreciacionAnual = (costoInicial - valorResidual) / vidaUtil;
    
    return depreciacionAnual;
  }

  calcularDepreciacionMensual(row: Asset): number {
    const depreciacionAnual = this.calcularDepreciacionAnual(row);
    // Depreciación mensual
    const depreciacionMensual = depreciacionAnual / 12;

    return depreciacionMensual;
  }
}
