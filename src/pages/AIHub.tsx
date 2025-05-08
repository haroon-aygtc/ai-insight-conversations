
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Upload, Database, Cpu } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AIHub = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">AI Hub</h2>
          <p className="text-slate-500 mt-1">Manage AI models and knowledge base</p>
        </div>
      </div>
      
      <Tabs defaultValue="models">
        <TabsList>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>
        
        <TabsContent value="models" className="space-y-6 pt-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Available Models</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 1, name: "Gemini Pro", provider: "Google", type: "GPT", status: "Active" },
                  { id: 2, name: "Claude 3", provider: "Anthropic", type: "LLM", status: "Active" },
                  { id: 3, name: "Llama 2", provider: "Meta", type: "Open Source", status: "Available" },
                  { id: 4, name: "GPT-4", provider: "OpenAI", type: "GPT", status: "Active" },
                  { id: 5, name: "Mistral", provider: "Mistral AI", type: "Open Source", status: "Available" },
                  { id: 6, name: "Custom Model", provider: "Your Company", type: "Fine-tuned", status: "In Training" },
                ].map((model) => (
                  <Card key={model.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <Cpu className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{model.name}</h3>
                          <p className="text-xs text-slate-500">{model.provider}</p>
                        </div>
                      </div>
                      
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Type:</span>
                          <span>{model.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Status:</span>
                          <span className={`${
                            model.status === "Active" ? "text-green-600" : 
                            model.status === "Available" ? "text-blue-600" : 
                            "text-orange-600"
                          }`}>{model.status}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Primary Model</label>
                    <div className="flex items-center p-3 border rounded-md bg-slate-50">
                      <Cpu className="h-4 w-4 mr-3 text-slate-500" />
                      <div>
                        <p className="font-medium">Gemini Pro</p>
                        <p className="text-xs text-slate-500">Google</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Fallback Model</label>
                    <div className="flex items-center p-3 border rounded-md bg-slate-50">
                      <Cpu className="h-4 w-4 mr-3 text-slate-500" />
                      <div>
                        <p className="font-medium">GPT-4</p>
                        <p className="text-xs text-slate-500">OpenAI</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">API Configuration</label>
                    <div className="p-3 border rounded-md space-y-3">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">API Key</label>
                        <Input type="password" value="••••••••••••••••" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Endpoint</label>
                        <Input defaultValue="https://api.provider.com/v1/completions" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Model Parameters</label>
                    <div className="p-3 border rounded-md space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Temperature</label>
                          <Input type="number" defaultValue="0.7" min="0" max="1" step="0.1" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Max Tokens</label>
                          <Input type="number" defaultValue="1024" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline">Cancel</Button>
                <Button>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="knowledge" className="space-y-6 pt-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Knowledge Base</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input className="w-[250px] pl-8" placeholder="Search documents..." />
                  </div>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 1, name: "Product Documentation.pdf", type: "PDF", size: "2.5 MB", uploaded: "2 days ago", status: "Processed" },
                    { id: 2, name: "FAQ.docx", type: "DOCX", size: "1.2 MB", uploaded: "1 week ago", status: "Processed" },
                    { id: 3, name: "Technical Specifications.xlsx", type: "XLSX", size: "3.7 MB", uploaded: "3 days ago", status: "Processing" },
                    { id: 4, name: "User Guide.pdf", type: "PDF", size: "5.1 MB", uploaded: "5 days ago", status: "Processed" },
                    { id: 5, name: "API Documentation.md", type: "Markdown", size: "0.8 MB", uploaded: "1 day ago", status: "Processed" },
                  ].map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Database className="h-4 w-4 mr-2 text-slate-500" />
                          {doc.name}
                        </div>
                      </TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>{doc.uploaded}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          doc.status === "Processed" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-orange-100 text-orange-800"
                        }`}>
                          {doc.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Update</Button>
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
              <CardTitle>Knowledge Base Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Indexing Engine</label>
                    <div className="border rounded-md p-3">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center">
                          <Database className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Vector Database</h3>
                          <p className="text-xs text-slate-500">Pinecone</p>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <Button variant="outline" size="sm">Change Engine</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Supported File Types</label>
                    <div className="flex flex-wrap gap-2">
                      {["PDF", "DOCX", "TXT", "XLSX", "CSV", "MD", "HTML"].map((type) => (
                        <div key={type} className="px-2.5 py-1 bg-slate-100 rounded text-sm">
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Knowledge Base Size</label>
                    <div className="bg-slate-50 rounded-md p-3">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm">14.3 MB / 100 MB</span>
                        <span className="text-sm text-slate-500">14.3%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '14.3%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Advanced Options</label>
                    <div className="border rounded-md divide-y">
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">Automatic Processing</span>
                        <Button variant="outline" size="sm">Enabled</Button>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">Re-indexing Schedule</span>
                        <Button variant="outline" size="sm">Daily</Button>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">Chunk Size</span>
                        <Button variant="outline" size="sm">512 tokens</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline">Reset</Button>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIHub;
