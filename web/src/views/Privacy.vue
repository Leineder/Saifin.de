<template>
  <div class="privacy-container">
    <div class="container">
      <h1 class="privacy-title">Datenschutzerklärung</h1>
      
      <div class="privacy-content">
        <section class="privacy-section">
          <h2>1. Verantwortlicher</h2>
          <p>Verantwortlich gemäß DSGVO:</p>
          <div class="contact-info">
            <p><strong>Christian Eineder, Einzelunternehmer</strong></p>
            <p>Fridolin-Holzer-Straße 6, 88161 Lindenberg (Allgäu)</p>
            <p><strong>E-Mail:</strong> <a href="mailto:info@saifin.de" class="contact-link">info@saifin.de</a></p>
          </div>
        </section>

        <section class="privacy-section">
          <h2>2. Datenschutzbeauftragter</h2>
          <p>Ein Datenschutzbeauftragter ist nicht bestellt.</p>
        </section>

        <section class="privacy-section">
          <h2>3. Rechtsgrundlagen der Verarbeitung</h2>
          <ul class="privacy-list">
            <li><strong>Art. 6 Abs. 1 lit. f DSGVO</strong> – zur Sicherstellung des Betriebs (z. B. Logfiles).</li>
            <li><strong>Art. 6 Abs. 1 lit. a DSGVO</strong> – Einwilligung für Tracking, Affiliate, Analysen etc.</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>4. Server-Hosting und Infrastruktur</h2>
          <p>Strato (Domain), Vercel (Hosting) – EU-basiert. Logs (inkl. IP, Timestamp) für max. 7 Tage, dann gelöscht.</p>
        </section>

        <section class="privacy-section">
          <h2>5. Cookies und Consent</h2>
          <ul class="privacy-list">
            <li><strong>Essenziell notwendige Cookies:</strong> aktiviert für Funktionalität.</li>
            <li><strong>Statistik, Affiliate, Marketing:</strong> nur bei ausdrücklicher Einwilligung über Banner aktiviert.</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>6. Tools / Plugins / Analyse</h2>
          <p>Derzeit keine externen Tools ohne Einwilligung. Zukünftig nur datenschutz-konform eingebunden — z. B. Analytics oder Affiliate-Pixel — und nur nach Einwilligung.</p>
        </section>

        <section class="privacy-section">
          <h2>7. Weitergabe an Partner/Drittparteien</h2>
          <p>Datennutzung (z. B. Klick-IDs, Finanzdaten) erfolgt nur mit Zustimmung an Darlehensgeber oder zugelassene Partner. Saifin fungiert als Vermittler.</p>
        </section>

        <section class="privacy-section">
          <h2>8. Rechte der Nutzer</h2>
          <p>Betroffenenrechte (Auskunft, Löschung, Widerruf etc.) können über <a href="mailto:info@saifin.de" class="contact-link">info@saifin.de</a> geltend gemacht werden. Nutzer können sich ebenfalls an das BayLDA wenden.</p>
        </section>

        <section class="privacy-section">
          <h2>9. Drittlandtransfer & Garantien</h2>
          <p>Dienstleister wie GitHub (USA) werden genutzt. Hier gelten Datenschutzmechanismen wie Data Privacy Framework oder Standardvertragsklauseln (SCC).</p>
        </section>

        <section class="privacy-section">
          <h2>10. Speicherdauer</h2>
          <ul class="privacy-list">
            <li><strong>Logfiles:</strong> 7 Tage</li>
            <li><strong>Affiliate-IDs:</strong> max. 90 Tage</li>
            <li><strong>Analysedaten:</strong> max. 14 Monate</li>
            <li><strong>Sonstige Daten:</strong> nur so lange wie notwendig, danach Löschung</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>11. Minderjährige</h2>
          <p>Es erfolgt keine gezielte Datenverarbeitung für Kinder unter 16 Jahren.</p>
        </section>

        <section class="privacy-section">
          <h2>12. Sicherheit</h2>
          <p>Datenschutz wird technisch (TLS) und organisatorisch (Backup, Zugriffskontrolle) sichergestellt.</p>
        </section>

        <section class="privacy-section">
          <h2>13. Zuständige Aufsichtsbehörde</h2>
          <p>Bayerisches Landesamt für Datenschutz (BayLDA).</p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy-container {
  padding: 2rem 1rem;
  background: #f8fafc;
  min-height: calc(100vh - 128px); /* Abzüglich Header und Footer */
}

.container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.privacy-title {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
  margin: 0;
  padding: 2rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.privacy-content {
  padding: 2rem;
}

.privacy-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.privacy-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.privacy-section h2 {
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #059669;
  display: inline-block;
}

.contact-info {
  background: #f0fdf4;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #059669;
  margin-top: 0.5rem;
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
  color: #059669;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.contact-link:hover {
  color: #047857;
  text-decoration: underline;
}

.privacy-section p {
  margin: 0.75rem 0;
  line-height: 1.6;
  color: #374151;
}

.privacy-list {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
  color: #374151;
}

.privacy-list li {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.privacy-section strong {
  color: #1f2937;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .privacy-container {
    padding: 1rem 0.5rem;
  }
  
  .privacy-title {
    padding: 1.5rem;
    font-size: 1.5rem;
  }
  
  .privacy-content {
    padding: 1.5rem;
  }
  
  .privacy-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }
  
  .privacy-section h2 {
    font-size: 1.125rem;
  }
  
  .privacy-list {
    padding-left: 1rem;
  }
}
</style>
