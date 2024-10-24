import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const InvestigationCard = ({ investigation }) => {
  return (
    <Link to={`/project/${investigation.id}`} className="block w-full">
      <Card className="w-full h-full hover:shadow-lg transition-shadow duration-200 bg-gray-100 dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">
                Investigation
              </Badge>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {investigation.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {investigation.description}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Reports ({investigation.reports?.length || 0})
            </div>
            <div className="flex flex-wrap gap-2">
              {investigation.reports?.slice(0, 3).map((report) => (
                <Badge key={report.id} variant="outline" className="text-xs">
                  {report.title}
                </Badge>
              ))}
              {investigation.reports?.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{investigation.reports.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default InvestigationCard;