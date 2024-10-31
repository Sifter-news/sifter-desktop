import React, { useState } from 'react';
import { useDebug } from '@/contexts/DebugContext';
import { X, Maximize2, Minimize2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/components/AuthProvider';
import { useLocation } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import DebugStateSection from './sections/DebugStateSection';
import DebugPositionSection from './sections/DebugPositionSection';
import DebugFocusSection from './sections/DebugFocusSection';
import DebugErrorSection from './sections/DebugErrorSection';
import DebugHeader from './sections/DebugHeader';
import DebugTestSection from './sections/DebugTestSection'; // Added import for DebugTestSection
import { cn } from '@/lib/utils';

const DebugPanel = () => {
  const { isDebugOpen, setIsDebugOpen, debugData, showGuides, setShowGuides, hoveredElement } = useDebug();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    focus: true,
    state: true,
    position: true,
    errors: true,
    test: true // Added for test section
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isDebugOpen) return null;

  const SectionHeader = ({ title, section, icon: Icon }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center gap-2 w-full p-2 hover:bg-white/5 rounded transition-colors"
    >
      {expandedSections[section] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      {Icon && <Icon className="h-4 w-4 text-purple-400" />}
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
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className={cn("transition-all", expandedSections.focus ? "mb-4" : "mb-0")}>
            <SectionHeader title="Focus Tracking" section="focus" />
            {expandedSections.focus && <DebugFocusSection hoveredElement={hoveredElement} />}
          </div>

          <div className={cn("transition-all", expandedSections.state ? "mb-4" : "mb-0")}>
            <SectionHeader title="State Monitor" section="state" />
            {expandedSections.state && <DebugStateSection debugData={debugData} />}
          </div>

          {/* Add new test section */}
          <div className={cn("transition-all", expandedSections.test ? "mb-4" : "mb-0")}>
            <SectionHeader title="Testing" section="test" />
            {expandedSections.test && (
              <DebugTestSection 
                nodes={debugData?.nodes?.list || []} 
                connections={debugData?.connections || []}
              />
            )}
          </div>

          <div className={cn("transition-all", expandedSections.position ? "mb-4" : "mb-0")}>
            <SectionHeader title="Position & Camera" section="position" />
            {expandedSections.position && <DebugPositionSection debugData={debugData} />}
          </div>

          <div className={cn("transition-all", expandedSections.errors ? "mb-4" : "mb-0")}>
            <SectionHeader title="Error Log" section="errors" />
            {expandedSections.errors && <DebugErrorSection errors={debugData?.errors || []} />}
          </div>
        </div>
      </ScrollArea>
    </div>
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
