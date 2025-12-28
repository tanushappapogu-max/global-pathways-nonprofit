import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Lock } from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';


export const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
            <Settings className="w-4 h-4 mr-2" />
            Admin Panel
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="Admin Dashboard" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Administrative tools and settings
          </p>
        </div>

        
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8 text-center">
              <Lock className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
              <p className="text-gray-600 mb-6">
                This area is restricted to authorized administrators only.
              </p>
            </CardContent>
          </Card>
        
      </div>
    </div>
  );
};