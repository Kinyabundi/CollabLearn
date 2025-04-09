import Web3Btn from "@/components/btns/Web3Btn";
import { useWeb3Context } from "@/context/Web3Provider";
import AppLayoutWrapper from "@/layouts/AppLayoutWrapper";
import { Link } from "react-router-dom";
import { Code, GitBranch, Cloud, Lock, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const {
    state: { isAuthenticated },
  } = useWeb3Context();

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Real-time Collaboration",
      description: "Work simultaneously with researchers worldwide using live collaborative editing tools."
    },
    {
      icon: <GitBranch className="h-8 w-8" />,
      title: "Version Control",
      description: "Track every change with blockchain-powered version history and attribution."
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Secure Storage",
      description: "Immutable, decentralized storage using IPFS and blockchain technology."
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cross-platform Access",
      description: "Access your research documents from anywhere, anytime. Cloud-synced across devices."
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Open Standards",
      description: "Built on open-source technologies with transparent research workflows."
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Peer Review",
      description: "Integrated review system with academic credibility scoring."
    }
  ];

  return (
    <AppLayoutWrapper>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="w-full py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <Badge variant="outline" className="text-sm px-4 py-1">
                Beta Now Live!
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Revolutionize Academic Collaboration with 
                <span className="text-blue-600 ml-2">CollabLearn</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Secure, decentralized platform for collaborative research and peer-reviewed knowledge sharing.
              </p>
              <div className="flex gap-4 mt-8">
                <Web3Btn />
                {isAuthenticated && (
                  <Link to="/app">
                    <Button variant="outline">
                      Go to Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 shadow-xl">
                <img 
                  src="/collaboration-illustration.svg" 
                  alt="Collaboration" 
                  className="w-full h-64 object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-20 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">
              Why Choose CollabLearn?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-20 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">
              Transform Your Research Workflow
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-blue-600">1</div>
                <h3 className="text-xl font-semibold">Create & Collaborate</h3>
                <p className="text-muted-foreground">
                  Start new projects or join existing ones. Work in real-time with global researchers.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-blue-600">2</div>
                <h3 className="text-xl font-semibold">Version & Verify</h3>
                <p className="text-muted-foreground">
                  Track contributions with immutable version history. Ensure academic integrity.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-blue-600">3</div>
                <h3 className="text-xl font-semibold">Publish & Protect</h3>
                <p className="text-muted-foreground">
                  Store final works securely on decentralized networks. Get proper attribution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 px-4 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Revolutionize Your Research?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join leading academic institutions and researchers in the decentralized knowledge revolution.
            </p>
            <Web3Btn  />
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-8 px-4 border-t bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 CollabLearn. All rights reserved. Built with ❤️ for open science.
            </p>
          </div>
        </footer>
      </div>
    </AppLayoutWrapper>
  );
};

export default LandingPage;