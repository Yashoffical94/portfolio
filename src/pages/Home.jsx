import { motion } from 'framer-motion'
import MainLayout from '../layouts/MainLayout'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Skills from '../sections/Skills'
import Projects from '../sections/Projects'
import Experience from '../sections/Experience'
import Achievements from '../sections/Achievements'
import Contact from '../sections/Contact'

export default function Home() {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
      </motion.div>
    </MainLayout>
  )
}
