
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MascotaService } from '../../services/mascota.service';
import { Mascota } from '../../model/mascota';
import { ConfirmDialogComponent } from '../book/confirm-dialog.component';

@Component({
  selector: 'app-mascota',
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
    RouterLink,
    MatDialogModule,
  ],
  templateUrl: './mascota.component.html',
  styleUrl: './mascota.component.css'
})
export class MascotaComponent {

  dataSource: MatTableDataSource<Mascota>;
      
      columnsDefinitions = [
        { def: 'idMascota', label: 'idMascota', hide: true },
        { def: 'nombre', label: 'nombre', hide: false },
        { def: 'especie', label: 'especie', hide: false },
        { def: 'edad', label: 'edad', hide: false },
        { def: 'dueno', label: 'dueno', hide: false },
        { def: 'actions', label: 'actions', hide: false },
      ];
    
      @ViewChild(MatPaginator) paginator: MatPaginator;
      @ViewChild(MatSort) sort: MatSort;
    
      constructor(
        private mascotaService: MascotaService,
        private _snackBar: MatSnackBar,
        private dialog: MatDialog
  
      ){}
      
    
      ngOnInit(): void {
  
        this.mascotaService.findAll().subscribe((data) => {
          this.createTable(data);
        });
    
        this.mascotaService.getMascotaChange().subscribe(data => this.createTable(data));
      
       // this._snackBar.open('sample message','INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition:'bottom'});
       this.mascotaService.getMessageChange().subscribe(
        data => this._snackBar.open(data,'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition:'bottom'})
       );
      }
    
      createTable(data: Mascota[]){
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
    
      /*
      delete(id: number){
        this.bookService.delete(id)
          .pipe(switchMap( () => this.bookService.findAll()))
          .subscribe( data => {
            this.bookService.setBookChange(data);
            this.bookService.setMessageChange('DELETED!');
          });
      }
      */
     
  delete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mascotaService.delete(id)
          .pipe(switchMap(() => this.mascotaService.findAll()))
          .subscribe(data => {
            this.mascotaService.setMascotaChange(data);
            this.mascotaService.setMessageChange('DELETED!');
          });
      }
    });
  }
}
