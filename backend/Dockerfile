# backend/Dockerfile

# Verwende ein offizielles Node.js Image als Basis
FROM node:22-alpine

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app/backend

# Kopiere package.json und package-lock.json (oder yarn.lock)
COPY package.json ./
# Wenn du yarn verwendest:
# COPY yarn.lock ./
COPY package-lock.json ./

# Installiere Projekt-Abhängigkeiten
RUN npm install --production # --production, um nur Produktions-Abhängigkeiten zu installieren
# Wenn du yarn verwendest:
# RUN yarn install --production

# Kopiere den Rest des Backend-Quellcodes
COPY . .

# Kopiere die Datenbankdatei, wenn sie im Repository ist (oder erstelle sie beim Start)
# Wenn tasks.db versioniert ist:
COPY tasks.db ./tasks.db
# Wenn nicht, wird sie beim ersten Start erstellt, wie im server.js definiert.

# Exponiere den Port, auf dem dein Backend-Server läuft (z.B. 3050)
EXPOSE 3050

# Standardbefehl, um die Anwendung zu starten
# Ersetze 'node server.js' durch deinen tatsächlichen Startbefehl,
# z.B. 'npm start', wenn du ein start-Skript in package.json hast.
CMD ["node", "server.js"]
