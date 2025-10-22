import React, { useState, useEffect } from 'react';
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
  Award
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';
import { Magnetic } from '@/components/animations/Magnetic';

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
    // Simple markdown rendering - you might want to use a proper markdown library
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/\n/gim, '<br>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog content...</p>
        </div>
      </div>
    );
  }

  // Individual Article View
  if (slug && currentArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/blog">
              <Button variant="ghost" className="hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            {currentArticle.featured_image && (
              <img 
                src={currentArticle.featured_image} 
                alt={currentArticle.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            
            <div className="flex items-center space-x-4 mb-4">
              {currentArticle.category && (
                <Badge className="bg-blue-600 text-white">
                  {currentArticle.category}
                </Badge>
              )}
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(currentArticle.published_at)}
              </div>
              {currentArticle.reading_time && (
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {currentArticle.reading_time} min read
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <ShinyText text={currentArticle.title} />
            </h1>

            {currentArticle.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {currentArticle.excerpt}
              </p>
            )}

            {/* Author Info */}
            {currentArticle.author_name && (
              <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-lg">
                {currentArticle.author_image ? (
                  <img 
                    src={currentArticle.author_image} 
                    alt={currentArticle.author_name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{currentArticle.author_name}</p>
                  {currentArticle.author_bio && (
                    <p className="text-sm text-gray-600">{currentArticle.author_bio}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Article Content */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(currentArticle.content) }}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          {currentArticle.tags && currentArticle.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {currentArticle.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-blue-600 border-blue-600">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Blog List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="Our Blog" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert insights, tips, and guidance for your educational journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
              size="sm"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        {articles.filter(article => article.is_featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles
                .filter(article => article.is_featured)
                .slice(0, 3)
                .map((article) => (
                  <Magnetic key={article.id}>
                    <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
                      {article.featured_image && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img 
                            src={article.featured_image} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          {article.category && (
                            <Badge className="bg-blue-600 text-white">
                              {article.category}
                            </Badge>
                          )}
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(article.published_at)}
                          </div>
                        </div>
                        <CardTitle className="group-hover:text-blue-600 transition-colors">
                          <Link to={`/blog/${article.slug}`}>
                            {article.title}
                          </Link>
                        </CardTitle>
                        {article.excerpt && (
                          <CardDescription className="line-clamp-3">
                            {article.excerpt}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              Read More
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </Magnetic>
                ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {searchTerm || selectedCategory ? 'Search Results' : 'Latest Articles'}
          </h2>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Magnetic key={article.id}>
                  <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
                    {article.featured_image && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={article.featured_image} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        {article.category && (
                          <Badge className="bg-blue-600 text-white">
                            {article.category}
                          </Badge>
                        )}
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(article.published_at)}
                        </div>
                      </div>
                      <CardTitle className="group-hover:text-blue-600 transition-colors">
                        <Link to={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </CardTitle>
                      {article.excerpt && (
                        <CardDescription className="line-clamp-3">
                          {article.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </Magnetic>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;