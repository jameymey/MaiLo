'use client'

import { useEffect, useRef, useState } from 'react'
import { Cormorant_Garamond } from 'next/font/google'
import Header from './header'
import Footer from './footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

// Config (tweak as needed)
const SAMPLE_POLLING_MSECS = 50
const MAX_INTERSPEECH_SILENCE_MSECS = 600
const MIN_SIGNAL_DURATION = 400
const VOLUME_SIGNAL = 0.02
const VOLUME_SILENCE = 0.001
const VOLUME_MUTE = 0.0001
const MIN_AVERAGE_SIGNAL_VOLUME = 0.04

const DEFAULT_PARAMETERS_CONFIGURATION = {
  timeoutMsecs: SAMPLE_POLLING_MSECS,
  prespeechstartMsecs: 600,
  speakingMinVolume: VOLUME_SIGNAL,
  silenceVolume: VOLUME_SILENCE,
  muteVolume: VOLUME_MUTE,
  recordingEnabled: true,
}

function createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
  const processor = audioContext.createScriptProcessor(512)
  processor.onaudioprocess = function (event) {
    const buf = event.inputBuffer.getChannelData(0)
    const bufLength = buf.length
    let sum = 0
    for (let i = 0; i < bufLength; i++) {
      const x = buf[i]
      if (Math.abs(x) >= (processor.clipLevel || 0.98)) {
        processor.clipping = true
        processor.lastClip = window.performance.now()
      }
      sum += x * x
    }
    const rms = Math.sqrt(sum / bufLength)
    processor.volume = Math.max(rms, processor.volume * (processor.averaging || 0.95))
  }

  processor.clipping = false
  processor.lastClip = 0
  processor.volume = 0
  processor.clipLevel = clipLevel ?? 0.98
  processor.averaging = averaging ?? 0.95
  processor.clipLag = clipLag ?? 750
  processor.connect(audioContext.destination)

  processor.checkClipping = function () {
    if (!this.clipping) return false
    if (this.lastClip + this.clipLag < window.performance.now()) this.clipping = false
    return this.clipping
  }
  processor.shutdown = function () {
    this.disconnect()
    this.onaudioprocess = null
  }
  return processor
}

const dB = (signal) => -Math.round(20 * Math.log10(1 / Math.max(signal, 1e-12)))

export default function Cake() {
  const [micOn, setMicOn] = useState(false)
  const [done, setDone] = useState(false)
  const [debug, setDebug] = useState(false)

  const audioContextRef = useRef(null)
  const meterRef = useRef(null)
  const mediaStreamSourceRef = useRef(null)
  const recorderRef = useRef(null)
  const configRef = useRef({ ...DEFAULT_PARAMETERS_CONFIGURATION })

  const volumeStateRef = useRef('mute') // 'mute' | 'silence' | 'signal'
  const speechStartedRef = useRef(false)
  const silenceItemsRef = useRef(0)
  const signalItemsRef = useRef(0)
  const speechStartTimeRef = useRef(Date.now())
  const prerecordingItemsRef = useRef(0)
  const speechVolumesRef = useRef([])

  const dispatch = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }))
  const average = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)
  const averageSignal = () => average(speechVolumesRef.current)
  const maxSilenceItems = Math.round(MAX_INTERSPEECH_SILENCE_MSECS / SAMPLE_POLLING_MSECS)

  const suspendRecording = () => { configRef.current.recordingEnabled = false }
  const resumeRecording = () => { configRef.current.recordingEnabled = true }

  const setupMediaRecorder = (stream) => {
    const rec = new MediaRecorder(stream)
    recorderRef.current = rec
    rec.addEventListener('dataavailable', () => {
      suspendRecording()
      resumeRecording()
    })
  }

  const mute = (timestamp, duration) => {
    const meter = meterRef.current
    dispatch('mute', { event: 'mute', volume: meter.volume, timestamp, duration })
    if (volumeStateRef.current !== 'mute') {
      dispatch('mutedmic', { event: 'mutedmic', volume: meter.volume, timestamp, duration })
      volumeStateRef.current = 'mute'
    }
  }

  const signal = (timestamp, duration) => {
    const meter = meterRef.current
    silenceItemsRef.current = 0
    const items = ++signalItemsRef.current

    if (!speechStartedRef.current) {
      dispatch('speechstart', { event: 'speechstart', volume: meter.volume, timestamp, duration, items })
      speechStartTimeRef.current = timestamp
      speechStartedRef.current = true
      speechVolumesRef.current = []
    }

    speechVolumesRef.current.push(meter.volume)
    dispatch('signal', { event: 'signal', volume: meter.volume, timestamp, duration, items })

    if (volumeStateRef.current === 'mute') {
      dispatch('unmutedmic', { event: 'unmutedmic', volume: meter.volume, timestamp, duration })
      volumeStateRef.current = 'signal'
    }
  }

  const silence = (timestamp, duration) => {
    const meter = meterRef.current
    signalItemsRef.current = 0
    const items = ++silenceItemsRef.current
    dispatch('silence', { event: 'silence', volume: meter.volume, timestamp, duration, items })

    if (volumeStateRef.current === 'mute') {
      dispatch('unmutedmic', { event: 'unmutedmic', volume: meter.volume, timestamp, duration })
      volumeStateRef.current = 'silence'
    }

    if (speechStartedRef.current && silenceItemsRef.current === maxSilenceItems) {
      const signalDuration = duration - MAX_INTERSPEECH_SILENCE_MSECS
      const avg = averageSignal()
      if (signalDuration < MIN_SIGNAL_DURATION) {
        dispatch('speechabort', {
          event: 'speechabort',
          volume: meter.volume,
          timestamp,
          duration,
          abort: `signal duration (${signalDuration}) < MIN_SIGNAL_DURATION (${MIN_SIGNAL_DURATION})`,
        })
      } else if (avg < MIN_AVERAGE_SIGNAL_VOLUME) {
        dispatch('speechabort', {
          event: 'speechabort',
          volume: meter.volume,
          timestamp,
          duration,
          abort: `signal average volume (${avg.toFixed(4)}) < MIN_AVERAGE_SIGNAL_VOLUME (${MIN_AVERAGE_SIGNAL_VOLUME})`,
        })
      } else {
        dispatch('speechstop', { event: 'speechstop', volume: meter.volume, timestamp, duration })
      }
      speechStartedRef.current = false
    }
  }

  const sampleDecision = (muteVolume, speakingMinVolume) => {
    const meter = meterRef.current
    const timestamp = Date.now()
    const duration = timestamp - speechStartTimeRef.current
    if (meter.volume < muteVolume) mute(timestamp, duration)
    else if (meter.volume > speakingMinVolume) signal(timestamp, duration)
    else silence(timestamp, duration)
  }

  const prerecording = (prespeechstartMsecs, timeoutMsecs) => {
    prerecordingItemsRef.current += 1
    if (prerecordingItemsRef.current * timeoutMsecs >= prespeechstartMsecs) {
      if (!speechStartedRef.current) dispatch('prespeechstart', { timestamp: Date.now() })
      prerecordingItemsRef.current = 0
    }
  }

  const runDetectionLoop = () => {
    const cfg = configRef.current
    prerecording(cfg.prespeechstartMsecs, cfg.timeoutMsecs)
    if (cfg.recordingEnabled && meterRef.current) {
      sampleDecision(cfg.muteVolume, cfg.speakingMinVolume)
    }
    setTimeout(runDetectionLoop, cfg.timeoutMsecs)
  }

  useEffect(() => {
    const onSignal = (event) => {
      const val = event.detail?.volume ?? 0
      const valDb = dB(val)
      if (debug) console.log('signal dB', valDb)
      if (valDb >= -17) setDone(true)
    }
    const onUnmuted = () => setMicOn(true)
    const onMuted = () => setMicOn(false)

    document.addEventListener('signal', onSignal)
    document.addEventListener('unmutedmic', onUnmuted)
    document.addEventListener('mutedmic', onMuted)
    return () => {
      document.removeEventListener('signal', onSignal)
      document.removeEventListener('unmutedmic', onUnmuted)
      document.removeEventListener('mutedmic', onMuted)
    }
  }, [debug])

  useEffect(() => {
    return () => {
      try {
        meterRef.current?.shutdown?.()
        mediaStreamSourceRef.current?.disconnect?.()
        audioContextRef.current?.close?.()
      } catch {}
    }
  }, [])

  const start = async () => {
    try {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!audioContextRef.current) audioContextRef.current = new AC()
      await audioContextRef.current.resume()

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })

      const ctx = audioContextRef.current
      if (!ctx) return
      const source = ctx.createMediaStreamSource(stream)
      mediaStreamSourceRef.current = source
      const meter = createAudioMeter(ctx)
      meterRef.current = meter
      source.connect(meter)

      setupMediaRecorder(stream)
      runDetectionLoop()
    } catch (e) {
      alert('Microphone access failed. ' + (e?.message || e))
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <div className="grid-background z-0" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 
            className={`text-6xl md:text-7xl font-bold mb-8 ${cormorant.className}`}
            style={{ color: '#1f324f' }}
          >
            Make a Wish 🎂
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-12"
            style={{ color: '#1f324f', fontFamily: "'Myfont'" }}
          >
            Blow out the candle to reveal your surprise
          </p>
          
          <button 
            id="start" 
            onClick={start}
            className="px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mb-16"
            style={{ 
              backgroundColor: '#1f324f', 
              color: 'white',
              fontFamily: "'Myfont'"
            }}
          >
            Enable Microphone
          </button>
          
          <div id="cake-holder" className={done ? 'done' : ''} style={{ opacity: micOn ? 1 : 0.3, transition: 'opacity 0.5s ease' }}>
            <div className="cake">
              <div className="plate"></div>
              <div className="layer layer-bottom"></div>
              <div className="layer layer-middle"></div>
              <div className="layer layer-top"></div>
              <div className="icing"></div>
              <div className="drip drip1"></div>
              <div className="drip drip2"></div>
              <div className="drip drip3"></div>
              <div className="candle">
                <div className="flame"></div>
              </div>
            </div>
            <div className="text-center mt-64">
              <h2 
                className={`cake-off text-4xl md:text-5xl font-bold ${cormorant.className}`}
                style={{ color: '#1f324f' }}
              >
                Happy Anniversary, Baby
              </h2>
              <p className="cake-off text-xl mt-4" style={{ color: '#1f324f', fontFamily: "'Myfont'" }}>
                Your wish came true 💗
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .grid-background {
          position: fixed;
          inset: 0;
          background-image: 
            linear-gradient(rgba(31, 50, 79, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31, 50, 79, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }
        .cake { position: relative; width: 250px; height: 200px; margin: 0 auto; }
        .plate { width: 270px; height: 110px; position: absolute; bottom: -10px; left: -10px; background-color: #e8e8e8; border-radius: 50%; box-shadow: 0 2px 0 #d0d0d0, 0 4px 0 #d0d0d0, 0 5px 30px rgba(31,50,79,0.15); }
        .cake > * { position: absolute; }
        .layer { display: block; width: 250px; height: 100px; border-radius: 50%; background-color: #8b6f47; box-shadow: 0 2px 0px #a0825a, 0 4px 0px #6a5438, 0 6px 0px #695338, 0 8px 0px #685238, 0 10px 0px #675138, 0 12px 0px #665038, 0 14px 0px #654f37, 0 16px 0px #644e37, 0 18px 0px #634e37, 0 20px 0px #624d37, 0 22px 0px #614d37, 0 24px 0px #604c36, 0 26px 0px #5f4b36, 0 28px 0px #5e4b36, 0 30px 0px #5d4a36; }
        .layer-top { top: 0px; }
        .layer-middle { top: 33px; }
        .layer-bottom { top: 66px; }
        .icing { top: 2px; left: 5px; background-color: #fff5f0; width: 240px; height: 90px; border-radius: 50%; }
        .icing:before { content: ""; position: absolute; top: 4px; right: 5px; bottom: 6px; left: 5px; background-color: #fffaf7; box-shadow: 0 0 4px #ffffff, 0 0 4px #ffffff, 0 0 4px #ffffff; border-radius: 50%; z-index: 1; }
        .drip { display: block; width: 50px; height: 60px; border-bottom-left-radius: 25px; border-bottom-right-radius: 25px; background-color: #fff5f0; }
        .drip1 { top: 53px; left: 5px; transform: skewY(15deg); height: 48px; width: 40px; }
        .drip2 { top: 69px; left: 181px; transform: skewY(-15deg); }
        .drip3 { top: 54px; left: 90px; width: 80px; border-bottom-left-radius: 40px; border-bottom-right-radius: 40px; }
        .candle { 
          position: absolute;
          top: -65px; 
          left: 50%; 
          margin-left: -20px; 
          z-index: 10;
          width: 40px;
          height: 60px;
          font-size: 70px;
          font-weight: bold;
          color: #d4a373;
          text-shadow: 2px 2px 4px rgba(31,50,79,0.3);
          font-family: Arial, sans-serif;
        }
        .candle:before { 
          content: "3";
          position: absolute;
          top: 0;
          left: 0;
        }
        .flame { position: absolute; background: linear-gradient(to top, #ff6b35, #f7931e, #fdc830); width: 15px; height: 35px; border-radius: 10px 10px 10px 10px / 25px 25px 10px 10px; top: -25px; left: 50%; margin-left: -7.5px; z-index: 10; box-shadow: 0 0 10px rgba(255,165,0,0.5), 0 0 20px rgba(255,165,0,0.5), 0 0 60px rgba(255,165,0,0.5), 0 0 80px rgba(255,165,0,0.5); transform-origin: 50% 90%; animation: flicker 1s ease-in-out alternate infinite; }
        @keyframes flicker {
          0% { transform: skewX(5deg); box-shadow: 0 0 10px rgba(255,165,0,0.2), 0 0 20px rgba(255,165,0,0.2), 0 0 60px rgba(255,165,0,0.2), 0 0 80px rgba(255,165,0,0.2); }
          25% { transform: skewX(-5deg); box-shadow: 0 0 10px rgba(255,165,0,0.5), 0 0 20px rgba(255,165,0,0.5), 0 0 60px rgba(255,165,0,0.5), 0 0 80px rgba(255,165,0,0.5); }
          50% { transform: skewX(10deg); box-shadow: 0 0 10px rgba(255,165,0,0.3), 0 0 20px rgba(255,165,0,0.3), 0 0 60px rgba(255,165,0,0.3), 0 0 80px rgba(255,165,0,0.3); }
          75% { transform: skewX(-10deg); box-shadow: 0 0 10px rgba(255,165,0,0.4), 0 0 20px rgba(255,165,0,0.4), 0 0 60px rgba(255,165,0,0.4), 0 0 80px rgba(255,165,0,0.4); }
          100% { transform: skewX(5deg); box-shadow: 0 0 10px rgba(255,165,0,0.5), 0 0 20px rgba(255,165,0,0.5), 0 0 60px rgba(255,165,0,0.5), 0 0 80px rgba(255,165,0,0.5); }
        }
        #cake-holder .cake-off { opacity: 0; transition: 1s ease-in all; }
        #cake-holder.done .cake-off { opacity: 1; transition: 1s ease-in all; }
        #cake-holder .cake .flame { opacity: 1; transition: 0.3s ease-in all; }
        #cake-holder.done .flame { opacity: 0; }
      `}</style>
    </div>
  )
}