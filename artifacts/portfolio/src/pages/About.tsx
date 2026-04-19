import { PageTransition } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">About Me</h1>
        
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-8">
            <p className="text-lg leading-relaxed text-muted-foreground">
              I am a passionate and results-driven student leader committed to community empowerment, youth development, and impactful leadership. Currently pursuing BSc Forensic Science at Kirinyaga University, I actively contribute to society through strategic leadership, mentorship, and community development programs.
              <br /><br />
              As CEO of Uplift Society, I lead initiatives that uplift communities through skills development, mentorship, and resource mobilization.
              <br /><br />
              As Organizing Secretary of NUSA (Nyakach University Students Association), I coordinate student activities and advocate for student welfare.
              <br /><br />
              My vision is to become a transformative leader who creates meaningful change at the community and national level.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
