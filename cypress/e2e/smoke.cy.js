describe('Scholarship System Smoke Tests', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('/');
  });

  it('loads homepage and navigates to scholarships', () => {
    // Check homepage loads
    cy.contains('Global Pathways').should('be.visible');
    
    // Navigate to scholarships
    cy.contains('Scholarship Search').click();
    cy.url().should('include', '/scholarships');
    
    // Check scholarships page loads
    cy.contains('Scholarship Search').should('be.visible');
    cy.get('[data-testid="scholarship-list"]').should('exist');
  });

  it('loads auto scholarship finder and performs search', () => {
    // Navigate to auto scholarship finder
    cy.visit('/auto-scholarships');
    cy.url().should('include', '/auto-scholarships');
    
    // Check page loads
    cy.contains('AI-Powered Scholarship Finder').should('be.visible');
    
    // Fill out basic profile information
    cy.get('input[placeholder="3.75"]').type('3.5');
    cy.get('input[placeholder="1450"]').type('1300');
    cy.get('input[placeholder="Computer Science, Biology, etc."]').type('Computer Science');
    
    // Submit search
    cy.contains('Find My Scholarships').click();
    
    // Wait for results (or loading state)
    cy.get('.animate-spin', { timeout: 10000 }).should('not.exist');
  });

  it('loads college comparison and calculator', () => {
    // Test college comparison
    cy.visit('/college-comparison');
    cy.url().should('include', '/college-comparison');
    cy.contains('College Comparison Tool').should('be.visible');
    
    // Test cost calculator
    cy.visit('/cost-calculator');
    cy.url().should('include', '/cost-calculator');
    cy.contains('Personalized College Cost Calculator').should('be.visible');
    
    // Fill out calculator form
    cy.get('input[placeholder="3.75"]').type('3.5');
    cy.get('input[placeholder="1450"]').type('1300');
    
    // Calculate costs
    cy.contains('Calculate My Costs').click();
    
    // Check results appear
    cy.contains('Annual Cost Breakdown').should('be.visible');
  });

  it('tests scholarship reporting functionality', () => {
    cy.visit('/scholarships');
    
    // Wait for scholarships to load
    cy.get('[data-testid="scholarship-card"]').should('exist');
    
    // Click report button on first scholarship
    cy.get('[data-testid="report-btn"]').first().click();
    
    // Check alert appears (or modal, depending on implementation)
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Thank you for reporting');
    });
  });

  it('tests real-time updates simulation', () => {
    cy.visit('/scholarships');
    
    // Check initial load
    cy.get('[data-testid="scholarship-list"]').should('exist');
    
    // Simulate waiting for real-time updates
    cy.wait(2000);
    
    // Check page is still responsive
    cy.get('input[placeholder="Search scholarships..."]').type('STEM');
    cy.get('[data-testid="scholarship-list"]').should('exist');
  });

  it('tests admin page access', () => {
    // Try to access admin page
    cy.visit('/admin');
    
    // Should either show login requirement or access denied
    cy.get('body').should('contain.text', 'Access Denied').or('contain.text', 'Admin Panel');
  });

  it('tests navigation and footer links', () => {
    // Test main navigation
    cy.get('nav').should('exist');
    cy.contains('FAFSA Guide').should('be.visible');
    cy.contains('Cost Calculator').should('be.visible');
    
    // Test footer
    cy.get('footer').should('exist');
    cy.contains('Global Pathways').should('be.visible');
  });

  it('tests mobile responsiveness', () => {
    // Test mobile viewport
    cy.viewport('iphone-6');
    
    // Check mobile menu
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
    
    // Test scholarship page on mobile
    cy.visit('/scholarships');
    cy.get('[data-testid="scholarship-list"]').should('exist');
    
    // Test cost calculator on mobile
    cy.visit('/cost-calculator');
    cy.contains('Calculate My Costs').should('be.visible');
  });
});