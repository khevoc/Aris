import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import '../styles/SurroundingElements.css'

export default function SurroundingElements({ images = [] }) {
  const elements = useMemo(() => {
    return images.map((src) => ({
      src,
      x: Math.random() * 60 - 30,
      y: Math.random() * 60 - 30,
      rotate: Math.random() * 30 - 15,
      size: 48 + Math.random() * 120,
      delay: Math.random() * 3,
    }))
  }, [images])

  return (
    <div className='surround-root' aria-hidden>
      {elements.map((el, idx) => (
        <motion.img
          key={idx}
          src={el.src}
          className='surround-img'
          style={{ width: el.size, transform: `translate(${el.x}px, ${el.y}px) rotate(${el.rotate}deg)` }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.1, 0.8, 0.2], y: [0, -24, 0], x: [0, 18, 0], rotate: [el.rotate, el.rotate + 6, el.rotate] }}
          transition={{ duration: 9 + Math.random() * 6, repeat: Infinity, repeatType: 'reverse', delay: el.delay }}
        />
      ))}
    </div>
  )
}