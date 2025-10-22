import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Award, Globe } from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';

import { CountUp } from '@/components/animations/CountUp';

export const ImpactPage = () => {
  const stats = [
    { number: 10000, label: "Students Helped", suffix: "+", color: "text-blue-600", icon: Users },
    { number: 5, label: "Million in Aid", prefix: "$", suffix: "M+", color: "text-green-600", icon: Award },
    { number: 50, label: "Partner Organizations", suffix: "+", color: "text-purple-600", icon: Globe },
    { number: 95, label: "Success Rate", suffix: "%", color: "text-orange-600", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
            <TrendingUp className="w-4 h-4 mr-2" />
            Our Impact
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="Making a Difference" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Global Pathways is transforming lives through education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              
                <Card className="text-center bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                      <CountUp 
                        end={stat.number} 
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                      />
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              
            );
          })}
        </div>
      </div>
    </div>
  );
};