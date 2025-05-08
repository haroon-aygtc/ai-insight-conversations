
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WidgetConfigurator = () => {
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [borderRadius, setBorderRadius] = useState("8");
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Widget Configurator</h2>
        <p className="text-slate-500 mt-1">Customize your chat widget appearance and behavior</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <Tabs defaultValue="visual">
              <CardHeader className="pb-0">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="visual">Visual</TabsTrigger>
                  <TabsTrigger value="behavior">Behavior</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="embedding">Embedding</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="visual" className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Primary Color</Label>
                        <div className="flex gap-2 mt-1">
                          <div 
                            className="w-10 h-10 rounded border"
                            style={{ backgroundColor: primaryColor }}
                          />
                          <Input 
                            type="text" 
                            value={primaryColor} 
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Secondary Color</Label>
                        <div className="flex gap-2 mt-1">
                          <div 
                            className="w-10 h-10 rounded border"
                            style={{ backgroundColor: secondaryColor }}
                          />
                          <Input 
                            type="text" 
                            value={secondaryColor} 
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Font Family</Label>
                        <Select defaultValue="inter">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="roboto">Roboto</SelectItem>
                            <SelectItem value="opensans">Open Sans</SelectItem>
                            <SelectItem value="lato">Lato</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Border Radius (px)</Label>
                        <Input 
                          type="number" 
                          value={borderRadius} 
                          onChange={(e) => setBorderRadius(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label>Size</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="behavior" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Auto Open</Label>
                        <Select defaultValue="no">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="delay">After delay</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Position</Label>
                        <Select defaultValue="bottom-right">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="top-left">Top Left</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Animation</Label>
                        <Select defaultValue="fade">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select animation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fade">Fade</SelectItem>
                            <SelectItem value="slide">Slide</SelectItem>
                            <SelectItem value="bounce">Bounce</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Mobile Behavior</Label>
                        <Select defaultValue="responsive">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select behavior" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="responsive">Responsive</SelectItem>
                            <SelectItem value="fullscreen">Fullscreen</SelectItem>
                            <SelectItem value="minimized">Minimized</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Welcome Message</Label>
                      <Input placeholder="Enter welcome message" defaultValue="Hello! How can I help you today?" />
                    </div>
                    
                    <div>
                      <Label>Bot Name</Label>
                      <Input placeholder="Enter bot name" defaultValue="AI Assistant" />
                    </div>
                    
                    <div>
                      <Label>Input Placeholder</Label>
                      <Input placeholder="Enter input placeholder" defaultValue="Type a message..." />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="embedding" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Embed Code</Label>
                      <div className="bg-slate-100 p-4 rounded-md mt-2">
                        <code className="text-sm">
                          {`<script src="https://chatadmin.example.com/widget.js" id="chat-widget" data-id="WIDGET_ID"></script>`}
                        </code>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Label className="mb-2 block">Installation Instructions</Label>
                      <ol className="list-decimal list-inside space-y-2 text-slate-600">
                        <li>Copy the embed code above</li>
                        <li>Paste it before the closing &lt;/body&gt; tag on your website</li>
                        <li>The widget will automatically initialize</li>
                        <li>Visit our documentation for advanced customization options</li>
                      </ol>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[500px] bg-slate-100 rounded-md p-4">
                <div 
                  className="w-full max-w-xs h-[400px] bg-white border shadow-lg overflow-hidden"
                  style={{ 
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  <div 
                    className="h-12 flex items-center px-4" 
                    style={{ backgroundColor: primaryColor, color: secondaryColor }}
                  >
                    <span className="font-medium">AI Assistant</span>
                  </div>
                  <div className="p-4 h-[300px] bg-slate-50 overflow-auto">
                    {/* Chat messages would go here */}
                    <div className="flex flex-col space-y-4">
                      <div className="flex">
                        <div className="bg-white rounded-lg p-3 shadow max-w-[80%]">
                          <p className="text-sm">Hello! How can I help you today?</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div 
                          className="rounded-lg p-3 shadow max-w-[80%]"
                          style={{ backgroundColor: primaryColor, color: secondaryColor }}
                        >
                          <p className="text-sm">I need help with my order</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-12 px-2 flex items-center border-t">
                    <Input 
                      placeholder="Type a message..." 
                      className="h-8 text-sm"
                    />
                    <Button className="ml-2 h-8 w-8 p-0" style={{ backgroundColor: primaryColor }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default WidgetConfigurator;
