import React from 'react';
import { useDebug } from '@/contexts/DebugContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';

const DebugPanel = () => {
  const { isDebugOpen, setIsDebugOpen, debugData, showNodeDebug, setShowNodeDebug } = useDebug();
  const location = useLocation();
  const { session } = useSupabaseAuth();
  
  if (!isDebugOpen) return null;

  const routes = [
    { path: '/', name: 'Home' },
    { path: '/login', name: 'Login' },
    { path: '/project/:id', name: 'Project View' },
    { path: '/:username/project/:projectName', name: 'Public Project Page' },
    { path: '/subscription-plans', name: 'Subscription Plans' },
    { path: '/auth/callback', name: 'Auth Callback' }
  ];

  const authInfo = {
    isAuthenticated: !!session,
    userId: session?.user?.id || null,
    userEmail: session?.user?.email || null,
    lastSignInAt: session?.user?.last_sign_in_at || null,
    provider: session?.user?.app_metadata?.provider || null
  };

  const debugSections = {
    routing: {
      currentPath: location.pathname,
      availableRoutes: routes,
      params: location.search,
      hash: location.hash
    },
    auth: authInfo,
    errors: debugData.errors || [],
    ...debugData
  };

  return (
    <div className="fixed top-4 right-4 w-96 bg-black/90 text-white rounded-lg shadow-xl z-[9999] backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Debug Panel</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={showNodeDebug}
              onCheckedChange={setShowNodeDebug}
              className="data-[state=checked]:bg-green-500"
            />
            <span className="text-sm">Show Node Debug</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDebugOpen(false)}
            className="text-white hover:text-white/80"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[500px] p-4">
        <div className="space-y-4">
          {Object.entries(debugSections).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <h3 className="text-sm font-medium text-white/80 capitalize">{key}</h3>
              {key === 'errors' && Array.isArray(value) && value.length === 0 ? (
                <p className="text-green-400 text-xs">No errors reported</p>
              ) : (
                <pre className="bg-black/50 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(value, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DebugPanel;