"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface EfficiencyDisplayProps {
  efficiency: any;
}

export function EfficiencyDisplay({ efficiency }: EfficiencyDisplayProps) {
  if (!efficiency) {
    return <p className="text-muted-foreground">No efficiency data available</p>;
  }

  const score = efficiency.score || 0;
  const scoreColor = score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Efficiency Score</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Overall Efficiency</span>
            <span className={`text-2xl font-bold ${scoreColor}`}>{score}/100</span>
          </div>
          <Progress value={score} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Estimated Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{efficiency.estimatedTime || "Unknown"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Resource Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{efficiency.resourceUsage || "Unknown"}</p>
          </CardContent>
        </Card>
      </div>

      {efficiency.complexity && (
        <div>
          <h4 className="text-md font-semibold mb-2">Complexity</h4>
          <Badge variant={
            efficiency.complexity === "low" ? "default" :
            efficiency.complexity === "medium" ? "secondary" : "destructive"
          }>
            {efficiency.complexity}
          </Badge>
        </div>
      )}

      {efficiency.recommendations && efficiency.recommendations.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2">Recommendations</h4>
          <ul className="list-disc list-inside space-y-1">
            {efficiency.recommendations.map((rec: string, idx: number) => (
              <li key={idx} className="text-sm">{rec}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            const reslensUrl = process.env.NEXT_PUBLIC_RESLENS_URL || "http://localhost:5173";
            window.open(`${reslensUrl}/query-stats`, "_blank");
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Query Stats in ResLens
        </Button>
      </div>
    </div>
  );
}

