
export interface StatItemProps {
    icon: any;
    count: number;
  }
  
  export interface NavigationItemProps {
    key?: number;
    iconUrl: any;
    label: string;
  }

  export interface ButtonProps {
    label: string;
    isEnabled: boolean;
    onPress: any;
    buttonStyle?: string;
    textStyle?: string;
  }
  
  export interface DateTimeProps {
    date: string;
    time: string;
  }

  export interface JobCardProps {
    jobId?: string;
    date?: string;
    time?: string;
    location?: string;
    shiftType?: string;
    employee?: string;
    employer?: string;
    position?: string;
    hourlyRate?: number;
    hours?: number;
    totalAmount?: number;
    backgroundImage?: any;
  }
  export interface ShiftsTakenJobCardProps {
    jobId: string;
    shiftType: string;
    date: string;
    time: string;
    location: string;
    employer: string;
    position: string;
    hourlyRate: number;
    hours: number;
    totalAmount: number;
    backgroundImage: any;
  }
  
  export interface JobDetailProps {
    icon: any;
    text?: string;
  }

  export interface LanguageSwitcherProps {
    currentLanguage: string;
    icon: any;
  }
  
  export interface LanguageIconProps {
    imageUrl: any;
    alt: string;
  }

  export interface LocationProps {
    address: string;
    mapImageUrl: any;
  }
  
  export interface MetricDisplayProps {
    leftValue: string;
    leftLabel: string;
    rightValue: string;
    rightLabel: string;
  }

  export interface LanguageIconProps {
    imageUrl: any;
    alt: string;
  }

  export interface NotificationDetailsProps {
    title: string;
    message: string;
    iconUrl: any;
  }

  export interface UserListItemProps {
    name: string;
    ratings: number;
    ranking: number;
    avatar: any;
  }

  export interface StatsCounterProps {
    ratings: number;
    ranking: number;
  }

  export interface ShiftDetailsDescriptionProps {
    description: string;
  }

  export interface EmployeeDetailsDisplayProps {
    name: string;
  }

  export interface ShiftDetailsJobCardProps {
    backgroundImage: any;
    companyName: string;
    jobTitle: any;
  }

  export interface EarningProps {
    totalEarnings: number;
  }

 export interface ProfileProps {
    avatarUrl: any;
    username: string;
  }

  export interface DayProps {
    day: string;
    date: string;
    color?: string;
  }
  
  export interface WeekDayProps {
    days: DayProps[];
  }

  export interface RatingIndicatorProps {
    icon: any;
    value: string;
  }

  
  export interface RequiredItemsProps {
    imageUrl: any;
    title: string;
    subtitle: string;
    description: string;
    isRequired: boolean;
    isSelectable: boolean;
  }

  export interface RequiredItemsListProp {
    requiredItems: RequiredItemsProps[];
  }

  export interface CountdownTimerProps {
    hours: number;
    minutes: number;
  }

  export interface ShiftConfirmationDetailsProps {
    company: string;
    date: string;
    time: string;
  }

  export interface PenaltyProps {
    text: string;
    icon: any;
  }

  export interface PenaltyCardProps {
    title: string;
    penalties: PenaltyProps[];
  }

  export interface LanguageDropdownProps {
    language: string;
    flagIcon: any;
  }

  export interface itemListProps {
    // key?: string;
    item: string;
}

  export interface DisplayPersonalInfoProps {
    // key?: string;
    item: any;
}

export interface AccountActionModalProps { 
  title: string;
  content: string;
  buttonStyle: string;
}

export interface UserProps {
  id: string;
  username: string;
  email: string;
  phone: string;
  home_address: string;
  date_of_birth: Date;
  language: string;
  role: string;
  is_verified: boolean;
  identity_verification: string;
  background_check: string;
      }

export interface EmployerProps { 
  id: string;
  company_name: string;
  status: string;
  rating: number;
  assurance: number;
  created_at: string;
  updated_at: Date;
  user: string;
}

export interface EmployeeProps {
  id: string;
resume: string;
profile_images: any;
id_card: string;
employment_status: string;
skills_list: any;
transportation_status: string;
employment_agreement:string;
rating: number;
assurance: number;
created_at: Date;
updated_at: Date;
user: string;
}

export interface UpcomingShiftProps {
  id: string;
  expected_start_time: Date;
  expected_end_time: Date;
  expected_salary: string;
  created_at: Date;
  updated_at: Date;
  employee: string;
  shift: string;
}