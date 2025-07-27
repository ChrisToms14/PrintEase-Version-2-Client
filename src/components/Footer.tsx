import React from 'react';
import { Printer, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Printer size={24} className="text-green-400" />
              <span className="text-xl font-bold text-white">PrintEase</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Revolutionizing the printing experience for students. Upload, customize, pay, and track your printing orders from anywhere, anytime.
            </p>

          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2">
          {[
            { name: 'Home', path: '/#' },
            { name: 'About Us', path: '/about' },
            { name: 'FAQ', path: '/faq' }
          ].map((item) => (
            <li key={item.name}>
              <motion.div whileHover={{ x: 5 }}>
                <Link 
                  to={item.path} 
                  className="text-sm hover:text-green-400 transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>

          </div>
          
          <div>
  <h3 className="text-lg font-medium text-white mb-4">Services</h3>
  <ul className="space-y-2">
    {[
      'Notes & Assignments',
      'Posters',
      'Cards',
      'Project Report',
      'Brochure'
    ].map((item) => (
      <li key={item}>
        <motion.div
          className="text-sm hover:text-green-400 transition-colors cursor-default"
          whileHover={{ x: 5 }}
        >
          {item}
        </motion.div>
      </li>
    ))}
  </ul>
</div>

          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">S5_CS2, Mar Baselios College of Engineering & Technology</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-green-400 flex-shrink-0" />
                <span className="text-sm">9656258080 , 9645939782</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-green-400 flex-shrink-0" />
                <span className="text-sm">printease5@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {currentYear} PrintEase. All rights reserved.
          </p>
          <div className="flex space-x-6">
  {[
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms of Service', path: '/terms-of-service' },
    { name: 'Cookie Policy', path: '#' } // You can later update this
  ].map((item) => (
    <Link 
      key={item.name} 
      to={item.path} 
      className="text-xs text-gray-500 hover:text-green-400 transition-colors"
    >
      {item.name}
    </Link>
  ))}
</div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
