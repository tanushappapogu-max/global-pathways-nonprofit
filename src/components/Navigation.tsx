import logoImage from "/images/logo2.ico";
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Menu, X, Sparkles } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();
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

  const defaultLogo = {
    text: "Global Pathways",
    subtitle: "Your Path to Success",
    icon: "GraduationCap",
    icon_color: "#3b82f6",
    text_color: "#ffffff",
    subtitle_color: "#9ca3af",
    show_icon: true,
    show_subtitle: true,
    size: "large"
  };

  const logo = logoSettings || defaultLogo;

  return (
    <div className="w-full">
      <nav className={`bg-blue-950 backdrop-blur-md shadow-lg border-b border-white/10 fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
  isScrolled ? 'shadow-2xl' : ''
}`}>

        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20 w-full justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 mr-4">
              <Link to="/" className="flex items-center space-x-2 logo-glow group">
                {logo.show_icon && (
                  <div className="relative">
                    <img 
                      src="/images/favicon.svg" 
                      alt="Logo" 
                      className="h-7 w-7 transition-all duration-300"
                    />
                    <Sparkles className="absolute -top-1 -right-1 h-2 w-2 text-white sparkle-animation" />
                  </div>
                )}
                <div className="hidden sm:flex flex-col">
                  <span className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {logo.text}
                  </span>
                  {logo.show_subtitle && (
                    <span className="text-xs text-gray-400 group-hover:text-blue-300 transition-colors">
                      {logo.subtitle}
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Pill Style */}
            <div className="hidden lg:flex flex-1 items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/20">
                <div className="flex items-center space-x-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`nav-item text-xs font-medium transition-all duration-300 whitespace-nowrap px-4 py-2 rounded-full flex items-center space-x-1 ${
                        location.pathname === item.path
                          ? 'text-black bg-blue-100 shadow-md'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs">{item.icon}</span>
                      <span className="text-xs">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center space-x-2 ml-4 flex-shrink-0">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-300 max-w-20 truncate">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <Button 
                    onClick={signOut} 
                    variant="outline" 
                    size="sm"
                    className="text-xs px-2 py-1 border-white/20 text-white hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 transition-all"
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
                      className="text-xs px-2 py-1 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button 
                      size="sm"
                      className="text-xs px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative overflow-hidden text-white hover:bg-white/10"
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
          <div className="lg:hidden bg-slate-900/98 backdrop-blur-md border-t border-white/10 shadow-lg">
            <ScrollArea className="h-96 px-4 py-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                {/* Mobile Auth */}
                <div className="pt-4 border-t border-white/10 mt-4">
                  {user ? (
                    <div className="space-y-3">
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium text-white">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <Button 
                        onClick={signOut} 
                        variant="outline" 
                        size="sm"
                        className="w-full border-white/20 text-white hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 transition-all"
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
                          className="w-full text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          size="sm"
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
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