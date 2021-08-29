import { TestBed } from '@angular/core/testing';

import { ProgressbarInterceptor } from './progressbar.interceptor';

describe('ProgressbarInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ProgressbarInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ProgressbarInterceptor = TestBed.inject(ProgressbarInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
