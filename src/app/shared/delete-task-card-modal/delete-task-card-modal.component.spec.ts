import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTaskCardModalComponent } from './delete-task-card-modal.component';

describe('DeleteTaskCardModalComponent', () => {
  let component: DeleteTaskCardModalComponent;
  let fixture: ComponentFixture<DeleteTaskCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTaskCardModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTaskCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
