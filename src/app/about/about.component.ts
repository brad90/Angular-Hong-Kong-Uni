import { Component, OnInit } from '@angular/core';
import { LeadersService } from '../services/leaders.service';
import { Leader } from '../shared/leader';
import { flyInOut } from '../animations/app.animations'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations:[
    flyInOut()
  ]
})
export class AboutComponent implements OnInit {

  leaders: Leader[]

  selectedLeader: Leader

  constructor(
    private leadersService: LeadersService
  ) { }

  ngOnInit() {
    this.leadersService.getLeaders()
    .subscribe(leaders => this.leaders = leaders)
  }

  onselect(leader:Leader){
    this.selectedLeader = leader
  }

}
