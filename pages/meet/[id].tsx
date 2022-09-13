import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { useMeet } from '../../store'

import Peer from 'peerjs'
import MeetingWaitingArea from '../../layouts/MeetingWaitingArea'
import MeetingRoom from '../../layouts/MeetingRoom'
import MeetingEnded from '../../layouts/MeetingEnded'

const Meet: NextPage<{ ws: Socket }> = ({ ws }) => {
    const router = useRouter()
    const me = useMeet(state => state.me)
    const meId = useMeet(state => state.meId)
    const setMe = useMeet(state => state.setMe)
    const meetingStatus = useMeet(state => state.meetingStatus)
    const stream = useMeet(state => state.localStream)
    const addPeerStream = useMeet(state => state.addPeerStream)
    const peers = useMeet(state => state.peers)

    const getUsers = ({ participants }: { participants: string[] }) => {
        console.log(participants)
    }

    // Function solves the 'Navigator not defined error - nextjs'
    const createPeer = async () => {
        const PeerJs = (await import('peerjs')).default;
        // set it to state here
        const peer = new PeerJs(meId)
        setMe(peer)
        console.log(peer)
    }

    useEffect(() => {
        createPeer()
        ws.on("get-users", getUsers)
    }, [])
    
    useEffect(() => {
        if (me) {
            ws.emit("join-room", { roomId: router.query.id, peerId: me?.id })
        }
    }, [router.query.id, me, ws])

    useEffect(() => {
        if (!me) return
        if (!stream) return

        
        ws.on("user-joined", ({ peerId }) => {
            console.log("fired")
            const call = me.call(peerId, stream)
            call.on("stream", (peerStream) => {
                addPeerStream({ peerId, stream: peerStream })
            })
        })

        me.on("call", (call) => {
            call.answer(stream)
            call.on("stream", (peerStream) => {
                addPeerStream({ peerId: call.peer, stream: peerStream })
            })
        })

    }, [me, stream, ws])

    useEffect(() => {
        console.log(peers)
    }, [peers])
    
    

    return (
        <div className="meeting-room">
            { 
                meetingStatus === 'waiting' ? <MeetingWaitingArea /> :
                meetingStatus === 'started' ? <MeetingRoom /> :
                <MeetingEnded />
            }    
        </div>
      )
}

export default Meet