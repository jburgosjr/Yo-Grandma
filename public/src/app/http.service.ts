import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) { }

  //FamilyMembers
  getAllFamilyMembers(){
    console.log("~Service: getAllFamilyMembers() initialized~");
    return this._http.get("/api/family");
  }

  postFamilyMember(familyObj){
    console.log("~Service: postFamilyMember() initialized~", familyObj);
    return this._http.post("/api/family", familyObj);
  }
}