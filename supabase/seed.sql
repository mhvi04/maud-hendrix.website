-- Weekplanner v1 — seed data
-- 12 weken semester 1 (AJ26-27), vaste blokken en de twee gekende
-- uitzonderingen bij het begin van het semester.

insert into weeks (week_nr, iso_week, monday_date, friday_date, note) values
  (1,  'W39', '2026-09-21', '2026-09-25', null),
  (2,  'W40', '2026-09-28', '2026-10-02', null),
  (3,  'W41', '2026-10-05', '2026-10-09', null),
  (4,  'W42', '2026-10-12', '2026-10-16', null),
  (5,  'W43', '2026-10-19', '2026-10-23', null),
  (6,  'W44', '2026-10-26', '2026-10-30', null),
  (7,  'W45', '2026-11-02', '2026-11-06', 'Geen les ctp-les (Allerzielen)'),
  (8,  'W46', '2026-11-09', '2026-11-13', null),
  (9,  'W47', '2026-11-16', '2026-11-20', null),
  (10, 'W48', '2026-11-23', '2026-11-27', null),
  (11, 'W49', '2026-11-30', '2026-12-04', null),
  (12, 'W50', '2026-12-07', '2026-12-11', null)
on conflict (week_nr) do nothing;

-- Vaste blokken. depends_on verwijst naar het les-blok waar een
-- zelfstudieblok van afhangt (enige bron van waarheid voor herhalingslogica,
-- het redundante herhaalt_op-veld uit de brondata wordt genegeerd).
insert into blocks (id, title, type, day, start_time, end_time, location, vak_code, depends_on) values
  ('ctp-les', 'Criminaliteit tijd en plaats', 'les', 'maandag', '09:00', '11:30',
    'Auditorium C Campus Aula', 'B001844A', null),
  ('ctp-herhaling', 'Criminaliteit tijd en plaats (herhaling)', 'zelfstudie', 'dinsdag', '10:30', '13:00',
    'Zelfstudie', null, 'ctp-les'),
  ('bronnen-les', 'Bronnen en onderzoeksontwerp in de criminologie', 'les', 'maandag', '16:00', '19:00',
    'Blandijn Campus Boekentoren', 'B001825A/B001636A', null),
  ('bronnen-herhaling', 'Bronnen en onderzoeksontwerp (herhaling)', 'zelfstudie', 'dinsdag', '13:00', '16:00',
    'Zelfstudie', null, 'bronnen-les'),
  ('bachelorproef', 'Bachelorproef', 'werkblok', 'woensdag', '09:00', '17:00',
    'Vast werkblok', null, null),
  -- TODO: einduur pcve-les onbevestigd. 11:30 is een placeholder (gelijk aan
  -- ctp-les qua duur) tot het echte uur bekend is. Zie ook badge in de UI.
  ('pcve-les', 'Preventie en aanpak van gewelddadig extremisme', 'les', 'donderdag', '08:30', '11:30',
    'Auditorium G', 'B001857A', null)
on conflict (id) do nothing;

-- Gekende uitzonderingen
insert into week_overrides (week_nr, block_id, status, reason) values
  (7, 'ctp-les', 'geen_les', 'Allerzielen'),
  (1, 'pcve-les', 'geen_les', 'vak start pas 1 oktober')
on conflict (week_nr, block_id) do nothing;
