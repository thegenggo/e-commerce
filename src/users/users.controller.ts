import { Controller, Post, Request, Body, Get, Param, Patch, Delete, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SetNewProductNotificationDto } from './dto/set-new-product-notification.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UsersController {
    constructor(private usersService: UsersService) {}
    
    @Post()
    @Roles(Role.ADMIN)
    @ApiCreatedResponse({ type: UserEntity, description: "Successfully create a user." })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @ApiOkResponse({ type: UserEntity, isArray: true, description: "Successfully get all users." })
    @Roles(Role.ADMIN)
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @ApiOkResponse({ type: UserEntity, description: "Successfully get the user." })
    @ApiNotFoundResponse({ description: "User is not found." })
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findOne(+id);
        if(!user) throw new NotFoundException("User is not found.");
        return user;
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    @ApiOkResponse({ type: UserEntity, description: "Successfully update the user." })
    @ApiNotFoundResponse({ description: "User is not found." })
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.usersService.findOne(+id);
        if(!user) throw new NotFoundException("User is not found.");
        return await this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOkResponse({ type: UserEntity, description: "Successfully delete the user." })
    @ApiNotFoundResponse({ description: "User is not found." })
    async remove(@Param('id') id: string) {
        const user = await this.usersService.findOne(+id);
        if(!user) throw new NotFoundException("User is not found.");
        return this.usersService.remove(+id);
    }

    @Post('set-new-product-notification')
    setNewProductNotification(@Request() req, @Body() body: SetNewProductNotificationDto) {
        return this.usersService.setNewProductNotification(req.user.sub, body.newProductNotification);
    }
}
