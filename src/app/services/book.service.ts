import { Injectable } from '@angular/core';
import { Book } from '../model/book';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private url: string=`${environment.HOST}/book`;
  private bookChange: Subject<Book[]>= new Subject<Book[]>;
  private messageChange: Subject<string>= new Subject<string>;

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<Book[]>(this.url);
  }

  findById(id: number){
    return this.http.get<Book>(`${this.url}/${id}`);
  }

  save(book: Book){
    return this.http.post(this.url, book);
  }

  update(id: number, book: Book){
    return this.http.put(`${this.url}/${id}`, book);
  }

  delete(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

  ///////////////
  setBookChange(data: Book[]){
    this.bookChange.next(data);
  }

  getBookChange(){
    return this.bookChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

}
