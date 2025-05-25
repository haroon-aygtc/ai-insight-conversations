
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Database, MessageCircle, Code, GitFork, 
  ArrowRight, Brain, Book, Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import individual modules
import KnowledgeBaseModule from './KnowledgeBaseModule';
import ContextModule from './ContextModule';
import PromptTemplateModule from './PromptTemplateModule';
import FollowUpModule from './FollowUpModule';

const AIModulesOverview: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("overview");
  
  const modules = [
    {
      id: "knowledge-base",
      name: "Knowledge Base",
      description: "Manage structured information from diverse sources",
      icon: <Database className="h-6 w-6" />,
      component: <KnowledgeBaseModule />,
      features: [
        "Database integration",
        "File uploads (PDF, DOCX, XLSX)",
        "Web scraping",
        "Dynamic query handling",
        "Content management"
      ]
    },
    {
      id: "context",
      name: "Context",
      description: "Control how the AI understands user queries and history",
      icon: <MessageCircle className="h-6 w-6" />,
      component: <ContextModule />,
      features: [
        "Session tracking",
        "User behavior analysis",
        "Business rule integration",
        "Fallback mechanisms",
        "Context memory management"
      ]
    },
    {
      id: "prompt-templates",
      name: "Prompt Templates",
      description: "Define structures for AI instructions and responses",
      icon: <Code className="h-6 w-6" />,
      component: <PromptTemplateModule />,
      features: [
        "Dynamic placeholders",
        "Conditional instructions",
        "Format control",
        "Template library",
        "Priority management"
      ]
    },
    {
      id: "follow-up",
      name: "Follow-up Questions",
      description: "Enhance engagement with dynamic question suggestions",
      icon: <GitFork className="h-6 w-6" />,
      component: <FollowUpModule />,
      features: [
        "Conditional follow-ups",
        "Multi-option answers",
        "Placement control",
        "Conversation flow management",
        "Question set library"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Modules</h2>
        <p className="text-muted-foreground mt-2">
          Configure the intelligent components that power your chat system
        </p>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          
          {modules.map((module) => (
            <TabsTrigger 
              key={module.id} 
              value={module.id}
              className="flex items-center gap-1"
            >
              {React.cloneElement(module.icon, { className: "h-4 w-4" })}
              <span>{module.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="overview" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Card key={module.id} className="flex flex-col border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10">
                        {React.cloneElement(module.icon, { className: "h-6 w-6 text-primary" })}
                      </div>
                      <div>
                        <CardTitle>{module.name}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Capabilities:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4">
                      {module.features.map((feature, i) => (
                        <li key={i} className="text-sm flex items-center">
                          <Zap className="h-3 w-3 mr-1.5 text-amber-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4 border-t bg-muted/20">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab(module.id)}
                  >
                    Configure {module.name} <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Card className="mt-6 border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                <span>Module Interaction Overview</span>
              </CardTitle>
              <CardDescription>
                How the different AI modules work together to create a cohesive system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md bg-muted/30 space-y-4">
                <div>
                  <h3 className="text-base font-medium">Knowledge Base + Context</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensures relevant data is pulled based on query history and user behavior patterns.
                    The context module filters which knowledge sources are most relevant.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium">Context + Prompt Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Adjusts tone, content specificity, and format using conversation history and user profile data.
                    Context insights are inserted into dynamic prompt template variables.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium">Prompt Templates + AI Models</h3>
                  <p className="text-sm text-muted-foreground">
                    Defines structured, consistent, branded replies that are sent to your selected AI models.
                    Templates ensure uniformity regardless of which AI model is processing the request.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium">Follow-up + Context</h3>
                  <p className="text-sm text-muted-foreground">
                    Enables dynamic question trees tailored to the conversation flow, user interests, and previous topics.
                    Follow-up questions help maintain context across longer conversations.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-4 border-t bg-muted/20">
              <Button variant="outline" onClick={() => navigate("/admin/settings")}>System Settings</Button>
              <Button onClick={() => navigate("/admin/ai-models")}>Configure AI Models</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {modules.map((module) => (
          <TabsContent key={module.id} value={module.id} className="m-0">
            <ScrollArea className="h-[calc(100vh-220px)]">
              {module.component}
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AIModulesOverview;
