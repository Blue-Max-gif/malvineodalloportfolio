import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Layout from "@/components/Layout";
import AuthGuard from "@/components/AuthGuard";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Skills from "@/pages/Skills";
import Experience from "@/pages/Experience";
import Education from "@/pages/Education";
import Interests from "@/pages/Interests";
import Goals from "@/pages/Goals";
import Contact from "@/pages/Contact";
import Highlights from "@/pages/Highlights";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Layout>
          <Home />
        </Layout>
      </Route>
      <Route path="/profile">
        <Layout>
          <Profile />
        </Layout>
      </Route>
      <Route path="/skills">
        <Layout>
          <Skills />
        </Layout>
      </Route>
      <Route path="/experience">
        <Layout>
          <Experience />
        </Layout>
      </Route>
      <Route path="/education">
        <Layout>
          <Education />
        </Layout>
      </Route>
      <Route path="/interests">
        <Layout>
          <Interests />
        </Layout>
      </Route>
      <Route path="/goals">
        <Layout>
          <Goals />
        </Layout>
      </Route>
      <Route path="/contact">
        <Layout>
          <Contact />
        </Layout>
      </Route>
      <Route path="/highlights">
        <Layout>
          <Highlights />
        </Layout>
      </Route>
      <Route path="/messages">
        <Layout>
          <Messages />
        </Layout>
      </Route>
      <Route path="/settings">
        <Layout>
          <Settings />
        </Layout>
      </Route>
      <Route>
        <Layout>
          <NotFound />
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthGuard>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthGuard>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
