'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { AssignmentCreate, QuestionType } from '@/types';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<AssignmentCreate>({
    defaultValues: {
      type: 'assignment',
      max_marks: 100,
      questions: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  const onSubmit = async (data: AssignmentCreate) => {
    setLoading(true);
    try {
      await api.assignments.create(data);
      router.push('/dashboard/faculty/assignments');
    } catch (error) {
      console.error("Failed to create assignment", error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    append({
      type: 'MCQ',
      question_text: '',
      marks: 5,
      options: ['', '', '', ''], // Default 4 options for MCQ
      correct_answer: { answer: '' }
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-6 text-slate-400 hover:text-white pl-0"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assignments
      </Button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create New Assignment</h1>
          <p className="text-slate-400 mt-1">Design a new assessment or homework for your students.</p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Publish Assignment
        </Button>
      </div>

      <div className="space-y-8">
        {/* Basic Details */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title", { required: true })} placeholder="e.g., Midterm Exam" />
                {errors.title && <span className="text-red-500 text-xs">Title is required</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject / Course</Label>
                <Input id="subject" {...register("subject", { required: true })} placeholder="e.g., CS-101" />
                {errors.subject && <span className="text-red-500 text-xs">Subject is required</span>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} placeholder="Instructions for students..." />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input id="due_date" type="datetime-local" {...register("due_date")} className="block" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_marks">Total Marks</Label>
                <Input id="max_marks" type="number" {...register("max_marks", { valueAsNumber: true })} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Builder */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Questions</h2>
            <Button variant="secondary" onClick={addQuestion} size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </div>

          {fields.map((field, index) => {
             const qType = watch(`questions.${index}.type`);
             return (
              <Card key={field.id} className="bg-slate-900/30 border-slate-800 relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => remove(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1 flex justify-center pt-2">
                      <span className="bg-slate-800 text-slate-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <div className="col-span-11 space-y-4">
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3">
                           <Input {...register(`questions.${index}.question_text`, { required: true })} placeholder="Enter question text" className="font-medium text-lg border-transparent focus:border-slate-700 px-0 rounded-none bg-transparent" />
                        </div>
                        <div className="col-span-1">
                          <Controller
                            control={control}
                            name={`questions.${index}.type`}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="MCQ">Multiple Choice</SelectItem>
                                  <SelectItem value="DESCRIPTIVE">Descriptive</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>

                      {qType === 'MCQ' && (
                        <div className="space-y-3 pl-2">
                           <Label className="text-xs text-slate-500 uppercase">Options</Label>
                           {[0, 1, 2, 3].map((optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border border-slate-600"></div>
                                <Input 
                                  {...register(`questions.${index}.options.${optIndex}` as any)} 
                                  placeholder={`Option ${optIndex + 1}`} 
                                  className="h-8 bg-slate-950/50"
                                />
                                <div className="flex items-center gap-1">
                                  <input 
                                    type="radio" 
                                    name={`correct_${index}`}
                                    className="accent-green-500"
                                    onChange={(e) => {
                                       const val = watch(`questions.${index}.options.${optIndex}` as any);
                                       setValue(`questions.${index}.correct_answer`, { answer: val });
                                    }}
                                  />
                                </div>
                              </div>
                           ))}
                           <p className="text-xs text-slate-500 mt-2">* Select the radio button to mark the correct answer.</p>
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                         <div className="flex items-center gap-2">
                            <Label className="text-xs">Marks</Label>
                            <Input 
                              type="number" 
                              {...register(`questions.${index}.marks`, { valueAsNumber: true })} 
                              className="w-20 h-8 text-right" 
                            />
                         </div>
                      </div>

                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {fields.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
               <p>No questions added yet.</p>
               <Button variant="link" onClick={addQuestion} className="text-blue-500">Add your first question</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
