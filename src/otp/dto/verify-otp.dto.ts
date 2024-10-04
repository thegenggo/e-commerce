import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from 'class-validator'
export class VerifyOtpDto {
    @IsNotEmpty()
    @ApiProperty({ required: true, minimum: 6, maximum: 6 })
    otp: string;
}
