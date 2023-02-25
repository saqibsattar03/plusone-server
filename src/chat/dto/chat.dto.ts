export class ChatDto {
  senderId: any;
  to: any;
  conversation: {
    message: string;
    senderId: any;
  };
}
