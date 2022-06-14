import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageProfileDialogComponent } from './image-profile-dialog.component';

describe('ImageProfileDialogComponent', () => {
  let component: ImageProfileDialogComponent;
  let fixture: ComponentFixture<ImageProfileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageProfileDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
