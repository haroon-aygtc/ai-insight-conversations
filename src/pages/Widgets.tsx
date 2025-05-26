
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Widgets = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Widgets</h1>
          <p className="text-muted-foreground">Manage your chat widgets</p>
        </div>
        <Button onClick={() => navigate('/widgets/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Widget
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Widgets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No widgets found. Create your first widget to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Widgets;
