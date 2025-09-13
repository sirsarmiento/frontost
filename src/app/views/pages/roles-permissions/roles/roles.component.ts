import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { Rol } from 'src/app/core/models/rol';
import { RolesPermissionsService } from 'src/app/core/services/roles-permissions.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent extends BaseComponent implements OnInit {
  loading = true;
  selectedRow;
  displayedColumns: string[] = ['descripcion','actions'];
  dataSource: MatTableDataSource<Rol>;

  constructor(
    private rolesService: RolesPermissionsService,
    private router: Router) {
    super();
  }

  async ngOnInit() {
    this.rolesService.getAll().subscribe((data: Rol[]) => {
      this.initTable(data);
    });
  }

  initTable(rol: Rol[]){
    this.dataSource = new MatTableDataSource(rol);
    this.loading = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAdd(){
    this.router.navigate(['/roles/add-rol']);
  }


  onEdit(row: Rol){
    this.router.navigate(['/roles/add-rol']);
    this.rolesService.sharingData = row;
  }
}
