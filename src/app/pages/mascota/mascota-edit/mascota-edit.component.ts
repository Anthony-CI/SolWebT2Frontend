import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../model/book';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../../services/mascota.service';
import { Mascota } from '../../../model/mascota';

@Component({
  selector: 'app-mascota-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './mascota-edit.component.html',
  styleUrl: './mascota-edit.component.css'
})
export class MascotaEditComponent implements OnInit{

  form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute, // ruta activa
    private mascotaService: MascotaService,
    private router: Router //no permite movernos de una página a otra
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idMascota: new FormControl(), // DECIA 0, pero generaba conflicto de transient value
      nombre: new FormControl('',Validators.required),
      especie: new FormControl('',Validators.required),
      edad: new FormControl('',Validators.required),
      dueno: new FormControl('',Validators.required),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  //edicion
  initForm() {
    if (this.isEdit) {
      this.mascotaService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idMascota: new FormControl(data.idMascota),
          nombre: new FormControl(data.nombre,Validators.required),
          especie: new FormControl(data.especie,Validators.required),
          edad: new FormControl(data.edad, Validators.required),
          dueno: new FormControl(data.dueno),
          
        });
      });
    }
  }

  //antes de enviar
  operate() {

    if (this.form.invalid) {
    this.form.markAllAsTouched(); // muestra los errores
    return;
    }


    // console.log("operate!");
    const mascota: Mascota = new Mascota();
    mascota.idMascota = this.form.value['idMascota'];
    mascota.nombre = this.form.value['nombre'];
    mascota.especie = this.form.value['especie'];
    mascota.edad = this.form.value['edad'];
    mascota.dueno = this.form.value['dueno'];

    if (this.isEdit) {

      this.mascotaService.update(this.id, mascota).subscribe(() => {
        this.mascotaService.findAll().subscribe((data) => {
          this.mascotaService.setMascotaChange(data);
          this.mascotaService.setMessageChange('UPDATED!');
        });
      });
      // this.router.navigate(['pages/publisher']);
    } else {
      //SAVE

      this.mascotaService
        .save(mascota)
        .pipe(switchMap(() => this.mascotaService.findAll()))
        .subscribe((data) => {
          this.mascotaService.setMascotaChange(data);
          this.mascotaService.setMessageChange('CREATED!');
        });
      
      // this.router.navigate(['pages/publisher']);
    }

    this.router.navigate(['pages/mascota']);
  }
}
