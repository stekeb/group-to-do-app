- Fehler

  - Lösung

- App.jsx wird nicht richtig importiert

  - in unserem Fall: "../src/App" muss sein

- KI gibt eine Vorlage, um eine Komponente zu importieren

  - KI Ausgabe "import YourComponent from '../path-to-your-component';" muss zu "import App from "../src/App" " umgeschrieben sein

- Ein Testdokument für eine React Komponente wird als .test.js gespeichert
  - Damit vitest React Komponenten testen kann, muss das Testdokument als .test.jsx gespeichert sein.
