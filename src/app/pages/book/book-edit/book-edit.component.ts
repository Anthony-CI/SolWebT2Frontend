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

@Component({
  selector: 'app-book-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './book-edit.component.html',
  styleUrl: './book-edit.component.css'
})
export class BookEditComponent implements OnInit {
form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute, // ruta activa
    private bookService: BookService,
    private router: Router //no permite movernos de una página a otra
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idBook: new FormControl(), // DECIA 0, pero generaba conflicto de transient value
      title: new FormControl('',Validators.required),
      subtitle: new FormControl('',Validators.required),
      description: new FormControl('',Validators.required),
      idPublisher: new FormControl(''),
      idCategory: new FormControl(''),
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
      this.bookService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idBook: new FormControl(data.idBook),
          title: new FormControl(data.title,Validators.required),
          subtitle: new FormControl(data.subtitle,Validators.required),
          description: new FormControl(data.description, Validators.required),
          idPublisher: new FormControl(data.idPublisher),
          idCategory: new FormControl(data.idCategory),
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
    const book: Book = new Book();
    book.idBook = this.form.value['idBook'];
    book.title = this.form.value['title'];
    book.subtitle = this.form.value['subtitle'];
    book.description = this.form.value['description'];
    book.idPublisher = this.form.value['idPublisher'];
    book.idCategory = this.form.value['idCategory'];

    if (this.isEdit) {

      this.bookService.update(this.id, book).subscribe(() => {
        this.bookService.findAll().subscribe((data) => {
          this.bookService.setBookChange(data);
          this.bookService.setMessageChange('UPDATED!');
        });
      });
      // this.router.navigate(['pages/publisher']);
    } else {
      //SAVE

      this.bookService
        .save(book)
        .pipe(switchMap(() => this.bookService.findAll()))
        .subscribe((data) => {
          this.bookService.setBookChange(data);
          this.bookService.setMessageChange('CREATED!');
        });
      
      // this.router.navigate(['pages/publisher']);
    }

    this.router.navigate(['pages/book']);
  }
}
