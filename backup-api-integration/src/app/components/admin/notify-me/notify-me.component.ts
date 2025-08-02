import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifyMeService } from 'src/app/services/notifyMeService/notify-me.service';
import { ToyService } from 'src/app/services/toy.service';
import { environment } from 'src/environments/environment';
import { NotifyUserComponent } from './notify-user/notify-user.component';
import { ToasterService } from 'src/app/services/toaster.service';
import { ToastType } from 'src/app/services/toaster';
// import { NotifyUserComponent } from './notify-user/notify-user.component';

@Component({
  selector: 'app-notify-me',
  templateUrl: './notify-me.component.html',
  styleUrls: ['./notify-me.component.scss']
})
export class NotifyMeComponent implements OnInit {

  notify_me_list: any[] = [];
  tableSize = environment.tableSize;
  page: number = 1;
  count: number = 0;

  constructor(private notifyme_service: NotifyMeService, private toyService: ToyService,
    private modalService: NgbModal, private toster: ToasterService) { }

  ngOnInit(): void {
    this.getAllNotification();
  }

  getAllNotification() {
    this.notifyme_service.getNotificationSummary().subscribe(notifyme => {
      this.notify_me_list = notifyme;
      this.count = this.notify_me_list?.length;
    })
  }

  getItemName(id: number) {
    return this.toyService.getToyByIdNonObj(id)?.name;
  }

  getItemImg(id: number) {
    return this.toyService.getToyByIdNonObj(id)?.thumbnail;
  }

  viewUserDetails(notify) {
    const modalRef = this.modalService.open(NotifyUserComponent, {
      size: "md",
    });

    if (notify && notify.users) {
      const uniqueUsers = [...new Set(notify.users)];
      modalRef.componentInstance.notifyUser = uniqueUsers;
    }
  }

  sendNotification(notify) {
    this.notifyme_service.sendNotificationsForItem(notify.itemId).subscribe(val => {
      this.toster.showToast("Notification send to customer for the item", ToastType.Success, 3000)
      this.notifyme_service.clearCache();
      this.getAllNotification();
    })
  }
}
