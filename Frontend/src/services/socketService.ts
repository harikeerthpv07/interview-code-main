import { io, Socket } from "socket.io-client";

class SocketService {
  public socket: Socket | null = null;

  public connect(url: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      this.socket = io(url);

      this.socket.on("connect", () => {
        console.log("Connected to socket server");
        resolve(this.socket as Socket);
      });

      this.socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        reject(err);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from socket server:", reason);
      });
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public on(eventName: string, callback: (...args: any[]) => void): void {
    this.socket?.on(eventName, callback);
  }

  public emit(eventName: string, data: any): void {
    this.socket?.emit(eventName, data);
  }
}

export const socketService = new SocketService();
