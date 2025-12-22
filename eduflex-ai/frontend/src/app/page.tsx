'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  BookOpen, 
  BarChart2, 
  Target, 
  Zap, 
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Cpu,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="absolute inset-0 bg-[#030303]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen opacity-30" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen opacity-20" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full mix-blend-screen opacity-20" />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm md:text-base text-blue-200 mb-8 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>The Future of Education is Here</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
        >
          <span className="text-white block mb-2">Elevate Academic</span>
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Excellence with AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed"
        >
          Transform the learning experience with EduFlex AI. Intelligent assessments, 
          real-time analytics, and personalized adaptive paths designed for modern colleges.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/signup" className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2 group-hover:text-white transition-colors">
              Get Started for Free
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          <Link href="#features" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
            Explore Features
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: <Target className="w-6 h-6 text-blue-400" />,
      title: "Smart Assessments",
      description: "AI-driven question generation that adapts to curriculum needs instantly.",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-purple-400" />,
      title: "Real-time Analytics",
      description: "Deep insights into student performance to identify gaps and trends.",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      title: "Adaptive Learning",
      description: "Personalized learning paths that evolve with every student interaction.",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      icon: <Cpu className="w-6 h-6 text-orange-400" />,
      title: "AI Teaching Assistant",
      description: "24/7 support for students and automated grading for professors.",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-indigo-400" />,
      title: "Curriculum Mapping",
      description: "Align AI content automatically with university standards and outcomes.",
      gradient: "from-indigo-500/20 to-blue-500/20"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-rose-400" />,
      title: "Content Library",
      description: "Access massive repositories of academic resources instantly.",
      gradient: "from-rose-500/20 to-pink-500/20"
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#030303] relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-6">
            Everything you need to excel
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Built for the future of education, powering the next generation of learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl`} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASection() {
  return (
    <section className="py-32 bg-[#030303] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] overflow-hidden bg-gradient-to-b from-blue-900/20 to-purple-900/20 border border-white/10 p-12 md:p-24 text-center"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-blue-500/20 blur-[100px]" />
          
          <h2 className="relative text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your academy?
          </h2>
          <p className="relative text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            Join leading institutions using EduFlex AI to power their curriculum and assessments.
            Start your free trial today.
          </p>
          
          <div className="relative flex flex-col sm:flex-row gap-4 justify-center items-center">
             <Link href="/signup" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-300">
              Get Started Now
            </Link>
            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>No credit card required</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Main Landing Page Component
export default function EduFlexLanding() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-blue-500/30">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
