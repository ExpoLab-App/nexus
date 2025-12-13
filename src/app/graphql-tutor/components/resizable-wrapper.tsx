"use client";

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TutorPanel } from "./tutor-panel";
import { Loader2 } from "lucide-react";

interface ResizableWrapperProps {
  query: string;
  setQuery: (query: string) => void;
  analysis: any;
  loading: boolean;
  handleAnalyze: () => void;
}

export default function ResizableWrapper({
  query,
  setQuery,
  analysis,
  loading,
  handleAnalyze,
}: ResizableWrapperProps) {
  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      <ResizablePanel defaultSize={50} minSize={30}>
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>GraphQL Query Editor</CardTitle>
            <CardDescription>
              Write and analyze your ResilientDB GraphQL queries
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Enter your GraphQL query, e.g., { getTransaction(id: "123") { asset } }'
              className="flex-1 w-full p-4 border rounded-md font-mono text-sm resize-none"
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading || !query.trim()}
              className="mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Query"
              )}
            </Button>
          </CardContent>
        </Card>
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={50} minSize={30}>
        <TutorPanel analysis={analysis} loading={loading} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

