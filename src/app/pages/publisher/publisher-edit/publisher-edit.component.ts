import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PublisherService } from '../../../services/publisher.service';
import { Publisher } from '../../../model/publisher';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-publisher-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './publisher-edit.component.html',
  styleUrl: './publisher-edit.component.css',
})
export class PublisherEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute, // ruta activa
    private publisherService: PublisherService,
    private router: Router //no permite movernos de una página a otra
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idPublisher: new FormControl(), // DECIA 0, pero generaba conflicto de transient value
      address: new FormControl(''),
      name: new FormControl(''),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
      this.publisherService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idPublisher: new FormControl(data.idPublisher),
          name: new FormControl(data.name),
          address: new FormControl(data.address),
        });
      });
    }
  }

  operate() {
    // console.log("operate!");
    const publisher: Publisher = new Publisher();
    publisher.idPublisher = this.form.value['idPublisher'];
    // const x = this.form.controls['idPublisher'].value;
    // const y = this.form.get('idPublisher').value;
    publisher.name = this.form.value['name'];
    publisher.address = this.form.value['address'];

    if (this.isEdit) {
      //EDIT
      // this.publisherService.update(this.id, publisher).subscribe();
      // PRACTICA COMUN, NO IDEAL
      this.publisherService.update(this.id, publisher).subscribe(() => {
        this.publisherService.findAll().subscribe((data) => {
          this.publisherService.setPublisherChange(data);
          this.publisherService.setMessageChange('UPDATED!');
        });
      });
      // this.router.navigate(['pages/publisher']);
    } else {
      //SAVE
      // this.publisherService.save(publisher).subscribe();
      // PRACTICA IDEAL
      this.publisherService
        .save(publisher)
        .pipe(switchMap(() => this.publisherService.findAll()))
        .subscribe((data) => {
          this.publisherService.setPublisherChange(data);
          this.publisherService.setMessageChange('CREATED!');
        });
      
      // this.router.navigate(['pages/publisher']);
    }

    this.router.navigate(['pages/publisher']);
  }
}
