
import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FileText, Database, Globe, Upload, Trash2, Eye, 
  Download, FileUp, Edit, Loader2, Plus, Search
} from "lucide-react";

import WebScraper from '../WebScraper';

const KnowledgeBaseModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleWebsiteContent = (content: string) => {
    console.log("Website content received:", content.substring(0, 100) + "...");
    // In a real app, this would save the content to the knowledge base
  };
  
  // Sample knowledge base entries
  const documents = [
    { id: 1, name: "Product Manual.pdf", type: "PDF", size: "2.4 MB", date: "2023-05-10", status: "Active" },
    { id: 2, name: "FAQ Document.docx", type: "DOCX", size: "1.1 MB", date: "2023-04-28", status: "Active" },
    { id: 3, name: "Technical Specifications.xlsx", type: "XLSX", size: "3.8 MB", date: "2023-05-15", status: "Processing" },
    { id: 4, name: "User Guide.pdf", type: "PDF", size: "5.2 MB", date: "2023-05-02", status: "Active" },
    { id: 5, name: "Terms and Conditions.pdf", type: "PDF", size: "0.9 MB", date: "2023-04-15", status: "Active" }
  ];
  
  const websites = [
    { id: 1, url: "https://example.com/faq", title: "FAQ Page", lastScraped: "2023-05-01", status: "Active" },
    { id: 2, url: "https://example.com/support", title: "Support Center", lastScraped: "2023-05-10", status: "Active" },
    { id: 3, url: "https://example.com/docs", title: "Documentation", lastScraped: "2023-04-20", status: "Error" }
  ];
  
  const articles = [
    { id: 1, title: "Getting Started Guide", category: "Onboarding", author: "Admin", updated: "2023-05-12", status: "Published" },
    { id: 2, title: "Troubleshooting Common Issues", category: "Support", author: "Support Team", updated: "2023-05-08", status: "Published" },
    { id: 3, title: "Advanced Features", category: "Features", author: "Product Team", updated: "2023-05-15", status: "Draft" }
  ];
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Processing":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Processing</Badge>;
      case "Error":
        return <Badge variant="destructive">Error</Badge>;
      case "Published":
        return <Badge className="bg-green-500">Published</Badge>;
      case "Draft":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
        <p className="text-muted-foreground mt-2">
          Manage all the sources of information that power your AI assistant.
        </p>
      </div>
      
      <Card className="border shadow-sm">
        <CardHeader className="bg-muted/50 pb-4">
          <CardTitle className="flex items-center text-lg font-medium">
            <Database className="w-5 h-5 mr-2" />
            Knowledge Sources
          </CardTitle>
          <CardDescription>
            Organize and manage all knowledge sources used by your AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="documents" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="documents" className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </TabsTrigger>
              <TabsTrigger value="websites" className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                <span>Websites</span>
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                <span>Articles</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-1.5">
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Document
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell className="text-center">
                          {renderStatusBadge(doc.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="websites" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search websites..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add Website
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Last Scraped</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {websites.map((site) => (
                      <TableRow key={site.id}>
                        <TableCell className="font-medium">{site.url}</TableCell>
                        <TableCell>{site.title}</TableCell>
                        <TableCell>{site.lastScraped}</TableCell>
                        <TableCell className="text-center">
                          {renderStatusBadge(site.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <WebScraper onContentExtracted={handleWebsiteContent} />
            </TabsContent>
            
            <TabsContent value="articles" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Create Article
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>{article.category}</TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>{article.updated}</TableCell>
                        <TableCell className="text-center">
                          {renderStatusBadge(article.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              <Card className="border-dashed border-2 p-10">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Knowledge Documents</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Drag and drop files here or click to upload.<br />
                    Supports PDF, DOCX, XLSX, CSV, and TXT files up to 50MB.
                  </p>
                  
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="document-upload">Upload Document</Label>
                    <Input
                      id="document-upload"
                      type="file"
                      accept=".pdf,.docx,.xlsx,.csv,.txt"
                      className="cursor-pointer"
                    />
                  </div>
                  
                  <div className="w-full max-w-sm mt-6">
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => setIsLoading(false), 2000);
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" /> Upload and Process
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-muted/30 px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Total knowledge sources: {documents.length + websites.length + articles.length}
          </span>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Settings</Button>
            <Button size="sm" disabled={isLoading} onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1500);
            }}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update AI Context"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default KnowledgeBaseModule;
