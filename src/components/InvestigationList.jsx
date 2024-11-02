import React, { useState } from 'react';
import InvestigationCard from './InvestigationCard';
import ReportCard from './ReportCard';
import ReportEditModal from './modals/ModalEdit_Report';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const InvestigationList = ({ 
  investigations, 
  onProjectClick, 
  onEditProject, 
  onDeleteProject,
  onUpdateInvestigation 
}) => {
  const [editingReport, setEditingReport] = useState(null);

  const sortedInvestigations = [...(investigations || [])].sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at);
    const dateB = new Date(b.updated_at || b.created_at);
    return dateB - dateA;
  });

  const handleReportUpdate = (investigation, updatedReport) => {
    const updatedReports = investigation.reports.map(r =>
      r.id === updatedReport.id ? updatedReport : r
    );
    onUpdateInvestigation({
      ...investigation,
      reports: updatedReports
    });
    setEditingReport(null);
  };

  const handleReportDelete = (investigation, reportId) => {
    const updatedReports = investigation.reports.filter(r => r.id !== reportId);
    onUpdateInvestigation({
      ...investigation,
      reports: updatedReports
    });
    setEditingReport(null);
  };

  return (
    <div className="flex-grow overflow-y-auto scrollbar-hide">
      <div className="flex flex-col space-y-6">
        {sortedInvestigations.map((investigation) => (
          <div key={investigation.id} className="flex flex-col lg:flex-row w-full">
            <div className="w-full lg:w-1/2 flex-shrink-0 relative">
              <div onClick={() => onProjectClick(investigation)}>
                <InvestigationCard 
                  investigation={investigation} 
                  onUpdateInvestigation={onUpdateInvestigation}
                />
              </div>
              <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onEditProject(investigation)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => onDeleteProject(investigation.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex-shrink-0">
              <div className="bg-white bg-opacity-30 rounded-r-lg h-full relative overflow-hidden">
                <div className="overflow-x-auto h-full scrollbar-hide p-4">
                  <div className="flex space-x-4 h-full">
                    {investigation.reports?.map(report => (
                      <div key={report.id} className="w-64 flex-shrink-0">
                        <ReportCard 
                          report={report} 
                          onUpdate={() => setEditingReport({ report, investigation })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
                <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingReport && (
        <ReportEditModal
          isOpen={!!editingReport}
          onClose={() => setEditingReport(null)}
          report={editingReport.report}
          onUpdate={(updatedReport) => handleReportUpdate(editingReport.investigation, updatedReport)}
          onDelete={(reportId) => handleReportDelete(editingReport.investigation, reportId)}
        />
      )}
    </div>
  );
};

export default InvestigationList;