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
Využijte parametr `bentoBoxes: [id_boxu, id_boxu, id_boxu]` v souboru `_index.md`.

Předdefinované boxy se nacházejí v souboru `/data/bento_boxes.yaml`. Aktuálně jsou k dispozici např.:
- `events_count`: Box čerpající z proměnné `events: "2"` ("Počet akcí")
- `speakers_count`: Box čerpající z `speakers: "10"` ("Přednášejících")
- `live_countdown`: Box s živým odpočtem, vyžaduje definovanou proměnnou `eventTime` v daném městě.
- `past_youtube`: Box odkazující na záznamy na YouTube.
- `past_feedback`: Box pro feedback po skončení akce.
- `new_presentations`: Zobrazí upozornění na nové přednášky, vyžaduje proměnnou `newPresentations: "10"`.

### ⚠️ DŮLEŽITÉ: Účastníci vs Kapacita (Rozdíl v proměnných)
V systému existují dvě zdánlivě podobné proměnné pro účastníky, které ale dělají odlišné věci. **Nikdy nepoužívejte zastaralou proměnnou `newParticipants`!**

1. **`participants`** (např. `participants: "650+"`)
   - Udává **historický celkový počet** účastníků.
   - Slouží čistě jako text (takže se k němu smí psát znaménko plus).
   - Zobrazuje se v bento boxu `participants_count`.

2. **`maxParticipants`** (např. `maxParticipants: "300"`)
   - Udává tvrdou **kapacitu blížícího se ročníku**.
   - Slouží jako matematická hodnota (číslo) pro výpočet procent.
   - Zobrazuje se v bento boxu `live_registration` (progress bar s naplněností). Společně s ním je nutné mít vyplněné `registrationSheet` (URL na CSV export tabulky).

Příklad použití v hlavičce města:
```yaml
bentoBoxes:
  - "events_count"
  - "participants_count"
  - "speakers_count"
  - "live_registration"

events: "3"
participants: "650+"
maxParticipants: "300"
```
Pokud `bentoBoxes` nedefinujete, místo použije starý hardcodovaný systém. Doporučujeme u nových i starých míst přejít na `bentoBoxes`. (Staré boxy tam nechávám jako záchrannou síť, než si ty aktuální migrujete).

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

## 4. Rozcestník registrací (/registrace/)
Stránka pro registrace `/registrace/` již nefunguje jako přesměrování (dříve s `layout: "port"`), ale zobrazuje rozcestník umožňující registraci na události ve více městech.
Stránka má vlastní šablonu v `layouts/_default/registrace.html` a obsah tahá strukturovaně z front matter souboru `content/registrace/index.md`. 
Pokud potřebujete přidat další město (odkaz), stačí v tomto souboru do sekce `options` přidat:
```yaml
  - title: "Registrace – Nové Město"
    text: "Krátký popisek k akci."
    url: "odkaz_na_gforms"
```

### Automatické napojení na město (ukazatel kapacity)
Karty v rozcestníku umí automaticky zobrazit progres bar (ukazatel aktuálně registrovaných účastníků), pokud je propojíte s existujícím městem.
K tomu slouží parametr `cityRef`. Pokud jej uvedete, rozcestník si automaticky "sáhne" do daného města (např. `/plzen`), přečte si z něj URL Google tabulky (`registrationSheet`), maximální kapacitu a registrační odkaz (pokud nevyplníte vlastní `url`).

```yaml
  - title: "Okno do vesmíru #4"
    text: "Ve čtvrtek 17. září od 15:00 v Semlerově rezidenci v Plzni"
    cityRef: "/plzen"
```
*Poznámka: Aby ukazatel kapacity fungoval, dané město (zde `/plzen/_index.md`) musí mít v hlavičce definované položky `registrationSheet` a `participants` (nebo `maxParticipants`).*
