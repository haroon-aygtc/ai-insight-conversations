import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { widgetService } from '@/services/widgetService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Settings } from 'lucide-react';
import { WidgetTestingContainer } from '@/components/widget-configurator/testing/WidgetTestingContainer';

export default function WidgetTesting() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [widget, setWidget] = useState<any>(null);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string>(id || '');

  // Fetch all widgets on component mount
  useEffect(() => {
    fetchWidgets();
  }, []);

  // Fetch specific widget when ID changes
  useEffect(() => {
    if (selectedWidgetId) {
      fetchWidget(selectedWidgetId);
    }
  }, [selectedWidgetId]);

  // Fetch all widgets
  const fetchWidgets = async () => {
    try {
      setLoading(true);
      const data = await widgetService.getWidgets();
      // Ensure data is an array
      const widgetsArray = Array.isArray(data) ? data : [];
      setWidgets(widgetsArray);
      
      // If no widget ID is provided in URL, select the first widget
      if (!id && widgetsArray.length > 0) {
        setSelectedWidgetId(String(widgetsArray[0].id));
        navigate(`/widget-testing/${widgetsArray[0].id}`, { replace: true });
      }
    } catch (error) {
      console.error('Error fetching widgets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load widgets. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific widget
  const fetchWidget = async (widgetId: string) => {
    try {
      setLoading(true);
      const data = await widgetService.getWidget(widgetId);
      setWidget(data);
    } catch (error) {
      console.error(`Error fetching widget ${widgetId}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to load widget. Please try again.',
        variant: 'destructive',
      });
      // Redirect to widgets list if widget not found
      navigate('/widgets');
    } finally {
      setLoading(false);
    }
  };

  // Handle widget selection change
  const handleWidgetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newWidgetId = event.target.value;
    setSelectedWidgetId(newWidgetId);
    navigate(`/widget-testing/${newWidgetId}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/widgets')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Widgets
          </Button>
          <h1 className="text-2xl font-bold">Widget Testing</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="widget-select" className="text-sm font-medium">
              Select Widget:
            </label>
            <select
              id="widget-select"
              value={selectedWidgetId}
              onChange={handleWidgetChange}
              className="border rounded px-3 py-1.5 text-sm"
              disabled={loading}
            >
              {widgets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          
          {selectedWidgetId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/widgets/edit/${selectedWidgetId}`)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Edit Widget
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      ) : widget ? (
        <WidgetTestingContainer
          widgetId={String(widget.id)}
          config={widget}
          initialTab="iframe"
        />
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No widget selected. Please select a widget to test.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
