-- Quarters become quarters of a juz: 4 a juz, 120 in all, instead of the 8 rub'
-- al-hizb a juz there were. Each quarter starts where an odd rub' did, so at the
-- start and the middle of each hizb (the Madani marks). Start points from
-- quran-meta (MIT), github.com/quran-center/quran-meta
--
-- Days already saved move across: rub' r becomes quarter (r + 1) / 2. The two
-- halves of a quarter merge: planned if either was, done if either was, with the
-- weaker rating and the later time. Goals halve, rounding up, so a goal of 4 (half
-- a juz) stays half a juz at 2.

create temp table merged_quarters as
select
  log_id,
  user_id,
  (rub + 1) / 2 as rub,
  bool_or(planned) as planned,
  (array_agg(quality order by case quality when 'needs_work' then 0 when 'average' then 1 else 2 end)
    filter (where quality is not null))[1] as quality,
  max(completed_at) as completed_at,
  min(created_at) as created_at
from log_quarters
group by log_id, user_id, (rub + 1) / 2;

delete from log_quarters;
delete from quarters;

alter table quarters
  drop constraint quarters_rub_check,
  drop constraint quarters_rub_in_juz_check,
  drop constraint rub_matches_juz,
  drop constraint rub_matches_hizb,
  drop constraint rub_in_juz_matches;
alter table quarters
  add constraint quarters_rub_check check (rub between 1 and 120),
  add constraint quarters_rub_in_juz_check check (rub_in_juz between 1 and 4),
  add constraint rub_matches_juz check (juz = ((rub - 1) / 4) + 1),
  add constraint rub_matches_hizb check (hizb = ((rub - 1) / 2) + 1),
  add constraint rub_in_juz_matches check (rub_in_juz = ((rub - 1) % 4) + 1);
comment on column quarters.rub is 'Quarter of a juz, 1..120 (the name is from when these were rub'' al-hizb)';

insert into quarters (rub, juz, hizb, rub_in_juz, code, juz_name, start_surah, start_ayah) values
  (1, 1, 1, 1, 'J1_Q1', 'Alif Lam Mim', 1, 1),
  (2, 1, 1, 2, 'J1_Q2', 'Alif Lam Mim', 2, 44),
  (3, 1, 2, 3, 'J1_Q3', 'Alif Lam Mim', 2, 75),
  (4, 1, 2, 4, 'J1_Q4', 'Alif Lam Mim', 2, 106),
  (5, 2, 3, 1, 'J2_Q1', 'Sayaqul', 2, 142),
  (6, 2, 3, 2, 'J2_Q2', 'Sayaqul', 2, 177),
  (7, 2, 4, 3, 'J2_Q3', 'Sayaqul', 2, 203),
  (8, 2, 4, 4, 'J2_Q4', 'Sayaqul', 2, 233),
  (9, 3, 5, 1, 'J3_Q1', 'Tilka r-Rusul', 2, 253),
  (10, 3, 5, 2, 'J3_Q2', 'Tilka r-Rusul', 2, 272),
  (11, 3, 6, 3, 'J3_Q3', 'Tilka r-Rusul', 3, 15),
  (12, 3, 6, 4, 'J3_Q4', 'Tilka r-Rusul', 3, 52),
  (13, 4, 7, 1, 'J4_Q1', 'Lan Tanalu', 3, 93),
  (14, 4, 7, 2, 'J4_Q2', 'Lan Tanalu', 3, 133),
  (15, 4, 8, 3, 'J4_Q3', 'Lan Tanalu', 3, 171),
  (16, 4, 8, 4, 'J4_Q4', 'Lan Tanalu', 4, 1),
  (17, 5, 9, 1, 'J5_Q1', 'Wal-Muhsanat', 4, 24),
  (18, 5, 9, 2, 'J5_Q2', 'Wal-Muhsanat', 4, 58),
  (19, 5, 10, 3, 'J5_Q3', 'Wal-Muhsanat', 4, 88),
  (20, 5, 10, 4, 'J5_Q4', 'Wal-Muhsanat', 4, 114),
  (21, 6, 11, 1, 'J6_Q1', 'La Yuhibbullah', 4, 148),
  (22, 6, 11, 2, 'J6_Q2', 'La Yuhibbullah', 5, 1),
  (23, 6, 12, 3, 'J6_Q3', 'La Yuhibbullah', 5, 27),
  (24, 6, 12, 4, 'J6_Q4', 'La Yuhibbullah', 5, 51),
  (25, 7, 13, 1, 'J7_Q1', 'Wa Idha Sami''u', 5, 82),
  (26, 7, 13, 2, 'J7_Q2', 'Wa Idha Sami''u', 5, 109),
  (27, 7, 14, 3, 'J7_Q3', 'Wa Idha Sami''u', 6, 36),
  (28, 7, 14, 4, 'J7_Q4', 'Wa Idha Sami''u', 6, 74),
  (29, 8, 15, 1, 'J8_Q1', 'Wa Law Annana', 6, 111),
  (30, 8, 15, 2, 'J8_Q2', 'Wa Law Annana', 6, 141),
  (31, 8, 16, 3, 'J8_Q3', 'Wa Law Annana', 7, 1),
  (32, 8, 16, 4, 'J8_Q4', 'Wa Law Annana', 7, 47),
  (33, 9, 17, 1, 'J9_Q1', 'Qal al-Mala''', 7, 88),
  (34, 9, 17, 2, 'J9_Q2', 'Qal al-Mala''', 7, 142),
  (35, 9, 18, 3, 'J9_Q3', 'Qal al-Mala''', 7, 171),
  (36, 9, 18, 4, 'J9_Q4', 'Qal al-Mala''', 8, 1),
  (37, 10, 19, 1, 'J10_Q1', 'Wa''lamu', 8, 41),
  (38, 10, 19, 2, 'J10_Q2', 'Wa''lamu', 9, 1),
  (39, 10, 20, 3, 'J10_Q3', 'Wa''lamu', 9, 34),
  (40, 10, 20, 4, 'J10_Q4', 'Wa''lamu', 9, 60),
  (41, 11, 21, 1, 'J11_Q1', 'Ya''tadhirun', 9, 93),
  (42, 11, 21, 2, 'J11_Q2', 'Ya''tadhirun', 9, 122),
  (43, 11, 22, 3, 'J11_Q3', 'Ya''tadhirun', 10, 26),
  (44, 11, 22, 4, 'J11_Q4', 'Ya''tadhirun', 10, 71),
  (45, 12, 23, 1, 'J12_Q1', 'Wa Ma min Dabbah', 11, 6),
  (46, 12, 23, 2, 'J12_Q2', 'Wa Ma min Dabbah', 11, 41),
  (47, 12, 24, 3, 'J12_Q3', 'Wa Ma min Dabbah', 11, 84),
  (48, 12, 24, 4, 'J12_Q4', 'Wa Ma min Dabbah', 12, 7),
  (49, 13, 25, 1, 'J13_Q1', 'Wa Ma Ubarri''u', 12, 53),
  (50, 13, 25, 2, 'J13_Q2', 'Wa Ma Ubarri''u', 12, 101),
  (51, 13, 26, 3, 'J13_Q3', 'Wa Ma Ubarri''u', 13, 19),
  (52, 13, 26, 4, 'J13_Q4', 'Wa Ma Ubarri''u', 14, 10),
  (53, 14, 27, 1, 'J14_Q1', 'Rubama', 15, 1),
  (54, 14, 27, 2, 'J14_Q2', 'Rubama', 16, 1),
  (55, 14, 28, 3, 'J14_Q3', 'Rubama', 16, 51),
  (56, 14, 28, 4, 'J14_Q4', 'Rubama', 16, 90),
  (57, 15, 29, 1, 'J15_Q1', 'Subhan alladhi', 17, 1),
  (58, 15, 29, 2, 'J15_Q2', 'Subhan alladhi', 17, 50),
  (59, 15, 30, 3, 'J15_Q3', 'Subhan alladhi', 17, 99),
  (60, 15, 30, 4, 'J15_Q4', 'Subhan alladhi', 18, 32),
  (61, 16, 31, 1, 'J16_Q1', 'Qal Alam', 18, 75),
  (62, 16, 31, 2, 'J16_Q2', 'Qal Alam', 19, 22),
  (63, 16, 32, 3, 'J16_Q3', 'Qal Alam', 20, 1),
  (64, 16, 32, 4, 'J16_Q4', 'Qal Alam', 20, 83),
  (65, 17, 33, 1, 'J17_Q1', 'Iqtaraba', 21, 1),
  (66, 17, 33, 2, 'J17_Q2', 'Iqtaraba', 21, 51),
  (67, 17, 34, 3, 'J17_Q3', 'Iqtaraba', 22, 1),
  (68, 17, 34, 4, 'J17_Q4', 'Iqtaraba', 22, 38),
  (69, 18, 35, 1, 'J18_Q1', 'Qad Aflaha', 23, 1),
  (70, 18, 35, 2, 'J18_Q2', 'Qad Aflaha', 23, 75),
  (71, 18, 36, 3, 'J18_Q3', 'Qad Aflaha', 24, 21),
  (72, 18, 36, 4, 'J18_Q4', 'Qad Aflaha', 24, 53),
  (73, 19, 37, 1, 'J19_Q1', 'Wa Qal alladhina', 25, 21),
  (74, 19, 37, 2, 'J19_Q2', 'Wa Qal alladhina', 26, 1),
  (75, 19, 38, 3, 'J19_Q3', 'Wa Qal alladhina', 26, 111),
  (76, 19, 38, 4, 'J19_Q4', 'Wa Qal alladhina', 27, 1),
  (77, 20, 39, 1, 'J20_Q1', 'Amman Khalaq', 27, 56),
  (78, 20, 39, 2, 'J20_Q2', 'Amman Khalaq', 28, 12),
  (79, 20, 40, 3, 'J20_Q3', 'Amman Khalaq', 28, 51),
  (80, 20, 40, 4, 'J20_Q4', 'Amman Khalaq', 29, 1),
  (81, 21, 41, 1, 'J21_Q1', 'Utlu Ma Uhiya', 29, 46),
  (82, 21, 41, 2, 'J21_Q2', 'Utlu Ma Uhiya', 30, 31),
  (83, 21, 42, 3, 'J21_Q3', 'Utlu Ma Uhiya', 31, 22),
  (84, 21, 42, 4, 'J21_Q4', 'Utlu Ma Uhiya', 33, 1),
  (85, 22, 43, 1, 'J22_Q1', 'Wa Man Yaqnut', 33, 31),
  (86, 22, 43, 2, 'J22_Q2', 'Wa Man Yaqnut', 33, 60),
  (87, 22, 44, 3, 'J22_Q3', 'Wa Man Yaqnut', 34, 24),
  (88, 22, 44, 4, 'J22_Q4', 'Wa Man Yaqnut', 35, 15),
  (89, 23, 45, 1, 'J23_Q1', 'Wa Ma Li', 36, 28),
  (90, 23, 45, 2, 'J23_Q2', 'Wa Ma Li', 37, 22),
  (91, 23, 46, 3, 'J23_Q3', 'Wa Ma Li', 37, 145),
  (92, 23, 46, 4, 'J23_Q4', 'Wa Ma Li', 38, 52),
  (93, 24, 47, 1, 'J24_Q1', 'Fa Man Adhlam', 39, 32),
  (94, 24, 47, 2, 'J24_Q2', 'Fa Man Adhlam', 40, 1),
  (95, 24, 48, 3, 'J24_Q3', 'Fa Man Adhlam', 40, 41),
  (96, 24, 48, 4, 'J24_Q4', 'Fa Man Adhlam', 41, 9),
  (97, 25, 49, 1, 'J25_Q1', 'Ilayhi Yuradd', 41, 47),
  (98, 25, 49, 2, 'J25_Q2', 'Ilayhi Yuradd', 42, 27),
  (99, 25, 50, 3, 'J25_Q3', 'Ilayhi Yuradd', 43, 24),
  (100, 25, 50, 4, 'J25_Q4', 'Ilayhi Yuradd', 44, 17),
  (101, 26, 51, 1, 'J26_Q1', 'Ha Mim', 46, 1),
  (102, 26, 51, 2, 'J26_Q2', 'Ha Mim', 47, 10),
  (103, 26, 52, 3, 'J26_Q3', 'Ha Mim', 48, 18),
  (104, 26, 52, 4, 'J26_Q4', 'Ha Mim', 49, 14),
  (105, 27, 53, 1, 'J27_Q1', 'Qala Fama Khatbukum', 51, 31),
  (106, 27, 53, 2, 'J27_Q2', 'Qala Fama Khatbukum', 53, 26),
  (107, 27, 54, 3, 'J27_Q3', 'Qala Fama Khatbukum', 55, 1),
  (108, 27, 54, 4, 'J27_Q4', 'Qala Fama Khatbukum', 56, 75),
  (109, 28, 55, 1, 'J28_Q1', 'Qad Sami''a Allah', 58, 1),
  (110, 28, 55, 2, 'J28_Q2', 'Qad Sami''a Allah', 59, 11),
  (111, 28, 56, 3, 'J28_Q3', 'Qad Sami''a Allah', 62, 1),
  (112, 28, 56, 4, 'J28_Q4', 'Qad Sami''a Allah', 65, 1),
  (113, 29, 57, 1, 'J29_Q1', 'Tabarak alladhi', 67, 1),
  (114, 29, 57, 2, 'J29_Q2', 'Tabarak alladhi', 69, 1),
  (115, 29, 58, 3, 'J29_Q3', 'Tabarak alladhi', 72, 1),
  (116, 29, 58, 4, 'J29_Q4', 'Tabarak alladhi', 75, 1),
  (117, 30, 59, 1, 'J30_Q1', '''Amma', 78, 1),
  (118, 30, 59, 2, 'J30_Q2', '''Amma', 82, 1),
  (119, 30, 60, 3, 'J30_Q3', '''Amma', 87, 1),
  (120, 30, 60, 4, 'J30_Q4', '''Amma', 94, 1);

insert into log_quarters (log_id, user_id, rub, planned, quality, completed_at, created_at)
  select log_id, user_id, rub, planned, quality, completed_at, created_at from merged_quarters;
drop table merged_quarters;

alter table daily_logs drop constraint daily_logs_target_quarters_check;
update daily_logs set target_quarters = (target_quarters + 1) / 2;
alter table daily_logs add constraint daily_logs_target_quarters_check check (target_quarters between 1 and 120);

alter table profiles drop constraint profiles_daily_target_check;
update profiles set daily_target = (daily_target + 1) / 2;
alter table profiles
  add constraint profiles_daily_target_check check (daily_target between 1 and 120),
  alter column daily_target set default 2;
