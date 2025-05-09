
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is authenticated (could be expanded with actual auth check)
    const userAuthenticated = localStorage.getItem('chatadmin-authenticated');
    
    if (userAuthenticated) {
      navigate('/dashboard');
    } else {
      toast({
        title: "Welcome to ChatAdmin",
        description: "Please log in to access your dashboard",
      });
      navigate('/login');
    }
  }, [navigate, toast]);
  
  return null;
};

export default Index;
