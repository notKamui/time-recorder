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
      if (cursor) {
        cursor.style.left = `${e.clientX}px`
        cursor.style.top = `${e.clientY}px`
      }
    }

    function mouseEnter(e: MouseEvent) {
      if (!(e.target instanceof HTMLElement)) return

      if (
        e.target.tagName === 'A' ||
        e.target.tagName === 'BUTTON' ||
        e.target.classList.contains('clickable')
      ) {
        setCursorVariant('pointer')
      } else if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'P' ||
        e.target.isContentEditable
      ) {
        setCursorVariant('caret')
        setCaretHeight(e.target.clientHeight)
      } else {
        setCursorVariant('default')
      }
    }

    function mouseLeave() {
      setCursorVariant('default')
    }

    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseover', mouseEnter)
    window.addEventListener('mouseout', mouseLeave)

    return () => {
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mouseover', mouseEnter)
      window.removeEventListener('mouseout', mouseLeave)
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
