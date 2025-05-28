import { Routes } from '@angular/router';
import { PublisherComponent } from './pages/publisher/publisher.component';
import { CategoryComponent } from './pages/category/category.component';
import { PublisherEditComponent } from './pages/publisher/publisher-edit/publisher-edit.component';
import { BookComponent } from './pages/book/book.component';
import { BookEditComponent } from './pages/book/book-edit/book-edit.component';
import { MascotaComponent } from './pages/mascota/mascota.component';
import { MascotaEditComponent } from './pages/mascota/mascota-edit/mascota-edit.component';

export const routes: Routes = [
  {
    path: 'pages/publisher',
    component: PublisherComponent,
    children: [
      { path: 'new', component: PublisherEditComponent }, // pages/publisher/new
      { path: 'edit/:id', component: PublisherEditComponent }, // pages/publisher/edit/1
    ],
  },
  { path: 'pages/category', component: CategoryComponent },
  { path: 'pages/book', 
    component: BookComponent,
      children: [
      { path: 'new', component: BookEditComponent }, // pages/boot/new
      { path: 'edit/:id', component: BookEditComponent }, // pages/book/edit/1
    ],
   },

   { path: 'pages/mascota', 
    component: MascotaComponent,
      children: [
      { path: 'new', component: MascotaEditComponent }, // pages/mascota/new
      { path: 'edit/:id', component: MascotaEditComponent}, // pages/mascota/edit/1
    ],
   }
];
