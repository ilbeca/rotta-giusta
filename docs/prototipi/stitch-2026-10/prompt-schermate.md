<!-- Allegati, in docs/prototipi/redesign-2026-10-claude/: g-regata/schermate/home-375, u-terra-beige/schermate/home-1280, g-regata/schermate/quiz-375, runner-375, riepilogo-375, preparazione-375. -->

# Prompt per Stitch — Rotta Giusta, stile Regata

Come si usa: in Stitch, nuovo progetto, modalità prompt. Incolla il **prompt di
base** con allegate le schermate della cartella `schermate/`. Poi, una schermata
per volta, aggiungi il **prompt della schermata** corrispondente. In inglese
perché Stitch lo segue meglio; i testi dell'interfaccia restano in italiano,
parola per parola.

---

## Prompt di base (da incollare una volta, con le schermate allegate)

Recreate the attached screens as an editable design for "Rotta Giusta", a free,
open-source study site for the Italian offshore boating licence exam (quiz and
chart-plotting practice). Mobile-first, portrait, one hand. Keep the layout,
the hierarchy and ALL Italian text exactly as in the screenshots — do not
translate, rewrite or add copy.

Visual direction "Regata" (open sea, regatta buoys):
- Background white; ink navy #10202b; primary/actions deep sea blue #0a4f6e.
- Accent orange #ff6a1a ONLY for decorative marks (buoys, small triangles,
  the underline of the secondary link) — never on text, buttons or results.
  Darker orange #b23f00 for the dashed course line.
- Results: wrong #b3261e on a light red tint, right #12663a on a light green
  tint, warning text #765000. Land/sand #f2e6cf (desktop Home only).
- Font Manrope. Sizes only 12, 14, 16, 20, 24, 32 px (44 and 56 only for the
  desktop Home headline and big numbers). Weights 400, 600, 700, 800 (800 only
  for headings ≥24 px and numbers). Body line-height 1.45, headings 1.2.
- Spacing scale 4, 8, 12, 16, 24, 32, 48, 64. Cards: white, 1 px light border,
  12–16 px radius, soft shadow.
- Exactly ONE filled primary button per screen; everything else is outline,
  text link or plain list. Touch targets at least 44×44 px, 8 px apart.
- Bottom tab bar on mobile with icons + labels: Home · Allenati · Esame ·
  Progressi; top bar with logo "ROTTA GIUSTA" and "Accedi" (person icon).
  On desktop the four tabs move to the top bar.
- No gamification: no streaks, badges, points, confetti, percentages as grades.
- Calm, honest, nautical; illustrations are nautical-chart drawings (depth
  numbers, dashed course, lighthouse with light sectors red/white/green,
  east cardinal buoy black-yellow-black).

---

## Prompt per schermata

**1 · Home, telefono** (`1-home-telefono.png`)
Home screen, 375×812. Headline "Preparati alla patente nautica, un passo alla
volta.", a strip of nautical chart, then a card "La prova d'esame dei quiz"
with three big numbers (20 domande · 30′ minuti · 4 errori al più), the
primary button "Simula il quiz base →", and below it the secondary text link
"Oppure allenati con 10 domande →". The primary button must stay above the
bottom tab bar even at 375×667.

**2 · Home, computer** (`2-home-computer.png`)
Desktop Home, 1280×800, only above 1200×680. Full-bleed nautical chart behind
the page: sea blue on the left with white text, sand-coloured land on the right
edge with a thin vertical path of small triangles (the page sections). Lighthouse
"Lam.(2) BRV 10s" with red/white/green sectors, east cardinal buoy "Sc.(3) 10s",
orange dashed course. Same exam card and primary button as mobile, on the left
column. The text column never overlaps the lighthouse or the buoy.

**3 · Allenati · Quiz, telefono** (`3-allenati-quiz-telefono.png`)
Training section "Allenati" with a segmented control Quiz · Carteggio ·
Segnali (the selected segment is filled; segments don't count as a second
primary button). First a card "Allenamento consigliato" with the primary
button "Inizia l'allenamento →", then "Altri modi" as a plain list with icon,
title, subtitle, count and chevron: "Scegli un argomento", "Ripassa gli
errori", "I tuoi segnalibri", and so on.

**4 · Domanda dopo un errore, telefono** (`4-domanda-errore-telefono.png`)
Question runner after a wrong answer. Top: "Termina", timer, "1 di 10" and a
dashed progress line of small triangles. Decree number "N. 1.7.6-19" above the
question. Answer 1 marked "LA TUA RISPOSTA" (red tint), answer 2 "RISPOSTA DEL
DECRETO" (green tint), answer 3 neutral. Optional tags "Non lo sapevo" /
"Svista". Bottom: "Sbagliata. Era la 2." and the single primary button
"Avanti →", always reachable.

**5 · Riepilogo, telefono** (`5-riepilogo-telefono.png`)
Activity summary: what happened (answers, correct, wrong), which answers to
review, what was not answered. No grade, no "you are ready".

**6 · Preparazione, telefono** (`6-preparazione-telefono.png`)
Preparation of the 10-question practice: "← Torna alla Home", title "Allenati
con 10 domande", one line of explanation, then a card with two big facts
(10 domande · Subito la correzione), the no-account notice "Senza account le
risposte valgono solo finché questa pagina resta aperta…" as plain text, once,
right above the primary button "Inizia l'allenamento →" — not a boxed alert.
