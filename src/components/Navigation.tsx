import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Menu, X, Sparkles } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navItems, setNavItems] = useState([]);
  const [logoSettings, setLogoSettings] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchNavigationItems();
    fetchLogoSettings();
  }, [user]);

  const fetchNavigationItems = async () => {
    try {
      const { data, error } = await supabase
        .from('navigation_items_2025_10_14_03_00')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        console.error('Error fetching navigation items:', error);
        return;
      }

      // Filter items based on authentication requirement
      const filteredItems = data.filter(item => {
        if (item.requires_auth && !user) return false;
        return true;
      });

      setNavItems(filteredItems);
    } catch (error) {
      console.error('Error fetching navigation items:', error);
    }
  };

  const fetchLogoSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('website_global_settings_2025_10_14_03_00')
        .select('*')
        .eq('setting_category', 'branding')
        .eq('setting_name', 'logo')
        .single();

      if (error) {
        console.error('Error fetching logo settings:', error);
        return;
      }

      setLogoSettings(data.setting_value);
    } catch (error) {
      console.error('Error fetching logo settings:', error);
    }
  };

  // Default logo settings
  const defaultLogo = {
    text: "Global Pathways",
    subtitle: "Your Path to Success",
    icon: "GraduationCap",
    icon_color: "#3b82f6",
    text_color: "#1f2937",
    subtitle_color: "#6b7280",
    show_icon: true,
    show_subtitle: true,
    size: "large"
  };

  const logo = logoSettings || defaultLogo;

  return (
    <div className="w-full">
      <nav className={`bg-white/95 backdrop-blur-md shadow-sm border-b sticky top-0 z-50 transition-all duration-300 w-full ${
        isScrolled ? 'shadow-lg bg-white/98' : ''
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20 w-full justify-between">
            {/* Logo - Dynamic from Supabase */}
            <div className="flex-shrink-0 mr-4">
              <Link to="/" className="flex items-center space-x-2 logo-glow group">
                {logo.show_icon && (
                  <div className="relative">
                    <GraduationCap 
                      className="h-7 w-7 transition-all duration-300 group-hover:text-blue-700" 
                      style={{ color: logo.icon_color }}
                    />
                    <Sparkles className="absolute -top-1 -right-1 h-2 w-2 text-yellow-400 sparkle-animation" />
                  </div>
                )}
                <div className="hidden sm:flex flex-col">
                  <span 
                    className="text-base font-bold group-hover:text-blue-600 transition-colors"
                    style={{ color: logo.text_color }}
                  >
                    {logo.text}
                  </span>
                  {logo.show_subtitle && (
                    <span 
                      className="text-xs group-hover:text-blue-500 transition-colors"
                      style={{ color: logo.subtitle_color }}
                    >
                      {logo.subtitle}
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Pill Style */}
            <div className="hidden lg:flex flex-1 items-center justify-center">
              <div className="bg-white/80 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-gray-200/50">
                <div className="flex items-center space-x-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`nav-item text-xs font-medium transition-all duration-300 whitespace-nowrap px-4 py-2 rounded-full flex items-center space-x-1 ${
                        location.pathname === item.path
                          ? 'text-white bg-blue-600 shadow-md'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <span className="text-xs">{item.icon}</span>
                      <span className="text-xs">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Auth - Compact */}
            <div className="hidden lg:flex items-center space-x-2 ml-4 flex-shrink-0">
              <LanguageSelector />
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-700 max-w-20 truncate">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <Button 
                    onClick={signOut} 
                    variant="outline" 
                    size="sm"
                    className="text-xs px-2 py-1 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Link to="/login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs px-2 py-1 hover:bg-blue-50 hover:text-blue-600 transition-all"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button 
                      size="sm"
                      className="text-xs px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2 ml-auto">
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative overflow-hidden"
              >
                <div className={`transition-all duration-300 ${mobileMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-md border-t shadow-lg">
            <ScrollArea className="h-96 px-4 py-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'text-blue-600 bg-blue-50 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                {/* Mobile Auth */}
                <div className="pt-4 border-t border-gray-200 mt-4">
                  {user ? (
                    <div className="space-y-3">
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium text-gray-900">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Button 
                        onClick={signOut} 
                        variant="outline" 
                        size="sm"
                        className="w-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="w-full hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          size="sm"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </nav>
    </div>
  );
};