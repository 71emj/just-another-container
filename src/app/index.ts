import { Page2Controller } from './controllers/page-2-controller';
import { Module } from './decorators';
import { Page1Controller } from './controllers/page-1-controller';
import { NavigationService } from './navigation/navigation-service';

@Module({
    declarations: [
        Page2Controller,
        Page1Controller
    ],
    services: [
        NavigationService
    ],
    routers: [{
        url: 'index.html',
        controller: Page1Controller
    }, {
        url: 'page2.html',
        controller: Page2Controller
    }]
})
export class ApplicationEntry {}