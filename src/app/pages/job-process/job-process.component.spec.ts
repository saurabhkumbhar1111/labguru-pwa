import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProcessComponent } from './job-process.component';

describe('ProcessPlanComponent', () => {
  let component: JobProcessComponent;
  let fixture: ComponentFixture<JobProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
