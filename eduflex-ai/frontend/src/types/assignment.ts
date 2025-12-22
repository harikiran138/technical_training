export type AssignmentType = 'assignment' | 'quiz';
export type QuestionType = 'MCQ' | 'DESCRIPTIVE';
export type SubmissionStatus = 'draft' | 'submitted' | 'evaluated';

export interface Question {
  id: string;
  type: QuestionType;
  question_text: string;
  options?: string[];
  correct_answer?: any;
  marks: number;
}

export interface QuestionCreate extends Omit<Question, 'id'> {}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  subject: string;
  faculty_id: string;
  due_date?: string;
  max_marks: number;
  type: AssignmentType;
  created_at: string;
  questions?: Question[];
}

export interface AssignmentCreate {
  title: string;
  description?: string;
  subject: string;
  due_date?: string;
  max_marks: number;
  type: AssignmentType;
  questions?: QuestionCreate[];
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  submitted_at?: string;
  status: SubmissionStatus;
}
