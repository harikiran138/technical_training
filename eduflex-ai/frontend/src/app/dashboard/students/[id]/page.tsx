'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Calendar, Clock, GraduationCap, Loader2, Target, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentReportPage() {
  const params = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (params.id) {
          const data = await api.users.getStudentReport(params.id as string);
          setReport(data);
        }
      } catch (err) {
        console.error('Failed to fetch report', err);
        setError('Failed to load student report. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [params.id]);

  if (loading) {
     return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
     )
  }

  if (error || !report) {
    return (
        <div className="min-h-screen bg-[#030303] p-8 flex flex-col items-center justify-center">
            <p className="text-red-400 mb-4">{error || 'Student not found'}</p>
            <Link href="/dashboard/students">
                <Button variant="secondary">Back to Students</Button>
            </Link>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030303] p-6 md:p-12 text-blue-50">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/students">
            <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="relative"
            >
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-sm opacity-50"></div>
                <Avatar className="h-24 w-24 border-2 border-slate-900 relative">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${report.name}`} />
                    <AvatarFallback className="text-2xl bg-slate-800 text-slate-300">
                        {report.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
            </motion.div>
            <div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-bold text-white tracking-tight"
              >
                {report.name}
              </motion.h1>
              <div className="flex items-center gap-3 mt-2 text-slate-400">
                 <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" /> Computer Science</span>
                 <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                 <span>Semester 4</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
             <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20">
                 Download PDF
             </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Overall GPA</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">{report.gpa}</span>
                        <span className="text-emerald-400 text-sm mb-1 font-medium flex items-center gap-1">
                            <Trophy className="h-3 w-3" /> Top 10%
                        </span>
                    </div>
                    <Progress value={(report.gpa / 4.0) * 100} className="mt-4 h-1.5 bg-slate-800" />
                </CardContent>
           </Card>

           <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">{report.attendance}</span>
                        <span className="text-slate-400 text-sm mb-1">Present</span>
                    </div>
                     <Progress value={92} className="mt-4 h-1.5 bg-slate-800" />
                </CardContent>
           </Card>

           <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Credits</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">48</span>
                        <span className="text-slate-400 text-sm mb-1">/ 120</span>
                    </div>
                    <Progress value={40} className="mt-4 h-1.5 bg-slate-800" />
                </CardContent>
           </Card>
        </div>

        {/* Content Tabs / Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Courses Column */}
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" /> Current Courses
                </h2>
                <div className="grid gap-4">
                    {report.courses.map((course: any, idx: number) => (
                        <Card key={idx} className="bg-slate-900/30 border-slate-800 hover:border-slate-700 transition-colors">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-1">{course.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 4 Credits</span>
                                        <span>Prof. Smith</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white">{course.grade}</div>
                                    <div className="text-sm text-blue-400">{course.score}%</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Recent Assessments Column */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                     <Target className="h-5 w-5 text-purple-500" /> Recent Assessments
                </h2>
                <Card className="bg-slate-900/30 border-slate-800">
                    <CardContent className="p-0">
                        {report.assessments.map((assessment: any, idx: number) => (
                            <div key={idx} className={`p-4 border-b border-slate-800 last:border-0 hover:bg-slate-900/50 transition-colors`}>
                                <div className="flex justify-between items-start mb-2">
                                     <h4 className="font-medium text-slate-200">{assessment.name}</h4>
                                     <Badge variant="outline" className="border-slate-700 text-slate-400">
                                         {assessment.score}/{assessment.total}
                                     </Badge>
                                </div>
                                <p className="text-xs text-slate-500 mb-2">{assessment.description}</p>
                                <Progress value={(assessment.score / assessment.total) * 100} className="h-1 bg-slate-800" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

        </div>

      </div>
    </div>
  );
}
