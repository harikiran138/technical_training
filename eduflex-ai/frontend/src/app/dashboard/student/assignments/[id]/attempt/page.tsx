'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Assignment, Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, ArrowRight, ArrowLeft, Clock, Save } from 'lucide-react';

export default function AssignmentAttemptPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await api.assignments.get(assignmentId);
        setAssignment(data);
      } catch (error) {
        console.error('Failed to fetch assignment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
       fetchAssignment();
    }
  }, [assignmentId]);

  const handleAnswerChange = React.useCallback((questionId: string, value: any) => {
    setAnswers(prev => ({
        ...prev,
        [questionId]: value
    }));
  }, []);

  const handleNext = React.useCallback(() => {
    setCurrentQuestionIndex(prev => {
        if (assignment?.questions && prev < assignment.questions.length - 1) {
            return prev + 1;
        }
        return prev;
    });
  }, [assignment?.questions]);

  const handlePrev = React.useCallback(() => {
    setCurrentQuestionIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleSubmit = async () => {
    if (!window.confirm("Are you sure you want to submit? You cannot change your answers after submission.")) return;

    setSubmitting(true);
    try {
        await api.assignments.submit(assignmentId, answers);
        // Redirect to success or list page
        router.push('/dashboard/student/assignments');
    } catch (error) {
        console.error("Submission failed", error);
        alert("Failed to submit assignment. Please try again.");
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading assignment...</div>;
  if (!assignment || !assignment.questions) return <div className="text-white p-8">Assignment not found or has no questions.</div>;

  const currentQuestion = assignment.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === assignment.questions.length - 1;

  return (
    <div className="min-h-screen bg-[#030303] text-white p-8 flex flex-col items-center">
        {/* Header */}
        <div className="w-full max-w-3xl flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <div>
                <h1 className="text-2xl font-bold">{assignment.title}</h1>
                <p className="text-slate-400 text-sm">{assignment.subject} • {assignment.questions.length} Questions</p>
            </div>
            <div className="flex items-center gap-4">
                 <div className="flex items-center text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm font-mono">{formatTime(timeLeft)}</span>
                 </div>
            </div>
        </div>

        {/* Question Card */}
        <Card className="w-full max-w-3xl bg-slate-900/50 border-slate-800 min-h-[400px] flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                        Question {currentQuestionIndex + 1} of {assignment.questions.length}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                        {currentQuestion.marks} Marks
                    </span>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                    {currentQuestion.question_text}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 pt-4">
                {currentQuestion.type === 'MCQ' && currentQuestion.options ? (
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, idx) => (
                            <label 
                                key={idx} 
                                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                                    answers[currentQuestion.id] === option 
                                    ? 'bg-blue-600/20 border-blue-500 text-blue-100' 
                                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                                }`}
                            >
                                <input 
                                    type="radio" 
                                    name={`q-${currentQuestion.id}`} 
                                    value={option}
                                    checked={answers[currentQuestion.id] === option}
                                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                    className="hidden" // Hiding default radio, styling wrapper
                                />
                                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                                     answers[currentQuestion.id] === option ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                                }`}>
                                    {answers[currentQuestion.id] === option && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="text-lg">{option}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <Textarea 
                        placeholder="Type your answer here..." 
                        className="min-h-[200px] text-lg bg-slate-950 border-slate-800"
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    />
                )}
            </CardContent>

            <CardFooter className="border-t border-slate-800 p-6 flex justify-between">
                <Button 
                    variant="ghost" 
                    onClick={handlePrev} 
                    disabled={currentQuestionIndex === 0}
                    className="text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                {isLastQuestion ? (
                    <Button 
                        onClick={handleSubmit} 
                        disabled={submitting} 
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                        {submitting ? 'Submitting...' : 'Submit Assignment'} <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button 
                        onClick={handleNext} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                    >
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </CardFooter>
        </Card>
        
        {/* Navigation Dots */}
        <div className="mt-8 flex gap-2 overflow-x-auto max-w-3xl pb-2">
            {assignment.questions.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                        idx === currentQuestionIndex 
                        ? 'bg-blue-500 w-6' 
                        : answers[assignment.questions![idx].id] 
                            ? 'bg-green-500/50' 
                            : 'bg-slate-800'
                    }`}
                />
            ))}
        </div>
    </div>
  );
}
