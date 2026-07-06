import { Alert, Card } from "@heroui/react";
import { MessageSquare } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { GithubIcon } from "@/components/common/github-icon";
import { Layout } from "@/components/layout/Layout";

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
                <Card.Header className="flex items-center gap-2">
                  <GithubIcon className="size-6" />
                  <Card.Title>GitHub Issues</Card.Title>
                </Card.Header>
                <Card.Content>
                  Report bugs, request features, or ask technical questions on
                  our GitHub repository.
                </Card.Content>
                <Card.Footer>
                  <a
                    href="https://github.com/ruchernchong/fed-open-market-alerts/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-accent underline hover:text-accent-hover"
                  >
                    Open an Issue
                    <GithubIcon className="size-4" />
                  </a>
                </Card.Footer>
              </Card>

              <Card>
                <Card.Header className="flex items-center gap-2">
                  <MessageSquare className="size-6" />
                  <Card.Title>General Feedback</Card.Title>
                </Card.Header>
                <Card.Content>
                  Have general feedback or suggestions? Start a discussion on
                  our GitHub repository.
                </Card.Content>
                <Card.Footer>
                  <a
                    href="https://github.com/ruchernchong/fed-open-market-alerts/discussions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-accent underline hover:text-accent-hover"
                  >
                    Start Discussion
                    <MessageSquare className="size-4" />
                  </a>
                </Card.Footer>
              </Card>
            </div>

            <Card>
              <Card.Header>
                <Card.Title>Project Information</Card.Title>
              </Card.Header>
              <Card.Content>
                Fed Open Market Alerts is an open-source project that provides
                free access to Federal Reserve Open Market Operations data.
              </Card.Content>
              <Card.Footer className="flex flex-wrap gap-4 text-sm">
                <a
                  href="https://github.com/ruchernchong/fed-open-market-alerts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted hover:text-foreground"
                >
                  <GithubIcon className="size-4" />
                  GitHub Repository
                </a>
              </Card.Footer>
            </Card>

            <Alert status="warning">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Response Time</Alert.Title>
                <Alert.Description>
                  This is a personal project maintained in my spare time. While
                  I'll do my best to respond promptly, please allow for
                  reasonable response times, especially for complex issues.
                </Alert.Description>
              </Alert.Content>
            </Alert>
          </div>
        </div>
      </Layout>
    </>
  );
};
