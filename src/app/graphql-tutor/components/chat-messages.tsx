"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExplanationPanel } from "./explanation-panel";
import { EfficiencyDisplay } from "./efficiency-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bot } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  query?: string;
  analysis?: any;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <Bot className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            Start a conversation by sending a GraphQL query
          </p>
          <p className="text-sm text-muted-foreground">
            I&apos;ll help you understand, optimize, and analyze your queries
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "assistant" && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
          )}
          
          <div
            className={`flex flex-col gap-2 max-w-[80%] ${
              message.role === "user" ? "items-end" : "items-start"
            }`}
          >
            {message.role === "user" && message.query && (
              <Card className="p-4 bg-muted">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-2">Your Query</p>
                    <pre className="text-xs font-mono bg-background p-3 rounded overflow-x-auto">
                      {message.query}
                    </pre>
                  </div>
                </div>
              </Card>
            )}

            {message.role === "assistant" && message.analysis && (
              <Card className="p-4 w-full">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold">AI Analysis</p>
                    {message.analysis.explanation?.complexity && (
                      <Badge
                        variant={
                          message.analysis.explanation.complexity === "low"
                            ? "default"
                            : message.analysis.explanation.complexity === "medium"
                            ? "secondary"
                            : "destructive"
                        }
                        className="ml-auto"
                      >
                        {message.analysis.explanation.complexity} complexity
                      </Badge>
                    )}
                  </div>

                  <Tabs defaultValue="explanation" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="explanation">Explanation</TabsTrigger>
                      <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
                    </TabsList>
                    <TabsContent value="explanation" className="mt-4">
                      <ExplanationPanel
                        explanation={message.analysis.explanation}
                      />
                    </TabsContent>
                    <TabsContent value="efficiency" className="mt-4">
                      <EfficiencyDisplay
                        efficiency={message.analysis.efficiency}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </Card>
            )}
          </div>

          {message.role === "user" && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

