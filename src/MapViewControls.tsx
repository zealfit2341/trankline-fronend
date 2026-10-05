import { useEffect, useState, type RefObject } from 'react'
import { Maximize2, Minimize2, PictureInPicture2 } from 'lucide-react'

type Props = {
  targetRef: RefObject<HTMLElement>
  pipMode: boolean
  onPipChange: (value: boolean) => void
}

export default function MapViewControls({ targetRef, pipMode, onPipChange }: Props) {
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => setFullscreen(document.fullscreenElement === targetRef.current)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [targetRef])

  const toggleFullscreen = async () => {
    const target = targetRef.current
    if (!target) return
    try {
      if (document.fullscreenElement === target) await document.exitFullscreen()
      else {
        if (document.fullscreenElement) await document.exitFullscreen()
        await target.requestFullscreen()
      }
    } catch { /* Fullscreen can be blocked by browser policy; the map remains usable. */ }
  }

  return <div className="map-view-controls" aria-label="Map view controls">
    <button type="button" onClick={() => onPipChange(!pipMode)} className={pipMode ? 'active' : ''} title={pipMode ? 'Close floating map' : 'Keep map floating'} aria-label={pipMode ? 'Close floating map' : 'Keep map floating'}><PictureInPicture2 size={16} /></button>
    <button type="button" onClick={() => void toggleFullscreen()} title={fullscreen ? 'Exit fullscreen' : 'View map fullscreen'} aria-label={fullscreen ? 'Exit fullscreen' : 'View map fullscreen'}>{fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
  </div>
}
