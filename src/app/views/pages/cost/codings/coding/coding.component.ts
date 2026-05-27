import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CodingService } from 'src/app/core/services/Cost/coding.service';
import { FamilyService } from 'src/app/core/services/Cost/family.service';
import { Family } from 'src/app/core/models/Cost/family';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-coding',
  templateUrl: './coding.component.html'
})
export class CodingComponent implements OnInit {
  loading = true;
  selectedRow;
  activeTab = 0;

  // Columnas de SKUs
  displayedColumnsSKU: string[] = ['sku', 'productName', 'categoria', 'tecnologia', 'material', 'familia', 'subcategoria', 'actions'];
  dataSourceSKU: MatTableDataSource<any>;

  // Columnas de familias
  displayedColumnsFamily: string[] = ['codigo', 'nombre', 'subcategories', 'actions'];
  dataSourceFamily: MatTableDataSource<Family>;

  @ViewChild('paginatorSKU') paginatorSKU: MatPaginator;
  @ViewChild('sortSKU', { static: false }) sortSKU: MatSort;

  @ViewChild('paginatorFamily') paginatorFamily: MatPaginator;
  @ViewChild('sortFamily', { static: false }) sortFamily: MatSort;

  constructor(
    private codingService: CodingService,
    private familyService: FamilyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getSKUs();
    this.getFamilies();
  }

  getSKUs() {
    this.loading = true;
    this.codingService.getAll().subscribe(resp => {
      this.initTableSKU(resp.data);
    });
  }

  getFamilies() {
    this.loading = true;
    this.familyService.getAll().subscribe(resp => {
      this.initTableFamily(resp.data);
    });
  }

  initTableSKU(skus: any[]) {
    this.dataSourceSKU = new MatTableDataSource(skus);
    setTimeout(() => {
      if (this.paginatorSKU) {
        this.dataSourceSKU.paginator = this.paginatorSKU;
        this.dataSourceSKU.sort = this.sortSKU;
        this.paginatorSKU._intl.itemsPerPageLabel = 'Filas';
      }
    });
    this.loading = false;
  }

  initTableFamily(families: Family[]) {
    this.dataSourceFamily = new MatTableDataSource(families);
    setTimeout(() => {
      if (this.paginatorFamily) {
        this.dataSourceFamily.paginator = this.paginatorFamily;
        this.dataSourceFamily.sort = this.sortFamily;
        this.paginatorFamily._intl.itemsPerPageLabel = 'Filas';
      }
    });
    this.loading = false;
  }

  applyFilterSKU(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceSKU.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceSKU.paginator) {
      this.dataSourceSKU.paginator.firstPage();
    }
  }

  applyFilterFamily(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFamily.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceFamily.paginator) {
      this.dataSourceFamily.paginator.firstPage();
    }
  }

  openAddSKU() {
    this.codingService.resetData();
    this.router.navigate(['/codings/add-coding']);
  }

  onEditSKU(row: any) {
    this.codingService.sharingData = row;
    this.router.navigate(['/codings/add-coding']);
  }

  openAddFamily() {
    this.familyService.resetData();
    this.router.navigate(['/codings/add-family']);
  }

  onEditFamily(row: Family) {
    this.familyService.sharingData = row;
    this.router.navigate(['/codings/add-family']);
  }

  onDeleteFamily(row: Family) {
    Swal.fire({
      title: `¿ Estás seguro que deseas eliminar la familia "${row.nombre}" (${row.codigo})?`,
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.familyService.deleteFamily(row.id!)
          .then(() => {
            Swal.fire('Eliminado', 'La familia ha sido eliminada.', 'success');
            this.getFamilies();
          })
          .catch(error => {
            console.error('Error al eliminar:', error);
          });
      }
    });
  }

  getTecnologiaName(code: string): string {
    const map: any = { 'FDM': 'Filamento', 'SLA': 'Resina' };
    return map[code] ? `${map[code]} (${code})` : code;
  }

  getMaterialName(code: string): string {
    const map: any = { 'PLA': 'Ácido Poliláctico', 'ABS': 'Acrilonitrilo Butadieno Estireno', 'PET': 'Polietileno Tereftalato', 'RES': 'Resina' };
    return map[code] ? `${map[code]} (${code})` : code;
  }

  getFamiliaName(code: string): string {
    if (!this.dataSourceFamily || !this.dataSourceFamily.data) return code;
    const family = this.dataSourceFamily.data.find(f => f.codigo === code);
    return family ? `${family.nombre} (${code})` : code;
  }

  getSubcategoriaName(famCode: string, subCode: string): string {
    if (!subCode) return 'N/A';
    if (!this.dataSourceFamily || !this.dataSourceFamily.data) return subCode;
    const family = this.dataSourceFamily.data.find(f => f.codigo === famCode);
    if (!family || !family.subcategories) return subCode;
    const sub = family.subcategories.find(s => s.codigo === subCode);
    return sub ? `${sub.nombre} (${subCode})` : subCode;
  }
}
