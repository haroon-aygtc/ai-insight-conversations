
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Search } from 'lucide-react';

interface WebScraperProps {
  onContentExtracted: (content: string) => void;
}

const WebScraper: React.FC<WebScraperProps> = ({ onContentExtracted }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleScrape = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid website URL to scrape",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setScrapeStatus('loading');

    try {
      // In a real implementation, this would be an API call to the backend
      // For now, we're just simulating the scraping process
      
      setTimeout(() => {
        // Simulate successful scraping
        const fakeExtractedContent = `# Main content from ${url}\n\nThis is a simulation of content that would be extracted from the provided website. The actual implementation would filter out headers, footers, navigation, ads, and other non-essential elements to focus on the main content.\n\n## Key Information\n\n- Important point 1\n- Important point 2\n- Important point 3\n\nThe extraction process would analyze the DOM structure to identify the main content areas of the page, using techniques like content density analysis, semantic HTML role identification, and common layout pattern recognition.`;
        
        onContentExtracted(fakeExtractedContent);
        setScrapeStatus('success');
        setIsLoading(false);
        
        toast({
          title: "Website Scraped Successfully",
          description: "Content has been extracted and added to the context",
        });
      }, 2000);
    } catch (error) {
      console.error('Error scraping website:', error);
      setScrapeStatus('error');
      setIsLoading(false);
      toast({
        title: "Scraping Failed",
        description: "Failed to extract content from the provided URL. Please check the URL and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Website Content Extractor</CardTitle>
        <CardDescription>
          Extract content from any website to use as context for your AI assistant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleScrape} 
              disabled={isLoading}
              className="bg-chat-primary hover:bg-chat-secondary"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Scraping...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Scrape</span>
                </div>
              )}
            </Button>
          </div>

          {scrapeStatus === 'success' && (
            <div className="text-sm text-green-600 font-medium">
              ✓ Content extracted and added to context
            </div>
          )}

          {scrapeStatus === 'error' && (
            <div className="text-sm text-red-600 font-medium">
              ✗ Failed to extract content. Please check URL and try again.
            </div>
          )}

          <div className="text-sm text-gray-500 mt-2">
            <p className="font-medium mb-1">Tips for better extraction:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use public-facing pages without login requirements</li>
              <li>Ensure the URL is complete (including https://)</li>
              <li>Prefer content-focused pages rather than dashboard or highly interactive pages</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebScraper;
