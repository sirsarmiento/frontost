import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Fixe } from 'src/app/core/models/Cost/fixe';

@Component({
  selector: 'app-add-fixe',
  templateUrl: './add-fixe.component.html'
})
export class AddFixeComponent implements OnInit {
  private data$: Observable<Fixe>;
  form: FormGroup;
  id: number;
  loading = false;
  submitted = false;

  constructor(
    //private projectService: ProjectService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
      this.myFormValues();
      //this.data$ = projectService.sharingProject;
   }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.setValues();
  }




  back() {
    this.router.navigate(['/fixes']);
    //this.projectService.resetData();
  }




  setValues(){
    // this.data$.subscribe( data => {
    //   if(data.id > 0){
    //     this.f.concept.setValue(data.concept);
    //     this.f.amount.setValue(data.amount);
    //     this.f.clasification.setValue(data.clasification);
    //     this.id = data.id;
    //   }
    // });
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      type: ['',Validators.required],
      concept: ['',Validators.required],
      amount: ['',Validators.required],
      clasification: ['Indirecto',Validators.required],
      product: [''],
    })
  }

  onSubmit() {

    this.submitted = true;

    if (this.form.invalid) { return; }

    this.loading = true;

    const fixe: Fixe = {
      concept: this.f.concept.value,
      amount: this.f.type.value,
      clasification: this.f.clasification.value,
      productId: this.f.product.value,

    }

    console.log(fixe);

    if(this.id == 0 || this.id == undefined){
      //this.projectService.add(project);
    }else{
      //this.projectService.update(this.id, project);
    }

  }

}
