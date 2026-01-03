import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { redirectToCheckout } from '../../services/stripeService';
import '../../styles/landing.css';

export function LandingPage() {
  const { isAuthenticated, login, user, logout } = useAuth();
  const { tier, isProUser } = useSubscription();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleUpgrade = async () => {
    try {
      await redirectToCheckout();
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
            {isAuthenticated ? (
              <>
                <span style={{ fontSize: '14px', color: '#64748b' }}>
                  {user?.name || 'User'} ({isProUser ? 'Pro' : 'Free'})
                </span>
                <a href="/dashboard" className="landing-btn landing-btn-primary">
                  Go to Dashboard
                </a>
                <button onClick={logout} className="landing-btn landing-btn-ghost">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={handleLogin} className="landing-btn landing-btn-primary">
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-container landing-hero-content">
          <div className="landing-hero-badge">
            ⚡ Powered by AI • Built for Microsoft Fabric
          </div>

          <h1 className="landing-hero-title">
            AI-Powered Microsoft Fabric Infrastructure Builder
          </h1>

          <p className="landing-hero-subtitle">
            Generate production-ready deployment scripts, Bicep templates, and Terraform configurations
            for Microsoft Fabric in seconds. No more manual infrastructure code.
          </p>

          <div className="landing-hero-ctas">
            {isAuthenticated ? (
              <a href="/dashboard" className="landing-btn landing-btn-primary">
                Open Dashboard →
              </a>
            ) : (
              <button onClick={handleLogin} className="landing-btn landing-btn-primary">
                Get Started Free →
              </button>
            )}
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
              <div className="landing-hero-stat-label">Time Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Everything You Need</h2>
            <p className="landing-section-subtitle">
              From starter projects to enterprise data lakehouses, generate infrastructure code that just works.
            </p>
          </div>

          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <div className="landing-feature-icon">📚</div>
              <h3 className="landing-feature-title">Template Library</h3>
              <p className="landing-feature-desc">
                6 battle-tested templates from simple starters to full enterprise data lakehouses with warehouses, pipelines, and notebooks.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">🔄</div>
              <h3 className="landing-feature-title">Multi-Format Output</h3>
              <p className="landing-feature-desc">
                Generate PowerShell scripts, Azure Bicep templates, or HashiCorp Terraform configurations. Your choice.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">🤖</div>
              <h3 className="landing-feature-title">AI-Powered Config</h3>
              <p className="landing-feature-desc">
                Describe your infrastructure needs in plain English. Our AI translates it into proper configuration.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">💰</div>
              <h3 className="landing-feature-title">Cost Forecasting</h3>
              <p className="landing-feature-desc">
                Estimate your Azure spend before deployment. No surprises when the bill arrives.
              </p>
              <span className="landing-feature-badge">Pro</span>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">🚀</div>
              <h3 className="landing-feature-title">CI/CD Ready</h3>
              <p className="landing-feature-desc">
                Generated code integrates with Azure DevOps and GitHub Actions out of the box.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">☁️</div>
              <h3 className="landing-feature-title">Databricks & Snowflake</h3>
              <p className="landing-feature-desc">
                Extend beyond Fabric to other cloud data platforms. Same workflow, more destinations.
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
              Three simple steps to production-ready infrastructure
            </p>
          </div>

          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-number">1</div>
              <h3 className="landing-step-title">Choose or Describe</h3>
              <p className="landing-step-desc">
                Select from our template library or describe your needs in plain English.
              </p>
            </div>

            <div className="landing-step">
              <div className="landing-step-number">2</div>
              <h3 className="landing-step-title">Configure with AI</h3>
              <p className="landing-step-desc">
                Fine-tune your configuration. AI suggests optimal settings based on your workload.
              </p>
            </div>

            <div className="landing-step">
              <div className="landing-step-number">3</div>
              <h3 className="landing-step-title">Download & Deploy</h3>
              <p className="landing-step-desc">
                Get your scripts instantly. Deploy to Azure with a single command.
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
              <div className="landing-pricing-desc">Perfect for trying things out</div>
              <div className="landing-pricing-price">$0<span>/month</span></div>

              <ul className="landing-pricing-features">
                <li>3 generations per month</li>
                <li>2 templates (Starter & CI/CD)</li>
                <li>PowerShell output only</li>
                <li className="disabled">Bicep & Terraform output</li>
                <li className="disabled">Save configurations</li>
                <li className="disabled">Cost forecasting</li>
              </ul>

              {isAuthenticated && tier === 'free' ? (
                <button className="landing-btn landing-btn-secondary" style={{ width: '100%' }} disabled>
                  Current Plan
                </button>
              ) : isAuthenticated ? null : (
                <button onClick={handleLogin} className="landing-btn landing-btn-secondary" style={{ width: '100%' }}>
                  Get Started
                </button>
              )}
            </div>

            {/* Pro Tier */}
            <div className="landing-pricing-card featured">
              <div className="landing-pricing-name">Pro</div>
              <div className="landing-pricing-desc">For serious infrastructure builders</div>
              <div className="landing-pricing-price">$15<span>/month</span></div>

              <ul className="landing-pricing-features">
                <li>Unlimited generations</li>
                <li>All 6 templates</li>
                <li>PowerShell, Bicep & Terraform</li>
                <li>Save & export configurations</li>
                <li>Cost forecasting</li>
                <li>Priority support</li>
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
                <button onClick={handleLogin} className="landing-btn landing-btn-primary" style={{ width: '100%' }}>
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
            Join teams who save hours on every deployment
          </p>

          {isAuthenticated ? (
            <a href="/dashboard" className="landing-btn landing-btn-primary">
              Go to Dashboard →
            </a>
          ) : (
            <button onClick={handleLogin} className="landing-btn landing-btn-primary">
              Get Started for Free →
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-content">
            <div className="landing-footer-brand">
              <div className="landing-footer-logo">Fabric Toolbox</div>
              <p className="landing-footer-tagline">
                AI-powered infrastructure generation for Microsoft Fabric.
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
