import { type Variants, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [caretHeight, setCaretHeight] = useState(0)

  const variants = {
    default: {},
    pointer: {
      backgroundColor: 'transparent',
      border: '2px solid #ffffff',
      width: 40,
      height: 40,
    },
    caret: {
      borderRadius: '0%',
      width: 2,
      height: caretHeight,
    },
  } satisfies Variants

  const [cursorVariant, setCursorVariant] =
    useState<keyof typeof variants>('default')

  useEffect(() => {
    function mouseMove(e: MouseEvent) {
      const cursor = ref.current
      if (!cursor) return
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
    }

    function mouseEnter(e: MouseEvent) {
      if (!(e.target instanceof HTMLElement)) return

      const computedStyle = window.getComputedStyle(e.target)
      if (computedStyle.cursor === 'pointer') {
        setCursorVariant('pointer')
      } else if (computedStyle.cursor === 'text') {
        setCursorVariant('caret')
        setCaretHeight(e.target.clientHeight)
      } else {
        setCursorVariant('default')
      }
    }

    function mouseLeave() {
      setCursorVariant('default')
    }

    window.addEventListener('pointermove', mouseMove)
    window.addEventListener('pointerover', mouseEnter)
    window.addEventListener('pointerout', mouseLeave)

    return () => {
      window.removeEventListener('pointermove', mouseMove)
      window.removeEventListener('pointerover', mouseEnter)
      window.removeEventListener('pointerout', mouseLeave)
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      className="pointer-events-none fixed z-[9999]"
      variants={variants}
      animate={cursorVariant}
      style={{
        translateX: '-50%',
        translateY: '-50%',
        borderRadius: '50%',
        width: 20,
        height: 20,
        backgroundColor: '#ffffff',
      }}
    />
  )
}
