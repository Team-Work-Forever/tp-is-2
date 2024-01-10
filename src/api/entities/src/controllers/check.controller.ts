import { Controller, Get } from "@nestjs/common";

@Controller('health')
export class CheckController {
    
    @Get()
    public check() {
        return {
            status: 'ok'
        }
    }
}