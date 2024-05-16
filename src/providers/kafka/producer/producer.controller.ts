import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ProducerService } from './producer.service';

@Controller()
export class ProducerController {
  constructor(
    private readonly appService: ProducerService,
    @Inject('CONSUMER_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  @Post('/send-message')
  sendMessage(@Body('message') message: string) {
    this.appService.handleMessageProducer(message);
    console.log('message is successfully sent to kafka');
  }

  onModuleInit() {
    this.authClient.subscribeToResponseOf('user-topic');
  }
}
