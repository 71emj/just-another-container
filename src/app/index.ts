import { NavigationService } from './navigation/navigation-service';
import { Page2Controller } from './controllers/page-2-controller';
import { Module } from './decorators';
import { Page1Controller } from './controllers/page-1-controller';

@Module({
    declarations: [
        NavigationService,
        Page2Controller,
        Page1Controller
    ]
})
export class ApplicationEntry {}