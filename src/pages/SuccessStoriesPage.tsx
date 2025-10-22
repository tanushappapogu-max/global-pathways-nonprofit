import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Quote, 
  GraduationCap, 
  DollarSign, 
  MapPin,
  Calendar,
  Award,
  Heart,
  Users,
  TrendingUp,
  BookOpen,
  Play
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';
import { Magnetic } from '@/components/animations/Magnetic';
import { CountUp } from '@/components/animations/CountUp';

interface SuccessStory {
  id: string;
  name: string;
  photo: string;
  country: string;
  college: string;
  major: string;
  graduationYear: number;
  story: string;
  quote: string;
  aidReceived: number;
  challenges: string[];
  achievements: string[];
  videoUrl?: string;
  featured: boolean;
}

interface CounselorTestimonial {
  id: string;
  name: string;
  title: string;
  school: string;
  photo: string;
  testimonial: string;
  studentsHelped: number;
}

export const SuccessStoriesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const successStories: SuccessStory[] = [
    {
      id: '1',
      name: 'Maria Rodriguez',
      photo: '/images/student1.jpg',
      country: 'Mexico',
      college: 'Stanford University',
      major: 'Computer Science',
      graduationYear: 2024,
      story: 'As a first-generation college student from Mexico, I had no idea where to start with US college applications. Global Pathways guided me through every step of the FAFSA process and helped me find scholarships I never knew existed. The multilingual support was crucial - I could switch between English and Spanish whenever I got confused.',
      quote: 'Global Pathways didn\'t just help me get into college - they helped me believe I belonged there.',
      aidReceived: 45000,
      challenges: ['First-generation student', 'Language barrier', 'Complex financial aid process'],
      achievements: ['Full scholarship to Stanford', 'Dean\'s List', 'Software engineering internship at Google'],
      featured: true
    },
    {
      id: '2',
      name: 'Ahmed Hassan',
      photo: '/images/student2.jpg',
      country: 'Egypt',
      college: 'MIT',
      major: 'Electrical Engineering',
      graduationYear: 2023,
      story: 'Coming from Cairo, the US college system seemed impossible to navigate. The FAFSA was particularly confusing for international students. Global Pathways\' step-by-step guide and the counselor portal helped my high school counselor support me better. I received need-based aid that made MIT affordable.',
      quote: 'The scholarship search tool found opportunities I would have never discovered on my own.',
      aidReceived: 52000,
      challenges: ['International student status', 'Complex visa requirements', 'Limited financial resources'],
      achievements: ['MIT full ride', 'Research published in IEEE', 'Founded robotics club'],
      featured: true
    },
    {
      id: '3',
      name: 'Priya Patel',
      photo: '/images/student3.jpg',
      country: 'India',
      college: 'Harvard University',
      major: 'Pre-Med',
      graduationYear: 2025,
      story: 'My family runs a small business in Mumbai, and we thought Harvard was financially impossible. Global Pathways showed us how need-blind admissions work and helped us understand that top universities often provide the best financial aid. The cost calculator helped us plan and budget effectively.',
      quote: 'I learned that the sticker price isn\'t what you actually pay - financial aid makes dreams possible.',
      aidReceived: 65000,
      challenges: ['Middle-class income gap', 'Competitive applicant pool', 'Medical school preparation'],
      achievements: ['Harvard acceptance', 'Pre-med track', 'Hospital volunteer work'],
      featured: false
    },
    {
      id: '4',
      name: 'Jean-Luc Dubois',
      photo: '/images/student4.jpg',
      country: 'France',
      college: 'UC Berkeley',
      major: 'Environmental Science',
      graduationYear: 2024,
      story: 'As an environmental activist from Lyon, I wanted to study sustainability in the US. The scholarship database helped me find environmental scholarships I qualified for. The multilingual support in French made the process much easier for my parents to understand and support.',
      quote: 'Global Pathways connected me with scholarships specifically for environmental studies that covered 80% of my costs.',
      aidReceived: 35000,
      challenges: ['Specialized field requirements', 'Out-of-state tuition', 'Environmental focus'],
      achievements: ['Environmental scholarship recipient', 'Research assistant', 'Climate action leader'],
      featured: false
    },
    {
      id: '5',
      name: 'Sarah Johnson',
      photo: '/images/student5.jpg',
      country: 'United States',
      college: 'Yale University',
      major: 'International Relations',
      graduationYear: 2023,
      story: 'As a first-generation American whose parents immigrated from Nigeria, I felt lost in the college process. My high school counselor used Global Pathways\' counselor portal to track my progress and ensure I didn\'t miss any deadlines. The impact metrics showed me I wasn\'t alone in this journey.',
      quote: 'Seeing other students like me succeed gave me the confidence to apply to my dream schools.',
      aidReceived: 58000,
      challenges: ['First-generation college student', 'Complex family finances', 'High expectations'],
      achievements: ['Yale full scholarship', 'Student government president', 'UN internship'],
      featured: true
    }
  ];

  const counselorTestimonials: CounselorTestimonial[] = [
    {
      id: '1',
      name: 'Ms. Jennifer Chen',
      title: 'College Counselor',
      school: 'Lincoln High School, Los Angeles',
      photo: '/images/counselor1.jpg',
      testimonial: 'Global Pathways has transformed how I support my students. The counselor portal lets me track 200+ students\' FAFSA progress in real-time. The multilingual resources help me serve our diverse student body better. In just one year, our FAFSA completion rate increased from 60% to 95%.',
      studentsHelped: 247
    },
    {
      id: '2',
      name: 'Mr. David Rodriguez',
      title: 'Financial Aid Coordinator',
      school: 'Roosevelt Community College',
      photo: '/images/counselor2.jpg',
      testimonial: 'The scholarship database is incredible. I can filter opportunities by student demographics and academic interests. The automated reminders ensure students don\'t miss deadlines. My students have unlocked over $500,000 in scholarships this year alone.',
      studentsHelped: 156
    },
    {
      id: '3',
      name: 'Dr. Lisa Thompson',
      title: 'Director of College Prep',
      school: 'International Academy',
      photo: '/images/counselor3.jpg',
      testimonial: 'Working with international students requires specialized knowledge. Global Pathways provides accurate, up-to-date information about visa requirements, financial aid for international students, and cultural adaptation resources. It\'s become an essential tool in our office.',
      studentsHelped: 89
    }
  ];

  const impactMetrics = {
    studentsHelped: 2847,
    scholarshipsUnlocked: 2100000,
    fafsaCompletions: 1956,
    collegeAcceptances: 1234,
    averageAidPerStudent: 42000
  };

  const filteredStories = selectedCategory === 'all' 
    ? successStories 
    : selectedCategory === 'featured'
    ? successStories.filter(story => story.featured)
    : successStories.filter(story => story.country.toLowerCase().includes(selectedCategory));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            Success Stories
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="Student Success Stories" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real students sharing their journeys from application to acceptance. 
            See how Global Pathways helped them achieve their college dreams.
          </p>
        </div>

        {/* Impact Metrics */}
        <section className="mb-16">
          <Magnetic>
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="grid md:grid-cols-5 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold mb-2">
                      <CountUp end={impactMetrics.studentsHelped} suffix="+" />
                    </div>
                    <p className="text-blue-100">Students Helped</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">
                      <CountUp end={2.1} suffix="M+" prefix="$" />
                    </div>
                    <p className="text-blue-100">Scholarships Unlocked</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">
                      <CountUp end={impactMetrics.fafsaCompletions} suffix="+" />
                    </div>
                    <p className="text-blue-100">FAFSA Completions</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">
                      <CountUp end={impactMetrics.collegeAcceptances} suffix="+" />
                    </div>
                    <p className="text-blue-100">College Acceptances</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">
                      <CountUp end={42} suffix="K" prefix="$" />
                    </div>
                    <p className="text-blue-100">Avg Aid Per Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Magnetic>
        </section>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-2">
            {['all', 'featured', 'mexico', 'egypt', 'india', 'france', 'united states'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Stories' : 
                 category === 'featured' ? 'Featured' : 
                 category === 'united states' ? 'USA' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Success Stories Grid */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredStories.map((story) => (
              <Magnetic key={story.id}>
                <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {story.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{story.name}</CardTitle>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {story.country}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          {story.college} • {story.major}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Class of {story.graduationYear}
                        </div>
                      </div>
                      {story.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="mb-4">
                      <Quote className="h-5 w-5 text-blue-600 mb-2" />
                      <p className="text-gray-700 italic">"{story.quote}"</p>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-4">{story.story}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Challenges Overcome:</h4>
                        <div className="space-y-1">
                          {story.challenges.slice(0, 2).map((challenge, index) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                              {challenge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                        <div className="space-y-1">
                          {story.achievements.slice(0, 2).map((achievement, index) => (
                            <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center text-green-600 font-semibold">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${story.aidReceived.toLocaleString()} in aid
                      </div>
                      <Button variant="outline" size="sm">
                        Read Full Story
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Magnetic>
            ))}
          </div>
        </section>

        {/* Counselor Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              <ShinyText text="What Counselors Say" />
            </h2>
            <p className="text-xl text-gray-600">
              Hear from the educators who use Global Pathways to support their students
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {counselorTestimonials.map((testimonial) => (
              <Magnetic key={testimonial.id}>
                <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.title}</CardDescription>
                        <p className="text-sm text-gray-600">{testimonial.school}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Quote className="h-5 w-5 text-blue-600 mb-3" />
                    <p className="text-gray-700 mb-4">"{testimonial.testimonial}"</p>
                    <div className="flex items-center text-blue-600 font-semibold">
                      <Users className="h-4 w-4 mr-1" />
                      {testimonial.studentsHelped} students helped
                    </div>
                  </CardContent>
                </Card>
              </Magnetic>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Magnetic>
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
              <CardContent className="p-12">
                <Heart className="h-16 w-16 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">
                  <ShinyText text="Ready to Write Your Success Story?" className="text-white" />
                </h2>
                <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                  Join thousands of students who have achieved their college dreams with Global Pathways
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                    Start Your Journey
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
                    Find Scholarships
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Magnetic>
        </section>
      </div>
    </div>
  );
};