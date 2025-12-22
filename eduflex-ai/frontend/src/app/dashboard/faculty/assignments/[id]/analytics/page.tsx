'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  RefreshCw, 
  BarChart3, 
  Users, 
  Target, 
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  TrendingDown,
  TrendingUp,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AssignmentAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (generate = false) => {
    try {
      if (generate) setRefreshing(true);
      const res = await api.assignments.getAnalytics(assignmentId, generate);
      setData(res);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [assignmentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data || data.message === "No submissions to analyze") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-1">No Data Available</h3>
            <p className="text-muted-foreground mb-6">Wait for students to submit before generating analytics.</p>
            <Button onClick={() => fetchAnalytics(true)}>
              <RefreshCw className="w-4 h-4 mr-2" /> Check for Submissions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { metrics, insights } = data;

  return (
    <div className="pb-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" className="mb-2 p-0 h-auto hover:bg-transparent" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Assignments
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Assignment Insights</h1>
          <p className="text-muted-foreground">Detailed performance breakdown and AI-driven recommendations.</p>
        </div>
        <Button onClick={() => fetchAnalytics(true)} disabled={refreshing}>
          <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
          {refreshing ? "Re-Analyzing..." : "Refresh Insights"}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.students}</div>
            <p className="text-xs text-muted-foreground">Total participants</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.average_score}/{metrics.max_marks}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              {Math.round((metrics.average_score / metrics.max_marks) * 100)}% Accuracy
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Difficulty</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <Badge className={cn(
              "text-sm",
              insights.assignment_difficulty === 'Hard' ? "bg-red-500/20 text-red-500 border-red-500/50" :
              insights.assignment_difficulty === 'Medium' ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50" :
              "bg-green-500/20 text-green-500 border-green-500/50"
            )}>
              {insights.assignment_difficulty}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Based on avg. score</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.student_insights.at_risk_students.length}</div>
            <p className="text-xs text-muted-foreground">Below 40% benchmark</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main AI Insights */}
        <Card className="lg:col-span-2 shadow-lg border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Executive Summary
            </CardTitle>
            <CardDescription>Automated pedagogical analysis of student performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg leading-relaxed text-foreground/90 italic">
              "{insights.overall_summary}"
            </div>
            
            <div className="pt-4 border-t border-primary/10">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Teaching Recommendations
              </h4>
              <ul className="space-y-2">
                {insights.teaching_recommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>High Performers</span>
                  <span className="font-medium text-green-500">{insights.student_insights.high_performers.length}</span>
                </div>
                <Progress value={(insights.student_insights.high_performers.length / metrics.students) * 100} className="h-2 bg-green-500/10" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>At-Risk</span>
                  <span className="font-medium text-red-500">{insights.student_insights.at_risk_students.length}</span>
                </div>
                <Progress value={(insights.student_insights.at_risk_students.length / metrics.students) * 100} className="h-2 bg-red-500/10" />
              </div>

              <div className="pt-2 border-t text-sm">
                <div className="flex justify-between mb-1">
                  <span>Trend</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {insights.student_insights.improvement_trend === 'Improving' ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                    {insights.student_insights.improvement_trend}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-6 text-center">
              <p className="text-xs text-muted-foreground mb-2">Insight Confidence Score</p>
              <div className="text-xl font-mono text-primary">{(insights.confidence_score * 100).toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Question Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Question-Level Analytics</CardTitle>
          <CardDescription>Success rate and difficulty assessment per question</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-left">
                  <th className="pb-3 pr-4 font-medium uppercase tracking-wider">Question snippet</th>
                  <th className="pb-3 px-4 font-medium uppercase tracking-wider">Type</th>
                  <th className="pb-3 px-4 font-medium uppercase tracking-wider text-center">Correct Rate</th>
                  <th className="pb-3 px-4 font-medium uppercase tracking-wider text-right">Difficulty</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {metrics.questions.map((q: any) => (
                  <tr key={q.question_id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 pr-4 max-w-xs truncate font-medium">{q.text}</td>
                    <td className="py-4 px-4 text-muted-foreground">{q.type}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className={cn(
                          "font-mono",
                          q.correct_rate > 0.7 ? "text-green-500" : q.correct_rate < 0.4 ? "text-red-500" : "text-yellow-500"
                        )}>
                          {(q.correct_rate * 100).toFixed(0)}%
                        </span>
                        <div className="w-16 bg-muted h-1 rounded-full overflow-hidden shrink-0">
                          <div 
                            className={cn(
                              "h-full",
                              q.correct_rate > 0.7 ? "bg-green-500" : q.correct_rate < 0.4 ? "bg-red-500" : "bg-yellow-500"
                            )} 
                            style={{ width: `${q.correct_rate * 100}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Badge variant="outline">
                        {q.correct_rate > 0.7 ? "Easy" : q.correct_rate < 0.4 ? "Hard" : "Medium"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
