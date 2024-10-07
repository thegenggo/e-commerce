import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from 'class-validator'
export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true, example: "username@hotmail.com" })
    email: string;
    
    @IsNotEmpty()
    @ApiProperty({ required: true, example: "username" })
    username: string;

    @IsNotEmpty()
    @ApiProperty({ required: true, example: "password" })
    password: string;
}
