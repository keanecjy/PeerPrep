import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, msg: any): void {
    this.server.emit(msg.sessionId, msg.payload);
  }

  @SubscribeMessage('CODE_CHANGED')
  notifyClients(client: Socket, roomId: any, code: string): void {
    const roomName = `ROOM:${roomId}`
    this.server.to(roomName).emit('CODE_CHANGED', code);
  }

  @SubscribeMessage('CONNECTED_TO_ROOM')
  joinRoom(client: Socket, roomId: any, userName: any): void {
    client.join(roomId);
    this.server.in(roomId).emit('ROOM:CONNECTION', userName);
  }

  @SubscribeMessage('DISCONNECT_FROM_ROOM')
  leaveRoom(client: Socket, roomId: any, userName: any): void {
    client.leave(roomId);
    client.emit('leftRoom', roomId);
  }
  

  afterInit(server: Server) {
      this.logger.log('Server Initialised');
  }

  handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, room:string) {
      this.logger.log(`Client connected: ${client.id}`);
  
  }
}
