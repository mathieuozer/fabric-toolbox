import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../hooks/useAuth';
import { redirectToCheckout } from '../../services/stripeService';
import '../../styles/landing.css';

// SVG Icons
const Icons = {
  Library: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 7h6" />
      <path d="M8 11h8" />
    </svg>
  ),
  Refresh: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  ),
  Wand: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 4V2" />
      <path d="M15 16v-2" />
      <path d="M8 9h2" />
      <path d="M20 9h2" />
      <path d="M17.8 11.8 19 13" />
      <path d="M15 9h0" />
      <path d="M17.8 6.2 19 5" />
      <path d="m3 21 9-9" />
      <path d="M12.2 6.2 11 5" />
    </svg>
  ),
  DollarSign: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Rocket: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  Cloud: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  ),
  Zap: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
};

export function LandingPage() {
  const { tier, isProUser } = useSubscription();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    // Redirect to dashboard - auth will be handled there
    window.location.href = '/dashboard';
  };

  const handleUpgrade = async () => {
    try {
      // Pass user email if authenticated
      await redirectToCheckout(user?.email);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-container landing-header-inner">
          <a href="/" className="landing-logo">
            <div className="landing-logo-icon">FT</div>
            <span>Fabric Toolbox</span>
          </a>

          <nav className="landing-nav">
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="landing-nav-link">Features</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="landing-nav-link">Pricing</a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }} className="landing-nav-link">How It Works</a>
          </nav>

          <div className="landing-header-actions">
            <button onClick={handleGetStarted} className="landing-btn landing-btn-primary">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-container landing-hero-content">
          <div className="landing-hero-badge">
            <Icons.Zap /> Built for Microsoft Fabric
          </div>

          <h1 className="landing-hero-title">
            Microsoft Fabric Infrastructure Builder
          </h1>

          <p className="landing-hero-subtitle">
            Stop spending hours writing deployment scripts from scratch. Fabric Toolbox generates
            production-ready PowerShell, Bicep, and Terraform code tailored to your exact specifications —
            capacity sizes, naming conventions, regions, and architecture patterns.
          </p>

          <div className="landing-hero-ctas">
            <button onClick={handleGetStarted} className="landing-btn landing-btn-primary">
              Get Started Free <Icons.ArrowRight />
            </button>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="landing-btn landing-btn-secondary">
              See Features
            </a>
          </div>

          <div className="landing-hero-stats">
            <div className="landing-hero-stat">
              <div className="landing-hero-stat-value">6</div>
              <div className="landing-hero-stat-label">Enterprise Templates</div>
            </div>
            <div className="landing-hero-stat">
              <div className="landing-hero-stat-value">3</div>
              <div className="landing-hero-stat-label">Output Formats</div>
            </div>
            <div className="landing-hero-stat">
              <div className="landing-hero-stat-value">∞</div>
              <div className="landing-hero-stat-label">Configurations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="landing-problem-solution">
        <div className="landing-container">
          <div className="landing-ps-grid">
            <div className="landing-ps-card problem">
              <h3>The Problem</h3>
              <ul>
                <li>Setting up Microsoft Fabric infrastructure manually is time-consuming and error-prone</li>
                <li>Each project requires custom configurations for capacity, workspaces, and permissions</li>
                <li>Switching between PowerShell, Bicep, and Terraform means rewriting everything</li>
                <li>Keeping up with Fabric API changes and best practices is a full-time job</li>
              </ul>
            </div>
            <div className="landing-ps-card solution">
              <h3>The Solution</h3>
              <ul>
                <li>Choose from 6 battle-tested architecture templates designed for real enterprise scenarios</li>
                <li>Configure once, generate in any format — PowerShell, Bicep, or Terraform</li>
                <li>Every script is customized to your exact naming conventions, regions, and capacity needs</li>
                <li>Templates are updated monthly with the latest Fabric features and security best practices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Why Use Fabric Toolbox?</h2>
            <p className="landing-section-subtitle">
              Not just templates - a configuration engine that generates scripts tailored to your exact requirements.
            </p>
          </div>

          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <div className="landing-feature-icon"><Icons.Library /></div>
              <h3 className="landing-feature-title">Smart Template Engine</h3>
              <p className="landing-feature-desc">
                6 architecture patterns that adapt to your inputs. Capacity sizes, naming conventions, regions - everything is customized to your spec.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon"><Icons.Refresh /></div>
              <h3 className="landing-feature-title">Multi-Format Output</h3>
              <p className="landing-feature-desc">
                Generate PowerShell, Azure Bicep, or Terraform. Switch formats anytime - your configuration stays consistent across all outputs.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon"><Icons.Wand /></div>
              <h3 className="landing-feature-title">Continuous Updates</h3>
              <p className="landing-feature-desc">
                New Fabric features, API changes, best practices - templates evolve monthly. Pro users always have the latest patterns.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon"><Icons.DollarSign /></div>
              <h3 className="landing-feature-title">Cost Forecasting</h3>
              <p className="landing-feature-desc">
                Real-time Azure cost estimates based on your configuration. Know your spend before you deploy.
              </p>
              <span className="landing-feature-badge">Pro</span>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon"><Icons.Rocket /></div>
              <h3 className="landing-feature-title">Save & Manage Configs</h3>
              <p className="landing-feature-desc">
                Store configurations across projects. Regenerate scripts when requirements change - no starting from scratch.
              </p>
              <span className="landing-feature-badge">Pro</span>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon"><Icons.Cloud /></div>
              <h3 className="landing-feature-title">Databricks & Snowflake</h3>
              <p className="landing-feature-desc">
                Extend your infrastructure automation beyond Fabric. Same workflow, more cloud platforms.
              </p>
              <span className="landing-feature-badge">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="landing-how-it-works">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">How It Works</h2>
            <p className="landing-section-subtitle">
              Three steps to production-ready infrastructure code
            </p>
          </div>

          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-number">1</div>
              <h3 className="landing-step-title">Configure Your Setup</h3>
              <p className="landing-step-desc">
                Select architecture, set capacity, naming, region, and all parameters specific to your project.
              </p>
            </div>

            <div className="landing-step">
              <div className="landing-step-number">2</div>
              <h3 className="landing-step-title">Generate Scripts</h3>
              <p className="landing-step-desc">
                Get PowerShell, Bicep, or Terraform code - fully customized to your exact configuration.
              </p>
            </div>

            <div className="landing-step">
              <div className="landing-step-number">3</div>
              <h3 className="landing-step-title">Deploy & Iterate</h3>
              <p className="landing-step-desc">
                Deploy to Azure. Need changes? Adjust config and regenerate - scripts stay in sync.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="landing-pricing">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Simple Pricing</h2>
            <p className="landing-section-subtitle">
              Start free, upgrade when you need more power
            </p>
          </div>

          <div className="landing-pricing-grid">
            {/* Free Tier */}
            <div className="landing-pricing-card">
              <div className="landing-pricing-name">Free</div>
              <div className="landing-pricing-desc">Try it out</div>
              <div className="landing-pricing-price">$0<span>/month</span></div>

              <ul className="landing-pricing-features">
                <li><Icons.Check /> 3 generations per month</li>
                <li><Icons.Check /> 2 templates (Starter & CI/CD)</li>
                <li><Icons.Check /> PowerShell output</li>
                <li className="disabled"><Icons.X /> Bicep & Terraform output</li>
                <li className="disabled"><Icons.X /> Save configurations</li>
                <li className="disabled"><Icons.X /> Cost forecasting</li>
              </ul>

              {isAuthenticated && tier === 'free' ? (
                <button className="landing-btn landing-btn-secondary" style={{ width: '100%' }} disabled>
                  Current Plan
                </button>
              ) : (
                <button onClick={handleGetStarted} className="landing-btn landing-btn-secondary" style={{ width: '100%' }}>
                  Get Started
                </button>
              )}
            </div>

            {/* Pro Tier */}
            <div className="landing-pricing-card featured">
              <div className="landing-pricing-name">Pro</div>
              <div className="landing-pricing-desc">For teams & consultants</div>
              <div className="landing-pricing-price">$15<span>/month</span></div>

              <ul className="landing-pricing-features">
                <li><Icons.Check /> Unlimited generations</li>
                <li><Icons.Check /> All 6 templates</li>
                <li><Icons.Check /> PowerShell, Bicep & Terraform</li>
                <li><Icons.Check /> Save & manage configurations</li>
                <li><Icons.Check /> Cost forecasting</li>
                <li><Icons.Check /> Monthly template updates</li>
              </ul>

              {isAuthenticated && isProUser ? (
                <button className="landing-btn landing-btn-primary" style={{ width: '100%' }} disabled>
                  Current Plan
                </button>
              ) : isAuthenticated ? (
                <button onClick={handleUpgrade} className="landing-btn landing-btn-primary" style={{ width: '100%' }}>
                  Upgrade to Pro
                </button>
              ) : (
                <button onClick={handleGetStarted} className="landing-btn landing-btn-primary" style={{ width: '100%' }}>
                  Start with Pro
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-container">
          <h2 className="landing-cta-title">Ready to Automate Your Fabric Infrastructure?</h2>
          <p className="landing-cta-subtitle">
            Stop writing boilerplate. Generate customized scripts in seconds.
          </p>

          <button onClick={handleGetStarted} className="landing-btn landing-btn-primary">
            Get Started for Free <Icons.ArrowRight />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-content">
            <div className="landing-footer-brand">
              <div className="landing-footer-logo">Fabric Toolbox</div>
              <p className="landing-footer-tagline">
                Infrastructure generation for Microsoft Fabric.
                Built by Oryx Data.
              </p>
            </div>

            <div className="landing-footer-links">
              <a href="https://oryx-data.com" target="_blank" rel="noopener noreferrer">Oryx Data</a>
              <a href="https://oryx-data.com/platform-fabric.html" target="_blank" rel="noopener noreferrer">Fabric Services</a>
              <a href="mailto:contact@oryx-data.com">Contact</a>
            </div>
          </div>

          <div className="landing-footer-bottom">
            © {new Date().getFullYear()} Oryx Data. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
