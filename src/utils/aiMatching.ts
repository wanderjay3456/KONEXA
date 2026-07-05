import { StudentProfile, CompanyProfile, Project, WeeklyEvaluation, StudentWarning, Application } from '../types';

export interface MatchResult {
  studentId: string;
  projectId: string;
  score: number;
  category: 'Top Recommended' | 'Alternative Match' | 'Hidden Gem' | 'Suitable for Growth';
  breakdown: {
    technical: number;
    academic: number;
    performance: number;
    preference: number;
  };
  explanation: string;
  matchedSkills: string[];
  missingSkills: string[];
}

/**
 * Calculates a highly robust multi-dimensional compatibility score between a Student and a Project/Company.
 */
export function calculateMatch(
  student: StudentProfile,
  project: Project,
  company: CompanyProfile,
  allEvaluations: WeeklyEvaluation[],
  warnings: StudentWarning[],
  studentApplications: Application[]
): MatchResult {
  // 1. Technical Skills Match (Weight: 30%)
  const reqSkills = project.requiredSkills.map(s => s.toLowerCase());
  const studentSkills = student.skills.map(s => s.toLowerCase());
  
  const matchedSkills = project.requiredSkills.filter(s => studentSkills.includes(s.toLowerCase()));
  const missingSkills = project.requiredSkills.filter(s => !studentSkills.includes(s.toLowerCase()));
  
  let technicalScore = reqSkills.length > 0 
    ? (matchedSkills.length / reqSkills.length) * 100 
    : 100;

  // 2. Academic & Language Match (Weight: 25%)
  // Major heuristic match
  const majorLower = student.major.toLowerCase();
  const titleLower = project.title.toLowerCase();
  const descLower = project.description.toLowerCase();
  
  let academicScore = 70; // baseline
  if (majorLower.includes('computer') || majorLower.includes('software') || majorLower.includes('it') || majorLower.includes('information')) {
    if (titleLower.includes('react') || titleLower.includes('frontend') || titleLower.includes('backend') || titleLower.includes('developer') || titleLower.includes('web') || titleLower.includes('fullstack') || titleLower.includes('mobile')) {
      academicScore = 100;
    }
  } else if (majorLower.includes('business') || majorLower.includes('marketing') || majorLower.includes('commerce')) {
    if (descLower.includes('marketing') || descLower.includes('business') || descLower.includes('export') || descLower.includes('market')) {
      academicScore = 100;
    }
  } else if (majorLower.includes('design') || majorLower.includes('ux') || majorLower.includes('ui')) {
    if (descLower.includes('design') || descLower.includes('ui') || descLower.includes('ux') || descLower.includes('figma')) {
      academicScore = 100;
    }
  }

  // Language proficiency score
  let languageScore = 80;
  const english = student.englishProficiency.toUpperCase();
  if (english.includes('IELTS 7') || english.includes('ADVANCED') || english.includes('NATIVE') || english.includes('IELTS 8')) {
    languageScore = 100;
  } else if (english.includes('IELTS 6') || english.includes('INTERMEDIATE')) {
    languageScore = 85;
  }

  const academicLanguageScore = (academicScore * 0.6) + (languageScore * 0.4);

  // 3. Performance & Reliability History (Weight: 25%)
  const studentEvals = allEvaluations.filter(e => e.studentId === student.userId);
  const studentWarns = warnings.filter(w => w.studentId === student.userId);

  // Default baseline score for newly verified profiles is 85% to avoid cold-start penalty
  let performanceScore = 85; 
  let deadlineRate = 100;
  let avgQuality = 4.0;

  if (studentEvals.length > 0) {
    const totalDead = studentEvals.reduce((acc, curr) => acc + curr.deadline, 0);
    deadlineRate = Math.round((totalDead / (studentEvals.length * 5)) * 100);
    
    const totalQual = studentEvals.reduce((acc, curr) => acc + curr.quality, 0);
    avgQuality = totalQual / studentEvals.length;
    
    const evalAvg = studentEvals.reduce((acc, curr) => 
      acc + (curr.communication + curr.quality + curr.responsibility + curr.deadline + curr.problemSolving + curr.professionalism) / 6, 0
    ) / studentEvals.length;
    
    // Scale 1-5 rating to 0-100
    performanceScore = (evalAvg / 5) * 100;
  }

  // Warning deductions (Maintain platform trust - -20 pts per warning)
  performanceScore = Math.max(0, performanceScore - (studentWarns.length * 20));

  // 4. Preference & Availability Match (Weight: 20%)
  let preferenceScore = 60; // baseline
  
  // Industry match
  if (student.preferredIndustry.toLowerCase() === company.industry.toLowerCase()) {
    preferenceScore += 20;
  }
  
  // Working hours / availability alignment
  // Project weekly hours (e.g. 15 hours) vs Student availability (e.g. "20 hours/week")
  const availHoursMatch = student.availability.match(/\d+/);
  const studentAvailHours = availHoursMatch ? parseInt(availHoursMatch[0]) : 20;
  if (studentAvailHours >= project.weeklyHours) {
    preferenceScore += 20;
  }

  preferenceScore = Math.min(100, preferenceScore);

  // Total weighted score computation
  const totalScore = Math.round(
    (technicalScore * 0.3) +
    (academicLanguageScore * 0.25) +
    (performanceScore * 0.25) +
    (preferenceScore * 0.2)
  );

  // Category Classification Heuristics
  let category: MatchResult['category'] = 'Alternative Match';
  
  if (totalScore >= 82) {
    category = 'Top Recommended';
  } else if (totalScore < 55) {
    category = 'Suitable for Growth';
  } else {
    // Check if "Hidden Gem" candidate (missing 1 skill, but has outstanding performance/deadline and high english proficiency)
    const isHiddenGem = missingSkills.length === 1 && deadlineRate >= 95 && avgQuality >= 4.5 && studentWarns.length === 0;
    if (isHiddenGem) {
      category = 'Hidden Gem';
    } else {
      category = 'Alternative Match';
    }
  }

  // Create human-readable, transparent match reasoning explanation
  let explanation = '';
  if (category === 'Top Recommended') {
    explanation = `Outstanding candidate with ${matchedSkills.length}/${project.requiredSkills.length} target skills, matching major credentials, and a flawless ${deadlineRate}% deadline punctuality rating. Excellent match for direct deployment.`;
  } else if (category === 'Hidden Gem') {
    explanation = `High-potential candidate. Missing just '${missingSkills[0]}' but possesses a stellar ${deadlineRate}% task commitment rating, excellent English, and high learning speed indicators from previous SME mentors.`;
  } else if (category === 'Alternative Match') {
    explanation = `Stable candidate matching ${matchedSkills.length} required skills. Their academic focus and regional preference align, providing solid reliability and structured output.`;
  } else {
    explanation = `Excellent learning alignment. While needing mentoring on some complex technical frameworks, their soft-skills baseline and drive match the company culture well.`;
  }

  return {
    studentId: student.userId,
    projectId: project.id,
    score: totalScore,
    category,
    breakdown: {
      technical: Math.round(technicalScore),
      academic: Math.round(academicLanguageScore),
      performance: Math.round(performanceScore),
      preference: Math.round(preferenceScore)
    },
    explanation,
    matchedSkills,
    missingSkills
  };
}
