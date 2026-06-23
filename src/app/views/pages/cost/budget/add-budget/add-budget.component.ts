import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Budget, Parts } from 'src/app/core/models/Cost/budge';
import { BudgetService } from 'src/app/core/services/Cost/budget.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Product } from 'src/app/core/models/Cost/product';
import { Asset } from 'src/app/core/models/Cost/asset';
import { AssetService } from 'src/app/core/services/Cost/asset.service';
import { FixeService } from 'src/app/core/services/Cost/fixe.service';
import { ConfigService } from 'src/app/core/services/Cost/config.service';

@Component({
  selector: 'app-add-budget',
  templateUrl: './add-budget.component.html',
  styleUrls: ['./add-budget.component.scss']
})
export class AddBudgetComponent implements OnInit {
  private data$: Observable<Budget>;
  selectedRow: any;
  form: FormGroup;
  id: number;
  loading = false;
  submitted = false;
  showList = true;
  productosList: Product[] = [];
  piezas: Parts[] = [];
  maquinasList: Asset[] = [];
  activosCirculantes: Asset[] = [];
  categoriasMaterial: string[] = [];
  subcategoriasMaterial: string[] = [];
  materialesPorCategoria: Asset[] = [];
  materialesFiltrados: Asset[] = [];

  piezaCounter: number = 1;
  minMargenGanancia: number = 0;
  configParametros: any[] = [];

  // Variables para el cálculo de costos
  totalFijoIndirecto: number = 0;
  totalDepreciacionMensual: number = 0;
  costoIndirectoProrrateado: number = 0;
  depreciacionProrrateada: number = 0;

  displayedColumns: string[] = ['nombre', 'materialTipo', 'precioMaterial', 'gramos', 'metros', 'horas', 'minutos', 'actions'];
  dataSource: MatTableDataSource<Parts>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  
  constructor(
    private budgetService: BudgetService,
    private formBuilder: FormBuilder,
    private router: Router,
    private assetService: AssetService,
    private fixeService: FixeService,
    private configService: ConfigService,
  ) {
      this.myFormValues();
      this.data$ = budgetService.sharing;
   }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.cargarConfiguracionGlobal();
    this.calcularCargaFija();
    this.cargarDatosCostos();
    this.setValues();
    this.getExistingProducts();
  }

  getExistingProducts() {
    this.budgetService.getProductos().subscribe(resp => {
      this.productosList = resp.data || []; 
      console.log('Productos cargados:', this.productosList);
      this.actualizarIndirectoProrrateado();
    });
  }

  back() {
    this.router.navigate(['/budgets']);
    this.budgetService.resetData();
  }

  cargarConfiguracionGlobal() {
    this.configService.getAll().subscribe((resp: any) => {
      const configs = resp.data || [];
      if (configs.length > 0) {
        const config = configs[0];
        this.actualizarMinMargenGanancia(config.margenGanancia || 0);
      }
    });
  }

  calcularCargaFija() {
    this.assetService.getAll().subscribe({
      next: (resp: any) => {
        const assets = resp.data || [];
        this.maquinasList = assets.filter((asset: Asset) => 
          asset.tipo?.toLowerCase().trim() === 'fijo' && 
          asset.categoria?.toLowerCase().trim() === 'equipo'
        );
        this.actualizarCostoMaquina();
        this.actualizarMinMargenGanancia();

        // Cargar activos circulantes
        this.activosCirculantes = assets.filter((asset: Asset) => 
          asset.tipo?.toLowerCase().trim() === 'circulante'
        );

        // Obtener categorías únicas de activos circulantes
        this.categoriasMaterial = [...new Set(
          this.activosCirculantes.map(a => a.categoria).filter(Boolean)
        )];
      },
      error: (err) => {
        console.error('Error al cargar activos:', err);
      }
    });
  }

  actualizarCostoMaquina() {
    const activoId = this.form.get('activoId')?.value;
    if (activoId) {
      const machine = this.maquinasList.find(m => m.id == activoId);
      if (machine) {
        const consumo = Number(machine.consumoMaquina) || 0;
        const tarifa = Number(machine.tarifa) || 0;
        const mantenimiento = Number(machine.costoMantenimiento) || 0;
        const tasa = (consumo / 1000 * tarifa) + mantenimiento;
        this.form.get('costoMaquina')?.setValue(tasa);
        return;
      }
    }
    this.form.get('costoMaquina')?.setValue(0);
  }

  actualizarMinMargenGanancia(minMarginValue?: number) {
    if (minMarginValue !== undefined) {
      this.minMargenGanancia = minMarginValue;
    }

    const control = this.form.get('margenGanancia');
    if (control) {
      control.setValidators([Validators.required, Validators.min(this.minMargenGanancia), Validators.max(100)]);
      control.updateValueAndValidity();
      
      if (!this.id || control.value < this.minMargenGanancia) {
        control.setValue(this.minMargenGanancia);
      }
    }
  }

  cargarDatosCostos() {
    forkJoin({
      activos: this.assetService.getAll(),
      costos: this.fixeService.getAll()
    }).subscribe({
      next: (res: any) => {
        const activos = res.activos?.data || [];
        const costos = res.costos?.data || [];

        // Calcular Depreciación Mensual
        this.totalDepreciacionMensual = activos.reduce((sum: number, asset: any) => {
          const costo = parseFloat(asset.costoInicial) || 0;
          const residual = parseFloat(asset.valorResidual) || 0;
          const vida = parseInt(asset.vidaUtil) || 0;
          return vida > 0 ? sum + ((costo - residual) / vida / 12) : sum;
        }, 0);

        // Costos Fijos Indirectos
        const indirectos = costos.filter((item: any) => item.clasificacion === 'Indirecto');
        this.totalFijoIndirecto = indirectos.reduce((total: number, item: any) => total + (Number(item.precio) || 0), 0);

        this.actualizarIndirectoProrrateado();
      },
      error: (err) => {
        console.error('Error al cargar datos de costos:', err);
      }
    });
  }

  actualizarIndirectoProrrateado() {
    const numProductos = this.productosList.length || 1;
    this.costoIndirectoProrrateado = this.totalFijoIndirecto / numProductos;
    this.depreciacionProrrateada = this.totalDepreciacionMensual / numProductos;
  }

  addPart(){
    const requiredFields = [
      { field: this.f.nombre, message: 'el nombre de la pieza' },
      { field: this.f.materialTipo, message: 'la categoría de material' },
      { field: this.f.materialId, message: 'el material (activo circulante)' },
      { field: this.f.precioMaterial, message: 'el costo de material por gramo' },
      { field: this.f.gramos, message: 'los gramos' },
      { field: this.f.metros, message: 'los metros' },
      { field: this.f.horas, message: 'las horas' },
      { field: this.f.minutos, message: 'los minutos' }
    ];

    for (const { field, message } of requiredFields) {
      const value = field.value;
      
      if (value === null || value === undefined || value === '' || value.toString().trim() === '') {
        Swal.fire('Por Favor', `Debe agregar ${message}`, 'info');
        return;
      }
    }
    
    const nombre = this.f.nombre.value.toString().trim();

    const exists = this.piezas.some(part =>
      part.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (exists) {
      Swal.fire('', 'Esta pieza ya fue agregada', 'info');
      return;
    }

    this.onAddPart();
  }

  onAddPart() {
    const materialId = this.form.get('materialId')?.value;
    let materialDisplayName = this.f.materialTipo.value;
    
    if (materialId) {
      const asset = this.activosCirculantes.find(a => a.id == materialId);
      if (asset) {
        materialDisplayName = asset.nombre;
      }
    }

    const newParts = {
      id: this.generateUniqueId(),
      nombre: this.f.nombre.value.toString().trim().toUpperCase(),
      materialTipo: materialDisplayName,
      precioMaterial: Number(this.f.precioMaterial.value) || 0,
      gramos: Number(this.f.gramos.value) || 0,
      metros: Number(this.f.metros.value) || 0, 
      horas: Number(this.f.horas.value) || 0,
      minutos: Number(this.f.minutos.value) || 0,
    };

    this.piezaCounter++;

    this.piezas.push(newParts);
    this.refreshList();
    this.clearForm();
  }

  getTotales() {
    const totalGramos = this.piezas.reduce((sum, pieza) => sum + (+pieza.gramos || 0), 0);
    const totalMetros = this.piezas.reduce((sum, pieza) => sum + (+pieza.metros || 0), 0);
    const totalHoras = this.piezas.reduce((sum, pieza) => sum + (+pieza.horas || 0), 0);
    const totalMinutos = this.piezas.reduce((sum, pieza) => sum + (+pieza.minutos || 0), 0);

    const tasaFallo = Number(this.form?.get('tasaFalloGlobal')?.value) || 0;
    const rawMaterialCost = this.piezas.reduce((sum, pieza) => sum + ((+pieza.gramos || 0) * (+pieza.precioMaterial || 0)), 0);
    const totalCostoMaterial = rawMaterialCost * (1 + (tasaFallo / 100));

    const costoMaquinaRate = Number(this.form?.get('costoMaquina')?.value) || 0;
    const totalTiempoHoras = totalHoras + (totalMinutos / 60);
    const totalCostoMaquina = costoMaquinaRate * totalTiempoHoras;

    const costoIndirectoAsignado = this.costoIndirectoProrrateado;
    const depreciacionAsignada = this.depreciacionProrrateada;
    const costoTotalBase = totalCostoMaterial + totalCostoMaquina + costoIndirectoAsignado + depreciacionAsignada;

    const margen = Number(this.form?.get('margenGanancia')?.value) || 0;
    const factorGanancia = margen < 1 ? margen : margen / 100;
    let precioSugerido = 0;
    if (factorGanancia >= 1) {
      precioSugerido = costoTotalBase / 0.0001;
    } else {
      precioSugerido = costoTotalBase / (1 - factorGanancia);
    }

    return {
      totalGramos,
      totalMetros,
      totalHoras,
      totalMinutos,
      totalCostoMaterial,
      totalCostoMaquina,
      costoIndirectoAsignado,
      depreciacionAsignada,
      costoTotalBase,
      precioSugerido
    };
  }

  generateUniqueId(): number {
    return this.piezas.length > 0 
      ? Math.max(...this.piezas.map(m => m.id)) + 1 
      : 1;
  }

  clearForm() {
    this.f.nombre.setValue(`PIEZA ${this.piezaCounter}`);
    this.f.materialTipo.setValue('');
    this.form.get('subcategoria')?.setValue('');
    this.form.get('materialId')?.setValue(null);
    this.form.get('materialId')?.disable();
    this.f.precioMaterial.setValue('');
    this.f.gramos.setValue('');
    this.f.metros.setValue('');
    this.f.horas.setValue('');
    this.f.minutos.setValue('');
  }

  refreshList(){
    this.dataSource = new MatTableDataSource(this.piezas);

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.piezas.length == 0){
      this.showList = true;
    }else{
      this.showList = false;
    }
  }

  onDelete(row: Parts){
    Swal.fire({
      title:  `¿ Estás seguro que deseas eliminar de la lista ${ row.nombre }?`,
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      }).then((result) => {
        if (result.isConfirmed){
            this.piezas.forEach((element,index)=>{
              if(element.id==row.id) {
                this.piezas.splice(index,1);
                this.piezaCounter = this.piezaCounter - 1;
                this.f.nombre.setValue(`PIEZA ${this.piezaCounter}`);
                this.refreshList();
              }
            });
        }
      })
  }

  setValues(){
    this.data$.subscribe( data => {
      if(data.id > 0){
        console.log(data);
        this.f.clasificacion.setValue(data.clasificacion);
        this.f.descripcion.setValue(data.descripcion);
        this.f.numero.setValue(data.numero);
        this.f.fecha.setValue(data.fecha);
        this.piezas = data.piezas || [];
        this.id = data.id;

        this.f.activoId.setValue(data.activoId);
        this.f.tasaFalloGlobal.setValue(data.tasaFalloGlobal || 0);
        this.f.tiempoSetup.setValue(data.tiempoSetup || 0);
        this.f.tiempoPostProcesado.setValue(data.tiempoPostProcesado || 0);
        this.f.margenGanancia.setValue(data.margenGanancia !== undefined ? data.margenGanancia : this.minMargenGanancia);

        this.clearForm();
        this.f.nombre.setValue(`PIEZA ${this.piezas.length + 1}`);
        this.refreshList();
        this.actualizarCostoMaquina();
        this.actualizarMinMargenGanancia();
      }
    });
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      clasificacion: ['',Validators.required],
      productoId: [''],
      descripcion: ['',Validators.required],
      numero: ['',Validators.required],
      fecha: ['',Validators.required],

      nombre: [`PIEZA ${this.piezaCounter}`],
      materialTipo: [''],
      subcategoria: [''],
      materialId: [{ value: null, disabled: true }],
      precioMaterial: [''],
      gramos: [],
      metros: [],
      horas: [],
      minutos: [],

      activoId: [null],
      tasaFalloGlobal: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      tiempoSetup: [0, [Validators.required, Validators.min(0)]],
      tiempoPostProcesado: [0, [Validators.required, Validators.min(0)]],
      margenGanancia: [0, [Validators.required, Validators.min(this.minMargenGanancia), Validators.max(100)]],
      costoMaquina: [0]
    });

    this.form.get('activoId')?.valueChanges.subscribe(() => {
      this.actualizarCostoMaquina();
      this.actualizarMinMargenGanancia();
    });

    this.form.get('materialTipo')?.valueChanges.subscribe((categoria) => {
      this.onCategoriaChange(categoria);
    });

    this.form.get('subcategoria')?.valueChanges.subscribe((subcategoria) => {
      this.onSubcategoriaChange(subcategoria);
    });

    this.form.get('materialId')?.valueChanges.subscribe((materialId) => {
      this.onMaterialChange(materialId);
    });
  }

  filterMaterials(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase().trim();

    if (!query) {
      this.materialesFiltrados = [...this.materialesPorCategoria];
      return;
    }

    this.materialesFiltrados = this.materialesPorCategoria.filter(m =>
      m.nombre?.toLowerCase().includes(query)
    );
  }

  onCategoriaChange(categoria: string) {
    if (categoria) {
      this.materialesPorCategoria = this.activosCirculantes.filter(
        a => a.categoria === categoria
      );
      this.materialesFiltrados = [...this.materialesPorCategoria];
      
      this.subcategoriasMaterial = [...new Set(
        this.materialesPorCategoria.map(a => a.subcategoria).filter(Boolean)
      )] as string[];

      this.form.get('materialId')?.enable();
    } else {
      this.materialesPorCategoria = [];
      this.materialesFiltrados = [];
      this.subcategoriasMaterial = [];
      this.form.get('materialId')?.disable();
    }
    // Reiniciar material y precio seleccionados cuando cambia la categoría
    this.form.get('materialId')?.setValue(null, { emitEvent: false });
    this.form.get('precioMaterial')?.setValue('');
    this.form.get('subcategoria')?.setValue('', { emitEvent: false });
  }

  onSubcategoriaChange(subcategoria: string) {
    if (subcategoria) {
      this.materialesFiltrados = this.materialesPorCategoria.filter(
        a => a.subcategoria === subcategoria
      );
    } else {
      this.materialesFiltrados = [...this.materialesPorCategoria];
    }
    this.form.get('materialId')?.setValue(null, { emitEvent: false });
    this.form.get('precioMaterial')?.setValue('');
  }

  onMaterialChange(materialId: number) {
    if (materialId) {
      const selectedAsset = this.activosCirculantes.find(a => a.id == materialId);
      if (selectedAsset) {
        // Calcular precio por gramo:
        const valUnit = Number(selectedAsset.valorUnitario) || 0;
        const uMedida = selectedAsset.unidadMedida?.toLowerCase().trim() || '';
        
        let precioPorGramo = valUnit;
        if (uMedida === 'kilos' || uMedida === 'kilo') {
          precioPorGramo = valUnit / 1000;
        } else if (uMedida === 'gramos' || uMedida === 'gramo') {
          precioPorGramo = valUnit;
        }
        
        // Asignar el valor al campo del precio por gramo
        this.form.get('precioMaterial')?.setValue(precioPorGramo);
      }
    } else {
      this.form.get('precioMaterial')?.setValue('');
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.f.clasificacion.value === 'Producto' && !this.f.productoId?.value) {
      this.f.productoId?.setErrors({ required: true });
    }

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const budget: Budget = {
      clasificacion: this.f.clasificacion.value,
      descripcion: this.f.descripcion.value,
      numero: this.f.numero.value,
      fecha: this.f.fecha.value,
      piezas: this.piezas,
      productoId: this.f.clasificacion.value === 'Producto' ? this.f.productoId.value : null,
      activoId: this.f.activoId.value,
      tasaFalloGlobal: Number(this.f.tasaFalloGlobal.value) || 0,
      tiempoSetup: Number(this.f.tiempoSetup.value) || 0,
      tiempoPostProcesado: Number(this.f.tiempoPostProcesado.value) || 0,
      margenGanancia: Number(this.f.margenGanancia.value) || 0,
      costoMaquina: Number(this.f.costoMaquina.value) || 0,
      costoOperador: 0
    };

    console.log(budget);

    if(this.id == 0 || this.id == undefined){
      this.budgetService.add(budget);
    }else{
      this.budgetService.update(this.id, budget);
    }
  }
}

