import Link from 'next/link';

const navigation = {
  main: [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#a67c52] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company info */}
          <div className="space-y-4 flex flex-col items-start">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="MN Group Home Logo" className="h-10 w-10 rounded" />
              <div>
                <span className="text-lg font-bold">MN Group Home LLC</span>
                <div className="text-xs text-[#f8f6ef]">Your Home with Heart</div>
              </div>
            </div>
            <p className="text-[#f8f6ef] max-w-xs text-sm">
              Providing compassionate, individualized community residential services to support independence and quality of life.
            </p>
          </div>

          {/* Contact information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact Information</h3>
            <div className="space-y-2 text-[#f8f6ef] text-sm">
              <div>
                6524 Humboldt Ave S<br />Richfield, MN 55423
              </div>
              <div>
                <a href="tel:9525941288" className="hover:underline">952-594-1288</a>
              </div>
              <div>
                <a href="mailto:mngrouphome@gmail.com" className="hover:underline">mngrouphome@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-[#f8f6ef] text-sm">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/services" className="hover:underline">Services</Link></li>
              <li><Link href="/locations" className="hover:underline">Locations</Link></li>
              <li><Link href="/referrals" className="hover:underline">Referrals</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#f8f6ef]/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-[#f8f6ef]">
          <p>© {new Date().getFullYear()} MN Group Home LLC. All rights reserved.</p>
          <nav className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}