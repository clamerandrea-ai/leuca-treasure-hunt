import type { Stage } from '../types/game';

export const GAME_MASTER_PHONE = '393358442641';

// Route A (Taccuino Nero): Porto > ovest lungo il lungomare > ville > Cristo Re > Gnam > est verso Cascata/collina > sud
export const ROUTE_A = [1, 2, 3, 4, 5, 9, 6, 7, 8, 10, 11];

// Route B (Taccuino Rosso): collina (Colonna/Basilica/Faro) > Cascata > Porto > ovest lungo lungomare/ville > sud
export const ROUTE_B = [7, 8, 10, 6, 1, 2, 9, 3, 4, 5, 11];

export function getRouteOrder(route: 'A' | 'B'): number[] {
  return route === 'A' ? ROUTE_A : ROUTE_B;
}

export function getStageForStep(step: number, route: 'A' | 'B'): Stage | undefined {
  const order = getRouteOrder(route);
  const stageId = order[step - 1];
  return stages.find(s => s.id === stageId);
}

export const stages: Stage[] = [
  {
    id: 1,
    name: 'Porto Vecchio',
    displayName: 'Il nodo del sale',
    lat: 39.7968,
    lng: 18.3616,
    proximityRadius: 80,
    hint: 'Tutto inizia dove le barche dei pescatori dormono la notte. Cerca il molo più antico, quello dove il tufo è mangiato dal sale.',
    puzzle: {
      type: 'text',
      question: 'Ferruccio nascondeva le stecche nelle barche. I due mari che si incontrano qui hanno nomi diversi. Scrivi i nomi di ENTRAMBI separati da una virgola.'
    },
    acceptedAnswers: ['adriatico, ionio', 'ionio, adriatico', 'mar adriatico, mar ionio', 'mar ionio, mar adriatico', 'adriatico,ionio', 'ionio,adriatico'],
    storyFragment: '"Il porto era casa mia. Conoscevo ogni barca, ogni nodo, ogni corrente. Il mare è \'amaru\' ma ti dà da vivere. Qui ho nascosto il primo pezzo della mappa, sotto la terza bitta di ormeggio contando da levante. Chi vuole trovarla dovrà guardare dove il sole non arriva mai."',
    points: 100
  },
  {
    id: 2,
    name: 'Sfida: La Pizzica dei Contrabbandieri',
    displayName: 'Sfida: Il tarantismo',
    lat: 39.7960,
    lng: 18.3595,
    proximityRadius: 50,
    hint: 'Ferruccio dice: "Prima di proseguire, dovete dimostrare che avete il sangue salentino nelle vene!" Cercate la piazzetta dove i pescatori bevono il caffe la mattina, poco oltre il molo.',
    puzzle: {
      type: 'challenge',
      question: 'Inviate il video al Game Master per ricevere il codice segreto.',
      challengeDescription: 'Trovate un gruppo di turisti o passanti e ballateci insieme la PIZZICA! Almeno 15 secondi di ballo. Filmate tutto e inviate il video.'
    },
    acceptedAnswers: ['pizzica1', 'PIZZICA1'],
    storyFragment: '"Ah, sapete ballare! Mio nonno diceva: chi non sa ballare la pizzica non merita di trovare il tesoro. Ballavamo come \'diàuli\' nelle notti di luna piena. Avanti, continuate — il prossimo indizio vi aspetta dove passeggiavano i signori."',
    points: 150
  },
  {
    id: 3,
    name: 'Lungomare Colombo',
    displayName: 'La rotta del Genovese',
    lat: 39.7963,
    lng: 18.3567,
    proximityRadius: 50,
    hint: "Cammina dove i signori dell'800 passeggiavano al tramonto. La strada è intitolata a chi scoprì un mondo nuovo.",
    puzzle: {
      type: 'math',
      question: 'Cristoforo Colombo scoprì l\'America nel 1492. La Basilica de Finibus Terrae fu completata nel 1720. Quanti anni sono passati tra i due eventi?'
    },
    acceptedAnswers: ['228'],
    storyFragment: '"Le ville dei signori... ci passavo davanti ogni notte con il carico sulle spalle. Che \'dulure\' di schiena, ma ne valeva la pena. Loro dormivano, io lavoravo. Ho nascosto tre monete d\'oro nella fontanella accanto alla villa con i leoni di pietra. Nessuno guarda mai sotto l\'acqua."',
    points: 100
  },
  {
    id: 4,
    name: 'Le Ville',
    displayName: 'Le maschere di tufo',
    lat: 39.7990,
    lng: 18.3555,
    proximityRadius: 60,
    hint: 'Cercate le case che sembrano uscite da un sogno moresco. I ricchi venivano qui quando Leuca era la Costa Azzurra del Sud.',
    puzzle: {
      type: 'anagram',
      question: 'Riordina queste lettere per trovare lo stile architettonico di queste ville: BYTREYL'
    },
    acceptedAnswers: ['liberty'],
    storyFragment: '"Il padrone di Villa Meridiana mi pagava per portargli il tabacco turco — il migliore. Diceva che era per gli ospiti importanti. In realtà lo fumava da solo, di notte, sul terrazzo. \'Ogghje\' nessuno fuma più così bene. Sotto quel terrazzo ho lasciato il secondo pezzo della mappa."',
    points: 100
  },
  {
    id: 5,
    name: 'Sfida: Foto da Contrabbandiere',
    displayName: 'Sfida: Ombre senza volto',
    lat: 39.7972,
    lng: 18.3546,
    proximityRadius: 50,
    hint: 'Ferruccio dice: "Un buon contrabbandiere sa mimetizzarsi. Dimostratemi che sapete farlo!" Cercate la chiesa dove il Cristo è Re, non lontano dalle ville dei signori.',
    puzzle: {
      type: 'challenge',
      question: 'Inviate la foto al Game Master per ricevere il codice segreto.',
      challengeDescription: 'Fate una FOTO DI GRUPPO in posa da "contrabbandieri sospetti" davanti alla chiesa o alla villa più bella che trovate. Espressioni serie, occhiali da sole, aria misteriosa!'
    },
    acceptedAnswers: ['foto1', 'FOTO1'],
    storyFragment: '"Perfetti! Sembrate proprio una banda di contrabbandieri. Ma ricordatevi: i veri contrabbandieri non si facevano mai fotografare. Solo la \'luna\' ci vedeva in faccia. Proseguite verso la cascata — là vi aspetta il prossimo segreto."',
    points: 150
  },
  {
    id: 6,
    name: 'Cascata Monumentale',
    displayName: 'La bocca della sete',
    lat: 39.7969,
    lng: 18.3669,
    proximityRadius: 50,
    hint: "Dove l'acqua dolce della Puglia intera finisce il suo viaggio e si tuffa nel mare. Conta i gradini se hai fiato.",
    puzzle: {
      type: 'math',
      question: 'La scalinata ha 296 gradini. Ferruccio saliva 4 gradini al secondo, ma ogni 50 gradini si fermava 10 secondi per controllare che nessuno lo seguisse. Quanti secondi impiegava in totale?'
    },
    acceptedAnswers: ['124'],
    storyFragment: '"L\'acquedotto arrivò nel \'39. Prima di quello, noi contrabbandieri usavamo le cisterne sotto la scalinata come deposito. Tutto era \'oscuru\' là sotto, nemmeno i topi ci vedevano. Nessuno controllava mai — troppa fatica salire e scendere. Il terzo pezzo è nella vasca, dietro la colonna."',
    points: 100
  },
  {
    id: 7,
    name: 'La Scogliera dei Contrabbandieri',
    displayName: 'I denti del diavolo',
    lat: 39.793624,
    lng: 18.358966,
    proximityRadius: 50,
    hint: 'Scendete dove le rocce si fanno aguzze e il mare morde la costa. I contrabbandieri calavano le corde di notte lungo queste pareti. Cercate il punto dove la strada finisce e inizia il sentiero verso il mare.',
    puzzle: {
      type: 'text',
      question: 'I contrabbandieri usavano le grotte lungo questa costa per nascondere il carico. Come si chiamano le grotte visibili da questo punto, dedicate a un santo pescatore?'
    },
    acceptedAnswers: ['cazzafri', 'grotte cazzafri', 'grotte di cazzafri'],
    storyFragment: '"Da questa scogliera calavo le corde fino al mare. La \'risacca\' copriva il rumore dei remi. Nessuno sentiva niente. Avevo tre punti di discesa: uno qui, uno sotto il faro, uno vicino alla grotta del diavolo. Di notte le rocce diventano nere come il peccato. Il quinto pezzo della mappa è incastrato in una fessura, dove solo le lucertole arrivano."',
    points: 100
  },
  {
    id: 8,
    name: 'Basilica de Finibus Terrae',
    displayName: "L'ultima candela",
    lat: 39.7964,
    lng: 18.3685,
    proximityRadius: 30,
    hint: "La chiesa dove finisce la terra. Costruita dove prima c'era un tempio pagano. Dicono che San Pietro sia passato proprio di qui.",
    puzzle: {
      type: 'text',
      question: "Il nome latino 'De Finibus Terrae' significa qualcosa di preciso. Traducilo in italiano (3 parole)."
    },
    acceptedAnswers: ['ai confini della terra', 'alla fine della terra', 'confini della terra', 'fine della terra'],
    storyFragment: '"Mia madre mi portava qui da bambino, ogni domenica. Pregava per la mia \'anima\'. Non ho mai smesso col contrabbando, ma non ho mai smesso nemmeno di entrare in chiesa prima di ogni viaggio. Sotto la panca in fondo a sinistra, c\'è il sesto pezzo."',
    points: 100
  },
  {
    id: 9,
    name: 'Sfida: Il Grido di Ferruccio',
    displayName: 'Sfida: La voce del Greco',
    lat: 39.7971,
    lng: 18.3586,
    proximityRadius: 50,
    hint: 'Ferruccio dice: "Siete quasi alla fine! Ma prima... una prova di coraggio!" Cercate il punto sul lungomare dove la gente si siede a mangiare con il mare davanti agli occhi.',
    puzzle: {
      type: 'challenge',
      question: 'Inviate il video al Game Master per ricevere il codice segreto.',
      challengeDescription: 'Uno di voi deve recitare ad alta voce davanti a degli sconosciuti: "IO SONO UN CONTRABBANDIERE DI LEUCA E CERCO IL TESORO DI FERRUCCIO!" e fare un inchino. Filmate la reazione della gente!'
    },
    acceptedAnswers: ['grido1', 'GRIDO1'],
    storyFragment: '"Ahahahah! Che coraggio! Nemmeno io avrei osato tanto! Il \'tiempu\' vola quando si ha coraggio. Sapete cosa diceva mio padre? Chi non ha vergogna, non ha paura. E chi non ha paura, trova il tesoro. Avanti, verso il faro!"',
    points: 150
  },
  {
    id: 10,
    name: 'Il Faro',
    displayName: 'Il ciclope bianco',
    lat: 39.7959,
    lng: 18.3684,
    proximityRadius: 30,
    hint: '47 metri di pietra bianca, 254 gradini a chiocciola, visibile a 50 km. Costruito dove prima c\'era una torre saracena.',
    puzzle: {
      type: 'math',
      question: 'Il faro è alto 47 metri dal suolo ma si trova a 102 metri sul livello del mare. A che altitudine si trova la base del faro?'
    },
    acceptedAnswers: ['55', '55 metri', '55m'],
    storyFragment: '"Il faro era il mio nemico e il mio amico. Di notte, quando la luce rossa girava verso Ugento, avevo esattamente 30 secondi di buio per passare con la barca sotto le rocce. Mai dire \'addiu\' al mare — lui torna sempre. Il settimo pezzo è dove la luce rossa non arriva mai — il punto cieco del guardiano."',
    points: 100
  },
  {
    id: 11,
    name: 'Punta Ristola — Grotta del Diavolo',
    displayName: 'La gola che urla',
    lat: 39.7896,
    lng: 18.3459,
    proximityRadius: 70,
    hint: "L'ultima tappa: il vero tacco d'Italia, più a sud di tutto. Qui i diavoli facevano rimbombare le pareti della grotta e il mare entrava ruggendo dalle Tre Porte. Ferruccio ha nascosto l'ultimo pezzo dove nessuno ha mai osato cercare.",
    puzzle: {
      type: 'text',
      question: "L'ultimo enigma di Ferruccio. In ognuno dei primi 10 frammenti del diario, Ferruccio ha nascosto una parola dialettale tra apici ('parola'). Prendi la prima lettera di ciascuna nell'ordine delle pagine del taccuino (tappa 1, 2, 3... fino a 10): scoprirai il nome della persona più importante della sua vita."
    },
    acceptedAnswers: ['addolorata'],
    storyFragment: '"Qui finisce la corsa. Il carico vero non erano le sigarette — erano le monete d\'oro che mio nonno aveva portato da Corfù nel 1920. Le ho nascoste qui, nella grotta che tutti temevano, dove i diavoli urlavano nel vento. Nessuno ha mai avuto il coraggio di cercarle. Fino a oggi. Bravi, \'picciriddhi\'. Il tesoro è vostro."\n\n— Ferruccio \'il Greco\' Cataldo, 14 marzo 1971',
    points: 200
  }
];
