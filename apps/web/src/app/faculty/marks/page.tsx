'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInternalMarks, getCourses } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { FileSpreadsheet, Save, CheckCircle2, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MarksPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const { data: courses } = useQuery({ 
    queryKey: ['facultyCourses'], 
    queryFn: () => getCourses() 
  });

  const { data: marks, isLoading } = useQuery({ 
    queryKey: ['internalMarks', selectedCourse], 
    queryFn: () => getInternalMarks(selectedCourse),
    enabled: !!selectedCourse
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Continuous Assessment & Marks</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Enter, review, and finalize midterm and continuous evaluation grades</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
            Export CSV
          </Button>
          <Button size="sm" className="h-9 gap-1.5" disabled={!selectedCourse}>
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
        </div>
      </div>

      <Card className="border border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/70 py-4 px-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Award className="w-4 h-4 text-primary" />
                Select Academic Course
              </CardTitle>
              <CardDescription className="text-xs">Select a course to view and edit student grade records</CardDescription>
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full sm:w-[280px] h-10 rounded-xl">
                <SelectValue placeholder="Select course..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {courses?.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {!selectedCourse ? (
            <div className="py-16 text-center text-muted-foreground">
              <FileSpreadsheet className="w-10 h-10 mx-auto mb-3 opacity-30 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No course selected</p>
              <p className="text-xs text-muted-foreground mt-1">Please select an enrolled course from the dropdown above to load the marksheet.</p>
            </div>
          ) : isLoading ? (
            <div className="py-16 text-center text-muted-foreground text-xs">Loading student marksheet...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-[110px]">Roll No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="w-[130px]">Midterm (30)</TableHead>
                    <TableHead className="w-[130px]">Assign. (10)</TableHead>
                    <TableHead className="w-[130px]">Quiz (10)</TableHead>
                    <TableHead className="w-[110px]">Total (50)</TableHead>
                    <TableHead className="w-[110px] text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marks?.map((mark) => (
                    <TableRow key={mark.studentId} className="hover:bg-muted/20">
                      <TableCell className="font-mono text-xs text-muted-foreground">{mark.studentId.substring(0, 8)}</TableCell>
                      <TableCell className="font-medium text-sm text-foreground">{mark.studentName}</TableCell>
                      <TableCell>
                        <Input type="number" defaultValue={25} className="w-20 h-8 text-xs rounded-lg" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue={8} className="w-20 h-8 text-xs rounded-lg" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue={9} className="w-20 h-8 text-xs rounded-lg" />
                      </TableCell>
                      <TableCell className="font-semibold text-sm text-foreground font-mono">
                        42
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="success" className="text-[10px]">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Saved
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}

                  {(!marks || marks.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-xs text-muted-foreground">
                        No enrolled students found for this course section.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
