import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { CountUp } from '@/components/animations/CountUp';
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
  MessageSquare,
  Send,
  ThumbsUp
} from 'lucide-react';

interface SuccessStory {
  id: string;
  name: string;
  photo?: string;
  country: string;
  college: string;
  major: string;
  graduation_year: number;
  story: string;
  quote: string;
  aid_received: number;
  challenges: string[];
  achievements: string[];
  video_url?: string;
  featured: boolean;
  created_at: string;
}

interface Comment {
  id: string;
  story_id: string;
  author_name: string;
  author_email: string;
  comment_text: string;
  created_at: string;
  likes: number;
}

export const SuccessStoriesPage: React.FC = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState<{ [key: string]: { name: string; email: string; text: string } }>({});
  const [submittingComment, setSubmittingComment] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setStories(data || []);
      
      // Fetch comments for all stories
      if (data && data.length > 0) {
        data.forEach(story => fetchComments(story.id));
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (storyId: string) => {
    try {
      const { data, error } = await supabase
        .from('story_comments')
        .select('*')
        .eq('story_id', storyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setComments(prev => ({
        ...prev,
        [storyId]: data || []
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (storyId: string) => {
    const form = commentForm[storyId];
    if (!form || !form.name || !form.email || !form.text) {
      alert('Please fill in all fields');
      return;
    }

    setSubmittingComment(prev => ({ ...prev, [storyId]: true }));

    try {
      const { data, error } = await supabase
        .from('story_comments')
        .insert({
          story_id: storyId,
          author_name: form.name,
          author_email: form.email,
          comment_text: form.text,
          likes: 0
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh comments for this story
      await fetchComments(storyId);

      // Clear form
      setCommentForm(prev => ({
        ...prev,
        [storyId]: { name: '', email: '', text: '' }
      }));

      alert('Comment posted successfully!');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(prev => ({ ...prev, [storyId]: false }));
    }
  };

  const handleLikeComment = async (commentId: string, currentLikes: number, storyId: string) => {
    try {
      const { error } = await supabase
        .from('story_comments')
        .update({ likes: currentLikes + 1 })
        .eq('id', commentId);

      if (error) throw error;

      // Refresh comments
      await fetchComments(storyId);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const updateCommentForm = (storyId: string, field: string, value: string) => {
    setCommentForm(prev => ({
      ...prev,
      [storyId]: {
        ...(prev[storyId] || { name: '', email: '', text: '' }),
        [field]: value
      }
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredStories = selectedCategory === 'all' 
    ? stories 
    : selectedCategory === 'featured'
    ? stories.filter(story => story.featured)
    : stories.filter(story => story.country.toLowerCase().includes(selectedCategory));

  const totalAid = stories.reduce((sum, story) => sum + (story.aid_received || 0), 0);
  const avgAid = stories.length > 0 ? Math.round(totalAid / stories.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading success stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      <motion.div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 10, repeat: Infinity }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Header */}
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Badge className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-8 py-3 text-base font-medium">
            <Star className="w-5 h-5 mr-2" />
            Success Stories
          </Badge>
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-4">Student</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Success Stories</span>
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Real students sharing their journeys from application to acceptance
          </p>
        </motion.div>

        {/* Impact Metrics */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl border-0">
            <CardContent className="pt-8 pb-8">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-5xl font-black mb-3">
                    <CountUp end={stories.length} suffix="+" />
                  </div>
                  <p className="text-blue-100 text-lg">Success Stories</p>
                </div>
                <div>
                  <div className="text-5xl font-black mb-3">
                    <CountUp end={Math.round(totalAid / 1000000)} suffix="M+" prefix="$" />
                  </div>
                  <p className="text-blue-100 text-lg">Total Aid Received</p>
                </div>
                <div>
                  <div className="text-5xl font-black mb-3">
                    <CountUp end={Math.round(avgAid / 1000)} suffix="K" prefix="$" />
                  </div>
                  <p className="text-blue-100 text-lg">Avg Aid Per Student</p>
                </div>
                <div>
                  <div className="text-5xl font-black mb-3">
                    <CountUp end={stories.filter(s => s.featured).length} suffix="+" />
                  </div>
                  <p className="text-blue-100 text-lg">Featured Stories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-2">
            {['all', 'featured'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'border-white/20 text-white hover:bg-white/10'}
              >
                {category === 'all' ? 'All Stories' : 'Featured'}
              </Button>
            ))}
          </div>
        </div>

        {/* Success Stories Grid */}
        <section className="mb-16">
          {filteredStories.length === 0 ? (
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardContent className="text-center py-16">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No stories found</h3>
                <p className="text-gray-400">Check back soon for inspiring success stories!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {filteredStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-blue-400/50 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start space-x-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                          {story.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between flex-wrap gap-4">
                            <div>
                              <CardTitle className="text-3xl mb-2 text-white">{story.name}</CardTitle>
                              <div className="flex flex-wrap items-center gap-4 text-gray-400 text-base mb-3">
                                <div className="flex items-center">
                                  <MapPin className="h-5 w-5 mr-2" />
                                  {story.country}
                                </div>
                                <div className="flex items-center">
                                  <GraduationCap className="h-5 w-5 mr-2" />
                                  {story.college}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-5 w-5 mr-2" />
                                  Class of {story.graduation_year}
                                </div>
                              </div>
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                                {story.major}
                              </Badge>
                            </div>
                            {story.featured && (
                              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                                <Star className="h-4 w-4 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Quote */}
                      <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                        <Quote className="h-6 w-6 text-blue-400 mb-3" />
                        <p className="text-gray-300 italic text-lg leading-relaxed">"{story.quote}"</p>
                      </div>
                      
                      {/* Story */}
                      <p className="text-gray-300 text-base leading-relaxed">{story.story}</p>
                      
                      {/* Challenges & Achievements */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-white mb-3 text-lg flex items-center">
                            <Award className="h-5 w-5 mr-2 text-orange-400" />
                            Challenges Overcome
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {story.challenges?.map((challenge, idx) => (
                              <Badge key={idx} variant="outline" className="text-sm border-orange-400/30 text-orange-300">
                                {challenge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-3 text-lg flex items-center">
                            <Star className="h-5 w-5 mr-2 text-green-400" />
                            Key Achievements
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {story.achievements?.map((achievement, idx) => (
                              <Badge key={idx} variant="outline" className="text-sm border-green-400/30 text-green-300">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Aid Amount */}
                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <div className="flex items-center text-green-400 font-bold text-xl">
                          <DollarSign className="h-6 w-6 mr-2" />
                          ${story.aid_received?.toLocaleString()} in financial aid
                        </div>
                        <div className="flex items-center text-gray-400">
                          <MessageSquare className="h-5 w-5 mr-2" />
                          {comments[story.id]?.length || 0} comments
                        </div>
                      </div>

                      {/* Comments Section */}
                      <div className="pt-6 border-t border-white/10">
                        <h4 className="font-semibold text-white mb-4 text-xl flex items-center">
                          <MessageSquare className="h-6 w-6 mr-2 text-blue-400" />
                          Comments ({comments[story.id]?.length || 0})
                        </h4>

                        {/* Existing Comments */}
                        <div className="space-y-4 mb-6">
                          {comments[story.id]?.map((comment) => (
                            <div key={comment.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-semibold text-white">{comment.author_name}</p>
                                  <p className="text-sm text-gray-400">{formatDate(comment.created_at)}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLikeComment(comment.id, comment.likes, story.id)}
                                  className="text-gray-400 hover:text-blue-400"
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  {comment.likes}
                                </Button>
                              </div>
                              <p className="text-gray-300">{comment.comment_text}</p>
                            </div>
                          ))}
                        </div>

                        {/* Comment Form */}
                        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                          <h5 className="font-semibold text-white mb-4">Leave a Comment</h5>
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Input
                                  placeholder="Your Name"
                                  value={commentForm[story.id]?.name || ''}
                                  onChange={(e) => updateCommentForm(story.id, 'name', e.target.value)}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                />
                              </div>
                              <div>
                                <Input
                                  type="email"
                                  placeholder="Your Email"
                                  value={commentForm[story.id]?.email || ''}
                                  onChange={(e) => updateCommentForm(story.id, 'email', e.target.value)}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                />
                              </div>
                            </div>
                            <Textarea
                              placeholder="Share your thoughts, questions, or words of encouragement..."
                              rows={4}
                              value={commentForm[story.id]?.text || ''}
                              onChange={(e) => updateCommentForm(story.id, 'text', e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                            <Button
                              onClick={() => handleCommentSubmit(story.id)}
                              disabled={submittingComment[story.id]}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                              {submittingComment[story.id] ? (
                                <>Posting...</>
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-2" />
                                  Post Comment
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl border-0">
            <CardContent className="p-12">
              <Heart className="h-20 w-20 mx-auto mb-6" />
              <h2 className="text-4xl font-black mb-4">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                Join thousands of students who have achieved their college dreams
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                  Start Your Journey
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold">
                  Find Scholarships
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};