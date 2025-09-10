<template>
  <div class="imprint-container">
    <div class="container">
      <h1 class="imprint-title">Impressum</h1>
      
      <div class="imprint-content">
        <section class="imprint-section">
          <h2>Angaben gemäß § 5 TMG:</h2>
          <div class="contact-info">
            <p><strong>Christian Eineder</strong></p>
            <p>Fridolin-Holzer-Straße 6</p>
            <p>88161 Lindenberg (Allgäu)</p>
          </div>
        </section>

        <section class="imprint-section">
          <h2>Kontakt</h2>
          <div class="contact-info">
            <p><strong>E-Mail:</strong> <a href="mailto:info@saifin.de" class="contact-link">info@saifin.de</a></p>
          </div>
        </section>

        <section class="imprint-section">
          <h2>Vertreten durch:</h2>
          <p>Christian Eineder (Einzelunternehmer)</p>
        </section>

        <section class="imprint-section">
          <h2>Umsatzsteuer-ID:</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: <em>wird beantragt</em></p>
        </section>

        <section class="imprint-section">
          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:</h2>
          <div class="contact-info">
            <p><strong>Christian Eineder</strong></p>
            <p>Fridolin-Holzer-Straße 6</p>
            <p>88161 Lindenberg (Allgäu)</p>
          </div>
        </section>

        <section class="imprint-section">
          <h2>Streitschlichtung</h2>
          <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" class="contact-link">
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
          <p><strong>Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</strong></p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.imprint-container {
  padding: 2rem 1rem;
  background: var(--surface-muted);
  min-height: calc(100vh - 128px);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: var(--surface);
  color: var(--text);
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--shadow-color);
  overflow: hidden;
}

.imprint-title {
  background: linear-gradient(135deg, var(--saifin-navy-700), var(--saifin-navy-900));
  color: #fff;
  margin: 0;
  padding: 2rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.imprint-content {
  padding: 2rem;
}

.imprint-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.imprint-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.imprint-section h2 {
  color: var(--text);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border);
  display: inline-block;
}

.contact-info {
  background: var(--surface-muted);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid var(--saifin-navy-700);
}

.contact-info p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.contact-info p:first-child {
  margin-top: 0;
}

.contact-info p:last-child {
  margin-bottom: 0;
}

.contact-link {
  color: var(--link-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.contact-link:hover {
  color: var(--link-color);
  text-decoration: underline;
}

.imprint-section p {
  margin: 0.75rem 0;
  line-height: 1.6;
  color: var(--muted-text);
}

.imprint-section strong {
  color: var(--text);
  font-weight: 600;
}

.imprint-section em {
  color: var(--subtle-text);
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .imprint-container {
    padding: 1rem 0.5rem;
  }
  
  .imprint-title {
    padding: 1.5rem;
    font-size: 1.5rem;
  }
  
  .imprint-content {
    padding: 1.5rem;
  }
  
  .imprint-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }
  
  .imprint-section h2 {
    font-size: 1.125rem;
  }
}
</style>
