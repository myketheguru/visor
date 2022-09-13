import '../styles/globals.css'
import socketIOClient from 'socket.io-client'
import type { AppProps } from 'next/app'
// import { ws } from '../room-context/RoomContext'

const WS = 'http://localhost:8080'
export const ws = socketIOClient(WS)


function MyApp({ Component, pageProps }: AppProps) {
  return <Component ws={ws} {...pageProps} />
}

export default MyApp
