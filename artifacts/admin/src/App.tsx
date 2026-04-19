import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Skills from "@/pages/Skills";
import Experience from "@/pages/Experience";
import Education from "@/pages/Education";
import Interests from "@/pages/Interests";
import Goals from "@/pages/Goals";
import Contact from "@/pages/Contact";

const queryClient = new QueryClient();

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
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
