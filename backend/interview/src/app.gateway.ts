import {
  DifficultyType,
  LanguageType,
} from './leetcode/dto/leetcode-question.dto';
import { LeetcodeService } from './leetcode/leetcode.service';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { firstValueFrom } from 'rxjs';
import { RedisCacheService } from './redis/redisCache.service';

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly leetcodeService: LeetcodeService
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('CODE_CHANGED')
  notifyClients(client: Socket, { sessionId, code }: any): void {
    this.redisService.setCode(sessionId, code);
    client.broadcast.emit('CODE_CHANGED', code);
  }

  @SubscribeMessage('CODE_INSERTED')
  insert(client: Socket, data: any): void {
    console.log('insert');
    client.broadcast.emit('CODE_INSERTED', data);
  }

  @SubscribeMessage('CODE_REPLACED')
  replace(client: Socket, data: any): void {
    console.log('replace');
    client.broadcast.emit('CODE_REPLACED', data);
  }

  @SubscribeMessage('CODE_DELETED')
  delete(client: Socket, data: any): void {
    console.log('delete');
    client.broadcast.emit('CODE_DELETED', data);
  }

  @SubscribeMessage('CURSOR_CHANGED')
  cursor(client: Socket, data: any): void {
    console.log('cursor');
    client.broadcast.emit('CURSOR_CHANGED', data);
  }

  @SubscribeMessage('CONNECTED_TO_ROOM')
  async joinRoom(
    client: Socket,
    {
      sessionId,
      userId,
      difficulty,
      language,
    }: {
      sessionId: string;
      userId: string;
      difficulty: DifficultyType;
      language: LanguageType;
    }
  ): Promise<void> {
    console.log(sessionId, userId, 'FromserverClientJoinRoom');
    client.join(sessionId);
    const question = await this.redisService.getQuestion(sessionId);

    if (question) {
      const code = await this.redisService.getCode(sessionId);

      this.server.in(sessionId).emit('ROOM:CONNECTION', { question, code });
    } else {
      const question = await firstValueFrom(
        this.leetcodeService.getRandomWithFallback(difficulty, language)
      );
      this.redisService.setCode(sessionId, question.code);
      this.redisService.setQuestion(sessionId, question);

      this.server
        .in(sessionId)
        .emit('ROOM:CONNECTION', { question, code: question.code });
    }
  }

  @SubscribeMessage('DISCONNECT_FROM_ROOM')
  leaveRoom(client: Socket, { sessionId, userId }: any): void {
    console.log(sessionId, userId, 'FromserverClientLeftRoom');
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
