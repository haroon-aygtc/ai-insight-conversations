
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      toast({
        title: "Welcome to AI Insights",
        description: "Please log in to access your dashboard",
      });
      navigate('/login');
    }
  }, [navigate, toast, isAuthenticated, isLoading]);

  return null;
};

export default Index;
