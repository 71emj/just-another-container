import { Service, Bind } from "../decorators";
import { Page1Controller } from "../controllers/page-1-controller";

@Service()
export class NavigationService {

    private readonly PREVIOUS = "previous";
    private readonly URL_HISTORY = "urlHistory";
    private _location: Location = window.location;
    private _session: Storage = window.sessionStorage;
    private _history: History = window.history;
    private _routeHistory: Array<UrlHistory> = [];

    constructor() {}

    get previousPage() {
        const previous = this._session.getItem(this.PREVIOUS);
        return previous || 'NOT SET';
    }

    get urlHistory() {
        if (!this._routeHistory.length) {
            const serializedHistory = this._session.getItem(this.URL_HISTORY)
            this._routeHistory = serializedHistory 
                ? JSON.parse(serializedHistory)
                : [];
        }
        return this._routeHistory;
    }

    set urlHistory(histories: Array<UrlHistory>) {
        this._routeHistory = histories;
        this._serializeHistory();
    }

    @Bind
    public getSubPath(resolution: number): string {
        resolution = resolution || 1;
        const regexp = new RegExp(`(\/[^\/]+){${resolution}}?(\.jsp|html|ftl)$`);
        const path = this.getServeletPath();
        const matched = path.match(regexp);
        return matched 
            ? matched[0].substring(1)
            : path.substring(1);
    }

    @Bind
    public getServeletPath(): string {
        return this._location.pathname;
    }

    public navigate(route: string, state: object): void {
        this._history.replaceState(state, '');
        const currentUrl = this.getSubPath(1);
        if (currentUrl !== route) {
            const pageHistory = {
                url: currentUrl + this._location.search,
                state: this._history.state
            };
            this.urlHistory = [pageHistory, ...this.urlHistory];
            this._history.pushState(state, '', route);
            this._location.reload();
        }
    }

    public returnPreviousPage(route: string) {
        // consolidate history
        const histories = this.urlHistory;
        const index = histories.findIndex(history => history.url === route);
        if (index >= 0) {
            const history = histories[index];
            this.urlHistory = histories.slice(index + 1);
            this._history.replaceState(history.state, '', history.url);
            this._location.reload();
        } else {
            alert("route doesn't exist in history, use navigate");
        }
    }

    private _serializeHistory() {
        const serializedHistory = JSON.stringify(this._routeHistory);
        this._session.setItem(this.URL_HISTORY, serializedHistory);
    }

}

// url history should be provided as separate service
// same as session
export type UrlHistory = {
    url: string;
    state: object;
}