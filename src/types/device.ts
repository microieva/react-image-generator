export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface DeviceState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
}

export interface DeviceContextValue extends DeviceState {
  breakpoints: Breakpoints;
  isClient: boolean;
}