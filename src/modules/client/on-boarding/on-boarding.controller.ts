import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { HttpResponse } from 'src/common/httpResponse';
import { HttpStatusCode } from 'axios';
import { RESPONSE_DATA } from 'src/common/responses';
import { Request, Response } from 'express';

import { ClientOnBoardingService } from './on-boarding.service';
import { UserGrpcService } from 'src/providers/grpc/user-activity/user-activity.service';
import { ClientKafka } from '@nestjs/microservices';
import { ProducerService } from 'src/providers/kafka/producer/producer.service';
@Controller('auth')
export class ClientOnBoardingController {
  constructor(
    private readonly appService: ProducerService,
    @Inject('CONSUMER_SERVICE') private readonly authClient: ClientKafka,
    // private onboardingService: ClientOnBoardingService,
    private readonly responseHandler: HttpResponse,
    private readonly userGrpc: UserGrpcService,
    private readonly onboardingService: ClientOnBoardingService,
  ) {}

  @Post('/signup')
  async signup(@Req() req: Request, @Res() res: Response) {
    try {
      const newUser = await this.onboardingService.signUp(req.body);
      return this.responseHandler.sendResponse(
        res,
        HttpStatusCode.Ok,
        true,
        RESPONSE_DATA.SUCCESS.message,
        newUser,
      );
    } catch (err: any) {
      return await this.responseHandler.sendErrorResponse(
        res,
        err.status,
        err?.message,
        err?.errors,
      );
    }
  }

  // @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const newUser = await this.onboardingService.login(req.body);
      return this.responseHandler.sendResponse(
        res,
        HttpStatusCode.Ok,
        true,
        RESPONSE_DATA.SUCCESS.message,
        newUser,
      );
    } catch (err: any) {
      return await this.responseHandler.sendErrorResponse(
        res,
        err.status,
        err?.message,
        err?.errors,
      );
    }
  }

  // @UseGuards(LocalAuthGuard)
  @Post('/fetch')
  async fetchDetails(@Req() req: Request, @Res() res: Response) {
    try {
      const UserDetails: any = req.body;
      console.log('userdetails', UserDetails);
      const newUser = await this.userGrpc.getUser(UserDetails);
      return this.responseHandler.sendResponse(
        res,
        HttpStatusCode.Ok,
        true,
        RESPONSE_DATA.SUCCESS.message,
        newUser,
      );
    } catch (err: any) {
      return await this.responseHandler.sendErrorResponse(
        res,
        err.status,
        err?.message,
        err?.errors,
      );
    }
  }

  @Post('/send-message')
  sendMessage(@Body('message') message: string) {
    this.appService.handleMessageProducer(message);
    console.log('message is successfully sent to kafka');
  }

  onModuleInit() {
    this.authClient.subscribeToResponseOf('user-topic');
    this.authClient.subscribeToResponseOf('message-topic')
    console.log("subscribing the topic")
  }
}
