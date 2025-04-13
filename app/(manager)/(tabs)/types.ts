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
    className: string;
  }
  
  export interface DateTimeProps {
    date: string;
    time: string;
  }

  export interface JobCardProps {
    jobId: string;
    date?: string;
    time?: string;
    location?: string;
    employee?: string;
    employer?: string;
    shiftType?: string;
    hourlyRate?: string;
    hours?: string;
    totalAmount?: string;
    backgroundImage?: any;
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
    id: string;
    notificationType: string;
    title: string;
    message: string;
    iconUrl: any;
  }

  export interface UserListItemProps {
    name: string;
    ratings: number;
    assurance: number;
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

export interface ShiftDetailsProps {
  id: string;
    name: string;
    location: string;
    date: Date;
    background_image_url: string;
    company_name: string;
    salary_per_time: string;
    total_earning: number;
    shift_duration: string;
    location_map: string;
    start_time: Date;
    end_time: Date;
    requirement_items: any;
    disallowed_items: any;
    requirement_description: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    employer: string;
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


