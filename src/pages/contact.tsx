import { MessageSquare } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { GithubIcon } from "@/components/common/github-icon";
import { Layout } from "@/components/layout/Layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

export const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact - Fed Open Market Alerts</title>
        <meta
          name="description"
          content="Get in touch with Fed Open Market Alerts for support, feedback, or questions."
        />
      </Helmet>

      <Layout variant="page">
        <div className="prose prose-slate max-w-none">
          <div className="flex flex-col gap-4">
            <div>
              <h1>Contact Us</h1>
              <p>
                We'd love to hear from you! Whether you have questions,
                feedback, or need support, here are the best ways to reach us:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="flex items-center gap-2">
                  <GithubIcon className="size-6" />
                  <CardTitle>GitHub Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  Report bugs, request features, or ask technical questions on
                  our GitHub repository.
                </CardContent>
                <CardFooter>
                  <a
                    href="https://github.com/ruchernchong/fed-open-market-alerts/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-800 underline hover:text-slate-900"
                  >
                    Open an Issue
                    <GithubIcon className="size-4" />
                  </a>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex items-center gap-2">
                  <MessageSquare className="size-6" />
                  <CardTitle>General Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  Have general feedback or suggestions? Start a discussion on
                  our GitHub repository.
                </CardContent>
                <CardFooter>
                  <a
                    href="https://github.com/ruchernchong/fed-open-market-alerts/discussions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-800 underline hover:text-slate-900"
                  >
                    Start Discussion
                    <MessageSquare className="size-4" />
                  </a>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent>
                Fed Open Market Alerts is an open-source project that provides
                free access to Federal Reserve Open Market Operations data.
              </CardContent>
              <CardFooter className="flex flex-wrap gap-4 text-sm">
                <a
                  href="https://github.com/ruchernchong/fed-open-market-alerts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-800"
                >
                  <GithubIcon className="size-4" />
                  GitHub Repository
                </a>
              </CardFooter>
            </Card>

            <Alert className="border-amber-200 bg-amber-50">
              <AlertTitle className="text-amber-900">Response Time</AlertTitle>
              <AlertDescription className="text-amber-800">
                This is a personal project maintained in my spare time. While
                I'll do my best to respond promptly, please allow for reasonable
                response times, especially for complex issues.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </Layout>
    </>
  );
};
