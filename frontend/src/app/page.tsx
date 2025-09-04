import { CV } from '../components/sections/CV'
import { Achievements } from '../components/sections/Achievements'
import { Hero } from '../components/sections/Hero'
import { About } from '../components/sections/About'
import { Experience } from '../components/sections/Experience'
import { Skills } from '../components/sections/Skills'
import { Projects } from '../components/sections/Projects'
import { Contact } from '../components/sections/Contact'

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Enhanced Background with Mesh Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10" />
      
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-electric-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>
      
      {/* Content Sections */}
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Achievements />
      <CV />
      <Projects />
      <Contact />
    </div>
  )
}
