import { TestBed } from '@angular/core/testing';

import { HttpCacheService } from './http-cache.service';

describe('HttpCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpCacheService
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpCacheService = TestBed.inject(HttpCacheService);
    expect(interceptor).toBeTruthy();
  });
});
