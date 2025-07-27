import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Upload, Printer, Clock, CreditCard, CheckCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { showToast } from '../utils/toast';

const DashboardHomePage = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  
  const isInView1 = useInView(ref1, { once: true, amount: 0.3 });
  const isInView2 = useInView(ref2, { once: true, amount: 0.3 });
  const isInView3 = useInView(ref3, { once: true, amount: 0.3 });
  
  useEffect(() => {
    showToast({
      title: "Welcome back!",
      description: "Ready to start your next printing project?"
    });
  }, []);
  
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                Printing Made <span className="text-green-300">Simple</span> and <span className="text-green-300">Fast</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl">
                Upload documents, customize your order, and skip the queues. PrintEase revolutionizes printing for the digital generation.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/order">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-green-900 px-8 py-3 rounded-full font-medium flex items-center justify-center space-x-2"
                  >
                    <Upload size={18} />
                    <span>Start Printing</span>
                  </motion.button>
                </Link>
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-medium flex items-center justify-center space-x-2"
                  >
                    <Printer size={18} />
                    <span>View Dashboard</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="relative">
                <svg className="absolute -top-20 -left-20 text-green-500 opacity-20" width="180" height="180" viewBox="0 0 200 200">
                  <path fill="currentColor" d="M45.3,20.5c21.3-21.3,55.8-21.3,77.1,0l55.8,55.8c21.3,21.3,21.3,55.8,0,77.1l-55.8,55.8c-21.3,21.3-55.8,21.3-77.1,0l-55.8-55.8c-21.3-21.3-21.3-55.8,0-77.1L45.3,20.5z"></path>
                </svg>
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform -rotate-2">
                  <div className="bg-green-50 p-4 border-b border-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                        <h3 className="text-green-900 font-medium mb-2">Print Order #2305</h3>
                        <div className="flex justify-between text-gray-600 text-sm">
                          <span>10 Pages, Double-sided</span>
                          <span>Color</span>
                        </div>
                      </div>
                      <div className="flex space-x-3 text-sm">
                        <div className="flex-1 bg-green-50 text-green-700 rounded-lg p-3 border border-green-100 flex items-center justify-center">
                          <CheckCircle size={16} className="mr-2" /> Ready for pickup
                        </div>
                        <div className="flex-1 bg-gray-50 text-gray-500 rounded-lg p-3 border border-gray-100 flex items-center justify-center">
                          <Clock size={16} className="mr-2" /> 5 mins ago
                        </div>
                      </div>
                      <div className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-20 -right-10 bg-white p-4 rounded-lg shadow-lg transform rotate-6">
                  <Printer size={40} className="text-green-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-gray-50">
            <path fill="currentColor" fillOpacity="1" d="M0,128L80,138.7C160,149,320,171,480,165.3C640,160,800,128,960,128C1120,128,1280,160,1360,176L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section ref={ref1} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How PrintEase Works</h2>
            <p className="text-lg text-gray-600">
              Simple . Fast . Hassle-free
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="text-green-600" size={32} />,
                title: "Upload & Customize",
                description: "Upload your documents and specify your printing requirements like color, size, and binding options."
              },
              {
                icon: <CreditCard className="text-green-600" size={32} />,
                title: "Pay Securely",
                description: "Make secure online payments using your preferred method without dealing with cash at the shop."
              },
              {
                icon: <Clock className="text-green-600" size={32} />,
                title: "Track & Collect",
                description: "Get real-time updates on your order status and collect your prints when ready without waiting in queues."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView1 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section ref={ref2} className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose PrintEase</h2>
            <p className="text-lg text-gray-600">
              Designed specifically for those who are in search of efficient, hassle-free printing services.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock size={24} className="text-green-600" />,
                title: "Save Time",
                description: "No more waiting in long queues. Order from anywhere and pick up when ready."
              },
              {
                icon: <Shield size={24} className="text-green-600" />,
                title: "Secure Payments",
                description: "All transactions are secure and traceable, eliminating cash handling issues."
              },
              {
                icon: <CheckCircle size={24} className="text-green-600" />,
                title: "Order Accuracy",
                description: "Detailed specifications ensure your prints are exactly as you want them."
              },
              {
                icon: <Upload size={24} className="text-green-600" />,
                title: "Easy File Upload",
                description: "Upload files directly from your device easily."
              },
              {
                icon: <Printer size={24} className="text-green-600" />,
                title: "Print Anywhere",
                description: "Access the platform from any device, anytime you need to print."
              },
              {
                icon: <CreditCard size={24} className="text-green-600" />,
                title: "Flexible Payment",
                description: "Pay online or at pickup - choose what works best for you."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:border-green-200 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start">
                  <div className="bg-green-50 p-3 rounded-lg mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section ref={ref3} className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Printing Experience?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students who are already saving time and enjoying hassle-free printing services.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/order">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-green-700 px-8 py-4 rounded-full font-semibold text-lg"
                >
                  Start Printing Now
                </motion.button>
              </Link>
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white px-8 py-4 rounded-full font-semibold text-lg"
                >
                  View Dashboard
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DashboardHomePage;