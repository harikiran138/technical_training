'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Loader2, Search, FileBarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentListPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await api.users.getStudents();
        setStudents(data);
      } catch (error) {
        console.error('Failed to fetch students', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#030303] p-8">
      <div className="mb-8">
        <Link href="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-2 mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white">Students Directory</h1>
                <p className="text-slate-400">Manage and view reports for all registered students.</p>
            </div>
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input 
                    type="text" 
                    placeholder="Search students..." 
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </div>

      <Card className="bg-slate-950/50 border-slate-800">
        <CardContent className="p-0">
            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400">Student</TableHead>
                        <TableHead className="text-slate-400">Email</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-right text-slate-400">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredStudents.length === 0 ? (
                        <TableRow className="border-slate-800">
                            <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                                No students found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredStudents.map((student) => (
                            <TableRow key={student.id} className="border-slate-800 hover:bg-slate-900/50">
                            <TableCell className="font-medium text-white">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 border border-slate-700">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.first_name}`} />
                                        <AvatarFallback className="bg-slate-800 text-slate-400">
                                            {student.first_name[0]}{student.last_name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{student.first_name} {student.last_name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-slate-400">{student.email}</TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    student.is_active 
                                    ? 'bg-emerald-500/10 text-emerald-500' 
                                    : 'bg-red-500/10 text-red-500'
                                }`}>
                                    {student.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <Link href={`/dashboard/students/${student.id}`}>
                                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                                        <FileBarChart className="h-4 w-4 mr-2" />
                                        View Report
                                    </Button>
                                </Link>
                            </TableCell>
                            </TableRow>
                        ))
                    )}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
