import { Component, inject, ViewChild } from '@angular/core';
import { PublisherService } from '../../services/publisher.service';
import { Publisher } from '../../model/publisher';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { Book } from '../../model/book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book',
  imports: [
      MatTableModule,
      MatIconModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatPaginatorModule,
      MatSortModule,
      MatButtonModule,
      RouterOutlet,
      RouterLink
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {
  //displayedColumns: string[] = ['idBook', 'title', 'subtitle', 'description',idPublisher,idCategory];
    dataSource: MatTableDataSource<Book>;
    
    columnsDefinitions = [
      { def: 'idBook', label: 'idBook', hide: true },
      { def: 'title', label: 'title', hide: false },
      { def: 'subtitle', label: 'subtitle', hide: false },
      { def: 'description', label: 'description', hide: false },
      { def: 'idPublisher', label: 'idPublisher', hide: true },
      { def: 'idCategory', label: 'idCategory', hide: true },
      { def: 'actions', label: 'actions', hide: false },
    ];
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
  
    constructor(
      private bookService: BookService,
      private _snackBar: MatSnackBar
    ){}
    
  
    ngOnInit(): void {

      this.bookService.findAll().subscribe((data) => {
        this.createTable(data);
      });
  
      this.bookService.getBookChange().subscribe(data => this.createTable(data));
    
     // this._snackBar.open('sample message','INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition:'bottom'});
     this.bookService.getMessageChange().subscribe(
      data => this._snackBar.open(data,'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition:'bottom'})
     );
    }
  
    createTable(data: Book[]){
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
  
    getDisplayedColumns() {
      return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
    }
  
    applyFilter(e: any) {
      this.dataSource.filter = e.target.value.trim();
    }
  
    delete(id: number){
      this.bookService.delete(id)
        .pipe(switchMap( () => this.bookService.findAll()))
        .subscribe( data => {
          this.bookService.setBookChange(data);
          this.bookService.setMessageChange('DELETED!');
        });
    }
}
