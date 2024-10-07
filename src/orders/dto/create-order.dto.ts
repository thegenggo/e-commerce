import { ApiProperty } from "@nestjs/swagger";
import { OrdeStatus } from "@prisma/client";

export class CreateOrderDto {
    @ApiProperty()
    orderStatus: OrdeStatus;

    @ApiProperty()
    productId: number;

    @ApiProperty()
    userId: number;
}
