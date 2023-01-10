import React, { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../sidebar'

interface PagewrapperProps {
  children: ReactNode
}
export default function Pagewrapper(props: PagewrapperProps) {
  const { children } = props
  return (
    <>
      <Sidebar>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ delay: 0.25 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Sidebar>
    </>
  )
}
