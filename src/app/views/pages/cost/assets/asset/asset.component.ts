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
  dataSource: MatTableDataSource<Asset>;
  totalDepreciacionMensual: number = 0;

    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

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

  getAssets(){
    this.assetService.getAll().subscribe((resp: any) => {
      // Normalizar los datos numéricos
      const datosNormalizados = resp.data.map((item: any) => ({
        ...item,
        costoInicial: this.normalizarNumero(item.costoInicial),
        valorResidual: this.normalizarNumero(item.valorResidual),
        vidaUtil: this.normalizarNumero(item.vidaUtil)
      }));
      
      this.initTable(datosNormalizados);

      this.calcularTotales(datosNormalizados);
    });
  }

  initTable(project: Asset[]){
    this.dataSource = new MatTableDataSource(project);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    this.loading = false;
    this.paginator._intl.itemsPerPageLabel = 'Filas';
  }

   // Función para calcular totales de depreciación
  calcularTotales(assets: Asset[]): void {
    this.totalDepreciacionMensual = 0;

    assets.forEach(asset => {
      this.totalDepreciacionMensual += this.calcularDepreciacionMensual(asset);
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    // Recalcular totales cuando se filtra
    this.calcularTotales(this.dataSource.filteredData);
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

    // CORRECCIÓN: Solo retornar 0 si valorResidual es MAYOR que costoInicial
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
