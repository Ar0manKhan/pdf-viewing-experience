import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertTriangle } from "lucide-react";

interface ErrorCardProps {
  title?: string;
  message: string;
  backTo?: string;
  backLabel?: string;
}

export function ErrorCard({
  title = "Error",
  message,
  backTo = "/",
  backLabel = "Go Back",
}: ErrorCardProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-destructive">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{message}</p>
          <Link to={backTo}>
            <Button>{backLabel}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
