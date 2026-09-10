'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInternalMarks, getCourses } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { FileSpreadsheet, Save, CheckCircle2 } from 'lucide-react';
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
          <h1 className="text-3xl font-bold tracking-tight">Internal Marks</h1>
          <p className="text-muted-foreground mt-2">Enter and review continuous assessment scores.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </Button>
          <Button className="gap-2" disabled={!selectedCourse}>
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-muted/20 border-b pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <CardTitle>Select Course</CardTitle>
              <CardDescription>Choose a course to enter marks</CardDescription>
            </CardDescription>
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a course..." />
              </SelectTrigger>
              <SelectContent>
                {courses?.map(course => (
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
              <FileSpreadsheet className="w-10 h-10 mx-auto mb-4 opacity-30" />
              <p>Please select a course to view the marks entry sheet.</p>
            </div>
          ) : isLoading ? (
            <div className="py-16 text-center text-muted-foreground">Loading student list...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[100px]">Roll No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="w-[120px]">Midterm (30)</TableHead>
                    <TableHead className="w-[120px]">Assign. (10)</TableHead>
                    <TableHead className="w-[120px]">Quiz (10)</TableHead>
                    <TableHead className="w-[120px]">Total (50)</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marks?.map((mark) => (
                    <TableRow key={mark.id}>
                      <TableCell className="font-mono text-xs">{mark.studentId.substring(0,8)}</TableCell>
                      <TableCell className="font-medium">{mark.studentName}</TableCell>
                      <TableCell>
                        <Input type="number" defaultValue={25} className="w-20 h-8" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue={8} className="w-20 h-8" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue={9} className="w-20 h-8" />
                      </TableCell>
                      <TableCell className="font-semibold">
                        42
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Saved
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {(!marks || marks.length === 0) && (
                     <TableRow>
                       <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                         No students found for this course.
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
