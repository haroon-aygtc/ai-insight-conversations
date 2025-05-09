
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MessageSquare, Send } from 'lucide-react';

const WidgetConfigurator = () => {
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [borderRadius, setBorderRadius] = useState(8);
  const [chatIconSize, setChatIconSize] = useState(40);
  const [fontFamily, setFontFamily] = useState("inter");
  const [activeTab, setActiveTab] = useState("appearance");
  const [welcomeMessage, setWelcomeMessage] = useState("Hello! How can I help you today?");
  const [botName, setBotName] = useState("AI Assistant");
  
  // Color options
  const colorOptions = [
    { color: "#6366f1", class: "bg-indigo-500" },
    { color: "#10b981", class: "bg-green-500" },
    { color: "#ef4444", class: "bg-red-500" },
    { color: "#f97316", class: "bg-orange-500" },
    { color: "#8b5cf6", class: "bg-purple-500" },
    { color: "#000000", class: "bg-black" },
    { color: "#7e22ce", class: "bg-violet-700" },
  ];

  // Handle border radius change
  const handleBorderRadiusChange = (value: number[]) => {
    setBorderRadius(value[0]);
  };
  
  // Handle chat icon size change
  const handleChatIconSizeChange = (value: number[]) => {
    setChatIconSize(value[0]);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Top navigation tabs */}
      <div className="flex items-center space-x-4 overflow-auto pb-2 border-b border-slate-200">
        <Button 
          variant={activeTab === "overview" ? "default" : "ghost"} 
          onClick={() => setActiveTab("overview")}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
          Overview
        </Button>
        <Button 
          variant={activeTab === "widget-config" ? "default" : "ghost"} 
          onClick={() => setActiveTab("widget-config")}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
          Widget Config
        </Button>
        <Button 
          variant={activeTab === "context-rules" ? "default" : "ghost"} 
          onClick={() => setActiveTab("context-rules")}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          Context Rules
        </Button>
        <Button 
          variant={activeTab === "templates" ? "default" : "ghost"} 
          onClick={() => setActiveTab("templates")}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          Templates
        </Button>
        <Button 
          variant={activeTab === "embed-code" ? "default" : "ghost"} 
          onClick={() => setActiveTab("embed-code")}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Embed Code
        </Button>
        <Button 
          variant={activeTab === "analytics" ? "default" : "ghost"} 
          onClick={() => setActiveTab("analytics")}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          Analytics
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-slate-800">Widget Configurator</h2>
        <p className="text-slate-500 mt-1">Customize your chat widget appearance and behavior</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm">
            <Tabs defaultValue="appearance" className="w-full">
              <div className="border-b border-slate-200">
                <TabsList className="p-0 bg-transparent border-b-0 h-auto justify-start gap-2">
                  <TabsTrigger 
                    value="appearance" 
                    className={`px-4 py-3 rounded-none border-b-2 ${activeTab === 'appearance' ? 'border-primary text-primary' : 'border-transparent'} data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2`}
                    onClick={() => setActiveTab('appearance')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="behavior" 
                    className={`px-4 py-3 rounded-none border-b-2 ${activeTab === 'behavior' ? 'border-primary text-primary' : 'border-transparent'} data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2`}
                    onClick={() => setActiveTab('behavior')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    Behavior
                  </TabsTrigger>
                  <TabsTrigger 
                    value="content" 
                    className={`px-4 py-3 rounded-none border-b-2 ${activeTab === 'content' ? 'border-primary text-primary' : 'border-transparent'} data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2`}
                    onClick={() => setActiveTab('content')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                    Content
                  </TabsTrigger>
                  <TabsTrigger 
                    value="embedding" 
                    className={`px-4 py-3 rounded-none border-b-2 ${activeTab === 'embedding' ? 'border-primary text-primary' : 'border-transparent'} data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2`}
                    onClick={() => setActiveTab('embedding')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 7 10 10"/><path d="M15 7h2v2"/><path d="M9 17H7v-2"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                    Embedding
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="pt-6">
                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Visual Style</h3>
                      <p className="text-sm text-slate-500 mb-4">Customize how your chat widget looks</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="mb-2 block">Primary Color</Label>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap gap-2">
                              {colorOptions.map((opt) => (
                                <button
                                  key={opt.color}
                                  className={`w-8 h-8 rounded-full ${opt.class} transition-transform hover:scale-110 ${
                                    primaryColor === opt.color ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                                  }`}
                                  onClick={() => setPrimaryColor(opt.color)}
                                  aria-label={`Select ${opt.color} as primary color`}
                                />
                              ))}
                              <div className="relative w-8 h-8">
                                <Input
                                  type="color"
                                  value={primaryColor}
                                  onChange={(e) => setPrimaryColor(e.target.value)}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0"
                                />
                                <div 
                                  className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center"
                                  style={{ backgroundColor: primaryColor }}
                                >
                                  <span className="sr-only">Custom color</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500">This color will be used for the chat header and buttons</p>
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2 block">Secondary Color</Label>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap gap-2">
                              {colorOptions.map((opt) => (
                                <button
                                  key={opt.color}
                                  className={`w-8 h-8 rounded-full ${opt.class} transition-transform hover:scale-110 ${
                                    secondaryColor === opt.color ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                                  }`}
                                  onClick={() => setSecondaryColor(opt.color)}
                                  aria-label={`Select ${opt.color} as secondary color`}
                                />
                              ))}
                              <button
                                className={`w-8 h-8 rounded-full bg-white border border-slate-300 transition-transform hover:scale-110 ${
                                  secondaryColor === '#ffffff' ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                                }`}
                                onClick={() => setSecondaryColor('#ffffff')}
                                aria-label="Select white as secondary color"
                              />
                              <div className="relative w-8 h-8">
                                <Input
                                  type="color"
                                  value={secondaryColor}
                                  onChange={(e) => setSecondaryColor(e.target.value)}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0"
                                />
                                <div 
                                  className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center"
                                  style={{ backgroundColor: secondaryColor }}
                                >
                                  <span className="sr-only">Custom color</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500">Used for backgrounds and secondary elements</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="mb-2 block">Font Family</Label>
                          <Select 
                            value={fontFamily}
                            onValueChange={setFontFamily}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inter">Inter</SelectItem>
                              <SelectItem value="roboto">Roboto</SelectItem>
                              <SelectItem value="opensans">Open Sans</SelectItem>
                              <SelectItem value="lato">Lato</SelectItem>
                              <SelectItem value="montserrat">Montserrat</SelectItem>
                              <SelectItem value="poppins">Poppins</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-slate-500 mt-1">Choose a font for your chat widget</p>
                        </div>
                        
                        <div>
                          <Label className="mb-2 block">Border Radius: {borderRadius}px</Label>
                          <div className="pt-2 px-1">
                            <Slider
                              defaultValue={[borderRadius]}
                              max={20}
                              min={0}
                              step={1}
                              onValueChange={handleBorderRadiusChange}
                            />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Adjust the roundness of corners</p>
                        </div>
                        
                        <div>
                          <Label className="mb-2 block">Chat Icon Size: {chatIconSize}px</Label>
                          <div className="pt-2 px-1">
                            <Slider
                              defaultValue={[chatIconSize]}
                              max={60}
                              min={20}
                              step={1}
                              onValueChange={handleChatIconSizeChange}
                            />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Size of the chat button when minimized</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="behavior" className="space-y-4 mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Widget Behavior</h3>
                      <p className="text-sm text-slate-500 mb-4">Configure how your widget behaves</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="mb-2 block">Auto Open</Label>
                          <Select defaultValue="no">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="delay">After delay</SelectItem>
                              <SelectItem value="scroll">After scrolling</SelectItem>
                              <SelectItem value="exit">On exit intent</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-slate-500 mt-1">When should the chat automatically open</p>
                        </div>
                        
                        <div>
                          <Label className="mb-2 block">Delay (seconds)</Label>
                          <div className="pt-2 px-1">
                            <Slider
                              defaultValue={[5]}
                              max={30}
                              min={1}
                              step={1}
                            />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Delay before the widget appears</p>
                        </div>
                        
                        <div>
                          <Label className="mb-2 block">Position</Label>
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
                          <p className="text-xs text-slate-500 mt-1">Position of the widget on the page</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="mb-2 block">Animation</Label>
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
                          <p className="text-xs text-slate-500 mt-1">Animation when opening/closing the widget</p>
                        </div>
                        
                        <div>
                          <Label className="mb-2 block">Mobile Behavior</Label>
                          <Select defaultValue="responsive">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select behavior" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="responsive">Responsive</SelectItem>
                              <SelectItem value="fullscreen">Fullscreen</SelectItem>
                              <SelectItem value="minimized">Minimized</SelectItem>
                              <SelectItem value="hidden">Hidden on mobile</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-slate-500 mt-1">How the widget behaves on mobile devices</p>
                        </div>
                        
                        <div>
                          <Label className="mb-2 block">Show after page views</Label>
                          <div className="pt-2 px-1">
                            <Slider
                              defaultValue={[1]}
                              max={10}
                              min={1}
                              step={1}
                            />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Number of page views before showing the widget</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="content" className="space-y-4 mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Chat Content</h3>
                      <p className="text-sm text-slate-500 mb-4">Configure messages and content settings</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Welcome Message</Label>
                        <Input 
                          placeholder="Enter welcome message" 
                          value={welcomeMessage}
                          onChange={(e) => setWelcomeMessage(e.target.value)}
                        />
                        <p className="text-xs text-slate-500 mt-1">First message shown to your visitors</p>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Bot Name</Label>
                        <Input 
                          placeholder="Enter bot name" 
                          value={botName}
                          onChange={(e) => setBotName(e.target.value)}
                        />
                        <p className="text-xs text-slate-500 mt-1">Name displayed for the chat assistant</p>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Input Placeholder</Label>
                        <Input placeholder="Enter placeholder text" defaultValue="Type a message..." />
                        <p className="text-xs text-slate-500 mt-1">Text shown in the chat input field</p>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Chat Button Text</Label>
                        <Input placeholder="Enter button text" defaultValue="Chat with us" />
                        <p className="text-xs text-slate-500 mt-1">Text shown on the chat button</p>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Header Title</Label>
                        <Input placeholder="Enter header title" defaultValue="Chat Support" />
                        <p className="text-xs text-slate-500 mt-1">Title shown in the chat header</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="embedding" className="space-y-4 mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Embed Settings</h3>
                      <p className="text-sm text-slate-500 mb-4">Get code to embed on your website</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Embed Code</Label>
                        <div className="bg-slate-100 p-4 rounded-md mt-2">
                          <code className="text-sm text-slate-700 font-mono">
                            {`<script src="https://chatadmin.example.com/widget.js" id="chat-widget" data-id="WIDGET_ID"></script>`}
                          </code>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                          Copy to clipboard
                        </Button>
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
                      
                      <div className="pt-4">
                        <Label className="mb-2 block">Domains Allowed</Label>
                        <Input placeholder="Enter domains (e.g., example.com)" defaultValue="*" />
                        <p className="text-xs text-slate-500 mt-1">Domains where the widget can be loaded (* for all domains)</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-medium text-slate-800 flex items-center">
                Live Preview 
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-50 text-green-600 rounded-full">
                  Active
                </span>
              </h3>
            </div>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center h-[600px] bg-slate-50 rounded-md">
                <div 
                  className="w-full max-w-xs h-[450px] bg-white border shadow-lg overflow-hidden relative"
                  style={{ 
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  <div 
                    className="h-12 flex items-center px-4 justify-between" 
                    style={{ backgroundColor: primaryColor, color: secondaryColor }}
                  >
                    <span className="font-medium">{botName}</span>
                    <div className="flex gap-2">
                      <button className="p-1 rounded-full hover:bg-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 h-[340px] bg-slate-50 overflow-y-auto flex flex-col gap-4">
                    <div className="flex">
                      <div className="bg-white rounded-lg p-3 shadow max-w-[80%] text-slate-800">
                        <p className="text-sm">{welcomeMessage}</p>
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
                    <div className="flex">
                      <div className="bg-white rounded-lg p-3 shadow max-w-[80%] text-slate-800">
                        <p className="text-sm">I'd be happy to help with your order. Could you please provide your order number?</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-14 px-3 py-2 flex items-center gap-2 border-t">
                    <Input 
                      placeholder="Type a message..." 
                      className="h-9 text-sm"
                    />
                    <Button 
                      className="h-9 w-9 p-0 rounded-full" 
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Send size={16} />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </div>
                
                <div 
                  className="mt-4 rounded-full w-14 h-14 flex items-center justify-center shadow-lg cursor-pointer"
                  style={{ 
                    backgroundColor: primaryColor,
                    color: secondaryColor,
                    width: `${chatIconSize}px`,
                    height: `${chatIconSize}px`,
                  }}
                >
                  <MessageSquare size={chatIconSize * 0.5} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset to Default</Button>
        <Button>Save Configuration</Button>
      </div>
    </div>
  );
};

export default WidgetConfigurator;
