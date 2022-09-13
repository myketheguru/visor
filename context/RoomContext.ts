import { createContext } from 'react'
import socketIOClient from 'socket.io-client'
const WS = 'http://localhost:8080'

export const RoomContext = createContext<null | any>(null)

export const ws = socketIOClient(WS)
