# Dokumentace k backendu a struktuře webu Zvaž vědu!

Tento dokument vysvětluje základní mechaniky a logiku, jak editovat obsah na tomto webu – zejména města, domovskou stránku a historii.

## 1. Stránky měst (např. `/brno/`, `/praha/`)
Web přešel z nepřehledného systému mnoha boolean vlajek (jako `liveAction: true`) na flexibilnější systém. Všechny komponenty stránky se nyní zapínají jednoduše tím, že jim v Markdown hlavičce (`_index.md`) přidělíte hodnotu. 

Pokud chcete skrýt např. program, stačí smazat klíč `program: true`, a tak podobně u všeho.

### Přehled konfiguračních klíčů v hlavičce (`_index.md`):
- `headerTitle`, `headerText`, `headerPhoto`, `location`: Nastavení hlavní hlavičky.
- `infoVid: "url_videa"`: Zobrazí YouTube video pod horními statistikami. (např. `https://www.youtube.com/embed/XXXX`)
- `program: true`: Zapne zobrazení sekce Program (obsah samotného programu vkládejte přes shortcode, např. `{{< program/brno26 >}}`).
- `abstracts: true` a `abstractUrl: "/brno/info/abstrakty"`: Tlačítko odkazující na abstrakty.
- `registration: "https://forms.gle/..."`: Pokud vyplníte URL, zapne se úplně dole registrační CTA sekce (tlačítko).
- `importantInfo: true`: Zapne informační zónu se zajímavým textem a galerií. Vyžaduje `importantInfoHeader` a `importantInfoText`.
- `additionalInfo: true`: Zapne "O projektu a akci", "Kamarády s sebou!" a blok 6 nabídek "Na co se můžeš těšit". (Vyžaduje definovat obrázky v `additionalInfoImages`).
- `showHistory: true`: (Dříve `pastActions`). Zobrazí na spodku stránky historii všech minulých ročníků v daném městě (Ohlédnutí). 
- `team` a `partners`: Pole týmů a partnerů, načítá data a obrázky ze statických složek.

### Systém Bento Boxů (horní dlaždice)
Místo starého systému, který napevno zobrazoval různé dlaždice nahoře podle vlajky `liveAction`, si nyní můžete libovolně navolit, které boxy chcete vidět.

Využijte parametr `bentoBoxes: [id_boxu, id_boxu, id_boxu]` v souboru `_index.md`.

Předdefinované boxy se nacházejí v souboru `/data/bento_boxes.yaml`. Aktuálně jsou k dispozici např.:
- `events_count`: Box čerpající z proměnné `events: "2"` ("Počet akcí")
- `participants_count`: Box čerpající z `participants: "200"` ("Počet účastníků")
- `speakers_count`: Box čerpající z `speakers: "10"` ("Přednášejících")
- `live_countdown`: Box s živým odpočtem, vyžaduje definovanou proměnnou `eventTime` v daném městě.
- `live_registration`: Box s ukazatelem kapacity, vyžaduje proměnnou `registrationSheet` a `maxParticipants`.
- `new_presentations`: Zobrazí upozornění na nové přednášky, vyžaduje proměnnou `newPresentations: "10"`.
- `past_youtube`: Box odkazující na záznamy na YouTube (pokud v daném městě specifikujete `linkToLecturesYouTube`, odkáže na něj, jinak vede na profil Zvaž vědu).
- `past_feedback`: Box pro feedback po skončení akce.

Příklad použití v hlavičce města:
```yaml
bentoBoxes:
  - "past_youtube"
  - "past_feedback"
  - "new_presentations"
```
Pokud `bentoBoxes` nedefinujete, město použije starý hardcodovaný systém. Doporučujeme u nových i starých měst přejít na `bentoBoxes`. (Staré boxy tam nechávám jako záchrannou síť, než si ty aktuální migrujete).

## 2. Aktuální události (Karty)
Aktuality na domovské stránce (karusel) a sekce Historie tahají data ze souboru `/data/cards.yaml`.
Tento systém podporuje dva typy karet: `type: "update"` a `type: "event"`.

### Parametr `hidden: true`
Nyní můžete kteroukoliv událost na domovské stránce skrýt pomocí `hidden: true`. 
```yaml
- date: 2026-06-08
  type: event
  hidden: true
  title: Zvaž vědu! Tajná akce
  link:
    url: "/tajne/"
    text: O akci
```
Tato akce **zmizí** z karuselu "Aktuálně" na hlavní stránce. Ve výpisu `/historie/` se však stále ukáže (je-li datum starší), ale **nebude mít žlutou barvu jako event**, bude vizuálně spadat pod standardní "Update". Zůstane tak zachována kontinuita historie bez zaneřádění hlavní stránky barevnými eventy, které např. už nechcete propagovat.

## 3. Responzivita a Animace
Byly opraveny následující vizuální vlastnosti pro vývojáře:
- **Žádný horizontální scroll**: `html, body` je tvrdě omezeno na max. `100vw`. Web nikdy nepřeteče doprava.
- **Pořadí sekcí**: U měst platilo globální pravidlo obracení sloupců na mobilech (`column-reverse`), což bylo zrušeno. Fotografie týmu by měly být vždy správně uspořádány.
- **Plynulost hover efektů**: Všechna CSS tlačítka a efekty využívají `--transition: all .2s ease-in-out;` v `root.css`. Loga partnerů, fotky týmů a tlačítka se nyní plynule prolínají nebo animují namísto bleskového blikání. (Dřívější chyba spočívala ve špatně pojmenované CSS jednotce u transition proměnné a v použití okamžitých vlastností display: none namísto opacity).
- **Loga na mobilu**: Na mobilních zařízeních a tabletech se již logo v horním menu nevyměňuje za malý symbol. Plné textové logo zůstává vždy ukotveno.
