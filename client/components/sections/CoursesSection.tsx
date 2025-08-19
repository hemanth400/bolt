@@ .. @@
 export function CoursesSection() {
   const [courses, setCourses] = useState<Course[]>([]);
   const [loading, setLoading] = useState(true);
   const [enrolling, setEnrolling] = useState<string | null>(null);
   const { user } = useAuth();
 
+  // Static courses data
+  const staticCourses = [
+    {
+      id: '1',
+      title: 'Python Fundamentals',
+      description: 'Learn Python programming from basics to advanced concepts with hands-on projects.',
+      price: 1,
+      image_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop',
+      created_at: new Date().toISOString()
+    },
+    {
+      id: '2',
+      title: 'Java Development',
+      description: 'Master Java programming with object-oriented concepts and real-world applications.',
+      price: 1,
+      image_url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop',
+      created_at: new Date().toISOString()
+    },
+    {
+      id: '3',
+      title: 'Frontend Development',
+      description: 'Build modern web applications with HTML, CSS, JavaScript, and React.',
+      price: 1,
+      image_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
+      created_at: new Date().toISOString()
+    }
+  ];
+
   useEffect(() => {
-    fetchCourses();
+    // Use static courses instead of fetching from database
+    setCourses(staticCourses);
+    setLoading(false);
   }, []);
 
-
-        console.error('Error fetching courses:', error);
-          title: "Error",
-        });
-        setCourses([]);
-      } else {
-        setCourses(data || []);
-      console.error('Error in fetchCourses:', error);
-      setCourses([]);
-    } finally {
-      setLoading(false);
-    }
-  };
        description: "Payment failed. Please try again.",
   const handleEnroll = async (courseId: string, coursePrice: number) => {
     if (!user) {
       toast({
@@ -103,7 +120,7 @@
                 <CardContent className="flex-grow">
                   <div className="flex items-center justify-between">
                     <Badge variant="secondary" className="text-lg font-bold">
-                      ₹{course.price}
+                      ₹1
                     </Badge>
                   </div>
import { initiatePayment, RAZORPAY_KEY } from '@/lib/razorpay';
                 </CardContent>
      // Initiate Razorpay payment
      await initiatePayment({
        key: RAZORPAY_KEY,
        amount: coursePrice * 100, // Amount in paise (₹1 = 100 paise)
        currency: 'INR',
        name: 'Skill Friend',
        description: `Enrollment for course`,
        handler: async (response) => {
          // Payment successful
          console.log('Payment successful:', response);
          
          // Record enrollment after successful payment
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
              description: "Payment successful but enrollment failed. Please contact support.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Enrollment Successful!",
              description: "Payment completed and you have successfully enrolled in the course.",
            });
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
              variant: "destructive"
            });
          }
        }
      });