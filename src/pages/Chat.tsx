
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, MessageSquare, User, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Chat = () => {
  const [message, setMessage] = useState("");
  
  const conversations = [
    { id: 1, user: "John Doe", lastMessage: "I need help with my order", time: "2 minutes ago", unread: true },
    { id: 2, user: "Sarah Johnson", lastMessage: "Can I get a refund?", time: "15 minutes ago", unread: false },
    { id: 3, user: "Alex Brown", lastMessage: "Product specifications", time: "1 hour ago", unread: false },
    { id: 4, user: "Emma Wilson", lastMessage: "Thanks for your help!", time: "3 hours ago", unread: false },
    { id: 5, user: "Michael Davis", lastMessage: "Is this in stock?", time: "1 day ago", unread: false },
  ];
  
  const messages = [
    { id: 1, type: "user", text: "Hi there! I'm looking for information about your premium plan.", time: "10:32 AM" },
    { id: 2, type: "ai", text: "Hello! I'd be happy to help you with information about our premium plan. Our premium plan includes advanced features such as unlimited messages, priority support, and custom branding. What specific aspects are you interested in?", time: "10:33 AM" },
    { id: 3, type: "user", text: "What's the pricing for the premium plan?", time: "10:34 AM" },
    { id: 4, type: "ai", text: "The premium plan is priced at $29/month when billed monthly, or $290/year when billed annually (saving you about 17%). This includes all the features I mentioned, plus up to 5 team members and 10GB of storage. Would you like me to tell you about any specific premium features?", time: "10:35 AM" },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Chat</h2>
        <p className="text-slate-500 mt-1">Manage and monitor chat conversations</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-[calc(100vh-180px)]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input className="pl-8" placeholder="Search conversations..." />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="active">
                <div className="px-6 pt-2">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="closed">Closed</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="active" className="m-0 pt-2">
                  <div className="h-[calc(100vh-280px)] overflow-y-auto">
                    {conversations.map((conversation) => (
                      <div 
                        key={conversation.id} 
                        className={`p-4 border-b hover:bg-slate-50 cursor-pointer ${conversation.id === 1 ? 'bg-slate-50' : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-slate-200 text-slate-800">
                              {conversation.user.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{conversation.user}</p>
                              <span className="text-xs text-slate-500">{conversation.time}</span>
                            </div>
                            <p className="text-sm text-slate-500 truncate">{conversation.lastMessage}</p>
                          </div>
                          {conversation.unread && (
                            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="closed" className="m-0 pt-2">
                  <div className="h-[calc(100vh-280px)] flex items-center justify-center text-slate-500">
                    No closed conversations
                  </div>
                </TabsContent>
                
                <TabsContent value="all" className="m-0 pt-2">
                  <div className="h-[calc(100vh-280px)] overflow-y-auto">
                    {/* Same as active for demo purposes */}
                    {conversations.map((conversation) => (
                      <div 
                        key={conversation.id} 
                        className={`p-4 border-b hover:bg-slate-50 cursor-pointer ${conversation.id === 1 ? 'bg-slate-50' : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-slate-200 text-slate-800">
                              {conversation.user.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{conversation.user}</p>
                              <span className="text-xs text-slate-500">{conversation.time}</span>
                            </div>
                            <p className="text-sm text-slate-500 truncate">{conversation.lastMessage}</p>
                          </div>
                          {conversation.unread && (
                            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-180px)] flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-slate-200 text-slate-800">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>John Doe</CardTitle>
                    <p className="text-xs text-slate-500">Online • Started 10 minutes ago</p>
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm">End Chat</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className="flex items-start max-w-[80%]">
                        {msg.type === "ai" && (
                          <div className="mr-2 mt-1">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                <MessageSquare size={14} />
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                        
                        <div>
                          <div className={`rounded-lg p-3 ${
                            msg.type === "user" 
                              ? "bg-blue-500 text-white" 
                              : "bg-slate-100 text-slate-800"
                          }`}>
                            <p className="text-sm">{msg.text}</p>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{msg.time}</p>
                        </div>
                        
                        {msg.type === "user" && (
                          <div className="ml-2 mt-1">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-slate-200 text-slate-800">
                                <User size={14} />
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t p-4">
                  <div className="flex items-center">
                    <Input 
                      placeholder="Type your message..." 
                      className="flex-1"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && message.trim() !== "") {
                          // Handle send message
                          setMessage("");
                        }
                      }}
                    />
                    <Button className="ml-2" disabled={message.trim() === ""}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
