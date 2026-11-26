-- L7 TEST: New grading boundaries for ALL online tests using l7_submit_test
-- Run ONCE in Supabase > L7-TEST > SQL Editor > New Query > Run.
-- IMPORTANT: Also recalculates grades of ALL existing attempts.
-- Leaves scores, answers, timestamps, users and permissions unchanged.
-- Percent is rounded to one decimal BEFORE grade calculation.
--   0.0 .. 44.4 => 2
--  44.5 .. 64.4 => 3
--  64.5 .. 84.4 => 4
--  84.5 ..100.0 => 5
-- Take a backup first if you need to preserve old grade assignments.

begin;

-- Older version used INTEGER percent and grades 3−/4−.
-- Change the type to retain tenths of a percentage point.
alter table public.test_results
  alter column percent type numeric(5,1)
  using percent::numeric(5,1);

-- Permit the new 2/3/4/5 values, drop old 3−/4− validation.
alter table public.test_results
  drop constraint if exists test_results_grade_check;
alter table public.test_results
  drop constraint if exists test_results_grade_2_5_check;

-- Recompute existing attempts using raw score / total, not the old rounded integer.
update public.test_results
set percent = round((score::numeric * 100) / total, 1),
    grade = case
      when round((score::numeric * 100) / total, 1) >= 84.5 then '5'
      when round((score::numeric * 100) / total, 1) >= 64.5 then '4'
      when round((score::numeric * 100) / total, 1) >= 44.5 then '3'
      else '2'
    end;

alter table public.test_results
  add constraint test_results_grade_2_5_check
  check (grade in ('2', '3', '4', '5'));

-- Replace only the grading logic in existing server-side submission function.
create or replace function public.l7_submit_test(
  p_test_code text,
  p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_student uuid := auth.uid();
  v_profile record;
  v_test record;
  v_count integer;
  v_score integer;
  v_percent numeric(5,1);
  v_grade text;
  v_result_id uuid;
begin
  if v_student is null then
    raise exception 'Login required' using errcode = '28000';
  end if;

  select p.role, p.status, p.class_code
    into v_profile
  from public.profiles p where p.id = v_student;
  if not found or v_profile.role <> 'student' or v_profile.status <> 'approved' then
    raise exception 'Approved student account required' using errcode = '42501';
  end if;

  select k.class_code, k.total_questions, k.answer_key
    into v_test
  from l7_private.test_keys k where k.test_code = p_test_code;
  if not found or v_test.class_code <> v_profile.class_code then
    raise exception 'Unknown test for this class' using errcode = '22023';
  end if;

  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Answers must be a JSON object' using errcode = '22023';
  end if;

  select count(*) into v_count from pg_catalog.jsonb_each_text(p_answers);
  if v_count > v_test.total_questions then
    raise exception 'Too many answers' using errcode = '22023';
  end if;
  if exists (
    select 1
    from pg_catalog.jsonb_each_text(p_answers) as a(question, answer)
    where not (v_test.answer_key ? a.question)
       or a.answer is null or a.answer !~ '^[A-G]$'
  ) then
    raise exception 'Invalid answer data' using errcode = '22023';
  end if;

  select count(*)::integer into v_score
  from pg_catalog.jsonb_each_text(p_answers) as a(question, answer)
  where a.answer = v_test.answer_key ->> a.question;

  v_percent := round((v_score::numeric * 100) / v_test.total_questions, 1);
  v_grade := case
    when v_percent >= 84.5 then '5'
    when v_percent >= 64.5 then '4'
    when v_percent >= 44.5 then '3'
    else '2' end;

  insert into public.test_results (
    student_id, class_code, test_code, score, total, percent, grade, answers
  ) values (
    v_student, v_profile.class_code, p_test_code,
    v_score, v_test.total_questions, v_percent, v_grade, p_answers
  ) returning id into v_result_id;

  return pg_catalog.jsonb_build_object(
    'result_id', v_result_id, 'test_code', p_test_code,
    'score', v_score, 'total', v_test.total_questions,
    'percent', v_percent, 'grade', v_grade
  );
end;
$$;

commit;
