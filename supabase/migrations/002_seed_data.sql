-- =====================================================
-- SEED DATA — Run after schema migration
-- Populates questions, options, exams, and blog posts
-- =====================================================

-- ─── QUESTIONS ────────────────────────────────────────

insert into public.questions (id, title, explanation, difficulty, system, topic) values
  ('00000000-0000-0000-0000-000000000001', 'A 55-year-old male presents with crushing chest pain radiating to the left arm and jaw. ECG shows ST-segment elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?', 'The inferior wall of the heart is supplied by the right coronary artery (RCA). ST elevation in leads II, III, and aVF indicates an inferior MI, pointing to RCA occlusion. The LAD supplies the anterior wall, and the LCx supplies the lateral wall.', 'Medium', 'Cardiovascular', 'Pathology'),
  ('00000000-0000-0000-0000-000000000002', 'A 30-year-old woman presents with fatigue, weight gain, cold intolerance, and constipation. TSH is elevated and free T4 is low. What is the most likely diagnosis?', 'Elevated TSH with low free T4 indicates primary hypothyroidism. The most common cause in the developed world is Hashimoto thyroiditis, an autoimmune condition with anti-TPO antibodies.', 'Easy', 'Endocrine', 'Pathology'),
  ('00000000-0000-0000-0000-000000000003', 'Which enzyme is deficient in Gaucher disease?', 'Gaucher disease is caused by deficiency of glucocerebrosidase (beta-glucosidase), leading to accumulation of glucocerebroside in macrophages (Gaucher cells). It is the most common lysosomal storage disease.', 'Easy', 'Hematology', 'Biochemistry'),
  ('00000000-0000-0000-0000-000000000004', 'A 22-year-old male presents with a painless testicular mass. Serum AFP is elevated, but beta-hCG is normal. What is the most likely diagnosis?', 'Elevated AFP with normal beta-hCG in a young male with testicular mass suggests a yolk sac tumor (endodermal sinus tumor). Choriocarcinoma elevates beta-hCG, and seminomas typically have normal AFP.', 'Medium', 'Reproductive', 'Pathology'),
  ('00000000-0000-0000-0000-000000000005', 'Which drug is the first-line treatment for absence seizures in children?', 'Ethosuximide is the first-line treatment for absence seizures. It works by blocking T-type calcium channels in thalamic neurons. Valproate is an alternative but has more side effects.', 'Easy', 'Nervous', 'Pharmacology'),
  ('00000000-0000-0000-0000-000000000006', 'A 45-year-old woman with SLE presents with proteinuria and hematuria. Renal biopsy shows wire-loop lesions with subendothelial deposits. What is the histological class?', 'Wire-loop lesions with subendothelial deposits are characteristic of Class IV diffuse proliferative lupus nephritis, the most common and severe form. It requires aggressive immunosuppressive therapy.', 'Hard', 'Renal', 'Pathology'),
  ('00000000-0000-0000-0000-000000000007', 'Which cytokine is primarily responsible for granuloma formation?', 'IFN-gamma, produced by Th1 cells, is the key cytokine that activates macrophages and promotes granuloma formation. TNF-alpha also contributes to maintaining granuloma structure.', 'Medium', 'Immune', 'Immunology'),
  ('00000000-0000-0000-0000-000000000008', 'A newborn presents with projectile non-bilious vomiting at 3 weeks of age. An olive-shaped mass is palpated in the epigastrium. What is the diagnosis?', 'The classic triad of projectile non-bilious vomiting, palpable olive-shaped mass, and onset at 2-6 weeks points to pyloric stenosis. It is more common in firstborn males and is treated with Ramstedt pyloromyotomy.', 'Easy', 'GI', 'Pathology'),
  ('00000000-0000-0000-0000-000000000009', 'Which hepatitis virus is a defective RNA virus that requires HBV coinfection for replication?', 'Hepatitis D virus (HDV) is a defective RNA virus that requires the HBsAg coat protein from HBV for assembly and transmission. HDV superinfection in chronic HBV carriers leads to more severe disease.', 'Easy', 'GI', 'Microbiology'),
  ('00000000-0000-0000-0000-000000000010', 'A patient on isoniazid therapy develops peripheral neuropathy. Which vitamin should be supplemented to prevent this?', 'Isoniazid inhibits pyridoxine (vitamin B6) phosphokinase, leading to B6 deficiency and peripheral neuropathy. Supplementation with pyridoxine (vitamin B6) prevents this side effect.', 'Easy', 'Nervous', 'Pharmacology'),
  ('00000000-0000-0000-0000-000000000011', 'What is the mechanism of action of omeprazole?', 'Omeprazole is a proton pump inhibitor (PPI) that irreversibly inhibits the H+/K+ ATPase pump on gastric parietal cells. This reduces basal and stimulated gastric acid secretion.', 'Easy', 'GI', 'Pharmacology'),
  ('00000000-0000-0000-0000-000000000012', 'A 60-year-old smoker presents with weight loss, hemoptysis, and hypercalcemia. Chest X-ray shows a central lung mass. What is the most likely type of lung cancer?', 'Central location + hypercalcemia (due to PTHrP secretion) in a smoker strongly suggests squamous cell carcinoma of the lung. Small cell carcinoma is also central but typically causes SIADH or Cushing syndrome.', 'Medium', 'Respiratory', 'Pathology');


-- ─── QUESTION OPTIONS ─────────────────────────────────

-- Q1: Coronary artery
insert into public.question_options (question_id, option_text, is_correct, sort_order) values
  ('00000000-0000-0000-0000-000000000001', 'Left anterior descending artery', false, 1),
  ('00000000-0000-0000-0000-000000000001', 'Right coronary artery', true, 2),
  ('00000000-0000-0000-0000-000000000001', 'Left circumflex artery', false, 3),
  ('00000000-0000-0000-0000-000000000001', 'Left main coronary artery', false, 4);

-- Q2: Hypothyroidism
insert into public.question_options (question_id, option_text, is_correct, sort_order) values
  ('00000000-0000-0000-0000-000000000002', 'Graves disease', false, 1),
  ('00000000-0000-0000-0000-000000000002', 'Hashimoto thyroiditis', true, 2),
  ('00000000-0000-0000-0000-000000000002', 'Subacute thyroiditis', false, 3),
  ('00000000-0000-0000-0000-000000000002', 'Thyroid carcinoma', false, 4);

-- Q3: Gaucher
insert into public.question_options (question_id, option_text, is_correct, sort_order) values
  ('00000000-0000-0000-0000-000000000003', 'Sphingomyelinase', false, 1),
  ('00000000-0000-0000-0000-000000000003', 'Hexosaminidase A', false, 2),
  ('00000000-0000-0000-0000-000000000003', 'Glucocerebrosidase', true, 3),
  ('00000000-0000-0000-0000-000000000003', 'Alpha-galactosidase A', false, 4);

-- Q4: Testicular tumor
insert into public.question_options (question_id, option_text, is_correct, sort_order) values
  ('00000000-0000-0000-0000-000000000004', 'Seminoma', false, 1),
  ('00000000-0000-0000-0000-000000000004', 'Choriocarcinoma', false, 2),
  ('00000000-0000-0000-0000-000000000004', 'Yolk sac tumor', true, 3),
  ('00000000-0000-0000-0000-000000000004', 'Teratoma', false, 4);

-- Q5: Absence seizures
insert into public.question_options (question_id, option_text, is_correct, sort_order) values
  ('00000000-0000-0000-0000-000000000005', 'Carbamazepine', false, 1),
  ('00000000-0000-0000-0000-000000000005', 'Ethosuximide', true, 2),
  ('00000000-0000-0000-0000-000000000005', 'Phenytoin', false, 3),
  ('00000000-0000-0000-0000-000000000005', 'Gabapentin', false, 4);

-- Q6: Lupus nephritis
insert into public.question_options (question_id, option_text, is_correct, sort_order) values
  ('00000000-0000-0000-0000-000000000006', 'Class II — Mesangial proliferative', false, 1),
  ('00000000-0000-0000-0000-000000000006', 'Class III — Focal proliferative', false, 2),
  ('00000000-0000-0000-0000-000000000006', 'Class IV — Diffuse proliferative', true, 3),
  ('00000000-0000-0000-0000-000000000006', 'Class V — Membranous', false, 4);

-- Q7: Granuloma cytokine
insert into public.question_options (question_id, option_text, is_correct, sort_order) values
  ('00000000-0000-0000-0000-000000000007', 'IL-4', false, 1),
  ('00000000-0000-0000-0000-000000000007', 'IL-10', false, 2),
  ('00000000-0000-0000-0000-000000000007', 'IFN-gamma', true, 3),
  ('00000000-0000-0000-0000-000000000007', 'IL-5', false, 4);

-- Q8: Pyloric stenosis
insert into public.question_options (question_id, option_text, is_correct, sort_order) values
  ('00000000-0000-0000-0000-000000000008', 'Duodenal atresia', false, 1),
  ('00000000-0000-0000-0000-000000000008', 'Pyloric stenosis', true, 2),
  ('00000000-0000-0000-0000-000000000008', 'Intussusception', false, 3),
  ('00000000-0000-0000-0000-000000000008', 'Malrotation with volvulus', false, 4);

-- Q9: Hepatitis D
insert into public.question_options (question_id, option_text, is_correct, sort_order) values
  ('00000000-0000-0000-0000-000000000009', 'Hepatitis A', false, 1),
  ('00000000-0000-0000-0000-000000000009', 'Hepatitis C', false, 2),
  ('00000000-0000-0000-0000-000000000009', 'Hepatitis D', true, 3),
  ('00000000-0000-0000-0000-000000000009', 'Hepatitis E', false, 4);

-- Q10: INH + B6
insert into public.question_options (question_id, option_text, is_correct, sort_order) values
  ('00000000-0000-0000-0000-000000000010', 'Vitamin B1 (Thiamine)', false, 1),
  ('00000000-0000-0000-0000-000000000010', 'Vitamin B6 (Pyridoxine)', true, 2),
  ('00000000-0000-0000-0000-000000000010', 'Vitamin B12 (Cobalamin)', false, 3),
  ('00000000-0000-0000-0000-000000000010', 'Vitamin C (Ascorbic acid)', false, 4);

-- Q11: Omeprazole MOA
insert into public.question_options (question_id, option_text, is_correct, sort_order) values
  ('00000000-0000-0000-0000-000000000011', 'Blocks H2 receptors', false, 1),
  ('00000000-0000-0000-0000-000000000011', 'Inhibits H+/K+ ATPase', true, 2),
  ('00000000-0000-0000-0000-000000000011', 'Neutralizes gastric acid', false, 3),
  ('00000000-0000-0000-0000-000000000011', 'Enhances mucosal defense', false, 4);

-- Q12: Lung cancer
insert into public.question_options (question_id, option_text, is_correct, sort_order) values
  ('00000000-0000-0000-0000-000000000012', 'Adenocarcinoma', false, 1),
  ('00000000-0000-0000-0000-000000000012', 'Squamous cell carcinoma', true, 2),
  ('00000000-0000-0000-0000-000000000012', 'Small cell carcinoma', false, 3),
  ('00000000-0000-0000-0000-000000000012', 'Large cell carcinoma', false, 4);


-- ─── MOCK EXAMS ──────────────────────────────────────

insert into public.mock_exams (id, title, description, duration, total_questions, difficulty) values
  ('00000000-0000-0000-0001-000000000001', 'USMLE Step 1 — Full Length #1', 'Complete Step 1 simulation with mixed difficulty', 480, 280, 'Mixed'),
  ('00000000-0000-0000-0001-000000000002', 'USMLE Step 1 — Full Length #2', 'Second full-length practice exam', 480, 280, 'Mixed'),
  ('00000000-0000-0000-0001-000000000003', 'Pathology Focus Exam', 'Focused exam covering all pathology topics', 60, 50, 'Medium'),
  ('00000000-0000-0000-0001-000000000004', 'Pharmacology Rapid Review', 'Quick review of high-yield pharmacology', 45, 40, 'Easy'),
  ('00000000-0000-0000-0001-000000000005', 'USMLE Step 1 — Full Length #3', 'Third full-length simulation', 480, 280, 'Mixed'),
  ('00000000-0000-0000-0001-000000000006', 'Biochemistry Challenge', 'Advanced biochemistry questions', 60, 50, 'Hard'),
  ('00000000-0000-0000-0001-000000000007', 'Cardiology Deep Dive', 'Comprehensive cardiovascular review', 50, 40, 'Medium'),
  ('00000000-0000-0000-0001-000000000008', 'USMLE Step 2 CK — Mini Mock', 'Step 2 CK practice set', 150, 100, 'Mixed');


-- ─── BLOGS ───────────────────────────────────────────

insert into public.blogs (title, slug, excerpt, content, category, author_name, read_time, published) values
  ('How to Score 250+ on USMLE Step 1: A Complete Guide', 'how-to-score-250-plus-on-usmle-step-1', 'A comprehensive guide from students who scored 260+ sharing their strategies.', 'Full article content here...', 'Study Tips', 'Dr. Sarah Ahmed', '12 min read', true),
  ('Top 10 Resources for USMLE Step 2 CK Preparation', 'best-resources-for-usmle-step-2-ck', 'An honest review of the most popular Step 2 CK prep resources.', 'Full article content here...', 'Resources', 'Dr. Michael Chen', '8 min read', true),
  ('High-Yield Anatomy Topics for USMLE Step 1', 'anatomy-high-yield-topics', 'Focus your anatomy review on these frequently tested topics.', 'Full article content here...', 'High-Yield', 'Dr. Priya Patel', '10 min read', true),
  ('Managing Burnout During Your Dedicated Study Period', 'managing-burnout-during-dedicated', 'Practical tips for maintaining mental health during USMLE prep.', 'Full article content here...', 'Wellness', 'Dr. James Wilson', '7 min read', true),
  ('The Complete IMG Guide to USMLE Success', 'img-guide-to-usmle', 'Everything IMGs need to know about USMLE preparation.', 'Full article content here...', 'IMG Guide', 'Dr. Fatima Hassan', '15 min read', true),
  ('Mastering Pharmacology: Strategies That Actually Work', 'pharmacology-study-strategies', 'Effective techniques for memorizing drug mechanisms.', 'Full article content here...', 'Study Tips', 'Dr. David Kim', '9 min read', true);


-- ─── ANNOUNCEMENTS ───────────────────────────────────

insert into public.announcements (title, content, type, published) values
  ('New Pharmacology Questions Added!', 'We have added 50 new pharmacology questions covering antibiotics, antivirals, and antifungals.', 'update', true),
  ('System Maintenance — May 5', 'The platform will undergo maintenance from 2:00 AM to 4:00 AM EST.', 'maintenance', true),
  ('Step 2 CK Content Now Available!', 'Our Step 2 CK question bank with 500+ clinical vignette questions is live.', 'feature', true),
  ('Summer Discount — 30% Off Premium', 'Use code SUMMER30 at checkout for 30% off any Premium subscription.', 'promo', false);


-- ─── MOCK EXAM QUESTIONS (Linking questions to exams) ───────────────────────────

insert into public.mock_exam_questions (exam_id, question_id, sort_order) values
  -- Assign questions to "USMLE Step 1 — Full Length #1"
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 1),
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000002', 2),
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000003', 3),
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000004', 4),
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000005', 5),
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000006', 6),
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000007', 7),
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000008', 8),
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000009', 9),
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000010', 10),
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000011', 11),
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000012', 12),
  
  -- Assign questions to "Pathology Focus Exam"
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000003', 1),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000006', 2),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000012', 3),

  -- Assign questions to "Pharmacology Rapid Review"
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000008', 1),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000011', 2);

