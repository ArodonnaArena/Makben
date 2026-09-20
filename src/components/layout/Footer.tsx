import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Makanjuola Ebenezer</h3>
            <p className="text-gray-400">Electrical Engineer at NAMA</p>
            <p className="text-gray-400">Lagos, Nigeria</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#about" className="hover:text-blue-400 transition-colors">About</Link></li>
              <li><Link href="#experience" className="hover:text-blue-400 transition-colors">Experience</Link></li>
              <li><Link href="#projects" className="hover:text-blue-400 transition-colors">Projects</Link></li>
              <li><Link href="#contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Email</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>© {new Date().getFullYear()} Makanjuola Ebenezer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
