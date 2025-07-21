import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

type AboutCardProps = {
  bio: string;
};

export function AboutCard({ bio }: AboutCardProps) {
  return (
    <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 bg-card/80">
        <User className="h-6 w-6 text-primary" />
        <CardTitle className="font-headline text-2xl">About Me</CardTitle>
      </CardHeader>
      <CardContent className="p-6 text-base leading-relaxed text-foreground/90">
        <p>{bio}</p>
      </CardContent>
    </Card>
  );
}
