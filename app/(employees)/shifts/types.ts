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
    position?: string;
    hourlyRate?: number;
    hours?: number;
    totalAmount?: number;
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
    title: string;
    message: string;
    iconUrl: any;
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
    onTap?: (item: string) => void;
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

export interface ShiftSearchParams {
  shiftType: string;
  date: string,
  time: string
  hourlyRate: string,
  numberOfHours: string,
  numberOfOpenings: string,
}

// export interface ShiftDetailsProps {
//   id: string,
//   shiftType: string;
//   totalEarnings: string;
//   date: string;
//   time: string;
//   endTime: string;
//   hourlyRate: string;
//   numberOfHours: string;
//   numberOfOpenings: string;
//   location: string;
//   description: string;
//   employee: string;
//   employer: string;
//   employerId: string;
//   employeeId: string;
//   backgroundImage: string;
// }


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

export interface UserDataProps {
      id: string;
      name: string;
      email: string;
      phone: string;
      homeAddress: string;
      dateOfBirth: string;
      Language: string;
      identityVerificationStatus: string;
      backgroundCheckStatus: string;
      description: string;
      rating: string,
      assurance: string,
      urlToImage: any,
      imageStatus: string;
      IDCardStatus: string;
      PassportStatus: string;
      otherCertificateStatus: string;
  }

  export interface EmployerProps {
    id: number;
    company_name: string;
    status: string;
    rate_id: number;
    created_at: string;
    updated_at: Date;
    user: number;
  }

  export interface UpcomingShiftProps {
    id: number;
        expected_start_time: Date;
        expected_end_time: Date;
        expected_salary: string;
        created_at: Date;
        updated_at: Date;
        employee: number;
        shift: number;
  }

  export interface OngoingShiftProps {
    id: number;
    actual_start_time: Date;
    actual_end_time: Date;
    shift_progress: string;
    created_at: Date;
    updated_at: Date;
    employee: number;
    shift: number;
}

export interface ShiftApplicationProps {
  id: string;
  shift: string;
  employee: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface ShiftRatingsProps {
  id: string;
  employer: string;
  shift: string;
  status: string;
  rating: number;
  feedback: string;
  created_at: Date;
  updated_at: Date;
}