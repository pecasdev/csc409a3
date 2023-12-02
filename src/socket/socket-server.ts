import WebSocket from 'ws'

import { Cache } from '../api/cache/cache'
import { Board } from '../domain/board'

import { Connection } from './connection'
import { Database } from '../api/database/database'
import { DevCache } from '../api/cache/impl/dev-cache'
import { UserHandler } from '../domain/user-handler'

export class SocketServer {
  wss: WebSocket.Server
  database: Database
  cache: Cache = new DevCache()
  board: Board = new Board()
  userHandler: UserHandler

  async setup(): Promise<void> {
    const data = await this.database.getAndFormatBoard()
    this.board = new Board(data)
    return this.cache.setBoard(this.board)
  }

  constructor(database: Database) {
    this.wss = new WebSocket.Server({ port: 8081 })
    this.database = database
    this.userHandler = new UserHandler(this.database)
    this.setBindings()
  }

  async getBoard(): Promise<Board> {
    return this.cache.getBoard()
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
