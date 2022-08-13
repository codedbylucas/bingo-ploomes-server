import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(baseUrl: string) {
    return {
      status: 'Bingo Ploomes is running! 🚀',
      docs: baseUrl + '/api',
    };
  }
}
