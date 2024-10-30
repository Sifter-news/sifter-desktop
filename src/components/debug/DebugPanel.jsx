import React, { useState, useEffect } from 'react';
import { useDebug } from '@/contexts/DebugContext';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/components/AuthProvider';
import { useInvestigations } from '@/integrations/supabase/hooks/useInvestigations';
import DebugStateSection from './DebugStateSection';
import DebugPositionSection from './DebugPositionSection';
import DebugToolSection from './sections/DebugToolSection';
import DebugViewSection from './sections/DebugViewSection';
import DebugHeader from './sections/DebugHeader';
import DebugFocusSection from './sections/DebugFocusSection';
import DebugErrorSection from './sections/DebugErrorSection';
import { Rnd } from 'react-rnd';

const DebugPanel = () => {
  const { isDebugOpen, setIsDebugOpen, debugData, showGuides, setShowGuides, hoveredElement } = useDebug();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 384, height: 500 });
  const { data: investigations } = useInvestigations({ 
    filter: user ? `owner_id.eq.${user?.id}` : undefined 
  });

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
    <div className="flex flex-col h-full">
      <DebugHeader 
        showGuides={showGuides}
        setShowGuides={setShowGuides}
        onCollapse={() => setIsCollapsed(true)}
        onClose={() => setIsDebugOpen(false)}
      />
      
      <DebugFocusSection hoveredElement={hoveredElement} />
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <DebugToolSection activeTool={debugData?.activeTool} />
          <Separator className="bg-white/10" />
          <DebugViewSection currentView={debugData?.currentView} viewMode={debugData?.viewMode} />
          <Separator className="bg-white/10" />
          <DebugStateSection debugData={debugData} />
          <Separator className="bg-white/10" />
          <DebugPositionSection debugData={debugData} />
          <Separator className="bg-white/10" />
          <DebugErrorSection errors={debugData?.errors || []} />

          {user && investigations?.length > 0 && (
            <>
              <Separator className="bg-white/10" />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white/80">Projects 📁</h3>
                <div className="bg-black/50 p-2 rounded">
                  <ul className="space-y-1">
                    {investigations.map((investigation) => (
                      <li key={investigation.id} className="text-xs">
                        📄 {investigation.title} (ID: {investigation.id})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <Rnd
      default={{
        x: window.innerWidth - 400,
        y: 16,
        width: isCollapsed ? 40 : dimensions.width,
        height: isCollapsed ? 40 : dimensions.height,
      }}
      minWidth={isCollapsed ? 40 : 300}
      minHeight={isCollapsed ? 40 : 200}
      bounds="window"
      enableResizing={!isCollapsed}
      style={{ zIndex: 99999 }}
      onResize={(e, direction, ref) => {
        setDimensions({
          width: ref.offsetWidth,
          height: ref.offsetHeight
        });
      }}
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