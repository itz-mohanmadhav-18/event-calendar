import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { storageService } from '@/services/storageService';
import { Trash2, Download, Upload } from 'lucide-react';

interface Settings {
  defaultView: 'month' | 'week' | 'day';
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
}

const defaultSettings: Settings = {
  defaultView: 'month',
  weekStartsOn: 0,
  theme: 'system',
  notifications: true,
};

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useLocalStorage('calendar-settings', defaultSettings);
  const [isClearing, setIsClearing] = React.useState(false);

  const handleSettingChange = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleClearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all calendar data? This action cannot be undone.')) {
      try {
        setIsClearing(true);
        await storageService.clearAllEvents();
        alert('All calendar data has been cleared.');
      } catch {
        alert('Failed to clear data. Please try again.');
      } finally {
        setIsClearing(false);
      }
    }
  };

  const handleExportData = async () => {
    try {
      const events = await storageService.getEvents();
      const dataStr = JSON.stringify(events, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'calendar-events.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export data. Please try again.');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = e.target?.result as string;
        const events = JSON.parse(jsonData);
        
        if (Array.isArray(events)) {
          await storageService.saveEvents(events);
          alert('Data imported successfully!');
          window.location.reload();
        } else {
          alert('Invalid file format. Please select a valid calendar export file.');
        }
      } catch {
        alert('Failed to import data. Please check the file format and try again.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* View Preferences */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">View Preferences</Label>
            
            <div className="space-y-2">
              <Label htmlFor="defaultView">Default Calendar View</Label>
              <select
                id="defaultView"
                value={settings.defaultView}
                onChange={(e) => handleSettingChange('defaultView', e.target.value as Settings['defaultView'])}
                className="w-full p-2 border border-border rounded-md"
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekStartsOn">Week Starts On</Label>
              <select
                id="weekStartsOn"
                value={settings.weekStartsOn}
                onChange={(e) => handleSettingChange('weekStartsOn', parseInt(e.target.value) as Settings['weekStartsOn'])}
                className="w-full p-2 border border-border rounded-md"
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
              </select>
            </div>
          </div>

          <Separator />

          {/* Data Management */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Data Management</Label>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExportData}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-file')?.click()}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </div>
            
            <Button
              variant="destructive"
              onClick={handleClearAllData}
              disabled={isClearing}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isClearing ? 'Clearing...' : 'Clear All Data'}
            </Button>
          </div>

          <Separator />

          {/* About */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">About</Label>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Event Calendar v1.0.0</p>
              <p>A simple and powerful calendar application for managing your events.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
