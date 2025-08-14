import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { TaskCardComponent } from '../../shared/task-card/task-card.component';

@Component({
  selector: 'app-board-page',
  imports: [ButtonComponent, CdkDropList, CdkDrag, CdkDropListGroup, TaskCardComponent],
  templateUrl: './board-page.component.html',
  styleUrl: './board-page.component.scss',
})
export class BoardPageComponent {
  board = {
    lists: [
      {
        name: 'To do',
        items: ['Header einbauen', 'Footer einbauen'],
      },
      {
        name: 'In progress',
        items: ['Kochen', 'Putzen'],
      },
      {
        name: 'Await feedback',
        items: ['Kontaktliste bauen'],
      },
      {
        name: 'Done',
        items: ['Hausaufgaben'],
      },
    ],
  };

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  others(currentListName: string) {
    let otherLists: string[] = [];
    this.board.lists.forEach((list) => {
      if (list.name !== currentListName) {
        otherLists.push(list.name);
      }
    });
    return otherLists;
  }
}
