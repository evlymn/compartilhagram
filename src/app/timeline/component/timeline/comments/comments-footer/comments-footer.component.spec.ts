import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsFooterComponent } from './comments-footer.component';

describe('CommentsFooterComponent', () => {
  let component: CommentsFooterComponent;
  let fixture: ComponentFixture<CommentsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentsFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
