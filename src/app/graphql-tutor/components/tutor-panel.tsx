"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExplanationPanel } from "./explanation-panel";
import { EfficiencyDisplay } from "./efficiency-display";
import { Loader2 } from "lucide-react";

interface TutorPanelProps {
  analysis: any;
  loading: boolean;
}

export function TutorPanel({ analysis, loading }: TutorPanelProps) {
  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">
          Enter a query and click &quot;Analyze Query&quot; to get started
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>AI Tutor</CardTitle>
        <p className="text-sm text-muted-foreground">
          Get explanations and efficiency analysis
        </p>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <Tabs defaultValue="explanation" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          </TabsList>
          <TabsContent value="explanation" className="mt-4">
            <ExplanationPanel explanation={analysis.explanation} />
          </TabsContent>
          <TabsContent value="efficiency" className="mt-4">
            <EfficiencyDisplay efficiency={analysis.efficiency} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

