import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ws } from '../room-context/RoomContext'


function MyApp({ Component, pageProps }: AppProps) {
  return <Component ws={ws} {...pageProps} />
}

export default MyApp
