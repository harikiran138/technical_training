'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  Home,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  TrendingUp,
  Award,
  Sparkles,
  Users,
  Target,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Overview');

  const [report, setReport] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const fetchUserAndReport = async () => {
      try {
        const userData = await api.auth.getCurrentUser();
        setUser(userData);
        
        if (userData.role === 'student') {
          setReportLoading(true);
          try {
            const reportData = await api.users.getStudentReport(userData.id);
            setReport(reportData);
          } catch (err) {
            console.error("Failed to fetch report", err);
          } finally {
            setReportLoading(false);
          }
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndReport();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303] text-white">
        <div className="flex flex-col items-center">
            <Sparkles className="animate-spin h-8 w-8 text-blue-500 mb-4" />
            <p className="text-slate-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const UserInitials = user?.first_name ? `${user.first_name[0]}${user.last_name ? user.last_name[0] : ''}` : 'U';
  const UserRole = user?.role || 'Member';

  const menuItems = [
    { name: 'Overview', icon: Home, href: '/dashboard' },
    { name: 'Students', icon: Users, href: '/dashboard/students' },
    { 
      name: 'Assignments', 
      icon: BookOpen, 
      href: user?.role === 'student' ? '/dashboard/student/assignments' : '/dashboard/faculty/assignments' 
    },
    { name: 'Analytics', icon: BarChart3, href: '#' },
    { name: 'Settings', icon: Settings, href: '#' },
  ];

  const statsData = user?.role === 'student' ? [
    {
      id: 'active-courses',
      title: 'Average Score',
      value: report ? `${report.average_percentage}%` : '0%',
      description: 'Based on assessments',
      icon: Target,
      trend: report?.average_percentage > 80 ? 'Excellent' : 'Keep improving',
    },
    {
      id: 'assignments-completed',
      title: 'Assignments Done',
      value: report ? report.total_assignments.toString() : '0',
      description: 'Total submissions',
      icon: CheckCircle2,
      trend: `+${report?.total_assignments || 0} lifetime`,
    },
    {
      id: 'gpa',
      title: 'Current GPA',
      value: report ? report.gpa.toString() : '0.00',
      description: 'Cumulative index',
      icon: Award,
      trend: '4.00 Scale',
    },
  ] : [
    {
      id: 'courses-enrolled',
      title: 'Active Courses',
      value: '4',
      description: 'In progress',
      icon: BookOpen,
      trend: '+1 new',
    },
    {
      id: 'hours-learned',
      title: 'Learning Hours',
      value: '32.5',
      description: 'This week',
      icon: TrendingUp,
      trend: '+12%',
    },
    {
      id: 'certificates',
      title: 'Certificates',
      value: '2',
      description: 'Total earned',
      icon: Award,
      trend: 'Silver Tier',
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#030303]">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 rounded-lg text-white hover:bg-slate-800"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64 shadow-2xl`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800 h-16">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="h-8 w-8 min-w-[2rem] rounded bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
               <Sparkles className="h-4 w-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-white text-lg tracking-tight whitespace-nowrap">EduFlex AI</span>
            )}
          </div>

          <button
            onClick={toggleCollapse}
            className="hidden lg:block p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft
              size={18}
              className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setActiveItem(item.name)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-500'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-colors duration-200 min-w-[1.25rem] ${
                    isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
             <button
                onClick={handleLogout}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all ${isCollapsed ? 'justify-center' : ''}`}
              >
                <LogOut size={20} className="min-w-[1.25rem]" />
                {!isCollapsed && <span className="font-medium">Logout</span>}
              </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Header (Desktop) */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-20">
            <div>
               {/* Breadcrumbs or Title could go here */}
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                     <div className="text-right hidden md:block">
                         <p className="text-sm font-medium text-white">{user?.first_name} {user?.last_name}</p>
                         <p className="text-xs text-slate-400 capitalize">{UserRole}</p>
                     </div>
                     <Avatar className="h-9 w-9 border border-slate-700">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.first_name}`} />
                        <AvatarFallback>{UserInitials}</AvatarFallback>
                     </Avatar>
                </div>
            </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
              <p className="text-slate-400 mt-1">Welcome back, {user?.first_name}!</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
            <div className="relative z-10 max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Continue your learning journey</h2>
                <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                  You've made great progress this week. Pick up right where you left off.
                </p>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 border-0 font-semibold h-11 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
                    Resume Learning
                </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsData.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.id}
                  className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-200"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">
                      {stat.title}
                    </CardTitle>
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Icon className="h-4 w-4 text-blue-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <p className="text-xs text-slate-500">{stat.description}</p>
                    <p className="text-sm text-emerald-400 mt-3 font-medium flex items-center gap-1">
                        {stat.trend}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
           {/* Recent Activity / Assessment History */}
           <div className="mt-8">
               <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
               {!report || report.assessments.length === 0 ? (
                   <div className="border border-dashed border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center text-slate-500">
                        <BarChart3 className="h-10 w-10 mb-3 opacity-20" />
                        <p>No recent activity found.</p>
                   </div>
               ) : (
                   <div className="grid gap-4">
                       {report.assessments.slice(0, 5).map((assessment: any, idx: number) => (
                           <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:bg-slate-800/40 transition-all cursor-pointer">
                               <div className="flex items-center gap-4">
                                   <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                       <BookOpen className="h-5 w-5 text-blue-400" />
                                   </div>
                                   <div>
                                       <h4 className="font-medium text-white">{assessment.name}</h4>
                                       <p className="text-sm text-slate-400">Submitted on {new Date(assessment.date).toLocaleDateString()}</p>
                                   </div>
                               </div>
                               <div className="text-right">
                                   <div className="text-lg font-bold text-white">{assessment.score}/{assessment.total}</div>
                                   <Badge variant="outline" className={assessment.percentage > 80 ? 'text-emerald-400 border-emerald-400/30' : 'text-blue-400 border-blue-400/30'}>
                                       {assessment.percentage}%
                                   </Badge>
                               </div>
                           </div>
                       ))}
                   </div>
               )}
           </div>

        </main>
      </div>
    </div>
  );
}
