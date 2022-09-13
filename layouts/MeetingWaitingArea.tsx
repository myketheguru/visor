/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { useMeet } from '../store';
import { Screenmirroring, Microphone, MicrophoneSlash, Video, VideoSlash } from 'iconsax-react'

const setTheme = () => {
    if (localStorage.theme !== 'dark') {
        localStorage.theme = 'dark'
        document.documentElement.classList.add('dark')
    } else {
        localStorage.theme = 'light'
        document.documentElement.classList.remove('dark')
    }
}

const MeetingWaitingArea = () => {
    const showVideoStream = useMeet(state => state.showVideoStream)
    const setShowVideoStream = useMeet(state => state.setShowVideoStream)
    const showAudioStream = useMeet(state => state.showAudioStream)
    const setShowAudioStream = useMeet(state => state.setShowAudioStream)
    const stream = useMeet(state => state.localStream)
    const setStream = useMeet(state => state.setLocalStream)
    const setMeetingStatus = useMeet(state => state.setMeetingStatus)
    const userVideo = useRef<any>()

    const startStream = (videoShown: boolean, audioAvailable: boolean) => {
        navigator.mediaDevices.getUserMedia({ video: videoShown, audio: audioAvailable }).then(mStream => {
            setStream(mStream);
            if (userVideo.current) {
              userVideo.current.srcObject = mStream;
            }
        })
    }
    
    const stopAudio = () => {
        stream?.getAudioTracks().forEach(track => track.stop())
    }

    const stopVideo = () => {        
        stream?.getVideoTracks().forEach(track => track.stop())
        userVideo.current.srcObject = null
    }

    useEffect(() => {
        if (showVideoStream && showAudioStream) {
            startStream(showVideoStream, showAudioStream)
        } else if (!showAudioStream && !showVideoStream) {
            stopAudio()
            stopVideo()
            setStream(undefined)
        } else if (!showAudioStream) {
            stopAudio()
            startStream(showVideoStream, showAudioStream)
        } else if (!showVideoStream) {
            stopVideo()
            startStream(showVideoStream, showAudioStream)
        }
    }, [showVideoStream, showAudioStream])
    

  return (
    <div className="waiting-area min-h-screen bg-slate-100 dark:bg-[#17181A] dark:text-gray-200 text-gray-600 flex flex-col">
        <div className="logo flex justify-center items-center gap-2 p-5">
            <span className='text-2xl font-thin'>Visor</span>
            <Screenmirroring size="32" color="#ca8a04"/>
        </div>
        <div className="flex flex-col md:flex-row flex-1 mt-20 px-[5%] md:px-[7%] lg:px-[10%] gap-5">
            <div className="display-user-media bg-slate-200 dark:bg-[#2f3034] flex-1 h-[500px] md:h-[400px] rounded-xl flex justify-center overflow-hidden relative">
                <video autoPlay muted ref={userVideo} className={`h-[440px] scale-x-[-1] w-auto object-cover ${stream?.getVideoTracks().length ? '' : 'hidden'}`} playsInline></video>
                <h1 className={`${stream?.getTracks().length === 0 ? 'm-auto font-light text-2xl' : 'hidden'}`}>Camera is starting</h1>
                <h1 className={`${stream?.getVideoTracks().length === 0 ? 'm-auto font-light text-2xl' : 'hidden'}`}>Camera is off</h1>
                <div className="overlay absolute w-full h-full top-0 left-0">
                    <div className="controls flex gap-4 absolute bottom-3 left-1/2 -translate-x-1/2 text-white">
                        <button className={`${!showAudioStream ? 'bg-red-600 border-none' : 'border hover:bg-[#fff8]'} w-14 h-14 rounded-full flex justify-center items-center`} onClick={() => setShowAudioStream(!showAudioStream)}>
                            {showAudioStream && <Microphone size={26} />}
                            {!showAudioStream && <MicrophoneSlash size={26} />}
                        </button>
                        <button className={`${!showVideoStream ? 'bg-red-600 border-none' : 'border  hover:bg-[#fff8]'} w-14 h-14 rounded-full flex justify-center items-center`} onClick={() => setShowVideoStream(!showVideoStream)}>
                            {showVideoStream && <Video size={20} />}
                            {!showVideoStream && <VideoSlash size={20} />}
                        </button>
                    </div>
                </div>
            </div>
            <div className="join-meet-info flex-1 h-[400px] rounded-xl p-5 flex flex-col justify-center items-center gap-3">
                <h1 className="text-3xl font-extralight">Ready for this?</h1>
                <p className='text-xs font-light text-[#7c7f87]'>No one else is here</p>
                <button className='bg-slate-300 dark:bg-[#2f3034] border border-slate-400 dark:border-[#45474c] p-2 px-5 rounded-full font-light transition-all hover:border-yellow-400 active:scale-95' onClick={() => { setMeetingStatus('started') }}>Join now</button>
            </div>
        </div>
    </div>
  )
}

export default MeetingWaitingArea

