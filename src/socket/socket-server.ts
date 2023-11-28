import WebSocket from 'ws'

import { Cache } from '../api/cache/cache'
import { Board } from '../domain/board'

import { Connection } from './connection'

export class SocketServer {
  wss: WebSocket.Server

  constructor(public cache: Cache, public board: Board) {
    this.wss = new WebSocket.Server({ port: 8081 })
    this.setBindings()
  }

  private setBindings() {
    this.wss.on('close', onClose(this))
    this.wss.on('connection', onConnection(this))
  }

  broadcast(data: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState == WebSocket.OPEN) {
        client.send(data)
      }
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onClose(wss: SocketServer) {
  return () => console.log('disconnected')
}

function onConnection(wss: SocketServer) {
  return (webSocket: WebSocket) => {
    new Connection(webSocket, wss)
  }
}
