import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ParamsBuilderService {
  constructor() {}

  addPaging(params: any, page?: any, size?: any) {
    if (page) {
      params.page = page;
    }
    if (size) {
      params.pageSize = size;
    }
    return params;
  }
}
