import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notify-user',
  templateUrl: './notify-user.component.html',
  styleUrls: ['./notify-user.component.scss']
})
export class NotifyUserComponent implements OnInit {
  @Input() notifyUser: any;

  constructor(public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

}
