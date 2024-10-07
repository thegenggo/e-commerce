import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from 'class-validator'
export class ChangePasswordDto {
    @IsNotEmpty()
    @ApiProperty({ required: true, example: "newPassword" })
    password: string;
}
