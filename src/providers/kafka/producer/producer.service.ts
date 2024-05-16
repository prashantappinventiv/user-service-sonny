import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class ProducerService {
  constructor(
    @Inject('CONSUMER_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  handleMessageProducer(message: string) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.authClient.send('message-topic', message).subscribe((user) => {
      console.log(`${user}`);
    });

    // this.authClient.send('message-topic', message);
  }
}
