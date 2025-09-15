import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  webSocketServer: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    // console.log('Cliente conectado: ', client.id);
    this.messagesWsService.registerClient(client);

    // De esta manera le enviamos la comunicación a nuestro cliente, pero debemos esperar a que la reciba (escuche)
    this.webSocketServer.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );

    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado: ', client.id);
    this.messagesWsService.removeClient(client.id);

    this.webSocketServer.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(
    client: Socket,
    // DTO creado de acuerdo a lo que se recibirá
    payload: NewMessageDto,
  ) {
    console.log(client.id, payload);
  }
}
