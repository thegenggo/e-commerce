import { ApiProperty } from "@nestjs/swagger";

export class NewPasswordEntity {
    @ApiProperty({ example: "newPassword" })
    password: string
}