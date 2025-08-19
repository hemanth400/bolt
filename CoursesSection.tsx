import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase, Course } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive"
        });
        setCourses([]);
      } else {
        setCourses(data || []);
      }
    } catch (error) {
      console.error('Error in fetchCourses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string, coursePrice: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to enroll in courses.",
        variant: "destructive"
      });
      return;
    }

    setEnrolling(courseId);
    
    try {
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Record enrollment
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId
        });

      if (error) {
        console.error('Enrollment error:', error);
        toast({
          title: "Enrollment Failed",
          description: "There was an error enrolling in the course. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Enrollment Successful!",
          description: "You have successfully enrolled in the course.",
        });
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <section id="courses" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Explore Our Courses</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive learning paths designed by industry experts.
            </p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Explore Our Courses</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive learning paths designed by industry experts.
          </p>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="h-full flex flex-col">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-lg font-bold">
                      ₹{course.price}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleEnroll(course.id, course.price)}
                    disabled={enrolling === course.id}
                  >
                    {enrolling === course.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enrolling...
                      </>
                    ) : (
                      'Enroll Now'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
