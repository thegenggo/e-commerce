import { SetMetadata } from '@nestjs/common';

export const IS_NO_OTP_KEY = 'isPublic';
export const NoOtp = (state: boolean) => SetMetadata(IS_NO_OTP_KEY, state);