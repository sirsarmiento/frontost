import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { CapacityResults, Config, Machine, MachineCapacity } from 'src/app/core/models/Cost/config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/Cost/config.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-config',
  templateUrl: './add-config.component.html',
  styleUrls: ['./add-config.component.scss']
})
export class AddConfigComponent implements OnInit {
  private data$: Observable<Config>;
  selectedRow: any;
  form: FormGroup;
  id: number;
  loading = false;
  submitted = false;
  showList = true;
  machines: Machine[] = [];
  capacidadInstalada = 0;
  capacidadProduccion = 0;
  capacidadOciosa = 0
  utilizacion = 0

  displayedColumnsActivity: string[] = ['tipo', 'descripcion', 'prodMaxHoras', 'horasMax', 'horasUso', 'actions'];
  dataSource: MatTableDataSource<Machine>;

  groupedCapacities: {medida: string, machines: Machine[], capacities: CapacityResults}[] = [];

  constructor(
    private configService: ConfigService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
      this.myFormValues();
      this.data$ = configService.sharingProject;
   }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.setValues();
  }

  back() {
    this.router.navigate(['/configs']);
    this.configService.resetData();
  }

  addMachine(){
    const requiredFields = [
      { field: this.f.type_machine, message: 'el tipo de máquina' },
      { field: this.f.description, message: 'la descripción' },
      { field: this.f.productMax, message: 'la producción máxima' },
      { field: this.f.hoursMax, message: 'las horas máximas' },
      { field: this.f.hoursUse, message: 'las horas de uso' }
    ];

    for (const { field, message } of requiredFields) {
      const value = field.value;
      
      // Validar específicamente para string vacío, null o undefined
      if (value === null || value === undefined || value === '' || value.toString().trim() === '') {
        Swal.fire('Por Favor', `Debe agregar ${message}`, 'info');
        return;
      }
    }
      // Validar si ya existe la máquina
    const description = this.f.description.value.toString().trim();
    const type = this.f.type_machine.value.toString().trim();
    
    const exists = this.machines.some(machine =>  
      machine.tipo.toLowerCase() === type.toLowerCase() && machine.descripcion.toLowerCase() === description.toLowerCase()
    ); 

    if (exists) {
      Swal.fire('', 'Esta máquina ya fue agregada', 'info');
      return;
    }

   // Agregar la máquina
    this.onAddMachine();

  }

  onAddMachine() {
    const newMachine = {
      id: this.generateUniqueId(),
      tipo: this.f.type_machine.value.toString().trim().toUpperCase(),
      descripcion: this.f.description.value.toString().trim().toUpperCase(),
      unidad: this.f.medida.value, // Agregar la unidad de medida
      prodMaxHoras: Number(this.f.productMax.value),
      horasMax: Number(this.f.hoursMax.value),
      horasUso: Number(this.f.hoursUse.value),
    };

    this.machines.push(newMachine);
    this.refreshList();
    this.clearForm();

    // Calcular capacidades por grupo
    this.calculateGroupedCapacities();
  }

  calculateGroupedCapacities() {
    // Agrupar máquinas por unidad de medida
    const groupedMachines = this.groupMachinesByMedida();
    
    // Calcular capacidades para cada grupo
    this.groupedCapacities = [];
    
    for (const [medida, machines] of Object.entries(groupedMachines)) {
      const capacities = this.calculateCapacityForGroup(machines);
      this.groupedCapacities.push({
        medida: medida,
        machines: machines,
        capacities: capacities
      });
    }
    
    // Calcular total general
    const totalCapacities = this.calculateTotalCapacities();
    this.capacidadInstalada = totalCapacities.installedCapacity;
    this.capacidadProduccion = totalCapacities.productionCapacity;
    this.capacidadOciosa = totalCapacities.idleCapacity;
    this.utilizacion = totalCapacities.utilizationPercentage;
  }

  groupMachinesByMedida(): { [key: string]: Machine[] } {
    return this.machines.reduce((groups, machine) => {
      const medida = machine.unidad;
      if (!groups[medida]) {
        groups[medida] = [];
      }
      groups[medida].push(machine);
      return groups;
    }, {} as { [key: string]: Machine[] });
  }

  calculateCapacityForGroup(machines: Machine[]): CapacityResults {
    if (!machines || machines.length === 0) {
      return {
        installedCapacity: 0,
        productionCapacity: 0,
        idleCapacity: 0,
        utilizationPercentage: 0,
        machines: []
      };
    }

    let totalInstalled = 0;
    let totalProduction = 0;
    const machineDetails: MachineCapacity[] = [];

    machines.forEach(machine => {
      const installed = machine.horasMax * machine.prodMaxHoras;
      const production = machine.horasUso * machine.prodMaxHoras;
      const idle = installed - production;

      totalInstalled += installed;
      totalProduction += production;

      machineDetails.push({
        machine,
        installed,
        production,
        idle
      });
    });

    const totalIdle = totalInstalled - totalProduction;
    const utilizationPercentage = totalInstalled > 0 
      ? (totalProduction / totalInstalled) * 100 
      : 0;

    return {
      installedCapacity: totalInstalled,
      productionCapacity: totalProduction,
      idleCapacity: totalIdle,
      utilizationPercentage: Number(utilizationPercentage.toFixed(2)),
      machines: machineDetails
    };
  }

  calculateTotalCapacities(): CapacityResults {
    let totalInstalled = 0;
    let totalProduction = 0;

    this.groupedCapacities.forEach(group => {
      totalInstalled += group.capacities.installedCapacity;
      totalProduction += group.capacities.productionCapacity;
    });

    const totalIdle = totalInstalled - totalProduction;
    const utilizationPercentage = totalInstalled > 0 
      ? (totalProduction / totalInstalled) * 100 
      : 0;

    return {
      installedCapacity: totalInstalled,
      productionCapacity: totalProduction,
      idleCapacity: totalIdle,
      utilizationPercentage: Number(utilizationPercentage.toFixed(2)),
      machines: []
    };
  }

  // Método adicional para generar ID único
  generateUniqueId(): number {
    return this.machines.length > 0 
      ? Math.max(...this.machines.map(m => m.id)) + 1 
      : 1;
  }

  // Método para limpiar el formulario después de agregar
  clearForm() {
    this.f.type_machine.setValue('');
    this.f.description.setValue('');
    this.f.productMax.setValue('');
    this.f.hoursMax.setValue('');
    this.f.hoursUse.setValue('');
  }

  refreshList(){
    this.dataSource = new MatTableDataSource(this.machines);

    if (this.machines.length == 0){
      this.showList = true;
    }else{
      this.showList = false;
    }
  }



  onDeleteMachine(row: Machine){
    Swal.fire({
        title:  `¿ Estás seguro que deseas eliminar de la lista ${ row.descripcion }?`,
        showDenyButton: true,
        confirmButtonText: `Eliminar`,
        }).then((result) => {
          if (result.isConfirmed){
              this.machines.forEach((element,index)=>{
                if(element.id==row.id) {
                  this.machines.splice(index,1);
                  //this.configService.deleteMachine(row.id);
                  this.refreshList();
                }
              });
          }
        })
  }

  setValues(){
    this.data$.subscribe( data => {
      if(data.id > 0){
        this.f.nombre.setValue(data.nombre);
        this.f.tipo.setValue(data.tipo);
        this.f.sector.setValue(data.sector);
        this.f.empleados.setValue(data.empleados);
        this.f.rif.setValue(data.rif);
        this.f.periodo.setValue(data.periodo);
        this.f.direccion.setValue(data.direccion);
        this.f.moneda.setValue(data.moneda);
        this.machines = data.parametros;
        this.id = data.id;

        this.calculateGroupedCapacities();
        this.refreshList();
        this.clearForm();
      }
    });
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      nombre: ['',Validators.required],
      tipo: ['',Validators.required],
      sector: ['',Validators.required],
      empleados: ['',Validators.required],
      rif: ['',Validators.required],
      periodo: ['',Validators.required],
      direccion: ['',Validators.required],
      moneda: ['',Validators.required],

      type_machine: [],
      description: [],
      productMax: [],
      hoursMax: [],
      hoursUse: [],
      medida: [],
    })
  }

  onSubmit() {

    this.submitted = true;



    if (this.form.invalid) { return; }

    this.loading = true;

    const perfil: Config = {
      nombre: this.f.nombre.value,
      tipo: this.f.tipo.value,
      sector: this.f.sector.value,
      empleados: this.f.empleados.value,
      rif: this.f.rif.value,
      periodo: this.f.periodo.value,
      direccion: this.f.direccion.value,
      moneda: this.f.moneda.value,
      parametros: this.machines
    }

    console.log(perfil);

    if(this.id == 0 || this.id == undefined){
      this.configService.add(perfil);
    }else{
      this.configService.update(this.id, perfil);
    }

  }
}
