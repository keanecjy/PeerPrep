import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit{
  private logger: Logger = new Logger("AppGateway");

  afterInit(server:any) {
    this.logger.log("intialised");
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
