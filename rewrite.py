# -*- coding: utf-8 -*-
import sys

with open('content/soustredeni-soc/index.md', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = {
    'se zabývají tři': 'se zabývaly tři',
    'je čeká týden nabitý': 'je čekal týden nabitý',
    'Soustředění pořádá': 'Soustředění pořádala',
    'říká ředitel': 'řekl ředitel',
    'doplňuje Jan Herzig': 'doplnil Jan Herzig',
    'zabývají například strukturní': 'zabývali například strukturní',
    'Do Brna se teď sjeli': 'Do Brna se sjeli',
    'Celý program stojí na třech': 'Celý program stál na třech',
    'Účastníky čekají praktické workshopy': 'Účastníky čekaly praktické workshopy',
    'Účastníci soustředění se proto dozvědí': 'Účastníci soustředění se proto dozvěděli',
    'O své zkušenosti se s nimi podělí': 'O své zkušenosti se s nimi podělili',
    'Přiblíží jim, jak samotné': 'Přiblížili jim, jak samotné',
    'Během programu se proto účastníci dozvědí': 'Během programu se proto účastníci dozvěděli',
    'Nabitý odborný program doplní také setkání': 'Nabitý odborný program doplnila také setkání',
    'Účastníky čekají debaty': 'Účastníky čekaly debaty',
    'Jedna z nich účastníky zavede': 'Jedna z nich účastníky zavedla',
    'Soustředění ale není jen': 'Soustředění ale nebylo jen',
    'Na jednom místě se díky němu potkávají': 'Na jednom místě se díky němu potkali',
    'Na několik dní se tak Brno stává': 'Na několik dní se tak Brno stalo'
}

for old, new in replacements.items():
    text = text.replace(old, new)

with open('content/soustredeni-soc/index.md', 'w', encoding='utf-8') as f:
    f.write(text)

print("Rewritten to past tense.")
