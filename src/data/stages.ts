import type { Stage } from '../types/game';

export const stages: Stage[] = [
  {
    id: 1,
    name: 'Porto Vecchio',
    lat: 39.7935,
    lng: 18.3548,
    proximityRadius: 50,
    hint: 'Tutto inizia dove le barche dei pescatori dormono la notte. Cerca il molo più antico, quello dove il tufo è mangiato dal sale.',
    puzzle: {
      type: 'quiz',
      question: 'Ferruccio nascondeva le stecche nelle barche. Ma quanti mari puoi vedere da questo porto?',
      options: ['Uno', 'Due', 'Tre', 'Nessuno'],
      correctIndex: 1
    },
    acceptedAnswers: ['due', '2'],
    storyFragment: '"Il porto era casa mia. Conoscevo ogni barca, ogni nodo, ogni corrente. Qui ho nascosto il primo pezzo della mappa, sotto la terza bitta di ormeggio contando da levante. Chi vuole trovarla dovrà guardare dove il sole non arriva mai."',
    points: 100
  },
  {
    id: 2,
    name: 'Lungomare Colombo',
    lat: 39.7942,
    lng: 18.3558,
    proximityRadius: 50,
    hint: "Cammina dove i signori dell'800 passeggiavano al tramonto. La strada è intitolata a chi scoprì un mondo nuovo.",
    puzzle: {
      type: 'text',
      question: 'Le ville liberty sul lungomare hanno balaustre e ringhiere particolari. Durante quale guerra furono smontate per farne armi?'
    },
    acceptedAnswers: ['seconda guerra mondiale', 'seconda', 'wwii', 'ww2', '2 guerra mondiale', 'II guerra mondiale'],
    storyFragment: '"Le ville dei signori... ci passavo davanti ogni notte con il carico sulle spalle. Loro dormivano, io lavoravo. Ho nascosto tre monete d\'oro nella fontanella accanto alla villa con i leoni di pietra. Nessuno guarda mai sotto l\'acqua."',
    points: 100
  },
  {
    id: 3,
    name: 'Le Ville',
    lat: 39.7950,
    lng: 18.3540,
    proximityRadius: 60,
    hint: 'Cercate le case che sembrano uscite da un sogno moresco. I ricchi venivano qui quando Leuca era la Costa Azzurra del Sud.',
    puzzle: {
      type: 'anagram',
      question: 'Riordina queste lettere per trovare lo stile architettonico di queste ville: BYTREYL'
    },
    acceptedAnswers: ['liberty'],
    storyFragment: '"Il padrone di Villa Meridiana mi pagava per portargli il tabacco turco — il migliore. Diceva che era per gli ospiti importanti. In realtà lo fumava da solo, di notte, sul terrazzo. Sotto quel terrazzo ho lasciato il secondo pezzo della mappa."',
    points: 100
  },
  {
    id: 4,
    name: 'Cascata Monumentale',
    lat: 39.7962,
    lng: 18.3542,
    proximityRadius: 50,
    hint: "Dove l'acqua dolce della Puglia intera finisce il suo viaggio e si tuffa nel mare. Conta i gradini se hai fiato.",
    puzzle: {
      type: 'math',
      question: 'La scalinata ha circa 296 gradini. Se Ferruccio saliva 4 gradini ogni secondo, quanti secondi impiegava a salire tutta la scalinata?'
    },
    acceptedAnswers: ['74'],
    storyFragment: '"L\'acquedotto arrivò nel \'39. Prima di quello, noi contrabbandieri usavamo le cisterne sotto la scalinata come deposito. Nessuno controllava mai là — troppa fatica salire e scendere. Il terzo pezzo è nella vasca, dietro la colonna."',
    points: 100
  },
  {
    id: 5,
    name: 'Colonna Mariana',
    lat: 39.7972,
    lng: 18.3535,
    proximityRadius: 40,
    hint: 'Sali fino in cima, dove la Madonna guarda il mare da quasi 400 anni. Un grande piazzale con colonnato ti aspetta.',
    puzzle: {
      type: 'quiz',
      question: 'La colonna con la statua della Madonna fu voluta nel 1694 da un Duca. Di quale casata?',
      options: ["D'Aragona", "De' Medici", 'Borbone', 'Sforza'],
      correctIndex: 0
    },
    acceptedAnswers: ["d'aragona", 'aragona', 'daragona'],
    storyFragment: '"Dalla piazza vedevo tutto: il porto, le barche della Finanza, le luci dei miei compagni sulla costa. Bastava un segnale con la lanterna e sapevamo se la via era libera. Il quinto pezzo l\'ho messo dove la Madonna non guarda — dietro la base della colonna, lato nord."',
    points: 100
  },
  {
    id: 6,
    name: 'Basilica de Finibus Terrae',
    lat: 39.7975,
    lng: 18.3530,
    proximityRadius: 40,
    hint: "La chiesa dove finisce la terra. Costruita dove prima c'era un tempio pagano. Dicono che San Pietro sia passato proprio di qui.",
    puzzle: {
      type: 'text',
      question: "Il nome latino 'De Finibus Terrae' significa qualcosa di preciso. Traducilo in italiano (3 parole)."
    },
    acceptedAnswers: ['ai confini della terra', 'alla fine della terra', 'confini della terra', 'fine della terra'],
    storyFragment: '"Mia madre mi portava qui da bambino, ogni domenica. Pregava che smettessi con il contrabbando. Non ho mai smesso, ma non ho mai smesso nemmeno di entrare in chiesa prima di ogni viaggio. Sotto la panca in fondo a sinistra, c\'è il sesto pezzo."',
    points: 100
  },
  {
    id: 7,
    name: 'Il Faro',
    lat: 39.7978,
    lng: 18.3522,
    proximityRadius: 50,
    hint: '47 metri di pietra bianca, 254 gradini a chiocciola, visibile a 50 km. Costruito dove prima c\'era una torre saracena.',
    puzzle: {
      type: 'math',
      question: 'Il faro è alto 47 metri dal suolo ma si trova a 102 metri sul livello del mare. A che altitudine si trova la base del faro?'
    },
    acceptedAnswers: ['55', '55 metri', '55m'],
    storyFragment: '"Il faro era il mio nemico e il mio amico. Di notte, quando la luce rossa girava verso Ugento, avevo esattamente 30 secondi di buio per passare con la barca sotto le rocce. Il settimo pezzo è dove la luce rossa non arriva mai — il punto cieco del guardiano."',
    points: 100
  },
  {
    id: 8,
    name: 'Punta Ristola',
    lat: 39.7922,
    lng: 18.3470,
    proximityRadius: 60,
    hint: "Il vero tacco d'Italia — più a sud del faro, più a sud di tutto. Da qui vedi le Tre Porte e senti il mare che entra nelle grotte.",
    puzzle: {
      type: 'quiz',
      question: 'A 85 metri sotto il mare davanti a Punta Ristola giace il relitto di un sommergibile italiano della WWII. Come si chiamava?',
      options: ['Pietro Micca', 'Leonardo da Vinci', 'Evangelista Torricelli', 'Enrico Toti'],
      correctIndex: 0
    },
    acceptedAnswers: ['pietro micca'],
    storyFragment: '"Punta Ristola era il punto di scambio. Le barche dalla Grecia arrivavano di notte, scaricavano e ripartivano prima dell\'alba. L\'ottavo pezzo è sotto la scultura della nuotatrice, quella che guarda verso l\'Africa. Quasi ci siamo."',
    points: 100
  },
  {
    id: 9,
    name: 'Grotta del Diavolo',
    lat: 39.7918,
    lng: 18.3462,
    proximityRadius: 70,
    hint: "L'ultima tappa è dove i diavoli facevano rimbombare le pareti. 40 metri di lunghezza, 17 di larghezza, dritta verso il mare. L'ingresso è sul dorso della roccia.",
    puzzle: {
      type: 'text',
      question: "Nel 1871, Ulderico Botti trovò qui reperti del Neolitico. Ora assembla i 9 frammenti del diario: qual è l'ultima parola che Ferruccio scrisse nel taccuino? (Indizio: è il nome di sua madre)"
    },
    acceptedAnswers: ['addolorata', 'maria', 'concetta'],
    storyFragment: '"Qui finisce la corsa. Il carico vero non erano le sigarette — erano le monete d\'oro che mio nonno aveva portato da Corfù nel 1920. Le ho nascoste qui, nella grotta che tutti temevano. Nessuno ha mai avuto il coraggio di cercarle. Fino a oggi. Bravi, \'picciriddhi\'. Il tesoro è vostro."\n\n— Ferruccio \'il Greco\' Cataldo, 14 marzo 1971',
    points: 200
  }
];
