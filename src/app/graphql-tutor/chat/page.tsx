"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessages } from "../components/chat-messages";
import { Loader2, Send } from "lucide-react";

// Polyfill localStorage for SSR
if (typeof window === "undefined") {
  (global as any).localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  };
}

interface Message {
  id: string;
  role: "user" | "assistant";
  query?: string;
  analysis?: any;
  timestamp: Date;
}

export default function GraphQLTutorChatPage() {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
    // Load messages from localStorage
    const savedMessages = localStorage.getItem("graphql-tutor-messages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      } catch (e) {
        console.error("Error loading messages:", e);
      }
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;

    const userQuery = query.trim();
    setQuery("");
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      query: userQuery,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/graphql-tutor/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });

      const analysis = await response.json();

      // Add assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        analysis,
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      
      // Save to localStorage
      localStorage.setItem(
        "graphql-tutor-messages",
        JSON.stringify(updatedMessages)
      );
    } catch (error) {
      console.error("Error analyzing query:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        analysis: {
          explanation: {
            explanation: "Sorry, I encountered an error analyzing your query. Please try again.",
            complexity: "unknown",
            recommendations: [],
          },
          optimizations: [],
          efficiency: {
            score: 0,
            estimatedTime: "Unknown",
            resourceUsage: "Unknown",
            recommendations: [],
            complexity: "unknown",
          },
        },
        timestamp: new Date(),
      };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
    } finally {
      setLoading(false);
      // Focus back on textarea
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem("graphql-tutor-messages");
  };

  if (!mounted) {
    return (
      <div className="container mx-auto p-6 h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 h-screen flex flex-col max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GraphQL Query Tutor (Chat)</h1>
          <p className="text-muted-foreground">
            Chat with AI to get explanations, optimizations, and efficiency analysis for your GraphQL queries
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            Clear Chat
          </Button>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-col">
          <ChatMessages messages={messages} />
          {loading && (
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Analyzing query...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Enter your GraphQL query, e.g., { getTransaction(id: "123") { asset } }'
              className="min-h-[80px] max-h-[200px] font-mono text-sm resize-none"
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={loading || !query.trim()}
              size="lg"
              className="px-6"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  );
}

