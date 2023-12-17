import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async send(user: any) {
    return user;
  }
}
