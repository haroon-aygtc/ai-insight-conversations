import React, { useState, useEffect } from 'react';
import './tour-guide.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, X, HelpCircle, Info } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'right' | 'bottom' | 'left';
}

interface WidgetTestingTourGuideProps {
  onClose: () => void;
}

export function WidgetTestingTourGuide({ onClose }: WidgetTestingTourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const tourSteps: TourStep[] = [
    {
      title: 'Welcome to Widget Testing',
      description: 'This tour will guide you through the widget testing platform and show you how to test your widget in different environments.',
      target: '.widget-testing-platform',
      position: 'bottom',
    },
    {
      title: 'Live Preview',
      description: 'View your widget in real-time with the live preview. This shows exactly how your widget will appear on your website.',
      target: '[value="preview"]',
      position: 'bottom',
    },
    {
      title: 'Device Testing',
      description: 'Test your widget on different devices (desktop, tablet, mobile) and orientations to ensure it works well on all screen sizes.',
      target: '[value="devices"]',
      position: 'bottom',
    },
    {
      title: 'Embed Code',
      description: 'Get the code you need to embed the widget on your website. Copy this code and paste it just before the closing </body> tag.',
      target: '[value="embed"]',
      position: 'bottom',
    },
    {
      title: 'Testing Tools',
      description: 'Access advanced testing tools to simulate different user scenarios and test widget performance.',
      target: '[value="testing"]',
      position: 'bottom',
    },
    {
      title: 'Test Environment',
      description: 'Important: Select where to test your widget. Use Development for testing, Staging for pre-production, and Production only when ready to go live.',
      target: '.environment-selector',
      position: 'left',
    },
    {
      title: 'Development Environment',
      description: 'Start with the Development environment for initial testing. This is a safe sandbox that won\'t affect your live users.',
      target: '.environment-selector .development-option',
      position: 'right',
    },
    {
      title: 'Staging Environment',
      description: 'Use Staging to verify everything works before going live. This environment mimics production but is still isolated from real users.',
      target: '.environment-selector .staging-option',
      position: 'right',
    },
    {
      title: 'Production Environment',
      description: 'Only use Production when your widget is fully tested and ready for your actual users. Changes here will be seen by everyone.',
      target: '.environment-selector .production-option',
      position: 'right',
    },
    {
      title: 'Performance Metrics',
      description: 'Monitor your widget\'s performance metrics to ensure it loads quickly and functions smoothly for your users.',
      target: '.performance-metrics',
      position: 'left',
    },
    {
      title: 'You\'re Ready!',
      description: 'You now know how to use the widget testing platform. Feel free to explore and test your widget before embedding it on your website.',
      target: '.widget-testing-platform',
      position: 'bottom',
    },
  ];

  useEffect(() => {
    // Highlight the target element for the current step
    const highlightTarget = () => {
      const targetElement = document.querySelector(tourSteps[currentStep].target);
      if (targetElement) {
        // Add a temporary highlight class
        targetElement.classList.add('tour-highlight');
        
        // Scroll the element into view if needed
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove the highlight class when moving to the next step
        return () => {
          targetElement.classList.remove('tour-highlight');
        };
      }
    };

    const cleanup = highlightTarget();
    return cleanup;
  }, [currentStep, tourSteps]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // End of tour
      setIsVisible(false);
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center pointer-events-none">
      <div 
        className="absolute transition-all duration-300 pointer-events-auto z-[110]"
        style={{
          // Position the guide based on the target element and specified position
          // This is a simplified positioning logic - in a real app, you'd want more sophisticated positioning
          top: tourSteps[currentStep].position === 'bottom' ? '60%' : '50%',
          left: tourSteps[currentStep].position === 'right' ? '30%' : tourSteps[currentStep].position === 'left' ? '70%' : '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 0 4000px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Card className="w-[350px] shadow-lg border-primary/20">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Info size={18} className="text-primary" />
                {tourSteps[currentStep].title}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {tourSteps[currentStep].description}
            </p>
            
            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {tourSteps.length}
              </div>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" size="sm" onClick={handlePrevious}>
                    <ChevronLeft size={16} className="mr-1" />
                    Back
                  </Button>
                )}
                <Button variant="default" size="sm" onClick={handleNext}>
                  {currentStep < tourSteps.length - 1 ? (
                    <>
                      Next
                      <ChevronRight size={16} className="ml-1" />
                    </>
                  ) : (
                    'Finish'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
