
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Search, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ContextRules = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Context Rules</h2>
          <p className="text-slate-500 mt-1">Manage behavior rules for different contexts</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Rules Management</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input className="w-[250px] pl-8" placeholder="Search rules..." />
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
                <TableHead>Type</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { id: 1, name: "Product Inquiry", type: "Page URL", condition: "Contains /products/", priority: "High", status: "Active" },
                { id: 2, name: "Support Request", type: "Page URL", condition: "Contains /support/", priority: "Medium", status: "Active" },
                { id: 3, name: "Checkout Process", type: "User Action", condition: "On checkout page", priority: "High", status: "Active" },
                { id: 4, name: "First-time Visitor", type: "User Attribute", condition: "First visit is true", priority: "Low", status: "Inactive" },
                { id: 5, name: "Returning Customer", type: "User Attribute", condition: "Has purchase history", priority: "Medium", status: "Active" },
              ].map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.type}</TableCell>
                  <TableCell>{rule.condition}</TableCell>
                  <TableCell>{rule.priority}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      rule.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-slate-100 text-slate-800"
                    }`}>
                      {rule.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
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
          <CardTitle>Create Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Rule Name</Label>
                  <Input placeholder="Enter rule name" />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
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
                <Label>Description</Label>
                <Textarea 
                  placeholder="Enter rule description" 
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="conditions" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Condition Type</Label>
                  <Select defaultValue="pageUrl">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pageUrl">Page URL</SelectItem>
                      <SelectItem value="userAttribute">User Attribute</SelectItem>
                      <SelectItem value="userAction">User Action</SelectItem>
                      <SelectItem value="timeOnPage">Time on Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Operator</Label>
                  <Select defaultValue="contains">
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="startsWith">Starts With</SelectItem>
                      <SelectItem value="endsWith">Ends With</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Value</Label>
                <Input placeholder="Enter condition value" />
              </div>
              
              <div className="pt-2">
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Condition
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-4 pt-4">
              <div>
                <Label>Action Type</Label>
                <Select defaultValue="setPrompt">
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="setPrompt">Set Prompt Template</SelectItem>
                    <SelectItem value="setModel">Set AI Model</SelectItem>
                    <SelectItem value="setMessage">Set Welcome Message</SelectItem>
                    <SelectItem value="changeBehavior">Change Widget Behavior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Prompt Template</Label>
                <Select defaultValue="product">
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product Expert</SelectItem>
                    <SelectItem value="support">Support Agent</SelectItem>
                    <SelectItem value="sales">Sales Assistant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Custom Parameters</Label>
                <Textarea 
                  placeholder="Enter custom parameters (JSON format)" 
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline">Cancel</Button>
            <Button>Save Rule</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextRules;
