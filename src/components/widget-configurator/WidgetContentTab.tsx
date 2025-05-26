import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Edit, Plus, Trash2, X, MessageSquare, ThumbsUp, ThumbsDown, Settings, Move, GripHorizontal, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreChatField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  options?: string[]; // For select fields
  defaultValue?: string;
}

interface FeedbackOption {
  id: string;
  type: string; // 'thumbs' | 'stars' | 'emoji' | 'custom'
  question: string;
  options?: string[]; // For custom options
  required: boolean;
}

interface WidgetContentTabProps {
  config: {
    welcomeMessage: string;
    botName: string;
    inputPlaceholder: string;
    chatButtonText: string;
    headerTitle: string;
    enablePreChatForm: boolean;
    preChatFormFields: PreChatField[];
    preChatFormTitle?: string;
    preChatFormSubtitle?: string;
    enableFeedback: boolean;
    feedbackPosition: string;
    feedbackOptions?: FeedbackOption[];
    showTypingIndicator?: boolean;
    showAvatar?: boolean;
    preChatFormRequired?: boolean;
    showTimestamps?: boolean;
    enableAttachments?: boolean;
  };
  onChange: (key: string, value: any) => void;
}

export const WidgetContentTab: React.FC<WidgetContentTabProps> = ({ config, onChange }) => {
  const [activePreChatField, setActivePreChatField] = useState<string | null>(null);
  const [activeFeedbackOption, setActiveFeedbackOption] = useState<string | null>(null);

  // Initialize default fields if not already present
  React.useEffect(() => {
    if (!config.preChatFormFields || !Array.isArray(config.preChatFormFields)) {
      // Convert old format to new format if necessary
      if (Array.isArray(config.preChatFormFields) && typeof config.preChatFormFields[0] === 'string') {
        const convertedFields = (config.preChatFormFields as unknown as string[]).map(fieldName => ({
          id: `field-${fieldName}`,
          label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
          type: fieldName === 'message' ? 'textarea' : fieldName === 'email' ? 'email' : 'text',
          placeholder: `Enter your ${fieldName}`,
          required: config.preChatFormRequired || false
        }));
        onChange('preChatFormFields', convertedFields);
      } else {
        // Set default fields
        onChange('preChatFormFields', [
          {
            id: 'field-name',
            label: 'Name',
            type: 'text',
            placeholder: 'Enter your name',
            required: true
          },
          {
            id: 'field-email',
            label: 'Email',
            type: 'email',
            placeholder: 'Enter your email',
            required: true
          }
        ]);
      }
    }

    if (!config.feedbackOptions) {
      onChange('feedbackOptions', [
        {
          id: 'feedback-helpful',
          type: 'thumbs',
          question: 'Was this helpful?',
          required: true
        }
      ]);
    }

    if (config.preChatFormTitle === undefined) {
      onChange('preChatFormTitle', 'Before we start chatting...');
    }

    if (config.preChatFormSubtitle === undefined) {
      onChange('preChatFormSubtitle', 'Please provide the following information:');
    }
  }, []);

  // Handle pre-chat field updates
  const addPreChatField = () => {
    const newField: PreChatField = {
      id: `field-${Date.now()}`,
      label: 'New Field',
      type: 'text',
      placeholder: 'Enter value',
      required: false
    };

    const updatedFields = [...(config.preChatFormFields || []), newField];
    onChange('preChatFormFields', updatedFields);
    setActivePreChatField(newField.id);
  };

  const updatePreChatField = (id: string, field: Partial<PreChatField>) => {
    const updatedFields = config.preChatFormFields.map(f =>
      f.id === id ? { ...f, ...field } : f
    );
    onChange('preChatFormFields', updatedFields);
  };

  const removePreChatField = (id: string) => {
    const updatedFields = config.preChatFormFields.filter(f => f.id !== id);
    onChange('preChatFormFields', updatedFields);
    if (activePreChatField === id) {
      setActivePreChatField(null);
    }
  };

  // Handle feedback option updates
  const addFeedbackOption = () => {
    const newOption: FeedbackOption = {
      id: `feedback-${Date.now()}`,
      type: 'thumbs',
      question: 'How was your experience?',
      required: true
    };

    const updatedOptions = [...(config.feedbackOptions || []), newOption];
    onChange('feedbackOptions', updatedOptions);
    setActiveFeedbackOption(newOption.id);
  };

  const updateFeedbackOption = (id: string, option: Partial<FeedbackOption>) => {
    const updatedOptions = config.feedbackOptions.map(o =>
      o.id === id ? { ...o, ...option } : o
    );
    onChange('feedbackOptions', updatedOptions);
  };

  const removeFeedbackOption = (id: string) => {
    const updatedOptions = config.feedbackOptions.filter(o => o.id !== id);
    onChange('feedbackOptions', updatedOptions);
    if (activeFeedbackOption === id) {
      setActiveFeedbackOption(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Chat Content</h3>
        <p className="text-sm text-slate-500 mb-4">Configure messages and content settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Welcome Message</Label>
            <Textarea
              placeholder="Enter welcome message"
              value={config.welcomeMessage}
              onChange={(e) => onChange('welcomeMessage', e.target.value)}
              className="min-h-[100px] bg-background text-foreground border-border placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">First message shown to your visitors</p>
          </div>

          <div>
            <Label className="mb-2 block">Input Placeholder</Label>
            <Input
              placeholder="Enter placeholder text"
              value={config.inputPlaceholder}
              onChange={(e) => onChange('inputPlaceholder', e.target.value)}
              className="bg-background text-foreground border-border placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">Text shown in the chat input field</p>
          </div>

          {/* Pre-Chat Form Section - Enhanced */}
          <Card className="border-muted bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Pre-Chat Form
                </CardTitle>
                <Switch
                  checked={config.enablePreChatForm}
                  onCheckedChange={(checked) => onChange('enablePreChatForm', checked)}
                />
              </div>
            </CardHeader>

            {config.enablePreChatForm && (
              <CardContent className="space-y-4">
                {/* Form Title & Subtitle */}
                <div className="space-y-3">
                  <div>
                    <Label className="mb-1 block text-sm">Form Title</Label>
                    <Input
                      value={config.preChatFormTitle || ''}
                      onChange={(e) => onChange('preChatFormTitle', e.target.value)}
                      placeholder="Enter form title"
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm">Form Subtitle</Label>
                    <Input
                      value={config.preChatFormSubtitle || ''}
                      onChange={(e) => onChange('preChatFormSubtitle', e.target.value)}
                      placeholder="Enter form subtitle"
                      className="bg-background text-foreground"
                    />
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="font-medium">Form Fields</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addPreChatField}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Field
                    </Button>
                  </div>

                  {/* Field List */}
                  <div className="space-y-3 mb-3">
                    {config.preChatFormFields?.map((field) => (
                      <div
                        key={field.id}
                        className={cn(
                          "border rounded-md p-3 transition-all",
                          activePreChatField === field.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-muted-foreground/20"
                        )}
                      >
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setActivePreChatField(
                            activePreChatField === field.id ? null : field.id
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div className="text-muted-foreground">
                              {activePreChatField === field.id ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                            <div className="text-muted-foreground">
                              <GripHorizontal className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{field.label}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="capitalize">{field.type}</span>
                                {field.required && (
                                  <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                                    Required
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                removePreChatField(field.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>

                        {/* Field Editor */}
                        {activePreChatField === field.id && (
                          <div
                            className="mt-3 pt-3 border-t space-y-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="mb-1 block text-xs">Field Label</Label>
                                <Input
                                  value={field.label}
                                  onChange={(e) => updatePreChatField(field.id, { label: e.target.value })}
                                  placeholder="Field Label"
                                  className="h-8 text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div>
                                <Label className="mb-1 block text-xs">Field Type</Label>
                                <Select
                                  value={field.type}
                                  onValueChange={(value) => updatePreChatField(field.id, { type: value })}
                                >
                                  <SelectTrigger
                                    className="h-8 text-sm"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="tel">Phone</SelectItem>
                                    <SelectItem value="textarea">Textarea</SelectItem>
                                    <SelectItem value="select">Dropdown</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label className="mb-1 block text-xs">Placeholder</Label>
                              <Input
                                value={field.placeholder}
                                onChange={(e) => updatePreChatField(field.id, { placeholder: e.target.value })}
                                placeholder="Placeholder text"
                                className="h-8 text-sm"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            {field.type === 'select' && (
                              <div>
                                <Label className="mb-1 block text-xs">Options (comma separated)</Label>
                                <Input
                                  value={field.options?.join(', ') || ''}
                                  onChange={(e) => updatePreChatField(field.id, {
                                    options: e.target.value.split(',').map(o => o.trim()).filter(Boolean)
                                  })}
                                  placeholder="Option 1, Option 2, Option 3"
                                  className="h-8 text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}

                            <div
                              className="flex items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Checkbox
                                id={`required-${field.id}`}
                                checked={field.required}
                                onCheckedChange={(checked) => updatePreChatField(field.id, { required: !!checked })}
                              />
                              <Label htmlFor={`required-${field.id}`} className="ml-2 text-xs">
                                Required field
                              </Label>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {config.preChatFormFields?.length === 0 && (
                    <div className="border border-dashed rounded-md p-4 text-center text-muted-foreground">
                      <p className="text-sm">No fields added yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addPreChatField}
                        className="mt-2"
                      >
                        Add your first field
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="show-timestamp"
              checked={config.showTimestamps || false}
              onCheckedChange={(checked) => onChange('showTimestamps', checked)}
            />
            <Label htmlFor="show-timestamp">Show message timestamps</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable-attachments"
              checked={config.enableAttachments || false}
              onCheckedChange={(checked) => onChange('enableAttachments', checked)}
            />
            <Label htmlFor="enable-attachments">Allow file attachments</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Bot Name</Label>
            <Input
              placeholder="Enter bot name"
              value={config.botName}
              onChange={(e) => onChange('botName', e.target.value)}
              className="bg-background text-foreground border-border placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">Name displayed for the chat assistant</p>
          </div>

          <div>
            <Label className="mb-2 block">Chat Button Text</Label>
            <Input
              placeholder="Enter button text"
              value={config.chatButtonText}
              onChange={(e) => onChange('chatButtonText', e.target.value)}
              className="bg-background text-foreground border-border placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">Text shown on the chat button</p>
          </div>

          <div>
            <Label className="mb-2 block">Header Title</Label>
            <Input
              placeholder="Enter header title"
              value={config.headerTitle}
              onChange={(e) => onChange('headerTitle', e.target.value)}
              className="bg-background text-foreground border-border placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">Title shown in the chat header</p>
          </div>

          {/* Feedback System - Enhanced */}
          <Card className="border-muted bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  Feedback System
                </CardTitle>
                <Switch
                  checked={config.enableFeedback}
                  onCheckedChange={(checked) => onChange('enableFeedback', checked)}
                />
              </div>
            </CardHeader>

            {config.enableFeedback && (
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm mb-2 block">Feedback Position</Label>
                  <RadioGroup
                    value={config.feedbackPosition}
                    onValueChange={(value) => onChange('feedbackPosition', value)}
                    className="space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="after-bot" id="after-bot" />
                      <Label htmlFor="after-bot" className="text-sm">After bot messages</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="end-chat" id="end-chat" />
                      <Label htmlFor="end-chat" className="text-sm">At end of chat</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="floating" id="floating" />
                      <Label htmlFor="floating" className="text-sm">Floating button</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Feedback Options */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="font-medium">Feedback Questions</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addFeedbackOption}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Question
                    </Button>
                  </div>

                  {/* Feedback Option List */}
                  <div className="space-y-3 mb-3">
                    {config.feedbackOptions?.map((option) => (
                      <div
                        key={option.id}
                        className={cn(
                          "border rounded-md p-3 transition-all",
                          activeFeedbackOption === option.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-muted-foreground/20"
                        )}
                      >
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setActiveFeedbackOption(
                            activeFeedbackOption === option.id ? null : option.id
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div className="text-muted-foreground">
                              {activeFeedbackOption === option.id ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                            <div className="text-muted-foreground">
                              <GripHorizontal className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{option.question}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="capitalize">{option.type} feedback</span>
                                {option.required && (
                                  <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                                    Required
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFeedbackOption(option.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>

                        {/* Feedback Editor */}
                        {activeFeedbackOption === option.id && (
                          <div
                            className="mt-3 pt-3 border-t space-y-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div>
                              <Label className="mb-1 block text-xs">Question</Label>
                              <Input
                                value={option.question}
                                onChange={(e) => updateFeedbackOption(option.id, { question: e.target.value })}
                                placeholder="Feedback question"
                                className="h-8 text-sm"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            <div>
                              <Label className="mb-1 block text-xs">Feedback Type</Label>
                              <Select
                                value={option.type}
                                onValueChange={(value) => updateFeedbackOption(option.id, { type: value })}
                              >
                                <SelectTrigger
                                  className="h-8 text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="thumbs">Thumbs Up/Down</SelectItem>
                                  <SelectItem value="stars">Star Rating</SelectItem>
                                  <SelectItem value="emoji">Emoji Reaction</SelectItem>
                                  <SelectItem value="custom">Custom Options</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {option.type === 'custom' && (
                              <div>
                                <Label className="mb-1 block text-xs">Options (comma separated)</Label>
                                <Input
                                  value={option.options?.join(', ') || ''}
                                  onChange={(e) => updateFeedbackOption(option.id, {
                                    options: e.target.value.split(',').map(o => o.trim()).filter(Boolean)
                                  })}
                                  placeholder="Good, Neutral, Bad"
                                  className="h-8 text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}

                            <div
                              className="flex items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Checkbox
                                id={`required-${option.id}`}
                                checked={option.required}
                                onCheckedChange={(checked) => updateFeedbackOption(option.id, { required: !!checked })}
                              />
                              <Label htmlFor={`required-${option.id}`} className="ml-2 text-xs">
                                Required feedback
                              </Label>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {!config.feedbackOptions?.length && (
                    <div className="border border-dashed rounded-md p-4 text-center text-muted-foreground">
                      <p className="text-sm">No feedback questions added yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addFeedbackOption}
                        className="mt-2"
                      >
                        Add your first question
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="show-avatar"
              checked={config.showAvatar !== false}
              onCheckedChange={(checked) => onChange('showAvatar', checked)}
            />
            <Label htmlFor="show-avatar">Show bot avatar</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="typing-indicator"
              checked={config.showTypingIndicator !== false}
              onCheckedChange={(checked) => onChange('showTypingIndicator', checked)}
            />
            <Label htmlFor="typing-indicator">Show typing indicator</Label>
          </div>
        </div>
      </div>
    </div>
  );
};
