import { useEffect, useRef } from 'react'

export function Canvas({
  id,
  height,
  draw,
}: {
  id: string
  height: number
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const wrap = canvas.parentElement
    if (!wrap) return
    let raf = 0

    const resize = () => {
      const w = wrap.offsetWidth || 600
      const h = height
      canvas.width = w
      canvas.height = h
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      draw(ctx, w, h)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(wrap)

    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [draw, height, id])

  return <canvas ref={ref} id={id} />
}