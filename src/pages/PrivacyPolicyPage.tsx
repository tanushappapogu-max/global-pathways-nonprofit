import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';


export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
            <Shield className="w-4 h-4 mr-2" />
            Privacy Policy
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="Privacy Policy" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            How we protect and handle your personal information
          </p>
        </div>

        
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <h2>Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us.</p>
                
                <h2>How We Use Your Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p>
                
                <h2>Information Sharing</h2>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.</p>
                
                <h2>Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                
                <h2>Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at privacy@globalpathways.org.</p>
              </div>
            </CardContent>
          </Card>
        
      </div>
    </div>
  );
};