import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : {};

  constructor() {

  }

  ngOnInit(): void {
  }

}
