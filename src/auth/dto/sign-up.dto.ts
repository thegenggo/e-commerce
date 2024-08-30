import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from 'class-validator'
export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    email: string;
    
    @IsNotEmpty()
    @ApiProperty({ required: true })
    username: string;

    @IsNotEmpty()
    @ApiProperty({ required: true })
    password: string;
}
