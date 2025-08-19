import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, User, Users } from 'lucide-react';

export default function Contact() {
  const founders = [
    {
      name: 'M.CHIRU',
      email: 'chirusai0302@gmail.com',
      role: 'Founder & CEO'
    },
    {
      name: 'K.NAVEEN',
      email: 'naveenkottapalli42@gmail.com',
      role: 'Co-Founder & CTO'
    },
    {
      name: 'A.MAHENDRA',
      email: 'anisettimahendra991@gmail.com',
      role: 'Co-Founder & COO'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Contact Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch with the founders of Skill Friend. We're here to help you on your learning journey.
          </p>
        </div>

        {/* Founders Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              Meet Our Founders
            </h2>
            <p className="text-muted-foreground">
              The passionate team behind Skill Friend's AI-powered learning platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {founders.map((founder, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-lg">{founder.name}</CardTitle>
                  <Badge variant="secondary" className="mx-auto">
                    {founder.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <a 
                    href={`mailto:${founder.email}`}
                    className="flex items-center justify-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    {founder.email}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Information */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get In Touch</CardTitle>
              <CardDescription>
                Have questions about our courses, platform, or want to collaborate? 
                Reach out to any of our founders directly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">📚 Course Inquiries</h4>
                  <p className="text-muted-foreground">
                    Questions about our Python, Java, or Frontend Development courses
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🎮 Platform Features</h4>
                  <p className="text-muted-foreground">
                    Feedback on our gamified learning experience and coding challenges
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">💼 Partnerships</h4>
                  <p className="text-muted-foreground">
                    Business partnerships and collaboration opportunities
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🔧 Technical Support</h4>
                  <p className="text-muted-foreground">
                    Technical issues, bug reports, and platform assistance
                  </p>
                </div>
              </div>
              
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24 hours during business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}