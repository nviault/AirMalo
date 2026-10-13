# AirMalo - Live Flight Radar VIP ✈️

**AirMalo** est une application web PWA moderne de suivi aérien ("Radar VIP") optimisée pour les tablettes en mode Kiosk / affichage mural. Elle offre une interface élégante, ultra-lisible à distance ("Glanceable") et respectueuse des écrans **OLED** (Noir absolu `#000000` et protection anti Burn-in).

---

## 🎨 Design System & Ergonomie OLED

- **Palette de couleurs :**
  - **Fond principal :** `#000000` (Noir absolu, compatible OLED).
  - **Surfaces & Cartes :** Effet de flou de verre (*glassmorphism* `backdrop-filter: blur(16px)`).
  - **Accent Stratosphère :** `#0A84FF` (Bleu Stratosphère).
  - **Alertes VIP :** `#FF9F0A` (Ambre) avec effet de pulsing lumineux sur les bords de l'écran.
  - **Texte Titane :** `#F2F2F7` / Gris Béton `#8E8E93`.
- **Typographies Google Fonts :**
  - **Outfit :** Pour les menus, noms de compagnies et composants UI.
  - **JetBrains Mono :** Chasse fixe pour toutes les télémesures (vitesse, altitude, distance, numéro de vol) évitant tout tressautement de données.

---

## 🚀 Fonctionnalités Clés

### 1. Gestion des Clés API (BYOK) & Intercepteur Auto-Fallback
- Configurable dans le menu des paramètres.
- Support d'une **Clé Principale** et d'une **Clé de Secours (Fallback)** OpenSky Network.
- **Auto-Fallback :** En cas d'erreur HTTP `429` (Quota dépassé) ou `401`, l'intercepteur bascule automatiquement sur la clé de secours ou le mode simulation sans interrompre l'affichage.

### 2. Smart Polling (Économie de Quota API)
- **Ciel vide / Avions distants (>30 km) :** Requêtes toutes les 60 secondes.
- **Avion à proximité (<30 km) :** Accélération automatique du rafraîchissement à **10 secondes**.

### 3. Calculs Spatiaux par Web Worker Off-Thread
- Les calculs de distance (formule de Haversine) et de tendance d'approche/éloignement (↘ / ↗) entre la tablette et les appareils sont calculés dans un **Web Worker dédié** pour garantir 0 lag sur l'UI.

### 4. Moteur de Règles "Radar VIP"
- Définissez vos propres alertes basées sur :
  - **Le modèle d'avion** (ex: `A388`, `B777`)
  - **La compagnie aérienne** (ex: `AFR`, `UAE`, `DLH`)
  - **L'immatriculation** (ex: `F-HBMO`)
- **Effet visuel VIP :** Une bordure intérieure Ambre pulsante s'active sur l'écran et verrouille le focus exclusif du carrousel sur l'appareil VIP.

### 5. Compositing Vectoriel SVG & Livrées Dynamiques
- Génération purement vectorielle SVG des profils d'avions (Airbus & Boeing) sans images PNG.
- Injection dynamique des couleurs officielles de la compagnie (Air France, Emirates, Lufthansa, etc.) sur l'empennage, la carlingue et les winglets via CSS.

### 6. Layout 3 Zones ("Live Flight")
- **En-tête (15% haut) :** Heure actuelle, météo locale Open-Meteo (icône + température), indicateur de distance (`X km ↘/↗`) et compteur de vols à proximité.
- **Hero Zone (50% centre) :** L'avion SVG en grand avec animation CSS de glissement de vol très lente (`transform: translateX()`) et carrousel automatique (rotation toutes les 8s ou swipe manuel).
- **Panneau de Données (35% bas) :** Carte glassmorphism affichant le logo & nom de compagnie, le numéro de vol, le trajet aéroportuaire (`ORY ➔ NCE`), l'immatriculation, l'altitude (en ft) et la vitesse sol (en km/h).

### 7. Mode Idle ("Horloge de Bureau") & Anti-Burn-In
- En cas de ciel calme (aucun avion à proximité pendant plus de 2 minutes), l'écran transitionne doucement vers l'affichage d'une horloge de bureau géante.
- **Protection Burn-in OLED :** L'affichage de l'horloge se décale de quelques pixels de façon aléatoire toutes les 30 minutes.

---

## 💻 Installation & Démarrage

### Prérequis
- **Node.js** v18+
- **npm** v9+

### Démarrage Rapide

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:5173`.

3. **Compiler pour la production :**
   ```bash
   npm run build
   ```

4. **Prévisualiser la version de production :**
   ```bash
   npm run preview
   ```

---

## 📱 Guide d'Épinglage sur Tablette (Mode Kiosk / PWA)

Pour transformer votre tablette (iPad ou Android) en véritable écran de contrôle d'aviation fixe :

### Sur iPad (Safari) :
1. Ouvrez l'application dans Safari.
2. Touchez le bouton **Partager**.
3. Sélectionnez **Sur l'écran d'accueil**.
4. Lancez l'application depuis l'icône ajoutée : elle s'exécutera en plein écran sans les barres de navigation Safari.

### Sur Tablette Android (Chrome) :
1. Ouvrez l'application dans Google Chrome.
2. Touchez le menu **⋮** en haut à droite.
3. Sélectionnez **Ajouter à l'écran d'accueil** ou **Installer l'application**.
4. Activez l'option *Verrouillage d'application (App Pinning)* dans les paramètres d'Android pour bloquer la tablette en mode Kiosk.

---

## 🛠️ Stack Technique

- **Framework :** React 18 + TypeScript + Vite
- **Styling :** Tailwind CSS + Lucide Icons
- **Gestion d'État :** Redux Toolkit (avec persistance `localStorage`)
- **Calculs Arrière-plan :** Web Worker HTML5 Native
- **Météo :** Open-Meteo API
