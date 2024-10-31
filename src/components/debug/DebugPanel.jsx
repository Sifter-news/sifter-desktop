import React, { useState } from 'react';
import { useDebug } from '@/contexts/DebugContext';
import { Maximize2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/components/AuthProvider';
import { useInvestigations } from '@/integrations/supabase/hooks/useInvestigations';
import DebugStateSection from './sections/DebugStateSection';
import DebugPositionSection from './sections/DebugPositionSection';
import DebugToolSection from './sections/DebugToolSection';
import DebugViewSection from './sections/DebugViewSection';
import DebugHeader from './sections/DebugHeader';
import DebugFocusSection from './sections/DebugFocusSection';
import DebugErrorSection from './sections/DebugErrorSection';
import DebugVariableSection from './sections/DebugVariableSection';
import DebugNodeSection from './sections/DebugNodeSection';
import { Rnd } from 'react-rnd';
import { cn } from '@/lib/utils';

const DebugPanel = () => {
  const { isDebugOpen, setIsDebugOpen, debugData, showGuides, setShowGuides, hoveredElement } = useDebug();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 384, height: 500 });
  const [expandedSections, setExpandedSections] = useState({
    focus: true,
    nodes: true,
    state: true,
    position: true,
    errors: true
  });

  const { data: investigations } = useInvestigations({ 
    filter: user ? `owner_id.eq.${user?.id}` : undefined 
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isDebugOpen) return null;

  const SectionHeader = ({ title, section }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center gap-2 w-full p-2 hover:bg-white/5 rounded transition-colors"
    >
      {expandedSections[section] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      <span className="text-sm font-medium">{title}</span>
    </button>
  );

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
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className={cn("transition-all", expandedSections.focus ? "mb-4" : "mb-0")}>
            <SectionHeader title="Focus Tracking" section="focus" />
            {expandedSections.focus && <DebugFocusSection hoveredElement={hoveredElement} />}
          </div>

          <Separator className="bg-white/10" />

          <div className={cn("transition-all", expandedSections.nodes ? "mb-4" : "mb-0")}>
            <SectionHeader title="Node Information" section="nodes" />
            {expandedSections.nodes && <DebugNodeSection nodes={debugData?.nodes} />}
          </div>

          <Separator className="bg-white/10" />

          <div className={cn("transition-all", expandedSections.state ? "mb-4" : "mb-0")}>
            <SectionHeader title="State Monitor" section="state" />
            {expandedSections.state && <DebugStateSection debugData={debugData} />}
          </div>

          <Separator className="bg-white/10" />

          <div className={cn("transition-all", expandedSections.position ? "mb-4" : "mb-0")}>
            <SectionHeader title="Position & Camera" section="position" />
            {expandedSections.position && <DebugPositionSection debugData={debugData} />}
          </div>

          <Separator className="bg-white/10" />

          <div className={cn("transition-all", expandedSections.errors ? "mb-4" : "mb-0")}>
            <SectionHeader title="Error Log" section="errors" />
            {expandedSections.errors && <DebugErrorSection errors={debugData?.errors || []} />}
          </div>

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