
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Search, Filter, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const Templates = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Templates</h2>
          <p className="text-slate-500 mt-1">Manage prompt templates for your chat widget</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Template Library</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input className="w-[250px] pl-8" placeholder="Search templates..." />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { id: 1, name: "Product Expert", description: "Responds as a product expert with detailed knowledge", category: "Sales", modified: "2 days ago" },
                { id: 2, name: "Customer Support", description: "Handles customer inquiries and troubleshooting", category: "Support", modified: "1 week ago" },
                { id: 3, name: "Onboarding Assistant", description: "Guides new users through product features", category: "Onboarding", modified: "3 days ago" },
                { id: 4, name: "Technical Support", description: "Provides technical troubleshooting", category: "Support", modified: "5 days ago" },
                { id: 5, name: "Sales Assistant", description: "Helps with purchasing decisions", category: "Sales", modified: "1 day ago" },
              ].map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.description}</TableCell>
                  <TableCell>{template.category}</TableCell>
                  <TableCell>{template.modified}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Duplicate</Button>
                    <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Template</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="prompt">Prompt Template</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Template Name</label>
                  <Input placeholder="Enter template name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Category</label>
                  <Input placeholder="Enter category" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea 
                  placeholder="Enter template description" 
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="prompt" className="space-y-4 pt-4">
              <div className="border rounded-md p-4 bg-slate-50">
                <div className="flex items-center mb-2">
                  <Code className="h-4 w-4 mr-2 text-slate-500" />
                  <span className="text-sm font-medium">Prompt Template</span>
                </div>
                <Textarea 
                  placeholder="Enter prompt template with variables like {{variable_name}}" 
                  className="min-h-[200px] font-mono text-sm"
                  defaultValue={`You are a helpful AI assistant for {{company_name}}.

Your role is to assist with {{purpose}}. When responding to inquiries about {{company_name}}'s products, focus on {{key_features}}.

Remember:
- Be concise and helpful
- If you don't know something, say so
- Refer to {{knowledge_base}} for accurate information

Use a {{tone}} tone in your responses.`}
                />
              </div>
              
              <div className="pt-2">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Insert Variable
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="variables" className="pt-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Variables</label>
                  <p className="text-sm text-slate-500 mb-4">Define variables that can be used in your template</p>
                  
                  <div className="border rounded-md divide-y">
                    {['company_name', 'purpose', 'key_features', 'knowledge_base', 'tone'].map((variable, index) => (
                      <div key={index} className="flex items-center justify-between p-3">
                        <div>
                          <span className="font-mono text-sm bg-slate-100 px-1.5 py-0.5 rounded">
                            {`{{${variable}}}`}
                          </span>
                          <span className="ml-3 text-sm text-slate-600">
                            {variable.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        </div>
                        <div>
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variable
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline">Cancel</Button>
            <Button>Save Template</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Templates;
