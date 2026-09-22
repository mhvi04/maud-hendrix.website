---
title: "Hoe werkt het Vinted algoritme in 2026?"
excerpt: "Vinted toont geen chronologische lijst maar een zoekmachine met een kandidatenpool van 200.000 items. Wat de 48-uur testfase, de 3-hartjes drempel en de 60%-prijsregel echt betekenen."
date: "2026-09-22"
tag: "Praktijk"
draft: false
faq:
  - question: "Hoe werkt het Vinted algoritme?"
    answer: "Vinted haalt per zoekopdracht eerst een kandidatenpool van tot 200.000 items op, en een tweede laag, de ranker, kiest daaruit de 20 tot 50 items die een koper effectief te zien krijgt. Dat matchen gebeurt via vector search op basis van titel, foto's, prijs, categorie en verkopersreputatie, niet enkel op trefwoorden."
  - question: "Wat is de zero-view val op Vinted?"
    answer: "De zero-view val is wanneer een item de eerste selectie van kandidaten nooit haalt en daardoor nul views krijgt, niet omdat de foto's of prijs slecht zijn, maar omdat het systeem het item nooit in overweging nam. Een titel en beschrijving met specifieke zoekwoorden zoals merk, model en kleur verkleinen die kans."
  - question: "Hoeveel hartjes heeft een item nodig om beter te scoren op Vinted?"
    answer: "Zodra een item drie hartjes bereikt, lijkt het algoritme het te markeren als populair en verschuift het merkbaar richting meer zichtbaarheid. Bij kinderkleding ligt die drempel lager, daar lijkt al één hartje te volstaan."
  - question: "Hoelang duurt de testfase van een nieuw item op Vinted?"
    answer: "Ongeveer 48 uur. In die periode test het systeem een nieuw item bij een kleine groep kopers. Reageren ze goed, dan blijft het item vaker getoond worden. Reageren ze niet, dan verliest een gemiddeld item 60 tot 70 procent van zijn zichtbaarheid."
  - question: "Wat is de beste prijs volgens het Vinted algoritme?"
    answer: "Items rond 60 procent van de gangbare marktwaarde voor vergelijkbare stukken lijken een extra zichtbaarheidsboost te krijgen in de feeds van nieuwe gebruikers. Ga je ver onder die 60 procent, dan lijkt het effect om te slaan naar wantrouwen in plaats van enthousiasme."
---

Voor de meeste verkopers voelt Vinted als een loterij. Het ene item vliegt binnen tien minuten weg, een bijna identiek stuk staat wekenlang zonder één enkele view. De verleiding is groot om dat toe te schrijven aan geluk. Dat is het niet. Achter elke listing zit een technisch systeem dat vrij precies te begrijpen is, en zodra je weet hoe het werkt, verklaart dat een groot deel van wat voorheen willekeurig leek.

<div class="shape-divider" aria-hidden="true">
  <span class="shape shape--square"></span>
  <span class="shape shape--triangle"></span>
  <span class="shape shape--circle"></span>
</div>

## Geen chronologische lijst, maar een zoekmachine met een filter ervoor

Vinted toont je geen simpele tijdlijn van nieuwste items. Elke keer dat iemand zoekt of door zijn feed scrolt, gebeurt er iets in twee stappen. Eerst haalt het systeem een grote groep kandidaten op, tot ongeveer 200.000 items die grofweg passen bij die zoekopdracht of dat gebruikersprofiel. Daarna beslist een tweede laag, een zogenaamde ranker, welke 20 tot 50 items die persoon daadwerkelijk te zien krijgt.

Dat betekent iets fundamenteels: als jouw item die eerste selectie van 200.000 niet haalt, krijg je geen paar views. Je krijgt nul. Niet omdat je foto's slecht zijn of je prijs verkeerd, maar omdat het systeem je item simpelweg nooit in overweging nam. Ik noem dat zelf de zero-view val, en het is de meest onderschatte oorzaak van een stille listing.

## Vinted zoekt op betekenis, niet alleen op woorden

Tot een paar jaar geleden werkte Vinted grotendeels met simpel trefwoord zoeken: typte een koper "kabeltrui", dan kreeg hij items waar dat woord letterlijk in de titel stond. Sinds de overstap naar een nieuwe zoekmachine, Vespa, werkt het systeem anders. Het gebruikt wat vector search heet, via een zogenaamd two-tower model — hetzelfde onderliggende systeem dat ook [de boost-functie](/artikelen/boosten-op-vinted) haar momentum-effect geeft.

In de praktijk komt het hierop neer. Het systeem bouwt van elke koper een soort numeriek profiel op basis van zoekgedrag, klikgedrag, prijsvoorkeur en merkvoorkeur. Van elk item bouwt het een vergelijkbaar profiel op basis van titel, foto's, categorie, merk, prijs en de reputatie van de verkoper. Hoe dichter die twee profielen bij elkaar liggen, hoe groter de kans dat jouw item in de feed van die specifieke koper verschijnt. Dat verklaart waarom twee kopers die hetzelfde woord intypen, toch andere resultaten te zien krijgen, en waarom een item soms gevonden wordt zonder dat de exacte zoekterm in de titel staat.

Voor jou als verkoper betekent dit dat trefwoorden nog steeds tellen, maar niet als enige factor. Titel, foto's, prijs en zelfs je verkopersgeschiedenis werken samen om te bepalen bij welke kopers jouw item als relevant wordt gezien.

<div class="shape-divider" aria-hidden="true">
  <span class="shape shape--circle"></span>
  <span class="shape shape--triangle"></span>
  <span class="shape shape--square"></span>
</div>

## Explore en exploit: waarom nieuwe items eerst getest worden

Elk aanbevelingssysteem, en Vinted is daarop geen uitzondering, werkt met een balans tussen twee modi. In de exploit-fase toont het systeem vooral wat het al weet dat goed scoort. In de explore-fase geeft het bewust ook nieuwe of onbewezen items wat extra zichtbaarheid, puur om data te verzamelen over hoe kopers erop reageren.

Dat verklaart de tijdelijke boost die een nieuw geüpload item krijgt. Het systeem test je item in de eerste uren bij een kleine groep kopers. Reageren ze goed, met views, hartjes en berichten, dan schuift het systeem je item richting de exploit-fase en blijft het je vaker tonen. Reageren ze niet, dan valt je item terug in de grote massa en moet het voortaan concurreren op basis van prijs, foto's en bestaande hartjes tegen duizenden andere items. Die eerste testfase duurt in de praktijk ongeveer 48 uur, waarna een gemiddeld item 60 tot 70 procent van zijn zichtbaarheid verliest als de testresultaten niet sterk genoeg waren — precies het venster dat ook het uitgangspunt vormt van [het dag-per-dag pad](/artikelen/vinted-item-verkoopt-niet-wat-nu) voor een item dat niet verkoopt.

## De drie-hartjes drempel

Een concreet signaal binnen dat systeem is het aantal hartjes dat een item verzamelt. Zodra een item drie hartjes bereikt, lijkt het systeem het te markeren als "populair" en verschuift het merkbaar richting de exploit-fase, met een grotere kans om in de feeds van anderen te verschijnen. Bij kinderkleding ligt die drempel opvallend lager, daar lijkt al één hartje voldoende. Dat is precies waarom de eerste dagen na upload zo belangrijk zijn: elk vroeg hartje draagt bij aan het overschrijden van die drempel, wat op zijn beurt weer meer zichtbaarheid oplevert. Een vliegwiel dat zichzelf versterkt, in beide richtingen — en meteen ook de reden waarom [wat je doet met een hartje](/artikelen/favoriet-hartje-op-vinted) zo veel meer is dan gewoon afwachten.

## De 60 procent regel bij prijs

Prijs speelt niet alleen een rol in de beslissing van de koper, ze lijkt ook een rol te spelen in hoe het algoritme je item beoordeelt. Items die rond de 60 procent van de gangbare marktwaarde voor vergelijkbare stukken geprijsd staan, lijken een merkbare extra zichtbaarheidsboost te krijgen in de feeds van nieuwe gebruikers. Dat is een bewuste beloning voor wat het systeem herkent als een goede deal. Ga je te ver naar beneden, ver onder die 60 procent, dan lijkt het effect om te slaan: een prijs die verdacht laag aanvoelt, wekt eerder wantrouwen dan enthousiasme, zowel bij kopers als blijkbaar ook in hoe het systeem het item behandelt.

<div class="shape-divider" aria-hidden="true">
  <span class="shape shape--triangle"></span>
  <span class="shape shape--circle"></span>
  <span class="shape shape--square"></span>
</div>

## Reputatie als rankingfactor, niet alleen als vertrouwenssignaal

Je voltooiingspercentage en je reviewgemiddelde spelen niet enkel een rol in wat een koper ziet als hij op je profiel klikt. Ze lijken ook mee te wegen in hoe vaak het systeem je items sowieso toont. Verkopers met een sterke reputatie en weinig geannuleerde transacties krijgen structureel meer zichtbaarheid bij vergelijkbare items dan een nieuwe of onervaren verkoper. Dat is logisch vanuit het perspectief van het platform: Vinted heeft er belang bij dat transacties succesvol verlopen, en beloont dus verkopers die dat consistent leveren.

## Wat dit praktisch betekent voor jouw listings

Deze technische achtergrond vertaalt zich naar een handvol concrete gewoontes.

| Signaal | Wat het algoritme lijkt te belonen |
| --- | --- |
| Titel en beschrijving | Specifieke zoekwoorden: merk, model, kleur, stijl |
| Timing van upload | Uploaden op momenten met veel actieve kopers |
| Reactiesnelheid | Snel reageren op berichten en biedingen |
| Prijs | Rond 60% van de marktwaarde van vergelijkbare stukken |
| Verkopersreputatie | Hoog voltooiingspercentage, weinig annuleringen |

Zorg dat je titel en beschrijving genoeg specifieke woorden bevatten, merk, model, kleur, stijl, zodat het systeem je item aan de juiste zoekprofielen kan koppelen in die eerste selectiefase van 200.000 kandidaten. Upload op momenten waarop veel kopers actief zijn, zodat de testfase van de eerste 48 uur voldoende signaal oplevert om de exploit-fase te bereiken. Reageer snel op berichten en biedingen, want een korte reactietijd lijkt eveneens mee te tellen als positief signaal. En prijs je item bewust, niet blindelings rond of hoog, maar in lijn met wat vergelijkbare stukken werkelijk opbrengen, ergens in die zone van pakweg 60 procent van de nieuwwaarde of marktprijs die het systeem lijkt te belonen.

## Waarom het toch soms willekeurig aanvoelt

Ook met deze kennis blijft er een laag onvoorspelbaarheid, en dat is inherent aan hoe dit soort systemen werkt. Het model test voortdurend, past zich aan, en de exacte gewichten die het aan elk signaal toekent, zijn niet publiek bekend en veranderen ongetwijfeld mee met nieuwe versies van het systeem. Wat vandaag met zekerheid te zeggen valt, is gebaseerd op patronen uit eigen verkoopdata en wat Vinted zelf openbaar heeft gedeeld over de onderliggende techniek, niet op volledige interne documentatie. Behandel de principes hierboven dus als sterke werkhypotheses die in de praktijk keer op keer bevestigd worden, niet als een exacte handleiding.

> Vinted werkt met een kandidatenpool van tot 200.000 items per zoekopdracht, gevolgd door een rankingsysteem dat daaruit de 20 tot 50 items kiest die een koper effectief ziet. Wie dat begrijpt, stopt met hopen op geluk en begint bewust te werken met een systeem dat, onder de motorkap, gewoon consistente logica volgt.

## Veelgestelde vragen

### Hoe werkt het Vinted algoritme?

Vinted haalt per zoekopdracht eerst een kandidatenpool van tot 200.000 items op, en een tweede laag, de ranker, kiest daaruit de 20 tot 50 items die een koper effectief te zien krijgt. Dat matchen gebeurt via vector search op basis van titel, foto's, prijs, categorie en verkopersreputatie, niet enkel op trefwoorden.

### Wat is de zero-view val op Vinted?

De zero-view val is wanneer een item de eerste selectie van kandidaten nooit haalt en daardoor nul views krijgt, niet omdat de foto's of prijs slecht zijn, maar omdat het systeem het item nooit in overweging nam. Een titel en beschrijving met specifieke zoekwoorden zoals merk, model en kleur verkleinen die kans.

### Hoeveel hartjes heeft een item nodig om beter te scoren op Vinted?

Zodra een item drie hartjes bereikt, lijkt het algoritme het te markeren als populair en verschuift het merkbaar richting meer zichtbaarheid. Bij kinderkleding ligt die drempel lager, daar lijkt al één hartje te volstaan.

### Hoelang duurt de testfase van een nieuw item op Vinted?

Ongeveer 48 uur. In die periode test het systeem een nieuw item bij een kleine groep kopers. Reageren ze goed, dan blijft het item vaker getoond worden. Reageren ze niet, dan verliest een gemiddeld item 60 tot 70 procent van zijn zichtbaarheid.

### Wat is de beste prijs volgens het Vinted algoritme?

Items rond 60 procent van de gangbare marktwaarde voor vergelijkbare stukken lijken een extra zichtbaarheidsboost te krijgen in de feeds van nieuwe gebruikers. Ga je ver onder die 60 procent, dan lijkt het effect om te slaan naar wantrouwen in plaats van enthousiasme.
