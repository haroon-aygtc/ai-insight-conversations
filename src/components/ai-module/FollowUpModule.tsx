
import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, 
  DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  MessageCircle, PlusCircle, Save, Check, Trash2, ArrowRight, 
  ArrowDown, Loader2, RefreshCw, Copy
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

const FollowUpModule: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [followUpPosition, setFollowUpPosition] = useState("end");
  const [followUpFormat, setFollowUpFormat] = useState("numbered");
  const [enableFollowUp, setEnableFollowUp] = useState(true);
  const [maxFollowUps, setMaxFollowUps] = useState(3);
  const [isAddFollowUpOpen, setIsAddFollowUpOpen] = useState(false);
  
  // Sample follow-up sets
  const followUpSets = [
    {
      id: 1,
      name: "Product Features",
      category: "Product",
      questions: [
        "What are the main features of the product?",
        "How does the pricing work?",
        "Is there a trial version available?"
      ],
      active: true
    },
    {
      id: 2,
      name: "Technical Support",
      category: "Support",
      questions: [
        "How do I reset my password?",
        "Where can I download the latest version?",
        "How do I contact technical support?"
      ],
      active: true
    },
    {
      id: 3,
      name: "Account Management",
      category: "Account",
      questions: [
        "How do I update my account details?",
        "Can I have multiple users on one account?",
        "What happens when my subscription ends?"
      ],
      active: false
    }
  ];
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Follow-up settings saved",
        description: "Your follow-up configuration has been updated successfully.",
      });
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Follow-up Questions</h2>
        <p className="text-muted-foreground mt-2">
          Configure dynamic follow-up questions to enhance user engagement.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border shadow-sm">
          <CardHeader className="bg-muted/50 pb-4">
            <CardTitle className="flex items-center text-lg font-medium">
              <MessageCircle className="w-5 h-5 mr-2" />
              Follow-up Question Sets
            </CardTitle>
            <CardDescription>
              Create and manage follow-up question sets to guide conversations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-followup"
                    checked={enableFollowUp}
                    onCheckedChange={setEnableFollowUp}
                  />
                  <Label htmlFor="enable-followup">Enable Follow-up Questions</Label>
                </div>
                
                {enableFollowUp && (
                  <Badge className="bg-green-500">Active</Badge>
                )}
              </div>
              
              <Button onClick={() => setIsAddFollowUpOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Question Set
              </Button>
            </div>
            
            {enableFollowUp && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="followup-position">Follow-up Questions Position</Label>
                    <Select value={followUpPosition} onValueChange={setFollowUpPosition}>
                      <SelectTrigger id="followup-position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="start">At the Beginning</SelectItem>
                        <SelectItem value="middle">In the Middle</SelectItem>
                        <SelectItem value="end">At the End</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Where to place suggested follow-up questions in the response
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="followup-format">Follow-up Format</Label>
                    <Select value={followUpFormat} onValueChange={setFollowUpFormat}>
                      <SelectTrigger id="followup-format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="numbered">Numbered List (1. 2. 3.)</SelectItem>
                        <SelectItem value="bullets">Bullet Points (• • •)</SelectItem>
                        <SelectItem value="buttons">Clickable Buttons</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      How to display the follow-up questions to users
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-followups">Maximum Follow-up Questions</Label>
                  <Input
                    id="max-followups"
                    type="number"
                    value={maxFollowUps}
                    onChange={(e) => setMaxFollowUps(Number(e.target.value))}
                    min={1}
                    max={5}
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum number of follow-up questions to suggest (1-5)
                  </p>
                </div>
                
                <div className="rounded-md border mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Question Set</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Questions</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {followUpSets.map((set) => (
                        <TableRow key={set.id}>
                          <TableCell className="font-medium">{set.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/10">{set.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 text-sm">
                              {set.questions.slice(0, 1).map((q, i) => (
                                <div key={i} className="truncate max-w-[240px]">{q}</div>
                              ))}
                              {set.questions.length > 1 && (
                                <div className="text-xs text-muted-foreground">
                                  +{set.questions.length - 1} more questions
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {set.active ? (
                              <Badge className="bg-green-500">Active</Badge>
                            ) : (
                              <Badge variant="outline">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <ArrowRight className="h-4 w-4" />
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
              </div>
            )}
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
        
        <div>
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Follow-up Preview</CardTitle>
              <CardDescription>
                How follow-up questions will appear to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">AI Response</h3>
                  <div className="text-sm">
                    <p>
                      The latest version of our software includes performance improvements, bug fixes, and several new features requested by our users.
                    </p>
                    <p className="mt-2">
                      You can download it from your account dashboard under "Downloads" or by visiting our website's download section.
                    </p>
                  </div>
                </div>
                
                {enableFollowUp && (
                  <div className="space-y-2 pt-2 border-t">
                    <h3 className="font-medium text-sm">Would you like to know more about:</h3>
                    
                    {followUpFormat === 'numbered' && (
                      <ol className="list-decimal pl-5 text-sm space-y-1">
                        <li>What are the new features in this version?</li>
                        <li>How do I update my existing installation?</li>
                        <li>Are there any known issues in this release?</li>
                      </ol>
                    )}
                    
                    {followUpFormat === 'bullets' && (
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>What are the new features in this version?</li>
                        <li>How do I update my existing installation?</li>
                        <li>Are there any known issues in this release?</li>
                      </ul>
                    )}
                    
                    {followUpFormat === 'buttons' && (
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-7">
                          What are the new features in this version?
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7">
                          How do I update my existing installation?
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7">
                          Are there any known issues in this release?
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Follow-up Flow</CardTitle>
              <CardDescription>
                How follow-ups create conversation paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border rounded-md p-4">
                <div className="mb-4 bg-muted p-2 rounded">
                  <div className="text-xs font-medium">Initial User Query:</div>
                  <div className="text-sm mt-1">"Tell me about your software updates"</div>
                </div>
                
                <div className="border-l-2 border-dashed border-muted pl-4 ml-2 space-y-4">
                  <div>
                    <div className="flex items-center text-xs">
                      <ArrowDown className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">AI Response</span>
                    </div>
                    <div className="mt-1 text-xs">
                      Information about software updates + follow-up options
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-xs">
                      <ArrowDown className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">User Selects Follow-up</span>
                    </div>
                    <div className="mt-1 text-xs font-medium">
                      "What are the new features in this version?"
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-xs">
                      <ArrowDown className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">AI Response</span>
                    </div>
                    <div className="mt-1 text-xs">
                      Detailed information about new features + more follow-ups
                    </div>
                  </div>
                </div>
                
                <Button size="sm" variant="outline" className="mt-4 w-full text-xs">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  View Complete Flow Example
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Follow-up Question Set Dialog */}
      <Dialog open={isAddFollowUpOpen} onOpenChange={setIsAddFollowUpOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Follow-up Question Set</DialogTitle>
            <DialogDescription>
              Create a new set of related follow-up questions for a specific topic.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="set-name">Question Set Name</Label>
              <Input id="set-name" placeholder="e.g. Product Features" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="set-category">Category</Label>
              <Select>
                <SelectTrigger id="set-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="questions">Follow-up Questions</Label>
                <span className="text-xs text-muted-foreground">(One per line, maximum 5)</span>
              </div>
              <Textarea 
                id="questions"
                placeholder="What are the main features of the product?
How does the pricing work?
Is there a trial version available?"
                className="min-h-[120px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Trigger Conditions (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="When should these follow-ups appear?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">Always show</SelectItem>
                  <SelectItem value="product_query">After product queries</SelectItem>
                  <SelectItem value="support_query">After support queries</SelectItem>
                  <SelectItem value="specific_keywords">When specific keywords are detected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="active-set" defaultChecked />
              <Label htmlFor="active-set">Set as Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFollowUpOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsAddFollowUpOpen(false);
              toast({
                title: "Follow-up question set created",
                description: "Your new follow-up questions have been added.",
              });
            }}>
              <Check className="h-4 w-4 mr-1" /> Create Set
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowUpModule;
