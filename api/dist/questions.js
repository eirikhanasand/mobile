const Questions = [
    // Categories: either Kind or Bold, and either NTNU or default not NTNU 
    {
        title_no: "{player}, hvis du kunne dratt hvor som helst i verden, hvor ville du dratt og hvorfor?",
        title_en: "{player}, if you could travel anywhere in the world, where would you go and why?",
        categories: ["Kind"],
    },
    {
        title_no: "{player}, hva er den rareste drømmen du har hatt?",
        title_en: "{player}, what is the weirdest dream you've had?",
        categories: ["Kind"],
    },
    {
        title_no: "{player}, hvis du hadde vært en hund, hva slags rase ville du vært?",
        title_en: "{player}, if you were a dog, what breed would you be?",
        categories: ["Kind"],
    },
    {
        title_no: "Hvem kommer alltid for sent til forelesninger?",
        title_en: "Who is always late for lectures?",
        categories: ["NTNU", "Kind"],
    },
    {
        title_no: "Kjærlighet eller penger?",
        title_en: "Love or money?",
        categories: ["Kind"],
    },
    {
        title_no: "Hvis du kunne spist en ting resten av livet, hva ville det vært?",
        title_en: "If you could eat one thing for the rest of your life, what would it be?",
        categories: ["Kind"],
    },
    {
        title_no: "Hvis livet ditt var en film, hva ville tittelen vært?",
        title_en: "If your life was a movie, what would the title be?",
        categories: ["Kind"],
    },
    {
        title_no: "{player}, hva er den verste løgnen du har fortalt?",
        title_en: "{player}, what is the worst lie you've ever told?",
        categories: ["Bold"],
    },
    {
        title_no: "{player}, hva er det du angrer mest på?",
        title_en: "{player}, what is your largest regret?",
        categories: ["Bold"],
    },
    {
        title_no: "Hva er det værste emnet du har hatt på NTNU?",
        title_en: "What is the worst course you've had at NTNU?",
        categories: ["NTNU", "Kind"],
    },
    {
        title_no: "Hvem er mest sannsynlig til å glemme en eksamen?",
        title_en: "Who is most likely to forget an exam?",
        categories: ["NTNU", "Kind"]
    },
    {
        title_no: "{player}, hvis du kunne hatt en superkraft, hvilken ville det vært?",
        title_en: "{player}, if you could have a superpower, which would it be?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hva er ditt mest pinlige øyeblikk?",
        title_en: "{player}, what is your most embarrassing moment?",
        categories: ["Bold"]
    },
    {
        title_no: "Hvem er den morsomste personen av spillerene?",
        title_en: "Who is the funniest person among the players?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hva er den verste måten du har blitt avvist på?",
        title_en: "{player}, what is the worst way you’ve been rejected?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er det mest risikofylte du har gjort?",
        title_en: "{player}, what is the riskiest thing you've ever done?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er din største hemmelighet som nesten ingen vet om?",
        title_en: "{player}, what is your biggest secret that almost no one knows?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er noe du har gjort som du aldri kunne fortalt foreldrene dine?",
        title_en: "{player}, what is something you've done that you could never tell your parents?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er den verste feilen du har gjort i løpet av studietiden din?",
        title_en: "{player}, what is the biggest mistake you've made during your studies?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "{player}, har du noen gang juksa på en eksamen eller oppgave på NTNU?",
        title_en: "{player}, have you ever cheated on an exam or assignment at NTNU?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "Hvis du skulle valgt studie på nytt, hva ville du valgt?",
        title_en: "If you could choose your studies again, what would you choose?",
        categories: ["NTNU", "Kind"]
    },
    {
        title_no: "Hvem er mest sannsynlig til å sovne i forelesning?",
        title_en: "Who is most likely to fall asleep in a lecture?",
        categories: ["NTNU", "Kind"]
    },
    {
        title_no: "Hva er det mest irriterende du vet om?",
        title_en: "What are you bigges pet peeve?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hva er det flaueste du har gjort?",
        title_en: "{player}, what is the most embarrassing thing you've done?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, har du noen skjulte talenter? Vis det!",
        title_en: "{player}, do you have any hidden talents? Show it!",
        categories: ["Kind"]
    },
    {
        title_no: "Hva er drømmejobben din?",
        title_en: "What is your dream job?",
        categories: ["Kind"]
    },
    {
        title_no: "Hva er favoritt sesongen din? Taperene er de med færrst stemmer",
        title_en: "What is your favorite season? The losers are the ones with the fewest votes",
        categories: ["Kind"]
    },
    {
        title_no: "Hvis du kunne hatt en superkraft, hva ville det vært?",
        title_en: "If you could have a superpower, what would it be?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hva er den villeste fantasien din?",
        title_en: "{player}, what is your wildest fantasy?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er den beste unnskyldningen du har brukt for å skippe forelesning?",
        title_en: "{player}, what’s the best excuse you’ve used to skip a lecture?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "{player}, hva er den lengste tiden du har gått uten søvn på grunn av skolearbeid?",
        title_en: "{player}, what's the longest you've gone without sleep because of schoolwork?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "{player}, hva er det mest skammelige du har gjort under en NTNU-forelesning?",
        title_en: "{player}, what’s the most embarrassing thing you've done during an NTNU lecture?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "Hvem her tror du er mest sannsynlig til å bli milliardær?",
        title_en: "Who here do you think is most likely to become a billionaire?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hva er det merkeligste stedet du har lest til eksamen på NTNU?",
        title_en: "{player}, what’s the strangest place you’ve studied for an exam at NTNU?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "Hvem på NTNU tror du blir den neste Steve Jobs eller Elon Musk?",
        title_en: "Who at NTNU do you think will become the next Steve Jobs or Elon Musk?",
        categories: ["NTNU", "Kind"]
    },
    {
        title_no: "{player}, har du noen gang gått på en forelesning dagen derpå? Fortell oss om det.",
        title_en: "{player}, have you ever attended a lecture the day after? Tell us about it.",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "{player}, har du noen gang løyet for å få en bedre karakter?",
        title_en: "{player}, have you ever lied to get a better grade?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "Hvem i rommet ville du unngått å ha som gruppearbeidspartner? Personen med flest stemmer taper",
        title_en: "Who in this room would you avoid having as a group project partner? The person with the most votes loses",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "{player}, har du noen gang sovnet på en offentlig plass på campus? Hvor?",
        title_en: "{player}, have you ever fallen asleep in a public space on campus? Where?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "{player}, har du noen gang lurt deg unna en gruppearbeidsoppgave?",
        title_en: "{player}, have you ever slacked off during a group project?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "{player}, hva er det mest sjokkerende du har hørt noen si under en forelesning?",
        title_en: "{player}, what’s the most shocking thing you’ve heard someone say during a lecture?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "{player}, hva er din favoritt barndomsminne?",
        title_en: "{player}, what is your favorite childhood memory?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hvis du kunne møte en kjendis, død eller levende, hvem ville det vært?",
        title_en: "{player}, if you could meet any celebrity, dead or alive, who would it be?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hvis du kunne hatt et hvilket som helst yrke, uten å tenke på penger, hva ville du valgt?",
        title_en: "{player}, if you could have any profession without worrying about money, what would you choose?",
        categories: ["Kind"]
    },
    {
        title_no: "Hva er din favoritt bok eller film, og hvorfor?",
        title_en: "What is your favorite book or movie, and why?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hva er det rareste du har søkt på nettet?",
        title_en: "{player}, what is the weirdest thing you’ve searched for online?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, har du noen gang stjålet noe? Fortell oss om det.",
        title_en: "{player}, have you ever stolen anything? Tell us about it.",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er den frekkeste meldingen du har sendt til noen? Vis den frem!",
        title_en: "{player}, what is the rudest message you’ve ever sent to someone? Show it!",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er den mest upassende tingen du har sagt i det offentlige?",
        title_en: "{player}, what is the most inappropriate thing you've said in a public setting?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, har du noen gang løyet om dine følelser for noen?",
        title_en: "{player}, have you ever lied about your feelings for someone?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, har du noen gang sendt en melding du angret på umiddelbart? Vis den!",
        title_en: "{player}, have you ever sent a message you immediately regretted? Show it!",
        categories: ["Bold"]
    },
    {
        title_no: "Hva er din favoritt hobby?",
        title_en: "What is your favorite hobby and why?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hvis du kunne tilbringe en dag hvor som helst i verden uten kostnad, hvor ville du dra?",
        title_en: "{player}, if you could spend a day anywhere in the world at no cost, where would you go?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hvis du kunne lære en ny ferdighet på en dag, hva ville det vært?",
        title_en: "{player}, if you could learn a new skill in one day, what would it be?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hva er noe du aldri blir lei av å gjøre?",
        title_en: "{player}, what is something you never get tired of doing?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hva er den rareste unnskyldningen du har gitt for å komme deg ut av en situasjon?",
        title_en: "{player}, what is the weirdest excuse you've given to get out of something?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er det mest risikofylte du har gjort for moro skyld?",
        title_en: "{player}, what is the riskiest thing you've done just for fun?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, har du noen gang gjort noe du skammer deg over for penger? Fortell oss om det.",
        title_en: "{player}, have you ever done something you're ashamed of for money? Tell us about it.",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er den mest forbudte tanken du har hatt, men aldri fortalt noen?",
        title_en: "{player}, what is the most forbidden thought you've had but never told anyone?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, har du noen gang vært betatt av en lærer eller sjef? Fortell oss om det.",
        title_en: "{player}, have you ever had a crush on a teacher or boss? Tell us about it.",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er den største tabben du har gjort i en romantisk situasjon?",
        title_en: "{player}, what’s the biggest mistake you’ve made in a romantic situation?",
        categories: ["Bold"]
    },
    {
        title_no: "Hva er din favoritt ting med å være student ved NTNU?",
        title_en: "What’s your favorite thing about being a student at NTNU?",
        categories: ["NTNU", "Kind"]
    },
    {
        title_no: "Hva er din favoritt ting med å være student ved NTNU?",
        title_en: "What’s your favorite thing about being a student at NTNU?",
        categories: ["NTNU", "Kind"]
    },
    {
        title_no: "Hvem tror du har den beste sjansen til å bli foreleser på NTNU?",
        title_en: "Who do you think is most likely to become a lecturer at NTNU?",
        categories: ["NTNU", "Kind"]
    },
    {
        title_no: "{player}, hva er det lateste du har gjort for å få bestått på en oppgave?",
        title_en: "{player}, what’s the laziest thing you’ve done to pass an assignment?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "Hva er den dårligste karakteren du har fått på en NTNU eksamen",
        title_en: "What is the worst grade you've gotten on an NTNU exam?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "Hva er det mest skandaløse ryktet du har hørt om en professor?",
        title_en: "What’s the most scandalous rumor you’ve heard about a professor?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "{player}, hvis du kunne få en hvilken som helst gave akkurat nå, hva ville det vært?",
        title_en: "{player}, if you could receive any gift right now, what would it be?",
        categories: ["Kind"]
    },
    {
        title_no: "Har du noen gang betalt noen for å gjøre en oppgave/innlevering for deg?",
        title_en: "Have you ever paid someone to do an assignment for you?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hva er noe du elsker å gjøre som ingen vet om?",
        title_en: "{player}, what’s something you love to do that no one knows about?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hva er den fineste komplimentet du noen gang har fått?",
        title_en: "{player}, what is the nicest compliment you’ve ever received?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hvis du kunne vært hvilken som helst karakter i en film, hvem ville du vært?",
        title_en: "{player}, if you could be any character from a movie, who would you be?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hva er den verste avgjørelsen du har tatt, og angrer på?",
        title_en: "{player}, what’s the worst decision you’ve made and regret?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er den dummeste unnskyldningen du har gitt til noen?",
        title_en: "{player}, what’s the dumbest excuse you’ve given to someone?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er det skumleste du har gjort, men aldri fortalt noen om?",
        title_en: "{player}, what’s the scariest thing you’ve done but never told anyone about?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, har du noen gang ignorert en god venn på grunn av en dum grunn? Hva var det?",
        title_en: "{player}, have you ever ignored a good friend for a dumb reason? What was it?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, har du noen gang fortalt en hvit løgn til noen for å unngå problemer? Hva skjedde?",
        title_en: "{player}, have you ever told a white lie to avoid trouble? What happened?",
        categories: ["Bold"]
    },
    {
        title_no: "Hva er ditt beste tips til nye NTNU-studenter?",
        title_en: "What’s your best tip for new NTNU students?",
        categories: ["NTNU", "Kind"]
    },
    {
        title_no: "Hvis du kunne endret én ting om studieopplevelsen din ved NTNU, hva ville det vært?",
        title_en: "If you could change one thing about your experience at NTNU, what would it be?",
        categories: ["NTNU", "Kind"]
    },
    {
        title_no: "Hva er den beste sosiale aktiviteten du har deltatt på ved NTNU?",
        title_en: "What’s the best social event you’ve attended at NTNU?",
        categories: ["NTNU", "Kind"]
    },
    {
        title_no: "Hvem her er den beste studenten?",
        title_en: "Who here is the best student?",
        categories: ["NTNU", "Kind"]
    },
    {
        title_no: "{player}, har du noen gang brukt noen andres arbeid som ditt eget ved NTNU?",
        title_en: "{player}, have you ever used someone else’s work as your own at NTNU?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "{player}, hva er det sprøeste du har sett noen gjøre på campus?",
        title_en: "{player}, what’s the craziest thing you’ve seen someone do on campus?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "{player}, har du noen gang sovnet under en viktig eksamen eller forelesning?",
        title_en: "{player}, have you ever fallen asleep during an important exam or lecture?",
        categories: ["NTNU", "Bold"]
    },
    {
        title_no: "{player}, hva er noe du har lært nylig som gjorde deg glad?",
        title_en: "{player}, what’s something you’ve learned recently that made you happy?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hva ville du valgt å gjøre hvis du hadde en dag uten ansvar?",
        title_en: "{player}, what would you choose to do if you had a day with no responsibilities?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, hva er den verste teksten eller DM-en du har mottatt? Vis den!",
        title_en: "{player}, what’s the worst text or DM you’ve sent someone? Show it!",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, har du noen gang løyet om hvem du var interessert i for å unngå å bli flau?",
        title_en: "{player}, have you ever lied about who you were interested in to avoid embarrassment?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er det mest upassende tidspunktet du har ledd høyt?",
        title_en: "{player}, what’s the most inappropriate time you’ve ever laughed out loud?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er det mest risikable du har gjort for å imponere noen?",
        title_en: "{player}, what’s the riskiest thing you’ve done to impress someone?",
        categories: ["Bold"]
    },
    {
        title_no: "Hvis du kunne gå tilbake i tid og gi deg selv ett råd, hva ville det vært?",
        title_en: "If you could go back in time and give yourself one piece of advice, what would it be?",
        categories: ["Kind"]
    },
    {
        title_no: "Hvis du kunne gå tilbake i tid og gi deg selv ett råd, hva ville det vært?",
        title_en: "If you could go back in time and give yourself one piece of advice, what would it be?",
        categories: ["Kind"]
    },
    {
        title_no: "Hva er det snilleste noen har gjort for deg nylig?",
        title_en: "What’s the kindest thing someone has done for you recently?",
        categories: ["Kind"]
    },
    {
        title_no: "Hvem tror du kommer til å gjøre noe utrolig stort i fremtiden?",
        title_en: "Who do you think will do something amazing in the future?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, har du noen gang sendt en melding til feil person? Hva var det?",
        title_en: "{player}, have you ever sent a message to the wrong person? What was it?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er det dummeste du har sagt under en viktig samtale?",
        title_en: "{player}, what’s the dumbest thing you’ve said during an important conversation?",
        categories: ["Bold"]
    },
    {
        title_no: "{player}, hva er den mest upassende meldingen du har sendt til en lærer?",
        title_en: "{player}, what’s the most inappropriate message you’ve sent to a teacher?",
        categories: ["Bold", "NTNU"]
    },
    {
        title_no: "Hva er en liten ting som alltid gjør deg glad?",
        title_en: "What’s a little thing that always makes you happy?",
        categories: ["Kind"]
    },
    {
        title_no: "{player}, har du noen gang gjort noe dumt for å imponere noen?",
        title_en: "{player}, have you ever done something foolish to impress someone?",
        categories: ["Bold"]
    },
    {
        title_no: "Hva er en drøm du har som du enda ikke har delt med noen?",
        title_en: "What’s a dream you have that you haven’t shared with anyone yet?",
        categories: ["Kind"]
    }
];
export default Questions;
