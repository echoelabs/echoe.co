import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WaitlistWelcomeProps {
  email?: string;
}

export const WaitlistWelcome = ({ email }: WaitlistWelcomeProps) => {
  return (
    <Html>
      <Head />
      <Preview>You're on the echoe waitlist</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Brand */}
          <Section style={logoSection}>
            <Text style={logo}>echoe</Text>
          </Section>

          {/* Main Content */}
          <Heading style={heading}>You're on the list.</Heading>

          <Text style={paragraph}>
            Thanks for signing up for early access to echoe. We're building the future of unified
            commerce — and you'll be among the first to experience it.
          </Text>

          <Text style={paragraph}>
            We'll keep you updated on our progress and let you know as soon as we're ready to
            onboard early users.
          </Text>

          {/* What to Expect */}
          <Section style={featureSection}>
            <Text style={featureTitle}>What's coming:</Text>
            <Text style={featureItem}>• Unified inbox for all your channels</Text>
            <Text style={featureItem}>• AI-powered customer support</Text>
            <Text style={featureItem}>• Seamless inventory management</Text>
            <Text style={featureItem}>• Real-time order tracking</Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            This email was sent to {email}. You're receiving this because you signed up for the
            echoe waitlist.
          </Text>

          <Text style={footerLinks}>
            <Link href="https://echoe.co" style={link}>
              echoe.co
            </Link>
            {' • '}
            <Link href="https://twitter.com/echoe" style={link}>
              Twitter
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WaitlistWelcome;

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#0f172a',
  letterSpacing: '-0.5px',
  margin: '0',
};

const heading = {
  fontSize: '28px',
  fontWeight: '600',
  color: '#0f172a',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  margin: '0 0 24px',
};

const paragraph = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#475569',
  margin: '0 0 16px',
};

const featureSection = {
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
};

const featureTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#0f172a',
  margin: '0 0 12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const featureItem = {
  fontSize: '14px',
  lineHeight: '1.8',
  color: '#64748b',
  margin: '0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
};

const footer = {
  fontSize: '12px',
  lineHeight: '1.6',
  color: '#94a3b8',
  margin: '0 0 8px',
};

const footerLinks = {
  fontSize: '12px',
  color: '#94a3b8',
  margin: '0',
};

const link = {
  color: '#64748b',
  textDecoration: 'underline',
};
