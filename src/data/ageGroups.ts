export type AgeGroupId = '3-5' | '6-8' | '9-12' | '13-15';

export type AgeGroup = {
  id: AgeGroupId;
  label: string;
  bgColor: string;
  textColor: string;
  labelColor: string;
  countColor: string;
  accentColor: string;
};

export const ageGroups: AgeGroup[] = [
  {
    id: '3-5',
    label: '3-5 years',
    bgColor: '#90dcff',
    textColor: '#111827',
    labelColor: '#111827',
    countColor: '#4b5563',
    accentColor: '#5cb8e6',
  },
  {
    id: '6-8',
    label: '6-8 years',
    bgColor: '#00db96',
    textColor: '#111827',
    labelColor: '#111827',
    countColor: '#4b5563',
    accentColor: '#00b87e',
  },
  {
    id: '9-12',
    label: '9-12 years',
    bgColor: '#e10086',
    textColor: '#fff',
    labelColor: '#fff',
    countColor: 'rgba(255,255,255,0.85)',
    accentColor: '#b8006e',
  },
  {
    id: '13-15',
    label: '13-15+ years',
    bgColor: '#fdfb76',
    textColor: '#49297e',
    labelColor: '#49297e',
    countColor: '#49297e',
    accentColor: '#d4d260',
  },
];

export const findAgeGroup = (id: string | null | undefined): AgeGroup | undefined =>
  ageGroups.find(g => g.id === id);
