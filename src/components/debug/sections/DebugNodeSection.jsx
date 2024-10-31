import React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

const DebugNodeSection = ({ nodes }) => {
  if (!nodes?.list?.length) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/80">Node Information</h3>
      <div className="bg-black/50 rounded">
        {nodes.list.map((node, index) => (
          <Collapsible key={node.id} className="px-2 py-1 border-b border-white/10 last:border-0">
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-1">
              <span className="text-xs font-medium text-white/90">
                Node {index + 1}: {node.title || 'Untitled'}
              </span>
              <ChevronDown className="h-4 w-4 text-white/60" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ScrollArea className="h-[200px] mt-2">
                <div className="space-y-2 pl-4 pb-2">
                  <div className="space-y-1">
                    <p className="text-xs text-white/60">Basic Information</p>
                    <div className="pl-2 space-y-0.5 text-xs">
                      <p>ID: <span className="text-blue-400">{node.id}</span></p>
                      <p>Type: <span className="text-purple-400">{node.nodeType || 'generic'}</span></p>
                      <p>Style: <span className="text-green-400">{node.visualStyle || 'default'}</span></p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-white/60">Content</p>
                    <div className="pl-2 space-y-0.5 text-xs">
                      <p>Title: <span className="text-yellow-400">{node.title || 'Untitled'}</span></p>
                      <p>Description: <span className="text-yellow-400">{node.description || 'No description'}</span></p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-white/60">Position</p>
                    <div className="pl-2 space-y-0.5 text-xs">
                      <p>X: <span className="text-red-400">{node.position?.[0] || node.x || 0}</span></p>
                      <p>Y: <span className="text-green-400">{node.position?.[1] || node.y || 0}</span></p>
                      <p>Z: <span className="text-blue-400">{node.position?.[2] || node.z || 0}</span></p>
                    </div>
                  </div>

                  {node.metadata && (
                    <div className="space-y-1">
                      <p className="text-xs text-white/60">Metadata</p>
                      <pre className="pl-2 text-xs whitespace-pre-wrap text-cyan-400">
                        {JSON.stringify(node.metadata, null, 2)}
                      </pre>
                    </div>
                  )}

                  {node.connections?.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-white/60">Connections</p>
                      <div className="pl-2 space-y-0.5 text-xs">
                        {node.connections.map((conn, i) => (
                          <p key={i}>
                            → <span className="text-purple-400">{conn.targetId}</span>
                            {conn.type && <span className="text-blue-400"> ({conn.type})</span>}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default DebugNodeSection;