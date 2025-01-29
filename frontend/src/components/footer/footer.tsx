function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black via-gray-900 to-black  text-white py-12 px-8 mt-12 border-t border-gray-700">
      <div className="flex flex-wrap justify-between gap-12">
        {/* Column 1: About Us */}
        <div className="flex-1 min-w-[200px] mb-8">
          <h2 className="text-xl mb-4 text-blue-400">About Us</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            We aim to provide the best tools, resources, and guidance for developers to
            enhance their skills. Join us and explore a world of opportunities!
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex-1 min-w-[200px] mb-8">
          <h2 className="text-xl mb-4 text-blue-400">Quick Links</h2>
          <ul className="text-sm text-gray-400">
            <li className="mb-2 hover:text-blue-400 transition-colors cursor-pointer">Home</li>
            <li className="mb-2 hover:text-blue-400 transition-colors cursor-pointer">Features</li>
            <li className="mb-2 hover:text-blue-400 transition-colors cursor-pointer">Pricing</li>
            <li className="mb-2 hover:text-blue-400 transition-colors cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div className="flex-1 min-w-[200px] mb-8">
          <h2 className="text-xl mb-4 text-blue-400">Resources</h2>
          <ul className="text-sm text-gray-400">
            <li className="mb-2 hover:text-blue-400 transition-colors cursor-pointer">Blog</li>
            <li className="mb-2 hover:text-blue-400 transition-colors cursor-pointer">Documentation</li>
            <li className="mb-2 hover:text-blue-400 transition-colors cursor-pointer">FAQs</li>
            <li className="mb-2 hover:text-blue-400 transition-colors cursor-pointer">API</li>
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div className="flex-1 min-w-[200px] mb-8">
          <h2 className="text-xl mb-4 text-blue-400">Contact Us</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Email: support@coolfooter.com
            <br />
            Phone: +123 456 7890
            <br />
            Address: 123 Dev Street, Code City, World
          </p>
        </div>
      </div>

      {/* Social Media */}
      <div className="mt-8">
        <h3 className="text-lg text-blue-400 mb-4">Follow Us</h3>
        <div className="flex justify-center gap-4">
          {/* Social Media Icons */}
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110">
            <span className="text-xl">G</span>
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110">
            <span className="text-xl">L</span>
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110">
            <span className="text-xl">T</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Cool Footer. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
