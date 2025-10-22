import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Plus, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Edit,
  Trash2,
  FileText,
  BarChart3,
  GraduationCap,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ShinyText } from '@/components/animations/ShinyText';
import { CountUp } from '@/components/animations/CountUp';

const CounselorPortalPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [counselorProfile, setCounselorProfile] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (user) {
      fetchCounselorProfile();
      fetchStudents();
    }
  }, [user]);

  const fetchCounselorProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('counselor_profiles_2025_10_06_00_42')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching counselor profile:', error);
        return;
      }

      if (data) {
        setCounselorProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('counselor_students_2025_10_06_00_42')
        .select('*')
        .eq('counselor_id', user.id);

      if (error) {
        console.error('Error fetching students:', error);
        return;
      }

      setStudents(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const mockStudents = [
    {
      id: '1',
      name: 'Example Student',
      email: 'example@email.com',
      grade: '12',
      gpa: 3.5,
      fafsa_status: 'in_progress',
      applications_submitted: 5,
      aid_received: 25000,
      last_activity: '2024-01-15'
    }
  ];

  const displayStudents = students.length > 0 ? students : mockStudents;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        
          <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center">
              <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Counselor Portal</CardTitle>
              <CardDescription>
                Please log in to access the counselor portal
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <a href="/login">Log In</a>
              </Button>
            </CardContent>
          </Card>
        
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading counselor portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
            <Users className="w-4 h-4 mr-2" />
            For Counselors
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="Counselor Portal" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your students and track their college application progress
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">
                      <CountUp end={displayStudents.length} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          

          
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">FAFSA Complete</p>
                    <p className="text-2xl font-bold text-gray-900">
                      <CountUp end={displayStudents.filter(s => s.fafsa_status === 'completed').length} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          

          
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      <CountUp end={displayStudents.filter(s => s.fafsa_status === 'in_progress').length} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          

          
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Aid Received</p>
                    <p className="text-2xl font-bold text-gray-900">
                      $<CountUp end={displayStudents.length > 0 ? Math.round(displayStudents.reduce((sum, s) => sum + (s.aid_received || 0), 0) / displayStudents.length) : 0} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm">
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Student Management</CardTitle>
                      <CardDescription>Track and manage your students' college application progress</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const csvContent = "data:text/csv;charset=utf-8," + 
                            "Name,Email,Grade,GPA,FAFSA Status,Applications,Aid Received\n" +
                            displayStudents.map(s => 
                              `${s.name},${s.email},${s.grade},${s.gpa},${s.fafsa_status},${s.applications_submitted},${s.aid_received || 0}`
                            ).join("\n");
                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encodedUri);
                          link.setAttribute("download", "students_export.csv");
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          const name = prompt('Enter student name:');
                          const email = prompt('Enter student email:');
                          if (name && email) {
                            alert(`Student ${name} (${email}) added successfully!`);
                          }
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Student
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Student</th>
                          <th className="text-left py-3 px-4">Grade</th>
                          <th className="text-left py-3 px-4">GPA</th>
                          <th className="text-left py-3 px-4">FAFSA Status</th>
                          <th className="text-left py-3 px-4">Applications</th>
                          <th className="text-left py-3 px-4">Aid Received</th>
                          <th className="text-left py-3 px-4">Last Activity</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayStudents.map((student) => (
                          <tr key={student.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-gray-600">{student.email}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{student.grade}</td>
                            <td className="py-3 px-4">{student.gpa}</td>
                            <td className="py-3 px-4">
                              <Badge 
                                variant={
                                  student.fafsa_status === 'completed' ? 'default' :
                                  student.fafsa_status === 'in_progress' ? 'secondary' : 'outline'
                                }
                                className={
                                  student.fafsa_status === 'completed' ? 'bg-green-100 text-green-800' :
                                  student.fafsa_status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'
                                }
                              >
                                {student.fafsa_status.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{student.applications_submitted}</td>
                            <td className="py-3 px-4">${student.aid_received?.toLocaleString() || '0'}</td>
                            <td className="py-3 px-4">{student.last_activity}</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const newName = prompt('Enter new name:', student.name);
                                    if (newName) {
                                      alert(`Student name updated to: ${newName}`);
                                    }
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    alert(`Student Details:\nName: ${student.name}\nEmail: ${student.email}\nGrade: ${student.grade}\nGPA: ${student.gpa}\nFAFSA Status: ${student.fafsa_status}\nApplications: ${student.applications_submitted}\nAid Received: $${student.aid_received?.toLocaleString() || '0'}`);
                                  }}
                                >
                                  <FileText className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle>Counselor Profile</CardTitle>
                  <CardDescription>Manage your professional information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Your full name" />
                    </div>
                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <Input id="title" placeholder="College Counselor" />
                    </div>
                    <div>
                      <Label htmlFor="school">School/Organization</Label>
                      <Input id="school" placeholder="School name" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="(555) 123-4567" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea id="bio" placeholder="Tell us about your experience..." rows={4} />
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => alert('Profile saved successfully!')}
                  >
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <FileText className="h-8 w-8 text-blue-600 mb-2" />
                    <CardTitle>FAFSA Tracking Sheet</CardTitle>
                    <CardDescription>Download a spreadsheet to track student FAFSA progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://studentaid.gov/sites/default/files/fafsa-tracking-worksheet.pdf" target="_blank">
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              

              
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <BookOpen className="h-8 w-8 text-green-600 mb-2" />
                    <CardTitle>Counselor Training</CardTitle>
                    <CardDescription>Access training materials and best practices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://studentaid.gov/help-center/answers/topic/counselors" target="_blank">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Training
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              

              
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <Target className="h-8 w-8 text-purple-600 mb-2" />
                    <CardTitle>Success Metrics</CardTitle>
                    <CardDescription>Track your impact and student outcomes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/impact" target="_blank">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              

              
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <Calendar className="h-8 w-8 text-orange-600 mb-2" />
                    <CardTitle>Important Deadlines</CardTitle>
                    <CardDescription>Stay updated on key financial aid deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://studentaid.gov/help-center/answers/article/fafsa-deadlines" target="_blank">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Calendar
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              

              
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <Award className="h-8 w-8 text-red-600 mb-2" />
                    <CardTitle>Scholarship Database</CardTitle>
                    <CardDescription>Access curated scholarships for your students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/scholarships">
                        <Award className="h-4 w-4 mr-2" />
                        Browse Scholarships
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              

              
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <Users className="h-8 w-8 text-indigo-600 mb-2" />
                    <CardTitle>Counselor Community</CardTitle>
                    <CardDescription>Connect with other counselors and share resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://www.nacanet.org/" target="_blank">
                        <Users className="h-4 w-4 mr-2" />
                        Join Community
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CounselorPortalPage;