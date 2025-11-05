import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';

export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium inline-flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Privacy Policy
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            <ShinyText text="Privacy Policy" />
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            How we protect and handle your personal information
          </p>
        </div>

        {/* Policy Card */}
        <Card className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 rounded-3xl">
          <CardContent className="p-8 space-y-6">
            <div className="prose prose-lg text-gray-200 max-w-none">
              <h2>Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, use our services, or contact us.
              </p>

              <h2>How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, and to communicate with you.
              </p>

              <h2>Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.
              </p>

              <h2>Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@globalpathways.org" className="text-blue-400 hover:underline">
                  privacy@globalpathways.org
                </a>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
