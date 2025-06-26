/**
 * Medical utility functions for EMR system
 */

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string | Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Calculate BMI from height and weight
 */
export function calculateBMI(heightInCm: number, weightInKg: number): number {
  const heightInMeters = heightInCm / 100;
  return weightInKg / (heightInMeters * heightInMeters);
}

/**
 * Calculate BMI from imperial units
 */
export function calculateBMIImperial(heightInInches: number, weightInPounds: number): number {
  return (weightInPounds / (heightInInches * heightInInches)) * 703;
}

/**
 * Get BMI category
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

/**
 * Calculate estimated daily calorie needs using Mifflin-St Jeor equation
 */
export function calculateTDEE(
  gender: string,
  ageInYears: number,
  heightInCm: number,
  weightInKg: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number {
  // Calculate BMR (Basal Metabolic Rate)
  let bmr: number;
  
  if (gender.toLowerCase() === 'male') {
    bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears + 5;
  } else {
    bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears - 161;
  }
  
  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,      // Little to no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Heavy exercise 6-7 days/week
    very_active: 1.9     // Very heavy exercise, physical job
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel]);
}

/**
 * Convert height from feet/inches to centimeters
 */
export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches;
  return totalInches * 2.54;
}

/**
 * Convert height from centimeters to feet/inches
 */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Convert weight from pounds to kilograms
 */
export function poundsToKg(pounds: number): number {
  return pounds * 0.453592;
}

/**
 * Convert weight from kilograms to pounds
 */
export function kgToPounds(kg: number): number {
  return kg * 2.20462;
}

/**
 * Format blood pressure reading
 */
export function formatBloodPressure(systolic: number, diastolic: number): string {
  return `${systolic}/${diastolic} mmHg`;
}

/**
 * Get blood pressure category
 */
export function getBloodPressureCategory(systolic: number, diastolic: number): {
  category: string;
  color: string;
} {
  if (systolic < 120 && diastolic < 80) {
    return { category: "Normal", color: "green" };
  } else if (systolic < 130 && diastolic < 80) {
    return { category: "Elevated", color: "yellow" };
  } else if (systolic < 140 || diastolic < 90) {
    return { category: "High Blood Pressure Stage 1", color: "orange" };
  } else if (systolic < 180 || diastolic < 120) {
    return { category: "High Blood Pressure Stage 2", color: "red" };
  } else {
    return { category: "Hypertensive Crisis", color: "red" };
  }
}

/**
 * Calculate estimated maximum heart rate
 */
export function calculateMaxHeartRate(age: number): number {
  return 220 - age;
}

/**
 * Calculate target heart rate zones
 */
export function calculateHeartRateZones(age: number): {
  fat_burn: { min: number; max: number };
  cardio: { min: number; max: number };
  peak: { min: number; max: number };
} {
  const maxHR = calculateMaxHeartRate(age);
  
  return {
    fat_burn: {
      min: Math.round(maxHR * 0.5),
      max: Math.round(maxHR * 0.7)
    },
    cardio: {
      min: Math.round(maxHR * 0.7),
      max: Math.round(maxHR * 0.85)
    },
    peak: {
      min: Math.round(maxHR * 0.85),
      max: maxHR
    }
  };
}

/**
 * Format medical date for display
 */
export function formatMedicalDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Calculate days between dates
 */
export function daysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Validate medical ID formats
 */
export function validateMedicalId(id: string, type: 'ssn' | 'npi' | 'dea'): boolean {
  switch (type) {
    case 'ssn':
      return /^\d{3}-\d{2}-\d{4}$/.test(id);
    case 'npi':
      return /^\d{10}$/.test(id);
    case 'dea':
      return /^[A-Z]{2}\d{7}$/.test(id);
    default:
      return false;
  }
}

/**
 * Generate patient ID from name and DOB
 */
export function generatePatientId(firstName: string, lastName: string, dateOfBirth: string): string {
  const dobFormatted = new Date(dateOfBirth).toISOString().slice(0, 10).replace(/-/g, '');
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${initials}${dobFormatted}${random}`;
}

/**
 * Calculate medication adherence percentage
 */
export function calculateMedicationAdherence(
  prescribedDoses: number,
  takenDoses: number
): number {
  if (prescribedDoses === 0) return 0;
  return Math.round((takenDoses / prescribedDoses) * 100);
}

/**
 * Get medication adherence category
 */
export function getMedicationAdherenceCategory(percentage: number): {
  category: string;
  color: string;
} {
  if (percentage >= 80) {
    return { category: "Good", color: "green" };
  } else if (percentage >= 60) {
    return { category: "Moderate", color: "yellow" };
  } else {
    return { category: "Poor", color: "red" };
  }
}

/**
 * Calculate eGFR (estimated Glomerular Filtration Rate) using CKD-EPI equation
 */
export function calculateEGFR(
  creatinine: number, // in mg/dL
  age: number,
  gender: string,
  isAfricanAmerican: boolean = false
): number {
  const isFemale = gender.toLowerCase() === 'female';
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.329 : -0.411;
  const genderMultiplier = isFemale ? 1.018 : 1;
  const raceMultiplier = isAfricanAmerican ? 1.159 : 1;
  
  const ratio = creatinine / kappa;
  const minRatio = Math.min(ratio, 1);
  const maxRatio = Math.max(ratio, 1);
  
  const egfr = 141 * Math.pow(minRatio, alpha) * Math.pow(maxRatio, -1.209) * 
               Math.pow(0.993, age) * genderMultiplier * raceMultiplier;
  
  return Math.round(egfr);
}

/**
 * Get CKD stage from eGFR
 */
export function getCKDStage(egfr: number): {
  stage: string;
  description: string;
  color: string;
} {
  if (egfr >= 90) {
    return { 
      stage: "Stage 1", 
      description: "Normal kidney function", 
      color: "green" 
    };
  } else if (egfr >= 60) {
    return { 
      stage: "Stage 2", 
      description: "Mild decrease in kidney function", 
      color: "green" 
    };
  } else if (egfr >= 45) {
    return { 
      stage: "Stage 3a", 
      description: "Mild to moderate decrease in kidney function", 
      color: "yellow" 
    };
  } else if (egfr >= 30) {
    return { 
      stage: "Stage 3b", 
      description: "Moderate to severe decrease in kidney function", 
      color: "orange" 
    };
  } else if (egfr >= 15) {
    return { 
      stage: "Stage 4", 
      description: "Severe decrease in kidney function", 
      color: "red" 
    };
  } else {
    return { 
      stage: "Stage 5", 
      description: "Kidney failure", 
      color: "red" 
    };
  }
}
