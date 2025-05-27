
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, X, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  value,
  onChange,
  label = "Avatar/Logo",
  className,
}) => {
  const [urlInput, setUrlInput] = useState(value || "");
  const [uploadTab, setUploadTab] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium">{label}</Label>
      
      {value ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={value}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-border"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={handleRemove}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Avatar uploaded successfully
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUploadTab("upload")}
                  className="mt-2"
                >
                  Change Avatar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <Tabs value={uploadTab} onValueChange={(value) => setUploadTab(value as "upload" | "url")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  From URL
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4 space-y-3">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload an avatar or logo image
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports JPG, PNG, GIF up to 5MB
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="url" className="mt-4 space-y-3">
                <div className="space-y-3">
                  <Input
                    placeholder="https://example.com/avatar.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <Button
                    onClick={handleUrlSubmit}
                    disabled={!urlInput.trim()}
                    className="w-full flex items-center gap-2"
                  >
                    <Link className="h-4 w-4" />
                    Use URL
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AvatarUpload;
