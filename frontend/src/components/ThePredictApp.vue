<template>
  <div class="main-container">
    <div class="main-left">
      <form @submit.prevent="validateForm">
        <!-- <label for="modelType">Type de modèle:</label>
        <select id="modelType" name="modelType" v-model="modelType">
          <option value="1">Catégorie (1 char)</option>
          <option value="2">Catégorie + Sous-Catégorie (3 char)</option>
        </select> -->

        <label for="claim">Claim:</label>
        <textarea id="claim" name="claim" rows="4" cols="50" v-model="claim" spellcheck="false"></textarea>

        <label for="description">Description:</label>
        <textarea id="description" name="description" rows="4" cols="50" v-model="description" spellcheck="false"></textarea>

        <button type="submit">Prédire</button>
        
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
    <div class="vertical-line"></div>
    <div class="main-right">
      <span v-if="!isPredictEmpty">
        <h2>Résultats de la prédiction</h2>
        <div v-if="loadingStatus"><img src="../assets/loading.gif" height="60"/></div>
        <div v-if="results && cpcJson">
          <h3>Catégories Prédites:</h3>

          <div v-for="category in results" :key="category">
            <div class="cpc-1">
              {{ category }} - {{ getCPCTitle(category) }}
            </div>
          </div>
        </div>
        <div v-if="Object.keys(shapImages).length > 0">
          <h3>Données d'explication:</h3>
          <div v-for="(src, img) in shapImages" :key="img">
            <img :src="'data:image/png;base64,' + src" :alt="img" />
          </div>
        </div>
      </span>
      <div v-html="htmlContent"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isPredictEmpty = ref(true);
const publicationDate = ref('');
const claim = ref('');
const description = ref('');
const errorMessage = ref('');
const modelType = ref('');
const results = ref(null);
const shapImages = ref({});
const loadingStatus = ref('');
const cpcJson = ref(null);
const htmlContent = ref('');

const websocket = ref(null);

// Load JSON locally without fetch
onMounted(() => {
  cpcJson.value = {
      "A": "Nécessités humaines",
      "B": "Exécution d'opérations; transport",
      "C": "Chimie; métallurgie",
      "D": "Textiles; papier",
      "E": "Constructions fixes",
      "F": "Génie mécanique; éclairage; chauffage; armes; explosions",
      "G": "Physique",
      "H": "Électricité",
      "Y": "Étiquetage général des nouveaux développements technologiques; étiquetage général des technologies transversales couvrant plusieurs sections de la CIP; sujets techniques couverts par d'anciennes collections d'art de référence croisée de l'USPC [XRAC] et des digests",
      "A01": "Agriculture; foresterie; élevage; chasse; piégeage; pêche",
      "A21": "Boulangerie; équipements pour la fabrication ou le traitement des pâtes; pâtes pour la boulangerie",
      "A22": "Abattage; traitement de la viande; traitement de la volaille ou du poisson",
      "A23": "Conservation des aliments; traitement des aliments; séchage ou torréfaction; mise en conserve ou en bouteille; remplissage ou fermeture de contenants; refroidissement ou congélation; méthodes ou appareils pour stériliser des matériaux ou des objets",
      "A24": "Tabac; cigares; cigarettes",
      "A41": "Vêtements",
      "A42": "Couvre-chefs",
      "A43": "Chaussures",
      "A44": "Mercerie; bijouterie",
      "A45": "Outils manuels ou électriques; outils portatifs à moteur; poignées pour outils à main; équipement d'atelier; manipulateurs",
      "A46": "Brosse",
      "A47": "Meubles; articles ou appareils domestiques; moulins à café; moulins à épices; aspirateurs en général",
      "A61": "Médecine ou science vétérinaire; hygiène",
      "A62": "Sauvetage; lutte contre l'incendie",
      "A63": "Sports; jeux; amusements",
      "A99": "Sujets non prévus dans cette section",
      "B01": "Procédés ou appareils physiques ou chimiques en général",
      "B02": "Broyage, pulvérisation ou désintégration; traitement préparatoire des grains pour la mouture",
      "B03": "Séparation des matières solides utilisant des liquides ou des tables ou cribles pneumatiques; séparation magnétique ou électrostatique des matières solides à partir de matières solides ou de fluides; séparation par champs électriques à haute tension",
      "B04": "Appareils ou machines centrifuges pour effectuer des procédés physiques ou chimiques",
      "B05": "Pulvérisation ou atomisation en général; application de liquides ou autres matériaux fluides sur des surfaces, en général",
      "B06": "Génération ou transmission de vibrations mécaniques en général",
      "B07": "Séparation de solides à partir de solides; tri",
      "B08": "Nettoyage",
      "B09": "Élimination des déchets solides; récupération des sols contaminés",
      "B21": "Travail des métaux sans enlever essentiellement de matière; poinçonnage du métal",
      "B22": "Fonderie; métallurgie des poudres",
      "B23": "Machines-outils; travail des métaux non prévu ailleurs",
      "B24": "Meulage; polissage",
      "B25": "Outils manuels; outils portatifs à moteur; poignées pour outils à main; équipement d'atelier; manipulateurs",
      "B26": "Outils de coupe manuels; coupe; séparation",
      "B27": "Travail ou préservation du bois ou des matériaux similaires; machines à clouer ou agrafer en général",
      "B28": "Travail du ciment, de l'argile ou de la pierre",
      "B29": "Travail des plastiques; travail des substances à l'état plastique en général",
      "B30": "Presses",
      "B31": "Fabrication d'articles en papier ou en carton; travail du papier ou du carton",
      "B32": "Produits stratifiés",
      "B33": "Technologie de fabrication additive",
      "B41": "Impression; machines à aligner; machines à écrire; timbres",
      "B42": "Reliure; albums; fichiers; matières imprimées spéciales",
      "B43": "Instruments d'écriture ou de dessin; accessoires de bureau",
      "B44": "Arts décoratifs",
      "B60": "Véhicules en général",
      "B61": "Chemins de fer",
      "B62": "Véhicules terrestres se déplaçant autrement que sur des rails",
      "B63": "Navires ou autres embarcations; équipement connexe",
      "B64": "Aéronefs; aviation; cosmonautique",
      "B65": "Transport; emballage; stockage; manutention des matériaux fins ou filamenteux",
      "B66": "Levage; levage; halage",
      "B67": "Ouverture ou fermeture de bouteilles, bocaux ou récipients similaires; manipulation des liquides",
      "B68": "Sellerie; garnissage",
      "B81": "Technologie microstructurale",
      "B82": "Nanotechnologie",
      "B99": "Sujets non prévus dans cette section",
      "C01": "Chimie inorganique",
      "C02": "Traitement de l'eau, des eaux usées, des boues ou des boues",
      "C03": "Verre; laine minérale ou de laitier",
      "C04": "Ciments; béton; pierre artificielle; céramiques; réfractaires",
      "C05": "Engrais; fabrication de ceux-ci",
      "C06": "Explosifs; allumettes",
      "C07": "Chimie organique",
      "C08": "Composés macromoléculaires organiques; leur préparation ou traitement chimique; compositions basées sur ceux-ci",
      "C09": "Colorants; peintures; vernis; résines naturelles; adhésifs; compositions; non prévues ailleurs; applications de matériaux non prévues ailleurs",
      "C10": "Industries du pétrole, du gaz ou du coke; gaz techniques contenant du monoxyde de carbone; combustibles; lubrifiants; tourbe",
      "C11": "Huiles animales ou végétales, graisses, substances grasses ou cires; acides gras de ceux-ci; détergents; bougies",
      "C12": "Biochimie; bière; spiritueux; vin; vinaigre; microbiologie; enzymologie; mutation ou génie génétique",
      "C13": "Industrie du sucre",
      "C14": "Peaux, cuirs ou peaux",
      "C21": "Métallurgie du fer",
      "C22": "Métallurgie; alliages ferreux ou non ferreux; traitement des alliages ou des métaux non ferreux",
      "C23": "Revêtement de matériau métallique; revêtement de matériau avec matériau métallique; traitement chimique de surface; traitement par diffusion du matériau métallique; inhibition de la corrosion du matériau métallique",
      "C25": "Procédés électrolytiques ou électrophorétiques; appareils pour cela",
      "C30": "Croissance des cristaux",
      "D01": "Fils ou fibres naturels ou artificiels; filature",
      "D02": "Fils; finition mécanique des fils ou des cordes; ourdissage ou ourdissoir",
      "D03": "Tissage",
      "D04": "Tressage; fabrication de dentelles; tricotage; garniture; tissus non tissés",
      "D05": "Couture; broderie; tuftage",
      "D06": "Traitement des textiles ou similaires; blanchisserie; matériaux flexibles non prévus ailleurs",
      "D07": "Produits de corde, câble ou autre matériau fibreux ou filamenteux",
      "D21": "Fabrication de papier; production de cellulose",
      "D99": "Sujets non prévus dans cette section",
      "E01": "Construction de routes, chemins de fer ou ponts",
      "E02": "Génie hydraulique; fondations; déplacement de sols",
      "E03": "Approvisionnement en eau; égouts",
      "E04": "Construction de bâtiments",
      "E05": "Serrures; clés; ferrures de fenêtre ou de porte; coffres-forts",
      "E06": "Portes, fenêtres, volets ou stores, en général; échelles",
      "E21": "Forage de la terre ou des roches; exploitation minière",
      "E99": "Sujets non prévus dans cette section",
      "F01": "Machines ou moteurs en général; installations de moteurs en général; machines à vapeur",
      "F02": "Moteurs à combustion; installations de moteurs à gaz chaud ou de produits de combustion",
      "F03": "Machines ou moteurs pour liquides",
      "F04": "Machines à déplacement positif pour liquides; pompes",
      "F15": "Actionneurs à pression de fluide; hydraulique ou pneumatique en général",
      "F16": "Éléments ou unités d'ingénierie; mesures générales pour produire et maintenir le fonctionnement efficace des machines ou des installations; isolation thermique en général",
      "F17": "Stockage ou distribution de gaz ou de liquides",
      "F21": "Éclairage",
      "F22": "Production de vapeur",
      "F23": "Appareils de combustion; procédés de combustion",
      "F24": "Chauffage; cuisinières; ventilation",
      "F25": "Réfrigération ou refroidissement; systèmes de chauffage et de réfrigération combinés; systèmes de pompe à chaleur",
      "F26": "Séchage",
      "F27": "Fours; fours industriels; récipients à distillation",
      "F28": "Échange de chaleur en général",
      "F41": "Armes",
      "F42": "Munitions; explosions",
      "F99": "Sujets non prévus dans cette section",
      "G01": "Mesurage; essais",
      "G02": "Optique",
      "G03": "Photographie; cinématographie; techniques analogues utilisant des ondes autres que des ondes optiques; électrographie; holographie",
      "G04": "Horlogerie",
      "G05": "Contrôle; régulation",
      "G06": "Informatique; calcul; comptage",
      "G07": "Dispositifs de contrôle",
      "G08": "Signalisation",
      "G09": "Éducation; cryptographie;",
      "G10": "Instruments de musique; acoustique",
      "G11": "Stockage d'informations",
      "G12": "Détails des instruments",
      "G21": "Physique nucléaire; génie nucléaire",
      "G99": "Sujets non prévus dans cette section",
      "H01": "Éléments électriques de base",
      "H02": "Génération, conversion ou distribution de l'énergie électrique",
      "H03": "Circuits électroniques de base",
      "H04": "Technique de communication électrique",
      "H05": "Techniques électriques non prévues ailleurs",
      "H99": "Sujets non prévus dans cette section",
      "Y02": "Technologies ou applications pour la mitigation ou l'adaptation au changement climatique",
      "Y04": "Technologies de l'information ou de la communication ayant un impact sur d'autres domaines technologiques",
      "Y10": "Sujets techniques couverts par d'anciennes collections d'art de référence croisée de l'USPC [XRAC] et des digests",
      "Y99": "Étiquetage général des nouveaux développements technologiques; étiquetage général des technologies transversales couvrant plusieurs sections de la CIP; sujets techniques couverts par d'anciennes collections d'art de référence croisée de l'USPC et des digests"
  };
});

const getCPCTitle = (category) => {
  if (cpcJson.value) {
    return cpcJson.value[category];
  }
  return '';
};

const validateForm = async () => {
  errorMessage.value = '';

  if (!claim.value || !description.value) {
    errorMessage.value = 'Tous les champs sont nécessaires';
    return false;
  }
  isPredictEmpty.value = false;

  // Clear previous results
  results.value = null;
  shapImages.value = {};
  htmlContent.value = '';
  loadingStatus.value = 'Prédiction en cours...';
  
  // Open WebSocket connection
  websocket.value = new WebSocket('ws://localhost:8000/shap');
  
  websocket.value.onopen = () => {
    websocket.value.send(JSON.stringify({
      publicationDate: publicationDate.value,
      claim: claim.value,
      description: description.value,
      modelType: modelType.value,
    }));
  };

  websocket.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.status === 'loading') {
      loadingStatus.value = 'Chargement en cours...';
    } else if (data.status === 'complete') {
      results.value = data.predicted_categories;
      shapImages.value = data.shap_images;
      htmlContent.value = data.html_content;
      loadingStatus.value = 'Prédiction terminée';
    } else if (data.status === 'error') {
      errorMessage.value = data.message;
    }
  };

  websocket.value.onclose = () => {
    console.log('WebSocket closed');
  };

  websocket.value.onerror = (error) => {
    console.error('WebSocket error:', error);
    errorMessage.value = 'Erreur de communication WebSocket';
  };
  
  return true;
};

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<style scoped>
form label {
  display: flex;
  justify-content: center;
  padding-top: 15px;
  font-size: larger;
}

form button {
  display: grid;
  margin-top: 50px;
  background-color: hsla(200, 100%, 37%, 1);
  color: white;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: large;
  border: 1px solid var(--color-text);
  cursor: pointer;
  transition: 0.5s ease;
}

form button:hover {
  background-color: rgb(119, 210, 255);
}

form textarea {
  background-color: var(--color-background);
  border-radius: 5px;
  padding: 10px;
  color: var(--color-text);
  font-size: medium;
}

form select, form textarea, form input[type="date"] {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: 'Montserrat', sans-serif;
}

form {
  padding: 0 25px;
  display: grid;
  align-items: center;
  text-align: center;
}

.error {
  color: red;
}

.main-container {
  display: flex;
}

.main-left, .main-right {
  width: 50%;
  background-color: var(--color-background);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: var(--color-text);
  padding: 20px;
}

.vertical-line {
  border-left: 1px solid var(--color-border);
  height: auto;
}

.main-right h2 {
  text-align: center;
  padding: 20px 0;
  font-size: x-large;
}

.main-right h3 {
  text-align: center;
  padding-top: 20px;
  font-size: large;
  color: gray;
}

.cpc-1 {
  display: flex;
  background-color: hsla(200, 100%, 37%, 1);
  border-radius: 5px;
  text-align: center;
  color: white;
  padding: 10px 20px;
  margin: 10px 0;
  justify-content: center;
  align-items: center;
}

img {
  max-width: 100%;
  margin-top: 10px;
}
</style>
