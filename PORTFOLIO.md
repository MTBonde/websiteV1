## ✅ Portfolio V1 – Minimalistisk, professionel MVP

### 🔄 Overblik: Formål og Retning

* **Formål**: Fungere som en diskret, men effektiv headhunter for dig. Sælge din tilgang, ikke bare din kode.
* **Målgruppe**: Arbejdsgivere og samarbejdspartnere der kan hyre dig – ikke nødvendigvis som hardcore udvikler, men også som facilitator, PM, DevOps-minded profil.
* **Strategi for V1**: Hurtigt, professionelt, tekstbaseret setup – nemt at hoste, nemt at vedligeholde, nemt at udbygge i v2.

---

### 🧱 Anbefalet Struktur for V1

#### 1. Forside / Hero Section

* Kort introduktion (1–2 linjer om hvem du er, hvad du tilbyder, og hvorfor det er værd at tage kontakt)
* Call to Action-knap: *Se projekter* eller *Kontakt mig*
* Tema-toggle: mørk/lys

#### 2. Om Mig (kort version)

* Kortfattet tekst: hvem du er, hvad du brænder for, og hvordan du arbejder
* Fokus på arbejdsstil, nysgerrighed, problemløsning – ikke på personligt liv
* Et link til CV og evt. LinkedIn

#### 3. Udvalgte Projekter

* Hver projekt-box indeholder:

    * Titel og kort beskrivelse (hvad, hvorfor, hvordan)
    * Dine refleksioner: hvad du lærte, hvad der var svært, og hvordan du løste det
    * Teknologier brugt (tags)
    * Link til GitHub
    * Evt. screenshot

#### 4. Kompetencer

* Bullet-liste over teknologier og roller

#### 5. Kontakt

* Formular (Navn, Email, Besked) med `formsubmit.co`
* Evt. direkte email-link og LinkedIn

#### 6. Footer

* Sociale links
* Copyright information
* CV-download (valgfrit)

---

### 🎨 Design & Stil

* **Designstil**: Minimalistisk, mørk/lys-toggle, skarp typografi (fx Inter eller Roboto)
* **Layout**: Topbar-navigation med 3–4 punkter (Forside, Projekter, Om, Kontakt)
* **Farver**: Sort/hvid/grå + én accentfarve (fx blå, grøn eller gul – neutral og troværdig)
* **Animation**: Let fade-in eller scroll reveal (kan laves med CSS eller små JS-libraries som AOS)

---

### 🧭 Navigation & UX

* Brug topbar med sticky funktion
* Brug `aria-labels` og semantisk HTML for god tilgængelighed
* Brug intern linkning mellem sektioner (smooth scroll)
* Læg hver sektion på egen side for SoC (fx /about.html, /projects.html, /contact.html)
* Vigtige links (GitHub, CV, LinkedIn) skal altid være let tilgængelige

---

### 🔧 Teknisk Plan v1

* **HTML/CSS/JS** (ingen frameworks – nemt at deploye, du kender det)
* Brug **GitHub Pages** (med custom domain: `mtbonde.dev`)
* Strukturér med separate sider:

    * `/index.html`
    * `/projects.html`
    * `/about.html`
    * `/contact.html`
* Brug evt. `formsubmit.co` eller Netlify Forms til kontaktformular (ingen backend)

#### Filstruktur

```plaintext
portfolio/
├── index.html           # Hero, featured projects, kontakt CTA
├── about.html           # Din tilgang og erfaring
├── projects.html        # Uddybende cases
├── contact.html         # Kontaktformular
├── css/
│   └── main.css
├── js/
│   ├── theme-toggle.js
│   └── boids.js         # valgfri baggrundseffekt
├── assets/
│   ├── images/
│   └── docs/
└── CNAME
```

