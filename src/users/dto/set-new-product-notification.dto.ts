import { ApiProperty } from "@nestjs/swagger";

export class SetNewProductNotificationDto {
    @ApiProperty({ required: true, default: true })
    newProductNotification: boolean;
}
