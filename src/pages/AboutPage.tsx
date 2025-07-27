import React from 'react';
import { motion } from 'framer-motion';
import { Printer, Users, Target, Award } from 'lucide-react';
import CreatorCard from '../components/CreatorCard';

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const creators = [
    {
      name: "Vedha Mahadevan",
      college: "Mar Baselios College of Engineering & Technology",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1"
    },
    {
      name: "Chris Thomas Abraham",
      college: "Mar Baselios College of Engineering & Technology", 
      image: "https://ik.imagekit.io/cj5ujtn9k/WhatsApp%20Image%202025-06-16%20at%2018.53.10_c24cee17.jpg?updatedAt=1750082545418"
    }
  ];

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Printer size={40} className="text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">About PrintEase</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Revolutionizing the printing experience for students and professionals through innovative digital solutions.
            </p>
          </motion.div>

          {/* Mission Statement */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-md p-8 mb-12"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              PrintEase is a digital platform built to simplify and streamline the printing process for students and professionals. 
              From reports to brochures, we make printing accessible and hassle-free. Our goal is to eliminate the traditional 
              pain points of printing services by providing a seamless, efficient, and user-friendly platform that connects 
              users with quality printing services at their fingertips.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {[
              {
                icon: <Target className="text-green-600" size={32} />,
                title: "Efficiency",
                description: "Streamlined processes that save time and reduce complexity"
              },
              {
                icon: <Users className="text-green-600" size={32} />,
                title: "User-Centric",
                description: "Designed with students and professionals in mind"
              },
              {
                icon: <Award className="text-green-600" size={32} />,
                title: "Quality",
                description: "High-quality prints with attention to detail"
              },
              {
                icon: <Printer className="text-green-600" size={32} />,
                title: "Innovation",
                description: "Modern solutions for traditional printing challenges"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </motion.div>

          {/* Created By Section */}
          <motion.div 
            variants={itemVariants}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Created By</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CreatorCard
                  name="Vedha Mahadevan"
                  college="Mar Baselios College of Engineering & Technology"
                  image="https://media.licdn.com/dms/image/v2/D4D03AQEdLp1WG5IJjw/profile-displayphoto-shrink_200_200/B4DZXSuxjeHsAg-/0/1742997232851?e=2147483647&v=beta&t=P3_SqavCjsiLZdGlwzH3_1oAn1N-BJSg6fJAxqxMt4c"
                  socialLinks={{
                    instagram: "https://www.instagram.com/vedha_17_mahadevan/",
                    linkedin: "https://in.linkedin.com/in/vedha-mahadevan",
                    youtube: "https://www.youtube.com/@CultEngineers"
                  }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <CreatorCard
                  name="Chris Thomas Abraham"
                  college="Mar Baselios College of Engineering & Technology"
                  image="https://ik.imagekit.io/cj5ujtn9k/WhatsApp%20Image%202025-06-16%20at%2018.53.10_c24cee17.jpg?updatedAt=1750082545418"
                  socialLinks={{
                    instagram: "https://www.instagram.com/chris.innit/",
                    linkedin: "https://www.linkedin.com/in/christhomasabraham/",
                    youtube: "https://www.youtube.com/@CultEngineers"
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Vision Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              To become the leading digital printing platform that transforms how students and professionals 
              access printing services, making it as simple as ordering food online. We envision a future 
              where printing is seamless, efficient, and accessible to everyone.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;