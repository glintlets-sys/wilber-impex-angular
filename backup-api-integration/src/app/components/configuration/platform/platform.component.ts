import { Component, OnInit } from '@angular/core';
import { Platform } from 'src/app/services/configurationInterface/platform';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent implements OnInit {

  platform: Platform
  constructor() {
    this.platform = { serviceURL: '' }
  }

  ngOnInit(): void {

  }

  savePlatform() {

  }

}
