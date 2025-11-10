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
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mb-6 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mb-4 mt-8 text-gray-900">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mb-3 mt-6 text-gray-900">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 text-gray-700">• $1</li>')
      .replace(/\n/gim, '<br>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading blog content...</p>
        </div>
      </div>
    );
  }

  if (slug && currentArticle) {
    return (
      <div className="min-h-screen bg-blue-50 relative overflow-hidden pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16 relative">
          <div className="mb-8">
            <Link to="/blog">
              <Button variant="outline" className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100">
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
                className="w-full h-96 object-cover rounded-xl mb-8 shadow-lg"
              />
            )}
            
            <div className="flex items-center space-x-4 mb-6">
              {currentArticle.category && (
                <Badge className="bg-blue-900 text-white border-0 px-4 py-2">
                  {currentArticle.category}
                </Badge>
              )}
              <div className="flex items-center text-gray-700 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(currentArticle.published_at)}
              </div>
              {currentArticle.reading_time && (
                <div className="flex items-center text-gray-700 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  {currentArticle.reading_time} min read
                </div>
              )}
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              {currentArticle.title}
            </h1>

            {currentArticle.excerpt && (
              <p className="text-2xl text-gray-700 leading-relaxed mb-8">
                {currentArticle.excerpt}
              </p>
            )}

            {currentArticle.author_name && (
              <Card className="mb-8 bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {currentArticle.author_image ? (
                      <img 
                        src={currentArticle.author_image} 
                        alt={currentArticle.author_name}
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{currentArticle.author_name}</p>
                      {currentArticle.author_bio && (
                        <p className="text-sm text-gray-700">{currentArticle.author_bio}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="bg-white border-gray-200 shadow-lg mb-8">
            <CardContent className="p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed prose-headings:text-gray-900 prose-strong:text-gray-900 prose-a:text-blue-900"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(currentArticle.content) }}
              />
            </CardContent>
          </Card>

          {currentArticle.tags && currentArticle.tags.length > 0 && (
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {currentArticle.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-blue-300 text-blue-900">
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

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <motion.div className="text-center mb-16 pt-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Badge className="mb-8 bg-blue-900 text-white border-0 px-8 py-3 text-base font-medium">
            <Newspaper className="w-5 h-5 mr-2" />
            Blog & Resources
          </Badge>
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-[1.3] overflow-visible">
            <span className="block text-gray-900 mb-4">Our</span>
            <span className="block text-gray-900">Blog</span>
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Expert insights, tips, and guidance for your educational journey
          </p>
        </motion.div>

        <div className="mb-12 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
              className={selectedCategory === '' ? 'bg-blue-900 hover:bg-blue-500 text-white' : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-100'}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-blue-900 hover:bg-blue-500 text-white' : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-100'}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {articles.filter(article => article.is_featured).length > 0 && (
          <div className="mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-8">Featured Articles</h2>
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
                    <Card className="h-full bg-white border-gray-200 shadow-lg hover:border-blue-400 transition-all duration-300 group">
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
                            <Badge className="bg-blue-100 text-blue-900 border-blue-300">
                              {article.category}
                            </Badge>
                          )}
                          <div className="flex items-center text-gray-700 text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(article.published_at)}
                          </div>
                        </div>
                        <CardTitle className="group-hover:text-blue-900 transition-colors text-gray-900 text-xl">
                          <Link to={`/blog/${article.slug}`}>
                            {article.title}
                          </Link>
                        </CardTitle>
                        {article.excerpt && (
                          <CardDescription className="line-clamp-3 text-gray-700">
                            {article.excerpt}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-700">
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
                            <Button variant="ghost" size="sm" className="text-blue-900 hover:text-blue-500 hover:bg-blue-50">
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

        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-8">
            {searchTerm || selectedCategory ? 'Search Results' : 'Latest Articles'}
          </h2>
          
          {filteredArticles.length === 0 ? (
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="text-center py-16">
                <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-700">Try adjusting your search or filter criteria.</p>
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
                  <Card className="h-full bg-white border-gray-200 shadow-lg hover:border-blue-400 transition-all duration-300 group">
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
                          <Badge className="bg-blue-100 text-blue-900 border-blue-300">
                            {article.category}
                          </Badge>
                        )}
                        <div className="flex items-center text-gray-700 text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(article.published_at)}
                        </div>
                      </div>
                      <CardTitle className="group-hover:text-blue-900 transition-colors text-gray-900 text-xl">
                        <Link to={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </CardTitle>
                      {article.excerpt && (
                        <CardDescription className="line-clamp-3 text-gray-700">
                          {article.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-700">
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
                          <Button variant="ghost" size="sm" className="text-blue-900 hover:text-blue-500 hover:bg-blue-50">
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