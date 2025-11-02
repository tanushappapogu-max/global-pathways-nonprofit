import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CountUp } from '@/components/animations/CountUp';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  Award, 
  FileText, 
  CheckCircle,
  Search,
  Filter,
  Download,
  Mail,
  Calendar,
  Target,
  BarChart3,
  AlertCircle,
  Clock,
  GraduationCap,
  DollarSign,
  X,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  TrendingDown
} from 'lucide-react';

interface Student {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  grade_level: string;
  gpa: number;
  notes: string;
  added_at: string;
  progress?: {
    fafsa_completed: boolean;
    profile_completion: number;
    scholarships_applied: number;
    colleges_applied: number;
    last_activity: string;
  };
}

const CounselorPortalPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterFafsa, setFilterFafsa] = useState('all');
  const [newStudent, setNewStudent] = useState({
    student_name: '',
    student_email: '',
    grade_level: '',
    gpa: '',
    notes: ''
  });

  const [isCounselor, setIsCounselor] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, [user]);

  useEffect(() => {
    if (isCounselor) {
      fetchStudents();
    }
  }, [isCounselor]);

  useEffect(() => {
    let filtered = students.filter(student =>
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterGrade !== 'all') {
      filtered = filtered.filter(s => s.grade_level === filterGrade);
    }

    if (filterFafsa !== 'all') {
      filtered = filtered.filter(s => 
        filterFafsa === 'completed' ? s.progress?.fafsa_completed : !s.progress?.fafsa_completed
      );
    }

    setFilteredStudents(filtered);
  }, [searchTerm, students, filterGrade, filterFafsa]);

  const checkUserRole = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        setIsCounselor(false);
      } else {
        setIsCounselor(data?.role === 'counselor');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking role:', error);
      setIsCounselor(false);
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('counselor_students')
        .select('*')
        .eq('counselor_id', user?.id)
        .order('added_at', { ascending: false });

      if (error) throw error;

      const studentsWithProgress = await Promise.all(
        (data || []).map(async (student) => {
          const { data: progress } = await supabase
            .from('student_progress')
            .select('*')
            .eq('student_id', student.student_id)
            .single();

          return { ...student, progress };
        })
      );

      setStudents(studentsWithProgress);
      setFilteredStudents(studentsWithProgress);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const addStudent = async () => {
    if (!newStudent.student_name || !newStudent.student_email) {
      alert('Please fill in required fields');
      return;
    }

    try {
      const studentId = crypto.randomUUID();
      
      const { error } = await supabase
        .from('counselor_students')
        .insert({
          counselor_id: user?.id,
          student_id: studentId,
          ...newStudent,
          gpa: parseFloat(newStudent.gpa) || null
        });

      if (error) throw error;

      // Create initial progress entry
      await supabase
        .from('student_progress')
        .insert({
          student_id: studentId,
          counselor_id: user?.id,
          fafsa_completed: false,
          profile_completion: 0,
          scholarships_applied: 0,
          colleges_applied: 0
        });

      setShowAddModal(false);
      setNewStudent({ student_name: '', student_email: '', grade_level: '', gpa: '', notes: '' });
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student');
    }
  };

  const deleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to remove this student?')) return;

    try {
      const { error } = await supabase
        .from('counselor_students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Grade', 'GPA', 'FAFSA Status', 'Profile %', 'Scholarships', 'Colleges'];
    const rows = filteredStudents.map(s => [
      s.student_name,
      s.student_email,
      s.grade_level,
      s.gpa,
      s.progress?.fafsa_completed ? 'Complete' : 'Incomplete',
      s.progress?.profile_completion || 0,
      s.progress?.scholarships_applied || 0,
      s.progress?.colleges_applied || 0
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    totalStudents: students.length,
    fafsaCompleted: students.filter(s => s.progress?.fafsa_completed).length,
    avgScholarships: Math.round(
      students.reduce((sum, s) => sum + (s.progress?.scholarships_applied || 0), 0) / (students.length || 1)
    ),
    avgProgress: Math.round(
      students.reduce((sum, s) => sum + (s.progress?.profile_completion || 0), 0) / (students.length || 1)
    )
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading counselor portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 max-w-md">
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Counselor Portal</h2>
            <p className="text-gray-400 mb-6">Please log in to access the counselor portal</p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 w-full" asChild>
              <a href="/login">Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isCounselor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 max-w-md">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
              <p className="text-gray-400 mb-6">
                This portal is only accessible to counselors. Students should use the regular dashboard.
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 w-full" asChild>
                <a href="/dashboard">Go to Student Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      <motion.div 
        className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
        transition={{ duration: 8, repeat: Infinity }} 
      />
      <motion.div 
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" 
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }} 
        transition={{ duration: 8, repeat: Infinity, delay: 1 }} 
      />

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Counselor Portal
            </h1>
            <p className="text-xl text-gray-400">Manage and track your students' progress</p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add Student
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: "Total Students", value: stats.totalStudents, color: "blue", gradient: "from-blue-500 to-blue-600" },
            { icon: CheckCircle, label: "FAFSA Completed", value: stats.fafsaCompleted, color: "green", gradient: "from-green-500 to-green-600" },
            { icon: Award, label: "Avg Scholarships", value: stats.avgScholarships, color: "purple", gradient: "from-purple-500 to-purple-600" },
            { icon: Target, label: "Avg Progress", value: stats.avgProgress, suffix: "%", color: "orange", gradient: "from-orange-500 to-orange-600" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search & Filters */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger className="w-full md:w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="9">Grade 9</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterFafsa} onValueChange={setFilterFafsa}>
                <SelectTrigger className="w-full md:w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="FAFSA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={exportToCSV}
                variant="outline" 
                className="w-full md:w-auto border-white/20 text-white hover:bg-white/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {students.length === 0 ? 'No Students Yet' : 'No Matching Students'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {students.length === 0 
                    ? 'Add students to start tracking their progress' 
                    : 'Try adjusting your filters or search term'}
                </p>
                {students.length === 0 && (
                  <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Your First Student
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-1">{student.student_name}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {student.student_email}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {student.grade_level && (
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                          Grade {student.grade_level}
                        </Badge>
                      )}
                      {student.gpa && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                          GPA: {student.gpa.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-400 text-xs">Profile Completion</span>
                          <span className="text-white text-xs font-semibold">
                            {student.progress?.profile_completion || 0}%
                          </span>
                        </div>
                        <Progress value={student.progress?.profile_completion || 0} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
                          <div className="text-lg font-bold text-purple-400">
                            {student.progress?.scholarships_applied || 0}
                          </div>
                          <div className="text-xs text-gray-400">Scholarships</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
                          <div className="text-lg font-bold text-blue-400">
                            {student.progress?.colleges_applied || 0}
                          </div>
                          <div className="text-xs text-gray-400">Colleges</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mb-3 border-t border-white/10">
                      {student.progress?.fafsa_completed ? (
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          FAFSA Done
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30">
                          <Clock className="h-3 w-3 mr-1" />
                          FAFSA Pending
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowDetailModal(true);
                        }}
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteStudent(student.id)}
                        className="border-red-400/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md"
            >
              <Card className="bg-slate-900 border border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Add New Student</CardTitle>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setShowAddModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-gray-400">
                    Enter student information to begin tracking their progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-white text-sm mb-2 block">Student Name *</label>
                    <Input
                      placeholder="John Doe"
                      value={newStudent.student_name}
                      onChange={(e) => setNewStudent({...newStudent, student_name: e.target.value})}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm mb-2 block">Email *</label>
                    <Input
                      type="email"
                      placeholder="student@email.com"
                      value={newStudent.student_email}
                      onChange={(e) => setNewStudent({...newStudent, student_email: e.target.value})}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white text-sm mb-2 block">Grade Level</label>
                      <Select value={newStudent.grade_level} onValueChange={(value) => setNewStudent({...newStudent, grade_level: value})}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9">Grade 9</SelectItem>
                          <SelectItem value="10">Grade 10</SelectItem>
                          <SelectItem value="11">Grade 11</SelectItem>
                          <SelectItem value="12">Grade 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">GPA</label>
                      <Input
                        type="number"
                        step="0.01"
                        max="4.0"
                        placeholder="3.75"
                        value={newStudent.gpa}
                        onChange={(e) => setNewStudent({...newStudent, gpa: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white text-sm mb-2 block">Notes (Optional)</label>
                    <Textarea
                      placeholder="Additional notes about the student..."
                      value={newStudent.notes}
                      onChange={(e) => setNewStudent({...newStudent, notes: e.target.value})}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      onClick={() => setShowAddModal(false)}
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={addStudent}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Add Student
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Student Detail Modal */}
        {showDetailModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="bg-slate-900 border border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white text-2xl">{selectedStudent.student_name}</CardTitle>
                      <CardDescription className="text-gray-400">{selectedStudent.student_email}</CardDescription>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">GPA</div>
                      <div className="text-xl font-bold text-white">{selectedStudent.gpa?.toFixed(2) || 'N/A'}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold mb-3">Progress Overview</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Profile Completion</span>
                          <span className="text-white font-semibold">{selectedStudent.progress?.profile_completion || 0}%</span>
                        </div>
                        <Progress value={selectedStudent.progress?.profile_completion || 0} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                          <Award className="h-5 w-5 text-purple-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-purple-400">{selectedStudent.progress?.scholarships_applied || 0}</div>
                          <div className="text-xs text-gray-400">Scholarships Applied</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                          <GraduationCap className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-400">{selectedStudent.progress?.colleges_applied || 0}</div>
                          <div className="text-xs text-gray-400">Colleges Applied</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                          {selectedStudent.progress?.fafsa_completed ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-400 mx-auto mb-2" />
                              <div className="text-sm font-bold text-green-400">Complete</div>
                            </>
                          ) : (
                            <>
                              <Clock className="h-5 w-5 text-orange-400 mx-auto mb-2" />
                              <div className="text-sm font-bold text-orange-400">Pending</div>
                            </>
                          )}
                          <div className="text-xs text-gray-400">FAFSA Status</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedStudent.notes && (
                    <div>
                      <h3 className="text-white font-bold mb-2">Notes</h3>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-gray-300 text-sm">{selectedStudent.notes}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-white font-bold mb-2">Activity Timeline</h3>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Added on {new Date(selectedStudent.added_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      {selectedStudent.progress?.last_activity && (
                        <div className="flex items-center text-gray-400 text-sm mt-2">
                          <Clock className="h-4 w-4 mr-2" />
                          Last active {new Date(selectedStudent.progress.last_activity).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      asChild
                    >
                      <a href={`mailto:${selectedStudent.student_email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </a>
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => setShowDetailModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounselorPortalPage;

