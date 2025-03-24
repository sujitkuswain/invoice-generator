import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDataDetailsComponent } from './history-data-details.component';

describe('HistoryDataDetailsComponent', () => {
  let component: HistoryDataDetailsComponent;
  let fixture: ComponentFixture<HistoryDataDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryDataDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryDataDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
