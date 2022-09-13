import { Screenmirroring, Keyboard } from 'iconsax-react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {Socket} from 'socket.io-client'
import { useMeet } from '../store'

const Home: NextPage<{ws: Socket}> = ({ ws }) => {

  const router = useRouter()

  const createRoom = () => {
    ws.emit("create-room")
  }

  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log({ roomId })
    router.push(`/meet/${roomId}`)
  }



  useEffect(() => {
    ws.on("room-created", enterRoom)
  }, [])
  

  return (
    <div className='landing min-h-screen grid grid-rows-[auto_1fr] bg-slate-100 dark:bg-[#17181A] dark:text-gray-200 text-gray-600 p-5 px-[10%]'>
      <div className="logo flex justify-center items-center gap-2">
        <span className='text-2xl font-thin'>Visor</span>
        <Screenmirroring size="32" color="#ca8a04"/>
      </div>
      <main className='flex flex-col items-center py-20 max-w-[600px] w-full mx-auto text-center'>
        <h1 className='text-[8vmin] leading-tight font-semibold text-[#535760]'>Host meetings a wizard would envy!</h1>
        <p className='text-gray-600 text-lg'>And the best part... It's Free!</p>
        <div className="cta flex flex-col md:flex-row items-center gap-3 py-12">
          <button className='p-2 px-6 rounded-md md:rounded-full bg-gray-200 dark:bg-[#222426] font-extralight transition-all border border-yellow-600 active:scale-95  disabled:opacity-30 disabled:border-none disabled:active:scale-100 h-12 w-full' onClick={createRoom}>
            New meeting
          </button>
          <div className="user-input-area flex gap-4">
            <div className="bg-slate-200 dark:bg-[#242628] flex input-block relative w-[280px] p-2 px-3 border border-slate-300 dark:border-[#3f4145] rounded-md gap-2 h-12">
              <Keyboard size="25" className='self-center' color="#ca8a04"/>
              <input type="text" placeholder='Enter meet code or paste link' className=' w-full outline-none border-none font-light text-sm focus:border focus:border-[#ca8a04] bg-transparent' name='meet-code' />
            </div>
            <button className='disabled:text-gray-700' disabled>Join</button>
          </div>
        </div>

        <footer className='text-gray-600 mt-6 font-light text-sm'>
          <p>&copy; { new Date().getFullYear() }. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}

export default Home
