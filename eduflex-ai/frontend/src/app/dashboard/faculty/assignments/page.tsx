'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Assignment } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Clock, BarChart } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function FacultyAssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await api.assignments.list();
        setAssignments(data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Assignments</h1>
          <p className="text-slate-400 mt-1">Manage quizzes and assignments for your students</p>
        </div>
        <Button 
            onClick={() => router.push('/dashboard/faculty/assignments/create')} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Assignment
        </Button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-900/80">
            <TableRow className="border-slate-800 hover:bg-slate-900/80">
              <TableHead className="text-slate-400 font-medium">Title</TableHead>
              <TableHead className="text-slate-400 font-medium">Subject</TableHead>
              <TableHead className="text-slate-400 font-medium">Type</TableHead>
              <TableHead className="text-slate-400 font-medium">Due Date</TableHead>
              <TableHead className="text-slate-400 font-medium">Submissions</TableHead>
              <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                        <BookOpen className="h-8 w-8 mb-2 opacity-50" />
                        <p>No assignments found. Create your first one!</p>
                    </div>
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow key={assignment.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <TableCell className="font-medium text-white">{assignment.title}</TableCell>
                  <TableCell className="text-slate-400">{assignment.subject}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={assignment.type === 'quiz' ? 'border-purple-500 text-purple-400' : 'border-blue-500 text-blue-400'}>
                        {assignment.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400">
                    <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2" />
                        {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No Due Date'}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-400">
                     0/0 {/* Placeholder: Fetch submission stats later */}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-slate-800 text-slate-400 hover:text-white"
                      onClick={() => router.push(`/dashboard/faculty/assignments/${assignment.id}/analytics`)}
                    >
                        <BarChart className="h-4 w-4 mr-2" />
                        Analytics
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
