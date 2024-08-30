import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsAlphanumeric } from 'class-validator'
export class SignInDto {
    @IsAlphanumeric()
    @IsNotEmpty()
    @ApiProperty({ required: true, default: "admin" })
    username: string;

    @IsNotEmpty()
    @ApiProperty({ required: true, default: "password" })
    password: string;
}
