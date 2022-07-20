import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../shared/services/firebase/authentication/authentication.service";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
  }

}
