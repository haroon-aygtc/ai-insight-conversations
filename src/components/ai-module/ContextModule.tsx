
import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  InfoIcon, Clock, UserCircle, Briefcase, 
  Save, History, Settings, Loader2,
  MessageCircle, PlusCircle
} from "lucide-react";

const ContextModule: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionContextEnabled, setSessionContextEnabled] = useState(true);
  const [businessContextEnabled, setBusinessContextEnabled] = useState(true);
  const [fallbackEnabled, setFallbackEnabled] = useState(true);
  const [sessionMemoryDays, setSessionMemoryDays] = useState(30);
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Context settings saved",
        description: "Your context configuration has been updated successfully.",
      });
    }, 1000);
  };
  
  const contextRules = [
    { id: 1, name: "Working Hours", description: "Only provide business hours information during support conversations", active: true },
    { id: 2, name: "Product Knowledge", description: "Use product documentation as primary context for product-related queries", active: true },
    { id: 3, name: "Technical Support", description: "Leverage troubleshooting guides for technical issues", active: false }
  ];
  
  const fallbackResponses = [
    { id: 1, trigger: "Payment issues", response: "I notice you're asking about payment issues. Let me connect you with our payment support team.", active: true },
    { id: 2, trigger: "Refund request", response: "For refund requests, please note that our policy allows returns within 30 days of purchase.", active: true }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Context Management</h2>
        <p className="text-muted-foreground mt-2">
          Configure how the AI understands and maintains conversation context.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border shadow-sm">
          <CardHeader className="bg-muted/50 pb-4">
            <CardTitle className="flex items-center text-lg font-medium">
              <MessageCircle className="w-5 h-5 mr-2" />
              Context Configuration
            </CardTitle>
            <CardDescription>
              Manage how context is handled across user sessions and business scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <Label className="text-base">Session Context</Label>
                    <div className="text-sm text-muted-foreground">
                      Track and use user session history for personalized responses
                    </div>
                  </div>
                  <Switch
                    checked={sessionContextEnabled}
                    onCheckedChange={setSessionContextEnabled}
                  />
                </div>
                
                {sessionContextEnabled && (
                  <div className="pl-6 border-l-2 border-muted space-y-4">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="memory-days">Session Memory Duration</Label>
                        <span className="text-sm text-muted-foreground">
                          {sessionMemoryDays} days
                        </span>
                      </div>
                      <Slider 
                        id="memory-days"
                        min={1}
                        max={90}
                        step={1}
                        value={[sessionMemoryDays]}
                        onValueChange={(value) => setSessionMemoryDays(value[0])}
                      />
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>1 day</span>
                        <span>30 days</span>
                        <span>90 days</span>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Session Memory Data</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="cursor-pointer bg-primary/10 hover:bg-primary/20">
                          User Preferences
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer bg-primary/10 hover:bg-primary/20">
                          Previous Queries
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer bg-primary/10 hover:bg-primary/20">
                          Interaction History
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer">
                          Browsing Behavior
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer">
                          Purchase History
                        </Badge>
                        <PlusCircle className="h-5 w-5 text-muted-foreground cursor-pointer" />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <Label className="text-base">Business Context</Label>
                    <div className="text-sm text-muted-foreground">
                      Apply business rules and policies to AI responses
                    </div>
                  </div>
                  <Switch
                    checked={businessContextEnabled}
                    onCheckedChange={setBusinessContextEnabled}
                  />
                </div>
                
                {businessContextEnabled && (
                  <div className="pl-6 border-l-2 border-muted">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Active Business Context Rules</Label>
                        <Button size="sm" variant="ghost" className="h-8 gap-1">
                          <PlusCircle className="h-4 w-4" />
                          <span>Add Rule</span>
                        </Button>
                      </div>
                      
                      <div className="border rounded-md">
                        {contextRules.map((rule) => (
                          <div 
                            key={rule.id}
                            className="flex items-center justify-between p-3 border-b last:border-b-0"
                          >
                            <div>
                              <div className="font-medium flex items-center">
                                {rule.name}
                                {rule.active && (
                                  <Badge className="ml-2 bg-green-500 text-xs">Active</Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {rule.description}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Switch checked={rule.active} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <Label className="text-base">Fallback Context</Label>
                    <div className="text-sm text-muted-foreground">
                      Define responses for when context is unclear or missing
                    </div>
                  </div>
                  <Switch
                    checked={fallbackEnabled}
                    onCheckedChange={setFallbackEnabled}
                  />
                </div>
                
                {fallbackEnabled && (
                  <div className="pl-6 border-l-2 border-muted">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Fallback Responses</Label>
                        <Button size="sm" variant="ghost" className="h-8 gap-1">
                          <PlusCircle className="h-4 w-4" />
                          <span>Add Response</span>
                        </Button>
                      </div>
                      
                      <div className="border rounded-md">
                        {fallbackResponses.map((response) => (
                          <div 
                            key={response.id}
                            className="p-3 border-b last:border-b-0"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium flex items-center">
                                Trigger: "{response.trigger}"
                                {response.active && (
                                  <Badge className="ml-2 bg-green-500 text-xs">Active</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Switch checked={response.active} />
                              </div>
                            </div>
                            <div className="text-sm border-l-2 border-muted pl-3">
                              {response.response}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 px-6 py-4 flex justify-end gap-2">
            <Button variant="outline">Reset to Defaults</Button>
            <Button 
              onClick={handleSaveSettings}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Settings
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <InfoIcon className="w-5 h-5 mr-2" />
                About Context
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                Context management allows the AI to understand queries based on user behavior, history, and business rules. Properly configured context leads to more accurate and personalized responses.
              </p>
              
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="user-context">
                  <AccordionTrigger className="py-2 text-sm">
                    <div className="flex items-center">
                      <UserCircle className="w-4 h-4 mr-2" />
                      User Context
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground">
                    User context includes preferences, previous interactions, and behavior patterns. This helps the AI provide personalized responses relevant to the user's history.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="session-context">
                  <AccordionTrigger className="py-2 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Session Memory
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground">
                    Session memory maintains ongoing context throughout conversations, allowing the AI to reference earlier parts of the discussion for more coherent responses.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="business-context">
                  <AccordionTrigger className="py-2 text-sm">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Business Context
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground">
                    Business context includes company policies, hours of operation, and specific business logic that should be applied to AI responses.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="fallbacks">
                  <AccordionTrigger className="py-2 text-sm">
                    <div className="flex items-center">
                      <History className="w-4 h-4 mr-2" />
                      Fallbacks
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground">
                    Fallback responses are triggered when context is unclear or missing, providing a safety net for handling ambiguous queries.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Test Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-query">Sample User Query</Label>
                  <Input
                    id="test-query"
                    placeholder="Enter a test query"
                    defaultValue="What's your return policy?"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="context-preview">Context Preview</Label>
                  <Textarea
                    id="context-preview"
                    className="h-32 font-mono text-xs"
                    readOnly
                    value={`{
  "user": {
    "preferences": { "communications": "email" },
    "history": ["previous_query_1", "previous_query_2"]
  },
  "business": {
    "policies": { "returns": "30_days" },
    "hours": "9am-5pm Monday to Friday"
  },
  "session": {
    "current_topic": "returns",
    "sentiment": "neutral"
  }
}`}
                  />
                </div>
                
                <Button className="w-full">
                  Test Context Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContextModule;
