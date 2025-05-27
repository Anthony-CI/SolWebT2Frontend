import { Routes } from '@angular/router';
import { PublisherComponent } from './pages/publisher/publisher.component';
import { CategoryComponent } from './pages/category/category.component';
import { PublisherEditComponent } from './pages/publisher/publisher-edit/publisher-edit.component';
import { BookComponent } from './pages/book/book.component';
import { BookEditComponent } from './pages/book/book-edit/book-edit.component';

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
   }
];
