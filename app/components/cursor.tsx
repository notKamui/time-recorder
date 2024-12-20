import { useTheme } from '@app/hooks/use-theme'
import { type SpringOptions, motion, useSpring } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const springConfig = {
  stiffness: 1000,
  damping: 70,
} satisfies SpringOptions

function hasButtonOrAnchorAncestor(element: HTMLElement | null): boolean {
  if (!element) return false
  if (element.tagName === 'BUTTON' || element.tagName === 'A') return true
  return hasButtonOrAnchorAncestor(element.parentElement)
}

export function Cursor() {
  const { theme } = useTheme()

  useEffect(() => {
    const style = document.createElement('style')
    style.appendChild(document.createTextNode('* { cursor: none !important; }'))
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const cursor = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const storedPosition =
    typeof localStorage !== 'undefined' &&
    localStorage.getItem('cursor-position')
  const initialPosition = useRef<{ x: number; y: number }>(
    storedPosition ? JSON.parse(storedPosition) : { x: 0, y: 0 },
  )

  const positionX = useSpring(initialPosition.current.x, springConfig)
  const positionY = useSpring(initialPosition.current.y, springConfig)

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!cursor.current) return

      const isHovered =
        e.target instanceof HTMLElement && hasButtonOrAnchorAncestor(e.target)
      setIsHovering(isHovered)

      positionX.set(e.clientX)
      positionY.set(e.clientY)

      localStorage.setItem(
        'cursor-position',
        JSON.stringify({ x: e.clientX, y: e.clientY }),
      )
    }

    initialPosition.current.x = window.innerWidth / 2
    initialPosition.current.y = window.innerHeight / 2

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [positionX.set, positionY.set])

  return (<motion.div
    ref={cursor}
    style={{
      position: 'fixed',
      left: positionX,
      top: positionY,
      pointerEvents: 'none',
      zIndex: 9999,
      translateX: '-50%',
      translateY: '-50%',
      transition: "transform 0.2s ease, opacity 0.2s ease",
      opacity: isHovering ? 0.5 : 1,
      scale: isHovering ? 1.7 : 1,
      width: 20,
      height: 20,
      borderRadius: '50%',
      backgroundColor: theme === 'dark' ? 'white' : 'black',
    }}
  />)
}
