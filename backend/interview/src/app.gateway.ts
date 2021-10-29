import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('CODE_CHANGED')
  notifyClients(client: Socket, { sessionId, code }: any): void {
    console.log(code);
    this.server.in(sessionId).emit('CODE_CHANGED', code);
  }

  @SubscribeMessage('CONNECTED_TO_ROOM')
  joinRoom(client: Socket, { sessionId, userId }: any): void {
    console.log(sessionId, userId, "FromserverClientJoinRoom");
    client.join(sessionId);
    this.server.in(sessionId).emit('ROOM:CONNECTION', userId);
  }

  @SubscribeMessage('DISCONNECT_FROM_ROOM')
  leaveRoom(client: Socket, { sessionId, userId }: any): void {
    console.log(sessionId, userId, "FromserverClientLeftRoom");
    client.leave(sessionId);
    this.server.emit('leftRoom', sessionId, userId);
  }

  afterInit(server: Server) {
    this.logger.log('Server Initialised');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, room: string) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
