import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';


const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-12">
              <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                <ShinyText text="Page Not Found" />
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => window.history.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        
      </div>
    </div>
  );
};

export default NotFound;