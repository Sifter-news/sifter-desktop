import React, { useState, useEffect } from 'react';
import { useDebug } from '@/contexts/DebugContext';
import { X, Maximize2, Minimize2, Smartphone, Tablet, Monitor, Display, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/components/AuthProvider';
import { useInvestigations } from '@/integrations/supabase/hooks/useInvestigations';
import { useLocation } from 'react-router-dom';
import DebugStateSection from './DebugStateSection';
import DebugPositionSection from './DebugPositionSection';
import DebugHoverSection from './DebugHoverSection';
import DebugToolSection from './sections/DebugToolSection';
import DebugViewSection from './sections/DebugViewSection';
import { Rnd } from 'react-rnd';

const DebugPanel = () => {
  const { isDebugOpen, setIsDebugOpen, debugData, showGuides, setShowGuides, hoveredElement } = useDebug();
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { data: investigations } = useInvestigations({ 
    filter: user ? `owner_id.eq.${user?.id}` : undefined 
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getBreakpointInfo = () => {
    if (windowWidth < 640) return { icon: Smartphone, label: 'Mobile 📱', color: 'text-red-400' };
    if (windowWidth < 768) return { icon: Smartphone, label: 'Mobile (lg) 📱', color: 'text-orange-400' };
    if (windowWidth < 1024) return { icon: Tablet, label: 'Tablet 💻', color: 'text-yellow-400' };
    if (windowWidth < 1280) return { icon: Monitor, label: 'Desktop 🖥️', color: 'text-green-400' };
    return { icon: Display, label: 'Large Desktop 🖥️', color: 'text-blue-400' };
  };

  const breakpoint = getBreakpointInfo();
  const BreakpointIcon = breakpoint.icon;

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
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold">Debug Panel 🛠️</h2>
          </div>
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
      
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BreakpointIcon className={`h-4 w-4 ${breakpoint.color}`} />
              <h3 className={`text-sm font-medium ${breakpoint.color}`}>
                {breakpoint.label} ({windowWidth}px)
              </h3>
            </div>
            <div className="bg-black/50 p-2 rounded text-xs space-y-1">
              <p>sm: 640px 📱</p>
              <p>md: 768px 📱</p>
              <p>lg: 1024px 💻</p>
              <p>xl: 1280px 🖥️</p>
              <p>2xl: 1536px 🖥️</p>
            </div>
          </div>

          <Separator className="bg-white/10" />
          
          <DebugToolSection activeTool={debugData?.activeTool} />
          
          <Separator className="bg-white/10" />
          
          <DebugViewSection 
            currentView={debugData?.currentView}
            viewMode={debugData?.viewMode}
          />

          {hoveredElement && (
            <>
              <DebugHoverSection hoveredElement={hoveredElement} />
              <Separator className="bg-white/10" />
            </>
          )}
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/80">Authentication 🔐</h3>
            <div className="bg-black/50 p-2 rounded">
              <p className="text-xs">Logged in: {user ? '✅' : '❌'}</p>
              {user && (
                <>
                  <p className="text-xs">User ID: {user.id}</p>
                  <p className="text-xs">Email: {user.email}</p>
                </>
              )}
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/80">Current View 🎯</h3>
            <div className="bg-black/50 p-2 rounded">
              <p className="text-xs">Page: {location.pathname}</p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <DebugStateSection debugData={debugData} />
          
          <Separator className="bg-white/10" />
          
          <DebugPositionSection debugData={debugData} />

          {user && (
            <>
              <Separator className="bg-white/10" />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white/80">Projects 📁</h3>
                <div className="bg-black/50 p-2 rounded">
                  {investigations?.length > 0 ? (
                    <ul className="space-y-1">
                      {investigations.map((investigation) => (
                        <li key={investigation.id} className="text-xs">
                          📄 {investigation.title} (ID: {investigation.id})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs">No projects found ❌</p>
                  )}
                </div>
              </div>
            </>
          )}

          {Object.entries(debugData).length > 0 && (
            <>
              <Separator className="bg-white/10" />
              {Object.entries(debugData).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <h3 className="text-sm font-medium text-white/80">{key} 🔍</h3>
                  <pre className="bg-black/50 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              ))}
            </>
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
