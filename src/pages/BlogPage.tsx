import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Calendar, 
  User, 
  ArrowLeft, 
  Clock, 
  Tag,
  BookOpen,
  TrendingUp,
  Award,
  Newspaper
} from 'lucide-react';

const BlogPage = () => {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchArticleBySlug(slug);
    } else {
      fetchArticles();
      fetchCategories();
    }
  }, [slug]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_articles_2025_10_14_03_00')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticleBySlug = async (articleSlug) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_articles_2025_10_14_03_00')
        .select('*')
        .eq('slug', articleSlug)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('Error fetching article:', error);
        return;
      }

      setCurrentArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_articles_2025_10_14_03_00')
        .select('category')
        .eq('is_published', true);

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderMarkdown = (content) => {
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mb-6 text-white">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mb-4 mt-8 text-white">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mb-3 mt-6 text-white">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 text-gray-300">• $1</li>')
      .replace(/\n/gim, '<br>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading blog content...</p>
        </div>
      </div>
    );
  }

  // Individual Article View
  if (slug && currentArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <motion.div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 10, repeat: Infinity }} />

        <div className="max-w-4xl mx-auto px-4 py-16 relative">
          <div className="mb-8">
            <Link to="/blog">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            {currentArticle.featured_image && (
              <img 
                src={currentArticle.featured_image} 
                alt={currentArticle.title}
                className="w-full h-96 object-cover rounded-xl mb-8 shadow-2xl"
              />
            )}
            
            <div className="flex items-center space-x-4 mb-6">
              {currentArticle.category && (
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-2">
                  {currentArticle.category}
                </Badge>
              )}
              <div className="flex items-center text-gray-400 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(currentArticle.published_at)}
              </div>
              {currentArticle.reading_time && (
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  {currentArticle.reading_time} min read
                </div>
              )}
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              {currentArticle.title}
            </h1>

            {currentArticle.excerpt && (
              <p className="text-2xl text-gray-300 leading-relaxed mb-8">
                {currentArticle.excerpt}
              </p>
            )}

            {currentArticle.author_name && (
              <Card className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {currentArticle.author_image ? (
                      <img 
                        src={currentArticle.author_image} 
                        alt={currentArticle.author_name}
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white text-lg">{currentArticle.author_name}</p>
                      {currentArticle.author_bio && (
                        <p className="text-sm text-gray-400">{currentArticle.author_bio}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl mb-8">
            <CardContent className="p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none text-gray-300 leading-relaxed prose-headings:text-white prose-strong:text-white prose-a:text-blue-400"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(currentArticle.content) }}
              />
            </CardContent>
          </Card>

          {currentArticle.tags && currentArticle.tags.length > 0 && (
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {currentArticle.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-blue-400/30 text-blue-400">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Blog List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      <motion.div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 10, repeat: Infinity }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Badge className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-8 py-3 text-base font-medium">
            <Newspaper className="w-5 h-5 mr-2" />
            Blog & Resources
          </Badge>
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-4">Our</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Expert insights, tips, and guidance for your educational journey
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-12 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
              className={selectedCategory === '' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'border-white/20 text-white hover:bg-white/10'}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'border-white/20 text-white hover:bg-white/10'}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        {articles.filter(article => article.is_featured).length > 0 && (
          <div className="mb-16">
            <h2 className="text-4xl font-black text-white mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles
                .filter(article => article.is_featured)
                .slice(0, 3)
                .map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-blue-400/50 transition-all duration-300 group">
                      {article.featured_image && (
                        <div className="aspect-video overflow-hidden rounded-t-xl">
                          <img 
                            src={article.featured_image} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          {article.category && (
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                              {article.category}
                            </Badge>
                          )}
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(article.published_at)}
                          </div>
                        </div>
                        <CardTitle className="group-hover:text-blue-400 transition-colors text-white text-xl">
                          <Link to={`/blog/${article.slug}`}>
                            {article.title}
                          </Link>
                        </CardTitle>
                        {article.excerpt && (
                          <CardDescription className="line-clamp-3 text-gray-400">
                            {article.excerpt}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            {article.author_name && (
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {article.author_name}
                              </div>
                            )}
                            {article.reading_time && (
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {article.reading_time} min
                              </div>
                            )}
                          </div>
                          <Link to={`/blog/${article.slug}`}>
                            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-white/10">
                              Read More
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <h2 className="text-4xl font-black text-white mb-8">
            {searchTerm || selectedCategory ? 'Search Results' : 'Latest Articles'}
          </h2>
          
          {filteredArticles.length === 0 ? (
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardContent className="text-center py-16">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-blue-400/50 transition-all duration-300 group">
                    {article.featured_image && (
                      <div className="aspect-video overflow-hidden rounded-t-xl">
                        <img 
                          src={article.featured_image} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        {article.category && (
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                            {article.category}
                          </Badge>
                        )}
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(article.published_at)}
                        </div>
                      </div>
                      <CardTitle className="group-hover:text-blue-400 transition-colors text-white text-xl">
                        <Link to={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </CardTitle>
                      {article.excerpt && (
                        <CardDescription className="line-clamp-3 text-gray-400">
                          {article.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          {article.author_name && (
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {article.author_name}
                            </div>
                          )}
                          {article.reading_time && (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {article.reading_time} min
                            </div>
                          )}
                        </div>
                        <Link to={`/blog/${article.slug}`}>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-white/10">
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;