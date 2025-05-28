import { Injectable } from '@angular/core';
import { Mascota } from '../model/mascota';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {

   private url: string=`${environment.HOST}/mascota`;
    private mascotaChange: Subject<Mascota[]>= new Subject<Mascota[]>;
    private messageChange: Subject<string>= new Subject<string>;
  
    constructor(private http: HttpClient) { }
  
    findAll(){
      return this.http.get<Mascota[]>(this.url);
    }
  
    findById(id: number){
      return this.http.get<Mascota>(`${this.url}/${id}`);
    }
  
    save(mascota: Mascota){
      return this.http.post(this.url, mascota);
    }
  
    update(id: number, mascota: Mascota){
      return this.http.put(`${this.url}/${id}`, mascota);
    }
  
    delete(id: number){
      return this.http.delete(`${this.url}/${id}`);
    }
  
    ///////////////
    setMascotaChange(data: Mascota[]){
      this.mascotaChange.next(data);
    }
  
    getMascotaChange(){
      return this.mascotaChange.asObservable();
    }
  
    setMessageChange(data: string){
      this.messageChange.next(data);
    }
  
    getMessageChange(){
      return this.messageChange.asObservable();
    }
}
