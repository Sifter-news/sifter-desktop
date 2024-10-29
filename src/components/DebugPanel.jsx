import React, { useState } from 'react';
import { useDebug } from '@/contexts/DebugContext';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/components/AuthProvider';
import { useInvestigations } from '@/integrations/supabase/hooks/useInvestigations';
import { useLocation } from 'react-router-dom';
import DebugStateSection from './debug/DebugStateSection';
import DebugPositionSection from './debug/DebugPositionSection';
import DebugHoverSection from './debug/DebugHoverSection';
import { Rnd } from 'react-rnd';

const DebugPanel = () => {
  const { isDebugOpen, setIsDebugOpen, debugData, showGuides, setShowGuides, hoveredElement } = useDebug();
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: investigations } = useInvestigations({ 
    filter: user ? `owner_id.eq.${user?.id}` : undefined 
  });

  const getCurrentView = () => {
    const pathname = location.pathname;
    if (pathname === '/') return 'Home';
    if (pathname.startsWith('/project/')) return 'Project View';
    if (pathname === '/login') return 'Login';
    if (pathname === '/new-project') return 'New Project';
    if (pathname === '/subscription-plans') return 'Subscription Plans';
    return pathname.split('/').pop() || 'Unknown';
  };

  if (!isDebugOpen) return null;

  const panelContent = isCollapsed ? (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsCollapsed(false)}
      className="text-white hover:text-white/80 p-2"
    >
      <Maximize2 className="h-4 w-4" />
    </Button>
  ) : (
    <>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Debug Panel</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">Guidelines</span>
            <Switch
              checked={showGuides}
              onCheckedChange={setShowGuides}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="text-white hover:text-white/80"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
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
          <DebugHoverSection hoveredElement={hoveredElement} />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/80">Authentication</h3>
            <div className="bg-black/50 p-2 rounded">
              <p className="text-xs">Logged in: {user ? 'Yes' : 'No'}</p>
              {user && (
                <>
                  <p className="text-xs">User ID: {user.id}</p>
                  <p className="text-xs">Email: {user.email}</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/80">Current View</h3>
            <div className="bg-black/50 p-2 rounded">
              <p className="text-xs">Page: {getCurrentView()}</p>
            </div>
          </div>

          <DebugStateSection debugData={debugData} />
          <DebugPositionSection debugData={debugData} />

          {user && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white/80">Projects</h3>
              <div className="bg-black/50 p-2 rounded">
                {investigations?.length > 0 ? (
                  <ul className="space-y-1">
                    {investigations.map((investigation) => (
                      <li key={investigation.id} className="text-xs">
                        {investigation.title} (ID: {investigation.id})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs">No projects found</p>
                )}
              </div>
            </div>
          )}

          {Object.entries(debugData).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <h3 className="text-sm font-medium text-white/80">{key}</h3>
              <pre className="bg-black/50 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
          {Object.keys(debugData).length === 0 && (
            <p className="text-white/60 text-sm">No debug data available</p>
          )}
        </div>
      </ScrollArea>
    </>
  );

  return (
    <Rnd
      default={{
        x: window.innerWidth - 400,
        y: 16,
        width: isCollapsed ? 40 : 384,
        height: isCollapsed ? 40 : 'auto',
      }}
      minWidth={isCollapsed ? 40 : 384}
      minHeight={isCollapsed ? 40 : 200}
      bounds="window"
      enableResizing={!isCollapsed}
      style={{ zIndex: 99999 }}
    >
      <div className={`bg-black/90 text-white rounded-lg shadow-xl backdrop-blur-sm border border-white/20 ${
        isCollapsed ? 'w-10 h-10' : 'w-full h-full'
      }`}>
        {panelContent}
      </div>
    </Rnd>
  );
};

export default DebugPanel;