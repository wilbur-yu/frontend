import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { ConversationService } from "@service";
import { zip } from "rxjs";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.less"],
})
export class ChatComponent implements OnInit {
  assignedData = [];
  unassignedData = [];
  parmaTypes = {
    assigned: {
      type: "assigned",
    },
    unassigned: {
      type: "unassigned",
    },
  };
  selectId: number = Number(localStorage.getItem("selectId"));
  constructor(
    private http: _HttpClient,
    private router: Router,
    private conversationSrv: ConversationService
  ) {
    router.events.subscribe((evt) => {
      if (evt instanceof NavigationStart) {
        if (evt.url === "/conversation/chat") {
          this.doNav();
        }
      }
    });
  }

  ngOnInit(): void {
    this.getConversationList();
  }

  getConversationList(): void {
    zip(
      this.conversationSrv.getVistorList(this.parmaTypes.assigned),
      this.conversationSrv.getVistorList(this.parmaTypes.unassigned)
    ).subscribe(([assignedData, unassignedData]) => {
      this.assignedData = assignedData.data.conversations;
      this.unassignedData = unassignedData.data.conversations;
      this.doNav();
    });
  }

  doNav(): void {
    if (this.assignedData.length > 0) {
      if (this.selectId) {
        const arr = [...this.assignedData, ...this.unassignedData];
        for (const i of arr) {
          if (i.id === this.selectId) {
            this.navigate(this.selectId);
          }
        }
      } else {
        this.navigate(this.assignedData[0].id);
        localStorage.setItem(
          "selectId",
          JSON.stringify(this.assignedData[0].id)
        );
      }
    } else {
      this.navigate(0);
    }
  }

  to(item: { id: number }): void {
    this.selectId = item.id;
    localStorage.setItem("selectId", JSON.stringify(item.id));
    this.navigate(item.id);
  }

  navigate(id: number): void {
    const url = `/conversation/chat/${id}`;
    this.router.navigateByUrl(url);
  }
}