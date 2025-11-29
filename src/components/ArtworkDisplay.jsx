import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import SurroundingElements from './SurroundingElements'
import '../styles/ArtworkDisplay.css'

export default function ArtworkDisplay({ artwork }) {
  if (!artwork) return null

  return (
    <div className='artwork-root'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={artwork.id}
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='artwork-card'
        >
          {/* Imagen principal */}
          <div className='artwork-canvas'>
            <img
              src={artwork.image}
              alt={artwork.title}
              className='artwork-image'
            />

            {/* Efectos alrededor */}
            {/* <SurroundingElements images={artwork.effects || []} /> */}
          </div>

          {/* Información */}
          <div className='artwork-meta'>
            <h2 className='artwork-title'>{artwork.title}</h2>
            <p className='artwork-desc'>{artwork.description}</p>
            <p className='artwork-author'>{artwork.author}</p>

            {/* Botón para experiencias como Crocodile Experience */}
            {artwork.link && (
              <Link to={artwork.link} className='artwork-link'>
                Entrar a la experiencia →
              </Link>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
