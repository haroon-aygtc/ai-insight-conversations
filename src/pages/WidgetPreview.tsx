
import React from "react";
import { useParams } from "react-router-dom";
import widgetService from "@/services/widgetService";
import WidgetPreview from "@/components/widget-preview/WidgetPreview";

export default function WidgetPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [widget, setWidget] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      fetchWidget(id);
    }
  }, [id]);

  const fetchWidget = async (widgetId: string) => {
    try {
      setLoading(true);
      const data = await widgetService.getWidget(widgetId);
      setWidget(data);
    } catch (error) {
      console.error("Error fetching widget:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!widget) {
    return <div>Widget not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Widget Preview</h1>
      <WidgetPreview widgetConfig={widget} forceOpen={true} />
    </div>
  );
}
