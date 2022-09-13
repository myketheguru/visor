import Peer from "peerjs";
import create from "zustand";
import { v4 as uuidv4 } from 'uuid'

interface IMeetState {
    meetingStatus: ('waiting' | 'started' | 'ended')
    localStream?: MediaStream
    showVideoStream: boolean,
    showAudioStream: boolean,
    peers?: any
    setMeetingStatus: (type: ('waiting' | 'started' | 'ended')) => void
    setLocalStream: (stream?: MediaStream) => void
    setShowVideoStream: (show?:boolean) => void
    setShowAudioStream: (show?:boolean) => void
    addPeerStream: (peer: {peerId: string, stream: MediaStream}) => void
    removePeerStream: (peerId:string) => void
    me?: Peer,
    meId: string
    setMe: (me: Peer) => void 
}

export const useMeet = create<IMeetState>((set) => ({
    me: undefined,
    meId: uuidv4(),
    setMe: (me) => {
        set((state) => ({ me }))
    },
    meetingStatus: 'waiting',
    peers: {},
    localStream: undefined,
    showVideoStream: true,
    showAudioStream: true,
    socket: null,
    setMeetingStatus: (status: IMeetState['meetingStatus']) => set(state => ({
        meetingStatus: status
    })),
    setLocalStream: (stream = undefined) => set(state => ({
        localStream: stream
    })),
    setShowVideoStream: (show?:boolean) => set(state => ({
        showVideoStream: show ?? !state.showVideoStream
    })),
    setShowAudioStream: (show?:boolean) => set(state => ({
        showAudioStream: show ?? !state.showAudioStream
    })),
    addPeerStream: ({peerId, stream}) => set(state => {
        console.log(state.peers, 'peers')
        return {
            peers: { ...state.peers, [peerId]: { ...state.peers[peerId], stream: stream } }
        }

    }),
    removePeerStream: (peerId: string) => set(state => ({
        peers: { ...state.peers, [peerId]: { ...state.peers[peerId], stream: undefined } }
    })),
}))