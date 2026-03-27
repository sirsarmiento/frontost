import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from 'src/app/core/services/Cost/config.service';
import { Config } from 'src/app/core/models/Cost/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html'
})
export class ConfigComponent implements OnInit {

  loading = true;
  selectedRow;
  displayedColumns: string[] = ['nombre', 'rif', 'tipo','sector', 'empleados','actions'];
  groupedCapacities: any[] = [];
displayedColumnsActivity: string[] = ['tipo', 'descripcion', 'prodMaxHoras', 'horasMax', 'horasUso'];
  dataSource: MatTableDataSource<Config>;

    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private configService: ConfigService, 
    private router: Router,
    public matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getConfigs();
  }

  getConfigs(){
    this.configService.getAll().subscribe(( resp => {
        this.initTable(resp.data);
      // Si hay al menos una empresa, procesamos sus parámetros operativos de una vez
      if (resp.data.length > 0) {
        this.calculateGroupedCapacities(resp.data[0].parametros);
      }
    }));
  }

  

  initTable(config: Config[]){
    this.dataSource = new MatTableDataSource(config);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    this.loading = false;
    this.paginator._intl.itemsPerPageLabel = 'Filas';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  calculateGroupedCapacities(machines: any[]) {
    if (!machines || machines.length === 0) return;

    const grouped = machines.reduce((groups, machine) => {
      const medida = machine.unidad || 'Sin medida';
      if (!groups[medida]) groups[medida] = [];
      groups[medida].push(machine);
      return groups;
    }, {});

    this.groupedCapacities = Object.keys(grouped).map(medida => {
      const groupMachines = grouped[medida];
      const installed = groupMachines.reduce((sum, m) => sum + (m.horasMax * m.prodMaxHoras), 0);
      const production = groupMachines.reduce((sum, m) => sum + (m.horasUso * m.prodMaxHoras), 0);
      
      return {
        medida,
        machines: groupMachines,
        capacities: {
          installedCapacity: installed,
          productionCapacity: production,
          idleCapacity: installed - production,
          utilizationPercentage: installed > 0 ? ((production / installed) * 100).toFixed(2) : 0
        }
      };
    });
  }

  onEdit(row: Config){
    this.router.navigate(['/configs/add-config']);
    this.configService.sharingData = row;
  }

  openAdd(){
    this.router.navigate(['/configs/add-config']);
  }
}
