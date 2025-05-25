
import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Code, PlusCircle, Search, Check, X, Play, Eye, 
  Edit, Trash2, Copy, LayoutTemplate, Archive, Loader2, 
  RefreshCw
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

const PromptTemplateModule: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  
  // Sample prompt templates
  const promptTemplates = [
    {
      id: 1,
      name: "General Information",
      description: "Standard template for general information queries",
      tags: ["general", "information"],
      priority: "medium",
      active: true,
      published: true,
      lastUpdated: "2023-05-15"
    },
    {
      id: 2,
      name: "Technical Support",
      description: "Template for handling technical support inquiries",
      tags: ["support", "technical"],
      priority: "high",
      active: true,
      published: true,
      lastUpdated: "2023-05-10"
    },
    {
      id: 3,
      name: "Sales Inquiry",
      description: "Template optimized for sales and pricing questions",
      tags: ["sales", "pricing"],
      priority: "high",
      active: false,
      published: false,
      lastUpdated: "2023-04-28"
    },
    {
      id: 4,
      name: "Product Features",
      description: "Details product capabilities and features",
      tags: ["product", "features"],
      priority: "medium",
      active: true,
      published: true,
      lastUpdated: "2023-05-01"
    },
    {
      id: 5,
      name: "Onboarding Guide",
      description: "Instructions for new user onboarding",
      tags: ["onboarding", "guide"],
      priority: "low",
      active: true,
      published: true,
      lastUpdated: "2023-04-15"
    }
  ];
  
  // Sample template content for editing
  const [templateContent, setTemplateContent] = useState(`You are a helpful AI assistant for {{business_name}}. 
  
Answer the following query from a user: {{user_query}}

Base your answer on the following information:
{{context}}

Please format your response with these guidelines:
1. Be concise but thorough
2. Use simple language
3. Include relevant facts only
4. If you don't know, acknowledge that
5. Maintain a {{tone}} tone

When discussing products, mention:
- Key features
- Benefits
- Any current promotions

ALWAYS cite sources if using specific data.
`);
  
  // Filter templates based on search and active tab
  const filteredTemplates = promptTemplates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && template.active;
    if (activeTab === "draft") return matchesSearch && !template.published;
    return matchesSearch;
  });
  
  const handleSaveTemplate = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Template saved",
        description: "Your prompt template has been saved successfully.",
      });
    }, 1000);
  };
  
  const handleTestTemplate = () => {
    setIsTestDialogOpen(true);
  };
  
  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-500">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="text-green-600 border-green-600">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Prompt Templates</h2>
        <p className="text-muted-foreground mt-2">
          Create and manage reusable prompt templates that control AI responses.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="flex items-center text-lg font-medium">
                <LayoutTemplate className="w-5 h-5 mr-2" />
                Prompt Template Library
              </CardTitle>
              <CardDescription>
                Manage your collection of prompt templates for different use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <TabsList className="mb-0">
                    <TabsTrigger value="all">All Templates</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="draft">Drafts</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search templates..."
                        className="pl-9 w-full sm:w-[200px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <PlusCircle className="h-4 w-4 mr-1" /> New Template
                    </Button>
                  </div>
                </div>
                
                <TabsContent value="all" className="m-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Template Name</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead className="text-center">Priority</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTemplates.length > 0 ? (
                          filteredTemplates.map((template) => (
                            <TableRow key={template.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{template.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {template.description}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {template.tags.map((tag, i) => (
                                    <Badge 
                                      key={i} 
                                      variant="outline" 
                                      className="bg-primary/10 hover:bg-primary/20 text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                {renderPriorityBadge(template.priority)}
                              </TableCell>
                              <TableCell className="text-center">
                                {template.active ? (
                                  <Badge className="bg-green-500">Active</Badge>
                                ) : (
                                  <Badge variant="outline">Inactive</Badge>
                                )}
                              </TableCell>
                              <TableCell>{template.lastUpdated}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Play className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center h-32">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <LayoutTemplate className="h-8 w-8 mb-2" />
                                <p>No templates found</p>
                                <Button 
                                  variant="link" 
                                  onClick={() => setIsCreateDialogOpen(true)}
                                  className="mt-1"
                                >
                                  Create your first template
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="active" className="m-0">
                  {/* Same table structure as "all" tab but filtered for active templates */}
                  <div className="rounded-md border">
                    <Table>
                      {/* ... table header same as above ... */}
                      <TableHeader>
                        <TableRow>
                          <TableHead>Template Name</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead className="text-center">Priority</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTemplates.length > 0 ? (
                          filteredTemplates.map((template) => (
                            <TableRow key={template.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{template.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {template.description}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {template.tags.map((tag, i) => (
                                    <Badge 
                                      key={i} 
                                      variant="outline" 
                                      className="bg-primary/10 hover:bg-primary/20 text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                {renderPriorityBadge(template.priority)}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className="bg-green-500">Active</Badge>
                              </TableCell>
                              <TableCell>{template.lastUpdated}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Play className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center h-32">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Archive className="h-8 w-8 mb-2" />
                                <p>No active templates found</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="draft" className="m-0">
                  {/* Same table structure as "all" tab but filtered for draft templates */}
                  <div className="rounded-md border">
                    <Table>
                      {/* ... table header same as above ... */}
                      <TableHeader>
                        <TableRow>
                          <TableHead>Template Name</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead className="text-center">Priority</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTemplates.length > 0 ? (
                          filteredTemplates.map((template) => (
                            <TableRow key={template.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{template.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {template.description}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {template.tags.map((tag, i) => (
                                    <Badge 
                                      key={i} 
                                      variant="outline" 
                                      className="bg-primary/10 hover:bg-primary/20 text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                {renderPriorityBadge(template.priority)}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline">Draft</Badge>
                              </TableCell>
                              <TableCell>{template.lastUpdated}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Play className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center h-32">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Archive className="h-8 w-8 mb-2" />
                                <p>No draft templates found</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Template Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input 
                    id="template-name" 
                    placeholder="e.g. General Information Template" 
                    defaultValue="Technical Support Template"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="Brief description of this template's purpose"
                  defaultValue="Template for handling technical support inquiries" 
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input 
                  id="tags" 
                  placeholder="e.g. general, support, sales"
                  defaultValue="support, technical" 
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="template-content">Prompt Template</Label>
                  <Button variant="outline" size="sm" className="h-7">
                    <RefreshCw className="h-3 w-3 mr-1" /> Format
                  </Button>
                </div>
                <Textarea 
                  id="template-content"
                  className="font-mono h-64 resize-none"
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                />
              </div>
              
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Available Variables</h4>
                <div className="flex flex-wrap gap-1 text-xs">
                  <Badge variant="outline">{'{{user_query}}'}</Badge>
                  <Badge variant="outline">{'{{context}}'}</Badge>
                  <Badge variant="outline">{'{{business_name}}'}</Badge>
                  <Badge variant="outline">{'{{tone}}'}</Badge>
                  <Badge variant="outline">{'{{current_date}}'}</Badge>
                  <Badge variant="outline">{'{{user_name}}'}</Badge>
                  <Badge variant="outline">{'{{previous_messages}}'}</Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Label htmlFor="activated" className="cursor-pointer">Template Active</Label>
                  <Switch id="activated" defaultChecked />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="published" className="cursor-pointer">Published</Label>
                  <Switch id="published" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 px-6 py-4 flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleTestTemplate}>
                  <Play className="mr-2 h-4 w-4" /> Test Template
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Cancel</Button>
                <Button 
                  onClick={handleSaveTemplate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Save Template
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Template Preview</CardTitle>
              <CardDescription>
                How this template will be processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-md mb-3 text-sm">
                <p className="mb-2 font-medium">Variables Replaced:</p>
                <div className="space-y-1 mb-3 text-xs">
                  <p><strong>{'{{business_name}}'}</strong> → "Acme Tech"</p>
                  <p><strong>{'{{user_query}}'}</strong> → "How do I reset my password?"</p>
                  <p><strong>{'{{tone}}'}</strong> → "professional"</p>
                </div>
                <p className="mb-2 font-medium">Context Available:</p>
                <div className="text-xs overflow-hidden">
                  <p className="truncate">Knowledge base, user preferences, etc.</p>
                </div>
              </div>
              
              <div className="text-sm space-y-3">
                <div>
                  <h3 className="font-medium mb-1">AI Receives:</h3>
                  <div className="border rounded-md p-2 bg-background text-xs h-32 overflow-y-auto">
                    <p>You are a helpful AI assistant for Acme Tech.</p>
                    <p>Answer the following query from a user: How do I reset my password?</p>
                    <p>Base your answer on the following information:</p>
                    <p>[Context about password reset procedures]</p>
                    <p>Please format your response with these guidelines:</p>
                    <p>1. Be concise but thorough</p>
                    <p>2. Use simple language</p>
                    <p>3. Include relevant facts only</p>
                    <p>4. If you don't know, acknowledge that</p>
                    <p>5. Maintain a professional tone</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Expected Output Format:</h3>
                  <div className="border rounded-md p-2 bg-background text-xs h-32 overflow-y-auto">
                    <p><strong>Password Reset Instructions:</strong></p>
                    <p>To reset your password with Acme Tech:</p>
                    <p>1. Go to the login page at account.acmetech.com</p>
                    <p>2. Click on "Forgot Password" below the login form</p>
                    <p>3. Enter your email address</p>
                    <p>4. Check your email for a reset link</p>
                    <p>5. Click the link and create a new password</p>
                    <p>The reset link will expire after 24 hours for security reasons.</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t">
              <Button variant="link" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                View Full Preview
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Create New Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a new prompt template to define how the AI structures its responses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-name">Template Name</Label>
              <Input id="new-name" placeholder="e.g. Customer Support Template" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-description">Description</Label>
              <Input id="new-description" placeholder="Brief description of this template's purpose" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="new-priority">Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="new-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-tags">Tags</Label>
                <Input id="new-tags" placeholder="e.g. support, technical" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-content">Initial Template Content</Label>
              <div className="flex gap-2">
                <Select defaultValue="blank">
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">Blank Template</SelectItem>
                    <SelectItem value="general">General Information</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="sales">Sales Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsCreateDialogOpen(false);
              toast({
                title: "Template created",
                description: "Your new template has been created.",
              });
            }}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Test Template Dialog */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Test Prompt Template</DialogTitle>
            <DialogDescription>
              Test how your template works with a sample user query.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="test-query">Sample User Query</Label>
              <Input id="test-query" defaultValue="How do I reset my password?" />
            </div>
            
            <div className="grid gap-2">
              <Label>Context (Optional)</Label>
              <Textarea 
                className="h-24 font-mono text-xs"
                placeholder="Add context that would be used in a real scenario"
                defaultValue="Passwords must be at least 8 characters long. Reset links expire after 24 hours. Users can reset passwords at account.acmetech.com."
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Variable Values</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="business_name" defaultValue="Acme Tech" />
                <Input placeholder="tone" defaultValue="professional" />
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-muted/30">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">AI Response Preview</h4>
                <Badge>Simulated</Badge>
              </div>
              <div className="rounded border bg-background p-3 h-48 overflow-y-auto text-sm">
                <p className="font-medium">Password Reset Instructions:</p>
                <p className="mt-2">To reset your password with Acme Tech:</p>
                <ol className="mt-1 space-y-1 pl-5 list-decimal">
                  <li>Go to the login page at account.acmetech.com</li>
                  <li>Click on "Forgot Password" below the login form</li>
                  <li>Enter your email address</li>
                  <li>Check your email for a reset link</li>
                  <li>Click the link and create a new password</li>
                </ol>
                <p className="mt-2">The reset link will expire after 24 hours for security reasons.</p>
                <p className="mt-2">Your new password must be at least 8 characters long.</p>
                <p className="mt-2">If you need further assistance, please contact our support team.</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                setIsTestDialogOpen(false);
              }, 1000);
            }}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" /> Regenerate Response
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromptTemplateModule;
