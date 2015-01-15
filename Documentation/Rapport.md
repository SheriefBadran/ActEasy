# Rapport

## Demonstrationsvideo
[Klicka här för att se demonstrationsvideon ](https://www.youtube.com/watch?v=S7NIj3FYow8&feature=youtu.be)
[Klicka här för att komma till applikationen easyact ](http://easyact-portfolio80.rhcloud.com)

## Möjlighet
Mängder av mjukvaruutvecklare genererar hundratusentals små appar som förser kunden med alltför snäv information, vilken heller inte följs upp med
omedelbara möjligheter att snabbt utföra sina vardagsärenden.  Det stora utbudet leder till problem med ett rörigt utbud och dålig kundservice.
Kunden behöver relevant information som följs av möjligheter att snabbt hitta roliga aktiviteter, uträtta ärenden, boka och köpa.
Tjänsten bör också ligga i anslutning till kundens geografiska närområde och vara skräddarsydd för användarens individuella behov.
En sådan tjänst samlar med fördel kategorierna nöje, kommunikation, produktivitet, resor och livsstil i en applikation.

Detta är ett **problem** som redan 2009 definierades av **Gartner** enligt följande:
**“5% av 30 miljoner nerladdade iphone-applikationer används efter en månad”.**
Detta är ett kundbeteende snarare än en trend.

## Kunden
* Får kort och snabb kommunikation samt effektiv informationstillgänglighet.
* Får nyttofunktioner som ligger i koppling till varje kunds geografiska närområde.
* Kan enkelt och snabbt hitta nöjesaktiviteter, uträtta vardagliga ärenden samt tillgå bokningssystem och köpmöjligheter i en paketlösning.
* Får **en** applikation av **en** utvecklare vilket leder till bra **kundservice** och **trygghet**.

Ovanstående vision är bakgrunden till min projektidé.

## Indledning

Easyact är en applikation som är tänkt att kunna användas både från desktop och mobil enhet.
Så fort användaren surfar in på applikationen så tar den reda på var användaren befinner sig.

I nästa steg går applikationen till databasen och hämtar aktiviteter som finns i närheten av användaren.
Aktiviteterna prioriteras/värdesätts sedan med avseende på rådande väder. Detta presenteras sedan i en lista som är sorterad på framtagen prioritetsordning.
Användaren kan välja att filtrera listan på inomhusaktiviteter, utomhusaktiviteter eller alla (grundinställning).

Användaren kan klicka på en enskild aktivitet för att få se detaljer. Den detaljerade vyn består av mer detaljerad data om aktiviteten samt en karta
som visar var användaren befinner sig i förhållande till var aktiviteten finns, hur lång sträcka det är till aktiviteten samt hur lång tid det tar att ta
sig dit (med bil). De aktiviteter som har bokningsmöjligheter på egen webbplats har en knapp som leder dit.

För närvarande fungerar applikationen bäst i webbläsarna Chrome och Safari.

## Schematisk Bild


## Serversida
Serversidan är byggd i nodejs med ramverket **Express**. Koden är uppdelad i tre olika modulkategorier - models, routes och config.
Models innehåller en modul för varje modell - schema som skapats med hjälp av ramverket **mongoose**.
Med ett schema kan man sedan skapa ett modellobjekt med vilket man gör förfrågningar mot databasen.

Routes innehåller två moduler, en som tillhandahåller ett rest api för hämtning av aktiviteter och en för oauth 2 autentisering.

Jag är klart medveten om att uppdelning och organisering av moduler kan ske på ett mycket bättre sätt än nuvarande uppdelning.
T.ex borde koden som frågar SMHI om data vara löst kopplat till activityRouts. activityRoutes ska inte bry sig om vilket väderapi det
sker förfrågningar emot. För kommunikation med SMHI och mongoDB (GeoSpatialQueries) används ramverkem **request och async**.

Väderdatat **cachas** i en en mongodatabas under samlingen user. Väderdatat binds alltså till användaren som gjort aktivitetsförfrågan.
Väderdatat ska **uppdateras ca var tionde minut.**

Servern innehåller också en särskild modul som utgör prioritetsalgoritmen. När servern hämtat ut alla aktiviteter från databasen skickas dessa tillsammans med väderdatat till prioritetsalgoritmen som sätter en poäng på aktiviteten. Poängen beror på hur lämpad aktiviteten är för rådande väder.
Aktivitetsmodulen returnerar sedan alla aktiviteter poängsatta och klara för att skickas till klienten.

Servern tar i huvudsak hand om följande fel:

* SMHI api går ner.
* Misslyckade databasförfrågningar.

## Klientsida

Klientsidan är skriven med **Angular.js.** Projektet är genererat med yeoman angular generator, som ger en väldigt trevlig utvecklingsmiljö när allt fungerar som det ska.

Klientsidan har som ansvar att att med hjälp av geolocation slå upp vart användaren befinner sig och skicka positionen i ett http anrop till servern. Klienten förväntar sig ett att få tillbaka en array med aktivitetsobjekt som där aktiviteterna sorteras i storlektsordning med avseende på hur många poäng de har. Aktiviteter med flest poäng hamnar högst upp i listan. Användaren kan välja att se inomhus-, utomhus- samt alla aktiviteter.

Om användaren är inloggad med google oauth och tappar sin anslutning till internet, får användaren reda på detta och kan fortsätta bläddra bland aktiviteterna.
Detta märks särskilt tydligt om användaren i inloggat läge är inne på en detaljerad aktivitetsvy, förlorar sin uppkoppling och backar tillbaka till aktivitetslistan.
Användaren görs då uppmärksam på att det saknas internet anslutning. Användaren har fortsatt tillgång till aktiviteterna, men väljer användaren att titta på en ny aktivitet så visas istället den senast visade, vilket betyder att offline funktionaliteten inte ännu är implementerad fullt ut.

Exempel på fel som hanteras är om klienten tar emot data i form av ogiltig json, JSON.parse kastar ett undantag som fångas och hanteras med att
användaren fått reda på att något gått fel.

## Säkerhet

### xss
* I nuvarande form tillåter inte applikationen någon input från användaren vilket gör att risken för xss minskar.
Hade jag haft input med “two way binding” så hade all input som hamnat i ett angular expression kommit ut som en sträng.
* Jag använder endast vyer/templates från klienten.
* Jag kör JSON.parse mot all json data som kommer från servern.

### CSRF
Jag har inte något implementerat skydd mot **CSRF.** Dock har jag läst i dokumentationen att angular i ramverket underlättar implementationen av **CSRF.**

## Prestanda

* Med grunt - task handler utförs en build av hela projektet innan push till open shift servern. Min build konkatinerar, minifierar och uglyfierar alla klientfiler.
* Prestandan förbättras förmodligen av att jag inte gör några egna DOM manipuleringar/operationer i det avseendet att jag själv skapar nya html element som läggs in i domträdet. Istället används templates. När listan filtreras sker allt väldigt snabbt med de angular direktiv som styr och låter processer ske med “two way binding”.
* **Offline-first** är till viss del implementerad. Bristerna beskrivs under rubriken Klientsida. Implementationen för detta består av en cache manifest fil där jag listar alla filer som skall cachas. Vid varje lyckat http anrop till servern cachas responsen till local storage där datat finns att tillgå när anslutningen till internet ligger nere.
Jag undersöker om klienten är uppkopplad genom att använda HTML 5 navigator.onLine. Denna metod har ett antal nackdelar. Webbläsarstödet är tveksamt då det fungerar annorlunda i t.ex. firefox desktop webbläsare än i andra webbläsare. Det finns heller inte stöd i äldre webbläsare. Ytterligare ett problem är att navigator.onLine inte rapporterar false om en enhet är uppkopplad mot något intranät men förlorat anslutning till internet.
Jag gjorde dock många försök att i något av angulars $http.get() promises (exempelvis i error) fånga upp att det saknas anslutning och hantera problemet där, men lyckades ej. Ett annat alternativ hade varit att använda websockets för att pinga mot servern och på det sättet upptäcka om användaren gått offline. Detta är också stabilare än min implementation men med brist på tid hann jag helt enkelt inte med en sådan implementation.
Dock är något av de två sistnämnda alternativen mest intressanta på lång sikt.

## Reflektion

Projektet i webbteknik 2 har varit väldigt roligt och givande. Jag har kunnat jobba med något som verkligen intresserat mig. Väldigt uppenbart är att jag har lärt mig väldigt mycket, vilket inte bara har varit roligt utan också extremt stressande. Jag har länge velat utmana mig med att jobba i en yeoman genererad miljö. Yeoman angular är en automatiserad miljö där man enkelt kan göra en project build, men också skapa filer på ett dynamiskt sätt.
Med hjälp av bower kan man installera ytterligare moduler till angular.

Det har varit inspirerande och lärorikt att jobba i en yeoman miljö men samtidigt har det slukat massor av tid då problem uppstår. Följande **problem** har uppstått:

* Jag hade stora problem att få grunt server på port 9000 att kunna köras parallellt med min nodejs server på port 8000. Det uppstod CORS problem som gjorde att jag inte kunde köra grunt serve. Detta löste jag genom att tillåta CORS på nodejs servern i “development mode”.
* När jag körde grunt build ville inte mina partial views komma med i mappen dist över huvud taget. Mycket tid gick åt till att förstå hur jag skulle ändra inställningarna i Gruntfile för att problemet skulle lösas. Jag var tvungen att göra ändringar på flera ställen.
* Grunt build kraschade med konstiga felmeddelanden som jag inte förstod. Efter många timmars undersökande fann jag att ett felmeddelande under en build löstes genom att i terminalen köra Bower install. Av någon anledning tyckte grunt att det plötsligt fattades något i bower-components.
* Jag har haft problem med att nodejs är så pass versionskänsligt. Jag ägnade en heldag till att försöka göra en deploy till min open shift server. Detta misslyckades eftersom att jag med ett misstag råkat installera en något äldre version av mongoose på open shift än lokalt. Det svåra med att upptäcka felet var att jag från början inte visste hur man debuggar fel som uppstår på open shift. Först när jag körde ett debug kommando i terminalen kunde jag spåra felet.
* Ytterligare ett deployproblem uppstod då jag skulle pusha upp min första lyckade implementation av google oauth 2. Jag har avsiktligt sparat bortkommenterad kod i filen activity.js. Där finns metoden loadData som kördes och fungerade helt utmärkt lokalt. På open shift kraschade applikationen. Jag ägnade ca 6 timmar åt att lösa problemet, vilket löstes genom att flytta loadData till resolve delen av en route i filen app.js.
* Det tog pinsamt lång tid att implementera Google OAuth2. Många problem uppstod på vägen. Det är första gången jag försöker hantera **inloggning** tillsammans på en **single page application**.
* Har ej lyckats dölja och visa login länken beroende på om man är inloggad eller inte. Har inte fått till det i angular.

## Utvecklingspotential

Följande kan göras för att vidareutveckla Easyact:

* Där användaren filtrerar mellan att se utomhus-, inomhus- och alla aktiviteter skall det även finnas en flik vilken går till en vy som visar en karta med alla aktiviteter.
* I applikationens nuvarande form är väderdatat väldigt momentant. Det skulle göra mycket att samla data om hur vädret har varit under en period och även använda en framtidsprognos för att värdera en viss aktivitets lämplighet just nu. Att titta på hur vädret har varit är exempelvis intressant för aktiviteter som kräver att det ligger en viss mängd snö på marken. En väderprognos är mycket viktigt för många utomhusaktiviteter.
* Med hänsyn till ovanstående punkt behöver även prioritetsalgoritmen förbättras. Det tog mycket tid att fundera ut hur algoritmen skulle fungera vilket förklarar att den är ganska slarvigt skriven. En sådan algoritm kan aldrig bli tillräckligt bra. Något man kan jobba med i åratal. Algoritmen är ju också i högsta grad levande under den tid applikationen utvecklas som mest.
* Skapa ett gränssnitt för att låta användare själva lägga till aktiviteter till databasen.
* I så stor utsträckning som möjligt inleda samarbete med aktivitetsarrangörer av olika slag för att förbättra applikationen på många plan. Jag är då ute efter bokningsmöjligheter och även köp om så krävs.
* Applikationen behöver bilder på aktiviteterna.
* Användaren ska kunna styra sökradien runt sig själv.
* En fullt fungerande offline-first lösning.
* Användaren ska kunna betygsätta och eventuellt kommentera aktiviteter.
* En spinner och ett meddelande som visas då det dröjer att ladda aktiviteter.
* Färga border som avgränsar och omger varje del i listvyn till en grön nyans som används i färgtemat.
Egentligen finns det hur mycket utvecklingspotential som helst, det är fantasin som sätter gränsen.

## Risker
* Inloggningen sker inte med en ssl anslutning.
* Applikationen saknar implementation av **CSRF**. Både login knappen och rest api förfrågningar kan vara sköra mål för en attack och bör åtgärdas innan lansering.
* Applikationen är just nu i ett lite för rörigt skick och behöver en hel del refaktorering. Detta för att minska risken för misstag och buggar.
* Har insett att geolocation inte är optimalt för att ta reda på användarens nuvarande plats. Om användaren väljer att neka till positionering med not now i firefox eller kryssa ner dialogrutan i chrome,
  finns det vad jag vet inget sätt att kolla att användaren nekar och användaren får aldrig se aktivitetslistan. Vet ännu ej riktigt hur jag ska lösa detta.
* Generellt behöver applikationen bättre hantering av möjliga fel som kan uppstå både på server och klient.

## Betygshöjande moment.
Jag tycker att följande borde räknas som betygshöjande:
* Att jag antagit utmaningen att jobba i en yeoman genererad miljö, vilket har varit en stor utmaning för mig och även ett mycket stort riskmoment. En sådan miljö är väldigt kraftfull och smidig att jobba ju mer man lär sig hantera vissa problem och göra vissa “tweeks” när det behövs.
* Att jag antagit utmaningen att jobba i **angularjs** som är helt nytt för mig, och som jag har upplevt som ganska svårt att lära sig under den tidspress som varit.
* Att jag skapat en **single page application**, och implementerat **Google Oauth 2** har varit en utmaning i allra högsta grad.
* Att jag valt **nodejs** som serverspråk och gjort ett ordentligt försök att dela upp koden i node moduler. Jag har också försökt tillämpa nya kunskaper om hur middlewares fungerar tillsammans med Express. Det är första gången jag provar dessa saker.

