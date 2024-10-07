import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenEntity {
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU4iLCJlbWFpbCI6ImFkbWluQGhvdG1haWwuY29tIiwiaWF0IjoxNzI4MjkwNzEzLCJleHAiOjE3Mjg0NjM1MTN9.hbJRnTfL5mqZ7e1w5LPeie7gdBiWSet-qJU6amfyyt0" })
    access_token: string
}