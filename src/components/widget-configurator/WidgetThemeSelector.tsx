import React from 'react';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeOption {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}

interface WidgetThemeSelectorProps {
    selectedTheme: string;
    onThemeChange: (theme: string) => void;
}

const predefinedThemes: ThemeOption[] = [
    {
        name: 'Modern Blue',
        primary: '#3b82f6',
        secondary: '#1d4ed8',
        accent: '#60a5fa',
        background: '#ffffff',
        text: '#1e293b'
    },
    {
        name: 'Sleek Dark',
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#818cf8',
        background: '#1e1e2e',
        text: '#f8fafc'
    },
    {
        name: 'Forest Green',
        primary: '#10b981',
        secondary: '#059669',
        accent: '#34d399',
        background: '#f8fafc',
        text: '#1e293b'
    },
    {
        name: 'Sunset Orange',
        primary: '#f97316',
        secondary: '#ea580c',
        accent: '#fb923c',
        background: '#ffffff',
        text: '#1e293b'
    },
    {
        name: 'Royal Purple',
        primary: '#8b5cf6',
        secondary: '#7c3aed',
        accent: '#a78bfa',
        background: '#ffffff',
        text: '#1e293b'
    },
    {
        name: 'Midnight',
        primary: '#3b82f6',
        secondary: '#1d4ed8',
        accent: '#60a5fa',
        background: '#0f172a',
        text: '#f8fafc'
    },
    {
        name: 'Coral',
        primary: '#f43f5e',
        secondary: '#e11d48',
        accent: '#fb7185',
        background: '#ffffff',
        text: '#1e293b'
    },
    {
        name: 'Teal',
        primary: '#14b8a6',
        secondary: '#0d9488',
        accent: '#2dd4bf',
        background: '#f8fafc',
        text: '#1e293b'
    }
];

const WidgetThemeSelector: React.FC<WidgetThemeSelectorProps> = ({
    selectedTheme,
    onThemeChange
}) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Select Theme</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {predefinedThemes.map((theme) => (
                    <div
                        key={theme.name}
                        className={cn(
                            "flex flex-col gap-2 rounded-md border p-3 cursor-pointer transition-all hover:border-primary",
                            selectedTheme === theme.name ? "border-primary ring-1 ring-primary" : "border-border"
                        )}
                        onClick={() => onThemeChange(theme.name)}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">{theme.name}</span>
                            {selectedTheme === theme.name && (
                                <Check className="h-3.5 w-3.5 text-primary" />
                            )}
                        </div>
                        <div className="flex gap-1.5">
                            <div
                                className="h-4 w-4 rounded-full"
                                style={{ backgroundColor: theme.primary }}
                                title="Primary color"
                            />
                            <div
                                className="h-4 w-4 rounded-full"
                                style={{ backgroundColor: theme.secondary }}
                                title="Secondary color"
                            />
                            <div
                                className="h-4 w-4 rounded-full"
                                style={{ backgroundColor: theme.accent }}
                                title="Accent color"
                            />
                        </div>
                        <div
                            className="mt-1 h-6 rounded flex items-center justify-center text-[10px] font-medium"
                            style={{
                                backgroundColor: theme.background,
                                color: theme.text,
                                border: theme.background === '#ffffff' ? '1px solid #e2e8f0' : 'none'
                            }}
                        >
                            Preview Text
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WidgetThemeSelector;
