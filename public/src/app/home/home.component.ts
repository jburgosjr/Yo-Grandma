import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  newFamilyMember: any;
  errors = [];

  constructor(private _httpService: HttpService,  private _router: Router) { }

  ngOnInit() {
    this.newFamilyMember = {name: "", format: "", number: "", email: ""}
  }
    
  addFamilyMember(){
    console.log("~Component: addFamilyMember() initialzed~", this.newFamilyMember)
    this.errors = []
    var tempObs = this._httpService.postFamilyMember(this.newFamilyMember);
    tempObs.subscribe((data:any)=>{
      console.log("~Component: addFamilyMember() response~", data);
      if(data['errors']){
        for(var key in data["errors"]){
          console.log(data["errors"][key]["message"]);
          this.errors.push(data["errors"][key]["message"]);
        }
      }else{
        console.log("~Component: addFamilyMemmber() successful~")
        this.newFamilyMember = {name: "", format: "", number: "", email: ""}
        this._router.navigate(["/family"]);
      }      
    })
  }




}
