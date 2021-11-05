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

@WebSocketGateway({
  cors: true,
  path: '/interview/new',
  namespace: 'interview/socket',
})
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
    this.server.in(sessionId).emit('CODE_CHANGED', code);
  }

  @SubscribeMessage('CODE_INSERTED')
  insert(client: Socket, { sessionId, ...data }: any): void {
    // console.log('insert');
    client.to(sessionId).emit('CODE_INSERTED', data);
  }

  @SubscribeMessage('CODE_REPLACED')
  replace(client: Socket, { sessionId, ...data }: any): void {
    // console.log('replace');
    client.to(sessionId).emit('CODE_REPLACED', data);
  }

  @SubscribeMessage('CODE_DELETED')
  delete(client: Socket, { sessionId, ...data }: any): void {
    // console.log('delete');
    client.to(sessionId).emit('CODE_DELETED', data);
  }

  @SubscribeMessage('CURSOR_CHANGED')
  cursor(client: Socket, { sessionId, ...data }: any): void {
    // console.log('cursor');
    client.to(sessionId).emit('CURSOR_CHANGED', data);
  }

  @SubscribeMessage('CONNECT_TO_ROOM')
  async joinRoom(
    client: Socket,
    {
      sessionId,
      userId,
      difficulty,
      language,
      time,
    }: {
      sessionId: string;
      userId: string;
      difficulty: DifficultyType;
      language: LanguageType;
      time: string;
    }
  ): Promise<void> {
    console.log(sessionId, userId, 'ServerReceiveClientWantsToJoinRoom');
    client.join(sessionId);
    const question = await this.redisService.getQuestion(sessionId);
    const currentTime = await this.redisService.getTime(sessionId);

    if (question && currentTime) {
      const code = await this.redisService.getCode(sessionId);

      this.server
        .in(sessionId)
        .emit('ROOM:CONNECTION', { question, code, time: currentTime });
    } else {
      const question = await firstValueFrom(
        this.leetcodeService.getRandomWithFallback(difficulty, language)
      );
      this.redisService.setCode(sessionId, question.code);
      this.redisService.setQuestion(sessionId, question);
      this.redisService.setTime(sessionId, time);

      this.server
        .in(sessionId)
        .emit('ROOM:CONNECTION', { question, code: question.code, time: time });
    }

    client.on('disconnecting', async () => {
      // deletion is unecessary (TTL and uuid 'uniqueness' reduces clash in sessions)
      // const numUsers = (await this.server.in(sessionId).allSockets()).size;
      // if (numUsers === 1) {
      //   // last user - clear cache
      //   console.log('Clearing session data for ', sessionId);
      //   this.redisService.deleteCache(sessionId);
      // }
      client.broadcast.in(sessionId).emit('leftRoom', { sessionId, userId });
      client.broadcast
        .in(sessionId)
        .emit('COMPLETE_SESSION_CONFIRM', { time: null });
    });
  }

  @SubscribeMessage('DISCONNECT_FROM_ROOM')
  leaveRoom(client: Socket, { sessionId, userId }: any): void {
    console.log(sessionId, userId, 'FromserverClientLeftRoom');
    client.leave(sessionId);
    this.server.in(sessionId).emit('leftRoom', { sessionId, userId });
  }

  @SubscribeMessage('GREET')
  greetUser(client: Socket, { sessionId, ...userDetails }: any): void {
    client.to(sessionId).emit('GREET', userDetails);
  }

  @SubscribeMessage('FORFEIT_SESSION')
  forfeitSession(client: Socket, { sessionId, forfeiterUserId }: any): void {
    console.log(sessionId, forfeiterUserId, 'FromserverClientForfeit');
    client.leave(sessionId);
    this.server
      .in(sessionId)
      .emit('partnerForfeited', sessionId, forfeiterUserId);
  }

  @SubscribeMessage('COMPLETE_SESSION_REQUEST')
  async requestCompleteSession(
    client: Socket,
    { sessionId, userId, ...data }: any
  ): Promise<void> {
    console.log(sessionId, userId, 'FromserverClientCompleteSessionRequest');
    const numUsers = (await this.server.in(sessionId).allSockets()).size;
    if (numUsers === 1) {
      this.server.in(sessionId).emit('COMPLETE_SESSION_CONFIRM', data);
    } else {
      client.to(sessionId).emit('COMPLETE_SESSION_REQUEST', data);
    }
  }

  @SubscribeMessage('COMPLETE_SESSION_CANCEL')
  cancelCompleteSessionRequest(
    client: Socket,
    { sessionId, userId, ...data }: any
  ): void {
    console.log(sessionId, userId, 'FromserverClientCompleteSessionCancel');
    client.to(sessionId).emit('COMPLETE_SESSION_CANCEL', data);
  }

  @SubscribeMessage('COMPLETE_SESSION_REJECT')
  rejectCompleteSession(
    client: Socket,
    { sessionId, userId, ...data }: any
  ): void {
    console.log(sessionId, userId, 'FromserverClientCompleteSessionReject');
    client.to(sessionId).emit('COMPLETE_SESSION_REJECT', data);
  }

  @SubscribeMessage('COMPLETE_SESSION_CONFIRM')
  confirmCompleteSession(
    client: Socket,
    { sessionId, userId, ...data }: any
  ): void {
    console.log(sessionId, userId, 'FromserverClientCompleteSessionConfirm');
    client.to(sessionId).emit('COMPLETE_SESSION_CONFIRM', data);
    this.server.in(sessionId).disconnectSockets(true);
  }

  afterInit(server: Server) {
    this.logger.log('Server Initialised');
  }

  handleDisconnect(client: Socket) {
    console.log(client.rooms);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
