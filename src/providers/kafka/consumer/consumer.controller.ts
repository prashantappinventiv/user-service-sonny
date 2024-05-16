import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ConsumerController {
  @MessagePattern('user-topic')
  handleMessage(data: any) {
    console.log(`Received message from topic "message-topic": ${data}`);
    return 'okay';
  }
}
