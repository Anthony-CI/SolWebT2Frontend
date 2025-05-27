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

@Component({
  selector: 'app-publisher',
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
  templateUrl: './publisher.component.html',
  styleUrl: './publisher.component.css',
})
export class PublisherComponent {
  //displayedColumns: string[] = ['idPublisher', 'name', 'address'];
  dataSource: MatTableDataSource<Publisher>;
  // publishers: Publisher[];
  columnsDefinitions = [
    { def: 'idPublisher', label: 'idPublisher', hide: true },
    { def: 'name', label: 'name', hide: false },
    { def: 'address', label: 'address', hide: false },
    { def: 'actions', label: 'actions', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private publisherService: PublisherService,
    private _snackBar: MatSnackBar
  ){}
  //publisherService = inject(PublisherService);

  ngOnInit(): void {
    // this.publisherService.findAll().subscribe(data => console.log(data));
    // this.publisherService.findAll().subscribe(data => this.publishers = data);
    this.publisherService.findAll().subscribe((data) => {
      this.createTable(data);
    });

    this.publisherService.getPublisherChange().subscribe(data => this.createTable(data));
  
   // this._snackBar.open('sample message','INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition:'bottom'});
   this.publisherService.getMessageChange().subscribe(
    data => this._snackBar.open(data,'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition:'bottom'})
   );
  }

  createTable(data: Publisher[]){
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
    this.publisherService.delete(id)
      .pipe(switchMap( () => this.publisherService.findAll()))
      .subscribe( data => {
        this.publisherService.setPublisherChange(data);
        this.publisherService.setMessageChange('DELETED!');
      });
  }
}
