import { CV } from '../components/sections/CV'
import { Achievements } from '../components/sections/Achievements'
import { Hero } from '../components/sections/Hero'
import { Services } from '../components/sections/Services'
import { About } from '../components/sections/About'
import { Experience } from '../components/sections/Experience'
import { Skills } from '../components/sections/Skills'
import { Projects } from '../components/sections/Projects'
import { VideoGallery } from '../components/sections/VideoGallery'
import { Contact } from '../components/sections/Contact'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#07070f]">
      {/* Content Sections */}
      <Hero />
      <Services />
      <About />
      <Experience />
      <Skills />
      <Achievements />
      <CV />
      <Projects />
      <VideoGallery />
      <Contact />
    </div>
  )
}
