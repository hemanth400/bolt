@@ .. @@
 import { BrowserRouter, Routes, Route } from "react-router-dom";
 import { AuthProvider } from "@/contexts/AuthContext";
 import { ErrorBoundary } from "@/components/ErrorBoundary";
 import { Toaster } from "@/components/ui/toaster";
 import { Toaster as SonnerToaster } from "@/components/ui/sonner";
 import { ThemeProvider } from "next-themes";
 import Index from "@/pages/Index";
+import Contact from "@/pages/Contact";
 import NotFound from "@/pages/NotFound";
 import "./index.css";
 
 function App() {
   return (
     <ErrorBoundary>
       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
         <AuthProvider>
           <BrowserRouter>
             <Routes>
               <Route path="/" element={<Index />} />
+              <Route path="/contact" element={<Contact />} />
               {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
               <Route path="*" element={<NotFound />} />
             </Routes>
           </BrowserRouter>
           <Toaster />
           <SonnerToaster />
         </AuthProvider>
       </ThemeProvider>
     </ErrorBoundary>
   );
 }